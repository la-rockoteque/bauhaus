/** The three severities the `ui-ux-designer` agent reports against (its § Report format). */
export type Severity = 'HAUT' | 'MOYEN' | 'BAS'

/**
 * One finding from the UI/UX review, as the agent writes it into `advisories.ts`.
 *
 * `ref` is the agent's own `<file:line>` anchor — either repo-relative
 * (`src/pages/Home/Home.tsx:42`) or just the basename (`Home.tsx:42`); both resolve.
 * `selector` is the escape hatch for a target no stamp can carry: a pseudo-element, a
 * cell a grid generates, a node rendered by a dependency.
 */
export interface Advisory {
  /**
   * The benchmark rule this finding breaks — `data-table.numeric-mono`.
   *
   * Optional, and its absence is itself information: a finding with no rule behind it
   * is one the benchmark does not yet ask about, so it says « write this rule » as much
   * as « fix this component ». `benchmark.test.ts` refuses an id that names no rule, and
   * refuses a known violation that no advisory draws.
   */
  ruleId?: string
  ref?: string
  selector?: string
  /** Paint only when `location.pathname` starts with this. Omitted means every route. */
  route?: string
  severity: Severity
  /** The rubric rule the finding cites, e.g. `§2.7 tables`. */
  rule?: string
  message: string
}

/** A finding resolved to a live element and ready to be painted. */
export interface Marker {
  id: string
  /** The benchmark rule the finding breaks, when it names one. See `Advisory.ruleId`. */
  ruleId?: string
  kind: 'advisory' | 'a11y'
  severity: Severity
  title: string
  detail: string
  element: Element
  helpUrl?: string
}
