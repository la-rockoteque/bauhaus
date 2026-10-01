import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { Card } from '../../data-structures/card/card';
import { Badge } from './badge';
import type { BadgeStatus } from './badge';
import { badgeRules } from './badge.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Feedback/Badge', component: Badge, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Badge>;

export default meta;

const STATUSES = ['neutral', 'info', 'success', 'warning', 'error'] as const satisfies readonly BadgeStatus[];
const MAXES = ['9', '99', '999'] as const;
const notInteractive = 'A badge is not interactive. Something to press is a button, and something to remove is a chip.';
const inline = { display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' } as const;

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Badge"
      layer="Component"
      family="Feedback"
      plain="A badge is a small pill that shows a number, such as 3 unread, or a status word, such as Paid. It sits next to the thing it describes."
      precise="Component in the feedback family · a count or status pill with a solid fill · caps a count at 99+ and keeps the full number in its accessible name · not a control."
      usedFor="An unread count on a tab or a menu item, a status word on a row or card."
      tokens={{
        mode: 'consumed',
        note: 'The badge has no component tokens.',
        rows: [
          { name: 'badge.neutral · info · success · warning · error', tier: 'role', use: 'Solid fill, one per status', swatch: '--ds-badge-info' },
          { name: 'badge.<…>-text', tier: 'role', use: 'Text on that fill; 4.5:1', swatch: '--ds-badge-info-text' },
          { name: 'text.label.* · text.caption.*', tier: '2', use: 'Weight of the text; size and line height' },
          { name: 'size.control.sm · space.inline.sm', tier: '2', use: 'Padding, and the minimum width so a single digit stays round' },
          { name: 'radius.pill', tier: '2', use: 'Corner radius' },
        ],
      }}
      stage={{
        render: (args) => (
          <Badge status={args.status as BadgeStatus} count={Number(args.count) || 0} max={Number(args.max)} label={String(args.label) || undefined} decorative={args.decorative === true}>
            {String(args.children) || undefined}
          </Badge>
        ),
        parts: [
          { n: 1, label: 'Pill', note: 'the fill, status', target: '.ds-badge', at: 'top-start' },
          { n: 2, label: 'Visible text', note: 'a word, or a number capped at 99+', target: '.ds-badge > span:first-child' },
          { n: 3, label: 'Accessible name', note: 'the full number and what it counts; hidden, so the marker sits on the pill', target: '.ds-badge', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Minimum width', value: 'size.control.sm, 24px, so a single digit stays a circle' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-badge', token: 'space.inline.sm' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-badge', value: '0' },
        { label: 'Radius', property: 'radius', target: '.ds-badge', token: 'radius.pill' },
        { label: 'Cap', value: 'max, default 99, shows "99+"' },
        { label: 'Target', value: 'Not a control, so no target floor applies' },
      ]}
      api={[
        { label: 'status', value: '"neutral" | "info" | "success" | "warning" | "error", default "neutral".', control: { kind: 'select', options: STATUSES, value: 'warning' } },
        { label: 'count', value: 'A number to show, capped at max as "99+".', control: { kind: 'text', value: '142' } },
        { label: 'max', value: 'The largest number shown in full. Default 99.', control: { kind: 'select', options: MAXES, value: '99' } },
        { label: 'label', value: 'What the count counts, such as "unread messages". Read out after the full number.', control: { kind: 'text', value: 'open alerts' } },
        { label: 'children', value: 'A status word, such as "Overdue".', control: { kind: 'text', value: '' } },
        { label: 'decorative', value: 'Hide the badge from assistive technology because the text beside it says the same.', control: { kind: 'boolean', value: false } },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'designed', label: 'Nothing (zero)', render: <Badge count={0} label="unread messages" />, trigger: 'count={0}', note: 'Render it only when zero matters. Otherwise omit the badge.' },
          { id: 'loading', status: 'n/a', reason: 'A badge shows a known value. The caller omits it until the count arrives.' },
          { id: 'none', status: 'n/a', reason: 'The badge holds no collection. Zero is the Nothing cell.' },
          { id: 'one', status: 'designed', render: <Badge count={1} label="unread message" />, trigger: 'count={1}' },
          { id: 'some', status: 'designed', render: <Badge count={24} label="unread messages" status="info" />, trigger: 'count={24}' },
          { id: 'too-many', status: 'designed', label: 'Too many (capped)', render: <Badge count={142} label="unread messages" status="info" />, trigger: 'count above max', note: 'Shows 99+. Assistive technology hears "142 unread messages".' },
          { id: 'incorrect', status: 'designed', render: <Badge status="error">Overdue</Badge>, trigger: 'status="error"', note: 'A word, not only the colour.' },
          { id: 'correct', status: 'designed', render: <Badge status="success">Paid</Badge>, trigger: 'status="success"' },
          { id: 'done', status: 'n/a', reason: 'A badge has no lifecycle. The view swaps its status.' },
          {
            id: 'default',
            status: 'designed',
            label: 'Default (five statuses)',
            render: (
              <div style={inline}>
                <Badge>Draft</Badge>
                <Badge status="info">New</Badge>
                <Badge status="success">Paid</Badge>
                <Badge status="warning">Due soon</Badge>
                <Badge status="error">Overdue</Badge>
              </div>
            ),
            trigger: 'status',
          },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      extra={[
        {
          title: 'Decorative or not',
          kicker: 'Specimen',
          content: (
            <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
              <p style={{ margin: 0 }}>Inbox <Badge count={12} label="unread messages" status="info" /></p>
              <p style={{ margin: 0 }}>12 unread messages <Badge count={12} status="info" decorative /></p>
            </div>
          ),
        },
      ]}
      dos={[
        { text: 'Put a word in a status badge.', basis: 'WCAG 1.4.1 (A)' },
        { text: 'Cap large counts at 99+ and keep the full number in the accessible name.', basis: 'WCAG 4.1.2 (A)' },
        { text: 'Say what a count counts.', basis: 'WCAG 2.4.6 (AA)' },
        { text: 'Hide the badge from assistive technology when the text beside it says the same.', basis: 'WCAG 1.1.1 (A)' },
      ]}
      donts={[
        { text: 'Show the status by colour alone.', basis: 'WCAG 1.4.1 (A)', rule: 'badge.not-colour-alone' },
        { text: 'Show "99+" with no full number for assistive technology.', basis: 'WCAG 4.1.2 (A)', rule: 'badge.count-cap' },
        { text: 'Leave a bare number with no noun.', basis: 'WCAG 2.4.6 (AA)', rule: 'badge.count-labelled' },
        { text: 'Read the same fact twice.', basis: 'WCAG 1.1.1 (A)', rule: 'badge.decorative' },
        { text: 'Make a badge pressable.', basis: 'WCAG 2.5.8 (AA)', rule: 'badge.not-a-control' },
        { text: 'Write a colour literal in badge.css.', basis: 'misfile.raw-value-in-component', rule: 'badge.no-literal' },
      ]}
      guide="feedback-badge--docs"
      guideName="Badge"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Badge" layer="Component" family="Feedback" rules={badgeRules} guide="feedback-badge--docs" guideName="Badge" />,
};

/** Pressing the button adds a message. The badge shows the count; the status line says it aloud. */
function UnreadCounter() {
  const [unread, setUnread] = useState(2);
  return (
    <Stack gap={3} align="start">
      <Stack direction="horizontal" gap={2} align="center">
        <Text as="span">Inbox</Text>
        <Badge count={unread} label="unread messages" />
      </Stack>
      <Button variant="secondary" onClick={() => setUnread(unread + 1)}>Receive a message</Button>
      <Text as="p" role="status" variant="caption" tone="muted">{unread} unread messages</Text>
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Badge"
      layer="Component"
      family="Feedback"
      imports="import { Badge, Button, Card, Stack, Text } from '@acme/design-system';"
      guide="feedback-badge--docs"
      guideName="Badge"
      groups={[
        {
          title: 'Status',
          kicker: 'The status sets the fill. The word says what it means: colour never works alone.',
          examples: [
            { title: 'Neutral', when: 'A state with no good or bad reading, such as Draft.', render: <Badge>Draft</Badge> },
            { title: 'Info', when: 'A fact worth a glance, such as New.', render: <Badge status="info">New</Badge> },
            { title: 'Success', when: 'A finished, healthy state, such as Paid.', render: <Badge status="success">Paid</Badge> },
            { title: 'Warning', when: 'A state that needs attention soon, such as Due soon.', render: <Badge status="warning">Due soon</Badge> },
            { title: 'Error', when: 'A failed or late state, such as Overdue.', render: <Badge status="error">Overdue</Badge> },
          ],
        },
        {
          title: 'Counts',
          kicker: 'A count caps at max and shows the plus sign. Assistive technology still hears the full number.',
          examples: [
            { title: 'A count with its noun', when: 'A number the user scans for, such as unread messages.', render: <Badge count={3} label="unread messages" /> },
            { title: 'A count of one', when: 'The smallest count to show. Hide the badge at zero unless zero matters.', render: <Badge count={1} label="unread message" /> },
            { title: 'A count above the cap', when: 'A large number. The pill shows 99+ and the full number stays in the accessible text.', render: <Badge count={142} label="unread messages" /> },
            { title: 'A lower cap', when: 'A narrow space. max={9} shows 9+.', render: <Badge count={24} max={9} label="open tasks" /> },
            { title: 'A higher cap', when: 'A number the user needs in full, up to a limit you pick.', render: <Badge count={142} max={999} label="open tasks" /> },
            { title: 'A status with a count', when: 'The count belongs to a status, such as failed imports. The word still comes first.', render: <Badge status="error" count={3} label="failed imports">Failed</Badge> },
          ],
        },
        {
          title: 'Content',
          kicker: 'A badge keeps its size. Long words wrap in a narrow column.',
          examples: [
            { title: 'A long status word', when: 'A translated word that is longer than the English one.', frame: 'narrow', render: <Badge status="warning">Waiting for approval</Badge> },
            { title: 'Badges in a row', when: 'Several statuses side by side. They wrap to a new line when the row is full.', frame: 'narrow', render: (
              <Stack direction="horizontal" gap={2} wrap>
                <Badge status="success">Paid</Badge>
                <Badge status="info">Shipped</Badge>
                <Badge>Gift</Badge>
                <Badge status="warning">Partial refund</Badge>
              </Stack>
            ) },
          ],
        },
        {
          title: 'Composition',
          examples: [
            {
              title: 'In a card header',
              when: 'The status of the thing the card names, beside its title.',
              render: <Card title="Invoice 2041" meta={<Badge status="success">Paid</Badge>}>Issued on 3 March, due on 2 April.</Card>,
            },
            {
              title: 'Beside a label',
              when: 'A count next to a nav item or a tab.',
              render: (
                <Stack direction="horizontal" gap={2} align="center">
                  <Text as="span">Inbox</Text>
                  <Badge count={12} label="unread messages" />
                </Stack>
              ),
            },
            {
              title: 'Beside a row of text',
              when: 'A status in a list row, after the name of the item.',
              render: (
                <Stack gap={2}>
                  <Stack direction="horizontal" gap={2} align="center"><Text as="span">Invoice 2041</Text><Badge status="success">Paid</Badge></Stack>
                  <Stack direction="horizontal" gap={2} align="center"><Text as="span">Invoice 2042</Text><Badge status="error">Overdue</Badge></Stack>
                </Stack>
              ),
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          examples: [
            {
              title: 'Decorative, when the text says it',
              when: 'The text beside the badge already gives the fact. The badge hides from assistive technology, so it is read once.',
              render: (
                <Stack direction="horizontal" gap={2} align="center">
                  <Text as="span">12 unread messages</Text>
                  <Badge count={12} decorative />
                </Stack>
              ),
            },
            {
              title: 'A count that changes',
              when: 'The count updates while the user is on the page. The badge does not announce, so you write a polite status message.',
              render: <UnreadCounter />,
              code: `function UnreadCounter() {
  const [unread, setUnread] = useState(2);
  return (
    <Stack gap={3} align="start">
      <Stack direction="horizontal" gap={2} align="center">
        <Text as="span">Inbox</Text>
        <Badge count={unread} label="unread messages" />
      </Stack>
      <Button variant="secondary" onClick={() => setUnread(unread + 1)}>Receive a message</Button>
      <Text as="p" role="status">{unread} unread messages</Text>
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
