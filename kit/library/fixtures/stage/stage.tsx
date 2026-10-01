import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Tooltip } from '../../components/overlays/tooltip/tooltip';
import { Text } from '../../primitives/text/text';
import '../../primitives/visually-hidden/visually-hidden.css';
import { resolve } from '../rulebook/tokens';
import { series } from '../series/series';
import { corner, leaders, type Point } from './leaders';
import type { AnatomyPart, Spec, StageSpec, TokenRow } from '../doc-page/types';
import { Exploded } from '../exploded/exploded';
import { explode } from '../exploded/layers';
import { Segmented } from '../segmented/segmented';
import { roomFor, SpecsOverlay, SpecsTable, useMeasured } from './specs-layer';
import './stage.css';

/** Below `breakpoint.md` the panel drops under the stage and the pins take over from the lines. */
const WIDE = `(min-width: ${resolve('light', '--ds-breakpoint-md')})`;
const STORE = 'doc-stage-layer';

function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    list.addEventListener('change', update);
    update();
    return () => list.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** Which view the stage shows: one at a time, so the anatomy and the redlines never cross. Tokens shows the component exploded. */
export type Layer = 'anatomy' | 'specs' | 'tokens';
const LAYER_LABELS: Record<Layer, string> = { anatomy: 'Anatomy', specs: 'Specs', tokens: 'Tokens' };
const isLayer = (value: string | null): value is Layer => value === 'anatomy' || value === 'specs' || value === 'tokens';

/** The viewer's choice, kept in localStorage when the browser allows it. */
function useStoredLayer(): [Layer, (layer: Layer) => void] {
  const [layer, setLayer] = useState<Layer>(() => {
    try {
      const value = window.localStorage.getItem(STORE);
      return isLayer(value) ? value : 'anatomy';
    } catch {
      return 'anatomy';
    }
  });
  const save = (next: Layer) => {
    setLayer(next);
    try {
      window.localStorage.setItem(STORE, next);
    } catch {
      // Private mode or blocked storage: the choice lasts for this page view only.
    }
  };
  return [layer, save];
}

const sameNumbers = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** A box of text on the stage, in coordinates of the whole block. */
interface Hole { x: number; y: number; w: number; h: number }

/** The gap kept between a leader line and the glyphs it passes, in px. */
const HALO = 2;

/** The line boxes of every visible text and icon in `box`, except the markers themselves. */
function textHoles(box: HTMLElement, frame: DOMRect): Hole[] {
  const holes: Hole[] = [];
  const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim() || node.parentElement?.closest('.doc-pin, .doc-dot, .doc-redlines, .ds-visually-hidden')) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    // jsdom has no layout: its Range has no rects.
    for (const r of range.getClientRects?.() ?? []) {
      // A visually hidden text is a 1px box: it has nothing to protect.
      if (r.width > 2 && r.height > 2) holes.push({ x: r.left - frame.left - HALO, y: r.top - frame.top - HALO, w: r.width + 2 * HALO, h: r.height + 2 * HALO });
    }
  }
  // Icons are drawn glyphs: the line breaks around them too.
  for (const icon of box.querySelectorAll('svg:not(.doc-redlines)')) {
    const r = icon.getBoundingClientRect();
    if (r.width > 2 && r.height > 2) holes.push({ x: r.left - frame.left - HALO, y: r.top - frame.top - HALO, w: r.width + 2 * HALO, h: r.height + 2 * HALO });
  }
  return holes;
}

interface Measure {
  /** Where each part sits, in coordinates of the whole block. */
  anchors: Record<number, Point>;
  /** Where the component's text sits. Leader lines break around it. */
  holes: Hole[];
  /** The top-left corner of the rendered component, in the same coordinates. */
  origin: Point;
  height: number;
}

const NO_SPECS: readonly Spec[] = [];
const NO_TOKENS: readonly TokenRow[] = [];

/**
 * The component drawn once, with two layers the viewer switches between: the anatomy (numbered parts, leader lines,
 * the parts panel) and the specs (measured redlines and the specs table). The hidden layer's list or table stays for screen readers.
 */
