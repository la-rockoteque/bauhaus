import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * A primitive only one component spells keeps its CSS beside that component.
 *
 * `design-system.css` is the shared vocabulary: tokens, and the primitives many components
 * reach for. It is read by everyone, so every rule in it is a rule everyone scrolls past. A
 * family that exactly one component uses is not vocabulary — it is that component's own
 * stylesheet, filed in the wrong place, and the file grows by a few hundred lines every time
 * somebody decides otherwise. TM-99 put 311 such lines there before this test existed.
 *
 * The rule is not "never add to design-system.css". A primitive with several callers belongs
 * there and this test says nothing about it. The question it asks is narrower: **is this family
 * used by exactly one component?** If so, its rules go in that component's own `.css`.
 *
 * Two things this deliberately does NOT count:
 *
 * - **Families with no caller at all.** Several primitives are documented in the guide and
 *   adopted nowhere — see § 7, "Primitives with no current adopter". That is a known, separate
 *   decision about what the system offers ahead of demand, and folding it in here would put two
 *   arguments behind one number.
 * - **Where the grading happens.** `benchmark.test.ts` reads a LIST of stylesheets, so moving a
 *   family out of the shared sheet costs it none of its `verify: 'auto'` rules. Add the new
 *   sheet there. A rule that had to live in one file to be checked would be a rule shaping the
 *   code to suit its test.
 *
 * Like ADR-0032's ratchet, this fails in BOTH directions. Up means a single-component family
 * was added to the shared sheet. Down means somebody moved one out and owes this file a
 * one-line edit — which is how the count stays a truthful record of what is left.
 */

const STYLES = __dirname
const SRC = join(STYLES, '..')

/**
 * Lower this when you move a family out. Never raise it.
 *
 * Measured 2026-09-22: 17 families in the shared sheet are spelled by exactly one component,
 * and every one of them is a `components/ui/` wrapper — `mo-tabs` → `Tabs.tsx`, `mo-pager` →
 * `Pager.tsx`, and so on. They predate this test. They are debt, not a licence, and the honest
 * reading of the number is "seventeen stylesheets still filed in the wrong place".
 *
 * 18 on both sides of this merge, 17 after it: main moved one family out and this branch moved
 * another — the step page's hand-rolled comment thread, which TM-99's shared panel replaced —
 * and each lowered the ceiling by one without seeing the other.
 *
 * 16 → 15 on 2026-09-24 (dialog-consolidation): the synonym modals moved onto Dialog and now
 * spell `.mo-error-text` too.
 */
const SINGLE_CALLER_CEILING = 15

const withoutComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '')

/** Every `.mo-*` family the shared sheet declares, by its first segment (`.mo-panel-head` → `mo-panel`). */
function familiesInSharedSheet(): string[] {
  const css = withoutComments(readFileSync(join(STYLES, 'design-system.css'), 'utf8'))
  return [...new Set([...css.matchAll(/\.(mo-[a-z0-9]+)/g)].map((m) => m[1]))]
}

/** Component sources — not stories, which quote class names to document them, and not tests. */
function componentSources(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'stories') componentSources(full, found)
    } else if (entry.name.endsWith('.tsx') && !entry.name.includes('.test.')) {
      found.push(full)
    }
  }
  return found
}

/**
 * The files that spell a family.
 *
 * Bounded by the delimiters a class name actually sits between, so `mo-count` does not match
 * `mo-counter` — a prefix collision would silently merge two families and make the count lie.
 */
function callersOf(family: string, sources: readonly { path: string; text: string }[]): string[] {
  const spelled = new RegExp(`["'\\s]${family}[-"'\\s]`)
  return sources.filter(({ text }) => spelled.test(text)).map(({ path }) => path)
}

describe('a primitive only one component spells keeps its CSS beside that component', () => {
  const sources = componentSources(SRC).map((path) => ({
    path: relative(SRC, path).replace(/\\/g, '/'),
    text: readFileSync(path, 'utf8'),
  }))

  const singleCaller = familiesInSharedSheet()
    .map((family) => ({ family, callers: callersOf(family, sources) }))
    .filter(({ callers }) => callers.length === 1)
    .map(({ family, callers }) => `${family} → ${callers[0]}`)
    .sort()

  it('adds no new single-component family to the shared stylesheet', () => {
    expect(
      singleCaller.length,
      `${singleCaller.length - SINGLE_CALLER_CEILING} family/families in design-system.css are ` +
        `spelled by exactly one component. Put their rules in that component's own .css and add ` +
        `the sheet to GRADED_SHEETS in stories/benchmark/benchmark.test.ts.\n  ` +
        singleCaller.join('\n  '),
    ).toBeLessThanOrEqual(SINGLE_CALLER_CEILING)
  })

  it('records the progress when one moves out', () => {
    expect(
      singleCaller.length,
      `only ${singleCaller.length} single-component families are left, not ${SINGLE_CALLER_CEILING} — ` +
        `lower SINGLE_CALLER_CEILING in this file to ${singleCaller.length}. That edit is the record.`,
    ).toBeGreaterThanOrEqual(SINGLE_CALLER_CEILING)
  })

  it('reads the sheet and the components it is grading', () => {
    // A scan that silently found nothing would pass both checks above for the wrong reason.
    expect(familiesInSharedSheet().length).toBeGreaterThan(20)
    expect(sources.length).toBeGreaterThan(100)
  })
})
