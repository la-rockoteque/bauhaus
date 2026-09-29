import { useCallback, useEffect, useRef, useState } from 'react';
import { positionFromNode } from './gridDom';
import { clampPosition, fillTargetRange, type CellPosition, type CellRange } from './gridSelection';

type DragMode = 'select' | 'fill';

/**
 * The pointer half of a selection: the drag that extends it, and the drag off the fill handle
 * that commits through `onFill` instead of moving it.
 *
 * Kept apart from the selection's own state because the two answer different questions — what
 * is selected, and what the mouse is currently doing about it.
 */
export function useGridPointer({
  range,
  rowCount,
  colCount,
  headerRowCount,
  setFocus,
  selectCell,
  onFill,
}: {
  range: CellRange | null;
  rowCount: number;
  colCount: number;
  headerRowCount: number;
  setFocus: (position: CellPosition) => void;
  selectCell: (position: CellPosition, extend: boolean) => void;
  onFill?: (source: CellRange, target: CellRange) => void;
}) {
  const [fillTo, setFillTo] = useState<CellPosition | null>(null);
  const [dragging, setDragging] = useState(false);
  // What was selected when the drag began. A live region reads this rather than the range the
  // pointer is currently dragging out — see `settledRange` below.
  const [before, setBefore] = useState<CellRange | null>(null);
  const dragMode = useRef<DragMode | null>(null);

  useDragRelease({
    range,
    fillTo,
    dragMode,
    onFill,
    stop: () => {
      setDragging(false);
      setFillTo(null);
    },
  });

  return {
    fillPreview: range && fillTo ? fillTargetRange(range, fillTo) : null,
    isDragging: dragging,
    /**
     * The selection as it last stood still: the live range once the mouse is up, and what was
     * there before the drag while it is down.
     *
     * Derived rather than held in the footbar, because `aria-live="polite"` queues every
     * distinct value it is given — and « the totals, then no totals, then the new totals » is
     * three utterances for one drag.
     */
    settledRange: dragging ? before : range,
    onCellMouseDown: useCallback(
      (position: CellPosition, shiftKey: boolean) => {
        dragMode.current = 'select';
        setBefore(range);
        setDragging(true);
        selectCell(position, shiftKey);
      },
      [range, selectCell],
    ),
    onMouseOver: useCallback(
      (event: { target: EventTarget | null }) => {
        const mode = dragMode.current;
        const position = mode && positionFromNode(event.target, headerRowCount);
        if (!position) return;
        if (mode === 'fill') setFillTo(position);
        else setFocus(clampPosition(position, rowCount, colCount));
      },
      [headerRowCount, rowCount, colCount, setFocus],
    ),
    startFillDrag: useCallback(() => {
      dragMode.current = 'fill';
      setBefore(range);
      setDragging(true);
    }, [range]),
  };
}

/** The fill a released drag owes, or nothing — a select drag, or a fill that never left home. */
function pendingFill(
  mode: DragMode | null,
  range: CellRange | null,
  fillTo: CellPosition | null,
): { source: CellRange; target: CellRange } | null {
  if (mode !== 'fill') return null;
  if (!range || !fillTo) return null;
  return { source: range, target: fillTargetRange(range, fillTo) };
}

/**
 * Ends whatever drag is in flight when the mouse comes up.
 *
 * On the window, not on the cell it started in: the mouse goes up wherever it likes, outside
 * the grid and outside the document. The listener is subscribed once and reads the current
 * selection from a ref refreshed *after* each render rather than during one — a mouseup can
 * only arrive after the paint that follows.
 */
function useDragRelease({
  range,
  fillTo,
  dragMode,
  onFill,
  stop,
}: {
  range: CellRange | null;
  fillTo: CellPosition | null;
  dragMode: React.RefObject<DragMode | null>;
  onFill?: (source: CellRange, target: CellRange) => void;
  stop: () => void;
}) {
  const latest = useRef({ range, fillTo, stop });
  useEffect(() => {
    latest.current = { range, fillTo, stop };
  });

  useEffect(() => {
    const release = () => {
      const fill = pendingFill(dragMode.current, latest.current.range, latest.current.fillTo);
      if (fill && onFill) onFill(fill.source, fill.target);
      dragMode.current = null;
      latest.current.stop();
    };
    window.addEventListener('mouseup', release);
    return () => window.removeEventListener('mouseup', release);
  }, [dragMode, onFill]);
}
