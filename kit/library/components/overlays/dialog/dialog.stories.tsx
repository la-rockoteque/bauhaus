import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { Icon } from '../../../primitives/icon/icon';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { IconButton } from '../../clickables/icon-button/icon-button';
import { ConfirmDialog } from './confirm-dialog';
import { Dialog } from './dialog';
import { dialogRules } from './dialog.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Overlays/Dialog', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const noop = () => {};

const Address = () => (
  <Stack gap={3}>
    <Text>Deliveries go to this address.</Text>
    <Text tone="muted" variant="caption">12 Rue des Érables, Québec QC G1R 2K4</Text>
  </Stack>
);

const cancelSave = (
  <>
    <Button variant="secondary">Cancel</Button>
    <Button>Save address</Button>
  </>
);

/** A fixed-height frame so an inline dialog shows how a long body scrolls. */
const Frame = ({ children, height }: { children: ReactNode; height?: string }) => <div style={{ blockSize: height, inlineSize: '100%' }}>{children}</div>;

const longBody = (
  <Stack gap={3}>
    {['Deliveries', 'Billing', 'Returns', 'Gift wrap', 'Customs', 'Insurance', 'Pickup points', 'Holiday hours'].map((topic) => (
      <Text key={topic}>{`${topic}: the terms apply to every order placed through the shop, whatever the carrier.`}</Text>
    ))}
  </Stack>
);

