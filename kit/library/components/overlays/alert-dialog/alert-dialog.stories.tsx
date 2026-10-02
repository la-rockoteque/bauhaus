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

const offline = { title: 'Connection lost', description: 'Your changes are kept on this device. Save will work again when you are back online.', actionLabel: 'Got it' };
const limit = { title: 'Storage limit reached', description: 'You used all 5 GB. Uploads fail until you delete files or upgrade your plan.', actionLabel: 'Review storage' };

/** A closed trigger and its alert dialog. The page examples use it so each result matches its snippet. */
function AlertDemo({ trigger, ...copy }: Omit<AlertDialogProps, 'open' | 'onClose'> & { trigger: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>{trigger}</Button>
      <AlertDialog open={open} onClose={() => setOpen(false)} {...copy} />
    </>
  );
}

function SignInAgain() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const acknowledge = () => {
    setOpen(false);
    setStatus('Redirecting to the sign-in page…');
  };
  return (
    <Stack gap={2} align="start">
      <Button variant="secondary" onClick={() => setOpen(true)}>Simulate a timeout</Button>
      <Text as="p" role="status">{status}</Text>
      <AlertDialog open={open} onClose={acknowledge} title="Session expired" description="You were signed out after 30 minutes without activity. Your draft is saved." actionLabel="Sign in again" />
    </Stack>
  );
}

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

function OfflineWatcher() {
  const [offline, setOffline] = useState(false);
  return (
    <Stack gap={2} align="start">
      <Button variant="secondary" onClick={() => setOffline(true)}>Cut the connection</Button>
      <AlertDialog open={offline} onClose={() => setOffline(false)} title="Connection lost" description="Your changes are kept on this device. Save will work again when you are back online." actionLabel="Got it" />
    </Stack>
  );
}

