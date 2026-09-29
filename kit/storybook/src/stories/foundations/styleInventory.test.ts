import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  LEGACY_TARGETS,
  OUT_OF_SCOPE,
  SHEETS,
  coverageOf,
  filesUsing,
  filesWithLegacyToken,
  groupTokens,
  outOfScopeReason,
  parsePrimitives,
  parseTokens,
  toSheets,
} from './styleInventory'

/**
 * The inventory pages claim to be exhaustive. That is a claim about the parser,
 * and these assertions are the claim.
 *
 * They read the stylesheets from disk rather than through the module's `?raw`
 * bindings: `vite.config.ts` sets `test.css: false`, so a `?raw` import of a
 * stylesheet is an empty string under vitest. The parsers are pure for exactly
 * this reason — the text arrives the same way either side, and what is verified
 * here is what runs in Storybook.
 *
 * What is pinned is the *shape* the parsers depend on, not a list of names: a
 * pinned list of 54 tokens would have to be edited by whoever adds the 55th,
 * which is the transcription problem the parser exists to delete. A stylesheet
 * reorganised past what a flat regex can read fails here instead.
 */

const SRC = join(__dirname, '..', '..')
const read = (rel: string): string => readFileSync(join(SRC, rel), 'utf8')

const DESIGN_SYSTEM = read('styles/design-system.css')
const INDEX = read('index.css')

const TOKENS = parseTokens(DESIGN_SYSTEM, '--mo-')
const PRIMITIVES = parsePrimitives(DESIGN_SYSTEM)
const CLASSES = PRIMITIVES.flatMap((s) => s.classes)
const LEGACY = parseTokens(INDEX, '--')

describe('TM-93 — the inventory is read off design-system.css', () => {
  it('finds every token, under a named group', () => {
    expect(TOKENS.length).toBeGreaterThan(40)
    expect(TOKENS.every((t) => t.name.startsWith('--mo-'))).toBe(true)
    expect(TOKENS.every((t) => t.value.length > 0)).toBe(true)
    // "Divers" is the fallback for a token declared above any banner.
    expect(TOKENS.filter((t) => t.group === 'Divers')).toEqual([])
  })

  it('keeps the groups the stylesheet declares, in source order', () => {
    expect(groupTokens(TOKENS).map((g) => g.group)).toEqual([
      'Color',
      'Typography',
      'Radius',
      'Spacing',
      'Motion',
      'Elevation',
      'Z-Index',
    ])
  })

  it('finds every primitive section, each with classes under it', () => {
    expect(PRIMITIVES.length).toBeGreaterThan(15)
    expect(PRIMITIVES.every((s) => s.title.length > 0)).toBe(true)
    expect(PRIMITIVES.every((s) => s.classes.length > 0)).toBe(true)
  })

  it('finds every .mo-* class the stylesheet defines, exactly once', () => {
    // The independent count: what a plain grep over the file sees.
    const grepped = new Set(DESIGN_SYSTEM.match(/\.mo-[a-z0-9-]+/g)?.map((s) => s.slice(1)))

    expect(new Set(CLASSES.map((c) => c.name))).toEqual(grepped)
    expect(CLASSES.length).toBe(grepped.size)
    expect(CLASSES.every((c) => c.selectors.length > 0 && c.declarations > 0)).toBe(true)
  })

  it('tells a root from its elements and its modifiers', () => {
    const kind = (name: string) => CLASSES.find((c) => c.name === name)?.kind

    expect(kind('mo-hud')).toBe('racine')
    expect(kind('mo-hud-count')).toBe('élément')
    expect(kind('mo-hud-stack--end')).toBe('modificateur')
    // Chip and Tag share one section and neither is the other's element.
    expect(kind('mo-chip')).toBe('racine')
    expect(kind('mo-tag')).toBe('racine')
  })

  it('reads coverage off the real library and the real pages', () => {
    // Button is wrapped and documented — and the page proving it says `<Button>`,
    // never `mo-btn`, which is the second hop coverageOf has to make.
    expect(coverageOf('mo-btn')).toEqual({ components: ['Button'], inStorybook: true })

    // The stepper's button is the other shape: no `ui/` wrapper, so the first hop
    // finds nothing, but TM-93 gave it a page that spells the class literally. A
    // class can be documented without being wrapped, and coverage says so.
    expect(coverageOf('mo-qty-btn')).toEqual({ components: [], inStorybook: true })

    // Nothing invented: a class the stylesheet never declares is covered by neither.
    expect(coverageOf('mo-not-a-class')).toEqual({ components: [], inStorybook: false })
  })
})

