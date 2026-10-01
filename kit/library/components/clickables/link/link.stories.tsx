import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
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
