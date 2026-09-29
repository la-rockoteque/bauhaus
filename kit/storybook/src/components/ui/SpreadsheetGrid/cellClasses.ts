import type { GridColumn } from './gridColumn';
import { rangeContains, type CellPosition, type CellRange } from './gridSelection';

/**
 * The border Excel draws around a block, assembled from the cells it passes through: the grid
 * has no element for the range itself, and an absolutely-positioned overlay would have to
 * re-measure on every scroll, resize and column drag.
 */
function edgeClasses(range: CellRange, { rowIdx, colIdx }: CellPosition): string[] {
  return [
    range.top === rowIdx ? 'mo-grid-cell--edge-top' : '',
    range.bottom === rowIdx ? 'mo-grid-cell--edge-bottom' : '',
    range.left === colIdx ? 'mo-grid-cell--edge-left' : '',
    range.right === colIdx ? 'mo-grid-cell--edge-right' : '',
  ].filter(Boolean);
}

/**
 * What the column is, whatever the selection is doing.
 *
 * `writable` is this *cell*'s answer, and `entry` is the grid's: a grid where nothing takes
 * entry is a reader, and greying every cell of it would say « refused » about a table nobody
 * was going to type into anyway.
 */
/** This cell's own answers: takes a write, sits in a grid that takes entry, holds an unsaved one. */
export interface CellState {
  writable: boolean;
  entry: boolean;
  edited: boolean;
  invalid: boolean;
}

function columnClasses<R>(
  column: GridColumn<R>,
  { writable, entry, edited, invalid }: CellState,
): string[] {
  return [
    column.numeric ? 'mo-grid-cell--numeric' : '',
    column.muted ? 'mo-grid-cell--muted' : '',
    // A cell that takes typing has to look unlike one that does not. Without it the entry
    // columns read as more data, and the only way to discover them is to double-click at random.
    writable ? 'mo-grid-cell--editable' : '',
    entry && !writable ? 'mo-grid-cell--locked' : '',
    edited ? 'mo-grid-cell--edited' : '',
    invalid ? 'mo-grid-cell--invalid' : '',
  ].filter(Boolean);
}

/** The block, and what a fill dragged from it would reach. */
export interface SelectionRanges {
  range: CellRange | null;
  fillPreview: CellRange | null;
}

/** What the selection is doing to this cell: in the block, or in what a fill would reach. */
function selectionClasses(
  position: CellPosition,
  { range, fillPreview }: SelectionRanges,
): string[] {
  if (range !== null && rangeContains(range, position.rowIdx, position.colIdx)) {
    return ['mo-grid-cell--selected', ...edgeClasses(range, position)];
  }
  if (fillPreview !== null && rangeContains(fillPreview, position.rowIdx, position.colIdx)) {
    return ['mo-grid-cell--fill'];
  }
  return [];
}

/** What the column is, and what the selection is doing to it. */
export function cellClasses<R>(
  column: GridColumn<R>,
  position: CellPosition,
  selection: SelectionRanges,
  state: CellState,
): string | undefined {
  const classes = [
    ...columnClasses(column, state),
    ...selectionClasses(position, selection),
  ];
  return classes.length > 0 ? classes.join(' ') : undefined;
}

/** The heading's classes, which the selection never touches. */
export function headerClasses<R>(column: GridColumn<R>): string {
  return [
    'mo-grid-head',
    column.numeric ? 'mo-grid-cell--numeric' : '',
    column.muted ? 'mo-grid-cell--muted' : '',
  ]
    .filter(Boolean)
    .join(' ');
}
