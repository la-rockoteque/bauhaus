import { resolveAdvisory } from './resolveAnchor'
import type { Advisory, Marker } from './types'

/** Whether an advisory applies to the route currently on screen. */
export function appliesToRoute(advisory: Advisory, pathname: string): boolean {
  return !advisory.route || pathname.startsWith(advisory.route)
}

/**
 * Resolves each advisory that applies to this route to the element it is about.
 * An advisory whose anchor finds nothing is dropped rather than parked in a corner —
 * a marker floating over the wrong component is worse than a missing one, and the HUD
 * reports the count so the gap is visible.
 */
export function buildAdvisoryMarkers(
  advisories: readonly Advisory[],
  pathname: string,
  scope: ParentNode = document,
): Marker[] {
  return advisories.flatMap((advisory, index) => {
    if (!appliesToRoute(advisory, pathname)) return []

    const element = resolveAdvisory(advisory, scope)
    if (!element) return []

    return [
      {
        id: `advisory:${index}`,
        ruleId: advisory.ruleId,
        kind: 'advisory' as const,
        severity: advisory.severity,
        title: advisory.rule ?? 'UI/UX',
        detail: advisory.message,
        element,
      },
    ]
  })
}
