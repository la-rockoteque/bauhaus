import { useCallback, useEffect, useState } from 'react'
import { nearestRef } from './resolveAnchor'

export interface Inspector {
  inspecting: boolean
  /** The reference the last pick read back, or why it read none. */
  picked: string | null
  toggle: () => void
}

/**
 * Click-to-anchor: while inspecting, a click anywhere reads back the `data-mo-src` the
 * build stamped on the nearest element and copies it. That string is what an advisory
 * has to cite to be placed, so this is how one gets written.
 *
 * The click is swallowed in the capture phase — picking an anchor must not also submit
 * the form the anchor happens to sit on.
 */
export function useInspector(): Inspector {
  const [inspecting, setInspecting] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)

  const toggle = useCallback(() => setInspecting((value) => !value), [])

  useEffect(() => {
    if (!inspecting) return

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null

      if (target?.closest('[data-mo-dev-overlay]')) return

      event.preventDefault()
      event.stopPropagation()

      const ref = nearestRef(target)
      setPicked(ref ?? 'aucun data-mo-src sur cet élément')
      setInspecting(false)

      if (ref) void navigator.clipboard?.writeText(ref).catch(() => undefined)
    }

    document.addEventListener('click', onClick, true)

    return () => document.removeEventListener('click', onClick, true)
  }, [inspecting])

  return { inspecting, picked, toggle }
}
