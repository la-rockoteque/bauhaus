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
            note: 'Skipped by the arrows. The reason shows as a tooltip and is read after the label.',
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

const panel = (text: string) => <Text as="p">{text}</Text>;
const PROFILE_TABS = [
  { id: 'overview', label: 'Overview', panel: panel('A summary of the account and its recent activity.') },
  { id: 'activity', label: 'Activity', panel: panel('Every change to the account, newest first.') },
  { id: 'settings', label: 'Settings', panel: panel('Name, email address and notification choices.') },
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
      imports="import { Badge, Icon, Stack, Tabs, Text } from '@acme/design-system';"
      guide="navigation-tabs--docs"
      guideName="Tabs"
      groups={[
        {
          title: 'Orientation',
          kicker: 'Tabs switch peer views on one URL. When each view has its own URL, use links.',
          examples: [
            { title: 'Horizontal', when: 'The default: a few views of one record, above the panel.', render: <Tabs label="Account" tabs={PROFILE_TABS} /> },
            { title: 'Vertical', when: 'A settings page with a side list of sections. The arrows become Up and Down.', render: <Tabs label="Settings sections" orientation="vertical" tabs={[{ id: 'profile', label: 'Profile', panel: panel('Your name and photo.') }, { id: 'security', label: 'Security', panel: panel('Password and two-step sign-in.') }, { id: 'billing', label: 'Billing', panel: panel('Plan, invoices and payment method.') }]} /> },
          ],
        },
        {
          title: 'Activation',
          kicker: 'Automatic selects a tab when it takes focus. Manual waits for Enter or Space.',
          examples: [
            { title: 'Automatic', when: 'Panels show at once, so selecting on focus costs nothing.', render: <Tabs label="Account" activation="automatic" tabs={PROFILE_TABS} /> },
            { title: 'Manual', when: 'A panel loads slowly. A run of arrow presses must not fire a run of requests.', render: <Tabs label="Reports" activation="manual" tabs={[{ id: 'daily', label: 'Daily', panel: panel('Loads the last 24 hours.') }, { id: 'weekly', label: 'Weekly', panel: panel('Loads the last seven days.') }, { id: 'yearly', label: 'Yearly', panel: panel('Loads the last twelve months.') }]} /> },
          ],
        },
        {
          title: 'Selection',
          kicker: 'The tabs run on their own, or the view owns the selected tab.',
          examples: [
            { title: 'Starting tab', when: 'Open on a tab other than the first. Uncontrolled.', render: <Tabs label="Account" defaultValue="activity" tabs={PROFILE_TABS} /> },
            {
              title: 'Controlled',
              when: 'The view reads or sets the selected tab, for example to save it or open a tab from a link.',
              render: <ControlledTabs />,
              code: `function ControlledTabs() {
  const [tab, setTab] = useState('overview');
  return (
    <Stack gap={3}>
      <Tabs label="Account" tabs={tabs} value={tab} onValueChange={setTab} />
      <Text variant="caption" tone="muted" as="p" role="status">Selected tab: {tab}</Text>
    </Stack>
  );
}`,
            },
            { title: 'Listen to changes', when: 'Track a switch without owning the state.', render: <Tabs label="Account" onValueChange={() => {}} tabs={PROFILE_TABS} />, code: `<Tabs label="Account" tabs={tabs} onValueChange={(id) => track('tab', id)} />` },
          ],
        },
        {
          title: 'States',
          kicker: 'A disabled tab leaves the tab order and the arrow cycle. Always say why.',
          examples: [
            { title: 'Disabled with a reason', when: 'A view the user cannot open yet. The reason is a tooltip and is read after the label.', render: <Tabs label="Order" tabs={[{ id: 'details', label: 'Details', panel: panel('Items, address and totals.') }, { id: 'tracking', label: 'Tracking', panel: panel('Carrier updates.'), disabled: true, disabledReason: 'Available once the order ships' }, { id: 'invoice', label: 'Invoice', panel: panel('Download the invoice.') }]} /> },
            { title: 'First tab disabled', when: 'The first view is off. The first enabled tab opens instead.', render: <Tabs label="Order" tabs={[{ id: 'draft', label: 'Draft', panel: panel('The draft is locked.'), disabled: true, disabledReason: 'The order is submitted' }, { id: 'details', label: 'Details', panel: panel('Items, address and totals.') }]} /> },
            { title: 'Selected tab disabled', when: 'The starting value names a disabled tab. The first enabled tab opens instead.', render: <Tabs label="Order" defaultValue="tracking" tabs={[{ id: 'details', label: 'Details', panel: panel('Items, address and totals.') }, { id: 'tracking', label: 'Tracking', panel: panel('Carrier updates.'), disabled: true, disabledReason: 'Available once the order ships' }]} /> },
          ],
        },
        {
          title: 'Content',
          kicker: 'Keep labels short: one or two words. Too many tabs scroll; no label truncates.',
          examples: [
            { title: 'Label with an icon', when: 'A symbol helps scanning. The label stays as text.', render: <Tabs label="Mailbox" tabs={[{ id: 'inbox', label: <><Icon glyph="mail" size="sm" /> Inbox</>, panel: panel('Messages waiting for you.') }, { id: 'alerts', label: <><Icon glyph="bell" size="sm" /> Alerts</>, panel: panel('Notices from the system.') }]} /> },
            { title: 'Label with a count', when: 'Each view has a count worth showing next to its name.', render: <Tabs label="Tickets" tabs={[{ id: 'open', label: <>Open <Badge status="info">12</Badge></>, panel: panel('Tickets waiting for an answer.') }, { id: 'closed', label: 'Closed', panel: panel('Tickets that are resolved.') }]} /> },
            { title: 'Scrolling list', when: 'More tabs than fit. The list scrolls and a chevron shows the hidden side.', frame: 'narrow', render: <Tabs label="Departments" tabs={['Sales', 'Marketing', 'Engineering', 'Support', 'Finance', 'People'].map((name) => ({ id: name.toLowerCase(), label: name, panel: panel(`${name} team and open roles.`) }))} /> },
            { title: 'Long labels', when: 'Longer names in a narrow column. They scroll instead of being cut.', frame: 'narrow', render: <Tabs label="Policy" tabs={[{ id: 'privacy', label: 'Privacy and data protection', panel: panel('How the data is kept.') }, { id: 'terms', label: 'Terms of service', panel: panel('The rules of use.') }]} /> },
            { title: 'Translated labels', when: 'Labels and reasons arrive as props, so the tabs take the app language.', render: <Tabs label="Compte" tabs={[{ id: 'apercu', label: 'Aperçu', panel: panel('Résumé du compte.') }, { id: 'activite', label: 'Activité', panel: panel('Tous les changements.') }, { id: 'factures', label: 'Factures', panel: panel('Vos factures.'), disabled: true, disabledReason: 'Aucune facture pour l’instant' }]} /> },
            { title: 'Phone width', when: 'Three tabs on a phone.', frame: 'phone', render: <Tabs label="Account" tabs={PROFILE_TABS} /> },
          ],
        },
        {
          title: 'Composition',
          kicker: 'A panel holds any content, including other library components.',
          examples: [
            { title: 'Panel with a stack', when: 'A view that holds several blocks.', render: <Tabs label="Project" tabs={[{ id: 'summary', label: 'Summary', panel: <Stack gap={2}><Text as="h3" variant="heading">Website redesign</Text><Text tone="muted" as="p">Due on 30 June.</Text></Stack> }, { id: 'files', label: 'Files', panel: panel('Twelve files, 48 MB.') }]} /> },
            { title: 'Panel with a link', when: 'A view that points to a page with its own URL.', render: <Tabs label="Help" tabs={[{ id: 'guide', label: 'Guide', panel: <Text as="p">Read the <a href="#manual">full manual</a>.</Text> }, { id: 'faq', label: 'FAQ', panel: panel('Common questions and short answers.') }]} /> },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label names the tab list. The panels stay in the page, so each tab points at a real panel.',
          examples: [
            { title: 'Named tab list', when: 'The label says what the tabs switch, for a screen reader.', render: <Tabs label="Account sections" tabs={PROFILE_TABS} /> },
            { title: 'Reason read with the label', when: 'A disabled tab says why it is off, and the reason is read after its name.', render: <Tabs label="Order" tabs={[{ id: 'details', label: 'Details', panel: panel('Items, address and totals.') }, { id: 'refund', label: 'Refund', panel: panel('Refund options.'), disabled: true, disabledReason: 'Only paid orders can be refunded' }]} /> },
          ],
        },
      ]}
    />
  ),
};
