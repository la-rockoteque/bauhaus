import type { HTMLAttributes } from 'react'

export type BannerTone = 'amber' | 'error' | 'ready'

interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  /** Omit for the neutral banner. */
  tone?: BannerTone
}

/**
 * The `.mo-banner` primitive: an attention block that explains a state before
 * the user commits to it.
 *
 * `role="status"` on every tone, including `error`: a banner explains a
 * situation the user is looking at, so it should not interrupt a screen reader
 * mid-sentence the way `role="alert"` does. A message that *interrupts* a
 * submission belongs next to the field, in `.mo-error-text`.
 */
export function Banner({ tone, className, children, role = 'status', ...props }: BannerProps) {
  return (
    <div
      className={['mo-banner', tone && `mo-banner--${tone}`, className].filter(Boolean).join(' ')}
      role={role}
      {...props}
    >
      {children}
    </div>
  )
}
