import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { Combobox, ForceOpenContext } from './combobox';
import { comboboxRules } from './combobox.rules';

// The showcase: one page story. The state matrix replaces one story per state.
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

/** A cell with room under the input for the open list. The provider keeps the list open. */
const OpenCell = ({ children }: { children: ReactNode }) => (
  <ForceOpenContext value>
    <div style={{ inlineSize: '100%', maxInlineSize: 'calc(var(--ds-space-12) * 6)', minBlockSize: 'calc(var(--ds-space-12) * 5)' }}>{children}</div>
  </ForceOpenContext>
);

/** Adds a forced-state class to the first match of `target`, so the real rule paints it. The class must reach an inner element the component does not expose. */
function Force({ cls, target, children }: { cls: string; target: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.querySelector(target)?.classList.add(cls);
  }, [cls, target]);
  return <div ref={box}>{children}</div>;
}

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
          { name: 'size.control.md · size.overlay.md · size.icon.sm', tier: '2', use: 'Option and toggle (32px, above the 24px target floor); popup maximum height; check mark' },
          { name: 'radius.control · radius.overlay · motion.duration.fast', tier: '2', use: 'Corners; popup fade' },
        ],
      }}
      stage={{
        render: (args) =>
          cell(
            <Combobox
              label={String(args.label)}
              description={String(args.description) || undefined}
              error={String(args.error) || undefined}
              placeholder={String(args.placeholder) || undefined}
              required={args.required === true}
              disabled={args.disabled === true}
              readOnly={args.readOnly === true}
              options={COUNTRIES}
            />,
          ),
        parts: [
          { n: 1, label: 'Label', note: 'required, always visible', target: '.ds-field__label' },
          { n: 2, label: 'Description', note: 'optional', target: '.ds-field__description' },
          { n: 3, label: 'Input', note: 'holds focus, role combobox', target: '.ds-combobox__input', at: 'top-start' },
          { n: 4, label: 'Toggle button', note: 'opens the list', target: '.ds-combobox__button', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Input height', property: 'height', target: '.ds-combobox__input', token: 'size.control.md', value: 'as the text field' },
        { label: 'Input padding block', property: 'padding-block', target: '.ds-combobox__input', token: 'space.0', value: '0, the text centres in size.control.md' },
        { label: 'Input radius', property: 'radius', target: '.ds-combobox__input', token: 'radius.control' },
        { label: 'Toggle width', property: 'width', target: '.ds-combobox__button', token: 'size.control.md', value: 'at the end of the input, chevron-down, turns over when open' },
        { label: 'Toggle radius', property: 'radius', target: '.ds-combobox__button', token: 'radius.control' },
        { label: 'Popup', value: 'width of the input · max size.overlay.md high, scrolls · overlay.surface · shadow.1 · z.dropdown' },
        { label: 'Option', token: 'size.control.md', value: 'at least 32px high · check mark for the selected one' },
        { label: 'Focus', value: 'stays in the input; the active option is set with aria-activedescendant' },
      ]}
      api={[
        { label: 'label', value: 'As the text field.', control: { kind: 'text', value: 'Country' } },
        { label: 'description', value: 'As the text field.', control: { kind: 'text', value: 'Start typing.' } },
        { label: 'error', value: 'As the text field. It sets aria-invalid.', control: { kind: 'text', value: '' } },
        { label: 'options', value: 'Required. A list of { id, label, disabled? }.' },
        { label: 'selectedKey · defaultSelectedKey · onSelectionChange', value: 'The chosen option id.' },
        { label: 'inputValue · defaultInputValue · onInputChange', value: 'The typed text.' },
        { label: 'emptyText · loading · loadingText', value: 'Text in the list when nothing matches, or while options load.' },
        { label: 'placeholder', value: 'A hint inside the input. Never the label.', control: { kind: 'text', value: '' } },
        { label: 'required', value: 'As native fields.', control: { kind: 'boolean', value: true } },
        { label: 'disabled', value: 'As native fields.', control: { kind: 'boolean', value: false } },
        { label: 'readOnly', value: 'As native fields.', control: { kind: 'boolean', value: false } },
        { label: 'name', value: 'As native fields.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} placeholder="Start typing" />), trigger: 'no text' },
          { id: 'loading', status: 'designed', render: <OpenCell><Combobox label="Country" options={[]} loading loadingText="Loading countries" defaultInputValue="C" /></OpenCell>, trigger: 'loading', note: 'The list says so; aria-busy is set.' },
          { id: 'none', status: 'designed', render: <OpenCell><Combobox label="Country" options={COUNTRIES} emptyText="No country found" defaultInputValue="zzz" /></OpenCell>, trigger: 'no match', note: 'Text, not an empty box.' },
          { id: 'one', status: 'n/a', reason: 'A single match is an ordinary list of one option.' },
          { id: 'some', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="fr" />), trigger: 'selected', note: 'The input shows the chosen label.' },
          { id: 'too-many', status: 'designed', label: 'Too many (60 options)', render: cell(<Combobox label="Option" options={MANY} defaultInputValue="Option 1" />), trigger: 'many options', note: 'Typing narrows the list; the popup scrolls.' },
          { id: 'incorrect', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} error="Choose a country from the list." defaultInputValue="Atlantis" />), trigger: 'error' },
          { id: 'correct', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="ca" />), trigger: 'error cleared' },
          { id: 'done', status: 'n/a', reason: 'Saving belongs to the form.' },
          { id: 'default', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="ca" />), trigger: 'rest' },
          { id: 'hover', status: 'designed', render: cell(<Force cls="doc-force-hover" target=".ds-field__control"><Combobox label="Country" options={COUNTRIES} defaultSelectedKey="ca" /></Force>), trigger: ':hover', note: 'Forced on the input. The border takes field.border-hover.' },
          { id: 'focus-visible', status: 'designed', render: cell(<Force cls="doc-force-focus" target=".ds-field__control"><Combobox label="Country" options={COUNTRIES} defaultSelectedKey="ca" /></Force>), trigger: ':focus-visible', note: 'Forced on the input. Border and ring.' },
          { id: 'active', status: 'n/a', reason: 'Typing is the feedback. The pressed look belongs to the toggle and the options.' },
          { id: 'disabled', status: 'designed', render: cell(<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="ca" disabled description="Set by your plan." />), trigger: 'disabled' },
          { id: 'selected', status: 'designed', render: <OpenCell><Combobox label="Country" options={COUNTRIES} defaultSelectedKey="cl" defaultInputValue="C" /></OpenCell>, trigger: 'selected option', note: 'The chosen option has a fill and a check mark.' },
          { id: 'read-only', status: 'designed', group: 'interaction', render: cell(<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="ca" readOnly />), trigger: 'readOnly' },
          { id: 'required', status: 'designed', group: 'interaction', render: cell(<Combobox label="Country" options={COUNTRIES} required />), trigger: 'required' },
          { id: 'expanded', status: 'designed', group: 'interaction', render: <OpenCell><Combobox label="Country" options={COUNTRIES} defaultInputValue="C" /></OpenCell>, trigger: 'open', note: 'Input, toggle turned over, popup with an active option. Disabled option dimmed.' },
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
      guide="fields-combobox--docs"
      guideName="Combobox"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Combobox" layer="Component" family="Fields" rules={comboboxRules} guide="fields-combobox--docs" guideName="Combobox" />,
};

