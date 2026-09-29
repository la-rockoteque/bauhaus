import type { ReactNode } from 'react'

interface ProvenanceBadgeProps {
  /** Already translated: this library holds no i18n namespace of its own. */
  label: string
  /** A small glyph before the label, e.g. `<Sparkles size={11} />`. */
  icon?: ReactNode
  /**
   * `primary` for an origin worth noticing — a value the assistant set and
   * nobody has confirmed. `neutral` for a plain fact of record (CSV, MIR).
   */
  tone?: 'neutral' | 'primary'
  /** Tooltip. Use it for the sentence the badge is too small to carry. */
  hint?: string
  /**
   * Hide from assistive tech. True ONLY when a neighbouring label already says
   * the same thing — the assistant marker sits inside a field's `<label>`, and
   * leaving it in the tree would bloat the input's accessible name.
   *
   * Default false, because the other case is a table cell where this badge is
   * the cell's only content: hiding it would leave a screen reader an empty
   * column.
   */
  decorative?: boolean
  className?: string
}

/**
 * The `.mo-provenance` primitive: where a value came from.
 *
 * Distinct from `Tag` (what something IS — Substitution, Inactif) and from
 * `Chip` (a data value). This one answers "who put it there", and the product
 * had spelled it five different ways before it was extracted (TM-50): a pill in
 * the assistant marker, a bare `mo-chip` in the sync history, a page-local
 * `mir-origin`, and two flavours of `synmod__source`.
 */
export function ProvenanceBadge({
  label,
  icon,
  tone = 'neutral',
  hint,
  decorative = false,
  className,
}: ProvenanceBadgeProps) {
  return (
    <span
      className={['mo-provenance', tone === 'primary' && 'mo-provenance--primary', className]
        .filter(Boolean)
        .join(' ')}
      title={hint}
      aria-hidden={decorative || undefined}
    >
      {icon}
      <span>{label}</span>
    </span>
  )
}
