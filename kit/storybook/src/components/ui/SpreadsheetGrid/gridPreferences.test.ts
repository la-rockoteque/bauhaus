import { afterEach, describe, expect, it, vi } from 'vitest';
import { familyKey, readHidden, writeHidden } from './gridPreferences';

afterEach(() => {
  // Unstub first: a stubbed storage has no `clear`, and the cleanup would throw over the
  // failure it is cleaning up after.
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

describe('remembering hidden columns', () => {
  it('keeps them under the family, not under one page', () => {
    writeHidden('tracker.step-items', new Set(['unit', 'wbs']));
    expect(window.localStorage.getItem(familyKey('tracker.step-items'))).toBe('["unit","wbs"]');
    expect(readHidden('tracker.step-items')).toEqual(new Set(['unit', 'wbs']));
  });

  it('keeps two families apart', () => {
    writeHidden('a', new Set(['x']));
    writeHidden('b', new Set(['y']));
    expect(readHidden('a')).toEqual(new Set(['x']));
    expect(readHidden('b')).toEqual(new Set(['y']));
  });

  it('forgets the entry once nothing is hidden, rather than storing an empty one', () => {
    writeHidden('a', new Set(['x']));
    writeHidden('a', new Set());
    expect(window.localStorage.getItem(familyKey('a'))).toBeNull();
    expect(readHidden('a')).toEqual(new Set());
  });

  it('remembers nothing for a grid that named no family', () => {
    writeHidden(undefined, new Set(['x']));
    expect(readHidden(undefined)).toEqual(new Set());
    expect(window.localStorage.length).toBe(0);
  });

  it.each([
    ['not JSON', 'not json'],
    ['the wrong shape', '{"unit":true}'],
    ['a list of other things', '[1,2,3]'],
  ])('ignores %s in its slot rather than throwing', (_label, stored) => {
    window.localStorage.setItem(familyKey('a'), stored);
    expect(readHidden('a')).toEqual(new Set());
  });

  it('survives a storage that throws, which is what a private window does', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
      removeItem: () => {
        throw new Error('denied');
      },
    });

    expect(readHidden('a')).toEqual(new Set());
    expect(() => writeHidden('a', new Set(['x']))).not.toThrow();
  });
});
