import { DataGrid } from 'react-data-grid';
import type {
  CellKeyDownArgs,
  CellKeyboardEvent,
  CellMouseArgs,
  CellMouseEvent,
  ColumnOrColumnGroup,
  DataGridHandle,
  Renderers,
  SortColumn,
} from 'react-data-grid';
import type { RefObject } from 'react';
import type { CellPosition } from './gridSelection';

/** Row height of the grid, in px — kept in step with `spreadsheetGrid.css`. */
export const ROW_HEIGHT = 32;

/** The 1px frame above and below, which `border-box` takes out of the rows' height. */
const FRAME_HEIGHT = 2;

/**
 * The library's grid, with everything this directory decided handed to it.
 *
 * Its own component only because the prop list is long: the composition above reads as what the
 * grid is made of, and this reads as how it is configured.
 */
export function GridBody<R>({
  handle,
  label,
  columns,
  onColumnResize,
  rows,
  renderers,
  headerHeight,
  headerRowCount,
  visibleRowCount,
  rowHeight,
  isExpanded,
  sortColumns,
  onSortColumnsChange,
  onCellMouseDown,
  onCellKeyDown,
  onActivePositionChange,
  onCellContextMenu,
}: {
  handle: RefObject<DataGridHandle | null>;
  label: string;
  columns: ColumnOrColumnGroup<R>[];
  onColumnResize: (column: { key: string }, width: number) => void;
  rows: readonly R[];
  renderers: Renderers<R, unknown>;
  headerHeight: number;
  headerRowCount: number;
  visibleRowCount: number;
  rowHeight: number;
  isExpanded: boolean;
  sortColumns: readonly SortColumn[];
  onSortColumnsChange: (columns: SortColumn[]) => void;
  onCellMouseDown: (position: CellPosition, shiftKey: boolean) => void;
  onCellKeyDown: (args: CellKeyDownArgs<R>, event: CellKeyboardEvent) => void;
  onActivePositionChange: (args: { rowIdx: number; column?: { idx: number } }) => void;
  onCellContextMenu: (args: CellMouseArgs<R>, event: CellMouseEvent) => void;
}) {
  return (
    <DataGrid
      aria-label={label}
      className="mo-grid-rdg"
      ref={handle}
      renderers={renderers}
      columns={columns}
      onColumnResize={onColumnResize}
      rows={rows as R[]}
      rowHeight={rowHeight}
      headerRowHeight={headerHeight}
      sortColumns={sortColumns}
      onSortColumnsChange={onSortColumnsChange}
      onCellMouseDown={({ rowIdx, column }, event) =>
        onCellMouseDown({ rowIdx, colIdx: column.idx }, event.shiftKey)
      }
      onCellKeyDown={onCellKeyDown}
      onActivePositionChange={onActivePositionChange}
      onCellContextMenu={onCellContextMenu}
      // Outside expanded the box is sized to its rows; inside, the stylesheet takes over.
      style={
        isExpanded
          ? undefined
          : {
              blockSize:
                FRAME_HEIGHT +
                headerHeight * headerRowCount +
                Math.min(rows.length, visibleRowCount) * rowHeight,
            }
      }
    />
  );
}
