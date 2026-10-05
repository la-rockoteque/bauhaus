import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage, LIFECYCLE } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Button } from '../../components/clickables/button/button';
import { Banner } from '../../components/feedback/banner/banner';
import { Spinner } from '../../components/feedback/spinner/spinner';
import { TextField } from '../../components/fields/text-field/text-field';
import { Switch } from '../../components/fields/switch/switch';
import { ConfirmationDialog } from '../../components/overlays/confirmation-dialog/confirmation-dialog';
import { List, ListItem } from '../../components/data-structures/list/list';
import { Icon } from '../../primitives/icon/icon';
import { Stack } from '../../primitives/stack/stack';
import { Text } from '../../primitives/text/text';
import { savingRules } from './saving.rules';

// The pattern is a recipe, not a component: the showcase composes the parts it names.
// The recipe pieces are exported for the test and hidden from the Storybook sidebar.
const meta = { title: 'Patterns/Saving', parameters: { layout: 'fullscreen' }, excludeStories: ['SaveIndicator', 'ManualSave', 'AutosaveSettings', 'NewRecord', 'EditRecord'] } satisfies Meta;

export default meta;

export type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved' | 'failed';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export interface SaveIndicatorProps {
  status: SaveStatus;
  /** A time such as "14:32". Without it, a saved page says "All changes saved". */
  savedAt?: string;
  /** Shown with the failed state. */
  onRetry?: () => void;
  retryId?: string;
}

/** The one page-level indicator. The status region stays in the page; only its content comes and goes. */
export function SaveIndicator({ status, savedAt, onRetry, retryId }: SaveIndicatorProps) {
  return (
    <Stack role="status" direction="horizontal" gap={2} align="center">
      {status === 'unsaved' && <><Icon glyph="edit" size="sm" /><Text as="span" tone="muted">Unsaved changes</Text></>}
      {/* The ring is for the eye. The words carry the state, so the ring is hidden from assistive technology. */}
      {status === 'saving' && <><Spinner aria-hidden="true" label="Saving" size="sm" /><Text as="span" tone="muted">Saving…</Text></>}
      {status === 'saved' && <><Icon glyph="success" size="sm" /><Text as="span" tone="muted">{savedAt ? `Saved at ${savedAt}` : 'All changes saved'}</Text></>}
      {status === 'failed' && (
        <>
          <Icon glyph="error" size="sm" />
          <Text as="span">Not saved</Text>
          <Button id={retryId} variant="secondary" onClick={onRetry}>Retry</Button>
        </>
      )}
    </Stack>
  );
}

/**
 * The state of one manual save. `touch` marks an edit. `save` runs the request once at a time.
 * A failure moves focus to Retry, because the user pressed Save and is waiting for the answer.
 */
function useManualSave<T>(values: T, onSave: (values: T) => Promise<void>, initial: SaveStatus) {
  const uid = useId();
  const retryId = `${uid}-retry`;
  const [status, setStatus] = useState<SaveStatus>(initial);
  const [savedAt, setSavedAt] = useState<string>();
  const busy = useRef(false);
  const edits = useRef(0);
  const focusRetry = useRef(false);
  // A layout effect: focus lands in the same commit that draws Retry.
  useLayoutEffect(() => {
    if (status === 'failed' && focusRetry.current) {
      focusRetry.current = false;
      document.getElementById(retryId)?.focus();
    }
  }, [status, retryId]);
  const touch = () => {
    edits.current += 1;
    setStatus((current) => (current === 'saving' ? current : 'unsaved'));
  };
  const save = async () => {
    if (busy.current) return false; // a second press during the request does nothing
    busy.current = true;
    const sent = edits.current;
    setStatus('saving');
    try {
      await onSave(values);
      setSavedAt(clock());
      // The user typed while the request ran: those edits are not saved yet.
      setStatus(edits.current === sent ? 'saved' : 'unsaved');
      return true;
    } catch {
      focusRetry.current = true;
      setStatus('failed');
      return false;
    } finally {
      busy.current = false;
    }
  };
  return { status, savedAt, retryId, touch, save };
}

