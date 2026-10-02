import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../feedback/badge/badge';
import { Text } from '../../../primitives/text/text';
import { Stack } from '../../../primitives/stack/stack';
import { Icon } from '../../../primitives/icon/icon';
import { useState } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Tabs, type TabItem, type TabsProps } from './tabs';
import { tabsRules } from './tabs.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Navigation/Tabs', component: Tabs, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Tabs>;

export default meta;

const item = (id: string, label: string, extra: Partial<TabItem> = {}): TabItem => ({ id, label, panel: `${label} panel: the content of this view.`, ...extra });
const THREE = [item('overview', 'Details'), item('activity', 'Log'), item('settings', 'Setup')];
const MANY = ['Overview', 'Activity', 'Shipments', 'Requisitions', 'Invoices', 'Suppliers', 'Contracts', 'Audit log', 'Settings', 'Billing'].map((label) => item(label.toLowerCase().replace(/ /g, '-'), label));

const demo = (props: Partial<TabsProps> & { tabs?: readonly TabItem[] } = {}) => <Tabs label="Account sections" tabs={THREE} {...props} />;
type Orientation = NonNullable<TabsProps['orientation']>;
type Activation = NonNullable<TabsProps['activation']>;
const ORIENTATIONS = ['horizontal', 'vertical'] as const satisfies readonly Orientation[];
const ACTIVATIONS = ['automatic', 'manual'] as const satisfies readonly Activation[];
const narrow = { maxInlineSize: 'calc(var(--ds-space-12) * 6)' } as const;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Tabs"
      layer="Component"
      family="Navigation"
      plain="Tabs let you flip between a few views of the same thing without leaving the page, like the tabs of a folder. Only one view shows at a time."
      precise="Component in the navigation family · a WAI-ARIA Tabs widget: a tab list with one tab stop, and one panel per tab · switches peer views on one URL · not for moving between pages."
      usedFor="Overview, activity and settings of one record; the same data as a table or a chart."
      tokens={{
        mode: 'consumed',
        note: 'Tabs have no component tokens. The bar under the selected tab reads border.strong, the fill reads state.selected.',
        rows: [
          { name: 'state.selected', tier: 'role', use: 'Fill of the selected tab', swatch: '--ds-state-selected' },
          { name: 'border.strong · border.default', tier: 'role', use: 'Bar of the selected tab, and the rule under the list', swatch: '--ds-border-strong' },
          { name: 'text.default · text.muted', tier: 'role', use: 'Selected and other tab labels', swatch: '--ds-text-muted' },
          { name: 'state.hover-layer · state.pressed-layer', tier: 'role', use: 'Hover and pressed fill of an unselected tab', swatch: '--ds-state-hover-layer' },
          { name: 'disabled.text · disabled.surface', tier: 'role', use: 'A disabled tab', swatch: '--ds-disabled-surface' },
          { name: 'surface.default', tier: 'role', use: 'Fade behind the scroll cue', swatch: '--ds-surface-default' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator on a tab and on a panel', swatch: '--ds-focus-ring-color' },
          { name: 'text.label.* · text.body.*', tier: '2', use: 'Tab label, and panel text' },
          { name: 'space.inset.* · space.inline.*', tier: '2', use: 'Tab padding, panel padding, gap of vertical tabs' },
          { name: 'size.control.md · size.border.thin · size.border.thick', tier: '2', use: 'Tab height (32px; the target is at least size.target.min, 24px), list rule, selected bar' },
          { name: 'size.icon.sm', tier: '2', use: 'Chevron of the scroll cue' },
        ],
      }}
      stage={{
        render: (args) => demo({ tabs: THREE.slice(0, 2), label: String(args.label), orientation: args.orientation as Orientation, activation: args.activation as Activation }),
        parts: [
          { n: 1, label: 'Tab list', note: 'role tablist, required', target: '[role=tablist]', at: 'bottom-start' },
          { n: 2, label: 'Tab', note: 'role tab, aria-selected', target: '[role=tab]:last-of-type', at: 'top-end' },
          { n: 3, label: 'Selected bar', note: 'border.strong', target: '[role=tab][aria-selected=true]', at: 'bottom-start' },
          { n: 4, label: 'Panel', note: 'role tabpanel, one per tab', target: '[role=tabpanel]:not([hidden])' },
        ],
      }}
      specs={[
        { label: 'Tab height', property: 'height', target: '[role=tab][aria-selected=true]', token: 'size.target.min', value: 'a floor; the width also grows with the label' },
        { label: 'Keys', value: 'Left and Right (Up and Down when vertical) move and wrap · Home and End jump · Tab leaves to the panel' },
        { label: 'Tab stop', value: 'one: the selected tab, or the tab that holds focus' },
        { label: 'Activation', value: 'automatic (default) selects on focus · manual selects on Enter or Space' },
        { label: 'Selected', value: 'state.selected fill, border.strong bar, text.default label' },
        { label: 'Overflow', value: 'the list scrolls along its axis; a chevron and fade show the hidden side; labels never truncate' },
      ]}
      api={[
        { label: 'label', value: 'The accessible name of the tab list, required.', control: { kind: 'text', value: 'Account sections' } },
        { label: 'tabs', value: 'TabItem[]: id, label, panel, disabled, disabledReason.' },
        { label: 'value · defaultValue · onValueChange', value: 'The selected id, controlled or not. The first enabled tab is selected by default.' },
        { label: 'orientation', value: '"horizontal" | "vertical", default "horizontal". Sets aria-orientation and the arrow keys.', control: { kind: 'select', options: ORIENTATIONS, value: 'horizontal' } },
        { label: 'activation', value: '"automatic" | "manual", default "automatic". Use manual when a panel is slow to load.', control: { kind: 'select', options: ACTIVATIONS, value: 'automatic' } },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'A tab list with no tab is an error of the caller. Tabs need at least one.' },
          { id: 'loading', status: 'n/a', reason: 'The panel content owns its loading state. The tab keeps its label.' },
          { id: 'none', status: 'n/a', reason: 'Tabs hold views, not records. An empty view shows its own empty state.' },
          { id: 'one', status: 'designed', render: demo({ tabs: THREE.slice(0, 1) }), trigger: 'tabs.length = 1', note: 'One tab is a heading in disguise. Prefer no tabs.' },
          { id: 'some', status: 'designed', render: demo(), trigger: 'tabs.length 2 to 7' },
          {
            id: 'too-many',
            status: 'designed',
            render: <div style={narrow}>{demo({ tabs: MANY, label: 'Sections of the supply account' })}</div>,
            trigger: 'overflow-x: auto',
            note: 'The list scrolls. A chevron and a fade show the tabs out of view. No label is cut.',
          },
          { id: 'incorrect', status: 'n/a', reason: 'Tabs take no input. An error belongs to the panel content.' },
          { id: 'correct', status: 'n/a', reason: 'Tabs take no input.' },
          { id: 'done', status: 'n/a', reason: 'Switching a tab has no result to announce; the panel appears.' },
          { id: 'default', status: 'designed', render: demo(), trigger: 'aria-selected="false"' },
          { id: 'hover', status: 'designed', render: demo({ tabs: [THREE[0], { ...THREE[1], className: 'doc-force-hover' }, THREE[2]] }), trigger: ':hover', note: 'Activity is forced by .doc-force-hover.' },
          { id: 'focus-visible', status: 'designed', render: demo({ tabs: [THREE[0], { ...THREE[1], className: 'doc-force-focus' }, THREE[2]] }), trigger: ':focus-visible', note: 'Activity is forced by .doc-force-focus.' },
          { id: 'active', status: 'designed', render: demo({ tabs: [THREE[0], { ...THREE[1], className: 'doc-force-active' }, THREE[2]] }), trigger: ':active', note: 'Activity is forced by .doc-force-active.' },
          {
            id: 'disabled',
            status: 'designed',
            render: demo({ tabs: [THREE[0], { ...THREE[1], disabled: true, disabledReason: 'Available after the first shipment' }, THREE[2]] }),
            trigger: 'disabled',
            note: 'Skipped by the arrows. The reason is read after the label, and shows as a browser title hint on hover.',
          },
          { id: 'selected', status: 'designed', render: demo({ defaultValue: 'settings' }), trigger: 'aria-selected="true"', note: 'Fill, bar and darker text.' },
          { id: 'default', variant: 'Vertical', status: 'designed', render: demo({ orientation: 'vertical' }), trigger: 'orientation="vertical"', note: 'Up and Down move. The bar sits at the inline end.' },
          { id: 'default', variant: 'Manual activation', status: 'designed', render: demo({ activation: 'manual' }), trigger: 'activation="manual"', note: 'Arrows move focus only. Enter or Space selects.' },
        ],
      }}
      dos={[
        { text: 'Use tabs for peer views of one thing that share one URL.', basis: 'APG Tabs; navigation.md "Tabs or links?"' },
        { text: 'Give the tab list a name with `label`.', basis: 'WCAG 4.1.2 (A)' },
        { text: 'Choose manual activation when a panel is slow to load.', basis: 'APG Tabs: automatic vs manual activation' },
        { text: 'Say why a tab is disabled with `disabledReason`.', basis: 'Nielsen 1; WCAG 3.3.2 (A)' },
        { text: 'Keep tab labels short and let the list scroll.', basis: 'WCAG 1.4.10 (AA)' },
      ]}
      donts={[
        { text: 'Move between tabs with the Tab key. Use arrows; Tab goes to the panel.', basis: 'APG Tabs', rule: 'tabs.single-tab-stop' },
        { text: 'Use tabs to go to other pages. Use a list of links with aria-current.', basis: 'navigation.md', rule: 'tabs.not-navigation' },
        { text: 'Truncate a tab label with an ellipsis.', basis: 'WCAG 1.4.10 (AA)', rule: 'tabs.overflow-scrolls' },
        { text: 'Show the selected tab by colour alone.', basis: 'WCAG 1.4.1 (A)', rule: 'tabs.selected-not-colour-alone' },
        { text: 'Disable a tab with no reason.', basis: 'Nielsen 1', rule: 'tabs.state.disabled' },
        { text: 'Write a colour literal in tabs.css.', basis: 'misfile.raw-value-in-component', rule: 'tabs.no-literal' },
      ]}
      guide="navigation-tabs--docs"
      guideName="Tabs"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Tabs" layer="Component" family="Navigation" rules={tabsRules} guide="navigation-tabs--docs" guideName="Tabs" />,
};

