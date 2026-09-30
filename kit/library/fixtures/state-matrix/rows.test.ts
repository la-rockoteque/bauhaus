import { describe, expect, it } from 'vitest';
import type { StateCell } from '../doc-page/types';
import { rowsFor, variantsOf } from './rows';

const cell = (id: string, more: Partial<StateCell> = {}): StateCell => ({ id, status: 'designed', render: id, ...more });

describe('rowsFor', () => {
  it('orders matrix rows as the matrix does, whatever the order of the cells', () => {
    const rows = rowsFor('lifecycle', { cells: [cell('some'), cell('loading'), cell('nothing')] }, []);
    expect(rows.map((row) => row.id)).toEqual(['nothing', 'loading', 'some']);
  });

  it('puts a missing row in its matrix place, not at the end', () => {
    const rows = rowsFor('lifecycle', { cells: [cell('nothing'), cell('some')] }, ['nothing', 'loading', 'some']);
    expect(rows.map((row) => `${row.id}:${row.status}`)).toEqual(['nothing:designed', 'loading:missing', 'some:designed']);
  });

  it('lists free ids after the matrix rows, in the group their cell names', () => {
    const cells = [cell('partial', { group: 'lifecycle', label: 'Partial' }), cell('required', { group: 'interaction' }), cell('some')];
    expect(rowsFor('lifecycle', { cells }, []).map((row) => row.label)).toEqual(['Some', 'Partial']);
    expect(rowsFor('interaction', { cells }, []).map((row) => row.id)).toEqual(['required']);
  });

  it('gathers every cell of one state into one row, across variants', () => {
    const cells = [cell('default'), cell('hover'), cell('default', { variant: 'Vertical' })];
    const [row] = rowsFor('interaction', { cells }, []);
    expect(row.cells.map((c) => c.variant ?? 'base')).toEqual(['base', 'Vertical']);
  });

  it('marks a row n/a only when every cell is n/a, and keeps the reason', () => {
    const cells = [cell('none', { status: 'n/a', reason: 'No collection.' }), cell('one', { status: 'n/a', reason: 'x' }), cell('one')];
    const rows = rowsFor('lifecycle', { cells }, []);
    expect(rows.map((row) => `${row.id}:${row.status}`)).toEqual(['none:n/a', 'one:designed']);
    expect(rows[0].reason).toBe('No collection.');
  });

  it('treats an n/a with no reason as missing, as the page contract says', () => {
    const [row] = rowsFor('lifecycle', { cells: [cell('none', { status: 'n/a' })] }, []);
    expect(row.status).toBe('missing');
  });
});

describe('variantsOf', () => {
  it('lists the variants in order of first use, the base first', () => {
    const cells = [cell('default', { variant: 'Vertical' }), cell('default'), cell('hover', { variant: 'Manual' }), cell('focus-visible', { variant: 'Vertical' })];
    expect(variantsOf(cells)).toEqual([undefined, 'Vertical', 'Manual']);
  });

  it('has only the base column when no cell names a variant', () => {
    expect(variantsOf([cell('default'), cell('hover')])).toEqual([undefined]);
  });
});
