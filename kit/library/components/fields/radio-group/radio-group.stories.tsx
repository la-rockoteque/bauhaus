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
      <RadioGroup
        legend="Delivery"
        value={delivery}
        onValueChange={setDelivery}
        options={[
          { value: 'standard', label: 'Standard, 3 to 5 days' },
          { value: 'express', label: 'Express, next day' },
          { value: 'pickup', label: 'Pickup in store' },
        ]}
      />
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
      options={[
        { value: 'standard', label: 'Standard, 3 to 5 days' },
        { value: 'express', label: 'Express, next day' },
        { value: 'pickup', label: 'Pickup in store' },
      ]}
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
      imports="import { RadioGroup, Stack, Text, Button } from '@acme/design-system';"
      guide="fields-radio-group--docs"
      guideName="Radio group"
      groups={[
        {
          title: 'Basics',
          kicker: 'One choice from two to five options that fit on screen. The legend is the question.',
          examples: [
            { title: 'No choice yet', when: 'The question has no honest default, so no option is checked. Tab enters at the first option.', render: <RadioGroup legend="Delivery" options={DELIVERY} /> },
            { title: 'With a default', when: 'One option is the honest default. A chosen option hides the question, so preselect with a reason.', render: <RadioGroup legend="Delivery" options={DELIVERY} defaultValue="standard" /> },
            { title: 'With a description', when: 'The user needs a hint about the question before choosing.', render: <RadioGroup legend="Delivery" description="Prices include tax." options={DELIVERY} /> },
            { title: 'Two options', when: 'A choice between two things that are not a yes or no.', render: <RadioGroup legend="Billing period" options={[{ value: 'monthly', label: 'Monthly' }, { value: 'annual', label: 'Annual, two months free' }]} /> },
            { title: 'Five options', when: 'The upper end of the range. More than five: use a select.', render: <RadioGroup legend="Rate your visit" options={[{ value: '1', label: 'Poor' }, { value: '2', label: 'Fair' }, { value: '3', label: 'Good' }, { value: '4', label: 'Very good' }, { value: '5', label: 'Excellent' }]} /> },
            { title: 'Required', when: 'The form cannot go on without a choice. The marker is a word, not an asterisk.', render: <RadioGroup legend="Delivery" required options={DELIVERY} /> },
            { title: 'Required, in another language', when: 'Change the word of the marker with requiredText for a translated view.', render: <RadioGroup legend="Livraison" required requiredText="obligatoire" options={[{ value: 'standard', label: 'Standard, 3 à 5 jours' }, { value: 'express', label: 'Express, le lendemain' }]} /> },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props. Disabled works on the group or on one option.',
          examples: [
            { title: 'Error', when: 'The user passed the group with no choice. Name the field and the fix.', render: <RadioGroup legend="Delivery" required error="Choose a delivery option" options={DELIVERY} /> },
            { title: 'Error, in another language', when: 'Change the hidden word before the error with errorPrefix.', render: <RadioGroup legend="Livraison" error="Choisissez un mode de livraison" errorPrefix="Erreur" options={[{ value: 'standard', label: 'Standard, 3 à 5 jours' }, { value: 'express', label: 'Express, le lendemain' }]} /> },
            { title: 'Disabled group', when: 'The user cannot change the answer now. Say why in the description.', render: <RadioGroup legend="Delivery" disabled description="The order has shipped." defaultValue="standard" options={DELIVERY} /> },
            { title: 'Disabled option', when: 'One option is not available now. Say why nearby.', render: <RadioGroup legend="Delivery" description="Express is closed on Sundays." options={[{ value: 'standard', label: 'Standard, 3 to 5 days' }, { value: 'express', label: 'Express, next day', disabled: true }, { value: 'pickup', label: 'Pickup in store' }]} /> },
          ],
        },
        {
          title: 'Content',
          kicker: 'An option label is any content. It wraps inside its column.',
          examples: [
            { title: 'Rich label', when: 'An option with a price or a note next to its name.', render: <RadioGroup legend="Plan" defaultValue="team" options={[{ value: 'solo', label: <><strong>Solo</strong>, 9 dollars a month</> }, { value: 'team', label: <><strong>Team</strong>, 29 dollars a month</> }]} /> },
            { title: 'Long option labels', when: 'An option that needs a full sentence: the label wraps and the whole text stays a target.', render: <RadioGroup legend="Data retention" options={[{ value: '30', label: 'Keep my data for 30 days after I close the account, then delete it for good' }, { value: '0', label: 'Delete my data as soon as I close the account' }]} /> },
            { title: 'Long legend and description in a narrow column', when: 'Translated text runs longer: both wrap rather than truncate.', frame: 'narrow', render: <RadioGroup legend="Mode de livraison préféré pour cette commande" description="Les frais s’affichent à l’étape suivante." options={[{ value: 'standard', label: 'Standard, 3 à 5 jours ouvrables' }, { value: 'express', label: 'Express, le lendemain' }]} /> },
            { title: 'Error in a narrow column', when: 'The error wraps below its icon and stays whole.', frame: 'narrow', render: <RadioGroup legend="Delivery" error="Choose a delivery option before you pay" options={DELIVERY} /> },
            { title: 'On a phone', when: 'Each row fills the width of its container, with a target at least 24px high.', frame: 'phone', render: <RadioGroup legend="Delivery" required options={DELIVERY} /> },
          ],
        },
        {
          title: 'Controlled and uncontrolled',
          kicker: 'The browser owns the arrow keys and the single Tab stop in both.',
          examples: [
            { title: 'Uncontrolled', when: 'The browser holds the choice; read it from the form on submit.', render: <RadioGroup legend="Size" name="size" defaultValue="medium" options={SIZES} /> },
            {
              title: 'Controlled',
              when: 'The view owns the value and reacts to a change, such as a price note.',
              render: <DeliveryChoice />,
              code: `function DeliveryChoice() {
  const [delivery, setDelivery] = useState('standard');
  return (
    <Stack gap={2}>
      <RadioGroup
        legend="Delivery"
        value={delivery}
        onValueChange={setDelivery}
        options={[
          { value: 'standard', label: 'Standard, 3 to 5 days' },
          { value: 'express', label: 'Express, next day' },
          { value: 'pickup', label: 'Pickup in store' },
        ]}
      />
      <Text as="p" role="status" variant="caption" tone="muted">{priceNote(delivery)}</Text>
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
              title: 'Validate on group blur',
              when: 'Show the error when focus leaves the group, not when the arrows move between options.',
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
        setError('');
      }}
      onBlur={() => setError(delivery === '' ? 'Choose a delivery option' : '')}
      options={[
        { value: 'standard', label: 'Standard, 3 to 5 days' },
        { value: 'express', label: 'Express, next day' },
        { value: 'pickup', label: 'Pickup in store' },
      ]}
    />
  );
}`,
            },
            {
              title: 'Shared name',
              when: 'Give the group a name so a native form submits the chosen value. Without one, the group makes its own.',
              render: <RadioGroup legend="Shirt size" name="shirt-size" options={SIZES} />,
            },
            {
              title: 'A checkout step',
              when: 'Two questions, then one primary action.',
              render: (
                <Stack as="form" gap={4} onSubmit={(event) => event.preventDefault()}>
                  <RadioGroup legend="Delivery" name="delivery" required options={DELIVERY} />
                  <RadioGroup legend="Gift wrap" name="wrap" defaultValue="no" options={[{ value: 'no', label: 'No wrap' }, { value: 'yes', label: 'Wrap as a gift' }]} />
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
          kicker: 'A fieldset with role="radiogroup": the legend, description and error are tied to the group.',
          examples: [
            { title: 'Your own id', when: 'Another element must point to the group, such as an error summary.', render: <RadioGroup legend="Delivery" id="delivery-group" options={DELIVERY} /> },
            { title: 'Group with a description and an error', when: 'The description comes first in aria-describedby, then the error.', render: <RadioGroup legend="Delivery" description="Prices include tax." error="Choose a delivery option" options={DELIVERY} /> },
          ],
        },
      ]}
    />
  ),
};
