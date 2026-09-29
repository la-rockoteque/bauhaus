import type { ReactNode } from 'react'

export interface SummaryEntry {
  label: string
  /** Left undefined while unanswered — the rail draws the em dash itself. */
  value?: ReactNode
}

interface SummaryRailProps {
  title: string
  entries: readonly SummaryEntry[]
  className?: string
}

/**
 * The `.mo-rail` primitive: the standing answer to "what have I filled in".
 *
 * It sticks beside a long form and lists every entry, answered or not. The em
 * dash for a missing value is drawn here rather than passed in, so an empty
 * entry cannot be spelled three different ways across three forms.
 */
export function SummaryRail({ title, entries, className }: SummaryRailProps) {
  return (
    <aside className={['mo-rail', className].filter(Boolean).join(' ')} aria-label={title}>
      <p className="mo-rail-title">{title}</p>
      {entries.map((entry, index) => {
        const filled = entry.value !== undefined && entry.value !== null && entry.value !== ''
        return (
          <div
            // Position, not label: two entries may legitimately share a name.
            key={index}
            className={['mo-rail-item', filled && 'mo-rail-item--filled']
              .filter(Boolean)
              .join(' ')}
          >
            <span className="mo-rail-dot" aria-hidden="true" />
            <span>
              <span className="mo-rail-label">{entry.label}</span>
              <br />
              <span className={filled ? 'mo-rail-value' : 'mo-rail-value mo-rail-value--empty'}>
                {filled ? entry.value : '—'}
              </span>
            </span>
          </div>
        )
      })}
    </aside>
  )
}
