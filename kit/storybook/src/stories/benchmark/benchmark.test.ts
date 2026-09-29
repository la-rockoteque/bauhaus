import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { advisories } from '../../devOverlay/advisories'
import { parseDeclarations, parseTokens } from '../foundations/styleInventory'
import { AUTO_CHECKS } from './autoChecks'
import { KNOWN_VIOLATIONS } from './baseline'
import { CHECKLIST, COMPONENT_ITEMS } from './a11y/checklist'
import { ALL_RULES, rulesFor } from './rules'
import type { Sheet } from './checks'

/**
 * The benchmark's own integrity, and then the benchmark itself.
 *
 * `vite.config.ts` sets `test.css: false`, so a `?raw` import of a stylesheet is empty
 * under vitest — the same split `styleInventory.ts` documents. The parsers are pure and
 * this drives them from disk.
 */
const SRC = join(__dirname, '..', '..')
/**
 * Every stylesheet the library's primitives are drawn from: the design system, plus the CSS a
 * primitive keeps beside itself once it is that primitive's alone. Reading only
 * `design-system.css` made the barème grade every one of their rules « n'existe pas dans la
 * feuille de style », which is a true statement about the wrong file.
 *
 * A hand-kept list, paired with `DECLARATIONS` in `styleInventory.ts` by the test below: two
 * readers with two lists disagreed once already, and the page was the one that lied.
 */
const GRADED_SHEETS = [
  join(SRC, 'styles', 'design-system.css'),
  join(SRC, 'components', 'ui', 'Breadcrumb.css'),
  join(SRC, 'components', 'ui', 'DataTable.css'),
  join(SRC, 'components', 'ui', 'LoadingOverlay.css'),
  join(SRC, 'components', 'ui', 'Spinner.css'),
  join(SRC, 'components', 'ui', 'ThreadPanel.css'),
  join(SRC, 'components', 'ui', 'CommentComposer', 'CommentComposer.css'),
  join(SRC, 'components', 'ui', 'ContextMenu', 'contextMenu.css'),
  join(SRC, 'components', 'ui', 'SpreadsheetGrid', 'spreadsheetGrid.css'),
]
const css = GRADED_SHEETS.map((sheet) => readFileSync(sheet, 'utf8')).join('\n')

const sheet: Sheet = {
  declarations: parseDeclarations(css),
  tokens: parseTokens(css, '--mo-'),
}

const UI = join(SRC, 'components', 'ui')

/**
 * The primitives the library actually exports — read from the barrel, not from the file
 * names. `CountBadge` lives inside `Tabs.tsx` and `SkeletonText` inside `Skeleton.tsx`, so
 * a filename check called them non-existent and refused to let the barème grade them.
 * Type-only exports and constants are filtered out: `MAX_FILE_SIZE_BYTES` is not a
 * primitive.
 */
const primitives = [
  ...readFileSync(join(UI, 'index.ts'), 'utf8').matchAll(/export \{([^}]*)\}/g),
]
  .flatMap(([, listing]) => listing.split(','))
  .map((name) => name.trim())
  .filter((name) => /^[A-Z][A-Za-z]*$/.test(name))

