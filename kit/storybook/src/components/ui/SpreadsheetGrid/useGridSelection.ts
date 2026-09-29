import { useCallback, useState } from 'react';
import { useGridPointer } from './useGridPointer';
import { clampPosition, rangeBetween, type CellPosition, type CellRange } from './gridSelection';

export interface GridSelection {
  /** The selected rectangle, or null before the user has touched a cell. */
  range: CellRange | null;
  /** The moving corner — where shift+arrow extends from, and where the keyboard is. */
  focus: CellPosition | null;
  /** Where a fill in progress would land, drawn as an outline until the mouse comes up. */
  fillPreview: CellRange | null;
  /** True while a pointer drag is in flight — what keeps a live region quiet mid-drag. */
  isDragging: boolean;
  /** The selection as it last stood still — what a live region reads instead of the drag. */
  settledRange: CellRange | null;
  selectCell: (position: CellPosition, extend: boolean) => void;
  selectAll: () => void;
  clear: () => void;
  /** Hand to `DataGrid.onCellMouseDown` — starts a click or a shift-click selection. */
  onCellMouseDown: (position: CellPosition, shiftKey: boolean) => void;
  /** Hand to the wrapper: extends a drag as the pointer crosses cells. */
  onMouseOver: (event: { target: EventTarget | null }) => void;
  /** Hand to the fill handle's `onMouseDown`. */
  startFillDrag: () => void;
  /** Hand to `DataGrid.onActivePositionChange` — follows the library's own cursor. */
  followActive: (args: { rowIdx: number; column?: { idx: number } }) => void;
}

/**
 * One rectangle, and the four ways it grows: shift-click, a drag, shift+arrows (the caller
 * routes those through `selectCell(position, true)`), and Ctrl+A.
 *
 * Two corners rather than a set of cells — an anchor that stays and a focus that moves — which
 * is what makes « extend » a matter of moving one of them and keeps a 840-row select-all from
 * being 840 entries of anything.
 */
export function useGridSelection({
  rowCount,
  colCount,
  headerRowCount,
  onFill,
}: {
  rowCount: number;
  colCount: number;
  headerRowCount: number;
  onFill?: (source: CellRange, target: CellRange) => void;
}): GridSelection {
  const [anchor, setAnchor] = useState<CellPosition | null>(null);
  const [focus, setFocus] = useState<CellPosition | null>(null);

  const range = anchor && focus ? rangeBetween(anchor, focus) : null;

  const selectCell = useCallback(
    (position: CellPosition, extend: boolean) => {
      const clamped = clampPosition(position, rowCount, colCount);
      setFocus(clamped);
      if (!extend || anchor === null) setAnchor(clamped);
    },
    [anchor, rowCount, colCount],
  );

  const pointer = useGridPointer({
    range,
    rowCount,
    colCount,
    headerRowCount,
    setFocus,
    selectCell,
    onFill,
  });

  return {
    ...pointer,
    range,
    focus,
    selectCell,
    selectAll: useCallback(() => {
      setAnchor({ rowIdx: 0, colIdx: 0 });
      setFocus({ rowIdx: rowCount - 1, colIdx: colCount - 1 });
    }, [rowCount, colCount]),
    clear: useCallback(() => {
      setAnchor(null);
      setFocus(null);
    }, []),
    // Arrow keys move react-data-grid's own active cell; with no range of ours yet, the
    // selection follows it so the first shift+arrow has somewhere to extend from.
    followActive: useCallback(
      ({ rowIdx, column }: { rowIdx: number; column?: { idx: number } }) => {
        if (range !== null) return;
        if (!column) return;
        if (rowIdx < 0) return;
        selectCell({ rowIdx, colIdx: column.idx }, false);
      },
      [range, selectCell],
    ),
  };
}
