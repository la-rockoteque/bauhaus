import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import type { ModalSize } from '../modal/modal';
import { AlertDialog, type AlertDialogProps } from './alert-dialog';
import { alertDialogRules } from './alert-dialog.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Overlays/Alert dialog', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const noop = () => {};
const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly ModalSize[];

const expired = { title: 'Session expired', description: 'You were signed out after 30 minutes without activity. Your draft is saved.', actionLabel: 'Sign in again' };

function TryIt() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Simulate a timeout</Button>
      <AlertDialog open={open} onClose={() => setOpen(false)} {...expired} />
    </>
  );
}

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Alert dialog"
      layer="Component"
      family="Overlays"
      plain="An alert dialog stops you to tell you something you must know before you go on. It has one button, and pressing it says you have read it."
      precise="Component in the overlays family · an alert dialog with one action, built on Modal · for a message that needs acknowledging, not for a choice (Confirmation dialog) or a message that needs no answer (Toast, Banner)."
      usedFor="A session that expired, a lost connection that stops the work, a limit reached."
      tokens={{
        mode: 'consumed',
        note: 'The alert dialog has no stylesheet of its own. Every value comes from Modal and Button.',
        rows: [
          { name: 'overlay.surface · overlay.border · scrim · shadow.2', tier: 'role', use: 'The panel and the wash, from Modal', swatch: '--ds-overlay-surface' },
          { name: 'text.default', tier: 'role', use: 'Title and message', swatch: '--ds-text-default' },
          { name: 'action.primary', tier: 'role', use: 'The one action', swatch: '--ds-action-primary' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus ring on the action', swatch: '--ds-focus-ring-color' },
          { name: 'size.overlay.sm · md · lg', tier: '2', use: 'Maximum inline size, from Modal' },
        ],
      }}
      stage={{
        render: (args) => (
          <AlertDialog
            inline
            open
            onClose={noop}
            title={String(args.title)}
            description={String(args.description)}
            actionLabel={String(args.actionLabel)}
            size={args.size as ModalSize}
          />
        ),
        parts: [
          { n: 1, label: 'Title', note: 'required, what happened', target: '.ds-modal__title' },
          { n: 2, label: 'Message', note: 'required, what it means', target: '.ds-modal__body' },
          { n: 3, label: 'Action', note: 'required, the one answer', target: '.ds-modal__footer .ds-button', at: 'end' },
        ],
      }}
      specs={[
        { label: 'Role', value: 'alertdialog, described by the message' },
        { label: 'Focus', value: 'On the action' },
        { label: 'Escape and scrim', value: 'Escape acknowledges, as the action does. The scrim does not close it' },
        { label: 'Layout', value: 'From Modal: sizes, the narrow full screen, the motion' },
      ]}
      api={[
        { label: 'open · onClose', value: 'The parent owns whether it is shown. onClose runs on the action and on Escape.' },
        { label: 'title', value: 'Required. What happened.', control: { kind: 'text', value: expired.title } },
        { label: 'description', value: 'Required. What it means for the user.', control: { kind: 'text', value: expired.description } },
        { label: 'actionLabel', value: 'Required. Says what happens next: "Sign in again".', control: { kind: 'text', value: expired.actionLabel } },
        { label: 'size', value: 'Passed to Modal.', control: { kind: 'select', options: SIZES, value: 'md' } },
        { label: 'inline', value: 'Passed to Modal.' },
      ]}
      states={{
        note: 'Each cell shows the dialog inline: open, in the flow, without the scrim. The live dialog is under Try it.',
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'The dialog opens with its message, or not at all.' },
          { id: 'loading', status: 'n/a', reason: 'The message is known when the dialog opens.' },
          { id: 'none', status: 'n/a', reason: 'The dialog holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'The dialog holds no collection.' },
          { id: 'some', status: 'designed', render: <AlertDialog inline open onClose={noop} {...expired} />, trigger: 'title, description, actionLabel' },
          { id: 'too-many', status: 'designed', label: 'Too many (long message)', render: <AlertDialog inline open onClose={noop} title="Storage full" description="Your team uses 10 GB of 10 GB. New uploads are paused until space is freed. Files already uploaded stay available, and you can still edit and share them. An owner can free space or change the plan." actionLabel="Got it" />, trigger: 'long description', note: 'The message wraps. Only the body scrolls when it runs out of room.' },
          { id: 'incorrect', status: 'designed', render: <AlertDialog inline open onClose={noop} title="Connection lost" description="Your changes since 14:02 were not saved. They stay on this device and are sent when the connection is back." actionLabel="Keep working offline" />, trigger: 'system error', note: 'Say what failed, what is kept, and what the user can do.' },
          { id: 'correct', status: 'n/a', reason: 'The dialog takes no input.' },
          { id: 'done', status: 'n/a', reason: 'The action closes the dialog. The work behind goes on.' },
          { id: 'default', status: 'designed', render: <AlertDialog inline open onClose={noop} {...expired} />, trigger: 'rest', note: 'Focus starts on the action.' },
          { id: 'hover', status: 'n/a', reason: 'The panel is not interactive. The button carries its own hover.' },
          { id: 'focus-visible', status: 'n/a', reason: 'The button carries the focus ring; see Button.' },
          { id: 'active', status: 'n/a', reason: 'The panel is not pressable. The button carries its own pressed state.' },
          { id: 'disabled', status: 'n/a', reason: 'The one answer is always available, or the user is trapped.' },
          { id: 'selected', status: 'n/a', reason: 'A dialog is not a selectable item.' },
        ],
      }}
      extra={[{ title: 'Try it', kicker: 'The real dialog: open it, then use Enter or Escape.', content: <TryIt /> }]}
      dos={[
        { text: 'Say what happened in the title and what the user keeps in the message.', basis: 'Nielsen 9, help users recover from errors' },
        { text: 'Name the action by what happens next: "Sign in again".', basis: 'WCAG 2.4.6 (AA)', rule: 'alert-dialog.action-named' },
      ]}
      donts={[
        { text: 'Add a second button. A choice is a confirmation dialog.', basis: 'APG Alert and Message Dialogs', rule: 'alert-dialog.one-action' },
        { text: 'Interrupt for a message that needs no answer. Use a toast or a banner.', basis: 'Nielsen 8; WCAG 2.2.4 (AAA)', rule: 'alert-dialog.not-for-info' },
      ]}
      guide="overlays-alert-dialog--docs"
      guideName="Alert dialog"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Alert dialog" layer="Component" family="Overlays" rules={alertDialogRules} guide="overlays-alert-dialog--docs" guideName="Alert dialog" />,
};

