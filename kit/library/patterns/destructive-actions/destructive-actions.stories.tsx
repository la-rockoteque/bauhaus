import { useEffect, useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage, LIFECYCLE } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Button } from '../../components/clickables/button/button';
import { TextField } from '../../components/fields/text-field/text-field';
import { Banner } from '../../components/feedback/banner/banner';
import { ToastRegion } from '../../components/feedback/toast/toast';
import type { ToastData } from '../../components/feedback/toast/toast';
import { ConfirmationDialog } from '../../components/overlays/confirmation-dialog/confirmation-dialog';
import { Modal } from '../../components/overlays/modal/modal';
import { List, ListItem } from '../../components/data-structures/list/list';
import { Stack } from '../../primitives/stack/stack';
import { Text } from '../../primitives/text/text';
import { destructiveActionsRules } from './destructive-actions.rules';

// The pattern is a recipe, not a component: the showcase composes the parts it names.
// The recipe pieces are exported for the test and hidden from the Storybook sidebar.
const meta = { title: 'Patterns/Destructive actions', parameters: { layout: 'fullscreen' }, excludeStories: ['UndoList', 'ConfirmDelete', 'DeleteProject', 'FILES'] } satisfies Meta;

export default meta;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface FileItem { id: number; name: string }
export const FILES: readonly FileItem[] = [
  { id: 1, name: 'Q3 report.pdf' },
  { id: 2, name: 'Logo draft.png' },
  { id: 3, name: 'Budget.xlsx' },
];

export interface UndoListProps {
  /** Ids already removed, so the done state can be shown at rest. */
  initiallyRemoved?: readonly number[];
  position?: 'fixed' | 'static';
}

/** Reversible: remove at once, offer Undo. The delete is final only when the toast closes. */
export function UndoList({ initiallyRemoved = [], position = 'fixed' }: UndoListProps) {
  const uid = useId();
  const [items, setItems] = useState<readonly FileItem[]>(FILES);
  const [removed, setRemoved] = useState<readonly number[]>(initiallyRemoved);
  // Where focus goes after a change. The control the user pressed is gone, so focus must land elsewhere.
  const [focusTarget, setFocusTarget] = useState<string | null>(null);
  useEffect(() => {
    if (focusTarget) document.getElementById(focusTarget)?.focus();
  }, [focusTarget]);
  const name = (id: number) => items.find((item) => item.id === id)?.name ?? '';
  const buttonId = (id: number) => `${uid}-delete-${id}`;
  const restore = (id: number) => {
    setRemoved((list) => list.filter((r) => r !== id));
    setFocusTarget(buttonId(id));
  };
  const toasts: ToastData[] = removed.map((id) => ({
    id: String(id),
    message: `${name(id)} moved to trash.`,
    action: { label: 'Undo', onAction: () => restore(id) },
  }));
  const commit = (toastId: string) => {
    const id = Number(toastId);
    setRemoved((list) => list.filter((r) => r !== id));
    setItems((list) => list.filter((item) => item.id !== id));
  };
  const visible = items.filter((item) => !removed.includes(item.id));
  const remove = (item: FileItem) => {
    const rest = visible.filter((other) => other.id !== item.id);
    const next = rest.find((other) => other.id > item.id) ?? rest.at(-1);
    setRemoved((list) => [...list, item.id]);
    // The next row's Delete button, or the empty message when no row remains.
    setFocusTarget(next ? buttonId(next.id) : `${uid}-empty`);
  };
  return (
    <Stack gap={3}>
      {visible.length === 0 ? <Text id={`${uid}-empty`} tabIndex={-1} tone="muted">No files.</Text> : (
        <Stack as="ul" gap={2}>
          {visible.map((item) => (
            <li key={item.id}>
              <Stack direction="horizontal" justify="between" align="center">
                <Text as="span">{item.name}</Text>
                <Button id={buttonId(item.id)} variant="secondary" aria-label={`Delete ${item.name}`} onClick={() => remove(item)}>Delete</Button>
              </Stack>
            </li>
          ))}
        </Stack>
      )}
      <ToastRegion toasts={toasts} onDismiss={commit} position={position} />
    </Stack>
  );
}

