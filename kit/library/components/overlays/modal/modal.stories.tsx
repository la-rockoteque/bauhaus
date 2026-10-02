import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Icon } from '../../../primitives/icon/icon';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { Banner } from '../../feedback/banner/banner';
import { Spinner } from '../../feedback/spinner/spinner';
import { Checkbox } from '../../fields/checkbox/checkbox';
import { TextField } from '../../fields/text-field/text-field';
import { IconButton } from '../../clickables/icon-button/icon-button';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { Modal, type ModalProps, type ModalSize } from './modal';
import { modalRules } from './modal.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Overlays/Modal', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const noop = () => {};
const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly ModalSize[];
type ModalRole = NonNullable<ModalProps['role']>;
const ROLES = ['dialog', 'alertdialog'] as const satisfies readonly ModalRole[];

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

/** A fixed-height frame so an inline modal shows how a long body scrolls. */
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
  const [scrim, setScrim] = useState(false);
  return (
    <Stack direction="horizontal" gap={3} wrap>
      <Button onClick={() => setForm(true)}>Edit address</Button>
      <Button variant="secondary" onClick={() => setScrim(true)}>Terms (scrim closes)</Button>
      <Modal open={form} onClose={() => setForm(false)} title="Edit address" closeLabel="Close" footer={<><Button variant="secondary" onClick={() => setForm(false)}>Cancel</Button><Button onClick={() => setForm(false)}>Save address</Button></>}>
        <Address />
      </Modal>
      <Modal open={scrim} onClose={() => setScrim(false)} title="Terms of sale" size="lg" dismissOnScrim closeLabel="Close" footer={<Button onClick={() => setScrim(false)}>I have read the terms</Button>}>
        {longBody}
      </Modal>
    </Stack>
  );
}

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Modal"
      layer="Component"
      family="Overlays"
      plain="A modal is a small window that stops you and asks for a few details. You finish the task or close it, and then you are back where you were."
      precise="Component in the overlays family · a native modal dialog that blocks the page behind it · for a short task, not for a hint, a menu or a page. A message goes in an alert dialog, a yes-or-no question in a confirmation dialog."
      usedFor="Editing a record in place, showing terms that need a reply. Alert dialog and Confirmation dialog are built on it."
      tokens={{
        mode: 'consumed',
        note: 'The modal has no component tokens.',
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
      stage={{
        render: (args) => (
          <Frame>
            <Modal
              inline
              open
              onClose={noop}
              title={String(args.title)}
              closeLabel={String(args.closeLabel)}
              size={args.size as ModalSize}
              role={args.role as ModalRole}
              busy={args.busy === true}
              footer={cancelSave}
            >
              <Address />
            </Modal>
          </Frame>
        ),
        parts: [
          { n: 1, label: 'Scrim', note: 'the ::backdrop, modal only', target: '.ds-modal', at: 'bottom-end' },
          { n: 2, label: 'Container', note: 'native dialog, required', target: '.ds-modal__panel', at: 'top-start' },
          { n: 3, label: 'Title', note: 'required, names the dialog', target: '.ds-modal__title' },
          { n: 4, label: 'Close', note: 'optional, closeLabel', target: '.ds-modal__header .ds-icon-button', at: 'top-end' },
          { n: 5, label: 'Body', note: 'children, scrolls', target: '.ds-modal__body' },
          { n: 6, label: 'Actions', note: 'footer, optional', target: '.ds-modal__footer' },
        ],
      }}
      specs={[
        { label: 'Width', value: 'size.overlay.sm 20rem · md 30rem (default) · lg 40rem, capped to the screen minus space.8' },
        { label: 'Height', value: 'up to the screen height minus space.8; the body scrolls, the title row and the actions stay' },
        { label: 'Narrow screen', value: 'At 768px and narrower the dialog fills the screen' },
        { label: 'Radius', property: 'radius', target: '.ds-modal__panel', token: 'radius.overlay' },
        { label: 'Rung', value: 'shadow.2' },
        { label: 'Motion', value: 'Fade and 16px rise, motion.duration.base; reduced motion keeps the fade' },
        { label: 'Focus', value: 'On open: a data-autofocus element, else the first focusable, else the title. On close: back to the opener' },
      ]}
      api={[
        { label: 'open · onClose', value: 'The parent owns whether the dialog is shown. onClose runs on Escape, the close button and an allowed scrim click.' },
        { label: 'title', value: 'Required. Names the dialog and is the fallback focus target.', control: { kind: 'text', value: 'Edit address' } },
        { label: 'footer', value: 'The actions row. Stays in view while the body scrolls.' },
        { label: 'size', value: '"sm" | "md" | "lg", default "md".', control: { kind: 'select', options: SIZES, value: 'md' } },
        { label: 'role', value: '"dialog" | "alertdialog", default "dialog". AlertDialog and ConfirmationDialog set alertdialog.', control: { kind: 'select', options: ROLES, value: 'dialog' } },
        { label: 'dismissOnScrim', value: 'Close on a scrim click. Default false.' },
        { label: 'closeLabel', value: 'The name of the close button. No label, no button.', control: { kind: 'text', value: 'Close' } },
        { label: 'busy', value: 'The content is loading; the body sets aria-busy.', control: { kind: 'boolean', value: false } },
        { label: 'inline', value: 'Render open in the flow with no scrim and no focus trap, for previews.' },
      ]}
      states={{
        note: 'Each cell shows the modal inline: open, in the flow, without the scrim. The live modals are under Try it.',
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'A dialog opens for a decision, so it has content. With nothing to ask, do not open it.' },
          { id: 'loading', status: 'designed', render: <Modal inline open onClose={noop} title="Shipping options" closeLabel="Close" busy><div role="status"><Text tone="muted">Loading shipping options</Text></div></Modal>, trigger: 'busy', note: 'The body sets aria-busy; the size stays.' },
          { id: 'none', status: 'designed', render: <Modal inline open onClose={noop} title="Saved addresses" closeLabel="Close" footer={<Button>Add an address</Button>}><Text>You have no saved address yet. Add one to speed up checkout.</Text></Modal>, trigger: 'no items', note: 'Say what is missing and offer the next step.' },
          { id: 'one', status: 'n/a', reason: 'A dialog carries one task. A list of one item is the "some" cell.' },
          { id: 'some', status: 'designed', render: <Modal inline open onClose={noop} title="Edit address" closeLabel="Close" footer={cancelSave}><Address /></Modal>, trigger: 'title, body, footer' },
          { id: 'too-many', status: 'designed', label: 'Too many (long body)', render: <Frame height="calc(var(--ds-space-12) * 6)"><Modal inline open onClose={noop} title="Terms of sale" closeLabel="Close" footer={<Button>I have read the terms</Button>}>{longBody}</Modal></Frame>, trigger: 'long children', note: 'Only the body scrolls. The title row and the actions stay in view.' },
          { id: 'incorrect', status: 'designed', render: <Modal inline open onClose={noop} title="Pay by card" closeLabel="Close" footer={<Button>Try again</Button>}><div role="alert" style={{ display: 'flex', gap: 'var(--ds-space-2)', color: 'var(--ds-status-error)' }}><Icon glyph="error" /><Text as="span">The card was declined. Check the number and try again.</Text></div></Modal>, trigger: 'role="alert" message', note: 'Text and icon, announced. The dialog stays open so the user can retry.' },
          { id: 'correct', status: 'n/a', reason: 'A valid entry is confirmed by the field it sits in, not by the dialog.' },
          { id: 'done', status: 'n/a', reason: 'Success closes the dialog. The view behind announces it in a status message.' },
          { id: 'default', status: 'designed', render: <Modal inline open onClose={noop} title="Edit address" closeLabel="Close" size="sm" footer={<Button>Save address</Button>}><Address /></Modal>, trigger: 'size="sm"', note: 'md and lg are wider, up to 40rem.' },
          { id: 'hover', status: 'n/a', reason: 'The panel is not interactive. Its buttons carry their own hover.' },
          { id: 'focus-visible', status: 'designed', render: <Modal inline open onClose={noop} title="Edit address" closeLabel="Close" footer={cancelSave}><Stack gap={2}><Text>Focus starts on the first control.</Text><IconButton label="Close" icon={<Icon glyph="close" />} className="doc-force-focus" /></Stack></Modal>, trigger: ':focus-visible', note: 'Forced by .doc-force-focus on the first control.' },
          { id: 'active', status: 'n/a', reason: 'The panel is not pressable. Its buttons carry their own pressed state.' },
          { id: 'disabled', status: 'designed', render: <Modal inline open onClose={noop} title="Publish page" closeLabel="Close" footer={<Button disabled>Publish page</Button>}><Text>Publishing needs a title. Add one, then publish.</Text></Modal>, trigger: 'disabled action', note: 'The reason sits in the body, next to the disabled action.' },
          { id: 'selected', status: 'n/a', reason: 'A dialog is not a selectable item.' },
        ],
      }}
      extra={[{ title: 'Try it', kicker: 'The real modal: open it with a press, then use Tab, Shift+Tab, Escape.', content: <TryIt /> }]}
      dos={[
        { text: 'Name the dialog with a short title that says the task.', basis: 'WCAG 2.4.6 (AA); APG Dialog (Modal)', },
        { text: 'Use Alert dialog for a message and Confirmation dialog for a yes-or-no question.', basis: 'APG Alert and Message Dialogs' },
        { text: 'Keep long content in the body and let it scroll.', basis: 'WCAG 2.4.11 (AA)' },
      ]}
      donts={[
        { text: 'Build the dialog from a div and a fixed backdrop.', basis: 'APG Dialog (Modal); WCAG 2.1.2 (A)', rule: 'modal.native-element' },
        { text: 'Leave the dialog without a name.', basis: 'WCAG 4.1.2 (A)', rule: 'modal.labelled' },
        { text: 'Open a dialog and leave focus on the page behind.', basis: 'WCAG 2.4.3 (A)', rule: 'modal.focus-in-and-restore' },
        { text: 'Ignore Escape.', basis: 'APG Dialog (Modal)', rule: 'modal.esc-closes' },
        { text: 'Close on a scrim click when the user typed something.', basis: 'Nielsen 5', rule: 'modal.scrim-configurable' },
        { text: 'Let the whole dialog scroll, with the actions off screen.', basis: 'WCAG 2.4.11 (AA)', rule: 'modal.footer-stays' },
        { text: 'Write a colour or px literal in modal.css.', basis: 'misfile.raw-value-in-component', rule: 'modal.no-literal' },
      ]}
      guide="overlays-modal--docs"
      guideName="Modal"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Modal" layer="Component" family="Overlays" rules={modalRules} guide="overlays-modal--docs" guideName="Modal" />,
};