type AlertCopy = Pick<AlertDialogProps, 'title' | 'actionLabel'> & { description: string; size?: ModalSize };

/** The trigger and its dialog, closed until the user presses the trigger. */
function AlertExample({ trigger, ...copy }: AlertCopy & { trigger: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>{trigger}</Button>
      <AlertDialog open={open} onClose={() => setOpen(false)} {...copy} />
    </>
  );
}

/** The source a consumer writes for an AlertExample. */
function alertSource(trigger: string, copy: AlertCopy) {
  const lines = Object.entries(copy).map(([key, value]) => `      ${key}="${value}"`).join('\n');
  return `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>${trigger}</Button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
${lines}
      />
    </>
  );
}`;
}

const alertExample = (trigger: string, copy: AlertCopy) => ({ render: <AlertExample trigger={trigger} {...copy} />, code: alertSource(trigger, copy) });

const offline: AlertCopy = { title: 'Connection lost', description: 'Your changes are kept on this device. Save will work again when you are back online.', actionLabel: 'Got it' };
const limit: AlertCopy = { title: 'Storage limit reached', description: 'You used all 5 GB. Uploads fail until you delete files or upgrade your plan.', actionLabel: 'Review storage' };
const longMessage: AlertCopy = {
  title: 'Import stopped',
  description: 'The import stopped at row 1,204 of 8,600 because the file holds a date that no calendar knows: 31 February 2026. The 1,203 rows before it are saved. The rows after it are not. Fix the date in your file and import it again, or split the file at row 1,204 and import the second part on its own.',
  actionLabel: 'Close the report',
};

