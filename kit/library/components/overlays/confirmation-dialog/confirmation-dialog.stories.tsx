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

type ConfirmCopy = Pick<ConfirmationDialogProps, 'title' | 'confirmLabel' | 'cancelLabel' | 'size'> & { description: string; destructive?: boolean; result: string };

/** The trigger and its dialog, closed until the user presses the trigger. The status line shows which answer closed it. */
function ConfirmExample({ trigger, result, ...copy }: ConfirmCopy & { trigger: string }) {
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

/** The source a consumer writes for a ConfirmExample. */
function confirmSource(trigger: string, { result, ...copy }: ConfirmCopy) {
  const lines = Object.entries(copy)
    .map(([key, value]) => (typeof value === 'boolean' ? `        ${key}` : `        ${key}="${value}"`))
    .join('\n');
  return `function Example() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  return (
    <Stack gap={2} align="start">
      <Button variant="secondary" onClick={() => setOpen(true)}>${trigger}</Button>
      <Text as="p" role="status">{status}</Text>
      <ConfirmationDialog
        open={open}
${lines}
        onClose={() => {
          setOpen(false);
          setStatus('Cancelled. Nothing changed.');
        }}
        onConfirm={() => {
          setOpen(false);
          setStatus('${result}');
        }}
      />
    </Stack>
  );
}`;
}

const confirmExample = (trigger: string, copy: ConfirmCopy) => ({ render: <ConfirmExample trigger={trigger} {...copy} />, code: confirmSource(trigger, copy) });

const deleteCopy: ConfirmCopy = { ...del, destructive: true, result: 'Project deleted.' };
const publishCopy: ConfirmCopy = { ...publish, result: 'Page published.' };
const discard: ConfirmCopy = {
  title: 'Discard your changes?', description: 'You edited 4 fields. They are lost if you leave this page.', confirmLabel: 'Discard changes', cancelLabel: 'Keep editing', destructive: true, result: 'Changes discarded.',
};
const longCopy: ConfirmCopy = {
  title: 'Remove the team?',
  description: 'The team Platform loses its 14 members, its 6 shared boards and its billing plan. Members keep their own accounts. The boards move to the archive for 30 days, then the system deletes them. Billing stops at the end of the month. Nobody can restore the plan, and you will have to set it up again to bring the team back.',
  confirmLabel: 'Remove team', cancelLabel: 'Cancel', destructive: true, result: 'Team removed.',
};
const french: ConfirmCopy = {
  title: 'Supprimer ce projet ?', description: 'Cette action supprime 3 fichiers et ne peut pas être annulée.', confirmLabel: 'Supprimer définitivement le projet', cancelLabel: 'Conserver le projet', destructive: true, result: 'Projet supprimé.',
};

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Confirmation dialog"
      layer="Component"
      family="Overlays"
      imports="import { useState } from 'react'; import { Button, ConfirmationDialog, Stack, Text } from '@acme/design-system';"
      guide="overlays-confirmation-dialog--docs"
      guideName="Confirmation dialog"
      groups={[
        {
          title: 'Kinds of choice',
          kicker: 'The title asks the question. The confirm label names the action and its object.',
          examples: [
            { title: 'Destructive', when: 'The action cannot be undone. Focus starts on Cancel, so a habit Enter keeps the data.', ...confirmExample('Delete project', deleteCopy) },
            { title: 'Discard changes', when: 'The user leaves a form with unsaved work.', ...confirmExample('Leave the page', discard) },
            { title: 'Reaches other people', when: 'The action is not destructive but others will see it. Focus starts on the confirm action.', ...confirmExample('Publish page', publishCopy) },
          ],
        },
        {
          title: 'Sizes',
          kicker: 'The size sets the maximum inline size. The default is md.',
          examples: [
            { title: 'Small', when: 'A short question with a short cost.', ...confirmExample('Delete project', { ...deleteCopy, size: 'sm' }) },
            { title: 'Large', when: 'A longer cost that reads better on a wider line.', ...confirmExample('Remove team', { ...longCopy, size: 'lg' }) },
          ],
        },
        {
          title: 'Content',
          examples: [
            { title: 'Long message', when: 'The cost needs several sentences. The message wraps, and the body scrolls when the dialog runs out of room.', ...confirmExample('Remove team', longCopy) },
            { title: 'Long labels on a phone', when: 'A translated confirm label is long. The dialog fills the screen at this width.', frame: 'phone', ...confirmExample('Supprimer le projet', french) },
          ],
        },
        {
          title: 'In the flow',
          kicker: 'Inline draws the open dialog in the flow, with no scrim and no focus move. It serves previews and embedded panels.',
          examples: [
            {
              title: 'Inline, destructive',
              when: 'A preview shows the dialog with its focus rule: Cancel first.',
              render: <ConfirmationDialog inline open onClose={noop} onConfirm={noop} {...del} destructive />,
              code: `<ConfirmationDialog
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
              when: 'A preview shows the dialog with its focus rule: the confirm action first.',
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
