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

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Banner"
      layer="Component"
      family="Feedback"
      imports="import { Banner, Button, Link, Stack, Text } from '@acme/design-system';"
      guide="feedback-banner--docs"
      guideName="Banner"
      groups={[
        {
          title: 'Status',
          kicker: 'The status sets the icon, the colour and the spoken word. The text says what happened.',
          examples: [
            { title: 'Info', when: 'A fact about the page or the system, such as a plan that ends soon.', render: <Banner status="info">Your trial ends in 3 days.</Banner> },
            { title: 'Success', when: 'A result the user may want to read again.', render: <Banner status="success">Your plan is now Team. The new limits apply today.</Banner> },
            { title: 'Warning', when: 'Something will go wrong soon unless the user acts.', render: <Banner status="warning">Maintenance starts tonight at 22:00. Saving is off for 15 minutes.</Banner> },
            { title: 'Error', when: 'Something failed and the user must know.', render: <Banner status="error">The import failed. No rows were added.</Banner> },
          ],
        },
        {
          title: 'Anatomy',
          kicker: 'Title, message and actions are all optional parts. Use the ones the message needs.',
          examples: [
            { title: 'Message only', when: 'A short note that needs no lead line.', render: <Banner>Prices include tax.</Banner> },
            { title: 'Title only', when: 'The lead line says everything.', render: <Banner status="success" title="Payment received" /> },
            { title: 'Title and message', when: 'A lead line, then the reason or the detail.', render: <Banner status="warning" title="Your plan ends on 30 June">After that date, projects become read-only.</Banner> },
            {
              title: 'With an action',
              when: 'The message has a next step. Put it in the banner, so the message is not a dead end.',
              render: (
                <Banner status="warning" title="Your plan ends on 30 June" actions={<Button variant="secondary">Renew plan</Button>}>
                  After that date, projects become read-only.
                </Banner>
              ),
            },
            {
              title: 'With two actions',
              when: 'A main step and a way out.',
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
            },
            {
              title: 'With a link',
              when: 'The detail lives on another page.',
              render: <Banner status="info">The export format changed. <Link href="#changes">Read what changed</Link>.</Banner>,
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
              render: <DismissDemo />,
              code: `function DismissDemo() {
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
              render: (
                <Banner status="warning" title="Your card expires soon" actions={<Button variant="secondary">Update card</Button>} onDismiss={() => {}} dismissLabel="Dismiss card warning">
                  Update it before 1 July to keep your plan.
                </Banner>
              ),
              code: `<Banner
  status="warning"
  title="Your card expires soon"
  actions={<Button variant="secondary">Update card</Button>}
  onDismiss={() => setOpen(false)}
  dismissLabel="Dismiss card warning"
>
  Update it before 1 July to keep your plan.
</Banner>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The banner fills its container and wraps its text. It never truncates.',
          examples: [
            {
              title: 'A long message',
              when: 'A message of several sentences. It wraps.',
              render: (
                <Banner status="info" title="We moved your files">
                  Your projects now live in the Team workspace. Folders keep their names, and shared links still work. Ask an admin if a project is missing.
                </Banner>
              ),
            },
            {
              title: 'Narrow column',
              when: 'A side panel. Title, message and action stack inside the width.',
              frame: 'narrow',
              render: <Banner status="warning" title="Storage almost full" actions={<Button variant="secondary">Free up space</Button>}>You used 94% of your space.</Banner>,
            },
            {
              title: 'Phone width',
              when: 'A phone. The close button stays in reach.',
              frame: 'phone',
              render: <Banner status="error" title="You are offline" onDismiss={() => {}} dismissLabel="Dismiss offline message">Changes are saved on this device and sent when you reconnect.</Banner>,
            },
          ],
        },
        {
          title: 'Composition',
          examples: [
            {
              title: 'Several banners',
              when: 'Two causes at once. They stack in the flow. Keep the count low.',
              render: (
                <Stack gap={3}>
                  <Banner status="error" title="Sync is paused">Reconnect to send your changes.</Banner>
                  <Banner status="warning">Your plan ends on 30 June.</Banner>
                </Stack>
              ),
            },
            {
              title: 'Page-level save error with a retry',
              when: 'A save failed. The user needs to read the cause again and try again.',
              render: <SaveErrorBanner />,
              code: `function SaveErrorBanner() {
  const [failed, setFailed] = useState(true);
  return failed ? (
    <Banner
      status="error"
      title="Your changes were not saved"
      actions={<Button variant="secondary" onClick={retrySave}>Retry</Button>}
    >
      The server did not answer. Your edits are still on this page.
    </Banner>
  ) : (
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
            { title: 'Urgent error', when: 'An error the user must act on now. It gets role="alert" and interrupts speech.', render: <Banner status="error" urgent title="Payment failed">Your card was declined. Use another card to keep your plan.</Banner> },
            { title: 'Calm message', when: 'Any message that can wait. Leave urgent off.', render: <Banner status="warning">Your session ends in 10 minutes.</Banner> },
            { title: 'Translated status word', when: 'The app is not in English. Pass the spoken name of the icon in the app language.', render: <Banner status="error" statusLabel="Erreur">L'envoi a échoué. Réessayez dans quelques minutes.</Banner> },
            { title: 'Translated close label', when: 'The close button needs a name in the app language.', render: <Banner status="info" onDismiss={() => {}} dismissLabel="Fermer le message">Votre essai se termine dans 3 jours.</Banner> },
          ],
        },
      ]}
    />
  ),
};
