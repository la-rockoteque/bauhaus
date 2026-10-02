import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Box } from '../../primitives/box/box';
import type { Space } from '../../primitives/box/box';
import { Stack } from '../../primitives/stack/stack';
import { Text } from '../../primitives/text/text';
import { Heading } from '../../primitives/heading/heading';
import { Button } from '../../components/clickables/button/button';
import { TextField } from '../../components/fields/text-field/text-field';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { SpacingScale } from '../../fixtures/specimens/specimens';
import { spacingRules } from './spacing.rules';

const meta = { title: 'Foundations/Spacing', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const Groups = () => (
  <div style={{ display: 'grid', gap: 'var(--ds-space-stack-lg)' }}>
    {['Shipping', 'Billing'].map((title) => (
      <div key={title} style={{ display: 'grid', gap: 'var(--ds-space-stack-sm)' }}>
        <strong>{title}</strong>
        <span>Street</span>
        <span>City</span>
      </div>
    ))}
  </div>
);

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Spacing"
      layer="Foundation"
      plain="Spacing is the air between things. Close things read as one group. Far things read as separate. One fixed set of gaps keeps every screen in the same rhythm."
      precise="Foundation · a closed scale of 13 steps on a 4px grid, plus semantic gap tokens · governs margin, padding and gap. It is not a layout grid and not a control size."
      usedFor="Between and inside every block."
      tokens={{
        mode: 'defined',
        note: 'CSS names: --ds-space-4, --ds-space-stack-md, --ds-size-target-min, --ds-size-control-md.',
        rows: [
          { name: 'space.0 … space.12', tier: '1', use: 'The scale. Step n is n × 4px.' },
          { name: 'space.inset.xs … xl', tier: '2', use: 'Padding inside a container' },
          { name: 'space.stack.xs … xl', tier: '2', use: 'Vertical gap between siblings' },
          { name: 'space.inline.xs … xl', tier: '2', use: 'Horizontal gap between siblings' },
          { name: 'space.control.inline · space.control.gap', tier: '2', use: 'Horizontal padding inside a field; gap between a control icon and its label' },
          { name: 'space.field.gap · space.group.gap', tier: '2', use: 'Gap between label, hint, control and message of one field; gap between the fields of a group' },
          { name: 'size.target.min', tier: '2', use: '24px; the smallest pointer target (WCAG 2.5.8, AA). Spacing must not shrink it.' },
          { name: 'size.control.sm · md · lg', tier: '2', use: 'Heights of buttons and fields: 24, 32, 40 px. md is the default. Never below the target floor' },
          { name: 'size.icon.sm · md · lg', tier: '2', use: 'Side of an icon box: 12, 16, 20 px' },
          { name: 'size.border.thin · thick', tier: '2', use: 'Border widths: 1px hairline, and the focus ring width for emphasis' },
          { name: 'breakpoint.sm · md · lg', tier: '2', use: 'Viewport widths where the layout changes: 640, 768, 1024 px. A media query cannot read a custom property, so a stylesheet writes the same number and spacing.breakpoints-match holds them equal' },
          { name: 'size.overlay.sm · md · lg', tier: '2', use: 'Maximum inline size of a floating surface: 20, 30, 40 rem' },
        ],
      }}
      specimens={<SpacingScale />}
      specs={[
        { label: 'Base unit', value: '4px; every step is a multiple of it' },
        { label: 'Steps', value: 'space.0 to space.12; closed, no step between space.4 and space.5' },
        { label: 'Tier 2', value: 'Names the job: inset, stack, inline. A component reads tier 2.' },
      ]}
      conditions={{
        cells: [
          { label: 'Text spacing raised by the user', render: <Groups />, trigger: 'gaps in tokens', note: 'No container around text has a fixed height, so nothing clips.' },
        ],
      }}
      dos={[
        { text: 'Make the gap inside a group smaller than the gap between groups.', basis: 'Wertheimer 1923' },
        { text: 'Set the gap on the parent with gap, not as child margins.', basis: 'Project decision' },
        { text: 'Keep one column and no second scroll axis at 320 CSS px.', basis: 'WCAG 1.4.10 (AA)' },
      ]}
      donts={[
        { text: 'Write margin: 18px at a call site.', basis: 'Closed scale; misfile.raw-value-in-component', rule: 'spacing.no-literal' },
        { text: 'Use the same gap between and inside groups.', basis: 'Wertheimer 1923', rule: 'spacing.groups-distinct' },
        { text: 'Fix the height of a card that holds text.', basis: 'WCAG 1.4.12 (AA)', rule: 'spacing.text-spacing-safe' },
        { text: 'Add a step "just this once".', basis: 'Closed scale', rule: 'spacing.scale-closed' },
        { text: 'Shrink a target below size.target.min to save room.', basis: 'WCAG 2.5.8 (AA); house floor 24px', rule: 'spacing.target-min' },
      ]}
      guide="foundations-spacing--docs"
      guideName="Spacing"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Spacing" layer="Foundation" scope={['target-size', 'reflow', 'text-spacing']} rules={spacingRules} guide="foundations-spacing--docs" guideName="Spacing" />,
};

