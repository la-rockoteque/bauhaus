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

// Hrefs in the live results are "#" anchors, so a click does not leave the page. The code shows real paths.
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
      intro={[
        'A breadcrumb shows the path from the top of the site to the page you are on, like the crumbs in the fairy tale. Each earlier step is a link back up.',
        'Pass the path as `items`, ordered from the top to the current page. The last item is always the current page.',
        'A landmark is a named region of the page that screen readers list ("navigation", "main"). `label` gives the breadcrumb its name in that list.',
        'ARIA attributes are extra labels that screen readers read. The component sets them for you: `aria-current="page"` marks the current page, and the separators are hidden from screen readers.',
        'Use a breadcrumb in a deep site, next to the main menu. It never replaces the main menu.',
      ]}
      guide="navigation-breadcrumb--docs"
      guideName="Breadcrumb"
      groups={[
        {
          title: 'Paths',
          kicker: 'The simplest use first. The last item is the current page. Use the page names the user knows, not URL slugs.',
          examples: [
            {
              title: 'Three levels',
              when: 'The common case in a hierarchy: the user can go up one or two levels.',
              explain: [
                '`label` names the landmark. A screen reader lists it as "Breadcrumb, navigation", so a user can jump straight to it (APG Landmarks).',
                '`items` runs from the top to the current page. Every item but the last needs an `href`, or the user cannot go back up.',
                'The last item has no `href`: the user is already there, so a link would do nothing. The component marks it `aria-current="page"` and shows it in heavier text (APG Breadcrumb).',
                'The chevrons between items are decoration. They are hidden from screen readers, which hear a plain list instead.',
              ],
              render: <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, { label: 'Furniture' }]} />,
              code: `<Breadcrumb
  // Names the landmark. Screen readers list it as "Breadcrumb, navigation".
  label="Breadcrumb"
  items={[
    // Every item but the last links back up the path.
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    // The current page: no href, because a link to the page you are on does nothing.
    { label: 'Furniture' },
  ]}
/>`,
            },
            {
              title: 'Two levels',
              when: 'A page one step below the top. A breadcrumb adds little here.',
              explain: [
                'It works with two items, but one step up is easy to find without help. Prefer no breadcrumb on a flat site (WCAG 2.4.8 Location, AAA).',
                'The same rules hold: a link for the parent, plain text for the current page.',
              ],
              render: <Breadcrumb label="Breadcrumb" items={[HOME, { label: 'Shipping policy' }]} />,
              code: `<Breadcrumb
  label="Breadcrumb"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Shipping policy' },
  ]}
/>`,
            },
            {
              title: 'Current page as a link',
              when: 'The last item has an href. It stays marked as the current page.',
              explain: [
                'Give the last item an `href` when the current page has its own address, such as one that reloads the page with its filters.',
                'It is still `aria-current="page"` and still styled as the current page, so users see where they are, not only that a link exists.',
                'The current page stands out by weight, not by colour alone, so people who cannot tell colours apart still see it (WCAG 1.4.1, A).',
              ],
              render: <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, { label: 'Furniture', href: '#furniture' }]} />,
              code: `<Breadcrumb
  label="Breadcrumb"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    // An href on the last item makes it a link. It still reads as the current page.
    { label: 'Furniture', href: '/shop/furniture' },
  ]}
/>`,
            },
            {
              title: 'Five levels',
              when: 'A deep path that still fits: five items, one more than the default limit allows.',
              explain: [
                'The default `maxItems` is 4, so five items collapse. See the next group to learn how, and how to raise the limit.',
                'This is the default behaviour: you pass the full path, and the component decides what to show.',
              ],
              render: <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, FURNITURE, LIGHTING, { label: 'Desk lamps' }]} />,
              code: `// Five items is more than the default maxItems (4), so the middle collapses.
<Breadcrumb
  label="Breadcrumb"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Furniture', href: '/shop/furniture' },
    { label: 'Lighting', href: '/shop/furniture/lighting' },
    { label: 'Desk lamps' },
  ]}
/>`,
            },
          ],
        },
        {
          title: 'Too many levels',
          kicker: 'More items than maxItems collapse into a "…" button. It opens the whole path and moves focus to the first revealed link.',
          examples: [
            {
              title: 'Collapsed path',
              when: 'A deep hierarchy. The default maxItems is 4, so it shows the first item, "…" and the last two.',
              explain: [
                'The path keeps the first item (the way home) and the last items (where you are). The middle hides behind the "…" button.',
                'Press the button to show the whole path. Focus moves to the first revealed link, so a keyboard user does not lose their place (WCAG 2.4.3, A).',
                'The button has `aria-expanded="false"` while the path is hidden. Without a way to expand, the hidden levels would be lost to the user.',
              ],
              render: <Breadcrumb label="Breadcrumb" items={DEEP_PATH} />,
              code: `// Six items, default maxItems = 4:
// first item, the "…" button, then the last two items.
<Breadcrumb
  label="Breadcrumb"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Furniture', href: '/shop/furniture' },
    { label: 'Lighting', href: '/shop/furniture/lighting' },
    { label: 'Desk lamps', href: '/shop/furniture/lighting/lamps' },
    { label: 'Arc lamp' },
  ]}
/>`,
            },
            {
              title: 'Lower maxItems',
              when: 'A narrow area where three items are the most that fit.',
              explain: [
                '`maxItems={3}` collapses any path of four or more. It shows the first item, "…" and the last item.',
                'The component keeps `maxItems - 2` items at the end, and never fewer than one.',
              ],
              render: <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, FURNITURE, { label: 'Lighting' }]} maxItems={3} />,
              code: `// Four items, maxItems = 3: first item, "…", then the last item.
<Breadcrumb
  label="Breadcrumb"
  maxItems={3}
  items={[
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Furniture', href: '/shop/furniture' },
    { label: 'Lighting' },
  ]}
/>`,
            },
            {
              title: 'Higher maxItems',
              when: 'A wide header that has room for more of the path before it collapses.',
              explain: [
                '`maxItems={6}` shows all six items with no "…" button.',
                'Raise the limit only when the room is there. The list wraps onto a second line, but a long single row is harder to scan.',
              ],
              render: <Breadcrumb label="Breadcrumb" items={DEEP_PATH} maxItems={6} />,
              code: `// Six items fit under maxItems = 6: nothing collapses.
<Breadcrumb
  label="Breadcrumb"
  maxItems={6}
  items={[
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Furniture', href: '/shop/furniture' },
    { label: 'Lighting', href: '/shop/furniture/lighting' },
    { label: 'Desk lamps', href: '/shop/furniture/lighting/lamps' },
    { label: 'Arc lamp' },
  ]}
/>`,
            },
            {
              title: 'At the limit',
              when: 'The path has exactly maxItems items. It stays whole.',
              explain: [
                'Collapse starts only when `items.length` is greater than `maxItems`. Four items with the default of 4 show in full.',
              ],
              render: <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, FURNITURE, { label: 'Lighting' }]} />,
              code: `// Four items, default maxItems = 4: the whole path shows.
<Breadcrumb
  label="Breadcrumb"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Furniture', href: '/shop/furniture' },
    { label: 'Lighting' },
  ]}
/>`,
            },
            {
              title: 'Name of the "…" button',
              when: 'Name what the button does, in the words of your app.',
              explain: [
                'The "…" has no visible text, so `expandLabel` is its only name. A screen reader says "Show the full path, button".',
                'The default is "Show all levels". Without a clear name, a screen reader user would hear "button" and not know what it does (WCAG 4.1.2, A).',
              ],
              render: <Breadcrumb label="Breadcrumb" expandLabel="Show the full path" items={DEEP_PATH} />,
              code: `<Breadcrumb
  label="Breadcrumb"
  // The accessible name of the "…" button. Default: "Show all levels".
  expandLabel="Show the full path"
  items={path}
/>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The list wraps onto a new line. No item is cut.',
          examples: [
            {
              title: 'Long names',
              when: 'Long page titles in a narrow column. The path wraps.',
              frame: 'narrow',
              explain: [
                'The breadcrumb never cuts a name with "…". It wraps to the next line, so the user reads every word.',
                'This keeps the page readable at 320px wide and at 400% zoom with no sideways scroll (WCAG 1.4.10 Reflow, AA).',
              ],
              render: <Breadcrumb label="Breadcrumb" items={[HOME, { label: 'Annual reports and financial statements', href: '#reports' }, { label: 'Consolidated results for the fiscal year' }]} />,
              code: `// No truncation: long names wrap onto the next line.
<Breadcrumb
  label="Breadcrumb"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Annual reports and financial statements', href: '/reports' },
    { label: 'Consolidated results for the fiscal year' },
  ]}
