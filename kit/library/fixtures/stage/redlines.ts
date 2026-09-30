import type { SpecProperty } from '../doc-page/types';
import type { Point } from './leaders';

/** A box in coordinates of the stage. */
export interface Box { x: number; y: number; w: number; h: number }

/** What the stage reads from one target: its border box, its computed style in px, and its children's boxes. */
export interface Probe {
  box: Box;
  padding: { top: number; right: number; bottom: number; left: number };
  margin: { top: number; right: number; bottom: number; left: number };
  border: { top: number; right: number; bottom: number; left: number };
  gap: { row: number; column: number };
  /** In px; NaN for a percentage. */
  radius: number;
  /** `row` when the children sit side by side. */
  axis: 'row' | 'column';
  children: readonly Box[];
}

/** A straight stroke, from a to b. */
export interface Line { a: Point; b: Point }

/** A value written on a bar. `vertical` text is turned a quarter, so it runs along a vertical bar. */
export interface Tag extends Point {
  vertical: boolean;
  text: string;
  /** Which way is away from the component: +1 right or down, -1 left or up. The name's line goes that way. */
  out: 1 | -1;
}

/** What the specs layer draws for one spec. Everything sits outside the component; only the wireframe goes inside. */
export interface Mark {
  /** The measured values in px: one, or start and end when the two sides differ. */
  values: readonly number[];
  /** Dimension bars with their end ticks. */
  lines: readonly Line[];
  /** Dotted extension lines from the component's edges to the ends of a bar. */
  links: readonly Line[];
  /** The areas measured, inside the component. The wireframe draws them; the hover highlight reuses them. */
  bands: readonly Box[];
  tags: readonly Tag[];
}

/** The side of the component a spec's bar sits on. */
export type Side = 'left' | 'right' | 'top' | 'bottom';

/**
 * How far the first bar sits from the box, in px. It clears the anatomy's anchors,
 * which sit OUTSET (12) outside the box, and their dots.
 */
export const OFFSET = 32;
/** The distance between two stacked bars on one side, in px: room for a bar, its value and its name on a second line. */
export const LANE = 28;
/** The distance between the value's line and the name's line, in px. */
export const LINE = 11;
/** Half the length of the tick across each end of a bar, in px. */
export const TICK = 3;
/** How far a value sits beyond its bar, away from the component, so a short bar's ticks never touch its digits, in px. */
export const TAG_GAP = 8;

const mid = (box: Box): Point => ({ x: box.x + box.w / 2, y: box.y + box.h / 2 });
const round = (n: number) => Math.round(n * 100) / 100;

/** Values of both sides: one number when they match. */
const pair = (start: number, end: number) => (start === end ? [start] : [start, end]);

/** Height and radius left, block padding right, the rest below. A column gap goes right, a row gap below. */
export function sideOf(property: SpecProperty, axis: Probe['axis']): Side {
  if (property === 'height' || property === 'radius') return 'left';
  if (property === 'padding-block') return 'right';
  if (property === 'gap') return axis === 'row' ? 'bottom' : 'right';
  return 'bottom';
}

/** A vertical bar at x from y1 to y2, a tick across each end, dotted links from the component's edge `from`, and its value along it. */
function barV(x: number, y1: number, y2: number, from: number, text: string) {
  const out: 1 | -1 = x < from ? -1 : 1;
  return {
    lines: [{ a: { x, y: y1 }, b: { x, y: y2 } }, { a: { x: x - TICK, y: y1 }, b: { x: x + TICK, y: y1 } }, { a: { x: x - TICK, y: y2 }, b: { x: x + TICK, y: y2 } }],
    links: [y1, y2].map((y) => ({ a: { x: from, y }, b: { x: x + out * TICK, y } })),
    tag: { x: x + out * TAG_GAP, y: (y1 + y2) / 2, vertical: true, text, out },
  };
}

