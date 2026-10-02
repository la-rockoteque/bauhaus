import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Banner } from '../banner/banner';
import { Button } from '../../clickables/button/button';
import { ToastRegion } from './toast';
import type { ToastData, ToastStatus } from './toast';
import { toastRules } from './toast.rules';
import { useToast } from './use-toast';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Feedback/Toast', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

/** A region that stays in the flow, so a specimen does not fly to the corner of the viewport. */
function Specimen({ initial, max, force }: { initial: readonly ToastData[]; max?: number; force?: 'hover' | 'focus' }) {
  const [toasts, setToasts] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);
  // A grid cell cannot hover: replay the state on the real element.
  useEffect(() => {
    const root = ref.current;
    if (force === 'hover') root?.querySelector('.ds-toast')?.setAttribute('data-paused', '');
    if (force === 'focus') root?.querySelector('.ds-toast__action')?.classList.add('doc-force-focus');
  }, [force]);
  return (
    <div ref={ref} style={{ inlineSize: '100%', display: 'grid', justifyItems: 'center', gap: 'var(--ds-space-3)' }}>
      <ToastRegion toasts={toasts} onDismiss={(id) => setToasts((list) => list.filter((toast) => toast.id !== id))} position="static" max={max} />
      {toasts.length === 0 && <Button variant="secondary" onClick={() => setToasts(initial)}>Show the toast again</Button>}
    </div>
  );
}

function TryIt() {
  const { toasts, show, dismiss } = useToast();
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)', justifyItems: 'start' }}>
      <div style={{ display: 'flex', gap: 'var(--ds-space-3)', flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={() => show({ status: 'success', message: 'Draft saved.' })}>Show a success (5 s)</Button>
        <Button variant="secondary" onClick={() => show({ status: 'error', title: 'Upload failed', message: 'report.pdf is larger than 10 MB.' })}>Show an error</Button>
        <Button variant="secondary" onClick={() => show({ message: 'Conversation archived.', action: { label: 'Undo', onAction: () => {} } })}>Show one with an action</Button>
      </div>
      <ToastRegion toasts={toasts} onDismiss={dismiss} position="static" />
    </div>
  );
}

const STATUSES = ['info', 'success', 'warning', 'error'] as const satisfies readonly ToastStatus[];
const persistent = { duration: null } as const;
const sample = (status: ToastData['status'], message: ReactNode, extra: Partial<ToastData> = {}): ToastData => ({ id: `${status}-${String(message).length}`, status, message, ...persistent, ...extra });

