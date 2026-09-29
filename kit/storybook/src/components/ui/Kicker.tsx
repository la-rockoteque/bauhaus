import type { HTMLAttributes } from 'react'

interface KickerProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'muted' | 'primary'
}

/**
 * The `.mo-kicker` primitive: a small sentence-case eyebrow above a field or a
 * section. Sentence case is the whole point — the system has no uppercase
 * tracked-out label style.
 */
export function Kicker({ tone = 'muted', className, children, ...props }: KickerProps) {
  return (
    <span
      className={['mo-kicker', tone === 'primary' && 'mo-kicker--primary', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}
