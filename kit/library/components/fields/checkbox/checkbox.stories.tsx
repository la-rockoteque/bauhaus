import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Button } from '../../clickables/button/button';
import { Checkbox } from './checkbox';
import { checkboxRules } from './checkbox.rules';

// The showcase: one page story. The state matrix replaces one story per state.
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
          { name: 'size.target.min · size.icon.md · size.icon.sm · size.border.thick', tier: '2', use: 'Target (24px); box; check mark; box outline' },
          { name: 'radius.sm', tier: '2', use: 'Box corner' },
        ],
      }}
      stage={{
        render: (args) =>
          cell(
            <Checkbox
              label={String(args.label)}
              description={String(args.description) || undefined}
              error={String(args.error) || undefined}
              indeterminate={args.indeterminate === true}
              required={args.required === true}
              disabled={args.disabled === true}
              defaultChecked
            />,
          ),
        parts: [
          { n: 1, label: 'Target', note: '24px, holds the native input', target: '.ds-field__choice-target', at: 'top-start' },
          { n: 2, label: 'Box and check', note: 'drawn, decorative', target: '.ds-checkbox__box' },
          { n: 3, label: 'Label', note: 'required, part of the target', target: '.ds-field__choice-label', at: 'bottom-end' },
          { n: 4, label: 'Description', note: 'optional', target: '.ds-field__description' },
        ],
      }}
      specs={[
        { label: 'Target height', property: 'height', target: '.ds-field__choice-target', token: 'size.target.min', value: '24px, the WCAG 2.5.8 (AA) floor' },
        { label: 'Target width', property: 'width', target: '.ds-field__choice-target', token: 'size.target.min' },
        { label: 'Box height', property: 'height', target: '.ds-checkbox__box', token: 'size.icon.md', value: '16px, outline size.border.thick' },
        { label: 'Box width', property: 'width', target: '.ds-checkbox__box', token: 'size.icon.md' },
        { label: 'Box radius', property: 'radius', target: '.ds-checkbox__box', token: 'radius.sm' },
        { label: 'Mark', value: 'check, or minus for mixed, size.icon.sm' },
        { label: 'Label', value: 'text.body.*, to the side, clickable' },
        { label: 'Focus', value: 'ring 2px, offset 2px, around the box, on :focus-visible' },
      ]}
      api={[
        { label: 'label', value: 'Required. Visible, bound to the input, and part of the target.', control: { kind: 'text', value: 'Send me the newsletter' } },
        { label: 'description', value: 'Help text under the label, tied with aria-describedby.', control: { kind: 'text', value: 'One email a month.' } },
        { label: 'error', value: 'Error text under the label, tied with aria-describedby. It sets aria-invalid.', control: { kind: 'text', value: '' } },
        { label: 'indeterminate', value: 'Shows the mixed state. The user clears it by toggling.', control: { kind: 'boolean', value: false } },
        { label: 'required', value: 'As the text field.', control: { kind: 'boolean', value: false } },
        { label: 'requiredText · errorPrefix', value: 'As the text field.' },
        { label: 'disabled', value: 'A native input attribute.', control: { kind: 'boolean', value: false } },
        { label: '…props', value: 'Every other native input attribute, such as checked, defaultChecked, name, value, onChange, onBlur and ref. onBlur fires when focus leaves the box: validate there.' },
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
          { id: 'hover', status: 'designed', render: cell(<Checkbox label="Send me the newsletter" className="doc-force-hover" />), trigger: ':hover', note: 'Forced by .doc-force-hover. The box outline takes field.border-hover.' },
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
      guide="fields-checkbox--docs"
      guideName="Checkbox"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Checkbox" layer="Component" family="Fields" rules={checkboxRules} guide="fields-checkbox--docs" guideName="Checkbox" />,
};

/** The view owns the box, so it can reset it and read it. */
function NewsletterOptIn() {
  const [subscribed, setSubscribed] = useState(false);
  return <Checkbox label="Send me the newsletter" checked={subscribed} onChange={(event) => setSubscribed(event.target.checked)} />;
}

/** A box that must be ticked: the view checks it when the user leaves it, and clears the error on a tick. */
function AcceptTerms() {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  return (
    <Checkbox
      label="I accept the terms of service"
      required
      checked={accepted}
      error={error}
      onChange={(event) => {
        setAccepted(event.target.checked);
        if (event.target.checked) setError('');
      }}
      onBlur={() => setError(accepted ? '' : 'Accept the terms of service to create your account')}
    />
  );
}

/** The parent box is mixed while some children are checked, and a toggle sets them all. */
function SelectAllRows() {
  const [rows, setRows] = useState([true, false, false]);
  const checked = rows.filter(Boolean).length;
  return (
    <Stack gap={2}>
      <Checkbox
        label="Select all invoices"
        checked={checked === rows.length}
        indeterminate={checked > 0 && checked < rows.length}
        onChange={() => setRows(rows.map(() => checked !== rows.length))}
      />
      <Stack gap={2} role="group" aria-label="Invoices">
        {['Invoice 2041', 'Invoice 2042', 'Invoice 2043'].map((name, n) => (
          <Checkbox key={name} label={name} checked={rows[n]} onChange={(event) => setRows(rows.map((on, k) => (k === n ? event.target.checked : on)))} />
        ))}
      </Stack>
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Checkbox"
      layer="Component"
      family="Fields"
      imports="import { Checkbox, Stack, Button } from '@acme/design-system';"
      guide="fields-checkbox--docs"
      guideName="Checkbox"
      groups={[
        {
          title: 'Basics',
          kicker: 'One independent yes or no that a form saves. The label is part of the target.',
          examples: [
            { title: 'Unchecked', when: 'An option the user turns on, off by default.', render: <Checkbox label="Send me the newsletter" /> },
            { title: 'Checked', when: 'An option that is on by default, or one the user already chose.', render: <Checkbox label="Send me the newsletter" defaultChecked /> },
            { title: 'With a description', when: 'The label needs a line of context. The description joins aria-describedby.', render: <Checkbox label="Send me the newsletter" description="One email a month. You can leave at any time." /> },
            { title: 'Required', when: 'The box must be ticked to go on. The marker is a word, not an asterisk.', render: <Checkbox label="I accept the terms of service" required /> },
            { title: 'Required, in another language', when: 'Change the word of the marker with requiredText for a translated view.', render: <Checkbox label="J’accepte les conditions d’utilisation" required requiredText="obligatoire" /> },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props. The native attributes do the work.',
          examples: [
            { title: 'Error', when: 'A box that must be ticked is not. Name what is missing and the fix.', render: <Checkbox label="I accept the terms of service" required error="Accept the terms of service to create your account" /> },
            { title: 'Error, in another language', when: 'Change the hidden word before the error with errorPrefix.', render: <Checkbox label="J’accepte les conditions d’utilisation" required requiredText="obligatoire" error="Acceptez les conditions pour créer votre compte" errorPrefix="Erreur" /> },
            { title: 'Mixed', when: 'A parent whose children are partly checked. A toggle by the user clears the mixed state.', render: <Checkbox label="Select all invoices" indeterminate /> },
            { title: 'Disabled, unchecked', when: 'The user cannot change the box now. Say why in the description.', render: <Checkbox label="Share with the whole team" disabled description="Ask an admin to turn on sharing." /> },
            { title: 'Disabled, checked', when: 'A choice that is fixed on. Say why in the description.', render: <Checkbox label="Receive security alerts" disabled defaultChecked description="Always on for your account." /> },
          ],
        },
        {
          title: 'Content',
          kicker: 'The label wraps inside its column. The box stays at the start of the first line.',
          examples: [
            { title: 'Long label', when: 'A consent sentence: the label wraps and the whole text stays a target.', render: <Checkbox label="I agree that the company may contact me about products and services that are similar to the ones I already bought" /> },
            { title: 'Long label and description in a narrow column', when: 'Translated text runs longer: both wrap rather than truncate.', frame: 'narrow', render: <Checkbox label="Envoyez-moi le bulletin d’information mensuel" description="Un courriel par mois. Vous pouvez vous désabonner à tout moment." /> },
            { title: 'Error in a narrow column', when: 'The error wraps below its icon and stays whole.', frame: 'narrow', render: <Checkbox label="I accept the terms" required error="Accept the terms of service to create your account" /> },
            { title: 'On a phone', when: 'The row fills the width of its container, with a target at least 24px high.', frame: 'phone', render: <Checkbox label="Remember me on this device" description="Do not use this on a shared computer." /> },
          ],
        },
        {
          title: 'A group of boxes',
          kicker: 'Wrap several boxes in a fieldset with a legend, as the radio group does.',
          examples: [
            {
              title: 'Several answers',
              when: 'The user may tick any number of options. The legend is the question.',
              render: (
                <Stack as="fieldset" gap={2}>
                  <legend>Which topics interest you?</legend>
                  <Checkbox label="Product news" defaultChecked />
                  <Checkbox label="Events" />
                  <Checkbox label="Tips and guides" />
                </Stack>
              ),
            },
            {
              title: 'Parent and children',
              when: 'A parent box that selects all rows and shows the mixed state while some are checked.',
              render: <SelectAllRows />,
              code: `function SelectAllRows() {
  const [rows, setRows] = useState([true, false, false]);
  const checked = rows.filter(Boolean).length;
  return (
    <Stack gap={2}>
      <Checkbox
        label="Select all invoices"
        checked={checked === rows.length}
        indeterminate={checked > 0 && checked < rows.length}
        onChange={() => setRows(rows.map(() => checked !== rows.length))}
      />
      <Stack gap={2} role="group" aria-label="Invoices">
        {['Invoice 2041', 'Invoice 2042', 'Invoice 2043'].map((name, n) => (
          <Checkbox key={name} label={name} checked={rows[n]} onChange={(event) => setRows(rows.map((on, k) => (k === n ? event.target.checked : on)))} />
        ))}
      </Stack>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Controlled and uncontrolled',
          examples: [
            { title: 'Uncontrolled', when: 'The browser holds the box; read it from the form on submit.', render: <Checkbox label="Send me the newsletter" name="newsletter" defaultChecked /> },
            {
              title: 'Controlled',
              when: 'The view owns the box, so it can reset it or read it before a submit.',
              render: <NewsletterOptIn />,
              code: `function NewsletterOptIn() {
  const [subscribed, setSubscribed] = useState(false);
  return <Checkbox label="Send me the newsletter" checked={subscribed} onChange={(event) => setSubscribed(event.target.checked)} />;
}`,
            },
          ],
        },
        {
          title: 'In a form',
          examples: [
            {
              title: 'A box that must be ticked',
              when: 'Check it when focus leaves the box, and clear the error on a tick.',
              render: <AcceptTerms />,
              code: `function AcceptTerms() {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  return (
    <Checkbox
      label="I accept the terms of service"
      required
      checked={accepted}
      error={error}
      onChange={(event) => {
        setAccepted(event.target.checked);
        if (event.target.checked) setError('');
      }}
      onBlur={() => setError(accepted ? '' : 'Accept the terms of service to create your account')}
    />
  );
}`,
            },
            {
              title: 'Sign-up consent',
              when: 'One required box and one optional box, then one primary action.',
              render: (
                <Stack as="form" gap={4} onSubmit={(event) => event.preventDefault()}>
                  <Checkbox label="I accept the terms of service" name="terms" required />
                  <Checkbox label="Send me the newsletter" name="newsletter" description="One email a month." />
                  <Stack direction="horizontal" justify="end">
                    <Button type="submit">Create account</Button>
                  </Stack>
                </Stack>
              ),
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label, description and error are tied to the input with for, id and aria-describedby.',
          examples: [
            { title: 'Your own id', when: 'Another element must point to the box, such as an error summary.', render: <Checkbox label="I accept the terms of service" id="accept-terms" required /> },
            { title: 'Value for a form', when: 'Give the box a name and a value, so a native form submits what the user chose.', render: <Checkbox label="Gift wrap" name="extras" value="gift-wrap" /> },
          ],
        },
      ]}
    />
  ),
};
