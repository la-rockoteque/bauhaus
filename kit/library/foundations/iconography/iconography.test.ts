import { describe, expect, it } from 'vitest';
import { boundsOf, parseGlyph } from './glyph-points';
import { GLYPHS, GLYPH_GROUPS, GLYPH_NAMES, GLYPH_VIEWBOX, MIRRORED_IN_RTL } from './glyphs';

const LIVE = [2, 22] as const;
const ORIGINAL_SIXTEEN = ['check', 'close', 'chevron-down', 'chevron-up', 'chevron-left', 'chevron-right', 'search', 'plus', 'minus', 'info', 'warning', 'error', 'success', 'menu', 'more', 'external'];

describe('the glyph set', () => {
  it('has unique names, each in one group only', () => {
    const grouped = Object.values(GLYPH_GROUPS).flatMap((group) => Object.keys(group));
    expect(new Set(grouped).size).toBe(grouped.length);
    expect(GLYPH_NAMES).toEqual(grouped);
  });

  it('holds 44 glyphs in five groups and keeps the original sixteen names', () => {
    expect(Object.values(GLYPH_GROUPS).map((group) => Object.keys(group).length)).toEqual([12, 14, 5, 11, 2]);
    expect(GLYPH_NAMES).toHaveLength(44);
    expect(GLYPH_NAMES).toEqual(expect.arrayContaining(ORIGINAL_SIXTEEN));
  });

  it('names its glyphs in lower-case kebab-case', () => {
    for (const name of GLYPH_NAMES) expect(name).toMatch(/^[a-z]+(-[a-z]+)*$/);
  });

  it('draws on the 24 by 24 grid', () => {
    expect(GLYPH_VIEWBOX).toBe('0 0 24 24');
  });

  it('flips only glyphs that exist and point along the reading direction', () => {
    expect(MIRRORED_IN_RTL).toEqual(['chevron-left', 'chevron-right', 'arrow-left', 'arrow-right']);
    for (const name of MIRRORED_IN_RTL) expect(GLYPH_NAMES).toContain(name);
  });
});

describe.each(GLYPH_NAMES)('glyph %s', (name) => {
  const shape = parseGlyph(GLYPHS[name]);

  it('has data', () => {
    expect(shape.points.length).toBeGreaterThan(1);
  });

  it('stays inside the live area', () => {
    const [x0, y0, x1, y1] = boundsOf(shape.points);
    for (const value of [x0, y0, x1, y1]) expect(value).toBeGreaterThanOrEqual(LIVE[0]);
    for (const value of [x0, y0, x1, y1]) expect(value).toBeLessThanOrEqual(LIVE[1]);
  });

  it('uses only lines, and circular arcs', () => {
    expect(shape.commands.filter((command) => !'MLHVAZ'.includes(command))).toEqual([]);
    expect(shape.circularArcs).toBe(true);
  });

  it('carries no colour: the data is path commands and numbers only', () => {
    expect(GLYPHS[name]).toMatch(/^[MLHVAZmlhvaz0-9 .-]+$/);
  });
});

describe('parseGlyph', () => {
  it('follows relative and absolute commands, implicit repeats and closing', () => {
    expect(parseGlyph('M2 3l4 0 0 5H2z').points).toEqual([[2, 3], [6, 3], [6, 8], [2, 8]]);
  });

  it('measures a full circle from its two arcs', () => {
    const [x0, y0, x1, y1] = boundsOf(parseGlyph('M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0').points);
    expect([x0, y0, x1, y1].map((value) => Math.round(value * 100) / 100)).toEqual([3, 3, 21, 21]);
  });

  it('reports a curve and an oval arc', () => {
    expect(parseGlyph('M4 4C8 8 12 8 16 4').commands).toContain('C');
    expect(parseGlyph('M4 12a6 3 0 0 1 12 0').circularArcs).toBe(false);
  });

  it('refuses a command it does not know', () => {
    expect(() => parseGlyph('M4 4X5 5')).toThrow(/unknown command/);
  });
});
