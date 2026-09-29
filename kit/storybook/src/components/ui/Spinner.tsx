import './Spinner.css'

interface SpinnerProps {
  /** 16 px inside a button or a row; 32 px on its own, in the loading overlay. */
  size?: 'sm' | 'lg'
  className?: string
}

/**
 * The `.mo-spinner` primitive. Always `aria-hidden`: a spinner alone says nothing to a
 * screen reader, so the busy state belongs to whatever holds it — `Button pending`, or
 * `LoadingOverlay`'s label.
 */
export function Spinner({ size = 'sm', className }: SpinnerProps) {
  return (
    <span
      className={['mo-spinner', size === 'lg' && 'mo-spinner--lg', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  )
}
