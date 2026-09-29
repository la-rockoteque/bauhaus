import type { ElementType, HTMLAttributes } from 'react'

export type CardState = 'ready' | 'warning' | 'error'

interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Drives the left-edge accent strip. Omit for a neutral card. */
  state?: CardState
  /** Rows are usually `li`; a standalone block stays a `div`. */
  as?: ElementType
}

/**
 * The `.mo-card` primitive: border, radius, and a state-coloured left edge.
 * It provides structure only — bring your own layout classes for the inside.
 */
export function Card({ state, as: Tag = 'div', className, children, ...props }: CardProps) {
  return (
    <Tag
      className={['mo-card', state && `mo-card--state-${state}`, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </Tag>
  )
}
