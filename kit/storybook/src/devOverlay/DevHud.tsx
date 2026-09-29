import type { Inspector } from './useInspector'
import type { Preferences } from './usePreferences'

export interface HudCounts {
  advisories: number
  /**
   * Advisories that apply here but found no element on this page.
   *
   * Almost always because the component they are about is not rendered right now:
   * findings are anchored per component, not per route, so any one page shows a
   * minority of them. **This is not a count of broken anchors** — a genuinely dead
   * anchor is indistinguishable from an absent component from in here, and saying
   * « sans ancrage » made a normal state read as a fault.
   */
  elsewhere: number
  a11y: number
  scanning: boolean
  error: string | null
}

/**
 * The control panel: what is on, how much of it there is, and the two actions.
 *
 * Its prose is French and untranslated on purpose — developer chrome never reaches a
 * user, so it carries the same `jsx-no-literals` exemption Storybook does.
 */
export function DevHud({
  preferences,
  update,
  counts,
  inspector,
  onRescan,
}: {
  preferences: Preferences
  update: (change: Partial<Preferences>) => void
  counts: HudCounts
  inspector: Inspector
  onRescan: () => void
}) {
  if (!preferences.open) {
    return (
      <button type="button" className="mo-dev__tab" onClick={() => update({ open: true })}>
        {counts.advisories + counts.a11y}
      </button>
    )
  }

  return (
    <div className="mo-dev__hud" role="dialog" aria-label="Superposition de développement">
      <header>
        <strong>Dev overlay</strong>
        <button type="button" onClick={() => update({ open: false })} title="Ctrl+Shift+D">
          ✕
        </button>
      </header>

      <label>
        <input
          type="checkbox"
          checked={preferences.advisories}
          onChange={(event) => update({ advisories: event.target.checked })}
        />
        Avis UI/UX ({counts.advisories})
      </label>
      {counts.elsewhere > 0 && (
        <p className="mo-dev__note">{counts.elsewhere} autres avis, sur d'autres composants</p>
      )}

      <label>
        <input
          type="checkbox"
          checked={preferences.a11y}
          onChange={(event) => update({ a11y: event.target.checked })}
        />
        Violations a11y ({counts.a11y})
      </label>
      {counts.scanning && <p className="mo-dev__note">Analyse en cours…</p>}
      {counts.error && <p className="mo-dev__note mo-dev__note--error">{counts.error}</p>}

      <label>
        <input
          type="checkbox"
          checked={preferences.pickable}
          onChange={(event) => update({ pickable: event.target.checked })}
        />
        Marqueurs cliquables
      </label>
      <p className="mo-dev__note">
        {preferences.pickable
          ? "Les marqueurs prennent le clic — l'application dessous ne répond pas."
          : "Les marqueurs laissent passer le clic. Cochez pour en ouvrir le détail."}
      </p>

      <div className="mo-dev__actions">
        <button type="button" onClick={onRescan}>
          Relancer
        </button>
        <button type="button" onClick={inspector.toggle} data-active={inspector.inspecting}>
          {inspector.inspecting ? 'Cliquez un élément…' : 'Inspecter'}
        </button>
      </div>

      {inspector.picked && <code className="mo-dev__picked">{inspector.picked}</code>}
    </div>
  )
}
