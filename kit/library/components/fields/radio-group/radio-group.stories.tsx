import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { RadioGroup } from './radio-group';
import { radioGroupRules } from './radio-group.rules';

// The showcase: one page story. The states grid replaces one story per state.
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
          { name: 'size.target.min · size.icon.lg · size.icon.sm · size.border.thick', tier: '2', use: 'Target (44px); circle; dot; circle outline' },
          { name: 'radius.full', tier: '2', use: 'Circle shape' },
        ],
      }}
      anatomy={{
        render: cell(<RadioGroup legend="Delivery" required description="Prices show at checkout." options={DELIVERY} defaultValue="standard" />),
        parts: [
          { n: 1, label: 'Legend', note: 'required, names the group', target: '.ds-field__label' },
          { n: 2, label: 'Description', note: 'optional', target: '.ds-field__description' },
          { n: 3, label: 'Radio and dot', note: 'native, drawn', target: '.ds-radio-group__circle' },
          { n: 4, label: 'Option label', note: 'required, part of the target', target: '.ds-field__choice-label', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Target', value: 'size.target.min, 44px, the whole option row' },
        { label: 'Circle', value: 'size.icon.lg, 24px, outline size.border.thick' },
        { label: 'Dot', value: 'size.icon.sm' },
        { label: 'Options', value: 'stacked with no gap: the targets touch, none overlaps' },
        { label: 'Focus', value: 'ring 2px, offset 2px, around the circle, on :focus-visible' },
      ]}
      api={[
        { label: 'legend', value: 'Required. The question. It names the group for assistive technology.' },
        { label: 'options', value: 'Required. A list of { value, label, disabled? }.' },
        { label: 'value · defaultValue · onValueChange', value: 'Controlled or uncontrolled selection. Preselect only with a reason.' },
        { label: 'onBlur', value: 'Group blur: called when focus leaves the group, not when arrow keys move it from one radio to the next. Validate there.' },
        { label: 'name', value: 'Shared by the radios. A generated name is used when omitted.' },
        { label: 'description · error', value: 'Help and error under the legend and under the list, tied to the group with aria-describedby. The error sets aria-invalid.' },
        { label: 'required · requiredText · errorPrefix · disabled', value: 'As the text field. disabled applies to the whole group.' },
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
      rules={radioGroupRules}
      guide="fields-radio-group--docs"
      guideName="Radio group"
    />
  ),
};
