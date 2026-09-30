import type { AnatomyAt } from '../doc-page/types';

export type Point = { x: number; y: number };

/** How far `start` and `end` sit outside the box, in px: the radius of a pin plus a small gap, so no marker touches the edge it names. */
export const OUTSET = 12;

/**
 * The anchor point on a box, always just outside it, `outset` px away, so a marker never covers what it names.
 * `start` and `end` are the middle of the left or right edge. A corner is diagonally outside that corner.
 * `center` is the middle of the box: only for a large box such as an input or a card, never for text.
 */
export function corner(box: Pick<DOMRect, 'left' | 'top' | 'right' | 'bottom' | 'width' | 'height'>, at: AnatomyAt = 'start', outset = OUTSET): Point {
  const middle = box.top + box.height / 2;
  if (at === 'center') return { x: box.left + box.width / 2, y: middle };
  if (at === 'start') return { x: box.left - outset, y: middle };
  if (at === 'end') return { x: box.right + outset, y: middle };
  const [block, inline] = at.split('-');
  return { x: inline === 'start' ? box.left - outset : box.right + outset, y: block === 'top' ? box.top - outset : box.bottom + outset };
}

/**
 * One elbow line per part, from its anchor to the left edge of its row: across, down or up a channel, across.
 * Rows follow the anchors' vertical order, and the channel nearest the panel goes to the part that travels
 * furthest from the anchors, so no two lines cross.
 */
export function leaders(anchors: Record<number, Point>, rows: Record<number, Point>, order: readonly number[]): Record<number, string> {
  const ids = order.filter((n) => anchors[n] && rows[n]);
  const right = Math.min(...ids.map((n) => rows[n].x));
  const left = Math.max(...ids.map((n) => anchors[n].x));
  const bent = ids.filter((n) => Math.abs(rows[n].y - anchors[n].y) >= 1);
  const down = bent.filter((n) => rows[n].y >= anchors[n].y);
  const up = bent.filter((n) => rows[n].y < anchors[n].y).reverse();
  const step = Math.min(8, (right - left - 12) / (bent.length + 1));
  const channel = new Map([...down, ...up].map((n, k) => [n, right - 6 - k * step]));
  return Object.fromEntries(
    ids.map((n) => {
      const a = anchors[n];
      const r = rows[n];
      const x = channel.get(n);
      return [n, x === undefined ? `M${a.x} ${a.y}H${r.x}` : `M${a.x} ${a.y}H${x}V${r.y}H${r.x}`];
    }),
  );
}
