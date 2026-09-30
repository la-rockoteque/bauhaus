import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { Badge } from './badge';
import { badgeRules } from './badge.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Feedback/Badge', component: Badge, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Badge>;

export default meta;

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
          { name: 'space.inset.xs · space.inline.sm · space.6', tier: '2', use: 'Padding, and the minimum width so a single digit stays round' },
          { name: 'radius.pill', tier: '2', use: 'Corner radius' },
        ],
      }}
      stage={{
        render: <Badge status="warning" count={142} label="open alerts" />,
        parts: [
          { n: 1, label: 'Pill', note: 'the fill, status', target: '.ds-badge', at: 'top-start' },
          { n: 2, label: 'Visible text', note: 'a word, or a number capped at 99+', target: '.ds-badge > span:first-child' },
          { n: 3, label: 'Accessible name', note: 'the full number and what it counts; hidden, so the marker sits on the pill', target: '.ds-badge', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Minimum width', value: 'space.6, 24px, so a single digit stays a circle' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-badge', token: 'space.inline.sm' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-badge', token: 'space.inset.xs' },
        { label: 'Radius', property: 'radius', target: '.ds-badge', token: 'radius.pill' },
        { label: 'Cap', value: 'max, default 99, shows "99+"' },
        { label: 'Target', value: 'Not a control, so no target floor applies' },
      ]}
      api={[
        { label: 'status', value: '"neutral" | "info" | "success" | "warning" | "error", default "neutral".' },
        { label: 'count · max', value: 'A number to show, capped at max (default 99) as "99+".' },
        { label: 'label', value: 'What the count counts, such as "unread messages". Read out after the full number.' },
        { label: 'children', value: 'A status word, such as "Overdue".' },
        { label: 'decorative', value: 'Hide the badge from assistive technology because the text beside it says the same.' },
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
