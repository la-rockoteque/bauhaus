import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import type { ModalSize } from '../modal/modal';
import { CriticalConfirmationDialog, type CriticalConfirmationDialogProps } from './critical-confirmation-dialog';
import { criticalConfirmationDialogRules } from './critical-confirmation-dialog.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Overlays/Critical confirmation dialog', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const noop = () => {};
const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly ModalSize[];

const project = {
  title: 'Delete project?',
  description: 'This permanently deletes Apollo, its 3 repositories and 128 files. It cannot be recovered.',
  confirmLabel: 'Delete project',
  cancelLabel: 'Cancel',
  confirmText: 'Apollo',
  fieldLabel: 'Type Apollo to confirm',
  fieldDescription: 'The Delete project button stays disabled until the name matches exactly.',
};

function TryIt() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Delete project</Button>
      <CriticalConfirmationDialog open={open} onClose={() => setOpen(false)} onConfirm={() => setOpen(false)} {...project} />
    </>
  );
}

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Critical confirmation dialog"
      layer="Component"
      family="Overlays"
      plain="A critical confirmation dialog stops the user before an action that cannot be undone and that also removes other things. To go on, the user types the name of the thing they are about to delete."
      precise="Component in the overlays family · an alert dialog with a text field, a danger confirm and a cancel action, built on Modal · only for an irreversible action that cascades; otherwise use Confirmation dialog."
      usedFor="Deleting a project with its repositories, removing a team with its boards, closing an account with its data."
      tokens={{
        mode: 'consumed',
        note: 'The critical confirmation dialog has no stylesheet of its own. Every value comes from Modal, TextField, Banner and Button.',
        rows: [
          { name: 'overlay.surface · overlay.border · scrim · shadow.2', tier: 'role', use: 'The panel and the wash, from Modal', swatch: '--ds-overlay-surface' },
          { name: 'text.default', tier: 'role', use: 'Title and cost', swatch: '--ds-text-default' },
          { name: 'action.danger · action.secondary', tier: 'role', use: 'The confirm and the cancel buttons', swatch: '--ds-action-danger' },
          { name: 'field.*', tier: 'role', use: 'The text field, from TextField', swatch: '--ds-field-border' },
          { name: 'status.error-*', tier: 'role', use: 'The failure alert, from Banner', swatch: '--ds-status-error' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus ring on the field and the buttons', swatch: '--ds-focus-ring-color' },
          { name: 'size.overlay.sm · md · lg', tier: '2', use: 'Maximum inline size, from Modal' },
        ],
      }}
      stage={{
        render: (args) => (
          <CriticalConfirmationDialog
            inline
            open
            onClose={noop}
            onConfirm={noop}
            title={String(args.title)}
            description={String(args.description)}
            confirmLabel={String(args.confirmLabel)}
            cancelLabel={String(args.cancelLabel)}
            confirmText={String(args.confirmText)}
            fieldLabel={String(args.fieldLabel)}
            fieldDescription={project.fieldDescription}
            loading={args.loading === true}
            size={args.size as ModalSize}
          />
        ),
        parts: [
          { n: 1, label: 'Title', note: 'required, the question', target: '.ds-modal__title' },
          { n: 2, label: 'Cost', note: 'required, what goes and what goes with it', target: '.ds-modal__body p' },
          { n: 3, label: 'Text field', note: 'required, type confirmText', target: '.ds-text-field', at: 'bottom-start' },
          { n: 4, label: 'Confirm', note: 'required, danger, disabled until the value matches', target: '.ds-modal__footer .ds-button--danger', at: 'end' },
          { n: 5, label: 'Cancel', note: 'required, cancelLabel', target: '.ds-modal__footer .ds-button--secondary' },
        ],
      }}
      specs={[
        { label: 'Role', value: 'alertdialog, described by the cost' },
        { label: 'Focus', value: 'On the text field, because the user must type first' },
        { label: 'Order', value: 'Danger confirm, then Cancel' },
        { label: 'Match', value: 'Exact: case and spaces count. Enter confirms only on a match' },
        { label: 'Escape and scrim', value: 'Escape cancels. The scrim does not close it. Both are off while loading' },
        { label: 'Layout', value: 'From Modal: sizes, the narrow full screen, the motion' },
      ]}
      api={[
        { label: 'open · onClose', value: 'The parent owns whether it is shown. onClose runs on Cancel and on Escape, and not while loading.' },
        { label: 'onConfirm', value: 'Runs on the confirm button and on Enter, only when the typed value equals confirmText.' },
        { label: 'title', value: 'Required. The question.', control: { kind: 'text', value: project.title } },
        { label: 'description', value: 'Required. The cost: what goes, how much, and what else goes with it.', control: { kind: 'text', value: project.description } },
        { label: 'confirmLabel', value: 'Required. Names the action and its object: "Delete project".', control: { kind: 'text', value: project.confirmLabel } },
        { label: 'cancelLabel', value: 'Required. The label of the cancel action.', control: { kind: 'text', value: project.cancelLabel } },
        { label: 'confirmText', value: 'Required. The exact text to type.', control: { kind: 'text', value: project.confirmText } },
        { label: 'fieldLabel · fieldDescription', value: 'Required. The label asks for the name. The description says why the confirm is disabled.', control: { kind: 'text', value: project.fieldLabel } },
        { label: 'loading', value: 'The action is running. The confirm keeps its label and width, aria-busy is set, Cancel and Escape are off.', control: { kind: 'boolean', value: false } },
        { label: 'error', value: 'The action failed. An alert shows above the cost. The dialog stays open and the typed value stays.' },
        { label: 'defaultValue', value: 'The typed value at the start, and after the dialog reopens. Empty by default.' },
        { label: 'size', value: 'Passed to Modal.', control: { kind: 'select', options: SIZES, value: 'md' } },
        { label: 'inline', value: 'Passed to Modal.' },
      ]}
      states={{
        note: 'Each cell shows the dialog inline: open, in the flow, without the scrim. The live dialog is under Try it.',
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'The dialog opens with its question, or not at all.' },
          { id: 'loading', status: 'designed', render: <CriticalConfirmationDialog inline open onClose={noop} onConfirm={noop} {...project} defaultValue="Apollo" loading />, trigger: 'loading', note: 'The confirm keeps its label and width. Cancel is off.' },
          { id: 'none', status: 'n/a', reason: 'The dialog holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'The dialog holds no collection.' },
          { id: 'some', status: 'designed', render: <CriticalConfirmationDialog inline open onClose={noop} onConfirm={noop} {...project} />, trigger: 'title, cost, labels, confirmText' },
          { id: 'too-many', status: 'designed', label: 'Too many (long cost)', render: <CriticalConfirmationDialog inline open onClose={noop} onConfirm={noop} {...project} description="This permanently deletes Apollo, its 3 repositories, 128 files, 12 comments, 4 deploy keys and every share link. People who open an old link see a page that says the project was deleted. Billing for the project stops today. Nobody can recover any of it." />, trigger: 'long description', note: 'The cost wraps. Only the body scrolls when it runs out of room.' },
          { id: 'incorrect', status: 'designed', label: 'Incorrect (the action failed)', render: <CriticalConfirmationDialog inline open onClose={noop} onConfirm={noop} {...project} defaultValue="Apollo" error="We could not delete the project. Nothing was deleted. Press Delete project to try again." />, trigger: 'error', note: 'An alert says nothing was deleted. The dialog stays open and the typed value stays.' },
          { id: 'correct', status: 'designed', render: <CriticalConfirmationDialog inline open onClose={noop} onConfirm={noop} {...project} defaultValue="Apollo" />, trigger: 'typed value equals confirmText', note: 'The confirm turns on.' },
          { id: 'done', status: 'n/a', reason: 'Confirm closes the dialog. The view behind announces the result in a status message.' },
          { id: 'default', status: 'designed', render: <CriticalConfirmationDialog inline open onClose={noop} onConfirm={noop} {...project} />, trigger: 'rest', note: 'Focus starts on the text field. The confirm is off. The field description says why.' },
          { id: 'hover', status: 'n/a', reason: 'The panel is not interactive. Its buttons carry their own hover.' },
          { id: 'focus-visible', status: 'n/a', reason: 'Its field and buttons carry the focus ring; see TextField and Button.' },
          { id: 'active', status: 'n/a', reason: 'The panel is not pressable. Its buttons carry their own pressed state.' },
          { id: 'disabled', status: 'designed', label: 'Disabled (confirm, until the value matches)', render: <CriticalConfirmationDialog inline open onClose={noop} onConfirm={noop} {...project} defaultValue="apollo" />, trigger: 'typed value differs from confirmText', note: 'The field description gives the reason.' },
          { id: 'selected', status: 'n/a', reason: 'A dialog is not a selectable item.' },
        ],
      }}
      extra={[{ title: 'Try it', kicker: 'The real dialog: open it, type the name, then use Tab, Enter and Escape.', content: <TryIt /> }]}
      dos={[
        { text: 'Keep it for an action that cannot be undone and that removes other resources too.', basis: 'GitLab Pajamas', rule: 'critical-confirmation-dialog.only-critical' },
        { text: 'Name what goes, how much, and what goes with it.', basis: 'NN/g, be specific', rule: 'critical-confirmation-dialog.cost-named' },
        { text: 'Say in the field description why the confirm is disabled.', basis: 'Nielsen 1, visibility of system status' },
        { text: 'Name the confirm by its verb and object: "Delete project".', basis: 'WCAG 2.4.6 (AA)' },
      ]}
      donts={[
        { text: 'Use it for an action that is not critical.', basis: 'GitLab Pajamas', rule: 'critical-confirmation-dialog.only-critical' },
        { text: 'Enable the confirm before the typed name matches.', basis: 'WCAG 3.3.4 (AA)', rule: 'critical-confirmation-dialog.type-to-confirm' },
        { text: 'Let Enter confirm a wrong value.', basis: 'WCAG 3.3.4 (AA)', rule: 'critical-confirmation-dialog.enter-guarded' },
        { text: 'Mark the confirm with red alone, or label it "OK".', basis: 'WCAG 1.4.1 (A), 2.4.6 (AA)', rule: 'critical-confirmation-dialog.cost-named' },
        { text: 'Build it from a div, or from a Modal with its own field and buttons.', basis: 'Nielsen 4', rule: 'critical-confirmation-dialog.built-on-modal' },
      ]}
      guide="overlays-critical-confirmation-dialog--docs"
      guideName="Critical confirmation dialog"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Critical confirmation dialog" layer="Component" family="Overlays" rules={criticalConfirmationDialogRules} guide="overlays-critical-confirmation-dialog--docs" guideName="Critical confirmation dialog" />,
};

