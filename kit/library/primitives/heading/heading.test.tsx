import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';
import { Heading } from './heading';
import type { HeadingLevel } from './heading';

const LEVELS: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

describe('Heading', () => {
  it.each(LEVELS)('level %i renders the matching heading element', (level) => {
    render(<Heading level={level}>Title</Heading>);
    expect(screen.getByRole('heading', { level }).tagName).toBe(`H${level}`);
  });

  it('picks a default size from the level', () => {
    render(<>{LEVELS.map((level) => <Heading key={level} level={level}>{`Level ${level}`}</Heading>)}</>);
    const size = (level: number) => screen.getByText(`Level ${level}`).className;
    expect(size(1)).toContain('ds-heading--display');
    expect(size(2)).toContain('ds-heading--heading');
    expect(size(3)).toContain('ds-heading--subheading');
    for (const level of [4, 5, 6]) expect(size(level)).toContain('ds-heading--label');
  });

  it('keeps the outline when the size changes: an h2 can look like a label', () => {
    render(<Heading level={2} size="label">Delivery</Heading>);
    const el = screen.getByRole('heading', { level: 2 });
    expect(el.className).toContain('ds-heading--label');
    expect(el.className).not.toContain('ds-heading--heading');
  });

  it('an h1 can look small and an h4 can look large without changing the levels', () => {
    render(<><Heading level={1} size="label">Page</Heading><Heading level={4} size="display">Aside</Heading></>);
    expect(screen.getAllByRole('heading').map((h) => h.tagName)).toEqual(['H1', 'H4']);
  });

  it('passes native attributes through and keeps the caller class', () => {
    render(<Heading level={2} id="delivery" className="extra">Delivery</Heading>);
    const el = screen.getByRole('heading');
    expect(el.id).toBe('delivery');
    expect(el.className).toContain('extra');
  });

  it('has no axe violations for an outline in order', async () => {
    const { container } = render(<><Heading level={1}>Orders</Heading><Heading level={2}>Delivery</Heading><Heading level={3} size="label">Address</Heading></>);
    await expectNoAxeViolations(container);
  });
});
