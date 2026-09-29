import type { Marker } from './types'

/**
 * One box per finding, each sitting on the rectangle of the element it is about.
 *
 * Positions come from `getBoundingClientRect()` at render time and the container is
 * `position: fixed`, so viewport coordinates need no scroll arithmetic — they only need
 * a re-render, which `useViewportTick` provides.
 *
 * **A marker does not take the pointer unless asked.** It covers the whole rectangle of its
 * element, so an interactive one sits between you and the control it annotates: with a dozen
 * findings on a page the application underneath stopped being clickable, and the button an
 * advisory was *about* could not be pressed. Off, a marker is annotation — you look at it and
 * click through it. On (« Marqueurs cliquables » in the HUD), it is a target you can pick to
 * read the detail, which is the only reason it ever needs the pointer.
 */
export function MarkerLayer({
  markers,
  selected,
  pickable,
  onSelect,
}: {
  markers: readonly Marker[]
  selected: string | null
  pickable: boolean
  onSelect: (id: string) => void
}) {
  return (
    <div className="mo-dev__layer" data-pickable={pickable}>
      {markers.map((marker) => (
        <MarkerBox
          key={marker.id}
          marker={marker}
          active={marker.id === selected}
          pickable={pickable}
          onSelect={() => onSelect(marker.id)}
        />
      ))}
    </div>
  )
}

function MarkerBox({
  marker,
  active,
  pickable,
  onSelect,
}: {
  marker: Marker
  active: boolean
  pickable: boolean
  onSelect: () => void
}) {
  const rect = marker.element.getBoundingClientRect()

  // A marker whose element has been unmounted or collapsed has nothing to sit on.
  if (rect.width === 0 && rect.height === 0) return null

  const style = { top: rect.top, left: rect.left, width: rect.width, height: rect.height }

  // A plain <div> rather than a disabled <button>: a non-pickable marker is not a control in
  // any state, and leaving a dozen of them in the tab order made Tab walk every finding on the
  // page before reaching the form underneath.
  if (!pickable) {
    return (
      <div
        className="mo-dev__marker"
        data-kind={marker.kind}
        data-severity={marker.severity}
        data-active={active}
        aria-hidden="true"
        style={style}
      >
        <span className="mo-dev__badge">{marker.title}</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      className="mo-dev__marker"
      data-kind={marker.kind}
      data-severity={marker.severity}
      data-active={active}
      onClick={onSelect}
      style={style}
    >
      <span className="mo-dev__badge">{marker.title}</span>
    </button>
  )
}
