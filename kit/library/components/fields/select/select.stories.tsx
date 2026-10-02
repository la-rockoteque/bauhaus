import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
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
          { name: 'space.control.inline · space.control.gap', tier: '2', use: 'Padding; room kept for the chevron' },
          { name: 'size.control.md · size.icon.md · radius.control', tier: '2', use: 'Height; chevron; corner radius' },
        ],
      }}
      stage={{
        render: (args) =>
          cell(
            <Select
              label={String(args.label)}
              description={String(args.description) || undefined}
              error={String(args.error) || undefined}
              required={args.required === true}
              readOnly={args.readOnly === true}
              disabled={args.disabled === true}
              options={COUNTRIES.slice(0, 3)}
              emptyLabel={String(args.emptyLabel) || undefined}
            />,
          ),
        parts: [
          { n: 1, label: 'Label', note: 'required, always visible', target: '.ds-field__label' },
          { n: 2, label: 'Description', note: 'optional', target: '.ds-field__description' },
          { n: 3, label: 'Select', note: 'native, required', target: '.ds-select__input', at: 'top-start' },
          { n: 4, label: 'Chevron', note: 'decorative', target: '.ds-select__chevron', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Height', property: 'height', target: '.ds-select__input', token: 'size.control.md', value: '32px' },
        { label: 'Padding inline', value: 'space.control.inline, more at the end for the chevron' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-select__input', token: 'space.0', value: '0, the text centres in size.control.md (32px)' },
        { label: 'Radius', property: 'radius', target: '.ds-select__input', token: 'radius.control' },
        { label: 'Chevron', value: 'icon chevron-down, size.icon.md, hidden from assistive technology' },
        { label: 'Options', value: 'the browser list; the page does not style it' },
      ]}
      api={[
        { label: 'label', value: 'As the text field.', control: { kind: 'text', value: 'Country' } },
        { label: 'description', value: 'As the text field.', control: { kind: 'text', value: 'Where you live.' } },
        { label: 'error', value: 'As the text field. It sets aria-invalid.', control: { kind: 'text', value: '' } },
        { label: 'options', value: 'Required. A list of { value, label, disabled? }.' },
        { label: 'emptyLabel', value: 'Text of an empty first choice, such as "Choose a country". Leave it out when a value is always preselected.', control: { kind: 'text', value: 'Choose a country' } },
        { label: 'readOnly', value: 'Keeps the value, sets aria-readonly and blocks the keys and clicks that change it.', control: { kind: 'boolean', value: false } },
        { label: 'required', value: 'As the text field.', control: { kind: 'boolean', value: true } },
        { label: 'requiredText · errorPrefix', value: 'As the text field.' },
        { label: 'disabled', value: 'A native select attribute.', control: { kind: 'boolean', value: false } },
        { label: '…props', value: 'Every other native select attribute, such as value, defaultValue, onChange and ref.' },
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

const COUNTRY_OPTIONS = [
  { value: 'ca', label: 'Canada' },
  { value: 'fr', label: 'France' },
  { value: 'us', label: 'United States' },
];

/** The view owns the value and shows what it means. */
function ShippingSpeed() {
  const [speed, setSpeed] = useState('standard');
  return (
    <Stack gap={2}>
      <Select
        label="Shipping speed"
        value={speed}
        onChange={(event) => setSpeed(event.target.value)}
        options={[
          { value: 'standard', label: 'Standard' },
          { value: 'express', label: 'Express' },
          { value: 'overnight', label: 'Overnight' },
        ]}
      />
      <Text as="p" role="status" variant="caption" tone="muted">{speed === 'standard' ? 'Arrives in five days.' : speed === 'express' ? 'Arrives in two days.' : 'Arrives tomorrow.'}</Text>
    </Stack>
  );
}

/** A required select starts on the empty choice and shows its error when the user leaves it unchosen. */
function RequiredCountry() {
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  return (
    <Select
      label="Country"
      required
      emptyLabel="Choose a country"
      value={country}
      error={error}
      onChange={(event) => {
        setCountry(event.target.value);
        setError('');
      }}
      onBlur={() => setError(country === '' ? 'Choose a country' : '')}
      options={[
        { value: 'ca', label: 'Canada' },
        { value: 'fr', label: 'France' },
        { value: 'us', label: 'United States' },
      ]}
    />
  );
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((label) => ({ value: label.toLowerCase(), label }));

/** The form reads the choice by its `name` when the user submits. */
function ShippingForm() {
  const [summary, setSummary] = useState('');
  return (
    <Stack
      as="form"
      gap={4}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.target as HTMLFormElement);
        setSummary(`Shipping to ${String(data.get('country'))}.`);
      }}
    >
      <Select label="Country" name="country" required emptyLabel="Choose a country" options={COUNTRY_OPTIONS} />
      <Stack direction="horizontal" justify="end">
        <Button type="submit">Continue</Button>
      </Stack>
      <Text as="p" role="status" variant="caption" tone="muted">{summary}</Text>
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Select"
      layer="Component"
      family="Fields"
      imports="import { Select, Stack, Text, Button } from '@bauhaus/design-system';"
      intro={[
        'A select is a drop-down list: the user picks one item from a short list of known choices, such as a country or a size. It renders a native `<select>`.',
        'Native means the browser draws the open list. The keyboard (arrows, Home, End, typing a letter), the screen-reader role and the picker on a phone all come for free (WAI-ARIA APG; WCAG 2.1.1, A).',
        'The data goes in `options`: a list of `{ value, label }`. `value` is what your code reads and the form sends. `label` is what the user sees. Add `disabled: true` to show an option that is not available.',
        'It shares its label, description and error with `TextField` (see that page for the full wiring). The description and the error are tied to the select with `aria-describedby` (an attribute that lists the ids of extra text a screen reader reads after the label).',
        'An `error` sets `aria-invalid="true"` (a flag that tells a screen reader the value is wrong), shows an icon and a hidden "Error:" word.',
        'Use a select for about 15 options or fewer. Two to five options that fit on screen suit a radio group. A long or searchable list suits the combobox.',
      ]}
      guide="fields-select--docs"
      guideName="Select"
      groups={[
        {
          title: 'Start here',
          kicker: 'Choose between an empty choice (the user must pick) and a preselected value (a good default exists).',
          examples: [
            {
              title: 'With an empty choice',
              when: 'The user must make a choice and no answer is a safe default.',
              explain: [
                '`emptyLabel` adds a first option with an empty value. Its text says what to do: "Choose a country".',
                'Without it, the browser would show the first country as if the user had chosen it. Many users would never notice (Nielsen heuristic 5, error prevention).',
                '`options` is a list of `{ value, label }`. The `value` is what the form sends. The `label` is what the user reads.',
              ],
              render: <Select label="Country" emptyLabel="Choose a country" options={COUNTRY_OPTIONS} />,
              code: `// The data: value is sent by the form, label is shown to the user.
const countries = [
  { value: 'ca', label: 'Canada' },
  { value: 'fr', label: 'France' },
  { value: 'us', label: 'United States' },
];

// emptyLabel adds a first option that means "nothing chosen yet".
<Select label="Country" emptyLabel="Choose a country" options={countries} />`,
            },
            {
              title: 'With a preselected value',
              when: 'One option is the honest default, so the field always holds a value.',
              explain: [
                '`defaultValue` picks the option that shows first. Pass the `value` of that option.',
                'Leave `emptyLabel` out: the field never needs an empty choice.',
                'Preselect only when most users would pick that option. A wrong default is easy to overlook.',
              ],
              render: <Select label="Language" defaultValue="en" options={[{ value: 'en', label: 'English' }, { value: 'fr', label: 'Français' }, { value: 'es', label: 'Español' }]} />,
              code: `// defaultValue is the value of the option to show first.
<Select
  label="Language"
  defaultValue="en"
  options={[
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
  ]}
/>`,
            },
            {
              title: 'With a description',
              when: 'The user needs a hint before choosing.',
              explain: [
                'The description sits between the label and the select, so the user reads it first.',
                'It joins the select through `aria-describedby`. A screen reader reads it with the label (WCAG 3.3.2, A).',
              ],
              render: <Select label="Shipping speed" description="Express orders leave the warehouse the same day." emptyLabel="Choose a speed" options={[{ value: 'standard', label: 'Standard' }, { value: 'express', label: 'Express' }]} />,
              code: `<Select
  label="Shipping speed"
  description="Express orders leave the warehouse the same day."
  emptyLabel="Choose a speed"
  options={[
    { value: 'standard', label: 'Standard' },
    { value: 'express', label: 'Express' },
  ]}
/>`,
            },
            {
              title: 'Required',
              when: 'The form cannot go on without a choice.',
              explain: [
                '`required` sets the native attribute, and the label shows the word "(required)". A bare asterisk means nothing to a person who does not know the convention (WCAG 3.3.2, A).',
                'Pair `required` with `emptyLabel`. The empty choice is what the browser checks: with no empty choice, there is always a value and `required` can never fail.',
              ],
              render: <Select label="Country" required emptyLabel="Choose a country" options={COUNTRY_OPTIONS} />,
              code: `// required needs the empty choice, so the form can tell "not chosen" from "chosen".
<Select label="Country" required emptyLabel="Choose a country" options={countries} />`,
            },
          ],
        },
        {
          title: 'Options',
          kicker: 'Each option has a value, a label and an optional disabled flag.',
          examples: [
            {
              title: 'A chosen value',
              when: 'The field shows the option that the user picked before, or that the view loaded.',
              explain: [
                '`defaultValue` selects an option by its `value`. The empty choice stays available if the user wants to undo.',
              ],
              render: <Select label="Country" defaultValue="fr" emptyLabel="Choose a country" options={COUNTRY_OPTIONS} />,
              code: `<Select label="Country" defaultValue="fr" emptyLabel="Choose a country" options={countries} />`,
            },
            {
              title: 'Disabled option',
              when: 'An option exists but is not available now.',
              explain: [
                '`disabled: true` on an option greys it out and the user cannot pick it.',
                'Say why nearby, here in the description. A greyed option with no reason leaves the user guessing (Nielsen heuristic 1, visibility of system status).',
                'Keep the option in the list so the user knows it exists. Remove it if it will never be available.',
              ],
              render: <Select label="Plan" description="Team is full until 1 June." defaultValue="solo" options={[{ value: 'solo', label: 'Solo' }, { value: 'team', label: 'Team', disabled: true }, { value: 'company', label: 'Company' }]} />,
              code: `<Select
  label="Plan"
  // The reason for the disabled option.
  description="Team is full until 1 June."
  defaultValue="solo"
  options={[
    { value: 'solo', label: 'Solo' },
    { value: 'team', label: 'Team', disabled: true },
    { value: 'company', label: 'Company' },
  ]}
/>`,
            },
            {
              title: 'A longer list',
              when: 'Up to about 15 options that the user knows by heart.',
              explain: [
                'Twelve months is a good size. The user can type "J" to jump to January, June or July.',
                'Past 15 options, scrolling is slow. Use the combobox, which filters as the user types (Nielsen heuristic 6, recognition rather than recall).',
                'Build `options` from your data with `map`. Each `value` must be unique.',
              ],
              render: <Select label="Month of birth" emptyLabel="Choose a month" options={MONTHS} />,
              code: `// Build the options from your data. Each value must be unique.
const months = ['January', 'February', 'March' /* ... */].map((label) => ({
  value: label.toLowerCase(),
  label,
}));

<Select label="Month of birth" emptyLabel="Choose a month" options={months} />`,
            },
          ],
        },
        {
          title: 'Read the value',
          kicker: 'The select is a native element: onChange and value work as in React.',
          examples: [
            {
              title: 'Uncontrolled: read it on submit',
              when: 'You need the choice only when the user sends the form.',
              explain: [
                '"Uncontrolled" means the browser holds the choice.',
                '`name` is the key you read on submit. `FormData` collects every named field of the form. It reads the `value` of the chosen option, here `ca`, `fr` or `us`.',
                '`event.preventDefault()` stops the browser from reloading the page.',
              ],
              render: <ShippingForm />,
              code: `function ShippingForm() {
  const [summary, setSummary] = useState('');
  return (
    <Stack
      as="form"
      gap={4}
      onSubmit={(event) => {
        // Stop the browser from reloading the page.
        event.preventDefault();
        // FormData reads every field that has a name.
        const data = new FormData(event.currentTarget);
        setSummary('Shipping to ' + data.get('country') + '.');
      }}
    >
      {/* name = the key you read from FormData */}
      <Select label="Country" name="country" required emptyLabel="Choose a country" options={countries} />
      <Stack direction="horizontal" justify="end">
        <Button type="submit">Continue</Button>
      </Stack>
      {/* role="status" makes a screen reader announce the text when it changes. */}
      <Text as="p" role="status" variant="caption" tone="muted">{summary}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Controlled: react to a change',
              when: 'The view must react to each choice, such as a delivery estimate.',
              explain: [
                '"Controlled" means your state holds the choice. Pass `value` and update it in `onChange`.',
                '`event.target.value` is the `value` of the chosen option, not its label.',
                'The status line uses `role="status"`: a screen reader announces the new estimate without moving focus (WCAG 4.1.3, AA).',
              ],
              render: <ShippingSpeed />,
              code: `function ShippingSpeed() {
  const [speed, setSpeed] = useState('standard');
  // Look up the text for each value.
  const estimates = {
    standard: 'Arrives in five days.',
    express: 'Arrives in two days.',
    overnight: 'Arrives tomorrow.',
  };
  return (
    <Stack gap={2}>
      <Select
        label="Shipping speed"
        value={speed}
        // The value of the chosen option, such as 'express'.
        onChange={(event) => setSpeed(event.target.value)}
        options={[
          { value: 'standard', label: 'Standard' },
          { value: 'express', label: 'Express' },
          { value: 'overnight', label: 'Overnight' },
        ]}
      />
      <Text as="p" role="status" variant="caption" tone="muted">{estimates[speed]}</Text>
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
              title: 'Error',
              when: 'The user left the empty choice. Name the field and the fix.',
              explain: [
                'Pass the message as `error`. Its presence sets `aria-invalid="true"`, adds the message to `aria-describedby` and shows an error icon.',
                'A hidden word "Error:" comes before the message, so a screen reader says it is an error (WCAG 3.3.1, A).',
                'The icon and the text carry the meaning. The red border alone would miss people who cannot tell the colours apart (WCAG 1.4.1, A).',
              ],
              render: <Select label="Country" required emptyLabel="Choose a country" error="Choose a country" options={COUNTRY_OPTIONS} />,
              code: `// Pass the message, not a boolean. An empty string means "no error".
<Select
  label="Country"
  required
  emptyLabel="Choose a country"
  error="Choose a country"
  options={countries}
/>`,
            },
            {
              title: 'Disabled',
              when: 'The user cannot change the choice now.',
              explain: [
                '`disabled` is the native attribute. The select leaves the tab order and the form does not send its value.',
                'Say why in the description. A dimmed field with no reason confuses people (Nielsen heuristic 1, visibility of system status).',
                'If the choice must still be sent, use `readOnly` instead.',
              ],
              render: <Select label="Currency" description="Set by the country of your account." disabled defaultValue="cad" options={[{ value: 'cad', label: 'Canadian dollar' }, { value: 'eur', label: 'Euro' }]} />,
              code: `<Select
  label="Currency"
  // The reason the user cannot change it.
  description="Set by the country of your account."
  disabled
  defaultValue="cad"
  options={[
    { value: 'cad', label: 'Canadian dollar' },
    { value: 'eur', label: 'Euro' },
  ]}
/>`,
            },
            {
              title: 'Read-only',
              when: 'The user can focus and read the choice but not change it.',
              explain: [
                'HTML has no `readonly` for a `<select>`. The component sets `aria-readonly` and cancels the keys and clicks that would open the list.',
                'Tab still works, so a keyboard user can focus the field and read it. The form still sends the value.',
                'If the user need not reach the value at all, show plain text instead.',
              ],
              render: <Select label="Country" readOnly defaultValue="ca" options={COUNTRY_OPTIONS} />,
              code: `// Focusable and readable, sent with the form, but the list does not open.
<Select label="Country" readOnly defaultValue="ca" options={countries} />`,
            },
          ],
        },
        {
          title: 'Other languages',
          kicker: 'The field holds no text of its own except two default words. Pass the words of your language.',
          examples: [
            {
              title: 'Required word',
              when: 'A translated view.',
              explain: [
                '`requiredText` replaces the word "required" after the label.',
                'Translate the label, the description, the empty choice and the option labels the same way. They are all props.',
              ],
              render: <Select label="Pays" required requiredText="obligatoire" emptyLabel="Choisissez un pays" options={[{ value: 'ca', label: 'Canada' }, { value: 'fr', label: 'France' }, { value: 'us', label: 'États-Unis' }]} />,
              code: `<Select
  label="Pays"
  required
  requiredText="obligatoire"
  emptyLabel="Choisissez un pays"
  options={[
    { value: 'ca', label: 'Canada' },
    { value: 'fr', label: 'France' },
    { value: 'us', label: 'États-Unis' },
  ]}
/>`,
            },
            {
              title: 'Error word',
              when: 'A translated view that shows an error.',
              explain: [
                '`errorPrefix` replaces the hidden word "Error" that a screen reader says before the message.',
                'Without it, a French screen reader would say "Error" in the middle of French text.',
              ],
              render: <Select label="Pays" emptyLabel="Choisissez un pays" error="Choisissez un pays" errorPrefix="Erreur" options={[{ value: 'ca', label: 'Canada' }, { value: 'fr', label: 'France' }]} />,
              code: `<Select
  label="Pays"
  emptyLabel="Choisissez un pays"
  error="Choisissez un pays"
  errorPrefix="Erreur"
  options={[
    { value: 'ca', label: 'Canada' },
    { value: 'fr', label: 'France' },
  ]}
/>`,
            },
          ],
        },
        {
          title: 'Content cases',
          kicker: 'The chosen text shortens with an ellipsis in the box. The browser list shows it in full.',
          examples: [
            {
              title: 'Long option label',
              when: 'An option longer than the box.',
              explain: [
                'The box shortens the chosen text with an ellipsis (…). The open list, drawn by the browser, shows it in full.',
                'Put the key words first, so the short form still tells the options apart.',
              ],
              render: <Select label="Plan" defaultValue="annual" options={[{ value: 'annual', label: 'Annual plan, billed once a year, with priority support and a dedicated account manager' }, { value: 'monthly', label: 'Monthly plan' }]} />,
              code: `// Key words first: "Annual plan" survives the ellipsis.
<Select
  label="Plan"
  defaultValue="annual"
  options={[
    { value: 'annual', label: 'Annual plan, billed once a year, with priority support and a dedicated account manager' },
    { value: 'monthly', label: 'Monthly plan' },
  ]}
/>`,
            },
            {
              title: 'Long label and description',
              when: 'Translated text runs longer than the column.',
              frame: 'narrow',
              explain: [
                'The label and the description wrap onto more lines. They are never cut.',
                'Reflow at a narrow width is required (WCAG 1.4.10, AA).',
              ],
              render: <Select label="Pays de résidence fiscale principale" description="Choisissez le pays où vous payez vos impôts." emptyLabel="Choisissez un pays" options={[{ value: 'ca', label: 'Canada' }, { value: 'fr', label: 'France' }]} />,
              code: `// No truncation: the label and the description wrap.
<Select
  label="Pays de résidence fiscale principale"
  description="Choisissez le pays où vous payez vos impôts."
  emptyLabel="Choisissez un pays"
  options={countries}
/>`,
            },
            {
              title: 'Long error',
              when: 'An error that runs longer than the column.',
              frame: 'narrow',
              explain: [
                'The message wraps beside its icon. The icon stays at the first line.',
              ],
              render: <Select label="Country" emptyLabel="Choose a country" error="Choose the country where your card was issued" options={COUNTRY_OPTIONS} />,
              code: `<Select
  label="Country"
  emptyLabel="Choose a country"
  error="Choose the country where your card was issued"
  options={countries}
/>`,
            },
            {
              title: 'On a phone',
              when: 'A narrow screen.',
              frame: 'phone',
              explain: [
                'The field fills the width of its container.',
                'The phone shows its own picker, built for thumbs. This is the main reason to keep the native element.',
              ],
              render: <Select label="Country" required emptyLabel="Choose a country" options={COUNTRY_OPTIONS} />,
              code: `// No width prop: the field fills its container.
<Select label="Country" required emptyLabel="Choose a country" options={countries} />`,
            },
          ],
        },
        {
          title: 'In a form',
          kicker: 'The view decides when to show an error.',
          examples: [
            {
              title: 'Validate on blur',
              when: 'A required select shows its error once the user leaves it with no choice.',
              explain: [
                '"Blur" means the field lost focus. Checking then does not flag a field the user has not reached yet.',
                'A choice clears the error at once. The user sees that the fix worked.',
                'Say the fix: "Choose a country" (WCAG 3.3.3, AA).',
                'The check compares with `\'\'`, the value of the empty choice.',
              ],
              render: <RequiredCountry />,
              code: `function RequiredCountry() {
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  return (
    <Select
      label="Country"
      required
      emptyLabel="Choose a country"
      value={country}
      error={error}
      onChange={(event) => {
        setCountry(event.target.value);
        // A choice fixes the problem: clear the error at once.
        setError('');
      }}
      // The empty choice has the value ''.
      onBlur={() => setError(country === '' ? 'Choose a country' : '')}
      options={countries}
    />
  );
}`,
            },
            {
              title: 'An address form',
              when: 'A select among other fields, with one main action at the end.',
              explain: [
                '`Stack` with `gap={4}` spaces the fields evenly (`space.4`). One column is faster to scan than two.',
                'The first select needs a choice, so it has an empty choice. The second has a safe default, so it has none.',
                'One primary button, at the end, with `type="submit"`.',
              ],
              render: (
                <Stack as="form" gap={4} onSubmit={(event) => event.preventDefault()}>
                  <Select label="Country" name="country" required emptyLabel="Choose a country" options={COUNTRY_OPTIONS} />
                  <Select label="Delivery" name="delivery" defaultValue="standard" options={[{ value: 'standard', label: 'Standard' }, { value: 'express', label: 'Express' }]} />
                  <Stack direction="horizontal" justify="end">
                    <Button type="submit">Continue to payment</Button>
                  </Stack>
                </Stack>
              ),
              code: `<Stack as="form" gap={4} onSubmit={handleSubmit}>
  {/* No safe default: the user must choose. */}
  <Select label="Country" name="country" required emptyLabel="Choose a country" options={countries} />
  {/* Standard is a safe default: no empty choice. */}
  <Select
    label="Delivery"
    name="delivery"
    defaultValue="standard"
    options={[
      { value: 'standard', label: 'Standard' },
      { value: 'express', label: 'Express' },
    ]}
  />
  <Stack direction="horizontal" justify="end">
    <Button type="submit">Continue to payment</Button>
  </Stack>
</Stack>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label, description and error are tied to the select with for, id and aria-describedby.',
          examples: [
            {
              title: 'Autocomplete token',
              when: 'Personal data that the browser can fill.',
              explain: [
                'The token names the purpose of the data. The browser picks the matching option from the user profile.',
                'It helps people with motor or memory difficulties (WCAG 1.3.5, AA).',
              ],
              render: <Select label="Country" autoComplete="country" emptyLabel="Choose a country" options={COUNTRY_OPTIONS} />,
              code: `<Select label="Country" autoComplete="country" emptyLabel="Choose a country" options={countries} />`,
            },
            {
              title: 'Your own id',
              when: 'Another element must point at the select, such as a skip link or an error summary.',
              explain: [
                'By default the component builds a unique id for you. Pass `id` only when something else needs to know it.',
                'The description and the error derive their ids from it, when the field has one. The label has no id of its own: it points at the select with `for`.',
                'An id must be unique on the page.',
              ],
              render: <Select label="Billing country" id="billing-country" emptyLabel="Choose a country" options={COUNTRY_OPTIONS} />,
              code: `// A link elsewhere on the page can now point at it: <a href="#billing-country">
<Select label="Billing country" id="billing-country" emptyLabel="Choose a country" options={countries} />`,
            },
          ],
        },
      ]}
    />
  ),
};
