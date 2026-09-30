import { describe, expect, it } from 'vitest';
import { contrast, resolve, THEMES } from '../rulebook/tokens';
import { series, seriesHex, seriesHue } from './series';

const PARTS = Array.from({ length: 12 }, (_, n) => n + 1);

describe('series colours', () => {
  it('sets --part and nothing else', () => {
    expect(series(3)).toEqual({ '--part': 3 });
  });

  it('never repeats a hue among the first twelve, and keeps neighbours far apart', () => {
    const hues = PARTS.map((n) => seriesHue(n, 'light'));
    for (let i = 0; i < hues.length; i++) {
      for (let j = i + 1; j < hues.length; j++) {
        const gap = Math.abs(hues[i] - hues[j]);
        expect(Math.min(gap, 360 - gap)).toBeGreaterThan(10);
      }
    }
    for (let i = 1; i < hues.length; i++) {
      const gap = Math.abs(hues[i] - hues[i - 1]);
      expect(Math.min(gap, 360 - gap)).toBeGreaterThan(130);
    }
  });

  for (const theme of THEMES) {
    it(`holds 3:1 for its number and against the page in the ${theme} theme (WCAG 1.4.3 large text, 1.4.11)`, () => {
      const page = resolve(theme, '--ds-surface-default');
      const number = resolve(theme, '--ds-text-inverse');
      for (const n of PARTS) {
        const fill = seriesHex(n, theme);
        expect(contrast(number, fill), `${theme} ${n} number on fill ${fill}`).toBeGreaterThanOrEqual(3);
        expect(contrast(fill, page), `${theme} ${n} fill on page ${fill}`).toBeGreaterThanOrEqual(3);
      }
    });
  }
});
