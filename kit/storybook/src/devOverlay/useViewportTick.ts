import { useEffect, useState } from 'react'

/**
 * Re-renders the overlay whenever the page scrolls or resizes.
 *
 * Markers are drawn from live `getBoundingClientRect()` values, so their positions are
 * only correct for the frame they were read in. One re-render per frame at most: this
 * runs on every wheel tick of a working application.
 */
export function useViewportTick(): void {
  const [, setTick] = useState(0)

  useEffect(() => {
    let frame = 0

    const schedule = () => {
      if (frame) return

      frame = requestAnimationFrame(() => {
        frame = 0
        setTick((value) => value + 1)
      })
    }

    window.addEventListener('scroll', schedule, { capture: true, passive: true })
    window.addEventListener('resize', schedule, { passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule, { capture: true })
      window.removeEventListener('resize', schedule)
    }
  }, [])
}
