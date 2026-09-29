import { describe, expect, it } from 'vitest';
import {
  fillDownTarget,
  fillEdits,
  fillTargetRange,
  rangeBetween,
  rangeContains,
  clampPosition,
} from './gridSelection';

const at = (rowIdx: number, colIdx: number) => ({ rowIdx, colIdx });

describe('selection geometry', () => {
  it('normalizes a range dragged up and to the left', () => {
    expect(rangeBetween(at(4, 3), at(1, 0))).toEqual({ top: 1, bottom: 4, left: 0, right: 3 });
  });

  it('holds only the cells inside it', () => {
    const range = rangeBetween(at(1, 1), at(2, 2));
    expect(rangeContains(range, 2, 1)).toBe(true);
    expect(rangeContains(range, 0, 1)).toBe(false);
    expect(rangeContains(range, 2, 3)).toBe(false);
  });

  it('clamps a position to the grid', () => {
    expect(clampPosition(at(-1, 99), 5, 3)).toEqual(at(0, 2));
  });
});

describe('fill handle', () => {
  const source = rangeBetween(at(1, 1), at(1, 2));

  it('extends downwards when the drag went down', () => {
    expect(fillTargetRange(source, at(5, 2))).toEqual({ top: 1, bottom: 5, left: 1, right: 2 });
  });

  it('extends sideways when the drag went further sideways than down', () => {
    expect(fillTargetRange(source, at(2, 8))).toEqual({ top: 1, bottom: 1, left: 1, right: 8 });
  });

  it('extends upwards, keeping the source as the far edge', () => {
    expect(fillTargetRange(source, at(0, 1))).toEqual({ top: 0, bottom: 1, left: 1, right: 2 });
  });

  it('is not a fill when the drag stayed inside the source', () => {
    expect(fillTargetRange(source, at(1, 1))).toEqual(source);
  });

  it('repeats the source block over the target and leaves the source alone', () => {
    const read = ({ rowIdx, colIdx }: { rowIdx: number; colIdx: number }) => `${rowIdx}:${colIdx}`;
    const twoRows = rangeBetween(at(0, 0), at(1, 0));
    const edits = fillEdits(twoRows, rangeBetween(at(0, 0), at(5, 0)), read);

    expect(edits).toHaveLength(4);
    expect(edits.map((edit) => edit.value)).toEqual(['0:0', '1:0', '0:0', '1:0']);
    expect(edits.map((edit) => edit.position.rowIdx)).toEqual([2, 3, 4, 5]);
  });

  it('repeats sideways the same way', () => {
    const read = ({ colIdx }: { colIdx: number }) => `c${colIdx}`;
    const oneCell = rangeBetween(at(0, 0), at(0, 0));
    const edits = fillEdits(oneCell, rangeBetween(at(0, 0), at(0, 3)), read);
    expect(edits.map((edit) => edit.value)).toEqual(['c0', 'c0', 'c0']);
  });
});

describe('filling down to the end from a double-click', () => {
  // Column 0 holds content on rows 0 and 4; column 1 only on row 0.
  const sheet = [
    ['a', 'x'],
    ['', ''],
    ['', ''],
    ['', ''],
    ['b', ''],
  ];
  const read = ({ rowIdx, colIdx }: { rowIdx: number; colIdx: number }) => sheet[rowIdx][colIdx];

  it('stops before the first row holding content', () => {
    expect(fillDownTarget({ top: 0, bottom: 0, left: 0, right: 0 }, 5, read)).toEqual({
      top: 0,
      bottom: 3,
      left: 0,
      right: 0,
    });
  });

  it('runs to the last row when nothing stands in the way', () => {
    expect(fillDownTarget({ top: 0, bottom: 0, left: 1, right: 1 }, 5, read)?.bottom).toBe(4);
  });

  it('stops on content in any of the block’s columns', () => {
    expect(fillDownTarget({ top: 0, bottom: 0, left: 0, right: 1 }, 5, read)?.bottom).toBe(3);
  });

  it('is nothing when the next row already holds something', () => {
    expect(fillDownTarget({ top: 3, bottom: 3, left: 0, right: 0 }, 5, read)).toBeNull();
    expect(fillDownTarget({ top: 4, bottom: 4, left: 0, right: 0 }, 5, read)).toBeNull();
  });
});