/** A horizontal bar at y from x1 to x2, a tick across each end, dotted links from the component's edge `from`, and its value on it. */
function barH(y: number, x1: number, x2: number, from: number, text: string) {
  const out: 1 | -1 = y < from ? -1 : 1;
  return {
    lines: [{ a: { x: x1, y }, b: { x: x2, y } }, { a: { x: x1, y: y - TICK }, b: { x: x1, y: y + TICK } }, { a: { x: x2, y: y - TICK }, b: { x: x2, y: y + TICK } }],
    links: [x1, x2].map((x) => ({ a: { x, y: from }, b: { x, y: y + out * TICK } })),
    tag: { x: (x1 + x2) / 2, y: y + out * TAG_GAP, vertical: false, text, out },
  };
}

type Bar = ReturnType<typeof barV>;

const join = (values: readonly number[], bands: readonly Box[], bars: readonly Bar[]): Mark => ({
  values,
  bands,
  lines: bars.flatMap((bar) => bar.lines),
  links: bars.flatMap((bar) => bar.links),
  tags: bars.map((bar) => bar.tag),
});

const none = (): Mark => ({ values: [], lines: [], links: [], bands: [], tags: [] });

/** The areas between the children along the axis: the gaps. */
function gaps({ box, border: b, axis, children }: Probe): Box[] {
  const row = axis === 'row';
  const kids = [...children].sort((m, n) => (row ? m.x - n.x : m.y - n.y));
  return kids.slice(1).flatMap((kid, k) => {
    const prev = kids[k];
    const size = row ? kid.x - (prev.x + prev.w) : kid.y - (prev.y + prev.h);
    if (size <= 0) return [];
    return [row ? { x: prev.x + prev.w, y: box.y + b.top, w: size, h: box.h - b.top - b.bottom } : { x: box.x + b.left, y: prev.y + prev.h, w: box.w - b.left - b.right, h: size }];
  });
}

/**
 * The mark of one spec. Its bar sits on `sideOf` the whole rendered component (`frame`), OFFSET out, then LANE further
 * per `lane`: the index of the spec among those on the same side. So a bar never lands on another part of the component,
 * such as a field's label above its input; dotted links reach it from the measured element's edges.
 * Nothing is drawn over the component but the wireframe.
 * ponytail: padding sides are physical (left, right), so a right-to-left render reads them swapped. Use logical sides if a story renders RTL.
 */
export function mark(property: SpecProperty, probe: Probe, lane = 0, frame: Box = probe.box): Mark {
  const { box, padding: p, border: b } = probe;
  const offset = OFFSET + LANE * lane;
  const left = Math.min(frame.x, box.x) - offset;
  const right = Math.max(frame.x + frame.w, box.x + box.w) + offset;
  const bottom = Math.max(frame.y + frame.h, box.y + box.h) + offset;
  const edge = { left: box.x, right: box.x + box.w, top: box.y, bottom: box.y + box.h };
  const n = (v: number) => String(round(v));
  switch (property) {
    case 'height':
      return join([round(box.h)], [], [barV(left, box.y, box.y + box.h, edge.left, n(box.h))]);
    case 'width':
      return join([round(box.w)], [], [barH(bottom, box.x, box.x + box.w, edge.bottom, n(box.w))]);
    case 'padding-inline': {
      const inner = { y: box.y + b.top, h: box.h - b.top - b.bottom };
      const bands = [{ x: box.x + b.left, w: p.left, ...inner }, { x: box.x + box.w - b.right - p.right, w: p.right, ...inner }];
      return join(pair(p.left, p.right), bands, bands.map((band, k) => barH(bottom, band.x, band.x + band.w, edge.bottom, n(k ? p.right : p.left))));
    }
    case 'padding-block': {
      const inner = { x: box.x + b.left, w: box.w - b.left - b.right };
      const bands = [{ y: box.y + b.top, h: p.top, ...inner }, { y: box.y + box.h - b.bottom - p.bottom, h: p.bottom, ...inner }];
      return join(pair(p.top, p.bottom), bands, bands.map((band, k) => barV(right, band.y, band.y + band.h, edge.right, n(k ? p.bottom : p.top))));
    }
    case 'gap': {
      const row = probe.axis === 'row';
      const bands = gaps(probe);
      const value = row ? probe.gap.column : probe.gap.row;
      return join([round(value)], bands, bands.map((band) => (row ? barH(bottom, band.x, band.x + band.w, edge.bottom, n(value)) : barV(right, band.y, band.y + band.h, edge.right, n(value)))));
    }
    case 'radius': {
      // A percentage radius has no px value to compare: no mark.
      if (!Number.isFinite(probe.radius)) return none();
      // A dotted link runs left from where the left edge leaves the curve, to a tick and the value beyond it.
      const y = box.y + Math.min(probe.radius, box.w / 2, box.h / 2);
      return {
        values: [round(probe.radius)],
        bands: [],
        lines: [{ a: { x: left, y: y - TICK }, b: { x: left, y: y + TICK } }],
        links: [{ a: { x: box.x, y }, b: { x: left, y } }],
        tags: [{ x: left - TAG_GAP, y, vertical: true, text: n(probe.radius), out: -1 }],
      };
    }
  }
}

