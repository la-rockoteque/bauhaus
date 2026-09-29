import type { Severity } from '../../devOverlay/types'

/**
 * How a rule is established.
 *
 * `auto` — asserted against the stylesheet or the rendered primitive in
 * `benchmark.test.ts`. A violation is a test failure, not an opinion.
 * `review` — needs judgement (is this the right primitive for this data? does this
 * disabled state explain itself?). The dev overlay is where these land, as advisories.
 */
export type Verify = 'auto' | 'review'

/**
 * One expectation a primitive is held to — the unit of the benchmark.
 *
 * The benchmark is what the review grades *against*, so that a pass is reportable and
 * not merely an absence of comment: a component with fifteen rules and no finding has
 * been checked fifteen times, while a component with no rules has never been checked at
 * all. That distinction is the whole reason the ids exist.
 */
export interface Rule {
  /**
   * Stable and cited by findings — `data-table.numeric-mono`. Renaming one orphans
   * every advisory that points at it, which `benchmark.test.ts` refuses, so treat it
   * as permanent once written.
   */
  id: string
  /** The primitive it grades, spelled as `components/ui/` names the file. */
  component: string
  /** The rubric section it comes from: `§2.7 tableaux`. Short — it labels the marker. */
  rubric: string
  /** The severity a violation of this rule carries. */
  severity: Severity
  /** What must be true, one French sentence, in the affirmative. */
  expectation: string
  /** The value the rule names, when it names one: `--mo-radius-md`, `44px`. */
  expected?: string
  verify: Verify
  /**
   * Checklist items this rule establishes, by id — see `a11y/checklist.ts`.
   *
   * This is what turns the checklist from a list someone walks into per-component
   * coverage: an item a rule claims is answered, with a live verdict, and an item nothing
   * claims is « à vérifier ». `benchmark.test.ts` refuses an id that names no item, so a
   * claim cannot quietly point at nothing.
   */
  covers?: readonly string[]
}
