import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../.storybook/doc-page/doc-page';
import { Breadcrumb, type BreadcrumbItem } from './breadcrumb';
import { breadcrumbRules } from './breadcrumb.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Navigation/Breadcrumb', component: Breadcrumb, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Breadcrumb>;

export default meta;

const H = '#crumb-demo';
const THREE: BreadcrumbItem[] = [{ label: 'Home', href: H }, { label: 'Supply', href: H }, { label: 'Requisition 4821' }];
const DEEP: BreadcrumbItem[] = [
  { label: 'Home', href: H }, { label: 'Supply', href: H }, { label: 'Warehouses', href: H }, { label: 'Montreal', href: H },
  { label: 'Aisle 12', href: H }, { label: 'Shelf C', href: H }, { label: 'Pallet 4821' },
];
const show = (items: BreadcrumbItem[], extra: Partial<Parameters<typeof Breadcrumb>[0]> = {}) => <Breadcrumb label="Breadcrumb" items={items} {...extra} />;
const withClass = (className: string): BreadcrumbItem[] => [THREE[0], { ...THREE[1], className }, THREE[2]];

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Breadcrumb"
      layer="Component"
      family="Navigation"
      plain="A breadcrumb shows the path from the top of the site down to the page you are on, like the trail of crumbs in the fairy tale. Each step back up is a link."
      precise="Component in the navigation family · a nav landmark holding an ordered list of links · the last item is the current page · not a menu and not a step indicator."
      usedFor="Deep hierarchies: a record inside a folder inside an area."
      tokens={{
        mode: 'consumed',
        note: 'The breadcrumb has no component tokens. Its crumbs are Links and its "…" is an IconButton.',
        rows: [
          { name: 'text.link', tier: 'role', use: 'Crumb links, through Link', swatch: '--ds-text-link' },
          { name: 'text.default · text.muted', tier: 'role', use: 'The current crumb, and the separators', swatch: '--ds-text-muted' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator, through Link and IconButton', swatch: '--ds-focus-ring-color' },
          { name: 'text.body.* · text.label.weight', tier: '2', use: 'Crumb text, and the heavier current crumb' },
          { name: 'space.inline.xs · space.inset.sm', tier: '2', use: 'Gap around a separator, and padding of the current crumb' },
          { name: 'size.icon.sm', tier: '2', use: 'Separator chevron' },
          { name: 'size.target.min', tier: '2', use: 'Target of each crumb and of the "…" button, through Link and Button' },
        ],
      }}
      anatomy={{
        render: show(THREE),
        stageWidth: 'calc(var(--ds-space-12) * 9)',
        stagePadding: 'var(--ds-space-12)',
        parts: [
          { n: 1, label: 'Landmark', note: 'nav with aria-label, required', x: '-18px', y: '50%' },
          { n: 2, label: 'Link', note: 'every crumb but the last', x: '4%', y: '-18px' },
          { n: 3, label: 'Separator', note: 'decorative, aria-hidden', x: '26%', y: 'calc(100% + 18px)' },
          { n: 4, label: 'Current crumb', note: 'aria-current="page"', x: '84%', y: '-18px' },
        ],
      }}
      specs={[
        { label: 'Structure', value: 'nav[aria-label] > ol > li, one li per crumb' },
        { label: 'Crumb target', value: 'size.target.min, 44px high' },
        { label: 'Separator', value: 'chevron icon, aria-hidden, text.muted' },
        { label: 'Current', value: 'aria-current="page", text.default, heavier weight' },
        { label: 'Collapse', value: 'more than maxItems (4): first crumb, "…" button, then the last maxItems − 2' },
        { label: 'Wrap', value: 'the list wraps onto the next line; no crumb is cut' },
      ]}
      api={[
        { label: 'label', value: 'The accessible name of the landmark, required.' },
        { label: 'items', value: '{ label, href? }[] from the root to the current page. The last is the current page.' },
        { label: 'maxItems', value: 'Default 4. A longer path collapses behind a "…" button.' },
        { label: 'expandLabel', value: 'Accessible name of the "…" button, default "Show all levels". Pass it in the app language.' },
        { label: 'linkAs', value: 'A router link component, passed to every crumb as Link `as`.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'A path always holds the current page at least.' },
          { id: 'loading', status: 'n/a', reason: 'The path comes from the route and is known before the page renders.' },
          { id: 'none', status: 'n/a', reason: 'The path always holds the current page at least.' },
          { id: 'one', status: 'designed', render: show([{ label: 'Home' }]), trigger: 'items.length = 1', note: 'Only the current page. Prefer no breadcrumb.' },
          { id: 'some', status: 'designed', render: show(THREE), trigger: 'items.length 2 to maxItems' },
          {
            id: 'too-many',
            status: 'designed',
            render: (
              <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
                {show(DEEP)}
                {show(DEEP, { label: 'Breadcrumb, expanded', maxItems: 20 })}
              </div>
            ),
            trigger: 'items.length > maxItems',
            note: 'Collapsed on top: first crumb, "…", last two. Expanded below, after the "…" is pressed.',
          },
          { id: 'incorrect', status: 'n/a', reason: 'A breadcrumb takes no input.' },
          { id: 'correct', status: 'n/a', reason: 'A breadcrumb takes no input.' },
          { id: 'done', status: 'n/a', reason: 'Following a crumb is the result.' },
          { id: 'default', status: 'designed', render: show(THREE), trigger: 'a[href]' },
          { id: 'hover', status: 'designed', render: show(withClass('doc-force-hover')), trigger: ':hover', note: 'Supply is forced. The underline thickens.' },
          { id: 'focus-visible', status: 'designed', render: show(withClass('doc-force-focus')), trigger: ':focus-visible', note: 'Supply is forced.' },
          { id: 'active', status: 'designed', render: show(withClass('doc-force-active')), trigger: ':active', note: 'Supply is forced.' },
          { id: 'disabled', status: 'n/a', reason: 'A crumb is a link. A level the user cannot open is text, not a disabled link.' },
          { id: 'selected', status: 'designed', label: 'Selected (current)', render: show(THREE), trigger: 'aria-current="page"', note: 'The last crumb: heavier text, no link, no separator after it.' },
        ],
      }}
      dos={[
        { text: 'Give the nav a name: "Breadcrumb".', basis: 'APG Landmarks; navigation.md rule 6' },
        { text: 'Mark the last crumb with aria-current="page".', basis: 'APG Breadcrumb; WCAG 4.1.2 (A)' },
        { text: 'Collapse a long path behind a button that expands it.', basis: 'WCAG 1.4.10 (AA); catalog defects' },
        { text: 'Use a breadcrumb in a deep hierarchy, next to other ways to navigate.', basis: 'WCAG 2.4.8 (AAA); 2.4.5 (AA)' },
      ]}
      donts={[
        { text: 'Leave the current crumb unmarked.', basis: 'APG Breadcrumb', rule: 'breadcrumb.current-marked' },
        { text: 'Let a screen reader read the separators.', basis: 'APG Breadcrumb', rule: 'breadcrumb.separator-hidden' },
        { text: 'Collapse the path with no way to expand it.', basis: 'catalog defects', rule: 'breadcrumb.collapse-expandable' },
        { text: 'Add a breadcrumb to a flat site.', basis: 'navigation.md rule 11', rule: 'breadcrumb.deep-only' },
        { text: 'Write a colour literal in breadcrumb.css.', basis: 'misfile.raw-value-in-component', rule: 'breadcrumb.no-literal' },
      ]}
      rules={breadcrumbRules}
      guide="navigation-breadcrumb--docs"
      guideName="Breadcrumb"
    />
  ),
};
