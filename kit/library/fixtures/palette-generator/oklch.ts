/**
 * Colour maths for the palette generator, in OKLCH (Björn Ottosson's OKLab in polar form). Its
 * lightness is perceptual, so nine evenly spaced grades look evenly spaced, whatever the hue.
 * Colours go in and out as six-digit hex; a colour outside sRGB loses chroma until it fits.
 */

export interface Lch {
  /** Lightness, 0 black to 1 white. */
  l: number;
  /** Chroma, 0 grey to about 0.37 for the most vivid sRGB colour. */
  c: number;
  /** Hue angle in degrees, 0 to 360. */
  h: number;
}

type Rgb = [number, number, number];

const HEX = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;

/** A valid hex as `#rrggbb` in lower case, or null. */
export function normalizeHex(text: string): string | null {
  const digits = HEX.exec(text.trim())?.[1];
  if (!digits) return null;
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits;
  return `#${full.toLowerCase()}`;
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToRgb(hex: string): Rgb {
  // An unreadable hex reads as black.
  const full = normalizeHex(hex) ?? `#${'0'.repeat(6)}`;
  return [1, 3, 5].map((at) => parseInt(full.slice(at, at + 2), 16) / 255) as Rgb;
}

const rgbToHex = (rgb: Rgb): string =>
  `#${rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('')}`;

export function hexToLch(hex: string): Lch {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

function lchToLinear({ l, c, h }: Lch): Rgb {
  const A = c * Math.cos((h * Math.PI) / 180);
  const B = c * Math.sin((h * Math.PI) / 180);
  const lc = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const mc = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const sc = (l - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc,
    -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc,
    -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc,
  ];
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** The colour as hex. Out of sRGB, the chroma is cut (16 halvings) and the hue and lightness kept. */
export function lchToHex(lch: Lch): string {
  const l = Math.min(1, Math.max(0, lch.l));
  if (inGamut(lchToLinear({ ...lch, l }))) return rgbToHex(lchToLinear({ ...lch, l }).map(toGamma) as Rgb);
  let [low, high] = [0, lch.c];
  for (let i = 0; i < 16; i += 1) {
    const mid = (low + high) / 2;
    [low, high] = inGamut(lchToLinear({ ...lch, l, c: mid })) ? [mid, high] : [low, mid];
  }
  return rgbToHex(lchToLinear({ ...lch, l, c: low }).map(toGamma) as Rgb);
}

// ---------- ramps ----------

export const GRADES = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export interface RampOptions {
  /** 0 soft (grades bunch around the middle) to 1 high (100 near white, 900 near black). */
  contrast: number;
  /** A factor on the chosen colour's chroma: 0.1 muted, 1 as chosen, 1.3 bright. */
  vibrancy: number;
}

/** The lightness of the nine grades, lightest first. */
export function lightnesses(contrast: number): number[] {
  const top = 0.97 - (1 - contrast) * 0.12;
  const bottom = 0.24 + (1 - contrast) * 0.22;
  return GRADES.map((_, i) => top - ((top - bottom) * i) / (GRADES.length - 1));
}

/** Nine grades of one hue. The ends carry less chroma than the middle, as a printed ramp does. */
export function ramp(hue: number, chroma: number, { contrast, vibrancy }: RampOptions): string[] {
  return lightnesses(contrast).map((l, i) => {
    const fromMiddle = (i - 4) / 4;
    return lchToHex({ l, c: chroma * vibrancy * (1 - 0.6 * fromMiddle ** 2), h: hue });
  });
}

/** The grade whose lightness is nearest the chosen colour's, so the page can mark it. */
export function nearestGrade(l: number, contrast: number): number {
  const ls = lightnesses(contrast);
  return ls.reduce((best, x, i) => (Math.abs(x - l) < Math.abs(ls[best] - l) ? i : best), 0);
}

// ---------- harmony: Itten's wheel of twelve, turned so the chosen hue is the first primary ----------

export type Order = 'primary' | 'secondary' | 'tertiary';

export interface Harmony {
  order: Order;
  /** Degrees from the chosen hue, clockwise on the wheel. */
  offset: number;
  name: string;
}

/**
 * Three primaries 120° apart. Each secondary sits halfway between two primaries (a mix of the two).
 * Each tertiary sits between a primary and a secondary. Twelve hues, 30° apart.
 */
export const HARMONY: readonly Harmony[] = [
  ...[0, 120, 240].map((offset, i) => ({ order: 'primary' as const, offset, name: `primary-${i + 1}` })),
  ...[60, 180, 300].map((offset, i) => ({ order: 'secondary' as const, offset, name: `secondary-${i + 1}` })),
  ...[30, 90, 150, 210, 270, 330].map((offset, i) => ({ order: 'tertiary' as const, offset, name: `tertiary-${i + 1}` })),
];

export const turn = (hue: number, offset: number): number => (hue + offset + 360) % 360;

/** The palette as DTCG JSON: one group per hue, grades 100 to 900. */
export function toDtcg(rows: readonly { name: string; grades: readonly string[] }[]): string {
  const hues = Object.fromEntries(
    rows.map((row) => [row.name, Object.fromEntries(row.grades.map((hex, i) => [String(GRADES[i]), { $value: hex }]))]),
  );
  return JSON.stringify({ palette: { $type: 'color', ...hues } }, null, 2);
}
