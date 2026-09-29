import { useEffect, useMemo, useState } from 'react'
import type { Result } from 'axe-core'
import type { Marker, Severity } from './types'

/**
 * Runs axe-core over the live page and turns every violation into a marker anchored on
 * the element that failed.
 *
 * axe is loaded dynamically: it is the overlay's one heavy dependency (~600 kB), and
 * keeping it behind `import()` means a production bundle carries it as a chunk nobody
 * fetches unless the flag is on.
 *
 * Re-running is `revision`'s job and only `revision`'s. This used to keep a second
 * counter of its own for the HUD's « Relancer », which is why that button re-ran the scan
 * and left the advisories where they were — half a refresh, on a button that says it does
 * the whole thing.
 */

/** axe's impact scale, mapped onto the rubric's three severities. */
function severityOf(impact: string | null | undefined): Severity {
  if (impact === 'critical' || impact === 'serious') return 'HAUT'
  if (impact === 'moderate') return 'MOYEN'
  return 'BAS'
}

/**
 * One marker per failing node. A node axe could not hand back an element for is dropped:
 * there is nothing to draw it on, and the alternative — a marker in a corner — points at
 * the wrong component.
 */
function toMarkers(violations: Result[]): Marker[] {
  return violations.flatMap((violation) =>
    violation.nodes.flatMap((node, index) =>
      node.element
        ? [
            {
              id: `a11y:${violation.id}:${index}`,
              kind: 'a11y' as const,
              severity: severityOf(node.impact ?? violation.impact),
              title: violation.id,
              detail: node.failureSummary || violation.help,
              element: node.element,
              helpUrl: violation.helpUrl,
            },
          ]
        : [],
    ),
  )
}

export interface AxeScan {
  markers: Marker[]
  scanning: boolean
  error: string | null
}

export function useAxeScan(
  enabled: boolean,
  revision: number,
  disabledRules: readonly string[] = [],
): AxeScan {
  const [markers, setMarkers] = useState<Marker[]>([])
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Keyed off the joined names rather than the array: a caller passing a literal would
  // otherwise hand a new array every render, and the effect below would scan for ever.
  const ruleKey = disabledRules.join(',')
  const rules = useMemo(
    () =>
      Object.fromEntries(
        ruleKey ? ruleKey.split(',').map((rule) => [rule, { enabled: false }]) : [],
      ),
    [ruleKey],
  )

  useEffect(() => {
    if (!enabled) {
      setMarkers([])
      return
    }

    let cancelled = false
    setScanning(true)
    setError(null)

    void (async () => {
      try {
        const axe = (await import('axe-core')).default

        // The overlay's own chrome is not the application's accessibility — excluding it
        // keeps the scan from reporting the tool to itself.
        const results = await axe.run(
          { exclude: [['[data-mo-dev-overlay]']] },
          {
            elementRef: true,
            resultTypes: ['violations'],
            rules,
          },
        )
        if (cancelled) return

        setMarkers(toMarkers(results.violations))
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause))
      } finally {
        if (!cancelled) setScanning(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [enabled, revision, rules])

  return { markers, scanning, error }
}
