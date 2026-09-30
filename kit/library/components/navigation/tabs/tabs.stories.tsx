import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { Tabs, type TabItem, type TabsProps } from './tabs';
import { tabsRules } from './tabs.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Navigation/Tabs', component: Tabs, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Tabs>;

export default meta;

const item = (id: string, label: string, extra: Partial<TabItem> = {}): TabItem => ({ id, label, panel: `${label} panel: the content of this view.`, ...extra });
const THREE = [item('overview', 'Details'), item('activity', 'Log'), item('settings', 'Setup')];
const MANY = ['Overview', 'Activity', 'Shipments', 'Requisitions', 'Invoices', 'Suppliers', 'Contracts', 'Audit log', 'Settings', 'Billing'].map((label) => item(label.toLowerCase().replace(/ /g, '-'), label));

const demo = (props: Partial<TabsProps> & { tabs?: readonly TabItem[] } = {}) => <Tabs label="Account sections" tabs={THREE} {...props} />;
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
          { name: 'size.target.min · size.border.thin · size.border.thick', tier: '2', use: 'Tab target, list rule, selected bar' },
          { name: 'size.icon.sm', tier: '2', use: 'Chevron of the scroll cue' },
        ],
      }}
      stage={{
        render: demo({ tabs: THREE.slice(0, 2) }),
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
        { label: 'label', value: 'The accessible name of the tab list, required.' },
        { label: 'tabs', value: 'TabItem[]: id, label, panel, disabled, disabledReason.' },
        { label: 'value · defaultValue · onValueChange', value: 'The selected id, controlled or not. The first enabled tab is selected by default.' },
        { label: 'orientation', value: '"horizontal" | "vertical", default "horizontal". Sets aria-orientation and the arrow keys.' },
        { label: 'activation', value: '"automatic" | "manual", default "automatic". Use manual when a panel is slow to load.' },
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
          { id: 'vertical', status: 'designed', group: 'interaction', label: 'Vertical', render: demo({ orientation: 'vertical' }), trigger: 'orientation="vertical"', note: 'Up and Down move. The bar sits at the inline end.' },
          { id: 'manual', status: 'designed', group: 'interaction', label: 'Manual activation', render: demo({ activation: 'manual' }), trigger: 'activation="manual"', note: 'Arrows move focus only. Enter or Space selects.' },
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
