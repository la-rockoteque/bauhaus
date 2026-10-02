import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Box } from '../box/box';
import { Heading } from '../heading/heading';
import { Icon } from '../icon/icon';
import { Stack } from '../stack/stack';
import { Text } from '../text/text';
import { VisuallyHidden } from './visually-hidden';
import { visuallyHiddenRules } from './visually-hidden.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Primitives/Visually hidden', component: VisuallyHidden, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof VisuallyHidden>;

export default meta;

const notInteractive = 'Visually hidden text is not pointed at or pressed.';
// The focusable variant is fixed to the viewport. `contain: layout` makes this frame its containing block, so the grid and the anatomy show it here.
const Frame = ({ children }: { children: ReactNode }) => <div style={{ contain: 'layout', minBlockSize: 'calc(var(--ds-space-12) * 2)', minInlineSize: 'calc(var(--ds-space-12) * 6)' }}>{children}</div>;
const skipLink = <Frame><VisuallyHidden as="a" href="#main" focusable className="doc-force-focus">Skip to main content</VisuallyHidden></Frame>;
const noData = 'It holds a phrase for assistive technology, not data.';

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Visually hidden"
      layer="Primitive"
      plain="Some text is for screen readers only, such as 'opens in a new tab' or 'Close' next to an icon. Visually hidden keeps that text out of sight and in the page for assistive technology."
      precise="Primitive component · the clip pattern · stays in the accessibility tree · a focusable variant appears on keyboard focus, for skip links."
      usedFor="Names for icon-only controls, extra context for links, live-region messages and skip links."
      tokens={{
        mode: 'consumed',
        note: 'Only the focusable variant paints anything, and only while it has focus.',
        rows: [
          { name: 'surface.default · border.strong · text.link', tier: 'role', use: 'Fill, outline and text of a focused skip link', swatch: '--ds-surface-default' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator', swatch: '--ds-focus-ring-color' },
          { name: 'z.tooltip', tier: '2', use: 'Paint order: a focused skip link sits above every other layer' },
          { name: 'shadow.1', tier: 'role', use: 'Separates the skip link from the page under it' },
          { name: 'text.label.* · radius.control · size.border.thin · space.inset.sm · space.inline.lg', tier: '2', use: 'Look of the focused skip link' },
        ],
      }}
      stage={{
        render: (args) => (
          <Frame>
            <VisuallyHidden as="a" href={String(args.href)} focusable className="doc-force-focus">
              Skip to main content
            </VisuallyHidden>
          </Frame>
        ),
        parts: [
          { n: 1, label: 'Element', note: 'span by default; a for a skip link', target: '.ds-visually-hidden', at: 'top-start' },
          { n: 2, label: 'Text', note: 'children, required', target: '.ds-visually-hidden', at: 'end' },
        ],
      }}
      specs={[
        { label: 'Clip', value: 'absolute, one hairline square, overflow hidden, clip-path inset(50%)' },
        { label: 'Focusable variant', value: 'fixed at the top start corner on :focus-visible, z.tooltip' },
        { label: 'Element', value: 'span; a, p or div through as' },
      ]}
      api={[
        { label: 'as', value: 'The element to render. "a" with href for a skip link.' },
        { label: 'focusable', value: 'Show the element while it holds keyboard focus.' },
        { label: 'href', value: 'The target when as is "a".', control: { kind: 'text', value: '#main' } },
        { label: '…props', value: 'Every native HTML attribute.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'An empty hidden element names nothing. The caller renders nothing instead.' },
          { id: 'loading', status: 'n/a', reason: 'Use a status message; it can be hidden with this primitive.' },
          { id: 'none', status: 'n/a', reason: noData },
          { id: 'one', status: 'n/a', reason: noData },
          { id: 'some', status: 'n/a', reason: noData },
          { id: 'too-many', status: 'n/a', reason: 'Hidden text has no visible extent to overflow.' },
          { id: 'incorrect', status: 'n/a', reason: 'It has no error form.' },
          { id: 'correct', status: 'n/a', reason: notInteractive },
          { id: 'done', status: 'n/a', reason: notInteractive },
          { id: 'default', status: 'designed', render: <span className="doc-muted">Nothing to see: <VisuallyHidden>this phrase is in the accessibility tree</VisuallyHidden></span>, trigger: 'default', note: 'The phrase between the colon and the end of the line is clipped but still read aloud.' },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'designed', render: skipLink, trigger: ':focus-visible', note: 'A focusable skip link shows itself at the top start corner. Forced by .doc-force-focus.' },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: 'A disabled control is not hidden this way.' },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      dos={[
        { text: 'Put a focusable skip link first in the page.', basis: 'WCAG 2.4.1 (A)' },
        { text: 'Give an icon-only control its name with hidden text or a label.', basis: 'WCAG 4.1.2 (A); 1.1.1 (A)' },
        { text: 'Write a full phrase, not a fragment.', basis: 'WCAG 2.4.4 (A)' },
      ]}
      donts={[
        { text: 'Use display: none for text meant for screen readers.', basis: 'WCAG 1.3.1 (A)', rule: 'visually-hidden.stays-in-tree' },
        { text: 'Hide a focusable control without the focusable variant.', basis: 'WCAG 2.4.7 (AA)', rule: 'visually-hidden.not-a-control-hider' },
        { text: 'Let a sticky header cover the skip link.', basis: 'WCAG 2.4.11 (AA)', rule: 'visually-hidden.focusable-shows' },
        { text: 'Write a colour or px literal in the stylesheet.', basis: 'Project decision', rule: 'visually-hidden.no-literal' },
      ]}
      guide="primitives-visually-hidden--docs"
      guideName="Visually hidden"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Visually hidden" layer="Primitive" rules={visuallyHiddenRules} guide="primitives-visually-hidden--docs" guideName="Visually hidden" />,
};

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Visually hidden"
      layer="Primitive"
      imports="import { VisuallyHidden, Stack, Text, Icon, Heading, Box } from '@bauhaus/design-system';"
      intro={[
        'Visually hidden text is on the page for screen readers but invisible on screen. It is shrunk and clipped, not removed.',
        'A screen reader (software that reads the page aloud) needs context that the layout gives to sighted users: "this number is a price", "this table column holds actions".',
        '`display: none` and the `hidden` attribute remove content from everyone, screen readers included. `VisuallyHidden` is the tool that hides from the eyes only.',
        'Never use it to hide a label that sighted users would also need. A visible label helps everyone and gives a bigger click target (WCAG 3.3.2, A).',
        'The `focusable` option makes the element appear while it has keyboard focus. It is for skip links (links that jump past repeated navigation).',
      ]}
      guide="primitives-visually-hidden--docs"
      guideName="Visually hidden"
      groups={[
        {
          title: 'Add context for screen readers',
          kicker: 'Give a name or a meaning that the layout already shows to sighted users.',
          examples: [
            {
              title: 'Context for a number',
              when: 'A value whose meaning comes from its place on the page.',
              explain: [
                'Sighted users see that "3" sits beside a bell and understand it is a count of alerts. A screen reader only says "3".',
                'The hidden phrase adds "unread notifications". It is a full phrase, written to make sense on its own.',
                'The icon stays hidden from assistive technology, because the hidden text names it (WCAG 1.1.1, A).',
              ],
              render: (
                <Stack direction="horizontal" gap={1} align="center">
                  <Icon glyph="bell" />
                  <Text as="span">3</Text>
                  <VisuallyHidden>unread notifications</VisuallyHidden>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={1} align="center">
  {/* Decorative icon: no label. */}
  <Icon glyph="bell" />
  <Text as="span">3</Text>
  {/* Heard by screen readers: "3 unread notifications". Not seen. */}
  <VisuallyHidden>unread notifications</VisuallyHidden>
</Stack>`,
            },
            {
              title: 'A hidden heading that names a region',
              when: 'A region needs a name for screen readers, and the design shows no title.',
              explain: [
                '`as="h2"` makes the hidden text a real heading, so users who navigate by heading find the region.',
                'The section points to the heading with `aria-labelledby`.',
                'Pick the level from the outline of the page, as you would for a visible heading (WCAG 1.3.1, A).',
              ],
              render: (
                <Box as="section" aria-labelledby="vh-ex-results" padding={3} surface="sunken">
                  <VisuallyHidden as="h2" id="vh-ex-results">Search results</VisuallyHidden>
                  <Text>12 files match your search.</Text>
                </Box>
              ),
              code: `<Box as="section" aria-labelledby="results-title" padding={3} surface="sunken">
  {/* A real heading, invisible. Screen reader users can jump to it. */}
  <VisuallyHidden as="h2" id="results-title">Search results</VisuallyHidden>
  <Text>12 files match your search.</Text>
</Box>`,
            },
            {
              title: 'A table column with no visible title',
              when: 'The last column holds action buttons and the design shows no header.',
              explain: [
                'Every table column needs a header, or a screen reader user does not know what the column holds (WCAG 1.3.1, A).',
                'The hidden text fills the `<th>`. Sighted users see an empty header, and screen reader users hear "Actions".',
              ],
              render: (
                <table>
                  <thead>
                    <tr>
                      <th scope="col">File</th>
                      <th scope="col"><VisuallyHidden>Actions</VisuallyHidden></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>report.pdf</td>
                      <td>Open</td>
                    </tr>
                  </tbody>
                </table>
              ),
              code: `<table>
  <thead>
    <tr>
      <th scope="col">File</th>
      {/* No visible title, but the column still has a name. */}
      <th scope="col"><VisuallyHidden>Actions</VisuallyHidden></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>report.pdf</td>
      <td><Button variant="subtle">Open</Button></td>
    </tr>
  </tbody>
</table>`,
            },
            {
              title: 'A message announced but not shown',
              when: 'A result that sighted users see elsewhere, such as a count of search results after a filter changes.',
              explain: [
                '`role="status"` makes the screen reader announce the text each time it changes, without moving focus (WCAG 4.1.3, AA).',
                'Render the element early and empty, then change its text. A region that appears already filled is often missed, so the demo above may not be read.',
                '`as="p"` suits a sentence. The default `span` is for inline text.',
              ],
              render: <VisuallyHidden as="p" role="status">12 results found.</VisuallyHidden>,
              code: `// The text changes when the filter changes. Screen readers can announce it when the element was already in the page.
<VisuallyHidden as="p" role="status">{count} results found.</VisuallyHidden>`,
            },
            {
              title: 'Translated hidden text',
              when: 'The hidden text must follow the language of the product.',
              explain: [
                'The text arrives as `children`, so pass the translated string.',
                '`lang` on the element switches the screen reader voice when the language differs from the page (WCAG 3.1.2, AA).',
              ],
              render: (
                <Stack direction="horizontal" gap={1} align="center">
                  <Icon glyph="bell" />
                  <Text as="span">3</Text>
                  <VisuallyHidden lang="fr">notifications non lues</VisuallyHidden>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={1} align="center">
  <Icon glyph="bell" />
  <Text as="span">3</Text>
  <VisuallyHidden lang="fr">notifications non lues</VisuallyHidden>
</Stack>`,
            },
          ],
        },
        {
          title: 'Skip links (focusable)',
          kicker: 'Keyboard users tab through every link in the header on each page. A skip link lets them jump to the content.',
          examples: [
            {
              title: 'Skip to main content',
              when: 'A page with a header or menu before the main content. Put it first in the page.',
              explain: [
                '`as="a"` and `href` make a link. `focusable` shows it when it gets keyboard focus. Press Tab once on a page to see it appear.',
                'It appears at the top-left corner, above other layers, with a focus ring, so nothing covers it (WCAG 2.4.1, A; 2.4.7, AA).',
                'The target needs `id="main"` and `tabIndex={-1}` so focus can move into it.',
                'Without it, a keyboard user tabs through the whole menu on every page.',
              ],
              render: (
                <Stack gap={3}>
                  <VisuallyHidden as="a" href="#vh-ex-main" focusable>Skip to main content</VisuallyHidden>
                  <Text tone="muted">Click here, then press Tab to see the skip link appear.</Text>
                  <Box as="main" id="vh-ex-main" tabIndex={-1} padding={3} surface="sunken">
                    <Heading level={1}>Dashboard</Heading>
                  </Box>
                </Stack>
              ),
              code: `{/* First element of the page. Hidden until it gets keyboard focus. */}
<VisuallyHidden as="a" href="#main" focusable>Skip to main content</VisuallyHidden>

<header>{/* ...logo and menu... */}</header>

{/* tabIndex={-1} lets the link move focus here. */}
<Box as="main" id="main" tabIndex={-1}>
  <Heading level={1}>Dashboard</Heading>
</Box>`,
            },
          ],
        },
      ]}
    />
  ),
};
