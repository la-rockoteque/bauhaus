/**
 * The style inventory, read from the stylesheets themselves.
 *
 * TM-93 asks for an *exhaustive* inventory and TM-94 for the legacy set beside it.
 * A hand-transcribed list answers both once and is wrong the first time someone
 * adds a token and forgets this page — the failure mode ADR-0026 recorded and
 * ADR-0032 designed around. So the pages read `design-system.css` and `index.css`
 * as text and count adoption over the real stylesheets: the inventory is the
 * source, not a copy of it.
 *
 * The parsing is deliberately naive — flat regex passes, no CSS AST. It holds
 * because those two files are hand-written in a house style, and
 * `styleInventory.test.ts` asserts that style still holds; when it stops, the
 * test fails before a page renders with holes in it.
 *
 * **The parsers are pure and the bindings are not.** `vite.config.ts` sets
 * `test.css: false`, which makes a `?raw` import of a *stylesheet* resolve to an
 * empty string under vitest — `.tsx` is unaffected. So everything below is split:
 * functions that take CSS text, which the test drives from disk with `node:fs`,
 * and the constants bound to `?raw`, which only carry content in Storybook. The
 * pages guard on `TOKENS.length` so a broken binding shows as a notice rather
 * than an empty table.
 */

import designSystemCss from '../../styles/design-system.css?raw'
import breadcrumbCss from '../../components/ui/Breadcrumb.css?raw'
import dataTableCss from '../../components/ui/DataTable.css?raw'
import loadingOverlayCss from '../../components/ui/LoadingOverlay.css?raw'
import spinnerCss from '../../components/ui/Spinner.css?raw'
import threadPanelCss from '../../components/ui/ThreadPanel.css?raw'
import commentComposerCss from '../../components/ui/CommentComposer/CommentComposer.css?raw'
import contextMenuCss from '../../components/ui/ContextMenu/contextMenu.css?raw'
import spreadsheetGridCss from '../../components/ui/SpreadsheetGrid/spreadsheetGrid.css?raw'
import indexCss from '../../index.css?raw'

/* ---------------------------------------------------------------------- */
/* Tokens                                                                  */
/* ---------------------------------------------------------------------- */

export const stripComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '')

/** The `:root` block, which in both files is the first one. */
const rootBlock = (css: string): string =>
  css.slice(css.indexOf(':root'), css.indexOf('}', css.indexOf(':root')))

const A_DECLARATION = /^\s*(--[\w-]+)\s*:\s*([^;]+);/
/** A `---------- Color ----------` banner line, which groups the tokens under it. */
const A_GROUP_BANNER = /^\s*\/\*\s*-{3,}\s*(.+?)\s*-{3,}\s*\*\/\s*$/
/** A one-line comment such as `Surfaces`, heading the run of tokens below it. */
const A_NOTE = /^\s*\/\*\s*(.+?)\s*\*\/\s*$/
/** The first line of a note that wraps; tried only after the one-line form fails. */
const A_COMMENT_OPENER = /^\s*\/\*\s*(.+?)\s*$/

export interface TokenEntry {
  name: string
  value: string
  /** The `---- X ----` banner this token sits under. */
  group: string
  /** The plain comment heading its run, when there is one. */
  note?: string
}

/**
 * Every custom property declared in a `:root`, in source order, carrying the
 * comments around it. Comments are the only grouping these files have and they
 * are load-bearing here: without them 54 tokens arrive as one undifferentiated
 * list, which is a dump rather than an inventory.
 *
 * The two files comment differently, and both have to work. `design-system.css`
 * has `---- Color ----` banners with plain notes under them; `index.css` has only
 * plain notes — `Colors`, `Form Variables` — so in a file with no banner the note
 * *is* the group. Either kind may run to several lines; the first line is kept,
 * which captions a run without filling a table cell with prose.
 */
