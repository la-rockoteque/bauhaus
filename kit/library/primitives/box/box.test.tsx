import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';
import { Box } from './box';

describe('Box', () => {
  it('renders a div with no role by default, and lets the caller pick the element', () => {
    const { rerender } = render(<Box data-testid="box">Content</Box>);
    expect(screen.getByTestId('box').tagName).toBe('DIV');
    expect(screen.getByTestId('box').hasAttribute('role')).toBe(false);
    rerender(<Box as="section" aria-label="Summary" data-testid="box">Content</Box>);
    expect(screen.getByRole('region', { name: 'Summary' }).tagName).toBe('SECTION');
  });

  it('maps padding and gap props to space-step classes', () => {
    render(<Box padding={4} paddingInline={6} paddingBlock={2} display="flex" gap={3} data-testid="box" />);
    const { className } = screen.getByTestId('box');
    for (const name of ['ds-box--p-4', 'ds-box--pi-6', 'ds-box--pb-2', 'ds-box--gap-3', 'ds-box--flex']) expect(className).toContain(name);
  });

  it('adds no spacing class when no prop is given, and keeps step 0', () => {
    const { rerender } = render(<Box data-testid="box" />);
    expect(screen.getByTestId('box').className).not.toMatch(/--(?:p|pi|pb|gap)-/);
    rerender(<Box padding={0} data-testid="box" />);
    expect(screen.getByTestId('box').className).toContain('ds-box--p-0');
  });

  it('applies a surface role and keeps the caller class and native attributes', () => {
    render(<Box surface="raised" className="extra" id="card" data-testid="box" />);
    const el = screen.getByTestId('box');
    expect(el.className).toContain('ds-box--surface-raised');
    expect(el.className).toContain('extra');
    expect(el.id).toBe('card');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Box as="section" aria-label="Summary" padding={4}><p>Content</p></Box>);
    await expectNoAxeViolations(container);
  });

  it('takes no click or key handler, so a pressable Box cannot be written', () => {
    // @ts-expect-error A Box that must be pressed is a button or a link.
    render(<Box onClick={() => undefined} />);
    // @ts-expect-error The same holds for key handlers.
    render(<Box onKeyDown={() => undefined} />);
  });
});
