import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SAMPLE } from './sample';
import { DEFAULT_EXPECT, States } from './state-matrix';

describe('States', () => {
  afterEach(cleanup);
  const page = () => render(<States name="Button" defaultExpect={DEFAULT_EXPECT} states={SAMPLE} />);

  it('counts the matrix and links each state to its row', () => {
    page();
    const summary = screen.getByRole('navigation', { name: 'State matrix summary' });
    expect(summary.textContent).toContain('8 designed · 6 n/a · 1 missing');
    const chip = within(summary).getByRole('link', { name: /Incorrect, missing/ });
    expect(document.querySelector(chip.getAttribute('href')!)).not.toBeNull();
  });

  it('keeps the lifecycle in Speelman order, the missing state in its place', () => {
    page();
    const rows = [...document.querySelectorAll('.doc-lc-row')].map((row) => row.id.replace('state-lifecycle-', ''));
    expect(rows).toEqual(['nothing', 'loading', 'none', 'one', 'some', 'too-many', 'incorrect', 'correct', 'done']);
    expect(document.getElementById('state-lifecycle-incorrect')!.textContent).toContain('Not designed yet');
  });

  it('draws variants as columns, with a dash where a variant does not show a state', () => {
    page();
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['State', 'Button', 'Secondary']);
    const focus = within(table).getByRole('row', { name: /Focus visible/ });
    expect(within(focus).getByText('Not shown for this variant')).toBeTruthy();
    const selected = within(table).getByRole('row', { name: /Selected/ });
    expect(within(selected).getByText('Not a toggle.').closest('td')!.colSpan).toBe(2);
  });

  it('opens no column for a variant that only an n/a row names', () => {
    const cells = [...SAMPLE.cells, { id: 'selected', variant: 'Toggle', status: 'n/a' as const, reason: 'Not a toggle.' }];
    render(<States name="Button" defaultExpect={DEFAULT_EXPECT} states={{ cells }} />);
    expect(within(screen.getByRole('table')).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['State', 'Button', 'Secondary']);
  });

  it('draws no summary for a page with no state', () => {
    render(<States name="Color" defaultExpect={[]} states={{ cells: [] }} />);
    expect(screen.queryByRole('navigation')).toBeNull();
  });
});
