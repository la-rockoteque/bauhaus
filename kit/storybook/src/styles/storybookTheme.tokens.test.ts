import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { storybookTokens } from '../../.storybook/tokens'

/**
 * Storybook's manager renders in its own document, where `design-system.css` is not
 * loaded and `var(--mo-*)` resolves to nothing. `.storybook/tokens.ts` therefore
 * restates the handful of values the chrome needs as literals — the one duplication
 * of the design system in the repo.
 *
 * Duplication that nothing checks is duplication that drifts: retune `--mo-primary`
 * and the app moves while the sidebar keeps the old navy, which nobody notices because
 * the two are never on screen together. This test is what makes the copy safe.
 */
describe('Storybook chrome tokens', () => {
  const css = readFileSync(join(__dirname, 'design-system.css'), 'utf8')

  // Only the :root block — the same custom property is redeclared in media queries
  // and component scopes further down, and those are not the canonical value.
  const root = css.slice(css.indexOf(':root {'), css.indexOf('\n}'))

  it.each(Object.entries(storybookTokens))('%s matches design-system.css', (name, value) => {
    const declaration = new RegExp(`^\\s*${name}:\\s*(.+?);\\s*$`, 'm').exec(root)

    expect(declaration, `${name} is not declared in design-system.css :root`).not.toBeNull()
    expect(declaration![1].trim()).toBe(value)
  })
})