/>`,
            },
            {
              title: 'Phone width',
              when: 'A four-level path on a phone.',
              frame: 'phone',
              explain: [
                'Four items fit under the default limit, so the path wraps instead of collapsing.',
                'On a phone, each link keeps a target of at least 24px high, so a thumb can hit it (WCAG 2.5.8, AA).',
              ],
              render: <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, FURNITURE, { label: 'Lighting' }]} />,
              code: `// Nothing to set for small screens: the list wraps by itself.
<Breadcrumb
  label="Breadcrumb"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Furniture', href: '/shop/furniture' },
    { label: 'Lighting' },
  ]}
/>`,
            },
            {
              title: 'Translated path',
              when: 'The app is not in English: pass the landmark name and the expand label in its language.',
              explain: [
                'The component holds no text of its own. `label`, every item `label` and `expandLabel` all come from you.',
                'Set all three. A French page with an English "Show all levels" button breaks the screen reader voice.',
              ],
              render: <Breadcrumb label="Fil d’Ariane" expandLabel="Afficher tous les niveaux" items={[{ label: 'Accueil', href: '#accueil' }, { label: 'Boutique', href: '#boutique' }, { label: 'Meubles', href: '#meubles' }, { label: 'Luminaires', href: '#luminaires' }, { label: 'Lampes de bureau' }]} />,
              code: `<Breadcrumb
  // The three texts the component shows or announces:
  label="Fil d’Ariane"
  expandLabel="Afficher tous les niveaux"
  items={[
    { label: 'Accueil', href: '/' },
    { label: 'Boutique', href: '/boutique' },
    { label: 'Meubles', href: '/boutique/meubles' },
    { label: 'Luminaires', href: '/boutique/meubles/luminaires' },
    { label: 'Lampes de bureau' },
  ]}
