import type { ReactNode } from 'react'

interface FilterBarProps {
  /** The labelled fields, left to right. Use `.mo-field` / `Field` primitives. */
  children: ReactNode
  /** Pushed to the right edge — the result count, a reset button. */
  end?: ReactNode
  /** Names the group for assistive tech — « Filtres des réquisitions ». */
  label: string
  className?: string
}

/**
 * The `.mo-filters` primitive: the row of narrow labelled fields above a table.
 *
 * `role="search"` rather than a `<form>`: these filters apply as you type and
 * there is nothing to submit, so a form would promise an Enter key that does
 * nothing.
 */
export function FilterBar({ children, end, label, className }: FilterBarProps) {
  return (
    <div
      className={['mo-filters', className].filter(Boolean).join(' ')}
      role="search"
      aria-label={label}
    >
      {children}
      {end !== undefined && <div className="mo-filters-end">{end}</div>}
    </div>
  )
}
