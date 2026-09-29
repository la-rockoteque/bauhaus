import { useCallback, useMemo, useState } from 'react';
import type { GridColumn } from './gridColumn';
import type { CellPosition, CellRange } from './gridSelection';
import { composeWrites, matrixOf, readAt, writesForPaste, type CellWrite, type GridView } from './gridEdits';

/** How many steps back the toolbar's « Annuler » reaches. */
const HISTORY_LIMIT = 50;

/**
 * Every write the grid makes — typing, pasting, filling, clearing, cutting — funnels here, and
 * comes out as one new `rows` array handed to the caller. The grid never mutates a row: a write
 * is `column.write(row, value)` returning a new one, which is also what makes undo a matter of
 * keeping the previous array rather than of replaying inverses.
 *
 * Positions index the *visible* rows and columns — what the user pointed at, after the search
 * and the sort and the hidden columns — and are resolved to rows by identity before anything is
 * written, so a sort between the copy and the paste cannot land a value on the wrong line.
 */
export function useGridEdits<R>({
  rows,
  visibleRows,
  visibleColumns,
  onRowsChange,
}: {
  rows: readonly R[];
  visibleRows: readonly R[];
  visibleColumns: readonly GridColumn<R>[];
  onRowsChange?: (rows: readonly R[]) => void;
}) {
  const [history, setHistory] = useState<readonly (readonly R[])[]>([]);
  const [future, setFuture] = useState<readonly (readonly R[])[]>([]);
  // ponytail: the history is this grid's own; rows replaced from outside (a re-import, a
  // refetch) leave it pointing at a list that is no longer on screen. Undo would then restore
  // the old one wholesale. Clear it from the caller on a reload if that becomes reachable.

  const view: GridView<R> = useMemo(
    () => ({ rows: visibleRows, columns: visibleColumns }),
    [visibleRows, visibleColumns],
  );

  /** Returns how many of the writes landed — a paste that spilled onto a read-only column
   *  writes fewer cells than it was given, and saying nothing about it fails the user. */
  const applyWrites = useCallback(
    (writes: readonly CellWrite[]): number => {
      if (!onRowsChange || writes.length === 0) return 0;

      const { byRow, written } = composeWrites(view, writes);
      if (byRow.size === 0) return 0;

      setHistory((stack) => [...stack, rows].slice(-HISTORY_LIMIT));
      setFuture([]);
      onRowsChange(rows.map((row) => byRow.get(row) ?? row));
      return written;
    },
    [rows, view, onRowsChange],
  );

  const step = useCallback(
    (from: readonly (readonly R[])[], forward: boolean) => {
      const target = from.at(-1);
      if (!onRowsChange || target === undefined) return;

      const shrink = (stack: readonly (readonly R[])[]) => stack.slice(0, -1);
      const grow = (stack: readonly (readonly R[])[]) => [...stack, rows].slice(-HISTORY_LIMIT);
      if (forward) {
        setFuture(shrink);
        setHistory(grow);
      } else {
        setHistory(shrink);
        setFuture(grow);
      }
      onRowsChange(target);
    },
    [rows, onRowsChange],
  );

  return {
    applyWrites,
    writesForPaste: useCallback(
      (matrix: readonly (readonly string[])[], into: CellRange) =>
        writesForPaste(view, matrix, into),
      [view],
    ),
    matrixOf: useCallback((range: CellRange) => matrixOf(view, range), [view]),
    readAt: useCallback((position: CellPosition) => readAt(view, position), [view]),
    undo: useCallback(() => step(history, false), [step, history]),
    redo: useCallback(() => step(future, true), [step, future]),
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    /** False when no column takes entry — the read-only previews, where paste and fill are off. */
    canWrite: onRowsChange !== undefined && visibleColumns.some((c) => c.write !== undefined),
  };
}