describe('the benchmark is well formed', () => {
  it('reads the stylesheet it grades', () => {
    // A parse that silently matched nothing would make every assertion below pass.
    expect(sheet.declarations.size).toBeGreaterThan(100)
    expect(sheet.tokens.length).toBeGreaterThan(40)
  })

  it('grades the same sheets on the pages as it does here', () => {
    // The pages read `?raw` imports, this reads disk. Miss one and its primitive grades
    // green here and red on its own page, as a selector « qui n'existe pas ».
    const inventory = readFileSync(join(SRC, 'stories', 'foundations', 'styleInventory.ts'), 'utf8')
    const unbound = GRADED_SHEETS.map((path) => relative(SRC, path).replace(/\\/g, '/')).filter(
      (path) => !inventory.includes(`${path.split('/').pop()}?raw`),
    )

    expect(
      unbound,
      'add a `?raw` import for it in styleInventory.ts and fold it into DECLARATIONS.',
    ).toEqual([])
  })

  it('gives every rule a unique id', () => {
    const ids = ALL_RULES.map((rule) => rule.id)
    const duplicated = ids.filter((id, index) => ids.indexOf(id) !== index)

    expect(duplicated, `duplicated rule id(s): ${duplicated.join(', ')}`).toEqual([])
  })

  it('names every rule id after its component, in dotted kebab', () => {
    const malformed = ALL_RULES.filter((rule) => !/^[a-z0-9]+(-[a-z0-9]+)*\.[a-z0-9-]+$/.test(rule.id))

    expect(malformed.map((rule) => rule.id)).toEqual([])
  })

  it('grades only primitives that exist', () => {
    const unknown = [...new Set(ALL_RULES.map((rule) => rule.component))].filter(
      (component) => !primitives.includes(component),
    )

    expect(unknown, `no such primitive: ${unknown.join(', ')}`).toEqual([])
  })

  it('backs every rule that claims to be automated', () => {
    const claiming = ALL_RULES.filter((rule) => rule.verify === 'auto').map((rule) => rule.id)
    const unbacked = claiming.filter((id) => !(id in AUTO_CHECKS))

    expect(unbacked, `claims verify:'auto' with no check: ${unbacked.join(', ')}`).toEqual([])
  })

  it('has no check left over from a deleted rule', () => {
    const ids = new Set(ALL_RULES.map((rule) => rule.id))
    const orphans = Object.keys(AUTO_CHECKS).filter((id) => !ids.has(id))

    expect(orphans, `check with no rule: ${orphans.join(', ')}`).toEqual([])
  })
})

describe('the accessibility checklist', () => {
  it('gives every item a unique id', () => {
    const ids = CHECKLIST.map((item) => item.id)
    const duplicated = ids.filter((id, index) => ids.indexOf(id) !== index)

    expect(duplicated, `duplicated item id(s): ${duplicated.join(', ')}`).toEqual([])
  })

  it('cites a real success criterion, or says it cites none', () => {
    const malformed = CHECKLIST.filter(
      (item) => item.sc !== null && !/^\d\.\d(\.\d+)? /.test(item.sc),
    )

    expect(malformed.map((item) => item.id)).toEqual([])
  })

  it('gives an item with no criterion the placeholder level, and never a real one', () => {
    const wrong = CHECKLIST.filter((item) => (item.sc === null) !== (item.level === '—'))

    expect(wrong.map((item) => item.id)).toEqual([])
  })

  it('never cites 4.1.1 Parsing, which WCAG 2.2 removed', () => {
    const stale = CHECKLIST.filter((item) => item.sc?.startsWith('4.1.1'))

    expect(
      stale.map((item) => item.id),
      'the source checklist cites it; re-cite to the criterion that actually carries the requirement.',
    ).toEqual([])
  })

  it('claims only items that exist, from rules', () => {
    const ids = new Set(CHECKLIST.map((item) => item.id))
    const dangling = ALL_RULES.flatMap((rule) =>
      (rule.covers ?? []).filter((id) => !ids.has(id)).map((id) => `${rule.id} → ${id}`),
    )

    expect(dangling, `rule claims no such checklist item: ${dangling.join(', ')}`).toEqual([])
  })

  it('claims only component-scoped items', () => {
    const componentIds = new Set(COMPONENT_ITEMS.map((item) => item.id))
    const misscoped = ALL_RULES.flatMap((rule) =>
      (rule.covers ?? [])
        .filter((id) => !componentIds.has(id))
        .map((id) => `${rule.id} → ${id}`),
    )

    expect(
      misscoped,
      'a rule grades a primitive, so it cannot establish an item about the page or the copy.',
    ).toEqual([])
  })
})

describe('the design system meets its benchmark', () => {
  const failing = Object.entries(AUTO_CHECKS)
    .map(([id, check]) => ({ id, failure: check(sheet) }))
    .filter((result): result is { id: string; failure: string } => result.failure !== null)

  it('breaks no rule that is not already recorded as broken', () => {
    const fresh = failing.filter((result) => !KNOWN_VIOLATIONS.includes(result.id))

    expect(
      fresh.map((result) => `${result.id} — ${result.failure}`),
      'new benchmark violation(s). Fix the primitive, or record it in baseline.ts with an advisory.',
    ).toEqual([])
  })

  it('names a selector that exists in every check', () => {
    // A renamed primitive would otherwise be recorded in the baseline as a design defect,
    // and the real message — « this check no longer points at anything » — would be lost
    // among seventeen genuine ones.
    const broken = failing
      .filter((result) => result.failure.includes("n'existe pas dans la feuille"))
      .map((result) => `${result.id} — ${result.failure}`)

    expect(
      broken,
      'the check points at a selector the stylesheet does not have: fix the check, do not baseline it.',
    ).toEqual([])
  })

  it('still records every violation the baseline claims, and no more', () => {
    const broken = failing.map((result) => result.id)
    const fixed = KNOWN_VIOLATIONS.filter((id) => !broken.includes(id))

    expect(
      fixed,
      'these rules now pass — remove them from baseline.ts and drop their advisory; that edit is the progress record.',
    ).toEqual([])
  })
})

