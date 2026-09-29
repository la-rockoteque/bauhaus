import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { CountBadge } from './Tabs'

interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label' | 'title'> {
  icon: ReactNode
  /** Required: an icon alone has no accessible name, and the icon is aria-hidden. */
  label: string
  /** A count riding the corner — unread messages, pending items. Hidden at 0. */
  count?: number
}

/**
 * The `.mo-icon-btn` primitive: a square target for an action that needs no word.
 *
 * `label` is a required prop rather than an optional `aria-label`, because an
 * unnamed icon button is invisible to a screen reader and the app had several.
 * It doubles as the tooltip.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, count, className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={['mo-icon-btn', className].filter(Boolean).join(' ')}
      {...props}
      // After the spread, not before: the accessible name is the one guarantee
      // this component makes, and a caller must not be able to blank it.
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{icon}</span>
      {count !== undefined && <CountBadge count={count} />}
    </button>
  ),
)

IconButton.displayName = 'IconButton'