function MarkupNotice() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Show the notice</Button>
      <AlertDialog open={open} onClose={() => setOpen(false)} title="Plan changed" description={<>Your plan is now <strong>Team</strong>. Billing starts on 1 November.</>} actionLabel="Got it" />
    </>
  );
}

function AsyncFailure() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const send = () => {
    setStatus('Sending…');
    window.setTimeout(() => {
      setStatus('');
      setOpen(true);
    }, 1000);
  };
  return (
    <Stack gap={2} align="start">
      <Button onClick={send}>Send report</Button>
      <Text as="p" role="status">{status}</Text>
      <AlertDialog open={open} onClose={() => setOpen(false)} title="Report not sent" description="The server did not answer. Your report is saved as a draft." actionLabel="Back to the draft" />
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Alert dialog"
      layer="Component"
      family="Overlays"
      imports="import { useState } from 'react'; import { AlertDialog, Button, Stack, Text } from '@acme/design-system';"
      guide="overlays-alert-dialog--docs"
      guideName="Alert dialog"
      groups={[
        {
          title: 'Messages',
          kicker: 'The title says what happened. The message says what it means. The action says what happens next.',
          examples: [
            { title: 'Session expired', when: 'The user must sign in again before they go on.', ...alertExample('Simulate a timeout', expired) },
            { title: 'Connection lost', when: 'The work cannot go on as before, and the user needs to know what is kept.', ...alertExample('Go offline', offline) },
            { title: 'Limit reached', when: 'The next action will fail, and the user must know before they try it.', ...alertExample('Upload a file', limit) },
          ],
        },
        {
          title: 'Sizes',
          kicker: 'The size sets the maximum inline size. The default is md.',
          examples: [
            { title: 'Small', when: 'A short message that needs little room.', ...alertExample('Open small', { ...offline, size: 'sm' }) },
            { title: 'Medium', when: 'The default size, for most messages.', ...alertExample('Open medium', { ...expired, size: 'md' }) },
            { title: 'Large', when: 'A longer message that reads better on a wider line.', ...alertExample('Open large', { ...limit, size: 'lg' }) },
          ],
        },
        {
          title: 'Content',
          examples: [
            { title: 'Long message', when: 'The message runs long. It wraps, and the body scrolls when the dialog runs out of room.', ...alertExample('Show the import report', longMessage) },
            {
              title: 'Message with markup',
              when: 'The message needs emphasis on one fact. The description takes any content, not only text.',
              render: <MarkupNotice />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Show the notice</Button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Plan changed"
        description={<>Your plan is now <strong>Team</strong>. Billing starts on 1 November.</>}
        actionLabel="Got it"
      />
    </>
  );
}`,
            },
            { title: 'Long action label on a phone', when: 'A translated action label is long. The dialog fills the screen at this width.', frame: 'phone', ...alertExample('Simulate a timeout', { ...expired, actionLabel: 'Se reconnecter à votre compte' }) },
          ],
        },
        {
          title: 'Controlled by the app',
          kicker: 'The parent owns open. Escape and the action both call onClose.',
          examples: [
            {
              title: 'Open after a failed request',
              when: 'An action fails and the user must know before they go on.',
              render: <AsyncFailure />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const send = () => {
    setStatus('Sending…');
    window.setTimeout(() => {
      setStatus('');
      setOpen(true);
    }, 1000);
  };
  return (
    <Stack gap={2} align="start">
      <Button onClick={send}>Send report</Button>
      <Text as="p" role="status">{status}</Text>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Report not sent"
        description="The server did not answer. Your report is saved as a draft."
        actionLabel="Back to the draft"
      />
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'In the flow',
          examples: [
            {
              title: 'Inline',
              when: 'A preview or an embedded panel draws the open dialog in the flow, with no scrim and no focus move.',
              render: <AlertDialog inline open onClose={noop} {...expired} />,
              code: `<AlertDialog
  inline
  open
  onClose={() => {}}
  title="Session expired"
  description="You were signed out after 30 minutes without activity. Your draft is saved."
  actionLabel="Sign in again"
/>`,
            },
          ],
        },
      ]}
    />
  ),
};
