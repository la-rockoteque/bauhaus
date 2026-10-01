import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Stack } from '../../primitives/stack/stack';
import { Text } from '../../primitives/text/text';
import { Button } from '../../components/clickables/button/button';
import { Badge } from '../../components/feedback/badge/badge';
import { Card } from '../../components/data-structures/card/card';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { RadiusTiles } from '../../fixtures/specimens/specimens';
import { shapeRules } from './shape.rules';

const meta = { title: 'Foundations/Shape', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Shape"
      layer="Foundation"
      plain="Shape is how round the corners are. Sharp corners feel strict, round ones feel friendly. The library picks one for controls and keeps it."
      precise="Foundation · a radius scale and one semantic token for controls · covers corner radius only."
      usedFor="Buttons, fields and every rounded box."
      tokens={{
        mode: 'defined',
        rows: [
          { name: 'radius.none · sm · md · lg · full', tier: '1', use: '0, 2, 4, 8, 9999 px; full makes a pill or a circle' },
          { name: 'radius.control', tier: '2', use: '{radius.md}; buttons and fields' },
          { name: 'radius.pill', tier: '2', use: '{radius.full}; badge and tag' },
          { name: 'radius.overlay', tier: '2', use: '{radius.lg}; dialog, popover, menu, toast' },
        ],
      }}
      specimens={<RadiusTiles />}
      specs={[
        { label: 'Steps', value: 'five, and three roles' },
        { label: 'Control', value: 'radius.control, one shape for everything the user presses or types into' },
      ]}
      conditions={{
        cells: [],
        reason: 'No user setting changes a radius. The focus ring follows the corner because the outline is drawn on the same box.',
      }}
      dos={[
        { text: 'Read radius.control for anything the user presses or types into.', basis: 'Project decision' },
        { text: 'Use a smaller radius inside than outside on nested boxes.', basis: 'Optical alignment; project decision' },
        { text: 'Keep a visible border on a control whose fill is under 3:1.', basis: 'WCAG 1.4.11 (AA)' },
      ]}
      donts={[
        { text: 'Write border-radius: 6px in a component.', basis: 'Closed scale', rule: 'shape.controls-use-control-radius' },
        { text: 'Use a borderless pale button on a white page.', basis: 'WCAG 1.4.11 (AA)', rule: 'shape.boundary-visible' },
      ]}
      guide="foundations-shape--docs"
      guideName="Shape"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Shape" layer="Foundation" scope={['contrast-ui']} rules={shapeRules} guide="foundations-shape--docs" guideName="Shape" />,
};

