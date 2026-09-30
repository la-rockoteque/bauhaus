import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { Progress } from './progress';
import { progressRules } from './progress.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Feedback/Progress', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const notInteractive = 'A progress bar is not interactive.';
const wide = { inlineSize: '100%', maxInlineSize: 'calc(var(--ds-space-12) * 6)' } as const;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Progress"
      layer="Component"
      family="Feedback"
      plain="A progress bar shows how far a long task has got, such as an upload. It always says what it is and how much is done, in words as well as in the bar."
      precise="Component in the feedback family · a native progress element with a visible label and a value in text · determinate (value and max) or indeterminate · not a gauge of a static quantity."
      usedFor="An upload, an import or an export that takes two seconds or more."
      tokens={{
        mode: 'consumed',
        note: 'The progress bar has no component tokens.',
        rows: [
          { name: 'progress.track', tier: 'role', use: 'The empty part of the bar', swatch: '--ds-progress-track' },
          { name: 'progress.fill', tier: 'role', use: 'The filled part; 3:1 on the track and the page', swatch: '--ds-progress-fill' },
          { name: 'status.error', tier: 'role', use: 'Fill and text when the work failed', swatch: '--ds-status-error' },
          { name: 'text.default · text.muted', tier: 'role', use: 'Label, and the value text' },
          { name: 'text.label.* · text.caption.* · text.code.*', tier: '2', use: 'Label, error line, and the number beside the label' },
          { name: 'space.2 · space.field.gap', tier: '2', use: 'Height of the bar, and the gap between label, bar and message' },
          { name: 'radius.pill · motion.duration.base', tier: '2', use: 'Bar ends; the fill change, linear' },
        ],
      }}
      stage={{
        render: <Progress label="Uploading report.pdf" value={40} valueText="40% · 4.2 of 10.5 MB" />,
        parts: [
          { n: 1, label: 'Label', note: 'visible, required', target: '.ds-progress__label', at: 'top-start' },
          { n: 2, label: 'Value text', note: 'the number in words', target: '.ds-progress__value', at: 'bottom-end' },
          { n: 3, label: 'Track', note: 'progress.track', target: '.ds-progress__bar', at: 'bottom-end' },
          { n: 4, label: 'Fill', note: 'progress.fill', target: '.ds-progress__bar', at: 'top-start' },
        ],
      }}
      specs={[
        { label: 'Element', value: 'Native progress, labelled by a visible label element' },
        { label: 'Height', property: 'height', target: '.ds-progress__bar', token: 'space.2', value: '8px' },
        { label: 'Fill', value: 'Linear easing only; changes over motion.duration.base' },
        { label: 'Indeterminate', value: 'A segment slides along the track, linear; static under reduced motion' },
        { label: 'Value text', value: 'Percent by default, or your own words' },
      ]}
      api={[
        { label: 'label', value: 'Required. Visible text: what is in progress.' },
        { label: 'value · max', value: 'How much is done and what done means, default max 100. Leave value out for an indeterminate bar.' },
        { label: 'valueText', value: 'The value in words, such as "3 of 12 rows". Shown, and used as aria-valuetext.' },
        { label: 'error', value: 'A message. The bar takes the error colour and the message shows with an icon.' },
        { label: '…props', value: 'Every native progress attribute, such as id.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'designed', label: 'Nothing (0%)', render: <div style={wide}><Progress label="Uploading report.pdf" value={0} /></div>, trigger: 'value={0}', note: 'Empty track. The value text reads 0%.' },
          { id: 'loading', status: 'designed', label: 'Loading (indeterminate)', render: <div style={wide}><Progress label="Preparing the export" /></div>, trigger: 'no value', note: 'Length unknown. No value text.' },
          { id: 'none', status: 'n/a', reason: 'The progress bar holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'The progress bar holds no collection.' },
          { id: 'some', status: 'designed', label: 'Some (partial)', render: <div style={wide}><Progress label="Importing contacts" value={7} max={12} valueText="7 of 12 files" /></div>, trigger: 'value, max, valueText' },
          { id: 'too-many', status: 'designed', label: 'Too many (long label)', render: <div style={{ ...wide, maxInlineSize: 'calc(var(--ds-space-12) * 4)' }}><Progress label="Uploading Q3-regional-sales-forecast-final-v7-reviewed.xlsx" value={65} /></div>, trigger: 'long label', note: 'The label wraps and never truncates.' },
          { id: 'incorrect', status: 'designed', label: 'Incorrect (failed)', render: <div style={wide}><Progress label="Uploading report.pdf" value={60} error="The connection dropped at 60%. Check your network and try again." /></div>, trigger: 'error', note: 'Text and an icon, not colour alone.' },
          { id: 'correct', status: 'n/a', reason: 'The progress bar takes no input to validate.' },
          { id: 'done', status: 'designed', label: 'Done (100%)', render: <div style={wide}><Progress label="Uploading report.pdf" value={100} valueText="Done" /></div>, trigger: 'value === max', note: 'The caller announces completion in a status message.' },
          { id: 'default', status: 'designed', render: <div style={wide}><Progress label="Uploading report.pdf" value={40} /></div>, trigger: 'value' },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      dos={[
        { text: 'Show the label and the value in text next to the bar.', basis: 'WCAG 1.4.1 (A); 4.1.2 (A)' },
        { text: 'Use it from about two seconds of wait.', basis: 'Nielsen response times' },
        { text: 'Announce completion in a polite status message.', basis: 'WCAG 4.1.3 (AA)' },
        { text: 'Switch to indeterminate when the length is unknown.', basis: 'Nielsen 1' },
      ]}
      donts={[
        { text: 'Hide the label or show a bar with no value in text.', basis: 'WCAG 4.1.2 (A)', rule: 'progress.value-exposed' },
        { text: 'Park the bar at 99%.', basis: 'Nielsen 1', rule: 'progress.honest' },
        { text: 'Ease the fill in or out.', basis: 'motion.md category 4', rule: 'progress.linear-easing' },
        { text: 'Let the indeterminate segment loop under reduced motion.', basis: 'WCAG 2.3.3 (AAA)', rule: 'progress.reduced-motion' },
        { text: 'Signal failure by colour alone.', basis: 'WCAG 1.4.1 (A)', rule: 'progress.error-in-text' },
        { text: 'Write a colour or px literal in progress.css.', basis: 'misfile.raw-value-in-component', rule: 'progress.no-literal' },
      ]}
      guide="feedback-progress--docs"
      guideName="Progress"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Progress" layer="Component" family="Feedback" rules={progressRules} guide="feedback-progress--docs" guideName="Progress" />,
};
