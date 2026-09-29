import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadBlob } from '../../../utils/downloadBlob';
import { toCsv } from './gridView';
import type { GridColumn } from './gridColumn';
import type { GridToolbarActions } from './GridToolbar';

/** What a range can have done to it, wherever the request came from. */
export interface RangeOperations {
  copyToClipboard: () => void;
  pasteFromClipboard: () => void;
  clear: () => void;
  fillFrom: (axis: 'down' | 'right') => void;
}

/**
 * The toolbar's buttons, wired to the range operations, the history and the CSV.
 *
 * Assembled here rather than inline so the grid stays a layout: a button that cuts is a copy
 * and a clear, one that exports is a blob and a file name, and neither is worth reading in the
 * middle of the markup.
 */
export function useGridActions<R>({
  operations,
  undo,
  redo,
  announce,
  exportRows,
  exportColumns,
  label,
  toggleExpanded,
}: {
  operations: RangeOperations;
  undo: () => void;
  redo: () => void;
  announce: (message: string) => void;
  exportRows: readonly R[];
  exportColumns: readonly GridColumn<R>[];
  label: string;
  toggleExpanded: () => void;
}): GridToolbarActions {
  const { t } = useTranslation('common');

  return useMemo(
    () => ({
      copy: operations.copyToClipboard,
      cut: () => {
        operations.copyToClipboard();
        operations.clear();
      },
      paste: operations.pasteFromClipboard,
      clear: operations.clear,
      fillDown: () => operations.fillFrom('down'),
      fillRight: () => operations.fillFrom('right'),
      undo: () => {
        undo();
        announce(t('grid.undone'));
      },
      redo: () => {
        redo();
        announce(t('grid.redone'));
      },
      exportCsv: () =>
        downloadBlob(
          new Blob([toCsv(exportRows, exportColumns)], { type: 'text/csv' }),
          `${label}.csv`,
        ),
      toggleExpanded,
    }),
    [operations, undo, redo, announce, exportRows, exportColumns, label, toggleExpanded, t],
  );
}
