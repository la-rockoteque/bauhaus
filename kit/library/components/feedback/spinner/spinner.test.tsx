import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './spinner';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('Spinner', () => {
  it('is a status region named by its label', () => {
    render(<Spinner label="Loading orders" />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('Loading orders');
  });

  it('hides the ring from assistive technology', () => {
    const { container } = render(<Spinner label="Loading" />);
    expect(container.querySelector('.ds-spinner__ring')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('keeps the label out of sight unless showLabel is set', () => {
    const { container, rerender } = render(<Spinner label="Loading" />);
    expect(container.querySelector('.ds-visually-hidden')?.textContent).toBe('Loading');
    rerender(<Spinner label="Loading" showLabel />);
    expect(container.querySelector('.ds-visually-hidden')).toBeNull();
    expect(container.querySelector('.ds-spinner__label')?.textContent).toBe('Loading');
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size', (size) => {
    render(<Spinner label="Loading" size={size} />);
    expect(screen.getByRole('status').className).toContain(`ds-spinner--${size}`);
  });

  it('has no axe violations in every size', async () => {
    const { container } = render(<><Spinner label="Loading" size="sm" /><Spinner label="Loading" /><Spinner label="Loading" size="lg" showLabel /></>);
    await expectNoAxeViolations(container);
  });
});
