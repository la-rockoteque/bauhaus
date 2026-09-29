import { describe, expect, it } from 'vitest';
import { writesForPaste, type GridView } from './gridEdits';

// Only the shape's lengths matter to where a paste lands.
const view = (rows: number, cols: number): GridView<number> => ({
  rows: Array.from({ length: rows }, (_, i) => i),
  columns: Array.from({ length: cols }, (_, i) => ({ key: `c${i}`, label: '', read: () => '' })),
});

const values = (writes: { position: { rowIdx: number; colIdx: number }; value: string }[]) =>
  writes.map(({ position, value }) => `${position.rowIdx},${position.colIdx}=${value}`);

describe('where a paste lands', () => {
  it('tiles a block over a larger selection, from its top-left', () => {
    const writes = writesForPaste(view(10, 5), [['a', 'b', 'c']], {
      top: 1,
      bottom: 4,
      left: 1,
      right: 3,
    });
    expect(writes).toHaveLength(12);
    expect(values(writes).filter((w) => w.startsWith('4,'))).toEqual(['4,1=a', '4,2=b', '4,3=c']);
  });

  it('repeats a two-row block down a five-row selection', () => {
    const writes = writesForPaste(view(10, 2), [['A'], ['B']], { top: 0, bottom: 4, left: 0, right: 0 });
    expect(writes.map((w) => w.value)).toEqual(['A', 'B', 'A', 'B', 'A']);
  });

  it('fills a selection with one value', () => {
    const writes = writesForPaste(view(10, 2), [['7']], { top: 0, bottom: 2, left: 0, right: 1 });
    expect(new Set(writes.map((w) => w.value))).toEqual(new Set(['7']));
    expect(writes).toHaveLength(6);
  });

  it('spills a block from a single cell and clips it at the grid’s edge', () => {
    const writes = writesForPaste(view(2, 2), [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']], {
      top: 1,
      bottom: 1,
      left: 0,
      right: 0,
    });
    expect(values(writes)).toEqual(['1,0=a', '1,1=b']);
  });
});
