import { fillEdits, positionsIn, type CellPosition, type CellRange } from './gridSelection';
import type { CellWrite } from './gridEdits';

/**
 * What the clipboard and the fill buttons *decide*, with no React in it: which cells to write
 * and what to put in them. The hook above this one only wires these to a range and a mutation.
 */

/** Every cell of the range, emptied. */
export function clearWrites(range: CellRange): CellWrite[] {
  return [...positionsIn(range)].map((position) => ({ position, value: '' }));
}

/**
 * The selection filled from its own first row or first column — Excel's Ctrl+D and Ctrl+R.
 * The edge the fill starts from is the one the user would have dragged the handle away from.
 */
export function fillWithin(
  range: CellRange,
  axis: 'down' | 'right',
  read: (position: CellPosition) => string,
): CellWrite[] {
  const source =
    axis === 'down' ? { ...range, bottom: range.top } : { ...range, right: range.left };
  return fillEdits(source, range, read);
}

/** How many cells a pasted block offered, against how many of them landed. */
export function offeredCells(matrix: readonly (readonly string[])[]): number {
  return matrix.reduce((total, line) => total + line.length, 0);
}
