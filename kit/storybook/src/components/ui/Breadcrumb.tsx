import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Breadcrumb.css'

export interface Crumb {
  /** The rung's name — the destination said plainly, never a generic « Retour ». */
  label: string
  /** Where it goes. The last rung is the page itself, so it carries none. */
  to?: string
}

interface BreadcrumbProps {
  items: readonly Crumb[]
  /** The nav's accessible name, from the caller's locale — « Fil d'Ariane ». */
  label: string
  className?: string
}

/**
 * The `.mo-crumbs` primitive: the path down to this page, one rung per level.
 *
 * `nav > ol > li` as the ARIA APG spells it, so a screen reader announces the list and
 * its length; the separator is drawn, never read. The last rung is the page itself — it
 * takes `aria-current="page"` and no link, because a link to here goes nowhere.
 *
 * A rung with no `to` renders as text in place — the page itself, or a level with no page
 * of its own — rather than lying about a destination. The trail a page shows before its
 * data lands is simply the rungs it already knows, so the way back never waits on a query.
 */
export function Breadcrumb({ items, label, className }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={['mo-crumbs', className].filter(Boolean).join(' ')}>
      <ol className="mo-crumbs-list">
        {items.map((item, index) => {
          const last = index === items.length - 1

          return (
            <li key={`${index}-${item.label}`} className="mo-crumb">
              {index > 0 && <ChevronRight className="mo-crumb-sep" size={14} aria-hidden="true" />}
              {item.to ? (
                <Link to={item.to} className="mo-crumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="mo-crumb-current" aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
