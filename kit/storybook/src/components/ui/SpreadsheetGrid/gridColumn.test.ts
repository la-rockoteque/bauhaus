import { describe, expect, it, vi } from 'vitest';
import { withEditable, type GridColumn } from './gridColumn';

interface Row {
  a: string;
  b: string;
}

const columns: GridColumn<Row>[] = [
  { key: 'a', label: 'A', read: (r) => r.a },
  { key: 'b', label: 'B', read: (r) => r.b },
];

const put = (row: Row, column: GridColumn<Row>, value: string): Row => ({
  ...row,
  [column.key]: value,
});

describe('a blanket editable', () => {
  it('gives every column a write', () => {
    const [a, b] = withEditable(columns, true, put);
    expect(a.write?.({ a: '1', b: '2' }, '9')).toEqual({ a: '9', b: '2' });
    expect(b.write?.({ a: '1', b: '2' }, '9')).toEqual({ a: '1', b: '9' });
  });

  it('gives it to the named columns only', () => {
    const [a, b] = withEditable(columns, ['b'], put);
    expect(a.write).toBeUndefined();
    expect(b.write).toBeDefined();
  });

  it('leaves a column that already writes alone — it knows where its value lives', () => {
    const own = vi.fn((row: Row) => row);
    const [a] = withEditable([{ ...columns[0], write: own }], true, put);
    a.write?.({ a: '1', b: '2' }, '9');
    expect(own).toHaveBeenCalledOnce();
  });

  it.each([
    ['editable is false', false as const],
    ['the list is empty', [] as const],
  ])('writes nothing when %s', (_label, editable) => {
    expect(withEditable(columns, editable, put).every((c) => c.write === undefined)).toBe(true);
  });

  it('does nothing without somewhere to put the value', () => {
    expect(withEditable(columns, true, undefined)).toBe(columns);
  });

  it('never mutates the row it is given', () => {
    const row: Row = { a: '1', b: '2' };
    withEditable(columns, true, put)[0].write?.(row, '9');
    expect(row).toEqual({ a: '1', b: '2' });
  });
});