/** A closed trigger and its modal. `build` receives the close function for the actions. */
function ModalDemo({ trigger, build }: { trigger: string; build: (close: () => void) => Omit<ModalProps, 'open' | 'onClose'> }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>{trigger}</Button>
      <Modal open={open} onClose={close} {...build(close)} />
    </>
  );
}

const terms = (
  <Stack gap={3}>
    <Text>The terms apply to every order placed through the shop, whatever the carrier.</Text>
    <Text>Returns are free for 30 days.</Text>
  </Stack>
);

function EditAddress() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const save = () => {
    setOpen(false);
    setStatus('Address saved.');
  };
  return (
    <Stack gap={2} align="start">
      <Button onClick={() => setOpen(true)}>Edit address</Button>
      <Text as="p" role="status">{status}</Text>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit address"
        closeLabel="Close"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save address</Button>
          </>
        }
      >
        <Stack gap={3}>
          <TextField label="Street" defaultValue="12 Rue des Érables" data-autofocus />
          <TextField label="City" defaultValue="Québec" />
        </Stack>
      </Modal>
    </Stack>
  );
}

function AddressForm() {
  const [open, setOpen] = useState(false);
  const [street, setStreet] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const submit = (event: FormEvent) => {
    // Without this, the browser reloads the page.
    event.preventDefault();
    if (street.trim() === '') {
      setError('Enter a street so the courier can find you.');
      return;
    }
    setError('');
    setOpen(false);
    setStatus('Address saved.');
  };
  return (
    <Stack gap={2} align="start">
      <Button onClick={() => setOpen(true)}>Add an address</Button>
      <Text as="p" role="status">{status}</Text>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add an address"
        closeLabel="Close"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="address-form">Save address</Button>
          </>
        }
      >
        <form id="address-form" onSubmit={submit} noValidate>
          <TextField label="Street" value={street} onChange={(event) => setStreet(event.target.value)} error={error} required data-autofocus />
        </form>
      </Modal>
    </Stack>
  );
}