export interface ManualSaveProps {
  onSave?: (values: { name: string; email: string }) => Promise<void>;
  /** Draw the page in this state, for a specimen. */
  initialStatus?: SaveStatus;
}

/** Manual save: fields that depend on each other. One Save button, one indicator. */
export function ManualSave({ onSave = () => wait(600), initialStatus = 'idle' }: ManualSaveProps) {
  const [values, setValues] = useState({ name: 'Apollo', email: 'team@example.com' });
  const { status, savedAt, retryId, touch, save } = useManualSave(values, onSave, initialStatus);
  const change = (field: 'name' | 'email', value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    touch();
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    void save();
  };
  return (
    <form onSubmit={submit} noValidate>
      <Stack gap={3}>
        <TextField label="Project name" value={values.name} onChange={(event) => change('name', event.target.value)} />
        <TextField label="Contact email" type="email" value={values.email} onChange={(event) => change('email', event.target.value)} />
        <Stack direction="horizontal" gap={3} align="center">
          <Button type="submit" loading={status === 'saving'}>Save changes</Button>
          <SaveIndicator status={status} savedAt={savedAt} onRetry={() => void save()} retryId={retryId} />
        </Stack>
      </Stack>
    </form>
  );
}

export interface AutosaveSettingsProps {
  onSave?: (values: { name: string; notify: boolean }) => Promise<void>;
  /** The quiet time after the last key before the save is sent. Pajamas: 3 seconds. */
  idleMs?: number;
}

/** Autosave: a setting saves by itself, one field at a time. The newest request wins. */
export function AutosaveSettings({ onSave = () => wait(400), idleMs = 3000 }: AutosaveSettingsProps) {
  const [name, setName] = useState('Ada');
  const [notify, setNotify] = useState(true);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [savedAt, setSavedAt] = useState<string>();
  const latest = useRef({ name: 'Ada', notify: true });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const requestId = useRef(0); // counts requests; only the newest may set the indicator
  const pending = useRef(false); // edits that no request carries yet
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = async () => {
    clearTimeout(timer.current);
    timer.current = undefined;
    pending.current = false;
    const id = ++requestId.current;
    setStatus('saving');
    try {
      await onSave(latest.current);
      if (id !== requestId.current) return; // a newer request exists: ignore this reply
      setSavedAt(clock());
      setStatus(pending.current ? 'unsaved' : 'saved');
    } catch {
      if (id !== requestId.current) return;
      setStatus('failed'); // the value stays in the field
    }
  };
  const edit = (next: Partial<typeof latest.current>, saveNow: boolean) => {
    latest.current = { ...latest.current, ...next };
    pending.current = true;
    if (saveNow) return void run();
    setStatus('unsaved');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void run(), idleMs); // typing: wait until the user pauses
  };
  return (
    <Stack gap={3}>
      <TextField label="Display name" value={name} onChange={(event) => { setName(event.target.value); edit({ name: event.target.value }, false); }} onBlur={() => { if (pending.current) void run(); }} />
      <Switch label="Email me about replies" checked={notify} onChange={(event) => { setNotify(event.target.checked); edit({ notify: event.target.checked }, true); }} />
      <SaveIndicator status={status} savedAt={savedAt} onRetry={() => void run()} />
    </Stack>
  );
}

const DRAFT_KEY = 'bauhaus-saving-draft';
type Draft = { name: string; notes: string };

// Storage can be missing or blocked (private window, full disk). Every access is guarded.
function readDraft(key: string): Draft | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}
function writeDraft(key: string, draft: Draft | null) {
  try {
    if (draft && (draft.name || draft.notes)) window.localStorage.setItem(key, JSON.stringify(draft));
    else window.localStorage.removeItem(key);
  } catch {
    // The draft is a convenience. Without storage the page still works.
  }
}

