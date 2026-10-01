import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import type { ModalSize } from '../modal/modal';
import { ConfirmationDialog, type ConfirmationDialogProps } from './confirmation-dialog';
import { confirmationDialogRules } from './confirmation-dialog.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Overlays/Confirmation dialog', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const noop = () => {};
const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly ModalSize[];

const del = { title: 'Delete this project?', description: 'This removes 3 files and cannot be undone.', confirmLabel: 'Delete project', cancelLabel: 'Cancel' };
const publish = { title: 'Publish this page?', description: 'Everyone with the link can read it. You can unpublish it later.', confirmLabel: 'Publish page', cancelLabel: 'Cancel' };

function TryIt() {
  const [open, setOpen] = useState<'delete' | 'publish' | null>(null);
  const close = () => setOpen(null);
  return (
    <Stack direction="horizontal" gap={3} wrap>
      <Button variant="secondary" onClick={() => setOpen('delete')}>Delete project</Button>
      <Button onClick={() => setOpen('publish')}>Publish page</Button>
      <ConfirmationDialog open={open === 'delete'} onClose={close} onConfirm={close} {...del} destructive />
      <ConfirmationDialog open={open === 'publish'} onClose={close} onConfirm={close} {...publish} />
    </Stack>
  );
}

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Confirmation dialog"
      layer="Component"
      family="Overlays"
      plain="A confirmation dialog asks one yes-or-no question before an action goes ahead. You confirm it or cancel it."
      precise="Component in the overlays family · an alert dialog with a cancel and a confirm action, built on Modal · for a choice with a cost, not for a message (Alert dialog) or a task (Modal)."
      usedFor="Deleting a record, discarding unsaved changes, publishing, sending to many people."
      tokens={{
        mode: 'consumed',
        note: 'The confirmation dialog has no stylesheet of its own. Every value comes from Modal and Button.',
        rows: [
          { name: 'overlay.surface · overlay.border · scrim · shadow.2', tier: 'role', use: 'The panel and the wash, from Modal', swatch: '--ds-overlay-surface' },
          { name: 'text.default', tier: 'role', use: 'Title and message', swatch: '--ds-text-default' },
          { name: 'action.primary · action.secondary', tier: 'role', use: 'The confirm and the cancel buttons', swatch: '--ds-action-primary' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus ring on the first action', swatch: '--ds-focus-ring-color' },
          { name: 'size.overlay.sm · md · lg', tier: '2', use: 'Maximum inline size, from Modal' },
        ],
      }}
      stage={{
        render: (args) => (
          <ConfirmationDialog
            inline
            open
            onClose={noop}
            onConfirm={noop}
            title={String(args.title)}
            description={String(args.description)}
            confirmLabel={String(args.confirmLabel)}
            cancelLabel={String(args.cancelLabel)}
            destructive={args.destructive === true}
            size={args.size as ModalSize}
          />
        ),
        parts: [
          { n: 1, label: 'Title', note: 'required, the question', target: '.ds-modal__title' },
          { n: 2, label: 'Message', note: 'required, what it costs', target: '.ds-modal__body' },
          { n: 3, label: 'Cancel', note: 'required, cancelLabel', target: '.ds-modal__footer .ds-button--secondary' },
          { n: 4, label: 'Confirm', note: 'required, names the action', target: '.ds-modal__footer .ds-button--primary', at: 'end' },
        ],
      }}
      specs={[
        { label: 'Role', value: 'alertdialog, described by the message' },
        { label: 'Focus', value: 'On Cancel when destructive, else on the confirm action' },
        { label: 'Escape and scrim', value: 'Escape cancels. The scrim does not close it' },
        { label: 'Layout', value: 'From Modal: sizes, the narrow full screen, the motion' },
      ]}
      api={[
        { label: 'open · onClose', value: 'The parent owns whether it is shown. onClose runs on Cancel and on Escape.' },
        { label: 'onConfirm', value: 'Runs on the confirm action. The parent closes the dialog when the action is done.' },
        { label: 'title', value: 'Required. The question.', control: { kind: 'text', value: del.title } },
        { label: 'description', value: 'Required. What it costs.', control: { kind: 'text', value: del.description } },
        { label: 'confirmLabel', value: 'Required. Names the action and its object: "Delete project".', control: { kind: 'text', value: del.confirmLabel } },
        { label: 'cancelLabel', value: 'Required. The label of the cancel action.', control: { kind: 'text', value: del.cancelLabel } },
        { label: 'destructive', value: 'The action cannot be undone. Focus starts on Cancel.', control: { kind: 'boolean', value: true } },
        { label: 'size', value: 'Passed to Modal.', control: { kind: 'select', options: SIZES, value: 'md' } },
        { label: 'inline', value: 'Passed to Modal.' },
      ]}
      states={{
        note: 'Each cell shows the dialog inline: open, in the flow, without the scrim. The live dialogs are under Try it.',
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'The dialog opens with its question, or not at all.' },
          { id: 'loading', status: 'n/a', reason: 'The parent runs the action after confirm. It shows progress on the page, or keeps a Modal open with busy.' },
          { id: 'none', status: 'n/a', reason: 'The dialog holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'The dialog holds no collection.' },
          { id: 'some', status: 'designed', render: <ConfirmationDialog inline open onClose={noop} onConfirm={noop} {...publish} />, trigger: 'title, description, labels' },
          { id: 'too-many', status: 'designed', label: 'Too many (long message)', render: <ConfirmationDialog inline open onClose={noop} onConfirm={noop} {...del} description="This removes the project, its 3 files, its 12 comments and its share links. People who open an old link see a page that says the project was deleted. This cannot be undone." destructive />, trigger: 'long description', note: 'The message wraps. Only the body scrolls when it runs out of room.' },
          { id: 'incorrect', status: 'n/a', reason: 'The dialog asks before the action runs. A failed action is reported by the view, or by an alert dialog.' },
          { id: 'correct', status: 'n/a', reason: 'The dialog takes no input.' },
          { id: 'done', status: 'n/a', reason: 'Confirm closes the dialog. The view behind announces the result in a status message.' },
          { id: 'default', status: 'designed', render: <ConfirmationDialog inline open onClose={noop} onConfirm={noop} {...publish} />, trigger: 'rest', note: 'Focus starts on the confirm action.' },
          { id: 'default', variant: 'Destructive', status: 'designed', render: <ConfirmationDialog inline open onClose={noop} onConfirm={noop} {...del} destructive />, trigger: 'destructive', note: 'Focus starts on Cancel. The label names what goes.' },
          { id: 'hover', status: 'n/a', reason: 'The panel is not interactive. Its buttons carry their own hover.' },
          { id: 'focus-visible', status: 'n/a', reason: 'Its buttons carry the focus ring; see Button.' },
          { id: 'active', status: 'n/a', reason: 'The panel is not pressable. Its buttons carry their own pressed state.' },
          { id: 'disabled', status: 'n/a', reason: 'Both answers are always available. A choice that cannot be made is not asked.' },
          { id: 'selected', status: 'n/a', reason: 'A dialog is not a selectable item.' },
        ],
      }}
      extra={[{ title: 'Try it', kicker: 'The real dialogs: open one, then use Tab, Enter and Escape.', content: <TryIt /> }]}
      dos={[
        { text: 'Ask the question in the title: "Delete this project?"', basis: 'WCAG 2.4.6 (AA)' },
        { text: 'Say what the action costs in the message.', basis: 'Nielsen 5, error prevention' },
        { text: 'Name the confirm action by its verb and object: "Delete project".', basis: 'WCAG 2.4.6 (AA)' },
        { text: 'Prefer undo to a confirmation for an action that can be reversed.', basis: 'Nielsen 3, user control and freedom' },
      ]}
      donts={[
        { text: 'Label the destructive action "OK" or mark it with red alone.', basis: 'WCAG 1.4.1 (A), 2.4.6 (AA)', rule: 'confirmation-dialog.destructive-named' },
        { text: 'Start focus on a destructive action.', basis: 'APG Alert and Message Dialogs', rule: 'confirmation-dialog.destructive-focus' },
        { text: 'Build a confirmation from a div, or from a Modal with its own buttons.', basis: 'Nielsen 4', rule: 'confirmation-dialog.built-on-modal' },
      ]}
      guide="overlays-confirmation-dialog--docs"
      guideName="Confirmation dialog"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Confirmation dialog" layer="Component" family="Overlays" rules={confirmationDialogRules} guide="overlays-confirmation-dialog--docs" guideName="Confirmation dialog" />,
};