function NoteWithDiscard() {
  const [open, setOpen] = useState(false);
  const [asking, setAsking] = useState(false);
  const [note, setNote] = useState('');
  // Typed work? Ask first. Nothing typed? Close at once.
  const requestClose = () => (note === '' ? setOpen(false) : setAsking(true));
  const discard = () => {
    setAsking(false);
    setOpen(false);
    setNote('');
  };
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Write a note</Button>
      <Modal
        open={open}
        onClose={requestClose}
        title="Delivery note"
        closeLabel="Close"
        footer={
          <>
            <Button variant="secondary" onClick={requestClose}>Cancel</Button>
            <Button onClick={discard}>Save note</Button>
          </>
        }
      >
        <TextField label="Note for the courier" value={note} onChange={(event) => setNote(event.target.value)} data-autofocus />
      </Modal>
      <ConfirmationDialog
        open={asking}
        onClose={() => setAsking(false)}
        onConfirm={discard}
        title="Discard your note?"
        description="What you typed is lost if you close this window."
        confirmLabel="Discard note"
        cancelLabel="Keep writing"
        destructive
      />
    </>
  );
}

/** A save that fails once, then works. */
function FailedSaveModal() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(true);
  const show = () => {
    setError(true);
    setOpen(true);
  };
  const retry = () => {
    // The first retry works. A real save would call your API here.
    setError(false);
    setOpen(false);
  };
  return (
    <>
      <Button variant="secondary" onClick={show}>Open failed save</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit address"
        closeLabel="Close"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={retry}>Try again</Button></>}
      >
        <Stack gap={3}>
          {error && <Banner status="error" urgent>The address could not be saved. Check your connection and try again.</Banner>}
          <TextField label="Street" defaultValue="12 Rue des Érables" data-autofocus />
        </Stack>
      </Modal>
    </>
  );
}

