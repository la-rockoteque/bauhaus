import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../../../primitives/text/text';
import { Stack } from '../../../primitives/stack/stack';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Breadcrumb, type BreadcrumbItem } from './breadcrumb';
import { breadcrumbRules } from './breadcrumb.rules';

// The showcase: one page story. The state matrix replaces one story per state.
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
          { name: 'size.control.md', tier: '2', use: 'Height of each crumb and of the "…" button (32px, through Link and Button). The target is at least size.target.min (24px)' },
        ],
      }}
      stage={{
        render: (args) => show(THREE, { label: String(args.label), maxItems: Number(args.maxItems), expandLabel: String(args.expandLabel) }),
        parts: [
          { n: 1, label: 'Landmark', note: 'nav with aria-label, required', target: '.ds-breadcrumb', at: 'top-start' },
          { n: 2, label: 'Link', note: 'every crumb but the last', target: '.ds-breadcrumb__item:first-child .ds-link', at: 'bottom-start' },
          { n: 3, label: 'Separator', note: 'decorative, aria-hidden', target: '.ds-breadcrumb__separator', at: 'top-start' },
          { n: 4, label: 'Current crumb', note: 'aria-current="page"', target: '.ds-breadcrumb__current', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Structure', value: 'nav[aria-label] > ol > li, one li per crumb' },
        { label: 'Crumb target', property: 'height', target: '.ds-breadcrumb__item:first-child .ds-link', token: 'size.target.min' },
        { label: 'Separator', value: 'chevron icon, aria-hidden, text.muted' },
        { label: 'Current', value: 'aria-current="page", text.default, heavier weight' },
        { label: 'Collapse', value: 'more than maxItems (4): first crumb, "…" button, then the last maxItems − 2' },
        { label: 'Wrap', value: 'the list wraps onto the next line; no crumb is cut' },
      ]}
      api={[
        { label: 'label', value: 'The accessible name of the landmark, required.', control: { kind: 'text', value: 'Breadcrumb' } },
        { label: 'items', value: '{ label, href? }[] from the root to the current page. The last is the current page.' },
        { label: 'maxItems', value: 'Default 4. A longer path collapses behind a "…" button.', control: { kind: 'select', options: ['2', '3', '4', '5'], value: '4' } },
        { label: 'expandLabel', value: 'Accessible name of the "…" button, default "Show all levels". Pass it in the app language.', control: { kind: 'text', value: 'Show all levels' } },
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
      guide="navigation-breadcrumb--docs"
      guideName="Breadcrumb"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Breadcrumb" layer="Component" family="Navigation" rules={breadcrumbRules} guide="navigation-breadcrumb--docs" guideName="Breadcrumb" />,
};

const HOME = { label: 'Home', href: '#home' };
const SHOP = { label: 'Shop', href: '#shop' };
const FURNITURE = { label: 'Furniture', href: '#furniture' };
const LIGHTING = { label: 'Lighting', href: '#lighting' };
const LAMPS = { label: 'Desk lamps', href: '#lamps' };
const DEEP_PATH = [HOME, SHOP, FURNITURE, LIGHTING, LAMPS, { label: 'Arc lamp' }] as const;

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Breadcrumb"
      layer="Component"
      family="Navigation"
      imports="import { Breadcrumb, Stack, Text } from '@acme/design-system';"
      guide="navigation-breadcrumb--docs"
      guideName="Breadcrumb"
      groups={[
        {
          title: 'Paths',
          kicker: 'The last item is the current page. Use the page names the user knows, not URL slugs.',
          examples: [
            { title: 'Two levels', when: 'A page one step below the top. A breadcrumb adds little here.', render: <Breadcrumb label="Breadcrumb" items={[HOME, { label: 'Shipping policy' }]} /> },
            { title: 'Three levels', when: 'The common case in a hierarchy: the user can go up one or two levels.', render: <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, { label: 'Furniture' }]} /> },
            { title: 'Current page as a link', when: 'The last item has an href. It stays marked as the current page.', render: <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, { label: 'Furniture', href: '#furniture' }]} /> },
            { title: 'Current page as plain text', when: 'The current page needs no link. Leave href off the last item.', render: <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, FURNITURE, { label: 'Lighting' }]} /> },
          ],
        },
        {
          title: 'Too many levels',
          kicker: 'More items than maxItems collapse into a "…" button. It opens the whole path and moves focus to the first revealed link.',
          examples: [
            { title: 'Collapsed path', when: 'A deep hierarchy. The default maxItems is 4, so it shows the first item, "…" and the last two.', render: <Breadcrumb label="Breadcrumb" items={DEEP_PATH} /> },
            { title: 'Lower maxItems', when: 'A narrow area where three items are the most that fit.', render: <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, FURNITURE, { label: 'Lighting' }]} maxItems={3} /> },
            { title: 'Higher maxItems', when: 'A wide header that has room for more of the path before it collapses.', render: <Breadcrumb label="Breadcrumb" items={DEEP_PATH} maxItems={6} /> },
            { title: 'At the limit', when: 'The path has exactly maxItems items. It stays whole.', render: <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, FURNITURE, { label: 'Lighting' }]} /> },
          ],
        },
        {
          title: 'Content',
          kicker: 'The list wraps onto a new line. No item truncates.',
          examples: [
            { title: 'Long names', when: 'Long page titles in a narrow column. The path wraps.', frame: 'narrow', render: <Breadcrumb label="Breadcrumb" items={[HOME, { label: 'Annual reports and financial statements', href: '#reports' }, { label: 'Consolidated results for the fiscal year' }]} /> },
            { title: 'Phone width', when: 'A four-level path on a phone.', frame: 'phone', render: <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, FURNITURE, { label: 'Lighting' }]} /> },
            { title: 'Translated path', when: 'The app is not in English: pass the landmark name and the expand label in its language.', render: <Breadcrumb label="Fil d’Ariane" expandLabel="Afficher tous les niveaux" items={[{ label: 'Accueil', href: '#accueil' }, { label: 'Boutique', href: '#boutique' }, { label: 'Meubles', href: '#meubles' }, { label: 'Luminaires', href: '#luminaires' }, { label: 'Lampes de bureau' }]} /> },
          ],
        },
        {
          title: 'Router',
          kicker: 'The library imports no router. Pass your own link component through linkAs.',
          examples: [
            {
              title: 'With a router link',
              when: 'The app has a router. Every crumb link renders with your component.',
              render: <Breadcrumb label="Breadcrumb" linkAs="a" items={[HOME, SHOP, { label: 'Furniture' }]} />,
              code: `// RouterLink: your router's link component.

<Breadcrumb
  label="Breadcrumb"
  linkAs={RouterLink}
  items={[
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Furniture' },
  ]}
/>`,
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'A breadcrumb sits above the page title. It never replaces the main navigation.',
          examples: [
            { title: 'Above a page title', when: 'The usual place: the trail first, then the heading of the current page.', render: (
              <Stack gap={2}>
                <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, { label: 'Furniture' }]} />
                <Text as="h2" variant="heading">Furniture</Text>
              </Stack>
            ) },
            { title: 'Two breadcrumbs on a page', when: 'A page holds two trails, such as the site and a document set. Give each landmark its own name.', render: (
              <Stack gap={2}>
                <Breadcrumb label="Site" items={[HOME, { label: 'Documents' }]} />
                <Breadcrumb label="Document set" items={[{ label: 'Contracts', href: '#contracts' }, { label: '2026', href: '#2026' }, { label: 'Supplier agreement' }]} />
              </Stack>
            ) },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label names the landmark. Separators are hidden from assistive technology.',
          examples: [
            { title: 'Named landmark', when: 'The label tells a screen reader user what this nav is, among the other landmarks.', render: <Breadcrumb label="You are here" items={[HOME, SHOP, { label: 'Furniture' }]} /> },
            { title: 'Expand button name', when: 'Name what the "…" button does, in the app language.', render: <Breadcrumb label="Breadcrumb" expandLabel="Show the full path" items={DEEP_PATH} /> },
          ],
        },
      ]}
    />
  ),
};
