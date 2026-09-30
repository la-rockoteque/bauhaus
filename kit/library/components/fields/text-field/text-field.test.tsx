import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TextField } from './text-field';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('TextField', () => {
  it('names the input with its visible label', () => {
    render(<TextField label="Email address" />);
    expect(screen.getByLabelText('Email address').tagName).toBe('INPUT');
    expect(screen.getByRole('textbox', { name: 'Email address' })).toBeTruthy();
  });

  it('does not use the placeholder as the label', () => {
    render(<TextField label="Email address" placeholder="name@example.com" />);
    expect(screen.getByText('Email address').tagName).toBe('LABEL');
  });

  it('ties the description to the input with aria-describedby', () => {
    render(<TextField label="Email address" description="We send the receipt here." />);
    const input = screen.getByLabelText('Email address');
    expect(input.getAttribute('aria-describedby')).toBe(screen.getByText('We send the receipt here.').id);
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('ties the error text to the input, sets aria-invalid, and keeps the description', () => {
    render(<TextField label="Email address" description="Hint" error="Enter an email address, like name@example.com" />);
    const input = screen.getByLabelText('Email address');
    const error = screen.getByText(/Enter an email address/).closest('p')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(`${screen.getByText('Hint').id} ${error.id}`);
    expect(error.textContent).toContain('Error');
  });

  it('explains the required marker in words and sets the native required attribute', () => {
    render(<TextField label="Email address" required />);
    expect(screen.getByText('(required)')).toBeTruthy();
    expect((screen.getByLabelText(/Email address/) as HTMLInputElement).required).toBe(true);
  });

  it('takes typed text', async () => {
    render(<TextField label="Name" />);
    await userEvent.type(screen.getByLabelText('Name'), 'Ada');
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Ada');
  });

  it('keeps a read-only value focusable and a disabled one out of the tab order', async () => {
    render(<><TextField label="Ref" readOnly defaultValue="A-1" /><TextField label="Off" disabled /></>);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByLabelText('Ref'));
    await userEvent.type(screen.getByLabelText('Ref'), 'x');
    expect((screen.getByLabelText('Ref') as HTMLInputElement).value).toBe('A-1');
    expect((screen.getByLabelText('Off') as HTMLInputElement).disabled).toBe(true);
  });

  it('has no axe violations in its plain, described, invalid, required, read-only and disabled forms', async () => {
    const { container } = render(
      <>
        <TextField label="One" />
        <TextField label="Two" description="Hint" />
        <TextField label="Three" error="Fix it" />
        <TextField label="Four" required />
        <TextField label="Five" readOnly defaultValue="x" />
        <TextField label="Six" disabled />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