const many: ToastData[] = [
  sample('info', 'Export started.', { id: 'm1' }),
  sample('success', 'Draft saved.', { id: 'm2' }),
  sample('success', 'Photo added to the album.', { id: 'm3' }),
  sample('info', 'Two people joined the room.', { id: 'm4' }),
  sample('warning', 'Storage is almost full.', { id: 'm5' }),
];

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Toast"
      layer="Component"
      family="Feedback"
      plain="A toast is a small message that slides in to say that something happened, such as 'Draft saved', and goes away by itself. It never grabs your keyboard focus."
      precise="Component in the feedback family · a hand-written pair of live regions (polite and assertive) that hold a stack of short-lived messages · useToast holds the list · not the only place for an error, and not for a decision."
      usedFor="Confirming a low-stakes result, such as saved, sent, archived, copied, and offering one undo."
      tokens={{
        mode: 'consumed',
        note: 'The toast has no component tokens.',
        rows: [
          { name: 'overlay.surface · overlay.border', tier: 'role', use: 'Fill and soft edge of the toast', swatch: '--ds-overlay-surface' },
          { name: 'border.strong', tier: 'role', use: 'Edge while the timer is paused (hover or focus)', swatch: '--ds-border-strong' },
          { name: 'status.info · success · warning · error', tier: 'role', use: 'Icon colour, one per status', swatch: '--ds-status-info' },
          { name: 'status.error-border', tier: 'role', use: 'Edge of an error toast', swatch: '--ds-status-error-border' },
          { name: 'text.default · text.inverse · surface.inverse', tier: 'role', use: 'Message text; the "+N more" chip', swatch: '--ds-surface-inverse' },
          { name: 'shadow.2', tier: '2', use: 'Elevation of the toast' },
          { name: 'radius.overlay · radius.pill', tier: '2', use: 'Toast corners; the "+N more" chip' },
          { name: 'size.overlay.sm', tier: '2', use: 'Maximum inline size, 20rem' },
          { name: 'motion.duration.base · motion.ease.enter · motion.ease.exit', tier: '2', use: 'Enter and exit' },
          { name: 'z.toast', tier: '2', use: 'Stacking of the region' },
          { name: 'space.inset.sm · space.inset.md · space.inline.md · space.stack.sm', tier: '2', use: 'Padding, icon gap, gap between toasts' },
        ],
      }}
      stage={{
        // The key remounts the specimen, so a new control value replaces the toast it holds.
        render: (args) => (
          <Specimen
            key={`${String(args['ToastData status'])}|${String(args['ToastData title'])}|${String(args['ToastData message'])}`}
            initial={[sample(args['ToastData status'] as ToastStatus, String(args['ToastData message']), { id: 'an', title: String(args['ToastData title']) || undefined, action: { label: 'Undo', onAction: () => {} } })]}
          />
        ),
        parts: [
          { n: 1, label: 'Live region', note: 'role status or alert, always in the page', target: '.ds-toast-region__live', at: 'top-start' },
          { n: 2, label: 'Icon', note: 'status glyph with a spoken name', target: '.ds-toast__icon', at: 'top-start' },
          { n: 3, label: 'Message', note: 'with an optional title', target: '.ds-toast__message' },
          { n: 4, label: 'Action', note: 'optional; makes the toast persistent', target: '.ds-toast__action', at: 'bottom-end' },
          { n: 5, label: 'Close button', note: 'named, 32px', target: '.ds-toast > .ds-icon-button', at: 'top-end' },
        ],
      }}
      specs={[
        { label: 'Width', value: 'Up to size.overlay.sm, 20rem, fills a narrow screen' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-toast', token: 'space.inset.md' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-toast', token: 'space.inset.sm' },
        { label: 'Gap', property: 'gap', target: '.ds-toast', token: 'space.inline.md' },
        { label: 'Radius', property: 'radius', target: '.ds-toast', token: 'radius.overlay' },
        { label: 'Position', value: 'Fixed at the bottom inline end, z.toast; static for a specimen' },
        { label: 'Time on screen', value: '5000 ms by default, set per region or per toast; null or an action keeps it' },
        { label: 'Pause', value: 'While hovered or holding focus; resumes with the time left' },
        { label: 'Stack', value: 'At most 3 shown (max); "+N more" for the rest' },
        { label: 'Motion', value: 'Fade and 8px rise, base duration; fade only under reduced motion' },
      ]}
      api={[
        { label: 'ToastRegion toasts · onDismiss', value: 'The list to show and the callback that removes an id.' },
        { label: 'ToastRegion duration · max · dismissLabel · moreLabel · position', value: 'Default time in ms, most toasts at once, text of the close button, text for waiting toasts, "fixed" or "static".' },
        { label: 'ToastData status', value: '"info" | "success" | "warning" | "error".', control: { kind: 'select', options: STATUSES, value: 'success' } },
        { label: 'ToastData title', value: 'An optional title above the message.', control: { kind: 'text', value: 'Archived' } },
        { label: 'ToastData message', value: 'The message.', control: { kind: 'text', value: 'Conversation archived.' } },
        { label: 'ToastData', value: 'The other fields: id, action { label, onAction }, duration (ms or null), statusLabel.' },
        { label: 'useToast()', value: 'Returns { toasts, show, dismiss }. show(toast) returns the id.' },
      ]}
      states={{
        note: 'Every specimen here is persistent so it stays for you to inspect. Close one to see the exit.',
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'With no toast the two live regions stay in the page and are empty. Nothing shows.' },
          { id: 'loading', status: 'n/a', reason: 'A toast holds a finished result. Waiting is a spinner or a progress bar.' },
          { id: 'none', status: 'n/a', reason: 'The region holds no collection to show empty.' },
          { id: 'one', status: 'n/a', reason: 'One toast is the Some cell.' },
          { id: 'some', status: 'designed', label: 'Some (title, message, action)', render: <Specimen initial={[sample('info', 'The file moves to the trash for 30 days.', { id: 'some', title: 'Moved to trash', action: { label: 'Undo', onAction: () => {} } })]} />, trigger: 'show({ title, message, action })', note: 'An action keeps the toast on screen.' },
          { id: 'too-many', status: 'designed', label: 'Too many (stacked)', render: <Specimen initial={many} max={3} />, trigger: 'more than max toasts', note: 'Three show. The rest wait and appear as these close.' },
          { id: 'incorrect', status: 'designed', label: 'Incorrect (error)', render: <Specimen initial={[sample('error', 'report.pdf is larger than 10 MB. Choose a smaller file.', { id: 'err', title: 'Upload failed' })]} />, trigger: 'status="error"', note: 'Assertive region. The error also stays in the form.' },
          { id: 'correct', status: 'designed', label: 'Correct (success)', render: <Specimen initial={[sample('success', 'Draft saved.', { id: 'ok' })]} />, trigger: 'status="success"' },
          { id: 'done', status: 'designed', label: 'Done (dismissed)', render: <Specimen initial={[sample('info', 'Close this toast to see it leave.', { id: 'done' })]} />, trigger: 'close button, or the timer', note: 'Exit: fade and drop, then the id leaves the list.' },
          {
            id: 'default',
            status: 'designed',
            label: 'Default (four statuses)',
            render: <Specimen initial={[sample('info', 'A new version is available.', { id: 'd1' }), sample('success', 'Draft saved.', { id: 'd2' }), sample('warning', 'Storage is almost full.', { id: 'd3' }), sample('error', 'The export failed.', { id: 'd4' })]} />,
            trigger: 'status',
            note: 'Icon shape and word differ, not only colour.',
          },
          { id: 'hover', status: 'designed', label: 'Hover (timer paused)', render: <Specimen force="hover" initial={[sample('info', 'The timer waits while you point at this toast.', { id: 'hov' })]} />, trigger: 'pointer over the toast', note: 'Stronger edge. The timer stops and resumes with the time left.' },
          { id: 'focus-visible', status: 'designed', label: 'Focus-visible (on the action)', render: <Specimen force="focus" initial={[sample('info', 'Message archived.', { id: 'foc', action: { label: 'Undo', onAction: () => {} } })]} />, trigger: ':focus-visible on a button inside', note: 'Forced by .doc-force-focus. Focus inside also pauses the timer. A toast never takes focus itself.' },
          { id: 'active', status: 'n/a', reason: 'The toast is not pressable. Its buttons carry their own pressed state.' },
          { id: 'disabled', status: 'n/a', reason: 'A message cannot be disabled. It leaves the list.' },
          { id: 'selected', status: 'n/a', reason: 'A toast is not selectable.' },
        ],
      }}
      extra={[{ title: 'Try it', kicker: 'Live', content: <TryIt /> }]}
      dos={[
        { text: 'Keep the message short and put the result first.', basis: 'Nielsen 8' },
        { text: 'Keep a toast with an action until the user closes it.', basis: 'WCAG 2.2.1 (A)', },
        { text: 'Pause the timer while the toast is hovered or focused.', basis: 'WCAG 2.2.1 (A); 1.4.13 (AA)' },
        { text: 'Send errors to the assertive region and repeat them where the user can find them.', basis: 'WCAG 4.1.3 (AA); Nielsen 9' },
      ]}
      donts={[
        { text: 'Move focus to a toast.', basis: 'WCAG 3.2.1 (A); 4.1.3 (AA)', rule: 'toast.no-focus-steal' },
        { text: 'Auto-close a toast that holds an action.', basis: 'WCAG 2.2.1 (A)', rule: 'toast.no-timer-with-action' },
        { text: 'Let a timer run while the pointer or focus is inside.', basis: 'WCAG 2.2.1 (A)', rule: 'toast.pausable' },
        { text: 'Keep the only copy of an error in a toast.', basis: 'WCAG 3.3.1 (A)', rule: 'toast.not-sole-error' },
        { text: 'Show the status by colour alone.', basis: 'WCAG 1.4.1 (A)', rule: 'toast.status-not-colour-alone' },
        { text: 'Slide the toast in under reduced motion.', basis: 'WCAG 2.3.3 (AAA)', rule: 'toast.reduced-motion' },
      ]}
      guide="feedback-toast--docs"
      guideName="Toast"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Toast" layer="Component" family="Feedback" rules={toastRules} guide="feedback-toast--docs" guideName="Toast" />,
};

