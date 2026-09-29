export interface MountConditions {
  /** The vitest run. It sets DEV too, and an overlay scanning every route would tax the suite. */
  isTest: boolean
  /** `VITE_DEV_OVERLAY=true` — the dev server was launched asking for the overlay. */
  askedFor: boolean
  /** The `DevOverlay` feature flag, for environments with no shell to set a variable in. */
  flagged: boolean
}

/**
 * Whether the overlay draws at all. **Off unless something asks for it**, which merely
 * running the application never does: it is a review tool, not a companion to feature
 * work. See `DevOverlayMount`.
 */
export function shouldMount({ isTest, askedFor, flagged }: MountConditions): boolean {
  if (isTest) return false

  return askedFor || flagged
}
