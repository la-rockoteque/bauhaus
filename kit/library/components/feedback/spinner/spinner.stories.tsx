import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { Banner } from '../banner/banner';
import { Spinner } from './spinner';
import type { SpinnerSize } from './spinner';
import { spinnerRules } from './spinner.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Feedback/Spinner', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly SpinnerSize[];
const notInteractive = 'A spinner is not interactive.';

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Spinner"
      layer="Component"
      family="Feedback"
      plain="A spinner is a small turning ring that says 'working on it'. Use it for a short wait of one or two seconds, in the spot where the result will appear."
      precise="Component in the feedback family · an indeterminate loading indicator with role status and a required text label · not for a wait under one second and not for a wait that can report progress."
      usedFor="A short wait inside one component: a refresh, a button's action, a lazy panel."
      tokens={{
        mode: 'consumed',
        note: 'The spinner has no component tokens.',
        rows: [
          { name: 'progress.fill', tier: 'role', use: 'The moving arc; 3:1 on the page', swatch: '--ds-progress-fill' },
          { name: 'progress.track', tier: 'role', use: 'The rest of the ring', swatch: '--ds-progress-track' },
          { name: 'text.muted', tier: 'role', use: 'Visible label', swatch: '--ds-text-muted' },
          { name: 'size.icon.sm · md · lg', tier: '2', use: 'Ring size, 12, 16 and 20px' },
          { name: 'size.border.thick', tier: '2', use: 'Ring thickness' },
          { name: 'motion.duration.deliberate', tier: '2', use: 'One turn, linear' },
          { name: 'text.caption.* · space.control.gap', tier: '2', use: 'Visible label, and its gap to the ring' },
        ],
      }}
      stage={{
        render: (args) => <Spinner label={String(args.label)} size={args.size as SpinnerSize} showLabel={args.showLabel === true} />,
        parts: [
          { n: 1, label: 'Status region', note: 'role status, required', target: '.ds-spinner', at: 'top-start' },
          { n: 2, label: 'Ring', note: 'aria-hidden', target: '.ds-spinner__ring' },
          { n: 3, label: 'Label', note: 'required; hidden from sight unless showLabel', target: '.ds-spinner__label', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Sizes', value: 'sm 12px · md 16px · lg 20px (size.icon.*); the turning ring cannot be measured' },
        { label: 'Turn', value: 'motion.duration.deliberate, linear, infinite' },
        { label: 'Reduced motion', value: 'The ring stops and stays as a static arc' },
        { label: 'Delay', value: 'None built in. The caller waits about 300 ms before it mounts the spinner.' },
      ]}
      api={[
        { label: 'label', value: 'Required. The accessible name, such as "Loading orders". Say what loads.', control: { kind: 'text', value: 'Loading orders' } },
        { label: 'size', value: '"sm" | "md" | "lg", default "md".', control: { kind: 'select', options: SIZES, value: 'md' } },
        { label: 'showLabel', value: 'Show the label beside the ring instead of hiding it from sight.', control: { kind: 'boolean', value: true } },
        { label: '…props', value: 'Every native span attribute.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'With nothing to wait for, the caller does not mount the spinner.' },
          { id: 'loading', status: 'designed', render: <Spinner label="Loading orders" showLabel />, trigger: 'mounted', note: 'The state the spinner exists for.' },
          { id: 'none', status: 'n/a', reason: 'The spinner holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'The spinner holds no collection.' },
          { id: 'some', status: 'n/a', reason: 'The spinner has no data of its own.' },
          { id: 'too-many', status: 'designed', label: 'Too many (long label)', render: <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 4)' }}><Spinner label="Loading the 248 requisitions for the Northern region" showLabel /></div>, trigger: 'long label', note: 'The label wraps and never truncates.' },
          { id: 'incorrect', status: 'n/a', reason: 'A failed load replaces the spinner with an error in place.' },
          { id: 'correct', status: 'n/a', reason: 'The spinner has no valid or invalid input.' },
          { id: 'done', status: 'n/a', reason: 'When the work ends the spinner leaves and the result takes its place.' },
          {
            id: 'default',
            status: 'designed',
            label: 'Default (three sizes)',
            render: (
              <div style={{ display: 'flex', gap: 'var(--ds-space-6)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Spinner label="Loading, small" size="sm" />
                <Spinner label="Loading, medium" />
                <Spinner label="Loading, large" size="lg" />
              </div>
            ),
            trigger: 'size',
            note: 'Labels are hidden from sight and read by assistive technology.',
          },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      dos={[
        { text: 'Say what loads: "Loading orders".', basis: 'Nielsen 1; WCAG 4.1.3 (AA)' },
        { text: 'Place it in the region that loads.', basis: 'Nielsen 3' },
        { text: 'Delay it by about 300 ms so a fast load never flashes it.', basis: 'Nielsen response times' },
        { text: 'Switch to a progress bar when the wait passes about 2 s.', basis: 'Nielsen response times' },
      ]}
      donts={[
        { text: 'Show a spinner for a wait under one second.', basis: 'Nielsen response times', rule: 'spinner.min-delay' },
        { text: 'Blank a working screen with a full-page spinner.', basis: 'Nielsen 3', rule: 'spinner.scoped' },
        { text: 'Leave the spinner without a text label.', basis: 'WCAG 4.1.3 (AA)', rule: 'spinner.has-text' },
        { text: 'Keep the ring turning under reduced motion.', basis: 'WCAG 2.3.3 (AAA)', rule: 'spinner.reduced-motion' },
        { text: 'Write a colour or px literal in spinner.css.', basis: 'misfile.raw-value-in-component', rule: 'spinner.no-literal' },
      ]}
      guide="feedback-spinner--docs"
      guideName="Spinner"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Spinner" layer="Component" family="Feedback" rules={spinnerRules} guide="feedback-spinner--docs" guideName="Spinner" />,
};

/** Loads orders. `ms` is how long the fake request takes; the spinner mounts only after 300 ms. */
function DelayedSpinner({ ms = 2000 }: { ms?: number }) {
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!loading) return;
    const reveal = window.setTimeout(() => setShowSpinner(true), 300);
    const finish = window.setTimeout(() => {
      setLoading(false);
      setShowSpinner(false);
      setDone(true);
    }, ms);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(finish);
    };
  }, [loading, ms]);
  const load = () => {
    setDone(false);
    setLoading(true);
  };
  return (
    <Stack gap={3} align="start">
      <Button variant="secondary" onClick={load} disabled={loading}>Load orders</Button>
      <div aria-busy={loading}>
        {showSpinner && <Spinner label="Loading orders" showLabel />}
        {done && <Text as="p">3 orders loaded.</Text>}
      </div>
    </Stack>
  );
}

/** A refresh that fails: the spinner leaves and an error takes its place. */
function RefreshWithError() {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  useEffect(() => {
    if (state !== 'loading') return;
    const timer = window.setTimeout(() => setState('error'), 1500);
    return () => window.clearTimeout(timer);
  }, [state]);
  return (
    <Stack gap={3} align="start">
      <Button variant="secondary" onClick={() => setState('loading')} disabled={state === 'loading'}>Refresh</Button>
      <div aria-busy={state === 'loading'}>
        {state === 'loading' && <Spinner label="Refreshing orders" showLabel />}
        {state === 'error' && <Banner status="error" title="Orders did not refresh">The server did not answer. Try again.</Banner>}
      </div>
    </Stack>
  );
}

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Spinner"
      layer="Component"
      family="Feedback"
      imports="import { Banner, Button, Spinner, Stack, Text } from '@acme/design-system';"
      intro={[
        'A spinner is a small turning ring that says "working on it". It does not know how far along the work is. When you know the progress, use a progress bar instead.',
        'Every spinner has a text `label`, and the label is required. The ring is a picture; screen readers (tools that read the page aloud) read the label.',
        'Use a spinner for a wait of about one to two seconds, inside the area that loads. For a wait under one second, show nothing. For a whole page, use a skeleton.',
        'The component has no timer. You decide when it appears and when it leaves, so the examples below show that code too.',
        'A "status region" is a part of the page that a screen reader announces without the user moving to it. The spinner is one (`role="status"`).',
      ]}
      guide="feedback-spinner--docs"
      guideName="Spinner"
      groups={[
        {
          title: 'The basic spinner',
          kicker: 'Start here. A label, nothing else.',
          examples: [
            {
              title: 'Medium, the default',
              when: 'A short wait next to body text. This is the example most readers need.',
              explain: [
                '`label` is the only required prop. It becomes the text of a status region, so a screen reader says "Loading orders" when the spinner appears (WCAG 4.1.3, AA).',
                'Say what loads. "Loading orders" helps more than "Loading…" (Nielsen heuristic 1, visibility of system status).',
                'Without a label, a blind user would hear nothing and think the page froze.',
                'By default the label is hidden from sight and read only by assistive technology. Only the ring shows.',
              ],
              render: <Spinner label="Loading orders" />,
              code: `// "label" is required. Say what loads, not just "Loading".
// Size defaults to "md": no prop needed.
<Spinner label="Loading orders" />`,
            },
          ],
        },
        {
          title: 'Sizes',
          kicker: 'Match the ring to the text beside it: small beside caption text, medium beside body text, large for a panel.',
          examples: [
            {
              title: 'Small',
              when: 'Beside caption text, or inside a dense row.',
              explain: [
                '`size="sm"` draws the smallest ring. It takes its size from the icon scale, so it lines up with icons of the same size.',
                'A small ring is easy to miss. That is fine for a background refresh, but use a larger one when the user waits for the result.',
              ],
              render: <Spinner size="sm" label="Loading orders" />,
              code: `<Spinner size="sm" label="Loading orders" />`,
            },
            {
              title: 'Medium',
              when: 'Beside body text. The default.',
              explain: ['`size="md"` is the default; write it only when you want to be explicit.'],
              render: <Spinner size="md" label="Loading orders" />,
              code: `<Spinner size="md" label="Loading orders" />`,
            },
            {
              title: 'Large',
              when: 'In the middle of a panel that loads.',
              explain: [
                '`size="lg"` is easy to see without a visible label. Pair it with `showLabel` when the wait is long (see the next group).',
              ],
              render: <Spinner size="lg" label="Loading orders" />,
              code: `<Spinner size="lg" label="Loading orders" />`,
            },
          ],
        },
        {
          title: 'Visible label',
          kicker: 'Set `showLabel` when the wait is long enough that the user asks what is happening.',
          examples: [
            {
              title: 'Hidden label',
              when: 'A small, in-place spinner. The label is for assistive technology only.',
              explain: [
                '`showLabel` defaults to `false`. The label is still in the page, but moved off-screen so only screen readers use it.',
                'Sighted users see the ring. The place where it sits tells them what loads.',
              ],
              render: <Spinner label="Loading orders" />,
              code: `// showLabel is false by default: ring only on screen, label for screen readers.
<Spinner label="Loading orders" />`,
            },
            {
              title: 'Visible label',
              when: 'A wait of a second or two where the user needs to know what loads.',
              explain: [
                '`showLabel` prints the label beside the ring. Everyone sees the same words that screen readers read.',
                'A ring with words is clearer than a ring alone, because a turning circle on its own has no meaning (WCAG 1.1.1, A).',
              ],
              render: <Spinner label="Loading orders" showLabel />,
              code: `<Spinner label="Loading orders" showLabel />`,
            },
            {
              title: 'Large with a visible label',
              when: 'A panel that loads. The ring and the words sit together.',
              explain: ['Large ring and words together suit an empty panel with nothing else to look at.'],
              render: <Spinner size="lg" label="Loading your dashboard" showLabel />,
              code: `<Spinner size="lg" label="Loading your dashboard" showLabel />`,
            },
            {
              title: 'Small with a visible label',
              when: 'A caption-size note, such as a sync status.',
              explain: ['The small ring and the label use the caption text size, so they read as one line of status.'],
              render: <Spinner size="sm" label="Syncing changes" showLabel />,
              code: `<Spinner size="sm" label="Syncing changes" showLabel />`,
            },
          ],
        },
        {
          title: 'Content cases',
          kicker: 'A long label wraps. It never gets cut off, because it says what the user waits for.',
          examples: [
            {
              title: 'Long label',
              when: 'A label with detail about the work.',
              frame: 'narrow',
              explain: [
                'In a narrow column the label wraps onto more lines. Nothing is cut off, so the text stays readable at high zoom (WCAG 1.4.10, reflow, AA).',
              ],
              render: <Spinner label="Loading the last 90 days of orders for the Montreal warehouse" showLabel />,
              code: `<Spinner label="Loading the last 90 days of orders for the Montreal warehouse" showLabel />`,
            },
            {
              title: 'Translated label',
              when: 'The app is not in English. The label comes from your translations.',
              frame: 'narrow',
              explain: [
                'The spinner adds no words of its own. Pass the translated text as `label`.',
                'Set the page language (`lang` on the `html` element) so screen readers pick the right voice (WCAG 3.1.1, A).',
              ],
              render: <Spinner label="Chargement des commandes" showLabel />,
              code: `// "t" stands for your translation function.
<Spinner label={t('orders.loading')} showLabel />`,
            },
            {
              title: 'Phone width',
              when: 'A phone screen. The ring and the label stay on one line when they fit.',
              frame: 'phone',
              explain: ['Nothing in the spinner has a fixed width, so it fits any screen.'],
              render: <Spinner size="lg" label="Loading your dashboard" showLabel />,
              code: `<Spinner size="lg" label="Loading your dashboard" showLabel />`,
            },
            {
              title: 'Extra attributes',
              when: 'You need an id, a test hook or a class on the spinner.',
              explain: [
                'The spinner is a `span`. Standard attributes such as `id` and `data-testid` pass through.',
                'Do not set `role` yourself. The spinner already has `role="status"`.',
              ],
              render: <Spinner label="Loading orders" id="orders-spinner" data-testid="orders-spinner" />,
              code: `<Spinner label="Loading orders" id="orders-spinner" data-testid="orders-spinner" />`,
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Put the spinner where the result will appear. Keep the rest of the screen working.',
          examples: [
            {
              title: 'Beside text',
              when: 'A short in-place wait next to a line of text.',
              explain: [
                'A horizontal `Stack` puts the text and the ring on one row. `align="center"` lines up their middles.',
                'The ring is small and the label is hidden, because the text beside it already says what happens.',
                'The spinner keeps its own label for screen readers, even though the visible text says the same thing.',
              ],
              render: (
                <Stack direction="horizontal" gap={2} align="center">
                  <Text as="span" variant="caption" tone="muted">Checking the address</Text>
                  <Spinner size="sm" label="Checking the address" />
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={2} align="center">
  <Text as="span" variant="caption" tone="muted">Checking the address</Text>
  <Spinner size="sm" label="Checking the address" />
</Stack>`,
            },
            {
              title: 'In a panel',
              when: 'One region loads. The rest of the screen keeps working.',
              explain: [
                '`aria-busy="true"` on the region tells screen readers that its content is still changing. Set it to `false`, or remove it, when the load ends.',
                'Do not cover the whole page with a spinner. The user loses the screen they were using (Nielsen heuristic 3, user control).',
                'The heading stays visible, so the user still knows which panel loads.',
              ],
              render: (
                <Stack gap={3} aria-busy="true">
                  <Text as="h3" variant="heading">Recent orders</Text>
                  <Spinner label="Loading recent orders" showLabel />
                </Stack>
              ),
              code: `// aria-busy marks the region that loads. Remove it when the data arrives.
<Stack gap={3} aria-busy="true">
  <Text as="h3" variant="heading">Recent orders</Text>
  <Spinner label="Loading recent orders" showLabel />
</Stack>`,
            },
            {
              title: 'Inside a button',
              when: 'A button starts the work. Use the button, not a spinner beside it.',
              explain: [
                '`Button` has its own `loading` prop. It draws a spinner inside the button and keeps the label and the width, so the layout does not move.',
                'Do not place a separate `Spinner` next to a button for its own action.',
              ],
              render: <Button loading>Save changes</Button>,
              code: `// The button shows its own spinner and keeps its width.
<Button loading={isSaving} onClick={save}>Save changes</Button>`,
            },
          ],
        },
        {
          title: 'Loading, then the result',
          kicker: 'The component has no timer. You decide when it mounts and when it leaves.',
          examples: [
            {
              title: 'Delayed by 300 ms',
              when: 'The wait may be short or long. Mount the spinner after 300 ms.',
              explain: [
                'A spinner that flashes for a fraction of a second looks like a glitch. A short timer avoids it: if the work ends first, the spinner never shows.',
                'The spinner mounts only when `showSpinner` is true. Mounting it with its label together lets screen readers announce it.',
                '`aria-busy` stays on the region for the whole wait, even before the spinner shows (WCAG 4.1.3, AA).',
                'Clear both timers when the work ends or the component leaves. Otherwise a late timer can show a spinner for work that is over.',
              ],
              render: <DelayedSpinner />,
              code: `function DelayedSpinner() {
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [orders, setOrders] = useState([]);

  const load = async () => {
    setLoading(true);
    // Show the spinner only if the work takes longer than 300 ms.
    const reveal = window.setTimeout(() => setShowSpinner(true), 300);
    setOrders(await fetchOrders());   // your request
    window.clearTimeout(reveal);      // fast load: the spinner never showed
    setShowSpinner(false);
    setLoading(false);
  };

  return (
    <Stack gap={3} align="start">
      <Button variant="secondary" onClick={load} disabled={loading}>Load orders</Button>
      <div aria-busy={loading}>
        {showSpinner && <Spinner label="Loading orders" showLabel />}
        {orders.length > 0 && <Text as="p">{orders.length} orders loaded.</Text>}
      </div>
    </Stack>
  );
}`,
            },
            {
              title: 'A fast load shows no spinner',
              when: 'The work ends in 200 ms. The user sees only the result.',
              explain: [
                'Same code as above, but the fake request takes 200 ms. The 300 ms timer never fires.',
                'Press the button: the text appears and no ring flashes.',
              ],
              render: <DelayedSpinner ms={200} />,
              code: `// Same DelayedSpinner as above.
// The request ends before the 300 ms timer, so the spinner never mounts.`,
            },
            {
              title: 'Loading, then an error',
              when: 'The refresh fails.',
              explain: [
                'The spinner leaves when the work ends, whatever the result. Never leave it turning after a failure.',
                'The error appears in the same place, with words about what to do next (WCAG 3.3.1, A; Nielsen heuristic 9, help users recover from errors).',
              ],
              render: <RefreshWithError />,
              code: `function Refresh() {
  const [state, setState] = useState('idle'); // 'idle' | 'loading' | 'error'

  const refresh = async () => {
    setState('loading');
    try {
      await refreshOrders();    // your request
      setState('idle');
    } catch {
      setState('error');
    }
  };

  return (
    <Stack gap={3} align="start">
      <Button variant="secondary" onClick={refresh} disabled={state === 'loading'}>Refresh</Button>
      <div aria-busy={state === 'loading'}>
        {state === 'loading' && <Spinner label="Refreshing orders" showLabel />}
        {state === 'error' && (
          <Banner status="error" title="Orders did not refresh">
            The server did not answer. Try again.
          </Banner>
        )}
      </div>
    </Stack>
  );
}`,
            },
          ],
        },
      ]}
    />
  ),
};
