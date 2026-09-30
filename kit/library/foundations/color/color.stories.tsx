import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { ColorRamps, ContrastPairs, PaletteRamps, RoleChips, RoleSwatches } from '../../fixtures/specimens/specimens';
import { colorRules } from './color.rules';

// The showcase: one page story with live swatches, read from the generated tokens.
const meta = { title: 'Foundations/Color', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Color"
      layer="Foundation"
      plain="Color tells users what things are for: text, surface, border, the main action. Components ask for a job, never for a shade of blue. Three steps stand between a hex value and a component, so a rebrand or a dark theme changes one step and no component."
      precise="Foundation · palette (named hues with grades), colors (role scales over the palette) and, per theme, roles (flat, named by purpose) · the source of every colour in the library."
      usedFor="Every colour in a stylesheet."
      tokens={{
        mode: 'defined',
        note: 'The role names are the same in themes/light and themes/dark. Only the values change.',
        rows: [
          { name: 'palette.scarlet · dark-blue · teal · amber · green · gray  .100 … .900', tier: '1', use: 'Raw hex values, 100 lightest to 900 darkest. Read by colors only.', swatch: '--ds-palette-dark-blue-600' },
          { name: 'colors.primary · secondary · error · success · warning · info · neutral  .100 … .900', tier: '1', use: 'Aliases {palette.<hue>.<grade>}. Read by theme roles, charts and illustrations. The rebrand point.', swatch: '--ds-colors-primary-600' },
          { name: 'series.hue · step · chroma', tier: '1', use: 'Golden-angle rule for categorical series: 250, 137.508, 0.075. Series n is oklch(lightness chroma, hue + n × step), composed in CSS with --part: n.' },
          { name: 'series.lightness', tier: 'role', use: 'Lightness of every series colour: 0.55 in light, 0.72 in dark. Series 1 to 12 keep 3:1 on the page.' },
          { name: 'text.*', tier: 'role', use: 'default, muted, inverse, link', swatch: '--ds-text-default' },
          { name: 'surface.*', tier: 'role', use: 'default, raised, sunken', swatch: '--ds-surface-sunken' },
          { name: 'border.*', tier: 'role', use: 'default (decorative divider), strong (control boundary)', swatch: '--ds-border-strong' },
          { name: 'action.*', tier: 'role', use: 'primary and secondary fills, with hover, pressed and text', swatch: '--ds-action-primary' },
          { name: 'colors.ink  .a06 … a64', tier: '1', use: 'Translucent ink (alpha 6 to 64%). Read by shadow and scrim roles only', swatch: '--ds-colors-ink-a32' },
          { name: 'surface.inverse', tier: 'role', use: 'Fill of a tooltip or toast; text.inverse sits on it', swatch: '--ds-surface-inverse' },
          { name: 'status.*', tier: 'role', use: 'error, success, warning, info, each with -surface, -text and -border', swatch: '--ds-status-error' },
          { name: 'field.*', tier: 'role', use: 'surface, text, placeholder and four border states of a text field, textarea, select', swatch: '--ds-field-border' },
          { name: 'selection.*', tier: 'role', use: 'surface, text and mark of a checked checkbox, radio, switch', swatch: '--ds-selection-surface' },
          { name: 'overlay.* · scrim · shadow.*', tier: 'role', use: 'Floating surface, its soft edge, the wash behind a modal and the two shadow rungs (see Elevation)', swatch: '--ds-overlay-surface' },
          { name: 'table.* · skeleton.* · progress.*', tier: 'role', use: 'Table header, row states and rules; skeleton base and shimmer; progress track and fill', swatch: '--ds-table-header-surface' },
          { name: 'badge.<neutral|info|success|warning|error> · -text', tier: 'role', use: 'Solid fill of a badge and the text on it', swatch: '--ds-badge-info' },
          { name: 'focus.ring.color · disabled.* · state.*', tier: 'role', use: 'Focus ring, disabled text, surface and border, hover and pressed layers, selected', swatch: '--ds-focus-ring-color' },
        ],
      }}
      specimens={
        <>
          <PaletteRamps hues={['scarlet', 'dark-blue', 'teal', 'amber', 'green', 'gray']} />
          <ColorRamps scales={['primary', 'secondary', 'error', 'success', 'warning', 'info', 'neutral']} />
        </>
      }
      specs={[
        { label: 'Steps', value: 'palette, then colors, then roles per theme' },
        { label: 'Hues', value: 'six, with nine grades each' },
        { label: 'Role scales', value: 'seven, plus ink (translucent, for shadows and scrims); primary is dark-blue, secondary teal, error scarlet, success green, warning amber, info dark-blue, neutral gray' },
        { label: 'Contrast', value: 'text 4.5:1 · borders, action fills and focus ring 3:1 · measured below in the selected theme' },
      ]}
      states={{
        note: 'Roles carry the interaction states. Each state colour differs from its base in lightness and never carries meaning alone.',
        cells: [
          { id: 'default', status: 'designed', label: 'Action roles', render: <RoleChips roles={['action.primary', 'action.secondary']} />, trigger: 'action.*' },
          { id: 'hover', status: 'designed', render: <RoleChips roles={['action.primary-hover', 'state.hover-layer']} />, trigger: 'action.*-hover · state.hover-layer' },
          { id: 'active', status: 'designed', label: 'Pressed', render: <RoleChips roles={['action.primary-pressed', 'state.pressed-layer']} />, trigger: 'action.*-pressed · state.pressed-layer' },
          { id: 'focus-visible', status: 'designed', render: <RoleChips roles={['focus.ring.color']} />, trigger: 'focus.ring.color' },
          { id: 'disabled', status: 'designed', render: <RoleChips roles={['disabled.text', 'disabled.surface', 'disabled.border']} />, trigger: 'disabled.*', note: 'Exempt from contrast (WCAG 1.4.3, 1.4.11). Not in pairs.json.' },
          { id: 'selected', status: 'designed', render: <RoleChips roles={['state.selected']} />, trigger: 'state.selected' },
        ],
      }}
      extra={[
        { title: 'Roles', kicker: 'The roles of the selected theme; switch it in the header or the toolbar. The lines under a value are the hex and the alias it reads.', content: <RoleSwatches /> },
        { title: 'Contrast', kicker: 'Every pair of foundations/color/pairs.json, measured in the selected theme from the built tokens.', content: <ContrastPairs /> },
      ]}
      dos={[
        { text: 'Read a role for every colour in a stylesheet.', basis: 'Project decision' },
        { text: 'Keep text at 4.5:1 and borders, action fills and the focus ring at 3:1.', basis: 'WCAG 1.4.3, 1.4.11 (AA)' },
        { text: 'Re-derive dark roles from the scales; do not invert the light ones.', basis: 'Project decision' },
        { text: 'Name a role for its job: text.link, not text.blue.', basis: 'Bauhaus naming lint' },
      ]}
      donts={[
        { text: 'Write a hex value in a component.', basis: 'misfile.raw-value-in-component', rule: 'color.semantic-by-intent' },
        { text: 'Read a palette or colors variable in a component.', basis: 'misfile.palette-at-call-site; Primer', rule: 'color.no-palette-at-call-site' },
        { text: 'Alias palette.* from a theme role.', basis: 'tokens.mjs check warning', rule: 'color.roles-alias-colors' },
        { text: 'Leave a role out of one theme.', basis: 'Carbon: same roles across themes', rule: 'color.theme-parity' },
        { text: 'Show an error with red alone.', basis: 'WCAG 1.4.1 (A)', rule: 'color.ui-contrast' },
        { text: 'Tune grey text by eye.', basis: 'WCAG 1.4.3 (AA)', rule: 'color.text-contrast' },
      ]}
      rules={colorRules}
      guide="foundations-color--docs"
      guideName="Color"
    />
  ),
};