const CITIES = [
  { id: 'mtl', label: 'Montréal' },
  { id: 'qc', label: 'Québec' },
  { id: 'ott', label: 'Ottawa' },
  { id: 'tor', label: 'Toronto' },
  { id: 'van', label: 'Vancouver' },
];

/** The view owns the selection and reacts to it. */
function CityPicker() {
  const [city, setCity] = useState<string | null>('qc');
  const name = CITIES.find((option) => option.id === city)?.label;
  return (
    <Stack gap={2}>
      <Combobox label="City" options={CITIES} selectedKey={city} onSelectionChange={setCity} />
      <Text as="p" role="status" variant="caption" tone="muted">{name ? `Delivering to ${name}.` : 'No city chosen.'}</Text>
    </Stack>
  );
}

/** The server filters. The view keeps inputValue controlled, sets loading while it fetches, and passes the new options. */
function ServerSearch() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState<readonly { id: string; label: string }[]>([]);
  const search = (next: string) => {
    setText(next);
    if (next === '') {
      setFound([]);
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setFound(CITIES.filter((city) => city.label.toLowerCase().includes(next.toLowerCase())));
      setLoading(false);
    }, 800);
  };
  return <Combobox label="Delivery city" description="Type two letters or more." options={found} inputValue={text} onInputChange={search} loading={loading} />;
}

