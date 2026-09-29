import { useId, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export interface WizardStep<T extends string> {
  id: T
  title: ReactNode
  /** Rendered when the step is open. */
  content: ReactNode
  /**
   * Why the step cannot be opened yet — « Choisir un projet d'abord ». Its
   * presence is what locks the step, so a gate with no sentence is impossible.
   */
  gate?: ReactNode
}

interface WizardProps<T extends string> {
  steps: readonly WizardStep<T>[]
  /** The open step. Only one opens at a time: these are stages, not sections. */
  open: T | null
  onOpen: (id: T | null) => void
  className?: string
}

/**
 * The `.mo-wizard` primitive: numbered stages down the page, one open at a time.
 *
 * A locked stage stays visible and says what it is waiting for. Hiding it would
 * make the form grow as it is filled, and the reader could never see how much
 * work is left.
 */
export function Wizard<T extends string>({ steps, open, onOpen, className }: WizardProps<T>) {
  const prefix = useId()

  return (
    <div className={['mo-wizard', className].filter(Boolean).join(' ')}>
      {steps.map((step, index) => {
        const locked = step.gate !== undefined
        const isOpen = step.id === open && !locked
        const bodyId = `${prefix}-${step.id}`

        return (
          <section
            key={step.id}
            className={['mo-step', isOpen && 'is-open'].filter(Boolean).join(' ')}
          >
            <button
              type="button"
              className="mo-step-head"
              aria-expanded={isOpen}
              aria-controls={bodyId}
              disabled={locked}
              onClick={() => onOpen(isOpen ? null : step.id)}
            >
              <span className="mo-step-n" aria-hidden="true">
                {index + 1}
              </span>
              <span className="mo-step-title">{step.title}</span>
              <ChevronDown className="mo-step-caret" size={16} aria-hidden="true" />
            </button>
            <div className="mo-step-body" id={bodyId}>
              {locked ? <p className="mo-step-gate">{step.gate}</p> : isOpen && step.content}
            </div>
          </section>
        )
      })}
    </div>
  )
}
