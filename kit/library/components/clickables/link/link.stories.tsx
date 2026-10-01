import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Link } from './link';
import type { LinkProps } from './link';
import { linkRules } from './link.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Clickables/Link', component: Link, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Link>;

export default meta;

const HREF = '#link-demo';
const CURRENT = ['false', 'true', 'page', 'step', 'location'] as const;
/** The current control's option as the prop: "true" and "false" become booleans. */
const toCurrent = (value: string | boolean): LinkProps['current'] => (value === 'true' ? true : value === 'false' ? false : (value as LinkProps['current']));
const row = { display: 'flex', gap: 'var(--ds-space-4)', flexWrap: 'wrap', justifyContent: 'center' } as const;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Link"
      layer="Component"
      family="Clickables"
      plain="A link takes you somewhere else: another page, another site, another part of the same page. If pressing it does something in place, like saving, it is a button, not a link."
      precise="Component in the clickables family · a native anchor that navigates to a URL · not for actions and not for switching views on one URL."
      usedFor="Text links in a sentence, footer and nav items, breadcrumb crumbs, pagination page links, external references."
      tokens={{
        mode: 'consumed',
        note: 'The link has no component tokens. The visited colour reads text.link-visited.',
        rows: [
          { name: 'text.link', tier: 'role', use: 'Link text at rest; 4.5:1 on the page in both themes', swatch: '--ds-text-link' },
          { name: 'text.link-visited', tier: 'role', use: 'Visited link text; another hue than text.link, 4.5:1 on the page in both themes', swatch: '--ds-text-link-visited' },
          { name: 'text.default', tier: 'role', use: 'The pressed colour', swatch: '--ds-text-default' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator', swatch: '--ds-focus-ring-color' },
          { name: 'text.label.weight', tier: '2', use: 'Weight of the current link' },
          { name: 'size.border.thin · size.border.thick', tier: '2', use: 'Underline at rest, and on hover or current' },
          { name: 'size.control.md', tier: '2', use: 'Minimum size of a standalone link (32px; the target is at least size.target.min, 24px)' },
          { name: 'size.icon.sm · space.inline.xs', tier: '2', use: 'External icon and its gap' },
        ],
      }}
      stage={{
        render: (args) => (
          <Link href={String(args.href)} external={args.external === true} externalLabel={String(args.externalLabel)} current={toCurrent(args.current)} standalone={args.standalone === true}>
            Read the WCAG guide
          </Link>
        ),
        parts: [
          { n: 1, label: 'Text', note: 'children, required; underlined', target: '.ds-link', at: 'top-start' },
          { n: 2, label: 'External icon', note: 'shown when external', target: '.ds-link .ds-icon', at: 'bottom-end' },
          { n: 3, label: 'Hidden warning', note: 'externalLabel, spoken only', target: '.ds-link' },
        ],
      }}
      specs={[
        { label: 'Colour', value: 'text.link, 4.5:1 on surface.default' },
        { label: 'Underline', value: 'always on; size.border.thin at rest, size.border.thick on hover and when current' },
        { label: 'Target', value: 'inline in a sentence; standalone gives size.control.md (32px)' },
        { label: 'Focus', value: 'ring 2px, offset 2px, on :focus-visible' },
        { label: 'Element', value: 'native a; `as` swaps in a router link' },
      ]}
      api={[
        { label: 'href', value: 'The destination. Every native anchor attribute is passed through.', control: { kind: 'text', value: HREF } },
        { label: 'as', value: 'A component to render instead of a, such as an app router link. It gets every prop. The library imports no router.' },
        { label: 'external', value: 'Opens in a new tab with rel noopener, draws the external icon and adds the spoken warning.', control: { kind: 'boolean', value: true } },
        { label: 'externalLabel', value: 'The spoken warning, default "opens in a new tab". Pass it in the app language.', control: { kind: 'text', value: 'opens in a new tab' } },
        { label: 'current', value: 'true | "page" | "step" | "location". Sets aria-current and a cue beyond colour.', control: { kind: 'select', options: CURRENT, value: 'false' } },
        { label: 'standalone', value: 'Draws at 32px (size.control.md). Use it for nav items, crumbs and footer links, not inside a sentence.', control: { kind: 'boolean', value: false } },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'The link has no data of its own.' },
          { id: 'loading', status: 'n/a', reason: 'A link navigates at once. The page that loads shows the progress.' },
          { id: 'none', status: 'n/a', reason: 'The link holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'The link holds no collection.' },
          { id: 'some', status: 'n/a', reason: 'The link has no data of its own.' },
          { id: 'too-many', status: 'designed', label: 'Too many (long text)', render: <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 4)' }}><Link href={HREF}>Read the full guide to writing accessible link text for a public sector website</Link></div>, trigger: 'long children', note: 'The text wraps and never truncates.' },
          { id: 'incorrect', status: 'n/a', reason: 'A link cannot be invalid. A broken destination is the router\'s error page.' },
          { id: 'correct', status: 'n/a', reason: 'A link has no input to confirm.' },
          { id: 'done', status: 'n/a', reason: 'Following the link is the result.' },
          { id: 'default', status: 'designed', render: <Link href={HREF}>Shipping policy</Link>, trigger: 'href' },
          { id: 'hover', status: 'designed', render: <Link href={HREF} className="doc-force-hover">Shipping policy</Link>, trigger: ':hover', note: 'The underline thickens. Forced by .doc-force-hover.' },
          { id: 'focus-visible', status: 'designed', render: <Link href={HREF} className="doc-force-focus">Shipping policy</Link>, trigger: ':focus-visible', note: 'Forced by .doc-force-focus.' },
          { id: 'active', status: 'designed', render: <Link href={HREF} className="doc-force-active">Shipping policy</Link>, trigger: ':active', note: 'Forced by .doc-force-active.' },
          { id: 'disabled', status: 'n/a', reason: 'An anchor with no href is not a link. Show plain text and say why the destination is unavailable.' },
          { id: 'selected', status: 'designed', label: 'Selected (current)', render: <Link href={HREF} current standalone>Shipments</Link>, trigger: 'current', note: 'aria-current="page"; heavier text and a thicker underline.' },
          { id: 'visited', status: 'designed', group: 'interaction', render: <Link href={HREF} className="doc-force-visited">Shipping policy</Link>, trigger: ':visited', note: 'Another hue, still underlined. Forced by .doc-force-visited.' },
          { id: 'default', variant: 'External', status: 'designed', render: <Link href={HREF} external>Carrier tracking</Link>, trigger: 'external', note: 'Icon plus the hidden text "opens in a new tab".' },
        ],
      }}
      extra={[
        {
          title: 'In a sentence and standalone',
          kicker: 'Inline links keep the text line; standalone links draw at 32px.',
          content: (
            <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
              <p style={{ margin: 0, color: 'var(--ds-text-default)', font: 'var(--ds-text-body-size)/var(--ds-text-body-line-height) var(--ds-text-body-family)' }}>
                Read the <Link href={HREF}>shipping policy</Link> before you order, or see the <Link href={HREF} external>carrier terms</Link>.
              </p>
              <div style={row}>
                <Link href={HREF} standalone>Requisitions</Link>
                <Link href={HREF} standalone current>Shipments</Link>
                <Link href={HREF} standalone>Reports</Link>
              </div>
            </div>
          ),
        },
      ]}
      dos={[
        { text: 'Write link text that names the destination: "Shipping policy".', basis: 'WCAG 2.4.4 (A)' },
        { text: 'Keep the underline, so the link does not depend on colour.', basis: 'WCAG 1.4.1 (A)' },
        { text: 'Warn before a link opens a new tab, in the accessible name.', basis: 'WCAG 3.2.5 (AAA); navigation rule 15' },
        { text: 'Mark the link to the current page with current.', basis: 'WCAG 4.1.2 (A)' },
        { text: 'Pass a router link through `as` and keep the href.', basis: 'Project decision: no router in the library' },
      ]}
      donts={[
        { text: 'Remove the underline and rely on colour.', basis: 'WCAG 1.4.1 (A)', rule: 'link.not-colour-alone' },
        { text: 'Use a link for an action, such as "Delete".', basis: 'WCAG 4.1.2 (A)', rule: 'link.not-a-button' },
        { text: 'Write "Click here" or "Read more" as link text.', basis: 'WCAG 2.4.4 (A)', rule: 'link.descriptive-text' },
        { text: 'Open a new tab without saying so.', basis: 'WCAG 3.2.5 (AAA)', rule: 'link.external-warned' },
        { text: 'Import a router in the link.', basis: 'docs/library.md isolation rule 4', rule: 'link.no-router' },
        { text: 'Write a colour literal in link.css.', basis: 'misfile.raw-value-in-component', rule: 'link.no-literal' },
      ]}
      guide="clickables-link--docs"
      guideName="Link"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Link" layer="Component" family="Clickables" rules={linkRules} guide="clickables-link--docs" guideName="Link" />,
};

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Link"
      layer="Component"
      family="Clickables"
      imports="import { Link, Stack, Text } from '@acme/design-system';"
      guide="clickables-link--docs"
      guideName="Link"
      groups={[
        {
          title: 'Basics',
          kicker: 'A link goes to a URL. The underline stays at rest.',
          examples: [
            { title: 'In a sentence', when: 'A link inside running text. It stays inline and keeps the line height.', render: <Text as="p">Read the <Link href="#shipping">shipping policy</Link> before you order.</Text> },
            { title: 'Standalone', when: 'A link that stands alone, such as a footer link. It draws a 32px target.', render: <Link href="#privacy" standalone>Privacy notice</Link> },
            { title: 'Descriptive text', when: 'Name the destination, so the link makes sense out of context.', render: <Link href="#accessibility">Accessibility statement</Link> },
          ],
        },
        {
          title: 'External and current',
          kicker: 'Two props change the meaning of the link.',
          examples: [
            { title: 'External', when: 'The link leaves the app and opens in a new tab. The icon and the spoken warning come with it.', render: <Link href="https://example.com/terms" external>Terms of service</Link> },
            { title: 'External, translated warning', when: 'The app is not in English: pass the warning in the app language.', render: <Link href="https://example.com/conditions" external externalLabel="s’ouvre dans un nouvel onglet">Conditions d’utilisation</Link> },
            { title: 'Current page', when: 'The link points at the page the user is on. aria-current is "page".', render: <Link href="#shipments" current standalone>Shipments</Link> },
            { title: 'Current step', when: 'The link marks the step the user is on in a process.', render: <Link href="#payment" current="step" standalone>Payment</Link> },
            { title: 'Current location', when: 'The link marks the place the user is in a set that is not pages or steps, such as a site map.', render: <Link href="#warehouse" current="location" standalone>Warehouse</Link> },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Standalone links in a list or a nav carry the 32px target.',
          examples: [
            { title: 'Footer links', when: 'A short list of standalone links, one destination each.', render: (
              <Stack as="ul" direction="horizontal" gap={4} wrap aria-label="Footer">
                <li><Link href="#about" standalone>About</Link></li>
                <li><Link href="#careers" standalone>Careers</Link></li>
                <li><Link href="#privacy" standalone>Privacy</Link></li>
              </Stack>
            ) },
            { title: 'Navigation list', when: 'Each destination has its own URL; the current one is marked.', render: (
              <Stack as="nav" aria-label="Orders" gap={1}>
                <Link href="#all" standalone current>All orders</Link>
                <Link href="#open" standalone>Open orders</Link>
                <Link href="#returns" standalone>Returns</Link>
              </Stack>
            ) },
            { title: 'Link beside a caption', when: 'A secondary line that points to more detail.', render: (
              <Stack gap={1} align="start">
                <Text>Your plan renews on 1 March.</Text>
                <Text variant="caption" tone="muted" as="p">Questions? <Link href="#billing">See billing details</Link>.</Text>
              </Stack>
            ) },
          ],
        },
        {
          title: 'Router',
          kicker: 'The library never imports a router. Pass your own link component through as.',
          examples: [
            {
              title: 'With a router link',
              when: 'The app has a router. The component receives every prop, href included.',
              render: <Link as="a" href="#orders" standalone>Orders</Link>,
              code: `// NavLink: your router's link component.

<Link as={NavLink} to="/orders" standalone>Orders</Link>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The text wraps and never truncates. A long address breaks anywhere.',
          examples: [
            { title: 'Long text', when: 'A long link text in a narrow column. It wraps.', frame: 'narrow', render: <Link href="#guide">Read the full guide to writing accessible link text for a public sector website</Link> },
            { title: 'Long URL', when: 'A bare address as the link text. It breaks instead of overflowing.', frame: 'phone', render: <Link href="#long">https://example.com/documents/2026/annual-report/section-4/appendix-b/final-version.pdf</Link> },
            { title: 'Long external link', when: 'An external link that wraps. The icon follows the last word.', frame: 'narrow', render: <Link href="https://example.com/handbook" external>Employee handbook for the regional offices</Link> },
            { title: 'Long translated text', when: 'A long French label in a narrow column.', frame: 'narrow', render: <Link href="#aide">Consulter l’aide à la déclaration des revenus de l’année précédente</Link> },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'Every native anchor attribute passes through.',
          examples: [
            { title: 'Described by a hint', when: 'The link needs a consequence or a file size read after its name.', render: (
              <Stack gap={1} align="start">
                <Link href="#report" aria-describedby="link-report-hint">Annual report</Link>
                <Text variant="caption" tone="muted" as="p" id="link-report-hint">PDF, 2.4 MB.</Text>
              </Stack>
            ) },
            { title: 'Language of the target', when: 'The destination is in another language than the page.', render: <Link href="#fr" hrefLang="fr" lang="fr">Politique de confidentialité</Link> },
            { title: 'Download', when: 'The link saves a file. Say so in the text.', render: <Link href="#invoice.pdf" download>Download invoice 1042 (PDF)</Link> },
          ],
        },
      ]}
    />
  ),
};
