import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Tooltip } from '../../overlays/tooltip/tooltip';
import { Button } from '../button/button';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Icon } from '../../../primitives/icon/icon';
import type { IconGlyph } from '../../../primitives/icon/icon';
import { IconButton } from './icon-button';
import { iconButtonRules } from './icon-button.rules';

const ICONS = ['close', 'search', 'menu', 'settings'] as const satisfies readonly IconGlyph[];
const VARIANTS = ['tertiary', 'secondary', 'primary', 'subtle'] as const;

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Clickables/Icon button', component: IconButton, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof IconButton>;

export default meta;

const close = (props: Partial<ComponentProps<typeof IconButton>> = {}) => <IconButton label="Close dialog" icon={<Icon glyph="close" />} {...props} />;
const sameAsButton = 'Same reason as the button.';

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Icon button"
      layer="Component"
      family="Clickables"
      plain="An icon button is a button drawn as a small picture, such as a cross to close. Because there is no text, you must give it a name that a screen reader can say."
      precise="Component in the clickables family · a button whose only visible content is an icon · built on the button."
      usedFor="Close, search and menu controls; dense toolbars where a text label does not fit."
      tokens={{
        mode: 'consumed',
        note: 'It consumes the tokens of the button and adds none. The button stylesheet supplies the rest.',
        rows: [
          { name: 'size.control.md', tier: '2', use: 'Width of the square (32px; the height comes from the button). The target is at least size.target.min (24px)' },
          { name: 'text.link', tier: 'role', use: 'Icon colour in the default tertiary variant, through currentColor', swatch: '--ds-text-link' },
        ],
      }}
      stage={{
        render: (args) =>
          close({
            label: String(args.label),
            icon: <Icon glyph={args.icon as IconGlyph} />,
            variant: args.variant as ComponentProps<typeof IconButton>['variant'],
            loading: args.loading === true,
            disabled: args.disabled === true,
          }),
        parts: [
          { n: 1, label: 'Button container', note: 'required', target: '.ds-icon-button', at: 'top-start' },
          { n: 2, label: 'Icon', note: 'required, hidden from assistive technology', target: '.ds-icon-button__icon' },
          { n: 3, label: 'Label', note: 'required; becomes aria-label, never shown', target: '.ds-icon-button', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Width', property: 'width', target: '.ds-icon-button', token: 'size.control.md', value: '32px square, even when the icon is smaller' },
        { label: 'Height', property: 'height', target: '.ds-icon-button', token: 'size.control.md', value: '32px, from the button' },
        { label: 'Padding', property: 'padding-inline', target: '.ds-icon-button', value: '0; the icon is centred in the square' },
        { label: 'Icon colour', value: 'currentColor, so it follows the text tokens and both themes' },
        { label: 'Default variant', value: 'tertiary' },
      ]}
      api={[
        { label: 'label', value: 'Required. The accessible name, in the imperative: "Close dialog".', control: { kind: 'text', value: 'Close dialog' } },
        { label: 'icon', value: 'Required. The icon element, already sized. Hidden from assistive technology.', control: { kind: 'select', options: ICONS, value: 'close' } },
        { label: 'variant', value: 'A button prop. Tertiary by default.', control: { kind: 'select', options: VARIANTS, value: 'tertiary' } },
        { label: 'loading', value: 'A button prop. Shows the spinner and keeps the name.', control: { kind: 'boolean', value: false } },
        { label: 'disabled', value: 'A button prop.', control: { kind: 'boolean', value: false } },
        { label: '…props', value: 'The other button props, such as onClick.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: sameAsButton },
          { id: 'loading', status: 'designed', render: close({ loading: true }), trigger: 'loading' },
          { id: 'none', status: 'n/a', reason: sameAsButton },
          { id: 'one', status: 'n/a', reason: sameAsButton },
          { id: 'some', status: 'n/a', reason: sameAsButton },
          { id: 'too-many', status: 'n/a', reason: 'There is no label text to overflow.' },
          { id: 'incorrect', status: 'n/a', reason: sameAsButton },
          { id: 'correct', status: 'n/a', reason: sameAsButton },
          { id: 'done', status: 'n/a', reason: sameAsButton },
          {
            id: 'default',
            status: 'designed',
            render: (
              <div style={{ display: 'flex', gap: 'var(--ds-space-3)' }}>
                {close()}
                {close({ variant: 'secondary' })}
              </div>
            ),
            trigger: 'variant',
            note: 'Tertiary, then secondary.',
          },
          { id: 'hover', status: 'designed', render: close({ className: 'doc-force-hover' }), trigger: ':hover', note: 'Forced by .doc-force-hover. The button rules apply.' },
          { id: 'focus-visible', status: 'designed', render: close({ className: 'doc-force-focus' }), trigger: ':focus-visible', note: 'Forced by .doc-force-focus.' },
          { id: 'active', status: 'designed', render: close({ className: 'doc-force-active' }), trigger: ':active', note: 'Forced by .doc-force-active. The button rules apply.' },
          { id: 'disabled', status: 'designed', render: close({ disabled: true }), trigger: 'disabled' },
          { id: 'selected', status: 'n/a', reason: 'Not a toggle. Use a switch.' },
        ],
      }}
      dos={[
        { text: 'Name the action in the imperative: "Close dialog", not "X".', basis: 'WCAG 1.1.1 (A); 4.1.2 (A)' },
        { text: 'Keep the square at size.control.md (32px) even when the icon is smaller.', basis: 'WCAG 2.5.8 (AA); 24px house floor' },
        { text: 'Give the icon currentColor so both themes work.', basis: 'WCAG 1.4.11 (AA)' },
      ]}
      donts={[
        { text: 'Rely on title alone for the name.', basis: 'WCAG 4.1.2 (A)', rule: 'icon-button.accessible-name' },
        { text: 'Leave the icon visible to screen readers.', basis: 'APG: decorative graphics carry no role', rule: 'icon-button.icon-hidden' },
        { text: 'Ship a 24px icon with no padding.', basis: 'WCAG 2.5.8 (AA); 24px house floor', rule: 'icon-button.touch-target' },
        { text: 'Draw a custom symbol for a common action.', basis: 'Nielsen 6', rule: 'icon-button.known-icon' },
      ]}
      guide="clickables-icon-button--docs"
      guideName="Icon button"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Icon button" layer="Component" family="Clickables" rules={iconButtonRules} guide="clickables-icon-button--docs" guideName="Icon button" />,
};

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Icon button"
      layer="Component"
      family="Clickables"
      imports="import { Button, Icon, IconButton, Stack, Text, Tooltip } from '@acme/design-system';"
      guide="clickables-icon-button--docs"
      guideName="Icon button"
      groups={[
        {
          title: 'Variants',
          kicker: 'The icon button is a button, so it takes the button variants. Tertiary is the default.',
          examples: [
            { title: 'Tertiary', when: 'The default. A common action with a known symbol, such as closing a dialog.', render: <IconButton label="Close dialog" icon={<Icon glyph="close" />} /> },
            { title: 'Secondary', when: 'An icon action that needs an outline to read as pressable.', render: <IconButton variant="secondary" label="Search the catalogue" icon={<Icon glyph="search" />} /> },
            { title: 'Primary', when: 'The one main action of a region, when its symbol is universal.', render: <IconButton variant="primary" label="Add item" icon={<Icon glyph="plus" />} /> },
            { title: 'Subtle', when: 'Quiet chrome in a dense toolbar, where a fill would compete with the content.', render: <IconButton variant="subtle" label="Open settings" icon={<Icon glyph="settings" />} /> },
          ],
        },
        {
          title: 'Icons',
          kicker: 'The icon is any node, already sized by its own component. It follows currentColor.',
          examples: [
            { title: 'Small glyph', when: 'A dense toolbar. The target stays 32px even when the glyph is smaller.', render: <IconButton label="Open menu" icon={<Icon glyph="menu" size="sm" />} /> },
            { title: 'Default glyph', when: 'The usual size.', render: <IconButton label="Open menu" icon={<Icon glyph="menu" />} /> },
            { title: 'More actions', when: 'A row or card that holds a menu of further actions.', render: <IconButton label="More actions for Invoice 1042" icon={<Icon glyph="more" />} /> },
            { title: 'Mirrored in right-to-left', when: 'A direction glyph. It flips by itself when the page reads right to left.', render: <IconButton label="Previous page" icon={<Icon glyph="chevron-left" />} /> },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props, as on the button.',
          examples: [
            { title: 'Loading', when: 'The action is running. The icon stays, dimmed, and the button reports aria-busy.', render: <IconButton label="Refresh results" icon={<Icon glyph="refresh" />} loading /> },
            { title: 'Disabled', when: 'The action cannot run yet. Say why next to it.', render: (
              <Stack gap={2} align="start">
                <IconButton label="Delete file" icon={<Icon glyph="delete" />} disabled aria-describedby="icon-delete-why" />
                <Text variant="caption" tone="muted" as="p" id="icon-delete-why">Select a file to delete it.</Text>
              </Stack>
            ) },
            { title: 'Disabled, primary', when: 'A main icon action that has no input yet.', render: <IconButton variant="primary" label="Add item" icon={<Icon glyph="plus" />} disabled /> },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Give each button a name that says what it acts on.',
          examples: [
            { title: 'Dialog close', when: 'The corner button of a dialog or a panel.', render: (
              <Stack direction="horizontal" gap={3} align="center" justify="between">
                <Text as="h3">Edit address</Text>
                <IconButton label="Close dialog" icon={<Icon glyph="close" />} />
              </Stack>
            ) },
            { title: 'Toolbar', when: 'Several icon actions over content, all subtle so none claims to be the main one.', render: (
              <Stack direction="horizontal" gap={1} role="toolbar" aria-label="Document actions">
                <IconButton variant="subtle" label="Edit document" icon={<Icon glyph="edit" />} />
                <IconButton variant="subtle" label="Copy document" icon={<Icon glyph="copy" />} />
                <IconButton variant="subtle" label="Download document" icon={<Icon glyph="download" />} />
                <IconButton variant="subtle" label="Delete document" icon={<Icon glyph="delete" />} />
              </Stack>
            ) },
            { title: 'Beside a text button', when: 'A text action with an icon action for a secondary job.', render: (
              <Stack direction="horizontal" gap={3} align="center">
                <Button>Save changes</Button>
                <IconButton label="Copy link to this page" icon={<Icon glyph="link" />} />
              </Stack>
            ) },
            { title: 'Row actions', when: 'One icon button per table row. The name carries the row, so each is unique.', render: (
              <Stack as="ul" gap={2}>
                <li><Stack direction="horizontal" gap={3} align="center" justify="between"><Text as="span">Invoice 1042</Text><IconButton variant="subtle" label="Delete invoice 1042" icon={<Icon glyph="delete" />} /></Stack></li>
                <li><Stack direction="horizontal" gap={3} align="center" justify="between"><Text as="span">Invoice 1043</Text><IconButton variant="subtle" label="Delete invoice 1043" icon={<Icon glyph="delete" />} /></Stack></li>
              </Stack>
            ) },
          ],
        },
        {
          title: 'Content',
          kicker: 'The label never shows, so it never wraps or truncates. A narrow column changes nothing.',
          examples: [
            { title: 'Long label', when: 'A precise name for a screen reader. The square keeps its size.', frame: 'narrow', render: <IconButton label="Remove the shipping address from the saved addresses list" icon={<Icon glyph="close" />} /> },
            { title: 'Translated label', when: 'The app is not in English: pass the name in the app language.', render: <IconButton label="Fermer la boîte de dialogue" icon={<Icon glyph="close" />} /> },
          ],
        },
        {
          title: 'In a form',
          kicker: 'The type is button by default, so an icon button in a form does not submit unless asked.',
          examples: [
            { title: 'Submit', when: 'A search field whose button sends the query.', render: (
              <Stack as="form" direction="horizontal" gap={2} align="center" onSubmit={(event) => event.preventDefault()}>
                <input type="search" aria-label="Search the catalogue" />
                <IconButton type="submit" label="Search" icon={<Icon glyph="search" />} />
              </Stack>
            ), code: `<Stack as="form" direction="horizontal" gap={2} align="center" onSubmit={handleSubmit}>
  <input type="search" aria-label="Search the catalogue" />
  <IconButton type="submit" label="Search" icon={<Icon glyph="search" />} />
</Stack>` },
            { title: 'Reset', when: 'Clear the fields of a form.', render: (
              <Stack as="form" direction="horizontal" gap={2} align="center">
                <input type="search" aria-label="Search the catalogue" defaultValue="lamp" />
                <IconButton type="reset" label="Clear search" icon={<Icon glyph="close" />} />
              </Stack>
            ) },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label is the name. A Tooltip adds a visible hint and never replaces it.',
          examples: [
            { title: 'With a tooltip', when: 'Mouse users may not know the symbol. The tooltip repeats the name.', render: (
              <Tooltip content="Download report"><IconButton label="Download report" icon={<Icon glyph="download" />} /></Tooltip>
            ) },
            { title: 'Described by a hint', when: 'A consequence the user should hear after the name.', render: (
              <Stack gap={2} align="start">
                <IconButton label="Delete project" icon={<Icon glyph="delete" />} aria-describedby="icon-delete-hint" />
                <Text variant="caption" tone="muted" as="p" id="icon-delete-hint">This also deletes its files.</Text>
              </Stack>
            ) },
            { title: 'Controls a region', when: 'A button that opens or closes a panel. Wire it with aria-expanded and aria-controls.', render: (
              <IconButton label="Open filters" icon={<Icon glyph="filter" />} aria-expanded={false} aria-controls="icon-filters-panel" />
            ) },
          ],
        },
      ]}
    />
  ),
};
