import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './icon-button';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('IconButton', () => {
  it('names the button from its label and hides the icon', () => {
    render(<IconButton label="Close dialog" icon={<svg data-testid="icon" />} />);
    const button = screen.getByRole('button', { name: 'Close dialog' });
    expect(button.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('defaults to the tertiary variant', () => {
    render(<IconButton label="Close" icon="x" />);
    expect(screen.getByRole('button').className).toContain('ds-button--tertiary');
  });

  it('calls onClick, and stops while loading', () => {
    const onClick = vi.fn();
    const { rerender } = render(<IconButton label="Refresh" icon="r" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    rerender(<IconButton label="Refresh" icon="r" onClick={onClick} loading />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations', async () => {
    const { container } = render(<IconButton label="Close dialog" icon={<svg />} />);
    await expectNoAxeViolations(container);
  });

  it('takes another variant and keeps a caller class beside its own', () => {
    render(<IconButton label="Close" icon="x" variant="subtle" className="extra" />);
    const classes = screen.getByRole('button', { name: 'Close' }).className.split(' ');
    expect(classes).toContain('ds-button--subtle');
    expect(classes).not.toContain('ds-button--tertiary');
    expect(classes).toContain('ds-icon-button');
    expect(classes).toContain('extra');
  });
});
