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
  { id: 'ar', label: 'Argentina' },
  { id: 'au', label: 'Australia' },
  { id: 'be', label: 'Belgium' },
  { id: 'br', label: 'Brazil' },
  { id: 'ca', label: 'Canada' },
  { id: 'cl', label: 'Chile' },
  { id: 'cn', label: 'China' },
  { id: 'dk', label: 'Denmark' },
  { id: 'eg', label: 'Egypt' },
  { id: 'fi', label: 'Finland' },
  { id: 'fr', label: 'France' },
  { id: 'de', label: 'Germany' },
  { id: 'gr', label: 'Greece' },
  { id: 'in', label: 'India' },
  { id: 'ie', label: 'Ireland' },
  { id: 'it', label: 'Italy', disabled: true },
  { id: 'jp', label: 'Japan' },
  { id: 'ke', label: 'Kenya' },
  { id: 'mx', label: 'Mexico' },
  { id: 'ma', label: 'Morocco' },
  { id: 'nl', label: 'Netherlands' },
  { id: 'no', label: 'Norway' },
  { id: 'pt', label: 'Portugal' },
  { id: 'es', label: 'Spain' },
  { id: 'se', label: 'Sweden' },
];
/** Five countries, so a forced-open picture shows the chosen and the disabled option together. */
const FEW_COUNTRIES = COUNTRIES.filter((country) => ['ca', 'cl', 'fr', 'de', 'it'].includes(country.id));
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
  { id: 'cgy', label: 'Calgary' },
  { id: 'edm', label: 'Edmonton' },
  { id: 'wpg', label: 'Winnipeg' },
  { id: 'hfx', label: 'Halifax' },
  { id: 'yyj', label: 'Victoria' },
  { id: 'yqr', label: 'Regina' },
  { id: 'yxe', label: 'Saskatoon' },
  { id: 'ham', label: 'Hamilton' },
  { id: 'kit', label: 'Kitchener' },
  { id: 'lon', label: 'London' },
  { id: 'gat', label: 'Gatineau' },
  { id: 'lav', label: 'Laval' },
  { id: 'lgl', label: 'Longueuil' },
  { id: 'shb', label: 'Sherbrooke' },
  { id: 'sag', label: 'Saguenay' },
  { id: 'trv', label: 'Trois-Rivières' },
  { id: 'mct', label: 'Moncton' },
  { id: 'fre', label: 'Fredericton' },
  { id: 'sjn', label: "St. John's" },
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
    if (next.length < 2) {
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

/** The form reads the chosen key by the `name` when the user submits. */
function CityForm() {
  const [summary, setSummary] = useState('');
  return (
    <Stack
      as="form"
      gap={4}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.target as HTMLFormElement);
        setSummary(`Chosen key: ${String(data.get('city') || 'none')}.`);
      }}
    >
      <Combobox label="City" name="city" options={CITIES} />
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
      name="Combobox"
      layer="Component"
      family="Fields"
      imports="import { Combobox, Stack, Text, Button } from '@bauhaus/design-system';"
      intro={[
        'A combobox is a text box with a list of suggestions. The user types a few letters, the list narrows, and the user picks one. Use it when the list is too long to scroll.',
        'The data goes in `options`: a list of `{ id, label }`. The `id` is what your code reads. The `label` is what the user sees and what the typing filters. Add `disabled: true` to show an option that is not available.',
        'There is no native element for this, so `Combobox` uses React Aria Components (a library that handles the keyboard and screen-reader behaviour). You do not import it.',
        'Focus stays in the input while the list is open. The user keeps typing, and a screen reader hears the active option through `aria-activedescendant` (an attribute that names the highlighted option). It also announces how many options match (APG Combobox; WCAG 4.1.3, AA).',
        'The label, description and error work as in `TextField`, with a difference: React Aria wires them, not `useFieldIds`. The error sets `aria-invalid="true"` (a flag that tells a screen reader the value is wrong).',
        'The value is a key, not text. `selectedKey` holds the `id` of the chosen option, or `null` for none. The typed text is separate (`inputValue`).',
      ]}
      guide="fields-combobox--docs"
      guideName="Combobox"
      groups={[
        {
          title: 'Start here',
          kicker: 'Type to filter a long list. Focus stays in the input; the list opens on Down or on the toggle button.',
          examples: [
            {
              title: 'Label only',
              when: 'A long list where typing finds the item faster than scrolling.',
              explain: [
                '`options` is a list of `{ id, label }`. The typed text filters the labels. A match can be anywhere in the label, in any case.',
                'The user can also open the whole list with the Down key or the toggle button at the end of the input.',
                'Use a combobox for a long list, as here. About fifteen options or fewer suit a `Select`, which needs no script.',
              ],
              render: <Combobox label="Country" options={COUNTRIES} />,
              code: `// The data: id is what your code reads, label is what the user sees and types against.
const countries = [
  { id: 'ar', label: 'Argentina' },
  { id: 'au', label: 'Australia' },
  { id: 'be', label: 'Belgium' },
  { id: 'ca', label: 'Canada' },
  { id: 'fr', label: 'France' },
  { id: 'it', label: 'Italy', disabled: true },
  // ...and the rest of the 25 countries.
];

<Combobox label="Country" options={countries} />`,
            },
            {
              title: 'With a placeholder',
              when: 'Show a sample of what to type.',
              explain: [
                '`placeholder` shows grey text in the empty input.',
                'The label still names the field. A placeholder vanishes when the user types, and its grey colour often fails the text contrast minimum (WCAG 1.4.3, AA).',
              ],
              render: <Combobox label="City" placeholder="Start typing a city" options={CITIES} />,
              code: `// The label names the field. The placeholder is a hint for the first key stroke.
<Combobox label="City" placeholder="Start typing a city" options={cities} />`,
            },
            {
              title: 'With a description',
              when: 'The user needs a hint before typing.',
              explain: [
                'The description sits between the label and the input, so the user reads it first.',
                'React Aria ties it to the input, so a screen reader reads it with the label (WCAG 3.3.2, A).',
              ],
              render: <Combobox label="Country" description="Where your card was issued." options={COUNTRIES} />,
              code: `<Combobox label="Country" description="Where your card was issued." options={countries} />`,
            },
            {
              title: 'Required',
              when: 'The form cannot go on without a choice.',
              explain: [
                '`required` marks the field as required for assistive technology, and the label shows the word "(required)". A bare asterisk means nothing to a person who does not know the convention (WCAG 3.3.2, A).',
                'The component does not show a browser bubble. You decide when to show an `error` (see In a form).',
              ],
              render: <Combobox label="City" required options={CITIES} />,
              code: `// required = the visible word "(required)" + the signal for screen readers.
<Combobox label="City" required options={cities} />`,
            },
          ],
        },
        {
          title: 'Options',
          kicker: 'Each option has an id, a label and an optional disabled flag.',
          examples: [
            {
              title: 'Disabled option',
              when: 'An option exists but is not available now.',
              explain: [
                '`disabled: true` on an option dims it and the user cannot pick it.',
                'Say why nearby, here in the description. A dimmed option with no reason leaves the user guessing (Nielsen heuristic 1, visibility of system status).',
              ],
              render: <Combobox label="Country" description="Italy is closed for new orders." options={COUNTRIES} />,
              code: `<Combobox
  label="Country"
  // The reason for the disabled option (Italy, in the list below).
  description="Italy is closed for new orders."
  options={countries}
/>`,
            },
            {
              title: 'Many options',
              when: 'Dozens of options.',
              explain: [
                'The list scrolls, and the typed text narrows it. The user does not scroll through sixty rows.',
                'Each `id` must be unique in the list.',
              ],
              render: <Combobox label="Seat number" options={MANY} />,
              code: `// Build the options from your data. Each id must be unique.
const seats = Array.from({ length: 60 }, (_, n) => ({ id: 'seat-' + n, label: 'Option ' + (n + 1) }));

<Combobox label="Seat number" options={seats} />`,
            },
            {
              title: 'Starts with a choice',
              when: 'The field holds a value that the user chose before, or that the view loaded.',
              explain: [
                '`defaultSelectedKey` is the `id` of the option to start with. The input shows its label.',
                'It is the uncontrolled form: the component holds the choice from there. Use `selectedKey` for a controlled one.',
              ],
              render: <Combobox label="City" options={CITIES} defaultSelectedKey="mtl" />,
              code: `// The id of the option, not its label.
<Combobox label="City" options={cities} defaultSelectedKey="mtl" />`,
            },
            {
              title: 'Starts with typed text',
              when: 'Reopen a search that the user left half done.',
              explain: [
                '`defaultInputValue` fills the input with text that is not a choice yet. It does not filter the list. Opening the list with Down or the toggle button shows every option; the list narrows only when the user types.',
              ],
              render: <Combobox label="City" options={CITIES} defaultInputValue="Mon" />,
              code: `<Combobox label="City" options={cities} defaultInputValue="Mon" />`,
            },
          ],
        },
        {
          title: 'The open list',
          kicker: 'The list is a popup under the input. These pictures keep it open so the options can be seen.',
          examples: [
            {
              title: 'Options matching the text',
              when: 'The list narrows to the options that contain the typed text.',
              explain: [
                'The popup is as wide as the input. The first match is highlighted, and the arrow keys move the highlight.',
                'The picture here is fixed open. In your page the list opens when the user presses Down, types, or presses the toggle button. A list that is always open would hide the rest of the page from screen readers.',
                'Typing "an" keeps seven countries, such as Canada, France and Germany. Chile, Italy and the others do not contain "an", so they drop out.',
              ],
              render: (
                <ForceOpenContext value>
                  <Combobox label="Country" options={COUNTRIES} defaultInputValue="an" />
                </ForceOpenContext>
              ),
              code: `// The list opens by itself when the user types. Nothing to code.
// This picture starts with "an" typed, so the list shows the matches.
<Combobox label="Country" options={countries} defaultInputValue="an" />`,
            },
            {
              title: 'Chosen and disabled options',
              when: 'See which option is chosen and which is not available.',
              explain: [
                'The chosen option shows a check mark and a fill. The check is a second cue besides the fill (WCAG 1.4.1, A).',
                'The disabled option is dimmed and skipped by the arrow keys. The picture shows five countries so both fit in the open list.',
              ],
              render: (
                <ForceOpenContext value>
                  <Combobox label="Country" options={FEW_COUNTRIES} defaultSelectedKey="fr" defaultInputValue="" />
                </ForceOpenContext>
              ),
              code: `// Five of the countries, so both options fit in the picture.
const fewCountries = countries.filter((country) => ['ca', 'cl', 'fr', 'de', 'it'].includes(country.id));

<Combobox label="Country" options={fewCountries} defaultSelectedKey="fr" />`,
            },
          ],
        },
        {
          title: 'Read the value',
          kicker: 'The selection and the typed text can each be controlled.',
          examples: [
            {
              title: 'Uncontrolled: read it on submit',
              when: 'You need the choice only when the user sends the form.',
              explain: [
                '"Uncontrolled" means the component holds the choice.',
                '`name` makes the field send the `id` of the chosen option, not its label. `FormData` collects it with the other named fields.',
                'With no choice, the value is empty. Here the status line says "none".',
                '`event.preventDefault()` stops the browser from reloading the page.',
              ],
              render: <CityForm />,
              code: `function CityForm() {
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
        setSummary('Chosen key: ' + (data.get('city') || 'none') + '.');
      }}
    >
      {/* name = the key you read from FormData. It sends the option id. */}
      <Combobox label="City" name="city" options={cities} />
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
              title: 'Controlled selection',
              when: 'The view must react to the choice, such as a delivery estimate.',
              explain: [
                '"Controlled" means your state holds the choice. Pass `selectedKey` and update it in `onSelectionChange`.',
                '`onSelectionChange` receives the `id` of the option, or `null` when the user clears the input.',
                'The status line uses `role="status"`: a screen reader announces the new text without moving focus (WCAG 4.1.3, AA).',
              ],
              render: <CityPicker />,
              code: `function CityPicker() {
  // null means "no choice". 'qc' is the id of Québec.
  const [city, setCity] = useState('qc');
  const name = cities.find((option) => option.id === city)?.label;
  return (
    <Stack gap={2}>
      <Combobox label="City" options={cities} selectedKey={city} onSelectionChange={setCity} />
      <Text as="p" role="status" variant="caption" tone="muted">
        {name ? 'Delivering to ' + name + '.' : 'No city chosen.'}
      </Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Search on the server',
              when: 'The list is too long to ship to the browser.',
              explain: [
                'Keep the typed text in your state: `inputValue` and `onInputChange`. On each change, ask your server and pass the answer as `options`.',
                '`loading` tells the user that options are coming. The list says so and the field sets `aria-busy` (a flag that tells a screen reader the content is updating).',
                'Wait for two letters or more before you ask. One letter matches too much and costs a request.',
                'Here a timer stands for the server.',
              ],
              render: <ServerSearch />,
              code: `function ServerSearch() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState([]);
  const search = async (next) => {
    setText(next);
    // Under two letters: show no options and ask nothing.
    if (next.length < 2) {
      setFound([]);
      return;
    }
    setLoading(true);
    setFound(await fetchCities(next)); // your request, returns [{ id, label }]
    setLoading(false);
  };
  return (
    <Combobox
      label="Delivery city"
      description="Type two letters or more."
      options={found}
      inputValue={text}
      onInputChange={search}
      loading={loading}
    />
  );
}`,
            },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props. A really open list is the user own action.',
          examples: [
            {
              title: 'Error',
              when: 'The user left the field with no valid choice. Name the field and the fix.',
              explain: [
                'Pass the message as `error`. React Aria ties it to the input, sets `aria-invalid="true"` and shows an error icon.',
                'A hidden word "Error:" comes before the message, so a screen reader says it is an error (WCAG 3.3.1, A).',
                'Say how to fix it: "Choose a city from the list" (WCAG 3.3.3, AA).',
                'The icon and the text carry the meaning. The red border alone would miss people who cannot tell the colours apart (WCAG 1.4.1, A).',
              ],
              render: <Combobox label="City" required options={CITIES} defaultInputValue="Mon" error="Choose a city from the list" />,
              code: `// Pass the message, not a boolean. An empty string means "no error".
<Combobox
  label="City"
  required
  options={cities}
  defaultInputValue="Mon"
  error="Choose a city from the list"
/>`,
            },
            {
              title: 'No match',
              when: 'The typed text matches nothing.',
              explain: [
                'The list opens with a line of text instead of staying blank. An empty popup looks broken (Nielsen heuristic 1, visibility of system status).',
                '`emptyText` changes the words. The default is "No results". Say what to do: "No city matches your search".',
              ],
              render: <Combobox label="City" options={CITIES} defaultInputValue="Zzz" emptyText="No city matches your search" />,
              code: `<Combobox label="City" options={cities} defaultInputValue="Zzz" emptyText="No city matches your search" />`,
            },
            {
              title: 'Loading',
              when: 'The view is fetching options.',
              explain: [
                '`loading` makes the list say "Loading" when it has no options, and sets `aria-busy`.',
                '`loadingText` changes the words. Say what is happening: "Searching cities".',
                'The text sits in the list, so a screen reader can read it.',
              ],
              render: <Combobox label="Delivery city" options={[]} loading loadingText="Searching cities" />,
              code: `// No options yet, so the list shows the loading text.
<Combobox label="Delivery city" options={[]} loading loadingText="Searching cities" />`,
            },
            {
              title: 'Disabled',
              when: 'The user cannot change the choice now.',
              explain: [
                '`disabled` dims the input and the toggle button, and removes them from the tab order.',
                'Say why in the description. A dimmed field with no reason confuses people (Nielsen heuristic 1, visibility of system status).',
              ],
              render: <Combobox label="City" description="Pick a country first." options={CITIES} disabled />,
              code: `<Combobox label="City" description="Pick a country first." options={cities} disabled />`,
            },
            {
              title: 'Read-only',
              when: 'The user can focus and read the choice but not change it.',
              explain: [
                '`readOnly` keeps the input focusable and the text selectable, so the user can copy it. Typing and the list are blocked.',
                'The fill is sunken so it never looks disabled.',
              ],
              render: <Combobox label="City" options={CITIES} defaultSelectedKey="mtl" readOnly />,
              code: `<Combobox label="City" options={cities} defaultSelectedKey="mtl" readOnly />`,
            },
          ],
        },
        {
          title: 'Other languages',
          kicker: 'The field holds no text of its own except a few default words. Pass the words of your language.',
          examples: [
            {
              title: 'Required word',
              when: 'A translated view.',
              explain: [
                '`requiredText` replaces the word "required" after the label.',
                'Translate the label, the description and the option labels the same way. They are all props.',
              ],
              render: <Combobox label="Ville" required requiredText="obligatoire" options={CITIES} />,
              code: `<Combobox label="Ville" required requiredText="obligatoire" options={cities} />`,
            },
            {
              title: 'Error word',
              when: 'A translated view that shows an error.',
              explain: [
                '`errorPrefix` replaces the hidden word "Error" that a screen reader says before the message.',
                'Without it, a French screen reader would say "Error" in the middle of French text.',
              ],
              render: <Combobox label="Ville" options={CITIES} error="Choisissez une ville dans la liste" errorPrefix="Erreur" />,
              code: `<Combobox
  label="Ville"
  options={cities}
  error="Choisissez une ville dans la liste"
  errorPrefix="Erreur"
/>`,
            },
            {
              title: 'List messages',
              when: 'A translated view where the list shows a message.',
              explain: [
                '`emptyText` and `loadingText` hold the words of the list.',
                'React Aria translates its own announcements ("3 options available") and the toggle button name by the language of the page.',
              ],
              render: <Combobox label="Ville" options={CITIES} defaultInputValue="Zzz" emptyText="Aucune ville ne correspond" loadingText="Recherche en cours" />,
              code: `<Combobox
  label="Ville"
  options={cities}
  emptyText="Aucune ville ne correspond"
  loadingText="Recherche en cours"
/>`,
            },
          ],
        },
        {
          title: 'Content cases',
          kicker: 'Labels wrap. The input keeps one line.',
          examples: [
            {
              title: 'Long option label',
              when: 'An option longer than the box.',
              explain: [
                'The open list shows the label in full, on more lines if needed.',
                'Put the key words first, so the user can tell the options apart as they type.',
              ],
              render: <Combobox label="Plan" options={[{ id: 'annual', label: 'Annual plan, billed once a year, with priority support and a dedicated account manager' }, { id: 'monthly', label: 'Monthly plan' }]} defaultSelectedKey="annual" />,
              code: `<Combobox
  label="Plan"
  defaultSelectedKey="annual"
  options={[
    { id: 'annual', label: 'Annual plan, billed once a year, with priority support and a dedicated account manager' },
    { id: 'monthly', label: 'Monthly plan' },
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
              render: <Combobox label="Ville de livraison principale de la commande" description="Tapez le début du nom pour filtrer la liste." options={CITIES} />,
              code: `// No truncation: the label and the description wrap.
<Combobox
  label="Ville de livraison principale de la commande"
  description="Tapez le début du nom pour filtrer la liste."
  options={cities}
/>`,
            },
            {
              title: 'Long error',
              when: 'An error that runs longer than the column.',
              frame: 'narrow',
              explain: [
                'The message wraps beside its icon. The icon stays at the first line.',
              ],
              render: <Combobox label="City" options={CITIES} error="Choose a city from the list, not a free text" />,
              code: `<Combobox label="City" options={cities} error="Choose a city from the list, not a free text" />`,
            },
            {
              title: 'On a phone',
              when: 'A narrow screen.',
              frame: 'phone',
              explain: [
                'The field fills the width of its container. The popup is as wide as the input.',
                'The toggle button keeps a 32px target, above the 24px minimum (WCAG 2.5.8, AA).',
              ],
              render: <Combobox label="City" required options={CITIES} placeholder="Start typing a city" />,
              code: `// No width prop: the field fills its container.
<Combobox label="City" required options={cities} placeholder="Start typing a city" />`,
            },
          ],
        },
        {
          title: 'In a form',
          kicker: 'The view decides when to show an error.',
          examples: [
            {
              title: 'Required, with an error',
              when: 'A required combobox shows its error when the user clears the choice.',
              explain: [
                '`onSelectionChange` gives `null` when the user empties the input and leaves. That is the moment to show the error.',
                'A new choice clears the error at once. The user sees that the fix worked.',
                'Say the fix: "Choose a city from the list" (WCAG 3.3.3, AA).',
              ],
              render: <RequiredCity />,
              code: `function RequiredCity() {
  const [city, setCity] = useState(null);
  const [error, setError] = useState('');
  return (
    <Combobox
      label="City"
      required
      options={cities}
      selectedKey={city}
      error={error}
      onSelectionChange={(key) => {
        setCity(key);
        // null = no choice. A key = the problem is fixed.
        setError(key === null ? 'Choose a city from the list' : '');
      }}
    />
  );
}`,
            },
            {
              title: 'An address form',
              when: 'A combobox among other fields, with one main action at the end.',
              explain: [
                '`Stack` with `gap={4}` spaces the fields evenly (`space.4`). One column is faster to scan than two.',
                'One primary button, at the end, with `type="submit"`.',
                'The form sends the option `id`s, under the `name`s `country` and `city`.',
              ],
              render: (
                <Stack as="form" gap={4} onSubmit={(event) => event.preventDefault()}>
                  <Combobox label="Country" name="country" required options={COUNTRIES} />
                  <Combobox label="City" name="city" required options={CITIES} />
                  <Stack direction="horizontal" justify="end">
                    <Button type="submit">Continue to payment</Button>
                  </Stack>
                </Stack>
              ),
              code: `<Stack as="form" gap={4} onSubmit={handleSubmit}>
  <Combobox label="Country" name="country" required options={countries} />
  <Combobox label="City" name="city" required options={cities} />
  <Stack direction="horizontal" justify="end">
    <Button type="submit">Continue to payment</Button>
  </Stack>
</Stack>`,
            },
          ],
        },
        {
          title: 'Accessibility behaviour',
          kicker: 'You write nothing for this. It helps to know what the component does.',
          examples: [
            {
              title: 'Keyboard and announcements',
              when: 'You need to know what a keyboard or screen-reader user gets.',
              explain: [
                'Down opens the list and moves the highlight. Up moves it back. Enter accepts the highlighted option. Esc closes the list, and a second Esc clears the text. Tab leaves the field (APG Combobox; WCAG 2.1.1, A).',
                'Focus never leaves the input. If focus moved into the list, the user could not keep typing.',
                'A polite announcement says how many options match ("3 options available") when the list opens or the text changes (WCAG 4.1.3, AA).',
                'The toggle button is out of the tab order on purpose. The keyboard opens the list from the input. The pointer uses the button.',
              ],
              render: <Combobox label="Country" description="Press Down to open the list." options={COUNTRIES} />,
              code: `// Nothing extra to wire. The keys work as soon as the field renders:
//   Down / Up   open the list and move the highlight
//   Enter       accept the highlighted option
//   Esc         close the list (a second Esc clears the text)
//   Tab         leave the field
<Combobox label="Country" description="Press Down to open the list." options={countries} />`,
            },
          ],
        },
      ]}
    />
  ),
};
