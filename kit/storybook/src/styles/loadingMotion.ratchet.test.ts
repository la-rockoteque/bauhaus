import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The motion ratchet for TM-115 — one spinner, one skeleton pulse, and every loop stops
 * under `prefers-reduced-motion`.
 *
 * Same shape as `legacyTokens.ratchet.test.ts`: both directions fail on purpose. Going UP
 * means a new hand-rolled spinner or an ungated `infinite` loop landed. Going DOWN means
 * someone did the work (e.g. the tracker-create-loading story finishing `tracker-spin`)
 * and owes this file a one-line edit to lower the ceiling — that edit is the progress
 * record. `styleInventory.ts` does not model `@media` blocks, so this file scans the raw
 * stylesheets itself rather than reuse it.
 */

const STYLES = __dirname
const SRC = join(STYLES, '..')

/**
 * Domain aliases. Still plain strings at runtime — the point is the annotation, not a new
 * runtime type: every helper below is otherwise string-in-string-out, which is exactly the
 * "a raw string could be a path, a selector, or a whole stylesheet" ambiguity Primitive
 * Obsession names. A path is not a selector is not a stylesheet, even though TypeScript can't
 * tell them apart here.
 */
type FilePath = string
type CssText = string
type RuleHeader = string
type Selector = string

const stylesheets = (dir: FilePath, found: FilePath[] = []): FilePath[] => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) stylesheets(full, found)
    else if (entry.name.endsWith('.css')) found.push(full)
  }
  return found
}

const posix = (path: FilePath): FilePath => relative(SRC, path).replace(/\\/g, '/')

const withoutComments = (css: CssText): CssText => css.replace(/\/\*[\s\S]*?\*\//g, '')

const SHEETS: readonly { path: FilePath; text: CssText }[] = stylesheets(SRC)
  .map((path) => ({ path: posix(path), text: withoutComments(readFileSync(path, 'utf8')) }))

/**
 * Splits a stylesheet (or the inside of one block) into its top-level blocks — selector/at-rule
 * header + body — by brace depth. One level only: a nested `{…}` inside a body (a `@media`'s
 * rules, a keyframe's steps) stays folded into that block's `body`, for the caller to split
 * again by calling this on the body itself.
 */
function topLevelBlocks(css: CssText): { header: RuleHeader; body: CssText }[] {
  const blocks: { header: RuleHeader; body: CssText }[] = []
  let depth = 0
  let headerStart = 0
  let bodyStart = -1
  for (let i = 0; i < css.length; i++) {
    if (css[i] === '{') {
      if (depth === 0) bodyStart = i + 1
      depth++
    } else if (css[i] === '}') {
      depth--
      if (depth === 0 && bodyStart !== -1) {
        blocks.push({ header: css.slice(headerStart, bodyStart - 1).trim(), body: css.slice(bodyStart, i) })
        headerStart = i + 1
        bodyStart = -1
      }
    }
  }
  return blocks
}

const isReducedMotionMedia = (header: RuleHeader): boolean =>
  header.startsWith('@media') && /prefers-reduced-motion:\s*reduce/.test(header)

/**
 * Rule 1 — no hand-rolled spinner outside `Spinner.css`.
 *
 * A `@keyframes` block whose every step sets nothing but `transform: rotate(...)` is the spin
 * loop `mo-spin` already gives every button and overlay; a second one is the duplicate this
 * story removed four of. `tracker-spin` (`NouveauTracker.css`) was the last;
 * `tm-108-tracker-create-loading` removed it.
 *
 * Steps are read the same way a stylesheet's rules are — `topLevelBlocks` on the keyframe body
 * gives one block per step (`to { … }`, or `0% { … }` / `100% { … }` for a two-step spin) — so
 * a keyframe written either way is caught, not just the single-step form.
 */
const KEYFRAME = /@keyframes\s+[\w-]+\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g

function isRotateOnlyDeclarations(body: CssText): boolean {
  const declarations = body
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
  return declarations.length > 0 && declarations.every((d) => /^transform:\s*rotate\([^)]+\)$/.test(d))
}

