import { beforeEach, describe, expect, it } from 'vitest'
import { appliesToRoute, buildAdvisoryMarkers } from './buildAdvisoryMarkers'
import { nearestRef, parseRef, resolveAdvisory, resolveAnchor } from './resolveAnchor'
import type { Advisory } from './types'

function render(html: string): HTMLElement {
  document.body.innerHTML = html
  return document.body
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('parseRef', () => {
  it('splits the file from the line', () => {
    expect(parseRef('src/pages/Home/Home.tsx:42')).toEqual({
      file: 'src/pages/Home/Home.tsx',
      line: 42,
    })
  })

  it('refuses a reference with no usable line', () => {
    expect(parseRef('Home.tsx')).toBeNull()
    expect(parseRef('Home.tsx:abc')).toBeNull()
    expect(parseRef('Home.tsx:0')).toBeNull()
    expect(parseRef(':12')).toBeNull()
  })
})

describe('resolveAnchor', () => {
  it('finds the element stamped with the exact reference', () => {
    const scope = render(`
      <div data-mo-src="src/pages/Home/Home.tsx:10" id="before"></div>
      <div data-mo-src="src/pages/Home/Home.tsx:42" id="hit"></div>
    `)

    expect(resolveAnchor('src/pages/Home/Home.tsx:42', scope)?.id).toBe('hit')
  })

  it('accepts a basename, which is how the agent usually writes the anchor', () => {
    const scope = render('<div data-mo-src="src/pages/Home/Home.tsx:42" id="hit"></div>')

    expect(resolveAnchor('Home.tsx:42', scope)?.id).toBe('hit')
  })

  it('does not treat a longer filename as a match for its suffix', () => {
    const scope = render('<div data-mo-src="src/pages/MyHome.tsx:42" id="nope"></div>')

    expect(resolveAnchor('Home.tsx:42', scope)).toBeNull()
  })

  it('falls to the nearest stamp below the line, which is what a component wraps', () => {
    const scope = render(`
      <div data-mo-src="src/pages/Home/Home.tsx:30" id="above"></div>
      <div data-mo-src="src/pages/Home/Home.tsx:44" id="below"></div>
    `)

    // The finding is on `<Card>` at line 42; the Card carries no stamp, so the first
    // host element inside it — line 44 — is the element it is about.
    expect(resolveAnchor('src/pages/Home/Home.tsx:42', scope)?.id).toBe('below')
  })

  it('falls back above the line when nothing below it matches', () => {
    const scope = render('<div data-mo-src="src/pages/Home/Home.tsx:30" id="above"></div>')

    expect(resolveAnchor('src/pages/Home/Home.tsx:42', scope)?.id).toBe('above')
  })

  it('ignores stamps from another file entirely', () => {
    const scope = render('<div data-mo-src="src/pages/Other.tsx:42" id="other"></div>')

    expect(resolveAnchor('src/pages/Home/Home.tsx:42', scope)).toBeNull()
  })
})

describe('resolveAdvisory', () => {
  it('prefers the selector when one is given', () => {
    const scope = render(`
      <div data-mo-src="src/pages/Home/Home.tsx:42" id="stamped"></div>
      <div class="mo-table" id="selected"></div>
    `)

    const advisory = { ref: 'src/pages/Home/Home.tsx:42', selector: '.mo-table' }
    expect(resolveAdvisory(advisory, scope)?.id).toBe('selected')
  })

  it('falls back to the stamp when the selector matches nothing', () => {
    const scope = render('<div data-mo-src="src/pages/Home/Home.tsx:42" id="stamped"></div>')

    const advisory = { ref: 'src/pages/Home/Home.tsx:42', selector: '.absent' }
    expect(resolveAdvisory(advisory, scope)?.id).toBe('stamped')
  })

  it('survives a malformed selector instead of taking the layer down', () => {
    const scope = render('<div data-mo-src="src/pages/Home/Home.tsx:42" id="stamped"></div>')

    const advisory = { ref: 'src/pages/Home/Home.tsx:42', selector: ':::' }
    expect(resolveAdvisory(advisory, scope)?.id).toBe('stamped')
  })
})

describe('nearestRef', () => {
  it('reads the stamp off the closest stamped ancestor', () => {
    render('<div data-mo-src="src/a.tsx:3"><span><b id="deep">hi</b></span></div>')

    expect(nearestRef(document.getElementById('deep'))).toBe('src/a.tsx:3')
  })

  it('answers nothing when no ancestor is stamped', () => {
    render('<div><b id="deep">hi</b></div>')

    expect(nearestRef(document.getElementById('deep'))).toBeNull()
  })
})

describe('buildAdvisoryMarkers', () => {
  const advisory = (over: Partial<Advisory> = {}): Advisory => ({
    ref: 'src/pages/Home/Home.tsx:42',
    severity: 'HAUT',
    message: 'colonne numérique centrée',
    ...over,
  })

  it('keeps an advisory with no route on every route', () => {
    expect(appliesToRoute(advisory(), '/anything')).toBe(true)
  })

  it('keeps a routed advisory only under its own prefix', () => {
    expect(appliesToRoute(advisory({ route: '/tracker' }), '/tracker/17')).toBe(true)
    expect(appliesToRoute(advisory({ route: '/tracker' }), '/requisitions')).toBe(false)
  })

  it('builds one marker per advisory it can place', () => {
    const scope = render('<div data-mo-src="src/pages/Home/Home.tsx:42" id="hit"></div>')

    const markers = buildAdvisoryMarkers([advisory()], '/', scope)

    expect(markers).toHaveLength(1)
    expect(markers[0]).toMatchObject({ kind: 'advisory', severity: 'HAUT' })
    expect((markers[0].element as HTMLElement).id).toBe('hit')
  })

  it('carries the cited rule as the marker title, and falls back when there is none', () => {
    const scope = render('<div data-mo-src="src/pages/Home/Home.tsx:42"></div>')

    expect(buildAdvisoryMarkers([advisory({ rule: '§2.7 tables' })], '/', scope)[0].title)
      .toBe('§2.7 tables')
    expect(buildAdvisoryMarkers([advisory()], '/', scope)[0].title).toBe('UI/UX')
  })

  it('drops an advisory it cannot place rather than parking it in a corner', () => {
    const scope = render('<div></div>')

    expect(buildAdvisoryMarkers([advisory()], '/', scope)).toEqual([])
  })

  it('drops an advisory that belongs to another route', () => {
    const scope = render('<div data-mo-src="src/pages/Home/Home.tsx:42"></div>')

    expect(buildAdvisoryMarkers([advisory({ route: '/tracker' })], '/', scope)).toEqual([])
  })
})
