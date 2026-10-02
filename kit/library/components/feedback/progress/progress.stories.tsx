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
      imports="import { Button, Progress, Stack, Text } from '@bauhaus/design-system';"
      intro={[
        'A progress bar shows how far a long task has got: an upload, an import, an export. It names the task and says how much is done, in words as well as in the bar.',
        'Pick the feedback component by the message. `Progress` follows work that takes time. A spinner shows a short wait of unknown length. A skeleton holds the place of content that loads in one or two seconds. A `Banner` stays on the page. A toast confirms, then fades.',
        'Determinate means you know how far the work went: pass `value`. Indeterminate means you do not: leave `value` out.',
        'A screen reader is software that reads the page aloud. It reads the bar as "Uploading report.pdf, progress bar, 42%". It does not announce each change. You announce the end yourself.',
        '`Progress` renders the native `<progress>` element. The browser already gives it the right role and value for assistive technology, so no ARIA attributes are needed.',
      ]}
      guide="feedback-progress--docs"
      guideName="Progress"
      groups={[
        {
          title: 'Determinate',
          kicker: 'Start here. Pass value. The bar shows how much is done, and the percent shows beside the label.',
          examples: [
            {
              title: 'Partway',
              when: 'The work runs and you know how far it went.',
              explain: [
                '`label` is required. It is the visible name of the task. A bar with no name tells nobody what is in progress (WCAG 4.1.2, A).',
                '`value` is how much is done, from 0 up to `max`. `max` defaults to 100, so 42 means 42%.',
                'The percent shows beside the label, and a screen reader hears it as the value text.',
              ],
              render: <Progress label="Uploading report.pdf" value={42} />,
              code: `// label = what is in progress. value = how much is done (0 to 100 by default).
// Your code keeps value up to date, for example from an upload event.
<Progress label="Uploading report.pdf" value={42} />`,
            },
            {
              title: 'Not started',
              when: 'The work exists and has not begun. The bar sits at zero.',
              explain: [
                '`value={0}` is not the same as no value. Zero says "known, nothing done". No value says "unknown length".',
                'Use zero when the user already pressed start and the first data has not come yet.',
              ],
              render: <Progress label="Importing contacts" value={0} />,
              code: `// 0 is a real value: the length is known and none of it is done.
<Progress label="Importing contacts" value={0} />`,
            },
            {
              title: 'Done',
              when: 'The work ended. Replace the percent with a word.',
              explain: [
                '`valueText` replaces the percent in the text and for assistive technology. "Done" is clearer than "100%".',
                'The bar does not announce that it finished. See the upload demo in Accessibility wiring for the status message.',
              ],
              render: <Progress label="Uploading report.pdf" value={100} valueText="Done" />,
              code: `// valueText overrides the percent. A screen reader hears "Done".
<Progress label="Uploading report.pdf" value={100} valueText="Done" />`,
            },
            {
              title: 'Your own scale',
              when: 'The work counts items, not percent. Set max to the total.',
              explain: [
                '`max={12}` makes 12 the full bar. `value={3}` fills a quarter of it.',
                '`valueText` says the count in words. Without it, the text would show "25%", which hides the item count the user cares about.',
              ],
              render: <Progress label="Uploading files" value={3} max={12} valueText="3 of 12 files" />,
              code: `// max = the number that means "all done". value counts toward it.
<Progress label="Uploading files" value={3} max={12} valueText="3 of 12 files" />`,
            },
            {
              title: 'Value text in words',
              when: 'A size or a time says more than a percent.',
              explain: [
                '`valueText` can hold any short phrase: a size, a time left, a step.',
                'The same phrase is shown and spoken (`aria-valuetext`). Sighted and non-sighted users get the same words.',
              ],
              render: <Progress label="Downloading update" value={64} valueText="64 MB of 100 MB" />,
              code: `// Any short phrase works: the bar stays at 64%, the words say what that means.
<Progress label="Downloading update" value={64} valueText="64 MB of 100 MB" />`,
            },
          ],
        },
        {
          title: 'Indeterminate',
          kicker: 'Leave value out when the length is unknown. The label still says what waits.',
          examples: [
            {
              title: 'Unknown length',
              when: 'The work takes a while and you cannot say how far it went.',
              explain: [
                'With no `value`, a segment slides along the track. No percent shows.',
                'Never park a determinate bar at 99% to fake it. Show the true value, or leave it out (Nielsen heuristic 1, visibility of system status).',
                'With "reduce motion" on in the system settings, the segment stops and rests in the middle (WCAG 2.3.3, AAA). The label still says what waits.',
              ],
              render: <Progress label="Preparing your export" />,
              code: `// No value: the bar is indeterminate. The label does the explaining.
<Progress label="Preparing your export" />`,
            },
            {
              title: 'Unknown length, with a word',
              when: 'A short status beside the label helps the user wait.',
              explain: [
                '`valueText` also works without a value. It shows beside the label and a screen reader reads it.',
                'Change the word as the stage changes: "Starting", then "Compressing", then "Almost done".',
              ],
              render: <Progress label="Preparing your export" valueText="Starting" />,
              code: `// Words instead of a percent. Update the text as the stage changes.
<Progress label="Preparing your export" valueText="Starting" />`,
            },
          ],
        },
        {
          title: 'Failure',
          kicker: 'Pass error. The message shows as text with an icon, and the bar takes the error colour.',
          examples: [
            {
              title: 'Failed partway',
              when: 'The work stopped. The bar keeps the value it reached.',
              explain: [
                '`error` takes the message as text. It shows under the bar with an error icon.',
                'The text and the icon say it failed. The error colour is an extra cue, not the only one (WCAG 1.4.1, A).',
                'The bar keeps its value, so the user sees how far it got.',
              ],
              render: <Progress label="Uploading report.pdf" value={42} error="The connection dropped. Try again." />,
              code: `// error = a message in words. The bar keeps the last value it reached.
<Progress label="Uploading report.pdf" value={42} error="The connection dropped. Try again." />`,
            },
            {
              title: 'Failure with a retry',
              when: 'Put the next step beside the error.',
              explain: [
                'An error with no next step is a dead end. A retry button next to it removes the dead end (Nielsen heuristic 9, help users recover from errors).',
                'The message says what happened. The button says what to do.',
              ],
              render: (
                <Stack gap={3} align="start">
                  <Progress label="Uploading report.pdf" value={42} error="The connection dropped." />
                  <Button variant="secondary">Retry upload</Button>
                </Stack>
              ),
              code: `<Stack gap={3} align="start">
  <Progress label="Uploading report.pdf" value={42} error="The connection dropped." />
  <Button variant="secondary" onClick={retryUpload}>Retry upload</Button>
</Stack>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The bar fills its container. The label wraps and never truncates.',
          examples: [
            {
              title: 'Long label',
              when: 'A long file name or a long phrase.',
              explain: [
                'The label wraps to a second line. The percent stays beside the first line.',
                'Do not cut the name with an ellipsis. The user needs the full name to know which file it is (WCAG 1.4.10, AA).',
              ],
              frame: 'narrow',
              render: <Progress label="Uploading quarterly-financial-report-final-v3.pdf" value={58} />,
              code: `<Progress label="Uploading quarterly-financial-report-final-v3.pdf" value={58} />`,
            },
            {
              title: 'Translated label and value',
              when: 'The app is not in English.',
              explain: [
                'The component holds no text. The label, `valueText` and `error` all come from your translations.',
                'Without `valueText`, the percent shows. It reads the same in every language.',
              ],
              frame: 'narrow',
              render: <Progress label="Téléversement du rapport" value={3} max={12} valueText="3 fichiers sur 12" />,
              code: `<Progress label="Téléversement du rapport" value={3} max={12} valueText="3 fichiers sur 12" />`,
            },
            {
              title: 'Phone width',
              when: 'A phone.',
              explain: [
                'The bar fills the width. It has no fixed size, so it never forces sideways scrolling.',
                'The label and the percent share the first line and wrap when they no longer fit (WCAG 1.4.10, AA).',
              ],
              frame: 'phone',
              render: <Progress label="Uploading report.pdf" value={42} />,
              code: `<Progress label="Uploading report.pdf" value={42} />`,
            },
          ],
        },
        {
          title: 'Composition',
          examples: [
            {
              title: 'Several jobs',
              when: 'A list of uploads, each with its own bar and label.',
              explain: [
                '`Stack` with `gap={4}` spaces the bars. Each bar has its own label, so a screen reader lists them one by one.',
                'Each bar can be in a different state: done, partway, unknown, failed.',
                'Give each label the file name. "Upload 1", "Upload 2" would tell the user nothing.',
              ],
              render: (
                <Stack gap={4}>
                  <Progress label="report.pdf" value={100} valueText="Done" />
                  <Progress label="photos.zip" value={35} />
                  <Progress label="notes.txt" />
                  <Progress label="video.mov" value={12} error="The file is larger than 2 GB." />
                </Stack>
              ),
              code: `<Stack gap={4}>
  {/* Done */}
  <Progress label="report.pdf" value={100} valueText="Done" />
  {/* Partway */}
  <Progress label="photos.zip" value={35} />
  {/* Length unknown */}
  <Progress label="notes.txt" />
  {/* Failed */}
  <Progress label="video.mov" value={12} error="The file is larger than 2 GB." />
</Stack>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label names the bar. The bar does not announce that it is done: you do.',
          examples: [
            {
              title: 'What a screen reader says',
              when: 'Check the bar against the sentence a person hears.',
              explain: [
                'The reader says the label, the role and the value text: "Uploading report.pdf, progress bar, 42%".',
                'It does not repeat the value as it changes. Announcing every percent would flood the user.',
                'The bar takes no keyboard focus. It is not a control.',
              ],
              render: <Progress label="Uploading report.pdf" value={42} />,
              code: `// Heard: "Uploading report.pdf, progress bar, 42%"
<Progress label="Uploading report.pdf" value={42} />`,
            },
            {
              title: 'From unknown to known, then announced',
              when: 'The work starts with no length, then reports its value. Announce the end in a status line.',
              explain: [
                'While the value is undefined the bar is indeterminate. When a number arrives, the same bar becomes determinate in place.',
                'The status line has `role="status"`, a polite live region. When its text changes to "Upload complete.", the reader says it (WCAG 4.1.3, AA).',
                'The line must be on the page before the text changes. It starts empty.',
              ],
              render: <UploadProgress />,
              code: `function UploadProgress() {
  const [running, setRunning] = useState(false);
  const [value, setValue] = useState(undefined);
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (!running) return;
    // Every 600 ms, add 20. In your app, set value from the real upload event.
    const timer = window.setInterval(() => {
      setValue((current) => {
        const next = (current ?? 0) + 20;
        if (next >= 100) {
          window.clearInterval(timer);
          setRunning(false);
          // The end is announced once, not every percent.
          setStatus('Upload complete.');
          return 100;
        }
        return next;
      });
    }, 600);
    // After 1.2 s the length becomes known: undefined turns into 0.
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
      {(running || value !== undefined) && (
        <Progress label="Uploading report.pdf" value={value} valueText={value === 100 ? 'Done' : undefined} />
      )}
      <Button variant="secondary" onClick={start} disabled={running}>Start upload</Button>
      {/* Always on the page, empty until the end. */}
      <Text as="p" role="status">{status}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'A stable id',
              when: 'Another element must point at the bar, for example with aria-controls.',
              explain: [
                '`Progress` makes its own id for the label link. `id` replaces it with yours.',
                'Other attributes pass to the native `<progress>`. Use `aria-describedby` to link extra help text.',
              ],
              render: <Progress id="export-progress" label="Exporting orders" value={70} />,
              code: `// id goes on the <progress> element. A button can point at it with aria-controls="export-progress".
<Progress id="export-progress" label="Exporting orders" value={70} />`,
            },
          ],
        },
      ]}
    />
  ),
};