export interface ConfirmDeleteProps {
  initialOpen?: boolean;
  /** Draw the dialog in the flow, for a specimen. */
  inline?: boolean;
  onDelete?: () => void;
}

/** Irreversible, one item, little data: one question. */
export function ConfirmDelete({ initialOpen = false, inline = false, onDelete = () => undefined }: ConfirmDeleteProps) {
  const uid = useId();
  const [open, setOpen] = useState(initialOpen);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (done) document.getElementById(`${uid}-done`)?.focus();
  }, [done, uid]);
  if (done) return <Banner id={`${uid}-done`} tabIndex={-1} status="success" title="Filter deleted">The filter Overdue invoices is gone.</Banner>;
  return (
    <Stack gap={3}>
      <Button variant="secondary" onClick={() => setOpen(true)}>Delete filter</Button>
      <ConfirmationDialog
        open={open}
        inline={inline}
        destructive
        title="Delete filter?"
        description="This deletes the saved filter Overdue invoices. It cannot be recovered."
        confirmLabel="Delete filter"
        cancelLabel="Cancel"
        onClose={() => setOpen(false)}
        onConfirm={() => { onDelete(); setOpen(false); setDone(true); }}
      />
    </Stack>
  );
}

export interface DeleteProjectProps {
  name?: string;
  initialOpen?: boolean;
  initialTyped?: string;
  initialPhase?: 'idle' | 'deleting' | 'failed';
  inline?: boolean;
  /** Your delete call. Reject to show the failure. */
  onDelete?: () => Promise<void>;
}

