export type TrackTone = 'primary' | 'ready' | 'error'

interface TrackProps {
  /** Completion ratio, 0–1. Values outside the range are clamped for the bar. */
  value: number
  tone?: TrackTone
  size?: 'md' | 'sm'
  /**
   * Announce the bar to assistive tech. Without it the track stays decorative
   * (`role="presentation"`) — right when a neighbouring count already says
   * "3 / 5 lignes prêtes" and the bar would only repeat it.
   */
  label?: string
  className?: string
}

/**
 * The `.mo-track` primitive: progress rail plus fill.
 *
 * The *fill* is clamped to 0–100% so an overrun cannot paint outside the rail,
 * but `aria-valuenow` reports the real ratio — a 110% overrun is exactly what a
 * screen-reader user needs to hear, and clamping it would hide the problem.
 */
export function Track({ value, tone = 'primary', size = 'md', label, className }: TrackProps) {
  const pct = Math.round(value * 100)
  const filled = Math.min(Math.max(pct, 0), 100)

  return (
    <div
      className={['mo-track', size === 'sm' && 'mo-track--sm', className].filter(Boolean).join(' ')}
      {...(label
        ? { role: 'progressbar', 'aria-label': label, 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100 }
        : { role: 'presentation' })}
    >
      <div
        className={['mo-track-fill', tone !== 'primary' && `mo-track-fill--${tone}`]
          .filter(Boolean)
          .join(' ')}
        style={{ width: `${filled}%` }}
      />
    </div>
  )
}
