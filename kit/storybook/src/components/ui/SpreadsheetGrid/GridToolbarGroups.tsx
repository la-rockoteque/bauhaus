import {
  ArrowDownToLine,
  ArrowRightToLine,
  ClipboardPaste,
  Columns3,
  Copy,
  Download,
  Eraser,
  ListFilter,
  Redo2,
  Save,
  Scissors,
  Snowflake,
  Undo2,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../IconButton';
import { CountBadge } from '../Tabs';
import type { GridColumn } from './gridColumn';
import type { GridSave, GridToolbarActions } from './GridToolbar';

/**
 * The bar's three groups, each its own component.
 *
 * Split by what they do rather than for the sake of splitting: the clipboard half is the half
 * that goes dark on a read-only grid, the fill half is the half undo belongs to, and the view
 * half is live whatever the columns declare.
 */

/** A control the user cannot reach says why, not just that it cannot. `IconButton`'s `label` is
 *  both the accessible name and the tooltip, so the reason has nowhere else to go. */
const reason = (available: boolean, label: string, blocked: string) => (available ? label : blocked);

/**
 * Saving, when the caller has something to save.
 *
 * The grid does not know what « save » means — these rows may be a preview nobody writes back,
 * or a batch of entries waiting on a permission-gated endpoint. So the action comes from the
 * page, and the toolbar only draws it: first in the bar, because when it is there at all it is
 * the reason the person opened the grid.
 *
 * The count rides the corner of the button. « Enregistrer tout » with nothing pending is a
 * button that does nothing, and a number is a better answer to « did that take » than a
 * disabled state alone.
 */
export function SaveGroup({ save }: { save: GridSave }) {
  const { t } = useTranslation('common');
  const nothing = save.pending === 0;

  return (
    <div className="mo-grid-toolbar-group">
      <IconButton
        className="mo-grid-save"
        icon={<Save size={16} />}
        label={save.isSaving ? t('grid.saving') : nothing ? t('grid.saveNothing') : t('grid.save')}
        count={save.pending}
        disabled={nothing || save.isSaving}
        onClick={save.onSave}
      />
    </div>
  );
}

export function ClipboardGroup({
  canWrite,
  hasSelection,
  actions,
}: {
  canWrite: boolean;
  hasSelection: boolean;
  actions: GridToolbarActions;
}) {
  const { t } = useTranslation('common');
  const write = hasSelection && canWrite;

  return (
    <div className="mo-grid-toolbar-group">
      <IconButton
        icon={<Copy size={16} />}
        label={t('grid.copy')}
        onClick={actions.copy}
        disabled={!hasSelection}
      />
      <IconButton
        icon={<Scissors size={16} />}
        label={reason(canWrite, t('grid.cut'), t('grid.cutReadOnly'))}
        onClick={actions.cut}
        disabled={!write}
      />
      <IconButton
        icon={<ClipboardPaste size={16} />}
        label={reason(canWrite, t('grid.paste'), t('grid.pasteReadOnly'))}
        onClick={actions.paste}
        disabled={!write}
      />
      <IconButton
        icon={<Eraser size={16} />}
        label={reason(canWrite, t('grid.clear'), t('grid.clearReadOnly'))}
        onClick={actions.clear}
        disabled={!write}
      />
    </div>
  );
}

export function FillGroup({
  canWrite,
  hasSelection,
  canUndo,
  canRedo,
  actions,
}: {
  canWrite: boolean;
  hasSelection: boolean;
  canUndo: boolean;
  canRedo: boolean;
  actions: GridToolbarActions;
}) {
  const { t } = useTranslation('common');
  const write = hasSelection && canWrite;

  return (
    <div className="mo-grid-toolbar-group">
      <IconButton
        icon={<ArrowDownToLine size={16} />}
        label={reason(canWrite, t('grid.fillDown'), t('grid.fillDownReadOnly'))}
        onClick={actions.fillDown}
        disabled={!write}
      />
      <IconButton
        icon={<ArrowRightToLine size={16} />}
        label={reason(canWrite, t('grid.fillRight'), t('grid.fillRightReadOnly'))}
        onClick={actions.fillRight}
        disabled={!write}
      />
      <IconButton
        icon={<Undo2 size={16} />}
        label={t('grid.undo')}
        onClick={actions.undo}
        disabled={!canUndo}
      />
      <IconButton
        icon={<Redo2 size={16} />}
        label={t('grid.redo')}
        onClick={actions.redo}
        disabled={!canRedo}
      />
    </div>
  );
}

export function ViewGroup<R>({
  columns,
  hiddenKeys,
  onToggleColumn,
  onShowAllColumns,
  frozen,
  onToggleFrozen,
  filtering,
  onToggleFiltering,
  actions,
}: {
  columns: readonly GridColumn<R>[];
  hiddenKeys: ReadonlySet<string>;
  onToggleColumn: (key: string) => void;
  onShowAllColumns: () => void;
  frozen: boolean;
  onToggleFrozen: () => void;
  filtering: boolean;
  onToggleFiltering: () => void;
  actions: GridToolbarActions;
}) {
  const { t } = useTranslation('common');

  return (
    <div className="mo-grid-toolbar-group">
      <ColumnMenu
        columns={columns}
        hiddenKeys={hiddenKeys}
        onToggleColumn={onToggleColumn}
        onShowAll={onShowAllColumns}
      />
      <IconButton
        icon={<ListFilter size={16} />}
        label={filtering ? t('grid.hideFilters') : t('grid.showFilters')}
        aria-pressed={filtering}
        onClick={onToggleFiltering}
      />
      <IconButton
        icon={<Snowflake size={16} />}
        label={frozen ? t('grid.unfreeze') : t('grid.freeze')}
        aria-pressed={frozen}
        onClick={onToggleFrozen}
      />
      <IconButton icon={<Download size={16} />} label={t('grid.export')} onClick={actions.exportCsv} />
    </div>
  );
}

/**
 * A native disclosure rather than a popover: it opens, closes and takes focus by itself, and
 * the menu is a list of checkboxes with nothing to position.
 *
 * Its contents are mounted only while it is open. A closed `<details>` still holds its children
 * in the DOM, and a grid that kept a checkbox per column there would put one row of hidden
 * checkboxes into every `getByRole('checkbox')` on the page.
 */
function ColumnMenu<R>({
  columns,
  hiddenKeys,
  onToggleColumn,
  onShowAll,
}: {
  columns: readonly GridColumn<R>[];
  hiddenKeys: ReadonlySet<string>;
  onToggleColumn: (key: string) => void;
  onShowAll: () => void;
}) {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  // A hidden column is a column the reader cannot see to bring back — so the button carries
  // how many are missing, which is the only thing on screen that says any are.
  const hidden = columns.filter((column) => hiddenKeys.has(column.key)).length;

  return (
    <details
      className="mo-grid-columns"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary
        className="mo-icon-btn"
        title={hidden > 0 ? t('grid.columnsHidden', { count: hidden }) : t('grid.columns')}
        aria-label={hidden > 0 ? t('grid.columnsHidden', { count: hidden }) : t('grid.columns')}
      >
        <span aria-hidden="true">
          <Columns3 size={16} />
        </span>
        {hidden > 0 && <CountBadge count={hidden} />}
      </summary>
      {open && (
        <div className="mo-grid-columns-menu">
          {columns.map((column) => (
            <label key={column.key} className="mo-grid-columns-item">
              <input
                type="checkbox"
                checked={!hiddenKeys.has(column.key)}
                onChange={() => onToggleColumn(column.key)}
              />
              {column.label}
            </label>
          ))}
          {hidden > 0 && (
            <button
              type="button"
              className="mo-btn mo-btn--ghost mo-btn--sm mo-grid-columns-all"
              onClick={onShowAll}
            >
              {t('grid.showAllColumns')}
            </button>
          )}
        </div>
      )}
    </details>
  );
}
