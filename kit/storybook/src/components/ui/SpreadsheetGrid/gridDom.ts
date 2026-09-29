import type { CellPosition } from './gridSelection';

/**
 * Where a cell sits, read out of the DOM react-data-grid rendered.
 *
 * Through ARIA rather than a `data-` attribute of our own: the grid owns its markup and gives
 * no per-cell hook, but it does index every cell for screen readers. `aria-colindex` and
 * `aria-rowindex` are 1-based, and the row index counts the header rows in.
 */
export function positionFromNode(
  node: EventTarget | null,
  headerRowCount: number,
): CellPosition | null {
  if (!(node instanceof Element)) return null;

  const cell = node.closest('[role="gridcell"]');
  const row = cell?.closest('[role="row"]');
  if (!cell || !row) return null;

  return indexed(
    Number(row.getAttribute('aria-rowindex')) - headerRowCount - 1,
    Number(cell.getAttribute('aria-colindex')) - 1,
  );
}

/** A position only when both halves are real indices — a header row reads as a negative one. */
function indexed(rowIdx: number, colIdx: number): CellPosition | null {
  const usable = Number.isInteger(rowIdx) && Number.isInteger(colIdx) && rowIdx >= 0 && colIdx >= 0;
  return usable ? { rowIdx, colIdx } : null;
}
