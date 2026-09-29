import type { ReactNode } from 'react'
import { PageTitle } from './PageTitle'

interface PageHeaderProps {
  title: ReactNode
  /** One line of context. Anything longer belongs on the page, not the header. */
  subtitle?: ReactNode
  /** Sits beside the title — a status tag, a count, a live badge. */
  badge?: ReactNode
  /** The actions that belong to the whole route, right-aligned. */
  actions?: ReactNode
  size?: 'md' | 'lg'
  className?: string
}

/**
 * The `.mo-page-head` primitive: the title block every route opens with.
 *
 * It owns the `<h1>`, so a route renders exactly one. A section inside the page
 * wants `SectionHead` instead.
 */
export function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  size = 'md',
  className,
}: PageHeaderProps) {
  return (
    <header className={['mo-page-head', className].filter(Boolean).join(' ')}>
      <div className="mo-page-head-text">
        <div className="mo-page-head-title">
          <PageTitle size={size}>{title}</PageTitle>
          {badge}
        </div>
        {subtitle !== undefined && <p className="mo-page-subtitle">{subtitle}</p>}
      </div>
      {actions !== undefined && <div className="mo-page-head-actions">{actions}</div>}
    </header>
  )
}
