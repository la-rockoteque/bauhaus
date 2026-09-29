import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SortDirection } from 'react-data-grid';

/**
 * A column heading that also sorts, filters and hides — the three things a user reaches for
 * first, put where the column is rather than in a menu three clicks away.
 *
 * Inline rather than in a popover on purpose: react-data-grid's cells carry `contain: content`,
 * which paint-clips anything drawn outside them, so a menu would have to be portalled and then
 * repositioned on every scroll and resize. Two small controls and an input cost a taller header
 * row and nothing else.
 *
 * Sorting stays react-data-grid's: the cell itself takes the click and the keyboard, and this
 * only draws the arrow. The two controls that are *not* sorting stop their events here, or
 * every keystroke in the filter would re-sort the column underneath it.
 *
 * The filter line is off until the toolbar turns it on. A row of inputs the reader never asked
 * for costs every header 26px of height and every screen reader an extra stop per column — and
 * on the import previews, which are read once and never filtered, it would be pure noise.
 */
export function GridHeaderCell({
  label,
  sortDirection,
  filtering,
  filter,
  onFilterChange,
  onHide,
  onContextMenu,
}: {
  label: string;
  sortDirection: SortDirection | undefined;
  /** Whether the toolbar has the filter line turned on. */
  filtering: boolean;
  filter: string;
  onFilterChange: (value: string) => void;
  onHide: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
}) {
  const { t } = useTranslation('common');
  const Arrow = sortDirection === 'ASC' ? ArrowUp : sortDirection === 'DESC' ? ArrowDown : ArrowUpDown;

  return (
    <div className="mo-grid-head-cell" onContextMenu={onContextMenu}>
      <span className="mo-grid-head-top">
        <span className="mo-grid-head-label">{label}</span>
        <Arrow
          size={12}
          className={sortDirection ? 'mo-grid-head-arrow' : 'mo-grid-head-arrow mo-grid-head-arrow--idle'}
          aria-hidden="true"
        />
        <button
          type="button"
          className="mo-grid-head-hide"
          // Out of the tab order, like the fill handle and for the same reason: the toolbar's
          // column list hides the same column and is reachable from the keyboard. One stop per
          // column here would be eight to ten extra stops before the first cell, paid on every
          // visit, to reach a control a keyboard user has another way to.
          tabIndex={-1}
          title={t('grid.hideColumn', { label })}
          aria-label={t('grid.hideColumn', { label })}
          onClick={(event) => {
            event.stopPropagation();
            onHide();
          }}
        >
          <EyeOff size={12} aria-hidden="true" />
        </button>
      </span>
      {filtering && (
        <input
          type="text"
          className="mo-grid-head-filter"
          value={filter}
          placeholder={t('grid.filterPlaceholder')}
          aria-label={t('grid.filterColumn', { label })}
          onChange={(event) => onFilterChange(event.target.value)}
          // The header cell sorts on click and on Enter/Space; typing into it must not.
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        />
      )}
    </div>
  );
}
