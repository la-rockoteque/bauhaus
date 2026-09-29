import { grade, type Verdict } from '../liveSheet'
import { rulesFor } from '../rules'
import type { Rule } from '../types'
import { COMPONENT_ITEMS } from './checklist'
import type { ChecklistItem } from './types'

export interface Covered {
  item: ChecklistItem
  /** The rule that establishes it, when one does. */
  rule?: Rule
  /** The rule's live verdict, or `à vérifier` when no rule claims the item. */
  verdict: Verdict | 'à vérifier'
  reason?: string
}

/**
 * The accessibility checklist as it stands for one primitive.
 *
 * Every component-scoped item, in checklist order, each carrying the barème rule that
 * establishes it if one does. **An item nothing claims reads « à vérifier », not
 * « réussi »** — that distinction is the whole point: a component nobody has checked
 * against an item must not look like one that passes it.
 */
export function coverageFor(component: string): Covered[] {
  const rules = rulesFor(component)

  return COMPONENT_ITEMS.map((item) => {
    const rule = rules.find((candidate) => candidate.covers?.includes(item.id))

    if (!rule) return { item, verdict: 'à vérifier' as const }

    const graded = grade(rule.id, rule.verify)

    return { item, rule, verdict: graded.verdict, reason: graded.reason }
  })
}

/** How many items the barème claims for this primitive, out of the component-scoped total. */
export function claimedCount(component: string): { claimed: number; total: number } {
  const covered = coverageFor(component)

  return {
    claimed: covered.filter((entry) => entry.rule !== undefined).length,
    total: covered.length,
  }
}
