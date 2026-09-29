import type { GridColumn } from './gridColumn';

/**
 * How wide each column is drawn, so the columns always reach the grid's right edge.
 *
 * react-data-grid can size a track `auto` and let CSS grid hand it the slack, but it then
 * *measures* that layout once and pins the result in pixels — and the pinned numbers do not
 * come back when the window grows, so a grid widened after its first paint keeps a band of
 * empty page beside its last column. Handing it numbers is the way out: the arithmetic below is
 * the same distribution, done where it can be re-run whenever the box changes.
 *
 * A stated `width` is a floor, not a size. Slack is shared equally rather than in proportion —
 * a description column is already the widest and does not need to be the one that grows most —
 * and a column that hits its `maxWidth` hands what it could not take back to the others.
 */

/** What a column that states nothing gets, matching react-data-grid's own default. */
const DEFAULT_FLOOR = 120;

export function floorOf<R>(column: GridColumn<R>): number {
  if (column.minWidth !== undefined) return column.minWidth;
  return typeof column.width === 'number' ? column.width : DEFAULT_FLOOR;
}

/**
 * Each column's width in pixels, or an empty map when there is nothing to divide — no box
 * measured yet, or the floors already overflow it, which is a horizontal scroll and not a
 * layout to solve.
 */
export function fillWidths<R>(
  columns: readonly GridColumn<R>[],
  available: number,
  /** Columns a reader dragged to a width of their own. Fixed there, and out of the sharing. */
  pinned: ReadonlyMap<string, number> = new Map(),
): ReadonlyMap<string, number> {
  const widths = new Map<string, number>();
  if (available <= 0 || columns.length === 0) return widths;

  for (const column of columns) widths.set(column.key, pinned.get(column.key) ?? floorOf(column));
  let slack = available - sum(widths.values());
  if (slack <= 0) return widths;

  // A pass per column at worst: each one either takes its share or hits its ceiling and is out
  // of the next pass, which is what makes the leftovers reach whoever can still use them.
  const sharing = columns.filter((column) => !pinned.has(column.key));
  let growable = sharing.filter((column) => canGrow(column, widths));
  while (slack >= 1 && growable.length > 0) {
    const share = slack / growable.length;
    for (const column of growable) {
      const ceiling = column.maxWidth ?? Number.POSITIVE_INFINITY;
      const taken = Math.min(share, ceiling - (widths.get(column.key) ?? 0));
      widths.set(column.key, (widths.get(column.key) ?? 0) + taken);
      slack -= taken;
    }
    const before = growable.length;
    growable = sharing.filter((column) => canGrow(column, widths));
    // Nobody could take anything: the rest of the slack has nowhere to go.
    if (growable.length === before && slack >= 1) break;
  }
  return widths;
}

function canGrow<R>(column: GridColumn<R>, widths: ReadonlyMap<string, number>): boolean {
  return (widths.get(column.key) ?? 0) < (column.maxWidth ?? Number.POSITIVE_INFINITY);
}

function sum(values: Iterable<number>): number {
  let total = 0;
  for (const value of values) total += value;
  return total;
}
