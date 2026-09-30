import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { Select } from './select';
import { selectRules } from './select.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Fields/Select', component: Select, parameters: { layout: 'fullscreen' }, args: { label: 'Label', options: [] } } satisfies Meta<typeof Select>;

export default meta;

const cell = (node: ReactNode) => <div style={{ inlineSize: '100%', maxInlineSize: 'calc(var(--ds-space-12) * 6)' }}>{node}</div>;
const COUNTRIES = [
  { value: 'ca', label: 'Canada' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'xx', label: 'A country with a very long official name that will not fit in the box' },
];
const MANY = Array.from({ length: 40 }, (_, n) => ({ value: `o${n}`, label: `Option ${n + 1}` }));

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Select"
      layer="Component"
      family="Fields"
      plain="A select is a drop-down list. You pick one item from a short list of choices that are already known: a country, a size, a status."
      precise="Component in the fields family · picks one option from a short fixed list · native select, so the keyboard, typeahead and the phone picker come free · not for a long or searchable list (combobox)."
      usedFor="Country, language, size, category: a short, closed list."
      tokens={{
        mode: 'consumed',
        note: 'The select has no component tokens. It shares the box, label, description and error of the fields family.',
        rows: [
          { name: 'field.surface · field.text', tier: 'role', use: 'Fill and selected text', swatch: '--ds-field-surface' },
          { name: 'field.border · border-hover · border-focus · border-invalid', tier: 'role', use: 'Boundary at rest, on hover, focused and in error', swatch: '--ds-field-border' },
          { name: 'status.error', tier: 'role', use: 'Error text and icon', swatch: '--ds-status-error' },
          { name: 'surface.sunken · disabled.*', tier: 'role', use: 'Read-only fill; disabled text, fill and outline', swatch: '--ds-surface-sunken' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator', swatch: '--ds-focus-ring-color' },
          { name: 'text.body.* · text.label.* · text.caption.*', tier: '2', use: 'Value; label; description and error' },
          { name: 'space.control.inline · space.control.gap · space.inset.sm', tier: '2', use: 'Padding; room kept for the chevron' },
          { name: 'size.control.md · size.icon.md · radius.control', tier: '2', use: 'Height; chevron; corner radius' },
        ],
      }}
      stage={{
        render: cell(<Select label="Country" required description="Where you live." options={COUNTRIES.slice(0, 3)} emptyLabel="Choose a country" />),
        parts: [
          { n: 1, label: 'Label', note: 'required, always visible', target: '.ds-field__label' },
          { n: 2, label: 'Description', note: 'optional', target: '.ds-field__description' },
          { n: 3, label: 'Select', note: 'native, required', target: '.ds-select__input', at: 'top-start' },
          { n: 4, label: 'Chevron', note: 'decorative', target: '.ds-select__chevron', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Height', property: 'height', target: '.ds-select__input', token: 'size.control.md', value: '48px' },
        { label: 'Padding inline', value: 'space.control.inline, more at the end for the chevron' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-select__input', token: 'space.inset.sm' },
        { label: 'Radius', property: 'radius', target: '.ds-select__input', token: 'radius.control' },
        { label: 'Chevron', value: 'icon chevron-down, size.icon.md, hidden from assistive technology' },
        { label: 'Options', value: 'the browser list; the page does not style it' },
      ]}
      api={[
        { label: 'label · description · error', value: 'As the text field. The error sets aria-invalid.' },
        { label: 'options', value: 'Required. A list of { value, label, disabled? }.' },
        { label: 'emptyLabel', value: 'Text of an empty first choice, such as "Choose a country". Leave it out when a value is always preselected.' },
        { label: 'readOnly', value: 'Keeps the value, sets aria-readonly and blocks the keys and clicks that change it.' },
        { label: 'required · requiredText · errorPrefix', value: 'As the text field.' },
        { label: '…props', value: 'Every native select attribute, such as disabled, value, defaultValue, onChange and ref.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'designed', render: cell(<Select label="Country" options={COUNTRIES.slice(0, 3)} emptyLabel="Choose a country" />), trigger: 'empty choice', note: 'The first option says what to do.' },
          { id: 'loading', status: 'n/a', reason: 'A native select has no loading look. Disable it and say why while options load.' },
          { id: 'none', status: 'n/a', reason: 'A select with no options is not shown. Explain the missing choice in the view.' },
          { id: 'one', status: 'designed', render: cell(<Select label="Country" options={COUNTRIES.slice(0, 1)} defaultValue="ca" />), trigger: 'one option', note: 'Consider plain text when there is nothing to choose.' },
          { id: 'some', status: 'designed', render: cell(<Select label="Country" options={COUNTRIES.slice(0, 3)} defaultValue="fr" />), trigger: 'value' },
          { id: 'too-many', status: 'designed', label: 'Too many (long label, many options)', render: cell(<Select label="Country" options={[COUNTRIES[3], ...MANY]} defaultValue="xx" description="Over 15 options: use a combobox." />), trigger: 'long value', note: 'The selected text ellipsizes; the browser list scrolls.' },
          { id: 'incorrect', status: 'designed', render: cell(<Select label="Country" options={COUNTRIES.slice(0, 3)} emptyLabel="Choose a country" error="Choose a country." />), trigger: 'error' },
          { id: 'correct', status: 'designed', render: cell(<Select label="Country" options={COUNTRIES.slice(0, 3)} defaultValue="ca" />), trigger: 'error cleared' },
          { id: 'done', status: 'n/a', reason: 'Saving belongs to the form.' },
          { id: 'default', status: 'designed', render: cell(<Select label="Country" options={COUNTRIES.slice(0, 3)} defaultValue="ca" />), trigger: 'rest' },
          { id: 'hover', status: 'designed', render: cell(<Select label="Country" options={COUNTRIES.slice(0, 3)} defaultValue="ca" className="doc-force-hover" />), trigger: ':hover', note: 'Forced by .doc-force-hover. The border takes field.border-hover.' },
          { id: 'focus-visible', status: 'designed', render: cell(<Select label="Country" options={COUNTRIES.slice(0, 3)} defaultValue="ca" className="doc-force-focus" />), trigger: ':focus-visible', note: 'Forced by .doc-force-focus.' },
          { id: 'active', status: 'n/a', reason: 'The browser draws the open list; the page has no pressed look.' },
          { id: 'disabled', status: 'designed', render: cell(<Select label="Country" options={COUNTRIES.slice(0, 3)} defaultValue="ca" disabled description="Set by your plan." />), trigger: 'disabled' },
          { id: 'selected', status: 'n/a', reason: 'The chosen option is the value; the browser marks it in its list.' },
          { id: 'read-only', status: 'designed', group: 'interaction', render: cell(<Select label="Country" options={COUNTRIES.slice(0, 3)} defaultValue="ca" readOnly />), trigger: 'readOnly', note: 'Focusable; the keys and clicks that change it are blocked.' },
          { id: 'required', status: 'designed', group: 'interaction', render: cell(<Select label="Country" options={COUNTRIES.slice(0, 3)} emptyLabel="Choose a country" required />), trigger: 'required' },
          { id: 'expanded', status: 'n/a', group: 'interaction', reason: 'The browser draws and controls the open list, so the page cannot render it. The combobox draws its own.' },
        ],
      }}
      dos={[
        { text: 'Use a native select for a short list.', basis: 'APG Listbox; project decision' },
        { text: 'Start with an empty choice that says what to do.', basis: 'Nielsen 6' },
        { text: 'Keep a visible label above the select.', basis: 'WCAG 3.3.2 (A)' },
      ]}
      donts={[
        { text: 'Build a custom select with no keyboard.', basis: 'WCAG 2.1.1 (A)', rule: 'select.native-first' },
        { text: 'Use it for a long list with no search.', basis: 'Nielsen 6', rule: 'select.empty-choice' },
        { text: 'Show an error by colour alone.', basis: 'WCAG 1.4.1 (A)', rule: 'select.error-bound' },
        { text: 'Leave the label out.', basis: 'WCAG 3.3.2 (A)', rule: 'select.visible-label' },
        { text: 'Write a colour or px literal in the stylesheet.', basis: 'misfile.raw-value-in-component', rule: 'select.no-literal' },
      ]}
      guide="fields-select--docs"
      guideName="Select"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Select" layer="Component" family="Fields" rules={selectRules} guide="fields-select--docs" guideName="Select" />,
};
