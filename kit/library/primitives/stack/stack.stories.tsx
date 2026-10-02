import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Button } from '../../components/clickables/button/button';
import { Heading } from '../heading/heading';
import { Text } from '../text/text';
import { Box } from '../box/box';
import type { Space } from '../box/box';
import { Stack } from './stack';
import type { StackProps } from './stack';
import { stackRules } from './stack.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Primitives/Stack', component: Stack, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Stack>;

export default meta;

const DIRECTIONS = ['vertical', 'horizontal'] as const satisfies readonly NonNullable<StackProps['direction']>[];
const STEPS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const;
const ALIGNS = ['start', 'center', 'end', 'stretch', 'baseline'] as const satisfies readonly NonNullable<StackProps['align']>[];
const JUSTIFIES = ['start', 'center', 'end', 'between'] as const satisfies readonly NonNullable<StackProps['justify']>[];
const notInteractive = 'A Stack is not interactive.';
const noData = 'A Stack holds no data of its own.';
const Chip = ({ children }: { children: string }) => <Box padding={2} surface="raised" style={{ border: 'thin solid var(--ds-border-strong)' }}>{children}</Box>;

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Stack"
      layer="Primitive"
      plain="A stack puts things in a line, one after the other, with an even gap between them. The line runs down the page or across it."
      precise="Primitive component · a flex Box with direction, gap, alignment and wrapping · the gap is a space step · built on Box."
      usedFor="Forms, button rows, toolbars, lists of cards, any run of siblings."
      tokens={{
        mode: 'consumed',
        note: 'The stack has no component tokens. It passes its gap to Box.',
        rows: [{ name: 'space.0 … space.12', tier: '1', use: 'The gap. The default is space.4' }],
      }}
      stage={{
        render: (args) => (
          <Stack
            direction={args.direction as StackProps['direction']}
            gap={Number(args.gap) as Space}
            align={args.align as StackProps['align']}
            justify={args.justify as StackProps['justify']}
            wrap={args.wrap === true}
          >
            <Chip>One</Chip>
            <Chip>Two</Chip>
            <Chip>Three</Chip>
          </Stack>
        ),
        parts: [
          { n: 1, label: 'Container', note: 'a flex Box; element chosen by as', target: '.ds-stack' },
          { n: 2, label: 'Items', note: 'children, in DOM order', target: '.ds-stack > :nth-child(2)', at: 'top-start' },
          { n: 3, label: 'Gap', note: 'a space step, between items only', target: '.ds-stack > :first-child', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Gap', property: 'gap', target: '.ds-stack', token: 'space.3', value: 'space.3 in this stage' },
        { label: 'Defaults', value: 'vertical · gap space.4 · align stretch · justify start · no wrap' },
        { label: 'Order', value: 'No reverse direction; visual order equals DOM order' },
        { label: 'Element', value: 'div; ul or ol for a list, with no markers and no padding, and role="list"' },
      ]}
      api={[
        { label: 'direction', value: '"vertical" | "horizontal", default "vertical".', control: { kind: 'select', options: DIRECTIONS, value: 'horizontal' } },
        { label: 'gap', value: 'A space step from 0 to 12, default 4.', control: { kind: 'select', options: STEPS, value: '3' } },
        { label: 'align', value: '"start" | "center" | "end" | "stretch" | "baseline", default "stretch". Cross axis.', control: { kind: 'select', options: ALIGNS, value: 'stretch' } },
        { label: 'justify', value: '"start" | "center" | "end" | "between", default "start". Main axis.', control: { kind: 'select', options: JUSTIFIES, value: 'start' } },
        { label: 'wrap', value: 'Let children flow onto a new line. Use it on rows of variable width.', control: { kind: 'boolean', value: false } },
        { label: 'as', value: 'The element to render. "ul" or "ol" for a list: markers and padding reset, role="list" kept.' },
        { label: '…props', value: 'Every native HTML attribute.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'An empty stack has no size. The caller hides it.' },
          { id: 'loading', status: 'n/a', reason: 'A Stack has no loading form. Use a skeleton.' },
          { id: 'none', status: 'n/a', reason: noData },
          { id: 'one', status: 'n/a', reason: noData },
          {
            id: 'some',
            status: 'designed',
            label: 'Some (vertical)',
            render: (
              <Stack gap={2}>
                <Chip>One</Chip>
                <Chip>Two</Chip>
                <Chip>Three</Chip>
              </Stack>
            ),
            trigger: 'direction="vertical" gap={2}',
          },
          {
            id: 'too-many',
            status: 'designed',
            label: 'Too many (wrapping row)',
            render: (
              <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 5)' }}>
                <Stack direction="horizontal" gap={2} wrap>
                  {['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'].map((name) => <Chip key={name}>{name}</Chip>)}
                </Stack>
              </div>
            ),
            trigger: 'wrap',
            note: 'The row reflows onto new lines and never scrolls sideways.',
          },
          { id: 'incorrect', status: 'n/a', reason: 'A Stack has no error form.' },
          { id: 'correct', status: 'n/a', reason: notInteractive },
          { id: 'done', status: 'n/a', reason: notInteractive },
          {
            id: 'default',
            status: 'designed',
            render: (
              <Stack direction="horizontal" gap={3} align="center" justify="between">
                <Chip>Left</Chip>
                <Chip>Right</Chip>
              </Stack>
            ),
            trigger: 'direction="horizontal" justify="between"',
          },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      dos={[
        { text: 'Set wrap on a row of variable width.', basis: 'WCAG 1.4.10 (AA)' },
        { text: 'Render a stack of like items as ul with li children.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Change the DOM order to change the visual order.', basis: 'WCAG 1.3.2 (A); 2.4.3 (A)' },
      ]}
      donts={[
        { text: 'Reverse the visual order with CSS.', basis: 'WCAG 1.3.2 (A)', rule: 'stack.no-reverse' },
        { text: 'Leave a button row without wrap.', basis: 'WCAG 1.4.10 (AA)', rule: 'stack.wraps' },
        { text: 'Add a margin to a child to space it.', basis: 'Project decision', rule: 'stack.gap-from-space' },
        { text: 'Use divs for a list of like items.', basis: 'WCAG 1.3.1 (A)', rule: 'stack.list-semantics' },
      ]}
      guide="primitives-stack--docs"
      guideName="Stack"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Stack" layer="Primitive" rules={stackRules} guide="primitives-stack--docs" guideName="Stack" />,
};

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Stack"
      layer="Primitive"
      imports="import { Stack, Box, Text, Heading, Button } from '@bauhaus/design-system';"
      intro={[
        'A stack puts its children in one line, one after the other. The line runs down the page (a column) or across it (a row).',
        'The gap is the empty space between two children. You pick it from the space scale: a short list of sizes, `0` to `12`, where each step is 4px more than the last (`gap={4}` is 16px).',
        'The scale beats a custom margin because every screen then shares the same few distances. Spacing looks even, and a denser theme can shrink all of them at once.',
        'The main axis is the direction the line runs. The cross axis is the other one. `justify` spreads children along the main axis. `align` places them on the cross axis.',
        'A stack only sets the space between its children. For space inside one child, or for a background, wrap that child in a `Box`.',
        'Rows use the inline axis (the reading direction), so a row runs right to left in Arabic or Hebrew with no change to your code.',
      ]}
      guide="primitives-stack--docs"
      guideName="Stack"
      groups={[
        {
          title: 'The basics',
          kicker: 'Start here. A column, a row, and the gap between the children.',
          examples: [
            {
              title: 'A column',
              when: 'Put things one under the other: paragraphs, form fields, cards.',
              explain: [
                'A column is the default, so `direction` can be left out. Most layout is a column.',
                'The default gap is `4`, which is 16px. It is a calm, readable distance for most content.',
                'Each child sits where the markup puts it. Reading order and visual order stay the same, which keyboard and screen reader users rely on (WCAG 1.3.2, A).',
              ],
              render: (
                <Stack>
                  <Box surface="sunken" padding={2}>First</Box>
                  <Box surface="sunken" padding={2}>Second</Box>
                  <Box surface="sunken" padding={2}>Third</Box>
                </Stack>
              ),
              code: `// No props: a column with gap 4 (16px) between the children.
<Stack>
  {/* Box adds padding and a background so you can see each child. */}
  <Box surface="sunken" padding={2}>First</Box>
  <Box surface="sunken" padding={2}>Second</Box>
  <Box surface="sunken" padding={2}>Third</Box>
</Stack>`,
            },
            {
              title: 'A row',
              when: 'Put things side by side: a button pair, an icon beside a label.',
              explain: [
                '`direction="horizontal"` runs the line across the page.',
                'The row follows the reading direction. In a right-to-left language the first child moves to the right by itself.',
                'A row does not break lines by itself. If the children may not fit, add `wrap` (see "Wrapping").',
              ],
              render: (
                <Stack direction="horizontal">
                  <Box surface="sunken" padding={2}>First</Box>
                  <Box surface="sunken" padding={2}>Second</Box>
                  <Box surface="sunken" padding={2}>Third</Box>
                </Stack>
              ),
              code: `// "horizontal" = a row. It flips by itself in right-to-left text.
<Stack direction="horizontal">
  <Box surface="sunken" padding={2}>First</Box>
  <Box surface="sunken" padding={2}>Second</Box>
  <Box surface="sunken" padding={2}>Third</Box>
</Stack>`,
            },
            {
              title: 'The gap, step by step',
              when: 'Choose how far apart the children sit.',
              explain: [
                '`gap` takes a step of the space scale: `0` to `12`. Step `n` is n times 4px, so `1` is 4px, `4` is 16px and `8` is 32px.',
                'Pick a small gap for children that belong together (a label and its hint). Pick a large gap for separate groups. Distance tells the eye what is related (Gestalt proximity).',
                'You cannot write `gap={13}` or `gap="13px"`. The type check refuses it. That is the point: no odd distances creep in.',
              ],
              render: (
                <Stack gap={6}>
                  <Stack direction="horizontal" gap={1}>
                    <Box surface="sunken" padding={2}>gap 1</Box>
                    <Box surface="sunken" padding={2}>4px</Box>
                  </Stack>
                  <Stack direction="horizontal" gap={4}>
                    <Box surface="sunken" padding={2}>gap 4</Box>
                    <Box surface="sunken" padding={2}>16px</Box>
                  </Stack>
                  <Stack direction="horizontal" gap={8}>
                    <Box surface="sunken" padding={2}>gap 8</Box>
                    <Box surface="sunken" padding={2}>32px</Box>
                  </Stack>
                </Stack>
              ),
              code: `<Stack gap={6}>
  {/* Step 1 = 4px: tightly related. */}
  <Stack direction="horizontal" gap={1}>
    <Box surface="sunken" padding={2}>gap 1</Box>
    <Box surface="sunken" padding={2}>4px</Box>
  </Stack>
  {/* Step 4 = 16px: the default. */}
  <Stack direction="horizontal" gap={4}>
    <Box surface="sunken" padding={2}>gap 4</Box>
    <Box surface="sunken" padding={2}>16px</Box>
  </Stack>
  {/* Step 8 = 32px: clearly separate. */}
  <Stack direction="horizontal" gap={8}>
    <Box surface="sunken" padding={2}>gap 8</Box>
    <Box surface="sunken" padding={2}>32px</Box>
  </Stack>
</Stack>`,
            },
            {
              title: 'No gap',
              when: 'Children must touch, for example when you draw your own segmented control.',
              explain: [
                '`gap={0}` removes the space. It is a real step of the scale, not a special case.',
                'Do not use a negative margin to pull children together. Set the gap to `0` and let the children draw their own borders.',
              ],
              render: (
                <Stack direction="horizontal" gap={0}>
                  <Box surface="sunken" padding={2}>Left</Box>
                  <Box surface="raised" padding={2}>Middle</Box>
                  <Box surface="sunken" padding={2}>Right</Box>
                </Stack>
              ),
              code: `// gap 0: the children touch. Two surfaces show where one ends.
<Stack direction="horizontal" gap={0}>
  <Box surface="sunken" padding={2}>Left</Box>
  <Box surface="raised" padding={2}>Middle</Box>
  <Box surface="sunken" padding={2}>Right</Box>
</Stack>`,
            },
          ],
        },
        {
          title: 'Alignment',
          kicker: '`align` places children on the cross axis. `justify` spreads them along the main axis.',
          examples: [
            {
              title: 'align: start, center, end',
              when: 'Children of different heights sit in one row, and you choose where they line up.',
              explain: [
                'In a row, the cross axis is vertical. `align="start"` lines the tops up, `"center"` lines the middles up and `"end"` lines the bottoms up.',
                'Use `center` for an icon beside text, or a button beside a title. It is the most common choice for rows.',
                'In a column, the cross axis is horizontal, so `align` moves children left, centre or right.',
              ],
              render: (
                <Stack gap={6}>
                  <Stack direction="horizontal" align="start">
                    <Box surface="sunken" padding={2}>start</Box>
                    <Box surface="sunken" padding={6}>tall</Box>
                  </Stack>
                  <Stack direction="horizontal" align="center">
                    <Box surface="sunken" padding={2}>center</Box>
                    <Box surface="sunken" padding={6}>tall</Box>
                  </Stack>
                  <Stack direction="horizontal" align="end">
                    <Box surface="sunken" padding={2}>end</Box>
                    <Box surface="sunken" padding={6}>tall</Box>
                  </Stack>
                </Stack>
              ),
              code: `<Stack gap={6}>
  {/* Tops line up. */}
  <Stack direction="horizontal" align="start">
    <Box surface="sunken" padding={2}>start</Box>
    <Box surface="sunken" padding={6}>tall</Box>
  </Stack>
  {/* Middles line up: the usual choice for an icon next to text. */}
  <Stack direction="horizontal" align="center">
    <Box surface="sunken" padding={2}>center</Box>
    <Box surface="sunken" padding={6}>tall</Box>
  </Stack>
  {/* Bottoms line up. */}
  <Stack direction="horizontal" align="end">
    <Box surface="sunken" padding={2}>end</Box>
    <Box surface="sunken" padding={6}>tall</Box>
  </Stack>
</Stack>`,
            },
            {
              title: 'align: stretch and baseline',
              when: 'Make children as tall as the tallest one, or line up the text inside them.',
              explain: [
                '`stretch` is the default. Every child grows to the height of the tallest one, so side-by-side cards look even.',
                '`baseline` lines up the first line of text in each child, even when their sizes differ. Use it for a big number beside a small label.',
                'Pick `start` when you do not want children to grow.',
              ],
              render: (
                <Stack gap={6}>
                  <Stack direction="horizontal" align="stretch">
                    <Box surface="sunken" padding={2}>stretch</Box>
                    <Box surface="sunken" padding={6}>tall</Box>
                  </Stack>
                  <Stack direction="horizontal" align="baseline">
                    <Text variant="heading" as="span">42</Text>
                    <Text variant="caption" as="span">open tasks (text lines up)</Text>
                  </Stack>
                </Stack>
              ),
              code: `<Stack gap={6}>
  {/* The default: the short child grows to match the tall one. */}
  <Stack direction="horizontal" align="stretch">
    <Box surface="sunken" padding={2}>stretch</Box>
    <Box surface="sunken" padding={6}>tall</Box>
  </Stack>
  {/* The text sits on one shared line, though the sizes differ. */}
  <Stack direction="horizontal" align="baseline">
    <Text variant="heading" as="span">42</Text>
    <Text variant="caption" as="span">open tasks (text lines up)</Text>
  </Stack>
</Stack>`,
            },
            {
              title: 'justify: start, center, end',
              when: 'The row has spare room, and you choose which side the children gather on.',
              explain: [
                '`justify` works along the main axis, which is the row direction here. `start` is the default.',
                '`end` is the trailing edge, so a button pair gathers on the right in English and on the left in Arabic, with no extra code.',
                'Prefer `start` and `end` over "left" and "right". They follow the reading direction.',
              ],
              render: (
                <Stack gap={4}>
                  <Stack direction="horizontal" justify="start">
                    <Box surface="sunken" padding={2}>start</Box>
                    <Box surface="sunken" padding={2}>start</Box>
                  </Stack>
                  <Stack direction="horizontal" justify="center">
                    <Box surface="sunken" padding={2}>center</Box>
                    <Box surface="sunken" padding={2}>center</Box>
                  </Stack>
                  <Stack direction="horizontal" justify="end">
                    <Box surface="sunken" padding={2}>end</Box>
                    <Box surface="sunken" padding={2}>end</Box>
                  </Stack>
                </Stack>
              ),
              code: `<Stack gap={4}>
  <Stack direction="horizontal" justify="start">
    <Box surface="sunken" padding={2}>start</Box>
    <Box surface="sunken" padding={2}>start</Box>
  </Stack>
  <Stack direction="horizontal" justify="center">
    <Box surface="sunken" padding={2}>center</Box>
    <Box surface="sunken" padding={2}>center</Box>
  </Stack>
  {/* "end" follows the reading direction: it flips in right-to-left text. */}
  <Stack direction="horizontal" justify="end">
    <Box surface="sunken" padding={2}>end</Box>
    <Box surface="sunken" padding={2}>end</Box>
  </Stack>
</Stack>`,
            },
            {
              title: 'justify: between',
              when: 'Push the first child to one edge and the last to the other: a title and its actions.',
              explain: [
                '`justify="between"` puts all the spare room between the children, so the first sits at the start and the last at the end.',
                'Pair it with `align="center"` so a short child and a tall child share a middle line.',
              ],
              render: (
                <Stack direction="horizontal" justify="between" align="center">
                  <Text as="span">Invoices</Text>
                  <Button variant="secondary">Export</Button>
                </Stack>
              ),
              code: `// Title at the start, action at the end, middles aligned.
<Stack direction="horizontal" justify="between" align="center">
  <Text as="span">Invoices</Text>
  <Button variant="secondary" onClick={exportInvoices}>Export</Button>
</Stack>`,
            },
          ],
        },
        {
          title: 'Wrapping and small screens',
          kicker: 'Screens can be as narrow as 320 CSS pixels, and users can zoom to 400%. A row must not run off the edge.',
          examples: [
            {
              title: 'A row that wraps',
              when: 'A row of tags, chips or buttons whose count or width you do not control.',
              explain: [
                '`wrap` lets children move to a new line when the row is full. Without it, a long row overflows and the page scrolls sideways.',
                'The gap applies between lines too, so the wrapped rows stay evenly spaced.',
                'Content must reflow at 320px wide without sideways scrolling (WCAG 1.4.10, AA). Use `wrap` on any row that can grow.',
              ],
              frame: 'narrow',
              render: (
                <Stack direction="horizontal" gap={2} wrap>
                  <Box surface="sunken" padding={2}>Design</Box>
                  <Box surface="sunken" padding={2}>Research</Box>
                  <Box surface="sunken" padding={2}>Accessibility</Box>
                  <Box surface="sunken" padding={2}>Code</Box>
                </Stack>
              ),
              code: `// "wrap": when the row is full, the next tag starts a new line.
// The 192px frame around this demo is not part of the code.
<Stack direction="horizontal" gap={2} wrap>
  <Box surface="sunken" padding={2}>Design</Box>
  <Box surface="sunken" padding={2}>Research</Box>
  <Box surface="sunken" padding={2}>Accessibility</Box>
  <Box surface="sunken" padding={2}>Code</Box>
</Stack>`,
            },
            {
              title: 'Buttons on a phone',
              when: 'A dialog footer or form footer with two or three buttons.',
              explain: [
                '`justify="end"` gathers the buttons at the trailing edge. `wrap` lets them stack when the screen is too narrow.',
                'Translated labels are often 30% longer. `wrap` keeps the layout safe in every language.',
                'The main action comes last, so it is the last thing read before the user acts. Show one primary button per region (Hick\'s law, 1952: more choices take longer to pick from).',
              ],
              frame: 'phone',
              render: (
                <Stack direction="horizontal" gap={3} justify="end" wrap>
                  <Button variant="tertiary">Remind me later</Button>
                  <Button variant="secondary">Cancel</Button>
                  <Button>Save changes</Button>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={3} justify="end" wrap>
  <Button variant="tertiary" onClick={remindLater}>Remind me later</Button>
  <Button variant="secondary" onClick={close}>Cancel</Button>
  {/* Only one primary button in the region. */}
  <Button onClick={save}>Save changes</Button>
</Stack>`,
            },
          ],
        },
        {
          title: 'Lists',
          kicker: 'When the items are alike, use a real list. Screen readers then say "list, 3 items".',
          examples: [
            {
              title: 'A bulleted list (ul)',
              when: 'Items with no order: features, tags, links.',
              explain: [
                '`as="ul"` renders a `<ul>`. The stack removes the bullets, the margin and the indent, and keeps the list meaning.',
                'Children must be `<li>` elements. A list with other children is invalid HTML.',
                'Without a real list, a screen reader user hears three loose lines and no count (WCAG 1.3.1, A).',
                'The stack sets `role="list"` itself, because Safari drops the list meaning once the bullets are hidden.',
              ],
              render: (
                <Stack as="ul" gap={2}>
                  <li>Keyboard support</li>
                  <li>Visible focus</li>
                  <li>Readable contrast</li>
                </Stack>
              ),
              code: `// "ul" is a list of items with no order. Children must be <li>.
<Stack as="ul" gap={2}>
  <li>Keyboard support</li>
  <li>Visible focus</li>
  <li>Readable contrast</li>
</Stack>`,
            },
            {
              title: 'A numbered list (ol)',
              when: 'Steps where the order matters.',
              explain: [
                '`as="ol"` renders an ordered list. Assistive technology says "item 2 of 3".',
                'The stack hides the browser numbers. If your design needs visible numbers, draw them in each `<li>`.',
                'Keep the same gap rhythm as other lists so pages feel consistent.',
              ],
              render: (
                <Stack as="ol" gap={2}>
                  <li>Create an account</li>
                  <li>Confirm your email</li>
                  <li>Choose a plan</li>
                </Stack>
              ),
              code: `// "ol": the order is part of the meaning.
<Stack as="ol" gap={2}>
  <li>Create an account</li>
  <li>Confirm your email</li>
  <li>Choose a plan</li>
</Stack>`,
            },
            {
              title: 'A list with a name',
              when: 'The page has several lists and the reader needs to tell them apart.',
              explain: [
                'Other attributes pass through to the element. `aria-label` gives the list a name (an extra label read by screen readers).',
                'Only name a list when the name adds something. The heading above often does the job already.',
              ],
              render: (
                <Stack as="ul" gap={2} aria-label="Included in every plan">
                  <li>Unlimited projects</li>
                  <li>Email support</li>
                </Stack>
              ),
              code: `// aria-label is read aloud: "Included in every plan, list, 2 items".
<Stack as="ul" gap={2} aria-label="Included in every plan">
  <li>Unlimited projects</li>
  <li>Email support</li>
</Stack>`,
            },
          ],
        },
        {
          title: 'Layout recipes',
          kicker: 'Real screens are stacks inside stacks. The rule: small gaps inside a group, big gaps between groups.',
          examples: [
            {
              title: 'Stack in stack: tight inside, loose between',
              when: 'A form or a settings page with several groups.',
              explain: [
                'The outer stack uses `gap={6}` between groups. Each inner stack uses `gap={2}` between its own lines.',
                'The eye reads close things as one group (Gestalt proximity). Two gap sizes are enough to show the structure.',
                'Each stack owns only the space between its own children. Nothing reaches outside, so you can move a group without breaking its neighbours. A margin on the child would not give you that.',
              ],
              render: (
                <Stack gap={6}>
                  <Stack gap={2}>
                    <Text>Name</Text>
                    <Text variant="caption" tone="muted">As shown on your invoices.</Text>
                  </Stack>
                  <Stack gap={2}>
                    <Text>Email</Text>
                    <Text variant="caption" tone="muted">We send receipts here.</Text>
                  </Stack>
                </Stack>
              ),
              code: `// Outer stack: a big gap (24px) separates the two groups.
<Stack gap={6}>
  {/* Inner stack: a small gap (8px) keeps a label with its hint. */}
  <Stack gap={2}>
    <Text>Name</Text>
    <Text variant="caption" tone="muted">As shown on your invoices.</Text>
  </Stack>
  <Stack gap={2}>
    <Text>Email</Text>
    <Text variant="caption" tone="muted">We send receipts here.</Text>
  </Stack>
</Stack>`,
            },
            {
              title: 'A toolbar',
              when: 'A title on one side, controls on the other, all on one line.',
              explain: [
                'The outer row uses `justify="between"` to push the title and the actions apart, and `align="center"` to share a middle line.',
                'The inner row groups the two buttons with a small gap, so they read as one set.',
                '`wrap` lets the whole bar fall into two lines on a phone instead of overflowing (WCAG 1.4.10, AA).',
              ],
              frame: 'phone',
              render: (
                <Stack direction="horizontal" justify="between" align="center" wrap>
                  <Heading level={2}>Team members</Heading>
                  <Stack direction="horizontal" gap={2}>
                    <Button variant="secondary">Import</Button>
                    <Button>Invite</Button>
                  </Stack>
                </Stack>
              ),
              code: `<Stack direction="horizontal" justify="between" align="center" wrap>
  <Heading level={2}>Team members</Heading>
  {/* A nested row keeps the two buttons together as one group. */}
  <Stack direction="horizontal" gap={2}>
    <Button variant="secondary" onClick={importMembers}>Import</Button>
    <Button onClick={invite}>Invite</Button>
  </Stack>
</Stack>`,
            },
            {
              title: 'A panel',
              when: 'A card-like block with a title, text and one action.',
              explain: [
                '`Box` supplies the background (`surface="raised"`) and the space inside (`padding={4}`). The `Stack` spaces the content.',
                'Keep the roles apart: Box is for space around, Stack is for space between.',
                '`align="start"` stops the button from stretching to the full width of the panel. A stretched button looks like a banner.',
              ],
              render: (
                <Box surface="raised" padding={4}>
                  <Stack gap={3} align="start">
                    <Heading level={3}>Storage almost full</Heading>
                    <Text>You have used 9.5 GB of 10 GB. Delete files or upgrade your plan.</Text>
                    <Button>Upgrade plan</Button>
                  </Stack>
                </Box>
              ),
              code: `// Box = the surface and the space inside.
<Box surface="raised" padding={4}>
  {/* Stack = the space between the three items. */}
  {/* align="start": the button keeps its natural width. */}
  <Stack gap={3} align="start">
    <Heading level={3}>Storage almost full</Heading>
    <Text>You have used 9.5 GB of 10 GB. Delete files or upgrade your plan.</Text>
    <Button onClick={upgrade}>Upgrade plan</Button>
  </Stack>
</Box>`,
            },
            {
              title: 'A named section',
              when: 'A region of the page that screen reader users should be able to jump to.',
              explain: [
                '`as="section"` makes the stack a `<section>`. With a name it becomes a landmark (a region that screen readers list for quick jumps).',
                '`aria-labelledby` points at the heading by its `id`, so the heading text is the name. Do not repeat the text in an `aria-label`.',
                'A `<section>` with no name is just a `div`. The name is what creates the landmark (WCAG 1.3.1, A).',
              ],
              render: (
                <Stack as="section" gap={3} aria-labelledby="stack-ex-billing">
                  <Heading level={2} id="stack-ex-billing">Billing</Heading>
                  <Text>Your next invoice is on 1 March.</Text>
                </Stack>
              ),
              code: `// The id links the heading to the section as its name.
<Stack as="section" gap={3} aria-labelledby="billing-title">
  <Heading level={2} id="billing-title">Billing</Heading>
  <Text>Your next invoice is on 1 March.</Text>
</Stack>`,
            },
            {
              title: 'A page',
              when: 'The outline of a whole screen: padding around, big gaps between sections.',
              explain: [
                'A `Box` with `as="main"` is the page body and holds the outer padding. A `Stack` inside spaces the sections.',
                '`gap={8}` (32px) between sections and `gap={3}` inside each one repeat the "tight inside, loose between" rule at page scale.',
                'Use one `main` per page. It is the target of a skip link (WCAG 2.4.1, A).',
              ],
              render: (
                <Box as="main" padding={4}>
                  <Stack gap={8}>
                    <Stack gap={3}>
                      <Heading level={1}>Dashboard</Heading>
                      <Text>Your week at a glance.</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Heading level={2}>Recent activity</Heading>
                      <Text tone="muted">Nothing yet. Activity appears here.</Text>
                    </Stack>
                  </Stack>
                </Box>
              ),
              code: `// Box = the padding around the page. Stack = the space between sections.
<Box as="main" padding={4}>
  <Stack gap={8}>
    <Stack gap={3}>
      <Heading level={1}>Dashboard</Heading>
      <Text>Your week at a glance.</Text>
    </Stack>
    <Stack gap={3}>
      <Heading level={2}>Recent activity</Heading>
      <Text tone="muted">Nothing yet. Activity appears here.</Text>
    </Stack>
  </Stack>
</Box>`,
            },
          ],
        },
      ]}
    />
  ),
};
