import { writesOn, type GridColumn } from './gridColumn';
import type { CellPosition, CellRange } from './gridSelection';
import { positionsIn, rangeColCount, rangeRowCount } from './gridSelection';

export interface CellWrite {
  position: CellPosition;
  value: string;
}

/** The grid as the user sees it: rows after filtering and sorting, columns after hiding. */
export interface GridView<R> {
  rows: readonly R[];
  columns: readonly GridColumn<R>[];
}

export function readAt<R>({ rows, columns }: GridView<R>, { rowIdx, colIdx }: CellPosition): string {
  const row = rows[rowIdx];
  const column = columns[colIdx];
  return row !== undefined && column !== undefined ? column.read(row) : '';
}

/** A range as a matrix of what is on screen — what the clipboard and the CSV both read. */
export function matrixOf<R>(view: GridView<R>, range: CellRange): string[][] {
  const matrix: string[][] = [];
  for (let rowIdx = range.top; rowIdx <= range.bottom; rowIdx += 1) {
    const line: string[] = [];
    for (let colIdx = range.left; colIdx <= range.right; colIdx += 1) {
      line.push(readAt(view, { rowIdx, colIdx }));
    }
    matrix.push(line);
  }
  return matrix;
}

/**
 * The rows a set of writes produces, each composed once.
 *
 * By row first: two columns written on the same line have to compose into one new row, not
 * overwrite each other's copy of it. A write into a column that declares no `write` is dropped
 * here — which is also how a paste is stopped from spilling into a read-only column.
 */
export function composeWrites<R>(
  { rows, columns }: GridView<R>,
  writes: readonly CellWrite[],
): { byRow: Map<R, R>; written: number } {
  const byRow = new Map<R, R>();
  let written = 0;

  for (const { position, value } of writes) {
    const row = rows[position.rowIdx];
    const column = columns[position.colIdx];
    // One guard per thing guarded: the row is on screen, the column takes entry at all, and
    // this cell of it is not locked. Three answers to three questions, which is also the only
    // way to read which of them refused a write that did not land.
    if (row === undefined) continue;
    if (column?.write === undefined) continue;
    if (!writesOn(column, row)) continue;
    byRow.set(row, column.write(byRow.get(row) ?? row, value));
    written += 1;
  }
  return { byRow, written };
}

/**
 * Where a pasted block lands, starting at the selection's top-left and clipped to the grid.
 *
 * Into a selection of more than one cell the block tiles over it, the way Excel does — one
 * value fills the selection, a row of three repeats down every selected row (TM-132). The user
 * selected the target on purpose; landing the block once in its corner is never what they meant.
 */
export function writesForPaste<R>(
  { rows, columns }: GridView<R>,
  matrix: readonly (readonly string[])[],
  into: CellRange,
): CellWrite[] {
  if (matrix.length === 0) return [];

  // A ragged line (a CSV row one field short) tiles as blank rather than as `undefined`.
  if (!isSingleCell(into)) {
    return [...positionsIn(into)].map((position) => {
      const line = matrix[(position.rowIdx - into.top) % matrix.length];
      return { position, value: line[(position.colIdx - into.left) % line.length] ?? '' };
    });
  }

  const writes: CellWrite[] = [];
  matrix.forEach((line, rowOffset) => {
    line.forEach((value, colOffset) => {
      const position = { rowIdx: into.top + rowOffset, colIdx: into.left + colOffset };
      if (position.rowIdx < rows.length && position.colIdx < columns.length) {
        writes.push({ position, value });
      }
    });
  });
  return writes;
}

function isSingleCell(range: CellRange): boolean {
  return rangeRowCount(range) === 1 && rangeColCount(range) === 1;
}