describe('the benchmark and the overlay agree', () => {
  it('cites a real rule from every advisory that names one', () => {
    const ids = new Set(ALL_RULES.map((rule) => rule.id))
    const dangling = advisories
      .map((advisory) => advisory.ruleId)
      .filter((ruleId): ruleId is string => Boolean(ruleId) && !ids.has(ruleId!))

    expect(dangling, `advisory cites no such rule: ${dangling.join(', ')}`).toEqual([])
  })

  it('draws every known violation over its component', () => {
    const cited = new Set(advisories.map((advisory) => advisory.ruleId).filter(Boolean))
    const invisible = KNOWN_VIOLATIONS.filter((id) => !cited.has(id))

    expect(
      invisible,
      'known violation with no advisory — nobody can see it, so nobody will fix it.',
    ).toEqual([])
  })

  it('keeps an advisory consistent with the rule it cites', () => {
    const byId = new Map(ALL_RULES.map((rule) => [rule.id, rule]))
    const mismatched = advisories
      .filter((advisory) => advisory.ruleId && byId.has(advisory.ruleId))
      .filter((advisory) => byId.get(advisory.ruleId!)!.severity !== advisory.severity)
      .map((advisory) => advisory.ruleId)

    expect(mismatched, `severity disagrees with the rule: ${mismatched.join(', ')}`).toEqual([])
  })
})

/**
 * Every graded primitive is surfaced on a page a reader can open.
 *
 * This invariant exists because the gap it closes actually happened: 26 primitives were
 * graded and only three pages declared `primitive=`, so 23 rule sets were readable only
 * on `Général/Barème`. Nothing failed, because nothing was checking — the barème was
 * built and wired to almost nothing.
 */
describe('the barème reaches the pages', () => {
  const STORIES = join(__dirname, '..')

  const declared = (): Set<string> => {
    const found = new Set<string>()

    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name)

        if (entry.isDirectory()) {
          walk(full)
          continue
        }
        if (!entry.name.endsWith('.stories.tsx')) continue

        const text = readFileSync(full, 'utf8')

        for (const [, single] of text.matchAll(/primitive=["']([A-Za-z]+)["']/g)) found.add(single)
        for (const [, listing] of text.matchAll(/primitive=\{\[([^\]]*)\]\}/g)) {
          for (const [, name] of listing.matchAll(/'([A-Za-z]+)'/g)) found.add(name)
        }
      }
    }

    walk(STORIES)

    return found
  }

  it('declares a primitive on a page for every one the barème grades', () => {
    const surfaced = declared()
    const graded = [...new Set(ALL_RULES.map((rule) => rule.component))].sort()
    const invisible = graded.filter((component) => !surfaced.has(component))

    expect(
      invisible,
      'graded with no page carrying it: add `primitive=` to the page that documents it, ' +
        'or its rules are readable only on Général/Barème.',
    ).toEqual([])
  })

  it('declares no primitive the barème does not grade', () => {
    const graded = new Set(ALL_RULES.map((rule) => rule.component))
    const ungraded = [...declared()].filter((component) => !graded.has(component)).sort()

    expect(
      ungraded,
      'a page claims a primitive with no rules, so it renders an empty barème.',
    ).toEqual([])
  })
})

describe('coverage', () => {
  // The floor only rises. Raise it in the same commit that adds the rules — a primitive
  // with no rule has not been reviewed and found clean, it has never been graded.
  const GRADED_FLOOR = 30

  it('grades at least the primitives it claims to', () => {
    const graded = primitives.filter((component) => rulesFor(component).length > 0)

    expect(graded.length).toBeGreaterThanOrEqual(GRADED_FLOOR)
  })

  it('finds the primitives on disk', () => {
    expect(primitives).toContain('Button')
    expect(primitives.length).toBeGreaterThan(20)
  })
})