function hasRotateOnlyKeyframe(css: CssText): boolean {
  for (const match of css.matchAll(KEYFRAME)) {
    const steps = topLevelBlocks(match[1])
    if (steps.length > 0 && steps.every(({ body }) => isRotateOnlyDeclarations(body))) return true
  }
  return false
}

const ROTATE_ONLY_CEILING = 0

/**
 * Rule 2 — no `infinite` loop runs without a `prefers-reduced-motion` answer.
 *
 * Selector-exact, and it looks inside every `@media` block, not only at the top level — a loop
 * hidden behind `@media (max-width: …)` still runs forever for a reduced-motion reader. The one
 * `@media` this does NOT recurse into for loops is `prefers-reduced-motion` itself: that block is
 * the gate, not something that needs gating.
 *
 * "Gated" means the selector is named — exactly, comma-split, trimmed — inside a
 * `prefers-reduced-motion` block in the same file. Containment (`reduced.includes(selector)`)
 * would let `.icon` gate `.icon-spin`; this compares the full selector text instead.
 * `tracker-spin` was the last gap, closed by tm-108-tracker-create-loading.
 */
function infiniteLoopSelectors(css: CssText): Selector[] {
  const found: Selector[] = []
  for (const { header, body } of topLevelBlocks(css)) {
    if (header.startsWith('@keyframes') || isReducedMotionMedia(header)) continue
    if (header.startsWith('@media') || header.startsWith('@supports')) {
      found.push(...infiniteLoopSelectors(body))
      continue
    }
    if (header.startsWith('@')) continue
    if (/animation:\s*[\w-]+[^;]*\binfinite\b/.test(body)) found.push(header)
  }
  return found
}

/** Every selector a block of plain rules (no at-rules) names, comma-lists split and trimmed. */
function ruleSelectorsOf(body: CssText): Selector[] {
  const selectors: Selector[] = []
  for (const { header } of topLevelBlocks(body)) {
    if (header.startsWith('@')) continue
    for (const part of header.split(',')) selectors.push(part.trim())
  }
  return selectors
}

function reducedMotionSelectors(css: CssText): Set<Selector> {
  const selectors = new Set<string>()
  for (const { header, body } of topLevelBlocks(css)) {
    const named = isReducedMotionMedia(header)
      ? ruleSelectorsOf(body)
      : header.startsWith('@media') || header.startsWith('@supports')
        ? [...reducedMotionSelectors(body)]
        : []
    for (const selector of named) selectors.add(selector)
  }
  return selectors
}

function ungatedInfiniteSelectors(css: CssText): Selector[] {
  const reduced = reducedMotionSelectors(css)
  return infiniteLoopSelectors(css).filter(
    (selector) => !selector.split(',').map((s) => s.trim()).every((s) => reduced.has(s)),
  )
}

const UNGATED_LOOP_CEILING = 0

/**
 * Rule 3 — no bare « Chargement… » in a page or component.
 *
 * The three loading rules (§3.18) route every wait through a component (`Skeleton`,
 * `Spinner`, `LoadingOverlay`) or a translation key, never a literal string typed at the
 * call site — that is how "chargement" drifted into four different words before this
 * story. `LoadingOverlay`'s own doc comment quotes the phrase as an example of what NOT to
 * pass it, which is why comments are stripped before the scan.
 */
const BARE_CHARGEMENT_CEILING = 0

/** A `.tsx` file's own source text — not `CssText`: the bare « Chargement… » rule (below)
 *  reads JSX/TS, not stylesheets. */
type SourceText = string

function componentSources(dir: FilePath, found: FilePath[] = []): FilePath[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) componentSources(full, found)
    else if (entry.name.endsWith('.tsx') && !entry.name.includes('.test.')) found.push(full)
  }
  return found
}

const withoutJsComments = (src: SourceText): SourceText =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')