type DemoToast = Omit<ToastData, 'id'>;

/** Buttons that raise toasts. The region stays in the flow here (static); in an app it keeps its default fixed corner. */
function ToastDemo({ buttons, region }: { buttons: readonly { label: string; toasts: readonly DemoToast[] }[]; region?: { max?: number; duration?: number; dismissLabel?: string; moreLabel?: (count: number) => string } }) {
  const { toasts, show, dismiss } = useToast();
  return (
    <Stack gap={3} align="start">
      <Stack direction="horizontal" gap={3} wrap>
        {buttons.map((button) => (
          <Button key={button.label} variant="secondary" onClick={() => button.toasts.forEach((toast) => show(toast))}>{button.label}</Button>
        ))}
      </Stack>
      <ToastRegion toasts={toasts} onDismiss={dismiss} position="static" {...region} />
    </Stack>
  );
}

const DemoShowContext = createContext<(toast: DemoToast) => string>(() => '');

/** The provider pattern: the hook and the one region live here, near the root. */
function DemoToastProvider({ children }: { children: ReactNode }) {
  const { toasts, show, dismiss } = useToast();
  return (
    <DemoShowContext.Provider value={show}>
      {children}
      <ToastRegion toasts={toasts} onDismiss={dismiss} position="static" />
    </DemoShowContext.Provider>
  );
}

/** A component deep in the tree. It never sees the list or the region. */
function CopyLinkButton() {
  const show = useContext(DemoShowContext);
  return <Button variant="secondary" onClick={() => show({ status: 'success', message: 'Link copied.' })}>Copy link</Button>;
}

/** Archive shows a toast with Undo. Pressing Undo restores the item and shows a second toast. */
function ArchiveWithUndo() {
  const { toasts, show, dismiss } = useToast();
  const [archived, setArchived] = useState(false);
  const archive = () => {
    setArchived(true);
    show({
      message: 'Conversation archived.',
      action: {
        label: 'Undo',
        onAction: () => {
          setArchived(false);
          show({ status: 'success', message: 'Archive undone.' });
        },
      },
    });
  };
  return (
    <Stack gap={3} align="start">
      <Text as="p">{archived ? 'Conversation: archived' : 'Conversation: in your inbox'}</Text>
      <Button variant="secondary" onClick={archive} disabled={archived}>Archive</Button>
      <ToastRegion toasts={toasts} onDismiss={dismiss} position="static" />
    </Stack>
  );
}

/** A toast stays while work runs, then closes by id. A second toast reports the result. */
function CloseEarly() {
  const { toasts, show, dismiss } = useToast();
  const start = () => {
    const id = show({ message: 'Export started.', duration: null });
    window.setTimeout(() => {
      dismiss(id);
      show({ status: 'success', message: 'Export ready.' });
    }, 2000);
  };
  return (
    <Stack gap={3} align="start">
      <Button variant="secondary" onClick={start}>Start export</Button>
      <ToastRegion toasts={toasts} onDismiss={dismiss} position="static" />
    </Stack>
  );
}

/** Three persistent toasts and a button that closes every one of them. */
function ClearAll() {
  const { toasts, show, dismiss } = useToast();
  return (
    <Stack gap={3} align="start">
      <Stack direction="horizontal" gap={3} wrap>
        <Button variant="secondary" onClick={() => show({ message: `Photo ${toasts.length + 1} added.`, duration: null })}>Add a photo</Button>
        <Button variant="tertiary" onClick={() => toasts.forEach((toast) => dismiss(toast.id))} disabled={toasts.length === 0}>Clear all</Button>
      </Stack>
      <ToastRegion toasts={toasts} onDismiss={dismiss} position="static" />
    </Stack>
  );
}

