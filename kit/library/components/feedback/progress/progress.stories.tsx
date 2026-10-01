import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { Progress } from './progress';
import { progressRules } from './progress.rules';

// The showcase: one page story. The state matrix replaces one story per state.
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
        render: (args) => (
          <Progress
            label={String(args.label)}
            value={args.value === '' ? undefined : Number(args.value) || 0}
            max={Number(args.max) || 100}
            valueText={String(args.valueText) || undefined}
            error={String(args.error) || undefined}
          />
        ),
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
        { label: 'label', value: 'Required. Visible text: what is in progress.', control: { kind: 'text', value: 'Uploading report.pdf' } },
        { label: 'value', value: 'How much is done. Leave it out for an indeterminate bar.', control: { kind: 'text', value: '40' } },
        { label: 'max', value: 'What done means. Default 100.', control: { kind: 'text', value: '100' } },
        { label: 'valueText', value: 'The value in words, such as "3 of 12 rows". Shown, and used as aria-valuetext.', control: { kind: 'text', value: '40% · 4.2 of 10.5 MB' } },
        { label: 'error', value: 'A message. The bar takes the error colour and the message shows with an icon.', control: { kind: 'text', value: '' } },
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

/** The length is unknown at first (indeterminate). Then it is known and the bar fills. A status line announces the end. */
function UploadProgress() {
  const [running, setRunning] = useState(false);
  const [value, setValue] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setValue((current) => {
        const next = (current ?? 0) + 20;
        if (next >= 100) {
          window.clearInterval(timer);
          setRunning(false);
          setStatus('Upload complete.');
          return 100;
        }
        return next;
      });
    }, 600);
    const start = window.setTimeout(() => setValue(0), 1200);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(start);
    };
  }, [running]);
  const start = () => {
    setValue(undefined);
    setStatus('');
    setRunning(true);
  };
  return (
    <Stack gap={3} align="start">
      {(running || value !== undefined) && <Progress label="Uploading report.pdf" value={value} valueText={value === 100 ? 'Done' : undefined} />}
      <Button variant="secondary" onClick={start} disabled={running}>Start upload</Button>
      <Text as="p" role="status" variant="caption" tone="muted">{status}</Text>
    </Stack>
  );
}

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Progress"
      layer="Component"
      family="Feedback"
      imports="import { Button, Progress, Stack, Text } from '@acme/design-system';"
      guide="feedback-progress--docs"
      guideName="Progress"
      groups={[
        {
          title: 'Determinate',
          kicker: 'Pass value. The bar shows how much is done, and the percent shows beside the label.',
          examples: [
            { title: 'Not started', when: 'The work exists and has not begun. The bar sits at zero.', render: <Progress label="Importing contacts" value={0} /> },
            { title: 'Partway', when: 'The work runs and you know how far it went.', render: <Progress label="Uploading report.pdf" value={42} /> },
            { title: 'Done', when: 'The work ended. Replace the percent with a word.', render: <Progress label="Uploading report.pdf" value={100} valueText="Done" /> },
            { title: 'Your own scale', when: 'The work counts items, not percent. Set max to the total.', render: <Progress label="Uploading files" value={3} max={12} valueText="3 of 12 files" /> },
            { title: 'Value text in words', when: 'A size or a time says more than a percent.', render: <Progress label="Downloading update" value={64} valueText="64 MB of 100 MB" /> },
          ],
        },
        {
          title: 'Indeterminate',
          kicker: 'Leave value out when the length is unknown. The label still says what waits.',
          examples: [
            { title: 'Unknown length', when: 'The work takes a while and you cannot say how far it went.', render: <Progress label="Preparing your export" /> },
            { title: 'Unknown length, with a word', when: 'A short status beside the label helps the user wait.', render: <Progress label="Preparing your export" valueText="Starting" /> },
          ],
        },
        {
          title: 'Failure',
          kicker: 'Pass error. The message shows as text with an icon, and the bar takes the error colour.',
          examples: [
            { title: 'Failed partway', when: 'The work stopped. The bar keeps the value it reached.', render: <Progress label="Uploading report.pdf" value={42} error="The connection dropped. Try again." /> },
            {
              title: 'Failure with a retry',
              when: 'Put the next step beside the error.',
              render: (
                <Stack gap={3} align="start">
                  <Progress label="Uploading report.pdf" value={42} error="The connection dropped." />
                  <Button variant="secondary">Retry upload</Button>
                </Stack>
              ),
            },
          ],
        },
        {
          title: 'Content',
          examples: [
            { title: 'Long label', when: 'A long file name or a long phrase. The label wraps.', frame: 'narrow', render: <Progress label="Uploading quarterly-financial-report-final-v3.pdf" value={58} /> },
            { title: 'Translated label and value', when: 'The app is not in English. Label and value text come from props.', frame: 'narrow', render: <Progress label="Téléversement du rapport" value={3} max={12} valueText="3 fichiers sur 12" /> },
            { title: 'Phone width', when: 'A phone. The bar fills the width.', frame: 'phone', render: <Progress label="Uploading report.pdf" value={42} /> },
          ],
        },
        {
          title: 'Composition',
          examples: [
            {
              title: 'Several jobs',
              when: 'A list of uploads, each with its own bar and label.',
              render: (
                <Stack gap={4}>
                  <Progress label="report.pdf" value={100} valueText="Done" />
                  <Progress label="photos.zip" value={35} />
                  <Progress label="notes.txt" />
                  <Progress label="video.mov" value={12} error="The file is larger than 2 GB." />
                </Stack>
              ),
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label names the bar. The bar does not announce that it is done: you do.',
          examples: [
            {
              title: 'From unknown to known, then announced',
              when: 'The work starts with no length, then reports its value. Announce the end in a status line.',
              render: <UploadProgress />,
              code: `function UploadProgress() {
  const [running, setRunning] = useState(false);
  const [value, setValue] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState('');
  const start = async () => {
    setValue(undefined);
    setStatus('');
    setRunning(true);
    await uploadFile({ onProgress: setValue });
    setRunning(false);
    setStatus('Upload complete.');
  };
  return (
    <Stack gap={3} align="start">
      {(running || value !== undefined) && (
        <Progress label="Uploading report.pdf" value={value} valueText={value === 100 ? 'Done' : undefined} />
      )}
      <Button variant="secondary" onClick={start} disabled={running}>Start upload</Button>
      <Text as="p" role="status">{status}</Text>
    </Stack>
  );
}`,
            },
            { title: 'A stable id', when: 'Another element must point at the bar, for example with aria-controls.', render: <Progress id="export-progress" label="Exporting orders" value={70} /> },
          ],
        },
      ]}
    />
  ),
};
