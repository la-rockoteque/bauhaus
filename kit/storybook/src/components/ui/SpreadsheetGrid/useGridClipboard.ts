import { useCallback, useMemo, type ClipboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { clearWrites, fillWithin, offeredCells } from './gridClipboard';
import { parseClipboard, toTsv } from './tsv';
import type { CellPosition, CellRange } from './gridSelection';
import type { CellWrite } from './gridEdits';

interface Wiring {
  range: CellRange | null;
  canWrite: boolean;
  applyWrites: (writes: readonly CellWrite[]) => number;
  writesForPaste: (matrix: readonly (readonly string[])[], into: CellRange) => CellWrite[];
  matrixOf: (range: CellRange) => string[][];
  readAt: (position: CellPosition) => string;
  announce: (message: string) => void;
}

/**
 * What can be done to the range, with the « is there a range » question asked once.
 *
 * Every operation here needs a range and refuses without one. Asking each of them separately is
 * six copies of the same guard, and six branches in one function for one decision.
 */
function useRangeOperations({
  range,
  canWrite,
  applyWrites,
  writesForPaste,
  matrixOf,
  readAt,
  announce,
}: Wiring) {
  const { t } = useTranslation('common');

  return useMemo(() => {
    const none = { asTsv: () => '', clear: () => {}, fillFrom: () => {}, paste: () => {} };
    if (!range) return none;

    const paste = (text: string) => {
      if (!canWrite) return;
      const matrix = parseClipboard(text);
      const writes = writesForPaste(matrix, range);
      // A block tiled over the selection offers every cell it covers; one spilled from a single
      // cell offers its own, the ones clipped at the grid's edge included.
      const offered = Math.max(offeredCells(matrix), writes.length);
      const written = applyWrites(writes);
      announce(
        written === offered
          ? t('grid.pasted', { count: written })
          : t('grid.pastedClipped', { count: written, refused: offered - written }),
      );
    };

    return {
      asTsv: () => toTsv(matrixOf(range)),
      clear: () => applyWrites(clearWrites(range)),
      fillFrom: (axis: 'down' | 'right') => applyWrites(fillWithin(range, axis, readAt)),
      paste,
    };
  }, [range, canWrite, applyWrites, writesForPaste, matrixOf, readAt, announce, t]);
}

/**
 * Everything the clipboard and the fill buttons do to a range.
 *
 * One place, because they are all the same move: read the range, decide what each cell should
 * become, and hand the writes to `applyWrites`. What each one decides is in `gridClipboard.ts`,
 * what it needs a range for is above, and this is the pair of surfaces the grid binds — the
 * React clipboard events, and the toolbar's buttons.
 */
export function useGridClipboard(wiring: Wiring) {
  const ops = useRangeOperations(wiring);
  const { canWrite } = wiring;

  const onCopy = useCallback(
    (event: ClipboardEvent) => {
      event.preventDefault();
      event.clipboardData.setData('text/plain', ops.asTsv());
    },
    [ops],
  );

  return {
    ...ops,
    onCopy,
    onCut: useCallback(
      (event: ClipboardEvent) => {
        onCopy(event);
        ops.clear();
      },
      [onCopy, ops],
    ),
    onPaste: useCallback(
      (event: ClipboardEvent) => {
        event.preventDefault();
        ops.paste(event.clipboardData.getData('text/plain'));
      },
      [ops],
    ),
    copyToClipboard: useCallback(() => {
      void navigator.clipboard?.writeText(ops.asTsv());
    }, [ops]),
    pasteFromClipboard: useCallback(() => {
      if (!canWrite) return;
      // ponytail: reading the clipboard from a button needs permission and is refused outright
      // in Firefox. Ctrl+V goes through the paste event and always works; this is only the
      // convenience, so a refusal is silence rather than an error the user cannot act on.
      void navigator.clipboard
        ?.readText()
        .then(ops.paste)
        .catch(() => undefined);
    }, [canWrite, ops]),
  };
}
