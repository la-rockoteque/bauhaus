import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
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

/** The form reads the text by its `name` when the user submits. */
function FeedbackForm() {
  const [sent, setSent] = useState('');
  return (
    <Stack
      as="form"
      gap={4}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.target as HTMLFormElement);
        setSent(`Thank you. We received ${String(data.get('feedback')).length} characters.`);
      }}
    >
      <Textarea label="Feedback" name="feedback" />
      <Stack direction="horizontal" justify="end">
        <Button type="submit">Send feedback</Button>
      </Stack>
      <Text as="p" role="status" variant="caption" tone="muted">{sent}</Text>
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Textarea"
      layer="Component"
      family="Fields"
      imports="import { Textarea, TextField, Stack, Text, Button } from '@acme/design-system';"
      intro={[
        'A textarea is a text field with room for several lines: a message, a comment, an address. It renders a native `<textarea>`. Enter adds a new line.',
        'It shares its label, description and error with `TextField` (see that page for the full wiring). The label is always visible. A placeholder (grey sample text inside the box) is never the label.',
        'The description, the error and the counter are tied to the box with `aria-describedby` (an attribute that lists the ids of extra text a screen reader reads after the label), in that order.',
        'An `error` sets `aria-invalid="true"` (a flag that tells a screen reader the value is wrong), shows an icon and a hidden "Error:" word.',
        'The box is `rows` lines high and the user can drag its corner to make it taller. Text is never cut off.',
        'Every other `<textarea>` attribute passes through: `name`, `value`, `onChange`, `disabled`, `readOnly`, `maxLength`. All words the field shows are props, so you can translate them.',
      ]}
      guide="fields-textarea--docs"
      guideName="Textarea"
      groups={[
        {
          title: 'Start here',
          kicker: 'Every textarea needs a label. Add a description, the required word or a sample only when the user needs them.',
          examples: [
            {
              title: 'Label only',
              when: 'Text longer than one line, with nothing more to explain.',
              explain: [
                '`label` is required. It shows above the box and stays visible while the user types (WCAG 3.3.2, A).',
                'The component builds the `id` and the `for` link for you. A click on the label focuses the box.',
              ],
              render: <Textarea label="Comment" />,
              code: `// label is required: it names the box for everyone, including screen readers.
<Textarea label="Comment" />`,
            },
            {
              title: 'With a description',
              when: 'The user needs a hint about what to write.',
              explain: [
                'The description sits between the label and the box, so the user reads it before typing.',
                'It joins the box through `aria-describedby`. A screen reader reads it with the label (WCAG 3.3.2, A).',
              ],
              render: <Textarea label="Cover note" description="Say why you are a good fit. Two or three sentences are enough." />,
              code: `<Textarea
  label="Cover note"
  description="Say why you are a good fit. Two or three sentences are enough."
/>`,
            },
            {
              title: 'Required',
              when: 'The form cannot go on without text.',
              explain: [
                '`required` sets the native attribute: the browser can refuse to submit an empty box.',
                'The label also shows the word "(required)". A bare asterisk means nothing to a person who does not know the convention (WCAG 3.3.2, A).',
              ],
              render: <Textarea label="Reason for the request" required />,
              code: `// required = native attribute + the visible word "(required)" after the label.
<Textarea label="Reason for the request" required />`,
            },
            {
              title: 'Placeholder as a sample',
              when: 'Show an example of the answer. The label still names the field.',
              explain: [
                '`placeholder` passes straight to the box and shows grey text until the user types.',
                'Use it for a sample, never for the label or a rule. It disappears while typing, and its grey colour often fails the text contrast minimum (WCAG 1.4.3, AA).',
              ],
              render: <Textarea label="Delivery instructions" placeholder="Leave the parcel with the neighbour at number 12." />,
              code: `// A sample of the answer. The label above it is what names the field.
<Textarea
  label="Delivery instructions"
  placeholder="Leave the parcel with the neighbour at number 12."
/>`,
            },
          ],
        },
        {
          title: 'Height',
          kicker: 'The box is sized by rows and resizes vertically, so no text is cut off.',
          examples: [
            {
              title: 'Default height',
              when: 'A short note.',
              explain: [
                '`rows` defaults to 4. A row is one line of text.',
                'The user can drag the corner to make the box taller. A fixed height would cut the text at 200% zoom (WCAG 1.4.4, AA).',
              ],
              render: <Textarea label="Comment" />,
              code: `// rows defaults to 4.
<Textarea label="Comment" />`,
            },
            {
              title: 'Two rows',
              when: 'An optional remark that most users keep short.',
              explain: [
                'A small box tells the user a short answer is enough.',
                'It still grows when the text is longer: the box scrolls, and the corner drags.',
              ],
              render: <Textarea label="Remark" rows={2} />,
              code: `<Textarea label="Remark" rows={2} />`,
            },
            {
              title: 'Eight rows',
              when: 'Long-form text, such as a biography or a report.',
              explain: [
                'A tall box tells the user to write more and shows more of it at once.',
                'Do not set a CSS height on the box. `rows` scales with the user text size; a pixel height does not.',
              ],
              render: <Textarea label="Biography" rows={8} />,
              code: `<Textarea label="Biography" rows={8} />`,
            },
          ],
        },
        {
          title: 'Counter and limit',
          kicker: 'Pass maxLength and count to show "count / maxLength". The browser stops the input at the limit.',
          examples: [
            {
              title: 'Live counter',
              when: 'A text with a hard limit.',
              explain: [
                '`maxLength` is the native attribute. The browser stops the input at the limit. Do not cut the value in script.',
                '`count` is the current length. You own it, so pass `value.length` from your state.',
                'The counter joins `aria-describedby`. A screen reader reads it when the user asks for the description. It is not announced on each key, which would talk over the typing (WCAG 4.1.3, AA).',
                'Say the limit in the description too, so the user knows it before reaching it (WCAG 3.3.2, A).',
              ],
              render: <MessageWithCounter />,
              code: `function MessageWithCounter() {
  const [message, setMessage] = useState('');
  return (
    <Textarea
      label="Message"
      // State the limit up front: the counter alone is easy to miss.
      description="At most 200 characters."
      // The browser enforces the limit.
      maxLength={200}
      // The counter shows "count / maxLength". You pass the current length.
      count={message.length}
      value={message}
      onChange={(event) => setMessage(event.target.value)}
    />
  );
}`,
            },
            {
              title: 'Counter near the limit',
              when: 'A value already close to the limit.',
              explain: [
                'The counter is plain text, with no colour change. The count carries the meaning.',
                'If you need to warn the user, add a message in the description or an `error`. A colour alone would not reach everyone (WCAG 1.4.1, A).',
              ],
              render: <Textarea label="Title for the listing" description="At most 60 characters." maxLength={60} count={54} defaultValue="Two-bedroom flat with a south-facing balcony, near trans" />,
              code: `<Textarea
  label="Title for the listing"
  description="At most 60 characters."
  maxLength={60}
  count={54}
  defaultValue="Two-bedroom flat with a south-facing balcony, near trans"
/>`,
            },
            {
              title: 'Limit without a counter',
              when: 'A native limit that the user is unlikely to reach.',
              explain: [
                'Leave `count` out: the counter needs both `maxLength` and `count`.',
                'The browser still stops the input at the limit. Use this for a safety limit, not a rule the user plans around.',
              ],
              render: <Textarea label="Comment" maxLength={500} />,
              code: `// No count prop, so no counter. The browser still enforces 500.
<Textarea label="Comment" maxLength={500} />`,
            },
          ],
        },
        {
          title: 'Read the value',
          kicker: 'Let the browser hold the text, or hold it yourself.',
          examples: [
            {
              title: 'Uncontrolled: read it on submit',
              when: 'You need the text only when the user sends the form.',
              explain: [
                '"Uncontrolled" means the browser holds the text. You give a starting text with `defaultValue`.',
                '`name` is the key you read on submit. `FormData` collects every named field of the form.',
                '`event.preventDefault()` stops the browser from reloading the page.',
                'Submit with a button. Enter in a textarea adds a new line, so it cannot send the form.',
              ],
              render: <FeedbackForm />,
              code: `function FeedbackForm() {
  const [sent, setSent] = useState('');
  return (
    <Stack
      as="form"
      gap={4}
      onSubmit={(event) => {
        // Stop the browser from reloading the page.
        event.preventDefault();
        // FormData reads every field that has a name.
        const data = new FormData(event.currentTarget);
        setSent('Thank you. We received ' + data.get('feedback').length + ' characters.');
      }}
    >
      {/* name = the key you read from FormData */}
      <Textarea label="Feedback" name="feedback" />
      <Stack direction="horizontal" justify="end">
        <Button type="submit">Send feedback</Button>
      </Stack>
      {/* role="status" makes a screen reader announce the text when it changes. */}
      <Text as="p" role="status" variant="caption" tone="muted">{sent}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Uncontrolled: starting text',
              when: 'The view loaded a text, and the user may edit it.',
              explain: [
                '`defaultValue` sets the starting text. Use `value` with `onChange` for a controlled box (see Live counter), never both.',
              ],
              render: <Textarea label="Comment" name="comment" defaultValue="Thanks for the quick delivery." />,
              code: `<Textarea label="Comment" name="comment" defaultValue="Thanks for the quick delivery." />`,
            },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props. The native attributes do the work.',
          examples: [
            {
              title: 'With a value',
              when: 'Text that the user typed or the view loaded.',
              explain: [
                'A `\\n` in the string starts a new line in the box.',
              ],
              render: <Textarea label="Comment" defaultValue={'The parcel arrived on Monday.\nThe box was dented but the contents were fine.'} />,
              code: `<Textarea
  label="Comment"
  // \\n starts a new line.
  defaultValue={'The parcel arrived on Monday.\\nThe box was dented but the contents were fine.'}
/>`,
            },
            {
              title: 'Error',
              when: 'The text is wrong or missing. Name the field and the fix.',
              explain: [
                'Pass the message as `error`. Its presence sets `aria-invalid="true"`, adds the message to `aria-describedby` and shows an error icon.',
                'A hidden word "Error:" comes before the message, so a screen reader says it is an error (WCAG 3.3.1, A).',
                'Say how to fix it: "Write a reason of at least ten characters". "Invalid input" helps nobody (WCAG 3.3.3, AA).',
                'The icon and the text carry the meaning. The red border alone would miss people who cannot tell the colours apart (WCAG 1.4.1, A).',
              ],
              render: <Textarea label="Reason for the request" required error="Write a reason of at least ten characters" defaultValue="Too short" />,
              code: `// Pass the message, not a boolean. An empty string means "no error".
<Textarea
  label="Reason for the request"
  required
  error="Write a reason of at least ten characters"
  defaultValue="Too short"
/>`,
            },
            {
              title: 'Error with a counter',
              when: 'The text is over a limit that your own rule sets.',
              explain: [
                'The description, the counter and the error all stay. A screen reader reads them in that order.',
                'Here `maxLength` is 220, above the rule of 200. The browser allows a little extra, and your check shows the error. Use this when you prefer a message to a hard stop.',
              ],
              render: <Textarea label="Message" description="At most 200 characters." maxLength={220} count={214} error="Shorten the message to 200 characters" defaultValue="A long message that goes past the rule the view enforces." />,
              code: `<Textarea
  label="Message"
  description="At most 200 characters."
  // The hard stop sits above the rule, so your message can appear first.
  maxLength={220}
  count={214}
  error="Shorten the message to 200 characters"
  defaultValue="A long message that goes past the rule the view enforces."
/>`,
            },
            {
              title: 'Disabled',
              when: 'The user cannot edit the text now.',
              explain: [
                '`disabled` is the native attribute. The box leaves the tab order and the form does not send its text.',
                'Say why in the description. A dimmed box with no reason confuses people (Nielsen heuristic 1, visibility of system status).',
                'If the text must still be sent or copied, use `readOnly` instead.',
              ],
              render: <Textarea label="Internal note" description="Only the owner can edit this note." disabled defaultValue="Call back after the audit." />,
              code: `// disabled removes the box from the tab order. The description gives the reason.
<Textarea
  label="Internal note"
  description="Only the owner can edit this note."
  disabled
  defaultValue="Call back after the audit."
/>`,
            },
            {
              title: 'Read-only',
              when: 'The user can focus, scroll and copy the text but not change it.',
              explain: [
                '`readOnly` keeps the box in the tab order, so a keyboard user can focus it and copy the text.',
                'The form still sends the text. The fill is sunken so it never looks disabled.',
              ],
              render: <Textarea label="Terms accepted on 12 March" readOnly defaultValue="You agree to pay the invoice within thirty days of receipt." />,
              code: `// readOnly: focusable and copyable, sent with the form, not editable.
<Textarea
  label="Terms accepted on 12 March"
  readOnly
  defaultValue="You agree to pay the invoice within thirty days of receipt."
/>`,
            },
          ],
        },
        {
          title: 'Other languages',
          kicker: 'The field holds no text of its own except two default words. Pass the words of your language.',
          examples: [
            {
              title: 'Required word',
              when: 'A translated view.',
              explain: [
                '`requiredText` replaces the word "required" after the label.',
                'Translate the label, the description and the messages the same way. They are all props.',
              ],
              render: <Textarea label="Commentaire" required requiredText="obligatoire" />,
              code: `<Textarea label="Commentaire" required requiredText="obligatoire" />`,
            },
            {
              title: 'Error word',
              when: 'A translated view that shows an error.',
              explain: [
                '`errorPrefix` replaces the hidden word "Error" that a screen reader says before the message.',
                'Without it, a French screen reader would say "Error" in the middle of French text.',
              ],
              render: <Textarea label="Commentaire" error="Écrivez au moins dix caractères" errorPrefix="Erreur" defaultValue="Trop court" />,
              code: `<Textarea
  label="Commentaire"
  error="Écrivez au moins dix caractères"
  errorPrefix="Erreur"
  defaultValue="Trop court"
/>`,
            },
          ],
        },
        {
          title: 'Content cases',
          kicker: 'Text wraps in the box. The label, the description and the messages wrap too.',
          examples: [
            {
              title: 'Long text',
              when: 'More lines than rows.',
              explain: [
                'The box scrolls inside, and the user can drag the corner to see more.',
                'No text is cut off and nothing needs a script.',
              ],
              render: <Textarea label="Notes" rows={3} defaultValue={'Line one of the notes.\nLine two of the notes.\nLine three of the notes.\nLine four of the notes.\nLine five of the notes.'} />,
              code: `// Five lines in a three-row box: it scrolls.
<Textarea
  label="Notes"
  rows={3}
  defaultValue={'Line one of the notes.\\nLine two of the notes.\\nLine three of the notes.\\nLine four of the notes.\\nLine five of the notes.'}
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
              render: <Textarea label="Commentaires supplémentaires sur la livraison" description="Dites-nous tout ce qui peut aider le livreur à trouver l’entrée." />,
              code: `// No truncation: the label and the description wrap.
<Textarea
  label="Commentaires supplémentaires sur la livraison"
  description="Dites-nous tout ce qui peut aider le livreur à trouver l’entrée."
/>`,
            },
            {
              title: 'Counter in a narrow column',
              when: 'A counter in a small space.',
              frame: 'narrow',
              explain: [
                'The counter sits below the box. It never overlaps the text.',
              ],
              render: <Textarea label="Message" maxLength={200} count={42} defaultValue="Hello, I would like to ask" />,
              code: `<Textarea label="Message" maxLength={200} count={42} defaultValue="Hello, I would like to ask" />`,
            },
            {
              title: 'On a phone',
              when: 'A narrow screen.',
              frame: 'phone',
              explain: [
                'The box fills the width of its container. Put it in a column and it follows.',
                'On a touch screen the text is 16px. A smaller size would make iOS zoom the page when the box takes focus.',
              ],
              render: <Textarea label="Message" description="We reply within two days." required />,
              code: `// No width prop: the box fills its container.
<Textarea label="Message" description="We reply within two days." required />`,
            },
          ],
        },
        {
          title: 'In a form',
          kicker: 'Enter adds a line. Send the form with a button.',
          examples: [
            {
              title: 'Validate on blur',
              when: 'Check the text when the user leaves the box.',
              explain: [
                '"Blur" means the box lost focus. Checking then lets the user finish writing first.',
                'Once an error shows, check on each change, so the error goes away as soon as the text is right.',
                'Checking on each key stroke would flag a note that is still being written (Nielsen heuristic 5, error prevention).',
                '`.trim()` ignores spaces, so a box with only spaces counts as empty.',
              ],
              render: <RequiredNote />,
              code: `function RequiredNote() {
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  // An empty string means "no error".
  const validate = (next) =>
    setError(next.trim() === '' ? 'Write a note before you send the request' : '');
  return (
    <Textarea
      label="Note"
      required
      value={note}
      error={error}
      onChange={(event) => {
        setNote(event.target.value);
        // Re-check on input only once an error shows.
        if (error) validate(event.target.value);
      }}
      // First check: when the user leaves the box.
      onBlur={(event) => validate(event.target.value)}
    />
  );
}`,
            },
            {
              title: 'A contact form',
              when: 'A one-line field, then the multi-line one, then one main action.',
              explain: [
                '`Stack` with `gap={4}` spaces the fields evenly (`space.4`). One column is faster to scan than two.',
                'One primary button, at the end, with `type="submit"`. Enter inside the textarea adds a line, so the button is the way to send.',
                'Use `TextField` for the subject and `Textarea` for the message: pick the box that matches the length of the answer.',
              ],
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
  <Textarea
    label="Message"
    required
    description="Tell us what happened and what you expected."
  />
  <Stack direction="horizontal" justify="end">
    {/* type="submit": the only way to send, since Enter adds a line here. */}
    <Button type="submit">Send message</Button>
  </Stack>
</Stack>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label, description, counter and error are tied to the box with for, id and aria-describedby.',
          examples: [
            {
              title: 'Autocomplete token',
              when: 'Text that the browser can fill, such as a street address over several lines.',
              explain: [
                'The token names the purpose of the data. The browser fills it from the user profile.',
                'It helps people with motor or memory difficulties (WCAG 1.3.5, AA).',
              ],
              render: <Textarea label="Delivery address" autoComplete="street-address" rows={3} />,
              code: `<Textarea label="Delivery address" autoComplete="street-address" rows={3} />`,
            },
            {
              title: 'Your own id',
              when: 'Another element must point at the box, such as a skip link or an error summary.',
              explain: [
                'By default the component builds a unique id for you. Pass `id` only when something else needs to know it.',
                'The description, the counter and the error derive their ids from it, when the field has one. The label has no id of its own: it points at the box with `for`.',
                'An id must be unique on the page.',
              ],
              render: <Textarea label="Order comment" id="order-comment" />,
              code: `// A link elsewhere on the page can now point at it: <a href="#order-comment">
<Textarea label="Order comment" id="order-comment" />`,
            },
            {
              title: 'Spelling and language',
              when: 'Text in a language that differs from the page.',
              explain: [
                '`lang="fr"` tells the spell checker and the screen reader which language to use.',
                'Without it, a screen reader would read French words with English pronunciation (WCAG 3.1.2, AA).',
                '`spellCheck` turns the browser spell checker on.',
              ],
              render: <Textarea label="Commentaire" lang="fr" spellCheck defaultValue="Merci pour la livraison rapide." />,
              code: `<Textarea label="Commentaire" lang="fr" spellCheck defaultValue="Merci pour la livraison rapide." />`,
            },
          ],
        },
      ]}
    />
  ),
};
