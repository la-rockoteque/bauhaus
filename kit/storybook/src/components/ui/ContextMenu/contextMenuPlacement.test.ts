import { describe, expect, it } from 'vitest';
import { placeMenu } from './contextMenuPlacement';

const viewport = { width: 1000, height: 800 };
const menu = { width: 200, height: 300 };

describe('placing the menu', () => {
  it('opens down and to the right of the pointer, where there is room', () => {
    expect(placeMenu({ x: 100, y: 100 }, menu, viewport)).toEqual({ x: 100, y: 100 });
  });

  it('flips to the left of the pointer near the right edge, rather than sliding', () => {
    expect(placeMenu({ x: 950, y: 100 }, menu, viewport).x).toBe(750);
  });

  it('flips above the pointer near the bottom edge', () => {
    expect(placeMenu({ x: 100, y: 780 }, menu, viewport).y).toBe(480);
  });

  it('flips both at once in the far corner', () => {
    expect(placeMenu({ x: 990, y: 790 }, menu, viewport)).toEqual({ x: 790, y: 490 });
  });

  it('clamps inside the margin when it fits on neither side', () => {
    const tall = { width: 200, height: 780 };
    const { y } = placeMenu({ x: 10, y: 400 }, tall, { width: 1000, height: 800 });
    expect(y).toBeGreaterThanOrEqual(8);
    expect(y + tall.height).toBeLessThanOrEqual(800);
  });
});
