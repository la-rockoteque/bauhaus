import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('Checkbox', () => {
  it('is a native checkbox named by its label', () => {
    render(<Checkbox label="Accept the terms" />);
    const box = screen.getByRole('checkbox', { name: 'Accept the terms' }) as HTMLInputElement;
    expect(box.tagName).toBe('INPUT');
    expect(box.type).toBe('checkbox');
  });

  it('toggles with Space', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Accept" onChange={onChange} />);
    await userEvent.tab();
    await userEvent.keyboard(' ');
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
    await userEvent.keyboard(' ');
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('toggles when the label is clicked', async () => {
    render(<Checkbox label="Accept" />);
    await userEvent.click(screen.getByText('Accept'));
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
  });

  it('exposes the mixed state', () => {
    render(<Checkbox label="All" indeterminate />);
    expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true);
  });

  it('ties description and error to the box and sets aria-invalid', () => {
    render(<Checkbox label="Accept" description="Read them first." error="You must accept to continue." required />);
    const box = screen.getByRole('checkbox');
    expect(box.getAttribute('aria-invalid')).toBe('true');
    expect(box.getAttribute('aria-describedby')).toBe(`${screen.getByText('Read them first.').id} ${screen.getByText(/You must accept/).closest('p')!.id}`);
    expect(screen.getByText('(required)')).toBeTruthy();
  });

  it('ignores Space when disabled', async () => {
    render(<Checkbox label="Accept" disabled />);
    await userEvent.click(screen.getByText('Accept'));
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(false);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Checkbox label="One" />
        <Checkbox label="Two" defaultChecked description="Hint" />
        <Checkbox label="Three" indeterminate />
        <Checkbox label="Four" error="Fix it" />
        <Checkbox label="Five" disabled />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
