import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { TokenRow } from '../doc-page/types';
import { TokenName } from '../dictionary/dictionary';
import { explode, LAYER_NAMES, type LayerId } from './layers';
import './exploded.css';

interface Point { x: number; y: number }

/** Where a layer's label line starts (its projected right corner) and where the scene needs room, in coordinates of the block. */
interface Layout {
  anchors: Point[];
  rows: Point[];
  /** Extra room on each side of the scene, so the projected stack never spills out of the block. */
  room: { top: number; right: number; bottom: number; left: number };
}

const EMPTY: Layout = { anchors: [], rows: [], room: { top: 0, right: 0, bottom: 0, left: 0 } };
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/**
 * The component taken apart: one inert copy per layer, stacked in an isometric view, bottom to top:
 * its elevation, its surface (the material), its borders, its content and its focus ring. Each copy paints
 * only its own layer, and each layer is labelled with the tokens it reads. The copies are hidden from
 * screen readers; the labels are not, so the layers and their tokens read as a list.
 */
export function Exploded({ render, rows }: { render: ReactNode; rows: readonly TokenRow[] }) {
  const groups = explode(rows);
  const root = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const labels = useRef<(HTMLLIElement | null)[]>([]);
  const [layout, setLayout] = useState<Layout>(EMPTY);
  const [tick, setTick] = useState(0);

  useLayoutEffect(() => {
    const frame = root.current?.getBoundingClientRect();
    if (!frame) return;
    const boxes = layers.current.slice(0, groups.length).map((el) => el?.getBoundingClientRect());
    // The projected layer is a rhombus: its line starts at whichever corner lands furthest right.
    const corners = layers.current.slice(0, groups.length).map((el) =>
      [...(el?.querySelectorAll(':scope > .doc-exploded-corner') ?? [])].map((c) => c.getBoundingClientRect()).reduce<DOMRect | undefined>((best, c) => (!best || c.left > best.left ? c : best), undefined),
    );
    if (boxes.some((box) => !box)) return;
    const all = boxes as DOMRect[];
    const union = {
      top: Math.min(...all.map((b) => b.top)),
      bottom: Math.max(...all.map((b) => b.bottom)),
      left: Math.min(...all.map((b) => b.left)),
      right: Math.max(...all.map((b) => b.right)),
    };
    const anchors = all.map((b, k) => {
      const c = corners[k];
      return c ? { x: c.left - frame.left, y: c.top - frame.top } : { x: b.right - frame.left, y: b.top + b.height / 2 - frame.top };
    });
    const rowsAt = labels.current.slice(0, groups.length).map((el) => {
      const b = el?.getBoundingClientRect();
      return b ? { x: b.left - frame.left, y: b.top + b.height / 2 - frame.top } : { x: 0, y: 0 };
    });
    // The projected stack spills out of the scene's layout box: grow the scene's padding by what still spills, until nothing does.
    const scene = root.current!.querySelector('.doc-exploded-scene')!.getBoundingClientRect();
    const spill = { top: scene.top - union.top, right: union.right - scene.right, bottom: union.bottom - scene.bottom, left: scene.left - union.left };
    const grow = (side: keyof Layout['room']) => layout.room[side] + (spill[side] >= 1 ? Math.ceil(spill[side]) : 0);
    const next = { anchors, rows: rowsAt, room: { top: grow('top'), right: grow('right'), bottom: grow('bottom'), left: grow('left') } };
    setLayout((prev) => (same(prev, next) ? prev : next));
  }, [groups.length, tick, layout.room]);

  // Measure again when the layout moves: size, theme, fonts.
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    const watch = new ResizeObserver(bump);
    if (root.current) watch.observe(root.current);
    const theme = new MutationObserver(bump);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    void document.fonts?.ready.then(bump);
    return () => {
      watch.disconnect();
      theme.disconnect();
    };
  }, []);

  if (groups.length === 0) return null;
  const { room } = layout;

  return (
    <div className="doc-exploded" ref={root}>
      <div className="doc-exploded-scene" aria-hidden="true" style={{ paddingBlock: `${room.top}px ${room.bottom}px`, paddingInline: `${room.left}px ${room.right}px` }}>
        <div className="doc-exploded-stack">
          <div className="doc-exploded-ground" />
          {groups.map(({ layer }, k) => (
            <div
              key={layer}
              ref={(el) => {
                layers.current[k] = el;
              }}
              className={`doc-exploded-layer doc-exploded-layer--${layer}`}
              style={{ '--k': k + 1 } as CSSProperties}
              data-layer={layer}
              inert
            >
              {render}
              {['top-start', 'top-end', 'bottom-start', 'bottom-end'].map((at) => <span key={at} className="doc-exploded-corner" data-at={at} />)}
            </div>
          ))}
        </div>
      </div>
      <ol className="doc-exploded-legend" aria-label="Layers, top to bottom">
        {[...groups].reverse().map(({ layer, rows: tokens }) => {
          const k = groups.findIndex((g) => g.layer === layer);
          return (
            <li
              key={layer}
              ref={(el) => {
                labels.current[k] = el;
              }}
              className="doc-exploded-label"
            >
              <span className="doc-exploded-name">{LAYER_NAMES[layer as LayerId]}</span>
              {tokens.map((token) => (
                <span key={token.name} className="doc-token">
                  {token.swatch && <span className="doc-swatch" style={{ background: `var(${token.swatch})` }} />}
                  <TokenName name={token.name} />
                </span>
              ))}
            </li>
          );
        })}
      </ol>
      <svg className="doc-exploded-leaders" aria-hidden="true">
        {layout.anchors.map((a, k) => {
          const r = layout.rows[k];
          if (!r) return null;
          const bend = r.x - 16;
          return <path key={k} d={`M${a.x} ${a.y}H${Math.max(a.x, bend)}V${r.y}H${r.x}`} />;
        })}
      </svg>
    </div>
  );
}
