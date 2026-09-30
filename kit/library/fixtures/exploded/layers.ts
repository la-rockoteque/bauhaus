import type { TokenRow } from '../doc-page/types';

/** The layers of an exploded view, bottom to top: what the component casts, what it is made of, its edges, its content, its focus. */
export const LAYERS = ['elevation', 'surface', 'border', 'content', 'focus'] as const;
export type LayerId = (typeof LAYERS)[number];

export const LAYER_NAMES: Record<LayerId, string> = {
  elevation: 'Elevation',
  surface: 'Surface',
  border: 'Border',
  content: 'Content',
  focus: 'Focus',
};

/**
 * The layer a token paints, from its name. Only colour and shadow tokens paint a layer; sizes, spaces and type do not.
 * The first match wins, so `action.primary-text` is content and `field.border · border-focus` is a border.
 */
export function layerOf(row: Pick<TokenRow, 'name' | 'swatch'>): LayerId | undefined {
  const name = row.name.toLowerCase();
  if (/shadow|elevation/.test(name)) return 'elevation';
  if (!row.swatch) return undefined;
  if (/border|outline|divider/.test(name)) return 'border';
  if (/focus/.test(name)) return 'focus';
  if (/text|icon|link|label/.test(name)) return 'content';
  return 'surface';
}

/** The token rows of each layer, in layer order; a layer with no token is left out. */
export function explode(rows: readonly TokenRow[]): { layer: LayerId; rows: TokenRow[] }[] {
  return LAYERS.map((layer) => ({ layer, rows: rows.filter((row) => layerOf(row) === layer) })).filter((group) => group.rows.length > 0);
}
