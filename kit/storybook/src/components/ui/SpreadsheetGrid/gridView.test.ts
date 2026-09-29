import { describe, expect, it } from 'vitest';
import {
  filterByColumn,
  filterRows,
  parseCellNumber,
  selectionAggregates,
  sortRows,
  toCsv,
} from './gridView';
import type { GridColumn } from './gridColumn';

interface Line {
  name: string;
  hours: string;
}

const columns: GridColumn<Line>[] = [
  { key: 'name', label: 'Élément', read: (l) => l.name },
  { key: 'hours', label: 'Heures', numeric: true, read: (l) => l.hours },
];

const rows: Line[] = [
  { name: 'Câble A', hours: '1 200,50' },
  { name: 'Tray B', hours: '9,00' },
  { name: 'Câble C', hours: '100,00' },
];

describe('parseCellNumber', () => {
  it('reads a French-formatted number back out of its cell', () => {
    expect(parseCellNumber('1 200,50')).toBe(1200.5);
    expect(parseCellNumber('1 200,50')).toBe(1200.5);
    expect(parseCellNumber('1 200,50')).toBe(1200.5);
  });

  it('reads a plain one too', () => {
    expect(parseCellNumber('-42')).toBe(-42);
  });

  it('is null for text, so a total skips it rather than counting it as zero', () => {
    expect(parseCellNumber('Câble A')).toBeNull();
    expect(parseCellNumber('')).toBeNull();
    expect(parseCellNumber('12 m')).toBeNull();
  });
});

describe('search', () => {
  it('keeps the rows any visible column matches, ignoring case', () => {
    expect(filterRows(rows, columns, 'câble').map((r) => r.name)).toEqual(['Câble A', 'Câble C']);
  });

  it('returns the rows untouched for an empty query', () => {
    expect(filterRows(rows, columns, '   ')).toBe(rows);
  });
});

describe('sort', () => {
  it('sorts a numeric column as numbers, not as strings', () => {
    const sorted = sortRows(rows, columns, [{ columnKey: 'hours', direction: 'ASC' }]);
    expect(sorted.map((r) => r.hours)).toEqual(['9,00', '100,00', '1 200,50']);
  });

  it('reverses on DESC', () => {
    const sorted = sortRows(rows, columns, [{ columnKey: 'hours', direction: 'DESC' }]);
    expect(sorted.map((r) => r.hours)).toEqual(['1 200,50', '100,00', '9,00']);
  });

  it('leaves the caller array alone', () => {
    sortRows(rows, columns, [{ columnKey: 'hours', direction: 'ASC' }]);
    expect(rows.map((r) => r.name)).toEqual(['Câble A', 'Tray B', 'Câble C']);
  });
});

describe('selection aggregates', () => {
  it('counts every cell but totals only the numbers', () => {
    expect(selectionAggregates(['1 200,50', 'Câble A', '9,00'])).toEqual({
      count: 3,
      numericCount: 2,
      sum: 1209.5,
      average: 604.75,
    });
  });

  it('has no average without a number to average', () => {
    expect(selectionAggregates(['a', 'b']).average).toBeNull();
  });
});

describe('CSV export', () => {
  it('writes the headings, quotes what needs it and leads with a BOM', () => {
    const csv = toCsv([{ name: 'A, B', hours: '1' }], columns);
    expect(csv.startsWith('﻿')).toBe(true);
    expect(csv).toContain('Élément,Heures');
    expect(csv).toContain('"A, B",1');
  });
});

describe('per-column filters', () => {
  it('narrows on one column without touching the others', () => {
    expect(filterByColumn(rows, columns, { name: 'tray' }).map((r) => r.name)).toEqual(['Tray B']);
  });

  it('applies every active filter together', () => {
    expect(filterByColumn(rows, columns, { name: 'câble', hours: '100' })).toHaveLength(1);
  });

  it('ignores a filter that is blank or all spaces', () => {
    expect(filterByColumn(rows, columns, { name: '  ' })).toBe(rows);
  });
});

describe('accents', () => {
  const accented: Line[] = [{ name: 'Salle électrique', hours: '1' }];

  it('finds an accented word typed without its accents', () => {
    expect(filterRows(accented, columns, 'elec')).toHaveLength(1);
    expect(filterByColumn(accented, columns, { name: 'electrique' })).toHaveLength(1);
  });

  it('still matches when the accents are typed', () => {
    expect(filterRows(accented, columns, 'électrique')).toHaveLength(1);
  });
})
