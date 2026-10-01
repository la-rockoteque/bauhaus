// The glyph set. Every glyph is path data on the 24 by 24 grid, drawn as one stroke and no fill, so an
// icon takes its colour from currentColor and its weight from the icon.stroke token. The drawing
// system is in iconography.mdx (Construction). Path commands are limited to M L H V A Z and every arc
// is circular, so a glyph holds only lines, squares, triangles and circles (iconography.primary-forms).
// A dot is a line of length .01: the square cap makes it a 2 by 2 square.

/** The one grid. Every glyph is drawn on it and the Icon scales the whole box. */
export const GLYPH_VIEWBOX = '0 0 24 24';

export const GLYPH_GROUPS = {
  navigation: {
    'chevron-up': 'M6 15l6-6 6 6',
    'chevron-down': 'M6 9l6 6 6-6',
    'chevron-left': 'M15 6l-6 6 6 6',
    'chevron-right': 'M9 6l6 6-6 6',
    'arrow-up': 'M12 20V4M6 10l6-6 6 6',
    'arrow-down': 'M12 4v16M6 14l6 6 6-6',
    'arrow-left': 'M20 12H4M10 6l-6 6 6 6',
    'arrow-right': 'M4 12h16M14 6l6 6-6 6',
    menu: 'M3 6h18M3 12h18M3 18h18',
    more: 'M4 11h2v2H4zM11 11h2v2h-2zM18 11h2v2h-2z',
    external: 'M18 14v7H3V7h7M14 3h7v7M21 3L10 14',
    home: 'M3 13l9-9 9 9M5 11v9h14v-9M10 20v-5h4v5',
  },
  actions: {
    search: 'M3 10a7 7 0 1 0 14 0 7 7 0 1 0-14 0M15 15l6 6',
    plus: 'M12 4v16M4 12h16',
    minus: 'M4 12h16',
    close: 'M5 5l14 14M19 5L5 19',
    check: 'M4 11l6 6 10-10',
    edit: 'M4 20l2-6L16 4l4 4L10 18zM13 7l4 4',
    delete: 'M4 6h16M9 6V3h6v3M6 6v15h12V6M10 10v7M14 10v7',
    copy: 'M3 8h13v13H3zM8 8V3h13v13h-5',
    download: 'M12 3v12M7 10l5 5 5-5M4 17v4h16v-4',
    upload: 'M12 15V3M7 8l5-5 5 5M4 17v4h16v-4',
    filter: 'M5 4h14l-5 7v9h-4v-9z',
    sort: 'M8 20V4M4 8l4-4 4 4M16 4v16M12 16l4 4 4-4',
    settings: 'M3 6h2M11 6h10M6 6a2 2 0 1 0 4 0 2 2 0 1 0-4 0M3 12h10M19 12h2M14 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0M3 18h4M13 18h8M8 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
    refresh: 'M19.52 15.74A8 8 0 1 1 18.13 7.86M18.13 3.86v4h-4',
  },
  status: {
    info: 'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 11v6M12 7h.01',
    success: 'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M8 11l3 3 5-5',
    warning: 'M12 5l8 15H4zM12 11v3M12 17h.01',
    error: 'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M9 9l6 6M15 9l-6 6',
    help: 'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M9 9a3 3 0 0 1 6 0 3 3 0 0 1-3 3v2M12 18h.01',
  },
  objects: {
    user: 'M9 7a3 3 0 1 0 6 0 3 3 0 1 0-6 0M5 21a7 7 0 0 1 14 0z',
    calendar: 'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4',
    clock: 'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 7v5l3 3',
    mail: 'M3 5h18v14H3zM4 6l8 7 8-7',
    bell: 'M6 17V9a6 6 0 0 1 12 0v8M3 17h18M10 21h4',
    lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4M12 15v2',
    eye: 'M3 12A10 10 0 0 1 21 12 10 10 0 0 1 3 12zM9.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0',
    'eye-off': 'M3 12A10 10 0 0 1 21 12 10 10 0 0 1 3 12zM4 4l16 16',
    file: 'M5 3h9l5 5v13H5zM14 3v5h5M9 13h6M9 17h6',
    folder: 'M3 19V5h6l3 3h9v11z',
    link: 'M10 7H9a5 5 0 0 0 0 10h1M14 7h1a5 5 0 0 1 0 10h-1M8 12h8',
  },
  cursors: {
    // A hand, index finger up, then the same hand turned to press down. Fingertips are half circles.
    pointer: 'M8 14V5a2 2 0 0 1 4 0v6a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v4a6 6 0 0 1-6 6h-2a6 6 0 0 1-5-3l-3-5a2 2 0 0 1 3-2l1 1',
    press: 'M8 11v9a2 2 0 0 0 4 0v-6a2 2 0 0 0 4 0v-1a2 2 0 0 0 4 0V9a6 6 0 0 0-6-6h-2a6 6 0 0 0-5 3l-3 5a2 2 0 0 0 3 2l1-1',
  },
} as const;

export type GlyphGroup = keyof typeof GLYPH_GROUPS;

/** Every glyph by name, in the order of the groups. */
export const GLYPHS: Readonly<Record<IconGlyph, string>> = Object.assign({}, ...Object.values(GLYPH_GROUPS));

type Groups = typeof GLYPH_GROUPS;
export type IconGlyph = { [G in GlyphGroup]: keyof Groups[G] }[GlyphGroup];

export const GLYPH_NAMES = Object.keys(GLYPHS) as IconGlyph[];

/** The glyphs that point along the reading direction. They flip in a right-to-left layout. */
export const MIRRORED_IN_RTL: readonly IconGlyph[] = ['chevron-left', 'chevron-right', 'arrow-left', 'arrow-right'];
