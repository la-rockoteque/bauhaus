interface SkeletonProps {
  /** `line` sits inside a text element and keeps its line box — the loaded text's exact height. */
  variant?: 'text' | 'title' | 'block' | 'line'
  /** Any CSS width — "100%", "8ch", 180. Defaults to filling the parent. */
  width?: string | number
  className?: string
}

interface SkeletonTextProps {
  lines?: number
  /** The last line stops short, the way a real paragraph does. */
  lastLineWidth?: string
  className?: string
}

/**
 * The `.mo-skeleton` primitive: a placeholder block for content being fetched.
 *
 * Use it only where the shape of what is coming is already known — a table of
 * known width, a card grid. For an unknown-length wait, a sentence beats a
 * lying silhouette.
 */
export function Skeleton({ variant = 'text', width, className }: SkeletonProps) {
  return (
    <span
      className={['mo-skeleton', `mo-skeleton--${variant}`, className].filter(Boolean).join(' ')}
      style={{ width }}
    />
  )
}

/**
 * Several skeleton lines standing in for a paragraph or a list.
 *
 * `aria-hidden` plus a live-region label on the *container* is the wrong shape
 * here, so the group announces itself once as busy and the bars stay silent —
 * a screen reader should hear "chargement", not eight anonymous blanks.
 */
export function SkeletonText({ lines = 3, lastLineWidth = '60%', className }: SkeletonTextProps) {
  return (
    <span
      className={['mo-skeleton-lines', className].filter(Boolean).join(' ')}
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? lastLineWidth : '100%'} />
      ))}
    </span>
  )
}
