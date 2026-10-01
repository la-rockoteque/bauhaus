import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Button } from '../../components/clickables/button/button';
import { Heading } from '../heading/heading';
import { Stack } from '../stack/stack';
import { Text } from '../text/text';
import { Box } from './box';
import type { BoxProps, Space } from './box';
import { boxRules } from './box.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Primitives/Box', component: Box, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Box>;

export default meta;

const STEPS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const;
const DISPLAYS = ['block', 'flex', 'grid'] as const satisfies readonly NonNullable<BoxProps['display']>[];
const SURFACES = ['default', 'raised', 'sunken'] as const satisfies readonly NonNullable<BoxProps['surface']>[];
const notInteractive = 'A Box is not interactive.';
const noData = 'A Box holds no data of its own.';
const Tile = ({ children }: { children: string }) => <Box padding={2} surface="default" style={{ border: 'thin solid var(--ds-border-strong)' }}>{children}</Box>;

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Box"
      layer="Primitive"
      plain="A box is an empty container. You choose how much space goes inside it and between its children, from a fixed list of sizes. It draws nothing until you give it a background."
      precise="Primitive component · one element with padding, gap and surface from tokens · adds no role · the element it renders is the caller's choice."
      usedFor="The inner layout of every component and pattern: cards, panels, form regions."
      tokens={{
        mode: 'consumed',
        note: 'The box has no component tokens.',
        rows: [
          { name: 'space.0 … space.12', tier: '1', use: 'Padding and gap. One class per step; no other value is possible' },
          { name: 'surface.default · raised · sunken', tier: 'role', use: 'Optional background', swatch: '--ds-surface-raised' },
        ],
      }}
      stage={{
        render: (args) => (
          <Box padding={Number(args.padding) as Space} display={args.display as BoxProps['display']} surface={args.surface as BoxProps['surface']} style={{ border: 'thin solid var(--ds-border-strong)' }}>
            Content
          </Box>
        ),
        parts: [
          { n: 1, label: 'Element', note: 'chosen by as, div by default', target: '.ds-box', at: 'top-start' },
          { n: 2, label: 'Padding', note: 'padding, paddingInline, paddingBlock', target: '.ds-box', at: 'bottom-start' },
          { n: 3, label: 'Surface', note: 'optional', target: '.ds-box' },
        ],
      }}
      specs={[
        { label: 'Default element', value: 'div, display block, no role' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-box', token: 'space.4', value: 'space.4 in this stage' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-box', token: 'space.4', value: 'space.4 in this stage' },
        { label: 'Spacing', value: 'space.0 to space.12 only; logical properties' },
        { label: 'Gap', value: 'Works with display flex or grid' },
      ]}
      api={[
        { label: 'as', value: 'The element to render. Pick it for document structure.' },
        { label: 'padding', value: 'A step from 0 to 12, on both axes.', control: { kind: 'select', options: STEPS, value: '4' } },
        { label: 'paddingInline · paddingBlock', value: 'A step from 0 to 12. The axis props win over padding.' },
        { label: 'gap', value: 'A step from 0 to 12, for display "flex" or "grid".' },
        { label: 'display', value: '"block" | "flex" | "grid", default "block".', control: { kind: 'select', options: DISPLAYS, value: 'block' } },
        { label: 'surface', value: '"default" | "raised" | "sunken". No background when omitted.', control: { kind: 'select', options: SURFACES, value: 'raised' } },
        { label: '…props', value: 'Every native HTML attribute.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'The caller decides whether to render an empty Box.' },
          { id: 'loading', status: 'n/a', reason: 'A Box has no loading form. Use a skeleton.' },
          { id: 'none', status: 'n/a', reason: noData },
          { id: 'one', status: 'n/a', reason: noData },
          {
            id: 'some',
            status: 'designed',
            label: 'Some (padding steps)',
            render: (
              <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'flex-start' }}>
                {([2, 4, 6] as const).map((step) => <Box key={step} padding={step} surface="raised" style={{ border: 'thin solid var(--ds-border-strong)' }}>{`p-${step}`}</Box>)}
              </div>
            ),
            trigger: 'padding',
            note: 'Steps 2, 4 and 6.',
          },
          { id: 'too-many', status: 'designed', label: 'Too many (long content)', render: <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 4)' }}><Box padding={3} surface="raised" style={{ border: 'thin solid var(--ds-border-strong)' }}>Delivery to the shipping address on file, unless you choose a pickup point.</Box></div>, trigger: 'long children', note: 'Content wraps inside the padding.' },
          { id: 'incorrect', status: 'n/a', reason: 'A Box has no error form. A field owns its error.' },
          { id: 'correct', status: 'n/a', reason: notInteractive },
          { id: 'done', status: 'n/a', reason: notInteractive },
          {
            id: 'default',
            status: 'designed',
            render: (
              <Box display="grid" gap={2} padding={3} surface="sunken">
                <Tile>One</Tile>
                <Tile>Two</Tile>
              </Box>
            ),
            trigger: 'display="grid" gap={2}',
            note: 'A grid Box with a gap.',
          },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      dos={[
        { text: 'Choose as from the structure of the page: section, nav, ul.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Pick the nearest step of the scale, and change the scale if none fits.', basis: 'Project decision' },
        { text: 'Set display to flex or grid before you set a gap.', basis: 'CSS Box Alignment' },
      ]}
      donts={[
        { text: 'Write a px padding or gap next to a Box.', basis: 'Project decision', rule: 'box.no-literal' },
        { text: 'Pass a number outside 0 to 12.', basis: 'Closed scale', rule: 'box.space-closed' },
        { text: 'Style a div as a list or a navigation.', basis: 'WCAG 1.3.1 (A)', rule: 'box.element-by-structure' },
        { text: 'Put onClick on a Box.', basis: 'APG Button; WCAG 4.1.2 (A)', rule: 'box.not-interactive' },
      ]}
      guide="primitives-box--docs"
      guideName="Box"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Box" layer="Primitive" rules={boxRules} guide="primitives-box--docs" guideName="Box" />,
};

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Box"
      layer="Primitive"
      imports="import { Box, Stack, Text, Heading, Button } from '@acme/design-system';"
      intro={[
        'A box is an empty container. It draws nothing until you give it padding (space inside), a gap (space between its children) or a surface (a background).',
        'Padding is the space between the edge of a box and what is inside it. A gap is the space between two children. A margin is space outside the box, and Box has none: the parent sets the space around a child.',
        'Every distance comes from the space scale: steps `0` to `12`, each one 4px more than the last (`padding={4}` is 16px). You cannot write `13px`. The type check refuses it.',
        'The scale beats a custom margin because the whole product then shares a few distances. Edges line up from screen to screen, and one theme change can shrink them all.',
        'A surface is a background colour with a job: `default` for the page, `raised` for things that sit above it (cards), `sunken` for wells and inset areas. Text on each reaches the contrast it needs in light and dark themes.',
        'A Box has no role and cannot be pressed. For anything the user clicks, use `Button` or `Link`.',
      ]}
      guide="primitives-box--docs"
      guideName="Box"
      groups={[
        {
          title: 'Padding',
          kicker: 'Space inside the box. Start with `padding`, then refine one axis at a time.',
          examples: [
            {
              title: 'Padding on all sides',
              when: 'Give content room inside a container so the text does not touch the edge.',
              explain: [
                '`padding` takes a space step. `padding={4}` is 16px on every side.',
                'A box with no background shows padding only as empty room. Here a `sunken` surface makes the room visible.',
                'The padding is logical: it follows the reading direction, so nothing changes for right-to-left text.',
              ],
              render: <Box padding={4} surface="sunken">Content with room around it.</Box>,
              code: `// padding 4 = 16px on all four sides.
// surface="sunken" only makes the box visible for this demo.
<Box padding={4} surface="sunken">Content with room around it.</Box>`,
            },
            {
              title: 'Small, medium and large padding',
              when: 'Pick the step that matches the size of the thing you wrap.',
              explain: [
                'Use `2` (8px) for small chips and tags, `4` (16px) for cards and panels, `6` (24px) or more for roomy areas.',
                'Bigger blocks deserve more room. Padding that is the same everywhere makes small things look cramped and large things look empty.',
                '`padding={0}` is a real step. Use it to turn padding off when a parent style would add some.',
              ],
              render: (
                <Stack gap={4}>
                  <Box padding={2} surface="sunken">padding 2 (8px)</Box>
                  <Box padding={4} surface="sunken">padding 4 (16px)</Box>
                  <Box padding={6} surface="sunken">padding 6 (24px)</Box>
                </Stack>
              ),
              code: `<Stack gap={4}>
  {/* 8px: tags, chips, dense rows. */}
  <Box padding={2} surface="sunken">padding 2 (8px)</Box>
  {/* 16px: cards and panels. */}
  <Box padding={4} surface="sunken">padding 4 (16px)</Box>
  {/* 24px: roomy areas. */}
  <Box padding={6} surface="sunken">padding 6 (24px)</Box>
</Stack>`,
            },
            {
              title: 'Different padding on each axis',
              when: 'The sides need different room: a wide row with less height, or a banner with deep top and bottom.',
              explain: [
                '`paddingInline` is the inline axis (left and right in English). `paddingBlock` is the block axis (top and bottom).',
                'They win over `padding`, so you can set a base and then override one axis.',
                'Because the axes are logical, right-to-left text swaps the sides for you.',
              ],
              render: <Box paddingInline={6} paddingBlock={2} surface="sunken">Wide and short</Box>,
              code: `// 24px on the sides, 8px on top and bottom.
<Box paddingInline={6} paddingBlock={2} surface="sunken">Wide and short</Box>`,
            },
            {
              title: 'A base plus one override',
              when: 'Most sides share one step and one axis differs.',
              explain: [
                '`padding={4}` sets 16px everywhere. `paddingBlock={1}` then wins on top and bottom, giving 4px there.',
                'The order of the props does not matter. The more specific prop always wins.',
              ],
              render: <Box padding={4} paddingBlock={1} surface="sunken">16px sides, 4px top and bottom</Box>,
              code: `// padding sets the base. paddingBlock wins on the block axis.
<Box padding={4} paddingBlock={1} surface="sunken">
  16px sides, 4px top and bottom
</Box>`,
            },
          ],
        },
        {
          title: 'Surfaces',
          kicker: 'A surface is a background colour with a job. Pick by role, never by colour.',
          examples: [
            {
              title: 'The three surfaces',
              when: 'You need to separate a region from what is around it.',
              explain: [
                '`default` is the page background. `raised` sits above the page, like a card. `sunken` sits below it, like a well or an input area.',
                'Each surface is a colour role: it changes with the theme (light, dark) and still keeps readable text (WCAG 1.4.3, AA).',
                'A hex colour in your own CSS would stay the same in dark mode and break the contrast. Always use a role.',
              ],
              render: (
                <Stack gap={4}>
                  <Box padding={4} surface="default">default</Box>
                  <Box padding={4} surface="raised">raised</Box>
                  <Box padding={4} surface="sunken">sunken</Box>
                </Stack>
              ),
              code: `<Stack gap={4}>
  {/* The page background. Leave "surface" out to draw nothing. */}
  <Box padding={4} surface="default">default</Box>
  {/* Above the page: cards, popovers. */}
  <Box padding={4} surface="raised">raised</Box>
  {/* Below the page: wells, code blocks, inset areas. */}
  <Box padding={4} surface="sunken">sunken</Box>
</Stack>`,
            },
            {
              title: 'Layers inside layers',
              when: 'A card sits on a sunken page region, or a well sits inside a card.',
              explain: [
                'Nest a `raised` box inside a `sunken` one and the card pops forward. The difference in surface shows the depth.',
                'Do not nest the same surface in itself. It adds padding and no visible change.',
                'Use at most two or three layers. More stops being clear.',
              ],
              render: (
                <Box padding={4} surface="sunken">
                  <Box padding={4} surface="raised">A card on a sunken area</Box>
                </Box>
              ),
              code: `// Outer: the sunken area. Inner: a raised card on top of it.
<Box padding={4} surface="sunken">
  <Box padding={4} surface="raised">A card on a sunken area</Box>
</Box>`,
            },
          ],
        },
        {
          title: 'Gap and display',
          kicker: '`gap` only works when the box is a flex or a grid container. `display` turns that on.',
          examples: [
            {
              title: 'Block (the default)',
              when: 'A plain container where children flow one under the other.',
              explain: [
                '`display` defaults to `"block"`. Children keep the normal flow of the page.',
                'A `gap` on a block box does nothing. Set `display="flex"` or `"grid"` first.',
                'If you only need a column or a row with a gap, use `Stack`. It sets flex and the gap for you.',
              ],
              render: (
                <Box padding={4} surface="sunken">
                  <Text>Normal flow, like any block element.</Text>
                </Box>
              ),
              code: `// display="block" is the default, so you can leave it out.
<Box padding={4} surface="sunken">
  <Text>Normal flow, like any block element.</Text>
</Box>`,
            },
            {
              title: 'Flex with a gap',
              when: 'Children in a row or column with space between, and you also need a surface on the same element.',
              explain: [
                '`display="flex"` makes the children flex items, side by side. `gap={3}` puts 12px between them.',
                'For a plain row or column, `Stack` is the shorter way. Reach for a flex Box when you need a surface or padding and a gap on the same element.',
              ],
              render: (
                <Box display="flex" gap={3} padding={3} surface="sunken">
                  <Text as="span">One</Text>
                  <Text as="span">Two</Text>
                  <Text as="span">Three</Text>
                </Box>
              ),
              code: `// flex = children side by side. gap 3 = 12px between them.
<Box display="flex" gap={3} padding={3} surface="sunken">
  <Text as="span">One</Text>
  <Text as="span">Two</Text>
  <Text as="span">Three</Text>
</Box>`,
            },
            {
              title: 'Grid with a gap',
              when: 'A grid container whose rows are spaced from the scale.',
              explain: [
                '`display="grid"` makes the box a grid. Without a column definition, each child takes its own row, and `gap` spaces the rows.',
                'Box has no prop for columns. If you need columns, define them in your own stylesheet and keep the gap from the scale.',
              ],
              render: (
                <Box display="grid" gap={2} padding={3} surface="sunken">
                  <Text>Row one</Text>
                  <Text>Row two</Text>
                </Box>
              ),
              code: `// grid: each child gets its own row, 8px apart.
<Box display="grid" gap={2} padding={3} surface="sunken">
  <Text>Row one</Text>
  <Text>Row two</Text>
</Box>`,
            },
          ],
        },
        {
          title: 'The element, and other attributes',
          kicker: 'Choose the HTML element for the meaning of the content. Box adds no role of its own.',
          examples: [
            {
              title: 'Pick the element with as',
              when: 'The region has a meaning: a section, a navigation, a side note.',
              explain: [
                '`as` sets the HTML element. The default is `div`, which means nothing to assistive technology.',
                '`section`, `nav`, `aside` and `main` are landmarks (regions that screen readers list for quick jumps). A `section` becomes a landmark only when it has a name (WCAG 1.3.1, A).',
                '`aria-labelledby` names the section with the text of its heading. Point it at the heading `id`.',
              ],
              render: (
                <Box as="section" aria-labelledby="box-ex-security" padding={4} surface="raised">
                  <Stack gap={2}>
                    <Heading level={2} id="box-ex-security">Security</Heading>
                    <Text>Manage your password and sign-in devices.</Text>
                  </Stack>
                </Box>
              ),
              code: `// "section" + a name = a landmark that screen readers can jump to.
<Box as="section" aria-labelledby="security-title" padding={4} surface="raised">
  <Stack gap={2}>
    <Heading level={2} id="security-title">Security</Heading>
    <Text>Manage your password and sign-in devices.</Text>
  </Stack>
</Box>`,
            },
            {
              title: 'A navigation or side note',
              when: 'A group of links, or content that is aside from the main text.',
              explain: [
                '`as="aside"` marks content related to the main text, such as a tip. `as="nav"` marks a group of navigation links.',
                'A page with two `nav` regions needs a different `aria-label` on each, so users can tell them apart.',
              ],
              render: (
                <Box as="aside" aria-label="Tip" padding={3} surface="sunken">
                  <Text variant="caption">Tip: press Tab to move between controls.</Text>
                </Box>
              ),
              code: `<Box as="aside" aria-label="Tip" padding={3} surface="sunken">
  <Text variant="caption">Tip: press Tab to move between controls.</Text>
</Box>`,
            },
            {
              title: 'Native attributes pass through',
              when: 'You need an `id`, a `data-*` attribute for tests, a `lang` or a `className`.',
              explain: [
                'Every native HTML attribute goes to the element: `id`, `lang`, `dir`, `data-*`, `aria-*`, `className`.',
                '`lang="fr"` tells screen readers to switch to French pronunciation for this text (WCAG 3.1.2, AA).',
                'Box refuses `onClick`, `onKeyDown` and `onKeyUp`. A box has no role and no keyboard path, so a click handler would make a control that keyboard users cannot reach (WCAG 4.1.2, A). Use `Button` for that.',
              ],
              render: (
                <Box lang="fr" data-testid="welcome" padding={3} surface="sunken">
                  <Text>Bienvenue dans votre espace.</Text>
                </Box>
              ),
              code: `// lang switches the screen reader voice. data-testid is for your tests.
<Box lang="fr" data-testid="welcome" padding={3} surface="sunken">
  <Text>Bienvenue dans votre espace.</Text>
</Box>`,
            },
            {
              title: 'Right-to-left content',
              when: 'The text reads from right to left, such as Arabic or Hebrew.',
              explain: [
                '`dir="rtl"` turns the reading direction. Padding on the inline axis follows it, so you write nothing special.',
                '`paddingInline={6}` gives the same room on both inline sides, so the box looks the same in either direction.',
              ],
              render: (
                <Box dir="rtl" lang="ar" paddingInline={6} paddingBlock={2} surface="sunken">
                  <Text>مرحبا بكم</Text>
                </Box>
              ),
              code: `// dir="rtl" flips the inline axis. No extra CSS needed.
<Box dir="rtl" lang="ar" paddingInline={6} paddingBlock={2} surface="sunken">
  <Text>مرحبا بكم</Text>
</Box>`,
            },
          ],
        },
        {
          title: 'Recipes',
          kicker: 'Box and Stack together: Box for the space around and the surface, Stack for the space between.',
          examples: [
            {
              title: 'A card',
              when: 'A bordered block of related content with one action.',
              explain: [
                'The Box gives the card a `raised` surface and `padding={4}`. The Stack spaces the three pieces inside it.',
                '`gap={2}` between the title and the text keeps them as one group. `gap={4}` before the button sets the action apart.',
                'Content must wrap and never be cut off. The card has no fixed width, so long text grows it downward (WCAG 1.4.10, AA).',
              ],
              render: (
                <Box surface="raised" padding={4}>
                  <Stack gap={4} align="start">
                    <Stack gap={2}>
                      <Heading level={3}>Weekly summary</Heading>
                      <Text>Three tasks are due this week. One is overdue.</Text>
                    </Stack>
                    <Button variant="secondary">Open tasks</Button>
                  </Stack>
                </Box>
              ),
              code: `// Box: the surface and the space inside.
<Box surface="raised" padding={4}>
  {/* align="start": the button keeps its natural width. */}
  <Stack gap={4} align="start">
    {/* Tight inner group: title and text belong together. */}
    <Stack gap={2}>
      <Heading level={3}>Weekly summary</Heading>
      <Text>Three tasks are due this week. One is overdue.</Text>
    </Stack>
    <Button variant="secondary" onClick={openTasks}>Open tasks</Button>
  </Stack>
</Box>`,
            },
            {
              title: 'A card on a narrow screen',
              when: 'Check that long text wraps instead of overflowing.',
              explain: [
                'The frame here is only 192px wide, which is narrower than any phone. The text wraps onto several lines and the card stays inside the frame.',
                'There is no fixed width or height in the snippet, so text zoom and long translations cannot break it (WCAG 1.4.4, AA).',
              ],
              frame: 'narrow',
              render: (
                <Box surface="raised" padding={3}>
                  <Text>Your subscription renews automatically at the end of each billing period.</Text>
                </Box>
              ),
              code: `// No width or height: the box grows with its text.
<Box surface="raised" padding={3}>
  <Text>Your subscription renews automatically at the end of each billing period.</Text>
</Box>`,
            },
            {
              title: 'A form region',
              when: 'A group of related fields that sits in a tinted area.',
              explain: [
                'Use `as="form"` plus an `aria-labelledby` name to make the area a form landmark.',
                'The `sunken` surface shows the region without a border. The Stack spaces the heading and the fields.',
                'Use the field components of the library for the fields themselves. They link labels to controls for you.',
              ],
              render: (
                <Box as="form" aria-labelledby="box-ex-contact" surface="sunken" padding={4} onSubmit={(event) => event.preventDefault()}>
                  <Stack gap={3} align="start">
                    <Heading level={2} id="box-ex-contact">Contact us</Heading>
                    <Text>We reply within one working day.</Text>
                    <Button type="submit">Send message</Button>
                  </Stack>
                </Box>
              ),
              code: `// "form" + a name = a form landmark.
<Box as="form" aria-labelledby="contact-title" surface="sunken" padding={4} onSubmit={send}>
  <Stack gap={3} align="start">
    <Heading level={2} id="contact-title">Contact us</Heading>
    <Text>We reply within one working day.</Text>
    {/* type="submit" makes Enter send the form. */}
    <Button type="submit">Send message</Button>
  </Stack>
</Box>`,
            },
          ],
        },
      ]}
    />
  ),
};