export function parseTokens(css: string, prefix: string): TokenEntry[] {
  const lines = rootBlock(css).split('\n')
  // Whether a note also names a group is a property of the file, so it is settled
  // before the walk rather than guessed from whichever comment came first.
  const notesAreGroups = !lines.some((line) => A_GROUP_BANNER.test(line))

  const entries: TokenEntry[] = []
  let group = 'Divers'
  let note: string | undefined
  let inComment = false

  for (const line of lines) {
    if (inComment) {
      inComment = !line.includes('*/')
      continue
    }

    const banner = A_GROUP_BANNER.exec(line)
    if (banner) {
      group = banner[1]
      note = undefined
      continue
    }

    const comment = A_NOTE.exec(line) ?? A_COMMENT_OPENER.exec(line)
    if (comment) {
      inComment = !line.includes('*/')
      note = comment[1]
      group = notesAreGroups ? headingOf(note) ?? group : group
      continue
    }

    const declaration = A_DECLARATION.exec(line)
    if (declaration && declaration[1].startsWith(prefix)) {
      entries.push({ name: declaration[1], value: declaration[2].trim(), group, note })
    }
  }

  return entries
}

/**
 * The heading a note carries, or nothing when the note is prose about one token.
 *
 * `Colors`, `Form Variables`, `Typography — single family…` all head a run and
 * keep the words before the dash. `A transient overlay anchored to a control…`
 * explains `--z-popover` and heads nothing — four words is the line between a
 * label and a sentence, and it is drawn here rather than by listing both kinds.
 */
const headingOf = (note: string): string | undefined => {
  const heading = note.split(/\s+—\s+/)[0]
  return heading.split(/\s+/).length <= 3 ? heading : undefined
}

export interface TokenGroup {
  group: string
  tokens: TokenEntry[]
}

export const groupTokens = (tokens: readonly TokenEntry[]): TokenGroup[] =>
  tokens.reduce((groups, token) => {
    const last = groups.at(-1)
    if (last?.group === token.group) last.tokens.push(token)
    else groups.push({ group: token.group, tokens: [token] })
    return groups
  }, [] as TokenGroup[])

/** A token whose value is a colour, so a page knows when to draw a swatch. */
export const isColour = (value: string): boolean => /^(#|rgb|hsl|color\()/.test(value)

/**
 * One level of `var(--x)` indirection, resolved against the file that declared it.
 *
 * One level is all these files use — `--font-family-title: var(--font-family)`,
 * `--mo-font-display: var(--mo-font-body)` — and a page comparing a legacy value
 * against its target needs both sides to be actual values, not pointers.
 */
export const resolveValue = (tokens: readonly TokenEntry[], value: string): string => {
  const reference = /^var\(\s*(--[\w-]+)\s*\)$/.exec(value)
  return reference ? (tokens.find((t) => t.name === reference[1])?.value ?? value) : value
}

const normalise = (value: string): string =>
  value
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/, '#$1$1$2$2$3$3')

/**
 * Whether two declared values render the same thing.
 *
 * This is the question the migration table exists to answer: a swap where the
 * two sides are equal is free and can be done blind, and one where they differ
 * changes the screen and wants a look. Quote style and whitespace are noise —
 * `--font-family` and `--mo-font-body` name the same stack with different quotes
 * — and `#fff` is `#ffffff`.
 */
export const sameValue = (a: string, b: string): boolean => normalise(a) === normalise(b)

/* ---------------------------------------------------------------------- */
/* Primitives                                                              */
/* ---------------------------------------------------------------------- */

export type ClassKind = 'racine' | 'élément' | 'modificateur'

export interface ClassEntry {
  name: string
  kind: ClassKind
  /** Selectors that target it, pseudo-classes included: `.mo-btn--primary:hover`. */
  selectors: string[]
  /** Declarations across all of them — a weight, not a spec. */
  declarations: number
}

export interface PrimitiveSection {
  /** `Card`, `Scan bay`… — from the `--- X — note ---` banner above the rules. */
  title: string
  /** The prose after the em dash in that banner, when the author wrote one. */
  note?: string
  classes: ClassEntry[]
}

const A_SECTION_BANNER = /\/\*\s*-{3,}\s*(.+?)\s*-{3,}\s*\*\//g
const A_RULE = /([^{}]+)\{([^{}]*)\}/g

