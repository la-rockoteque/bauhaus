import { isValidElement, type ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/render'

/**
 * Every story renders without throwing.
 *
 * Storybook documents components it does not own: a prop renamed in
 * `components/ui/` or in `components/Form/` breaks these pages, and nothing else
 * in the suite looks at them. `npm run build-storybook` only proves the bundle
 * compiles — a story that throws on render builds perfectly and is a blank page.
 *
 * This is a smoke test on purpose: it asserts that something rendered, not what.
 * The pages are documentation, and pinning their text here would mean editing a
 * test every time a sentence is reworded.
 */

// eager: the modules are wanted now, and a lazy glob would hand back promises
// the `it` below would have to await one by one.
const MODULES = import.meta.glob<Record<string, unknown>>('./**/*.stories.tsx', { eager: true })

interface StoryLike {
  /** Storybook hands `args` to render; most pages here ignore them. */
  render?: (args: Record<string, unknown>) => ReactElement
  args?: Record<string, unknown>
}

const isStory = (value: unknown): value is StoryLike =>
  typeof value === 'object' && value !== null && typeof (value as StoryLike).render === 'function'

describe('Storybook pages', () => {
  it('finds every story file', () => {
    // A glob that silently matches nothing would make every assertion below pass.
    expect(Object.keys(MODULES).length).toBeGreaterThanOrEqual(12)
  })

  for (const [path, module] of Object.entries(MODULES)) {
    const stories = Object.entries(module).filter(
      ([name, value]) => name !== 'default' && isStory(value),
    )

    it(`${path} exports at least one story`, () => {
      expect(stories.length).toBeGreaterThan(0)
    })

    for (const [name, story] of stories) {
      it(`${path} · ${name} renders`, () => {
        const element = (story as StoryLike).render!((story as StoryLike).args ?? {})
        expect(isValidElement(element)).toBe(true)

        const { container } = renderWithProviders(element)
        expect(container.firstElementChild).not.toBeNull()
      })
    }
  }
})
