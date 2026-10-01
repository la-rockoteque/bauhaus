import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
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

/** The submit handler focuses the first box that is wrong, through the `ref` prop. */
function FocusOnError() {
  const box = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  return (
    <Stack
      as="form"
      gap={3}
      onSubmit={(event) => {
        event.preventDefault();
        const ticked = box.current?.checked === true;
        setError(ticked ? '' : 'Accept the terms of service to create your account');
        if (!ticked) box.current?.focus();
      }}
    >
      <Checkbox ref={box} label="I accept the terms of service" required error={error} />
      <Stack direction="horizontal" justify="end">
        <Button type="submit">Create account</Button>
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
      imports="import { Checkbox, Button, Stack } from '@acme/design-system';"
      intro={[
        'Pick a checkbox for a yes or no that a form saves later: "Send me the newsletter". Ticking one box never changes another.',
        'Pick a switch instead when the change applies at once, with no Save button. Pick a radio group when the user must choose exactly one of several options.',
        'Use a checkbox on its own for one option, and in a group (several boxes under one question) for "tick all that apply".',
        '`Checkbox` renders a native `<input type="checkbox">`. The browser gives you focus, the Space key, the form value and the label click for free.',
        'Every other native input attribute passes through: `name`, `value`, `checked`, `defaultChecked`, `onChange`, `onBlur`, `disabled`, `ref`.',
        '"Controlled" means your React state holds the answer (`checked` plus `onChange`). "Uncontrolled" means the browser holds it, and you read it when the form is sent.',
        'ARIA attributes are extra labels that screen readers read out, such as `aria-describedby`. The component sets them for you.',
      ]}
      guide="fields-checkbox--docs"
      guideName="Checkbox"
      groups={[
        {
          title: 'Basics',
          kicker: 'One independent yes or no. Start here: the label is the only prop you must pass.',
          examples: [
            {
              title: 'Unchecked',
              when: 'An option the user turns on. Off is the safe default.',
              explain: [
                '`label` is the only required prop. It stays visible beside the box, and a click on it ticks the box.',
                'Without a visible label, a person using speech control cannot say what to click, and the target is only the tiny box (WCAG 2.5.3, A).',
                'Write the label as a statement the user agrees with: "Send me the newsletter", not "Newsletter".',
              ],
              render: <Checkbox label="Send me the newsletter" />,
              code: `// The label is required. It is visible, and clicking it ticks the box.
<Checkbox label="Send me the newsletter" />`,
            },
            {
              title: 'Checked by default',
              when: 'An option that is already on when the form opens, or an answer the user gave before.',
              explain: [
                '`defaultChecked` sets the starting value and lets the browser hold the rest. This is the uncontrolled way.',
                'Do not use `checked` here without an `onChange`: React then freezes the box and the user cannot change it.',
                'A drawn check mark shows the state, not only the fill colour, so it reads without colour vision (WCAG 1.4.1, A).',
              ],
              render: <Checkbox label="Send me the newsletter" defaultChecked />,
              code: `// defaultChecked = the starting value. The user can still untick it.
<Checkbox label="Send me the newsletter" defaultChecked />`,
            },
            {
              title: 'With a description',
              when: 'The label needs one more line of context, such as how often or how to undo.',
              explain: [
                '`description` shows small text under the label.',
                'The component links it to the box with `aria-describedby`, so a screen reader reads the label, then the description.',
                'Keep the label short and put the detail here. A long label is hard to scan (WCAG 3.3.2, A).',
              ],
              render: <Checkbox label="Send me the newsletter" description="One email a month. You can leave at any time." />,
              code: `// description is read by screen readers after the label.
<Checkbox
  label="Send me the newsletter"
  description="One email a month. You can leave at any time."
/>`,
            },
            {
              title: 'Required',
              when: 'The form cannot go on until the box is ticked, such as accepting the terms.',
              explain: [
                '`required` adds the native `required` attribute. The browser blocks the submit and says why.',
                'It also adds the visible word "(required)" after the label. A bare asterisk explains nothing to many users (WCAG 3.3.2, A).',
                'Use it only for a box that must be ticked. An optional newsletter box is never required.',
              ],
              render: <Checkbox label="I accept the terms of service" required />,
              code: `// required: the browser blocks the submit, and the label says "(required)".
<Checkbox label="I accept the terms of service" required />`,
            },
            {
              title: 'Required, in another language',
              when: 'The view is translated. The word "required" must follow.',
              explain: [
                '`requiredText` replaces the word in the marker. The default is the English "required".',
                'All text in the component arrives as props, so you translate it where you build the view (WCAG 3.1.1, A).',
              ],
              render: <Checkbox label="J’accepte les conditions d’utilisation" required requiredText="obligatoire" />,
              code: `// requiredText swaps the word in "(required)".
<Checkbox label="J’accepte les conditions d’utilisation" required requiredText="obligatoire" />`,
            },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props, not variants. The native attributes do the work.',
          examples: [
            {
              title: 'Error',
              when: 'A box that must be ticked is not. Say what is missing and what to do.',
              explain: [
                '`error` shows the message under the box, with an icon and a hidden word "Error:" that screen readers read first.',
                'The component sets `aria-invalid` and links the message with `aria-describedby`. The box outline also turns to the error colour.',
                'Colour is only the third cue. The text and the icon say it too (WCAG 3.3.1, A; WCAG 1.4.1, A).',
                'Write the fix, not only the problem: "Accept the terms of service to create your account".',
              ],
              render: <Checkbox label="I accept the terms of service" required error="Accept the terms of service to create your account" />,
              code: `// The error string is the state. An empty string or undefined means no error.
<Checkbox
  label="I accept the terms of service"
  required
  error="Accept the terms of service to create your account"
/>`,
            },
            {
              title: 'Error, in another language',
              when: 'The hidden word before the error must follow the language of the view.',
              explain: [
                '`errorPrefix` replaces the hidden "Error" that a screen reader reads before the message.',
                'Sighted users never see this word. It only tells a person who listens that the next sentence is an error.',
              ],
              render: <Checkbox label="J’accepte les conditions d’utilisation" required requiredText="obligatoire" error="Acceptez les conditions pour créer votre compte" errorPrefix="Erreur" />,
              code: `<Checkbox
  label="J’accepte les conditions d’utilisation"
  required
  requiredText="obligatoire"
  error="Acceptez les conditions pour créer votre compte"
  // Read aloud before the message: "Erreur : Acceptez les conditions..."
  errorPrefix="Erreur"
/>`,
            },
            {
              title: 'Mixed',
              when: 'A parent box whose children are partly checked, such as "Select all" with two rows ticked.',
              explain: [
                '`indeterminate` draws a minus instead of a check. Screen readers say "mixed".',
                'The shape tells the states apart, not the colour (WCAG 1.4.1, A). Assistive technology reads the state (WCAG 4.1.2, A).',
                'The user clears the mixed state by clicking the box. For a full parent and children recipe, see "Parent and children" below.',
              ],
              render: <Checkbox label="Select all invoices" indeterminate />,
              code: `// indeterminate is a visual and spoken state, not a value.
// It goes away when the user toggles the box.
<Checkbox label="Select all invoices" indeterminate />`,
            },
            {
              title: 'Disabled, unchecked',
              when: 'The user cannot change the box right now.',
              explain: [
                '`disabled` is the native attribute. The box leaves the Tab order and ignores clicks.',
                'A disabled box is exempt from the colour contrast rules (WCAG 1.4.3 exception), so the reason must be readable beside it.',
                'Put the reason and the way out in `description`: the user learns why instead of guessing (Nielsen heuristic 1, visibility of system status).',
              ],
              render: <Checkbox label="Share with the whole team" disabled description="Ask an admin to turn on sharing." />,
              code: `// Say why it is disabled, and how to get it enabled.
<Checkbox
  label="Share with the whole team"
  disabled
  description="Ask an admin to turn on sharing."
/>`,
            },
            {
              title: 'Disabled, checked',
              when: 'A choice that is fixed on and that the user cannot remove.',
              explain: [
                'A disabled box still shows its check mark, so the user sees the fixed answer.',
                'A disabled box is not sent with a native form. If the server needs the value, send it yourself.',
              ],
              render: <Checkbox label="Receive security alerts" disabled defaultChecked description="Always on for your account." />,
              code: `// Disabled boxes are left out of a native form submit.
<Checkbox
  label="Receive security alerts"
  disabled
  defaultChecked
  description="Always on for your account."
/>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The label wraps inside its column. The box stays at the start of the first line.',
          examples: [
            {
              title: 'Long label',
              when: 'A consent sentence that needs a full line or two.',
              explain: [
                'The label wraps. It never truncates, so no part of the sentence is lost.',
                'The whole label stays part of the click target, which is at least 24px high (WCAG 2.5.8, AA).',
              ],
              render: <Checkbox label="I agree that the company may contact me about products and services that are similar to the ones I already bought" />,
              code: `// No prop to set: the label wraps by itself.
<Checkbox label="I agree that the company may contact me about products and services that are similar to the ones I already bought" />`,
            },
            {
              title: 'Long label and description in a narrow column',
              when: 'Translated text runs longer than English. Both lines must wrap.',
              frame: 'narrow',
              explain: [
                'French is often 20 to 30 percent longer than English. Design for it from the start.',
                'The frame on this card is only a demo. Your own column sets the width; the component adds no width of its own.',
              ],
              render: <Checkbox label="Envoyez-moi le bulletin d’information mensuel" description="Un courriel par mois. Vous pouvez vous désabonner à tout moment." />,
              code: `<Checkbox
  label="Envoyez-moi le bulletin d’information mensuel"
  description="Un courriel par mois. Vous pouvez vous désabonner à tout moment."
/>`,
            },
            {
              title: 'Error in a narrow column',
              when: 'The error message is longer than the column.',
              frame: 'narrow',
              explain: ['The message wraps below its icon and stays whole. Never cut an error to fit (WCAG 1.4.10, AA).'],
              render: <Checkbox label="I accept the terms" required error="Accept the terms of service to create your account" />,
              code: `<Checkbox
  label="I accept the terms"
  required
  error="Accept the terms of service to create your account"
/>`,
            },
            {
              title: 'On a phone',
              when: 'The view is 320px wide, the narrowest width WCAG asks you to support.',
              frame: 'phone',
              explain: [
                'The row fills its container and needs no horizontal scroll (WCAG 1.4.10, AA).',
                'The target is at least 24px high, so a thumb can hit it (WCAG 2.5.8, AA).',
              ],
              render: <Checkbox label="Remember me on this device" description="Do not use this on a shared computer." />,
              code: `<Checkbox
  label="Remember me on this device"
  description="Do not use this on a shared computer."
/>`,
            },
          ],
        },
        {
          title: 'A group of boxes',
          kicker: 'Several boxes under one question: "tick all that apply".',
          examples: [
            {
              title: 'Several answers',
              when: 'The user may tick any number of options. The legend is the question.',
              explain: [
                'A `fieldset` groups the boxes and its `legend` is the question. A screen reader reads the legend with each box.',
                'Without the group, a lone "Events" is heard with no question, and the user cannot tell what it answers (WCAG 1.3.1, A).',
                '`Stack` spaces the boxes with `gap={2}`. Never add margins to the boxes themselves.',
                'Give each box the same `name`. A native form then sends every ticked value under that name.',
              ],
              render: (
                <Stack as="fieldset" gap={2}>
                  <legend>Which topics interest you?</legend>
                  <Checkbox label="Product news" name="topics" value="news" defaultChecked />
                  <Checkbox label="Events" name="topics" value="events" />
                  <Checkbox label="Tips and guides" name="topics" value="tips" />
                </Stack>
              ),
              code: `<Stack as="fieldset" gap={2}>
  {/* The legend is the question every box answers. */}
  <legend>Which topics interest you?</legend>
  {/* Same name, different values: the form sends all ticked ones. */}
  <Checkbox label="Product news" name="topics" value="news" defaultChecked />
  <Checkbox label="Events" name="topics" value="events" />
  <Checkbox label="Tips and guides" name="topics" value="tips" />
</Stack>`,
            },
            {
              title: 'Parent and children',
              when: 'A parent box selects all rows and shows the mixed state while only some are ticked.',
              explain: [
                'Your state holds one value per row. The parent derives its look from them: nothing is stored twice.',
                '`checked` is true when all rows are on. `indeterminate` is true when some, but not all, are on.',
                'Clicking the parent sets every row: all on when it was not full, all off when it was full.',
                'The `role="group"` and `aria-label` name the list of children for screen readers (WCAG 1.3.1, A).',
              ],
              render: <SelectAllRows />,
              code: `function SelectAllRows() {
  // One true or false per row. These are the only state.
  const [rows, setRows] = useState([true, false, false]);
  const checked = rows.filter(Boolean).length;

  return (
    <Stack gap={2}>
      <Checkbox
        label="Select all invoices"
        // Full when every row is on.
        checked={checked === rows.length}
        // Mixed when some, but not all, are on.
        indeterminate={checked > 0 && checked < rows.length}
        // From full: clear all. From empty or mixed: select all.
        onChange={() => setRows(rows.map(() => checked !== rows.length))}
      />
      <Stack gap={2} role="group" aria-label="Invoices">
        {['Invoice 2041', 'Invoice 2042', 'Invoice 2043'].map((name, n) => (
          <Checkbox
            key={name}
            label={name}
            checked={rows[n]}
            // Change only this row; keep the others.
            onChange={(event) => setRows(rows.map((on, k) => (k === n ? event.target.checked : on)))}
          />
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
          kicker: 'Who holds the answer: the browser (uncontrolled) or your React state (controlled).',
          examples: [
            {
              title: 'Uncontrolled',
              when: 'You only need the answer when the form is sent.',
              explain: [
                '`name` makes a native form include the box. `defaultChecked` sets the starting value.',
                'The browser holds the state. You read it from the form data on submit: nothing to keep in sync.',
                'This is the smallest option. Choose it unless the view must react to each change.',
              ],
              render: <Checkbox label="Send me the newsletter" name="newsletter" defaultChecked />,
              code: `// The browser holds the answer. Read it from FormData on submit:
//   new FormData(form).get('newsletter')  ->  'on' when ticked, null when not
<Checkbox label="Send me the newsletter" name="newsletter" defaultChecked />`,
            },
            {
              title: 'Controlled',
              when: 'The view must read the answer at any time, reset it, or react to each change.',
              explain: [
                '`checked` and `onChange` go together. If you pass `checked` without `onChange`, React freezes the box.',
                'Read `event.target.checked` for the new value (a boolean). Do not read `event.target.value`: that is the form value, not the state.',
                'Because your state holds the answer, you can reset it, or enable a Save button when it changes.',
              ],
              render: <NewsletterOptIn />,
              code: `function NewsletterOptIn() {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <Checkbox
      label="Send me the newsletter"
      checked={subscribed}
      // event.target.checked is the new true or false.
      onChange={(event) => setSubscribed(event.target.checked)}
    />
  );
}`,
            },
            {
              title: 'Value for a form',
              when: 'A native form must send a specific word, not "on", when the box is ticked.',
              explain: [
                '`value` is what the form sends when the box is ticked. Without it the browser sends "on".',
                'An unticked box sends nothing at all. A server must treat a missing field as "no".',
              ],
              render: <Checkbox label="Gift wrap" name="extras" value="gift-wrap" />,
              code: `// Ticked: the form sends extras=gift-wrap. Unticked: nothing is sent.
<Checkbox label="Gift wrap" name="extras" value="gift-wrap" />`,
            },
          ],
        },
        {
          title: 'In a form',
          kicker: 'Check a required box when focus leaves it. Name the fix in the message.',
          examples: [
            {
              title: 'A box that must be ticked',
              when: 'Show the error once the user has passed the box without ticking it, and clear it on a tick.',
              explain: [
                '`onBlur` fires when focus leaves the box. Validate there, so the error does not appear before the user had a chance to act (Nielsen heuristic 5, error prevention).',
                '`onChange` clears the error as soon as the user ticks the box. A stale error that stays is confusing.',
                '`error` is a string, so an empty string means "no error". The component sets `aria-invalid` only when the string is not empty.',
                'Validate again on submit. Blur does not fire when a user presses Enter without ever focusing the box.',
              ],
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
        // Clear the error as soon as the user fixes the problem.
        if (event.target.checked) setError('');
      }}
      // Runs when focus leaves the box. Say what to do, not only what is wrong.
      onBlur={() => setError(accepted ? '' : 'Accept the terms of service to create your account')}
    />
  );
}`,
            },
            {
              title: 'Focus the box that is wrong',
              when: 'On submit, send the user to the first problem so they do not hunt for it.',
              explain: [
                '`ref` reaches the native `<input>`, so you can read `checked` and call `focus()`.',
                'Moving focus to the error tells keyboard and screen reader users where to look (WCAG 3.3.1, A).',
                '`event.preventDefault()` stops the browser from reloading the page, so your code can show the error first.',
              ],
              render: <FocusOnError />,
              code: `function FocusOnError() {
  // The ref gives you the real <input> element.
  const box = useRef(null);
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault(); // stay on the page
    const ticked = box.current.checked;
    setError(ticked ? '' : 'Accept the terms of service to create your account');
    // Send the user to the problem.
    if (!ticked) box.current.focus();
  };

  return (
    <Stack as="form" gap={3} onSubmit={submit}>
      <Checkbox ref={box} label="I accept the terms of service" required error={error} />
      <Stack direction="horizontal" justify="end">
        <Button type="submit">Create account</Button>
      </Stack>
    </Stack>
  );
}`,
            },
            {
              title: 'Sign-up consent',
              when: 'One required box, one optional box, then one primary action.',
              explain: [
                'The required box has `required`. The optional newsletter box has none, so the two are easy to tell apart.',
                '`Button type="submit"` sends the form. It is the only primary button in the form, so the main action is clear (Hick\'s law, 1952: more choices take longer to pick from).',
                '`justify="end"` puts the button at the trailing edge. In a right-to-left language it flips by itself.',
              ],
              render: (
                <Stack as="form" gap={4} onSubmit={(event) => event.preventDefault()}>
                  <Checkbox label="I accept the terms of service" name="terms" required />
                  <Checkbox label="Send me the newsletter" name="newsletter" description="One email a month." />
                  <Stack direction="horizontal" justify="end">
                    <Button type="submit">Create account</Button>
                  </Stack>
                </Stack>
              ),
              code: `<Stack as="form" gap={4} onSubmit={handleSubmit}>
  {/* Must be ticked: the browser blocks the submit until it is. */}
  <Checkbox label="I accept the terms of service" name="terms" required />
  {/* Optional: no required. */}
  <Checkbox label="Send me the newsletter" name="newsletter" description="One email a month." />
  <Stack direction="horizontal" justify="end">
    <Button type="submit">Create account</Button>
  </Stack>
</Stack>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label, description and error are tied to the input with for, id and aria-describedby. You rarely touch this.',
          examples: [
            {
              title: 'Your own id',
              when: 'Another element must point to the box, such as a link in an error summary at the top of the form.',
              explain: [
                '`id` replaces the generated id. The label\'s `for` and the description\'s link follow it.',
                'A link such as `<a href="#accept-terms">` then jumps straight to the box.',
                'Ids must be unique on the page. Two boxes with the same id break the label link.',
              ],
              render: <Checkbox label="I accept the terms of service" id="accept-terms" required />,
              code: `// An error summary can now link to #accept-terms.
<Checkbox label="I accept the terms of service" id="accept-terms" required />`,
            },
            {
              title: 'Description and error together',
              when: 'A box has both help text and an error.',
              explain: [
                'The input\'s `aria-describedby` lists the description first, then the error. A screen reader reads both, in that order.',
                'Keep the description about the choice, and the error about the fix. Do not repeat one in the other.',
              ],
              render: <Checkbox label="Share with the whole team" required description="Everyone in the workspace can see it." error="Tick the box to continue, or choose another option." />,
              code: `// aria-describedby = description id, then error id. Set for you.
<Checkbox
  label="Share with the whole team"
  required
  description="Everyone in the workspace can see it."
  error="Tick the box to continue, or choose another option."
/>`,
            },
          ],
        },
      ]}
    />
  ),
};
