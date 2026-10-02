import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Box } from '../box/box';
import { Heading } from '../heading/heading';
import { Stack } from '../stack/stack';
import { Text } from '../text/text';
import { Divider } from './divider';
import { dividerRules } from './divider.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Primitives/Divider', component: Divider, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Divider>;

export default meta;

const notInteractive = 'A Divider is not interactive.';
const noData = 'A Divider holds no data.';

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Divider"
      layer="Primitive"
      plain="A divider is a thin line that separates two groups of content. It can run across the page or, between items in a row, up and down."
      precise="Primitive component · a native hr · horizontal or vertical · either a separator that assistive technology announces or decoration that it skips."
      usedFor="Between groups in menus, cards and lists; between items of a toolbar."
      tokens={{
        mode: 'consumed',
        note: 'The divider has no component tokens.',
        rows: [
          { name: 'border.default', tier: 'role', use: 'The line colour', swatch: '--ds-border-default' },
          { name: 'size.border.thin', tier: '2', use: 'The line thickness' },
        ],
      }}
      stage={{
        render: (args) => (
          <div style={{ inlineSize: 'calc(var(--ds-space-12) * 5)' }}>
            <Divider decorative={args.decorative === true} />
          </div>
        ),
        parts: [
          { n: 1, label: 'Line', note: 'a native hr', target: '.ds-divider' },
          { n: 2, label: 'Role', note: 'separator, or none when decorative', target: '.ds-divider', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Element', value: 'hr' },
        { label: 'Thickness', property: 'height', target: '.ds-divider', token: 'size.border.thin' },
        { label: 'Vertical', value: 'Stretches to the height of its row' },
        { label: 'Margin', value: '0; spacing belongs to the parent' },
      ]}
      api={[
        { label: 'orientation', value: '"horizontal" | "vertical", default "horizontal".' },
        { label: 'decorative', value: 'Hide the line from assistive technology. Default false: the line marks a change of topic.', control: { kind: 'boolean', value: false } },
        { label: '…props', value: 'Every native hr attribute.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: noData },
          { id: 'loading', status: 'n/a', reason: 'A Divider has no loading form.' },
          { id: 'none', status: 'n/a', reason: noData },
          { id: 'one', status: 'n/a', reason: noData },
          {
            id: 'some',
            status: 'designed',
            label: 'Some (vertical, in a row)',
            render: (
              <Stack direction="horizontal" gap={3} align="stretch">
                <Text as="span">Edit</Text>
                <Divider orientation="vertical" />
                <Text as="span">Share</Text>
                <Divider orientation="vertical" />
                <Text as="span">Delete</Text>
              </Stack>
            ),
            trigger: 'orientation="vertical"',
          },
          { id: 'too-many', status: 'n/a', reason: 'A Divider has no content to overflow. It fills the width of its parent.' },
          { id: 'incorrect', status: 'n/a', reason: 'A Divider has no error form.' },
          { id: 'correct', status: 'n/a', reason: notInteractive },
          { id: 'done', status: 'n/a', reason: notInteractive },
          {
            id: 'default',
            status: 'designed',
            label: 'Default (semantic and decorative)',
            render: (
              <Stack gap={3}>
                <Text as="p">Order summary</Text>
                <Divider />
                <Text as="p">Payment</Text>
                <Divider decorative />
                <Text as="p">Confirmation</Text>
              </Stack>
            ),
            trigger: 'decorative',
            note: 'The first line is announced as a separator. The second is skipped.',
          },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      dos={[
        { text: 'Set decorative on a line that only tidies the layout.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Back a change of topic with a heading.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Stretch a vertical divider inside a horizontal Stack.', basis: 'Project decision' },
      ]}
      donts={[
        { text: 'Draw a separator with a div and a border.', basis: 'WCAG 4.1.2 (A)', rule: 'divider.native-element' },
        { text: 'Leave a decorative line announced.', basis: 'WCAG 1.3.1 (A)', rule: 'divider.decorative-hidden' },
        { text: 'Rely on the line alone to mark a new section.', basis: 'WCAG 1.3.1 (A)', rule: 'divider.meaning-not-line-alone' },
        { text: 'Write a colour or a px width for the line.', basis: 'Project decision', rule: 'divider.border-token' },
      ]}
      guide="primitives-divider--docs"
      guideName="Divider"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Divider" layer="Primitive" rules={dividerRules} guide="primitives-divider--docs" guideName="Divider" />,
};

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Divider"
      layer="Primitive"
      imports="import { Divider, Stack, Text, Heading, Box } from '@bauhaus/design-system';"
      intro={[
        'A divider is a thin line between two groups of content. It is an HTML `<hr>`, a "thematic break": a change of topic.',
        'A gap alone often separates groups well enough. Add a divider when the groups look alike and the eye needs a clear stop.',
        'A divider has two kinds. Semantic (the default) is announced by screen readers as a separator. Decorative is hidden from them, because the line only tidies the layout.',
        'A line cannot label a section. A reader who cannot see it learns nothing from it. Put a heading after a semantic divider.',
        'The colour is the quiet border colour of the theme. Do not set a colour or a width yourself.',
      ]}
      guide="primitives-divider--docs"
      guideName="Divider"
      groups={[
        {
          title: 'Horizontal',
          kicker: 'The default direction, between blocks stacked in a column.',
          examples: [
            {
              title: 'Between two sections',
              when: 'The topic changes, and a heading follows.',
              explain: [
                '`<Divider />` is a semantic separator: screen readers announce it.',
                'The heading after the line gives the new topic a name. A line alone says little to non-visual users (WCAG 1.3.1, A).',
                'The `Stack` gap puts equal room above and below the line.',
              ],
              render: (
                <Stack gap={4}>
                  <Text>Your profile is visible to your team.</Text>
                  <Divider />
                  <Heading level={2}>Danger zone</Heading>
                  <Text>Deleting your account cannot be undone.</Text>
                </Stack>
              ),
              code: `<Stack gap={4}>
  <Text>Your profile is visible to your team.</Text>
  {/* A separator that screen readers announce. */}
  <Divider />
  {/* The heading names what comes next. */}
  <Heading level={2}>Danger zone</Heading>
  <Text>Deleting your account cannot be undone.</Text>
</Stack>`,
            },
            {
              title: 'A decorative line',
              when: 'The line only tidies the layout, because text or labels already separate the groups.',
              explain: [
                '`decorative` sets `role="none"`, so screen readers skip the line.',
                'Without it, a user would hear "separator" at every line and wonder what changed (WCAG 1.3.1, A).',
                'Ask yourself: if the line vanished, would the meaning change? If not, make it decorative.',
              ],
              render: (
                <Stack gap={2}>
                  <Text>Rename</Text>
                  <Text>Duplicate</Text>
                  <Divider decorative />
                  <Text>Delete</Text>
                </Stack>
              ),
              code: `<Stack gap={2}>
  <Text>Rename</Text>
  <Text>Duplicate</Text>
  {/* decorative: no announcement, the line is only for sighted users. */}
  <Divider decorative />
  <Text>Delete</Text>
</Stack>`,
            },
            {
              title: 'Inside a card',
              when: 'A card has a body and a footer, and you want a clear break between them.',
              explain: [
                'The `Box` supplies the surface and padding. The `Stack` spaces everything, divider included.',
                'The footer is a part of the same card, so the line is decorative. The card heading already names the topic.',
              ],
              render: (
                <Box surface="raised" padding={4}>
                  <Stack gap={3}>
                    <Heading level={3}>Project Atlas</Heading>
                    <Text>12 tasks open, 3 due this week.</Text>
                    <Divider decorative />
                    <Text variant="caption" tone="muted">Updated 5 minutes ago</Text>
                  </Stack>
                </Box>
              ),
              code: `<Box surface="raised" padding={4}>
  <Stack gap={3}>
    <Heading level={3}>Project Atlas</Heading>
    <Text>12 tasks open, 3 due this week.</Text>
    <Divider decorative />
    <Text variant="caption" tone="muted">Updated 5 minutes ago</Text>
  </Stack>
</Box>`,
            },
            {
              title: 'On a narrow screen',
              when: 'Check that the line follows the width of its container.',
              explain: [
                'The line fills the width of its parent. No width is set, so it reflows with the layout (WCAG 1.4.10, AA).',
              ],
              frame: 'narrow',
              render: (
                <Stack gap={3}>
                  <Text>Shipping</Text>
                  <Divider decorative />
                  <Text>Billing</Text>
                </Stack>
              ),
              code: `<Stack gap={3}>
  <Text>Shipping</Text>
  <Divider decorative />
  <Text>Billing</Text>
</Stack>`,
            },
          ],
        },
        {
          title: 'Vertical',
          kicker: 'Between items in a row. The line takes the height of the row.',
          examples: [
            {
              title: 'Between toolbar groups',
              when: 'Related controls sit side by side and you want to mark where one group ends.',
              explain: [
                '`orientation="vertical"` draws an upright line.',
                'Put it in a horizontal `Stack`. The line sets `align-self: stretch`, so it grows to the height of the row whatever `align` the `Stack` uses.',
                'The line is decorative here: the buttons carry their own names.',
              ],
              render: (
                <Stack direction="horizontal" gap={3} align="stretch">
                  <Text as="span">Bold</Text>
                  <Text as="span">Italic</Text>
                  <Divider orientation="vertical" decorative />
                  <Text as="span">Link</Text>
                </Stack>
              ),
              code: `// The line has align-self: stretch, so it fills the row height.
<Stack direction="horizontal" gap={3} align="stretch">
  <Text as="span">Bold</Text>
  <Text as="span">Italic</Text>
  <Divider orientation="vertical" decorative />
  <Text as="span">Link</Text>
</Stack>`,
            },
            {
              title: 'A semantic vertical line',
              when: 'The line marks a real change of topic between two columns.',
              explain: [
                'Without `decorative`, the vertical line is announced as a vertical separator.',
                'Use this only when the two sides are distinct topics. Name each side with its own heading.',
              ],
              render: (
                <Stack direction="horizontal" gap={4}>
                  <Stack gap={1}>
                    <Heading level={3}>Before</Heading>
                    <Text>Manual export</Text>
                  </Stack>
                  <Divider orientation="vertical" />
                  <Stack gap={1}>
                    <Heading level={3}>After</Heading>
                    <Text>Automatic sync</Text>
                  </Stack>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={4}>
  <Stack gap={1}>
    <Heading level={3}>Before</Heading>
    <Text>Manual export</Text>
  </Stack>
  {/* Announced as a vertical separator. */}
  <Divider orientation="vertical" />
  <Stack gap={1}>
    <Heading level={3}>After</Heading>
    <Text>Automatic sync</Text>
  </Stack>
</Stack>`,
            },
          ],
        },
      ]}
    />
  ),
};
