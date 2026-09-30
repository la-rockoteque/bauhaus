// The typography token chain, named in one place: typefaces (named families) -> fonts (the six roles) -> text styles.
// Rename a group here and the checks follow. The token files carry the same names.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const TYPEFACE_GROUP = 'typeface';
export const FONT_GROUP = 'font';
export const TEXT_GROUP = 'text';
/** Children of the `font` group that are scales, not roles. */
export const FONT_SCALES = ['size', 'weight', 'line-height', 'letter-spacing'];
export const ROLES = ['sans', 'serif', 'display', 'mono', 'handwriting', 'slab'];
export const GENERIC_FAMILIES = [
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'math', 'emoji', 'fangsong',
];

const CATALOG = fileURLToPath(new URL('../../kit/typefaces/catalog.json', import.meta.url));

/** The family ids of kit/typefaces/catalog.json (`inter`, `source-serif-4`). Empty when the catalog is absent. */
export function catalogIds() {
  try {
    return JSON.parse(fs.readFileSync(CATALOG, 'utf8')).families.map((f) => f.id);
  } catch {
    return [];
  }
}

/** The last family of a font stack given as a list or a CSS string, without quotes. */
export function lastFamily(stack) {
  const list = Array.isArray(stack) ? stack : String(stack).split(',');
  return String(list.at(-1) ?? '').trim().replace(/^["']|["']$/g, '');
}