type ConfirmCopy = Omit<ConfirmationDialogProps, 'open' | 'onClose' | 'onConfirm'>;

/** A closed trigger, its confirmation dialog and a status line that shows which answer the user gave. */
function ConfirmDemo({ trigger, result, ...copy }: ConfirmCopy & { trigger: string; result: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  return (
    <Stack gap={2} align="start">
      <Button variant="secondary" onClick={() => setOpen(true)}>{trigger}</Button>
      <Text as="p" role="status">{status}</Text>
      <ConfirmationDialog
        {...copy}
        open={open}
        onClose={() => {
          setOpen(false);
          setStatus('Cancelled. Nothing changed.');
        }}
        onConfirm={() => {
          setOpen(false);
          setStatus(result);
        }}
      />
    </Stack>
  );
}

/** Confirming starts slow work. The view reports progress and the result, not the dialog. */
function SlowDelete() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const remove = () => {
    setOpen(false);
    setStatus('Deleting…');
    window.setTimeout(() => setStatus('Project deleted.'), 1500);
  };
  return (
    <Stack gap={2} align="start">
      <Button variant="secondary" onClick={() => setOpen(true)}>Delete project</Button>
      <Text as="p" role="status">{status}</Text>
      <ConfirmationDialog open={open} onClose={() => setOpen(false)} onConfirm={remove} {...del} destructive />
    </Stack>
  );
}

