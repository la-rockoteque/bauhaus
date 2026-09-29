import type { ReactNode } from 'react'
import { Track, type TrackTone } from './Track'

interface HudProps {
  /** Eyebrow over the count — « Progression ». */
  eyebrow: string
  done: number
  total: number
  /** What is being counted — « lignes prêtes ». */
  unit: string
  /** Right-hand stat, usually a reference: « Réquisition » / « #12345 ». */
  asideLabel?: string
  asideValue?: ReactNode
  tone?: TrackTone
  className?: string
}

/**
 * The `.mo-hud` primitive: the "where am I, how done am I" header for a page,
 * modal, or panel. Left stat, centre progress, right stat.
 *
 * The track takes no `label` because the count beside it already reads
 * "3 / 5 lignes prêtes" — announcing a progress bar too would say it twice.
 */
export function Hud({
  eyebrow,
  done,
  total,
  unit,
  asideLabel,
  asideValue,
  tone,
  className,
}: HudProps) {
  return (
    <header className={['mo-hud', className].filter(Boolean).join(' ')}>
      <div className="mo-hud-stack">
        <span className="mo-hud-eyebrow">{eyebrow}</span>
        <span className="mo-hud-count">
          <strong>{done}</strong>
          <span className="mo-hud-count-slash">/</span>
          <span className="mo-hud-count-total">{total}</span>
          <span className="mo-hud-count-label">{unit}</span>
        </span>
      </div>

      <Track value={total === 0 ? 0 : done / total} tone={tone} />

      {asideValue !== undefined && (
        <div className="mo-hud-stack mo-hud-stack--end">
          {asideLabel && <span className="mo-hud-eyebrow">{asideLabel}</span>}
          <span className="mo-hud-token">{asideValue}</span>
        </div>
      )}
    </header>
  )
}
