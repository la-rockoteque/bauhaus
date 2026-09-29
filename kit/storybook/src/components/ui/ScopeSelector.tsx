interface ScopeOption<T extends string> {
  value: T
  label: string
  /**
   * Marks an option that changes what the surrounding action *means* — "Tous les
   * outils" enabling substitution, say. It is a semantic warning, not a style.
   */
  warn?: boolean
}

interface ScopeSelectorProps<T extends string> {
  options: ScopeOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Names the group for assistive tech — « Portée de la recherche ». */
  label: string
  className?: string
}

/**
 * The `.mo-scope` primitive: a compact segmented control for 2–4 mutually
 * exclusive options that should all stay visible. Past four, or with long
 * labels, use a select instead.
 *
 * `role="tablist"` matches the markup in the design-system guide. The buttons
 * carry `aria-selected` rather than `disabled`, so an unselected option stays
 * reachable by keyboard.
 */
export function ScopeSelector<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: ScopeSelectorProps<T>) {
  return (
    <div className={['mo-scope', className].filter(Boolean).join(' ')} role="tablist" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          className={[
            'mo-scope-btn',
            option.warn && 'mo-scope-btn--warn',
            option.value === value && 'is-active',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