/** How far the bars reach beyond the component on a side holding `lanes` of them, in px: the last bar, its value and its name. */
export const reach = (lanes: number): number => (lanes ? OFFSET + LANE * (lanes - 1) + TAG_GAP + LINE + TAG_GAP : 0);

/** The box model of one target, as a wireframe: the margin and padding rings as bands, and the content box. */
export interface Wireframe {
  margin: readonly Box[];
  padding: readonly Box[];
  content: Box;
}

/** The four bands between an outer box and an inner box inset by `t r b l`: top and bottom full width, the sides between them. */
function ring(outer: Box, t: number, r: number, b: number, l: number): Box[] {
  const sides = [
    { x: outer.x, y: outer.y, w: outer.w, h: t },
    { x: outer.x, y: outer.y + outer.h - b, w: outer.w, h: b },
    { x: outer.x, y: outer.y + t, w: l, h: outer.h - t - b },
    { x: outer.x + outer.w - r, y: outer.y + t, w: r, h: outer.h - t - b },
  ];
  return sides.filter((side) => side.w > 0 && side.h > 0);
}

export function wireframe({ box, margin: m, border: b, padding: p }: Probe): Wireframe {
  const outer = { x: box.x - m.left, y: box.y - m.top, w: box.w + m.left + m.right, h: box.h + m.top + m.bottom };
  const inside = { x: box.x + b.left, y: box.y + b.top, w: box.w - b.left - b.right, h: box.h - b.top - b.bottom };
  const content = { x: inside.x + p.left, y: inside.y + p.top, w: inside.w - p.left - p.right, h: inside.h - p.top - p.bottom };
  return { margin: ring(outer, m.top, m.right, m.bottom, m.left), padding: ring(inside, p.top, p.right, p.bottom, p.left), content };
}

/** A token value in px, from px or rem (`rem` is the root font size in px), or undefined for anything else (`var()` left unresolved, a keyword). */
export function px(value: string | undefined, rem = 16): number | undefined {
  const match = /^\s*(-?[\d.]+)(px|rem)\s*$/.exec(value ?? '');
  if (!match) return undefined;
  return match[2] === 'rem' ? Number(match[1]) * rem : Number(match[1]);
}

/** `true` when every measured value equals the token, `false` on drift, `undefined` when there is nothing to compare. */
export function matches(values: readonly number[], token: number | undefined): boolean | undefined {
  if (token === undefined || values.length === 0) return undefined;
  return values.every((v) => Math.abs(v - token) < 0.5);
}

/** `size.target.min` to `--ds-size-target-min`. */
export const cssName = (token: string) => `--ds-${token.replaceAll('.', '-')}`;

/** 16, or 16 / 12 when the two sides differ. */
export const formatValues = (values: readonly number[]) => values.map((v) => `${v}px`).join(' / ');
