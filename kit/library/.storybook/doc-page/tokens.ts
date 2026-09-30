import tokensCss from '../../dist/tokens.css?raw';
import { parseCss } from './css';

/**
 * The generated `dist/tokens.css`, resolved per theme.
 *
 * `:root` holds the default theme and one `[data-theme="<name>"]` block holds each theme, so a
 * value is read from the theme block first, then from `:root`, following `var(--x)` chains.
 * The same numbers feed the contrast specimens and the live rulebook, so the two cannot disagree.
 */
type Block = Record<string, string>;

const blocks = new Map<string, Block>();
let root: Block = {};
for (const rule of parseCss(tokensCss)) {
  const theme = /^\[data-theme="([^"]+)"\]$/.exec(rule.selector)?.[1];
  if (rule.selector === ':root') root = { ...root, ...rule.declarations };
  else if (theme) blocks.set(theme, { ...blocks.get(theme), ...rule.declarations });
}

export const THEMES: readonly string[] = [...blocks.keys()];

/** Every custom property defined for a theme (theme block over `:root`). */
export function themeTokens(theme: string): Block {
  return { ...root, ...blocks.get(theme) };
}

/** The role names one theme block defines, for the parity check. */
export function roleNames(theme: string): string[] {
  return Object.keys(blocks.get(theme) ?? {}).sort();
}

/** The value of `--ds-x` in a theme with every `var()` followed, or undefined when it is unknown. */
export function resolve(theme: string, name: string, seen: readonly string[] = []): string | undefined {
  const value = themeTokens(theme)[name];
  if (value === undefined || seen.includes(name)) return undefined;
  const ref = /^var\(\s*(--[\w-]+)\s*\)$/.exec(value);
  return ref ? resolve(theme, ref[1], [...seen, name]) : value;
}

/** The literal (unresolved) value: a single hop shows the alias chain a reader asked for. */
export function alias(theme: string, name: string): string | undefined {
  return themeTokens(theme)[name];
}

// ---------- contrast, WCAG 2.x ----------

function channels(hex: string): [number, number, number] | null {
  const digits = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(digits)) return null;
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits;
  return [0, 2, 4].map((at) => parseInt(full.slice(at, at + 2), 16)) as [number, number, number];
}

function luminance(hex: string): number | null {
  const rgb = channels(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio, 1 to 21, or null when either side is not a hex colour. */
export function contrast(foreground: string | undefined, background: string | undefined): number | null {
  const a = foreground ? luminance(foreground) : null;
  const b = background ? luminance(background) : null;
  return a === null || b === null ? null : (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Contrast between two tokens in one theme. */
export const contrastOf = (theme: string, fg: string, bg: string): number | null =>
  contrast(resolve(theme, fg), resolve(theme, bg));

export const ratioText = (ratio: number | null): string => (ratio === null ? 'n/a' : `${ratio.toFixed(2)}:1`);
