import { resolveValue, sameValue, type Declarations, type TokenEntry } from '../foundations/styleInventory'
import { AA_NORMAL_TEXT, contrastRatio } from './contrast'

/**
 * The implementations behind every `verify: 'auto'` rule, keyed by rule id.
 *
 * Each returns `null` when the rule holds and a one-line reason when it does not.
 * They read the *stylesheet and the tokens*, never computed styles: vitest runs with
 * `css: false`, so nothing in the suite has a cascade to measure. Asserting the
 * declarations is in any case the stronger check — it fails on the hardcoded value
 * rather than on the pixel it happens to produce.
 *
 * Deliberately DOM-free. An expectation about structure or API — « un état vide qui
 * occupe la page offre son action » — is a `review` rule today; rendering primitives
 * in here would pull RTL into the benchmark for a handful of cases.
 */
export interface Sheet {
  declarations: ReadonlyMap<string, Declarations>
  tokens: readonly TokenEntry[]
}

export type Check = (sheet: Sheet) => string | null

const at = (sheet: Sheet, selector: string): Declarations | undefined =>
  sheet.declarations.get(selector)

/**
 * The failure a check reports when the selector it names is not in the stylesheet at all.
 *
 * Load-bearing, and the reason `omits` cannot just read a declaration and shrug. A check
 * whose selector has been renamed is a broken check, not a satisfied rule — and `omits`
 * in particular would otherwise report **pass** for a selector that no longer exists,
 * which is the one failure mode this machinery must not have: the rule would go green,
 * the ratchet would invite removing it from the baseline, and the system would read as
 * clean while nothing was being checked.
 */
const MISSING = (selector: string): string => `${selector} n'existe pas dans la feuille de style`

/** The selector declares this property with this exact value (tokens resolved). */
export const declares =
  (selector: string, property: string, expected: string): Check =>
  (sheet) => {
    const declarations = at(sheet, selector)

    if (!declarations) return MISSING(selector)

    const found = declarations[property]

    if (found === undefined) return `${selector} ne déclare pas ${property}`
    if (!sameValue(found, expected)) return `${selector} { ${property}: ${found} } au lieu de ${expected}`

    return null
  }

/**
 * The selector exists and does not declare this property.
 *
 * Both halves are asserted. A missing selector is a failure, not a pass — see `MISSING`.
 */
export const omits =
  (selector: string, property: string): Check =>
  (sheet) => {
    const declarations = at(sheet, selector)

    if (!declarations) return MISSING(selector)

    const found = declarations[property]

    return found === undefined ? null : `${selector} déclare ${property}: ${found}`
  }

/**
 * The selector's value for this property is *built from* `token` — for a property whose value
 * is a composition rather than a colour: two stacked gradients, a shorthand, a `box-shadow`
 * with three parts. `declares` would have to spell the whole thing out, which asserts the
 * formatting as much as the intent and breaks on a reordered stop.
 */
export const builtFrom =
  (selector: string, property: string, token: string): Check =>
  (sheet) => {
    const declarations = at(sheet, selector)

    if (!declarations) return MISSING(selector)

    const found = declarations[property]

    if (found === undefined) return `${selector} ne déclare pas ${property}`
    if (!found.includes(token)) return `${selector} { ${property} } n'utilise pas ${token}`

    return null
  }

/** A px-valued property is at least `min`. */
export const atLeastPx =
  (selector: string, property: string, min: number): Check =>
  (sheet) => {
    const declarations = at(sheet, selector)

    if (!declarations) return MISSING(selector)

    const found = declarations[property]

    if (found === undefined) return `${selector} ne déclare pas ${property}`

    const px = /^(\d+(?:\.\d+)?)px$/.exec(found.trim())
    if (!px) return `${selector} { ${property}: ${found} } n'est pas une valeur en px`

    return Number(px[1]) >= min ? null : `${selector} { ${property}: ${found} }, minimum ${min}px`
  }

/** The house keyboard ring, on the `:focus-visible` of an interactive primitive. */
export const focusRing =
  (selector: string): Check =>
  (sheet) => {
    // The base selector too: without it, a renamed primitive would report « pose aucun
    // anneau » for ever, which reads as a design defect rather than a broken check.
    if (!at(sheet, selector)) return MISSING(selector)

    const ring = at(sheet, `${selector}:focus-visible`)?.['box-shadow']

    if (ring === undefined) return `${selector}:focus-visible ne pose aucun anneau`

    return ring.includes('--mo-primary-soft')
      ? null
      : `${selector}:focus-visible pose « ${ring} » et non l'anneau maison`
  }

/** Every value the selector declares comes from a token, never a literal colour. */
export const noLiteralColour =
  (selector: string): Check =>
  (sheet) => {
    const declarations = at(sheet, selector)

    if (!declarations) return MISSING(selector)

    const literal = Object.entries(declarations).filter(([, value]) =>
      /#[0-9a-fA-F]{3,8}\b|\brgba?\(/.test(value),
    )

    return literal.length === 0
      ? null
      : literal.map(([property, value]) => `${property}: ${value}`).join(' · ') + ' — sans jeton'
  }

/** Two tokens meet WCAG AA for body text against each other. */
export const contrastAA =
  (foreground: string, background: string, min: number = AA_NORMAL_TEXT): Check =>
  (sheet) => {
    const fg = resolveValue(sheet.tokens, `var(${foreground})`)
    const bg = resolveValue(sheet.tokens, `var(${background})`)
    const ratio = contrastRatio(fg, bg)

    if (ratio === null) return `${foreground} sur ${background} : « ${fg} » sur « ${bg} » illisible`

    return ratio >= min
      ? null
      : `${foreground} sur ${background} mesure ${ratio.toFixed(2)}:1, minimum ${min}:1`
  }

/** Every part must hold; reports the first that does not. */
export const all =
  (...checks: Check[]): Check =>
  (sheet) => {
    for (const check of checks) {
      const failure = check(sheet)
      if (failure) return failure
    }

    return null
  }
