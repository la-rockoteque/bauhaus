import { useId, useState, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface DisclosureProps {
  summary: ReactNode
  children: ReactNode
  /** Open on first render. Leave off — a closed section is the whole point. */
  defaultOpen?: boolean
  /** Sits at the right of the summary row — a count, a status tag. */
  aside?: ReactNode
  className?: string
}

/**
 * The `.mo-disclosure` primitive: a section that opens.
 *
 * A `<button aria-expanded>` rather than `<details>/<summary>`: the native pair
 * cannot animate its caret reliably across browsers and swallows the click
 * target's role, and half the app's expanders already needed a controlled state.
 * The body unmounts when closed, so a heavy panel costs nothing until asked for.
 */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  aside,
  className,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyId = useId()

  return (
    <div className={['mo-disclosure', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className="mo-disclosure-summary"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((was) => !was)}
      >
        <ChevronRight className="mo-disclosure-caret" size={14} aria-hidden="true" />
        <span>{summary}</span>
        {aside}
      </button>
      {open && (
        <div className="mo-disclosure-body" id={bodyId}>
          {children}
        </div>
      )}
    </div>
  )
}
