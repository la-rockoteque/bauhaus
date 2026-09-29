import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowDownToLine,
  ArrowRightToLine,
  ClipboardPaste,
  Copy,
  EyeOff,
  Eraser,
  Filter,
  Scissors,
  SortAsc,
  SortDesc,
  X,
} from 'lucide-react';
import type { ContextMenuItem } from '../ContextMenu';
import type { GridColumn } from './gridColumn';
import type { CellPosition } from './gridSelection';
import type { GridViewState } from './useGridView';

/** What a right-click landed on: a cell, or a column's heading. */
export type GridMenuTarget =
  | { kind: 'cell'; position: CellPosition; value: string; columnKey: string }
  | { kind: 'column'; columnKey: string };

export interface GridMenuActions {
  copy: () => void;
  cut: () => void;
  paste: () => void;
  clear: () => void;
  fillDown: () => void;
  fillRight: () => void;
}

/**
 * The two menus a right-click can open, built from the same state the toolbar reads.
 *
 * Built here rather than in the menu component, which knows nothing about grids — it draws a
 * list and places it. What belongs on that list is this file's business.
 *
 * Every item is something the grid already does: the shortcuts are shown beside them because a
 * menu that teaches its own keyboard is one people stop needing.
 */
export function useGridMenus<R>({
  target,
  columns,
  view,
  canWrite,
  hasSelection,
  actions,
}: {
  target: GridMenuTarget | null;
  columns: readonly GridColumn<R>[];
  view: GridViewState<R>;
  canWrite: boolean;
  hasSelection: boolean;
  actions: GridMenuActions;
}): { items: ContextMenuItem[]; label: string } {
  const { t } = useTranslation('common');

  return useMemo(() => {
    if (!target) return { items: [], label: '' };

    const column = columns.find((c) => c.key === target.columnKey);
    const label = column?.label ?? '';

    if (target.kind === 'column') {
      return { items: columnItems(target.columnKey), label: t('grid.columnMenu', { label }) };
    }
    return { items: cellItems(target), label: t('grid.cellMenu') };

    function columnItems(columnKey: string): ContextMenuItem[] {
      const sorted = view.sortColumns.find((s) => s.columnKey === columnKey);
      const sortBy = (direction: 'ASC' | 'DESC') => () =>
        view.setSortColumns([{ columnKey, direction }]);

      return [
        {
          key: 'asc',
          label: t('grid.sortAsc'),
          icon: <SortAsc size={14} />,
          disabled: sorted?.direction === 'ASC',
          onSelect: sortBy('ASC'),
        },
        {
          key: 'desc',
          label: t('grid.sortDesc'),
          icon: <SortDesc size={14} />,
          disabled: sorted?.direction === 'DESC',
          onSelect: sortBy('DESC'),
        },
        {
          key: 'unsort',
          label: t('grid.sortNone'),
          icon: <X size={14} />,
          disabled: !sorted,
          onSelect: () => view.setSortColumns([]),
        },
        { key: 'r1', separator: true },
        {
          key: 'filter',
          label: t('grid.filterHere'),
          icon: <Filter size={14} />,
          // Opening the line is what puts a box under this heading to type in.
          onSelect: () => view.focusFilter(columnKey),
        },
        { key: 'r2', separator: true },
        {
          key: 'hide',
          label: t('grid.hideThisColumn'),
          icon: <EyeOff size={14} />,
          onSelect: () => view.hideColumn(columnKey),
        },
      ];
    }

    function cellItems(cell: Extract<GridMenuTarget, { kind: 'cell' }>): ContextMenuItem[] {
      // What this cell can have done to it, not what the grid can. A read-only column offering
      // « Coller » that writes nothing is a menu that lies about what it will do — so the write
      // half is dark there, exactly as it is in the toolbar on a read-only grid.
      const writable = canWrite && column?.write !== undefined;

      return [
        {
          key: 'copy',
          label: t('grid.copy'),
          icon: <Copy size={14} />,
          hint: 'Ctrl+C',
          disabled: !hasSelection,
          onSelect: actions.copy,
        },
        {
          key: 'cut',
          label: t('grid.cut'),
          icon: <Scissors size={14} />,
          hint: 'Ctrl+X',
          disabled: !hasSelection || !writable,
          onSelect: actions.cut,
        },
        {
          key: 'paste',
          label: t('grid.paste'),
          icon: <ClipboardPaste size={14} />,
          hint: 'Ctrl+V',
          disabled: !hasSelection || !writable,
          onSelect: actions.paste,
        },
        { key: 'r1', separator: true },
        {
          key: 'fillDown',
          label: t('grid.fillDown'),
          icon: <ArrowDownToLine size={14} />,
          hint: 'Ctrl+D',
          disabled: !hasSelection || !writable,
          onSelect: actions.fillDown,
        },
        {
          key: 'fillRight',
          label: t('grid.fillRight'),
          icon: <ArrowRightToLine size={14} />,
          hint: 'Ctrl+R',
          disabled: !hasSelection || !writable,
          onSelect: actions.fillRight,
        },
        {
          key: 'clear',
          label: t('grid.clear'),
          icon: <Eraser size={14} />,
          hint: 'Suppr',
          disabled: !hasSelection || !writable,
          onSelect: actions.clear,
        },
        { key: 'r2', separator: true },
        {
          key: 'filterValue',
          label: t('grid.filterByValue', { value: truncate(cell.value) }),
          icon: <Filter size={14} />,
          disabled: cell.value.trim() === '',
          onSelect: () => view.filterOn(cell.columnKey, cell.value),
        },
        {
          key: 'hide',
          label: t('grid.hideThisColumn'),
          icon: <EyeOff size={14} />,
          onSelect: () => view.hideColumn(cell.columnKey),
        },
      ];
    }
  }, [target, columns, view, canWrite, hasSelection, actions, t]);
}

/** A cell's whole value can be a paragraph; a menu item cannot. */
function truncate(value: string, max = 24): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}
