import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../../components/clickables/button/button';
import { Tooltip } from '../../components/overlays/tooltip/tooltip';
import { Text } from '../../primitives/text/text';
import '../../primitives/visually-hidden/visually-hidden.css';
import { resolve } from '../rulebook/tokens';
import { series } from '../series/series';
import { corner, leaders, type Point } from './leaders';
import type { Anatomy, AnatomyPart } from '../doc-page/types';
import './anatomy.css';

/** Below `breakpoint.md` the panel drops under the stage and the pins take over from the lines. */
const WIDE = `(min-width: ${resolve('light', '--ds-breakpoint-md')})`;
const STORE = 'doc-anatomy-parts';

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

/** The viewer's choice, kept in localStorage when the browser allows it. */
function useStoredOpen(): [boolean | null, (open: boolean) => void] {
  const [stored, setStored] = useState<boolean | null>(() => {
    try {
      const value = window.localStorage.getItem(STORE);
      return value === null ? null : value === 'open';
    } catch {
      return null;
    }
  });
  const save = (open: boolean) => {
    setStored(open);
    try {
      window.localStorage.setItem(STORE, open ? 'open' : 'closed');
    } catch {
      // Private mode or blocked storage: the choice lasts for this page view only.
    }
  };
  return [stored, save];
}

const sameNumbers = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

interface Measure {
  /** Where each part sits, in coordinates of the whole block. */
  anchors: Record<number, Point>;
  /** The top-left corner of the rendered component, in the same coordinates. */
  origin: Point;
  height: number;
}

export function Stage({ anatomy }: { anatomy: Anatomy }) {
  const { render } = anatomy;
  const parts = useMemo(() => [...anatomy.parts].sort((a, b) => a.n - b.n), [anatomy.parts]);
  const wide = useMedia(WIDE);
  const [stored, save] = useStoredOpen();
  const open = stored ?? wide;
  const lines = open && wide;
  const [active, setActive] = useState<number | null>(null);
  const [measure, setMeasure] = useState<Measure>({ anchors: {}, origin: { x: 0, y: 0 }, height: 0 });
  const [paths, setPaths] = useState<Record<number, string>>({});
  const [tick, setTick] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const rows = useRef(new Map<number, HTMLElement>());
  const fallback = useRef(new Map<number, HTMLElement>());
  const bodyId = useId();

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
      const point = part.target ? corner(el.getBoundingClientRect(), part.at) : corner(el.getBoundingClientRect());
      anchors[part.n] = { x: point.x - frame.left, y: point.y - frame.top };
    }
    const own = box.getBoundingClientRect();
    const next = { anchors, origin: { x: own.left - frame.left, y: own.top - frame.top }, height: own.height };
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
    const scroller = stage.current;
    scroller?.addEventListener('scroll', bump);
    settle?.addEventListener('animationend', bump);
    settle?.addEventListener('transitionend', bump);
    return () => {
      scroller?.removeEventListener('scroll', bump);
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
        data-at={part.at ?? 'center'}
        aria-hidden="true"
        onMouseEnter={() => setActive(part.n)}
        onMouseLeave={() => setActive(null)}
      />
    ) : (
      <Tooltip key={part.n} content={label(part)} placement="top">
        <button type="button" ref={ref as (el: HTMLButtonElement | null) => void} className="ds-series doc-pin" style={{ ...style, ...series(part.n) }} data-part={part.n} data-target={part.target} data-at={part.at ?? 'center'} aria-label={`Part ${part.n}`}>
          {part.n}
        </button>
      </Tooltip>
    );

  return (
    <div className="doc-anatomy" ref={root} data-wide={wide || undefined} data-open={open || undefined}>
      <div className="doc-stage" ref={stage} style={{ minBlockSize: measure.height ? `${measure.height * 1.5}px` : undefined }}>
        <div className="doc-stage-inner" ref={inner}>
          {render}
          {parts.filter((part) => part.target && measure.anchors[part.n]).map((part) => pin(part, { left: measure.anchors[part.n].x - measure.origin.x, top: measure.anchors[part.n].y - measure.origin.y }))}
          {parts.filter((part) => !part.target).map((part) => pin(part, { left: part.x, top: part.y }, (el) => {
              if (el) fallback.current.set(part.n, el);
              else fallback.current.delete(part.n);
            }))}
        </div>
      </div>
      <aside className="doc-parts" data-open={open || undefined}>
        <div className="doc-parts-head">
          <Text variant="heading" as="h3" className="doc-h3">Parts</Text>
          <Button variant="secondary" aria-expanded={open} aria-controls={bodyId} onClick={() => save(!open)}>
            {open ? 'Hide parts' : 'Show parts'}
          </Button>
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
      {lines && (
        <svg className="doc-leaders" aria-hidden="true">
          {order.filter((n) => paths[n]).map((n) => (
            <path key={n} d={paths[n]} className={`ds-series${active === n ? ' is-active' : ''}`} data-part={n} style={series(n)} />
          ))}
        </svg>
      )}
    </div>
  );
}