/** A plain tile that shows one radius. Inline style with `var(--ds-radius-*)` only, as the stylesheet would write it. */
function Tile({ radius, size = 'var(--ds-space-12)', children }: { radius: string; size?: string; children?: string }) {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        inlineSize: size,
        blockSize: size,
        background: 'var(--ds-surface-raised)',
        border: 'var(--ds-size-border-thin) solid var(--ds-border-strong)',
        borderRadius: `var(${radius})`,
        color: 'var(--ds-text-default)',
        font: 'var(--ds-text-caption-size) var(--ds-text-caption-family)',
      }}
    >
      {children}
    </div>
  );
}

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Shape"
      layer="Foundation"
      imports={`import '@acme/design-system/tokens.css';
import { Button, Badge, Card, Stack, Text } from '@acme/design-system';`}
      intro={[
        'Shape is how round the corners are. A radius of 0 gives a sharp corner; a larger radius gives a softer one.',
        'A token is a named design value. `--ds-radius-control` is a CSS custom property (a variable you read with `var(...)`) that holds `4px` today.',
        'Read the token that names the job, not the size. `radius.control` means "the corner of something you press or type into". If the brand later wants rounder controls, one edit changes every control.',
        'There are two layers. The scale (`none`, `sm`, `md`, `lg`, `full`) holds the sizes. The jobs (`control`, `pill`, `overlay`) point at the scale. Use the jobs first.',
        'The library components already read these tokens. You write a radius only when you build your own surface.',
      ]}
      guide="foundations-shape--docs"
      guideName="Shape"
      groups={[
        {
          title: 'Choose by job',
          kicker: 'Start here. Three job tokens cover almost every case.',
          examples: [
            {
              title: 'Controls: things the user presses or types into',
              when: 'You style your own button, field or toggle.',
              explain: [
                '`radius.control` (4px) is the one corner for every control. Matching corners tell users "these all work the same way".',
                'Write `var(--ds-radius-control)`. Do not write `border-radius: 6px`: it is off the scale, and your control stops matching the rest (rule `shape.controls-use-control-radius`).',
                'The library `Button` already uses this token, so the sample below needs no radius code.',
              ],
              render: (
                <Stack direction="horizontal" gap={3} align="center" wrap>
                  <Button>Save changes</Button>
                  <Tile radius="--ds-radius-control" size="var(--ds-size-control-lg)" />
                </Stack>
              ),
              lang: 'css',
              code: `.search-trigger {
  /* The same corner as every Button and field. */
  border-radius: var(--ds-radius-control);
  border: var(--ds-size-border-thin) solid var(--ds-border-strong);
}`,
            },
            {
              title: 'Pills: badges and tags',
              when: 'A small label that wraps one short word or a number.',
              explain: [
                '`radius.pill` is fully round at the ends. A short label reads as a tag, not as a button.',
                'It points at `radius.full` (9999px). A radius larger than half the height just means "round the whole end".',
                'The library `Badge` and `Chip` already use it.',
              ],
              render: (
                <Stack direction="horizontal" gap={3} align="center" wrap>
                  <Badge status="success">Paid</Badge>
                  <Badge status="error">Overdue</Badge>
                </Stack>
              ),
              lang: 'css',
              code: `.tag {
  border-radius: var(--ds-radius-pill);
  padding-inline: var(--ds-space-inline-sm);
}`,
            },
            {
              title: 'Overlays: dialogs, menus, popovers',
              when: 'A surface that floats above the page.',
              explain: [
                '`radius.overlay` (8px) is larger than the control radius. A bigger surface looks right with a bigger corner.',
                'It also tells the eye "this layer sits above the page".',
                'The library `Modal`, `Popover` and `Menu` use it. The modal drops it to `radius.none` on a phone, where the panel fills the screen.',
              ],
              render: <Tile radius="--ds-radius-overlay" size="var(--ds-size-overlay-sm)">Overlay</Tile>,
              lang: 'css',
              code: `.floating-panel {
  background: var(--ds-surface-raised);
  border: var(--ds-size-border-thin) solid var(--ds-border-default);
  border-radius: var(--ds-radius-overlay);
}

/* A panel that fills a phone screen has no corners to round. */
@media (max-width: 768px) { /* --ds-breakpoint-md */
  .floating-panel {
    border-radius: var(--ds-radius-none);
  }
}`,
            },
          ],
        },
        {
          title: 'The scale',
          kicker: 'Five fixed sizes. The scale is closed: no step exists between them.',
          examples: [
            {
              title: 'All five steps',
              when: 'You need a radius that no job token names, such as the corner of a checkbox.',
              explain: [
                '`none` 0px, `sm` 2px, `md` 4px, `lg` 8px, `full` 9999px. Pick the step closest to the surfaces around it.',
                'Small things take small corners: a checkbox uses `sm`. A card uses `md`.',
                'Use a job token when one exists. Use a scale step only when none fits.',
              ],
              render: (
                <Stack direction="horizontal" gap={3} wrap>
                  <Tile radius="--ds-radius-none">none</Tile>
                  <Tile radius="--ds-radius-sm">sm</Tile>
                  <Tile radius="--ds-radius-md">md</Tile>
                  <Tile radius="--ds-radius-lg">lg</Tile>
                  <Tile radius="--ds-radius-full">full</Tile>
                </Stack>
              ),
              lang: 'css',
              code: `.tile--none { border-radius: var(--ds-radius-none); } /* 0px: a table edge, a full-bleed image */
.tile--sm   { border-radius: var(--ds-radius-sm); }   /* 2px: a checkbox, a tiny chip */
.tile--md   { border-radius: var(--ds-radius-md); }   /* 4px: a card, a table frame */
.tile--lg   { border-radius: var(--ds-radius-lg); }   /* 8px: a large panel */
.tile--full { border-radius: var(--ds-radius-full); } /* 9999px: a circle on a square, a pill on a bar */`,
            },
            {
              title: 'A circle',
              when: 'An avatar or a round icon button.',
              explain: [
                '`radius.full` on a square element draws a circle. The element must be square: give it the same width and height from the size scale.',
                'On a rectangle it draws a pill. The browser caps the radius at half of the shorter side.',
              ],
              render: <Tile radius="--ds-radius-full" size="var(--ds-size-control-lg)">AB</Tile>,
              lang: 'css',
              code: `.avatar {
  inline-size: var(--ds-size-control-lg); /* 40px wide ... */
  block-size: var(--ds-size-control-lg);  /* ... and 40px tall: a square */
  border-radius: var(--ds-radius-full);   /* a square with full radius is a circle */
}`,
            },
            {
              title: 'Library components that read the scale',
              when: 'You compose library parts and want to know what they already do.',
              explain: [
                '`Card` reads `radius.md` and `Checkbox` reads `radius.sm`. You write no corner code for them.',
                'Do not override a library radius with `style`. Ask for a new token instead, so every instance changes together.',
              ],
              render: (
                <Card title="Order 1042" headingLevel={3}>
                  <Text as="p">Shipped on 12 March.</Text>
                </Card>
              ),
              code: `// The card already has its corner. Your code writes none.
<Card title="Order 1042" headingLevel={3}>
  <Text as="p">Shipped on 12 March.</Text>
</Card>`,
            },
          ],
        },
        {
          title: 'Details that look right',
          kicker: 'Three habits that keep corners tidy.',
          examples: [
            {
              title: 'Nested boxes: smaller inside',
              when: 'A rounded box sits inside another rounded box.',
              explain: [
                'The inner radius is smaller than the outer one. The gap between the two curves then looks even all round (optical alignment).',
                'Here the outer box uses `radius.lg` (8px) and the inner one uses `radius.md` (4px). If both used 8px, the gap would look thicker at the corners.',
                'Rule of thumb: inner radius = outer radius minus the padding between them. Here 8px minus 4px is 4px, which is `radius.md`.',
              ],
              render: (
                <div
                  style={{
                    padding: 'var(--ds-space-1)',
                    background: 'var(--ds-surface-sunken)',
                    border: 'var(--ds-size-border-thin) solid var(--ds-border-default)',
                    borderRadius: 'var(--ds-radius-lg)',
                    inlineSize: 'var(--ds-size-overlay-sm)',
                  }}
                >
                  <div
                    style={{
                      padding: 'var(--ds-space-inset-md)',
                      background: 'var(--ds-surface-raised)',
                      border: 'var(--ds-size-border-thin) solid var(--ds-border-default)',
                      borderRadius: 'var(--ds-radius-md)',
                    }}
                  >
                    Inner box
                  </div>
                </div>
              ),
              lang: 'css',
              code: `.well {
  padding: var(--ds-space-1);               /* 4px of air between the two curves */
  border-radius: var(--ds-radius-lg);        /* outer: 8px */
}

.well__item {
  border-radius: var(--ds-radius-md);        /* inner: 4px = 8px outer minus 4px padding */
}`,
            },
            {
              title: 'Round only some corners',
              when: 'A tab or a drawer touches one edge of the layout.',
              explain: [
                'Use the logical properties `border-start-start-radius` and `border-start-end-radius`. "Start" and "end" follow the reading direction.',
                'In a right-to-left language the corners swap with no extra code. `border-top-left-radius` would stay on the left.',
              ],
              render: (
                <div
                  style={{
                    display: 'inline-block',
                    padding: 'var(--ds-space-inline-md)',
                    background: 'var(--ds-surface-raised)',
                    border: 'var(--ds-size-border-thin) solid var(--ds-border-default)',
                    borderStartStartRadius: 'var(--ds-radius-control)',
                    borderStartEndRadius: 'var(--ds-radius-control)',
                  }}
                >
                  Details
                </div>
              ),
              lang: 'css',
              code: `.tab {
  /* The two top corners, in either reading direction. */
  border-start-start-radius: var(--ds-radius-control);
  border-start-end-radius: var(--ds-radius-control);
  /* The bottom corners stay square: the tab joins its panel. */
}`,
            },
            {
              title: 'Keep a visible edge',
              when: 'A control has a pale fill on a pale page.',
              explain: [
                'A radius is not a border. A rounded pale button on a white page still has no edge to find.',
                'Keep a border on any control whose fill is under 3:1 against its surroundings. Low-vision users need to see where the control ends (WCAG 1.4.11 Non-text Contrast, AA; rule `shape.boundary-visible`).',
                '`border.strong` is built to pass that ratio in both themes.',
              ],
              render: (
                <div
                  style={{
                    display: 'inline-block',
                    padding: 'var(--ds-space-inline-md)',
                    background: 'var(--ds-surface-default)',
                    border: 'var(--ds-size-border-thin) solid var(--ds-border-strong)',
                    borderRadius: 'var(--ds-radius-control)',
                  }}
                >
                  Cancel
                </div>
              ),
              lang: 'css',
              code: `.ghost-button {
  background: var(--ds-surface-default);
  /* The edge carries the contrast; the radius only softens it. */
  border: var(--ds-size-border-thin) solid var(--ds-border-strong);
  border-radius: var(--ds-radius-control);
}`,
            },
            {
              title: 'The focus ring follows the corner',
              when: 'You wonder whether a rounded control needs a separate focus shape.',
              explain: [
                'It does not. The ring is an outline drawn on the same box, so it follows the corner.',
                'Set `border-radius` once. Keep the library focus ring (`focus.ring.*`): the keyboard user then sees where they are (WCAG 2.4.7, AA).',
              ],
              render: (
                <Button variant="secondary">Tab here to see the ring</Button>
              ),
              lang: 'css',
              code: `.search-trigger {
  border-radius: var(--ds-radius-control);
}

.search-trigger:focus-visible {
  /* The outline bends with the border-radius above. No extra shape needed. */
  outline: var(--ds-focus-ring-width) solid var(--ds-focus-ring-color);
  outline-offset: var(--ds-focus-ring-offset);
}`,
            },
          ],
        },
      ]}
    />
  ),
};