type CriticalCopy = Omit<CriticalConfirmationDialogProps, 'open' | 'onClose' | 'onConfirm'>;

/** A closed trigger, the dialog and a status line that shows which answer the user gave. */
function CriticalDemo({ trigger, result, ...copy }: CriticalCopy & { trigger: string; result: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  return (
    <Stack gap={2} align="start">
      <Button variant="secondary" onClick={() => setOpen(true)}>{trigger}</Button>
      <Text as="p" role="status">{status}</Text>
      <CriticalConfirmationDialog
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

/** The request runs while the dialog is open. A rejection keeps the dialog open and shows the error. */
function SlowDelete({ fail = false }: { fail?: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const remove = () => {
    setLoading(true);
    setError('');
    window.setTimeout(() => {
      setLoading(false);
      if (fail) {
        setError('We could not delete the project. Nothing was deleted. Press Delete project to try again.');
        return;
      }
      setOpen(false);
      setStatus('Apollo and its files were deleted.');
    }, 1200);
  };
  return (
    <Stack gap={2} align="start">
      <Button variant="secondary" onClick={() => setOpen(true)}>Delete project</Button>
      <Text as="p" role="status">{status}</Text>
      <CriticalConfirmationDialog open={open} onClose={() => setOpen(false)} onConfirm={remove} loading={loading} error={error || undefined} {...project} />
    </Stack>
  );
}

const team = {
  title: 'Remove the team?',
  description: 'The team Platform loses its 14 members, its 6 shared boards and its billing plan. The boards and the plan cannot be recovered.',
  confirmLabel: 'Remove team',
  cancelLabel: 'Cancel',
  confirmText: 'Platform',
  fieldLabel: 'Type Platform to confirm',
  fieldDescription: 'The Remove team button stays disabled until the name matches exactly.',
};

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Critical confirmation dialog"
      layer="Component"
      family="Overlays"
      imports={"import { useState } from 'react';\nimport { Button, CriticalConfirmationDialog, Stack, Text } from '@bauhaus/design-system';"}
      intro={[
        'A critical confirmation dialog stops the user before an action that cannot be undone and that also removes other things. The user types the name of the thing first.',
        'Pick the right dialog. Use `CriticalConfirmationDialog` only for an irreversible action that cascades. Use `ConfirmationDialog` with `destructive` for one irreversible item. Use `AlertDialog` for a message with one answer.',
        'Typing is friction on purpose. If you ask for it on every delete, people paste the name without reading it, and the friction protects nothing.',
        'You own the state. You pass `open`, `onClose` (Cancel and Escape) and `onConfirm` (the confirm button, or Enter on a match). The dialog never closes itself, so each handler must set `open` to false.',
        'Focus is the outline that shows where the keyboard is. When the dialog opens, focus moves onto the text field. The user must type before any action works, so the field is the first stop.',
        'The confirm button is red (the danger variant) and comes first. Cancel comes last. The confirm stays disabled until the typed text equals `confirmText` exactly. Case and spaces count.',
      ]}
      guide="overlays-critical-confirmation-dialog--docs"
      guideName="Critical confirmation dialog"
      groups={[
        {
          title: 'Start here',
          kicker: 'The one use: ask the user to type the name before a delete that cascades.',
          examples: [
            {
              title: 'Delete a project and its files',
              when: 'The action cannot be undone, and it removes other resources too. Start with this one.',
              explain: [
                '`confirmText` is the exact text to type. The comparison is exact, so "apollo" does not match "Apollo".',
                '`fieldDescription` says why the confirm is disabled: a disabled button gives no reason by itself (Nielsen heuristic 1). The text field links the description with `aria-describedby`.',
                '`description` is the cost: what goes, how much, and what goes with it. The dialog links it with `aria-describedby`, so a screen reader reads it on open (WCAG 4.1.2, A).',
                '`confirmLabel` names the action and its object. Red is not the only cue (WCAG 1.4.1, A; 2.4.6, AA).',
              ],
              render: <CriticalDemo trigger="Delete project" result="Apollo and its files were deleted." {...project} />,
              code: `function Example() {
  // You own the state. The dialog only reads it.
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');

  return (
    <Stack gap={2} align="start">
      <Button variant="secondary" onClick={() => setOpen(true)}>Delete project</Button>
      <Text as="p" role="status">{status}</Text>

      <CriticalConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        // Runs on the confirm button, and on Enter. Only when the typed text matches.
        onConfirm={() => {
          setOpen(false);
          deleteProject(); // your delete call
          setStatus('Apollo and its files were deleted.');
        }}
        title="Delete project?"
        // The cost: what goes, how much, and what goes with it.
        description="This permanently deletes Apollo, its 3 repositories and 128 files. It cannot be recovered."
        confirmLabel="Delete project"
        cancelLabel="Cancel"
        // The exact text to type. Case and spaces count.
        confirmText="Apollo"
        fieldLabel="Type Apollo to confirm"
        // Why the confirm is disabled.
        fieldDescription="The Delete project button stays disabled until the name matches exactly."
      />
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Running and failing',
          kicker: 'The request runs while the dialog is open. Loading and error are props.',
          examples: [
            {
              title: 'Loading, then done',
              when: 'The delete call takes time and the dialog stays open until it ends.',
              explain: [
                '`loading` keeps the label and the width of the confirm, sets `aria-busy`, and turns off Cancel and Escape. A user cannot leave in the middle of the call (WCAG 4.1.3, AA, for the result in the status line).',
                'The confirm ignores a second press while it loads, so the call runs once.',
              ],
              render: <SlowDelete />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const remove = async () => {
    setLoading(true);
    await deleteProject(); // your delete call
    setLoading(false);
    setOpen(false);
  };

  return (
    <CriticalConfirmationDialog
      open={open}
      onClose={() => setOpen(false)}
      onConfirm={remove}
      // The confirm keeps its label and width. Cancel and Escape are off.
      loading={loading}
      title="Delete project?"
      description="This permanently deletes Apollo, its 3 repositories and 128 files. It cannot be recovered."
      confirmLabel="Delete project"
      cancelLabel="Cancel"
      confirmText="Apollo"
      fieldLabel="Type Apollo to confirm"
      fieldDescription="The Delete project button stays disabled until the name matches exactly."
    />
  );
}`,
            },
            {
              title: 'Failure keeps the dialog open',
              when: 'The delete call fails. The user must be able to retry.',
              explain: [
                '`error` shows an alert above the cost. A screen reader reads it at once (WCAG 4.1.3, AA).',
                'The dialog stays open and the typed name stays, so one press retries (Nielsen heuristic 9, help users recover from errors).',
                'Say that nothing was deleted. The user must know the data is still there.',
              ],
              render: <SlowDelete fail />,
              code: `<CriticalConfirmationDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={remove}
  loading={loading}
  // An alert above the cost. Say that nothing was deleted.
  error="We could not delete the project. Nothing was deleted. Press Delete project to try again."
  title="Delete project?"
  description="This permanently deletes Apollo, its 3 repositories and 128 files. It cannot be recovered."
  confirmLabel="Delete project"
  cancelLabel="Cancel"
  confirmText="Apollo"
  fieldLabel="Type Apollo to confirm"
  fieldDescription="The Delete project button stays disabled until the name matches exactly."
/>`,
            },
          ],
        },
        {
          title: 'Other copy',
          kicker: 'Same component, other words.',
          examples: [
            {
              title: 'Remove a team',
              when: 'The team goes with its boards and its plan.',
              explain: [
                'The typed text is the team name. Use the name the user sees on the page, so they can copy it from there.',
                'The cost names the three things that go: members, boards and plan.',
              ],
              render: <CriticalDemo trigger="Remove team" result="Team removed." {...team} />,
              code: `<CriticalConfirmationDialog
  open={open}
  onClose={close}
  onConfirm={removeTeam}
  title="Remove the team?"
  description="The team Platform loses its 14 members, its 6 shared boards and its billing plan. The boards and the plan cannot be recovered."
  confirmLabel="Remove team"
  cancelLabel="Cancel"
  confirmText="Platform"
  fieldLabel="Type Platform to confirm"
  fieldDescription="The Remove team button stays disabled until the name matches exactly."
/>`,
            },
          ],
        },
        {
          title: 'In the flow',
          kicker: 'Inline draws the open dialog in the flow, with no scrim and no focus move. It serves previews and embedded panels.',
          examples: [
            {
              title: 'Inline',
              when: 'A preview shows the dialog with its field, its disabled confirm and its button order.',
              explain: [
                '`inline` draws the dialog open, where you put it. There is no dark scrim, and focus does not move.',
                'Use it for documentation and tests. Do not use it for a real question: the page behind stays usable.',
              ],
              render: <CriticalConfirmationDialog inline open onClose={noop} onConfirm={noop} {...project} />,
              code: `<CriticalConfirmationDialog
  // Draw it in the page flow. No scrim, no focus trap, no focus move.
  inline
  open
  onClose={() => {}}
  onConfirm={() => {}}
  title="Delete project?"
  description="This permanently deletes Apollo, its 3 repositories and 128 files. It cannot be recovered."
  confirmLabel="Delete project"
  cancelLabel="Cancel"
  confirmText="Apollo"
  fieldLabel="Type Apollo to confirm"
  fieldDescription="The Delete project button stays disabled until the name matches exactly."
/>`,
            },
          ],
        },
      ]}
    />
  ),
};