const noopTab = () => undefined;
const panel = (text: string) => <Text as="p">{text}</Text>;
const PROFILE_TABS = [
  { id: 'overview', label: 'Overview', panel: panel('A summary of the account and its recent activity.') },
  { id: 'activity', label: 'Activity', panel: panel('Every change to the account, newest first.') },
  { id: 'settings', label: 'Settings', panel: panel('Name, email address and notification choices.') },
] as const satisfies readonly TabItem[];
const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile', panel: panel('Your name and photo.') },
  { id: 'security', label: 'Security', panel: panel('Password and two-step sign-in.') },
  { id: 'billing', label: 'Billing', panel: panel('Plan, invoices and payment method.') },
] as const satisfies readonly TabItem[];
const REPORT_TABS = [
  { id: 'daily', label: 'Daily', panel: panel('Loads the last 24 hours.') },
  { id: 'weekly', label: 'Weekly', panel: panel('Loads the last seven days.') },
  { id: 'yearly', label: 'Yearly', panel: panel('Loads the last twelve months.') },
] as const satisfies readonly TabItem[];
const ORDER_TABS = [
  { id: 'details', label: 'Details', panel: panel('Items, address and totals.') },
  { id: 'tracking', label: 'Tracking', panel: panel('Carrier updates.'), disabled: true, disabledReason: 'Available once the order ships' },
  { id: 'invoice', label: 'Invoice', panel: panel('Download the invoice.') },
] as const satisfies readonly TabItem[];

