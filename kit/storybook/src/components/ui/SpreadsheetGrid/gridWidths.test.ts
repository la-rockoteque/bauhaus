import { describe, expect, it } from 'vitest';
import { fillWidths, floorOf } from './gridWidths';
import type { GridColumn } from './gridColumn';

const column = (over: Partial<GridColumn<unknown>> & { key: string }): GridColumn<unknown> => ({
  label: over.key,
  read: () => '',
  ...over,
});

const widths = (columns: GridColumn<unknown>[], available: number) =>
  Object.fromEntries(fillWidths(columns, available));

const total = (columns: GridColumn<unknown>[], available: number) =>
  [...fillWidths(columns, available).values()].reduce((a, b) => a + b, 0);

describe('what a column asks for', () => {
  it('is its minimum, then its stated width, then the default', () => {
    expect(floorOf(column({ key: 'a', minWidth: 90, width: 200 }))).toBe(90);
    expect(floorOf(column({ key: 'b', width: 140 }))).toBe(140);
    expect(floorOf(column({ key: 'c' }))).toBe(120);
    // A string is the grid's own track sizing and says nothing about a floor.
    expect(floorOf(column({ key: 'd', width: '10rem' }))).toBe(120);
  });
});

describe('filling the grid', () => {
  it('shares the slack equally past the floors', () => {
    expect(widths([column({ key: 'a', width: 100 }), column({ key: 'b', width: 100 })], 300)).toEqual(
      { a: 150, b: 150 },
    );
  });

  it('reaches the right edge exactly', () => {
    const columns = [
      column({ key: 'a', width: 110 }),
      column({ key: 'b', minWidth: 180, maxWidth: 240 }),
      column({ key: 'c', width: 95 }),
    ];
    expect(total(columns, 900)).toBeCloseTo(900, 5);
  });

  it('hands what a capped column cannot take back to the others', () => {
    const columns = [column({ key: 'a', width: 100, maxWidth: 120 }), column({ key: 'b', width: 100 })];
    expect(widths(columns, 400)).toEqual({ a: 120, b: 280 });
  });

  it('leaves the floors alone when they already overflow — that is a scroll', () => {
    const columns = [column({ key: 'a', width: 300 }), column({ key: 'b', width: 300 })];
    expect(widths(columns, 400)).toEqual({ a: 300, b: 300 });
  });

  it('answers nothing before the box has been measured', () => {
    expect(widths([column({ key: 'a' })], 0)).toEqual({});
  });

  it('stops rather than looping when every column is at its ceiling', () => {
    const columns = [column({ key: 'a', width: 100, maxWidth: 100 })];
    expect(widths(columns, 900)).toEqual({ a: 100 });
  });
});
