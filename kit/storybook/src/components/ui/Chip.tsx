import type { HTMLAttributes } from 'react'

type ChipProps = HTMLAttributes<HTMLSpanElement>

/**
 * The `.mo-chip` primitive: a neutral pill carrying a *data value* — a tool
 * name, an equipment code. State labels belong in `Tag`.
 */
export function Chip({ className, children, ...props }: ChipProps) {
  return (
    <span className={['mo-chip', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </span>
  )
}
