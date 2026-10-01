import { useState } from 'react';
import type { ReactNode } from 'react';
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

/** A trigger and its modal, closed until the user presses the trigger. `build` receives the close function for the actions. */
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
          <TextField label="Street" defaultValue="12 Rue des Érables" />
          <TextField label="City" defaultValue="Québec" />
        </Stack>
      </Modal>
    </Stack>
  );
}

/** A save that fails once more, then works. "Try again" keeps the dialog open until the save works. */
function FailedSaveModal() {
  const [open, setOpen] = useState(false);
  const [tries, setTries] = useState(0);
  const retry = () => {
    if (tries >= 1) {
      setOpen(false);
      return;
    }
    setTries(tries + 1);
  };
  const show = () => {
    setTries(0);
    setOpen(true);
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
          <Banner status="error" urgent>The address could not be saved. Check your connection and try again.</Banner>
          <TextField label="Street" defaultValue="12 Rue des Érables" />
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
      imports="import { useState } from 'react'; import { Banner, Button, Checkbox, Modal, Spinner, Stack, Text, TextField } from '@acme/design-system';"
      guide="overlays-modal--docs"
      guideName="Modal"
      groups={[
        {
          title: 'A task in context',
          kicker: 'The parent owns open. Escape, the close button and the actions all call onClose.',
          examples: [
            {
              title: 'Edit a record',
              when: 'The user edits one record without leaving the view.',
              render: <EditAddress />,
              code: `function Example() {
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
          <TextField label="Street" defaultValue="12 Rue des Érables" />
          <TextField label="City" defaultValue="Québec" />
        </Stack>
      </Modal>
    </Stack>
  );
}`,
            },
            {
              title: 'Terms that need a reply',
              when: 'The user must accept or decline before going on. The accept action stays off until the box is checked.',
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
            <Button disabled={!agreed} onClick={() => setOpen(false)}>Accept terms</Button>
          </>
        }
      >
        <Stack gap={3}>
          <Text>The terms apply to every order placed through the shop, whatever the carrier.</Text>
          <Text>Returns are free for 30 days.</Text>
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
          title: 'Sizes',
          kicker: 'The size sets the maximum inline size: 20, 30 and 40 rem. The default is md.',
          examples: SIZES.map((size) => ({
            title: { sm: 'Small', md: 'Medium', lg: 'Large' }[size],
            when: { sm: 'A short question or one field.', md: 'The default, for a small form.', lg: 'A wide body, such as a table or a long text.' }[size],
            render: <ModalDemo trigger={`Open ${size}`} build={(close) => ({ title: 'Delivery notes', size, closeLabel: 'Close', children: <Text>Leave the parcel at the side door.</Text>, footer: <Button onClick={close}>Done</Button> })} />,
            code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Open ${size}</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delivery notes"
        size="${size}"
        closeLabel="Close"
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        <Text>Leave the parcel at the side door.</Text>
      </Modal>
    </>
  );
}`,
          })),
        },
        {
          title: 'Ways out',
          examples: [
            {
              title: 'Close button',
              when: 'The content is read-only and needs no action. The close label names the button.',
              render: <ModalDemo trigger="Open details" build={() => ({ title: 'Parcel details', closeLabel: 'Close', children: <Text>Weight 2.4 kg. Insured up to 500 CAD.</Text> })} />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Open details</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Parcel details" closeLabel="Close">
        <Text>Weight 2.4 kg. Insured up to 500 CAD.</Text>
      </Modal>
    </>
  );
}`,
            },
            {
              title: 'Actions only',
              when: 'The footer holds the way out, so no close button is needed. Escape still closes it.',
              render: <ModalDemo trigger="Open notice" build={(close) => ({ title: 'Delivery window', children: <Text>Your parcel arrives between 9:00 and 12:00.</Text>, footer: <Button onClick={close}>Done</Button> })} />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Open notice</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delivery window"
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        <Text>Your parcel arrives between 9:00 and 12:00.</Text>
      </Modal>
    </>
  );
}`,
            },
            {
              title: 'Scrim closes it',
              when: 'The content holds no typed work, so a click outside the dialog may close it.',
              render: <ModalDemo trigger="Terms (scrim closes)" build={(close) => ({ title: 'Terms of sale', dismissOnScrim: true, closeLabel: 'Close', children: terms, footer: <Button onClick={close}>I have read the terms</Button> })} />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Terms (scrim closes)</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Terms of sale"
        dismissOnScrim
        closeLabel="Close"
        footer={<Button onClick={() => setOpen(false)}>I have read the terms</Button>}
      >
        <Text>The terms apply to every order placed through the shop, whatever the carrier.</Text>
        <Text>Returns are free for 30 days.</Text>
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
              render: <LoadingModal />,
              code: `function Example() {
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
}`,
            },
            {
              title: 'Error that keeps it open',
              when: 'A save fails. The message says what failed, and the user can retry.',
              render: <FailedSaveModal />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(true);
  const save = async () => {
    try {
      await saveAddress();
      setError(false);
      setOpen(false);
    } catch {
      setError(true); // the dialog stays open
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
            <Button onClick={save}>Try again</Button>
          </>
        }
      >
        <Stack gap={3}>
          {error && <Banner status="error" urgent>The address could not be saved. Check your connection and try again.</Banner>}
          <TextField label="Street" defaultValue="12 Rue des Érables" />
        </Stack>
      </Modal>
    </>
  );
}`,
            },
            {
              title: 'Long content',
              when: 'The body runs past the screen. Only the body scrolls; the title row and the actions stay in view.',
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
            {
              title: 'On a phone',
              when: 'At 768px and narrower the dialog fills the screen, so nothing needs a horizontal scroll.',
              frame: 'phone',
              render: <ModalDemo trigger="Edit address" build={(close) => ({ title: 'Edit address', closeLabel: 'Close', children: <TextField label="Street" defaultValue="12 Rue des Érables" />, footer: <><Button variant="secondary" onClick={close}>Cancel</Button><Button onClick={close}>Save address</Button></> })} />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Edit address</Button>
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
      </Modal>
    </>
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
              when: 'A preview or an embedded panel draws the open dialog in the flow, with no scrim and no focus trap.',
              render: <Modal inline open onClose={noop} title="Edit address" closeLabel="Close" footer={cancelSave}><Address /></Modal>,
              code: `<Modal
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
