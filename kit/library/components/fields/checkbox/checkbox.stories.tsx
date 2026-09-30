import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { DocPage } from '../../../.storybook/doc-page/doc-page';
import { Checkbox } from './checkbox';
import { checkboxRules } from './checkbox.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Fields/Checkbox', component: Checkbox, parameters: { layout: 'fullscreen' }, args: { label: 'Label' } } satisfies Meta<typeof Checkbox>;

export default meta;

const cell = (node: ReactNode) => <div style={{ inlineSize: '100%', maxInlineSize: 'calc(var(--ds-space-12) * 6)' }}>{node}</div>;

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Checkbox"
      layer="Component"
      family="Fields"
      plain="A checkbox is a small box you tick to say yes. It is for one independent choice, like accepting the terms, or for picking rows in a list. Ticking one does not untick another."
      precise="Component in the fields family · toggles one independent option · native input of type checkbox with a clickable label · not for a setting that acts at once (switch) or for one-of-many (radio group)."
      usedFor="Accepting terms, opting in, selecting rows, a parent box for a partly checked group."
      tokens={{
        mode: 'consumed',
        note: 'The checkbox has no component tokens.',
        rows: [
          { name: 'field.surface · field.border · border-hover · border-invalid', tier: 'role', use: 'Empty box fill and outline (3:1), hover and error', swatch: '--ds-field-border' },
          { name: 'selection.surface · selection.mark', tier: 'role', use: 'Fill of a checked or mixed box, and the check on it', swatch: '--ds-selection-surface' },
          { name: 'disabled.text · disabled.surface · disabled.border', tier: 'role', use: 'Disabled box and label', swatch: '--ds-disabled-surface' },
          { name: 'status.error', tier: 'role', use: 'Error text and icon', swatch: '--ds-status-error' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator around the box', swatch: '--ds-focus-ring-color' },
          { name: 'text.default · text.muted', tier: 'role', use: 'Label; description', swatch: '--ds-text-muted' },
          { name: 'text.body.* · text.caption.*', tier: '2', use: 'Label; description and error' },
          { name: 'size.target.min · size.icon.lg · size.icon.sm · size.border.thick', tier: '2', use: 'Target (44px); box; check mark; box outline' },
          { name: 'radius.sm', tier: '2', use: 'Box corner' },
        ],
      }}
      anatomy={{
        render: cell(<Checkbox label="Send me the newsletter" description="One email a month." defaultChecked />),
        stagePadding: 'var(--ds-space-12)',
        parts: [
          { n: 1, label: 'Target', note: '44px, holds the native input', x: '-18px', y: '22px' },
          { n: 2, label: 'Box and check', note: 'drawn, decorative', x: '22px', y: '-18px' },
          { n: 3, label: 'Label', note: 'required, part of the target', x: 'calc(100% + 18px)', y: '22px' },
          { n: 4, label: 'Description', note: 'optional', x: 'calc(100% + 18px)', y: 'calc(100% - 12px)' },
        ],
      }}
      specs={[
        { label: 'Target', value: 'size.target.min, 44px, the whole row is the target' },
        { label: 'Box', value: 'size.icon.lg, 24px, outline size.border.thick' },
        { label: 'Mark', value: 'check, or minus for mixed, size.icon.sm' },
        { label: 'Label', value: 'text.body.*, to the side, clickable' },
        { label: 'Focus', value: 'ring 2px, offset 2px, around the box, on :focus-visible' },
      ]}
      api={[
        { label: 'label', value: 'Required. Visible, bound to the input, and part of the target.' },
        { label: 'description · error', value: 'Help and error text under the label, tied with aria-describedby. The error sets aria-invalid.' },
        { label: 'indeterminate', value: 'Shows the mixed state. The user clears it by toggling.' },
        { label: 'required · requiredText · errorPrefix', value: 'As the text field.' },
        { label: '…props', value: 'Every native input attribute, such as checked, defaultChecked, disabled, name, value, onChange and ref.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'designed', render: cell(<Checkbox label="Send me the newsletter" />), trigger: 'unchecked' },
          { id: 'loading', status: 'n/a', reason: 'A checkbox does not load. The view disables it while a save runs.' },
          { id: 'none', status: 'n/a', reason: 'The checkbox holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'The checkbox holds no collection.' },
          { id: 'some', status: 'designed', label: 'Some (mixed)', render: cell(<Checkbox label="Select all rows" indeterminate />), trigger: 'indeterminate', note: 'A parent whose children are partly checked. Read as "mixed".' },
          { id: 'too-many', status: 'designed', label: 'Too many (long label)', render: cell(<Checkbox label="I have read and I accept the terms of service, the privacy policy and the cookie policy of this site" />), trigger: 'long label', note: 'The label wraps; the box stays at the top of the first line.' },
          { id: 'incorrect', status: 'designed', render: cell(<Checkbox label="I accept the terms" required error="Accept the terms to continue." />), trigger: 'error' },
          { id: 'correct', status: 'designed', render: cell(<Checkbox label="I accept the terms" required defaultChecked />), trigger: 'error cleared' },
          { id: 'done', status: 'n/a', reason: 'Saving belongs to the form.' },
          { id: 'default', status: 'designed', render: cell(<Checkbox label="Send me the newsletter" />), trigger: 'rest' },
          { id: 'hover', status: 'designed', render: cell(<Checkbox label="Send me the newsletter" />), trigger: ':hover', note: 'Hover darkens the box outline inside @media (hover: hover); the grid cannot replay a media query, so this cell shows rest.' },
          { id: 'focus-visible', status: 'designed', render: cell(<Checkbox label="Send me the newsletter" className="doc-force-focus" />), trigger: ':focus-visible', note: 'Forced by .doc-force-focus.' },
          { id: 'active', status: 'n/a', reason: 'The box changes at once on press; there is no pressed look.' },
          { id: 'disabled', status: 'designed', render: cell(<><Checkbox label="Send me the newsletter" disabled /><Checkbox label="Send me the newsletter" disabled defaultChecked /></>), trigger: 'disabled', note: 'Checked and unchecked. Say why, near the box.' },
          { id: 'selected', status: 'designed', label: 'Selected (checked)', render: cell(<Checkbox label="Send me the newsletter" defaultChecked />), trigger: 'checked', note: 'Fill and a check mark: shape, not colour alone.' },
          { id: 'required', status: 'designed', group: 'interaction', render: cell(<Checkbox label="I accept the terms" required />), trigger: 'required' },
        ],
      }}
      dos={[
        { text: 'Make the label part of the target.', basis: 'WCAG 2.5.8 (AA)' },
        { text: 'Use the mixed state for a parent of partly checked children.', basis: 'APG Checkbox' },
        { text: 'Write the label as a statement the user agrees with.', basis: 'WCAG 3.3.2 (A)' },
      ]}
      donts={[
        { text: 'Make only the small box clickable.', basis: 'WCAG 2.5.8 (AA)', rule: 'checkbox.label-clickable' },
        { text: 'Hide the mixed state from assistive technology.', basis: 'WCAG 4.1.2 (A)', rule: 'checkbox.mixed-exposed' },
        { text: 'Draw a box outline under 3:1.', basis: 'WCAG 1.4.11 (AA)', rule: 'checkbox.box-contrast' },
        { text: 'Use a div with a click handler.', basis: 'APG Checkbox; WCAG 4.1.2 (A)', rule: 'checkbox.native-element' },
        { text: 'Write a colour or px literal in the stylesheet.', basis: 'misfile.raw-value-in-component', rule: 'checkbox.no-literal' },
      ]}
      rules={checkboxRules}
      guide="fields-checkbox--docs"
      guideName="Checkbox"
    />
  ),
};
