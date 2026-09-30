import { ContrastPairs, RoleSwatches, ThemeSample } from './specimens';
import { THEMES } from './tokens';
import type { DocPageProps } from './types';

/**
 * The props of the one Themes showcase, as `<DocPage {...themePage(...)} />`.
 * The theme switch in its header (and the toolbar) picks the theme; the roles and contrast below
 * are the selected theme's, drawn once.
 */
export function themePage(guide: string, guideName: string): DocPageProps {
  return {
    name: 'Themes',
    layer: 'Theme',
    plain: 'A theme gives every role a value for one kind of page. Components do not change. They read the same role names, and the names point to different values. Switch the theme in the header or the toolbar.',
    precise: `Theme · a full set of role values, siblings (${THEMES.join(', ')}) · each defines every role name in foundations/color and adds none · the first is the default and also renders as :root, the others as [data-theme="<name>"].`,
    usedFor: 'The values behind every role, for pages set to a theme.',
    tokens: {
      mode: 'defined',
      note: 'The palette and the colors do not change per theme. Each theme picks other grades of the same scales.',
      rows: [
        { name: 'text.*', tier: 'role', use: 'light: dark neutrals · dark: light neutrals; text.link is primary.700 or primary.300', swatch: '--ds-text-default' },
        { name: 'surface.*', tier: 'role', use: 'light: neutral.100 and 200 · dark: neutral.800 default, 700 raised, 900 sunken', swatch: '--ds-surface-default' },
        { name: 'border.*', tier: 'role', use: 'light: neutral.300 and 500 · dark: neutral.600 and 400', swatch: '--ds-border-strong' },
        { name: 'action.*', tier: 'role', use: 'light: primary.600, darker on hover and press · dark: one step lighter with a dark label', swatch: '--ds-action-primary' },
        { name: 'status.*', tier: 'role', use: 'light: 600 for text and icon, 100 for the surface · dark: 300 and 900', swatch: '--ds-status-error' },
        { name: 'focus.ring.color · disabled.* · state.*', tier: 'role', use: 'primary.600 and light tints in light · primary.300 and dark tints in dark', swatch: '--ds-focus-ring-color' },
      ],
    },
    specimens: <ThemeSample />,
    specs: [
      { label: 'Files', value: 'themes/<name>/<name>.tokens.json; each role aliases a colors.* grade' },
      { label: 'Parity', value: 'Every theme defines exactly the same roles; the build refuses a missing or extra role' },
      { label: 'Forced colors', value: 'n/a; the browser replaces author colours' },
    ],
    states: {
      note: 'The theme is a state of the whole page. Use the switch above to see each.',
      cells: [{ id: 'default', status: 'designed', label: 'Theme applied', render: <ThemeSample />, trigger: '[data-theme]', note: 'Real components in the selected theme.' }],
    },
    extra: [
      { title: 'Roles', kicker: 'Every role of the selected theme. The lines under a value are the hex and the alias it reads.', content: <RoleSwatches /> },
      { title: 'Contrast', kicker: 'Every pair of foundations/color/pairs.json, measured in the selected theme.', content: <ContrastPairs /> },
    ],
    dos: [
      { text: 'Keep the role names identical in every theme.', basis: 'Carbon: same roles across themes' },
      { text: 'Alias colors.* only.', basis: 'tokens.mjs check warning' },
      { text: 'Re-check every pair at 4.5:1 and 3:1 after a change.', basis: 'WCAG 1.4.3, 1.4.11 (AA)' },
      { text: 'Re-derive dark roles from the scales; do not invert light ones.', basis: 'Project decision' },
    ],
    donts: [
      { text: 'Add a role to one theme only.', basis: 'Bauhaus tokens.mjs check', rule: 'color.theme-parity' },
      { text: 'Write a hex value in a theme file.', basis: 'Bauhaus naming lint', rule: 'color.roles-alias-colors' },
      { text: 'Write a colour literal in a component "for dark mode".', basis: 'misfile.raw-value-in-component', rule: 'color.semantic-by-intent' },
    ],
    rules: [],
    guide,
    guideName,
  };
}
