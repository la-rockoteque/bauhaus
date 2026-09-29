import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The migration ratchet for ADR-0032 — legacy tokens out, `--mo-*` in.
 *
 * ADR-0026 is why this file exists rather than a line in a guide. It forbade business
 * logic in controllers and watched the debt go from 16 to 20 while it was in force: "une
 * règle que seule la vigilance en revue peut faire respecter n'est pas une règle". The
 * Boy Scout Rule in ADR-0032 is exactly that kind of rule, so it is paired with a number
 * that can only go down.
 *
 * Both directions fail on purpose. Going UP means a file reached for a legacy token when
 * `--mo-*` had an equivalent. Going DOWN means someone did the work and owes this file a
 * one-line edit — which is how the ADR keeps a truthful count of what is left.
 *
 * It counts FILES, not occurrences, and that is the limit to know: adding a legacy token
 * to a file that already holds one moves nothing. The unit is deliberate — the Boy Scout
 * Rule is "migrate the file you touch", so the file is what the number should measure, and
 * an occurrence count would shift on every edit to a dirty file until someone suppressed
 * it. A file that gets dirtier is caught in review; a clean file that regresses is caught
 * here.
 */

const STYLES = __dirname
const SRC = join(STYLES, '..')

/**
 * Files that may hold legacy tokens without counting as debt.
 *
 * `index.css` DEFINES the legacy set — it is the last file to migrate, not the first, and
 * counting it would pin a 1 that never moves. `design-system.css` is the target itself.
 * `stories/` is documentation about the tokens, and says both names on purpose.
 * `devOverlay/` is developer chrome drawn OVER the product to critique it: it is held
 * outside the design system on purpose, so a token change cannot move the tool that
 * measures the tokens, and so it can never be mistaken for the application beneath it.
 */
const NOT_DEBT = /^(index\.css|styles\/design-system\.css|stories\/|devOverlay\/)/

/**
 * The legacy tokens that have a `--mo-*` equivalent today, and only those.
 *
 * `--z-*`, `--sidebar-width-*`, `--header-height` and friends are deliberately absent:
 * they are layout constants with no counterpart in the design system, so migrating them
 * would mean inventing tokens rather than adopting them. A rule that also demanded those
 * would be unsatisfiable, and an unsatisfiable rule gets suppressed.
 */
const LEGACY_TOKEN =
  /var\(--(?:color-(?:primary|text|text-muted|background|surface|border)|font-family|font-family-title|error-(?:bg|border|text)|warning-(?:bg|border|text)|form-(?:error-color|focus-color))\)/

/**
 * A literal colour. `var()` values never match, and neither does a `#` inside a comment —
 * comments are stripped first, because half the stylesheets in this repo explain a colour
 * choice by quoting the hex it replaced.
 */
const LITERAL_HEX = /#[0-9a-fA-F]{3,8}\b/

/**
 * Lower these when you migrate a file. Never raise them.
 *
 * Measured 2026-09-19, when ADR-0032 was written: 114 stylesheets outside the design
 * system, 79 of them already reaching for `--mo-*`. Most are mixed — a file counts here
 * while it still holds a single legacy token, so the numbers fall slower than the work.
 *
 * 48 → 46 and 68 → 67 on 2026-09-21 (TM-99): `DiscussionPanel.css` and `DiscussionButton.css`
 * migrated whole when the comment thread was extracted. The hex count falls by one rather than
 * two because only the first of the pair held literals.
 *
 * 46 → 45 and 67 → 66 on 2026-09-23 (MFX-204): `FormEquipmentTable.css` migrated whole when the
 * return row learned free-form text. Only `--form-input-height` stays: it has no `--mo-*` equivalent.
 *
 * 45 → 43 and 66 → 64 on 2026-09-24 (dialog-consolidation): `Modal.css` deleted for `.mo-dialog`,
 * `Modal.forms.css` migrated whole as `ui/Dialog.forms.css`. Then 43 → 42 and 64 → 62 when the
 * hand-built modals moved onto Dialog: `SynonymSuggestionModal.css` deleted, and the shared
 * inspection sheet (now `LineDialog.css`) lost its hex fallbacks.
 * 42 → 41 and 62 → 61 on 2026-09-25 (trailer-items-only-form): `FormJobsiteTrailerCards.css`
 * migrated whole to `--mo-*` tokens.
 *
 * 61 → 60 on 2026-09-26 (mir-sweep-tab): `MirSync.css` lost its two `#fff`, now `--mo-surface`.
 *
 * 41 → 39 on 2026-09-28 (fulfillment-history-external-closures): `FulfillmentHistoryTable.css` and
 * `RequisitionFulfillmentGroups.css` migrated to `--mo-*` tokens. The hex count stays at 60: the
 * first file lost its `#6c757d` fallbacks, and the second gained the violet wash of a closed line.
 */
const LEGACY_TOKEN_CEILING = 39
const LITERAL_HEX_CEILING = 60

const stylesheets = (dir: string, found: string[] = []): string[] => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) stylesheets(full, found)
    else if (entry.name.endsWith('.css')) found.push(full)
  }
  return found
}

const posix = (path: string): string => relative(SRC, path).replace(/\\/g, '/')

const SHEETS: readonly { path: string; text: string }[] = stylesheets(SRC)
  .map((path) => ({ path: posix(path), text: readFileSync(path, 'utf8') }))
  .filter(({ path }) => !NOT_DEBT.test(path))
  .map(({ path, text }) => ({ path, text: text.replace(/\/\*[\s\S]*?\*\//g, '') }))

const offenders = (pattern: RegExp): string[] =>
  SHEETS.filter(({ text }) => pattern.test(text))
    .map(({ path }) => path)
    .sort()

/**
 * Ratchets in both directions, with a message that says which way it moved.
 *
 * It counts and does not name the newcomer: without a stored baseline LIST there is no way
 * to tell which of the offenders is new, and an earlier version that printed the tail of
 * the sorted list pointed at an innocent file. The author knows what they just edited, so
 * the message sends them to their own diff rather than guessing for them.
 */
function expectRatchet(actual: string[], ceiling: number, what: string): void {
  expect(
    actual.length,
    `${actual.length - ceiling} stylesheet(s) newly hold ${what}. Use the --mo-* token instead ` +
      `(ADR-0032) — check \`git diff --name-only -- '*.css'\` for the one you touched.`,
  ).toBeLessThanOrEqual(ceiling)

  expect(
    actual.length,
    `${what} now affects ${actual.length} stylesheets, not ${ceiling} — the migration moved. ` +
      `Lower the ceiling in this file to ${actual.length}; that edit is the progress record ADR-0032 keeps.`,
  ).toBeGreaterThanOrEqual(ceiling)
}

describe('ADR-0032 — the legacy style debt only shrinks', () => {
  it('no stylesheet newly reaches for a legacy token', () => {
    expectRatchet(offenders(LEGACY_TOKEN), LEGACY_TOKEN_CEILING, 'a legacy --color-/--font-/--form- token')
  })

  it('no stylesheet newly hardcodes a colour', () => {
    expectRatchet(offenders(LITERAL_HEX), LITERAL_HEX_CEILING, 'a literal hex colour')
  })

  // A scan that silently matched nothing would make both ratchets pass for ever.
  it('still reads the stylesheets', () => {
    expect(SHEETS.length).toBeGreaterThan(100)
    expect(SHEETS.some(({ path }) => path.endsWith('.css'))).toBe(true)
  })
})
