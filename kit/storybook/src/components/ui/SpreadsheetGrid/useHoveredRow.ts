import { useCallback, useState } from 'react';

/**
 * Which row the pointer is on, and how far down the grid it sits.
 *
 * Measured off the row the pointer entered rather than computed from a row height and a scroll
 * offset: the grid already knows where it drew the row, and arithmetic over `scrollTop` is a
 * second answer that drifts the moment anything about the layout changes.
 *
 * The actions are not a column — that was the point of moving them — so they float over the
 * grid, and this is what tells them where.
 *
 * **Cleared by moving off the rows, never by a `mouseleave` on the grid.** The strip floats
 * *over* the row rather than inside it, so reaching for its buttons leaves the row and fires
 * that event — and clearing there unmounts the button under the cursor a frame before the
 * click lands. Moving anywhere else inside the grid already reports a target that is not a row,
 * which is the same signal without the trap.
 */
export interface HoveredRow {
  rowIdx: number;
  /** Pixels from the top of the grid's box to the top of the row. */
  top: number;
  height: number;
}

export function useHoveredRow(headerRowCount: number) {
  const [hovered, setHovered] = useState<HoveredRow | null>(null);

  const onMouseOver = useCallback(
    (event: { target: EventTarget | null; currentTarget: EventTarget | null }) => {
      const node = event.target;
      if (!(node instanceof Element)) return;

      // The strip floats *over* the row rather than inside it, so the pointer moving onto its
      // buttons leaves the row — and clearing here would unmount the very button being reached
      // for. Keep whatever row it was opened on.
      if (node.closest('.mo-grid-row-actions-layer')) return;

      const row = node.closest('[role="row"]');
      const grid = event.currentTarget;
      if (!row || !(grid instanceof Element)) return;

      const rowIdx = Number(row.getAttribute('aria-rowindex')) - headerRowCount - 1;
      if (!Number.isInteger(rowIdx) || rowIdx < 0) {
        setHovered(null);
        return;
      }

      const rowBox = row.getBoundingClientRect();
      const gridBox = grid.getBoundingClientRect();
      setHovered({ rowIdx, top: rowBox.top - gridBox.top, height: rowBox.height });
    },
    [headerRowCount],
  );

  return {
    hovered,
    onMouseOver,
    // Scrolling under the pointer leaves the strip pointing at a row that has moved.
    clear: useCallback(() => setHovered(null), []),
  };
}
