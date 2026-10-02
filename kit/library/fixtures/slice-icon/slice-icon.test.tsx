import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SLICE_ICONS, SliceIcon, hasSliceIcon } from './slice-icon';
import type { SliceName } from './slice-icon';

// Every story file outside the fixtures, as text. Vite reads them, so the test needs no Node API.
const STORIES = import.meta.glob(['../../**/*.stories.tsx', '!../../fixtures/**', '!../../node_modules/**'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

/** The last part of every story title: the names the sidebar shows for slices. */
const sliceNames = (): string[] =>
  Object.values(STORIES).flatMap((source) => {
    const title = /title: '([^']+)'/.exec(source)?.[1];
    return title ? [title.split('/').at(-1)!] : [];
  });

describe('SliceIcon', () => {
  afterEach(cleanup);

  it('has a drawing for every slice in the sidebar, and none for a slice that is gone', () => {
    const names = sliceNames();
    expect(names.length).toBeGreaterThan(40);
    expect(names.filter((name) => !hasSliceIcon(name))).toEqual([]);
    expect(Object.keys(SLICE_ICONS).filter((name) => !names.includes(name))).toEqual([]);
  });

  it('gives no two slices the same drawing', () => {
    const drawings = Object.values(SLICE_ICONS).map((shape) => JSON.stringify(shape));
    expect(new Set(drawings).size).toBe(drawings.length);
  });

  it('gives each slice its own series colour and hides the drawing from assistive technology', () => {
    const parts = (Object.keys(SLICE_ICONS) as SliceName[]).map((name) => {
      const svg = render(<SliceIcon name={name} />).container.querySelector('svg')!;
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      const part = svg.dataset.part;
      cleanup();
      return part;
    });
    expect(new Set(parts).size).toBe(parts.length);
  });

  it('draws a glyph flat on the top face', () => {
    const svg = render(<SliceIcon name="Checkbox" />).container;
    expect(svg.querySelector('.slice-glyph')?.getAttribute('transform')).toMatch(/^matrix\(/);
  });
});
