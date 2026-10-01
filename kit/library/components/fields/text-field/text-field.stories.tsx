import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { TextField, type TextFieldProps } from './text-field';
import { textFieldRules } from './text-field.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Fields/Text field', component: TextField, parameters: { layout: 'fullscreen' }, args: { label: 'Label' } } satisfies Meta<typeof TextField>;

export default meta;

type FieldType = NonNullable<TextFieldProps['type']>;
// number is left out: it would drop the typed value "ada@", and the clear button with it.
const TYPES = ['text', 'email', 'tel', 'url', 'password', 'search'] as const satisfies readonly FieldType[];

const cell = (node: ReactNode) => <div style={{ inlineSize: '100%', maxInlineSize: 'calc(var(--ds-space-12) * 6)' }}>{node}</div>;

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Text field"
      layer="Component"
      family="Fields"
      plain="A text field is a box where you type one line: your name, an email address, a search. A label above it says what to type. If something goes wrong, a message under it says what and how to fix it."
      precise="Component in the fields family · captures one line of typed text · native input with a visible label · not for several lines (textarea) or for a choice from a list (select, combobox)."
      usedFor="Names, emails, phone numbers, codes, search terms, any short free text."
      tokens={{
        mode: 'consumed',
        note: 'The text field has no component tokens. Label, description and error come from the fields family (field.css).',
        rows: [
          { name: 'field.surface', tier: 'role', use: 'Fill of the input', swatch: '--ds-field-surface' },
          { name: 'field.text · field.placeholder', tier: 'role', use: 'Typed value and placeholder; both reach 4.5:1 on the fill', swatch: '--ds-field-text' },
          { name: 'field.border · border-hover · border-focus', tier: 'role', use: 'Boundary at rest (3:1), on hover and while focused', swatch: '--ds-field-border' },
          { name: 'field.border-invalid', tier: 'role', use: 'Boundary of a field in error, next to the error text and icon', swatch: '--ds-field-border-invalid' },
          { name: 'status.error', tier: 'role', use: 'Error text and icon (4.5:1 on the page)', swatch: '--ds-status-error' },
          { name: 'text.default · text.muted', tier: 'role', use: 'Label; description and required marker', swatch: '--ds-text-muted' },
          { name: 'surface.sunken', tier: 'role', use: 'Fill of a read-only field', swatch: '--ds-surface-sunken' },
          { name: 'disabled.text · disabled.surface · disabled.border', tier: 'role', use: 'Disabled value, fill and outline', swatch: '--ds-disabled-surface' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator', swatch: '--ds-focus-ring-color' },
          { name: 'text.body.* · text.label.* · text.caption.*', tier: '2', use: 'Value; label; description and error' },
          { name: 'space.control.inline · space.inset.sm · space.field.gap · space.control.gap', tier: '2', use: 'Padding inside the input; gap between label, hint, input and message; gap between error icon and text' },
          { name: 'size.control.md · size.border.thin', tier: '2', use: 'Minimum height (48px, above the 44px floor); hairline border' },
          { name: 'radius.control', tier: '2', use: 'Corner radius' },
        ],
      }}
      stage={{
        render: (args) =>
          cell(
            <TextField
              label={String(args.label)}
              required
              requiredText={String(args.requiredText)}
              clearable
              description={String(args.description)}
              error={String(args.error)}
              errorPrefix={String(args.errorPrefix)}
              type={args.type as FieldType}
              disabled={args.disabled === true}
              readOnly={args.readOnly === true}
              defaultValue="ada@"
            />,
          ),
        parts: [
          { n: 1, label: 'Label', note: 'required, always visible', target: '.ds-field__label' },
          { n: 2, label: 'Required marker', note: 'optional, in words', target: '.ds-field__marker', at: 'top-end' },
          { n: 3, label: 'Description', note: 'optional', target: '.ds-field__description' },
          { n: 4, label: 'Input', note: 'native, required', target: '.ds-text-field__input', at: 'bottom-start' },
          { n: 5, label: 'Error', note: 'shown when the value is wrong', target: '.ds-field__error', at: 'end' },
          { n: 6, label: 'Clear button and trailing slot', note: 'optional, inside the box at its end', target: '.ds-text-field__end', at: 'end' },
        ],
      }}
      specs={[
        { label: 'Height', property: 'height', target: '.ds-text-field__input', token: 'size.control.md', value: '48px' },
        { label: 'Padding inline', value: 'space.control.inline, more at the end when a clear button or trailing content shows' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-text-field__input', token: 'space.inset.sm' },
        { label: 'Radius', property: 'radius', target: '.ds-text-field__input', token: 'radius.control' },
        { label: 'Value', value: 'text.body.*, 16px: no zoom on iOS focus' },
        { label: 'Label', value: 'text.label.*, above the input, never inside it' },
        { label: 'Focus', value: 'border.focus plus a ring, 2px, offset 2px, on :focus-visible' },
      ]}
      api={[
        { label: 'label', value: 'Required. The visible label, bound with for/id.', control: { kind: 'text', value: 'Email address' } },
        { label: 'description', value: 'Help under the label, tied with aria-describedby.', control: { kind: 'text', value: 'We send the receipt here.' } },
        { label: 'error', value: 'The error text. Setting it sets aria-invalid and the error look. Clear it when the value is valid.', control: { kind: 'text', value: 'Enter an email address, like name@example.com' } },
        { label: 'required', value: 'Native required plus the visible word "(required)".' },
        { label: 'requiredText', value: 'Changes the word of the required marker. Default "required".', control: { kind: 'text', value: 'required' } },
        { label: 'success · successPrefix', value: 'A quiet confirmation in a polite live region (role="status"), styled as success and never as an error. Hidden while error is set. successPrefix is the hidden word before it, default "Correct".' },
        { label: 'clearable · clearLabel · onClear', value: 'A clear icon button while the field holds text, on by default for type "search". It empties the field, returns focus to the input and calls onClear. clearLabel default "Clear search".' },
        { label: 'trailing', value: 'Content inside the box at its end: a unit, an icon, a small button. The text stops before it.' },
        { label: 'errorPrefix', value: 'The hidden word read before the error, default "Error".', control: { kind: 'text', value: 'Error' } },
        { label: 'type', value: '"text" | "email" | "tel" | "url" | "password" | "search" | "number", default "text".', control: { kind: 'select', options: TYPES, value: 'text' } },
        { label: 'disabled', value: 'A native input attribute.', control: { kind: 'boolean', value: false } },
        { label: 'readOnly', value: 'A native input attribute.', control: { kind: 'boolean', value: false } },
        { label: '…props', value: 'Every other native input attribute, such as autoComplete, value, onChange and ref.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'designed', render: cell(<TextField label="Full name" description="As on your passport." autoComplete="name" />), trigger: 'no value', note: 'Empty and untouched. No error before the user leaves the field.' },
          { id: 'loading', status: 'n/a', reason: 'A field does not load. A server check keeps the value and the view announces the result in a status message.' },
          { id: 'none', status: 'n/a', reason: 'The field holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'The field holds no collection.' },
          { id: 'some', status: 'designed', render: cell(<TextField label="Full name" defaultValue="Ada Lovelace" autoComplete="name" />), trigger: 'value', note: 'A value the user typed.' },
          { id: 'too-many', status: 'designed', label: 'Too many (long value)', render: cell(<TextField label="Web address" type="url" defaultValue="https://example.com/a/very/long/path/that/does/not/fit/in/the/box/at/all" />), trigger: 'long value', note: 'The value scrolls inside the box; the box keeps its size.' },
          { id: 'incorrect', status: 'designed', render: cell(<TextField label="Email address" defaultValue="ada@" error="Enter an email address, like name@example.com" />), trigger: 'error', note: 'Icon, word and text say it; the border colour is a third cue. Shown after the user leaves the field.' },
          { id: 'correct', status: 'designed', render: cell(<TextField label="Password" type="password" description="Use at least 12 characters." defaultValue="analytical-engine" success="Meets the 12 character rule" />), trigger: 'success', note: 'A check and text in the success colour, in a polite live region. The border stays as it is: it is not an error.' },
          { id: 'done', status: 'n/a', reason: 'Saving belongs to the form. The view announces it with role="status".' },
          { id: 'default', status: 'designed', render: cell(<TextField label="Full name" defaultValue="Ada Lovelace" />), trigger: 'rest' },
          { id: 'hover', status: 'designed', render: cell(<TextField label="Full name" defaultValue="Ada Lovelace" className="doc-force-hover" />), trigger: ':hover', note: 'Forced by .doc-force-hover. The border takes field.border-hover.' },
          { id: 'focus-visible', status: 'designed', render: cell(<TextField label="Full name" defaultValue="Ada Lovelace" className="doc-force-focus" />), trigger: ':focus-visible', note: 'Forced by .doc-force-focus.' },
          { id: 'active', status: 'n/a', reason: 'Typing is the feedback. A text field has no pressed look.' },
          { id: 'disabled', status: 'designed', render: cell(<TextField label="Account number" defaultValue="0012-3456" disabled description="Set when the account opens." />), trigger: 'disabled', note: 'Say why, in the description.' },
          { id: 'selected', status: 'n/a', reason: 'Not selectable. Selected text is the browser own.' },
          { id: 'default', variant: 'Clearable', status: 'designed', render: cell(<TextField label="Search orders" type="search" defaultValue="Ada" />), trigger: 'type="search" with text', note: 'The clear icon button appears while the field holds text. It empties the field and returns focus.' },
          { id: 'default', variant: 'Trailing', status: 'designed', render: cell(<TextField label="Weight" type="number" defaultValue="12" trailing={<span aria-hidden="true">kg</span>} />), trigger: 'trailing', note: 'A unit at the end of the box. The text stops before it.' },
          { id: 'read-only', status: 'designed', group: 'interaction', render: cell(<TextField label="Reference" defaultValue="INV-2041" readOnly />), trigger: 'readOnly', note: 'Sunken fill, normal text, still focusable and copyable. Distinct from disabled.' },
          { id: 'invalid', status: 'designed', group: 'interaction', render: cell(<TextField label="Email address" defaultValue="ada@" error="Enter an email address, like name@example.com" className="doc-force-focus" />), trigger: 'error + :focus-visible', note: 'The focus border wins over the invalid border while the field has focus; the ring and the message stay.' },
          { id: 'required', status: 'designed', group: 'interaction', render: cell(<TextField label="Email address" required description="We send the receipt here." />), trigger: 'required', note: 'The marker is the word "(required)", not a bare asterisk.' },
        ],
      }}
      dos={[
        { text: 'Keep a visible label above the input, whatever the placeholder says.', basis: 'WCAG 3.3.2 (A)', },
        { text: 'Write the error with the field name and the fix: "Enter an email address, like name@example.com".', basis: 'WCAG 3.3.3 (AA)' },
        { text: 'Pick the type and autocomplete token that match the data.', basis: 'WCAG 1.3.5 (AA)' },
        { text: 'Explain the required marker in words.', basis: 'WCAG 3.3.2 (A)' },
        { text: 'Confirm a rule that was not obvious with a quiet success message, in a live region.', basis: 'Nielsen 5; WCAG 4.1.3 (AA)' },
      ]}
      donts={[
        { text: 'Use the placeholder as the label.', basis: 'WCAG 3.3.2 (A)', rule: 'text-field.visible-label' },
        { text: 'Show an error by a red border alone.', basis: 'WCAG 1.4.1 (A)', rule: 'text-field.error-bound' },
        { text: 'Remove the focus outline with nothing in its place.', basis: 'WCAG 2.4.7 (AA)', rule: 'text-field.focus-ring' },
        { text: 'Validate on each key stroke before the user finishes.', basis: 'Nielsen 5', rule: 'text-field.validate-on-blur' },
        { text: 'Write a colour or px literal in the stylesheet.', basis: 'misfile.raw-value-in-component', rule: 'text-field.no-literal' },
        { text: 'Ask for personal data with no autocomplete token.', basis: 'WCAG 1.3.5 (AA)', rule: 'text-field.autocomplete' },
      ]}
      guide="fields-text-field--docs"
      guideName="Text field"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Text field" layer="Component" family="Fields" rules={textFieldRules} guide="fields-text-field--docs" guideName="Text field" />,
};
