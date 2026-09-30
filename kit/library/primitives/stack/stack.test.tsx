import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';
import { Stack } from './stack';

describe('Stack', () => {
  it('is a vertical flex column with the default gap of space.4', () => {
    render(<Stack data-testid="stack" />);
    const { className } = screen.getByTestId('stack');
    for (const name of ['ds-box--flex', 'ds-stack--vertical', 'ds-box--gap-4', 'ds-stack--align-stretch', 'ds-stack--justify-start']) expect(className).toContain(name);
    expect(className).not.toContain('ds-stack--wrap');
  });

  it('applies direction, gap, alignment, distribution and wrapping', () => {
    render(<Stack data-testid="stack" direction="horizontal" gap={2} align="center" justify="between" wrap />);
    const { className } = screen.getByTestId('stack');
    for (const name of ['ds-stack--horizontal', 'ds-box--gap-2', 'ds-stack--align-center', 'ds-stack--justify-between', 'ds-stack--wrap']) expect(className).toContain(name);
  });

  it('keeps the gap when the step is 0', () => {
    render(<Stack data-testid="stack" gap={0} />);
    expect(screen.getByTestId('stack').className).toContain('ds-box--gap-0');
  });

  it('keeps the DOM order, so the reading order and the visual order match', () => {
    render(<Stack direction="horizontal"><span>First</span><span>Second</span></Stack>);
    expect(screen.getAllByText(/First|Second/).map((el) => el.textContent)).toEqual(['First', 'Second']);
  });

  it('renders a list when asked, and the items stay list items', () => {
    render(<Stack as="ul" aria-label="Steps"><li>One</li><li>Two</li></Stack>);
    const list = screen.getByRole('list', { name: 'Steps' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
  });

  it('resets the markers and the padding of a list, and keeps the list role for Safari', () => {
    render(<><Stack as="ul" aria-label="Bullets"><li>One</li></Stack><Stack as="ol" aria-label="Numbers"><li>One</li></Stack><Stack aria-label="Plain" data-testid="plain" /></>);
    for (const name of ['Bullets', 'Numbers']) {
      const list = screen.getByRole('list', { name });
      expect(list.className).toContain('ds-stack--list');
      expect(list.getAttribute('role')).toBe('list');
    }
    expect(screen.getByTestId('plain').className).not.toContain('ds-stack--list');
    expect(screen.getByTestId('plain').hasAttribute('role')).toBe(false);
  });

  it('lets the caller set another role on a list stack', () => {
    render(<Stack as="ul" role="menu" aria-label="Actions"><li role="none">One</li></Stack>);
    expect(screen.getByRole('menu', { name: 'Actions' })).toBeTruthy();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Stack as="ul" aria-label="Steps" direction="horizontal" wrap><li>One</li><li>Two</li></Stack>);
    await expectNoAxeViolations(container);
  });
});
