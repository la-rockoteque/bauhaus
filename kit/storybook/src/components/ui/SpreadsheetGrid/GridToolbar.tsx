import { Maximize2, Minimize2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../IconButton';
import { ClipboardGroup, FillGroup, SaveGroup, ViewGroup } from './GridToolbarGroups';
import { useRovingToolbar, useToolbarRef } from './useRovingToolbar';
import type { GridColumn } from './gridColumn';
import type { GridViewState } from './useGridView';

/**
 * What the page wants saved, and how far along it is.
 *
 * Supplied or absent — a grid nobody writes back draws no save button at all, rather than one
 * that is permanently dark.
 */
export interface GridSave {
  onSave: () => void;
  /** Cells waiting. Zero disables the button and hides its badge. */
  pending: number;
  isSaving?: boolean;
}

export interface GridToolbarActions {
  copy: () => void;
  cut: () => void;
  paste: () => void;
  clear: () => void;
  fillDown: () => void;
  fillRight: () => void;
  undo: () => void;
  redo: () => void;
  exportCsv: () => void;
  toggleExpanded: () => void;
}

/**
 * The bar above the grid: the search field, then the three groups of actions.
 *
 * **Inline, all of it is one button.** A grid embedded in a page is a table someone is reading,
 * and fourteen controls over five rows is a workbench nobody asked for — in a narrow column it
 * wrapped onto four lines and outweighed the data. So the collapsed bar offers the one thing
 * that leads to the rest, and the tools appear at expanded where there is room to use them.
 *
 * The search field sits *beside* the toolbar rather than inside its role. In a roving-tabindex
 * region Left and Right mean « move along the bar »; inside a text input they mean « move the
 * caret », and the ARIA practices guide keeps text fields out for exactly that reason. One bar
 * to the eye, two things to the keyboard.
 *
 * The clipboard half goes dark on a read-only grid rather than disappearing: the import
 * previews draw the same toolbar the saisie will, and a button that moves between screens is
 * harder to find than one that is visibly unavailable. Copy and export stay lit either way —
 * reading out of a read-only grid is exactly what those screens are for.
 */
export function GridToolbar<R>({
  columns,
  view,
  isExpanded,
  canWrite,
  canUndo,
  canRedo,
  hasSelection,
  actions,
  save,
}: {
  columns: readonly GridColumn<R>[];
  view: GridViewState<R>;
  isExpanded: boolean;
  canWrite: boolean;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  actions: GridToolbarActions;
  save?: GridSave;
}) {
  const { t } = useTranslation('common');
  const bar = useToolbarRef();
  const roving = useRovingToolbar(bar);

  return (
    <div className="mo-grid-bar" data-collapsed={isExpanded ? undefined : ''}>
      {isExpanded && (
      <div className="mo-grid-search">
        <span className="mo-grid-search-icon" aria-hidden="true">
          <Search size={14} />
        </span>
        <input
          type="search"
          className="mo-input mo-input--sm"
          value={view.search}
          onChange={(event) => view.setSearch(event.target.value)}
          placeholder={t('grid.searchPlaceholder')}
          aria-label={t('grid.search')}
        />
      </div>
      )}

      <div
        ref={bar}
        className="mo-grid-toolbar"
        role="toolbar"
        aria-label={t('grid.toolbar')}
        onKeyDown={roving.onKeyDown}
        onFocusCapture={roving.onFocusCapture}
      >
        {isExpanded && (
          <>
            {save && <SaveGroup save={save} />}
            <ClipboardGroup canWrite={canWrite} hasSelection={hasSelection} actions={actions} />
            <FillGroup
              canWrite={canWrite}
              hasSelection={hasSelection}
              canUndo={canUndo}
              canRedo={canRedo}
              actions={actions}
            />
            <ViewGroup
              columns={columns}
              hiddenKeys={view.hiddenKeys}
              onToggleColumn={view.toggleColumn}
              onShowAllColumns={view.showAllColumns}
              frozen={view.frozen}
              onToggleFrozen={view.toggleFrozen}
              filtering={view.filtering}
              onToggleFiltering={view.toggleFiltering}
              actions={actions}
            />
          </>
        )}
        <IconButton
          className="mo-grid-expand"
          icon={isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          label={isExpanded ? t('grid.collapse') : t('grid.expand')}
          aria-pressed={isExpanded}
          onClick={actions.toggleExpanded}
        />
      </div>
    </div>
  );
}
