import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { RadioGroup } from './radio-group';
import { radioGroupRules } from './radio-group.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Fields/Radio group', component: RadioGroup, parameters: { layout: 'fullscreen' }, args: { legend: 'Legend', options: [] } } satisfies Meta<typeof RadioGroup>;

export default meta;

const cell = (node: ReactNode) => <div style={{ inlineSize: '100%', maxInlineSize: 'calc(var(--ds-space-12) * 6)' }}>{node}</div>;
const DELIVERY = [
  { value: 'standard', label: 'Standard, 3 to 5 days' },
  { value: 'express', label: 'Express, next day' },
  { value: 'pickup', label: 'Pickup in store' },
];

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
      name="Radio group"
      layer="Component"
      family="Fields"
      plain="A radio group is a short list where you choose exactly one, and every choice is visible. Picking one un-picks the other. A question above the list says what you are choosing."
      precise="Component in the fields family · picks one option from a small visible set · a fieldset with a legend and native radios sharing one name · not for a long list (select) or for several choices (checkboxes)."
      usedFor="Delivery method, plan, payment type: two to five options that fit on screen."
      tokens={{
        mode: 'consumed',
        note: 'The radio group has no component tokens.',
        rows: [
          { name: 'field.surface · field.border · border-hover · border-invalid', tier: 'role', use: 'Empty circle fill and outline (3:1), hover and error', swatch: '--ds-field-border' },
          { name: 'selection.surface · selection.mark', tier: 'role', use: 'Fill of the selected circle, and the dot on it', swatch: '--ds-selection-surface' },
          { name: 'disabled.text · disabled.surface · disabled.border', tier: 'role', use: 'Disabled circle and label', swatch: '--ds-disabled-surface' },
          { name: 'status.error', tier: 'role', use: 'Error text and icon', swatch: '--ds-status-error' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator around the circle', swatch: '--ds-focus-ring-color' },
          { name: 'text.label.* · text.body.* · text.caption.*', tier: '2', use: 'Legend; option labels; description and error' },
          { name: 'size.target.min · size.icon.md · space.2 · size.border.thick', tier: '2', use: 'Target (24px); circle; dot; circle outline' },
          { name: 'radius.full', tier: '2', use: 'Circle shape' },
        ],
      }}
      stage={{
        render: (args) =>
          cell(
            <RadioGroup
              legend={String(args.legend)}
              description={String(args.description) || undefined}
              error={String(args.error) || undefined}
              required={args.required === true}
              disabled={args.disabled === true}
              options={DELIVERY}
              defaultValue="standard"
            />,
          ),
        parts: [
          { n: 1, label: 'Legend', note: 'required, names the group', target: '.ds-field__label' },
          { n: 2, label: 'Description', note: 'optional', target: '.ds-field__description' },
          { n: 3, label: 'Radio and dot', note: 'native, drawn', target: '.ds-radio-group__circle' },
          { n: 4, label: 'Option label', note: 'required, part of the target', target: '.ds-field__choice-label', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Target height', property: 'height', target: '.ds-field__choice-target', token: 'size.target.min', value: '24px, the whole option row' },
        { label: 'Target width', property: 'width', target: '.ds-field__choice-target', token: 'size.target.min' },
        { label: 'Circle height', property: 'height', target: '.ds-radio-group__circle', token: 'size.icon.md', value: '16px, outline size.border.thick' },
        { label: 'Circle width', property: 'width', target: '.ds-radio-group__circle', token: 'size.icon.md' },
        { label: 'Dot height', property: 'height', target: '.ds-radio-group__dot', token: 'space.2' },
        { label: 'Dot width', property: 'width', target: '.ds-radio-group__dot', token: 'space.2' },
        { label: 'Options', value: 'stacked with no gap: the targets touch, none overlaps' },
        { label: 'Focus', value: 'ring 2px, offset 2px, around the circle, on :focus-visible' },
      ]}
      api={[
        { label: 'legend', value: 'Required. The question. It names the group for assistive technology.', control: { kind: 'text', value: 'Delivery' } },
        { label: 'options', value: 'Required. A list of { value, label, disabled? }.' },
        { label: 'value · defaultValue · onValueChange', value: 'Controlled or uncontrolled selection. Preselect only with a reason.' },
        { label: 'onBlur', value: 'Group blur: called when focus leaves the group, not when arrow keys move it from one radio to the next. Validate there.' },
        { label: 'name', value: 'Shared by the radios. A generated name is used when omitted.' },
        { label: 'description', value: 'Help under the legend, tied to the group with aria-describedby.', control: { kind: 'text', value: 'Prices show at checkout.' } },
        { label: 'error', value: 'Error under the list, tied to the group with aria-describedby. It sets aria-invalid.', control: { kind: 'text', value: '' } },
        { label: 'required', value: 'As the text field.', control: { kind: 'boolean', value: true } },
        { label: 'disabled', value: 'As the text field. It applies to the whole group.', control: { kind: 'boolean', value: false } },
        { label: 'requiredText · errorPrefix', value: 'As the text field.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'designed', render: cell(<RadioGroup legend="Delivery" options={DELIVERY} />), trigger: 'no value', note: 'No option is preselected: the user must choose.' },
          { id: 'loading', status: 'n/a', reason: 'A group does not load. Disable it while options load.' },
          { id: 'none', status: 'n/a', reason: 'A group with no options is not shown.' },
          { id: 'one', status: 'n/a', reason: 'One option is a checkbox, or plain text.' },
          { id: 'some', status: 'designed', render: cell(<RadioGroup legend="Delivery" options={DELIVERY} defaultValue="express" />), trigger: 'value' },
          { id: 'too-many', status: 'designed', label: 'Too many (long labels)', render: cell(<RadioGroup legend="Delivery" options={[{ value: 'a', label: 'Standard delivery to a home address, signature required, 3 to 5 working days' }, { value: 'b', label: 'Express' }]} defaultValue="a" />), trigger: 'long label', note: 'Labels wrap. More than about five options: use a select.' },
          { id: 'incorrect', status: 'designed', render: cell(<RadioGroup legend="Delivery" required options={DELIVERY} error="Choose a delivery method." />), trigger: 'error' },
          { id: 'correct', status: 'designed', render: cell(<RadioGroup legend="Delivery" required options={DELIVERY} defaultValue="standard" />), trigger: 'error cleared' },
          { id: 'done', status: 'n/a', reason: 'Saving belongs to the form.' },
          { id: 'default', status: 'designed', render: cell(<RadioGroup legend="Delivery" options={DELIVERY} defaultValue="standard" />), trigger: 'rest' },
          { id: 'hover', status: 'designed', render: cell(<Force cls="doc-force-hover" target=".ds-radio-group__input"><RadioGroup legend="Delivery" options={DELIVERY.slice(0, 2)} defaultValue="standard" /></Force>), trigger: ':hover', note: 'Forced on the first option. The circle outline takes field.border-hover.' },
          { id: 'focus-visible', status: 'designed', render: cell(<Force cls="doc-force-focus" target=".ds-radio-group__input"><RadioGroup legend="Delivery" options={DELIVERY.slice(0, 2)} defaultValue="standard" /></Force>), trigger: ':focus-visible', note: 'Forced on the first option. The ring goes around the circle.' },
          { id: 'active', status: 'n/a', reason: 'The choice changes at once on press; there is no pressed look.' },
          { id: 'disabled', status: 'designed', render: cell(<RadioGroup legend="Delivery" options={DELIVERY} defaultValue="standard" disabled />), trigger: 'disabled', note: 'The whole group. One option can be disabled with option.disabled.' },
          { id: 'selected', status: 'designed', render: cell(<RadioGroup legend="Delivery" options={DELIVERY.slice(0, 2)} defaultValue="express" />), trigger: 'checked', note: 'Fill and a dot: shape, not colour alone.' },
          { id: 'required', status: 'designed', group: 'interaction', render: cell(<RadioGroup legend="Delivery" required options={DELIVERY} />), trigger: 'required' },
        ],
      }}
      dos={[
        { text: 'Put the options in a fieldset with a legend that asks the question.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Let the arrows move the choice inside the group; the group has one Tab stop.', basis: 'APG Radio Group' },
        { text: 'Leave the group empty unless one option is the honest default.', basis: 'Nielsen 5' },
      ]}
      donts={[
        { text: 'Skip the fieldset and legend.', basis: 'WCAG 1.3.1 (A)', rule: 'radio.fieldset-legend' },
        { text: 'Make each radio its own Tab stop.', basis: 'APG Radio Group', rule: 'radio.arrow-keys' },
        { text: 'Preselect an option with no reason.', basis: 'Nielsen 5', rule: 'radio.preselect' },
        { text: 'Show the error by colour alone.', basis: 'WCAG 1.4.1 (A)', rule: 'radio.error-bound' },
        { text: 'Write a colour or px literal in the stylesheet.', basis: 'misfile.raw-value-in-component', rule: 'radio.no-literal' },
      ]}
      guide="fields-radio-group--docs"
      guideName="Radio group"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Radio group" layer="Component" family="Fields" rules={radioGroupRules} guide="fields-radio-group--docs" guideName="Radio group" />,
};

const SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

/** The view owns the value and shows what it means. */
function DeliveryChoice() {
  const [delivery, setDelivery] = useState('standard');
  return (
    <Stack gap={2}>
      <RadioGroup legend="Delivery" value={delivery} onValueChange={setDelivery} options={DELIVERY} />
      <Text as="p" role="status" variant="caption" tone="muted">{delivery === 'pickup' ? 'Pickup is free.' : delivery === 'express' ? 'Express costs 12 dollars.' : 'Standard is free over 50 dollars.'}</Text>
    </Stack>
  );
}

/** The group blur fires when focus leaves the fieldset, so an empty required group shows its error once the user has passed it. */
function RequiredDelivery() {
  const [delivery, setDelivery] = useState('');
  const [error, setError] = useState('');
  return (
    <RadioGroup
      legend="Delivery"
      required
      value={delivery}
      error={error}
      onValueChange={(next) => {
        setDelivery(next);
        setError('');
      }}
      onBlur={() => setError(delivery === '' ? 'Choose a delivery option' : '')}
      options={DELIVERY}
    />
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Radio group"
      layer="Component"
      family="Fields"
      imports="import { RadioGroup, Button, Stack, Text } from '@bauhaus/design-system';"
      intro={[
        'Pick a radio group when the user must choose exactly one of two to five options, and you want all options visible to compare. Picking one un-picks the other.',
        'Pick a checkbox instead when each option is a separate yes or no, or when the user may choose several. Pick a switch for a setting that applies at once.',
        'For a long list (more than five options), use a `Select` or a `Combobox`: a long run of radios is slow to read.',
        'The `legend` is the question the options answer ("Delivery"). A screen reader reads it with each option, so a lone "Express" is heard as "Delivery, Express".',
        'Each option is `{ value, label, disabled? }`. The `value` is what your code and the form receive; the `label` is what people read.',
        'The keyboard works with no code from you. Tab enters the group once, the arrow keys move and choose, and Space chooses the focused option.',
        '"Controlled" means your state holds the value (`value` plus `onValueChange`). "Uncontrolled" means the browser holds it (`defaultValue`).',
        'ARIA attributes are extra labels that screen readers read out, such as `aria-invalid`. The component sets them for you.',
      ]}
      guide="fields-radio-group--docs"
      guideName="Radio group"
      groups={[
        {
          title: 'Basics',
          kicker: 'One choice from two to five options that fit on screen. The legend is the question.',
          examples: [
            {
              title: 'No choice yet',
              when: 'The question has no honest default, so no option is checked. This is the simplest and the most common use.',
              explain: [
                '`legend` and `options` are the only required props.',
                'No option is checked, so the user has to decide. A hidden default makes people skip the question (Nielsen heuristic 5, error prevention).',
                'Tab enters the group on the first option. After that the arrow keys move between options (APG Radio Group; WCAG 2.1.1, A).',
                'Each `value` must be unique in the list. The component builds the option ids from it.',
              ],
              render: <RadioGroup legend="Delivery" options={DELIVERY} />,
              code: `// Your own list. value = what you receive; label = what people read.
const deliveryOptions = [
  { value: 'standard', label: 'Standard, 3 to 5 days' },
  { value: 'express', label: 'Express, next day' },
  { value: 'pickup', label: 'Pickup in store' },
];

// The legend is the question. Nothing is chosen yet.
<RadioGroup legend="Delivery" options={deliveryOptions} />`,
            },
            {
              title: 'With a default',
              when: 'One option is the honest default for almost everyone.',
              explain: [
                '`defaultValue` checks the option whose `value` matches. The browser holds the rest.',
                'Preselect only with a reason. Once an option is checked, the user cannot go back to "nothing chosen".',
                'A chosen default hides the question, and people accept it without reading (Nielsen heuristic 5, error prevention).',
              ],
              render: <RadioGroup legend="Delivery" options={DELIVERY} defaultValue="standard" />,
              code: `// "standard" is checked at the start. The user can still change it.
// \`delivery\` is the same list as above.
<RadioGroup legend="Delivery" options={deliveryOptions} defaultValue="standard" />`,
            },
            {
              title: 'With a description',
              when: 'The user needs a hint about the whole question before choosing.',
              explain: [
                '`description` shows small text under the legend.',
                'It is linked to the group with `aria-describedby`, so a screen reader reads it when it enters the group.',
                'Put hints about one option in that option\'s label instead.',
              ],
              render: <RadioGroup legend="Delivery" description="Prices include tax." options={DELIVERY} />,
              code: `<RadioGroup legend="Delivery" description="Prices include tax." options={deliveryOptions} />`,
            },
            {
              title: 'Two options',
              when: 'A choice between two things that are not a yes or no.',
              explain: [
                'Two radios show both choices at once. A select would hide one of them behind a click.',
                'For a plain yes or no, use a `Checkbox` or a `Switch`: one control is shorter.',
              ],
              render: <RadioGroup legend="Billing period" options={[{ value: 'monthly', label: 'Monthly' }, { value: 'annual', label: 'Annual, two months free' }]} />,
              code: `<RadioGroup
  legend="Billing period"
  options={[
    { value: 'monthly', label: 'Monthly' },
    { value: 'annual', label: 'Annual, two months free' },
  ]}
/>`,
            },
            {
              title: 'Five options',
              when: 'The top of the range. Use it when the options are short and the user should compare them.',
              explain: [
                'Past five options, the list gets slow to read. Switch to a `Select`.',
                'Keep the labels the same shape (all one word, or all short phrases) so the eye can scan them.',
              ],
              render: <RadioGroup legend="Rate your visit" options={[{ value: '1', label: 'Poor' }, { value: '2', label: 'Fair' }, { value: '3', label: 'Good' }, { value: '4', label: 'Very good' }, { value: '5', label: 'Excellent' }]} />,
              code: `<RadioGroup
  legend="Rate your visit"
  options={[
    { value: '1', label: 'Poor' },
    { value: '2', label: 'Fair' },
    { value: '3', label: 'Good' },
    { value: '4', label: 'Very good' },
    { value: '5', label: 'Excellent' },
  ]}
/>`,
            },
            {
              title: 'Required',
              when: 'The form cannot go on without a choice.',
              explain: [
                '`required` adds the visible word "(required)" after the legend. A bare asterisk explains nothing to many users (WCAG 3.3.2, A).',
                'It also tells assistive technology the group is required (`aria-required`) and the browser blocks the submit.',
              ],
              render: <RadioGroup legend="Delivery" required options={DELIVERY} />,
              code: `<RadioGroup legend="Delivery" required options={deliveryOptions} />`,
            },
            {
              title: 'Required, in another language',
              when: 'The view is translated. The word "required" must follow.',
              explain: [
                '`requiredText` replaces the word in the marker. The default is the English "required".',
                'All text arrives as props, so you translate it where you build the view (WCAG 3.1.1, A).',
              ],
              render: <RadioGroup legend="Livraison" required requiredText="obligatoire" options={[{ value: 'standard', label: 'Standard, 3 à 5 jours' }, { value: 'express', label: 'Express, le lendemain' }]} />,
              code: `<RadioGroup
  legend="Livraison"
  required
  requiredText="obligatoire"
  options={[
    { value: 'standard', label: 'Standard, 3 à 5 jours' },
    { value: 'express', label: 'Express, le lendemain' },
  ]}
/>`,
            },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props. Disabled works on the whole group or on one option.',
          examples: [
            {
              title: 'Error',
              when: 'The user passed the group with no choice. Name the field and the fix.',
              explain: [
                '`error` shows the message under the options, with an icon and a hidden word "Error:" that screen readers read first.',
                'The group gets `aria-invalid` and a link to the message through `aria-describedby`. The circles also take the error outline.',
                'Colour is only the third cue. The text and the icon say it too (WCAG 3.3.1, A; WCAG 1.4.1, A).',
              ],
              render: <RadioGroup legend="Delivery" required error="Choose a delivery option" options={DELIVERY} />,
              code: `// A non-empty error string is the error state. An empty string clears it.
<RadioGroup legend="Delivery" required error="Choose a delivery option" options={deliveryOptions} />`,
            },
            {
              title: 'Error, in another language',
              when: 'The hidden word before the error must follow the language of the view.',
              explain: [
                '`errorPrefix` replaces the hidden "Error" that a screen reader reads before the message.',
                'Sighted users never see it. It tells a person who listens that the next sentence is an error.',
              ],
              render: <RadioGroup legend="Livraison" error="Choisissez un mode de livraison" errorPrefix="Erreur" options={[{ value: 'standard', label: 'Standard, 3 à 5 jours' }, { value: 'express', label: 'Express, le lendemain' }]} />,
              code: `<RadioGroup
  legend="Livraison"
  error="Choisissez un mode de livraison"
  // Read aloud before the message: "Erreur : Choisissez..."
  errorPrefix="Erreur"
  options={[
    { value: 'standard', label: 'Standard, 3 à 5 jours' },
    { value: 'express', label: 'Express, le lendemain' },
  ]}
/>`,
            },
            {
              title: 'Disabled group',
              when: 'The user cannot change the answer now, such as after an order shipped.',
              explain: [
                '`disabled` on the group disables every option. They leave the Tab order and ignore clicks.',
                'Disabled controls are exempt from colour contrast rules (WCAG 1.4.3 exception), so the reason must be readable. Put it in `description`.',
                'Keep the chosen option visible with `defaultValue`, so the user still sees the answer.',
              ],
              render: <RadioGroup legend="Delivery" disabled description="The order has shipped." defaultValue="standard" options={DELIVERY} />,
              code: `// Say why it is locked. Show the answer that was chosen.
<RadioGroup
  legend="Delivery"
  disabled
  description="The order has shipped."
  defaultValue="standard"
  options={deliveryOptions}
/>`,
            },
            {
              title: 'Disabled option',
              when: 'One option is not available now, but the others are.',
              explain: [
                '`disabled: true` inside one option disables that option alone. The arrow keys skip it.',
                'Keep the option in the list so the user knows it exists, and say why it is off in `description`.',
              ],
              render: <RadioGroup legend="Delivery" description="Express is closed on Sundays." options={[{ value: 'standard', label: 'Standard, 3 to 5 days' }, { value: 'express', label: 'Express, next day', disabled: true }, { value: 'pickup', label: 'Pickup in store' }]} />,
              code: `<RadioGroup
  legend="Delivery"
  description="Express is closed on Sundays."
  options={[
    { value: 'standard', label: 'Standard, 3 to 5 days' },
    // Only this one is off. The arrow keys skip it.
    { value: 'express', label: 'Express, next day', disabled: true },
    { value: 'pickup', label: 'Pickup in store' },
  ]}
/>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'An option label is any content. It wraps inside its column.',
          examples: [
            {
              title: 'Rich label',
              when: 'An option with a price or a note next to its name.',
              explain: [
                '`label` accepts any React content, not only a string. Here `<strong>` makes the plan name stand out.',
                'Keep it to inline text. The label sits inside a native `<label>`, so do not put buttons or links in it.',
              ],
              render: <RadioGroup legend="Plan" defaultValue="team" options={[{ value: 'solo', label: <><strong>Solo</strong>, 9 dollars a month</> }, { value: 'team', label: <><strong>Team</strong>, 29 dollars a month</> }]} />,
              code: `<RadioGroup
  legend="Plan"
  defaultValue="team"
  options={[
    // A fragment lets the label hold bold text and plain text.
    { value: 'solo', label: <><strong>Solo</strong>, 9 dollars a month</> },
    { value: 'team', label: <><strong>Team</strong>, 29 dollars a month</> },
  ]}
/>`,
            },
            {
              title: 'Long option labels',
              when: 'An option that needs a full sentence.',
              explain: [
                'The label wraps and never truncates. The whole text stays part of the click target.',
                'Each row is at least 24px high, and rows touch with no gap, so none overlaps another (WCAG 2.5.8, AA).',
              ],
              render: <RadioGroup legend="Data retention" options={[{ value: '30', label: 'Keep my data for 30 days after I close the account, then delete it for good' }, { value: '0', label: 'Delete my data as soon as I close the account' }]} />,
              code: `<RadioGroup
  legend="Data retention"
  options={[
    { value: '30', label: 'Keep my data for 30 days after I close the account, then delete it for good' },
    { value: '0', label: 'Delete my data as soon as I close the account' },
  ]}
/>`,
            },
            {
              title: 'Long legend and description in a narrow column',
              when: 'Translated text runs longer than English. Both must wrap.',
              frame: 'narrow',
              explain: [
                'French is often 20 to 30 percent longer than English. Design for it from the start.',
                'The frame on this card is only a demo. Your own column sets the width; the component adds none.',
              ],
              render: <RadioGroup legend="Mode de livraison préféré pour cette commande" description="Les frais s’affichent à l’étape suivante." options={[{ value: 'standard', label: 'Standard, 3 à 5 jours ouvrables' }, { value: 'express', label: 'Express, le lendemain' }]} />,
              code: `<RadioGroup
  legend="Mode de livraison préféré pour cette commande"
  description="Les frais s’affichent à l’étape suivante."
  options={[
    { value: 'standard', label: 'Standard, 3 à 5 jours ouvrables' },
    { value: 'express', label: 'Express, le lendemain' },
  ]}
/>`,
            },
            {
              title: 'Error in a narrow column',
              when: 'The error message is longer than the column.',
              frame: 'narrow',
              explain: ['The message wraps below its icon and stays whole. Never cut an error to fit (WCAG 1.4.10, AA).'],
              render: <RadioGroup legend="Delivery" error="Choose a delivery option before you pay" options={DELIVERY} />,
              code: `<RadioGroup legend="Delivery" error="Choose a delivery option before you pay" options={deliveryOptions} />`,
            },
            {
              title: 'On a phone',
              when: 'The view is 320px wide, the narrowest width WCAG asks you to support.',
              frame: 'phone',
              explain: [
                'Each row fills its container with no horizontal scroll (WCAG 1.4.10, AA).',
                'The target is at least 24px high, so a thumb can hit it (WCAG 2.5.8, AA).',
              ],
              render: <RadioGroup legend="Delivery" required options={DELIVERY} />,
              code: `<RadioGroup legend="Delivery" required options={deliveryOptions} />`,
            },
          ],
        },
        {
          title: 'Controlled and uncontrolled',
          kicker: 'Who holds the choice: the browser (uncontrolled) or your React state (controlled). The keyboard works the same in both.',
          examples: [
            {
              title: 'Uncontrolled',
              when: 'You only need the choice when the form is sent.',
              explain: [
                '`name` makes a native form include the group. `defaultValue` sets the starting option.',
                'The browser holds the state. You read it from the form data on submit: nothing to keep in sync.',
                'This is the smallest option. Choose it unless the view must react to each change.',
              ],
              render: <RadioGroup legend="Size" name="size" defaultValue="medium" options={SIZES} />,
              code: `// The browser holds the choice. Read it from FormData on submit:
//   new FormData(form).get('size')  ->  'medium'
<RadioGroup
  legend="Size"
  name="size"
  defaultValue="medium"
  options={[
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ]}
/>`,
            },
            {
              title: 'Controlled',
              when: 'The view must react to the choice, such as to show a price note, or must reset it.',
              explain: [
                '`value` and `onValueChange` go together. `onValueChange` receives the chosen `value` string, not an event.',
                'Without `onValueChange`, a controlled group is frozen: React keeps the old value.',
                'The status line uses `role="status"`. Screen readers announce the new note politely, without moving focus (WCAG 4.1.3, AA).',
              ],
              render: <DeliveryChoice />,
              code: `function DeliveryChoice() {
  const [delivery, setDelivery] = useState('standard');
  return (
    <Stack gap={2}>
      <RadioGroup
        legend="Delivery"
        value={delivery}
        // Receives the chosen value as a string, e.g. 'express'.
        onValueChange={setDelivery}
        options={deliveryOptions}
      />
      {/* Announced by screen readers without moving focus (WCAG 4.1.3). */}
      <Text as="p" role="status" variant="caption" tone="muted">
        {priceNote(delivery)}
      </Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Shared name',
              when: 'A native form must send the chosen value under a name you pick.',
              explain: [
                '`name` is shared by all the radios. That is what makes them one group with one Tab stop.',
                'Without a `name`, the component makes one for you. The group works, but the form data has an unreadable key.',
                'Use a different `name` for each group on the page, or their choices will cancel each other.',
              ],
              render: <RadioGroup legend="Shirt size" name="shirt-size" options={SIZES} />,
              code: `// Sent as shirt-size=small, medium or large (sizeOptions is your own list).
<RadioGroup legend="Shirt size" name="shirt-size" options={sizeOptions} />`,
            },
          ],
        },
        {
          title: 'In a form',
          kicker: 'Check a required group when focus leaves it, not when the arrow keys move inside it.',
          examples: [
            {
              title: 'Validate on group blur',
              when: 'Show the error once the user has left the group without choosing.',
              explain: [
                '`onBlur` here is a group blur: it fires when focus leaves the whole group, not when the arrows move between options.',
                '`onValueChange` clears the error as soon as the user chooses. A stale error that stays is confusing.',
                'Validate on blur so the error does not appear too early (Nielsen heuristic 5, error prevention).',
                'Validate again on submit. Safari does not focus a radio on a click, so a pointer user may never trigger the blur.',
              ],
              render: <RequiredDelivery />,
              code: `function RequiredDelivery() {
  const [delivery, setDelivery] = useState('');
  const [error, setError] = useState('');

  return (
    <RadioGroup
      legend="Delivery"
      required
      value={delivery}
      error={error}
      onValueChange={(next) => {
        setDelivery(next);
        // Clear the error as soon as the user fixes the problem.
        setError('');
      }}
      // Runs when focus leaves the group. Say what to do.
      onBlur={() => setError(delivery === '' ? 'Choose a delivery option' : '')}
      options={deliveryOptions}
    />
  );
}`,
            },
            {
              title: 'A checkout step',
              when: 'Two questions, then one primary action.',
              explain: [
                'The delivery group is `required`. The gift wrap group has a `defaultValue` of "no", the honest default for almost everyone.',
                'Each group has its own `name`, so their choices stay separate.',
                '`Button type="submit"` is the only primary button. `justify="end"` puts it at the trailing edge, and it flips in a right-to-left language.',
              ],
              render: (
                <Stack as="form" gap={4} onSubmit={(event) => event.preventDefault()}>
                  <RadioGroup legend="Delivery" name="delivery" required options={DELIVERY} />
                  <RadioGroup legend="Gift wrap" name="wrap" defaultValue="no" options={[{ value: 'no', label: 'No wrap' }, { value: 'yes', label: 'Wrap as a gift' }]} />
                  <Stack direction="horizontal" justify="end">
                    <Button type="submit">Continue to payment</Button>
                  </Stack>
                </Stack>
              ),
              code: `<Stack as="form" gap={4} onSubmit={handleSubmit}>
  {/* Must be answered. No default: the user has to decide. */}
  <RadioGroup legend="Delivery" name="delivery" required options={deliveryOptions} />
  {/* Optional, with an honest default. */}
  <RadioGroup
    legend="Gift wrap"
    name="wrap"
    defaultValue="no"
    options={[
      { value: 'no', label: 'No wrap' },
      { value: 'yes', label: 'Wrap as a gift' },
    ]}
  />
  <Stack direction="horizontal" justify="end">
    <Button type="submit">Continue to payment</Button>
  </Stack>
</Stack>`,
            },
            {
              title: 'Show a locked answer as text',
              when: 'The answer is final and the user cannot change it. There is no read-only radio in HTML.',
              explain: [
                'A disabled group looks like something the user might unlock. Plain text says the answer is settled.',
                '`Text` with `tone="muted"` for the question and the default tone for the answer keeps the two apart.',
                'Use a disabled group, with a reason, when the user may change it later.',
              ],
              render: (
                <Stack gap={1}>
                  <Text as="p" variant="caption" tone="muted">Delivery</Text>
                  <Text as="p">Standard, 3 to 5 days</Text>
                </Stack>
              ),
              code: `// HTML has no read-only radio. Show the answer as text instead.
<Stack gap={1}>
  <Text as="p" variant="caption" tone="muted">Delivery</Text>
  <Text as="p">Standard, 3 to 5 days</Text>
</Stack>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'A fieldset with role="radiogroup". The legend, description and error are tied to the group.',
          examples: [
            {
              title: 'Your own id',
              when: 'Another element must point to the group, such as a link in an error summary.',
              explain: [
                '`id` replaces the generated id on the group. The option ids are built from it.',
                'A link such as `<a href="#delivery-group">` then jumps to the group.',
                'Ids must be unique on the page.',
              ],
              render: <RadioGroup legend="Delivery" id="delivery-group" options={DELIVERY} />,
              code: `// An error summary can now link to #delivery-group.
<RadioGroup legend="Delivery" id="delivery-group" options={deliveryOptions} />`,
            },
            {
              title: 'Group with a description and an error',
              when: 'A group has both help text and an error.',
              explain: [
                'The group\'s `aria-describedby` lists the description first, then the error. A screen reader reads both, in that order.',
                'Keep the description about the choice, and the error about the fix. Do not repeat one in the other.',
              ],
              render: <RadioGroup legend="Delivery" description="Prices include tax." error="Choose a delivery option" options={DELIVERY} />,
              code: `// aria-describedby = description id, then error id. Set for you.
<RadioGroup
  legend="Delivery"
  description="Prices include tax."
  error="Choose a delivery option"
  options={deliveryOptions}
/>`,
            },
          ],
        },
      ]}
    />
  ),
};
