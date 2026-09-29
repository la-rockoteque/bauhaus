import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * QA plan case 1 for TM-118 (overlay-stacking-tokens). Every stacking layer now has a
 * `--mo-z-*` token in `design-system.css`, so a bare number in a `z-index` declaration is
 * exactly the drift the story closes — Modal 1000, Toast 1100, MaterialsSpotlight 1200 were
 * three answers to the same question. Below 100 stays out of scope (context menus, grid
 * internals): the story's acceptance only names the tier that now has a token.
 */

const SRC = join(__dirname, '..')

const stylesheets = (dir: string, found: string[] = []): string[] => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) stylesheets(full, found)
    else if (entry.name.endsWith('.css')) found.push(full)
  }
  return found
}

/** A `z-index:` declaration with a literal number — `var(--mo-z-*)` never matches this. */
const A_LITERAL_Z_INDEX = /z-index:\s*(\d+)/g

describe('overlay-stacking-tokens (TM-118) — no literal z-index >= 100', () => {
  it('every high stacking layer names its --mo-z-* token instead of a bare number', () => {
    const offenders = stylesheets(SRC)
      .filter((path) => {
        const text = readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
        return [...text.matchAll(A_LITERAL_Z_INDEX)].some((m) => Number(m[1]) >= 100)
      })
      .map((path) => path.slice(SRC.length + 1))

    expect(offenders, `literal z-index >= 100 in: ${offenders.join(', ')}`).toEqual([])
  })
})
