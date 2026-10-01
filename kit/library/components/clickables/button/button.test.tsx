import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('Button', () => {
  it('is a native button of type button, so it does not submit a form by accident', () => {
    render(<Button>Save changes</Button>);
    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('applies the variant', () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole('button').className).toContain('ds-button--secondary');
  });

  it('calls onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save changes</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ignores presses while disabled', () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Save changes</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('while loading keeps the label, marks aria-busy and blocks repeat presses', () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Save changes</Button>);
    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button.getAttribute('aria-busy')).toBe('true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps the button focusable while loading, so keyboard focus is not lost', () => {
    render(<Button loading>Save changes</Button>);
    expect(screen.getByRole('button').hasAttribute('disabled')).toBe(false);
  });

  it('has no axe violations in its default, disabled and loading states', async () => {
    const { container } = render(<><Button>Save changes</Button><Button disabled>Save</Button><Button loading>Send</Button></>);
    await expectNoAxeViolations(container);
  });

  it('keeps a caller class beside its own', () => {
    render(<Button className="extra">Filter</Button>);
    const classes = screen.getByRole('button', { name: 'Filter' }).className.split(' ');
    expect(classes).toEqual(expect.arrayContaining(['ds-button', 'ds-button--primary', 'extra']));
  });
});
