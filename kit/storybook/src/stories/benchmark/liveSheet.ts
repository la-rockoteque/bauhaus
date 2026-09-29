import { DECLARATIONS, INVENTORY_IS_BOUND, TOKENS } from '../foundations/styleInventory'
import { AUTO_CHECKS } from './autoChecks'
import type { Sheet } from './checks'

/**
 * The benchmark run against the live stylesheet, for the Storybook pages.
 *
 * The same checks `benchmark.test.ts` runs, over the same declarations — but here the
 * `?raw` imports actually carry content (under vitest they do not; see
 * `styleInventory.ts`). So the pages grade the system as it stands rather than printing
 * a transcribed verdict that rots.
 *
 * `INVENTORY_IS_BOUND` is the guard: with no CSS text every check would report a missing
 * selector and the page would claim the whole system fails.
 */
const sheet: Sheet = { declarations: DECLARATIONS, tokens: TOKENS }

export type Verdict = 'réussi' | 'échoué' | 'revue' | 'indisponible'

export interface Graded {
  verdict: Verdict
  /** Why it failed, when it did. */
  reason?: string
}

export function grade(ruleId: string, verify: 'auto' | 'review'): Graded {
  if (verify === 'review') return { verdict: 'revue' }
  if (!INVENTORY_IS_BOUND) return { verdict: 'indisponible' }

  const check = AUTO_CHECKS[ruleId]
  if (!check) return { verdict: 'indisponible' }

  const failure = check(sheet)

  return failure ? { verdict: 'échoué', reason: failure } : { verdict: 'réussi' }
}
