import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { Stack } from '../../../primitives/stack/stack';
import { Button } from '../../clickables/button/button';
import { ConfirmationDialog } from './confirmation-dialog';
import { confirmationDialogRules } from './confirmation-dialog.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Overlays/Confirmation dialog', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const noop = () => {};

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
        render: <ConfirmationDialog inline open onClose={noop} onConfirm={noop} {...del} destructive />,
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
        { label: 'title · description', value: 'Required. The question, and what it costs.' },
        { label: 'confirmLabel · cancelLabel', value: 'Required. The confirm label names the action and its object: "Delete project".' },
        { label: 'destructive', value: 'The action cannot be undone. Focus starts on Cancel.' },
        { label: 'size · inline', value: 'Passed to Modal.' },
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
