import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import pairs from '../../foundations/color/pairs.json';
import { clustersOf, ContrastMatrix } from './contrast-matrix';

describe('ContrastMatrix', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme;
  });
  afterEach(cleanup);

  it('places every pair of pairs.json once, and every one passes', () => {
    const { container } = render(<ContrastMatrix />);
    expect(container.querySelectorAll('.cm-pair')).toHaveLength(pairs.length);
    expect(container.querySelectorAll('.cm-bad')).toHaveLength(0);
  });

  it('heads every row with its foreground and every column with its background', () => {
    render(<ContrastMatrix />);
    expect(screen.getAllByRole('rowheader').map((th) => th.textContent)).toContain('text.muted');
    expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toContain('surface.sunken');
  });

  it('splits the pairs into blocks joined by a shared role', () => {
    const blocks = clustersOf([
      { fg: 'a', bg: 'x', use: 'text' },
      { fg: 'b', bg: 'x', use: 'text' },
      { fg: 'b', bg: 'y', use: 'text' },
      { fg: 'c', bg: 'z', use: 'text' },
    ]);
    expect(blocks.map((block) => [block.fgs, block.bgs])).toEqual([
      [['a', 'b'], ['x', 'y']],
      [['c'], ['z']],
    ]);
  });

  it('follows the theme switch', () => {
    document.documentElement.dataset.theme = 'dark';
    render(<ContrastMatrix />);
    expect(screen.getByText('Contrast · dark')).toBeTruthy();
  });
});
