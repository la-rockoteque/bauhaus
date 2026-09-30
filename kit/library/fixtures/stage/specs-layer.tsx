import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { Text } from '../../primitives/text/text';
import { TokenName } from '../dictionary/dictionary';
import { resolve } from '../rulebook/tokens';
import { TableScroll } from '../doc-page/table-scroll';
import type { Spec } from '../doc-page/types';
import { cssName, formatValues, LINE, mark, matches, px, reach, sideOf, wireframe, type Box, type Mark, type Probe, type Side, type Wireframe } from './redlines';

/** A measured spec with its number in the series, its mark and the token's own value. */
export interface Measured {
  /** The spec's position among the measured ones: links a table row to its redline on hover. */
  n: number;
  spec: Spec;
  mark: Mark;
  /** The box model of the spec's target. */
  wire: Wireframe;
  /** The side its bar sits on, and its lane there. */
  side: Side;
  lane: number;
  token?: number;
}

const num = (value: string) => parseFloat(value) || 0;

function relative(rect: DOMRect, origin: DOMRect): Box {
  return { x: rect.left - origin.left, y: rect.top - origin.top, w: rect.width, h: rect.height };
}

/** True when the first two children share a line: their vertical spans overlap. */
function sideBySide(children: readonly Box[]): boolean {
  const [a, b] = children;
  return Boolean(a && b) && a.y < b.y + b.h && b.y < a.y + a.h;
}

/** Everything `mark` needs, read from the live element. */
function probe(el: Element, origin: DOMRect): Probe {
  const style = getComputedStyle(el);
  const children = [...el.children].map((child) => relative(child.getBoundingClientRect(), origin)).filter((box) => box.w > 0 || box.h > 0);
  return {
    box: relative(el.getBoundingClientRect(), origin),
    padding: { top: num(style.paddingTop), right: num(style.paddingRight), bottom: num(style.paddingBottom), left: num(style.paddingLeft) },
    margin: { top: num(style.marginTop), right: num(style.marginRight), bottom: num(style.marginBottom), left: num(style.marginLeft) },
    border: { top: num(style.borderTopWidth), right: num(style.borderRightWidth), bottom: num(style.borderBottomWidth), left: num(style.borderLeftWidth) },
    gap: { row: num(style.rowGap), column: num(style.columnGap) },
    radius: style.borderTopLeftRadius.endsWith('%') ? NaN : num(style.borderTopLeftRadius),
    axis: sideBySide(children) ? 'row' : 'column',
    children,
  };
}

/** The token's value in px: the browser's computed value on the element, or the generated tokens when the browser leaves it unresolved (jsdom). */
function tokenPx(el: Element, token: string): number | undefined {
  const name = cssName(token);
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || undefined;
  return px(getComputedStyle(el).getPropertyValue(name), rem) ?? px(resolve(document.documentElement.dataset.theme ?? '', name), rem);
}

