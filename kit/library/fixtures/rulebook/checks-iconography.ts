import { boundsOf, parseGlyph } from '../../foundations/iconography/glyph-points';
import { GLYPHS, GLYPH_GROUPS, GLYPH_NAMES, GLYPH_VIEWBOX } from '../../foundations/iconography/glyphs';
import { all, eachTheme, px, sourceMatches, uses, type Check } from './checks';
import { sourceOf } from './sources';
import { resolve } from './tokens';

/**
 * Auto checks for the iconography foundation, keyed by rule id. They read the glyph data itself
 * (not a copy of it), the Icon and its stylesheet, and the generated tokens. all-checks.ts merges this map.
 */
const ICON = 'primitives/icon/icon';
const GLYPHS_FILE = 'foundations/iconography/glyphs.ts';
const LIVE = [2, 22] as const;

const perGlyph = (test: (name: string, d: string) => string | null): Check => () => {
  const bad = GLYPH_NAMES.map((name) => test(name, GLYPHS[name])).filter((reason): reason is string => reason !== null);
  return bad.length ? bad.join(' · ') : null;
};

const insideLiveArea: Check = perGlyph((name, d) => {
  const [x0, y0, x1, y1] = boundsOf(parseGlyph(d).points);
  return Math.min(x0, y0) < LIVE[0] || Math.max(x1, y1) > LIVE[1] ? `${name} reaches ${x0.toFixed(1)},${y0.toFixed(1)} to ${x1.toFixed(1)},${y1.toFixed(1)}, outside ${LIVE[0]} to ${LIVE[1]}` : null;
});

const primaryForms: Check = perGlyph((name, d) => {
  const { commands, circularArcs } = parseGlyph(d);
  const stray = commands.filter((command) => !'MLHVAZ'.includes(command));
  if (stray.length) return `${name} uses ${stray.join(', ')}; only M L H V A Z are lines and circles`;
  return circularArcs ? null : `${name} has an oval arc`;
});

const noPaint: Check = () => {
  const code = (sourceOf(GLYPHS_FILE) ?? '').split('\n').filter((line) => !line.trim().startsWith('//')).join('\n');
  return /\b(?:fill|stroke)\b\s*[:=]|#[0-9a-f]{3,8}\b|\b(?:rgb|hsl|oklch)a?\(/i.test(code) ? `${GLYPHS_FILE} holds a fill, stroke or colour literal` : null;
};

const setComplete: Check = () => {
  const grouped = Object.values(GLYPH_GROUPS).reduce((sum, group) => sum + Object.keys(group).length, 0);
  if (grouped !== GLYPH_NAMES.length) return `${grouped} grouped glyphs but ${GLYPH_NAMES.length} names: a name is in two groups`;
  return perGlyph((name, d) => {
    try {
      return d.trim() && parseGlyph(d).points.length > 1 ? null : `${name} has no path data`;
    } catch (error) {
      return `${name}: ${(error as Error).message}`;
    }
  })();
};

export const CHECKS: Readonly<Record<string, Check>> = {
  'iconography.grid': all(
    () => (GLYPH_VIEWBOX === '0 0 24 24' ? null : `the glyph viewBox is ${GLYPH_VIEWBOX}, not 0 0 24 24`),
    sourceMatches(`${ICON}.tsx`, /viewBox=\{GLYPH_VIEWBOX\}/, 'Icon does not draw on GLYPH_VIEWBOX'),
    insideLiveArea,
  ),
  'iconography.primary-forms': primaryForms,
  'iconography.stroke-token': all(
    uses(`${ICON}.css`, '.ds-icon', 'stroke-width', '--ds-icon-stroke'),
    eachTheme((theme) => (px(resolve(theme, '--ds-icon-stroke')) === 2 ? null : `--ds-icon-stroke is ${resolve(theme, '--ds-icon-stroke') ?? 'missing'}, not 2 units at 24`)),
  ),
  'iconography.current-color': all(uses(`${ICON}.css`, '.ds-icon', 'stroke', 'currentColor'), uses(`${ICON}.css`, '.ds-icon', 'fill', 'none'), noPaint),
  'iconography.named-set-complete': setComplete,
  'iconography.decorative-hidden': all(
    sourceMatches(`${ICON}.tsx`, /'aria-hidden': true/, 'the icon is not aria-hidden without a label'),
    sourceMatches(`${ICON}.tsx`, /focusable="false"/, 'the icon is focusable'),
  ),
};
