import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { resolve } from '../rulebook/tokens';
import { HueRamp, grade, inkFor } from './hue-ramp';

const white = resolve('light', '--ds-palette-gray-100') ?? '';
const black = resolve('light', '--ds-palette-gray-900') ?? '';

describe('hue-ramp', () => {
  afterEach(cleanup);

  it('writes on a tile with the ink that contrasts most', () => {
    expect(inkFor(white, black, white)).toBe(black);
    expect(inkFor(black, black, white)).toBe(white);
  });

  it('grades a ratio against WCAG 1.4.3 and 1.4.6', () => {
    expect(grade(7)).toBe('AAA');
    expect(grade(4.5)).toBe('AA');
    expect(grade(3)).toBe('AA large');
    expect(grade(2.99)).toBe('fail');
  });

  it('draws nine tiles, each with its grade, hex and contrast', () => {
    const { container } = render(<HueRamp prefix="palette" name="gray" />);
    expect(container.querySelectorAll('.hue-tile')).toHaveLength(9);
    expect(screen.getByText(white)).toBeTruthy();
    expect(container.querySelectorAll('.hue-tile-ratio')).toHaveLength(9);
  });

  it('names the hue a role scale reads', () => {
    render(<HueRamp prefix="colors" name="neutral" />);
    expect(screen.getByText('palette.gray')).toBeTruthy();
  });
});
