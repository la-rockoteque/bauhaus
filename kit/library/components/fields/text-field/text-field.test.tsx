import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
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

  describe('clear button', () => {
    it('shows on a search field only while it holds text', async () => {
      render(<TextField label="Search" type="search" />);
      expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
      await userEvent.type(screen.getByRole('searchbox', { name: 'Search' }), 'ada');
      expect(screen.getByRole('button', { name: 'Clear search' })).toBeTruthy();
    });

    it('empties an uncontrolled field, returns focus to the input and calls onClear', async () => {
      const onClear = vi.fn();
      render(<TextField label="Search" type="search" defaultValue="ada" onClear={onClear} />);
      await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
      const input = screen.getByRole('searchbox') as HTMLInputElement;
      expect(input.value).toBe('');
      expect(document.activeElement).toBe(input);
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    });

    it('empties a controlled field through onChange', async () => {
      function Controlled({ onClear }: { onClear: () => void }) {
        const [value, setValue] = useState('ada');
        return <TextField label="Search" type="search" value={value} onChange={(e) => setValue(e.target.value)} onClear={onClear} />;
      }
      const onClear = vi.fn();
      render(<Controlled onClear={onClear} />);
      await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
      expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('');
      expect(document.activeElement).toBe(screen.getByRole('searchbox'));
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('is off by default on other types, opt-in with clearable, and opt-out on search', async () => {
      const { rerender } = render(<TextField label="Name" defaultValue="Ada" />);
      expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
      rerender(<TextField label="Name" defaultValue="Ada" clearable />);
      expect(screen.getByRole('button', { name: 'Clear' })).toBeTruthy();
      rerender(<TextField label="Search" type="search" defaultValue="Ada" clearable={false} />);
      expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    });

    it('is not shown for a disabled or read-only field, and clearLabel renames it', () => {
      const { rerender } = render(<TextField label="Search" type="search" defaultValue="Ada" disabled />);
      expect(screen.queryByRole('button')).toBeNull();
      rerender(<TextField label="Search" type="search" defaultValue="Ada" readOnly />);
      expect(screen.queryByRole('button')).toBeNull();
      rerender(<TextField label="Search" type="search" defaultValue="Ada" clearLabel="Effacer la recherche" />);
      expect(screen.getByRole('button', { name: 'Effacer la recherche' })).toBeTruthy();
    });
  });

  describe('trailing slot', () => {
    it('renders the slot inside the box after the input', () => {
      render(<TextField label="Weight" type="number" trailing={<span data-testid="unit">kg</span>} />);
      const box = screen.getByLabelText('Weight').parentElement!;
      expect(box.querySelector('.ds-text-field__end')).toContain(screen.getByTestId('unit'));
      expect(box.firstElementChild).toBe(screen.getByLabelText('Weight'));
    });

    it('holds a named button, clear button first', async () => {
      render(<TextField label="Search" type="search" defaultValue="a" trailing={<button type="button">Filters</button>} />);
      await userEvent.tab();
      await userEvent.tab();
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Clear search' }));
      await userEvent.tab();
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Filters' }));
    });
  });

  describe('success message', () => {
    it('sits in a polite live region that is in the page before the message, and is not an error', () => {
      const { rerender } = render(<TextField label="Password" type="password" />);
      const region = screen.getByRole('status');
      expect(region.textContent).toBe('');
      rerender(<TextField label="Password" type="password" success="Meets the 12 character rule" />);
      expect(screen.getByRole('status')).toBe(region);
      expect(region.textContent).toContain('Meets the 12 character rule');
      expect(region.textContent).toContain('Correct');
      expect(region.className).toContain('ds-field__success');
      expect(region.className).not.toContain('error');
      expect(screen.getByLabelText('Password').getAttribute('aria-invalid')).toBeNull();
      expect(screen.getByLabelText('Password').getAttribute('aria-describedby')).toBe(region.id);
    });

    it('gives way to an error', () => {
      render(<TextField label="Password" type="password" error="Too short" success="Meets the rule" />);
      expect(screen.queryByText('Meets the rule')).toBeNull();
      expect(screen.getByLabelText('Password').getAttribute('aria-invalid')).toBe('true');
    });
  });

  it('has no axe violations with a clear button, a trailing slot and a success message', async () => {
    const { container } = render(
      <>
        <TextField label="Search" type="search" defaultValue="ada" />
        <TextField label="Weight" type="number" trailing={<span aria-hidden="true">kg</span>} />
        <TextField label="Password" type="password" success="Meets the rule" />
      </>,
    );
    await expectNoAxeViolations(container);
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