export interface NewRecordProps {
  storageKey?: string;
  onCreate?: (draft: Draft) => Promise<void>;
}

/** Creation: a record that does not exist yet keeps a draft on this device. Leaving does not warn. */
export function NewRecord({ storageKey = DRAFT_KEY, onCreate = () => wait(600) }: NewRecordProps) {
  const [restored] = useState(() => readDraft(storageKey));
  const [draft, setDraft] = useState<Draft>(restored ?? { name: '', notes: '' });
  const [showRestored, setShowRestored] = useState(restored !== null);
  const nameField = useRef<HTMLInputElement>(null);
  const { status, savedAt, retryId, touch, save } = useManualSave(draft, onCreate, 'idle');
  const change = (field: keyof Draft, value: string) => {
    const next = { ...draft, [field]: value };
    setDraft(next);
    writeDraft(storageKey, next);
    touch();
  };
  const discard = () => {
    writeDraft(storageKey, null);
    setDraft({ name: '', notes: '' });
    setShowRestored(false);
    nameField.current?.focus(); // the Discard button leaves with the Banner; the field stays
  };
  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (await save()) {
      writeDraft(storageKey, null);
      setShowRestored(false);
    }
  };
  return (
    <form onSubmit={(event) => void create(event)} noValidate>
      <Stack gap={3}>
        {showRestored && <Banner status="info" title="Draft restored" actions={<Button variant="secondary" onClick={discard}>Discard</Button>}>We brought back what you typed last time.</Banner>}
        <TextField ref={nameField} label="Project name" value={draft.name} onChange={(event) => change('name', event.target.value)} />
        <TextField label="Notes" value={draft.notes} onChange={(event) => change('notes', event.target.value)} />
        <Stack direction="horizontal" gap={3} align="center">
          <Button type="submit" loading={status === 'saving'}>Create project</Button>
          <SaveIndicator status={status} savedAt={savedAt} onRetry={() => void save()} retryId={retryId} />
        </Stack>
      </Stack>
    </form>
  );
}

export interface EditRecordProps {
  onSave?: (values: { name: string }) => Promise<void>;
  /** Called when the user leaves the page, after the question when changes are unsaved. */
  onLeave?: () => void;
  initialStatus?: SaveStatus;
  /** Open the question, for a specimen. */
  initialAsking?: boolean;
  /** Draw the dialog in the flow, for a specimen. */
  inline?: boolean;
}

