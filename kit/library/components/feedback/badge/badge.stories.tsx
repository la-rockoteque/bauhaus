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

/** Shows the badge only when the count is above zero. */
function InboxLabel({ unread }: { unread: number }) {
  return (
    <Stack direction="horizontal" gap={2} align="center">
      <Text as="span">Inbox</Text>
      {unread > 0 && <Badge count={unread} label="unread messages" />}
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
      imports="import { Badge, Button, Card, Stack, Text } from '@bauhaus/design-system';"
      intro={[
        'A badge is a small pill with a word or a number. It sits beside the thing it describes: "Paid" on an invoice, "3" on the Inbox tab. It stays quiet and shows a fact the user can scan.',
        'Pick the feedback component by the message. A badge marks one item. A `Banner` speaks about the whole page and stays until the cause ends. A toast confirms an action, then fades. `Progress` follows work that takes time. `EmptyState` fills a list with nothing in it.',
        'A screen reader is software that reads the page aloud. It reads the badge text in order, beside its neighbours. A badge never interrupts the reader and never announces its own change.',
        'A status badge always holds a word. A red pill with no word tells colour-blind users nothing. `status` picks the fill; the word gives the meaning.',
        'The visible text can differ from the spoken text. A count of 142 shows "99+", and a screen reader says "142 unread messages". `label` adds the noun that says what is counted.',
      ]}
      guide="feedback-badge--docs"
      guideName="Badge"
      groups={[
        {
          title: 'Status',
          kicker: 'Start here. The status sets the fill; the word you pass says what it means. Colour never works alone.',
          examples: [
            {
              title: 'Neutral',
              when: 'A state with no good or bad reading, such as Draft.',
              explain: [
                '`status` defaults to `"neutral"`, so the prop can be left out.',
                'The word is the child of the badge. It is short, so the pill stays small.',
                'The text on the fill reaches 4.5:1 contrast in both themes, so people with low vision can read it (WCAG 1.4.3, AA).',
              ],
              render: <Badge>Draft</Badge>,
              code: `// "neutral" is the default status: no prop needed.
// The child is the word. A pill with no word would show only a colour.
<Badge>Draft</Badge>`,
            },
            {
              title: 'Info',
              when: 'A fact worth a glance, such as New.',
              explain: [
                '`status="info"` gives the pill the information fill. It marks the item without saying it is good or bad.',
                'The word "New" carries the meaning. People who cannot tell the fills apart still understand it (WCAG 1.4.1, A).',
              ],
              render: <Badge status="info">New</Badge>,
              code: `// info: "look at this", with no judgement attached.
<Badge status="info">New</Badge>`,
            },
            {
              title: 'Success',
              when: 'A finished, healthy state, such as Paid.',
              explain: [
                '`status="success"` gives the success fill. Use it for a state the user is glad to see.',
                'Use the word the user would say aloud ("Paid"), not an internal code like "STATE_OK".',
              ],
              render: <Badge status="success">Paid</Badge>,
              code: `// success: the work is done and it went well.
<Badge status="success">Paid</Badge>`,
            },
            {
              title: 'Warning',
              when: 'A state that needs attention soon, such as Due soon.',
              explain: [
                '`status="warning"` marks an item that is not wrong yet but will be.',
                'Keep the word specific. "Due soon" tells the user what to do; "Warning" does not.',
              ],
              render: <Badge status="warning">Due soon</Badge>,
              code: `// warning: not wrong yet, but it will be without action.
<Badge status="warning">Due soon</Badge>`,
            },
            {
              title: 'Error',
              when: 'A failed or late state, such as Overdue.',
              explain: [
                '`status="error"` gives the error fill. The word "Overdue" says what red only hints (WCAG 1.4.1, A).',
                'A screen reader reads "Overdue" in the flow of the row. It does not announce the badge as an alert.',
              ],
              render: <Badge status="error">Overdue</Badge>,
              code: `// error: failed or late. The word says it, so the colour is a bonus.
<Badge status="error">Overdue</Badge>`,
            },
          ],
        },
        {
          title: 'Counts',
          kicker: 'A count caps at max and shows the plus sign. A screen reader still hears the full number.',
          examples: [
            {
              title: 'A count with its noun',
              when: 'A number the user scans for, such as unread messages.',
              explain: [
                '`count` shows the number. `label` names what it counts.',
                'A screen reader says "3 unread messages". With no `label` it would say only "3", a number with no meaning (WCAG 2.4.6, AA).',
                'The visible badge shows just "3". The noun is hidden text for people who hear the page.',
              ],
              render: <Badge count={3} label="unread messages" />,
              code: `// count = the number. label = what it counts.
// A screen reader says "3 unread messages"; sighted users see "3".
<Badge count={3} label="unread messages" />`,
            },
            {
              title: 'A count of one',
              when: 'The smallest count to show.',
              explain: [
                'Write the noun in the singular for one: "unread message", not "unread messages".',
                'The minimum width keeps a single digit round, so "1" and "24" look like the same kind of pill.',
              ],
              render: <Badge count={1} label="unread message" />,
              code: `// Singular noun for one. Your code picks the form, for example with a plural helper.
<Badge count={1} label="unread message" />`,
            },
            {
              title: 'Hide the badge at zero',
              when: 'A zero invites a look and gives nothing. Show the badge only when the count is above zero.',
              explain: [
                'The condition `unread > 0 &&` removes the badge from the page. There is nothing to hear or see.',
                'Keep the badge at zero only when zero matters, for example "0 open alerts" on a monitoring screen.',
                'Both inboxes below use the same component. Only the data differs.',
              ],
              render: (
                <Stack gap={2}>
                  <InboxLabel unread={0} />
                  <InboxLabel unread={5} />
                </Stack>
              ),
              code: `function InboxLabel({ unread }) {
  return (
    <Stack direction="horizontal" gap={2} align="center">
      <Text as="span">Inbox</Text>
      {/* At zero, render nothing: a "0" badge is noise. */}
      {unread > 0 && <Badge count={unread} label="unread messages" />}
    </Stack>
  );
}

<InboxLabel unread={0} />
<InboxLabel unread={5} />`,
            },
            {
              title: 'A count above the cap',
              when: 'A large number. The pill shows 99+ and the full number stays in the spoken text.',
              explain: [
                '`max` defaults to 99. Above it, the pill shows "99+", so the layout does not grow with the number.',
                'A screen reader says "142 unread messages", not "ninety-nine plus" (WCAG 4.1.2, A).',
                'You pass the real number every time. The badge does the capping.',
              ],
              render: <Badge count={142} label="unread messages" />,
              code: `// Pass the real count. The badge shows "99+" and speaks "142 unread messages".
<Badge count={142} label="unread messages" />`,
            },
            {
              title: 'A lower cap',
              when: 'A narrow space. max={9} shows 9+.',
              explain: [
                '`max={9}` keeps the pill one digit wide plus the plus sign.',
                'The spoken text stays the full 24. A smaller cap only changes what people see.',
              ],
              render: <Badge count={24} max={9} label="open tasks" />,
              code: `// max={9}: the pill reads "9+". A screen reader still says "24 open tasks".
<Badge count={24} max={9} label="open tasks" />`,
            },
            {
              title: 'A higher cap',
              when: 'A number the user needs in full, up to a limit you pick.',
              explain: [
                '`max={999}` shows 142 as it is. The pill grows by one digit.',
                'Raise the cap only when the exact number helps a decision. A wide pill draws the eye away from the label beside it.',
              ],
              render: <Badge count={142} max={999} label="open tasks" />,
              code: `// Below the cap the number shows in full, so no "+" appears here.
<Badge count={142} max={999} label="open tasks" />`,
            },
            {
              title: 'A status with a count',
              when: 'The count belongs to a status, such as failed imports.',
              explain: [
                'The word in `children` comes first, then the number. The pill reads "Failed 3".',
                'A screen reader says "Failed", then "3 failed imports". The label repeats the noun so the number is never alone.',
              ],
              render: <Badge status="error" count={3} label="failed imports">Failed</Badge>,
              code: `// children = the status word. count + label = the number and its noun.
<Badge status="error" count={3} label="failed imports">
  Failed
</Badge>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'A badge keeps its size. Long words wrap in a narrow column, and a translation fits the same way.',
          examples: [
            {
              title: 'A long status word',
              when: 'A longer word, such as a translation of "Pending".',
              explain: [
                'The pill grows with its text. In a narrow column, the text wraps instead of overflowing (WCAG 1.4.10, AA).',
                'Prefer a short word. "Waiting" scans faster than "Waiting for approval".',
              ],
              frame: 'narrow',
              render: <Badge status="warning">Waiting for approval</Badge>,
              code: `// The badge wraps its text when the column is narrow.
<Badge status="warning">Waiting for approval</Badge>`,
            },
            {
              title: 'Badges in a row',
              when: 'Several statuses side by side.',
              explain: [
                '`Stack` with `direction="horizontal"` lays the badges out. `gap={2}` is the space between them.',
                '`wrap` moves a badge to the next line when the row is full. Without it, the row would push past the screen edge.',
              ],
              frame: 'narrow',
              render: (
                <Stack direction="horizontal" gap={2} wrap>
                  <Badge status="success">Paid</Badge>
                  <Badge status="info">Shipped</Badge>
                  <Badge>Gift</Badge>
                  <Badge status="warning">Partial refund</Badge>
                </Stack>
              ),
              code: `// Lay badges out with Stack, never with margins on the badge.
<Stack direction="horizontal" gap={2} wrap>
  <Badge status="success">Paid</Badge>
  <Badge status="info">Shipped</Badge>
  <Badge>Gift</Badge>
  <Badge status="warning">Partial refund</Badge>
</Stack>`,
            },
            {
              title: 'Translated word and noun',
              when: 'The app is not in English.',
              explain: [
                'The badge holds no text of its own. The word and the `label` both come from your translations.',
                'The screen reader says the `label` in the page language. Set `lang` on the page so it uses the right voice (WCAG 3.1.1, A).',
              ],
              frame: 'phone',
              render: (
                <Stack direction="horizontal" gap={2} align="center" wrap>
                  <Badge status="success">Payé</Badge>
                  <Badge count={3} label="messages non lus" />
                </Stack>
              ),
              code: `// Both the word and the label come from your translation files.
<Stack direction="horizontal" gap={2} align="center" wrap>
  <Badge status="success">Payé</Badge>
  <Badge count={3} label="messages non lus" />
</Stack>`,
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'A badge belongs beside something. Place it with Stack, or in the slot of a component that has one.',
          examples: [
            {
              title: 'Beside a label',
              when: 'A count next to a nav item or a tab.',
              explain: [
                '`Stack` with `align="center"` lines the text and the pill up on one middle line.',
                'The screen reader reads "Inbox", then "12 unread messages". The two stay in reading order.',
              ],
              render: (
                <Stack direction="horizontal" gap={2} align="center">
                  <Text as="span">Inbox</Text>
                  <Badge count={12} label="unread messages" />
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={2} align="center">
  <Text as="span">Inbox</Text>
  <Badge count={12} label="unread messages" />
</Stack>`,
            },
            {
              title: 'In a card header',
              when: 'The status of the thing the card names, beside its title.',
              explain: [
                '`Card` has a `meta` slot for a short, non-interactive line beside the title. A badge fits there.',
                'The card title stays the heading. The badge adds a fact and does not rename the card.',
              ],
              render: <Card title="Invoice 2041" meta={<Badge status="success">Paid</Badge>}>Issued on 3 March, due on 2 April.</Card>,
              code: `<Card title="Invoice 2041" meta={<Badge status="success">Paid</Badge>}>
  Issued on 3 March, due on 2 April.
</Card>`,
            },
            {
              title: 'In a list row',
              when: 'A status after the name of each item.',
              explain: [
                'Put the badge after the name, in the same place on every row. The eye then scans down one column.',
                'Keep one badge per row. Two competing pills slow the scan.',
              ],
              render: (
                <Stack gap={2}>
                  <Stack direction="horizontal" gap={2} align="center"><Text as="span">Invoice 2041</Text><Badge status="success">Paid</Badge></Stack>
                  <Stack direction="horizontal" gap={2} align="center"><Text as="span">Invoice 2042</Text><Badge status="error">Overdue</Badge></Stack>
                </Stack>
              ),
              code: `<Stack gap={2}>
  <Stack direction="horizontal" gap={2} align="center">
    <Text as="span">Invoice 2041</Text>
    <Badge status="success">Paid</Badge>
  </Stack>
  <Stack direction="horizontal" gap={2} align="center">
    <Text as="span">Invoice 2042</Text>
    <Badge status="error">Overdue</Badge>
  </Stack>
</Stack>`,
            },
            {
              title: 'Inside a button',
              when: 'A button whose label needs a count, such as a filter showing how many items match.',
              explain: [
                'The badge sits in the button label. The press target is the whole button; the badge is not pressable on its own (WCAG 2.5.8, AA).',
                'The button name becomes "Filters 2 active filters". Say the noun in `label` so the name still makes sense.',
              ],
              render: <Button variant="secondary">Filters <Badge count={2} label="active filters" status="info" /></Button>,
              code: `// The badge is part of the label. Pressing it presses the button.
<Button variant="secondary" onClick={openFilters}>
  Filters <Badge count={2} label="active filters" status="info" />
</Button>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'A badge never speaks up. It is read where it sits, and it is silent when it changes.',
          examples: [
            {
              title: 'What a screen reader says',
              when: 'Check each badge against the sentence a person hears.',
              explain: [
                'A status badge is read as its word: "Overdue".',
                'A count badge with `label` is read as the full number and its noun: "142 unread messages". The "99+" on screen is hidden from the reader.',
                'A badge never gets focus and has no role. It is plain text in the page flow, so it adds no tab stop.',
              ],
              render: (
                <Stack gap={2}>
                  <Badge status="error">Overdue</Badge>
                  <Badge count={142} label="unread messages" status="info" />
                </Stack>
              ),
              code: `// Heard: "Overdue"
<Badge status="error">Overdue</Badge>

// Seen: "99+"   Heard: "142 unread messages"
<Badge count={142} label="unread messages" status="info" />`,
            },
            {
              title: 'Decorative, when the text says it',
              when: 'The text beside the badge already gives the fact.',
              explain: [
                '`decorative` hides the badge from screen readers. The fact is read once, from the text.',
                'Without it, a screen reader would say "12 unread messages 12": the same fact twice (WCAG 1.1.1, A).',
                'Use it only when the nearby text says the same thing. If the badge is the only source, leave it off.',
              ],
              render: (
                <Stack direction="horizontal" gap={2} align="center">
                  <Text as="span">12 unread messages</Text>
                  <Badge count={12} decorative />
                </Stack>
              ),
              code: `// The text already says "12 unread messages".
// decorative hides the pill from screen readers, so the fact is not read twice.
<Stack direction="horizontal" gap={2} align="center">
  <Text as="span">12 unread messages</Text>
  <Badge count={12} decorative />
</Stack>`,
            },
            {
              title: 'A count that changes',
              when: 'The count updates while the user is on the page.',
              explain: [
                'The badge does not announce its own change. A screen reader user hears nothing when the number moves.',
                'A status message does the announcing. `role="status"` makes the line a polite live region: it speaks when its text changes, after the current sentence (WCAG 4.1.3, AA).',
                'Announce only changes that matter. A status line for every tick would flood the reader.',
              ],
              render: <UnreadCounter />,
              code: `function UnreadCounter() {
  const [unread, setUnread] = useState(2);
  return (
    <Stack gap={3} align="start">
      <Stack direction="horizontal" gap={2} align="center">
        <Text as="span">Inbox</Text>
        <Badge count={unread} label="unread messages" />
      </Stack>
      <Button variant="secondary" onClick={() => setUnread(unread + 1)}>
        Receive a message
      </Button>
      {/* Keep this element on the page from the start. The reader watches it for changes. */}
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
