import type { ReactNode } from 'react'

interface SideListProps {
  /** The search field and the filter controls, in that order. */
  controls?: ReactNode
  /** One line naming the order the list is in — « Trié : retards d'abord ». */
  note?: ReactNode
  /** The `ListCard` stack — each one renders its own <li>. */
  children: ReactNode
  /** Names the list for assistive tech — « File d'inspection ». */
  label: string
  className?: string
}

/**
 * The `.mo-sidelist` primitive: the master pane of a master/detail split.
 *
 * The sort note is a slot rather than a prop with a default, because a list
 * whose order is not obvious owes the reader a sentence, and one whose order is
 * obvious should not pay for the line.
 */
export function SideList({ controls, note, children, label, className }: SideListProps) {
  return (
    <div className={['mo-sidelist', className].filter(Boolean).join(' ')}>
      {controls}
      {note !== undefined && <p className="mo-sidelist-note">{note}</p>}
      <ul className="mo-sidelist-items" aria-label={label}>
        {children}
      </ul>
    </div>
  )
}
