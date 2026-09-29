import { transformSync } from '@babel/core'
import { describe, expect, it } from 'vitest'
import stampSource, { sourceRef } from './stampSource'

const ROOT = '/repo/moship-web/'

function stamp(code: string, filename = `${ROOT}src/pages/Home/Home.tsx`): string {
  const result = transformSync(code, {
    filename,
    configFile: false,
    babelrc: false,
    parserOpts: { plugins: ['jsx', 'typescript'] },
    plugins: [[stampSource, { root: ROOT }]],
  })

  return result?.code ?? ''
}

describe('sourceRef', () => {
  it('makes the path relative to the root and forward-slashes it', () => {
    expect(sourceRef('/repo/web/', '/repo/web/src/a.tsx', 12)).toBe('src/a.tsx:12')
    expect(sourceRef('C:\\repo\\', 'C:\\repo\\src\\a.tsx', 3)).toBe('src/a.tsx:3')
  })

  it('leaves a path outside the root alone rather than mangling it', () => {
    expect(sourceRef('/repo/web/', '/elsewhere/a.tsx', 1)).toBe('elsewhere/a.tsx:1')
  })
})

describe('stampSource', () => {
  it('stamps a host element with its file and line', () => {
    expect(stamp('const a = <div>hi</div>')).toContain('data-mo-src="src/pages/Home/Home.tsx:1"')
  })

  it('leaves component elements alone — they take props, not DOM attributes', () => {
    const output = stamp('const a = <Card><span>hi</span></Card>')

    expect(output).not.toMatch(/<Card[^>]*data-mo-src/)
    expect(output).toContain('<span data-mo-src=')
  })

  it('does not stamp a member expression element', () => {
    expect(stamp('const a = <motion.div>hi</motion.div>')).not.toContain('data-mo-src')
  })

  it('reports the line each element opens on', () => {
    const output = stamp(['const a = (', '  <div>', '    <p>hi</p>', '  </div>', ')'].join('\n'))

    expect(output).toContain('data-mo-src="src/pages/Home/Home.tsx:2"')
    expect(output).toContain('data-mo-src="src/pages/Home/Home.tsx:3"')
  })

  it('never stamps the overlay itself', () => {
    const output = stamp('const a = <div>hi</div>', `${ROOT}src/devOverlay/DevHud.tsx`)

    expect(output).not.toContain('data-mo-src')
  })

  it('leaves an existing stamp in place', () => {
    const output = stamp('const a = <div data-mo-src="hand/written.tsx:9">hi</div>')

    expect(output).toContain('data-mo-src="hand/written.tsx:9"')
    expect(output.match(/data-mo-src/g)).toHaveLength(1)
  })
})