const TSX_SOURCES: readonly { path: FilePath; text: SourceText }[] = [
  ...componentSources(join(SRC, 'pages')),
  ...componentSources(join(SRC, 'components')),
].map((path) => ({ path: relative(SRC, path).replace(/\\/g, '/'), text: withoutJsComments(readFileSync(path, 'utf8')) }))

function expectRatchet(actual: number, ceiling: number, what: string): void {
  expect(actual, `${actual - ceiling} file(s) newly ${what}. Reuse Spinner/Skeleton/LoadingOverlay instead (design-system.md §3.18).`).toBeLessThanOrEqual(
    ceiling,
  )
  expect(
    actual,
    `only ${actual} file(s) now ${what}, not ${ceiling} — lower the ceiling in this file to ${actual}. That edit is the progress record.`,
  ).toBeGreaterThanOrEqual(ceiling)
}

describe('TM-115 — the motion ratchet only shrinks', () => {
  it('no stylesheet holds a hand-rolled spin keyframe outside Spinner.css', () => {
    const offenders = SHEETS.filter(({ path }) => path !== 'components/ui/Spinner.css')
      .filter(({ text }) => hasRotateOnlyKeyframe(text))
      .map(({ path }) => path)
      .sort()
    expectRatchet(offenders.length, ROTATE_ONLY_CEILING, 'hold a duplicate rotate spinner')
  })

  it('no stylesheet runs an infinite loop unanswered by prefers-reduced-motion', () => {
    const offenders = SHEETS.filter(({ text }) => ungatedInfiniteSelectors(text).length > 0)
      .map(({ path }) => path)
      .sort()
    expectRatchet(offenders.length, UNGATED_LOOP_CEILING, 'leave an infinite loop ungated')
  })

  it('no page or component hardcodes a bare « Chargement… »', () => {
    const offenders = TSX_SOURCES.filter(({ text }) => text.includes('Chargement'))
      .map(({ path }) => path)
      .sort()
    expectRatchet(offenders.length, BARE_CHARGEMENT_CEILING, 'hardcode a bare loading string')
  })

  // A scan that silently matched nothing would pass every check above for the wrong reason.
  it('still reads the stylesheets and the components', () => {
    expect(SHEETS.length).toBeGreaterThan(100)
    expect(TSX_SOURCES.length).toBeGreaterThan(100)
  })
})

describe('the scan functions themselves, against fixtures (not real stylesheets)', () => {
  it('flags an infinite loop hidden behind a non-reduced-motion @media block', () => {
    const css = '@media (max-width: 600px) { .x { animation: s 1s infinite; } }'
    expect(ungatedInfiniteSelectors(css)).toEqual(['.x'])
  })

  it('does not let one selector gate another that merely contains its text', () => {
    const css = `
      .icon-spin { animation: spin 1s infinite; }
      @media (prefers-reduced-motion: reduce) {
        .icon { animation: none; }
      }
    `
    // `.icon-spin` is NOT `.icon` — substring containment would wrongly call this gated.
    expect(ungatedInfiniteSelectors(css)).toEqual(['.icon-spin'])
  })

  it('still recognises the exact selector as gated when it really is named', () => {
    const css = `
      .icon-spin { animation: spin 1s infinite; }
      @media (prefers-reduced-motion: reduce) {
        .icon-spin { animation: none; }
      }
    `
    expect(ungatedInfiniteSelectors(css)).toEqual([])
  })

  it('treats a two-step 0%/100% rotate keyframe as rotate-only, not just the one-step "to" form', () => {
    const css = `
      @keyframes two-step-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .x { animation: two-step-spin 1s linear infinite; }
    `
    expect(hasRotateOnlyKeyframe(css)).toBe(true)
  })

  it('does not call a keyframe rotate-only when a step carries another declaration', () => {
    const css = `
      @keyframes two-step-glow {
        0% { transform: rotate(0deg); opacity: 0.5; }
        100% { transform: rotate(360deg); opacity: 1; }
      }
    `
    expect(hasRotateOnlyKeyframe(css)).toBe(false)
  })
})
