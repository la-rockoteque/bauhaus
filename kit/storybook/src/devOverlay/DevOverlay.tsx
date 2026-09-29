import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { advisories } from './advisories'
import { appliesToRoute, buildAdvisoryMarkers } from './buildAdvisoryMarkers'
import { DevHud } from './DevHud'
import { MarkerDetail } from './MarkerDetail'
import { MarkerLayer } from './MarkerLayer'
import { useAxeScan } from './useAxeScan'
import { useInspector } from './useInspector'
import { usePreferences } from './usePreferences'
import { useViewportTick } from './useViewportTick'
import type { Marker } from './types'
import './DevOverlay.css'

/**
 * The development overlay: UI/UX advisories and accessibility violations drawn over the
 * components they are about.
 *
 * This component only wires the pieces together — the state each layer needs lives in its
 * own hook, and the chrome in its own component.
 *
 * `disabledRules` turns off axe rules that do not mean anything on the host it is mounted
 * in. Storybook uses it for `region`: a story renders bare, outside any landmark, so the
 * rule fires on every cell of every page and buries the component findings underneath it.
 * The application passes nothing and gets the full ruleset.
 */

/** How long the DOM is given to settle after a navigation before anything is resolved. */
export const SETTLE_MS = 400

export function DevOverlay({ disabledRules }: { disabledRules?: readonly string[] } = {}) {
  const { pathname } = useLocation()
  const [preferences, update] = usePreferences()
  const [revision, setRevision] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [advisoryMarkers, setAdvisoryMarkers] = useState<Marker[]>([])
  const inspector = useInspector()

  useViewportTick()

  // Re-resolve everything once the new route has had a chance to render.
  useEffect(() => {
    const timer = setTimeout(() => setRevision((value) => value + 1), SETTLE_MS)

    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    // Through a frame rather than straight out of the effect: resolving reads layout, so
    // it wants the browser to have laid the new route out first — and a synchronous
    // setState here is a cascading render the compiler rightly refuses.
    const frame = requestAnimationFrame(() =>
      setAdvisoryMarkers(preferences.advisories ? buildAdvisoryMarkers(advisories, pathname) : []),
    )

    return () => cancelAnimationFrame(frame)
  }, [preferences.advisories, pathname, revision])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey || !event.shiftKey || event.key.toLowerCase() !== 'd') return

      event.preventDefault()
      update({ open: !preferences.open })
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [preferences.open, update])

  const scan = useAxeScan(preferences.a11y, revision, disabledRules)

  const markers = useMemo(
    () => [...advisoryMarkers, ...scan.markers],
    [advisoryMarkers, scan.markers],
  )

  const onRoute = preferences.advisories
    ? advisories.filter((advisory) => appliesToRoute(advisory, pathname)).length
    : 0

  const selectedMarker = markers.find((marker) => marker.id === selected) ?? null

  return (
    <div data-mo-dev-overlay="" className="mo-dev">
      <MarkerLayer
        markers={markers}
        selected={selected}
        pickable={preferences.pickable}
        onSelect={(id) => setSelected((current) => (current === id ? null : id))}
      />

      {selectedMarker && (
        <MarkerDetail marker={selectedMarker} onClose={() => setSelected(null)} />
      )}

      <DevHud
        preferences={preferences}
        update={update}
        counts={{
          advisories: advisoryMarkers.length,
          elsewhere: onRoute - advisoryMarkers.length,
          a11y: scan.markers.length,
          scanning: scan.scanning,
          error: scan.error,
        }}
        inspector={inspector}
        onRescan={() => setRevision((value) => value + 1)}
      />
    </div>
  )
}