/** The view owns the selected tab, so it can mirror it elsewhere. */
function ControlledTabs() {
  const [tab, setTab] = useState('overview');
  return (
    <Stack gap={3}>
      <Tabs label="Account" tabs={PROFILE_TABS} value={tab} onValueChange={setTab} />
      <Text variant="caption" tone="muted" as="p" role="status">Selected tab: {tab}</Text>
    </Stack>
  );
}

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Tabs"
      layer="Component"
      family="Navigation"
      imports="import { Badge, Icon, Stack, Tabs, Text } from '@bauhaus/design-system';"
      intro={[
        'Tabs flip between a few views of one thing without leaving the page, like the tabs of a folder. Only one view shows at a time.',
        'Each item in `tabs` has an `id`, a `label` (the tab) and a `panel` (the view). The `id` must be unique and stay the same between renders.',
        'Use tabs when all views share one address. When each view has its own address, use a row of links with `aria-current` instead: back, reload and sharing then work.',
        'The keyboard works like a single control. Tab enters the list on the selected tab. The arrow keys then move between tabs. Tab again leaves the list for the panel (APG Tabs).',
        'ARIA roles are labels that tell screen readers what a part is ("tab", "tabpanel"). The component sets them and links each tab to its panel. You write none.',
        'Tabs hold their own state by default (uncontrolled). Pass `value` and `onValueChange` only when your view must read or set the selected tab.',
      ]}
      guide="navigation-tabs--docs"
      guideName="Tabs"
      groups={[
        {
          title: 'Getting started',
          kicker: 'Start here: the smallest working tabs.',
          examples: [
            {
              title: 'Three tabs',
              when: 'A few views of one record, above the panel. The most common use.',
              explain: [
                '`label` names the tab list for screen readers, such as "Account". It says what the tabs switch.',
                'Each tab needs an `id`, a short `label` and a `panel`. Keep labels to one or two words.',
                'The first tab is selected at the start. You write no state: the component keeps it.',
                'All panels stay in the page. The unselected ones are hidden, so each tab always points at a real panel (APG Tabs).',
              ],
              render: <Tabs label="Account" tabs={PROFILE_TABS} />,
              code: `// Names the tab list. A screen reader says "Account, tab list".
<Tabs
  label="Account"
  tabs={[
    // id: unique and stable. label: the tab. panel: the view, any JSX.
    { id: 'overview', label: 'Overview', panel: <Text as="p">A summary of the account.</Text> },
    { id: 'activity', label: 'Activity', panel: <Text as="p">Every change, newest first.</Text> },
    { id: 'settings', label: 'Settings', panel: <Text as="p">Name, email and notifications.</Text> },
  ]}
/>`,
            },
            {
              title: 'Starting tab',
              when: 'Open on a tab other than the first. Uncontrolled.',
              explain: [
                '`defaultValue` is the `id` of the tab that is selected at the start. After that the user changes it, and the component keeps the change.',
                'If the id names a disabled tab or no tab, the first enabled tab opens instead.',
              ],
              render: <Tabs label="Account" defaultValue="activity" tabs={PROFILE_TABS} />,
              code: `// The Activity tab is selected first. The user can then pick any tab.
<Tabs label="Account" defaultValue="activity" tabs={tabs} />`,
            },
          ],
        },
        {
          title: 'Orientation',
          kicker: 'Tabs switch peer views on one URL. When each view has its own URL, use links.',
          examples: [
            {
              title: 'Horizontal',
              when: 'The default: a few views of one record, above the panel.',
              explain: [
                '`orientation` defaults to `"horizontal"`: tabs in a row, and Left and Right move between them.',
                'Home and End jump to the first and last enabled tab. The arrows wrap from the last tab to the first (APG Tabs).',
              ],
              render: <Tabs label="Account" tabs={PROFILE_TABS} />,
              code: `// Horizontal is the default: Left and Right move between tabs.
<Tabs label="Account" tabs={tabs} />`,
            },
            {
              title: 'Vertical',
              when: 'A settings page with a side list of sections. The arrows become Up and Down.',
              explain: [
                '`orientation="vertical"` stacks the tabs in a column. The component sets `aria-orientation` and swaps the arrow keys to Up and Down.',
                'The bar that marks the selected tab moves to the inline end.',
                'A vertical list grows with the page. It never scrolls, so it shows no overflow cue.',
              ],
              render: <Tabs label="Settings sections" orientation="vertical" tabs={SETTINGS_TABS} />,
              code: `// A column of tabs. Up and Down now move between them.
<Tabs label="Settings sections" orientation="vertical" tabs={tabs} />`,
            },
          ],
        },
        {
          title: 'Activation',
          kicker: 'Automatic selects a tab when it takes focus. Manual waits for Enter or Space.',
          examples: [
            {
              title: 'Automatic',
              when: 'Panels show at once, so selecting on focus costs nothing.',
              explain: [
                '`activation` defaults to `"automatic"`. Arrowing onto a tab shows its panel right away.',
                'This is quick for a keyboard user. Use it when a panel needs no loading.',
              ],
              render: <Tabs label="Account" activation="automatic" tabs={PROFILE_TABS} />,
              code: `// Default. The panel changes as soon as the arrow key lands on a tab.
<Tabs label="Account" activation="automatic" tabs={tabs} />`,
            },
            {
              title: 'Manual',
              when: 'A panel loads slowly. A run of arrow presses must not fire a run of requests.',
              explain: [
                '`activation="manual"` moves focus with the arrows but shows the panel only on Enter or Space.',
                'Without it, pressing Right three times would load three panels, and the user would wait for two they never wanted (APG Tabs).',
                'Mouse and touch still select on click.',
              ],
              render: <Tabs label="Reports" activation="manual" tabs={REPORT_TABS} />,
              code: `// Arrows move focus only. Enter or Space shows the panel.
// Pick this when each panel fetches data.
<Tabs label="Reports" activation="manual" tabs={tabs} />`,
            },
          ],
        },
        {
          title: 'Selection',
          kicker: 'The tabs run on their own, or the view owns the selected tab.',
          examples: [
            {
              title: 'Controlled',
              when: 'The view reads or sets the selected tab, for example to save it or open a tab from a link.',
              explain: [
                '`value` is the `id` of the selected tab. Pass it with `onValueChange`, and the tabs follow your state. Pass `value` without `onValueChange` and clicks change nothing.',
                '`onValueChange` receives the `id` of the tab the user picked. Store it with `setTab`.',
                'The line below the tabs shows the state the view holds. `role="status"` makes a screen reader announce it when it changes.',
              ],
              render: <ControlledTabs />,
              code: `function ControlledTabs() {
  // The view owns the selected tab.
  const [tab, setTab] = useState('overview');

  return (
    <Stack gap={3}>
      <Tabs
        label="Account"
        tabs={tabs}
        value={tab}              // which tab is selected
        onValueChange={setTab}   // called with the id of the picked tab
      />
      <Text variant="caption" tone="muted" as="p" role="status">Selected tab: {tab}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Listen to changes',
              when: 'Track a switch without owning the state.',
              explain: [
                '`onValueChange` also works alone. The tabs keep their own state, and you get told about each change.',
                'Use this for analytics or a log. Do not use it to select a tab: pass `value` for that.',
              ],
              render: <Tabs label="Account" onValueChange={noopTab} tabs={PROFILE_TABS} />,
              code: `// Uncontrolled: no value. You are told about each change.
<Tabs label="Account" tabs={tabs} onValueChange={(id) => track('tab', id)} />`,
            },
          ],
        },
        {
          title: 'States',
          kicker: 'A disabled tab leaves the tab order and the arrow cycle. Always say why.',
          examples: [
            {
              title: 'Disabled with a reason',
              when: 'A view the user cannot open yet. A screen reader reads the reason after the label.',
              explain: [
                '`disabled` uses the native attribute. The tab cannot be clicked, leaves the tab order, and the arrow keys skip it.',
                '`disabledReason` is read after the label: "Tracking, Available once the order ships". It is also set as a `title` attribute, a browser hint that mouse users may see on hover. Keyboard and touch users never see it. Without a reason, users guess what they did wrong (Nielsen heuristic 1, visibility of system status).',
                'Pass `disabledReason` every time you set `disabled`. When the reason matters, also show it on the page, near the tabs.',
              ],
              render: <Tabs label="Order" tabs={ORDER_TABS} />,
              code: `<Tabs
  label="Order"
  tabs={[
    { id: 'details', label: 'Details', panel: <Text as="p">Items, address and totals.</Text> },
    {
      id: 'tracking',
      label: 'Tracking',
      panel: <Text as="p">Carrier updates.</Text>,
      disabled: true,
      // Read by screen readers right after the label, and a title hint on hover.
      disabledReason: 'Available once the order ships',
    },
    { id: 'invoice', label: 'Invoice', panel: <Text as="p">Download the invoice.</Text> },
  ]}
/>`,
            },
            {
              title: 'First tab disabled',
              when: 'The first view is off. The first enabled tab opens instead.',
              explain: [
                'The component never selects a disabled tab. With no `defaultValue`, it opens the first tab that is enabled.',
                'You do not need to compute the starting tab yourself.',
              ],
              render: <Tabs label="Order" tabs={[{ id: 'draft', label: 'Draft', panel: panel('The draft is locked.'), disabled: true, disabledReason: 'The order is submitted' }, { id: 'details', label: 'Details', panel: panel('Items, address and totals.') }]} />,
              code: `<Tabs
  label="Order"
  tabs={[
    { id: 'draft', label: 'Draft', panel: <Text as="p">The draft is locked.</Text>, disabled: true, disabledReason: 'The order is submitted' },
    // Opens first: it is the first tab that is not disabled.
    { id: 'details', label: 'Details', panel: <Text as="p">Items, address and totals.</Text> },
  ]}
/>`,
            },
            {
              title: 'Selected tab disabled',
              when: 'The starting value names a disabled tab. The first enabled tab opens instead.',
              explain: [
                'A tab can become disabled while it is selected, or `defaultValue` can point at one. The component falls back to the first enabled tab.',
                'The disabled tab keeps its look and its reason, so the user still sees it is unavailable.',
              ],
              render: <Tabs label="Order" defaultValue="tracking" tabs={ORDER_TABS.slice(0, 2)} />,
              code: `// "tracking" is disabled, so "details" opens instead.
<Tabs label="Order" defaultValue="tracking" tabs={tabs} />`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'Keep labels short: one or two words. Too many tabs scroll; no label truncates.',
          examples: [
            {
              title: 'Label with an icon',
              when: 'A symbol helps scanning. The label stays as text.',
              explain: [
                '`label` accepts any JSX, not only text. Put an `Icon` before the words.',
                'Keep the words. An icon alone is not clear to everyone, and it has no name for a screen reader unless you add one (WCAG 1.1.1, A).',
                'The `Icon` here is decoration, because the word beside it names the tab. It takes no `label`.',
              ],
              render: <Tabs label="Mailbox" tabs={[{ id: 'inbox', label: <><Icon glyph="mail" size="sm" /> Inbox</>, panel: panel('Messages waiting for you.') }, { id: 'alerts', label: <><Icon glyph="bell" size="sm" /> Alerts</>, panel: panel('Notices from the system.') }]} />,
              code: `<Tabs
  label="Mailbox"
  tabs={[
    {
      id: 'inbox',
      // JSX in the label: icon first, then the words.
      label: <><Icon glyph="mail" size="sm" /> Inbox</>,
      panel: <Text as="p">Messages waiting for you.</Text>,
    },
    { id: 'alerts', label: <><Icon glyph="bell" size="sm" /> Alerts</>, panel: <Text as="p">Notices from the system.</Text> },
  ]}
/>`,
            },
            {
              title: 'Label with a count',
              when: 'Each view has a count worth showing next to its name.',
              explain: [
                'A `Badge` with `count` and a noun `label` shows a number next to the name. The screen reader reads both: "Open, 12 tickets". A bare number would say only "12".',
                'Use a badge only for a number that helps the choice. A count on every tab becomes noise.',
              ],
              render: <Tabs label="Tickets" tabs={[{ id: 'open', label: <>Open <Badge status="info" count={12} label="tickets" /></>, panel: panel('Tickets waiting for an answer.') }, { id: 'closed', label: 'Closed', panel: panel('Tickets that are resolved.') }]} />,
              code: `<Tabs
  label="Tickets"
  tabs={[
    { id: 'open', label: <>Open <Badge status="info" count={12} label="tickets" /></>, panel: <Text as="p">Tickets waiting for an answer.</Text> },
    { id: 'closed', label: 'Closed', panel: <Text as="p">Tickets that are resolved.</Text> },
  ]}
/>`,
            },
            {
              title: 'Scrolling list',
              when: 'More tabs than fit. The list scrolls and a chevron shows the hidden side.',
              frame: 'narrow',
              explain: [
                'When the tabs do not fit, the list scrolls along its axis. A chevron over a fade shows the side that hides more tabs.',
                'No label is cut with "…". The user scrolls, or arrows to a hidden tab, which scrolls into view when it takes focus (WCAG 1.4.10 Reflow, AA).',
                'The chevron is only a hint. It takes no click.',
              ],
              render: <Tabs label="Departments" tabs={['Sales', 'Marketing', 'Engineering', 'Support', 'Finance', 'People'].map((name) => ({ id: name.toLowerCase(), label: name, panel: panel(`${name} team and open roles.`) }))} />,
              code: `// Nothing to set: the list scrolls when the tabs do not fit.
<Tabs
  label="Departments"
  tabs={['Sales', 'Marketing', 'Engineering', 'Support', 'Finance', 'People'].map((name) => ({
    id: name.toLowerCase(),
    label: name,
    panel: <Text as="p">{name} team and open roles.</Text>,
  }))}
/>`,
            },
            {
              title: 'Long labels',
              when: 'Longer names in a narrow column. They scroll instead of being cut.',
              frame: 'narrow',
              explain: [
                'A long label stays whole and the list scrolls. Better still, shorten the label to one or two words.',
              ],
              render: <Tabs label="Policy" tabs={[{ id: 'privacy', label: 'Privacy and data protection', panel: panel('How the data is kept.') }, { id: 'terms', label: 'Terms of service', panel: panel('The rules of use.') }]} />,
              code: `<Tabs
  label="Policy"
  tabs={[
    { id: 'privacy', label: 'Privacy and data protection', panel: <Text as="p">How the data is kept.</Text> },
    { id: 'terms', label: 'Terms of service', panel: <Text as="p">The rules of use.</Text> },
  ]}
/>`,
            },
            {
              title: 'Translated labels',
              when: 'Labels and reasons arrive as props, so the tabs take the app language.',
              explain: [
                'The component holds no text. `label`, every tab `label`, every panel and every `disabledReason` come from you.',
                'Translate all of them, including the disabled reason, so a screen reader speaks one language.',
              ],
              render: <Tabs label="Compte" tabs={[{ id: 'apercu', label: 'Aperçu', panel: panel('Résumé du compte.') }, { id: 'activite', label: 'Activité', panel: panel('Tous les changements.') }, { id: 'factures', label: 'Factures', panel: panel('Vos factures.'), disabled: true, disabledReason: 'Aucune facture pour l’instant' }]} />,
              code: `<Tabs
  label="Compte"
  tabs={[
    { id: 'apercu', label: 'Aperçu', panel: <Text as="p">Résumé du compte.</Text> },
    { id: 'activite', label: 'Activité', panel: <Text as="p">Tous les changements.</Text> },
    {
      id: 'factures',
      label: 'Factures',
      panel: <Text as="p">Vos factures.</Text>,
      disabled: true,
      disabledReason: 'Aucune facture pour l’instant',
    },
  ]}
/>`,
            },
            {
              title: 'Phone width',
              when: 'Three tabs on a phone.',
              frame: 'phone',
              explain: [
                'Short labels fit three tabs at 320px. If they did not, the list would scroll.',
                'You set nothing for small screens.',
              ],
              render: <Tabs label="Account" tabs={PROFILE_TABS} />,
              code: `<Tabs label="Account" tabs={tabs} />`,
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'A panel holds any content, including other library components.',
          examples: [
            {
              title: 'Panel with a stack',
              when: 'A view that holds several blocks.',
              explain: [
                'A panel is any JSX. Lay out its blocks with `Stack`, as anywhere else on the page.',
                'Use a real heading level for the panel title (here `h3`), one below the page section that holds the tabs.',
              ],
              render: <Tabs label="Project" tabs={[{ id: 'summary', label: 'Summary', panel: <Stack gap={2}><Text as="h3" variant="heading">Website redesign</Text><Text tone="muted" as="p">Due on 30 June.</Text></Stack> }, { id: 'files', label: 'Files', panel: panel('Twelve files, 48 MB.') }]} />,
              code: `<Tabs
  label="Project"
  tabs={[
    {
      id: 'summary',
      label: 'Summary',
      panel: (
        <Stack gap={2}>
          <Text as="h3" variant="heading">Website redesign</Text>
          <Text tone="muted" as="p">Due on 30 June.</Text>
        </Stack>
      ),
    },
    { id: 'files', label: 'Files', panel: <Text as="p">Twelve files, 48 MB.</Text> },
  ]}
/>`,
            },
            {
              title: 'Panel with a link',
              when: 'A view that points to a page with its own URL.',
              explain: [
                'A link inside a panel is fine. Tab reaches it after the panel itself.',
                'The panel is a tab stop too (`tabindex="0"`), so a keyboard user can reach and scroll a panel that has no focusable content (APG Tabs).',
              ],
              render: <Tabs label="Help" tabs={[{ id: 'guide', label: 'Guide', panel: <Text as="p">Read the <a href="#manual">full manual</a>.</Text> }, { id: 'faq', label: 'FAQ', panel: panel('Common questions and short answers.') }]} />,
              code: `<Tabs
  label="Help"
  tabs={[
    { id: 'guide', label: 'Guide', panel: <Text as="p">Read the <a href="/manual">full manual</a>.</Text> },
    { id: 'faq', label: 'FAQ', panel: <Text as="p">Common questions and short answers.</Text> },
  ]}
/>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label names the tab list. The panels stay in the page, so each tab points at a real panel.',
          examples: [
            {
              title: 'Named tab list',
              when: 'The label says what the tabs switch, for a screen reader.',
              explain: [
                'A screen reader says "Account sections, tab list, 3 items". The name tells the user what the tabs control before they move.',
                'Name the thing the tabs switch, not the word "tabs".',
              ],
              render: <Tabs label="Account sections" tabs={PROFILE_TABS} />,
              code: `<Tabs label="Account sections" tabs={tabs} />`,
            },
            {
              title: 'Keyboard use',
              when: 'Know what a keyboard user can do. Nothing here needs extra code.',
              explain: [
                'Tab enters the list on the selected tab. A second Tab goes to the panel, not to the next tab: the list is one tab stop, so a user crosses it in one press.',
                'Arrow keys move between tabs, Home and End jump to the ends, and disabled tabs are skipped. In manual mode, Enter or Space selects.',
                'The focus ring (the outline that shows where the keyboard is) draws inside the tab, so the scrolling list does not clip it (WCAG 2.4.7, AA).',
              ],
              render: <Tabs label="Account" tabs={PROFILE_TABS} />,
              code: `// Tab -> the selected tab.   Right/Left -> next/previous tab (wraps).
// Home/End -> first/last enabled tab.   Tab again -> the panel.
<Tabs label="Account" tabs={tabs} />`,
            },
          ],
        },
      ]}
    />
  ),
};