/**
 * Splits the primitive half of the stylesheet on its section banners.
 *
 * Everything before the `PRIMITIVES` banner is dropped: `:root` would otherwise
 * arrive as a section with no classes under it.
 *
 * A class can be touched by more than one section — `.mo-input` is defined under
 * Input and raised to 16px again under Mobile — so it is listed under the
 * section that first declares it, and the later rules are merged into that one
 * entry. An inventory that showed it twice would be counting stylesheet rules,
 * not primitives.
 */
export function parsePrimitives(css: string): PrimitiveSection[] {
  const body = css.slice(css.indexOf('PRIMITIVES'))
  const banners = [...body.matchAll(A_SECTION_BANNER)]
  const seen = new Map<string, ClassEntry>()

  return banners.flatMap((banner, i) => {
    // Banners caption themselves two ways — `Card — what it is` and
    // `Kicker (small eyebrow label)`. Both put the caption on the note.
    const [head, dashed] = banner[1].split(/\s+—\s+/)
    const parenthetical = /^(.*?)\s*\((.+)\)$/.exec(head)
    const [title, note] = parenthetical ? [parenthetical[1], parenthetical[2]] : [head, dashed]
    const end = banners[i + 1]?.index ?? body.length
    const classes = parseClasses(body.slice(banner.index + banner[0].length, end), seen)
    return classes.length > 0 ? [{ title, note, classes }] : []
  })
}

export type Declarations = Readonly<Record<string, string>>

/**
 * Every declaration the stylesheet makes, keyed by the selector that makes it.
 *
 * `parsePrimitives` counts declarations as a weight; the benchmark needs their values —
 * whether `.mo-table-num` sets `font-family`, what `width` `.mo-icon-btn` gives itself.
 * A comma-separated list registers under each of its selectors, and a selector declared
 * twice merges later-over-earlier, as the cascade resolves it at equal specificity.
 *
 * Same naivety as `parsePrimitives`, same justification: flat regex, no CSS AST, held up
 * by the house style that `styleInventory.test.ts` pins. **The one ceiling to know:** an
 * `@media` wrapper is not modelled, so a rule inside one is indistinguishable from a rule
 * outside it — `.mo-input` raised to 16px under Mobile merges over its base declaration.
 */
export function parseDeclarations(css: string): Map<string, Declarations> {
  const bySelector = new Map<string, Record<string, string>>()

  for (const [, selectorList, body] of stripComments(css).matchAll(A_RULE)) {
    const declarations: Record<string, string> = {}

    for (const declaration of body.split(';')) {
      const colon = declaration.indexOf(':')
      if (colon <= 0) continue

      declarations[declaration.slice(0, colon).trim()] = declaration.slice(colon + 1).trim()
    }

    for (const selector of selectorList.split(',')) {
      const key = selector.trim().replace(/\s+/g, ' ')
      if (!key) continue

      bySelector.set(key, { ...bySelector.get(key), ...declarations })
    }
  }

  return bySelector
}

/** Every (selector, class name) pair in a comma-separated selector list. */
function* classesIn(selectorList: string): Generator<readonly [string, string]> {
  for (const selector of selectorList.split(',')) {
    for (const name of selector.match(/mo-[a-z0-9-]+/g) ?? []) yield [selector.trim(), name] as const
  }
}

/**
 * Promotes the classes a sibling root prefixes: `.mo-hud` is a root, and
 * `.mo-hud-count` is an element of it.
 *
 * It runs per section and after the whole section is collected, because a
 * section can hold two roots — Chip / Tag does — so "is anything else here a
 * prefix of me" cannot be answered while the first rule is still being read.
 */
function markElements(classes: readonly ClassEntry[]): void {
  const roots = classes.filter((c) => c.kind === 'racine').map((c) => c.name)
  const isElement = (name: string): boolean =>
    roots.some((root) => root !== name && name.startsWith(`${root}-`))

  for (const entry of classes) {
    if (entry.kind === 'racine' && isElement(entry.name)) entry.kind = 'élément'
  }
}

/**
 * The classes one section declares, merged into the ones already claimed.
 *
 * Entries are built in place rather than copied: `seen` and the returned array
 * hold the same objects, which is what lets a later section's rules land on the
 * entry an earlier section published. Nothing here is visible until
 * `parsePrimitives` returns.
 *
 * @param seen classes already claimed by an earlier section; extended as this one runs.
 */