/** The label and the message name the real count, so the user sees the cost before confirming. */
function DeleteSelection() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState(['report.pdf', 'budget.xlsx', 'notes.txt']);
  const count = files.length;
  const remove = () => {
    setFiles([]);
    setOpen(false);
  };
  return (
    <Stack gap={2} align="start">
      <Text as="p" role="status">{count === 0 ? 'No files left.' : `${count} files selected.`}</Text>
      <Button variant="secondary" disabled={count === 0} onClick={() => setOpen(true)}>Delete files</Button>
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={remove}
        title={`Delete ${count} files?`}
        description={`This removes ${count} files from your drive and cannot be undone.`}
        confirmLabel={`Delete ${count} files`}
        cancelLabel="Cancel"
        destructive
      />
    </Stack>
  );
}

const discard = { title: 'Discard your changes?', description: 'You edited 4 fields. They are lost if you leave this page.', confirmLabel: 'Discard changes', cancelLabel: 'Keep editing' };
const sendList = { title: 'Send to 2,400 subscribers?', description: 'The newsletter goes out now. You cannot recall an email once it is sent.', confirmLabel: 'Send newsletter', cancelLabel: 'Not yet' };
const longCopy = {
  title: 'Remove the team?',
  description: 'The team Platform loses its 14 members, its 6 shared boards and its billing plan. Members keep their own accounts. The boards move to the archive for 30 days, then the system deletes them. Billing stops at the end of the month. Nobody can restore the plan, and you will have to set it up again to bring the team back.',
  confirmLabel: 'Remove team',
  cancelLabel: 'Cancel',
};
const french = { title: 'Supprimer ce projet ?', description: 'Cette action supprime 3 fichiers et ne peut pas être annulée.', confirmLabel: 'Supprimer définitivement le projet', cancelLabel: 'Conserver le projet' };

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Confirmation dialog"
      layer="Component"
      family="Overlays"
      imports={"import { useState } from 'react';\nimport { Button, ConfirmationDialog, Stack, Text } from '@acme/design-system';"}
      intro={[
        'A confirmation dialog asks one yes-or-no question before an action goes ahead. The user confirms it or cancels it.',
        'Pick the right dialog. Use `ConfirmationDialog` for a question with two answers. Use `AlertDialog` for a message with one answer. Use `Modal` for a task with fields.',
        'Ask only when the action costs something: it cannot be undone, or it reaches other people. For an action the user can undo, do it and offer Undo in a toast. A dialog before every action teaches people to click without reading.',
        'You own the state. You pass `open` (true or false), `onClose` (Cancel and Escape) and `onConfirm` (the confirm button). The dialog never closes itself, so each handler must set `open` to false.',
        'Focus is the outline that shows where the keyboard is. When the dialog opens, focus moves onto one of its buttons. When it closes, focus goes back to the button that opened it.',
        'With `destructive`, focus starts on Cancel. An Enter pressed out of habit then keeps the data. Without it, focus starts on the confirm button.',
        'Escape and Cancel both call `onClose`. A click on the dark area outside (the scrim) does nothing.',
      ]}
      guide="overlays-confirmation-dialog--docs"
      guideName="Confirmation dialog"
      groups={[
        {
          title: 'Start here',
          kicker: 'The most common use: ask before an action that cannot be undone.',
          examples: [
            {
              title: 'Destructive: delete a project',
              when: 'The action cannot be undone. Start with this one.',
              explain: [
                '`destructive` moves the first focus to Cancel. A user who presses Enter right away keeps the project instead of losing it (APG Alert and Message Dialogs).',
                '`confirmLabel` names the action and its object: "Delete project". "OK" would name nothing, and the user could not tell what Enter does (WCAG 2.4.6, AA).',
                '`description` states the cost: what goes, and that it cannot be undone. The dialog links it with `aria-describedby` (a label read by screen readers), so the cost is read out on open (WCAG 4.1.2, A).',
                'The status line shows both answers. Cancel and Escape say "Cancelled". Confirm says "Project deleted". `role="status"` makes a screen reader announce the text (WCAG 4.1.3, AA).',
              ],
              render: <ConfirmDemo trigger="Delete project" result="Project deleted." {...del} destructive />,
              code: `function Example() {
  // You own the state. The dialog only reads it.
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');

  return (
    <Stack gap={2} align="start">
      {/* The trigger. Focus returns here when the dialog closes. */}
      <Button variant="secondary" onClick={() => setOpen(true)}>Delete project</Button>
      {/* role="status": a screen reader announces the new text without moving focus. */}
      <Text as="p" role="status">{status}</Text>

      <ConfirmationDialog
        open={open}
        // Runs on Cancel and on Escape. It must close the dialog.
        onClose={() => {
          setOpen(false);
          setStatus('Cancelled. Nothing changed.');
        }}
        // Runs on the confirm button. It must close the dialog too.
        onConfirm={() => {
          setOpen(false);
          deleteProject(); // your delete call
          setStatus('Project deleted.');
        }}
        // The question.
        title="Delete this project?"
        // The cost. Read out when the dialog opens.
        description="This removes 3 files and cannot be undone."
        // Verb + object, never "OK".
        confirmLabel="Delete project"
        cancelLabel="Cancel"
        // Focus starts on Cancel, the safe choice. Without it, focus starts on Delete.
        destructive
      />
    </Stack>
  );
}`,
            },
            {
              title: 'Not destructive: publish a page',
              when: 'The action can be reversed, but other people will see it.',
              explain: [
                'Without `destructive`, focus starts on the confirm button. The user wants to go on, so Enter does what they came for.',
                'The message says the user can unpublish later. It tells them how costly a mistake is: low.',
                'The confirm label keeps the verb and the object: "Publish page" (WCAG 2.4.6, AA).',
              ],
              render: <ConfirmDemo trigger="Publish page" result="Page published." {...publish} />,
              code: `<ConfirmationDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={() => {
    setOpen(false);
    publishPage(); // your publish call
  }}
  title="Publish this page?"
  // Say what the action does and how to reverse it.
  description="Everyone with the link can read it. You can unpublish it later."
  confirmLabel="Publish page"
  cancelLabel="Cancel"
  // No "destructive": focus starts on "Publish page".
/>`,
            },
            {
              title: 'Start slow work after confirming',
              when: 'Confirming starts a task that takes time, such as a delete on a server.',
              explain: [
                '`onConfirm` closes the dialog first, then starts the task. The dialog asks the question. It does not show progress.',
                'The page behind reports the work: "Deleting…", then the result. `role="status"` makes a screen reader say each line (WCAG 4.1.3, AA).',
                'If the task fails, report it in the page, or open an `AlertDialog`. Do not leave the confirmation open with a spinner.',
              ],
              render: <SlowDelete />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');

  const remove = async () => {
    // Close first. The dialog's job is done once the user answers.
    setOpen(false);
    setStatus('Deleting…');
    await deleteProject(); // your delete call
    setStatus('Project deleted.');
  };

  return (
    <Stack gap={2} align="start">
      <Button variant="secondary" onClick={() => setOpen(true)}>Delete project</Button>
      {/* The page reports progress and the result. */}
      <Text as="p" role="status">{status}</Text>
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={remove}
        title="Delete this project?"
        description="This removes 3 files and cannot be undone."
        confirmLabel="Delete project"
        cancelLabel="Cancel"
        destructive
      />
    </Stack>
  );
}`,
            },
            {
              title: 'Choose between the three dialogs',
              when: 'You are not sure whether a question needs a confirmation dialog, an alert dialog or a modal.',
              explain: [
                'Ask what the user must do. Choose between two answers: `ConfirmationDialog`. Read one message: `AlertDialog`. Fill in fields: `Modal`.',
                'Do not build a confirmation from a `Modal` and your own buttons. You would lose the alert role, the description and the focus rule (Nielsen heuristic 4, consistency).',
                'If the action can be undone, skip the dialog. Do the action and show an Undo in a toast (Nielsen heuristic 3, user control and freedom).',
              ],
              code: `// Two answers: confirm or cancel.
<ConfirmationDialog open={open} onClose={close} onConfirm={remove} title="Delete this project?" description="..." confirmLabel="Delete project" cancelLabel="Cancel" destructive />

// One answer: "I have read this".
<AlertDialog open={open} onClose={close} title="Session expired" description="..." actionLabel="Sign in again" />

// A task with fields: you build the content and the actions.
<Modal open={open} onClose={close} title="Edit address" footer={<Button onClick={save}>Save address</Button>}>
  <TextField label="Street" />
</Modal>`,
            },
          ],
        },
        {
          title: 'Kinds of choice',
          kicker: 'The title asks the question. The confirm label names the action and its object.',
          examples: [
            {
              title: 'Discard changes',
              when: 'The user leaves a form with unsaved work.',
              explain: [
                'The cancel label is "Keep editing", not "Cancel". It says what the safe choice does. Labels that describe the outcome help users who read only the buttons.',
                '`destructive` is set because the edits are lost. Focus starts on "Keep editing".',
                'The message counts what is lost: "4 fields". A number shows the cost better than a general warning.',
              ],
              render: <ConfirmDemo trigger="Leave the page" result="Changes discarded." {...discard} destructive />,
              code: `<ConfirmationDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={() => {
    setOpen(false);
    leavePage(); // your navigation
  }}
  title="Discard your changes?"
  // Count the loss.
  description="You edited 4 fields. They are lost if you leave this page."
  confirmLabel="Discard changes"
  // The safe choice says what it does: the user stays and keeps editing.
  cancelLabel="Keep editing"
  destructive
/>`,
            },
            {
              title: 'Reaches other people',
              when: 'An action is hard to take back once others receive it, such as an email to a list.',
              explain: [
                'Not `destructive`: no data is lost. Focus starts on "Send newsletter".',
                'The message says why a pause is worth it: "You cannot recall an email once it is sent".',
                'The title carries the number. Asking "Send to 2,400 subscribers?" makes the user see the scale (Nielsen heuristic 5, error prevention).',
                '"Not yet" is a gentler cancel label than "Cancel". Use it when the user may come back to the action.',
              ],
              render: <ConfirmDemo trigger="Send newsletter" result="Newsletter sent." {...sendList} />,
              code: `<ConfirmationDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={() => {
    setOpen(false);
    sendNewsletter(); // your send call
  }}
  // Put the scale in the question.
  title="Send to 2,400 subscribers?"
  description="The newsletter goes out now. You cannot recall an email once it is sent."
  confirmLabel="Send newsletter"
  cancelLabel="Not yet"
/>`,
            },
            {
              title: 'The text follows your data',
              when: 'The question depends on a count or a name from your app.',
              explain: [
                'Build the strings from your data: `Delete ${count} files`. The label then names the real object, not a general "Delete".',
                'The dialog re-renders when the data changes, so the count is always current.',
                'The trigger is `disabled` when nothing is selected. A dialog about zero files would confuse the user.',
              ],
              render: <DeleteSelection />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState(['report.pdf', 'budget.xlsx', 'notes.txt']);
  const count = files.length;

  return (
    <Stack gap={2} align="start">
      <Text as="p" role="status">{count === 0 ? 'No files left.' : \`\${count} files selected.\`}</Text>
      {/* Nothing selected, nothing to delete: the trigger is off. */}
      <Button variant="secondary" disabled={count === 0} onClick={() => setOpen(true)}>Delete files</Button>
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setFiles([]);
          setOpen(false);
        }}
        // Every string uses the real count.
        title={\`Delete \${count} files?\`}
        description={\`This removes \${count} files from your drive and cannot be undone.\`}
        confirmLabel={\`Delete \${count} files\`}
        cancelLabel="Cancel"
        destructive
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
              when: 'A short question with a short cost.',
              explain: [
                '`size="sm"` caps the width at 20 rem (about 320px).',
                'On a phone the dialog fills the screen whatever the size (WCAG 1.4.10, AA).',
              ],
              render: <ConfirmDemo trigger="Delete project" result="Project deleted." {...del} size="sm" destructive />,
              code: `<ConfirmationDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={remove}
  // 20rem wide at most.
  size="sm"
  title="Delete this project?"
  description="This removes 3 files and cannot be undone."
  confirmLabel="Delete project"
  cancelLabel="Cancel"
  destructive
/>`,
            },
            {
              title: 'Medium',
              when: 'The default size, for most questions.',
              explain: [
                '`size="md"` is the default (30 rem). You can leave the prop out.',
                'About 30 rem holds around 60 characters per line, which is easy to read.',
              ],
              render: <ConfirmDemo trigger="Publish page" result="Page published." {...publish} size="md" />,
              code: `<ConfirmationDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={publishPage}
  // The default. Writing it out is optional.
  size="md"
  title="Publish this page?"
  description="Everyone with the link can read it. You can unpublish it later."
  confirmLabel="Publish page"
  cancelLabel="Cancel"
/>`,
            },
            {
              title: 'Large',
              when: 'A longer cost that reads better on a wider line.',
              explain: [
                '`size="lg"` caps the width at 40 rem. Use it when the message lists several consequences.',
                'Wider is not better for short text. A short question in a large dialog leaves empty space.',
              ],
              render: <ConfirmDemo trigger="Remove team" result="Team removed." {...longCopy} size="lg" destructive />,
              code: `<ConfirmationDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={removeTeam}
  // 40rem wide at most.
  size="lg"
  title="Remove the team?"
  description="The team Platform loses its 14 members, its 6 shared boards and its billing plan. Members keep their own accounts. The boards move to the archive for 30 days, then the system deletes them. Billing stops at the end of the month. Nobody can restore the plan, and you will have to set it up again to bring the team back."
  confirmLabel="Remove team"
  cancelLabel="Cancel"
  destructive
/>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The description takes text or any React content. Long text wraps, and the body scrolls when needed.',
          examples: [
            {
              title: 'Long message',
              when: 'The cost needs several sentences.',
              explain: [
                'The message wraps. The body scrolls when the dialog runs out of room, while the title and both buttons stay in view (WCAG 2.4.11, AA).',
                'A long message is a warning sign. If users must read five sentences to decide, check that the action is not too big for one click.',
                'Put the worst consequence first. Users who stop reading early still see it.',
              ],
              render: <ConfirmDemo trigger="Remove team" result="Team removed." {...longCopy} destructive />,
              code: `<ConfirmationDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={removeTeam}
  title="Remove the team?"
  // Consequences in order of weight. The body scrolls if it does not fit.
  description="The team Platform loses its 14 members, its 6 shared boards and its billing plan. Members keep their own accounts. The boards move to the archive for 30 days, then the system deletes them. Billing stops at the end of the month. Nobody can restore the plan, and you will have to set it up again to bring the team back."
  confirmLabel="Remove team"
  cancelLabel="Cancel"
  destructive
/>`,
            },
            {
              title: 'Message with markup',
              when: 'The question needs emphasis on the name of the thing.',
              explain: [
                '`description` accepts any React content. Here `<strong>` marks the project name.',
                'Naming the object lets the user check they picked the right one (Nielsen heuristic 5, error prevention).',
                'Keep the markup small. Do not add inputs or buttons here. A form is a job for `Modal`.',
              ],
              render: (
                <ConfirmDemo
                  trigger="Delete Atlas"
                  result="Project deleted."
                  title="Delete this project?"
                  description={<>This removes <strong>Atlas</strong> and its 3 files. It cannot be undone.</>}
                  confirmLabel="Delete Atlas"
                  cancelLabel="Cancel"
                  destructive
                />
              ),
              code: `<ConfirmationDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={remove}
  title="Delete this project?"
  // Content, not only text. Bold the name so the user can check it.
  description={<>This removes <strong>Atlas</strong> and its 3 files. It cannot be undone.</>}
  confirmLabel="Delete Atlas"
  cancelLabel="Cancel"
  destructive
/>`,
            },
            {
              title: 'Translated, with long labels',
              when: 'The app is translated and the labels run long. A phone shows the worst case.',
              frame: 'phone',
              explain: [
                'All texts arrive as props, so you pass translated strings. The dialog holds no text of its own.',
                'Translated labels are often much longer than English ones. The two buttons wrap instead of overflowing, and the dialog fills the screen at this width (WCAG 1.4.10, AA).',
                'Test with your longest language. A layout that fits English may break in French or German.',
              ],
              render: <ConfirmDemo trigger="Supprimer le projet" result="Projet supprimé." {...french} destructive />,
              code: `<ConfirmationDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={remove}
  // In a real app these come from your i18n tool: t('project.delete.title').
  title="Supprimer ce projet ?"
  description="Cette action supprime 3 fichiers et ne peut pas être annulée."
  // Long labels wrap. They are never cut off.
  confirmLabel="Supprimer définitivement le projet"
  cancelLabel="Conserver le projet"
  destructive
/>`,
            },
          ],
        },
        {
          title: 'In the flow',
          kicker: 'Inline draws the open dialog in the flow, with no scrim and no focus move. It serves previews and embedded panels.',
          examples: [
            {
              title: 'Inline, destructive',
              when: 'A preview shows the dialog with its focus rule: Cancel first.',
              explain: [
                '`inline` draws the dialog open, where you put it. There is no dark scrim, and focus does not move.',
                'Use it for documentation and tests. Do not use it for a real question: the page behind stays usable.',
                'Same props as the live dialog. `destructive` still sets the focus rule, but nothing moves focus here.',
              ],
              render: <ConfirmationDialog inline open onClose={noop} onConfirm={noop} {...del} destructive />,
              code: `<ConfirmationDialog
  // Draw it in the page flow. No scrim, no focus trap, no focus move.
  inline
  open
  onClose={() => {}}
  onConfirm={() => {}}
  title="Delete this project?"
  description="This removes 3 files and cannot be undone."
  confirmLabel="Delete project"
  cancelLabel="Cancel"
  destructive
/>`,
            },
            {
              title: 'Inline, not destructive',
              when: 'A preview shows the dialog with its other focus rule: the confirm action first.',
              explain: [
                'The only difference from the destructive preview is the missing `destructive` prop.',
                'Compare the two to see the button order stay the same: Cancel, then Confirm. Only the first focus changes.',
              ],
              render: <ConfirmationDialog inline open onClose={noop} onConfirm={noop} {...publish} />,
              code: `<ConfirmationDialog
  inline
  open
  onClose={() => {}}
  onConfirm={() => {}}
  title="Publish this page?"
  description="Everyone with the link can read it. You can unpublish it later."
  confirmLabel="Publish page"
  cancelLabel="Cancel"
/>`,
            },
          ],
        },
      ]}
    />
  ),
};
