import { useRef, type KeyboardEvent, type ReactNode } from 'react'

export interface TabItem<T extends string> {
  id: T
  label: ReactNode
  /** A number riding on the tab — pending rows, unread items. Hidden at 0. */
  count?: number
  /** Marks a count that wants attention rather than a neutral total. */
  countTone?: 'attention'
  icon?: ReactNode
  disabled?: boolean
}

interface TabsProps<T extends string> {
  items: readonly TabItem<T>[]
  value: T
  onChange: (id: T) => void
  /** Names the row for assistive tech — « Sections de la réquisition ». */
  label: string
  className?: string
}

const STEP: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }

/**
 * Where a key press lands, or undefined if the key is not one of ours.
 *
 * Pulled out of the component so the wrap arithmetic is readable on its own:
 * modulo on a negative index does not wrap in JS, hence the extra length.
 */
function nextId<T extends string>(key: string, items: readonly TabItem<T>[], current: T): T | undefined {
  const selectable = items.filter((item) => !item.disabled)
  if (selectable.length === 0) return undefined

  if (key === 'Home') return selectable[0].id
  if (key === 'End') return selectable[selectable.length - 1].id

  const step = STEP[key]
  if (step === undefined) return undefined

  const index = selectable.findIndex((item) => item.id === current)
  return selectable[(index + step + selectable.length) % selectable.length].id
}

function TabButton<T extends string>({
  item,
  active,
  onSelect,
  register,
}: {
  item: TabItem<T>
  active: boolean
  onSelect: () => void
  register: (node: HTMLButtonElement | null) => void
}) {
  return (
    <button
      ref={register}
      id={`${item.id}-tab`}
      type="button"
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      disabled={item.disabled}
      className={['mo-tab', active && 'is-active'].filter(Boolean).join(' ')}
      onClick={onSelect}
    >
      {item.icon}
      {item.label}
      {item.count !== undefined && <CountBadge count={item.count} tone={item.countTone} />}
    </button>
  )
}

/**
 * The `.mo-tabs` primitive: one row of routes through the same record.
 *
 * Arrow keys move the selection and the focus, Home/End jump to the ends, and
 * only the selected tab is in the tab order. That roving focus is the whole
 * reason this exists as a component — every hand-rolled tab row in the app
 * shipped a plain list of buttons, which the ARIA tabs pattern does not allow.
 *
 * The panel stays the caller's: these are the tabs, not a tab *container*.
 * Give the panel `role="tabpanel"` and `aria-labelledby={`${id}-tab`}`.
 */
export function Tabs<T extends string>({ items, value, onChange, label, className }: TabsProps<T>) {
  const refs = useRef(new Map<T, HTMLButtonElement>())

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = nextId(event.key, items, value)
    if (next === undefined) return
    event.preventDefault()
    onChange(next)
    refs.current.get(next)?.focus()
  }

  return (
    <div
      className={['mo-tabs', className].filter(Boolean).join(' ')}
      role="tablist"
      aria-label={label}
      onKeyDown={move}
    >
      {items.map((item) => (
        <TabButton
          key={item.id}
          item={item}
          active={item.id === value}
          onSelect={() => onChange(item.id)}
          register={(node) => {
            if (node) refs.current.set(item.id, node)
            else refs.current.delete(item.id)
          }}
        />
      ))}
    </div>
  )
}

interface CountBadgeProps {
  count: number
  /** Amber, for a count the reader is meant to act on rather than just read. */
  tone?: 'attention'
  /** Spelled-out count for screen readers — « 3 lignes en attente ». */
  ariaLabel?: string
  className?: string
}

/**
 * The `.mo-count` primitive: a number riding on something else — a tab, a nav
 * link, a section head.
 *
 * Renders nothing at 0 (a badge reading "0" is noise) and caps at 99+, which is
 * what every hand-rolled copy of this in the sidebar already did.
 */
export function CountBadge({ count, tone, ariaLabel, className }: CountBadgeProps) {
  if (count <= 0) return null
  return (
    <span
      className={['mo-count', tone && `mo-count--${tone}`, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