/** A failed save raises an error toast and also keeps the error on the page, because a toast vanishes. */
function SaveFailure() {
  const { toasts, show, dismiss } = useToast();
  const [failed, setFailed] = useState(false);
  const save = () => {
    setFailed(true);
    show({ status: 'error', title: 'Save failed', message: 'The server did not answer.' });
  };
  return (
    <Stack gap={3}>
      {failed && (
        <Banner status="error" title="Your changes were not saved" actions={<Button variant="secondary" onClick={save}>Retry</Button>}>
          The server did not answer. Your edits are still on this page.
        </Banner>
      )}
      <Stack direction="horizontal" gap={3}>
        <Button onClick={save}>Save changes</Button>
      </Stack>
      <ToastRegion toasts={toasts} onDismiss={dismiss} position="static" />
    </Stack>
  );
}

const LONG_TIP = 'Press Shift and ? at any time to see every keyboard shortcut in the app.';

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Toast"
      layer="Component"
      family="Feedback"
      imports="import { Banner, Button, Stack, Text, ToastRegion, useToast } from '@bauhaus/design-system';"
      intro={[
        'A toast is a small message that appears, says what happened ("Draft saved") and leaves by itself. It never takes keyboard focus, so the user keeps working where they were.',
        'Three pieces make it work. `useToast()` keeps the list of toasts. `show(...)` adds one to the list. `<ToastRegion />` draws the list on screen.',
        'A "live region" is a part of the page that screen readers (tools that read the page aloud) watch. When text is added to it, they read it out without the user moving there. The `ToastRegion` holds two: a polite one that waits for a pause in speech, and an assertive one for errors that interrupts.',
        'Mount the `ToastRegion` once, near the root of the app, and keep it mounted. Screen readers only announce text added to a live region that already exists.',
        'A toast is for a low-stakes result: saved, sent, copied, archived. It is not the only place for an error, because it disappears. For a message the user must be able to reread, use a `Banner`.',
        'The live demos on this page set `position="static"` so the region stays inside the page. Most code snippets leave it out. In your app, leave `position` out: the default `"fixed"` puts the region in the corner of the screen.',
      ]}
      guide="feedback-toast--docs"
      guideName="Toast"
      groups={[
        {
          title: 'Wiring, step by step',
          kicker: 'Start here. Three steps connect the hook, the region and a call to `show`.',
          examples: [
            {
              title: 'Your first toast',
              when: 'The smallest complete setup. Copy this first.',
              explain: [
                'Step 1, `useToast()`: it returns three things. `toasts` is the list on screen. `show` adds a toast. `dismiss` removes one by its id.',
                'Step 2, `<ToastRegion toasts={toasts} onDismiss={dismiss} />`: it draws the list. `onDismiss` tells your code which toast to remove when its timer ends or the user presses the close button. Without it, toasts would never leave the list.',
                'Step 3, `show({ ... })`: call it from any event handler. `message` is the only field you must give. `status` picks the icon and the voice (see the Status group).',
                'The region is always rendered, even when the list is empty. Do not write `{toasts.length > 0 && <ToastRegion … />}`: a screen reader may miss a message in a region that was created at the same moment (WCAG 4.1.3, AA).',
                'No toast takes focus. The user keeps typing where they were (WCAG 3.2.1, A).',
              ],
              render: <ToastDemo buttons={[{ label: 'Save draft', toasts: [{ status: 'success', message: 'Draft saved.' }] }]} />,
              code: `function SaveDraft() {
  // Step 1: the hook keeps the list of toasts.
  //   toasts  = the list to draw
  //   show    = add a toast (returns its id)
  //   dismiss = remove a toast by id
  const { toasts, show, dismiss } = useToast();

  return (
    <>
      {/* Step 3: call "show" from any handler. Only "message" is required. */}
      <Button
        variant="secondary"
        onClick={() => show({ status: 'success', message: 'Draft saved.' })}
      >
        Save draft
      </Button>

      {/* Step 2: draw the list. Keep it mounted, even when the list is empty.
          "onDismiss" is how a toast leaves: the timer and the close button call it. */}
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </>
  );
}`,
            },
            {
              title: 'Call show from anywhere (a provider)',
              when: 'A button deep in the app needs to show a toast, far from the region.',
              explain: [
                'Put `useToast()` and the one `ToastRegion` in a provider component at the root. A provider shares a value with every component below it, so nobody passes props down by hand.',
                'The provider shares `show` only. Components below never see the list or the region; they just call `show`.',
                '`show` keeps the same identity between renders, so it is safe in dependency lists of `useEffect` and `useCallback`.',
                'Keep one region for the whole app. Two regions would announce every message twice.',
              ],
              render: (
                <DemoToastProvider>
                  <CopyLinkButton />
                </DemoToastProvider>
              ),
              code: `import { createContext, useContext } from 'react';

const ShowToastContext = createContext(null);

// Mount this once, around your whole app.
export function ToastProvider({ children }) {
  const { toasts, show, dismiss } = useToast();
  return (
    <ShowToastContext.Provider value={show}>
      {children}
      {/* The only region in the app. */}
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </ShowToastContext.Provider>
  );
}

// Any component below the provider can call this hook.
export function useShowToast() {
  return useContext(ShowToastContext);
}

// A component deep in the tree:
function CopyLinkButton() {
  const show = useShowToast();
  return (
    <Button variant="secondary" onClick={() => show({ status: 'success', message: 'Link copied.' })}>
      Copy link
    </Button>
  );
}`,
            },
            {
              title: 'The fields of a toast',
              when: 'A quick reference of everything you can pass to `show`.',
              lang: 'ts',
              explain: [
                '`show` takes the same fields as `ToastData`, without the `id`. The hook creates the id and returns it, so you can close the toast early.',
                'Only `message` is required. Every other field has a default.',
                'The Timing, Action and Content groups below show each field in use.',
              ],
              code: `show({
  // What happened. Put the result first and name the object: "Draft saved", not "Success".
  message: 'Draft saved.',

  // 'info' (default) | 'success' | 'warning' | 'error'.
  // Sets the icon, its spoken word, and the region: errors are announced at once.
  status: 'success',

  // A short lead line above the message. Optional.
  title: 'Saved',

  // One button. A toast with an action stays until the user closes it.
  action: { label: 'Undo', onAction: () => undo() },

  // Milliseconds on screen. Leave it out for the region default (5000).
  // null keeps the toast until the user closes it.
  duration: 8000,

  // The spoken name of the icon. Defaults to the English status word.
  // Translate it if your app is not in English.
  statusLabel: 'Succès',
});   // returns an id such as "toast-1"`,
            },
          ],
        },
        {
          title: 'Status',
          kicker: 'The status sets the icon, the word a screen reader says, and which live region carries the toast. Info, success and warning wait for a pause in speech. Errors interrupt.',
          examples: [
            {
              title: 'Info',
              when: 'A neutral fact about something the user started.',
              explain: [
                '`status` defaults to `"info"`, so the prop can be left out.',
                'It goes to the polite region: a screen reader finishes its sentence, then reads the toast.',
                'The icon has a shape and a spoken name, so the status does not rely on colour alone (WCAG 1.4.1, A).',
              ],
              render: <ToastDemo buttons={[{ label: 'Start export', toasts: [{ message: 'Export started.' }] }]} />,
              code: `function StartExport() {
  const { toasts, show, dismiss } = useToast();
  return (
    <>
      {/* No "status": it defaults to "info". */}
      <Button variant="secondary" onClick={() => show({ message: 'Export started.' })}>
        Start export
      </Button>
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </>
  );
}`,
            },
            {
              title: 'Success',
              when: 'A result: saved, sent, copied.',
              explain: [
                '`status: "success"` draws the check icon. Screen readers say "Success" before the message.',
                'It uses the polite region. Success never needs to interrupt (WCAG 4.1.3, AA).',
              ],
              render: <ToastDemo buttons={[{ label: 'Save draft', toasts: [{ status: 'success', message: 'Draft saved.' }] }]} />,
              code: `function SaveDraft() {
  const { toasts, show, dismiss } = useToast();
  return (
    <>
      <Button variant="secondary" onClick={() => show({ status: 'success', message: 'Draft saved.' })}>
        Save draft
      </Button>
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </>
  );
}`,
            },
            {
              title: 'Warning',
              when: 'A heads-up that does not stop the user.',
              explain: [
                '`status: "warning"` draws the warning icon. It also uses the polite region.',
                'Say what the user can do about it. "Storage is almost full" is a fact; add "Delete old files" as an action if there is a next step.',
              ],
              render: <ToastDemo buttons={[{ label: 'Add photo', toasts: [{ status: 'warning', message: 'Storage is almost full.' }] }]} />,
              code: `function AddPhoto() {
  const { toasts, show, dismiss } = useToast();
  return (
    <>
      <Button variant="secondary" onClick={() => show({ status: 'warning', message: 'Storage is almost full.' })}>
        Add photo
      </Button>
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </>
  );
}`,
            },
            {
              title: 'Error',
              when: 'A failure. Repeat the error where the user can find it again.',
              explain: [
                '`status: "error"` sends the toast to the assertive region. A screen reader stops what it is saying and reads the error at once (WCAG 4.1.3, AA; APG alert pattern).',
                'The edge of an error toast is stronger, and the icon and word carry the status, not only the colour.',
                'A toast vanishes. A user who missed it has no way back, so also show the error on the page (WCAG 3.3.1, A). See the Composition group.',
              ],
              render: <ToastDemo buttons={[{ label: 'Upload file', toasts: [{ status: 'error', title: 'Upload failed', message: 'report.pdf is larger than 10 MB.' }] }]} />,
              code: `function UploadFile() {
  const { toasts, show, dismiss } = useToast();
  return (
    <>
      {/* An error interrupts speech. Use it only for real failures. */}
      <Button
        variant="secondary"
        onClick={() => show({ status: 'error', title: 'Upload failed', message: 'report.pdf is larger than 10 MB.' })}
      >
        Upload file
      </Button>
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </>
  );
}`,
            },
          ],
        },
        {
          title: 'Anatomy',
          kicker: 'Put the result first and name the object: "Draft saved", not "Success". Keep it under about 15 words.',
          examples: [
            {
              title: 'Message only',
              when: 'The result says it all.',
              explain: [
                'One short sentence is the best toast. The user reads it in a glance and goes on.',
                'A toast cannot hold a form or a long text. If you need more, use a `Banner` or a dialog.',
              ],
              render: <ToastDemo buttons={[{ label: 'Copy link', toasts: [{ status: 'success', message: 'Link copied.' }] }]} />,
              code: `show({ status: 'success', message: 'Link copied.' });`,
            },
            {
              title: 'Title and message',
              when: 'A lead line, then the detail.',
              explain: [
                '`title` is the short headline, `message` the detail. Use both when the headline alone would not say what to do.',
                'Screen readers read the status word, then the title, then the message.',
              ],
              render: <ToastDemo buttons={[{ label: 'Upload file', toasts: [{ status: 'error', title: 'Upload failed', message: 'report.pdf is larger than 10 MB.' }] }]} />,
              code: `show({
  status: 'error',
  title: 'Upload failed',                         // the headline
  message: 'report.pdf is larger than 10 MB.',    // the detail, with the cause
});`,
            },
            {
              title: 'A message with markup',
              when: 'You need to emphasise a name or a number inside the message.',
              explain: [
                '`message` and `title` accept any React content, not only text.',
                'Keep it short. Do not put a link or a button in the message: use `action` for the one allowed button.',
              ],
              render: <ToastDemo buttons={[{ label: 'Invite teammate', toasts: [{ status: 'success', message: <>Invitation sent to <strong>amara@example.com</strong>.</> }] }]} />,
              code: `show({
  status: 'success',
  message: <>Invitation sent to <strong>amara@example.com</strong>.</>,
});`,
            },
          ],
        },
        {
          title: 'Timing',
          kicker: 'The default is 5000 ms (5 seconds). The timer pauses while the pointer is over the toast or focus is inside it, and resumes with the time left.',
          examples: [
            {
              title: 'The default time',
              when: 'Most toasts. A short message that needs no action.',
              explain: [
                'Without `duration`, the toast closes after 5000 ms. That is enough to read about 15 words.',
                'Hover over it, or tab to its close button: the timer pauses. It resumes with the time left, not a fresh five seconds (WCAG 2.2.1, A; 1.4.13, AA).',
                'Try it: press the button, then point at the toast and wait.',
              ],
              render: <ToastDemo buttons={[{ label: 'Save draft', toasts: [{ status: 'success', message: 'Draft saved.' }] }]} />,
              code: `// No "duration": the region default, 5000 ms, applies.
show({ status: 'success', message: 'Draft saved.' });`,
            },
            {
              title: 'A shorter time for the whole region',
              when: 'Every toast in the app is very short, so you want a quicker exit.',
              explain: [
                '`duration` on `ToastRegion` is the default for every toast in it, in milliseconds.',
                'Do not go below about 2000 ms. Some people read slowly (WCAG 2.2.1, timing adjustable, A).',
              ],
              render: <ToastDemo buttons={[{ label: 'Copy link', toasts: [{ status: 'success', message: 'Link copied.' }] }]} region={{ duration: 2000 }} />,
              code: `function CopyLink() {
  const { toasts, show, dismiss } = useToast();
  return (
    <>
      <Button variant="secondary" onClick={() => show({ status: 'success', message: 'Link copied.' })}>
        Copy link
      </Button>
      {/* 2000 ms for every toast in this region. */}
      <ToastRegion toasts={toasts} onDismiss={dismiss} duration={2000} />
    </>
  );
}`,
            },
            {
              title: 'A longer time for the whole region',
              when: 'Messages are long. Allow about 200 ms per word.',
              explain: [
                'A 14-word message needs about 3 seconds just to read. Add time for the user to notice it first.',
                'Ten seconds here gives a comfortable margin for a tip.',
              ],
              render: <ToastDemo buttons={[{ label: 'Show tip', toasts: [{ message: LONG_TIP }] }]} region={{ duration: 10000 }} />,
              code: `function ShowTip() {
  const { toasts, show, dismiss } = useToast();
  return (
    <>
      <Button
        variant="secondary"
        onClick={() => show({ message: 'Press Shift and ? at any time to see every keyboard shortcut in the app.' })}
      >
        Show tip
      </Button>
      {/* 10 seconds for a long message. */}
      <ToastRegion toasts={toasts} onDismiss={dismiss} duration={10000} />
    </>
  );
}`,
            },
            {
              title: 'A different time for one toast',
              when: 'One toast needs more or less time than the rest.',
              explain: [
                '`duration` inside `show(...)` wins over the region default, for that toast only.',
                'Use it for a message with something to copy or read twice, such as an email address.',
              ],
              render: <ToastDemo buttons={[{ label: 'Invite teammate', toasts: [{ status: 'success', message: 'Invitation sent to amara@example.com.', duration: 10000 }] }]} />,
              code: `show({
  status: 'success',
  message: 'Invitation sent to amara@example.com.',
  duration: 10000,   // this toast only; the region default stays 5000
});`,
            },
            {
              title: 'Until the user closes it',
              when: 'The user must be able to read it again, or it explains a long task.',
              explain: [
                '`duration: null` turns the timer off. The toast stays until the user presses the close button, or your code calls `dismiss`.',
                'A user cannot be rushed through a decision or a long explanation (WCAG 2.2.1, A).',
                'Use it rarely. A toast that never leaves is a banner in disguise.',
              ],
              render: <ToastDemo buttons={[{ label: 'Start export', toasts: [{ status: 'warning', title: 'Export is large', message: 'It may take a few minutes. You can leave this page.', duration: null }] }]} />,
              code: `show({
  status: 'warning',
  title: 'Export is large',
  message: 'It may take a few minutes. You can leave this page.',
  duration: null,    // no timer: the user closes it
});`,
            },
          ],
        },
        {
          title: 'Action',
          kicker: 'A toast has at most one action. A toast with an action stays until the user closes it, because a user cannot be rushed through a choice.',
          examples: [
            {
              title: 'Undo',
              when: 'A result the user can reverse.',
              explain: [
                '`action` has a `label` (the button text) and `onAction` (your function). Pressing the button runs your function and closes the toast.',
                'Undo is the best use of a toast action. It lets you skip a "Are you sure?" dialog for an action that is easy to reverse (Nielsen heuristic 3, user control).',
                'Because the toast has an action, it has no timer. The user closes it, or pressing Undo closes it.',
                'The action button is a real button in the page, reachable with Tab, so keyboard users can undo too (WCAG 2.1.1, A).',
              ],
              render: <ArchiveWithUndo />,
              code: `function ArchiveWithUndo() {
  const { toasts, show, dismiss } = useToast();

  const archive = () => {
    archiveConversation();             // your function: do the thing
    show({
      message: 'Conversation archived.',
      action: {
        label: 'Undo',
        onAction: () => {
          restoreConversation();       // your function: reverse it
          // A second toast confirms the undo.
          show({ status: 'success', message: 'Archive undone.' });
        },
      },
    });
  };

  return (
    <>
      <Button variant="secondary" onClick={archive}>Archive</Button>
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </>
  );
}`,
            },
            {
              title: 'An action that opens a place',
              when: 'A result with a next step, such as View.',
              explain: [
                'The action may take the user somewhere, for example `onAction: () => navigate("/pages/42")`.',
                'Name the action with a verb and an object ("View page"), so the label makes sense on its own (WCAG 2.4.6, AA).',
              ],
              render: <ToastDemo buttons={[{ label: 'Publish page', toasts: [{ status: 'success', message: 'Page published.', action: { label: 'View page', onAction: () => {} } }] }]} />,
              code: `show({
  status: 'success',
  message: 'Page published.',
  // "navigate" stands for your router.
  action: { label: 'View page', onAction: () => navigate('/pages/42') },
});`,
            },
          ],
        },
        {
          title: 'Stack',
          kicker: 'At most `max` toasts show, three by default. The rest wait, and a count says how many.',
          examples: [
            {
              title: 'Past the limit',
              when: 'Five toasts at once. Three show and the region counts the other two.',
              explain: [
                'The waiting toasts take a slot as one closes. Their timers start when the user can see them, so none is missed.',
                'The "+2 more" text tells the user that more are waiting.',
                'If you often raise many toasts, group them: one "5 photos added" is better than five.',
              ],
              render: <ToastDemo buttons={[{ label: 'Raise five toasts', toasts: [1, 2, 3, 4, 5].map((n): DemoToast => ({ message: `Photo ${n} added.`, duration: null })) }]} />,
              code: `function AddPhotos() {
  const { toasts, show, dismiss } = useToast();
  const addPhotos = () =>
    [1, 2, 3, 4, 5].forEach((n) => show({ message: \`Photo \${n} added.\`, duration: null }));
  return (
    <>
      <Button variant="secondary" onClick={addPhotos}>Raise five toasts</Button>
      {/* "max" defaults to 3. */}
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </>
  );
}`,
            },
            {
              title: 'A lower limit',
              when: 'A small screen. Show one toast at a time.',
              explain: ['`max={1}` shows one toast and queues the others. A phone has little room, and several toasts would cover the content.'],
              render: <ToastDemo buttons={[{ label: 'Raise three toasts', toasts: [1, 2, 3].map((n): DemoToast => ({ message: `Photo ${n} added.`, duration: null })) }]} region={{ max: 1 }} />,
              code: `function AddPhotos() {
  const { toasts, show, dismiss } = useToast();
  const addPhotos = () =>
    [1, 2, 3].forEach((n) => show({ message: \`Photo \${n} added.\`, duration: null }));
  return (
    <>
      <Button variant="secondary" onClick={addPhotos}>Raise three toasts</Button>
      <ToastRegion toasts={toasts} onDismiss={dismiss} max={1} />
    </>
  );
}`,
            },
            {
              title: 'A translated count',
              when: 'The "+N more" text must follow the app language.',
              explain: [
                '`moreLabel` is a function. It receives the number of waiting toasts and returns the text.',
                'Use it for languages that need plural forms. Your translation function usually handles the plural.',
              ],
              render: <ToastDemo buttons={[{ label: 'Ajouter des photos', toasts: [1, 2, 3, 4].map((n): DemoToast => ({ message: `Photo ${n} ajoutée.`, duration: null })) }]} region={{ max: 2, moreLabel: (count) => `+${count} de plus` }} />,
              code: `<ToastRegion
  toasts={toasts}
  onDismiss={dismiss}
  max={2}
  // "count" is the number of toasts that wait.
  moreLabel={(count) => \`+\${count} de plus\`}
/>`,
            },
            {
              title: 'Clear all',
              when: 'Many toasts wait and the user wants them gone.',
              explain: [
                '`toasts` is a plain list, so you can loop over it and call `dismiss` for each id.',
                'Dismissing through `dismiss` skips the exit fade. To keep the fade, let each toast close itself.',
              ],
              render: <ClearAll />,
              code: `function ClearAll() {
  const { toasts, show, dismiss } = useToast();
  return (
    <>
      <Button variant="secondary" onClick={() => show({ message: 'Photo added.', duration: null })}>
        Add a photo
      </Button>
      {/* Remove every toast, waiting ones too. */}
      <Button variant="tertiary" onClick={() => toasts.forEach((toast) => dismiss(toast.id))}>
        Clear all
      </Button>
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </>
  );
}`,
            },
          ],
        },
        {
          title: 'Content cases',
          examples: [
            {
              title: 'Long message',
              when: 'A message of many words. It wraps inside the toast.',
              frame: 'narrow',
              explain: [
                'The toast is at most 20rem wide and fills a narrow screen. Long text wraps onto more lines; nothing is cut off (WCAG 1.4.10, reflow, AA).',
                'If it wraps to more than four lines, shorten the message.',
              ],
              render: <ToastDemo buttons={[{ label: 'Share file', toasts: [{ status: 'info', title: 'File shared', message: 'Amara Kone can now edit the quarterly report, and 4 other people can view it.', duration: null }] }]} />,
              code: `show({
  status: 'info',
  title: 'File shared',
  message: 'Amara Kone can now edit the quarterly report, and 4 other people can view it.',
  duration: null,    // long text: let the user close it
});`,
            },
            {
              title: 'Translated copy',
              when: 'The app is not in English. Three texts come from props.',
              frame: 'narrow',
              explain: [
                'The close button label comes from `dismissLabel` on the region. Its default is English.',
                'The spoken name of the icon comes from `statusLabel` on each toast. Its default is the English status word.',
                'The "+N more" text comes from `moreLabel`. Translate all three, or screen reader users hear a mix of languages.',
              ],
              render: <ToastDemo buttons={[{ label: 'Enregistrer', toasts: [{ status: 'success', statusLabel: 'Succès', message: 'Brouillon enregistré.', duration: null }] }]} region={{ dismissLabel: 'Fermer la notification' }} />,
              code: `function SaveDraft() {
  const { toasts, show, dismiss } = useToast();
  return (
    <>
      <Button
        variant="secondary"
        onClick={() => show({ status: 'success', statusLabel: 'Succès', message: 'Brouillon enregistré.' })}
      >
        Enregistrer
      </Button>
      {/* The name of the close button, read by screen readers. */}
      <ToastRegion toasts={toasts} onDismiss={dismiss} dismissLabel="Fermer la notification" />
    </>
  );
}`,
            },
            {
              title: 'Phone width',
              when: 'A phone screen. The toast fills the width.',
              frame: 'phone',
              explain: ['Below 20rem the toast takes the whole width, so the text and the buttons stay large enough to tap (WCAG 2.5.8, AA).'],
              render: <ToastDemo buttons={[{ label: 'Archive', toasts: [{ message: 'Conversation archived.', action: { label: 'Undo', onAction: () => {} } }] }]} />,
              code: `show({
  message: 'Conversation archived.',
  action: { label: 'Undo', onAction: () => undo() },
});`,
            },
          ],
        },
        {
          title: 'Controlled from code',
          kicker: '`show` returns an id. Keep it to close the toast yourself.',
          examples: [
            {
              title: 'Close early by id',
              when: 'A task runs. Show a toast while it works, close it when it ends, then report the result.',
              explain: [
                '`show` returns the id of the new toast. `dismiss(id)` removes that toast.',
                '`duration: null` keeps the first toast on screen until your code closes it. Without it, the timer could close it while the task still runs.',
                'The second toast reports the result. Only the result needs the polite announcement; the first said "started".',
              ],
              render: <CloseEarly />,
              code: `function CloseEarly() {
  const { toasts, show, dismiss } = useToast();

  const start = async () => {
    // Keep the id. No timer: the toast stays while the task runs.
    const id = show({ message: 'Export started.', duration: null });
    await runExport();                 // your long task
    dismiss(id);                       // close the "started" toast
    show({ status: 'success', message: 'Export ready.' });
  };

  return (
    <>
      <Button variant="secondary" onClick={start}>Start export</Button>
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </>
  );
}`,
            },
          ],
        },
        {
          title: 'Composition',
          examples: [
            {
              title: 'An error toast beside a banner',
              when: 'A save fails. The toast announces it at once; the banner keeps it on the page.',
              explain: [
                'The toast reaches screen reader users immediately, through the assertive region.',
                'The `Banner` stays after the toast leaves. A user who missed the toast can still find the error and retry (WCAG 3.3.1, A; Nielsen heuristic 9, help users recover from errors).',
                'The banner says what happened to the user\'s work ("Your edits are still on this page"), so they are not afraid to retry.',
              ],
              render: <SaveFailure />,
              code: `function SaveFailure() {
  const { toasts, show, dismiss } = useToast();
  const [failed, setFailed] = useState(false);

  const save = async () => {
    try {
      await saveChanges();             // your request
      setFailed(false);
      show({ status: 'success', message: 'Changes saved.' });
    } catch {
      setFailed(true);                 // the lasting copy of the error
      show({ status: 'error', title: 'Save failed', message: 'The server did not answer.' });
    }
  };

  return (
    <Stack gap={3}>
      {failed && (
        <Banner
          status="error"
          title="Your changes were not saved"
          actions={<Button variant="secondary" onClick={save}>Retry</Button>}
        >
          The server did not answer. Your edits are still on this page.
        </Banner>
      )}
      <Button onClick={save}>Save changes</Button>
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Placement',
          examples: [
            {
              title: 'Fixed or static',
              when: 'Choose where the region sits.',
              explain: [
                'The default, `position="fixed"`, pins the region to the corner of the screen. It stays there while the page scrolls. Use it in your app.',
                '`position="static"` keeps the region in the page flow, like any other element. These examples use it so each toast shows inside its own card.',
                'Pass `className` to place the region yourself. It is a `div`, and standard attributes pass through.',
              ],
              render: <ToastDemo buttons={[{ label: 'Save draft', toasts: [{ status: 'success', message: 'Draft saved.' }] }]} />,
              code: `<Button onClick={() => show({ status: 'success', message: 'Draft saved.' })}>Save draft</Button>

{/* In your app, leave "position" out: the default is "fixed", in the corner. */}
<ToastRegion toasts={toasts} onDismiss={dismiss} />

{/* "static" keeps the region in the page, for a specimen or a docs page. */}
<ToastRegion toasts={toasts} onDismiss={dismiss} position="static" />`,
            },
          ],
        },
      ]}
    />
  ),
};
