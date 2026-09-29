import { useCallback, useState } from 'react'

/** What the HUD remembers between sessions. */
export interface Preferences {
  open: boolean
  a11y: boolean
  advisories: boolean
  /**
   * Whether a marker takes the pointer.
   *
   * Off by default, and that is the point: a marker is drawn over the whole rectangle of the
   * element it is about, so an interactive one sits between you and the control it annotates.
   * With a dozen findings on a page, the application underneath stops being clickable — you
   * cannot press the button the advisory is *about*. Off, the markers are annotation you look
   * at and click straight through; on, they are targets you can pick to read the detail.
   */
  pickable: boolean
}

const DEFAULTS: Preferences = { open: false, a11y: true, advisories: true, pickable: false }
const STORAGE_KEY = 'mo-dev-overlay'

function read(): Preferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...DEFAULTS, ...(JSON.parse(stored) as Partial<Preferences>) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

/**
 * The HUD's own state, persisted per browser. Storage being unavailable costs the memory
 * of the setting, never the overlay: every access is guarded and falls back to defaults.
 */
export function usePreferences(): [Preferences, (change: Partial<Preferences>) => void] {
  const [preferences, setPreferences] = useState<Preferences>(read)

  const update = useCallback(
    (change: Partial<Preferences>) =>
      setPreferences((current) => {
        const next = { ...current, ...change }

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          // A browser with storage blocked still gets a working overlay, just not a
          // remembered one.
        }

        return next
      }),
    [],
  )

  return [preferences, update]
}
