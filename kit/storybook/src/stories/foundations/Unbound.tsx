import { INVENTORY_IS_BOUND } from './styleInventory'
import './inventory.css'

/**
 * The notice both inventory pages show when the stylesheets came back empty.
 *
 * Under vitest they always do — `vite.config.ts` sets `test.css: false`, which
 * makes a `?raw` import of a stylesheet resolve to `''` — so the smoke test
 * renders this instead of a page of empty tables, and still sees something.
 *
 * In Storybook it should never appear. If it does, the raw loader is gone and
 * the tables below are lying by omission; that is worth a banner rather than a
 * design system that silently looks like it has nothing in it.
 */
export function Unbound() {
  if (INVENTORY_IS_BOUND) return null

  return (
    <p className="inv__unbound">
      Les feuilles de style ne sont pas lisibles dans ce contexte : les tableaux ci-dessous sont
      vides, et ce n’est pas ce que le système contient. Attendu sous vitest (<code>test.css</code>{' '}
      est à <code>false</code>) ; dans Storybook, c’est que l’import <code>?raw</code> ne passe plus.
    </p>
  )
}
