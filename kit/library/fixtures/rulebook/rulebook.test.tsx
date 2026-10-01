import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { coverage } from './a11y';
import { declarationsFor, parseCss } from './css-parser';
import { grade } from './grade';
import { Rulebook } from './rulebook';
import { contrast, resolve, THEMES } from './tokens';
import type { Rule } from '../doc-page/types';

const rule = (extra: Partial<Rule> & { id: string }): Rule => ({ component: 'Sample', rubric: 'sample', severity: 'MEDIUM', expectation: 'A sample.', verify: 'auto', basis: 'Project decision', ...extra }) as Rule;

describe('parseCss', () => {
  const css = '/* note */ .a, .b:hover { color: red; margin: 0 } @media (hover: hover) { .a:hover { color: blue } } @keyframes spin { to { rotate: 1turn } }';

  it('reads each selector of a comma list, with its declarations', () => {
    const rules = parseCss(css);
    expect(rules.filter((r) => !r.media).map((r) => r.selector)).toEqual(['.a', '.b:hover']);
    expect(rules[0].declarations).toEqual({ color: 'red', margin: '0' });
  });

  it('keeps the media condition of a nested rule and skips at-rules with no selector', () => {
    const nested = parseCss(css).find((r) => r.media);
    expect(nested).toMatchObject({ selector: '.a:hover', media: '(hover: hover)' });
    expect(parseCss(css).some((r) => r.selector.includes('spin'))).toBe(false);
  });

  it('merges the declarations of a selector outside any media query, in source order', () => {
    const merged = declarationsFor(parseCss('.a { color: red } .a { color: green; gap: 0 } @media (hover: hover) { .a { color: blue } }'), '.a');
    expect(merged).toEqual({ color: 'green', gap: '0' });
    expect(declarationsFor(parseCss(css), '.missing')).toBeUndefined();
  });
});

describe('grade', () => {
  it('leaves a review rule to a person', () => {
    expect(grade(rule({ id: 'sample.review', verify: 'review' })).verdict).toBe('review');
  });

  it('never passes an auto rule that has no check', () => {
    const graded = grade(rule({ id: 'sample.no-check' }));
    expect(graded.verdict).toBe('review');
    expect(graded.reason).toMatch(/no check/);
  });

  it('runs the check of an auto rule', () => {
    expect(grade(rule({ id: 'spacing.target-min' })).verdict).toBe('pass');
  });

  it('reads only the theme roles for the palette alias check, not the colors scales in :root', () => {
    expect(grade(rule({ id: 'color.roles-alias-colors' })).verdict).toBe('pass');
  });
});

describe('coverage', () => {
  it('says "to verify" for an item no rule claims, and takes the worst verdict of the rules that do', () => {
    const rows = coverage([rule({ id: 'sample.review', verify: 'review', covers: ['target-size'] }), rule({ id: 'spacing.target-min', covers: ['target-size'] })]);
    expect(rows.find((row) => row.item.id === 'target-size')?.verdict).toBe('review');
    expect(rows.some((row) => row.verdict === 'to verify')).toBe(true);
  });

  it('sends an unclaimed item outside a foundation scope to the component pages, and keeps a claimed one', () => {
    const rows = coverage([rule({ id: 'spacing.target-min', covers: ['target-size'] })], ['reflow']);
    const verdict = (id: string) => rows.find((row) => row.item.id === id)?.verdict;
    expect(verdict('target-size')).toBe('pass');
    expect(verdict('reflow')).toBe('to verify');
    expect(verdict('keyboard')).toBe('elsewhere');
  });
});

describe('tokens', () => {
  it('reads every theme from dist/tokens.css and follows var() chains', () => {
    expect(THEMES).toEqual(['light', 'dark']);
    expect(resolve('light', '--ds-text-default')).toMatch(/^#/);
    expect(resolve('light', '--ds-text-default')).not.toBe(resolve('dark', '--ds-text-default'));
  });

  it('measures WCAG contrast', () => {
    const text = resolve('light', '--ds-text-default');
    const page = resolve('light', '--ds-surface-default');
    expect(contrast(text, text)).toBe(1);
    expect(contrast(text, page)).toBeGreaterThan(7);
    expect(contrast(text, page)).toBe(contrast(page, text));
    expect(contrast('not a colour', page)).toBeNull();
  });
});

describe('Rulebook', () => {
  afterEach(cleanup);

  it('shows each rule with its verdict', () => {
    render(<Rulebook rules={[rule({ id: 'spacing.target-min', expectation: 'The target is big enough.' }), rule({ id: 'sample.review', verify: 'review', expectation: 'A person decides.' })]} />);
    expect(screen.getByText('The target is big enough.')).toBeTruthy();
    expect(screen.getAllByText(/^(pass|review|fail)$/i).length).toBeGreaterThanOrEqual(2);
  });
});
