import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Link } from '../../clickables/link/link';
import { Button } from '../../clickables/button/button';
import { Banner } from './banner';
import type { BannerStatus } from './banner';
import { bannerRules } from './banner.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Feedback/Banner', component: Banner, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Banner>;

export default meta;

const STATUSES = ['info', 'success', 'warning', 'error'] as const satisfies readonly BannerStatus[];
const column = { display: 'grid', gap: 'var(--ds-space-3)', inlineSize: '100%' } as const;

function DismissDemo() {
  const [open, setOpen] = useState(true);
  return open ? (
    <Banner status="info" onDismiss={() => setOpen(false)} dismissLabel="Dismiss message">Your trial ends in 3 days.</Banner>
  ) : (
    <Button variant="secondary" onClick={() => setOpen(true)}>Show the banner again</Button>
  );
}

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Banner"
      layer="Component"
      family="Feedback"
      plain="A banner is a note that stays on the page until the problem is gone or you close it. It tells you something about the page or the system: a trial is ending, a payment failed, a save worked."
      precise="Component in the feedback family · a persistent status message with an icon, text, optional actions and an optional close button · not for a short-lived confirmation (use a toast) and not for a field error."
      usedFor="A message about the whole page or system that the user must be able to reread."
      tokens={{
        mode: 'consumed',
        note: 'The banner has no component tokens. Each status reads its own four roles.',
        rows: [
          { name: 'status.info · success · warning · error', tier: 'role', use: 'Icon colour, one per status', swatch: '--ds-status-info' },
          { name: 'status.<s>-surface', tier: 'role', use: 'Fill of the banner', swatch: '--ds-status-info-surface' },
          { name: 'status.<s>-text', tier: 'role', use: 'Title and body text on the fill', swatch: '--ds-status-info-text' },
          { name: 'status.<s>-border', tier: 'role', use: 'Border of the banner; 3:1 on the page', swatch: '--ds-status-info-border' },
          { name: 'text.body.* · text.label.*', tier: '2', use: 'Body text, and the title in label weight' },
          { name: 'space.inset.sm · space.inset.md · space.inline.md · space.stack.xs', tier: '2', use: 'Padding, gap between icon and content, gap between title, body and actions' },
          { name: 'size.border.thin · radius.control', tier: '2', use: 'Border width and corner radius' },
        ],
      }}
      stage={{
        render: (args) => (
          <Banner
            status={args.status as BannerStatus}
            title={String(args.title) || undefined}
            actions={<Button variant="secondary">Update card</Button>}
            onDismiss={() => {}}
            dismissLabel={String(args.dismissLabel)}
            urgent={args.urgent === true}
            statusLabel={String(args.statusLabel) || undefined}
          >
            {String(args.children)}
          </Banner>
        ),
        parts: [
          { n: 1, label: 'Container', note: 'role status or alert, required', target: '.ds-banner', at: 'top-start' },
          { n: 2, label: 'Icon', note: 'one glyph per status, required', target: '.ds-banner__icon' },
          { n: 3, label: 'Title', note: 'optional', target: '.ds-banner__title' },
          { n: 4, label: 'Body', note: 'children', target: '.ds-banner__body' },
          { n: 5, label: 'Actions', note: 'optional', target: '.ds-banner__actions' },
          { n: 6, label: 'Close button', note: 'optional, needs a name', target: '.ds-banner > .ds-icon-button', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-banner', token: 'space.inset.md' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-banner', token: 'space.inset.sm' },
        { label: 'Gap', property: 'gap', target: '.ds-banner', token: 'space.inline.md' },
        { label: 'Border', value: 'size.border.thin, status.<s>-border' },
        { label: 'Radius', property: 'radius', target: '.ds-banner', token: 'radius.control' },
        { label: 'Close target', value: 'size.control.md, 32px (icon button); the target floor is size.target.min, 24px' },
        { label: 'Role', value: 'status by default · alert only for an urgent error' },
        { label: 'Width', value: 'Fills its container; text wraps, never truncates' },
      ]}
      api={[
        { label: 'status', value: '"info" | "success" | "warning" | "error", default "info". Each has its own icon glyph and word.', control: { kind: 'select', options: STATUSES, value: 'warning' } },
        { label: 'title', value: 'Optional lead line, in label weight.', control: { kind: 'text', value: 'Payment method expires soon' } },
        { label: 'children', value: 'The message.', control: { kind: 'text', value: 'Your card ends in 4242 and expires on 31 October.' } },
        { label: 'actions', value: 'Buttons or links under the message.' },
        { label: 'dismissLabel', value: 'The name of the close button. The button shows only with onDismiss too.', control: { kind: 'text', value: 'Dismiss message' } },
        { label: 'onDismiss', value: 'Called by the close button. The button shows only with dismissLabel too. The parent removes the banner.' },
        { label: 'urgent', value: 'Sets role="alert" on an error. Ignored for other statuses.', control: { kind: 'boolean', value: false } },
        { label: 'statusLabel', value: 'Spoken name of the icon. Defaults to the status word.', control: { kind: 'text', value: '' } },
      ]}
      states={{
        note: 'A banner is a message, not a control. Interaction states belong to its buttons.',
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'The parent decides whether a message exists. With none, no banner renders.' },
          { id: 'loading', status: 'n/a', reason: 'A banner holds a finished message. Waiting is a spinner, a skeleton or a progress bar.' },
          { id: 'none', status: 'n/a', reason: 'The banner holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'The banner holds no collection. One message is the Some cell.' },
          { id: 'some', status: 'designed', label: 'Some (title, body, action)', render: <Banner status="info" title="Scheduled maintenance" actions={<Button variant="secondary">Read the notice</Button>}>The service is read-only on Sunday from 02:00 to 04:00.</Banner>, trigger: 'title, children, actions', note: 'Role status: read out politely.' },
          {
            id: 'too-many',
            status: 'designed',
            label: 'Too many (long text, stacked)',
            render: (
              <div style={column}>
                <Banner status="warning" title="Three of your 14 connected calendars have not synced since the 3rd of September">Reconnect the Marketing, Field Operations and Executive Assistants calendars so that room bookings and out-of-office notes stay accurate.</Banner>
                <Banner status="info">A second banner stacks below with the same gap.</Banner>
              </div>
            ),
            trigger: 'long children; several banners',
            note: 'Text wraps and never truncates. Limit a page to a few banners.',
          },
          { id: 'incorrect', status: 'designed', label: 'Incorrect (error)', render: <Banner status="error" urgent title="We could not save your changes" actions={<Button variant="secondary">Try again</Button>}>The connection dropped. Your edits are still on this page.</Banner>, trigger: 'status="error" urgent', note: 'Role alert: read out at once.' },
          { id: 'correct', status: 'designed', label: 'Correct (success)', render: <Banner status="success" title="Profile updated">Your changes are live.</Banner>, trigger: 'status="success"' },
          { id: 'done', status: 'designed', label: 'Done (dismissed)', render: <DismissDemo />, trigger: 'onDismiss', note: 'The parent removes the banner. Focus moves to a sensible place.' },
          {
            id: 'default',
            status: 'designed',
            label: 'Default (four statuses)',
            render: (
              <div style={column}>
                <Banner status="info">Information: a new version is available.</Banner>
                <Banner status="success">Success: the file was uploaded.</Banner>
                <Banner status="warning">Warning: storage is 90% full.</Banner>
                <Banner status="error">Error: the export failed.</Banner>
              </div>
            ),
            trigger: 'status',
            note: 'Icon shape and word differ, not only colour.',
          },
          { id: 'hover', status: 'n/a', reason: 'A banner is not interactive. Its buttons carry their own hover.' },
          { id: 'focus-visible', status: 'designed', label: 'Focus-visible (on an action)', render: <Banner status="info" actions={<Button variant="secondary" className="doc-force-focus">Read the notice</Button>}>A new version is available.</Banner>, trigger: ':focus-visible on the action', note: 'Forced by .doc-force-focus. A banner never takes focus itself.' },
          { id: 'active', status: 'n/a', reason: 'A banner is not interactive. Its buttons carry their own pressed state.' },
          { id: 'disabled', status: 'n/a', reason: 'A message cannot be disabled. The parent removes it.' },
          { id: 'selected', status: 'n/a', reason: 'A banner is not selectable.' },
        ],
      }}
      dos={[
        { text: 'Pair the colour with the icon and words.', basis: 'WCAG 1.4.1 (A)', },
        { text: 'Use role status unless the user must act at once.', basis: 'WCAG 4.1.3 (AA); APG Alert' },
        { text: 'Name the close button.', basis: 'WCAG 4.1.2 (A)' },
        { text: 'Tell the user what to do next, in an action.', basis: 'Nielsen 9' },
      ]}
      donts={[
        { text: 'Show the status by colour alone.', basis: 'WCAG 1.4.1 (A)', rule: 'banner.status-not-colour-alone' },
        { text: 'Put role alert on static, calm content.', basis: 'WCAG 4.1.3 (AA)', rule: 'banner.role-matches-urgency' },
        { text: 'Add an unnamed close button.', basis: 'WCAG 4.1.2 (A)', rule: 'banner.dismiss-labelled' },
        { text: 'Write a colour literal in banner.css.', basis: 'misfile.raw-value-in-component', rule: 'banner.no-literal' },
        { text: 'Cover the content of a phone screen with a banner.', basis: 'WCAG 1.4.10 (AA)', rule: 'banner.no-blocking' },
      ]}
      guide="feedback-banner--docs"
      guideName="Banner"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Banner" layer="Component" family="Feedback" rules={bannerRules} guide="feedback-banner--docs" guideName="Banner" />,
};

