import { useCallback } from 'react';
import type { CellKeyDownArgs, CellKeyboardEvent } from 'react-data-grid';
import type { CellPosition } from './gridSelection';

const ARROWS: Record<string, CellPosition> = {
  ArrowUp: { rowIdx: -1, colIdx: 0 },
  ArrowDown: { rowIdx: 1, colIdx: 0 },
  ArrowLeft: { rowIdx: 0, colIdx: -1 },
  ArrowRight: { rowIdx: 0, colIdx: 1 },
};

/** Keys that move the active cell, and so collapse the range onto wherever it lands. */
const MOVES = new Set(['Tab', 'Home', 'End', 'PageUp', 'PageDown']);

export interface GridShortcuts {
  selectAll: () => void;
  clear: () => void;
  fillDown: () => void;
  fillRight: () => void;
  undo: () => void;
  redo: () => void;
}

/** Excel empties the block on either of these, and only when nothing is open over the cell. */
const CLEARS = new Set(['Delete', 'Backspace']);

/**
 * Which shortcut a Ctrl/Cmd chord means, or nothing.
 *
 * Excel's own bindings, which is the whole reason they are claimed from the browser: Ctrl+D
 * fills down, Ctrl+R fills right, and losing unsaved entry to a page reload is the worse of the
 * two surprises Ctrl+R can spring.
 */
function chordFor(
  key: string,
  shiftKey: boolean,
  canWrite: boolean,
  shortcuts: GridShortcuts,
): (() => void) | null {
  if (key === 'a') return shortcuts.selectAll;
  if (!canWrite) return null;
  if (key === 'd') return shortcuts.fillDown;
  if (key === 'r') return shortcuts.fillRight;
  if (key === 'y') return shortcuts.redo;
  if (key !== 'z') return null;
  return shiftKey ? shortcuts.redo : shortcuts.undo;
}

/** Where a shift+arrow extends to, or nothing when this is not one. */
function extendedTo(event: CellKeyboardEvent, focus: CellPosition | null): CellPosition | null {
  if (!event.shiftKey) return null;
  if (!focus) return null;
  const step = ARROWS[event.key];
  if (!step) return null;
  return { rowIdx: focus.rowIdx + step.rowIdx, colIdx: focus.colIdx + step.colIdx };
}

/** Whether this key moves the active cell, and so collapses the block onto it. */
function isMove(event: CellKeyboardEvent): boolean {
  return ARROWS[event.key] !== undefined || MOVES.has(event.key);
}

/**
 * A key pressed with no modifier: Delete and Backspace empty the block, and anything that moves
 * the active cell collapses it onto wherever it lands.
 */
function plainKey(
  event: CellKeyboardEvent,
  { canWrite, hasRange, clear, collapse }: {
    canWrite: boolean;
    hasRange: boolean;
    clear: () => void;
    collapse: () => void;
  },
): void {
  if (CLEARS.has(event.key)) {
    if (!canWrite) return;
    event.preventGridDefault();
    event.preventDefault();
    clear();
    return;
  }
  if (hasRange && isMove(event)) collapse();
}

/**
 * The spreadsheet's keyboard: Shift+Arrow extends the block, Delete empties it, Ctrl+A takes
 * the sheet, Ctrl+D and Ctrl+R fill, Ctrl+Z and Ctrl+Y walk the history.
 *
 * react-data-grid binds none of these — it moves one active cell — so each is claimed with
 * `preventGridDefault()` and, where the browser has its own idea, `preventDefault()` as well.
 */
export function useGridKeyboard<R>({
  focus,
  hasRange,
  canWrite,
  selectCell,
  collapse,
  shortcuts,
}: {
  focus: CellPosition | null;
  hasRange: boolean;
  canWrite: boolean;
  selectCell: (position: CellPosition, extend: boolean) => void;
  collapse: () => void;
  shortcuts: GridShortcuts;
}) {
  return useCallback(
    (args: CellKeyDownArgs<R>, event: CellKeyboardEvent) => {
      if (args.mode === 'EDIT') return;

      const extended = extendedTo(event, focus);
      if (extended) {
        event.preventGridDefault();
        selectCell(extended, true);
        return;
      }

      if (!event.ctrlKey && !event.metaKey) {
        // Not while an editor is open — the `EDIT` guard above is what makes Backspace still
        // delete a character inside the box rather than wipe the cell out from under the typing.
        plainKey(event, { canWrite, hasRange, clear: shortcuts.clear, collapse });
        return;
      }

      const run = chordFor(event.key.toLowerCase(), event.shiftKey, canWrite, shortcuts);
      if (!run) return;
      event.preventGridDefault();
      event.preventDefault();
      run();
    },
    [focus, hasRange, canWrite, selectCell, collapse, shortcuts],
  );
}
