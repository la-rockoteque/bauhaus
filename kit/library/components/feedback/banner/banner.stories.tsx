import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { Button } from '../../clickables/button/button';
import { Banner } from './banner';
import { bannerRules } from './banner.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Feedback/Banner', component: Banner, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Banner>;

export default meta;

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
          { name: 'space.inset.md · space.inline.md · space.stack.xs', tier: '2', use: 'Padding, gap between icon and content, gap between title, body and actions' },
          { name: 'size.border.thin · radius.control', tier: '2', use: 'Border width and corner radius' },
        ],
      }}
      stage={{
        render: (
          <Banner status="warning" title="Payment method expires soon" actions={<Button variant="secondary">Update card</Button>} onDismiss={() => {}} dismissLabel="Dismiss message">
            Your card ends in 4242 and expires on 31 October.
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
        { label: 'Padding block', property: 'padding-block', target: '.ds-banner', token: 'space.inset.md' },
        { label: 'Gap', property: 'gap', target: '.ds-banner', token: 'space.inline.md' },
        { label: 'Border', value: 'size.border.thin, status.<s>-border' },
        { label: 'Radius', property: 'radius', target: '.ds-banner', token: 'radius.control' },
        { label: 'Close target', value: 'size.target.min, 44px (icon button)' },
        { label: 'Role', value: 'status by default · alert only for an urgent error' },
        { label: 'Width', value: 'Fills its container; text wraps, never truncates' },
      ]}
      api={[
        { label: 'status', value: '"info" | "success" | "warning" | "error", default "info". Each has its own icon glyph and word.' },
        { label: 'title', value: 'Optional lead line, in label weight.' },
        { label: 'children', value: 'The message.' },
        { label: 'actions', value: 'Buttons or links under the message.' },
        { label: 'onDismiss · dismissLabel', value: 'Both required to show the close button. The parent removes the banner.' },
        { label: 'urgent', value: 'Sets role="alert" on an error. Ignored for other statuses.' },
        { label: 'statusLabel', value: 'Spoken name of the icon. Defaults to the status word.' },
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
