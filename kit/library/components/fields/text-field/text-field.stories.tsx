import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
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
          { name: 'space.control.inline · space.field.gap · space.control.gap', tier: '2', use: 'Padding inside the input; gap between label, hint, input and message; gap between error icon and text' },
          { name: 'size.control.md · size.border.thin', tier: '2', use: 'Minimum height (32px, above the 24px floor); hairline border' },
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
        { label: 'Height', property: 'height', target: '.ds-text-field__input', token: 'size.control.md', value: '32px' },
        { label: 'Padding inline', value: 'space.control.inline, more at the end when a clear button or trailing content shows' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-text-field__input', token: 'space.0', value: '0, the text centres in size.control.md (32px)' },
        { label: 'Radius', property: 'radius', target: '.ds-text-field__input', token: 'radius.control' },
        { label: 'Value', value: 'text.body.*, 14px; 16px on a coarse pointer, so iOS does not zoom on focus' },
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

/** A field the view validates on blur, then on input once the error shows. */
function EmailWithValidation() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const validate = (next: string) => setError(/^\S+@\S+\.\S+$/.test(next) ? '' : 'Enter an email address, like name@example.com');
  return (
    <TextField
      label="Email address"
      type="email"
      autoComplete="email"
      required
      value={value}
      error={error}
      onChange={(event) => {
        setValue(event.target.value);
        if (error) validate(event.target.value);
      }}
      onBlur={(event) => validate(event.target.value)}
    />
  );
}

/** The password toggle is a button in the trailing slot, with its own name. */
function PasswordWithToggle() {
  const [shown, setShown] = useState(false);
  return (
    <TextField
      label="Password"
      type={shown ? 'text' : 'password'}
      autoComplete="current-password"
      trailing={<Button variant="subtle" onClick={() => setShown(!shown)}>{shown ? 'Hide' : 'Show'}</Button>}
    />
  );
}

/** A controlled search: the view owns the value, and the clear button calls it back. */
function ControlledSearch() {
  const [query, setQuery] = useState('Ada');
  return (
    <Stack gap={2}>
      <TextField label="Search customers" type="search" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} />
      <Text as="p" role="status" variant="caption" tone="muted">{query === '' ? 'Showing all customers.' : `Searching for "${query}".`}</Text>
    </Stack>
  );
}

/** The form reads every field by its `name` when the user submits. */
function SignUpForm() {
  const [welcome, setWelcome] = useState('');
  return (
    <Stack
      as="form"
      gap={4}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.target as HTMLFormElement);
        setWelcome(`Welcome, ${String(data.get('fullName'))}.`);
      }}
    >
      <TextField label="Full name" name="fullName" required autoComplete="name" />
      <Stack direction="horizontal" justify="end">
        <Button type="submit">Create account</Button>
      </Stack>
      <Text as="p" role="status" variant="caption" tone="muted">{welcome}</Text>
    </Stack>
  );
}

