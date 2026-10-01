import { useState } from 'react';
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

/** A button that opens and closes a panel, wired with aria-expanded and aria-controls. */
function FiltersToggle() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={2} align="start">
      <IconButton label={open ? 'Close filters' : 'Open filters'} icon={<Icon glyph="filter" />} aria-expanded={open} aria-controls="icon-filters-panel" onClick={() => setOpen(!open)} />
      <div id="icon-filters-panel" hidden={!open}>
        <Text as="p" variant="caption" tone="muted">Filters appear here.</Text>
      </div>
    </Stack>
  );
}

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Icon button"
      layer="Component"
      family="Clickables"
      imports="import { Button, Icon, IconButton, Stack, Text, Tooltip } from '@acme/design-system';"
      intro={[
        'An icon button is a button that shows only a small picture, such as an X to close. It is a `Button` underneath, so it takes the same props: `variant`, `loading`, `disabled`, `type`, `onClick`.',
        'The picture is not text, so a screen reader (software that reads the page aloud for blind users) has nothing to say. The required `label` prop is the fix: it becomes the accessible name, the text a screen reader says for the control.',
        'Glossary. A glyph is one named icon from the library: `<Icon glyph="close" />`. `currentColor` means the icon takes the text colour around it, so it works in light and dark themes.',
        'Glossary. A tooltip is a small box with text that appears on hover or focus. An ARIA attribute (`aria-*`) is an extra label that only assistive software reads.',
        'Name the action and its object: "Close dialog", not "X". Use an icon button only when the symbol is widely known. If it is not, use a `Button` with a text label.',
      ]}
      guide="clickables-icon-button--docs"
      guideName="Icon button"
      groups={[
        {
          title: 'Basics',
          kicker: 'Start here: a label, an icon, an action.',
          examples: [
            {
              title: 'The smallest icon button',
              when: 'A common action with a symbol everyone knows, such as closing a dialog.',
              explain: [
                '`label` is required. It is invisible, but a screen reader says it: "Close dialog, button". Without it, a blind user would hear only "button" (WCAG 4.1.2, level A; 1.1.1, A).',
                '`icon` takes any node, usually an `<Icon glyph="…" />`. The button hides the icon from screen readers, so the name is not read twice.',
                'The default variant is `tertiary`: no fill or outline, so the symbol stays light. The target is a 32px square, big enough for a finger (WCAG 2.5.8, AA).',
              ],
              render: <IconButton label="Close dialog" icon={<Icon glyph="close" />} />,
              code: `// label: what a screen reader says. Verb + object, never "X".
// icon: the picture. Icon glyphs follow the text colour (currentColor).
// "close" stands for your own function.
<IconButton label="Close dialog" icon={<Icon glyph="close" />} onClick={close} />`,
            },
          ],
        },
        {
          title: 'Variants',
          kicker: 'The icon button takes the button variants. The default is tertiary.',
          examples: [
            {
              title: 'Secondary',
              when: 'An icon action that needs an outline to read as pressable.',
              explain: ['The outline tells users "this is a control", when the symbol alone could read as decoration.'],
              render: <IconButton variant="secondary" label="Search the catalogue" icon={<Icon glyph="search" />} />,
              code: `<IconButton variant="secondary" label="Search the catalogue" icon={<Icon glyph="search" />} onClick={search} />`,
            },
            {
              title: 'Primary',
              when: 'The one main action of an area, when its symbol is universal, such as a plus to add.',
              explain: [
                'The solid fill ranks this action first. Use one primary per area, because two make users stop and compare (Nielsen heuristic 8, aesthetic and minimalist design).',
                'For a main action with a less common symbol, use a `Button` with text instead.',
              ],
              render: <IconButton variant="primary" label="Add item" icon={<Icon glyph="plus" />} />,
              code: `<IconButton variant="primary" label="Add item" icon={<Icon glyph="plus" />} onClick={addItem} />`,
            },
            {
              title: 'Subtle',
              when: 'Quiet chrome in a dense toolbar, where a fill would compete with the content.',
              explain: ['Neutral colour, no fill, no outline until hover or focus. The focus ring always shows, so keyboard users see where they are (WCAG 2.4.7, AA).'],
              render: <IconButton variant="subtle" label="Open settings" icon={<Icon glyph="settings" />} />,
              code: `<IconButton variant="subtle" label="Open settings" icon={<Icon glyph="settings" />} onClick={openSettings} />`,
            },
          ],
        },
        {
          title: 'Icons',
          kicker: 'The icon is any node, sized by its own component. It follows currentColor.',
          examples: [
            {
              title: 'Default glyph size',
              when: 'The usual size.',
              explain: ['Leave `size` out on the `Icon`. The default fits the 32px square.'],
              render: <IconButton label="Open menu" icon={<Icon glyph="menu" />} />,
              code: `<IconButton label="Open menu" icon={<Icon glyph="menu" />} onClick={openMenu} />`,
            },
            {
              title: 'Small glyph',
              when: 'A dense toolbar.',
              explain: [
                '`size="sm"` on the `Icon` makes only the picture smaller.',
                'The target stays 32px, so it is still easy to hit (WCAG 2.5.8, AA).',
              ],
              render: <IconButton label="Open menu" icon={<Icon glyph="menu" size="sm" />} />,
              code: `// Only the picture shrinks. The pressable square keeps its size.
<IconButton label="Open menu" icon={<Icon glyph="menu" size="sm" />} onClick={openMenu} />`,
            },
            {
              title: 'More actions',
              when: 'A row or card that holds a menu of further actions.',
              explain: [
                'Put the row in the label. A page with ten "More actions" buttons gives screen reader users no way to tell them apart.',
              ],
              render: <IconButton label="More actions for Invoice 1042" icon={<Icon glyph="more" />} />,
              code: `// "invoice" stands for the data of your own row.
<IconButton label={\`More actions for \${invoice.name}\`} icon={<Icon glyph="more" />} onClick={openRowMenu} />`,
            },
            {
              title: 'Mirrored in right-to-left',
              when: 'A direction glyph, such as a previous-page arrow.',
              explain: [
                'The `chevron-left` glyph flips by itself when the page reads right to left (Arabic, Hebrew). "Previous" then points to the right, where readers expect it.',
                'You write no extra code for the flip.',
              ],
              render: <IconButton label="Previous page" icon={<Icon glyph="chevron-left" />} />,
              code: `<IconButton label="Previous page" icon={<Icon glyph="chevron-left" />} onClick={goBack} />`,
            },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props, as on the button.',
          examples: [
            {
              title: 'Loading',
              when: 'The action is running.',
              explain: [
                'The spinner replaces the icon, and the size does not change.',
                'The button sets `aria-busy` (a label that says "working") for you. It ignores presses, so a double click cannot send the request twice.',
              ],
              render: <IconButton label="Refresh results" icon={<Icon glyph="refresh" />} loading />,
              code: `// "refreshing" is a boolean in your own state.
<IconButton label="Refresh results" icon={<Icon glyph="refresh" />} loading={refreshing} onClick={refresh} />`,
            },
            {
              title: 'Disabled, with the reason',
              when: 'The action cannot run yet.',
              explain: [
                '`disabled` removes the button from the tab order and blocks the press.',
                'Disabled controls may fail contrast rules (WCAG 1.4.3 exception). Write the reason in normal text.',
                '`aria-describedby` links the reason by `id`, so a screen reader reads it after the name.',
              ],
              render: (
                <Stack gap={2} align="start">
                  <IconButton label="Delete file" icon={<Icon glyph="delete" />} disabled aria-describedby="icon-delete-why" />
                  <Text variant="caption" tone="muted" as="p" id="icon-delete-why">Select a file to delete it.</Text>
                </Stack>
              ),
              code: `<Stack gap={2} align="start">
  {/* "selected" is your own value. No file chosen means the button is off. */}
  <IconButton label="Delete file" icon={<Icon glyph="delete" />} disabled={!selected} aria-describedby="icon-delete-why" onClick={deleteFile} />
  {/* The id must match aria-describedby above. */}
  <Text variant="caption" tone="muted" as="p" id="icon-delete-why">Select a file to delete it.</Text>
</Stack>`,
            },
            {
              title: 'Disabled primary',
              when: 'A main icon action that has no input yet.',
              explain: ['The disabled look replaces the fill. Users still see that an action exists.'],
              render: <IconButton variant="primary" label="Add item" icon={<Icon glyph="plus" />} disabled />,
              code: `<IconButton variant="primary" label="Add item" icon={<Icon glyph="plus" />} disabled={!canAdd} onClick={addItem} />`,
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Give each button a name that says what it acts on.',
          examples: [
            {
              title: 'Dialog close',
              when: 'The corner button of a dialog or a panel.',
              explain: [
                '`justify="between"` pushes the title to one end and the button to the other.',
                '`align="center"` lines up their middles, so the button does not sit lower than the title.',
              ],
              render: (
                <Stack direction="horizontal" gap={3} align="center" justify="between">
                  <Text as="h3">Edit address</Text>
                  <IconButton label="Close dialog" icon={<Icon glyph="close" />} />
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={3} align="center" justify="between">
  <Text as="h3">Edit address</Text>
  <IconButton label="Close dialog" icon={<Icon glyph="close" />} onClick={close} />
</Stack>`,
            },
            {
              title: 'Toolbar',
              when: 'Several icon actions over content, all subtle so none claims to be the main one.',
              explain: [
                '`role="group"` says "these controls belong together". `aria-label` names it. It is not `role="toolbar"`: the APG Toolbar pattern requires arrow-key focus between buttons, and this group has none.',
                'Each label names the action and its object. Screen reader users can list the buttons and tell them apart.',
              ],
              render: (
                <Stack direction="horizontal" gap={1} role="group" aria-label="Document actions">
                  <IconButton variant="subtle" label="Edit document" icon={<Icon glyph="edit" />} />
                  <IconButton variant="subtle" label="Copy document" icon={<Icon glyph="copy" />} />
                  <IconButton variant="subtle" label="Download document" icon={<Icon glyph="download" />} />
                  <IconButton variant="subtle" label="Delete document" icon={<Icon glyph="delete" />} />
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={1} role="group" aria-label="Document actions">
  <IconButton variant="subtle" label="Edit document" icon={<Icon glyph="edit" />} onClick={edit} />
  <IconButton variant="subtle" label="Copy document" icon={<Icon glyph="copy" />} onClick={copy} />
  <IconButton variant="subtle" label="Download document" icon={<Icon glyph="download" />} onClick={download} />
  <IconButton variant="subtle" label="Delete document" icon={<Icon glyph="delete" />} onClick={remove} />
</Stack>`,
            },
            {
              title: 'Beside a text button',
              when: 'A text action with an icon action for a secondary job.',
              explain: [
                'The text button leads. The icon button handles a small extra job, here copying a link.',
                '`align="center"` keeps the two on one line, even though their heights differ.',
              ],
              render: (
                <Stack direction="horizontal" gap={3} align="center">
                  <Button>Save changes</Button>
                  <IconButton label="Copy link to this page" icon={<Icon glyph="link" />} />
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={3} align="center">
  <Button onClick={save}>Save changes</Button>
  <IconButton label="Copy link to this page" icon={<Icon glyph="link" />} onClick={copyLink} />
</Stack>`,
            },
            {
              title: 'Row actions',
              when: 'One icon button per table row or list item.',
              explain: [
                'The name carries the row: "Delete invoice 1042". With a plain "Delete" on every row, screen reader users could not tell which invoice each one deletes (WCAG 2.4.6, AA).',
                'The rows are an `ul` list, so a screen reader announces how many rows there are.',
              ],
              render: (
                <Stack as="ul" gap={2}>
                  <li><Stack direction="horizontal" gap={3} align="center" justify="between"><Text as="span">Invoice 1042</Text><IconButton variant="subtle" label="Delete invoice 1042" icon={<Icon glyph="delete" />} /></Stack></li>
                  <li><Stack direction="horizontal" gap={3} align="center" justify="between"><Text as="span">Invoice 1043</Text><IconButton variant="subtle" label="Delete invoice 1043" icon={<Icon glyph="delete" />} /></Stack></li>
                </Stack>
              ),
              code: `// "invoices" and "remove" stand for your own data and function.
<Stack as="ul" gap={2}>
  {invoices.map((invoice) => (
    <li key={invoice.id}>
      <Stack direction="horizontal" gap={3} align="center" justify="between">
        <Text as="span">{invoice.name}</Text>
        {/* The name carries the row, so every button is unique. */}
        <IconButton
          variant="subtle"
          label={\`Delete \${invoice.name}\`}
          icon={<Icon glyph="delete" />}
          onClick={() => remove(invoice.id)}
        />
      </Stack>
    </li>
  ))}
</Stack>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The label never shows, so it never wraps or cuts off. A narrow column changes nothing.',
          examples: [
            {
              title: 'Long label',
              when: 'A precise name for a screen reader.',
              explain: [
                'The square keeps its size, whatever the length of the label.',
                'Long names are fine, but keep them short enough to say aloud. Put the action first, then the object.',
              ],
              frame: 'narrow',
              render: <IconButton label="Remove the shipping address from the saved addresses list" icon={<Icon glyph="close" />} />,
              code: `<IconButton
  label="Remove the shipping address from the saved addresses list"
  icon={<Icon glyph="close" />}
  onClick={removeAddress}
/>`,
            },
            {
              title: 'Translated label',
              when: 'The app is not in English.',
              explain: [
                'The library does not translate for you. Pass the name in the page language,, so the screen reader voice matches.',
              ],
              render: <IconButton label="Fermer la boîte de dialogue" icon={<Icon glyph="close" />} />,
              code: `// "t" stands for your own translation function.
<IconButton label={t('dialog.close')} icon={<Icon glyph="close" />} onClick={close} />`,
            },
          ],
        },
        {
          title: 'In a form',
          kicker: 'The type is "button" by default, so an icon button in a form does not send it unless you ask.',
          examples: [
            {
              title: 'Submit',
              when: 'A search field whose button sends the query.',
              explain: [
                '`type="submit"` sends the form. Pressing Enter in the field does the same.',
                'The input has its own `aria-label`, because the icon button names only itself.',
                'Handle the query in the form\'s `onSubmit`, so Enter and the button take the same path.',
              ],
              render: (
                <Stack as="form" direction="horizontal" gap={2} align="center" onSubmit={(event) => event.preventDefault()}>
                  <input type="search" aria-label="Search the catalogue" />
                  <IconButton type="submit" label="Search" icon={<Icon glyph="search" />} />
                </Stack>
              ),
              code: `// "handleSubmit" is your own function.
<Stack as="form" direction="horizontal" gap={2} align="center" onSubmit={handleSubmit}>
  <input type="search" aria-label="Search the catalogue" />
  <IconButton type="submit" label="Search" icon={<Icon glyph="search" />} />
</Stack>`,
            },
            {
              title: 'Reset',
              when: 'Clear the fields of a form.',
              explain: [
                '`type="reset"` puts every field back to its first value.',
                'Name it for what the user sees: "Clear search", not "Reset form".',
              ],
              render: (
                <Stack as="form" direction="horizontal" gap={2} align="center">
                  <input type="search" aria-label="Search the catalogue" defaultValue="lamp" />
                  <IconButton type="reset" label="Clear search" icon={<Icon glyph="close" />} />
                </Stack>
              ),
              code: `<Stack as="form" direction="horizontal" gap={2} align="center">
  <input type="search" aria-label="Search the catalogue" defaultValue="lamp" />
  <IconButton type="reset" label="Clear search" icon={<Icon glyph="close" />} />
</Stack>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label is the name. A Tooltip adds a visible hint and never replaces the label.',
          examples: [
            {
              title: 'With a tooltip',
              when: 'Mouse users may not know the symbol.',
              explain: [
                'Wrap the button in `Tooltip`. It shows the same text on hover and on keyboard focus, so sighted users learn the symbol (WCAG 1.4.13, AA).',
                'Keep `label` too. The tooltip is a visual hint; the label is the name.',
              ],
              render: <Tooltip content="Download report"><IconButton label="Download report" icon={<Icon glyph="download" />} /></Tooltip>,
              code: `// Same words in both places: the tooltip for the eyes, the label for assistive software.
<Tooltip content="Download report">
  <IconButton label="Download report" icon={<Icon glyph="download" />} onClick={download} />
</Tooltip>`,
            },
            {
              title: 'Described by a hint',
              when: 'A consequence the user should hear after the name.',
              explain: [
                '`aria-describedby` points at the hint by `id`. A screen reader reads the name first, then the hint.',
                'Use it for results that are hard to undo, such as "This also deletes its files."',
              ],
              render: (
                <Stack gap={2} align="start">
                  <IconButton label="Delete project" icon={<Icon glyph="delete" />} aria-describedby="icon-delete-hint" />
                  <Text variant="caption" tone="muted" as="p" id="icon-delete-hint">This also deletes its files.</Text>
                </Stack>
              ),
              code: `<Stack gap={2} align="start">
  <IconButton label="Delete project" icon={<Icon glyph="delete" />} aria-describedby="icon-delete-hint" onClick={deleteProject} />
  <Text variant="caption" tone="muted" as="p" id="icon-delete-hint">This also deletes its files.</Text>
</Stack>`,
            },
            {
              title: 'Controls a region',
              when: 'A button that opens or closes a panel next to it.',
              explain: [
                '`aria-expanded` tells a screen reader if the panel is open. `aria-controls` names the panel by `id` (APG Disclosure pattern).',
                'The label changes with the state ("Open filters", "Close filters"), so the name always says what the next press does.',
              ],
              render: <FiltersToggle />,
              code: `function FiltersToggle() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={2} align="start">
      <IconButton
        // The name says what the next press does.
        label={open ? 'Close filters' : 'Open filters'}
        icon={<Icon glyph="filter" />}
        // true while the panel is visible
        aria-expanded={open}
        // the id of the panel below
        aria-controls="icon-filters-panel"
        onClick={() => setOpen(!open)}
      />
      <div id="icon-filters-panel" hidden={!open}>{/* your filters */}</div>
    </Stack>
  );
}`,
            },
          ],
        },
      ]}
    />
  ),
};
