import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';
import { GLYPHS, GLYPH_NAMES, GLYPH_VIEWBOX } from '../../foundations/iconography/glyphs';
import { Icon } from './icon';

describe('Icon', () => {
  it.each(GLYPH_NAMES)('draws the %s glyph from its path data on the grid, with only currentColor', (glyph) => {
    const { container } = render(<Icon glyph={glyph} />);
    const svg = container.querySelector('svg')!;
    expect(container.querySelector('path')?.getAttribute('d')).toBe(GLYPHS[glyph]);
    expect(svg.getAttribute('viewBox')).toBe(GLYPH_VIEWBOX);
    expect(svg.outerHTML).not.toMatch(/\b(?:fill|stroke)=|#[0-9a-f]{3,8}\b|rgb|hsl/i);
  });

  it('flips the glyphs that point along the reading direction, and only those', () => {
    const { container } = render(<><Icon glyph="arrow-right" /><Icon glyph="arrow-up" /><Icon glyph="clock" /></>);
    const [right, up, clock] = [...container.querySelectorAll('svg')];
    expect(right.getAttribute('class')).toContain('ds-icon--mirror');
    expect(up.getAttribute('class')).not.toContain('ds-icon--mirror');
    expect(clock.getAttribute('class')).not.toContain('ds-icon--mirror');
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

  it('has no axe violations, hidden or labelled, for the whole set', async () => {
    const { container } = render(
      <>
        {GLYPH_NAMES.map((glyph) => <Icon key={glyph} glyph={glyph} />)}
        <Icon glyph="info" label="Information" size="sm" />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
