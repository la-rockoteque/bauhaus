import { useEffect, useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage, LIFECYCLE } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Button } from '../../components/clickables/button/button';
import { Link } from '../../components/clickables/link/link';
import { Badge } from '../../components/feedback/badge/badge';
import { Banner } from '../../components/feedback/banner/banner';
import { EmptyState } from '../../components/feedback/empty-state/empty-state';
import { ToastRegion } from '../../components/feedback/toast/toast';
import { useToast } from '../../components/feedback/toast/use-toast';
import { AlertDialog } from '../../components/overlays/alert-dialog/alert-dialog';
import { ConfirmationDialog } from '../../components/overlays/confirmation-dialog/confirmation-dialog';
import { Popover } from '../../components/overlays/popover/popover';
import { Tooltip } from '../../components/overlays/tooltip/tooltip';
import { List, ListItem } from '../../components/data-structures/list/list';
import { Stack } from '../../primitives/stack/stack';
import { Text } from '../../primitives/text/text';
import { messagingRules } from './messaging.rules';

// The pattern is a decision, not a component: the showcase composes the parts it names.
// The recipes are exported for the test and hidden from the Storybook sidebar.
const meta = {
  title: 'Patterns/Messaging',
  parameters: { layout: 'fullscreen' },
  excludeStories: ['SaveToast', 'UploadFailure', 'DeleteProject', 'SessionExpired', 'FieldHelp', 'InboxBadge', 'ProjectsEmpty', 'DecisionSet'],
} satisfies Meta;

export default meta;

/** Branch 2, result not visible: a Toast confirms, and nothing else is needed. */
export function SaveToast() {
  const { toasts, show, dismiss } = useToast();
  return (
    <Stack gap={3}>
      <div>
        <Button onClick={() => show({ status: 'success', message: 'Draft saved.' })}>Save draft</Button>
      </div>
      <ToastRegion toasts={toasts} onDismiss={dismiss} position="static" />
    </Stack>
  );
}

/** Branch 4, a failure the user must act on: a Banner with the action, never a toast. */
export function UploadFailure() {
  const uid = useId();
  const [failed, setFailed] = useState(false);
  // An alert mounted with its text is announced unreliably, and the user must act on it now.
  // So the app moves focus to the Banner, where the retry button is the next stop.
  useEffect(() => {
    if (failed) document.getElementById(`${uid}-failed`)?.focus();
  }, [failed, uid]);
  return (
    <Stack gap={3}>
      <div>
        <Button onClick={() => setFailed(true)}>Upload report</Button>
      </div>
      {failed && (
        <Banner id={`${uid}-failed`} tabIndex={-1} status="error" urgent title="We could not upload the report" actions={<Button variant="secondary" onClick={() => setFailed(false)}>Try again</Button>}>
          The connection dropped. Your file is kept.
        </Banner>
      )}
    </Stack>
  );
}

