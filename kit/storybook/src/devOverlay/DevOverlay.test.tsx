import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { declarationsOf } from '../test/cssRules'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DevOverlay, SETTLE_MS } from './DevOverlay'

/**
 * The wiring the unit tests around `resolveAnchor` cannot reach: that a finding ends up
 * as a box sitting on the rectangle of the element it is about.
 *
 * Both sources are stubbed — one advisory from the array the agent writes, one violation
 * from axe — so what is under test is the placement, not axe's ruleset.
 */

vi.mock('./advisories', () => ({
  advisories: [
    {
      ruleId: 'data-table.numeric-mono',
      ref: 'src/pages/Home/Home.tsx:42',
      severity: 'HAUT',
      rule: '§2.7 tables',
      message: 'Colonne « Heures » centrée : les magnitudes ne sont pas alignées.',
    },
  ],
}))

vi.mock('axe-core', () => ({
  default: {
    run: async () => ({
      violations: [
        {
          id: 'color-contrast',
          help: 'Elements must have sufficient colour contrast',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.13/color-contrast',
          impact: 'serious',
          nodes: [
            {
              impact: 'serious',
              failureSummary: 'Fix any of the following: contrast is 2.1:1',
              element: document.getElementById('a11y-target'),
            },
          ],
        },
      ],
    }),
  },
}))

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

function stubRect(element: HTMLElement, rect: Rect) {
  const full = {
    ...rect,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    x: rect.left,
    y: rect.top,
    toJSON: () => rect,
  } as DOMRect

  element.getBoundingClientRect = () => full
}

function renderOverlay() {
  return render(
    <MemoryRouter>
      <DevOverlay />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.setItem(
    'mo-dev-overlay',
    JSON.stringify({ open: true, a11y: true, advisories: true, pickable: true }),
  )

  document.body.innerHTML = `
    <main>
      <p id="advisory-target" data-mo-src="src/pages/Home/Home.tsx:42">heures</p>
      <b id="a11y-target">contraste</b>
      <span id="collapsed" data-mo-src="src/pages/Home/Home.tsx:99"></span>
    </main>
  `

  stubRect(document.getElementById('advisory-target')!, { top: 10, left: 20, width: 100, height: 30 })
  stubRect(document.getElementById('a11y-target')!, { top: 60, left: 20, width: 80, height: 20 })
})