function LoadingModal() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const show = () => {
    setOpen(true);
    setBusy(true);
    window.setTimeout(() => setBusy(false), 2000);
  };
  return (
    <>
      <Button variant="secondary" onClick={show}>Open order details</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Order 4821" closeLabel="Close" busy={busy}>
        {busy ? <Spinner label="Loading order details" showLabel /> : <Text>Shipped on 12 March. 3 items.</Text>}
      </Modal>
    </>
  );
}

function AcceptTerms() {
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Review the terms</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Terms of sale"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Decline</Button>
            <Button disabled={!agreed} onClick={() => setOpen(false)}>Accept terms</Button>
          </>
        }
      >
        <Stack gap={3}>
          {terms}
          <Checkbox label="I have read the terms" description="Accept terms stays off until you check this box." checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
        </Stack>
      </Modal>
    </>
  );
}

const manyTopics = ['Deliveries', 'Billing', 'Returns', 'Gift wrap', 'Customs', 'Insurance', 'Pickup points', 'Holiday hours'];

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Modal"
      layer="Component"
      family="Overlays"
      imports={"import { useState } from 'react';\nimport { Banner, Button, Checkbox, ConfirmationDialog, Modal, Spinner, Stack, Text, TextField } from '@bauhaus/design-system';"}
      intro={[
        'A modal is a small window that stops the user and asks for a few details. The user finishes the task or closes it, then returns to where they were. The page behind it stops responding while it is open.',
        'Pick the right dialog. Use `Modal` for a task with fields. Use `AlertDialog` for a message with one answer. Use `ConfirmationDialog` for a yes-or-no question. For a long form or a multi-step flow, use a page.',
        'You own the state. You pass `open` (true or false) and `onClose` (what to do when the user leaves). The modal never opens or closes itself. Every way out calls `onClose`, and your handler must set `open` to false.',
        'Focus is the place where the keyboard acts now. The focus ring is the outline that shows it. When the modal opens, focus moves inside it. When it closes, focus goes back to the button that opened it. Keyboard users never lose their place.',
        'Escape calls `onClose`. A click on the dark area outside (the scrim) does nothing, unless you set `dismissOnScrim`. The default protects typed work from a stray click.',
        'The modal is a native `<dialog>`. The browser traps focus, blocks the page behind and handles Escape. You write none of that. Other native `dialog` attributes, such as `id` or `data-*`, pass through.',
        'The modal has three parts of its own. The header holds the title and the close button. The body holds your content and scrolls. The footer holds the actions and stays in view.',
      ]}
      guide="overlays-modal--docs"
      guideName="Modal"
      groups={[
        {
          title: 'Start here',
          kicker: 'A small form in a modal, the most common use, and how to choose between the three dialogs.',
          examples: [
            {
              title: 'Edit a record',
              when: 'The user edits one record without leaving the view. Start with this one.',
              explain: [
                '`open` and `onClose` come from your state. The trigger sets `open` to true. Cancel, the close button and Escape all call `onClose`.',
                '`title` names the dialog for screen readers and sits at the top as a heading (WCAG 4.1.2, A). Say what the task is: "Edit address".',
                '`closeLabel` draws the close button and gives it a name. Without it, no close button is drawn. Translate it with the rest of your texts.',
                '`footer` holds the actions. It stays in view while the body scrolls, so the user never has to hunt for Save (WCAG 2.4.11, AA).',
                'Put the main action last and the way out first. `data-autofocus` on the first field puts the keyboard there when the modal opens.',
                'The status line uses `role="status"`. A screen reader announces "Address saved." after the modal closes (WCAG 4.1.3, AA).',
              ],
              render: <EditAddress />,
              code: `function Example() {
  // You own the state. The modal only reads it.
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');

  const save = () => {
    saveAddress(); // your save call
    setOpen(false);
    setStatus('Address saved.');
  };

  return (
    <Stack gap={2} align="start">
      {/* The trigger. Focus returns here when the modal closes. */}
      <Button onClick={() => setOpen(true)}>Edit address</Button>
      {/* role="status": a screen reader announces the new text. */}
      <Text as="p" role="status">{status}</Text>

      <Modal
        open={open}
        // Runs on Escape, on the close button and on Cancel. It must close the modal.
        onClose={() => setOpen(false)}
        // Names the dialog. Say the task.
        title="Edit address"
        // Draws the close button. Without it, none is drawn.
        closeLabel="Close"
        // Stays in view when the body scrolls. Way out first, main action last.
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save address</Button>
          </>
        }
      >
        <Stack gap={3}>
          {/* data-autofocus: focus starts here, not on the close button. */}
          <TextField label="Street" defaultValue="12 Rue des Érables" data-autofocus />
          <TextField label="City" defaultValue="Québec" />
        </Stack>
      </Modal>
    </Stack>
  );
}`,
            },
            {
              title: 'Choose between the three dialogs',
              when: 'You are not sure whether a task needs a modal, an alert dialog or a confirmation dialog.',
              explain: [
                'Ask what the user must do. Fill in fields: `Modal`. Read one message: `AlertDialog`. Choose between two answers: `ConfirmationDialog`.',
                '`AlertDialog` and `ConfirmationDialog` are built on `Modal`. They add the alert role, the description link and the focus rule. Use them instead of building your own (Nielsen heuristic 4, consistency and standards).',
                'For a hint, use a tooltip. For a list of actions, use a menu. For news that needs no answer, use a toast or a banner. A dialog that interrupts for information costs attention (Nielsen heuristic 8, aesthetic and minimalist design).',
              ],
              code: `// A task with fields: you build the content and the actions.
<Modal open={open} onClose={close} title="Edit address" footer={<Button onClick={save}>Save address</Button>}>
  <TextField label="Street" />
</Modal>

// One answer: "I have read this".
<AlertDialog open={open} onClose={close} title="Session expired" description="..." actionLabel="Sign in again" />

// Two answers: confirm or cancel.
<ConfirmationDialog open={open} onClose={close} onConfirm={remove} title="Delete this project?" description="..." confirmLabel="Delete project" cancelLabel="Cancel" destructive />`,
            },
            {
              title: 'Where focus starts',
              when: 'The user should type at once, so focus must land on the first field.',
              explain: [
                'On open, focus goes to the element with `data-autofocus`. If none has it, focus goes to the first focusable element. If there is none, it goes to the title.',
                'With `closeLabel` set, the close button comes first in the page order. Without `data-autofocus`, focus would land on it, and the user would have to press Tab to reach the field.',
                'Put `data-autofocus` on one element only. Pick the control the user needs first (WCAG 2.4.3, A).',
                'When the modal closes, focus goes back to the element that had it before. A keyboard user who pressed Edit address lands on Edit address again.',
              ],
              render: <ModalDemo trigger="Open the note" build={() => ({ title: 'Delivery note', closeLabel: 'Close', children: <TextField label="Note for the courier" data-autofocus /> })} />,
              code: `<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delivery note"
  closeLabel="Close"
>
  {/* Any element can carry data-autofocus: a field, a button, a link. */}
  <TextField label="Note for the courier" data-autofocus />
</Modal>`,
            },
          ],
        },
        {
          title: 'Ways out',
          kicker: 'Every way out calls onClose. Give the user at least one visible way out.',
          examples: [
            {
              title: 'Close button',
              when: 'The content is read-only and needs no action.',
              explain: [
                '`closeLabel` draws a close button at the top and names it. The label is also its accessible name, so write it for screen readers: "Close".',
                'Without `footer` and without `closeLabel`, the only way out is Escape. Not every user knows that, so always add one of the two.',
                'The button calls `onClose`, the same as Escape (APG Dialog (Modal)).',
              ],
              render: <ModalDemo trigger="Open details" build={() => ({ title: 'Parcel details', closeLabel: 'Close', children: <Text>Weight 2.4 kg. Insured up to 500 CAD.</Text> })} />,
              code: `<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Parcel details"
  // Draws the close button and names it.
  closeLabel="Close"
>
  <Text>Weight 2.4 kg. Insured up to 500 CAD.</Text>
</Modal>`,
            },
            {
              title: 'Actions only',
              when: 'The footer holds the way out, so a close button is not needed.',
              explain: [
                'The footer button calls the same `onClose`. Here "Done" is the way out, so there is no close button.',
                'Escape still closes the modal. Your `onClose` handles it with no extra code.',
                'Name the button for what it does. "Done" fits a notice. "Save address" fits a form.',
              ],
              render: <ModalDemo trigger="Open notice" build={(close) => ({ title: 'Delivery window', children: <Text>Your parcel arrives between 9:00 and 12:00.</Text>, footer: <Button onClick={close}>Done</Button> })} />,
              code: `<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delivery window"
  // The footer is the way out. No closeLabel needed.
  footer={<Button onClick={() => setOpen(false)}>Done</Button>}
>
  <Text>Your parcel arrives between 9:00 and 12:00.</Text>
</Modal>`,
            },
            {
              title: 'Scrim closes it',
              when: 'The content holds no typed work, so a click outside the dialog may close it.',
              explain: [
                'The scrim is the dark area behind the dialog. `dismissOnScrim` makes a click on it call `onClose`.',
                'It is off by default. A stray click on the scrim would lose typed work (Nielsen heuristic 5, error prevention).',
                'Turn it on for reading content, such as terms. Leave it off for forms.',
                'Keep a visible way out too. Not every user can click outside, so the button and Escape remain.',
              ],
              render: <ModalDemo trigger="Terms (scrim closes)" build={(close) => ({ title: 'Terms of sale', dismissOnScrim: true, closeLabel: 'Close', children: terms, footer: <Button onClick={close}>I have read the terms</Button> })} />,
              code: `<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Terms of sale"
  // A click on the dark area calls onClose. Off by default.
  dismissOnScrim
  closeLabel="Close"
  footer={<Button onClick={() => setOpen(false)}>I have read the terms</Button>}
>
  <Text>The terms apply to every order placed through the shop, whatever the carrier.</Text>
  <Text>Returns are free for 30 days.</Text>
</Modal>`,
            },
            {
              title: 'Ask before losing typed work',
              when: 'The form holds typed text, and a close would throw it away.',
              explain: [
                '`onClose` is your function, so it can decide. If the note is empty, close at once. If not, open a `ConfirmationDialog`.',
                'The confirmation sits beside the modal, not inside it. Both are native dialogs, and the newest one shows on top.',
                'Escape, Cancel and the close button all go through `requestClose`, so no way out skips the question (Nielsen heuristic 5, error prevention).',
                'After the user answers, focus returns to the element that had it before the confirmation opened.',
              ],
              render: <NoteWithDiscard />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const [asking, setAsking] = useState(false);
  const [note, setNote] = useState('');

  // Typed work? Ask first. Nothing typed? Close at once.
  const requestClose = () => (note === '' ? setOpen(false) : setAsking(true));

  const discard = () => {
    setAsking(false);
    setOpen(false);
    setNote('');
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Write a note</Button>
      <Modal
        open={open}
        // Escape, the close button and Cancel all use the same check.
        onClose={requestClose}
        title="Delivery note"
        closeLabel="Close"
        footer={
          <>
            <Button variant="secondary" onClick={requestClose}>Cancel</Button>
            <Button onClick={discard}>Save note</Button>
          </>
        }
      >
        <TextField label="Note for the courier" value={note} onChange={(event) => setNote(event.target.value)} data-autofocus />
      </Modal>

      {/* A sibling, not a child. It opens on top of the modal. */}
      <ConfirmationDialog
        open={asking}
        onClose={() => setAsking(false)}
        onConfirm={discard}
        title="Discard your note?"
        description="What you typed is lost if you close this window."
        confirmLabel="Discard note"
        cancelLabel="Keep writing"
        destructive
      />
    </>
  );
}`,
            },
          ],
        },
        {
          title: 'Sizes',
          kicker: 'The size sets the maximum inline size: 20, 30 and 40 rem. The default is md.',
          examples: SIZES.map((size) => ({
            title: { sm: 'Small', md: 'Medium', lg: 'Large' }[size],
            when: { sm: 'A short question or one field.', md: 'The default, for a small form.', lg: 'A wide body, such as a table or a long text.' }[size],
            explain: [
              {
                sm: '`size="sm"` caps the width at 20 rem (about 320px). Less width keeps the eye on one short task.',
                md: '`size="md"` is the default (30 rem). You can leave the prop out.',
                lg: '`size="lg"` caps the width at 40 rem. Use it for content that needs width, such as a table.',
              }[size],
              'The size is a maximum. On a phone, the modal fills the screen whatever the size (WCAG 1.4.10, AA).',
            ],
            render: <ModalDemo trigger={`Open ${size}`} build={(close) => ({ title: 'Delivery notes', size, closeLabel: 'Close', children: <Text>Leave the parcel at the side door.</Text>, footer: <Button onClick={close}>Done</Button> })} />,
            code: `<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delivery notes"
  // ${{ sm: '20rem wide at most.', md: '30rem wide at most. This is the default.', lg: '40rem wide at most.' }[size]}
  size="${size}"
  closeLabel="Close"
  footer={<Button onClick={() => setOpen(false)}>Done</Button>}
>
  <Text>Leave the parcel at the side door.</Text>
</Modal>`,
          })),
        },
        {
          title: 'Forms and actions',
          kicker: 'The footer sits outside the body, so form wiring and disabled actions need a little care.',
          examples: [
            {
              title: 'Submit with the Enter key',
              when: 'The modal holds a real form, and the user may press Enter to submit.',
              explain: [
                'The footer is outside the `<form>`, so a plain button there would not submit it. `form="address-form"` links the button to the form by id.',
                '`type="submit"` makes the button submit. A `Button` defaults to `type="button"`, so you must say it.',
                'Enter inside the field now submits the form too, with no extra code. `event.preventDefault()` stops the browser from reloading the page.',
                '`error` on the field shows what is wrong and how to fix it. The message names the fix, not only the fault (Nielsen heuristic 9, help users recover from errors; WCAG 3.3.1, A).',
                'The modal stays open on error, so the user can correct the text and try again.',
              ],
              render: <AddressForm />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const [street, setStreet] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    // Without this, the browser reloads the page.
    event.preventDefault();
    if (street.trim() === '') {
      setError('Enter a street so the courier can find you.');
      return; // the modal stays open
    }
    setError('');
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add an address</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add an address"
        closeLabel="Close"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            {/* The footer is outside the form: form="..." links the button to it. */}
            <Button type="submit" form="address-form">Save address</Button>
          </>
        }
      >
        {/* noValidate: you show the error yourself, in the design system's style. */}
        <form id="address-form" onSubmit={submit} noValidate>
          <TextField label="Street" value={street} onChange={(event) => setStreet(event.target.value)} error={error} required data-autofocus />
        </form>
      </Modal>
    </>
  );
}`,
            },
            {
              title: 'Disabled action with its reason',
              when: 'The user must do something before the action works, such as accept terms.',
              explain: [
                '`disabled` keeps "Accept terms" off until the box is checked.',
                'The reason sits in the body, next to the action: "Accept terms stays off until you check this box". A disabled button alone does not tell users why (Nielsen heuristic 1, visibility of system status).',
                'The other button, "Decline", stays on, so the user always has a way out.',
              ],
              render: <AcceptTerms />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Review the terms</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Terms of sale"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Decline</Button>
            {/* Off until the box is checked. */}
            <Button disabled={!agreed} onClick={() => setOpen(false)}>Accept terms</Button>
          </>
        }
      >
        <Stack gap={3}>
          <Text>The terms apply to every order placed through the shop, whatever the carrier.</Text>
          <Text>Returns are free for 30 days.</Text>
          {/* The description gives the reason the button is off. */}
          <Checkbox
            label="I have read the terms"
            description="Accept terms stays off until you check this box."
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />
        </Stack>
      </Modal>
    </>
  );
}`,
            },
          ],
        },
        {
          title: 'States',
          examples: [
            {
              title: 'Loading',
              when: 'The body waits for data. The panel keeps its size, and the body is marked busy.',
              explain: [
                '`busy` sets `aria-busy` on the body. It tells assistive technology that the content is not ready.',
                'The `Spinner` has a `label`, so a screen reader announces "Loading order details". `showLabel` shows the same words to sighted users (WCAG 4.1.3, AA).',
                'Open the modal at once and show the spinner inside. This is faster to the eye than waiting for data before opening.',
                'Set `busy` back to false when the data arrives, and show the content in place of the spinner.',
              ],
              render: <LoadingModal />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const show = async () => {
    setOpen(true);
    setBusy(true);
    await loadOrder(); // your request
    setBusy(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={show}>Open order details</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Order 4821" closeLabel="Close" busy={busy}>
        {/* The label is read out. showLabel also shows it. */}
        {busy ? <Spinner label="Loading order details" showLabel /> : <Text>Shipped on 12 March. 3 items.</Text>}
      </Modal>
    </>
  );
}`,
            },
            {
              title: 'Error that keeps it open',
              when: 'A save fails. The message says what failed, and the user can retry.',
              explain: [
                'Do not close the modal on failure. The user would lose the typed text and the context.',
                '`Banner` with `status="error"` and `urgent` gets `role="alert"`, so screen readers announce it at once and the failure is not missed (WCAG 4.1.3, AA). `urgent` alone does nothing on other statuses.',
                'The message says what failed and what to do: "Check your connection and try again".',
                'The button says "Try again", so the user knows pressing it repeats the save.',
              ],
              render: <FailedSaveModal />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const save = async () => {
    try {
      await saveAddress(); // your request
      setError(false);
      setOpen(false);
    } catch {
      setError(true); // the modal stays open
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Open failed save</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit address"
        closeLabel="Close"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{error ? 'Try again' : 'Save address'}</Button>
          </>
        }
      >
        <Stack gap={3}>
          {/* urgent: a screen reader announces it at once. */}
          {error && <Banner status="error" urgent>The address could not be saved. Check your connection and try again.</Banner>}
          <TextField label="Street" defaultValue="12 Rue des Érables" data-autofocus />
        </Stack>
      </Modal>
    </>
  );
}`,
            },
            {
              title: 'Long content',
              when: 'The body runs past the screen.',
              explain: [
                'Only the body scrolls. The title row and the footer stay in view, so the actions are always reachable (WCAG 2.4.11, AA).',
                'The page behind does not scroll. The user cannot lose their place there.',
                'Browsers let a keyboard user focus a scrolling area, so Tab then the arrow keys scroll the body. You add no code for it.',
                'If a modal needs this much scrolling, ask whether a page would serve better.',
              ],
              render: <ModalDemo trigger="Open the full terms" build={(close) => ({ title: 'Terms of sale', size: 'lg', closeLabel: 'Close', children: <Stack gap={3}>{manyTopics.map((topic) => <Text key={topic}>{`${topic}: the terms apply to every order placed through the shop, whatever the carrier. Read them before you pay.`}</Text>)}</Stack>, footer: <Button onClick={close}>I have read the terms</Button> })} />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const manyTopics = ['Deliveries', 'Billing', 'Returns', 'Gift wrap', 'Customs', 'Insurance', 'Pickup points', 'Holiday hours'];

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Open the full terms</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Terms of sale"
        size="lg"
        closeLabel="Close"
        // The footer stays in view while the body scrolls.
        footer={<Button onClick={() => setOpen(false)}>I have read the terms</Button>}
      >
        <Stack gap={3}>
          {manyTopics.map((topic) => (
            <Text key={topic}>{\`\${topic}: the terms apply to every order placed through the shop, whatever the carrier. Read them before you pay.\`}</Text>
          ))}
        </Stack>
      </Modal>
    </>
  );
}`,
            },
          ],
        },
        {
          title: 'Small screens and translations',
          examples: [
            {
              title: 'On a phone',
              when: 'At 768px and narrower the dialog fills the screen.',
              frame: 'phone',
              explain: [
                'Below 768px the modal fills the screen. A small floating window would leave too little room for the content.',
                'Nothing needs a horizontal scroll, even at 320px width (WCAG 1.4.10 Reflow, AA).',
                'You write no media query. The modal handles it.',
                'The footer buttons wrap if they do not fit side by side.',
              ],
              render: <ModalDemo trigger="Edit address" build={(close) => ({ title: 'Edit address', closeLabel: 'Close', children: <TextField label="Street" defaultValue="12 Rue des Érables" />, footer: <><Button variant="secondary" onClick={close}>Cancel</Button><Button onClick={close}>Save address</Button></> })} />,
              code: `// The same code as on a desktop. The modal adapts by itself.
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Edit address"
  closeLabel="Close"
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={() => setOpen(false)}>Save address</Button>
    </>
  }
>
  <TextField label="Street" defaultValue="12 Rue des Érables" />
</Modal>`,
            },
            {
              title: 'Translated texts',
              when: 'The app is translated, so every text arrives as a prop.',
              frame: 'phone',
              explain: [
                'The modal holds no text of its own. `title`, `closeLabel` and the footer labels all come from you.',
                'Translate `closeLabel` too. A screen reader reads it, so an English "Close" in a French page confuses the user.',
                'Translated text is often 30 to 40% longer. Test with your longest language.',
              ],
              render: <ModalDemo trigger="Modifier l’adresse" build={(close) => ({ title: 'Modifier l’adresse', closeLabel: 'Fermer', children: <TextField label="Rue" defaultValue="12 Rue des Érables" />, footer: <><Button variant="secondary" onClick={close}>Annuler</Button><Button onClick={close}>Enregistrer l’adresse</Button></> })} />,
              code: `<Modal
  open={open}
  onClose={() => setOpen(false)}
  // In a real app these come from your i18n tool: t('address.edit.title').
  title="Modifier l’adresse"
  closeLabel="Fermer"
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Annuler</Button>
      <Button onClick={() => setOpen(false)}>Enregistrer l’adresse</Button>
    </>
  }
>
  <TextField label="Rue" defaultValue="12 Rue des Érables" />
</Modal>`,
            },
          ],
        },
        {
          title: 'In the flow',
          examples: [
            {
              title: 'Inline',
              when: 'A preview or an embedded panel draws the open dialog in the flow, with no scrim and no focus trap.',
              explain: [
                '`inline` draws the modal open, where you put it. There is no scrim, no focus trap and no focus move.',
                'Use it for documentation and previews. Do not use it to build a real modal: the page behind stays usable.',
                '`inline` ignores `open`: the modal always shows open. The type still requires the prop, so pass `open`. The title, the body and the footer look the same as in the live modal.',
              ],
              render: <Modal inline open onClose={noop} title="Edit address" closeLabel="Close" footer={cancelSave}><Address /></Modal>,
              code: `<Modal
  // Draw it in the page flow. No scrim, no focus trap, no focus move.
  inline
  open
  onClose={() => {}}
  title="Edit address"
  closeLabel="Close"
  footer={
    <>
      <Button variant="secondary">Cancel</Button>
      <Button>Save address</Button>
    </>
  }
>
  <Stack gap={3}>
    <Text>Deliveries go to this address.</Text>
    <Text tone="muted" variant="caption">12 Rue des Érables, Québec QC G1R 2K4</Text>
  </Stack>
</Modal>`,
            },
          ],
        },
      ]}
    />
  ),
};
