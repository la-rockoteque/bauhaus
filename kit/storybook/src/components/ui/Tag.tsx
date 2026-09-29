import type { HTMLAttributes } from 'react'

export type TagTone =
  | 'primary'
  | 'amber'
  | 'ready'
  | 'muted'
  | 'soft-primary'
  | 'soft-amber'
  | 'soft-ready'
  | 'soft-error'

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * `soft-*` on a neutral surface, solid on a surface that is already toned.
   *
   * Not a question of emphasis, and not of contrast: all eight tones clear AA, from
   * `muted` at 4.85:1 to `primary` at 8.87:1. It is a question of edge. `.mo-tag`
   * declares no border — unlike `.mo-chip` — so a soft tone has nothing but its
   * background to separate it from what it sits on, and two soft backgrounds measure
   * 1.04:1 against each other. Inside a toned `Banner` a soft tag dissolves; a solid one
   * is opaque and holds anywhere.
   *
   * Almost every tag in the product is on a neutral surface — a table cell, a white card,
   * a list row — which is why `soft-*` outnumbers solid there roughly fifteen to one.
   *
   * The canonical composition is § 4.3 of docs/guides/design-system.md, which pairs
   * `mo-banner--amber` with a **solid** `mo-tag--amber`. Cite it before reversing this:
   * the guide's token table separately describes `soft-*` as « tinted-background
   * (lower-contrast) », which is what they *are*, not where they go — reading that as
   * placement guidance is how this sentence came to say the opposite of the example.
   */
  tone?: TagTone
}

/**
 * The `.mo-tag` primitive: a short semantic label — Substitution, Inactif, Motif
 * requis. Sentence case, one or two words. For a data value (a code, a name)
 * reach for `Chip` instead.
 */
export function Tag({ tone = 'muted', className, children, ...props }: TagProps) {
  return (
    <span className={['mo-tag', `mo-tag--${tone}`, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </span>
  )
}
