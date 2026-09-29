/**
 * The rectangle a spreadsheet selection is, and the arithmetic over it.
 *
 * react-data-grid v7 has no range: it tracks one active cell, copies one cell and fills one
 * column downwards. Everything a user means by « selection » above that — shift-click, a drag,
 * a block of cells on the clipboard, a fill handle pulled sideways — is this file plus
 * `useGridSelection`.
 */

/** A cell by position in the *visible* grid: rows after filtering and sorting, columns after hiding. */
export interface CellPosition {
  readonly rowIdx: number;
  readonly colIdx: number;
}

/** Two corners, normalized: `top <= bottom` and `left <= right` whichever way the drag went. */
export interface CellRange {
  readonly top: number;
  readonly bottom: number;
  readonly left: number;
  readonly right: number;
}

export function rangeBetween(a: CellPosition, b: CellPosition): CellRange {
  return {
    top: Math.min(a.rowIdx, b.rowIdx),
    bottom: Math.max(a.rowIdx, b.rowIdx),
    left: Math.min(a.colIdx, b.colIdx),
    right: Math.max(a.colIdx, b.colIdx),
  };
}

export function rangeContains(range: CellRange, rowIdx: number, colIdx: number): boolean {
  return (
    rowIdx >= range.top && rowIdx <= range.bottom && colIdx >= range.left && colIdx <= range.right
  );
}

export function rangeRowCount(range: CellRange): number {
  return range.bottom - range.top + 1;
}

export function rangeColCount(range: CellRange): number {
  return range.right - range.left + 1;
}

export function isSingleCell(range: CellRange): boolean {
  return rangeRowCount(range) === 1 && rangeColCount(range) === 1;
}

/** Every position in the range, row by row — the order the clipboard and the fill both read in. */
export function* positionsIn(range: CellRange): Generator<CellPosition> {
  for (let rowIdx = range.top; rowIdx <= range.bottom; rowIdx += 1) {
    for (let colIdx = range.left; colIdx <= range.right; colIdx += 1) {
      yield { rowIdx, colIdx };
    }
  }
}

export function clampPosition(
  position: CellPosition,
  rowCount: number,
  colCount: number,
): CellPosition {
  return {
    rowIdx: Math.max(0, Math.min(position.rowIdx, rowCount - 1)),
    colIdx: Math.max(0, Math.min(position.colIdx, colCount - 1)),
  };
}

/**
 * Where a fill handle dragged to `to` lands, given the block it started from.
 *
 * One axis at a time, like Excel: the drag that moved furthest wins, and the other axis keeps
 * the source's extent. A drag back *into* the source is not a fill — it returns the source, and
 * the caller writes nothing.
 */
export function fillTargetRange(source: CellRange, to: CellPosition): CellRange {
  const below = to.rowIdx - source.bottom;
  const above = source.top - to.rowIdx;
  const right = to.colIdx - source.right;
  const left = source.left - to.colIdx;

  const vertical = Math.max(below, above, 0);
  const horizontal = Math.max(right, left, 0);
  if (vertical === 0 && horizontal === 0) return source;

  if (vertical >= horizontal) {
    return below >= above
      ? { ...source, bottom: to.rowIdx }
      : { ...source, top: to.rowIdx };
  }
  return right >= left ? { ...source, right: to.colIdx } : { ...source, left: to.colIdx };
}

/**
 * The cells a fill writes, each with the source value that repeats into it.
 *
 * The source block tiles over the target the way a dragged block of two does in Excel — modulo
 * its own height and width — and the cells the source already occupies are left alone rather
 * than rewritten with themselves.
 */
export function fillEdits(
  source: CellRange,
  target: CellRange,
  read: (position: CellPosition) => string,
): { position: CellPosition; value: string }[] {
  const height = rangeRowCount(source);
  const width = rangeColCount(source);
  const edits: { position: CellPosition; value: string }[] = [];

  for (const position of positionsIn(target)) {
    if (rangeContains(source, position.rowIdx, position.colIdx)) continue;
    // Modulo on a non-negative offset: a fill upwards or leftwards has negative offsets, and
    // `%` in JS keeps the sign, so the remainder is folded back into range first.
    const rowOffset = (((position.rowIdx - source.top) % height) + height) % height;
    const colOffset = (((position.colIdx - source.left) % width) + width) % width;
    edits.push({
      position,
      value: read({ rowIdx: source.top + rowOffset, colIdx: source.left + colOffset }),
    });
  }
  return edits;
}

/**
 * Where a double-click on the fill handle fills to (TM-140): down the source's columns to the
 * last row, stopping before the first row where any of them already holds something. Null when
 * the very next row does — there is nothing to fill.
 */
export function fillDownTarget(
  source: CellRange,
  rowCount: number,
  read: (position: CellPosition) => string,
): CellRange | null {
  const isEmptyRow = (rowIdx: number) => {
    for (let colIdx = source.left; colIdx <= source.right; colIdx += 1) {
      if (read({ rowIdx, colIdx }) !== '') return false;
    }
    return true;
  };

  let bottom = source.bottom;
  while (bottom + 1 < rowCount && isEmptyRow(bottom + 1)) bottom += 1;
  return bottom === source.bottom ? null : { ...source, bottom };
}
