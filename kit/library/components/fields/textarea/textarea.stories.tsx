import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Button } from '../../clickables/button/button';
import { TextField } from '../text-field/text-field';
import { Textarea } from './textarea';
import { textareaRules } from './textarea.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Fields/Textarea', component: Textarea, parameters: { layout: 'fullscreen' }, args: { label: 'Label' } } satisfies Meta<typeof Textarea>;

export default meta;

const cell = (node: ReactNode) => <div style={{ inlineSize: '100%', maxInlineSize: 'calc(var(--ds-space-12) * 6)' }}>{node}</div>;
const LONG = 'Hello, my order arrived with a cracked lid. I would like a replacement, not a refund. The order number is in the email I sent last week. I can send photos of the box and of the lid on request. Thank you for your help with this.';

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Textarea"
      layer="Component"
      family="Fields"
      plain="A textarea is a text field with room for several lines: a message, a comment, an address. It grows with what you write and you can drag its corner to make it taller."
      precise="Component in the fields family · captures multi-line text · native textarea with a visible label and an optional counter · not for one line (text field)."
      usedFor="Messages, comments, descriptions, feedback."
      tokens={{
        mode: 'consumed',
        note: 'The textarea has no component tokens. It shares the box, label, description and error of the fields family.',
        rows: [
          { name: 'field.surface · field.text · field.placeholder', tier: 'role', use: 'Fill, typed value and placeholder', swatch: '--ds-field-surface' },
          { name: 'field.border · border-hover · border-focus · border-invalid', tier: 'role', use: 'Boundary at rest, on hover, focused and in error', swatch: '--ds-field-border' },
          { name: 'status.error', tier: 'role', use: 'Error text and icon', swatch: '--ds-status-error' },
          { name: 'text.muted', tier: 'role', use: 'Description and counter', swatch: '--ds-text-muted' },
          { name: 'surface.sunken · disabled.*', tier: 'role', use: 'Read-only fill; disabled value, fill and outline', swatch: '--ds-surface-sunken' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator', swatch: '--ds-focus-ring-color' },
          { name: 'text.body.* · text.caption.*', tier: '2', use: 'Value; description, counter and error' },
          { name: 'space.control.inline · space.1 · space.field.gap', tier: '2', use: 'Padding and gaps' },
          { name: 'size.control.md · radius.control', tier: '2', use: 'Minimum height; corner radius' },
        ],
      }}
      stage={{
        render: (args) =>
          cell(
            <Textarea
              label={String(args.label)}
              required={args.required === true}
              requiredText={String(args.requiredText)}
              description={String(args.description)}
              error={String(args.error)}
              errorPrefix={String(args.errorPrefix)}
              maxLength={Number(args.maxLength)}
              count={Number(args.count) || 0}
              rows={Number(args.rows)}
              disabled={args.disabled === true}
              readOnly={args.readOnly === true}
              defaultValue="The lid arrived cracked."
            />,
          ),
        parts: [
          { n: 1, label: 'Label', note: 'required, always visible', target: '.ds-field__label' },
          { n: 2, label: 'Description', note: 'optional', target: '.ds-field__description' },
          { n: 3, label: 'Textarea', note: 'native, required', target: '.ds-textarea__input' },
          { n: 4, label: 'Counter', note: 'optional, with maxLength', target: '.ds-textarea__counter' },
        ],
      }}
      specs={[
        { label: 'Height', value: 'rows (default 4), at least size.control.md; resizable vertically' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-textarea__input', token: 'space.control.inline' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-textarea__input', token: 'space.1' },
        { label: 'Radius', property: 'radius', target: '.ds-textarea__input', token: 'radius.control' },
        { label: 'Value', value: 'text.body.*, 14px; 16px on a coarse pointer' },
        { label: 'Counter', value: 'text.caption.*, muted, at the end of the line' },
      ]}
      api={[
        { label: 'label', value: 'Required. The visible label, as the text field.', control: { kind: 'text', value: 'Message' } },
        { label: 'description', value: 'Help under the label, as the text field.', control: { kind: 'text', value: 'Tell us what happened.' } },
        { label: 'error', value: 'The error text, as the text field. It sets aria-invalid.', control: { kind: 'text', value: '' } },
        { label: 'required', value: 'As the text field.', control: { kind: 'boolean', value: true } },
        { label: 'requiredText', value: 'As the text field.', control: { kind: 'text', value: 'required' } },
        { label: 'errorPrefix', value: 'As the text field.', control: { kind: 'text', value: 'Error' } },
        { label: 'maxLength', value: 'Pass it with count to show "count / maxLength".', control: { kind: 'select', options: ['100', '200', '500'], value: '200' } },
        { label: 'count', value: 'The current length. The counter joins aria-describedby.', control: { kind: 'text', value: '42' } },
        { label: 'rows', value: 'Starting height in lines, default 4.', control: { kind: 'select', options: ['2', '4', '6', '8'], value: '4' } },
        { label: 'disabled', value: 'A native textarea attribute.', control: { kind: 'boolean', value: false } },
        { label: 'readOnly', value: 'A native textarea attribute.', control: { kind: 'boolean', value: false } },
        { label: '…props', value: 'Every other native textarea attribute, such as value, onChange and ref.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'designed', render: cell(<Textarea label="Message" description="Tell us what happened." />), trigger: 'no value' },
          { id: 'loading', status: 'n/a', reason: 'A field does not load.' },
          { id: 'none', status: 'n/a', reason: 'The field holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'The field holds no collection.' },
          { id: 'some', status: 'designed', render: cell(<Textarea label="Message" defaultValue="The lid arrived cracked." maxLength={200} count={24} />), trigger: 'value', note: 'The counter shows the length against the limit.' },
          { id: 'too-many', status: 'designed', label: 'Too many (long text)', render: cell(<Textarea label="Message" defaultValue={LONG} maxLength={250} count={LONG.length} />), trigger: 'long value', note: 'The box scrolls; drag the corner to grow it.' },
          { id: 'incorrect', status: 'designed', render: cell(<Textarea label="Message" defaultValue="Hi" error="Write at least 10 characters." />), trigger: 'error' },
          { id: 'correct', status: 'designed', render: cell(<Textarea label="Message" defaultValue="The lid arrived cracked." />), trigger: 'error cleared' },
          { id: 'done', status: 'n/a', reason: 'Saving belongs to the form.' },
          { id: 'default', status: 'designed', render: cell(<Textarea label="Message" defaultValue="The lid arrived cracked." />), trigger: 'rest' },
          { id: 'hover', status: 'designed', render: cell(<Textarea label="Message" defaultValue="The lid arrived cracked." className="doc-force-hover" />), trigger: ':hover', note: 'Forced by .doc-force-hover. The border takes field.border-hover.' },
          { id: 'focus-visible', status: 'designed', render: cell(<Textarea label="Message" defaultValue="The lid arrived cracked." className="doc-force-focus" />), trigger: ':focus-visible', note: 'Forced by .doc-force-focus.' },
          { id: 'active', status: 'n/a', reason: 'Typing is the feedback.' },
          { id: 'disabled', status: 'designed', render: cell(<Textarea label="Message" defaultValue="Closed ticket." disabled description="The ticket is closed." />), trigger: 'disabled' },
          { id: 'selected', status: 'n/a', reason: 'Not selectable.' },
          { id: 'read-only', status: 'designed', group: 'interaction', render: cell(<Textarea label="Message" defaultValue="Sent on 3 March." readOnly />), trigger: 'readOnly' },
          { id: 'required', status: 'designed', group: 'interaction', render: cell(<Textarea label="Message" required />), trigger: 'required' },
        ],
      }}
      dos={[
        { text: 'Size by rows and let people resize it.', basis: 'WCAG 1.4.4 (AA)' },
        { text: 'State the limit in text before the user reaches it.', basis: 'WCAG 3.3.2 (A)' },
        { text: 'Keep a visible label above the box.', basis: 'WCAG 3.3.2 (A)' },
      ]}
      donts={[
        { text: 'Use the placeholder as the label.', basis: 'WCAG 3.3.2 (A)', rule: 'textarea.visible-label' },
        { text: 'Fix the height and remove the resize handle.', basis: 'WCAG 1.4.4 (AA)', rule: 'textarea.resizable' },
        { text: 'Announce the counter on each key.', basis: 'WCAG 4.1.3 (AA)', rule: 'textarea.counter-bound' },
        { text: 'Show an error by colour alone.', basis: 'WCAG 1.4.1 (A)', rule: 'textarea.error-bound' },
        { text: 'Write a colour or px literal in the stylesheet.', basis: 'misfile.raw-value-in-component', rule: 'textarea.no-literal' },
      ]}
      guide="fields-textarea--docs"
      guideName="Textarea"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Textarea" layer="Component" family="Fields" rules={textareaRules} guide="fields-textarea--docs" guideName="Textarea" />,
};

/** The counter takes the current length; the native maxLength stops the input at the limit. */
function MessageWithCounter() {
  const [message, setMessage] = useState('');
  return (
    <Textarea
      label="Message"
      description="At most 200 characters."
      maxLength={200}
      count={message.length}
      value={message}
      onChange={(event) => setMessage(event.target.value)}
    />
  );
}

/** The view checks the note when the user leaves it, then on each input once an error shows. */
function RequiredNote() {
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const validate = (next: string) => setError(next.trim() === '' ? 'Write a note before you send the request' : '');
  return (
    <Textarea
      label="Note"
      required
      value={note}
      error={error}
      onChange={(event) => {
        setNote(event.target.value);
        if (error) validate(event.target.value);
      }}
      onBlur={(event) => validate(event.target.value)}
    />
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Textarea"
      layer="Component"
      family="Fields"
      imports="import { Textarea, TextField, Stack, Button } from '@acme/design-system';"
      guide="fields-textarea--docs"
      guideName="Textarea"
      groups={[
        {
          title: 'Basics',
          kicker: 'Label, description and required work as in the text field.',
          examples: [
            { title: 'Label only', when: 'Text longer than one line, with nothing more to explain.', render: <Textarea label="Comment" /> },
            { title: 'With a description', when: 'The user needs a hint about what to write.', render: <Textarea label="Cover note" description="Say why you are a good fit. Two or three sentences are enough." /> },
            { title: 'Required', when: 'The form cannot go on without text. The marker is a word, not an asterisk.', render: <Textarea label="Reason for the request" required /> },
            { title: 'Required, in another language', when: 'Change the word of the marker with requiredText for a translated view.', render: <Textarea label="Commentaire" required requiredText="obligatoire" /> },
            { title: 'Placeholder as an example', when: 'Show a sample of the text. The label still names the field.', render: <Textarea label="Delivery instructions" placeholder="Leave the parcel with the neighbour at number 12." /> },
          ],
        },
        {
          title: 'Height',
          kicker: 'The box is sized by rows and resizes vertically, so no text is cut off.',
          examples: [
            { title: 'Default height', when: 'A short note: four rows.', render: <Textarea label="Comment" /> },
            { title: 'Two rows', when: 'An optional remark that most users leave short.', render: <Textarea label="Remark" rows={2} /> },
            { title: 'Eight rows', when: 'Long-form text such as a bio or a report.', render: <Textarea label="Biography" rows={8} /> },
          ],
        },
        {
          title: 'Counter and limit',
          kicker: 'Pass maxLength and count to show "count / maxLength". The browser stops the input at the limit.',
          examples: [
            {
              title: 'Live counter',
              when: 'A text with a hard limit. Say the limit in the description so the user knows it before reaching it.',
              render: <MessageWithCounter />,
              code: `function MessageWithCounter() {
  const [message, setMessage] = useState('');
  return (
    <Textarea
      label="Message"
      description="At most 200 characters."
      maxLength={200}
      count={message.length}
      value={message}
      onChange={(event) => setMessage(event.target.value)}
    />
  );
}`,
            },
            { title: 'Counter near the limit', when: 'A value already close to the limit.', render: <Textarea label="Title for the listing" description="At most 60 characters." maxLength={60} count={54} defaultValue="Two-bedroom flat with a south-facing balcony, near trans" /> },
            { title: 'Limit without a counter', when: 'A native limit the user is unlikely to reach: leave count out.', render: <Textarea label="Comment" maxLength={500} /> },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props. The native attributes do the work.',
          examples: [
            { title: 'With a value', when: 'Text the user typed or the view loaded.', render: <Textarea label="Comment" defaultValue={'The parcel arrived on Monday.\nThe box was dented but the contents were fine.'} /> },
            { title: 'Error', when: 'The text is wrong or missing. Name the field and the fix.', render: <Textarea label="Reason for the request" required error="Write a reason of at least ten characters" defaultValue="Too short" /> },
            { title: 'Error, in another language', when: 'Change the hidden word before the error with errorPrefix.', render: <Textarea label="Commentaire" error="Écrivez au moins dix caractères" errorPrefix="Erreur" defaultValue="Trop court" /> },
            { title: 'Error with a counter', when: 'The text is over the limit your rule allows. The error and the counter both stay.', render: <Textarea label="Message" description="At most 200 characters." maxLength={220} count={214} error="Shorten the message to 200 characters" defaultValue="A long message that goes past the rule the view enforces." /> },
            { title: 'Disabled', when: 'The user cannot edit now. Say why in the description.', render: <Textarea label="Internal note" description="Only the owner can edit this note." disabled defaultValue="Call back after the audit." /> },
            { title: 'Read-only', when: 'The user can focus, scroll and copy the text but not change it.', render: <Textarea label="Terms accepted on 12 March" readOnly defaultValue="You agree to pay the invoice within thirty days of receipt." /> },
          ],
        },
        {
          title: 'Content',
          kicker: 'Text wraps in the box. The label and messages wrap too.',
          examples: [
            { title: 'Long text', when: 'More lines than rows: the box scrolls, and the user can drag the handle to see more.', render: <Textarea label="Notes" rows={3} defaultValue={'Line one of the notes.\nLine two of the notes.\nLine three of the notes.\nLine four of the notes.\nLine five of the notes.'} /> },
            { title: 'Long label and description in a narrow column', when: 'Translated text runs longer: both wrap rather than truncate.', frame: 'narrow', render: <Textarea label="Commentaires supplémentaires sur la livraison" description="Dites-nous tout ce qui peut aider le livreur à trouver l’entrée." /> },
            { title: 'Counter in a narrow column', when: 'The counter stays below the box and never overlaps the text.', frame: 'narrow', render: <Textarea label="Message" maxLength={200} count={42} defaultValue="Hello, I would like to ask" /> },
            { title: 'On a phone', when: 'The box fills the width of its container, and the text is 16px so iOS does not zoom.', frame: 'phone', render: <Textarea label="Message" description="We reply within two days." required /> },
          ],
        },
        {
          title: 'In a form',
          kicker: 'Enter adds a line. Submit with a button, not with Enter.',
          examples: [
            {
              title: 'Validate on blur',
              when: 'Check the text when the user leaves the field, then on each input once an error shows.',
              render: <RequiredNote />,
              code: `function RequiredNote() {
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const validate = (next: string) => setError(next.trim() === '' ? 'Write a note before you send the request' : '');
  return (
    <Textarea
      label="Note"
      required
      value={note}
      error={error}
      onChange={(event) => {
        setNote(event.target.value);
        if (error) validate(event.target.value);
      }}
      onBlur={(event) => validate(event.target.value)}
    />
  );
}`,
            },
            {
              title: 'A contact form',
              when: 'A one-line field, then the multi-line one, then one primary action.',
              render: (
                <Stack as="form" gap={4} onSubmit={(event) => event.preventDefault()}>
                  <TextField label="Subject" required />
                  <Textarea label="Message" required description="Tell us what happened and what you expected." />
                  <Stack direction="horizontal" justify="end">
                    <Button type="submit">Send message</Button>
                  </Stack>
                </Stack>
              ),
              code: `<Stack as="form" gap={4} onSubmit={handleSubmit}>
  <TextField label="Subject" required />
  <Textarea label="Message" required description="Tell us what happened and what you expected." />
  <Stack direction="horizontal" justify="end">
    <Button type="submit">Send message</Button>
  </Stack>
</Stack>`,
            },
          ],
        },
        {
          title: 'Uncontrolled',
          kicker: 'The live counter above shows the controlled form.',
          examples: [
            { title: 'Default value', when: 'The browser holds the text; read it from the form on submit.', render: <Textarea label="Comment" name="comment" defaultValue="Thanks for the quick delivery." /> },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label, description, counter and error are tied to the box with for, id and aria-describedby.',
          examples: [
            { title: 'Autocomplete token', when: 'Text that the browser can fill, such as a street address over several lines.', render: <Textarea label="Delivery address" autoComplete="street-address" rows={3} /> },
            { title: 'Your own id', when: 'Another element must point to the box, such as a skip link or an error summary.', render: <Textarea label="Comment" id="order-comment" /> },
            { title: 'Spelling and language', when: 'Set the language of text that differs from the page, so the checker and the screen reader pick the right one.', render: <Textarea label="Commentaire" lang="fr" spellCheck defaultValue="Merci pour la livraison rapide." /> },
          ],
        },
      ]}
    />
  ),
};