describe('DevOverlay', () => {
  it('paints an advisory on the rectangle of the element its file:line resolves to', async () => {
    renderOverlay()

    const marker = await waitFor(() => {
      const found = document.querySelector<HTMLElement>('.mo-dev__marker[data-kind="advisory"]')
      expect(found).not.toBeNull()
      return found!
    })

    expect(marker.style.top).toBe('10px')
    expect(marker.style.left).toBe('20px')
    expect(marker.style.width).toBe('100px')
    expect(marker.style.height).toBe('30px')
    expect(marker.dataset.severity).toBe('HAUT')
    expect(marker.textContent).toContain('§2.7 tables')
  })

  it('paints an axe violation on the element that failed, at its own severity', async () => {
    renderOverlay()

    const marker = await waitFor(() => {
      const found = document.querySelector<HTMLElement>('.mo-dev__marker[data-kind="a11y"]')
      expect(found).not.toBeNull()
      return found!
    })

    expect(marker.style.top).toBe('60px')
    expect(marker.dataset.severity).toBe('HAUT')
    expect(marker.textContent).toContain('color-contrast')
  })

  it('draws nothing for an element that has collapsed to nothing', async () => {
    renderOverlay()

    await waitFor(() => expect(document.querySelectorAll('.mo-dev__marker')).toHaveLength(2))
  })

  it('opens the finding when its marker is clicked, once markers are pickable', async () => {
    renderOverlay()

    const marker = await waitFor(() => {
      const found = document.querySelector<HTMLElement>('.mo-dev__marker[data-kind="advisory"]')
      expect(found).not.toBeNull()
      return found!
    })

    await userEvent.click(marker)

    expect(screen.getByText(/les magnitudes ne sont pas alignées/)).toBeInTheDocument()
    // the finding names the benchmark rule it breaks, which is what Fondations/Barème lists
    expect(screen.getByText('data-table.numeric-mono')).toBeInTheDocument()
  })

  it('re-resolves advisories when the HUD asks for a rescan, not just the axe scan', async () => {
    // The advisory's element is absent at mount, so nothing can be painted for it yet.
    document.getElementById('advisory-target')!.remove()
    renderOverlay()

    // Let the post-navigation settle timer fire FIRST. Without this wait the test passes
    // whether or not the button works: the timer lands after the element is appended and
    // resolves the marker on its own.
    await new Promise((resolve) => setTimeout(resolve, SETTLE_MS + 200))
    expect(document.querySelectorAll('.mo-dev__marker[data-kind="advisory"]')).toHaveLength(0)

    // It arrives later, the way a route's data does.
    const arrived = document.createElement('p')
    arrived.id = 'advisory-target'
    arrived.setAttribute('data-mo-src', 'src/pages/Home/Home.tsx:42')
    document.querySelector('main')!.append(arrived)
    stubRect(arrived, { top: 10, left: 20, width: 100, height: 30 })

    // Nothing re-resolves by itself — that is the point of the button.
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(document.querySelectorAll('.mo-dev__marker[data-kind="advisory"]')).toHaveLength(0)

    await userEvent.click(screen.getByRole('button', { name: 'Relancer' }))

    await waitFor(() =>
      expect(document.querySelectorAll('.mo-dev__marker[data-kind="advisory"]')).toHaveLength(1),
    )
  })

  it('stops painting a layer the HUD turns off', async () => {
    renderOverlay()

    await waitFor(() => expect(document.querySelectorAll('.mo-dev__marker')).toHaveLength(2))

    await userEvent.click(screen.getByRole('checkbox', { name: /Avis UI\/UX/ }))

    await waitFor(() =>
      expect(document.querySelectorAll('.mo-dev__marker[data-kind="advisory"]')).toHaveLength(0),
    )
    expect(document.querySelectorAll('.mo-dev__marker[data-kind="a11y"]')).toHaveLength(1)
  })

  /**
   * The overlay is drawn over a working application, and a marker covers the whole rectangle
   * of the element it is about. Taking the pointer by default put every finding between the
   * developer and the control it was about: on a page with a dozen of them, the button an
   * advisory complained about could not be pressed to see the behaviour it complained of.
   */
  describe('clicking through', () => {
    it('lets the pointer reach the element underneath by default', async () => {
      localStorage.setItem(
        'mo-dev-overlay',
        JSON.stringify({ open: true, a11y: true, advisories: true, pickable: false }),
      )
      const target = document.getElementById('advisory-target')!
      const clicked = vi.fn()
      target.addEventListener('click', clicked)

      renderOverlay()
      await waitFor(() => expect(document.querySelectorAll('.mo-dev__marker').length).toBeGreaterThan(0))

      // The marker is not a control, so it is not in the way and not in the tab order.
      expect(document.querySelector('.mo-dev__marker')!.tagName).toBe('DIV')
      expect(document.querySelectorAll('.mo-dev__layer button')).toHaveLength(0)
      expect(document.querySelector('.mo-dev__layer')!.getAttribute('data-pickable')).toBe('false')

      target.click()
      expect(clicked).toHaveBeenCalled()
    })

    it('makes markers targets when the HUD asks for it', async () => {
      localStorage.setItem(
        'mo-dev-overlay',
        JSON.stringify({ open: true, a11y: true, advisories: true, pickable: false }),
      )
      renderOverlay()
      await waitFor(() => expect(document.querySelectorAll('.mo-dev__marker').length).toBeGreaterThan(0))

      await userEvent.click(screen.getByLabelText('Marqueurs cliquables'))

      await waitFor(() =>
        expect(document.querySelector('.mo-dev__layer')!.getAttribute('data-pickable')).toBe('true'),
      )
      expect(document.querySelector('.mo-dev__marker')!.tagName).toBe('BUTTON')
    })
  })
})

/**
 * The claim « the pointer goes through » is a stylesheet claim, and the suite runs with
 * `css: false` — no check here renders a box or reads a computed style. So it is asserted
 * against the sheet's own text: the DOM tests above establish that a non-pickable marker is not
 * a control, and this establishes that it does not take the pointer either. Neither alone is
 * the whole guarantee.
 */
describe('DevOverlay.css — the pointer', () => {
  const css = readFileSync(join(__dirname, 'DevOverlay.css'), 'utf8')

  it('lets a marker pass the pointer through by default', () => {
    expect(declarationsOf(css, '\\.mo-dev__marker')).toMatch(/pointer-events:\s*none/)
  })

  it('takes the pointer only inside a layer that was asked to', () => {
    const pickable = declarationsOf(css, "\\.mo-dev__layer\\[data-pickable='true'\\] \\.mo-dev__marker")

    expect(pickable).toMatch(/pointer-events:\s*auto/)
    expect(pickable).toMatch(/cursor:\s*pointer/)
  })

  it('keeps the overlay root transparent to the pointer, so only its panels take clicks', () => {
    expect(declarationsOf(css, '\\[data-mo-dev-overlay\\]')).toMatch(/pointer-events:\s*none/)
  })
})