/** Measures every spec that names a property, on each layout change (`tick`). */
export function useMeasured(specs: readonly Spec[], inner: RefObject<HTMLElement | null>, tick: number): Measured[] {
  const [measured, setMeasured] = useState<Measured[]>([]);
  useLayoutEffect(() => {
    const box = inner.current;
    if (!box) return;
    const origin = box.getBoundingClientRect();
    // The whole rendered component: bars sit outside it, not just outside the measured element.
    const frame = box.firstElementChild ? relative(box.firstElementChild.getBoundingClientRect(), origin) : undefined;
    const lanes = new Map<string, number>();
    const next: Measured[] = [];
    specs.forEach((spec) => {
      if (!spec.property) return;
      const el = spec.target ? box.querySelector(spec.target) : box.firstElementChild;
      if (!el) return;
      const read = probe(el, origin);
      // Bars that share a side stack outward, one lane each.
      const side = sideOf(spec.property, read.axis);
      const lane = lanes.get(side) ?? 0;
      lanes.set(side, lane + 1);
      next.push({ n: next.length + 1, spec, side, lane, mark: mark(spec.property, read, lane, frame), wire: wireframe(read), token: spec.token ? tokenPx(el, spec.token) : undefined });
    });
    setMeasured((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [specs, inner, tick]);
  return measured;
}

/** The room each side of the component needs for its bars, as a margin. Kept in both layers, so switching never moves the component. */
export function roomFor(measured: readonly Measured[]): { marginTop: number; marginRight: number; marginBottom: number; marginLeft: number } {
  const lanes = (side: Side) => measured.filter((m) => m.side === side).reduce((most, m) => Math.max(most, m.lane + 1), 0);
  return { marginTop: reach(lanes('top')), marginRight: reach(lanes('right')), marginBottom: reach(lanes('bottom')), marginLeft: reach(lanes('left')) };
}

/**
 * The redlines, drawn over the rendered component in its own coordinates: one matte red for every spec,
 * each value written small on its line or band. A value on a vertical line turns to run along it.
 */
export function SpecsOverlay({ measured, active }: { measured: readonly Measured[]; active: number | null }) {
  // One wireframe per target, under every redline.
  const wires = [...new Map(measured.map((m) => [m.spec.target ?? '', m.wire])).values()];
  const rect = (b: Box, k: number) => <rect key={k} x={b.x} y={b.y} width={b.w} height={b.h} />;
  return (
    <svg className="doc-redlines" aria-hidden="true">
      {wires.map((w, k) => (
        <g key={`w${k}`} className="doc-wire">
          <g className="doc-wire-margin">{w.margin.map(rect)}</g>
          <g className="doc-wire-padding">{w.padding.map(rect)}</g>
          {rect(w.content, -1)}
        </g>
      ))}
      {measured.map(({ n, spec, mark: m }) => (
        <g key={n} className={active === n ? 'doc-redline is-active' : 'doc-redline'} data-spec={n}>
          {m.links.map((l, k) => <line key={`l${k}`} className="doc-redline-link" x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} />)}
          {m.lines.map((l, k) => <line key={k} x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} />)}
          {m.tags.map((tag, k) => {
            // The value sits beside its bar; the first one has the spec's name on a second line, further out.
            // A vertical tag is turned a quarter: its second line moves across the screen, not down.
            const turn = (x: number, y: number) => (tag.vertical ? `rotate(-90 ${x} ${y})` : undefined);
            const name = { x: tag.vertical ? tag.x + tag.out * LINE : tag.x, y: tag.vertical ? tag.y : tag.y + tag.out * LINE };
            return (
              <g key={`t${k}`}>
                <text x={tag.x} y={tag.y} transform={turn(tag.x, tag.y)}>{tag.text}</text>
                {k === 0 && <text className="doc-redline-name" x={name.x} y={name.y} transform={turn(name.x, name.y)}>{spec.label}</text>}
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

function Check({ values, token }: { values: readonly number[]; token?: number }) {
  const ok = matches(values, token);
  if (ok === undefined) return null;
  return ok ? <span className="doc-spec-ok">matches</span> : <span className="doc-spec-drift">{`drift: token is ${token}px`}</span>;
}

/** The specs table: measured rows first, with their token and live value, then the text rows. Hovering a row marks its redline. */
export function SpecsTable({ specs, measured, active, onActive, hidden }: { specs: readonly Spec[]; measured: readonly Measured[]; active: number | null; onActive: (n: number | null) => void; hidden: boolean }) {
  const text = specs.filter((spec) => !spec.property);
  if (!measured.length && !text.length) return null;
  return (
    <div className={hidden ? 'ds-visually-hidden' : 'doc-specs'}>
      <Text variant="heading" as="h3" className="doc-h3">Specs</Text>
      <TableScroll label="Specs">
        {/* Text rows alone keep the two-column layout: no header, no empty columns. */}
        <table className={measured.length ? 'doc-table doc-table-specs' : 'doc-table doc-table-rows'}>
          {measured.length > 0 && (
            <thead>
              <tr><th scope="col">Spec</th><th scope="col">Token</th><th scope="col">Measured</th><th scope="col">Note</th></tr>
            </thead>
          )}
          <tbody>
            {measured.map(({ n, spec, mark: m, token }) => (
              <tr key={`m${n}`} className={`doc-spec-row${active === n ? ' is-active' : ''}`} data-spec={n} onMouseEnter={() => onActive(n)} onMouseLeave={() => onActive(null)}>
                <th scope="row">{spec.label}</th>
                <td>{spec.token && <TokenName name={spec.token} />}</td>
                <td>{formatValues(m.values)} <Check values={m.values} token={token} /></td>
                <td>{spec.value}</td>
              </tr>
            ))}
            {text.map((spec) => (
              <tr key={spec.label}>
                <th scope="row">{spec.label}</th>
                <td colSpan={measured.length ? 3 : undefined}>{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </div>
  );
}
