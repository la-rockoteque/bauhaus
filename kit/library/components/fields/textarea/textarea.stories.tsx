import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { Textarea } from './textarea';
import { textareaRules } from './textarea.rules';

// The showcase: one page story. The states grid replaces one story per state.
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
          { name: 'space.control.inline · space.inset.sm · space.field.gap', tier: '2', use: 'Padding and gaps' },
          { name: 'size.control.md · radius.control', tier: '2', use: 'Minimum height; corner radius' },
        ],
      }}
      anatomy={{
        render: cell(<Textarea label="Message" required description="Tell us what happened." maxLength={200} count={42} defaultValue="The lid arrived cracked." />),
        parts: [
          { n: 1, label: 'Label', note: 'required, always visible', target: '.ds-field__label' },
          { n: 2, label: 'Description', note: 'optional', target: '.ds-field__description' },
          { n: 3, label: 'Textarea', note: 'native, required', target: '.ds-textarea__input' },
          { n: 4, label: 'Counter', note: 'optional, with maxLength', target: '.ds-textarea__counter' },
        ],
      }}
      specs={[
        { label: 'Height', value: 'rows (default 4), at least size.control.md; resizable vertically' },
        { label: 'Padding', value: 'space.control.inline inline · space.inset.sm block' },
        { label: 'Radius', value: 'radius.control' },
        { label: 'Value', value: 'text.body.*, 16px' },
        { label: 'Counter', value: 'text.caption.*, muted, at the end of the line' },
      ]}
      api={[
        { label: 'label · description · error', value: 'As the text field. The error sets aria-invalid.' },
        { label: 'required · requiredText · errorPrefix', value: 'As the text field.' },
        { label: 'maxLength · count', value: 'Pass both to show "count / maxLength". The counter joins aria-describedby.' },
        { label: 'rows', value: 'Starting height in lines, default 4.' },
        { label: '…props', value: 'Every native textarea attribute, such as disabled, readOnly, value, onChange and ref.' },
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
      rules={textareaRules}
      guide="fields-textarea--docs"
      guideName="Textarea"
    />
  ),
};
