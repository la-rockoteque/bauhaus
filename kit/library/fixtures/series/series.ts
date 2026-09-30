import type { CSSProperties } from 'react';
import { resolve } from '../rulebook/tokens';

/**
 * The series colours of foundations/color: series n is oklch(lightness chroma, hue + n × step).
 * The stylesheet composes the colour (series.css); this file mirrors the rule in TypeScript so a test can hold it to its contrast.
 */

/** The style that gives an element series colour n: it sets `--part`, and `.ds-series` composes `--ds-series-color`. */
export const series = (n: number): CSSProperties => ({ '--part': n }) as CSSProperties;

const number = (theme: string, token: string): number => Number(resolve(theme, `--ds-series-${token}`));

const toByte = (linear: number): number => {
  const c = Math.min(1, Math.max(0, linear));
  const encoded = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.round(encoded * 255);
};

/** The sRGB hex of series colour n in a theme (out-of-gamut channels are clipped, as a browser without gamut mapping would). */
export function seriesHex(n: number, theme: string): string {
  const hue = ((number(theme, 'hue') + n * number(theme, 'step')) * Math.PI) / 180;
  const L = number(theme, 'lightness');
  const C = number(theme, 'chroma');
  const a = C * Math.cos(hue);
  const b = C * Math.sin(hue);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return `#${rgb.map((v) => toByte(v).toString(16).padStart(2, '0')).join('')}`;
}

/** The hue of series n in degrees, 0 to 360. */
export const seriesHue = (n: number, theme: string): number => (((number(theme, 'hue') + n * number(theme, 'step')) % 360) + 360) % 360;
