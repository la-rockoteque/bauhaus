import { useState } from 'react';
import { TextField } from '../../components/fields/text-field/text-field';
import { GLYPHS, GLYPH_GROUPS, GLYPH_NAMES } from '../../foundations/iconography/glyphs';
import type { GlyphGroup, IconGlyph } from '../../foundations/iconography/glyphs';
import { Icon } from '../../primitives/icon/icon';
import type { IconSize } from '../../primitives/icon/icon';
import { Text } from '../../primitives/text/text';
import type { TextVariant } from '../../primitives/text/text';
import { THEMES, resolve } from '../rulebook/tokens';
import './icon-catalog.css';

/**
 * The blocks that show the icon set on the iconography page. `IconCatalog` lists every glyph by
 * group with a search box, each at sm, md and lg in every theme. `GlyphGrid` draws one glyph over
 * the construction grid. `Keylines` shows the four keyline forms. `GlyphSheet` draws them all over the grid.
 * `SizePairing` sets each icon size beside the text style it goes with.
 */
const SIZES: readonly IconSize[] = ['sm', 'md', 'lg'];
const GROUP_TITLE: Record<GlyphGroup, string> = { navigation: 'Navigation', actions: 'Actions', status: 'Status', objects: 'Objects', cursors: 'Cursors' };

export interface GlyphMatch {
  group: GlyphGroup;
  names: IconGlyph[];
}

/** The glyphs whose name, or whose group name, contains the query; groups with no match are left out. */
export function filterGlyphs(query: string): GlyphMatch[] {
  const q = query.trim().toLowerCase();
  return (Object.keys(GLYPH_GROUPS) as GlyphGroup[])
    .map((group) => {
      const all = Object.keys(GLYPH_GROUPS[group]) as IconGlyph[];
      return { group, names: !q || group.includes(q) ? all : all.filter((name) => name.includes(q)) };
    })
    .filter((match) => match.names.length > 0);
}

function Tile({ glyph, theme }: { glyph: IconGlyph; theme: string }) {
  return (
    <span className="ds-icon-catalog__tile" data-theme={theme}>
      {SIZES.map((size) => (
        <Icon key={size} glyph={glyph} size={size} />
      ))}
    </span>
  );
}

export function IconCatalog() {
  const [query, setQuery] = useState('');
  const matches = filterGlyphs(query);
  const count = matches.reduce((sum, match) => sum + match.names.length, 0);
  return (
    <div className="ds-icon-catalog">
      <TextField type="search" label="Search glyphs" description={`By name or group. Each glyph shows at sm, md and lg in ${THEMES.join(' and ')}.`} value={query} onChange={(event) => setQuery(event.target.value)} />
      <Text variant="caption" tone="muted" role="status" className="ds-icon-catalog__count">{`${count} of ${GLYPH_NAMES.length} glyphs`}</Text>
      {matches.map(({ group, names }) => (
        <section key={group} className="ds-icon-catalog__group" aria-labelledby={`icon-catalog-${group}`}>
          <Text as="h3" variant="heading" id={`icon-catalog-${group}`}>{`${GROUP_TITLE[group]} · ${names.length}`}</Text>
          <ul className="ds-icon-catalog__grid">
            {names.map((name) => (
              <li key={name} className="ds-icon-catalog__card">
                <code>{name}</code>
                <span className="ds-icon-catalog__pair">
                  {THEMES.map((theme) => (
                    <Tile key={theme} glyph={name} theme={theme} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {count === 0 && <Text tone="muted">{`No glyph matches "${query.trim()}".`}</Text>}
    </div>
  );
}

// ---------- the construction grid ----------

export type Keyline = 'circle' | 'square' | 'portrait' | 'landscape';
const GRID_LINES = Array.from({ length: 23 }, (_, i) => `M${i + 1} 0V24M0 ${i + 1}H24`).join('');

/** One glyph over the 24 by 24 grid: live area, keylines, the stroke, and the centre line it follows. */
export function GlyphGrid({ glyph, keyline }: { glyph: IconGlyph; keyline?: Keyline }) {
  const show = (name: Keyline) => !keyline || keyline === name;
  return (
    <svg className="ds-icon ds-glyph-grid" viewBox="0 0 24 24" role="img" aria-label={`The ${glyph} glyph on the 24 by 24 grid`}>
      <path className="ds-glyph-grid__grid" d={GRID_LINES} />
      <rect className="ds-glyph-grid__live" x="2" y="2" width="20" height="20" />
      <g className="ds-glyph-grid__keylines">
        {show('circle') && <circle cx="12" cy="12" r="10" />}
        {show('square') && <rect x="3" y="3" width="18" height="18" />}
        {show('portrait') && <rect x="4" y="2" width="16" height="20" />}
        {show('landscape') && <rect x="2" y="4" width="20" height="16" />}
      </g>
      <path className="ds-glyph-grid__glyph" d={GLYPHS[glyph]} />
      <path className="ds-glyph-grid__centre" d={GLYPHS[glyph]} />
    </svg>
  );
}

const KEYLINES: readonly { keyline: Keyline; glyph: IconGlyph; size: string }[] = [
  { keyline: 'circle', glyph: 'clock', size: '20 × 20, drawn at r 9 so the stroke ends on the edge' },
  { keyline: 'square', glyph: 'calendar', size: '18 × 18, two smaller than the circle' },
  { keyline: 'portrait', glyph: 'file', size: '16 wide × 20 high' },
  { keyline: 'landscape', glyph: 'mail', size: '20 wide × 16 high' },
];

export function Keylines() {
  return (
    <ul className="ds-icon-catalog__figures">
      {KEYLINES.map(({ keyline, glyph, size }) => (
        <li key={keyline}>
          <GlyphGrid glyph={glyph} keyline={keyline} />
          <Text variant="caption" as="p"><strong>{keyline}</strong> · {glyph}<br />{size}</Text>
        </li>
      ))}
    </ul>
  );
}

/** Every glyph over the grid at 8 times, to judge weight, centring and keylines by eye. */
export function GlyphSheet() {
  return (
    <ul className="ds-icon-catalog__sheet">
      {GLYPH_NAMES.map((glyph) => (
        <li key={glyph}>
          <GlyphGrid glyph={glyph} />
          <Text variant="caption" as="p">{glyph}</Text>
        </li>
      ))}
    </ul>
  );
}

const PAIRS: readonly { size: IconSize; glyph: IconGlyph; variant: TextVariant; text: string; token: string }[] = [
  { size: 'sm', glyph: 'clock', variant: 'caption', text: 'Saved 2 minutes ago', token: `size.icon.sm · ${resolve('light', '--ds-size-icon-sm')} · text.caption` },
  { size: 'md', glyph: 'plus', variant: 'body', text: 'Add a member', token: `size.icon.md · ${resolve('light', '--ds-size-icon-md')} · text.body` },
  { size: 'lg', glyph: 'settings', variant: 'heading', text: 'Team settings', token: `size.icon.lg · ${resolve('light', '--ds-size-icon-lg')} · text.heading` },
];

/** Each icon size beside the text style it pairs with, centred on the line. */
export function SizePairing() {
  return (
    <ul className="ds-icon-catalog__pairing">
      {PAIRS.map(({ size, glyph, variant, text, token }) => (
        <li key={size}>
          <span className="ds-icon-catalog__label">
            <Icon glyph={glyph} size={size} />
            <Text as="span" variant={variant}>{text}</Text>
          </span>
          <code>{token}</code>
        </li>
      ))}
    </ul>
  );
}