/** On submit, show the error and move focus to the field, so the user lands on the problem. */
function FocusOnError() {
  const name = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  return (
    <Stack
      as="form"
      gap={4}
      onSubmit={(event) => {
        event.preventDefault();
        const value = name.current?.value ?? '';
        if (value.trim() !== '') {
          setError('');
          return;
        }
        setError('Enter your full name');
        name.current?.focus();
      }}
    >
      <TextField ref={name} label="Full name" autoComplete="name" error={error} />
      <Stack direction="horizontal" justify="end">
        <Button type="submit">Continue</Button>
      </Stack>
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Text field"
      layer="Component"
      family="Fields"
      imports="import { TextField, Stack, Text, Button } from '@acme/design-system';"
      intro={[
        'A text field is a box where the user types one line: a name, an email, a search. It renders a native `<input>`, so typing, selecting, copying and pasting work with no code.',
        'A field is the label, the input and the messages around it. The label is always visible. A placeholder (grey sample text inside the box) is never the label, because it vanishes as soon as the user types.',
        'Wiring: `TextField` gives the input an `id` and points the `<label>` at it. A click on the label focuses the input, and a screen reader (software that reads the page aloud) says the label with the input.',
        'The description and the error text are tied to the input with `aria-describedby` (an attribute that lists the ids of extra text a screen reader reads after the label). The order is description, then error, then success.',
        'An `error` also sets `aria-invalid="true"` (a flag that tells a screen reader the value is wrong). The message is the signal. The red border is only a third cue.',
        'Every other `<input>` attribute passes through: `name`, `autoComplete`, `value`, `onChange`, `disabled`, `readOnly`. `ref` and `className` reach the input. All words the field shows are props, so you can translate them.',
      ]}
      guide="fields-text-field--docs"
      guideName="Text field"
      groups={[
        {
          title: 'Start here',
          kicker: 'Every field needs a label. Add a description, the required word or a sample only when the user needs them.',
          examples: [
            {
              title: 'Label only',
              when: 'A short answer that the label explains on its own.',
              explain: [
                '`label` is the only required prop. It shows above the input and stays visible while the user types (WCAG 3.3.2, A).',
                '`autoComplete="given-name"` names the purpose of the data, so the browser can fill it in. This helps people who find typing hard (WCAG 1.3.5, AA).',
                'The component builds the `id` and the `for` link for you. You write neither.',
              ],
              render: <TextField label="First name" autoComplete="given-name" />,
              code: `// label is required: it names the field for everyone, including screen readers.
// autoComplete says what the data is, so the browser can offer to fill it.
<TextField label="First name" autoComplete="given-name" />`,
            },
            {
              title: 'With a description',
              when: 'The user needs a hint about the format before typing.',
              explain: [
                'The description sits between the label and the input, so the user reads it before typing.',
                'It joins the input through `aria-describedby`. A screen reader reads the label, then the hint, when the field takes focus (WCAG 3.3.2, A).',
                'Put the rule here when the user must know it first. A hint inside the placeholder would vanish.',
              ],
              render: <TextField label="Postal code" description="Six characters, like K1A 0B1." autoComplete="postal-code" />,
              code: `// description is tied to the input, so a screen reader reads it with the label.
<TextField
  label="Postal code"
  description="Six characters, like K1A 0B1."
  autoComplete="postal-code"
/>`,
            },
            {
              title: 'Required',
              when: 'The form cannot go on without a value.',
              explain: [
                '`required` sets the native attribute: the browser can refuse to submit an empty field.',
                'The label also shows the word "(required)". A bare asterisk means nothing to a person who does not know the convention (WCAG 3.3.2, A).',
                'Without the visible word, sighted users would learn the field is required only after a failed submit.',
              ],
              render: <TextField label="Email address" type="email" required autoComplete="email" />,
              code: `// required = native attribute + the visible word "(required)" after the label.
<TextField label="Email address" type="email" required autoComplete="email" />`,
            },
            {
              title: 'Placeholder as a sample',
              when: 'Show an example of the answer. The label still names the field.',
              explain: [
                '`placeholder` passes straight to the input. It shows grey text until the user types.',
                'Use it for a sample ("name@example.com"), never for the label or a rule. It disappears while typing, and its grey colour often fails the text contrast minimum (WCAG 1.4.3, AA).',
              ],
              render: <TextField label="Email address" type="email" placeholder="name@example.com" autoComplete="email" />,
              code: `// The placeholder is a sample only. The label above it is what names the field.
<TextField
  label="Email address"
  type="email"
  placeholder="name@example.com"
  autoComplete="email"
/>`,
            },
          ],
        },
        {
          title: 'Types',
          kicker: 'Pick the type that matches the data. The phone keyboard and the browser checks follow it.',
          examples: [
            {
              title: 'Text',
              when: 'A name or any short free text. This is the default type.',
              explain: [
                '`type` defaults to `"text"`, so you can leave it out.',
                'Add `autoComplete` for personal data: `name`, `street-address`, `organization` (WCAG 1.3.5, AA).',
              ],
              render: <TextField label="Full name" autoComplete="name" />,
              code: `// type="text" is the default.
<TextField label="Full name" autoComplete="name" />`,
            },
            {
              title: 'Email',
              when: 'An email address.',
              explain: [
                'A phone shows a keyboard with the @ key within reach.',
                'The browser can check the shape of the address when the form is submitted.',
              ],
              render: <TextField label="Email address" type="email" autoComplete="email" />,
              code: `<TextField label="Email address" type="email" autoComplete="email" />`,
            },
            {
              title: 'Phone',
              when: 'A phone number.',
              explain: [
                'A phone shows the dial pad.',
                'The type does not check the number. Phone formats differ by country, so a strict check would reject real numbers.',
              ],
              render: <TextField label="Phone number" type="tel" autoComplete="tel" />,
              code: `<TextField label="Phone number" type="tel" autoComplete="tel" />`,
            },
            {
              title: 'URL',
              when: 'A web address.',
              explain: [
                'A phone shows a keyboard with the / and .com keys.',
                'The browser checks that the value looks like a full address, such as `https://example.com`.',
              ],
              render: <TextField label="Website" type="url" autoComplete="url" />,
              code: `<TextField label="Website" type="url" autoComplete="url" />`,
            },
            {
              title: 'Password',
              when: 'A secret that the screen hides as the user types.',
              explain: [
                '`autoComplete="current-password"` lets a password manager fill the field. Use `"new-password"` when the user creates a password.',
                'Never block paste on this field. A password manager pastes the value (WCAG 3.3.8, AA).',
              ],
              render: <TextField label="Password" type="password" autoComplete="current-password" />,
              code: `// "current-password" = sign in. Use "new-password" on a sign-up form.
// Do not add onPaste={(event) => event.preventDefault()}: password managers paste.
<TextField label="Password" type="password" autoComplete="current-password" />`,
            },
            {
              title: 'Search',
              when: 'A search term.',
              explain: [
                '`type="search"` turns the clear button on: a small button that empties the field while it holds text.',
                'The browser may add a Search key on the phone keyboard.',
                'Turn the clear button off with `clearable={false}` if it is noise.',
              ],
              render: <TextField label="Search orders" type="search" defaultValue="Ada" />,
              code: `// The clear button shows while the field holds text.
<TextField label="Search orders" type="search" defaultValue="Ada" />`,
            },
            {
              title: 'Number',
              when: 'A quantity that the user may step up or down with the arrow keys.',
              explain: [
                '`min`, `max` and `step` pass to the input. The arrow keys and the browser check follow them.',
                'Use `type="number"` for amounts you add up. For a code with leading zeros, such as a postal code, keep `type="text"` and set `inputMode="numeric"` (see Accessibility wiring).',
              ],
              render: <TextField label="Quantity" type="number" min={1} max={20} step={1} defaultValue="2" />,
              code: `// min, max and step are plain input attributes. The arrow keys follow them.
<TextField label="Quantity" type="number" min={1} max={20} step={1} defaultValue="2" />`,
            },
          ],
        },
        {
          title: 'Read the value',
          kicker: 'Let the browser hold the value, or hold it yourself. Both work with the clear button.',
          examples: [
            {
              title: 'Uncontrolled: read it on submit',
              when: 'You need the value only when the user sends the form.',
              explain: [
                '"Uncontrolled" means the browser holds the text. You give a starting value with `defaultValue`.',
                '`name` is the key you read on submit. `FormData` collects every named field of the form.',
                '`event.preventDefault()` stops the browser from reloading the page.',
                '`type="submit"` on the button makes Enter send the form from inside the field.',
              ],
              render: <SignUpForm />,
              code: `function SignUpForm() {
  const [welcome, setWelcome] = useState('');
  return (
    <Stack
      as="form"
      gap={4}
      onSubmit={(event) => {
        // Stop the browser from reloading the page.
        event.preventDefault();
        // FormData reads every field that has a name.
        const data = new FormData(event.currentTarget);
        setWelcome('Welcome, ' + data.get('fullName') + '.');
      }}
    >
      {/* name = the key you read from FormData */}
      <TextField label="Full name" name="fullName" required autoComplete="name" />
      <Stack direction="horizontal" justify="end">
        <Button type="submit">Create account</Button>
      </Stack>
      {/* role="status" makes a screen reader announce the text when it changes. */}
      <Text as="p" role="status" variant="caption" tone="muted">{welcome}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Controlled: react to each change',
              when: 'The view must react while the user types, such as a live filter.',
              explain: [
                '"Controlled" means your state holds the text. Pass `value` and update it in `onChange`.',
                '`onClear` runs after the clear button emptied the field. Set your state to `\'\'` there, so both agree.',
                'The status line uses `role="status"`: a screen reader announces the new text without moving focus (WCAG 4.1.3, AA).',
              ],
              render: <ControlledSearch />,
              code: `function ControlledSearch() {
  const [query, setQuery] = useState('Ada');
  return (
    <Stack gap={2}>
      <TextField
        label="Search customers"
        type="search"
        value={query}
        // Keep your state in step with every key stroke.
        onChange={(event) => setQuery(event.target.value)}
        // The clear button empties the input; mirror that in your state.
        onClear={() => setQuery('')}
      />
      <Text as="p" role="status" variant="caption" tone="muted">
        {query === '' ? 'Showing all customers.' : 'Searching for "' + query + '".'}
      </Text>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props. The native attributes do the work.',
          examples: [
            {
              title: 'With a value',
              when: 'A value that the user typed or the view loaded.',
              explain: [
                '`defaultValue` sets the starting text of an uncontrolled field. Use `value` with `onChange` for a controlled one, never both.',
              ],
              render: <TextField label="Full name" defaultValue="Ada Lovelace" autoComplete="name" />,
              code: `<TextField label="Full name" defaultValue="Ada Lovelace" autoComplete="name" />`,
            },
            {
              title: 'Error',
              when: 'The value is wrong. Name the field and the fix.',
              explain: [
                'Pass the message as `error`. Its presence sets `aria-invalid="true"`, adds the message to `aria-describedby` and shows an error icon.',
                'A hidden word "Error:" comes before the message, so a screen reader says it is an error (WCAG 3.3.1, A).',
                'Say how to fix it: "Enter an email address, like name@example.com". "Invalid input" helps nobody (WCAG 3.3.3, AA).',
                'Without the icon and the text, only the border would change colour. People who cannot tell the colours apart would miss it (WCAG 1.4.1, A).',
              ],
              render: <TextField label="Email address" type="email" autoComplete="email" defaultValue="ada@" error="Enter an email address, like name@example.com" />,
              code: `// Pass the message, not a boolean. An empty string means "no error".
<TextField
  label="Email address"
  type="email"
  autoComplete="email"
  defaultValue="ada@"
  error="Enter an email address, like name@example.com"
/>`,
            },
            {
              title: 'Error with a description',
              when: 'The field has a hint and an error at the same time.',
              explain: [
                'Both stay. A screen reader reads the label, the description, then the error: the order of `aria-describedby`.',
                'Keep the hint after the error appears. The user may need the rule to fix the value.',
              ],
              render: <TextField label="Postal code" description="Six characters, like K1A 0B1." defaultValue="K1A" error="Enter all six characters of the postal code" />,
              code: `<TextField
  label="Postal code"
  description="Six characters, like K1A 0B1."
  defaultValue="K1A"
  error="Enter all six characters of the postal code"
/>`,
            },
            {
              title: 'Success',
              when: 'A rule that was not obvious is now met, such as a password rule.',
              explain: [
                '`success` shows a check and the text in the success colour. The border does not change, so it never looks like an error.',
                'The message sits in a polite live region (`role="status"`). A screen reader announces it when it appears and does not interrupt the typing (WCAG 4.1.3, AA).',
                'Use it where the rule was hard to see. Do not confirm every field: a green check on "Full name" adds noise.',
                'An `error` hides the success message. A field never shows both.',
              ],
              render: <TextField label="Password" type="password" autoComplete="new-password" description="Use at least 12 characters." defaultValue="analytical-engine" success="Meets the 12 character rule" />,
              code: `// Put the rule in description so the user reads it first.
// success only confirms that the rule is now met.
<TextField
  label="Password"
  type="password"
  autoComplete="new-password"
  description="Use at least 12 characters."
  defaultValue="analytical-engine"
  success="Meets the 12 character rule"
/>`,
            },
            {
              title: 'Disabled',
              when: 'The user cannot change the value now.',
              explain: [
                '`disabled` is the native attribute. The field leaves the tab order and the form does not send its value.',
                'Say why in the description. A dimmed field with no reason confuses people (Nielsen heuristic 1, visibility of system status).',
                'If the value must still be sent or copied, use `readOnly` instead.',
              ],
              render: <TextField label="Account number" defaultValue="0012-3456" disabled description="Set when the account opens." />,
              code: `// disabled removes the field from the tab order. The description gives the reason.
<TextField
  label="Account number"
  defaultValue="0012-3456"
  disabled
  description="Set when the account opens."
/>`,
            },
            {
              title: 'Read-only',
              when: 'The user can read and copy the value but not change it.',
              explain: [
                '`readOnly` keeps the field in the tab order, so a keyboard user can focus it and copy the text.',
                'The form still sends the value. The fill is sunken so it never looks disabled.',
              ],
              render: <TextField label="Reference" defaultValue="INV-2041" readOnly />,
              code: `// readOnly: focusable and copyable, sent with the form, not editable.
<TextField label="Reference" defaultValue="INV-2041" readOnly />`,
            },
          ],
        },
        {
          title: 'Clear button and trailing content',
          kicker: 'Both live inside the box, at its end. The text stops before them.',
          examples: [
            {
              title: 'Clear button on another type',
              when: 'A long entry that users often start over, such as a city.',
              explain: [
                '`clearable` turns the button on for a type that is not `search`.',
                'The button is a real button named "Clear". A press empties the field, fires `onChange` with the empty value and moves focus back to the input (WCAG 2.4.3, A).',
                'It shows only while the field holds text and is not disabled or read-only.',
              ],
              render: <TextField label="City" clearable defaultValue="Montréal" autoComplete="address-level2" />,
              code: `<TextField label="City" clearable defaultValue="Montréal" autoComplete="address-level2" />`,
            },
            {
              title: 'Clear button off',
              when: 'A search where the button would be noise.',
              explain: [
                '`clearable={false}` turns off the button that `type="search"` shows by default.',
                'Most searches keep it: it saves a select-all and delete.',
              ],
              render: <TextField label="Search by order number" type="search" clearable={false} defaultValue="2041" />,
              code: `<TextField label="Search by order number" type="search" clearable={false} defaultValue="2041" />`,
            },
            {
              title: 'Unit',
              when: 'A unit that completes the value.',
              explain: [
                '`trailing` places content inside the box, after the text. The input pads itself so the text never runs under it.',
                '`aria-hidden="true"` hides "kg" from screen readers because the label already says kilograms. Otherwise they would read the unit twice.',
              ],
              render: <TextField label="Weight in kilograms" type="number" defaultValue="12" trailing={<span aria-hidden="true">kg</span>} />,
              code: `// The label already names the unit, so hide the visual "kg" from screen readers.
<TextField
  label="Weight in kilograms"
  type="number"
  defaultValue="12"
  trailing={<span aria-hidden="true">kg</span>}
/>`,
            },
            {
              title: 'Button in the trailing slot',
              when: 'A small action tied to the value, such as showing a password.',
              explain: [
                'The label changes with the state: "Show", then "Hide". Do not add `aria-pressed` to a button whose label already changes: a screen reader would say "Hide, pressed", which reads as two states at once (APG Button).',
                'Give a button in the slot its own accessible name. The visible text "Show" or "Hide" is that name here, so the name holds the visible words (WCAG 2.5.3, A).',
                'The type switches between `"password"` and `"text"`. The field keeps its value and focus.',
              ],
              render: <PasswordWithToggle />,
              code: `function PasswordWithToggle() {
  const [shown, setShown] = useState(false);
  return (
    <TextField
      label="Password"
      // "text" shows the characters; "password" hides them.
      type={shown ? 'text' : 'password'}
      autoComplete="current-password"
      trailing={
        <Button variant="subtle" onClick={() => setShown(!shown)}>
          {shown ? 'Hide' : 'Show'}
        </Button>
      }
    />
  );
}`,
            },
            {
              title: 'Clear and trailing together',
              when: 'A field that needs both.',
              explain: [
                'The clear button comes first, then your `trailing` content.',
                'The input measures the slot, so the text stops before both.',
              ],
              render: <TextField label="Amount" clearable defaultValue="1250" trailing={<span aria-hidden="true">CAD</span>} />,
              code: `<TextField
  label="Amount"
  clearable
  defaultValue="1250"
  trailing={<span aria-hidden="true">CAD</span>}
/>`,
            },
          ],
        },
        {
          title: 'Other languages',
          kicker: 'The field holds no text of its own except four default words. Pass the words of your language.',
          examples: [
            {
              title: 'Required word',
              when: 'A translated view.',
              explain: [
                '`requiredText` replaces the word "required" after the label.',
                'Translate the label, the description and the messages the same way. They are all props.',
              ],
              render: <TextField label="Adresse courriel" type="email" required requiredText="obligatoire" autoComplete="email" />,
              code: `<TextField label="Adresse courriel" type="email" required requiredText="obligatoire" autoComplete="email" />`,
            },
            {
              title: 'Error word',
              when: 'A translated view that shows an error.',
              explain: [
                '`errorPrefix` replaces the hidden word "Error" that a screen reader says before the message.',
                'Without it, a French screen reader would say "Error" in the middle of French text.',
              ],
              render: <TextField label="Adresse courriel" type="email" autoComplete="email" defaultValue="ada@" error="Entrez une adresse courriel, comme nom@exemple.com" errorPrefix="Erreur" />,
              code: `<TextField
  label="Adresse courriel"
  type="email"
  autoComplete="email"
  defaultValue="ada@"
  error="Entrez une adresse courriel, comme nom@exemple.com"
  errorPrefix="Erreur"
/>`,
            },
            {
              title: 'Success word',
              when: 'A translated view that shows a success message.',
              explain: [
                '`successPrefix` replaces the hidden word "Correct" before the message.',
              ],
              render: <TextField label="Mot de passe" type="password" autoComplete="new-password" defaultValue="machine-analytique" success="Respecte la règle des 12 caractères" successPrefix="Correct" />,
              code: `<TextField
  label="Mot de passe"
  type="password"
  autoComplete="new-password"
  defaultValue="machine-analytique"
  success="Respecte la règle des 12 caractères"
  successPrefix="Correct"
/>`,
            },
            {
              title: 'Clear button name',
              when: 'A translated search.',
              explain: [
                '`clearLabel` names the clear button for screen readers. The default is "Clear search" for a search and "Clear" for other types.',
              ],
              render: <TextField label="Rechercher" type="search" defaultValue="Ada" clearLabel="Effacer la recherche" />,
              code: `<TextField label="Rechercher" type="search" defaultValue="Ada" clearLabel="Effacer la recherche" />`,
            },
          ],
        },
        {
          title: 'Content cases',
          kicker: 'The label and the messages wrap. The value scrolls inside the box. The box never changes size.',
          examples: [
            {
              title: 'Long value',
              when: 'A value wider than the box.',
              explain: [
                'The text scrolls inside the box and shows an ellipsis at rest. The box keeps its size.',
                'The full value stays in the input, so copy and paste get all of it.',
              ],
              render: <TextField label="Web address" type="url" defaultValue="https://example.com/a/very/long/path/that/does/not/fit/in/the/box/at/all" />,
              code: `<TextField
  label="Web address"
  type="url"
  defaultValue="https://example.com/a/very/long/path/that/does/not/fit/in/the/box/at/all"
/>`,
            },
            {
              title: 'Long label and description',
              when: 'Translated text runs longer than the column.',
              frame: 'narrow',
              explain: [
                'The label and the description wrap onto more lines. They are never cut.',
                'Cut text hides words from users, and reflow at a narrow width is required (WCAG 1.4.10, AA).',
              ],
              render: <TextField label="Numéro d’assurance sociale de la personne à charge" description="Neuf chiffres, sans espaces ni tirets." />,
              code: `// No truncation: the label and the description wrap.
<TextField
  label="Numéro d’assurance sociale de la personne à charge"
  description="Neuf chiffres, sans espaces ni tirets."
/>`,
            },
            {
              title: 'Long error',
              when: 'An error that runs longer than the column.',
              frame: 'narrow',
              explain: [
                'The message wraps beside its icon. The icon stays at the first line.',
              ],
              render: <TextField label="Email address" type="email" autoComplete="email" defaultValue="ada@" error="Enter an email address, like name@example.com, with no spaces" />,
              code: `<TextField
  label="Email address"
  type="email"
  autoComplete="email"
  defaultValue="ada@"
  error="Enter an email address, like name@example.com, with no spaces"
/>`,
            },
            {
              title: 'On a phone',
              when: 'A narrow screen.',
              frame: 'phone',
              explain: [
                'The field fills the width of its container. Put it in a column and it follows.',
                'On a touch screen the text is 16px. A smaller size would make iOS zoom the page when the field takes focus.',
              ],
              render: <TextField label="Email address" type="email" description="We send the receipt here." required autoComplete="email" />,
              code: `// No width prop: the field fills its container.
<TextField
  label="Email address"
  type="email"
  description="We send the receipt here."
  required
  autoComplete="email"
/>`,
            },
          ],
        },
        {
          title: 'In a form',
          kicker: 'The view decides when to show an error: on blur, then on each input once an error shows.',
          examples: [
            {
              title: 'Validate on blur',
              when: 'Check the value when the user leaves the field.',
              explain: [
                '"Blur" means the field lost focus. Checking then lets the user finish typing first.',
                'Once an error shows, check on each change, so the error goes away as soon as the value is right.',
                'Checking on each key stroke would flag "ada@" as wrong while the user is still typing (Nielsen heuristic 5, error prevention).',
                '`required` still shows the word. Your own check replaces the browser bubble, which is hard to read and to translate.',
              ],
              render: <EmailWithValidation />,
              code: `function EmailWithValidation() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  // An empty string means "no error".
  const validate = (next) =>
    setError(/^\\S+@\\S+\\.\\S+$/.test(next) ? '' : 'Enter an email address, like name@example.com');
  return (
    <TextField
      label="Email address"
      type="email"
      autoComplete="email"
      required
      value={value}
      error={error}
      onChange={(event) => {
        setValue(event.target.value);
        // Re-check on input only once an error shows.
        if (error) validate(event.target.value);
      }}
      // First check: when the user leaves the field.
      onBlur={(event) => validate(event.target.value)}
    />
  );
}`,
            },
            {
              title: 'Move focus to the error',
              when: 'The user submitted a form with a wrong value.',
              explain: [
                '`ref` reaches the `<input>`, so you can call `focus()` on it.',
                'After a failed submit, show the error and focus the field. A keyboard or screen-reader user lands on the problem (WCAG 3.3.1, A).',
                'With several fields, focus the first one that has an error.',
              ],
              render: <FocusOnError />,
              code: `function FocusOnError() {
  // The ref points at the real <input>.
  const name = useRef(null);
  const [error, setError] = useState('');
  return (
    <Stack
      as="form"
      gap={4}
      onSubmit={(event) => {
        event.preventDefault();
        if (name.current.value.trim() !== '') {
          setError('');
          return;
        }
        setError('Enter your full name');
        // Move the keyboard to the problem.
        name.current.focus();
      }}
    >
      <TextField ref={name} label="Full name" autoComplete="name" error={error} />
      <Stack direction="horizontal" justify="end">
        <Button type="submit">Continue</Button>
      </Stack>
    </Stack>
  );
}`,
            },
            {
              title: 'A short form',
              when: 'Several fields in one column, with one main action at the end.',
              explain: [
                '`Stack` with `gap={4}` spaces the fields evenly (`space.4`). One column is faster to scan than two.',
                'One primary button, at the end, with `type="submit"`: Enter sends the form from any field.',
                '`as="form"` makes the stack a real `<form>`.',
              ],
              render: (
                <Stack as="form" gap={4} onSubmit={(event) => event.preventDefault()}>
                  <TextField label="Full name" required autoComplete="name" />
                  <TextField label="Email address" type="email" required autoComplete="email" description="We send the receipt here." />
                  <TextField label="Phone number" type="tel" autoComplete="tel" />
                  <Stack direction="horizontal" justify="end">
                    <Button type="submit">Create account</Button>
                  </Stack>
                </Stack>
              ),
              code: `<Stack as="form" gap={4} onSubmit={handleSubmit}>
  <TextField label="Full name" required autoComplete="name" />
  <TextField
    label="Email address"
    type="email"
    required
    autoComplete="email"
    description="We send the receipt here."
  />
  {/* Optional fields carry no word: only required ones are marked. */}
  <TextField label="Phone number" type="tel" autoComplete="tel" />
  <Stack direction="horizontal" justify="end">
    <Button type="submit">Create account</Button>
  </Stack>
</Stack>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label, description and error are tied to the input with for, id and aria-describedby.',
          examples: [
            {
              title: 'Autocomplete token',
              when: 'Personal data that the browser can fill.',
              explain: [
                'The token names the purpose of the data. The browser fills it from the user profile.',
                'It helps people with motor or memory difficulties (WCAG 1.3.5, AA).',
                'Common tokens: `name`, `email`, `tel`, `street-address`, `postal-code`, `one-time-code`.',
              ],
              render: <TextField label="Street address" autoComplete="street-address" />,
              code: `<TextField label="Street address" autoComplete="street-address" />`,
            },
            {
              title: 'Input mode',
              when: 'A numeric code that is not a number, such as a verification code.',
              explain: [
                '`inputMode="numeric"` shows the digit keyboard on a phone.',
                'The type stays `"text"`, so leading zeros stay and the arrow keys do not change the code.',
                '`autoComplete="one-time-code"` lets the phone offer the code from a text message.',
              ],
              render: <TextField label="Verification code" inputMode="numeric" autoComplete="one-time-code" description="Six digits from the text message." />,
              code: `// Digit keyboard, but still text: "004217" keeps its zeros.
<TextField
  label="Verification code"
  inputMode="numeric"
  autoComplete="one-time-code"
  description="Six digits from the text message."
/>`,
            },
            {
              title: 'Your own id',
              when: 'Another element must point at the input, such as a skip link or an error summary.',
              explain: [
                'By default the component builds a unique id for you. Pass `id` only when something else needs to know it.',
                'The description, the error and the success message derive their ids from it (`signup-email-description`, `signup-email-error`, `signup-email-success`), when the field has one. The label has no id of its own: it points at the input with `for`.',
                'An id must be unique on the page.',
              ],
              render: <TextField label="Email address" type="email" id="signup-email" autoComplete="email" />,
              code: `// A link elsewhere on the page can now point at it: <a href="#signup-email">
<TextField label="Email address" type="email" id="signup-email" autoComplete="email" />`,
            },
          ],
        },
      ]}
    />
  ),
};
