import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { DocPage } from '../../../.storybook/doc-page/doc-page';
import { Combobox } from './combobox';
import { comboboxRules } from './combobox.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Fields/Combobox', component: Combobox, parameters: { layout: 'fullscreen' }, args: { label: 'Label', options: [] } } satisfies Meta<typeof Combobox>;

export default meta;

const cell = (node: ReactNode) => <div style={{ inlineSize: '100%', maxInlineSize: 'calc(var(--ds-space-12) * 6)' }}>{node}</div>;
const COUNTRIES = [
  { id: 'ca', label: 'Canada' },
  { id: 'cl', label: 'Chile' },
  { id: 'fr', label: 'France' },
  { id: 'de', label: 'Germany' },
  { id: 'it', label: 'Italy', disabled: true },
];
const MANY = Array.from({ length: 60 }, (_, n) => ({ id: `o${n}`, label: `Option ${n + 1}` }));

/** A cell with room under the input for the open list. */
const OpenCell = ({ children }: { children: ReactNode }) => (
  <div style={{ inlineSize: '100%', maxInlineSize: 'calc(var(--ds-space-12) * 6)', minBlockSize: 'calc(var(--ds-space-12) * 5)' }}>{children}</div>
);

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Combobox"
      layer="Component"
      family="Fields"
      plain="A combobox is a text box with a list of suggestions. You type a few letters, the list narrows, and you pick one. Use it when the list is too long to scroll."
      precise="Component in the fields family · picks one option from a long or searchable list · React Aria ComboBox styled with tokens · focus stays in the input while the list is open · not for a short list (select) or for free text (text field)."
      usedFor="Country, city, user, product, tag: a list with dozens or thousands of options."
      tokens={{
        mode: 'consumed',
        note: 'The combobox has no component tokens. The input shares the box, label, description and error of the fields family.',
        rows: [
          { name: 'field.surface · field.text · field.border · border-hover · border-focus · border-invalid', tier: 'role', use: 'The input, as the text field', swatch: '--ds-field-border' },
          { name: 'overlay.surface · overlay.border', tier: 'role', use: 'Fill and edge of the popup list', swatch: '--ds-overlay-surface' },
          { name: 'state.hover-layer · state.pressed-layer · state.selected', tier: 'role', use: 'Active, pressed and selected option; hover and press on the toggle button', swatch: '--ds-state-selected' },
          { name: 'text.default · text.muted', tier: 'role', use: 'Option text; the empty-state text', swatch: '--ds-text-muted' },
          { name: 'disabled.text', tier: 'role', use: 'Disabled option and disabled toggle', swatch: '--ds-disabled-text' },
          { name: 'status.error', tier: 'role', use: 'Error text and icon', swatch: '--ds-status-error' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus on the input, the toggle and the active option', swatch: '--ds-focus-ring-color' },
          { name: 'shadow.1 · z.dropdown', tier: '2', use: 'Popup elevation and layer' },
          { name: 'text.body.* · text.caption.*', tier: '2', use: 'Options; empty text, description and error' },
          { name: 'size.target.min · size.overlay.md · size.icon.sm', tier: '2', use: 'Option and toggle target (44px); popup maximum height; check mark' },
          { name: 'radius.control · radius.overlay · motion.duration.fast', tier: '2', use: 'Corners; popup fade' },
        ],
      }}
      anatomy={{
        render: cell(<Combobox label="Country" required description="Start typing." options={COUNTRIES} />),
        stagePadding: 'var(--ds-space-12)',
        parts: [
          { n: 1, label: 'Label', note: 'required, always visible', x: '-18px', y: '12px' },
          { n: 2, label: 'Description', note: 'optional', x: '-18px', y: '40px' },
          { n: 3, label: 'Input', note: 'holds focus, role combobox', x: '-18px', y: '88px' },
          { n: 4, label: 'Toggle button', note: 'opens the list', x: 'calc(100% + 18px)', y: '88px' },
        ],
      }}
      specs={[
        { label: 'Input', value: 'as the text field: size.control.md, radius.control' },
        { label: 'Toggle', value: '44px square at the end of the input, chevron-down, turns over when open' },
        { label: 'Popup', value: 'width of the input · max size.overlay.md high, scrolls · overlay.surface · shadow.1 · z.dropdown' },
        { label: 'Option', value: 'at least 44px high · check mark for the selected one' },
        { label: 'Focus', value: 'stays in the input; the active option is set with aria-activedescendant' },
      ]}
      api={[
        { label: 'label · description · error', value: 'As the text field. The error sets aria-invalid.' },
        { label: 'options', value: 'Required. A list of { id, label, disabled? }.' },
        { label: 'selectedKey · defaultSelectedKey · onSelectionChange', value: 'The chosen option id.' },
        { label: 'inputValue · defaultInputValue · onInputChange', value: 'The typed text.' },
        { label: 'emptyText · loading · loadingText', value: 'Text in the list when nothing matches, or while options load.' },
        { label: 'placeholder', value: 'A hint inside the input. Never the label.' },
        { label: 'required · disabled · readOnly · name · forceOpen', value: 'As native fields. forceOpen keeps the list open, for showcases.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} placeholder="Start typing" />), trigger: 'no text' },
          { id: 'loading', status: 'designed', render: <OpenCell><Combobox label="Country" options={[]} loading loadingText="Loading countries" defaultInputValue="C" forceOpen /></OpenCell>, trigger: 'loading', note: 'The list says so; aria-busy is set.' },
          { id: 'none', status: 'designed', render: <OpenCell><Combobox label="Country" options={COUNTRIES} emptyText="No country found" defaultInputValue="zzz" forceOpen /></OpenCell>, trigger: 'no match', note: 'Text, not an empty box.' },
          { id: 'one', status: 'n/a', reason: 'A single match is an ordinary list of one option.' },
          { id: 'some', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="fr" />), trigger: 'selected', note: 'The input shows the chosen label.' },
          { id: 'too-many', status: 'designed', label: 'Too many (60 options)', render: cell(<Combobox label="Option" options={MANY} defaultInputValue="Option 1" />), trigger: 'many options', note: 'Typing narrows the list; the popup scrolls.' },
          { id: 'incorrect', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} error="Choose a country from the list." defaultInputValue="Atlantis" />), trigger: 'error' },
          { id: 'correct', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="ca" />), trigger: 'error cleared' },
          { id: 'done', status: 'n/a', reason: 'Saving belongs to the form.' },
          { id: 'default', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="ca" />), trigger: 'rest' },
          { id: 'hover', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="ca" />), trigger: ':hover', note: 'Hover darkens the input border inside @media (hover: hover); the grid cannot replay it, so this cell shows rest.' },
          { id: 'focus-visible', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="ca" />), trigger: ':focus-visible', note: 'Real focus needs the keyboard: Tab to a combobox on the page.' },
          { id: 'active', status: 'n/a', reason: 'Typing is the feedback. The pressed look belongs to the toggle and the options.' },
          { id: 'disabled', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="ca" disabled description="Set by your plan." />), trigger: 'disabled' },
          { id: 'selected', status: 'designed', render: <OpenCell><Combobox label="Country" options={COUNTRIES} defaultSelectedKey="cl" defaultInputValue="C" forceOpen /></OpenCell>, trigger: 'selected option', note: 'The chosen option has a fill and a check mark.' },
          { id: 'read-only', status: 'designed', group: 'interaction', render: cell(<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="ca" readOnly />), trigger: 'readOnly' },
          { id: 'required', status: 'designed', group: 'interaction', render: cell(<Combobox label="Country" options={COUNTRIES} required />), trigger: 'required' },
          { id: 'expanded', status: 'designed', group: 'interaction', render: <OpenCell><Combobox label="Country" options={COUNTRIES} defaultInputValue="C" forceOpen /></OpenCell>, trigger: 'open', note: 'Input, toggle turned over, popup with an active option. Disabled option dimmed.' },
        ],
      }}
      dos={[
        { text: 'Keep focus in the input while the list is open.', basis: 'APG Combobox' },
        { text: 'Say in text when nothing matches.', basis: 'Nielsen 1' },
        { text: 'Announce the number of matches.', basis: 'WCAG 4.1.3 (AA)' },
        { text: 'Use a select when the list is short.', basis: 'APG: native first' },
      ]}
      donts={[
        { text: 'Move focus into the list.', basis: 'APG Combobox', rule: 'combobox.focus-stays-in-input' },
        { text: 'Leave the empty result blank.', basis: 'Nielsen 1', rule: 'combobox.state.none' },
        { text: 'Use it for a handful of options.', basis: 'APG: native first', rule: 'combobox.long-list' },
        { text: 'Skip the announcement of the result count.', basis: 'WCAG 4.1.3 (AA)', rule: 'combobox.count-announced' },
        { text: 'Write a colour or px literal in the stylesheet.', basis: 'misfile.raw-value-in-component', rule: 'combobox.no-literal' },
      ]}
      rules={comboboxRules}
      guide="fields-combobox--docs"
      guideName="Combobox"
    />
  ),
};
