import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * dialog-consolidation QA plan cases 4, 10 and 20: every modal renders through `ui/Dialog`,
 * every confirmation through `ConfirmDialog`, and the stacking order has one scale.
 *
 * `devOverlay/` is skipped, as the style ratchets skip it: it is developer chrome drawn over the
 * product, not part of it.
 */

const SRC = join(__dirname, '..', '..')

/** The panels that carry `role="dialog"` without being `ui/Dialog` modals (story § Out of scope). */
const ROLE_DIALOG_PANELS = [
  'components/Notifications/NotificationPopover.tsx',
  'components/MaterialsSpotlight/MaterialsSpotlight.tsx',
  'pages/NouvelleRequisition/RequisitionAssistantDrawer.tsx',
  'pages/NouvelleRequisition/TemplateLoader.tsx',
]

/** Of those, the two that also say `aria-modal`. */
const ARIA_MODAL_PANELS = [
  'components/MaterialsSpotlight/MaterialsSpotlight.tsx',
  'pages/NouvelleRequisition/RequisitionAssistantDrawer.tsx',
]

const files = (dir: string, found: string[] = []): string[] => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'stories' && entry.name !== 'devOverlay') files(full, found)
    } else if (/\.(tsx?|css)$/.test(entry.name) && !entry.name.includes('.test.')) {
      found.push(full)
    }
  }
  return found
}

const SOURCES = files(SRC).map((path) => ({
  path: relative(SRC, path).replace(/\\/g, '/'),
  text: readFileSync(path, 'utf8'),
}))

const holding = (pattern: RegExp, ext: RegExp = /\.tsx?$/) =>
  SOURCES.filter(({ path, text }) => ext.test(path) && pattern.test(text)).map(({ path }) => path)

const outsideUi = (paths: string[]) => paths.filter((path) => !path.startsWith('components/ui/'))

describe('every modal renders through ui/Dialog', () => {
  it('leaves aria-modal outside components/ui/ only on the drawer and the spotlight', () => {
    expect(outsideUi(holding(/aria-modal/)).filter((path) => !ARIA_MODAL_PANELS.includes(path))).toEqual([])
  })

  it('leaves role="dialog" outside components/ui/ only on the non-modal panels', () => {
    expect(outsideUi(holding(/role=["']dialog["']/)).filter((path) => !ROLE_DIALOG_PANELS.includes(path))).toEqual(
      [],
    )
  })

  // A modal drawn by hand carries no ARIA at all, so the two checks above cannot see it. Its
  // overlay can: the modal layer and a backdrop class are what it cannot do without.
  it('sits nothing on the modal layer but the design system', () => {
    expect(
      holding(/z-index:\s*var\(--mo-z-modal\)/, /\.css$/).filter((path) => path !== 'styles/design-system.css'),
    ).toEqual([])
  })

  it('defines or uses no backdrop class outside components/ui/', () => {
    expect(outsideUi(holding(/\w-backdrop\b/, /\.(tsx?|css)$/))).toEqual([])
  })
})

describe('every confirmation renders through ConfirmDialog', () => {
  it('calls no window.confirm anywhere in src/', () => {
    expect(holding(/(?<![\w.])(?:window\.)?confirm\s*\(/)).toEqual([])
  })
})

describe('overlay-stacking-tokens (TM-118) — one stacking scale', () => {
  it('reaches for no var(--z-*) anywhere in src/', () => {
    expect(holding(/var\(--z-/, /\.(tsx?|css)$/)).toEqual([])
  })

  it('declares no --z-* in index.css', () => {
    expect(readFileSync(join(SRC, 'index.css'), 'utf8')).not.toMatch(/^\s*--z-[\w-]+\s*:/m)
  })

  it('reads the sources it is grading', () => {
    expect(SOURCES.length).toBeGreaterThan(300)
    expect(holding(/aria-modal/)).toContain('components/ui/Dialog.tsx')
  })
})
