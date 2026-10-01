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

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Select"
      layer="Component"
      family="Fields"
      imports="import { Select, Stack, Text, Button } from '@acme/design-system';"
      guide="fields-select--docs"
      guideName="Select"
      groups={[
        {
          title: 'Basics',
          kicker: 'One choice from a short list. The browser draws the open list.',
          examples: [
            { title: 'With a preselected value', when: 'One option is the honest default, so the field always holds a value.', render: <Select label="Language" defaultValue="en" options={[{ value: 'en', label: 'English' }, { value: 'fr', label: 'Français' }, { value: 'es', label: 'Español' }]} /> },
            { title: 'With an empty choice', when: 'The user must pick. The first option says what to do.', render: <Select label="Country" emptyLabel="Choose a country" options={COUNTRY_OPTIONS} /> },
            { title: 'With a description', when: 'The user needs a hint before choosing.', render: <Select label="Shipping speed" description="Express orders leave the warehouse the same day." emptyLabel="Choose a speed" options={[{ value: 'standard', label: 'Standard' }, { value: 'express', label: 'Express' }]} /> },
            { title: 'Required', when: 'The form cannot go on without a choice. Pair required with the empty choice, so the form can tell not chosen from chosen.', render: <Select label="Country" required emptyLabel="Choose a country" options={COUNTRY_OPTIONS} /> },
            { title: 'Required, in another language', when: 'Change the word of the marker with requiredText for a translated view.', render: <Select label="Pays" required requiredText="obligatoire" emptyLabel="Choisissez un pays" options={[{ value: 'ca', label: 'Canada' }, { value: 'fr', label: 'France' }, { value: 'us', label: 'États-Unis' }]} /> },
          ],
        },
        {
          title: 'Options',
          kicker: 'Each option has a value, a label and an optional disabled flag.',
          examples: [
            { title: 'With a chosen value', when: 'The field shows the option the user picked or the view loaded.', render: <Select label="Country" defaultValue="fr" emptyLabel="Choose a country" options={COUNTRY_OPTIONS} /> },
            { title: 'Disabled option', when: 'An option exists but is not available now. Say why nearby.', render: <Select label="Plan" description="Team is full until 1 June." defaultValue="solo" options={[{ value: 'solo', label: 'Solo' }, { value: 'team', label: 'Team', disabled: true }, { value: 'company', label: 'Company' }]} /> },
            { title: 'Name for a form', when: 'Give the field a name so a native form submits its value.', render: <Select label="Country" name="country" emptyLabel="Choose a country" options={COUNTRY_OPTIONS} /> },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props. The native attributes do the work.',
          examples: [
            { title: 'Error', when: 'The user left the empty choice. Name the field and the fix.', render: <Select label="Country" required emptyLabel="Choose a country" error="Choose a country" options={COUNTRY_OPTIONS} /> },
            { title: 'Error, in another language', when: 'Change the hidden word before the error with errorPrefix.', render: <Select label="Pays" emptyLabel="Choisissez un pays" error="Choisissez un pays" errorPrefix="Erreur" options={[{ value: 'ca', label: 'Canada' }, { value: 'fr', label: 'France' }]} /> },
            { title: 'Disabled', when: 'The user cannot change the choice now. Say why in the description.', render: <Select label="Currency" description="Set by the country of your account." disabled defaultValue="cad" options={[{ value: 'cad', label: 'Canadian dollar' }, { value: 'eur', label: 'Euro' }]} /> },
            { title: 'Read-only', when: 'The user can focus and read the value but not change it. The keys and clicks that open the list are cancelled.', render: <Select label="Country" readOnly defaultValue="ca" options={COUNTRY_OPTIONS} /> },
          ],
        },
        {
          title: 'Content',
          kicker: 'The chosen text shortens with an ellipsis in the box. The browser list shows it in full.',
          examples: [
            { title: 'Long option label', when: 'An option longer than the box: the box shortens it, the list does not.', render: <Select label="Plan" defaultValue="annual" options={[{ value: 'annual', label: 'Annual plan, billed once a year, with priority support and a dedicated account manager' }, { value: 'monthly', label: 'Monthly plan' }]} /> },
            { title: 'Long label and description in a narrow column', when: 'Translated text runs longer: the label and the description wrap rather than truncate.', frame: 'narrow', render: <Select label="Pays de résidence fiscale principale" description="Choisissez le pays où vous payez vos impôts." emptyLabel="Choisissez un pays" options={[{ value: 'ca', label: 'Canada' }, { value: 'fr', label: 'France' }]} /> },
            { title: 'Error in a narrow column', when: 'The error wraps below its icon and stays whole.', frame: 'narrow', render: <Select label="Country" emptyLabel="Choose a country" error="Choose the country where your card was issued" options={COUNTRY_OPTIONS} /> },
            { title: 'On a phone', when: 'The field fills the width of its container, and the phone shows its own picker.', frame: 'phone', render: <Select label="Country" required emptyLabel="Choose a country" options={COUNTRY_OPTIONS} /> },
          ],
        },
        {
          title: 'Controlled and uncontrolled',
          kicker: 'The select is a native element: onChange and value work as in React.',
          examples: [
            { title: 'Uncontrolled', when: 'The browser holds the choice; read it from the form on submit.', render: <Select label="Country" name="country" defaultValue="ca" options={COUNTRY_OPTIONS} /> },
            {
              title: 'Controlled',
              when: 'The view owns the value and reacts to a change, such as a delivery estimate.',
              render: <ShippingSpeed />,
              code: `function ShippingSpeed() {
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
      <Text as="p" role="status" variant="caption" tone="muted">{estimate(speed)}</Text>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'In a form',
          examples: [
            {
              title: 'Validate on blur',
              when: 'A required select shows its error once the user leaves it unchosen, and clears it on a choice.',
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
}`,
            },
            {
              title: 'An address form',
              when: 'A select among other fields, with one primary action at the end.',
              render: (
                <Stack as="form" gap={4} onSubmit={(event) => event.preventDefault()}>
                  <Select label="Country" name="country" required emptyLabel="Choose a country" options={COUNTRY_OPTIONS} />
                  <Select label="Delivery" name="delivery" defaultValue="standard" options={[{ value: 'standard', label: 'Standard' }, { value: 'express', label: 'Express' }]} />
                  <Stack direction="horizontal" justify="end">
                    <Button type="submit">Continue to payment</Button>
                  </Stack>
                </Stack>
              ),
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label, description and error are tied to the select with for, id and aria-describedby.',
          examples: [
            { title: 'Autocomplete token', when: 'Personal data: name the purpose so the browser can fill the field.', render: <Select label="Country" autoComplete="country" emptyLabel="Choose a country" options={COUNTRY_OPTIONS} /> },
            { title: 'Your own id', when: 'Another element must point to the select, such as a skip link or an error summary.', render: <Select label="Country" id="billing-country" emptyLabel="Choose a country" options={COUNTRY_OPTIONS} /> },
          ],
        },
      ]}
    />
  ),
};