/>`,
            },
          ],
        },
        {
          title: 'Router',
          kicker: 'The library imports no router. Pass your own link component through linkAs.',
          examples: [
            {
              title: 'With a router link',
              when: 'The app has a router. Every crumb link renders with your component.',
              explain: [
                'A plain link reloads the whole page. A router link swaps the view without a reload, which is faster.',
                '`linkAs` takes the component itself, not a string or an element. The breadcrumb renders it for each linked item, with `href` and the label.',
                'Your router link must accept `href`. If it wants `to` instead, wrap it in a small component that maps `href` to `to`.',
              ],
              render: <Breadcrumb label="Breadcrumb" linkAs="a" items={[HOME, SHOP, { label: 'Furniture' }]} />,
              code: `// RouterLink: the link component of your router.
// It must accept an "href" prop; if it uses "to", wrap it and map href to to.
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
            {
              title: 'Above a page title',
              when: 'The usual place: the trail first, then the heading of the current page.',
              explain: [
                '`Stack` sets the space between the two. `gap={2}` is a small step on the space scale, so they read as one block.',
                'The heading repeats the last crumb. That is on purpose: the crumb says where you are in the site, and the heading names the page.',
                'Put the breadcrumb before the heading in the page order, so keyboard and screen reader users meet it first (WCAG 1.3.2, A).',
              ],
              render: (
                <Stack gap={2}>
                  <Breadcrumb label="Breadcrumb" items={[HOME, SHOP, { label: 'Furniture' }]} />
                  <Text as="h2" variant="heading">Furniture</Text>
                </Stack>
              ),
              code: `<Stack gap={2}>
  <Breadcrumb
    label="Breadcrumb"
    items={[
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' },
      { label: 'Furniture' },
    ]}
  />
  {/* "as" picks the HTML tag (h2, for the outline); "variant" picks the look. */}
  <Text as="h2" variant="heading">Furniture</Text>
</Stack>`,
            },
            {
              title: 'Two breadcrumbs on a page',
              when: 'A page holds two trails, such as the site and a document set. Give each landmark its own name.',
              explain: [
                'Two landmarks with the same name look identical in a screen reader list. Different `label` values tell them apart (APG Landmarks).',
                'This is the only reason to use two. For one trail, keep the plain name "Breadcrumb".',
              ],
              render: (
                <Stack gap={2}>
                  <Breadcrumb label="Site" items={[HOME, { label: 'Documents' }]} />
                  <Breadcrumb label="Document set" items={[{ label: 'Contracts', href: '#contracts' }, { label: '2026', href: '#2026' }, { label: 'Supplier agreement' }]} />
                </Stack>
              ),
              code: `<Stack gap={2}>
  {/* Two different names, so a screen reader can tell the landmarks apart. */}
  <Breadcrumb label="Site" items={siteTrail} />
  <Breadcrumb label="Document set" items={documentTrail} />
</Stack>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The label names the landmark. Separators are hidden from assistive technology.',
          examples: [
            {
              title: 'Named landmark',
              when: 'The label tells a screen reader user what this navigation is, among the other landmarks.',
              explain: [
                'Screen reader users often jump from landmark to landmark. The name is what they hear, so make it short and clear.',
                '"Breadcrumb" is the usual name. "You are here" also works. Avoid repeating the word "navigation": the screen reader adds it.',
              ],
              render: <Breadcrumb label="You are here" items={[HOME, SHOP, { label: 'Furniture' }]} />,
              code: `// The screen reader says: "You are here, navigation".
<Breadcrumb label="You are here" items={trail} />`,
            },
            {
              title: 'Keyboard use',
              when: 'Know what a keyboard user can do. Nothing here needs extra code.',
              explain: [
                'Tab moves through the links. The breadcrumb adds no other keys, because the APG Breadcrumb pattern defines none.',
                'The "…" button opens with Enter or Space, like any button. Then focus lands on the first revealed link.',
                'The focus ring (the outline that shows where the keyboard is) comes from `Link` and `IconButton`, so you do not style it (WCAG 2.4.7, AA).',
              ],
              render: <Breadcrumb label="Breadcrumb" items={DEEP_PATH} />,
              code: `// Tab stops: Home, the "…" button, Desk lamps. The current page is text, so it is not a stop.
// Enter or Space on "…" reveals the hidden levels and focuses the first one.
<Breadcrumb label="Breadcrumb" items={path} />`,
            },
          ],
        },
      ]}
    />
  ),
};