function TryIt() {
  const [form, setForm] = useState(false);
  const [alert, setAlert] = useState(false);
  const [scrim, setScrim] = useState(false);
  return (
    <Stack direction="horizontal" gap={3} wrap>
      <Button onClick={() => setForm(true)}>Edit address</Button>
      <Button variant="secondary" onClick={() => setAlert(true)}>Delete project</Button>
      <Button variant="secondary" onClick={() => setScrim(true)}>Terms (scrim closes)</Button>
      <Dialog open={form} onClose={() => setForm(false)} title="Edit address" closeLabel="Close" footer={<><Button variant="secondary" onClick={() => setForm(false)}>Cancel</Button><Button onClick={() => setForm(false)}>Save address</Button></>}>
        <Address />
      </Dialog>
      <ConfirmDialog open={alert} onClose={() => setAlert(false)} onConfirm={() => setAlert(false)} title="Delete this project?" description="This removes 3 files and cannot be undone." confirmLabel="Delete project" cancelLabel="Cancel" destructive />
      <Dialog open={scrim} onClose={() => setScrim(false)} title="Terms of sale" size="lg" dismissOnScrim closeLabel="Close" footer={<Button onClick={() => setScrim(false)}>I have read the terms</Button>}>
        {longBody}
      </Dialog>
    </Stack>
  );
}

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Dialog"
      layer="Component"
      family="Overlays"
      plain="A dialog is a small window that stops you and asks for a decision or a few details. You answer it or close it, and then you are back where you were."
      precise="Component in the overlays family · a native modal dialog that blocks the page behind it · for a decision or a short task, not for a hint, a menu or a page."
      usedFor="Confirming a destructive action, editing a record in place, showing terms that need a reply."
      tokens={{
        mode: 'consumed',
        note: 'The dialog has no component tokens.',
        rows: [
          { name: 'overlay.surface · overlay.border', tier: 'role', use: 'Fill and soft edge of the panel', swatch: '--ds-overlay-surface' },
          { name: 'scrim', tier: 'role', use: 'The one wash behind the dialog', swatch: '--ds-scrim' },
          { name: 'shadow.2', tier: 'role', use: 'Elevation rung of a dialog', swatch: '--ds-overlay-border' },
          { name: 'text.default · text.muted', tier: 'role', use: 'Title and body text', swatch: '--ds-text-default' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus ring on the title and on the controls', swatch: '--ds-focus-ring-color' },
          { name: 'size.overlay.sm · md · lg', tier: '2', use: 'Maximum inline size: 20, 30, 40 rem' },
          { name: 'radius.overlay', tier: '2', use: 'Corner radius of the panel' },
          { name: 'size.border.thin', tier: '2', use: 'Panel edge and the rule above the actions' },
          { name: 'space.inset.* · space.inline.md · space.4 · space.8', tier: '2', use: 'Padding, gap between actions, entry travel, margin to the screen edge' },
          { name: 'motion.duration.base · motion.ease.enter · motion.ease.exit', tier: '2', use: 'Fade and travel in and out' },
          { name: 'z.modal', tier: '2', use: 'Paint order; the native top layer already sits above the page' },
        ],
      }}
      anatomy={{
        render: (
          <Frame>
            <Dialog inline open onClose={noop} title="Edit address" closeLabel="Close" footer={cancelSave}>
              <Address />
            </Dialog>
          </Frame>
        ),
        parts: [
          { n: 1, label: 'Scrim', note: 'the ::backdrop, modal only', target: '.ds-dialog', at: 'bottom-end' },
          { n: 2, label: 'Container', note: 'native dialog, required', target: '.ds-dialog__panel', at: 'top-start' },
          { n: 3, label: 'Title', note: 'required, names the dialog', target: '.ds-dialog__title' },
          { n: 4, label: 'Close', note: 'optional, closeLabel', target: '.ds-dialog__header .ds-icon-button', at: 'top-end' },
          { n: 5, label: 'Body', note: 'children, scrolls', target: '.ds-dialog__body' },
          { n: 6, label: 'Actions', note: 'footer, optional', target: '.ds-dialog__footer' },
        ],
      }}
      specs={[
        { label: 'Width', value: 'size.overlay.sm 20rem · md 30rem (default) · lg 40rem, capped to the screen minus space.8' },
        { label: 'Height', value: 'up to the screen height minus space.8; the body scrolls, the title row and the actions stay' },
        { label: 'Narrow screen', value: 'At 768px and narrower the dialog fills the screen' },
        { label: 'Radius and rung', value: 'radius.overlay · shadow.2' },
        { label: 'Motion', value: 'Fade and 16px rise, motion.duration.base; reduced motion keeps the fade' },
        { label: 'Focus', value: 'On open: a data-autofocus element, else the first focusable, else the title. On close: back to the opener' },
      ]}
      api={[
        { label: 'open · onClose', value: 'The parent owns whether the dialog is shown. onClose runs on Escape, the close button and an allowed scrim click.' },
        { label: 'title', value: 'Required. Names the dialog and is the fallback focus target.' },
        { label: 'footer', value: 'The actions row. Stays in view while the body scrolls.' },
        { label: 'size', value: '"sm" | "md" | "lg", default "md".' },
        { label: 'role', value: '"dialog" | "alertdialog", default "dialog".' },
        { label: 'dismissOnScrim', value: 'Close on a scrim click. Default false.' },
        { label: 'closeLabel', value: 'The name of the close button. No label, no button.' },
        { label: 'busy', value: 'The content is loading; the body sets aria-busy.' },
        { label: 'inline', value: 'Render open in the flow with no scrim and no focus trap, for previews.' },
        { label: 'ConfirmDialog', value: 'An alertdialog with description, confirmLabel, cancelLabel, onConfirm, and destructive (focus starts on Cancel).' },
      ]}
      states={{
        note: 'Each cell shows the dialog inline: open, in the flow, without the scrim. The live dialogs are under Try it.',
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'A dialog opens for a decision, so it has content. With nothing to ask, do not open it.' },
          { id: 'loading', status: 'designed', render: <Dialog inline open onClose={noop} title="Shipping options" closeLabel="Close" busy><div role="status"><Text tone="muted">Loading shipping options</Text></div></Dialog>, trigger: 'busy', note: 'The body sets aria-busy; the size stays.' },
          { id: 'none', status: 'designed', render: <Dialog inline open onClose={noop} title="Saved addresses" closeLabel="Close" footer={<Button>Add an address</Button>}><Text>You have no saved address yet. Add one to speed up checkout.</Text></Dialog>, trigger: 'no items', note: 'Say what is missing and offer the next step.' },
          { id: 'one', status: 'n/a', reason: 'A dialog carries one task. A list of one item is the "some" cell.' },
          { id: 'some', status: 'designed', render: <Dialog inline open onClose={noop} title="Edit address" closeLabel="Close" footer={cancelSave}><Address /></Dialog>, trigger: 'title, body, footer' },
          { id: 'too-many', status: 'designed', label: 'Too many (long body)', render: <Frame height="calc(var(--ds-space-12) * 6)"><Dialog inline open onClose={noop} title="Terms of sale" closeLabel="Close" footer={<Button>I have read the terms</Button>}>{longBody}</Dialog></Frame>, trigger: 'long children', note: 'Only the body scrolls. The title row and the actions stay in view.' },
          { id: 'incorrect', status: 'designed', render: <Dialog inline open onClose={noop} title="Pay by card" closeLabel="Close" footer={<Button>Try again</Button>}><div role="alert" style={{ display: 'flex', gap: 'var(--ds-space-2)', color: 'var(--ds-status-error)' }}><Icon glyph="error" /><Text as="span">The card was declined. Check the number and try again.</Text></div></Dialog>, trigger: 'role="alert" message', note: 'Text and icon, announced. The dialog stays open so the user can retry.' },
          { id: 'correct', status: 'n/a', reason: 'A valid entry is confirmed by the field it sits in, not by the dialog.' },
          { id: 'done', status: 'n/a', reason: 'Success closes the dialog. The view behind announces it in a status message.' },
          { id: 'default', status: 'designed', render: <Dialog inline open onClose={noop} title="Edit address" closeLabel="Close" size="sm" footer={<Button>Save address</Button>}><Address /></Dialog>, trigger: 'size="sm"', note: 'md and lg are wider, up to 40rem.' },
          { id: 'hover', status: 'n/a', reason: 'The panel is not interactive. Its buttons carry their own hover.' },
          { id: 'focus-visible', status: 'designed', render: <Dialog inline open onClose={noop} title="Edit address" closeLabel="Close" footer={cancelSave}><Stack gap={2}><Text>Focus starts on the first control.</Text><IconButton label="Close" icon={<Icon glyph="close" />} className="doc-force-focus" /></Stack></Dialog>, trigger: ':focus-visible', note: 'Forced by .doc-force-focus on the first control.' },
          { id: 'active', status: 'n/a', reason: 'The panel is not pressable. Its buttons carry their own pressed state.' },
          { id: 'disabled', status: 'designed', render: <Dialog inline open onClose={noop} title="Publish page" closeLabel="Close" footer={<Button disabled>Publish page</Button>}><Text>Publishing needs a title. Add one, then publish.</Text></Dialog>, trigger: 'disabled action', note: 'The reason sits in the body, next to the disabled action.' },
          { id: 'selected', status: 'n/a', reason: 'A dialog is not a selectable item.' },
          { id: 'alert-dialog', status: 'designed', group: 'lifecycle', label: 'Alert dialog (confirm)', render: <ConfirmDialog inline open onClose={noop} onConfirm={noop} title="Delete this project?" description="This removes 3 files and cannot be undone." confirmLabel="Delete project" cancelLabel="Cancel" destructive />, trigger: 'ConfirmDialog destructive', note: 'role="alertdialog". The action names what it deletes; focus starts on Cancel.' },
        ],
      }}
      extra={[{ title: 'Try it', kicker: 'The real modal: open it with a press, then use Tab, Shift+Tab, Escape.', content: <TryIt /> }]}
      dos={[
        { text: 'Name the dialog with a short title that says the task.', basis: 'WCAG 2.4.6 (AA); APG Dialog (Modal)', },
        { text: 'Name a destructive action by its label: "Delete project".', basis: 'WCAG 1.4.1 (A), 2.4.6 (AA)' },
        { text: 'Start focus on the least destructive action in an alert dialog.', basis: 'APG Alert and Message Dialogs' },
        { text: 'Keep long content in the body and let it scroll.', basis: 'WCAG 2.4.11 (AA)' },
      ]}
      donts={[
        { text: 'Build the dialog from a div and a fixed backdrop.', basis: 'APG Dialog (Modal); WCAG 2.1.2 (A)', rule: 'dialog.native-element' },
        { text: 'Leave the dialog without a name.', basis: 'WCAG 4.1.2 (A)', rule: 'dialog.labelled' },
        { text: 'Open a dialog and leave focus on the page behind.', basis: 'WCAG 2.4.3 (A)', rule: 'dialog.focus-in-and-restore' },
        { text: 'Ignore Escape.', basis: 'APG Dialog (Modal)', rule: 'dialog.esc-closes' },
        { text: 'Close on a scrim click when the user typed something.', basis: 'Nielsen 5', rule: 'dialog.scrim-configurable' },
        { text: 'Let the whole dialog scroll, with the actions off screen.', basis: 'WCAG 2.4.11 (AA)', rule: 'dialog.footer-stays' },
        { text: 'Write a colour or px literal in dialog.css.', basis: 'misfile.raw-value-in-component', rule: 'dialog.no-literal' },
        { text: 'Label the destructive action "OK".', basis: 'WCAG 2.4.6 (AA)', rule: 'dialog.destructive-named' },
      ]}
      rules={dialogRules}
      guide="overlays-dialog--docs"
      guideName="Dialog"
    />
  ),
};
