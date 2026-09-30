import { describe, expect, it } from 'vitest';
import { forcedStateCss } from './forced-state-css';

describe('forcedStateCss', () => {
  it('rewrites pseudo-classes to forced classes', () => {
    const css = forcedStateCss(['.a:active { color: red } .a:focus-visible { outline: thin solid } .a:visited { color: gray }']);
    expect(css).toContain('.a.doc-force-active { color: red }');
    expect(css).toContain('.a.doc-force-focus { outline: thin solid }');
    expect(css).toContain('.a.doc-force-visited { color: gray }');
  });

  it('lifts hover rules out of (hover: hover) and (any-hover: hover)', () => {
    const css = forcedStateCss([
      '@media (hover: hover) { .a:hover:not(.b) { color: blue } }',
      '@media (any-hover: hover) { .c:hover { color: green } }',
    ]);
    expect(css).toBe('.a.doc-force-hover:not(.b) { color: blue }\n.c.doc-force-hover { color: green }');
    expect(css).not.toContain('@media');
  });

  it('keeps other media queries out', () => {
    const css = forcedStateCss([
      '@media (prefers-reduced-motion: reduce) { .a:hover { transition: none } }',
      '@media (max-width: 0) { .a:focus-visible { outline: 0 } }',
      '@media (hover: none) { .a:active { color: red } }',
    ]);
    expect(css).toBe('');
  });

  it('skips rules without a state pseudo-class', () => {
    expect(forcedStateCss(['@media (hover: hover) { .a { color: red } } .b { color: blue }'])).toBe('');
  });
});