/** Branch 2, a costly action: ask first. */
export function DeleteProject({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [deleted, setDeleted] = useState(false);
  return (
    <Stack gap={3}>
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>Delete project</Button>
      </div>
      <Text role="status">{deleted && 'Project deleted.'}</Text>
      <ConfirmationDialog
        open={open} onClose={() => setOpen(false)}
        onConfirm={() => { setOpen(false); setDeleted(true); }}
        title="Delete project Apollo?" destructive
        description="The project and its 12 files are deleted. You cannot undo this."
        confirmLabel="Delete project" cancelLabel="Cancel"
      />
    </Stack>
  );
}

/** Branch 3, a message that blocks progress: one action. */
export function SessionExpired({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <Stack gap={3}>
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>Simulate a timeout</Button>
      </div>
      <AlertDialog
        open={open} onClose={() => setOpen(false)}
        title="Session expired"
        description="You were signed out after 30 minutes without activity. Your draft is saved."
        actionLabel="Sign in again"
      />
    </Stack>
  );
}

/** Branch 5, help for one control: a short Tooltip, or a Popover for more. */
export function FieldHelp() {
  return (
    <Stack gap={3} direction="horizontal" align="center">
      <Tooltip content="Exports the visible rows as CSV" delay={0}>
        <Button variant="secondary">Export</Button>
      </Tooltip>
      <Popover trigger={<Button variant="tertiary">What is a role?</Button>} label="About roles">
        <Stack gap={2}>
          <Text>A role decides what a member can change. Owners manage billing.</Text>
          <Link href="#roles">Read the roles guide</Link>
        </Stack>
      </Popover>
    </Stack>
  );
}

/** Branch 6, a count on an item: a Badge labels, the app does not announce. */
export function InboxBadge({ unread = 3 }: { unread?: number }) {
  return (
    <Button variant="secondary">
      Inbox {unread > 0 && <Badge status="info" count={unread} label="unread messages" />}
    </Button>
  );
}

/** Branch 7, missing content: the status region stays in the page, only the Empty state comes and goes. */
export function ProjectsEmpty({ projects = [] }: { projects?: readonly string[] }) {
  return (
    <div role="status">
      {projects.length === 0 && <EmptyState title="You have no projects yet" headingLevel={3}>Projects appear here after you create one.</EmptyState>}
    </div>
  );
}

const NOOP = () => {};

/** The decision as a compact set of the built components, one per answer. */
export function DecisionSet() {
  return (
    <Stack gap={4}>
      <Text tone="muted">2 · Result not visible</Text>
      <ToastRegion toasts={[{ id: 'saved', status: 'success', message: 'Draft saved.', duration: null }]} onDismiss={NOOP} position="static" />
      <Text tone="muted">4 · Condition of the page</Text>
      <Banner status="warning" title="You are offline">Changes are kept here and sync when you reconnect.</Banner>
      <Text tone="muted">6 · Count on an item</Text>
      <div><InboxBadge /></div>
      <Text tone="muted">7 · Missing content</Text>
      <ProjectsEmpty />
    </Stack>
  );
}

const notAState = 'The pattern is a decision, not a list or a form, so this state does not apply.';

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Messaging"
      layer="Pattern"
      plain="Messaging is how the product tells a user something. Most of the time the best message is none. When one is needed, pick the one that interrupts least."
      precise="Pattern · a decision from the user's need to one of Toast, Banner, field error, Alert dialog, Confirmation dialog, Popover, Tooltip, Badge or Empty state · composes those components; has no style of its own."
      usedFor="Every time the product is about to tell a user something."
      tokens={{ mode: 'consumed', note: 'None of its own. Colour, type and spacing come from the components it composes.', rows: [] }}
      stage={{
        render: <DecisionSet />,
        // Part numbers are the branch numbers of the decision, as in the guide and the examples.
        parts: [
          { n: 2, label: 'Toast', note: 'result not visible, no follow-up · polite status region', target: '.ds-toast', at: 'top-start' },
          { n: 4, label: 'Banner', note: 'condition of the page or system · status, or alert when urgent', target: '.ds-banner', at: 'top-start' },
          { n: 6, label: 'Badge', note: 'count or status on an item · text, not colour alone', target: '.ds-badge', at: 'top-end' },
          { n: 7, label: 'Empty state', note: 'stands in for missing content', target: '.ds-empty-state', at: 'top-start' },
        ],
      }}
      api={[
        { label: 'Does the user need to know?', value: 'No: show nothing. This is the first answer, and it needs no component.' },
        { label: 'Does it block progress?', value: 'Yes: Alert dialog for one answer, Confirmation dialog for a choice. No: stay in the page.' },
        { label: 'Is it about one control?', value: 'Short text: Tooltip. Richer content: Popover, opened by a click.' },
      ]}
      states={{
        expect: LIFECYCLE,
        note: 'The pattern is a decision. Each component keeps its own states.',
        cells: [
          { id: 'nothing', status: 'designed', label: 'Nothing (no message)', render: <Text tone="muted">No message is shown. This is the first answer of the decision.</Text>, trigger: 'no action open, result visible', note: 'The least disruptive message is none.' },
          { id: 'loading', status: 'n/a', reason: 'A wait has its own components (Spinner, Skeleton, Progress). It is not a message.' },
          { id: 'none', status: 'designed', label: 'None (missing content)', render: <ProjectsEmpty />, trigger: 'a list with no rows', note: 'Branch 7: an Empty state in a status region that is always in the page.' },
          { id: 'one', status: 'n/a', reason: notAState },
          { id: 'some', status: 'n/a', reason: notAState },
          { id: 'too-many', status: 'designed', label: 'Too many (queued toasts)', render: <ToastRegion position="static" max={1} onDismiss={NOOP} toasts={[{ id: 'a', status: 'success', message: 'Draft saved.', duration: null }, { id: 'b', status: 'info', message: 'Sync finished.', duration: null }, { id: 'c', status: 'info', message: 'Export ready.', duration: null }]} />, trigger: 'three toasts, max 1', note: 'The region shows a few and counts the rest. One event still gets one message.' },
          { id: 'incorrect', status: 'designed', label: 'Incorrect (a failure to act on)', render: <Banner status="error" urgent title="We could not upload the report" actions={<Button variant="secondary">Try again</Button>}>The connection dropped. Your file is kept.</Banner>, trigger: 'a failed request the user can retry', note: 'A Banner with the action, never a toast. The urgent error is role="alert".' },
          { id: 'correct', status: 'n/a', reason: 'A correct value needs no message here. Field confirmations belong to form validation.' },
          { id: 'done', status: 'designed', label: 'Done (result not visible)', render: <ToastRegion toasts={[{ id: 'done', status: 'success', message: 'Draft saved.', duration: null }]} onDismiss={NOOP} position="static" />, trigger: 'a save that shows no change', note: 'Branch 2: a Toast in a polite status region. Focus does not move.' },
        ],
      }}
      extra={[
        {
          title: 'Decision',
          kicker: 'Ask in order. Stop at the first answer that holds.',
          content: (
            <List ordered divided>
              <ListItem title="Does the user need to know at all?" description="No action open and no information needed: show nothing." />
              <ListItem title="Is it the result of an action here?" description="Visible: nothing. Wrong field value: the field error. Not visible: Toast. Costly: Confirmation dialog." />
              <ListItem title="Does it block progress?" description="Alert dialog, one action named for what it does." />
              <ListItem title="Is it a condition of the page or system?" description="Banner. `urgent` only for an error to act on now." />
              <ListItem title="Is it help for one control?" description="Short text: Tooltip. Richer, with a link or action: Popover, opened by a click." />
              <ListItem title="Is it a status or count on an item?" description="Badge, with text." />
              <ListItem title="Is it standing in for missing content?" description="Empty state." />
              <ListItem title="Is it an event for later?" description="No notification component yet. Badge on the entry point, list on a page." />
            </List>
          ),
        },
        {
          title: 'Try it',
          kicker: 'Each recipe is one answer. Press the buttons.',
          content: (
            <Stack gap={5}>
              <SaveToast />
              <UploadFailure />
              <DeleteProject />
              <SessionExpired />
              <FieldHelp />
            </Stack>
          ),
        },
      ]}
      dos={[
        { text: 'Show nothing when the result is already visible.', basis: 'Pajamas' },
        { text: 'Put a failure that needs action in a Banner with the action.', basis: 'Pajamas; WCAG 2.2.1 (A)' },
        { text: 'Announce every message through a live region.', basis: 'WCAG 4.1.3 (AA)' },
        { text: 'Move focus into a dialog and back to its opener.', basis: 'APG Dialog; WCAG 2.4.3 (A)' },
        { text: 'Open a popover with a click.', basis: 'Pajamas' },
      ]}
      donts={[
        { text: 'Use a toast for an error that needs action.', basis: 'Pajamas; WCAG 2.2.1 (A)', rule: 'messaging.toast-not-for-errors-needing-action' },
        { text: 'Put essential information in a tooltip.', basis: 'Pajamas', rule: 'messaging.no-essential-in-tooltip' },
        { text: 'Open a popover on hover, focus or page load.', basis: 'Pajamas', rule: 'messaging.popover-on-click' },
        { text: 'Show a toast and a banner for the same event.', basis: 'Pajamas', rule: 'messaging.one-per-event' },
        { text: 'Mark routine news as role="alert".', basis: 'APG Alert', rule: 'messaging.assertive-only-when-urgent' },
        { text: 'Add a stylesheet to the pattern folder.', basis: 'docs/library.md', rule: 'messaging.no-own-style' },
      ]}
      guide="patterns-messaging--docs"
      guideName="Messaging"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Messaging" layer="Pattern" rules={messagingRules} guide="patterns-messaging--docs" guideName="Messaging" />,
};

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Messaging"
      layer="Pattern"
      imports={`import { AlertDialog, Badge, Banner, Button, ConfirmationDialog, EmptyState, Popover, Stack, Text, ToastRegion, Tooltip, useToast } from '@bauhaus/design-system';
import { useState } from 'react';`}
      intro={[
        'Messaging is choosing how to tell the user something. The pattern has no component of its own: you pick one of the components below, by asking the questions in the guide in order.',
        'The rule that drives every choice is "the least disruptive option that does the job". A toast does not stop the user. A dialog does. Start with the quiet one and move up only when the quiet one cannot do the job.',
        'A "live region" is a part of the page that a screen reader watches. When text appears in it, the screen reader reads it out without moving the user\'s focus. `role="status"` is the polite kind: it waits for a pause. `role="alert"` is the assertive kind: it speaks at once. Toast and Banner set these for you (WCAG 4.1.3 Status Messages, AA).',
        'A "modal" dialog blocks the rest of the page until the user answers. Focus moves inside it and comes back to the button that opened it when it closes (APG Dialog (Modal); WCAG 2.4.3 Focus Order, A).',
        'The first example is the one with no component: showing nothing. Each later example is one branch of the decision. Names such as `save` stand for your own code.',
      ]}
      guide="patterns-messaging--docs"
      guideName="Messaging"
      groups={[
        {
          title: 'Quiet messages',
          kicker: 'The result is not visible, or the page is in a state. Nothing blocks the user.',
          examples: [
            {
              title: '1 and 2 · Show nothing',
              when: 'The user did something and the screen already shows the result.',
              explain: [
                'The user adds a row and the row appears. Saying "Row added" repeats what they see and takes their attention.',
                'Pajamas asks first whether the message needs to exist at all. When no action or information is needed, show nothing.',
                'This is a decision, not code. Leave the handler without a message.',
              ],
              code: `function addRow(row) {
  setRows([...rows, row]);
  // No toast and no banner. The new row is the feedback.
}`,
            },
            {
              title: '2 · Toast: a result the user cannot see',
              when: 'An action worked but the screen shows no change, such as a save.',
              explain: [
                '`useToast()` returns the list `toasts`, a `show` function and a `dismiss` function. `<ToastRegion>` draws the list.',
                'Mount `<ToastRegion>` once, near the root of your app. It stays in the page even when empty, so a screen reader is already watching when text arrives.',
                '`status="success"` picks the icon and the word "Success". The word is read out, so the meaning does not rely on colour (WCAG 1.4.1, A).',
                'The toast goes to a polite status region. It never takes focus, so the user keeps typing (WCAG 4.1.3, AA; APG Alert: alerts do not affect focus).',
                'The toast closes by itself, which is a time limit (WCAG 2.2.1, A). Never put information the user needs later only in a toast. A toast with an `action`, or with `duration: null`, stays until the user closes it.',
                'Try it: press Save draft.',
              ],
              render: <SaveToast />,
              code: `function SaveButton({ save }) {
  // toasts: the list. show(): add one. dismiss(id): remove one.
  const { toasts, show, dismiss } = useToast();

  return (
    <>
      <Button onClick={() => {
        save();
        // One event, one message. No second banner for the same save.
        show({ status: 'success', message: 'Draft saved.' });
      }}>Save draft</Button>

      {/* Mount once per app. The live regions must exist before text arrives. */}
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </>
  );
}`,
            },
            {
              title: '4 · Banner: a condition of the page',
              when: 'The page or the system is in a state the user should know about, such as offline.',
              explain: [
                'A Banner sits in the page, so it stays until the app removes it. A toast would vanish while the condition is still true.',
                '`status="warning"` shows a warning icon and the word "Warning". The Banner is a `role="status"` region, so a screen reader reads it politely.',
                'Show it from the state, not from an event: when `online` is false, render it. When the user is back online, stop rendering it.',
                'Keep a `role="status"` wrapper in the page all the time and render only the Banner inside it. A live region that is mounted together with its text is announced unreliably (WCAG 4.1.3, AA).',
              ],
              render: <Banner status="warning" title="You are offline">Changes are kept here and sync when you reconnect.</Banner>,
              code: `function OfflineNotice({ online }) {
  // Driven by state. The banner is on screen exactly while the condition is true.
  // The wrapper is always in the page, so the text is an addition to a live region.
  return (
    <div role="status">
      {!online && (
        <Banner status="warning" title="You are offline">
          Changes are kept here and sync when you reconnect.
        </Banner>
      )}
    </div>
  );
}`,
            },
            {
              title: '4 · Banner with an action: a failure to act on',
              when: 'A request failed and the user can fix it, such as a retry.',
              explain: [
                'Do not use a toast here. A toast times out, and Pajamas states it cannot hold actions accessibly.',
                '`urgent` makes the Banner `role="alert"`: a screen reader speaks it at once. Use it only for an error the user must act on now (APG Alert).',
                '`actions` holds the retry button inside the message, in the page, where a keyboard user can reach it.',
                'Move focus to the Banner when it appears. An alert that is mounted together with its text is announced unreliably, and the user must act on it now. Focus on the Banner puts the retry button next in the tab order. This is the one case where the app moves focus for a message.',
                'Keep what the user typed or chose. Say it in the message: "Your file is kept."',
                'Try it: press Upload report, then Try again.',
              ],
              render: <UploadFailure />,
              code: `function UploadStatus({ failed, retry }) {
  // Mounted with its text, an alert is announced unreliably. Focus is the sure way.
  useEffect(() => { if (failed) document.getElementById('upload-failed')?.focus(); }, [failed]);
  if (!failed) return null;
  return (
    // urgent = role="alert", read out at once. Only for an error to act on now.
    <Banner
      id="upload-failed"
      tabIndex={-1}                // focusable by script, not in the tab order
      status="error"
      urgent
      title="We could not upload the report"
      // The action lives in the message. A toast cannot hold it accessibly.
      actions={<Button variant="secondary" onClick={retry}>Try again</Button>}
    >
      The connection dropped. Your file is kept.
    </Banner>
  );
}`,
            },
          ],
        },
        {
          title: 'Messages that stop the user',
          kicker: 'Use a dialog only when the user must answer before going on.',
          examples: [
            {
              title: '2 · Confirmation dialog: a costly action',
              when: 'The user is about to do something that cannot be undone or that costs something.',
              explain: [
                'A confirmation adds friction on purpose. Use it for delete, not for save (Pajamas lists Destructive actions: appropriate friction).',
                '`destructive` draws the confirm as a red danger button before Cancel, and starts keyboard focus on Cancel, the safe choice, so an Enter key press does not delete.',
                '`confirmLabel` names the action and its object: "Delete project", never "OK".',
                'The dialog is `role="alertdialog"`, named by `title` and described by `description`. Focus moves inside when it opens and returns to the Delete button when it closes (APG Alert and Message Dialogs; APG Dialog (Modal); WCAG 2.4.3, A).',
                'After the user confirms, the result is visible in the page, so no second message is needed. The example writes a short status line. Its `role="status"` element is always in the page, and only the text is added.',
                'Try it: press Delete project, then Cancel. Focus returns to the button.',
              ],
              render: <DeleteProject />,
              code: `function DeleteProject({ remove }) {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Delete project</Button>
      {/* Always in the page. Only the text comes and goes. */}
      <Text role="status">{deleted && 'Project deleted.'}</Text>
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}      // Cancel, Escape
        onConfirm={() => { remove(); setOpen(false); setDeleted(true); }}
        title="Delete project Apollo?"
        destructive                           // focus starts on Cancel
        description="The project and its 12 files are deleted. You cannot undo this."
        confirmLabel="Delete project"         // verb and object, never "OK"
        cancelLabel="Cancel"
      />
    </>
  );
}`,
            },
            {
              title: '3 · Alert dialog: a message that blocks',
              when: 'Something happened that the user must read before going on, and there is one answer.',
              explain: [
                'The Alert dialog has one action. For a choice, use the Confirmation dialog.',
                '`actionLabel` names what the button does: "Sign in again".',
                'A dialog interrupts the workflow. APG: an alert dialog "interrupts the user\'s workflow to communicate an important message and acquire a response". If the user could ignore the message, use a Banner instead.',
                '`description` is tied to the dialog with `aria-describedby`, so a screen reader reads it when the dialog opens.',
                'Try it: press Simulate a timeout, then press the action.',
              ],
              render: <SessionExpired />,
              code: `function SessionGuard({ expired, signIn }) {
  return (
    <AlertDialog
      open={expired}
      onClose={signIn}                        // the one action, and Escape
      title="Session expired"
      description="You were signed out after 30 minutes without activity. Your draft is saved."
      actionLabel="Sign in again"             // what the button does
    />
  );
}`,
            },
          ],
        },
        {
          title: 'Help and labels',
          kicker: 'Attached to one control, one item, or one empty area.',
          examples: [
            {
              title: '5 · Tooltip and Popover: help for one control',
              when: 'A control needs a short hint (Tooltip) or richer help with a link (Popover).',
              explain: [
                'A Tooltip takes a string, so it can never hold a link or a button. The control keeps its own name and works without the hint.',
                'The Tooltip opens on hover and on keyboard focus. The user can dismiss it with Escape and move the pointer onto it without closing it (WCAG 1.4.13 Content on Hover or Focus, AA).',
                'Never put essential information in a tooltip. Put it in the page.',
                'A Popover opens on click only, so keyboard and screen reader users can reach what is inside (Pajamas). It is a dialog named by `label`. Escape closes it and returns focus to the trigger.',
                'Try it: hover or tab to Export, then press What is a role?.',
              ],
              render: <FieldHelp />,
              code: `<Stack direction="horizontal" gap={3}>
  {/* Short hint. The button already has the name "Export". */}
  <Tooltip content="Exports the visible rows as CSV">
    <Button variant="secondary">Export</Button>
  </Tooltip>

  {/* Richer help with a link. Opens on click, never on hover. */}
  <Popover
    trigger={<Button variant="tertiary">What is a role?</Button>}
    label="About roles"            // the name of the dialog
  >
    <Text>A role decides what a member can change. Owners manage billing.</Text>
    <Link href="/help/roles">Read the roles guide</Link>
  </Popover>
</Stack>`,
            },
            {
              title: '6 · Badge: a count on an item',
              when: 'An item has a count or a status the user can check when they choose.',
              explain: [
                'A Badge labels. It does not interrupt and it is not a live region.',
                '`count` shows the number. `label` says what it counts, so a screen reader reads "3 unread messages" and not just "3".',
                'A status Badge needs a word as `children`, such as "Overdue", so meaning does not rely on colour (WCAG 1.4.1, A).',
              ],
              render: <InboxBadge />,
              code: `// count: the number. label: what it counts, read out with the number.
<Button variant="secondary">
  Inbox <Badge status="info" count={3} label="unread messages" />
</Button>`,
            },
            {
              title: '7 · Empty state: missing content',
              when: 'A list has no rows, and the area would otherwise be blank.',
              explain: [
                'The Empty state replaces the blank. Read the empty results pattern for the wording and the filters.',
                'Wrap it in `role="status"` when it appears after an action, so a screen reader hears that the list is now empty (WCAG 4.1.3, AA).',
                'Keep the wrapper in the page all the time and render only the Empty state inside it. A live region that is mounted together with its text is announced unreliably.',
                '`headingLevel` sets the outline level without changing the look.',
              ],
              render: <ProjectsEmpty />,
              code: `function Projects({ projects }) {
  return (
    // The region is always in the page. Only its content comes and goes.
    <div role="status">
      {projects.length === 0 && (
        <EmptyState title="You have no projects yet" headingLevel={3}>
          Projects appear here after you create one.
        </EmptyState>
      )}
    </div>
  );
}`,
            },
          ],
        },
      ]}
    />
  ),
};