/** A coloured block as wide as one space step. It draws what `inline-size: var(--ds-space-N)` gives. */
function Bar({ step }: { step: Space }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)' }}>
      <div style={{ inlineSize: `var(--ds-space-${step})`, blockSize: 'var(--ds-space-4)', background: 'var(--ds-action-primary)' }} />
      <span style={{ font: 'var(--ds-text-caption-size) var(--ds-text-caption-family)', color: 'var(--ds-text-muted)' }}>{`space.${step}`}</span>
    </div>
  );
}

/** A dashed box that shows the padding of a stylesheet rule. */
function Padded({ padding, children }: { padding: string; children: string }) {
  return (
    <div style={{ background: 'var(--ds-surface-sunken)', inlineSize: 'fit-content' }}>
      <div style={{ padding: `var(${padding})`, background: 'var(--ds-surface-raised)', outline: 'var(--ds-size-border-thin) dashed var(--ds-border-strong)' }}>{children}</div>
    </div>
  );
}

const GROUP_ITEMS = ['Street', 'City'] as const;

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Spacing"
      layer="Foundation"
      imports={`import '@bauhaus/design-system/tokens.css';
import { Box, Stack, Text, Heading, Button, TextField } from '@bauhaus/design-system';`}
      intro={[
        'Spacing is the air between things: padding (inside a box), gap (between children) and margin (outside a box). Close things read as one group. Far things read as separate groups.',
        'A token is a named design value. `space.4` is `16px`. In CSS it is the custom property `--ds-space-4` (a variable you read with `var(...)`). Never type `16px` by hand.',
        'The scale has 13 steps on a 4px grid: `space.0` is 0, `space.1` is 4px, `space.2` is 8px, and so on up to `space.12` at 48px. Every size is a multiple of 4, so edges line up across components. The scale is closed: there is no step between two numbers.',
        'Named gaps sit on top of the scale: `inset` (padding), `stack` (vertical gap) and `inline` (horizontal gap), each in `xs`, `sm`, `md`, `lg`, `xl`. Prefer the named gap in CSS. It says what the space is for.',
        '`Box` and `Stack` take the step number as a prop (`gap={3}` is `space.3`). They are the fastest way to lay out a page without writing CSS.',
        'The parent owns the gap. Put `gap` on the container, not margin on each child. Then two stacks placed side by side never add up to a double gap.',
      ]}
      guide="foundations-spacing--docs"
      guideName="Spacing"
      groups={[
        {
          title: 'Layout with Stack and Box',
          kicker: 'Start here. Most pages need no spacing CSS at all.',
          examples: [
            {
              title: 'Stack a form',
              when: 'Children sit one under another.',
              explain: [
                '`Stack` is a flex column by default. `gap={4}` puts `space.4` (16px) between each child.',
                'Labels and fields from `TextField` already keep their own small inner gap. You only space the fields from each other.',
                'The default `gap` is already `4`. Write it anyway when it is a design choice, so a reader sees you chose it.',
              ],
              render: (
                <Stack gap={4}>
                  <TextField label="First name" />
                  <TextField label="Last name" />
                  <Button>Save changes</Button>
                </Stack>
              ),
              code: `<Stack gap={4}>
  <TextField label="First name" />
  <TextField label="Last name" />
  {/* A Button in a vertical stack stretches to full width. See "align" below to stop that. */}
  <Button onClick={save}>Save changes</Button>
</Stack>`,
            },
            {
              title: 'Put items in a row',
              when: 'Buttons or tags sit side by side.',
              explain: [
                '`direction="horizontal"` turns the stack into a row.',
                '`wrap` lets the row flow onto a new line on a narrow screen. Without it, the items would shrink or overflow. The page must work at 320 px without a sideways scroll (WCAG 1.4.10 Reflow, AA).',
                '`gap={3}` is 12px, a common space between buttons.',
              ],
              frame: 'narrow',
              render: (
                <Stack direction="horizontal" gap={3} wrap>
                  <Button>Publish</Button>
                  <Button variant="secondary">Save draft</Button>
                  <Button variant="tertiary">Discard</Button>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={3} wrap>
  <Button onClick={publish}>Publish</Button>
  <Button variant="secondary" onClick={saveDraft}>Save draft</Button>
  <Button variant="tertiary" onClick={discard}>Discard</Button>
</Stack>`,
            },
            {
              title: 'Align and distribute',
              when: 'A row needs its content at the start, centre, end or spread apart.',
              explain: [
                '`justify` places items along the main axis (the row): `start`, `center`, `end` or `between`. `between` pushes the first item to one end and the last to the other.',
                '`align` places items on the cross axis (up and down in a row): `start`, `center`, `end`, `stretch` or `baseline`. `baseline` lines up the text of different sizes.',
                'These names follow the reading direction. In a right-to-left language `start` is on the right, with no code from you.',
              ],
              render: (
                <Stack direction="horizontal" gap={3} justify="between" align="center">
                  <Heading level={3}>Billing</Heading>
                  <Button variant="secondary">Edit</Button>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={3} justify="between" align="center">
  {/* The title goes to the start; the action goes to the end. */}
  <Heading level={3}>Billing</Heading>
  <Button variant="secondary" onClick={edit}>Edit</Button>
</Stack>`,
            },
            {
              title: 'Keep a button its natural width',
              when: 'A button in a column should not stretch to the full width.',
              explain: [
                'A vertical `Stack` uses `align="stretch"` by default, so each child fills the width.',
                '`align="start"` keeps each child at its natural width, at the start edge. Use it for a lone button below a paragraph.',
              ],
              render: (
                <Stack gap={3} align="start">
                  <Text as="p">Your changes are ready to save.</Text>
                  <Button>Save changes</Button>
                </Stack>
              ),
              code: `<Stack gap={3} align="start">
  <Text as="p">Your changes are ready to save.</Text>
  <Button onClick={save}>Save changes</Button>
</Stack>`,
            },
            {
              title: 'Closer inside a group, farther between groups',
              when: 'A page region holds several groups of related items.',
              explain: [
                'Nest a `Stack`. The outer one has the large gap (`gap={6}`, 24px) and each group has the small one (`gap={1}`, 4px).',
                'Items that sit close together look related (Gestalt proximity, Wertheimer 1923). If the gap inside a group equals the gap between groups, the groups blur together (rule `spacing.groups-distinct`).',
              ],
              render: (
                <Stack gap={6}>
                  {['Shipping', 'Billing'].map((title) => (
                    <Stack key={title} gap={1}>
                      <Text as="strong">{title}</Text>
                      {GROUP_ITEMS.map((item) => (
                        <Text key={item} as="span">{item}</Text>
                      ))}
                    </Stack>
                  ))}
                </Stack>
              ),
              code: `{/* Outer stack: the big gap between groups. */}
<Stack gap={6}>
  <Stack gap={1}>
    {/* Inner stack: the small gap inside a group. */}
    <Text as="strong">Shipping</Text>
    <Text as="span">Street</Text>
    <Text as="span">City</Text>
  </Stack>
  <Stack gap={1}>
    <Text as="strong">Billing</Text>
    <Text as="span">Street</Text>
    <Text as="span">City</Text>
  </Stack>
</Stack>`,
            },
            {
              title: 'Space a list',
              when: 'The items are a real list: steps, results, links.',
              explain: [
                '`as="ul"` renders a `<ul>`. The stack removes the bullets and the left indent, and keeps the list role, so a screen reader still announces "list, 3 items".',
                'Children must be `li`. A list that is only divs gives no count to assistive technology (WCAG 1.3.1 Info and Relationships, A).',
              ],
              render: (
                <Stack as="ul" gap={2}>
                  <li>Create the account</li>
                  <li>Verify the email</li>
                  <li>Choose a plan</li>
                </Stack>
              ),
              code: `<Stack as="ul" gap={2}>
  <li>Create the account</li>
  <li>Verify the email</li>
  <li>Choose a plan</li>
</Stack>`,
            },
            {
              title: 'Pad a surface with Box',
              when: 'A region needs air inside its edge and a background.',
              explain: [
                '`padding={4}` is `space.4` on all four sides. `surface="raised"` gives a background that lifts the box off the page; `sunken` gives one that sinks into it; `default` is the page.',
                'A Box adds no role. Pick the element with `as` for the document structure: `section`, `aside`, `li`.',
                'Surfaces are colour roles, so they follow the light and dark themes for you.',
              ],
              render: (
                <Box padding={4} surface="raised" as="section" aria-label="Summary">
                  <Text as="p">Your plan renews on 1 June.</Text>
                </Box>
              ),
              code: `{/* aria-label names the region for screen reader users who list landmarks. */}
<Box as="section" aria-label="Summary" padding={4} surface="raised">
  <Text as="p">Your plan renews on 1 June.</Text>
</Box>`,
            },
            {
              title: 'Different padding on each axis',
              when: 'A strip needs more air along its length than across it.',
              explain: [
                '`paddingInline` is the left and right padding in a left-to-right language; `paddingBlock` is the top and bottom. They win over `padding`.',
                'Use the logical names so that the layout still works in a vertical or right-to-left writing mode.',
                'A button-like strip has `paddingBlock` smaller than `paddingInline`: the label sits centred in the height of the control.',
              ],
              render: (
                <Box paddingInline={4} paddingBlock={2} surface="sunken">
                  <Text as="span">Filter: all open orders</Text>
                </Box>
              ),
              code: `<Box paddingInline={4} paddingBlock={2} surface="sunken">
  <Text as="span">Filter: all open orders</Text>
</Box>`,
            },
            {
              title: 'A grid with gaps',
              when: 'Items sit in rows and columns.',
              explain: [
                '`gap` on a `Box` works only with `display="flex"` or `display="grid"`. On a block, it does nothing.',
                'A `Box` sets the gap, not the grid columns. Add the column rule in your own class (`grid-template-columns`) and keep the gap on the Box.',
              ],
              render: (
                <Box display="grid" gap={3}>
                  <Text as="span">Name</Text>
                  <Text as="span">Email</Text>
                </Box>
              ),
              code: `{/* The Box owns the gap. Your CSS class owns the columns. */}
<Box display="grid" gap={3} className="two-columns">
  <Text as="span">Name</Text>
  <Text as="span">Email</Text>
</Box>`,
            },
          ],
        },
        {
          title: 'Spacing in a stylesheet',
          kicker: 'For your own CSS. Choose the token by the job of the space.',
          examples: [
            {
              title: 'The tokens, by job',
              when: 'You need to find the right name.',
              explain: [
                '`inset` is padding inside a box. `stack` is the vertical gap between blocks. `inline` is the horizontal gap between side-by-side items.',
                'All three run `xs` 4, `sm` 8, `md` 12, `lg` 16, `xl` 24 px. The `md` step is the default density, which is compact.',
                'Three ready-made gaps exist for forms: `control-gap` between an icon and a label, `field-gap` between a label and its input, and `group-gap` between related fields.',
              ],
              lang: 'css',
              code: `:root {
  /* Padding inside a box. */
  --ds-space-inset-xs: 4px;  --ds-space-inset-sm: 8px;  --ds-space-inset-md: 12px;
  --ds-space-inset-lg: 16px; --ds-space-inset-xl: 24px;

  /* Vertical gap between blocks. */
  --ds-space-stack-xs: 4px;  --ds-space-stack-sm: 8px;  --ds-space-stack-md: 12px;
  --ds-space-stack-lg: 16px; --ds-space-stack-xl: 24px;

  /* Horizontal gap between side-by-side items. */
  --ds-space-inline-xs: 4px; --ds-space-inline-sm: 8px; --ds-space-inline-md: 12px;
  --ds-space-inline-lg: 16px; --ds-space-inline-xl: 24px;

  /* Form gaps. */
  --ds-space-control-gap: 8px;  /* icon to label inside a control */
  --ds-space-field-gap: 4px;    /* label to input */
  --ds-space-group-gap: 12px;   /* between related fields */
}`,
            },
            {
              title: 'Padding on a card',
              when: 'You style your own surface.',
              explain: [
                'Read an `inset` token. It says "padding" in its name, so a reader knows what the line does.',
                'Use the same inset on every card. Matching padding makes surfaces look related.',
              ],
              render: <Padded padding="--ds-space-inset-lg">Card content</Padded>,
              lang: 'css',
              code: `.summary-card {
  /* 16px inside the edge on every side. */
  padding: var(--ds-space-inset-lg);
}`,
            },
            {
              title: 'Gap on the parent, never margin on the child',
              when: 'Several children need space between them.',
              explain: [
                'Set `gap` on the container. Each child stays free of margin, so you can move or remove one without breaking the others.',
                'A margin on each child also adds a gap before the first and after the last, and two adjacent margins can collapse in a way that surprises you.',
                '`display: grid` or `display: flex` is required for `gap`. A plain block ignores it.',
              ],
              lang: 'css',
              code: `.section-list {
  display: grid;
  gap: var(--ds-space-stack-lg); /* 16px between blocks */
}

/* Do not add 'margin-bottom' to .section-list > *. The parent owns the gap. */`,
            },
            {
              title: 'Row of side-by-side items',
              when: 'A toolbar or a row of tags in your own CSS.',
              explain: [
                '`inline` tokens are for horizontal gaps. The `-inline` part also reminds you that the axis flips in a right-to-left language.',
                '`flex-wrap: wrap` lets items drop to a new line instead of overflowing on a narrow screen (WCAG 1.4.10 Reflow, AA).',
              ],
              lang: 'css',
              code: `.toolbar {
  display: flex;
  flex-wrap: wrap;                 /* never force a sideways scroll */
  gap: var(--ds-space-inline-sm);  /* 8px */
  align-items: center;
}`,
            },
            {
              title: 'A step from the raw scale',
              when: 'No named gap fits, for example the size of a decorative box.',
              explain: [
                'Use `--ds-space-N` when the value is a size, not a gap or a padding. Pick the nearest step.',
                'Do not invent a value such as `18px`. It is off the scale and the screens drift apart (rule `spacing.no-literal`).',
              ],
              render: (
                <Stack gap={2}>
                  <Bar step={2} />
                  <Bar step={4} />
                  <Bar step={8} />
                </Stack>
              ),
              lang: 'css',
              code: `.status-dot {
  inline-size: var(--ds-space-2);  /* 8px */
  block-size: var(--ds-space-2);
  border-radius: var(--ds-radius-full);
}

.illustration {
  inline-size: var(--ds-space-12); /* 48px, the largest step */
}`,
            },
          ],
        },
        {
          title: 'Sizes of controls and targets',
          kicker: 'Space is not size. A control has its own scale.',
          examples: [
            {
              title: 'Control height',
              when: 'You build a custom control that sits beside library controls.',
              explain: [
                '`size.control.md` (32px) is the default height. `sm` is 24px and `lg` is 40px.',
                'Set `min-block-size`, not `block-size`. If the user enlarges the text, the control grows with it.',
                'A button has `padding-block: 0` and centres the label in this height. Do not add vertical padding on top.',
              ],
              render: (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    minBlockSize: 'var(--ds-size-control-md)',
                    paddingInline: 'var(--ds-space-inline-md)',
                    border: 'var(--ds-size-border-thin) solid var(--ds-border-strong)',
                    borderRadius: 'var(--ds-radius-control)',
                  }}
                >
                  Custom control
                </div>
              ),
              lang: 'css',
              code: `.custom-control {
  display: inline-flex;
  align-items: center;                       /* centres the label in the height */
  min-block-size: var(--ds-size-control-md); /* 32px, and it may grow */
  padding-inline: var(--ds-space-inline-md); /* 12px each side; no padding-block */
}`,
            },
            {
              title: 'Minimum target size',
              when: 'You make a small clickable thing, such as an icon button.',
              explain: [
                'A fingertip or a mouse pointer needs room. Every target is at least `size.target.min` (24px) wide and high (WCAG 2.5.8 Target Size Minimum, AA).',
                'Keep a gap beside a small target so that a 24px circle on each neighbour does not touch another.',
              ],
              lang: 'css',
              code: `.icon-action {
  min-inline-size: var(--ds-size-target-min); /* 24px */
  min-block-size: var(--ds-size-target-min);
  margin-inline-end: var(--ds-space-inline-sm); /* room before the next target */
}`,
            },
          ],
        },
        {
          title: 'Spacing and the user',
          kicker: 'The conditions your layout must survive: small screens, big text, spaced-out text.',
          examples: [
            {
              title: 'Breakpoints',
              when: 'Your layout changes at a screen width.',
              explain: [
                'There are three: `sm` 640px, `md` 768px, `lg` 1024px. A media query cannot read a custom property, so you write the same number in the query.',
                'Write one of those three numbers and no other. The rule `spacing.breakpoints-match` fails on a width that equals none of them.',
                'Design for the narrow screen first. Add wider layouts inside `min-width` queries.',
              ],
              lang: 'css',
              code: `/* The numbers match --ds-breakpoint-md (768px). Change both together. */
.page {
  display: grid;
  gap: var(--ds-space-stack-lg);
}

@media (min-width: 768px) {
  .page {
    grid-template-columns: 1fr 2fr; /* two columns only once there is room */
  }
}`,
            },
            {
              title: 'A phone layout without a sideways scroll',
              when: 'Your page runs at 320 CSS pixels.',
              explain: [
                'Content must reflow to one column at 320px with no second scroll axis (WCAG 1.4.10 Reflow, AA). People who zoom to 400% get the same width.',
                'Use `wrap` on rows and avoid fixed widths. The sample below is drawn at 320px.',
              ],
              frame: 'phone',
              render: (
                <Stack gap={4}>
                  <Stack direction="horizontal" gap={3} wrap>
                    <Button>Save changes</Button>
                    <Button variant="secondary">Cancel and go back</Button>
                  </Stack>
                  <TextField label="Email address" type="email" />
                </Stack>
              ),
              code: `<Stack gap={4}>
  {/* wrap: the second button drops to a new line if the first fills the row. */}
  <Stack direction="horizontal" gap={3} wrap>
    <Button onClick={save}>Save changes</Button>
    <Button variant="secondary" onClick={cancel}>Cancel and go back</Button>
  </Stack>
  <TextField label="Email address" type="email" />
</Stack>`,
            },
            {
              title: 'Text that grows',
              when: 'A box holds text.',
              explain: [
                'Do not fix the height of a box that holds text. Some users set line height 1.5, paragraph spacing 2x the font size and wider letters. A fixed box clips the words (WCAG 1.4.12 Text Spacing, AA; rule `spacing.text-spacing-safe`).',
                '`min-block-size` sets a floor and lets the box grow. Padding is a token, so it stays in proportion.',
                'The sample uses a narrow frame to show the text wrapping over several lines without clipping.',
              ],
              frame: 'narrow',
              render: (
                <Box padding={3} surface="raised">
                  <Text as="p">Your order ships in two parcels because one item is out of stock.</Text>
                </Box>
              ),
              lang: 'css',
              code: `.notice {
  padding: var(--ds-space-inset-md);
  min-block-size: var(--ds-size-control-md); /* a floor, never a fixed height */
  /* No 'height' and no 'overflow: hidden': both clip text that grows. */
}`,
            },
            {
              title: 'Density',
              when: 'You ask whether to shrink spacing for a dense screen.',
              explain: [
                'The library ships one density, and it is compact: a control is 32px high and the `md` step is 12px.',
                'A denser page never shrinks a target below 24px. Choose a smaller step for the gap, not a smaller target.',
              ],
              render: (
                <Stack direction="horizontal" gap={2} align="center" wrap>
                  <Button>Save</Button>
                  <Button variant="secondary">Cancel</Button>
                </Stack>
              ),
              code: `{/* Compact is the only density: no 'density' prop to set. */}
<Stack direction="horizontal" gap={2} wrap>
  <Button onClick={save}>Save</Button>
  <Button variant="secondary" onClick={cancel}>Cancel</Button>
</Stack>`,
            },
          ],
        },
      ]}
    />
  ),
};
