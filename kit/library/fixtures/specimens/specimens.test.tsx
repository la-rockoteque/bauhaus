import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import pairs from '../../foundations/color/pairs.json';
import { ContrastPairs, RadiusTiles, RoleSwatches, SpacingScale } from './specimens';

describe('specimens', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme;
  });
  afterEach(cleanup);

  it('draws one bar for each of the 13 spacing steps', () => {
    render(<SpacingScale />);
    for (let n = 0; n <= 12; n++) expect(screen.getByText(`space.${n}`)).toBeTruthy();
  });

  it('draws a tile for every radius step and role', () => {
    render(<RadiusTiles />);
    expect(screen.getByText('radius.control')).toBeTruthy();
    expect(screen.getByText('radius.full')).toBeTruthy();
  });

  it('measures every pair of pairs.json in the selected theme and passes them all', () => {
    const { container } = render(<ContrastPairs />);
    expect(container.querySelectorAll('.spec-pair')).toHaveLength(pairs.length);
    expect(container.querySelectorAll('.spec-bad')).toHaveLength(0);
  });

  it('follows the theme switch', () => {
    document.documentElement.dataset.theme = 'dark';
    render(<ContrastPairs />);
    expect(screen.getByText('Contrast · dark')).toBeTruthy();
  });

  it('groups the roles by purpose, without the shadows', () => {
    render(<RoleSwatches />);
    expect(screen.getByRole('heading', { name: 'Text' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Shadow' })).toBeNull();
  });
});