/** Irreversible with a cascade: the user types the name. The dialog owns loading and failure. */
export function DeleteProject({ name = 'Apollo', initialOpen = false, initialTyped = '', initialPhase = 'idle', inline = false, onDelete = () => wait(600) }: DeleteProjectProps) {
  const uid = useId();
  const [open, setOpen] = useState(initialOpen);
  const [typed, setTyped] = useState(initialTyped);
  const [phase, setPhase] = useState<'idle' | 'deleting' | 'failed' | 'done'>(initialPhase);
  useEffect(() => {
    if (phase === 'done') document.getElementById(`${uid}-done`)?.focus();
  }, [phase, uid]);
  const confirm = async () => {
    if (phase === 'deleting') return;
    setPhase('deleting');
    try {
      await onDelete();
      setOpen(false);
      setPhase('done');
    } catch {
      setPhase('failed');
    }
  };
  if (phase === 'done') return <Banner id={`${uid}-done`} tabIndex={-1} status="success" title="Project deleted">{name} and its files were deleted.</Banner>;
  const deleting = phase === 'deleting';
  return (
    <Stack gap={3}>
      <Button variant="secondary" onClick={() => setOpen(true)}>Delete project</Button>
      <Modal
        open={open}
        inline={inline}
        role="alertdialog"
        aria-describedby={`${uid}-cost`}
        title="Delete project?"
        onClose={() => { if (!deleting) setOpen(false); }}
        footer={
          <>
            <Button variant="secondary" data-autofocus disabled={deleting} onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" disabled={typed !== name} loading={deleting} onClick={confirm}>Delete project</Button>
          </>
        }
      >
        <Stack gap={4}>
          {phase === 'failed' && (
            <Banner status="error" urgent title="We could not delete the project">
              Nothing was deleted. Your project and its files are still here. Press Delete project to try again.
            </Banner>
          )}
          <Text id={`${uid}-cost`}>This permanently deletes {name}, its 3 repositories and 128 files. It cannot be recovered.</Text>
          <TextField
            label={`Type ${name} to confirm`}
            description="The Delete project button stays disabled until the name matches exactly."
            autoComplete="off"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
          />
        </Stack>
      </Modal>
    </Stack>
  );
}

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Destructive actions"
      layer="Pattern"
      plain="A destructive action removes something. The more it costs, the more the screen should slow you down. A cheap, reversible action should not slow you down at all."
      precise="Pattern · friction scaled to cost: an Undo toast, a confirmation dialog, or a dialog with a typed name · composes ConfirmationDialog, Modal, TextField, Toast, Banner, Button and Stack; has no style of its own."
      usedFor="Any delete, remove, reset or revoke: a file, a saved filter, a project, an account."
      tokens={{ mode: 'consumed', note: 'None of its own. Layout comes from Stack. Colour, type and spacing come from the components it composes.', rows: [] }}
      stage={{
        render: <DeleteProject initialOpen inline />,
        parts: [
          { n: 1, label: 'Question', note: 'the dialog title; role alertdialog, labelled by it', target: '.ds-modal__title', at: 'top-start' },
          { n: 2, label: 'Cost', note: 'what goes, how much, and that it cannot come back', target: '.ds-modal__body p', at: 'top-start' },
          { n: 3, label: 'Typed name', note: 'only when other resources go with it', target: '.ds-field__label', at: 'top-start' },
          { n: 4, label: 'Cancel', note: 'focus starts here', target: '.ds-modal__footer button:first-child', at: 'top-start' },
          { n: 5, label: 'Confirm', note: 'names the action and the object; disabled until the name matches', target: '.ds-modal__footer button:last-child', at: 'top-end' },
        ],
      }}
      api={[
        { label: 'Reversible', value: 'Remove at once, then show a Toast with an Undo action. The delete is final when the toast closes.' },
        { label: 'Irreversible', value: 'ConfirmationDialog with `destructive`. The confirm label names the action: “Delete filter”.' },
        { label: 'Cascade', value: 'Modal with a TextField. The confirm button is disabled until the typed text equals the name.' },
        { label: 'onDelete()', value: 'Your delete call. The confirm button is loading until it settles. A rejection shows the failure and keeps the dialog.' },
      ]}
      states={{
        expect: LIFECYCLE,
        note: 'Interaction states are inherited from the components the pattern composes. The pattern has no button or dialog styling of its own, so it has no danger colour: the words carry the risk.',
        cells: [
          { id: 'nothing', status: 'designed', label: 'Nothing (the trigger)', render: <DeleteProject />, trigger: 'no dialog open', note: 'Only the trigger. No warning before the user acts.' },
          { id: 'loading', status: 'designed', label: 'Loading (deleting)', render: <DeleteProject initialOpen inline initialTyped="Apollo" initialPhase="deleting" />, trigger: 'confirm pressed, request running', note: 'The confirm button is loading and keeps its size. Cancel is disabled. The dialog stays open.' },
          { id: 'none', status: 'n/a', reason: 'The pattern acts on an item that exists. A list with nothing left is an empty result, not part of this pattern.' },
          { id: 'one', status: 'n/a', reason: 'One item is the base case, shown as nothing. It is not a separate state.' },
          { id: 'some', status: 'n/a', reason: 'A bulk delete is a count in the confirm label, such as “Delete 12 files”, not a state.' },
          { id: 'too-many', status: 'n/a', reason: 'A long name wraps in the question and the field. It is a content case, shown on the Examples page.' },
          { id: 'incorrect', status: 'designed', label: 'Incorrect (delete failed)', render: <DeleteProject initialOpen inline initialTyped="Apollo" initialPhase="failed" />, trigger: 'the request rejected', note: 'An alert says nothing was deleted. The dialog stays open, the typed name stays, and the user can retry.' },
          { id: 'correct', status: 'n/a', reason: 'There is no half-way success. The enabled confirm button is the only sign that the name matched.' },
          { id: 'done', status: 'designed', label: 'Done (deleted, with Undo)', render: <UndoList initiallyRemoved={[2]} position="static" />, trigger: 'delete pressed on a reversible item', note: 'The item is gone and a Toast offers Undo until the user closes it. A permanent delete ends with a status Banner and focus on it.' },
        ],
      }}
      extra={[
        {
          title: 'Pick the friction',
          kicker: 'Ask first: can the user reverse it? The guide holds the reasoning.',
          content: (
            <List ordered divided>
              <ListItem title="Reversible: act, then offer Undo" description="Remove the item and show a Toast with an Undo action. No question before. The Toast stays until the user closes it." />
              <ListItem title="Irreversible, one item: ask once" description="ConfirmationDialog with `destructive`. The title asks, the description states the cost, the confirm button names the action, and focus starts on Cancel." />
              <ListItem title="Irreversible with a cascade: ask for the name" description="Modal with a TextField. The confirm button is disabled until the typed text matches exactly, and the field says why." />
              <ListItem title="Bulk: state the count" description="One question. The confirm label carries the number: “Delete 12 files”." />
              <ListItem title="While it runs, keep the dialog" description="Set `loading` on the confirm button. On a failure keep the dialog, say nothing was deleted, and offer retry." />
            </List>
          ),
        },
        {
          title: 'Try it',
          kicker: 'Two working recipes. Delete a file and press Undo. Then delete the project.',
          content: (
            <Stack gap={5}>
              <UndoList position="static" />
              <DeleteProject />
            </Stack>
          ),
        },
      ]}
      dos={[
        { text: 'Offer Undo instead of a question when the action can be reversed.', basis: 'NN/g, Nielsen 3; WCAG 3.3.4 (AA)' },
        { text: 'Name the action and the object on the confirm button.', basis: 'NN/g; GitLab Pajamas' },
        { text: 'Start focus on Cancel in a destructive confirmation.', basis: 'Project decision' },
        { text: 'State what is deleted and whether it comes back.', basis: 'NN/g; Nielsen 5' },
        { text: 'Ask for the typed name when other resources go too.', basis: 'GitLab Pajamas' },
      ]}
      donts={[
        { text: 'Confirm a reversible action.', basis: 'NN/g, dialog fatigue', rule: 'destructive.undo-over-confirm' },
        { text: 'Label the confirm button “OK” or “Yes”.', basis: 'NN/g', rule: 'destructive.names-the-action' },
        { text: 'Start focus on the destructive button.', basis: 'Project decision', rule: 'destructive.focus-on-cancel' },
        { text: 'Ask “Are you sure?” without naming the cost.', basis: 'NN/g', rule: 'destructive.states-the-cost' },
        { text: 'Close the dialog when the delete failed.', basis: 'Nielsen 9', rule: 'destructive.failure-keeps-dialog' },
      ]}
      guide="patterns-destructive-actions--docs"
      guideName="Destructive actions"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Destructive actions" layer="Pattern" rules={destructiveActionsRules} guide="patterns-destructive-actions--docs" guideName="Destructive actions" />,
};

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Destructive actions"
      layer="Pattern"
      imports={`import { Banner, Button, ConfirmationDialog, Modal, Stack, Text, TextField, ToastRegion } from '@bauhaus/design-system';
import { useState } from 'react';`}
      intro={[
        'A destructive action removes something. The pattern scales the friction to the cost: the cheaper the loss, the less the screen gets in the way.',
        'The pattern has no component of its own. You write the small component that holds the state and compose `ConfirmationDialog`, `Modal`, `TextField`, `ToastRegion`, `Banner` and `Button`.',
        'Ask one question first: can the user reverse it? If yes, use the first example (Undo). If no, use the second. If the deletion also removes other things, use the third.',
        'A "toast" is a short message that appears at the edge of the screen. A toast with an action stays until the user closes it, so nobody is rushed.',
        'A "dialog" is a box over the page that stops everything else until the user answers. `alertdialog` is its role for a message that needs a response: a screen reader reads the title and the description when it opens.',
        'The `Button` has no red "danger" look today. The words on the buttons carry the risk. Names such as `deleteProject` stand for your own code.',
      ]}
      guide="patterns-destructive-actions--docs"
      guideName="Destructive actions"
      groups={[
        {
          title: 'Pick the friction',
          kicker: 'Reversible first. A question only when the loss is permanent.',
          examples: [
            {
              title: 'Reversible: act, then offer Undo',
              when: 'The user can get the item back: move to trash, archive, remove from a list.',
              explain: [
                'The item leaves the list at once. There is no question, because the user loses nothing they cannot get back (Nielsen heuristic 3, user control and freedom).',
                'A `Toast` with an `action` offers Undo. `onAction` puts the item back by removing its id from `removed`.',
                'A toast with an action does not close by itself, so the user has all the time they need (WCAG 2.2.1 Timing Adjustable, A).',
                'The delete becomes final in `onDismiss`, when the user closes the toast. A real app can also soft-delete on the server and purge later.',
                'The toast sits in a polite live region, so a screen reader says "Q3 report.pdf moved to trash" without taking focus (WCAG 4.1.3, AA).',
                'The Delete button you pressed leaves the page, so focus would fall to the top of the page. Move it to the next row\'s Delete button. When no row remains, move it to the "No files." message (WCAG 2.4.3, A).',
                'A keyboard user reaches Undo with Tab. The toast region is the last element in the page order, so Undo comes after the other rows. The Toast component has no shortcut key and no jump key. After Undo, focus goes back to the restored row.',
                'Known limit: a region shows 3 toasts at a time and counts the rest as "+N more". Undo of a waiting toast cannot be reached until another toast closes.',
                'Why not ask first? A question on every delete teaches users to click through, and then it protects nothing (NN/g, dialog fatigue).',
                'Try it: press Delete on a file, then press Undo.',
              ],
              render: <UndoList position="static" />,
              code: `function Files({ files }) {
  // Ids of the files the user removed and may still bring back.
  const [removed, setRemoved] = useState([]);

  // The pressed button leaves the page. Put focus on a control that stays.
  const focusOn = (domId) => setTimeout(() => document.getElementById(domId)?.focus());

  // One toast per removed file, each with an Undo action.
  const toasts = removed.map((id) => ({
    id: String(id),
    message: nameOf(id) + ' moved to trash.',
    // Undo = take the id out of 'removed'. The file is back.
    action: { label: 'Undo', onAction: () => { setRemoved((r) => r.filter((x) => x !== id)); focusOn('delete-' + id); } },
  }));

  // The toast closed: the delete is final.
  const commit = (toastId) => deleteFile(Number(toastId));

  return (
    <>
      {files.filter((f) => !removed.includes(f.id)).map((f) => (
        <Button
          key={f.id}
          id={'delete-' + f.id}
          variant="secondary"
          aria-label={'Delete ' + f.name}   // 'Delete' alone does not say which file
          onClick={() => {
            setRemoved((r) => [...r, f.id]);
            // The next row's button, or the 'No files.' message when none is left.
            focusOn(nextDeleteId(f) ?? 'no-files');
          }}
        >Delete</Button>
      ))}
      <ToastRegion toasts={toasts} onDismiss={commit} />
    </>
  );
}`,
            },
            {
              title: 'Irreversible, one item: a confirmation dialog',
              when: 'The delete is permanent and little else is lost: a saved filter, a draft.',
              explain: [
                'Use `ConfirmationDialog` with `destructive`. It sets `role="alertdialog"` and starts focus on Cancel, so a stray Enter keeps the data.',
                '`title` asks the question: "Delete filter?". `description` states the cost: what goes and that it cannot be recovered (NN/g: be specific, never only "Are you sure?").',
                '`confirmLabel` names the action and the object: "Delete filter". Never "OK" or "Yes" (NN/g, GitLab Pajamas).',
                'Focus on Cancel is a project decision. The APG Alert and Message Dialogs page does not set initial focus. Some systems focus the confirm button instead, so this point is contested.',
                'On confirm the dialog closes and a success `Banner` takes focus. The trigger button is gone, so focus must go somewhere that exists (WCAG 2.4.3, A).',
                'Try it: press Delete filter. Press Enter at once, and see that nothing is deleted.',
              ],
              render: <ConfirmDelete />,
              code: `const [open, setOpen] = useState(false);

<Button variant="secondary" onClick={() => setOpen(true)}>Delete filter</Button>

<ConfirmationDialog
  open={open}
  destructive                       // focus starts on Cancel
  title="Delete filter?"            // the question
  description="This deletes the saved filter Overdue invoices. It cannot be recovered."  // the cost
  confirmLabel="Delete filter"      // the action and its object, never 'OK'
  cancelLabel="Cancel"
  onClose={() => setOpen(false)}    // Cancel, Escape
  onConfirm={() => { deleteFilter(); setOpen(false); }}
/>`,
            },
          ],
        },
        {
          title: 'Cascade, loading and failure',
          kicker: 'The user types the name. The dialog stays open until the server answers.',
          examples: [
            {
              title: 'Type the name to confirm',
              when: 'The delete is permanent and removes other things with it: a project with its files.',
              explain: [
                '`ConfirmationDialog` has no slot for a field, so compose `Modal` with `role="alertdialog"` and your own footer.',
                '`aria-describedby` points to the cost text, so a screen reader reads it when the dialog opens (APG Alert and Message Dialogs).',
                'The `TextField` asks for the exact name. `typed !== name` keeps the confirm button disabled until it matches. The field description tells the user why the button is off.',
                'The disabled button is the guard here, not a hint about invalid data. That is why it is allowed, where the form-validation pattern keeps submit enabled.',
                'Cancel carries `data-autofocus`, so the dialog opens with focus on Cancel.',
                'Ask for the name only when other resources go too (GitLab Pajamas). On a single item it is friction with nothing to protect.',
                'Try it: type Apollo and watch the button turn on.',
              ],
              render: <DeleteProject />,
              code: `const name = 'Apollo';
const [typed, setTyped] = useState('');
const costId = useId();

<Modal
  open={open}
  role="alertdialog"                  // a message that needs an answer
  aria-describedby={costId}           // read out with the title on open
  title="Delete project?"
  onClose={() => setOpen(false)}
  footer={
    <>
      {/* data-autofocus: the dialog opens with focus on the safe choice */}
      <Button variant="secondary" data-autofocus onClick={() => setOpen(false)}>Cancel</Button>
      {/* Disabled until the name matches exactly. The label names the action. */}
      <Button disabled={typed !== name} onClick={confirm}>Delete project</Button>
    </>
  }
>
  <Text id={costId}>This permanently deletes {name}, its 3 repositories and 128 files. It cannot be recovered.</Text>
  <TextField
    label={'Type ' + name + ' to confirm'}
    description="The Delete project button stays disabled until the name matches exactly."
    autoComplete="off"
    value={typed}
    onChange={(e) => setTyped(e.target.value)}
  />
</Modal>`,
            },
            {
              title: 'Deleting: show the work',
              when: 'The request takes time.',
              explain: [
                '`loading` on the confirm button keeps its label and width, shows the work, and ignores more presses (Nielsen heuristic 1, visibility of system status).',
                'Cancel is disabled while the request runs, and `onClose` ignores Escape, so the user cannot walk away from a request in flight.',
                'The dialog stays open until the server answers. Closing it early would claim a result that is not known yet.',
              ],
              render: <DeleteProject initialOpen inline initialTyped="Apollo" initialPhase="deleting" />,
              code: `const [phase, setPhase] = useState('idle'); // 'idle' | 'deleting' | 'failed' | 'done'
const deleting = phase === 'deleting';

<Button variant="secondary" disabled={deleting} onClick={() => setOpen(false)}>Cancel</Button>
{/* loading: label and width stay, presses are ignored */}
<Button disabled={typed !== name} loading={deleting} onClick={confirm}>Delete project</Button>`,
            },
            {
              title: 'Failure: keep the dialog, say nothing was lost',
              when: 'The delete request failed.',
              explain: [
                'A `Banner` with `status="error"` and `urgent` sits in the dialog. `urgent` makes it an alert, so a screen reader reads it at once (WCAG 4.1.3, AA).',
                'The message says the first thing the user fears: nothing was deleted. Then it says how to retry (Nielsen heuristic 9).',
                'The typed name stays, so retry is one press. The dialog does not close.',
                'On success the dialog closes and a status `Banner` takes focus, because the trigger is gone (WCAG 2.4.3, A).',
                'The result above is the failed state at rest. In the real recipe `onDelete` rejects once, and a second press succeeds.',
              ],
              render: <DeleteProject initialOpen inline initialTyped="Apollo" initialPhase="failed" />,
              code: `const confirm = async () => {
  if (phase === 'deleting') return;       // ignore a second press
  setPhase('deleting');
  try {
    await deleteProject();                // your request
    setOpen(false);
    setPhase('done');                     // show a status Banner and focus it
  } catch {
    setPhase('failed');                   // the dialog stays open
  }
};

{phase === 'failed' && (
  // urgent = role="alert": read out at once
  <Banner status="error" urgent title="We could not delete the project">
    Nothing was deleted. Your project and its files are still here. Press Delete project to try again.
  </Banner>
)}`,
            },
          ],
        },
      ]}
    />
  ),
};