export function Stage({ stage, specs = NO_SPECS, tokens = NO_TOKENS }: { stage: StageSpec & { render: ReactNode }; specs?: readonly Spec[]; tokens?: readonly TokenRow[] }) {
  const { render } = stage;
  const parts = useMemo(() => [...stage.parts].sort((a, b) => a.n - b.n), [stage.parts]);
  const wide = useMedia(WIDE);
  const [stored, save] = useStoredLayer();
  const hasAnatomy = parts.length > 0;
  const hasRedlines = specs.some((spec) => spec.property);
  const hasTokens = explode(tokens).length > 0;
  // The switch lists the views this page has; with one, there is no switch, and a stored view the page lacks falls back to the first.
  const views = (['anatomy', 'specs', 'tokens'] as const).filter((v) => ({ anatomy: hasAnatomy, specs: hasRedlines, tokens: hasTokens })[v]);
  const both = views.length > 1;
  const layer: Layer = views.includes(stored) ? stored : (views[0] ?? 'anatomy');
  const open = hasAnatomy && layer === 'anatomy';
  const lines = open && wide;
  const redlines = hasRedlines && layer === 'specs';
  const [active, setActive] = useState<number | null>(null);
  const [activeSpec, setActiveSpec] = useState<number | null>(null);
  const [measure, setMeasure] = useState<Measure>({ anchors: {}, holes: [], origin: { x: 0, y: 0 }, height: 0 });
  const [paths, setPaths] = useState<Record<number, string>>({});
  const [tick, setTick] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const rows = useRef(new Map<number, HTMLElement>());
  const fallback = useRef(new Map<number, HTMLElement>());
  const bodyId = useId();
  const maskId = `${useId().replace(/:/g, '')}-leaders`;
  const measured = useMeasured(specs, inner, tick);
  // The tallest the views have been: every view keeps that height, so switching never makes the page jump.
  const view = useRef<HTMLDivElement>(null);
  const [tallest, setTallest] = useState(0);
  useEffect(() => {
    const el = view.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const watch = new ResizeObserver(() => setTallest((most) => Math.max(most, Math.ceil(el.scrollHeight))));
    watch.observe(el);
    for (const child of el.children) watch.observe(child);
    return () => watch.disconnect();
  }, [layer]);

  // Rows follow the anchors from top to bottom, so the lines never cross.
  const order = useMemo(
    () => [...parts].sort((a, b) => (measure.anchors[a.n]?.y ?? 0) - (measure.anchors[b.n]?.y ?? 0) || (measure.anchors[a.n]?.x ?? 0) - (measure.anchors[b.n]?.x ?? 0)).map((part) => part.n),
    [parts, measure],
  );

  // Anchors: the box of each target, or the fallback pin, in coordinates of the whole block.
  useLayoutEffect(() => {
    const frame = root.current?.getBoundingClientRect();
    const box = inner.current;
    if (!frame || !box) return;
    const anchors: Record<number, Point> = {};
    for (const part of parts) {
      const el = part.target ? box.querySelector(part.target) : fallback.current.get(part.n);
      if (!el) continue;
      const point = part.target ? corner(el.getBoundingClientRect(), part.at) : corner(el.getBoundingClientRect(), 'center');
      anchors[part.n] = { x: point.x - frame.left, y: point.y - frame.top };
    }
    const own = box.getBoundingClientRect();
    const next = { anchors, holes: textHoles(box, frame), origin: { x: own.left - frame.left, y: own.top - frame.top }, height: own.height };
    setMeasure((prev) => (sameNumbers(prev, next) ? prev : next));
  }, [parts, tick, open, wide, render]);

  // Lines: from each anchor to the left edge of its row.
  useLayoutEffect(() => {
    const frame = root.current?.getBoundingClientRect();
    if (!frame || !lines) {
      setPaths((prev) => (Object.keys(prev).length ? {} : prev));
      return;
    }
    const ends: Record<number, Point> = {};
    for (const [n, el] of rows.current) {
      const box = el.getBoundingClientRect();
      ends[n] = { x: box.left - frame.left, y: box.top + box.height / 2 - frame.top };
    }
    const next = leaders(measure.anchors, ends, order);
    setPaths((prev) => (sameNumbers(prev, next) ? prev : next));
  }, [measure, order, lines, tick]);

  // A new render (an API control changed) moves the parts without always resizing the stage: measure again.
  useLayoutEffect(() => setTick((t) => t + 1), [render]);

  // Measure again when the layout moves: size, theme, fonts.
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    const watch = new ResizeObserver(bump);
    if (root.current) watch.observe(root.current);
    if (inner.current) watch.observe(inner.current);
    const theme = new MutationObserver(bump);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    void document.fonts.ready.then(bump);
    // A part that moves while it enters (a reveal, a slide) has its final box only once the motion ends.
    const settle = inner.current;
    const scrolling = scroller.current;
    scrolling?.addEventListener('scroll', bump);
    settle?.addEventListener('animationend', bump);
    settle?.addEventListener('transitionend', bump);
    return () => {
      scrolling?.removeEventListener('scroll', bump);
      settle?.removeEventListener('animationend', bump);
      settle?.removeEventListener('transitionend', bump);
      watch.disconnect();
      theme.disconnect();
    };
  }, []);

  const label = (part: AnatomyPart) => (part.note ? `${part.label} · ${part.note}` : part.label);

  const pin = (part: AnatomyPart, style: CSSProperties, ref?: (el: HTMLElement | null) => void): ReactNode =>
    lines ? (
      <span
        key={part.n}
        ref={ref}
        className={`ds-series doc-dot${active === part.n ? ' is-active' : ''}`}
        style={{ ...style, ...series(part.n) }}
        data-part={part.n}
        data-target={part.target}
        data-at={part.at ?? 'start'}
        aria-hidden="true"
        onMouseEnter={() => setActive(part.n)}
        onMouseLeave={() => setActive(null)}
      />
    ) : (
      <Tooltip key={part.n} content={label(part)} placement="top">
        <button type="button" ref={ref as (el: HTMLButtonElement | null) => void} className="ds-series doc-pin" style={{ ...style, ...series(part.n) }} data-part={part.n} data-target={part.target} data-at={part.at ?? 'start'} aria-label={`Part ${part.n}`}>
          {part.n}
        </button>
      </Tooltip>
    );

  return (
    <div className="doc-stage-block">
    {both && (
      <Segmented label="Layer" options={views.map((value) => ({ value, label: LAYER_LABELS[value] }))} value={layer} onChange={save} />
    )}
    <div className="doc-stage-view" ref={view} style={{ minBlockSize: tallest || undefined }}>
    {layer === 'tokens' && <Exploded render={render} rows={tokens} />}
    {/* Hidden, not unmounted, while the tokens show: the anatomy and the specs keep their measures, so switching back is instant. */}
    <div className="doc-anatomy" ref={root} hidden={layer === 'tokens'} data-wide={wide || undefined} data-parts={hasAnatomy || undefined} data-open={open || undefined}>
      <div className="doc-stage" ref={scroller} style={{ minBlockSize: `max(50vh, ${measure.height * 1.5}px)` }}>
        <div className="doc-stage-inner" ref={inner} style={roomFor(measured)}>
          {render}
          {open && parts.filter((part) => part.target && measure.anchors[part.n]).map((part) => pin(part, { left: measure.anchors[part.n].x - measure.origin.x, top: measure.anchors[part.n].y - measure.origin.y }))}
          {open && parts.filter((part) => !part.target).map((part) => pin(part, { left: part.x, top: part.y }, (el) => {
              if (el) fallback.current.set(part.n, el);
              else fallback.current.delete(part.n);
            }))}
          {redlines && <SpecsOverlay measured={measured} active={activeSpec} />}
        </div>
      </div>
      {hasAnatomy && (
      <aside className="doc-parts" data-open={open || undefined}>
        <div className={open ? 'doc-parts-head' : 'doc-parts-head ds-visually-hidden'}>
          <Text variant="heading" as="h3" className="doc-h3">Parts</Text>
        </div>
        <div id={bodyId} className={open ? 'doc-parts-body' : 'doc-parts-body ds-visually-hidden'}>
          <ol className="doc-parts-list">
            {order.map((n) => {
              const part = parts.find((p) => p.n === n)!;
              return (
                <li
                  key={n}
                  ref={(el) => {
                    if (el) rows.current.set(n, el);
                    else rows.current.delete(n);
                  }}
                  className={`ds-series doc-part${active === n ? ' is-active' : ''}`}
                  data-part={n}
                  style={series(n)}
                  tabIndex={open ? 0 : undefined}
                  onMouseEnter={() => setActive(n)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(n)}
                  onBlur={() => setActive(null)}
                >
                  <span className="doc-legend-num" aria-hidden="true">{n}</span>
                  <span>
                    <span className="doc-legend-label">{part.label}</span>
                    {part.note && <span className="doc-muted">{` · ${part.note}`}</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>
      )}
      {lines && (
        <svg className="doc-leaders" aria-hidden="true">
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000">
              <rect x="-10000" y="-10000" width="20000" height="20000" fill="white" />
              {measure.holes.map((hole, k) => <rect key={k} x={hole.x} y={hole.y} width={hole.w} height={hole.h} fill="black" />)}
            </mask>
          </defs>
          {order.filter((n) => paths[n]).map((n) => (
            <path key={n} d={paths[n]} mask={`url(#${maskId})`} className={`ds-series${active === n ? ' is-active' : ''}`} data-part={n} style={series(n)} />
          ))}
        </svg>
      )}
    </div>
    </div>
    <SpecsTable specs={specs} measured={measured} active={activeSpec} onActive={setActiveSpec} hidden={!redlines} />
    </div>
  );
}
