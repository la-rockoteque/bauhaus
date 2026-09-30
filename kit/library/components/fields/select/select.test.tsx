import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './select';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

const OPTIONS = [
  { value: 'ca', label: 'Canada' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany', disabled: true },
];

describe('Select', () => {
  it('is a native select named by its label, with its options', () => {
    render(<Select label="Country" options={OPTIONS} emptyLabel="Choose a country" />);
    const select = screen.getByRole('combobox', { name: 'Country' });
    expect(select.tagName).toBe('SELECT');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Choose a country', 'Canada', 'France', 'Germany']);
    expect((screen.getByRole('option', { name: 'Germany' }) as HTMLOptionElement).disabled).toBe(true);
  });

  it('changes value and reports it', async () => {
    const onChange = vi.fn();
    render(<Select label="Country" options={OPTIONS} onChange={onChange} />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByLabelText('Country'));
    await userEvent.selectOptions(screen.getByLabelText('Country'), 'fr');
    expect((screen.getByLabelText('Country') as HTMLSelectElement).value).toBe('fr');
    expect(onChange).toHaveBeenCalled();
  });

  it('ties description and error to the select and sets aria-invalid', () => {
    render(<Select label="Country" options={OPTIONS} description="Where you live." error="Choose a country." />);
    const select = screen.getByLabelText('Country');
    expect(select.getAttribute('aria-invalid')).toBe('true');
    expect(select.getAttribute('aria-describedby')).toBe(`${screen.getByText('Where you live.').id} ${screen.getByText(/Choose a country\./).closest('p')!.id}`);
  });

  it('read-only keeps the value and blocks the keys that change it', async () => {
    render(<Select label="Country" options={OPTIONS} defaultValue="ca" readOnly />);
    const select = screen.getByLabelText('Country') as HTMLSelectElement;
    expect(select.getAttribute('aria-readonly')).toBe('true');
    await userEvent.tab();
    expect(document.activeElement).toBe(select);
    // jsdom does not change a select on arrow keys, so check the keys are cancelled instead.
    expect(fireEvent.keyDown(select, { key: 'ArrowDown' })).toBe(false);
    expect(fireEvent.mouseDown(select)).toBe(false);
    expect(fireEvent.keyDown(select, { key: 'Tab' })).toBe(true);
    expect(select.value).toBe('ca');
  });

  it('disabled leaves the tab order', () => {
    render(<Select label="Country" options={OPTIONS} disabled />);
    expect((screen.getByLabelText('Country') as HTMLSelectElement).disabled).toBe(true);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Select label="One" options={OPTIONS} emptyLabel="Choose" />
        <Select label="Two" options={OPTIONS} error="Fix it" required />
        <Select label="Three" options={OPTIONS} disabled />
        <Select label="Four" options={OPTIONS} readOnly />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
