import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
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
