import { forcedStateCss, parseCss, type CssRule } from './css';

/**
 * The library's own source files, as text, for the live rulebook and the forced-state styles.
 *
 * Read with Vite's `?raw`, so the page grades the code as it stands. Tests and stories are left
 * out, except a pattern's story (a pattern has no component file, so its recipe lives there) and the icon glyph set.
 */
const files = import.meta.glob(
  ['../../{foundations,themes,primitives,components,patterns}/**/*.{css,tsx}', '../../primitives/icon/glyphs.ts', '!../../**/*.test.tsx', '!../../**/*.stories.tsx'],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

const recipes = import.meta.glob('../../patterns/**/*.stories.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const key = (path: string): string => path.replace(/^(\.\.\/)+/, '');

/** Package-relative path to source text: `components/clickables/button/button.css`. */
export const SOURCES: ReadonlyMap<string, string> = new Map(
  Object.entries({ ...files, ...recipes }).map(([path, text]) => [key(path), text]),
);

const parsed = new Map<string, CssRule[]>();

/** Parsed rules of one stylesheet; an unknown path reads as no rules. */
export function rulesOf(path: string): CssRule[] {
  if (!parsed.has(path)) parsed.set(path, parseCss(SOURCES.get(path) ?? ''));
  return parsed.get(path)!;
}

export const sourceOf = (path: string): string | undefined => SOURCES.get(path);

/** Every stylesheet path, for the checks that scan the whole library. */
export const CSS_PATHS: readonly string[] = [...SOURCES.keys()].filter((path) => path.endsWith('.css'));

/** The forced-state stylesheet, generated from every component stylesheet. */
export const FORCED_STATE_CSS: string = forcedStateCss(CSS_PATHS.map((path) => SOURCES.get(path)!));
