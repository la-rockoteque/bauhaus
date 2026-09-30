import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';
import { GLYPHS, GLYPH_NAMES } from './glyphs';
import { Icon } from './icon';

describe('Icon', () => {
  it('ships the sixteen glyphs, each with path data', () => {
    expect(GLYPH_NAMES).toHaveLength(16);
    for (const glyph of GLYPH_NAMES) expect(GLYPHS[glyph].length).toBeGreaterThan(0);
  });

  it.each(GLYPH_NAMES)('draws the %s glyph from its path data', (glyph) => {
    const { container } = render(<Icon glyph={glyph} />);
    expect(container.querySelector('path')?.getAttribute('d')).toBe(GLYPHS[glyph]);
  });

  it('is hidden from assistive technology by default', () => {
    const { container } = render(<Icon glyph="search" />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.hasAttribute('role')).toBe(false);
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('becomes an image with a name when it has a label', () => {
    render(<Icon glyph="warning" label="Warning" />);
    const img = screen.getByRole('img', { name: 'Warning' });
    expect(img.hasAttribute('aria-hidden')).toBe(false);
  });

  it('takes its size from the size prop, md by default', () => {
    const { container, rerender } = render(<Icon glyph="plus" />);
    expect(container.querySelector('svg')!.getAttribute('class')).toContain('ds-icon--md');
    rerender(<Icon glyph="plus" size="lg" />);
    expect(container.querySelector('svg')!.getAttribute('class')).toContain('ds-icon--lg');
  });

  it('has no axe violations, hidden or labelled', async () => {
    const { container } = render(<><Icon glyph="check" /><Icon glyph="info" label="Information" size="sm" /></>);
    await expectNoAxeViolations(container);
  });
});
