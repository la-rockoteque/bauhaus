import { Button } from './Button'

interface PagerProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Reads as « 26–50 de 214 ». Built by the caller, which owns the wording. */
  info?: string
  labels: {
    previous: string
    next: string
    /** Names the row for assistive tech — « Pagination des utilisateurs ». */
    nav: string
    /** Reads the position between the buttons — « Page 2 de 5 ». Defaults to « 2 / 5 ». */
    position?: string
  }
  /**
   * A single page still shows its info and its position — « 3 déclarations · Page 1 de 1 » —
   * with no button. Off by default: most lists hide the pager when there is nothing to page.
   */
  showWhenSingle?: boolean
  className?: string
}

/**
 * The `.mo-pager` primitive. Pairs with the `usePagedFilteredTable` hook, which
 * already owns the clamping — this renders its numbers and nothing more.
 */
export function Pager({
  page,
  totalPages,
  onPageChange,
  info,
  labels,
  showWhenSingle = false,
  className,
}: PagerProps) {
  const single = totalPages === 1
  if (totalPages < 1 || (single && !showWhenSingle)) return null

  return (
    <nav
      className={['mo-pager', className].filter(Boolean).join(' ')}
      aria-label={labels.nav}
    >
      {info !== undefined && <span className="mo-pager-info">{info}</span>}
      <div className="mo-pager-controls">
        {!single && (
          <Button size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            {labels.previous}
          </Button>
        )}
        <span className="mo-pager-info">
          {labels.position ?? `${page} / ${totalPages}`}
        </span>
        {!single && (
          <Button size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            {labels.next}
          </Button>
        )}
      </div>
    </nav>
  )
}
