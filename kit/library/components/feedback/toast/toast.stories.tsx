import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
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
