import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './switch';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('Switch', () => {
  it('has the switch role and its label as the name', () => {
    render(<Switch label="Email alerts" />);
    const control = screen.getByRole('switch', { name: 'Email alerts' }) as HTMLInputElement;
    expect(control.type).toBe('checkbox');
  });

  it('toggles with Space and reports the change', async () => {
    const onChange = vi.fn();
    render(<Switch label="Email alerts" onChange={onChange} />);
    await userEvent.tab();
    await userEvent.keyboard(' ');
    expect(screen.getByRole('switch').getAttribute('aria-checked') ?? (screen.getByRole('switch') as HTMLInputElement).checked).toBeTruthy();
    expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(true);
    await userEvent.keyboard(' ');
    expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('toggles when the label is clicked', async () => {
    render(<Switch label="Email alerts" />);
    await userEvent.click(screen.getByText('Email alerts'));
    expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(true);
  });

  it('keeps the label the same in both states', async () => {
    render(<Switch label="Email alerts" />);
    await userEvent.click(screen.getByText('Email alerts'));
    expect(screen.getByRole('switch', { name: 'Email alerts' })).toBeTruthy();
  });

  it('ties the description to the switch', () => {
    render(<Switch label="Email alerts" description="Sent once a day." />);
    expect(screen.getByRole('switch').getAttribute('aria-describedby')).toBe(screen.getByText('Sent once a day.').id);
  });

  it('ignores presses when disabled', async () => {
    render(<Switch label="Email alerts" disabled />);
    await userEvent.click(screen.getByText('Email alerts'));
    expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(false);
  });

  it('has no axe violations', async () => {
    const { container } = render(<><Switch label="One" /><Switch label="Two" defaultChecked description="Hint" /><Switch label="Three" disabled /></>);
    await expectNoAxeViolations(container);
  });
});
