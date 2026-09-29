import type { HTMLAttributes } from 'react'

interface PageTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** The wider hero size, for a landing page rather than a record. */
  size?: 'md' | 'lg'
}

/** The `.mo-page-title` primitive. One per route. */
export function PageTitle({ size = 'md', className, children, ...props }: PageTitleProps) {
  return (
    <h1
      className={['mo-page-title', size === 'lg' && 'mo-page-title--lg', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </h1>
  )
}
