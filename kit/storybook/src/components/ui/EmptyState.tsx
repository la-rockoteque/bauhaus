import type { ReactNode } from 'react'

interface EmptyStateProps {
  /** Say what is true, not what is missing: « Tout est à jour ». */
  title: string
  /** One sentence of detail, when the title cannot carry it alone. */
  body?: ReactNode
  /**
   * `ready` for "nothing to do and that is good news"; leave it off for the
   * plain "no rows yet". There is no error tone — a failed load is a
   * `QueryError`, not an empty state.
   */
  tone?: 'ready'
  align?: 'start' | 'center'
  /** Drop the dashed frame when the block already sits inside a bordered surface. */
  bare?: boolean
  /**
   * The one action that fills the emptiness — « Créer une réquisition ».
   *
   * Only for a route whose entire body is this block. When the page has a header
   * with its own actions, put it there instead: an action that appears and
   * vanishes with the data moves under the reader's cursor.
   */
  action?: ReactNode
  className?: string
}

/**
 * The `.mo-empty` primitive.
 *
 * The action slot is the exception, not the rule — see `action`. The default
 * remains a block that states what is true and nothing else.
 */
export function EmptyState({
  title,
  body,
  tone,
  align = 'start',
  bare = false,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={[
        'mo-empty',
        tone && `mo-empty--${tone}`,
        align === 'center' && 'mo-empty--center',
        bare && 'mo-empty--bare',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="mo-empty-title">{title}</span>
      {body !== undefined && <span className="mo-empty-body">{body}</span>}
      {action !== undefined && <span className="mo-empty-action">{action}</span>}
    </div>
  )
}
