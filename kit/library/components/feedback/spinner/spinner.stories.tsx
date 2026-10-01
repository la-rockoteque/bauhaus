import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
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

/** The wait lasts two seconds. The spinner mounts after 300 ms, so a fast load never shows it. */
function DelayedSpinner() {
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
    }, 2000);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(finish);
    };
  }, [loading]);
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

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Spinner"
      layer="Component"
      family="Feedback"
      imports="import { Button, Spinner, Stack, Text } from '@acme/design-system';"
      guide="feedback-spinner--docs"
      guideName="Spinner"
      groups={[
        {
          title: 'Sizes',
          kicker: 'Match the size to the text beside it. The label is always there; by default only assistive technology reads it.',
          examples: SIZES.map((size) => ({
            title: size === 'sm' ? 'Small' : size === 'md' ? 'Medium, the default' : 'Large',
            when: size === 'sm' ? 'Beside caption text, or inside a dense row.' : size === 'md' ? 'Beside body text.' : 'In the middle of a panel that loads.',
            render: <Spinner size={size} label="Loading orders" />,
            code: size === 'md' ? '<Spinner label="Loading orders" />' : `<Spinner size="${size}" label="Loading orders" />`,
          })),
        },
        {
          title: 'Visible label',
          kicker: 'Set showLabel when the wait is long enough that the user asks what happens.',
          examples: [
            { title: 'Hidden label', when: 'A small, in-place spinner. The label is for assistive technology only.', render: <Spinner label="Loading orders" /> },
            { title: 'Visible label', when: 'A wait of a second or two where the user needs to know what loads.', render: <Spinner label="Loading orders" showLabel /> },
            { title: 'Large with a visible label', when: 'A panel that loads. The ring and the words sit together.', render: <Spinner size="lg" label="Loading your dashboard" showLabel /> },
            { title: 'Small with a visible label', when: 'A caption-size note, such as a sync status.', render: <Spinner size="sm" label="Syncing changes" showLabel /> },
          ],
        },
        {
          title: 'Content',
          kicker: 'A long label wraps. It never truncates, because it says what the user waits for.',
          examples: [
            { title: 'Long label', when: 'A label with detail about the work.', frame: 'narrow', render: <Spinner label="Loading the last 90 days of orders for the Montreal warehouse" showLabel /> },
            { title: 'Translated label', when: 'The app is not in English. The label comes from props.', frame: 'narrow', render: <Spinner label="Chargement des commandes" showLabel /> },
          ],
        },
        {
          title: 'Composition',
          examples: [
            {
              title: 'Beside text',
              when: 'A short in-place wait next to a line of text.',
              render: (
                <Stack direction="horizontal" gap={2} align="center">
                  <Text as="span" variant="caption" tone="muted">Checking the address</Text>
                  <Spinner size="sm" label="Checking the address" />
                </Stack>
              ),
            },
            {
              title: 'In a panel',
              when: 'One region loads. Keep the rest of the screen working. Mark the region busy.',
              render: (
                <Stack gap={3} aria-busy="true">
                  <Text as="h3" variant="heading">Recent orders</Text>
                  <Spinner label="Loading recent orders" showLabel />
                </Stack>
              ),
            },
          ],
        },
        {
          title: 'Loading, then the result',
          kicker: 'The component has no timer. You decide when it mounts and when it leaves.',
          examples: [
            {
              title: 'Delayed by 300 ms',
              when: 'The wait may be short. Mount the spinner after 300 ms so a fast load never flickers.',
              render: <DelayedSpinner />,
              code: `function DelayedSpinner() {
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [orders, setOrders] = useState<string[]>([]);
  const load = async () => {
    setLoading(true);
    const reveal = window.setTimeout(() => setShowSpinner(true), 300);
    setOrders(await fetchOrders());
    window.clearTimeout(reveal);
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
          ],
        },
      ]}
    />
  ),
};
