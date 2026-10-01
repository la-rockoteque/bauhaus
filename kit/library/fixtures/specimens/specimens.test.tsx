import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RadiusTiles, RoleSwatches, SpacingScale } from './specimens';

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

  it('groups the roles by purpose, without the shadows', () => {
    render(<RoleSwatches />);
    expect(screen.getByRole('heading', { name: 'Text' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Shadow' })).toBeNull();
  });
});
