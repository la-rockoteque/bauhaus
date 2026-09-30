import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../.storybook/doc-page/doc-page';
import { Spinner } from './spinner';
import { spinnerRules } from './spinner.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Feedback/Spinner', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

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
          { name: 'size.icon.sm · md · lg', tier: '2', use: 'Ring size, 16, 20 and 24px' },
          { name: 'size.border.thick', tier: '2', use: 'Ring thickness' },
          { name: 'motion.duration.deliberate', tier: '2', use: 'One turn, linear' },
          { name: 'text.caption.* · space.control.gap', tier: '2', use: 'Visible label, and its gap to the ring' },
        ],
      }}
      anatomy={{
        render: <Spinner label="Loading orders" showLabel />,
        stageWidth: 'calc(var(--ds-space-12) * 4)',
        parts: [
          { n: 1, label: 'Status region', note: 'role status, required', x: 'calc(100% + 18px)', y: '-12px' },
          { n: 2, label: 'Ring', note: 'aria-hidden', x: '-18px', y: '50%' },
          { n: 3, label: 'Label', note: 'required; hidden from sight unless showLabel', x: '60%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Sizes', value: 'sm 16px · md 20px · lg 24px (size.icon.*)' },
        { label: 'Turn', value: 'motion.duration.deliberate, linear, infinite' },
        { label: 'Reduced motion', value: 'The ring stops and stays as a static arc' },
        { label: 'Delay', value: 'None built in. The caller waits about 300 ms before it mounts the spinner.' },
      ]}
      api={[
        { label: 'label', value: 'Required. The accessible name, such as "Loading orders". Say what loads.' },
        { label: 'size', value: '"sm" | "md" | "lg", default "md".' },
        { label: 'showLabel', value: 'Show the label beside the ring instead of hiding it from sight.' },
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
      rules={spinnerRules}
      guide="feedback-spinner--docs"
      guideName="Spinner"
    />
  ),
};
