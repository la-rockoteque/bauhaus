import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Combobox, ForceOpenContext } from './combobox';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

const OPTIONS = [
  { id: 'ca', label: 'Canada' },
  { id: 'cl', label: 'Chile' },
  { id: 'fr', label: 'France' },
  { id: 'de', label: 'Germany', disabled: true },
];

describe('Combobox', () => {
  // jsdom has no CSS.escape, which React Aria calls when the active option changes.
  beforeAll(() => {
    const css = (globalThis.CSS ?? {}) as { escape?: (value: string) => string };
    css.escape ??= (value) => value.replace(/[^\w-]/g, (c) => `\\${c}`);
    Object.defineProperty(globalThis, 'CSS', { value: css, configurable: true });
  });

  it('is a combobox named by its label, with the list closed', () => {
    render(<Combobox label="Country" options={OPTIONS} />);
    const input = screen.getByRole('combobox', { name: 'Country' });
    expect(input.tagName).toBe('INPUT');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('opens with ArrowDown and keeps focus in the input', async () => {
    render(<Combobox label="Country" options={OPTIONS} />);
    const input = screen.getByRole('combobox');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    expect(await screen.findByRole('listbox')).toBeTruthy();
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(input);
  });

  it('filters the list while typing, and shows the empty text when nothing matches', async () => {
    render(<Combobox label="Country" options={OPTIONS} emptyText="No country found" />);
    await userEvent.type(screen.getByRole('combobox'), 'c');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Canada', 'Chile', 'France']);
    await userEvent.type(screen.getByRole('combobox'), 'zzz');
    expect(await screen.findByText('No country found')).toBeTruthy();
  });

  it('moves the active option with the arrows and accepts it with Enter', async () => {
    const onSelectionChange = vi.fn();
    render(<Combobox label="Country" options={OPTIONS} onSelectionChange={onSelectionChange} />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    await userEvent.type(input, 'c');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(input.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Chile' }).id);
    expect(document.activeElement).toBe(input);
    await userEvent.keyboard('{Enter}');
    expect(onSelectionChange).toHaveBeenCalledWith('cl');
    expect(input.value).toBe('Chile');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  });

  it('closes with Escape', async () => {
    render(<Combobox label="Country" options={OPTIONS} />);
    await userEvent.type(screen.getByRole('combobox'), 'c');
    expect(screen.getByRole('listbox')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  });

  it('opens from the toggle button', async () => {
    render(<Combobox label="Country" options={OPTIONS} />);
    await userEvent.click(screen.getByRole('button'));
    expect(await screen.findByRole('listbox')).toBeTruthy();
  });

  it('ties description and error to the input and sets aria-invalid', () => {
    render(<Combobox label="Country" options={OPTIONS} description="Where you live." error="Choose a country." required />);
    const input = screen.getByRole('combobox');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const described = (input.getAttribute('aria-describedby') ?? '').split(' ').map((id) => document.getElementById(id)?.textContent ?? '');
    expect(described.join(' ')).toContain('Where you live.');
    expect(described.join(' ')).toContain('Choose a country.');
    expect(screen.getByText('(required)')).toBeTruthy();
  });

  it('shows the loading text while options load', async () => {
    render(<Combobox label="Country" options={[]} loading loadingText="Loading countries" />);
    await userEvent.type(screen.getByRole('combobox'), 'c');
    expect(await screen.findByText('Loading countries')).toBeTruthy();
  });

  it('disabled and read-only inputs take no typing', async () => {
    render(<><Combobox label="Off" options={OPTIONS} disabled /><Combobox label="Fixed" options={OPTIONS} readOnly defaultInputValue="Chile" /></>);
    expect((screen.getByRole('combobox', { name: 'Off' }) as HTMLInputElement).disabled).toBe(true);
    await userEvent.type(screen.getByRole('combobox', { name: 'Fixed' }), 'x');
    expect((screen.getByRole('combobox', { name: 'Fixed' }) as HTMLInputElement).value).toBe('Chile');
  });

  it('has no axe violations closed and open', async () => {
    const { container } = render(<Combobox label="Country" options={OPTIONS} description="Hint" error="Fix it" />);
    await expectNoAxeViolations(container);
    await userEvent.click(screen.getByRole('button'));
    await screen.findByRole('listbox');
    await expectNoAxeViolations(document.body);
  });

  it('in a showcase, draws the list open as a picture and leaves the field closed, so nothing around it is hidden', () => {
    render(
      <>
        <p>Around the field</p>
        <ForceOpenContext value>
          <Combobox label="Country" options={OPTIONS} defaultInputValue="C" defaultSelectedKey="cl" />
        </ForceOpenContext>
      </>,
    );
    expect(screen.getByRole('combobox').getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByText('Around the field').closest('[aria-hidden="true"]')).toBeNull();
    const picture = document.querySelector('.ds-combobox__popover--inline')!;
    expect(picture.getAttribute('aria-hidden')).toBe('true');
    expect([...picture.querySelectorAll('.ds-combobox__label')].map((l) => l.textContent)).toEqual(['Canada', 'Chile', 'France']);
    expect(picture.querySelector('[data-focused]')?.textContent).toBe('Canada');
    expect(picture.querySelector('[data-selected]')?.textContent).toBe('Chile');
  });

  it('reports null when the selection is cleared', async () => {
    const onSelectionChange = vi.fn();
    render(<Combobox label="Country" options={OPTIONS} defaultSelectedKey="ca" onSelectionChange={onSelectionChange} />);
    await userEvent.clear(screen.getByRole('combobox'));
    await userEvent.tab();
    expect(onSelectionChange).toHaveBeenCalledWith(null);
  });

  it('in a showcase, says "No results" in the picture when the text matches nothing, and the loading text while loading', () => {
    const { rerender } = render(
      <ForceOpenContext value>
        <Combobox label="Country" options={OPTIONS} inputValue="zzz" />
      </ForceOpenContext>,
    );
    const picture = () => document.querySelector('.ds-combobox__popover--inline')!;
    expect(picture().querySelector('.ds-combobox__empty')?.textContent).toBe('No results');
    expect(picture().querySelectorAll('.ds-combobox__option')).toHaveLength(0);
    rerender(
      <ForceOpenContext value>
        <Combobox label="Country" options={OPTIONS} inputValue="zzz" loading />
      </ForceOpenContext>,
    );
    expect(picture().querySelector('.ds-combobox__empty')?.textContent).toBe('Loading');
  });

  it('in a showcase, lists every option while no text is set', () => {
    render(
      <ForceOpenContext value>
        <Combobox label="Country" options={OPTIONS} />
      </ForceOpenContext>,
    );
    expect(document.querySelectorAll('.ds-combobox__popover--inline .ds-combobox__option')).toHaveLength(OPTIONS.length);
  });

  it('in a showcase, the picture follows a controlled input value', () => {
    render(
      <ForceOpenContext value>
        <Combobox label="Country" options={OPTIONS} inputValue="Fr" />
      </ForceOpenContext>,
    );
    expect([...document.querySelectorAll('.ds-combobox__popover--inline .ds-combobox__label')].map((l) => l.textContent)).toEqual(['France']);
  });
});
