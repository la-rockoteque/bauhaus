import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { RoleSwatches } from '../../fixtures/specimens/specimens';
import { ContrastMatrix } from '../../fixtures/contrast-matrix/contrast-matrix';
import { HueRamps } from '../../fixtures/hue-ramp/hue-ramp';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Banner } from '../../components/feedback/banner/banner';
import { Box } from '../../primitives/box/box';
import { Icon } from '../../primitives/icon/icon';
import { Stack } from '../../primitives/stack/stack';
import { Text } from '../../primitives/text/text';
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
          <HueRamps prefix="palette" names={['scarlet', 'dark-blue', 'teal', 'amber', 'green', 'gray']} />
          <HueRamps prefix="colors" names={['primary', 'secondary', 'error', 'success', 'warning', 'info', 'neutral']} />
        </>
      }
      specs={[
        { label: 'Steps', value: 'palette, then colors, then roles per theme' },
        { label: 'Hues', value: 'six, with nine grades each' },
        { label: 'Role scales', value: 'seven, plus ink (translucent, for shadows and scrims); primary is dark-blue, secondary teal, error scarlet, success green, warning amber, info dark-blue, neutral gray' },
        { label: 'Contrast', value: 'text 4.5:1 · borders, action fills and focus ring 3:1 · measured below in the selected theme' },
      ]}
      conditions={{
        cells: [],
        reason: 'Colour answers no user condition of its own. The theme sets every role, and the Roles section shows the selected theme.',
      }}
      extra={[
        { title: 'Roles', kicker: 'The roles of the selected theme; switch it in the header or the toolbar. The lines under a value are the hex and the alias it reads.', content: <RoleSwatches /> },
        { title: 'Contrast', kicker: 'Every pair of foundations/color/pairs.json, measured in the selected theme from the built tokens.', content: <ContrastMatrix /> },
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
      guide="foundations-color--docs"
      guideName="Color"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Color" layer="Foundation" scope={['contrast-text', 'contrast-ui', 'color-not-alone']} rules={colorRules} guide="foundations-color--docs" guideName="Color" />,
};

// Local helpers for the renders below: a foundation render may use inline `style` with `var(--ds-…)` only.
const swatch = (token: string) => (
  <span style={{ display: 'inline-block', inlineSize: 'var(--ds-space-8)', blockSize: 'var(--ds-space-8)', background: `var(${token})`, border: 'var(--ds-size-border-thin) solid var(--ds-border-default)' }} />
);

const card: CSSProperties = {
  padding: 'var(--ds-space-4)',
  background: 'var(--ds-surface-default)',
  color: 'var(--ds-text-default)',
  border: 'var(--ds-size-border-thin) solid var(--ds-border-default)',
  borderRadius: 'var(--ds-radius-md)',
};

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Color"
      layer="Foundation"
      family="Foundations"
      imports={`import '@bauhaus/design-system/tokens.css'; // defines every --ds-* colour variable, for both themes
import { Banner, Box, Icon, Stack, Text } from '@bauhaus/design-system';`}
      intro={[
        'A colour reaches your screen in three steps. The palette is the raw paint: `dark-blue-600` is one exact blue. A colours scale says which paint plays which part: `primary-600` points at `dark-blue-600`. A role says the job: `action.primary` means "the fill of the main button".',
        'Your code uses roles only. In CSS a role is a variable such as `var(--ds-text-default)`. Never write a hex value, `--ds-palette-*` or `--ds-colors-*` in a component.',
        'Why: a role changes value per theme (light or dark) and per brand. A hex value stays the same, so it looks wrong in dark mode and survives a rebrand.',
        'A token is a named design value. Here every token is a CSS custom property (a variable) that starts with `--ds-`. Read it with `var(--ds-name)`.',
        'Contrast is how different two colours look, as a ratio. Body text needs 4.5:1 against its background. Borders, icons and focus rings need 3:1 (WCAG 1.4.3 and 1.4.11, AA). The roles are built so that the documented pairs pass.',
      ]}
      guide="foundations-color--docs"
      guideName="Color"
      groups={[
        {
          title: 'Text, surfaces and borders',
          kicker: 'The most common job: put readable text on a background. Start with these three families.',
          examples: [
            {
              title: 'Text on the default surface',
              when: 'Any ordinary content: a paragraph, a card, a page.',
              explain: [
                '`--ds-surface-default` is the page background. `--ds-text-default` is the text that goes on it. They are a pair: the contrast is 4.5:1 or more in both themes (WCAG 1.4.3, AA).',
                'Set both on the same element. If you set only one, a dark theme can give you dark text on a dark background.',
                'Without roles you would write `#222` and `#fff`. The dark theme could not change them.',
              ],
              render: <div style={card}>Your changes are saved.</div>,
              lang: 'css',
              code: `.panel {
  /* The background first ... */
  background: var(--ds-surface-default);
  /* ... then the text colour made for that background. */
  color: var(--ds-text-default);
}`,
            },
            {
              title: 'Muted text',
              when: 'Secondary text: a hint, a date, a caption.',
              explain: [
                '`--ds-text-muted` is lighter than `--ds-text-default`, yet it still reaches 4.5:1 on every surface role. It stays readable for people with low vision.',
                'Never make grey text lighter by eye. A grey that looks fine on your screen can fail for others (WCAG 1.4.3, AA).',
              ],
              render: (
                <div style={card}>
                  <div>Invoice 2041</div>
                  <div style={{ color: 'var(--ds-text-muted)' }}>Sent on 12 March</div>
                </div>
              ),
              lang: 'css',
              code: `.meta {
  /* Quieter than the main text, but still readable. */
  color: var(--ds-text-muted);
}`,
            },
            {
              title: 'Borders: strong and default',
              when: 'Lines around a control, or lines between sections.',
              explain: [
                '`--ds-border-strong` outlines something the user must find, such as a field or a button. It reaches 3:1 (WCAG 1.4.11, AA).',
                '`--ds-border-default` only decorates, such as a divider. It stays soft and is not built to reach 3:1, so never use it to outline a control.',
              ],
              render: (
                <div style={{ ...card, display: 'grid', gap: 'var(--ds-space-3)' }}>
                  <div style={{ padding: 'var(--ds-space-2)', border: 'var(--ds-size-border-thin) solid var(--ds-border-strong)' }}>A control outline</div>
                  <div style={{ paddingBlockStart: 'var(--ds-space-2)', borderBlockStart: 'var(--ds-size-border-thin) solid var(--ds-border-default)' }}>Below a decorative divider</div>
                </div>
              ),
              lang: 'css',
              code: `.control {
  /* The user must see where this control ends: 3:1 contrast. */
  border: var(--ds-size-border-thin) solid var(--ds-border-strong);
}

.divider {
  /* Decoration only: the soft border is enough. */
  border-block-start: var(--ds-size-border-thin) solid var(--ds-border-default);
}`,
            },
            {
              title: 'Sunken, raised and inverse surfaces',
              when: 'A region that should stand apart from the page: a code well, a sidebar, a dark banner.',
              explain: [
                '`--ds-surface-sunken` is a little darker than the page. Use it for a recessed area.',
                '`--ds-surface-raised` is for a surface above the page. In the light theme it matches the page; in the dark theme it is lighter, so the lift stays visible.',
                '`--ds-surface-inverse` flips the page: dark in light, light in dark. Put `--ds-text-inverse` on it, never `--ds-text-default`.',
              ],
              render: (
                <div style={{ display: 'grid', gap: 'var(--ds-space-2)' }}>
                  <div style={{ ...card, background: 'var(--ds-surface-sunken)' }}>Sunken</div>
                  <div style={{ ...card, background: 'var(--ds-surface-raised)' }}>Raised</div>
                  <div style={{ ...card, background: 'var(--ds-surface-inverse)', color: 'var(--ds-text-inverse)' }}>Inverse</div>
                </div>
              ),
              lang: 'css',
              code: `.well    { background: var(--ds-surface-sunken); }
.sheet   { background: var(--ds-surface-raised); }
.callout {
  background: var(--ds-surface-inverse);
  /* Every surface has its own text role. This one is made for the inverse surface. */
  color: var(--ds-text-inverse);
}`,
            },
            {
              title: 'Links',
              when: 'Text that goes to another page.',
              explain: [
                '`--ds-text-link` is a blue that reaches 4.5:1 on the page. `--ds-text-link-visited` is a teal, so users can tell which links they already opened.',
                'Keep the underline. A colour alone cannot tell a link from text for a colour-blind reader (WCAG 1.4.1, A).',
                'The `Link` component already does all of this. Write this CSS only for a link you style yourself.',
              ],
              render: (
                <div style={card}>
                  <a href="#new" style={{ color: 'var(--ds-text-link)', textDecoration: 'underline' }}>New link</a>
                  {' · '}
                  <a href="#seen" style={{ color: 'var(--ds-text-link-visited)', textDecoration: 'underline' }}>Visited link</a>
                </div>
              ),
              lang: 'css',
              code: `a {
  color: var(--ds-text-link);
  /* The underline is the second cue. Colour alone is not enough. */
  text-decoration: underline;
}
a:visited {
  color: var(--ds-text-link-visited);
}`,
            },
          ],
        },
        {
          title: 'Actions and interaction states',
          kicker: 'Colours that tell users "you can press this", and what happens when they do.',
          examples: [
            {
              title: 'The primary action fill',
              when: 'You build your own control that looks like the main button.',
              explain: [
                '`--ds-action-primary` is the fill. `--ds-action-primary-text` is the label on it. The pair reaches 4.5:1 in both themes.',
                '`-hover` is darker (light theme) and `-pressed` is darker still. Each state differs in lightness, not only in hue, so no one needs to tell blues apart (WCAG 1.4.1, A).',
                'Prefer the `Button` component. It sets all of this, plus focus, loading and disabled.',
              ],
              render: (
                <div style={{ display: 'flex', gap: 'var(--ds-space-2)', flexWrap: 'wrap' }}>
                  {['--ds-action-primary', '--ds-action-primary-hover', '--ds-action-primary-pressed'].map((token) => (
                    <span key={token} style={{ padding: 'var(--ds-space-2) var(--ds-space-4)', background: `var(${token})`, color: 'var(--ds-action-primary-text)' }}>
                      {token.replace('--ds-action-primary', 'rest').replace('rest-', '')}
                    </span>
                  ))}
                </div>
              ),
              lang: 'css',
              code: `.my-primary {
  background: var(--ds-action-primary);
  color: var(--ds-action-primary-text);
}
.my-primary:hover   { background: var(--ds-action-primary-hover); }
/* Pressed is darker than hover, so the user feels the press. */
.my-primary:active  { background: var(--ds-action-primary-pressed); }`,
            },
            {
              title: 'Hover, pressed and selected layers',
              when: 'A list row, a menu item or a tab that reacts to the pointer and can be selected.',
              explain: [
                '`--ds-state-hover-layer` and `--ds-state-pressed-layer` are light tints. Set them as the background on `:hover` and `:active`.',
                '`--ds-state-selected` marks the chosen item. Pair it with a second cue such as a check icon or `aria-selected`, because tints alone are subtle (WCAG 1.4.1, A).',
                'They are solid colours, not see-through overlays. A token cannot hold a transparent colour, so text on top keeps its contrast.',
              ],
              render: (
                <div style={{ display: 'grid', gap: 'var(--ds-space-1)' }}>
                  <div style={{ ...card, background: 'var(--ds-state-hover-layer)' }}>Hovered row</div>
                  <div style={{ ...card, background: 'var(--ds-state-pressed-layer)' }}>Pressed row</div>
                  <div style={{ ...card, background: 'var(--ds-state-selected)' }}>Selected row</div>
                </div>
              ),
              lang: 'css',
              code: `.row:hover  { background: var(--ds-state-hover-layer); }
.row:active { background: var(--ds-state-pressed-layer); }
/* aria-selected is the real signal for assistive technology. The colour is for the eyes. */
.row[aria-selected='true'] { background: var(--ds-state-selected); }`,
            },
            {
              title: 'Disabled',
              when: 'A control that cannot be used right now.',
              explain: [
                '`--ds-disabled-text`, `--ds-disabled-surface` and `--ds-disabled-border` are deliberately faint. WCAG exempts inactive controls from contrast rules (WCAG 1.4.3 and 1.4.11).',
                'A faint control is a cue, not an explanation. Say why it is disabled in nearby text.',
              ],
              render: (
                <span style={{ display: 'inline-block', padding: 'var(--ds-space-2) var(--ds-space-4)', color: 'var(--ds-disabled-text)', background: 'var(--ds-disabled-surface)', border: 'var(--ds-size-border-thin) solid var(--ds-disabled-border)' }}>
                  Submit
                </span>
              ),
              lang: 'css',
              code: `.control:disabled {
  color: var(--ds-disabled-text);
  background: var(--ds-disabled-surface);
  border-color: var(--ds-disabled-border);
}`,
            },
            {
              title: 'Form fields',
              when: 'You style a text input yourself.',
              explain: [
                '`--ds-field-surface` is the fill, `--ds-field-border` the outline (3:1) and `--ds-field-text` the typed text. `--ds-field-placeholder` is the hint, and it still reaches 4.5:1.',
                '`--ds-field-border-focus` and `--ds-field-border-invalid` change the outline for focus and for an error. An error also needs a text message (WCAG 3.3.1, A).',
                '`TextField` and the other field components already use these roles.',
              ],
              render: (
                <div style={{ display: 'grid', gap: 'var(--ds-space-2)' }}>
                  <div style={{ padding: 'var(--ds-space-2)', background: 'var(--ds-field-surface)', color: 'var(--ds-field-text)', border: 'var(--ds-size-border-thin) solid var(--ds-field-border)' }}>jane@example.com</div>
                  <div style={{ padding: 'var(--ds-space-2)', background: 'var(--ds-field-surface)', color: 'var(--ds-field-placeholder)', border: 'var(--ds-size-border-thin) solid var(--ds-field-border-invalid)' }}>Email address</div>
                </div>
              ),
              lang: 'css',
              code: `input {
  background: var(--ds-field-surface);
  color: var(--ds-field-text);
  border: var(--ds-size-border-thin) solid var(--ds-field-border);
}
input::placeholder         { color: var(--ds-field-placeholder); }
input:hover                { border-color: var(--ds-field-border-hover); }
input:focus-visible        { border-color: var(--ds-field-border-focus); }
/* Add a visible error message too. The red border alone is not enough. */
input[aria-invalid='true'] { border-color: var(--ds-field-border-invalid); }`,
            },
          ],
        },
        {
          title: 'Status colours',
          kicker: 'Error, success, warning and info. Each status has four roles, and each has one job.',
          examples: [
            {
              title: 'Status with the Banner component',
              when: 'You show a message about success, a warning or an error.',
              explain: [
                '`Banner` picks the status roles for you. `status` sets the icon, the word read to screen readers and the colours.',
                'The icon shape and the title carry the meaning too. Colour alone fails colour-blind readers (WCAG 1.4.1, A).',
              ],
              render: (
                <Stack gap={3}>
                  <Banner status="success" title="Saved">Your changes are live.</Banner>
                  <Banner status="error" title="Payment declined">Check the card number and try again.</Banner>
                </Stack>
              ),
              code: `<Stack gap={3}>
  {/* status: 'info' | 'success' | 'warning' | 'error'. The title says it in words. */}
  <Banner status="success" title="Saved">Your changes are live.</Banner>
  <Banner status="error" title="Payment declined">
    Check the card number and try again.
  </Banner>
</Stack>`,
            },
            {
              title: 'Which status role for which job',
              when: 'You build a custom message and must choose among four roles.',
              explain: [
                '`status-error-surface` is the soft background of the message. `status-error-border` outlines it.',
                '`status-error-text` colours words. It is darker than `status-error` so it reaches 4.5:1 on the surface.',
                '`status-error` (no suffix) is the strong colour for an icon or a fill. It reaches 3:1. Do not use it for small text.',
                'Swap `error` for `success`, `warning` or `info`. The four statuses have the same four roles.',
              ],
              render: (
                <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center', padding: 'var(--ds-space-3)', background: 'var(--ds-status-error-surface)', border: 'var(--ds-size-border-thin) solid var(--ds-status-error-border)', color: 'var(--ds-status-error-text)' }}>
                  <span style={{ color: 'var(--ds-status-error)', display: 'inline-flex' }}><Icon glyph="error" /></span>
                  <span>Error: enter a valid date.</span>
                </div>
              ),
              lang: 'css',
              code: `.error-message {
  display: flex;
  gap: var(--ds-space-2);
  padding: var(--ds-space-3);
  background: var(--ds-status-error-surface);
  border: var(--ds-size-border-thin) solid var(--ds-status-error-border);
  /* The words use the text role: it reaches 4.5:1 on the surface above. */
  color: var(--ds-status-error-text);
}
.error-message .icon {
  /* The icon uses the strong colour: icons need 3:1. */
  color: var(--ds-status-error);
}`,
            },
            {
              title: 'Never colour alone',
              when: 'A status appears in a small place, such as next to a field.',
              explain: [
                'The icon (a cross in a circle) and the word "Error" tell the status without colour. Colour only adds emphasis (WCAG 1.4.1, A).',
                '`Icon` is decorative here (no `label`). The visible word already names the status, so a screen reader hears it once.',
              ],
              render: (
                <Box display="flex" gap={2} style={{ alignItems: 'center', color: 'var(--ds-status-error-text)' }}>
                  <Icon glyph="error" />
                  <Text as="span" style={{ color: 'inherit' }}>Error: the date is in the past.</Text>
                </Box>
              ),
              code: `<Box display="flex" gap={2} className="field-error">
  {/* No label: the words next to the icon already say it. */}
  <Icon glyph="error" />
  <Text as="span">Error: the date is in the past.</Text>
</Box>

/* In your stylesheet: */
.field-error { align-items: center; color: var(--ds-status-error-text); }
.field-error .ds-text { color: inherit; }`,
            },
          ],
        },
        {
          title: 'Themes: light and dark',
          kicker: 'A theme is a full set of role values. Your CSS does not change; the values behind the variable names do.',
          examples: [
            {
              title: 'Switch the whole app',
              when: 'The user picks dark mode, or you follow the system setting.',
              explain: [
                'Put `data-theme="dark"` on the `<html>` element. Every role changes at once. Light is the default, so you add nothing for light.',
                'The `matchMedia` line reads the operating system setting. Users who chose dark mode in their system get it without searching for a switch.',
                'Save the user choice (for example in `localStorage`) and read it before the first paint to avoid a flash of the wrong theme.',
              ],
              lang: 'ts',
              code: `import '@bauhaus/design-system/tokens.css';

// Follow the system setting on load.
const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.dataset.theme = dark ? 'dark' : 'light';

// Later, when the user picks a theme by hand:
function setTheme(theme) {
  document.documentElement.dataset.theme = theme; // 'light' or 'dark'
  localStorage.setItem('theme', theme);
}`,
            },
            {
              title: 'One panel in the other theme',
              when: 'A single region must look dark inside a light page, such as a code panel.',
              explain: [
                '`data-theme` on any element re-points the roles inside that element only. The rest of the page stays as is.',
                'The element does not paint its own background. Set `background` and `color` with roles on the same element, as below.',
              ],
              render: (
                <div data-theme="dark" style={{ ...card, background: 'var(--ds-surface-default)', color: 'var(--ds-text-default)' }}>
                  This panel is dark. The page around it is not.
                </div>
              ),
              code: `<section data-theme="dark" className="dark-panel">
  This panel is dark. The page around it is not.
</section>

/* The roles now hold the dark values, but you still paint them: */
.dark-panel {
  background: var(--ds-surface-default);
  color: var(--ds-text-default);
}`,
            },
            {
              title: 'Same code, both themes',
              when: 'You check that your styles hold in both themes.',
              explain: [
                'Both panels use the same CSS. Only the nearest `data-theme` differs. If one panel looks wrong, a hex value or a palette variable is hiding in your CSS.',
                'Dark roles are not an inverted copy of the light roles. Each theme picks its own grades so contrast holds in both (project decision).',
              ],
              render: (
                <div style={{ display: 'grid', gap: 'var(--ds-space-2)' }}>
                  {(['light', 'dark'] as const).map((theme) => (
                    <div key={theme} data-theme={theme} style={card}>
                      <div>Theme: {theme}</div>
                      <div style={{ color: 'var(--ds-text-muted)' }}>Same CSS, other values.</div>
                      <span style={{ display: 'inline-block', marginBlockStart: 'var(--ds-space-2)', padding: 'var(--ds-space-1) var(--ds-space-3)', background: 'var(--ds-action-primary)', color: 'var(--ds-action-primary-text)' }}>Action</span>
                    </div>
                  ))}
                </div>
              ),
              lang: 'css',
              code: `.panel   { background: var(--ds-surface-default); color: var(--ds-text-default); }
.panel p { color: var(--ds-text-muted); }
.panel .cta {
  background: var(--ds-action-primary);
  color: var(--ds-action-primary-text);
}
/* No dark-mode overrides. data-theme="dark" changes the values behind these names. */`,
            },
          ],
        },
        {
          title: 'Scales, series and the rebrand point',
          kicker: 'The layers under the roles. Read them only for the cases below.',
          examples: [
            {
              title: 'Primitive props take roles',
              when: 'You use the primitives instead of writing CSS.',
              explain: [
                '`Box surface` takes `default`, `raised` or `sunken`. These are the surface roles, so the dark theme works with no extra code.',
                '`Text tone="muted"` is the `text.muted` role. There is no prop for a raw colour on purpose.',
              ],
              render: (
                <Stack gap={2}>
                  <Box surface="sunken" padding={4}>
                    <Text>Sunken surface</Text>
                    <Text tone="muted" variant="caption">Muted caption</Text>
                  </Box>
                </Stack>
              ),
              code: `<Box surface="sunken" padding={4}>
  {/* tone is the text.default / text.muted role. */}
  <Text>Sunken surface</Text>
  <Text tone="muted" variant="caption">Muted caption</Text>
</Box>`,
            },
            {
              title: 'The primary scale, for illustration only',
              when: 'A chart or an illustration needs a ramp of one hue. This is the one reason to read a scale.',
              explain: [
                '`--ds-colors-primary-100` to `-900` run from light to dark. `primary-100` is the lightest blue; `primary-900` is the darkest.',
                'These values do not change per theme. The dark theme will not fix a chart that reads them, so check contrast in both themes yourself.',
                'Never read `--ds-palette-*`. A scale stays valid after a rebrand; a palette name such as `dark-blue` does not.',
              ],
              render: (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => (
                    <span key={n}>{swatch(`--ds-colors-primary-${n}`)}</span>
                  ))}
                </div>
              ),
              lang: 'css',
              code: `.heat-low  { background: var(--ds-colors-primary-200); }
.heat-mid  { background: var(--ds-colors-primary-500); }
.heat-high { background: var(--ds-colors-primary-800); }
/* A ramp also needs a second cue: a label or a number on each cell. */`,
            },
            {
              title: 'Series colours for charts',
              when: 'Several categories need different colours, such as the lines of a chart.',
              explain: [
                'Series number n is `oklch(lightness chroma hue)`, where the hue moves by `--ds-series-step` (the golden angle, 137.508 degrees) each time. The colours stay far apart for any count.',
                '`--ds-series-lightness` changes per theme (0.55 light, 0.72 dark), so every series holds 3:1 against the page in both.',
                'Still add a label or a pattern to each series. Colour alone does not separate them for everyone (WCAG 1.4.1, A).',
              ],
              render: (
                <div style={{ display: 'flex', gap: 'var(--ds-space-2)' }}>
                  {[0, 1, 2, 3, 4].map((n) => (
                    <span key={n} style={{ inlineSize: 'var(--ds-space-8)', blockSize: 'var(--ds-space-8)', background: `oklch(var(--ds-series-lightness) var(--ds-series-chroma) calc(var(--ds-series-hue) + ${n} * var(--ds-series-step)))` }} />
                  ))}
                </div>
              ),
              lang: 'css',
              code: `/* n is the series number: 0, 1, 2 ... */
.series-0 {
  background: oklch(
    var(--ds-series-lightness)
    var(--ds-series-chroma)
    calc(var(--ds-series-hue) + 0 * var(--ds-series-step))
  );
}
.series-1 {
  background: oklch(
    var(--ds-series-lightness)
    var(--ds-series-chroma)
    calc(var(--ds-series-hue) + 1 * var(--ds-series-step))
  );
}`,
            },
            {
              title: 'Rebrand in one file',
              when: 'The brand colour changes. This is the only edit.',
              explain: [
                '`colors.tokens.json` says which palette hue plays each part. To make `primary` teal, point its nine grades at `teal`.',
                'Roles alias these scales, and components read roles. So one file changes the whole system, in both themes.',
                'After the edit, rebuild the tokens and check the contrast matrix. A new hue can need other grades to keep 4.5:1.',
              ],
              lang: 'json',
              code: `{
  "colors": {
    "primary": {
      "600": { "$value": "{palette.teal.600}" },
      "700": { "$value": "{palette.teal.700}" }
    }
  }
}`,
            },
          ],
        },
        {
          title: 'Contrast and conditions',
          kicker: 'Rules that hold whatever colours you pick.',
          examples: [
            {
              title: 'Pick a text role for its surface',
              when: 'You put text on a coloured area.',
              explain: [
                'Each surface has a matching text role: `surface-default` takes `text-default`, `status-*-surface` takes `status-*-text`, `action-primary` takes `action-primary-text`.',
                '`pairs.json` lists every pair that the library promises to keep readable. The Color Showcase measures them in both themes.',
                'A pair outside the list has no promise. Measure it with a contrast checker before you ship it (WCAG 1.4.3, AA).',
              ],
              render: (
                <div style={{ display: 'grid', gap: 'var(--ds-space-2)' }}>
                  <div style={{ ...card, background: 'var(--ds-status-warning-surface)', color: 'var(--ds-status-warning-text)' }}>Warning text on the warning surface</div>
                  <div style={{ ...card, background: 'var(--ds-status-info-surface)', color: 'var(--ds-status-info-text)' }}>Info text on the info surface</div>
                </div>
              ),
              lang: 'css',
              code: `.note-warning {
  background: var(--ds-status-warning-surface);
  /* The -text role is the one tested against its -surface. */
  color: var(--ds-status-warning-text);
}
.note-info {
  background: var(--ds-status-info-surface);
  color: var(--ds-status-info-text);
}`,
            },
            {
              title: 'Forced colors',
              when: 'Windows High Contrast and similar modes replace your colours with the user palette.',
              explain: [
                'In `forced-colors: active` the browser overrides most colours. A button made only of a background fill can lose its edge.',
                'Add a transparent border. The mode repaints it in a visible system colour, so the edge stays (WCAG 1.4.11, AA).',
                'Use system keywords such as `CanvasText` for anything you must paint by hand.',
              ],
              lang: 'css',
              code: `.chip {
  background: var(--ds-state-selected);
  /* Invisible normally. Forced colors repaints it, so the chip keeps an edge. */
  border: var(--ds-size-border-thin) solid transparent;
}

@media (forced-colors: active) {
  .chip {
    /* Paint by hand only when the default is not enough. */
    border-color: CanvasText;
  }
}`,
            },
          ],
        },
      ]}
    />
  ),
};