/** A required combobox shows its error when the user leaves it with no choice. */
function RequiredCity() {
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState('');
  return (
    <Combobox
      label="City"
      required
      options={CITIES}
      selectedKey={city}
      error={error}
      onSelectionChange={(key) => {
        setCity(key);
        setError(key === null ? 'Choose a city from the list' : '');
      }}
    />
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Combobox"
      layer="Component"
      family="Fields"
      imports="import { Combobox, Stack, Text, Button } from '@acme/design-system';"
      guide="fields-combobox--docs"
      guideName="Combobox"
      groups={[
        {
          title: 'Basics',
          kicker: 'Type to filter a long list. Focus stays in the input; the list opens on Down or on the toggle button.',
          examples: [
            { title: 'Label only', when: 'A long list where typing finds the item faster than scrolling.', render: <Combobox label="Country" options={COUNTRIES} /> },
            { title: 'With a placeholder', when: 'Show a sample of what to type. The label still names the field.', render: <Combobox label="City" placeholder="Start typing a city" options={CITIES} /> },
            { title: 'With a description', when: 'The user needs a hint before typing.', render: <Combobox label="Country" description="Where your card was issued." options={COUNTRIES} /> },
            { title: 'Required', when: 'The form cannot go on without a choice. The marker is a word, not an asterisk.', render: <Combobox label="City" required options={CITIES} /> },
            { title: 'Required, in another language', when: 'Change the word of the marker with requiredText for a translated view.', render: <Combobox label="Ville" required requiredText="obligatoire" options={CITIES} /> },
            { title: 'Name for a form', when: 'Give the field a name so a native form submits the chosen key.', render: <Combobox label="Country" name="country" options={COUNTRIES} /> },
          ],
        },
        {
          title: 'Options',
          kicker: 'Each option has an id, a label and an optional disabled flag.',
          examples: [
            { title: 'Disabled option', when: 'An option exists but is not available now. Say why nearby.', render: <Combobox label="Country" description="Italy is closed for new orders." options={COUNTRIES} /> },
            { title: 'Many options', when: 'Dozens of options: the list scrolls and the typed text narrows it.', render: <Combobox label="Seat number" options={MANY} /> },
            { title: 'Starts with a choice', when: 'The field holds a value the user chose before, or one the view loaded.', render: <Combobox label="City" options={CITIES} defaultSelectedKey="mtl" /> },
            { title: 'Starts with typed text', when: 'Open the field on a search the user left half done.', render: <Combobox label="City" options={CITIES} defaultInputValue="Mon" /> },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props. A really open list is the user own action.',
          examples: [
            { title: 'Error', when: 'The user left the field with no valid choice. Name the field and the fix.', render: <Combobox label="City" required options={CITIES} defaultInputValue="Mon" error="Choose a city from the list" /> },
            { title: 'Error, in another language', when: 'Change the hidden word before the error with errorPrefix.', render: <Combobox label="Ville" options={CITIES} error="Choisissez une ville dans la liste" errorPrefix="Erreur" /> },
            { title: 'No match', when: 'The typed text matches nothing. The list says so; change the words with emptyText.', render: <Combobox label="City" options={CITIES} defaultInputValue="Zzz" emptyText="No city matches your search" /> },
            { title: 'Loading', when: 'The view is fetching options. The list says so and the field sets aria-busy. Change the words with loadingText.', render: <Combobox label="Delivery city" options={[]} loading loadingText="Searching cities" /> },
            { title: 'Disabled', when: 'The user cannot change the choice now. Say why in the description.', render: <Combobox label="City" description="Pick a country first." options={CITIES} disabled /> },
            { title: 'Read-only', when: 'The user can focus and read the choice but not change it.', render: <Combobox label="City" options={CITIES} defaultSelectedKey="mtl" readOnly /> },
          ],
        },
        {
          title: 'Open list',
          kicker: 'The list is a popup under the input. These pictures keep it open so the options can be seen.',
          examples: [
            {
              title: 'Options matching the text',
              when: 'The list narrows to the options that contain the typed text.',
              render: (
                <ForceOpenContext value>
                  <Combobox label="Country" options={COUNTRIES} defaultInputValue="an" />
                </ForceOpenContext>
              ),
              code: `<Combobox label="Country" options={COUNTRIES} />`,
            },
            {
              title: 'Chosen and disabled options',
              when: 'The chosen option has a check; the disabled one is dimmed.',
              render: (
                <ForceOpenContext value>
                  <Combobox label="Country" options={COUNTRIES} defaultSelectedKey="fr" defaultInputValue="" />
                </ForceOpenContext>
              ),
              code: `<Combobox label="Country" options={COUNTRIES} defaultSelectedKey="fr" />`,
            },
          ],
        },
        {
          title: 'Controlled and uncontrolled',
          kicker: 'The selection and the typed text can each be controlled.',
          examples: [
            { title: 'Uncontrolled', when: 'The component holds the choice; read it from the form on submit.', render: <Combobox label="City" name="city" options={CITIES} defaultSelectedKey="ott" /> },
            {
              title: 'Controlled selection',
              when: 'The view owns the choice and reacts to it, such as a delivery estimate.',
              render: <CityPicker />,
              code: `function CityPicker() {
  const [city, setCity] = useState<string | null>('qc');
  const name = CITIES.find((option) => option.id === city)?.label;
  return (
    <Stack gap={2}>
      <Combobox label="City" options={CITIES} selectedKey={city} onSelectionChange={setCity} />
      <Text as="p" role="status" variant="caption" tone="muted">{name ? \`Delivering to \${name}.\` : 'No city chosen.'}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Search on the server',
              when: 'The list is too long to ship. Keep the typed text controlled, fetch on input and pass the new options.',
              render: <ServerSearch />,
              code: `function ServerSearch() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState<readonly ComboboxOption[]>([]);
  const search = async (next: string) => {
    setText(next);
    setLoading(true);
    setFound(await fetchCities(next));
    setLoading(false);
  };
  return <Combobox label="Delivery city" description="Type two letters or more." options={found} inputValue={text} onInputChange={search} loading={loading} />;
}`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'Labels wrap. The input keeps one line.',
          examples: [
            { title: 'Long option label', when: 'An option longer than the box: the list shows the label in full.', render: <Combobox label="Plan" options={[{ id: 'annual', label: 'Annual plan, billed once a year, with priority support and a dedicated account manager' }, { id: 'monthly', label: 'Monthly plan' }]} defaultSelectedKey="annual" /> },
            { title: 'Long label and description in a narrow column', when: 'Translated text runs longer: both wrap rather than truncate.', frame: 'narrow', render: <Combobox label="Ville de livraison principale de la commande" description="Tapez le début du nom pour filtrer la liste." options={CITIES} /> },
            { title: 'Error in a narrow column', when: 'The error wraps below its icon and stays whole.', frame: 'narrow', render: <Combobox label="City" options={CITIES} error="Choose a city from the list, not a free text" /> },
            { title: 'On a phone', when: 'The field fills the width of its container.', frame: 'phone', render: <Combobox label="City" required options={CITIES} placeholder="Start typing a city" /> },
          ],
        },
        {
          title: 'In a form',
          examples: [
            {
              title: 'Required, with an error',
              when: 'A required combobox shows its error when the user clears the choice, and drops it on a new choice.',
              render: <RequiredCity />,
              code: `function RequiredCity() {
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState('');
  return (
    <Combobox
      label="City"
      required
      options={CITIES}
      selectedKey={city}
      error={error}
      onSelectionChange={(key) => {
        setCity(key);
        setError(key === null ? 'Choose a city from the list' : '');
      }}
    />
  );
}`,
            },
            {
              title: 'An address form',
              when: 'A combobox among other fields, with one primary action at the end.',
              render: (
                <Stack as="form" gap={4} onSubmit={(event) => event.preventDefault()}>
                  <Combobox label="Country" name="country" required options={COUNTRIES} />
                  <Combobox label="City" name="city" required options={CITIES} />
                  <Stack direction="horizontal" justify="end">
                    <Button type="submit">Continue to payment</Button>
                  </Stack>
                </Stack>
              ),
            },
          ],
        },
      ]}
    />
  ),
};
