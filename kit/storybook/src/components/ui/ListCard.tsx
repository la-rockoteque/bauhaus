import type { ReactNode } from 'react'

interface ListCardProps {
  /** The line that names the row — « BT000001 — brancher borne de recharge ». */
  title: ReactNode
  /** Tags across the top: the type, the alerts. */
  tags?: ReactNode
  /** Right of the title — a date, a quantity. */
  aside?: ReactNode
  /** Bottom left, in mono: the code the reader scans for. */
  code?: ReactNode
  /** Bottom right: who it belongs to. */
  meta?: ReactNode
  selected?: boolean
  onSelect?: () => void
  className?: string
}

/**
 * The `.mo-listcard` primitive: one selectable row of a `SideList`.
 *
 * Five slots, fixed positions. The point of fixing them is that a queue of these
 * is *scanned* down a column — a card that moves its date to the left breaks the
 * scan for every card under it.
 */
export function ListCard({
  title,
  tags,
  aside,
  code,
  meta,
  selected = false,
  onSelect,
  className,
}: ListCardProps) {
  // A native <li> rather than role="list" / role="listitem" on divs: the ARIA
  // pair needs the roles to be owned directly, and a bare <button> under
  // role="list" makes assistive tech drop the list semantics altogether.
  return (
    <li className="mo-listcard-item">
      <button
        type="button"
        className={['mo-listcard', selected && 'is-selected', className].filter(Boolean).join(' ')}
        aria-current={selected ? 'true' : undefined}
        onClick={onSelect}
      >
        {tags !== undefined && <span className="mo-listcard-tags">{tags}</span>}
        <span className="mo-listcard-body">
          <span className="mo-listcard-title">{title}</span>
          {aside !== undefined && <span className="mo-listcard-aside">{aside}</span>}
        </span>
        {(code !== undefined || meta !== undefined) && (
          <span className="mo-listcard-foot">
            <span className="mo-listcard-key">{code}</span>
            <span className="mo-listcard-meta">{meta}</span>
          </span>
        )}
      </button>
    </li>
  )
}