function parseClasses(sectionCss: string, seen = new Map<string, ClassEntry>()): ClassEntry[] {
  // An at-rule prelude ends in `{` exactly as a selector does, and the rules
  // inside it are ordinary. Dropping the prelude exposes those to a flat scan
  // and leaves a stray `}` that matches nothing.
  const flat = stripComments(sectionCss).replace(/@[a-z-]+[^{]*\{/g, '')
  const mine: ClassEntry[] = []

  const claim = (name: string): ClassEntry => {
    const entry: ClassEntry = {
      name,
      kind: name.includes('--') ? 'modificateur' : 'racine',
      selectors: [],
      declarations: 0,
    }
    seen.set(name, entry)
    mine.push(entry)
    return entry
  }

  for (const [, selectorList, block] of flat.matchAll(A_RULE)) {
    const declarations = block.split(';').filter((d) => d.trim()).length

    for (const [selector, name] of classesIn(selectorList)) {
      const entry = seen.get(name) ?? claim(name)
      entry.selectors.push(selector)
      entry.declarations += declarations
    }
  }

  markElements(mine)
  return mine
}

/* ---------------------------------------------------------------------- */
/* Legacy — the set index.css defines                                      */
/* ---------------------------------------------------------------------- */

/**
 * Legacy token → the `--mo-*` that replaces it.
 *
 * This mapping is the one thing on these pages that cannot be derived: it is a
 * judgement, made in ADR-0032, about which token means the same thing. Values,
 * counts and the files left over are all read back from the source.
 *
 * A token absent from here is out of scope rather than unmapped, and
 * `OUT_OF_SCOPE` says why. The test pairs the two against `index.css`, so a token
 * added to neither fails the suite instead of rendering as a blank row.
 */
export const LEGACY_TARGETS: Readonly<Record<string, string>> = {
  '--color-primary': '--mo-primary',
  '--color-text': '--mo-ink',
  '--color-text-muted': '--mo-muted',
  '--color-background': '--mo-surface-soft',
  '--color-surface': '--mo-surface',
  '--color-border': '--mo-line',
  '--error-bg': '--mo-error-soft',
  '--error-border': '--mo-error-line',
  '--error-text': '--mo-error',
  '--warning-bg': '--mo-amber-soft',
  '--warning-border': '--mo-amber-line',
  '--warning-text': '--mo-amber',
  '--font-family': '--mo-font-body',
  '--font-family-title': '--mo-font-body',
  '--form-error-color': '--mo-error',
  '--form-focus-color': '--mo-primary',
}

/** Why a legacy token is not on the migration list. ADR-0032 § « Ce qui n'est pas visé ». */
export const OUT_OF_SCOPE: readonly { match: RegExp; reason: string }[] = [
  {
    match: /^--sidebar-/,
    reason: 'Chrome de la barre latérale — une surface navy foncée que le système ne modélise pas.',
  },
  {
    match: /^--(header|footer)-/,
    reason: 'Dimension de chrome fixe, lue en JavaScript autant qu’en CSS.',
  },
  {
    match: /^--form-(input|label)-/,
    reason:
      'Gabarit de champ. Les champs sont le cas non tranché d’ADR-0032 : rien à viser tant que Form* et .mo-field n’ont pas convergé.',
  },
  {
    match: /^--(line-height|font-weight)$/,
    reason: 'Réglage global de <html>, pas un jeton appliqué composant par composant.',
  },
]

export const outOfScopeReason = (name: string): string | undefined =>
  OUT_OF_SCOPE.find(({ match }) => match.test(name))?.reason

/* ---------------------------------------------------------------------- */
/* Adoption — counted over the real stylesheets                            */
/* ---------------------------------------------------------------------- */

export interface Sheet {
  path: string
  text: string
}

/**
 * The stylesheets the ratchet counts, under the same three exclusions.
 *
 * `index.css` defines the legacy set and `design-system.css` is the target, so
 * neither is debt; `stories/` names both vocabularies on purpose. Comments are
 * stripped because half the sheets here explain a colour by quoting the hex it
 * replaced. All of it mirrors `legacyTokens.ratchet.test.ts` — the numbers on
 * these pages are meant to be the numbers that test enforces.
 */
const NOT_DEBT = /^src\/(index\.css|styles\/design-system\.css|stories\/)/

/**
 * Keys arrive root-absolute — `/src/pages/Foo/Foo.css` — because the globs below
 * are written from the project root rather than relative to this file. That is
 * not a style choice: a relative pattern hands back `./inventory.css` and
 * `../docs/docs.css` for the sheets next door, and normalising those by stripping
 * `../` put this directory's own stylesheets into the debt count under invented
 * paths, one of them with a literal hex in it. Root-absolute keys are already the
 * path, so there is nothing to reconstruct.
 */
export const toSheets = (modules: Record<string, unknown>): Sheet[] =>
  Object.entries(modules)
    .map(([path, text]) => ({ path: path.replace(/^\//, ''), text: String(text) }))
    .filter(({ path }) => !NOT_DEBT.test(path))
    .map(({ path, text }) => ({ path, text: stripComments(text) }))
    .sort((a, b) => a.path.localeCompare(b.path))

export const filesUsing = (sheets: readonly Sheet[], token: string): string[] =>
  sheets.filter(({ text }) => text.includes(`var(${token})`)).map(({ path }) => path)

const A_LITERAL_HEX = /#[0-9a-fA-F]{3,8}\b/

export const filesWithLiteralHex = (sheets: readonly Sheet[]): string[] =>
  sheets.filter(({ text }) => A_LITERAL_HEX.test(text)).map(({ path }) => path)

/** Sheets holding at least one *migratable* legacy token — the ratchet's unit. */
export const filesWithLegacyToken = (sheets: readonly Sheet[]): string[] => {
  const targets = Object.keys(LEGACY_TARGETS)
  return sheets
    .filter(({ text }) => targets.some((t) => text.includes(`var(${t})`)))
    .map(({ path }) => path)
}

export interface FamilyDebt {
  token: string
  target: string
  /** Sheets in this family that still read it. */
  files: string[]
}

/**
 * The legacy debt carried by one family of stylesheets, newest-heaviest first.
 *
 * This is what lets each **Hérité** page state its own migration guide instead of
 * repeating a table maintained by hand somewhere else: a page names the folders
 * it documents, and the tokens, targets and file lists come back from the sheets
 * themselves. As the family migrates the table shortens, and it empties exactly
 * when the family is done.
 *
 * @param prefixes source paths, matched by prefix — `src/components/Form/`.
 */
export const debtOfFamily = (sheets: readonly Sheet[], prefixes: readonly string[]): FamilyDebt[] => {
  const mine = sheets.filter(({ path }) => prefixes.some((prefix) => path.startsWith(prefix)))

  return Object.entries(LEGACY_TARGETS)
    .map(([token, target]) => ({ token, target, files: filesUsing(mine, token) }))
    .filter(({ files }) => files.length > 0)
    .sort((a, b) => b.files.length - a.files.length || a.token.localeCompare(b.token))
}

/** The sheets of a family, whether or not they still hold legacy tokens. */
export const sheetsOfFamily = (sheets: readonly Sheet[], prefixes: readonly string[]): string[] =>
  sheets.filter(({ path }) => prefixes.some((prefix) => path.startsWith(prefix))).map(({ path }) => path)

/* ---------------------------------------------------------------------- */
/* Coverage — what the React library and Storybook actually carry           */
/* ---------------------------------------------------------------------- */

/**
 * Comments are stripped before anything is counted, for the reason the ratchet
 * strips them too: this library documents itself in prose, and `Banner.tsx`
 * saying "a field error belongs in `.mo-error-text`" is a cross-reference, not a
 * use. Left in, it reported `mo-error-text` as wrapped by `<Banner>`.
 */
const stripSourceComments = (source: string): string =>
  stripComments(source).replace(/(^|[^:])\/\/.*$/gm, '$1')

// `.tsx` is unaffected by `test.css: false`, so unlike the stylesheets above
// these two carry real content under vitest as well as in Storybook.
const UI_SOURCES = Object.entries(
  import.meta.glob('/src/components/ui/*.tsx', { query: '?raw', import: 'default', eager: true }),
).map(([path, text]) => ({
  component: path.replace(/^.*\/|\.tsx$/g, ''),
  text: stripSourceComments(String(text)),
}))

const STORY_SOURCES = Object.values(
  import.meta.glob('/src/stories/**/*.stories.tsx', { query: '?raw', import: 'default', eager: true }),
).map((text) => stripSourceComments(String(text)))

export interface Coverage {
  /** Components in `components/ui/` that spell this class. */
  components: string[]
  /** Rendered by at least one Storybook page, directly or through a wrapper. */
  inStorybook: boolean
}

/**
 * Where a primitive class is carried: which wrappers spell it, and whether any
 * Storybook page puts it on screen.
 *
 * Two hops, because the pages render wrappers rather than class names —
 * `Button.stories.tsx` never says `mo-btn`, it says `<Button>`. So a class is in
 * Storybook when a page names it *or* names a component that does.
 *
 * Modifiers are routinely assembled — `` `mo-tag--${tone}` `` — so a literal miss
 * on `mo-tag--amber` does not mean nobody renders it. Coverage is read at the
 * root, where the spelling is always literal, and the page says so.
 */
export const coverageOf = (name: string): Coverage => {
  const components = UI_SOURCES.filter(({ text }) => text.includes(name)).map((s) => s.component)
  const named = new RegExp(`\\b(${[name, ...components].join('|')})\\b`)

  return { components, inStorybook: STORY_SOURCES.some((text) => named.test(text)) }
}

/* ---------------------------------------------------------------------- */
/* The bound inventory — real in Storybook, empty under vitest             */
/* ---------------------------------------------------------------------- */

export const TOKENS: readonly TokenEntry[] = parseTokens(designSystemCss, '--mo-')
export const TOKEN_GROUPS: readonly TokenGroup[] = groupTokens(TOKENS)
/**
 * The shared sheet plus each primitive sheet that moved beside its component, so the page still
 * lists `mo-table`, `mo-spinner` and the others. Only sheets with `--- Title ---` banners join:
 * the parser files each class under the banner above it, so a sheet without banners would put
 * its classes under the previous sheet's last section.
 */
export const PRIMITIVES: readonly PrimitiveSection[] = parsePrimitives(
  [designSystemCss, dataTableCss, loadingOverlayCss, spinnerCss, threadPanelCss, commentComposerCss].join('\n'),
)
/**
 * Every sheet the barème grades, as `benchmark.test.ts` lists them in `GRADED_SHEETS` —
 * a `?raw` import each, because Vite only resolves a literal specifier. The two lists are
 * paired by a test there: a primitive whose rules moved beside it would otherwise grade
 * green under vitest and red on its own page, reporting « n'existe pas dans la feuille de
 * style » — a broken check reading as a design defect, which is the one thing this
 * machinery must not do.
 */
export const DECLARATIONS: ReadonlyMap<string, Declarations> = parseDeclarations(
  [
    designSystemCss,
    breadcrumbCss,
    dataTableCss,
    loadingOverlayCss,
    spinnerCss,
    threadPanelCss,
    commentComposerCss,
    contextMenuCss,
    spreadsheetGridCss,
  ].join('\n'),
)
export const ALL_CLASSES: readonly ClassEntry[] = PRIMITIVES.flatMap((s) => s.classes)

export const LEGACY_TOKENS: readonly TokenEntry[] = parseTokens(indexCss, '--')
export const LEGACY_GROUPS: readonly TokenGroup[] = groupTokens(LEGACY_TOKENS)

export const SHEETS: readonly Sheet[] = toSheets(
  import.meta.glob('/src/**/*.css', { query: '?raw', import: 'default', eager: true }),
)

/**
 * True when the `?raw` bindings came back empty — under vitest, always.
 *
 * The pages render a notice instead of an empty table so the smoke test still
 * sees something, and so a Storybook build that lost the raw loader reads as
 * broken rather than as a design system with nothing in it.
 */
export const INVENTORY_IS_BOUND = TOKENS.length > 0
