import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Spinner } from './Spinner'
import './LoadingOverlay.css'

interface LoadingOverlayProps {
  /** Names the operation — « Téléversement du fichier… », never a bare « Chargement… ». */
  label: string
  /** What the user must not do meanwhile — « Ne fermez pas l’onglet. » */
  detail?: string
}

/**
 * The `.mo-overlay` primitive: a wait the user has to sit through (upload, download, bulk
 * create). Mount it for the length of the wait; the page behind turns `inert` at once —
 * no click, no Tab, no screen-reader cursor reaches it — and focus comes back where it
 * was on unmount.
 *
 * No Escape and no close: it covers operations that cannot be cancelled once sent.
 */
export function LoadingOverlay({ label, detail }: LoadingOverlayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const labelId = useId()
  const detailId = useId()

  useEffect(() => {
    const overlay = ref.current
    if (!overlay) return undefined

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    // ponytail: one overlay at a time; a second one would release the page when the first unmounts.
    const blocked = [...document.body.children].filter(
      (element) => element !== overlay && !element.hasAttribute('inert'),
    )
    blocked.forEach((element) => element.setAttribute('inert', ''))
    overlay.focus()

    return () => {
      blocked.forEach((element) => element.removeAttribute('inert'))
      previous?.focus()
    }
  }, [])

  return createPortal(
    <div
      ref={ref}
      className="mo-overlay"
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-labelledby={labelId}
      aria-describedby={detail ? detailId : undefined}
      tabIndex={-1}
    >
      <div className="mo-overlay-panel">
        <Spinner size="lg" />
        <p id={labelId} className="mo-overlay-label">
          {label}
        </p>
        {detail && (
          <p id={detailId} className="mo-overlay-detail">
            {detail}
          </p>
        )}
      </div>
    </div>,
    document.body,
  )
}
