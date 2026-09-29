import type { ReactNode } from 'react'

interface SectionHeadProps {
  title: string
  /** Trailing note — « Optionnel », a count, a unit. */
  hint?: ReactNode
  /** Heading level, so a section inside a section does not restart at h3. */
  level?: 2 | 3 | 4
  className?: string
}

/**
 * The `.mo-section-head` primitive: a section title with an optional trailing
 * hint and a hairline rule underneath. With a single section on the page you do
 * not need it.
 */
export function SectionHead({ title, hint, level = 3, className }: SectionHeadProps) {
  const Heading = `h${level}` as const

  return (
    <header className={['mo-section-head', className].filter(Boolean).join(' ')}>
      <Heading className="mo-section-title">{title}</Heading>
      {hint !== undefined && <span className="mo-section-hint">{hint}</span>}
    </header>
  )
}
