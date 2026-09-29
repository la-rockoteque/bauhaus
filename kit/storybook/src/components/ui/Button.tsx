import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Spinner } from './Spinner'

export type ButtonVariant = 'primary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** One primary per region; every other action is a ghost. `danger` replaces the primary of a destructive confirm. */
  variant?: ButtonVariant
  size?: 'md' | 'sm'
  /** Inline count pill, for "Confirmer la préparation (3)" style actions. */
  badge?: ReactNode
  /**
   * The action is running: the button disables itself, announces `aria-busy` and shows a
   * spinner before its label, which stays put so the button does not change width.
   */
  pending?: boolean
}

/**
 * The `.mo-btn` primitive. `type` defaults to "button" because the bare HTML
 * default is "submit", which posts the surrounding form on any stray click.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'ghost', size = 'md', badge, pending = false, disabled, className, children, type = 'button', ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={[
        'mo-btn',
        `mo-btn--${variant}`,
        size === 'sm' && 'mo-btn--sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
    >
      {pending && <Spinner />}
      {children}
      {badge !== undefined && <span className="mo-btn-badge">{badge}</span>}
    </button>
  ),
)

Button.displayName = 'Button'
