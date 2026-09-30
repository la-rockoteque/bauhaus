import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from './radio-group';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

const OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'pickup', label: 'Pickup', disabled: true },
];

describe('RadioGroup', () => {
  it('is a fieldset with a legend, and native radios named by their labels', () => {
    render(<RadioGroup legend="Delivery" options={OPTIONS} />);
    const group = screen.getByRole('radiogroup', { name: 'Delivery' });
    expect(group.tagName).toBe('FIELDSET');
    expect(group.querySelector('legend')?.textContent).toBe('Delivery');
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios.map((r) => r.type)).toEqual(['radio', 'radio', 'radio']);
    expect(screen.getByRole('radio', { name: 'Express' })).toBeTruthy();
  });

  it('puts every radio in one named group, so the browser gives it one Tab stop and the arrow keys', () => {
    render(<RadioGroup legend="Delivery" options={OPTIONS} name="delivery" />);
    const names = (screen.getAllByRole('radio') as HTMLInputElement[]).map((r) => r.name);
    expect(new Set(names)).toEqual(new Set(['delivery']));
  });

  it('checks a radio with Space and reports the value', async () => {
    const onValueChange = vi.fn();
    render(<RadioGroup legend="Delivery" options={OPTIONS} onValueChange={onValueChange} />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Standard' }));
    await userEvent.keyboard(' ');
    expect((screen.getByRole('radio', { name: 'Standard' }) as HTMLInputElement).checked).toBe(true);
    expect(onValueChange).toHaveBeenCalledWith('standard');
  });

  it('starts with the default value checked, and follows a controlled value', () => {
    const { rerender } = render(<RadioGroup legend="Delivery" options={OPTIONS} defaultValue="express" />);
    expect((screen.getByRole('radio', { name: 'Express' }) as HTMLInputElement).checked).toBe(true);
    rerender(<RadioGroup legend="Delivery" options={OPTIONS} value="standard" />);
    expect((screen.getByRole('radio', { name: 'Standard' }) as HTMLInputElement).checked).toBe(true);
  });

  it('selects on click of the label', async () => {
    render(<RadioGroup legend="Delivery" options={OPTIONS} />);
    await userEvent.click(screen.getByText('Express'));
    expect((screen.getByRole('radio', { name: 'Express' }) as HTMLInputElement).checked).toBe(true);
  });

  it('ties description and error to the group and sets aria-invalid', () => {
    render(<RadioGroup legend="Delivery" options={OPTIONS} description="Pick one." error="Choose a delivery." required />);
    const group = screen.getByRole('radiogroup');
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(group.getAttribute('aria-describedby')).toBe(`${screen.getByText('Pick one.').id} ${screen.getByText(/Choose a delivery/).closest('p')!.id}`);
    expect(screen.getByText('(required)')).toBeTruthy();
  });

  it('disables one option, or the whole group', () => {
    const { rerender } = render(<RadioGroup legend="Delivery" options={OPTIONS} />);
    expect((screen.getByRole('radio', { name: 'Pickup' }) as HTMLInputElement).disabled).toBe(true);
    rerender(<RadioGroup legend="Delivery" options={OPTIONS} disabled />);
    expect((screen.getByRole('radio', { name: 'Standard' }) as HTMLInputElement).matches(':disabled')).toBe(true);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <RadioGroup legend="One" options={OPTIONS} defaultValue="standard" />
        <RadioGroup legend="Two" options={OPTIONS} description="Hint" error="Fix it" required />
        <RadioGroup legend="Three" options={OPTIONS} disabled />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
