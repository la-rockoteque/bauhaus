// Path data for the built-in glyphs. Each one is drawn on a 16 by 16 grid as strokes only, so the
// icon takes its colour from currentColor and its weight from one CSS value. A dot is a zero-length
// stroke with a round cap ("h.01").
export const GLYPHS = {
  check: 'M3 8.5l3.5 3.5L13 4.5',
  close: 'M3.5 3.5l9 9M12.5 3.5l-9 9',
  'chevron-down': 'M3.5 6l4.5 4.5L12.5 6',
  'chevron-up': 'M3.5 10L8 5.5l4.5 4.5',
  'chevron-left': 'M10 3.5L5.5 8l4.5 4.5',
  'chevron-right': 'M6 3.5L10.5 8 6 12.5',
  search: 'M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM11 11l3.5 3.5',
  plus: 'M8 3v10M3 8h10',
  minus: 'M3 8h10',
  info: 'M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM8 7.25v4.25M8 4.75h.01',
  warning: 'M8 2.25l6.25 11H1.75zM8 6.5v3.25M8 11.75h.01',
  error: 'M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM5.5 5.5l5 5M10.5 5.5l-5 5',
  success: 'M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM5 8.25l2 2 4-4.5',
  menu: 'M2.5 4h11M2.5 8h11M2.5 12h11',
  more: 'M3.5 8h.01M8 8h.01M12.5 8h.01',
  external: 'M6.5 3.5H4A1.5 1.5 0 0 0 2.5 5v7A1.5 1.5 0 0 0 4 13.5h7a1.5 1.5 0 0 0 1.5-1.5V9.5M9.5 2.5h4v4M13.5 2.5L7.5 8.5',
} as const;

export type IconGlyph = keyof typeof GLYPHS;

export const GLYPH_NAMES = Object.keys(GLYPHS) as IconGlyph[];
