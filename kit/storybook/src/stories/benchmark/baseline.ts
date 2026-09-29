/**
 * The rules the system does not satisfy today.
 *
 * A ratchet, and the same argument as `legacyTokens.ratchet.test.ts`: ADR-0026 forbade
 * something only review could catch and watched the debt grow while it was in force, so
 * the rule is paired with a list that can only shrink. `benchmark.test.ts` asserts the
 * failing set equals this one **in both directions** — a new violation fails because it
 * is not listed, and a fixed one fails because it still is, which is what keeps the list
 * honest instead of stale.
 *
 * It lists ids rather than a count, so the message names the rule instead of sending
 * someone to their own diff. **Removing an entry is the progress record.**
 *
 * Every id here is also carried by an advisory in `src/devOverlay/advisories.ts`, which
 * is what draws it over the component in Storybook. The test enforces that too: a known
 * violation nobody can see is one nobody fixes.
 */
export const KNOWN_VIOLATIONS: readonly string[] = [
  'button.disabled-tokens',
  'chip.truncates-long-value',
  'count-badge.mono',
  'data-table.numeric-mono',
  'disclosure.focus-ring',
  'dropzone.disabled-contrast',
  'hud.count-mono',
  'icon-button.focus-ring',
  'icon-button.touch-target',
  'list-card.focus-ring',
  'pager.info-mono',
  'section-head.hint-contrast',
  'summary-rail.empty-value-contrast',
  'summary-rail.no-uppercase-label',
  'summary-rail.value-mono',
  'tabs.focus-ring',
  'wizard.step-focus-ring',
]