/** Pressing Retry runs the save again. The banner leaves once the save works. */
function SaveErrorBanner() {
  const [failed, setFailed] = useState(true);
  return failed ? (
    <Banner
      status="error"
      title="Your changes were not saved"
      actions={<Button variant="secondary" onClick={() => setFailed(false)}>Retry</Button>}
    >
      The server did not answer. Your edits are still on this page.
    </Banner>
  ) : (
    <Text as="p" role="status">Changes saved.</Text>
  );
}

/** After the close, the "show again" button takes focus, so a keyboard user does not lose their place. */
function DismissWithFocus() {
  const [open, setOpen] = useState(true);
  return open ? (
    <Banner status="info" onDismiss={() => setOpen(false)} dismissLabel="Dismiss message">Your trial ends in 3 days.</Banner>
  ) : (
    <Button variant="secondary" autoFocus onClick={() => setOpen(true)}>Show the banner again</Button>
  );
}

/** The banner mounts after a press. Its status role may make a screen reader read it politely. */
function ConnectionBanner() {
  const [offline, setOffline] = useState(false);
  return (
    <Stack gap={3} align="start">
      <Button variant="secondary" onClick={() => setOffline(!offline)}>{offline ? 'Go back online' : 'Go offline'}</Button>
      {offline && <Banner status="warning" title="You are offline">Changes are saved on this device and sent when you reconnect.</Banner>}
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Banner"
      layer="Component"
      family="Feedback"
      imports="import { Banner, Button, Link, Stack, Text } from '@acme/design-system';"
      intro={[
        'A banner is a note that stays on the page until the cause ends or the user closes it. It speaks about the whole page or system: a trial that ends, a failed save, offline mode.',
        'Pick the feedback component by the message. A banner stays and the user can reread it. A toast confirms an action, then fades. A badge marks one item. `EmptyState` fills a list with nothing in it. An error on one field belongs next to that field.',
        'A screen reader is software that reads the page aloud. A banner gets `role="status"` (a polite live region: the reader says new text after it finishes the current sentence). Only an `urgent` error gets `role="alert"`, which interrupts.',
        'The banner shows its status with an icon, a spoken word and your text. Colour is a fourth cue and never the only one.',
        'The banner sits in the page flow and wraps its text. It never covers content and never truncates.',
      ]}
      guide="feedback-banner--docs"
      guideName="Banner"
      groups={[
        {
          title: 'Status',
          kicker: 'Start here. The status sets the icon, the colour and the spoken word. Your text says what happened.',
          examples: [
            {
              title: 'Info',
              when: 'A fact about the page or the system, such as a plan that ends soon.',
              explain: [
                '`status` defaults to `"info"`, so the prop can be left out.',
                'The banner adds an information icon with the spoken name "Information". A screen reader says it before your text.',
                'A polite `role="status"` is set for you. The message waits for the reader to finish its sentence (WCAG 4.1.3, AA).',
              ],
              render: <Banner status="info">Your trial ends in 3 days.</Banner>,
              code: `// info is the default status. The children are the message.
// Write what the user needs to know, in the user's words.
<Banner>Your trial ends in 3 days.</Banner>`,
            },
            {
              title: 'Success',
              when: 'A result the user may want to read again.',
              explain: [
                '`status="success"` shows a check icon and the spoken name "Success".',
                'For a quick "saved" that can fade, use a toast instead. A banner is for what the user may want to reread.',
              ],
              render: <Banner status="success">Your plan is now Team. The new limits apply today.</Banner>,
              code: `// success: something worked, and the details matter later.
<Banner status="success">Your plan is now Team. The new limits apply today.</Banner>`,
            },
            {
              title: 'Warning',
              when: 'Something will go wrong soon unless the user acts.',
              explain: [
                '`status="warning"` shows a warning icon. The triangle shape differs from the circle of info, so the status reads without colour (WCAG 1.4.1, A).',
                'Say what happens and when: "Saving is off for 15 minutes" helps more than "Maintenance".',
              ],
              render: <Banner status="warning">Maintenance starts tonight at 22:00. Saving is off for 15 minutes.</Banner>,
              code: `// warning: not broken yet. Give the time and the effect.
<Banner status="warning">
  Maintenance starts tonight at 22:00. Saving is off for 15 minutes.
</Banner>`,
            },
            {
              title: 'Error',
              when: 'Something failed and the user must know.',
              explain: [
                '`status="error"` shows an error icon with the spoken name "Error".',
                'Say what failed and what is safe: "No rows were added" tells the user nothing was half done (Nielsen heuristic 9, help users recover from errors).',
                'The role stays polite. Add `urgent` only when the user must act at once (see Accessibility wiring).',
              ],
              render: <Banner status="error">The import failed. No rows were added.</Banner>,
              code: `// error: it failed. Say what is safe, so the user knows nothing was left half done.
<Banner status="error">The import failed. No rows were added.</Banner>`,
            },
          ],
        },
        {
          title: 'Anatomy',
          kicker: 'Title, message and actions are optional parts. Use the ones the message needs.',
          examples: [
            {
              title: 'Message only',
              when: 'A short note that needs no lead line.',
              explain: [
                'Most banners need only children. One or two sentences, about 25 words, is enough.',
                'Start with the fact, then the effect. The user may read only the first words.',
              ],
              render: <Banner>Prices include tax.</Banner>,
              code: `<Banner>Prices include tax.</Banner>`,
            },
            {
              title: 'Title only',
              when: 'The lead line says everything.',
              explain: [
                '`title` renders as a bold lead line. With no children, the banner is one line.',
                'Use it when the title is a full sentence a user can act on or file away.',
              ],
              render: <Banner status="success" title="Payment received" />,
              code: `// No children: the title is the whole message.
<Banner status="success" title="Payment received" />`,
            },
            {
              title: 'Title and message',
              when: 'A lead line, then the reason or the detail.',
              explain: [
                'The title says what happens. The children say why, or what follows.',
                'A screen reader reads the title, then the message, in that order.',
              ],
              render: <Banner status="warning" title="Your plan ends on 30 June">After that date, projects become read-only.</Banner>,
              code: `<Banner status="warning" title="Your plan ends on 30 June">
  After that date, projects become read-only.
</Banner>`,
            },
            {
              title: 'With an action',
              when: 'The message has a next step.',
              explain: [
                '`actions` takes buttons or links. It draws them under the message.',
                'A message with no next step is a dead end. A button next to it ends the dead end (Nielsen heuristic 9, help users recover from errors).',
                'Use a secondary button here. The page keeps its own primary button.',
              ],
              render: (
                <Banner status="warning" title="Your plan ends on 30 June" actions={<Button variant="secondary">Renew plan</Button>}>
                  After that date, projects become read-only.
                </Banner>
              ),
              code: `<Banner
  status="warning"
  title="Your plan ends on 30 June"
  // A secondary button: the banner must not compete with the page's primary action.
  actions={<Button variant="secondary" onClick={renew}>Renew plan</Button>}
>
  After that date, projects become read-only.
</Banner>`,
            },
            {
              title: 'With two actions',
              when: 'A main step and a way out.',
              explain: [
                '`actions` takes one node. Wrap two buttons in a `Stack` to set the gap.',
                '`wrap` lets them stack on a narrow screen (WCAG 1.4.10, AA).',
                'The main step is secondary and the way out is tertiary, so the main step looks stronger.',
              ],
              render: (
                <Banner
                  status="info"
                  title="A new version is ready"
                  actions={
                    <Stack direction="horizontal" gap={3} wrap>
                      <Button variant="secondary">Reload now</Button>
                      <Button variant="tertiary">Later</Button>
                    </Stack>
                  }
                >
                  Reload to get the latest fixes.
                </Banner>
              ),
              code: `<Banner
  status="info"
  title="A new version is ready"
  actions={
    <Stack direction="horizontal" gap={3} wrap>
      <Button variant="secondary" onClick={reload}>Reload now</Button>
      <Button variant="tertiary" onClick={later}>Later</Button>
    </Stack>
  }
>
  Reload to get the latest fixes.
</Banner>`,
            },
            {
              title: 'With a link',
              when: 'The detail lives on another page.',
              explain: [
                'Children can hold inline elements. A `Link` inside a sentence takes you to the page, where a button would run an action.',
                'Write the link text so it makes sense alone: "Read what changed", not "click here" (WCAG 2.4.4, A).',
              ],
              render: <Banner status="info">The export format changed. <Link href="#changes">Read what changed</Link>.</Banner>,
              code: `<Banner status="info">
  The export format changed. <Link href="/changes">Read what changed</Link>.
</Banner>`,
            },
          ],
        },
        {
          title: 'Dismiss',
          kicker: 'Pass onDismiss and dismissLabel together. The parent removes the banner.',
          examples: [
            {
              title: 'Dismissable banner',
              when: 'The user can clear a message that does not need to stay.',
              explain: [
                '`onDismiss` adds a close button and runs when it is pressed. The banner does not remove itself: your state does.',
                '`dismissLabel` names the button for screen readers. An icon-only button with no name reads as "button" and nothing more (WCAG 4.1.2, A).',
                'Both props go together. With only one, no button appears.',
              ],
              render: <DismissDemo />,
              code: `function DismissDemo() {
  // The parent owns the open state. The banner only reports the press.
  const [open, setOpen] = useState(true);
  return open ? (
    <Banner status="info" onDismiss={() => setOpen(false)} dismissLabel="Dismiss message">
      Your trial ends in 3 days.
    </Banner>
  ) : (
    <Button variant="secondary" onClick={() => setOpen(true)}>Show the banner again</Button>
  );
}`,
            },
            {
              title: 'Dismiss with an action',
              when: 'A message with a next step that the user can also close.',
              explain: [
                'The close button sits at the trailing edge, away from the action. A press on one cannot hit the other.',
                'Make the `dismissLabel` specific ("Dismiss card warning") when a page can hold several banners.',
              ],
              render: (
                <Banner status="warning" title="Your card expires soon" actions={<Button variant="secondary">Update card</Button>} onDismiss={() => {}} dismissLabel="Dismiss card warning">
                  Update it before 1 July to keep your plan.
                </Banner>
              ),
              code: `<Banner
  status="warning"
  title="Your card expires soon"
  actions={<Button variant="secondary" onClick={updateCard}>Update card</Button>}
  onDismiss={() => setOpen(false)}
  // Specific, because a page can hold several banners.
  dismissLabel="Dismiss card warning"
>
  Update it before 1 July to keep your plan.
</Banner>`,
            },
            {
              title: 'Keep focus after the close',
              when: 'A keyboard user closes the banner. The close button disappears with it.',
              explain: [
                'Focus (the place the keyboard is) sat on the close button. When the button leaves, focus falls back to the top of the page.',
                'Move focus to a sensible next element. Here the "show again" button mounts with `autoFocus`. In your page, pick the element after the banner, or the main heading (WCAG 2.4.3, A).',
              ],
              render: <DismissWithFocus />,
              code: `function DismissWithFocus() {
  const [open, setOpen] = useState(true);
  return open ? (
    <Banner status="info" onDismiss={() => setOpen(false)} dismissLabel="Dismiss message">
      Your trial ends in 3 days.
    </Banner>
  ) : (
    // autoFocus runs when the button mounts: focus lands here, not at the page top.
    <Button variant="secondary" autoFocus onClick={() => setOpen(true)}>
      Show the banner again
    </Button>
  );
}`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The banner fills its container and wraps its text. It never truncates.',
          examples: [
            {
              title: 'A long message',
              when: 'A message of several sentences.',
              explain: [
                'The text wraps inside the banner. Nothing is cut, so every user can read all of it (WCAG 1.4.10, AA).',
                'Keep it short anyway. About 25 words is the target.',
              ],
              render: (
                <Banner status="info" title="We moved your files">
                  Your projects now live in the Team workspace. Folders keep their names, and shared links still work. Ask an admin if a project is missing.
                </Banner>
              ),
              code: `<Banner status="info" title="We moved your files">
  Your projects now live in the Team workspace. Folders keep their names,
  and shared links still work. Ask an admin if a project is missing.
</Banner>`,
            },
            {
              title: 'Narrow column',
              when: 'A side panel. Title, message and action stack inside the width.',
              explain: [
                'The banner fills the width of its parent. Put it in a narrow container and it narrows.',
                'The action goes under the message in every width, so the layout does not change shape.',
              ],
              frame: 'narrow',
              render: <Banner status="warning" title="Storage almost full" actions={<Button variant="secondary">Free up space</Button>}>You used 94% of your space.</Banner>,
              code: `// No size prop: the banner takes the width of the parent.
<Banner
  status="warning"
  title="Storage almost full"
  actions={<Button variant="secondary" onClick={freeUp}>Free up space</Button>}
>
  You used 94% of your space.
</Banner>`,
            },
            {
              title: 'Phone width',
              when: 'A phone.',
              explain: [
                'The close button stays at the trailing edge and keeps its 32px size, so a thumb can reach it (WCAG 2.5.8, AA).',
                'The text wraps beside the icon and the close button.',
              ],
              frame: 'phone',
              render: <Banner status="error" title="You are offline" onDismiss={() => {}} dismissLabel="Dismiss offline message">Changes are saved on this device and sent when you reconnect.</Banner>,
              code: `<Banner
  status="error"
  title="You are offline"
  onDismiss={() => setOpen(false)}
  dismissLabel="Dismiss offline message"
>
  Changes are saved on this device and sent when you reconnect.
</Banner>`,
            },
          ],
        },
        {
          title: 'Composition',
          examples: [
            {
              title: 'Several banners',
              when: 'Two causes at once.',
              explain: [
                '`Stack` with `gap={3}` spaces them. They stay in the page flow and never overlap.',
                'Keep the count low. More than two or three means the page has a problem: group the messages, or show the most serious first.',
                'Put the most serious first. A screen reader reads them in page order.',
              ],
              render: (
                <Stack gap={3}>
                  <Banner status="error" title="Sync is paused">Reconnect to send your changes.</Banner>
                  <Banner status="warning">Your plan ends on 30 June.</Banner>
                </Stack>
              ),
              code: `<Stack gap={3}>
  {/* Most serious first. */}
  <Banner status="error" title="Sync is paused">Reconnect to send your changes.</Banner>
  <Banner status="warning">Your plan ends on 30 June.</Banner>
</Stack>`,
            },
            {
              title: 'Page-level save error with a retry',
              when: 'A save failed. The user needs to read the cause again and try again.',
              explain: [
                'A toast would fade before the user read it. A banner stays, so the user can reread the cause.',
                'The retry sits in `actions`. When the retry works, your state removes the banner and a status line confirms.',
                'The message says that the edits are still on the page. That removes the fear of losing work (Nielsen heuristic 9, help users recover from errors).',
              ],
              render: <SaveErrorBanner />,
              code: `function SaveErrorBanner() {
  const [failed, setFailed] = useState(true);
  return failed ? (
    <Banner
      status="error"
      title="Your changes were not saved"
      // retrySave returns a promise. If it rejects, setFailed(false) never runs and the banner stays.
      actions={<Button variant="secondary" onClick={async () => { await retrySave(); setFailed(false); }}>Retry</Button>}
    >
      The server did not answer. Your edits are still on this page.
    </Banner>
  ) : (
    // A polite status line tells screen reader users the retry worked.
    <Text as="p" role="status">Changes saved.</Text>
  );
}`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The default role is status, a polite live region. Only a blocking error asks for more.',
          examples: [
            {
              title: 'What a screen reader says',
              when: 'Check the banner against the sentence a person hears.',
              explain: [
                'The reader says the spoken status name first, then the title, then the message: "Warning, Storage almost full, You used 94% of your space."',
                'The action buttons come next as normal tab stops. The banner itself never takes focus.',
                'A banner already on the page at load is read as page content. It is not announced.',
              ],
              render: <Banner status="warning" title="Storage almost full">You used 94% of your space.</Banner>,
              code: `// Heard: "Warning" (icon), "Storage almost full" (title), "You used 94% of your space." (message)
<Banner status="warning" title="Storage almost full">
  You used 94% of your space.
</Banner>`,
            },
            {
              title: 'A banner that appears after an action',
              when: 'The banner mounts after a press or an event.',
              explain: [
                'The banner mounts together with its message, so a screen reader may read it: a live region that is new to the page is not always announced. To be sure, keep an empty live region mounted and fill it when the event happens. If the reader speaks, it waits for the end of its sentence.',
                'The user keeps focus on the button they pressed. Do not move focus to a polite banner.',
              ],
              render: <ConnectionBanner />,
              code: `function ConnectionBanner() {
  const [offline, setOffline] = useState(false);
  return (
    <Stack gap={3} align="start">
      <Button variant="secondary" onClick={() => setOffline(!offline)}>
        {offline ? 'Go back online' : 'Go offline'}
      </Button>
      {/* The banner mounts with its message, so a screen reader may read it. */}
      {offline && (
        <Banner status="warning" title="You are offline">
          Changes are saved on this device and sent when you reconnect.
        </Banner>
      )}
    </Stack>
  );
}`,
            },
            {
              title: 'Urgent error',
              when: 'An error the user must act on now.',
              explain: [
                '`urgent` switches the role to `alert`. The screen reader interrupts what it is saying and reads the banner at once (WCAG 4.1.3, AA; APG Alert pattern).',
                '`urgent` only works with `status="error"`. A warning or an info banner stays polite.',
                'Each alert interrupts the user. Use it for a blocker such as a failed payment, never for a calm message.',
              ],
              render: <Banner status="error" urgent title="Payment failed">Your card was declined. Use another card to keep your plan.</Banner>,
              code: `// urgent = role="alert": the reader interrupts itself to say this.
// Reserve it for an error the user must act on now.
<Banner status="error" urgent title="Payment failed">
  Your card was declined. Use another card to keep your plan.
</Banner>`,
            },
            {
              title: 'Calm message',
              when: 'Any message that can wait.',
              explain: [
                'Leave `urgent` off. The role stays `status`, and the reader waits for a pause.',
                'If every banner interrupts, users learn to ignore the interruptions.',
              ],
              render: <Banner status="warning">Your session ends in 10 minutes.</Banner>,
              code: `// No urgent prop: a polite role="status".
<Banner status="warning">Your session ends in 10 minutes.</Banner>`,
            },
            {
              title: 'Translated status word',
              when: 'The app is not in English.',
              explain: [
                'The icon has a spoken name: "Error", "Warning" and so on, in English by default.',
                '`statusLabel` replaces it with a word in your language, so the reader does not mix two languages.',
              ],
              render: <Banner status="error" statusLabel="Erreur">L&apos;envoi a échoué. Réessayez dans quelques minutes.</Banner>,
              code: `// statusLabel replaces the English "Error" that the icon would speak.
<Banner status="error" statusLabel="Erreur">
  L'envoi a échoué. Réessayez dans quelques minutes.
</Banner>`,
            },
            {
              title: 'Translated close label',
              when: 'The close button needs a name in the app language.',
              explain: [
                '`dismissLabel` has no default: without it, the close button is not drawn. You always pass it in your language. The status words have English defaults, so pass `statusLabel` too.',
                'The label names the action ("Fermer le message"), not the icon ("croix").',
              ],
              render: <Banner status="info" onDismiss={() => {}} dismissLabel="Fermer le message">Votre essai se termine dans 3 jours.</Banner>,
              code: `<Banner status="info" onDismiss={close} dismissLabel="Fermer le message">
  Votre essai se termine dans 3 jours.
</Banner>`,
            },
          ],
        },
      ]}
    />
  ),
};
