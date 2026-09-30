import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { Button } from '../../clickables/button/button';
import { AlertDialog } from './alert-dialog';
import { alertDialogRules } from './alert-dialog.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Overlays/Alert dialog', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const noop = () => {};

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
        render: <AlertDialog inline open onClose={noop} {...expired} />,
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
        { label: 'title · description', value: 'Required. What happened, and what it means for the user.' },
        { label: 'actionLabel', value: 'Required. Says what happens next: "Sign in again".' },
        { label: 'size · inline', value: 'Passed to Modal.' },
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