const importReport = 'The import stopped at row 1,204 of 8,600 because the file holds a date that no calendar knows: 31 February 2026. The 1,203 rows before it are saved. The rows after it are not. Fix the date in your file and import it again, or split the file at row 1,204 and import the second part on its own.';

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Alert dialog"
      layer="Component"
      family="Overlays"
      imports={"import { useState } from 'react';\nimport { AlertDialog, Button, Stack, Text } from '@bauhaus/design-system';"}
      intro={[
        'An alert dialog is a small window that stops the user and tells them one thing they must know. It has one button. Pressing it means "I have read this".',
        'Pick the right dialog. Use `AlertDialog` for a message with one answer. Use `ConfirmationDialog` for a yes-or-no question. Use `Modal` for a task with fields. For news that needs no answer, use a toast or a banner.',
        'You own the state. You pass `open` (true or false) and `onClose` (what to do when the user is done). The dialog never opens or closes itself.',
        'Focus is the outline that shows where the keyboard is. When the dialog opens, focus moves onto its button. When the dialog closes, focus goes back to the button that opened it. Keyboard users never lose their place.',
        'Escape does what the button does. Both call `onClose`. Clicking the dark area outside (the scrim) does nothing, so the user cannot skip the message by accident.',
        'It is built on `Modal`, so it keeps the same sizes, the same full-screen layout on a phone and the same motion. `AlertDialog` adds the alert role and the description.',
      ]}
      guide="overlays-alert-dialog--docs"
      guideName="Alert dialog"
      groups={[
        {
          title: 'Start here',
          kicker: 'The smallest working alert dialog, and how focus and Escape behave.',
          examples: [
            {
              title: 'The basic alert dialog',
              when: 'A message the user must read before going on. Start with this one.',
              explain: [
                'The button sets `open` to true. The dialog appears and the page behind it stops responding. The browser does this for you, because the dialog is a native `<dialog>`.',
                '`onClose` sets `open` back to false. You call it from one place, and the dialog uses it for both the button and Escape.',
                '`title` says what happened. Screen readers read it first, because it names the dialog (WCAG 4.1.2, A).',
                '`description` says what it means for the user. The dialog links it with `aria-describedby` (a label read by screen readers), so it is read out when the dialog opens (APG Alert and Message Dialogs).',
                '`actionLabel` says what happens next. "Sign in again" tells more than "OK" (WCAG 2.4.6, AA).',
              ],
              render: <AlertDemo trigger="Simulate a timeout" {...expired} />,
              code: `function Example() {
  // You own the state. The dialog only reads it.
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* The trigger. Focus returns here when the dialog closes. */}
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Simulate a timeout
      </Button>

      <AlertDialog
        open={open}
        // Runs on the button and on Escape. Set open to false here.
        onClose={() => setOpen(false)}
        // What happened. Names the dialog for screen readers.
        title="Session expired"
        // What it means. Read out when the dialog opens.
        description="You were signed out after 30 minutes without activity. Your draft is saved."
        // What happens next. A verb, never a bare "OK".
        actionLabel="Sign in again"
      />
    </>
  );
}`,
            },
            {
              title: 'Do work when the user acknowledges',
              when: 'The one button also moves the user on, such as to a sign-in page.',
              explain: [
                'The button and Escape call the same `onClose`. Put the next step there, and both ways out do the same thing.',
                'Escape must do what the button does. A user who presses Escape expects the same result as pressing the button (APG Alert and Message Dialogs).',
                'The status line uses `role="status"`. A screen reader announces the new text without moving focus (WCAG 4.1.3, AA).',
                'Without a shared `onClose`, Escape would close the dialog but skip the redirect. The user would sit on a dead session.',
              ],
              render: <SignInAgain />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');

  // One function for the button and for Escape.
  const acknowledge = () => {
    setOpen(false);
    // Replace with your real redirect, such as navigate('/sign-in').
    setStatus('Redirecting to the sign-in page…');
  };

  return (
    <Stack gap={2} align="start">
      <Button variant="secondary" onClick={() => setOpen(true)}>Simulate a timeout</Button>
      {/* role="status": a screen reader announces the change without moving focus. */}
      <Text as="p" role="status">{status}</Text>
      <AlertDialog
        open={open}
        onClose={acknowledge}
        title="Session expired"
        description="You were signed out after 30 minutes without activity. Your draft is saved."
        actionLabel="Sign in again"
      />
    </Stack>
  );
}`,
            },
            {
              title: 'Choose between the three dialogs',
              when: 'You are not sure whether a message needs an alert dialog, a confirmation dialog or a modal.',
              explain: [
                'Ask what the user must do. Read the message: one answer, `AlertDialog`. Pick between two answers: `ConfirmationDialog`. Fill in fields: `Modal`.',
                'A second button in an alert dialog turns it into a question. Use `ConfirmationDialog` then, so the role and the focus rule stay right (APG Alert and Message Dialogs).',
                'If the message needs no answer at all, a dialog costs attention for nothing. Use a toast or a banner (Nielsen heuristic 8, aesthetic and minimalist design).',
              ],
              code: `// One answer: "I have read this".
<AlertDialog open={open} onClose={close} title="Session expired" description="..." actionLabel="Sign in again" />

// Two answers: confirm or cancel.
<ConfirmationDialog open={open} onClose={close} onConfirm={remove} title="Delete this project?" description="..." confirmLabel="Delete project" cancelLabel="Cancel" />

// A task with fields: you build the content and the actions.
<Modal open={open} onClose={close} title="Edit address" footer={<Button onClick={save}>Save address</Button>}>
  <TextField label="Street" />
</Modal>`,
            },
          ],
        },
        {
          title: 'Messages',
          kicker: 'The title says what happened. The message says what it means. The action says what happens next.',
          examples: [
            {
              title: 'Connection lost',
              when: 'The work cannot go on as before, and the user needs to know what is kept.',
              explain: [
                'The message says what is safe: "Your changes are kept on this device". This tells the user they lost nothing (Nielsen heuristic 9, help users recover from errors).',
                'It also says when things work again. The user knows what to wait for.',
                '"Got it" fits here because the user has nothing to decide. When a verb says more, use the verb.',
              ],
              render: <AlertDemo trigger="Go offline" {...offline} />,
              code: `<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Connection lost"
  // Say what is kept. A user who thinks the work is gone will panic.
  description="Your changes are kept on this device. Save will work again when you are back online."
  // The user has nothing to decide, so "Got it" is honest.
  actionLabel="Got it"
/>`,
            },
            {
              title: 'Limit reached',
              when: 'The next action will fail, and the user must know before they try it.',
              explain: [
                'The message names the limit, then the effect: "Uploads fail". Then it names two ways out: delete files or upgrade.',
                '`actionLabel` names the way forward ("Review storage"), so the button takes the user toward the fix (WCAG 2.4.6, AA).',
                'Show this before the failure, not after it. A dialog that explains a failed upload comes too late.',
              ],
              render: <AlertDemo trigger="Upload a file" {...limit} />,
              code: `<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Storage limit reached"
  // Limit, effect, way out: in that order.
  description="You used all 5 GB. Uploads fail until you delete files or upgrade your plan."
  // A verb and its object: it names where the user goes next.
  actionLabel="Review storage"
/>`,
            },
            {
              title: 'Open after a failed request',
              when: 'Your code starts a task, the task fails, and you open the dialog from code, not from a click.',
              explain: [
                'You can set `open` to true from anywhere, here from a timer. The dialog does not need a click on its own trigger.',
                'Focus goes back to the element that had it before the dialog opened. Here that is the "Send report" button, which the user pressed (WCAG 2.4.3, A).',
                'The status line says "Sending…" while the task runs, so the user knows something is happening. `role="status"` makes a screen reader say it.',
                'The message says the draft is saved. The user learns what to do next: go back to the draft.',
              ],
              render: <AsyncFailure />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');

  const send = async () => {
    setStatus('Sending…');
    try {
      await sendReport(); // your request
      setStatus('Report sent.');
    } catch {
      setStatus('');
      // Open the dialog from code. No click on a trigger is needed.
      setOpen(true);
    }
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
            {
              title: 'Open when the app state changes',
              when: 'A value in your app decides whether the dialog shows, such as a lost connection.',
              explain: [
                '`open` is only a boolean. Any state can drive it: a connection flag, a store value, a query result.',
                '`onClose` must make `open` false. If it does not, the dialog stays and the user is stuck. Here it clears the flag.',
                'If the flag turns true again later, the dialog opens again. Clear the flag only when the user has read the message.',
              ],
              render: <OfflineWatcher />,
              code: `function Example() {
  // Your real flag comes from a hook, such as useOnlineStatus().
  const [offline, setOffline] = useState(false);

  return (
    <Stack gap={2} align="start">
      <Button variant="secondary" onClick={() => setOffline(true)}>Cut the connection</Button>
      <AlertDialog
        // The dialog follows the flag.
        open={offline}
        // Clear the flag, or the user cannot leave the dialog.
        onClose={() => setOffline(false)}
        title="Connection lost"
        description="Your changes are kept on this device. Save will work again when you are back online."
        actionLabel="Got it"
      />
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Sizes',
          kicker: 'The size sets the maximum inline size: 20, 30 and 40 rem. The default is md.',
          examples: [
            {
              title: 'Small',
              when: 'A short message that needs little room.',
              explain: [
                '`size="sm"` caps the width at 20 rem (about 320px). A short line then stays on one or two lines.',
                'A narrow dialog keeps the eye on one short message. A wide one would leave empty space.',
              ],
              render: <AlertDemo trigger="Open small" {...offline} size="sm" />,
              code: `<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  // 20rem wide at most.
  size="sm"
  title="Connection lost"
  description="Your changes are kept on this device. Save will work again when you are back online."
  actionLabel="Got it"
/>`,
            },
            {
              title: 'Medium',
              when: 'The default size, for most messages.',
              explain: [
                '`size="md"` is the default (30 rem). Leave the prop out unless you want to be explicit.',
                'Lines of about 30 rem hold around 60 characters, which is easy to read.',
              ],
              render: <AlertDemo trigger="Open medium" {...expired} size="md" />,
              code: `<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  // The default. Writing it out is optional.
  size="md"
  title="Session expired"
  description="You were signed out after 30 minutes without activity. Your draft is saved."
  actionLabel="Sign in again"
/>`,
            },
            {
              title: 'Large',
              when: 'A longer message that reads better on a wider line.',
              explain: [
                '`size="lg"` caps the width at 40 rem. Use it for a message of several sentences.',
                'The size is a maximum. On a phone, the dialog fills the screen whatever the size (WCAG 1.4.10, AA).',
              ],
              render: <AlertDemo trigger="Open large" {...limit} size="lg" />,
              code: `<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  // 40rem wide at most. On a phone it fills the screen anyway.
  size="lg"
  title="Storage limit reached"
  description="You used all 5 GB. Uploads fail until you delete files or upgrade your plan."
  actionLabel="Review storage"
/>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The description takes text or any React content. The dialog wraps long text and scrolls the body when needed.',
          examples: [
            {
              title: 'Long message',
              when: 'The message runs long. It wraps, and the body scrolls when the dialog runs out of room.',
              explain: [
                'Only the body scrolls. The title and the button stay in view, so the user can always answer (WCAG 2.4.11, AA).',
                'Keep the message as short as the facts allow. A long message is often two messages: cut what the user does not need to act.',
                'Put the most important fact in the first sentence. Users who stop reading early still get it.',
              ],
              render: <AlertDemo trigger="Show the import report" title="Import stopped" description={importReport} actionLabel="Close the report" />,
              code: `<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Import stopped"
  // The cause, what is saved, then what to do. Most important fact first.
  description="The import stopped at row 1,204 of 8,600 because the file holds a date that no calendar knows: 31 February 2026. The 1,203 rows before it are saved. The rows after it are not. Fix the date in your file and import it again, or split the file at row 1,204 and import the second part on its own."
  actionLabel="Close the report"
/>`,
            },
            {
              title: 'Message with markup',
              when: 'The message needs emphasis on one fact.',
              explain: [
                '`description` accepts any React content, not only a string. Here `<strong>` marks the plan name.',
                'Keep the markup small: bold, a link, a line break. Do not put inputs or extra buttons in an alert dialog. That is a job for `Modal`.',
                'Do not use bold alone to carry meaning. The words must still make sense without it (WCAG 1.4.1, A).',
              ],
              render: <MarkupNotice />,
              code: `<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Plan changed"
  // Content, not only text. Keep it small: bold, a link.
  description={<>Your plan is now <strong>Team</strong>. Billing starts on 1 November.</>}
  actionLabel="Got it"
/>`,
            },
            {
              title: 'Translated, with a long action label',
              when: 'The app is translated and the label runs long. A phone shows the worst case.',
              frame: 'phone',
              explain: [
                'Texts arrive as props, so you pass the translated strings. The dialog holds no text of its own.',
                'Translated text is often 30 to 40% longer than English. The label wraps instead of overflowing, and the dialog fills the screen at this width (WCAG 1.4.10, AA).',
                'Test with your longest language. A layout that fits English may break in French or German.',
              ],
              render: <AlertDemo trigger="Simulate a timeout" {...expired} actionLabel="Se reconnecter à votre compte" />,
              code: `<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  // Pass the translated strings. In a real app they come from your i18n tool: t('session.expired.title').
  title="Session expired"
  description="You were signed out after 30 minutes without activity. Your draft is saved."
  // A long label wraps. It never gets cut off.
  actionLabel="Se reconnecter à votre compte"
/>`,
            },
          ],
        },
        {
          title: 'In the flow',
          examples: [
            {
              title: 'Inline',
              when: 'A preview or an embedded panel draws the open dialog in the flow, with no scrim and no focus move.',
              explain: [
                '`inline` draws the dialog open, right where you put it. There is no dark scrim, and focus does not move.',
                'Use it for documentation, previews and tests. Do not use it to show a real alert: the page behind stays usable, which defeats the purpose.',
                '`open` must still be true. Nothing else changes: same title, message and action.',
              ],
              render: <AlertDialog inline open onClose={noop} {...expired} />,
              code: `<AlertDialog
  // Draw it in the page flow. No scrim, no focus trap, no focus move.
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
