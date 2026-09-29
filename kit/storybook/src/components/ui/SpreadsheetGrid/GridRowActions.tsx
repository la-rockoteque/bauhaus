import type { ReactNode } from 'react';

/** One thing that can be done to a row, drawn as an icon that names itself on hover. */
export interface GridRowAction<R> {
  key: string;
  icon: ReactNode;
  /** The tooltip and the accessible name — an icon alone has neither. */
  label: (row: R) => string;
  onSelect: (row: R) => void;
  /** Left out, or drawn back, for a row it does not apply to. */
  disabled?: (row: R) => boolean;
}

/**
 * What can be done to *this* row, floated over its right edge while the pointer is on it.
 *
 * A column instead was the obvious thing and the wrong one: an action is not data. It bought a
 * heading nobody reads (« Commentaires ⇅ », sortable, filterable), a fixed slice of width on
 * every row whether or not anyone ever clicks it, and a button that competes with the values
 * beside it. Off to the side and on demand, the row stays a row.
 *
 * **Absent while the grid is expanded.** Expanded is the working mode — a selection dragged
 * across a hundred rows, a column filled — and a strip of buttons that lights up under the
 * pointer as it crosses each row is noise against exactly that.
 */
export function GridRowActions<R>({
  row,
  actions,
}: {
  row: R;
  actions: readonly GridRowAction<R>[];
}) {
  if (actions.length === 0) return null;

  return (
    <div className="mo-grid-row-actions">
      {actions.map((action) => {
        const label = action.label(row);
        return (
          <button
            key={action.key}
            type="button"
            className="mo-icon-btn mo-grid-row-action"
            title={label}
            aria-label={label}
            disabled={action.disabled?.(row) ?? false}
            // The row's own mousedown starts a selection; pressing a button on it must not.
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              action.onSelect(row);
            }}
          >
            <span aria-hidden="true">{action.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
