import type { Marker } from './types'

/** The finding in full, once its marker has been clicked. */
export function MarkerDetail({ marker, onClose }: { marker: Marker; onClose: () => void }) {
  return (
    <div className="mo-dev__detail" data-severity={marker.severity}>
      <strong>{marker.title}</strong>
      <p>{marker.detail}</p>
      {marker.ruleId && (
        <p className="mo-dev__rule">
          Règle <code>{marker.ruleId}</code>
        </p>
      )}
      {marker.helpUrl && (
        <a href={marker.helpUrl} target="_blank" rel="noreferrer">
          Documentation de la règle
        </a>
      )}
      <button type="button" onClick={onClose}>
        Fermer
      </button>
    </div>
  )
}