/** Update: an existing record. Leaving with unsaved changes asks first, and the browser prompt guards the tab. */
export function EditRecord({ onSave = () => wait(600), onLeave = () => undefined, initialStatus = 'idle', initialAsking = false, inline = false }: EditRecordProps) {
  const [values, setValues] = useState({ name: 'Apollo' });
  const [asking, setAsking] = useState(initialAsking);
  const [left, setLeft] = useState(false);
  const { status, savedAt, retryId, touch, save } = useManualSave(values, onSave, initialStatus);
  const dirty = status === 'unsaved' || status === 'saving' || status === 'failed';
  // The browser prompt exists only while something is unsaved. The cleanup removes it.
  useEffect(() => {
    if (!dirty || left) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true; // legacy browsers
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, left]);
  const go = () => {
    setAsking(false);
    setLeft(true);
    onLeave();
  };
  if (left) return <Text>You left the page.</Text>;
  return (
    <Stack gap={3}>
      <TextField label="Project name" value={values.name} onChange={(event) => { setValues({ name: event.target.value }); touch(); }} />
      <Stack direction="horizontal" gap={3} align="center">
        <Button loading={status === 'saving'} onClick={() => void save()}>Save changes</Button>
        <Button variant="tertiary" onClick={() => (dirty ? setAsking(true) : go())}>Back to projects</Button>
        <SaveIndicator status={status} savedAt={savedAt} onRetry={() => void save()} retryId={retryId} />
      </Stack>
      <ConfirmationDialog
        open={asking}
        inline={inline}
        destructive
        title="Leave without saving?"
        description="You have changes that are not saved. If you leave now, you lose them."
        confirmLabel="Leave"
        cancelLabel="Keep editing"
        onClose={() => setAsking(false)}
        onConfirm={go}
      />
    </Stack>
  );
}

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Saving and feedback"
      layer="Pattern"
      plain="Saving should never be a guess. The page tells you, in one fixed place, whether your work is safe: not yet, in progress, saved, or lost and what to do."
      precise="Pattern · manual Save or autosave chosen by what the fields do, one page-level save indicator in a status region, a draft for a new record and a leave warning for an existing one · composes Stack, Icon, Text, Spinner, Button, Banner and ConfirmationDialog; has no style of its own."
      usedFor="Any screen that edits data: a settings page, a profile form, a long editor, a create form."
      tokens={{ mode: 'consumed', note: 'None of its own. Layout comes from Stack. Colour, type and spacing come from the components it composes.', rows: [] }}
      stage={{
        render: <ManualSave initialStatus="saved" />,
        parts: [
          { n: 1, label: 'Fields', note: 'a manual save keeps fields that depend on each other together', target: '.ds-field', at: 'top-start' },
          { n: 2, label: 'Save button', note: 'uses loading while the request runs; never disabled', target: 'button[type="submit"]', at: 'bottom-start' },
          { n: 3, label: 'Indicator', note: 'one role="status" region for the page; always in the page, only its content changes', target: '.ds-stack[role="status"]', at: 'bottom-end' },
        ],
      }}
      api={[
        { label: 'Manual save', value: 'A Save button with `loading`. The indicator shows Saving…, then Saved at a time, or Not saved with Retry.' },
        { label: 'Autosave', value: 'Per field. On blur or after the user stops typing, at once for a click. The newest request decides the indicator.' },
        { label: 'Creation', value: 'Keep a draft on the device. On return, a Banner “Draft restored” with Discard. No leave warning.' },
        { label: 'Update', value: 'A destructive ConfirmationDialog “Leave without saving?” for in-app navigation. The browser prompt only while changes are unsaved.' },
      ]}
      states={{
        expect: LIFECYCLE,
        note: 'The pattern maps the lifecycle onto the save indicator. Unsaved changes sits between nothing and loading; it is shown under Try it. Interaction states come from the components the pattern composes.',
        cells: [
          { id: 'nothing', status: 'designed', label: 'Nothing (no changes)', render: <ManualSave />, trigger: 'the user has not edited anything', note: 'The indicator region is in the page and empty. A page with nothing to save says nothing.' },
          { id: 'loading', status: 'designed', label: 'Loading (saving)', render: <ManualSave initialStatus="saving" />, trigger: 'Save pressed, request running', note: 'The Save button is loading and keeps its size. The indicator says Saving…. The button stays enabled but ignores presses.' },
          { id: 'none', status: 'n/a', reason: 'The pattern saves a record that exists, or a new one. An empty list is an empty result, not part of this pattern.' },
          { id: 'one', status: 'n/a', reason: 'One field or one form is the base case, shown as nothing. It is not a separate state.' },
          { id: 'some', status: 'n/a', reason: 'The indicator is one for the whole page, so the number of changed fields does not change it.' },
          { id: 'too-many', status: 'n/a', reason: 'The indicator is a short fixed text. A long form scrolls, and the indicator stays beside the Save button.' },
          { id: 'incorrect', status: 'designed', label: 'Incorrect (not saved)', render: <ManualSave initialStatus="failed" />, trigger: 'the request rejected', note: 'The indicator says Not saved and offers Retry. The values stay in the fields. After a manual save, focus moves to Retry.' },
          { id: 'correct', status: 'n/a', reason: 'A saved value has no half-way. Valid input before a save is a form-validation case; see patterns/form-validation.' },
          { id: 'done', status: 'designed', label: 'Done (saved)', render: <ManualSave initialStatus="saved" />, trigger: 'the request resolved', note: 'The indicator says All changes saved, or Saved at a time. It stays until the next edit.' },
        ],
      }}
      extra={[
        {
          title: 'Pick the save model',
          kicker: 'Ask first: do the fields depend on each other, or does saving cost or send something?',
          content: (
            <List ordered divided>
              <ListItem title="Fields depend on each other: manual save" description="One Save button for the form. Example: a start date and an end date, a shipping method and an address." />
              <ListItem title="Saving costs money, sends something or has side effects: manual save" description="The user decides when it happens. Example: publish, invoice, send an email." />
              <ListItem title="A setting, a preference or a draft: autosave, one field at a time" description="On blur or after the user stops typing. A switch or a checkbox saves at once." />
              <ListItem title="When in doubt, save manually" description="GitLab Pajamas keeps manual save as the default and warns against autosave for data with financial, security or privacy impact." />
            </List>
          ),
        },
        {
          title: 'Try it',
          kicker: 'Four working recipes. Edit a field, then watch the one indicator beside it.',
          content: (
            <Stack gap={5}>
              <ManualSave />
              <AutosaveSettings />
              <NewRecord storageKey="bauhaus-saving-draft-showcase" />
              <EditRecord />
            </Stack>
          ),
        },
      ]}
      dos={[
        { text: 'Choose manual or autosave by what the fields do.', basis: 'GitLab Pajamas; project decision' },
        { text: 'Show one indicator for the page, in a status region that is always in the page.', basis: 'WCAG 4.1.3 (AA)' },
        { text: 'Keep the value and offer Retry when a save fails.', basis: 'Nielsen 9' },
        { text: 'Keep a draft for a new record. Warn before leaving an existing one with unsaved changes.', basis: 'Nielsen 3, 5; GitLab Pajamas' },
        { text: 'Let the newest request win.', basis: 'Nielsen 1' },
      ]}
      donts={[
        { text: 'Show a toast for every save.', basis: 'Project decision', rule: 'saving.one-indicator' },
        { text: 'Send a request on every keystroke.', basis: 'GitLab Pajamas', rule: 'saving.autosave-timing' },
        { text: 'Mount the status region together with its text.', basis: 'WCAG 4.1.3 (AA)', rule: 'saving.status-announced' },
        { text: 'Disable the Save button while it runs.', basis: 'Nielsen 1', rule: 'saving.manual-guarded' },
        { text: 'Warn on leave when nothing is unsaved.', basis: 'Nielsen 5', rule: 'saving.warn-on-update' },
      ]}
      guide="patterns-saving--docs"
      guideName="Saving and feedback"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Saving and feedback" layer="Pattern" rules={savingRules} guide="patterns-saving--docs" guideName="Saving and feedback" />,
};

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Saving and feedback"
      layer="Pattern"
      imports={`import { Banner, Button, ConfirmationDialog, Icon, Spinner, Stack, Switch, Text, TextField } from '@bauhaus/design-system';
import { useEffect, useRef, useState } from 'react';`}
      intro={[
        'A page that edits data must tell the user whether the work is safe. This pattern shows one small indicator for the whole page, in the same place every time.',
        'The pattern has no component of its own. You write the small components that hold the state and compose `Stack`, `Icon`, `Spinner`, `Button`, `Banner` and `ConfirmationDialog`. If you build the same indicator on a third screen, ask for a component (see the guide, Component gaps).',
        'There are two ways to save. In a "manual save" the user presses a button. In an "autosave" the page saves by itself. The first example shows the indicator. The next two show each way to save.',
        'A "status region" is an element with `role="status"`. A screen reader reads out its text when the text changes, and focus does not move (WCAG 4.1.3 Status Messages, AA). The region must already be in the page before the text arrives.',
        'A "draft" is a copy of unsaved work kept on the user\'s device. "Debounce" means wait until the user pauses before you act. Names such as `saveProject` stand for your own code.',
      ]}
      guide="patterns-saving--docs"
      guideName="Saving and feedback"
      groups={[
        {
          title: 'The indicator',
          kicker: 'One place, five states. Words and icons, never colour alone.',
          examples: [
            {
              title: 'Unsaved, saving, saved, not saved',
              when: 'Every screen that saves. Build it once and place it beside the Save button, or in the page header.',
              explain: [
                'The outer `Stack` has `role="status"` and is always in the page. Only its children change. A region that appears together with its text is announced unreliably (WCAG 4.1.3, AA; APG Alert).',
                'Each state has an icon and words: "Unsaved changes", "Saving…", "All changes saved" or "Saved at 14:32", and "Not saved". Colour alone is never the cue (WCAG 1.4.1, A).',
                'The `Spinner` is hidden from assistive technology with `aria-hidden`. The words "Saving…" already say it, and a second status inside the first would be read twice.',
                'The failed state holds a Retry button inside the region. The value the user typed is not touched (Nielsen heuristic 9, help users recover from errors).',
                'There is no toast for a save. One event gets one message in one place (patterns/messaging).',
                'The result below shows all five states in turn. Idle is empty on purpose.',
              ],
              render: (
                <Stack gap={2}>
                  {(['idle', 'unsaved', 'saving', 'saved', 'failed'] as const).map((state) => <SaveIndicator key={state} status={state} savedAt={state === 'saved' ? '14:32' : undefined} onRetry={() => undefined} />)}
                </Stack>
              ),
              code: `function SaveIndicator({ status, savedAt, onRetry }) {
  return (
    // The region is always in the page. Only what is inside it comes and goes.
    <Stack role="status" direction="horizontal" gap={2} align="center">
      {status === 'unsaved' && <><Icon glyph="edit" size="sm" /><Text as="span" tone="muted">Unsaved changes</Text></>}
      {/* The ring is for the eye; the words carry the state, so hide the ring. */}
      {status === 'saving' && <><Spinner aria-hidden="true" label="Saving" size="sm" /><Text as="span" tone="muted">Saving…</Text></>}
      {status === 'saved' && <><Icon glyph="success" size="sm" /><Text as="span" tone="muted">{savedAt ? 'Saved at ' + savedAt : 'All changes saved'}</Text></>}
      {status === 'failed' && (
        <>
          <Icon glyph="error" size="sm" />
          <Text as="span">Not saved</Text>
          <Button variant="secondary" onClick={onRetry}>Retry</Button>
        </>
      )}
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Manual save and autosave',
          kicker: 'Manual when fields depend on each other or saving has effects. Autosave for a setting.',
          examples: [
            {
              title: 'Manual save: a Save button with loading',
              when: 'Fields depend on each other, saving costs money, sends something or has side effects.',
              explain: [
                'The `Button` uses `loading`. It keeps its label and width, shows the work, and ignores presses (Nielsen heuristic 1, visibility of system status). It is not `disabled`, so a keyboard user does not lose their place (patterns/form-validation).',
                '`busy` is a `ref`, not state. The guard works even for two presses in the same moment, and Enter in a field also submits the form.',
                '`edits` counts changes. If the user types while the request runs, the page says "Unsaved changes" again instead of "Saved".',
                'On failure, focus moves to Retry. The user pressed Save and waits for the answer, so the result must be easy to reach. The region is already in the page, so a screen reader reads "Not saved" (messaging: focus rule for an error that needs action).',
                'Try it: change a field and press Save changes.',
              ],
              render: <ManualSave />,
              code: `const busy = useRef(false);   // a ref: it changes at once, with no render
const edits = useRef(0);      // counts changes, to catch typing during the request

async function save() {
  if (busy.current) return;   // a second press does nothing
  busy.current = true;
  const sent = edits.current;
  setStatus('saving');
  try {
    await saveProject(values);               // your request
    setSavedAt(clock());
    // Typed while the request ran? Then those edits are not saved yet.
    setStatus(edits.current === sent ? 'saved' : 'unsaved');
  } catch {
    setStatus('failed');                     // the values stay in the fields
    focusRetryAfterRender();                 // focus the Retry button once it exists
  } finally {
    busy.current = false;
  }
}

<form onSubmit={(e) => { e.preventDefault(); save(); }}>
  <TextField label="Project name" value={values.name} onChange={(e) => { setValues({ ...values, name: e.target.value }); edits.current++; setStatus('unsaved'); }} />
  {/* loading, never disabled */}
  <Button type="submit" loading={status === 'saving'}>Save changes</Button>
  <SaveIndicator status={status} savedAt={savedAt} onRetry={save} />
</form>`,
            },
            {
              title: 'Autosave: on blur or after a pause, newest request wins',
              when: 'A setting, a preference or a draft. Each field saves by itself.',
              explain: [
                'Typing waits for a pause: `setTimeout` is reset on every key, so six keys make one request. Pajamas saves 3 seconds after the last key, or on blur (GitLab Pajamas, Saving and feedback). Pajamas gives 250 ms and 500 ms for search and validation, not for saving.',
                'A blur sends the pending save at once. A blur with nothing changed sends nothing. A `Switch` is a click, so it saves at once.',
                '`requestId` counts requests. When a reply comes back, the code compares its id with the newest. An older reply, a success or a failure, is ignored. Without this, a slow old answer could say "Saved" while a newer save runs (Nielsen heuristic 1).',
                '`pending` is true while edits wait for a request. If the user types during a request, the page says "Unsaved changes" and not "Saved".',
                'On failure the value stays in the field and focus stays where the user types. The indicator says "Not saved" with Retry. Moving focus here would break the user\'s typing. Retry sends the latest value.',
                'Do not use autosave for money, security or privacy changes (Pajamas). Use a manual save.',
                'Try it: type a name and wait 3 seconds. Or tab away.',
              ],
              render: <AutosaveSettings />,
              code: `const timer = useRef();
const requestId = useRef(0);   // counts requests
const pending = useRef(false); // edits that no request carries yet

async function run() {
  clearTimeout(timer.current);
  pending.current = false;
  const id = ++requestId.current;
  setStatus('saving');
  try {
    await saveSettings(latest.current);
    if (id !== requestId.current) return;   // a newer request exists: ignore this reply
    setStatus(pending.current ? 'unsaved' : 'saved');
  } catch {
    if (id !== requestId.current) return;
    setStatus('failed');                    // keep the value; Retry calls run()
  }
}

// Typing: wait for a pause. A new key restarts the wait.
function onType(value) {
  latest.current = { ...latest.current, name: value };
  pending.current = true;
  setStatus('unsaved');
  clearTimeout(timer.current);
  timer.current = setTimeout(run, 3000);
}

<TextField label="Display name" onChange={(e) => onType(e.target.value)} onBlur={() => pending.current && run()} />
{/* A click saves at once */}
<Switch label="Email me about replies" checked={notify} onChange={(e) => { setNotify(e.target.checked); latest.current.notify = e.target.checked; run(); }} />`,
            },
          ],
        },
        {
          title: 'Leaving with unsaved changes',
          kicker: 'A new record keeps a draft. An existing record asks first.',
          examples: [
            {
              title: 'Creation: keep a draft, restore it, offer Discard',
              when: 'A new record that does not exist yet: a new project, a new post.',
              explain: [
                'Every change writes a draft to `localStorage`. It is a copy on this device, not a request. Nothing is lost if the tab closes.',
                'Storage can be blocked or full, so every read and write sits in `try/catch`. Without storage the page still works.',
                'On return, a `Banner` says "Draft restored" and offers Discard. The user always sees that something was brought back and can start clean (Nielsen heuristic 3, user control and freedom).',
                'Discard clears the draft and the fields, hides the Banner and moves focus to the first field. The button the user pressed is gone, so focus must land on an element that exists (WCAG 2.4.3, A).',
                'There is no leave warning here. The draft already protects the work. After a successful create, the draft is removed.',
                'The sources read for this pattern do not prescribe drafts. This is a project decision.',
                'Try it: type in a field, reload the page, then press Discard.',
              ],
              render: <NewRecord storageKey="bauhaus-saving-draft-example" />,
              code: `// Every storage access is guarded: it can be blocked or full.
function readDraft() {
  try { return JSON.parse(localStorage.getItem('draft') ?? 'null'); } catch { return null; }
}
function writeDraft(draft) {
  try {
    if (draft) localStorage.setItem('draft', JSON.stringify(draft));
    else localStorage.removeItem('draft');
  } catch { /* a draft is a convenience; the page works without it */ }
}

const [restored] = useState(readDraft);                 // read once, on the first render
const [draft, setDraft] = useState(restored ?? { name: '' });
const [showRestored, setShowRestored] = useState(restored !== null);

function change(name) {
  const next = { ...draft, name };
  setDraft(next);
  writeDraft(next);                                      // a local copy; no request
}

{showRestored && (
  <Banner status="info" title="Draft restored" actions={<Button variant="secondary" onClick={discard}>Discard</Button>}>
    We brought back what you typed last time.
  </Banner>
)}

async function create() {
  await createProject(draft);
  writeDraft(null);                                      // saved: the draft is no longer needed
}`,
            },
            {
              title: 'Update: warn before leaving',
              when: 'An existing record, or a save with side effects.',
              explain: [
                'The page knows it is "dirty": there are changes that no save carries. Failed and running saves count as dirty.',
                'In-app navigation opens a `ConfirmationDialog` with `destructive`. The title asks "Leave without saving?", the confirm says "Leave", and Cancel says "Keep editing". Focus starts on the safe choice (patterns/destructive-actions). Pajamas asks the same question in a modal when the user leaves before the changes are saved (GitLab Pajamas, Saving and feedback).',
                'The tab closing is a browser event. The `beforeunload` listener calls `preventDefault()`, and the browser shows its own prompt. The text cannot be changed (MDN, beforeunload event).',
                'The listener exists only while the page is dirty, and the effect cleanup removes it. MDN recommends listening only when there are unsaved changes, and Firefox does not cache a page that has a listener.',
                'When nothing is unsaved, "Back to projects" leaves at once. A question with nothing to protect trains users to click through (Nielsen heuristic 5).',
                'Your router needs a way to block navigation. Call `setAsking(true)` from that hook. The recipe uses a button to stand in for it.',
                'Try it: change the name and press Back to projects.',
              ],
              render: <EditRecord />,
              code: `const dirty = status === 'unsaved' || status === 'saving' || status === 'failed';

// The browser prompt exists only while something is unsaved.
useEffect(() => {
  if (!dirty) return;
  const warn = (event) => {
    event.preventDefault();       // the browser shows its own prompt
    event.returnValue = true;     // legacy browsers
  };
  window.addEventListener('beforeunload', warn);
  return () => window.removeEventListener('beforeunload', warn);  // gone when clean
}, [dirty]);

// In-app navigation: ask only when dirty.
<Button variant="tertiary" onClick={() => (dirty ? setAsking(true) : leave())}>Back to projects</Button>

<ConfirmationDialog
  open={asking}
  destructive                       // danger confirm first; focus starts on the safe choice
  title="Leave without saving?"     // the question
  description="You have changes that are not saved. If you leave now, you lose them."  // the cost
  confirmLabel="Leave"
  cancelLabel="Keep editing"
  onClose={() => setAsking(false)}
  onConfirm={leave}
/>`,
            },
          ],
        },
      ]}
    />
  ),
};