describe('TM-94 — the legacy inventory is complete and counted', () => {
  it('reads the legacy set out of index.css', () => {
    expect(LEGACY.length).toBeGreaterThan(30)
    expect(LEGACY.some((t) => t.name === '--color-primary')).toBe(true)
    // index.css imports the design system but declares none of its tokens.
    expect(LEGACY.some((t) => t.name.startsWith('--mo-'))).toBe(false)
  })

  /**
   * The assertion that earns its keep: a legacy token is either mapped to a
   * `--mo-*` target or explained as out of scope. One added to `index.css` and
   * to neither list fails here, rather than rendering as a blank row nobody
   * reads as a gap.
   */
  it('leaves no legacy token without either a target or a reason', () => {
    const orphans = LEGACY.filter(
      (t) => !(t.name in LEGACY_TARGETS) && !outOfScopeReason(t.name),
    ).map((t) => t.name)

    expect(orphans, `sans cible ni motif : ${orphans.join(', ')}`).toEqual([])
  })

  it('never both maps a token and excuses it', () => {
    const both = Object.keys(LEGACY_TARGETS).filter((name) => outOfScopeReason(name))
    expect(both, `à la fois cible et hors visée : ${both.join(', ')}`).toEqual([])
  })

  it('points every target at a token the design system defines', () => {
    const defined = new Set(TOKENS.map((t) => t.name))
    for (const target of Object.values(LEGACY_TARGETS)) expect([...defined]).toContain(target)
  })

  it('keeps every out-of-scope rule matching something', () => {
    // A rule that matches nothing is a rule for a token that was renamed or
    // removed, and it would silently stop covering its replacement.
    for (const { match } of OUT_OF_SCOPE) {
      expect(LEGACY.some((t) => match.test(t.name)), `${match} ne couvre plus rien`).toBe(true)
    }
  })

  /**
   * The page's central claim is that its numbers *are* the ratchet's numbers, and
   * that holds only if both look at the same files. So this walks the tree the way
   * `legacyTokens.ratchet.test.ts` does and demands the same set, path for path.
   *
   * It is not redundant with a spot check on the exclusions: the first version of
   * this module rebuilt paths by stripping `../` from a relative glob, which was
   * silently wrong for the sheets beside it — `stories/docs/docs.css` arrived as
   * `docs/docs.css`, dodged the `stories/` exclusion, and added an imaginary
   * file to the literal-hex debt. Every named exclusion still passed. Only
   * comparing the whole set caught it.
   */
  it('counts exactly the stylesheets the ratchet counts', () => {
    const NOT_DEBT = /^(index\.css|styles\/design-system\.css|stories\/)/
    const walk = (dir: string, found: string[] = []): string[] => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name)
        if (entry.isDirectory()) walk(full, found)
        else if (entry.name.endsWith('.css')) found.push(full)
      }
      return found
    }

    const expected = walk(SRC)
      .map((path) => relative(SRC, path).replace(/\\/g, '/'))
      .filter((path) => !NOT_DEBT.test(path))
      .map((path) => `src/${path}`)
      // The module sorts for reading, so compare membership under its comparator
      // rather than pinning code-unit order (`ItemsPager` vs `ItemTypeBadge`).
      .sort((a, b) => a.localeCompare(b))

    expect(expected.length).toBeGreaterThan(100)
    expect(SHEETS.map(({ path }) => path)).toEqual(expected)
  })

  it('counts a sheet once per token, and the union at least as often', () => {
    const sheets = toSheets({
      '/src/a.css': 'a { color: var(--color-text); }',
      '/src/b.css': 'b { color: var(--color-text); border: var(--color-border); }',
      '/src/c.css': 'c { color: var(--mo-ink); }',
      // Stripped before matching, exactly as the ratchet does it.
      '/src/d.css': '/* was var(--color-text) */ d { color: var(--mo-ink); }',
      '/src/index.css': 'x { color: var(--color-text); }',
      '/src/stories/foundations/inventory.css': 'y { color: var(--color-text); }',
    })

    // `stories/` is excluded, so the sheet in it never reaches the count.
    expect(filesUsing(sheets, '--color-text')).toEqual(['src/a.css', 'src/b.css'])
    expect(filesUsing(sheets, '--color-border')).toEqual(['src/b.css'])
    expect(filesWithLegacyToken(sheets)).toEqual(['src/a.css', 'src/b.css'])
  })
})
