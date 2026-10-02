import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Box } from '../box/box';
import { Icon } from '../icon/icon';
import { Text } from '../text/text';
import { Stack } from '../stack/stack';
import { Heading } from './heading';
import type { HeadingLevel, HeadingSize } from './heading';
import { headingRules } from './heading.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Primitives/Heading', component: Heading, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Heading>;

export default meta;

const notInteractive = 'A Heading is not interactive.';
const noData = 'A Heading holds no data of its own.';
const SIZES: HeadingSize[] = ['display', 'heading', 'subheading', 'label'];
const LEVELS: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Heading"
      layer="Primitive"
      plain="A heading is a title for the part of the page below it. Screen reader users jump from heading to heading to find their way, so the order of the titles matters more than their size."
      precise="Primitive component · h1 to h6 from a level prop · the look comes from a separate size prop · the outline stays correct whatever the design asks."
      usedFor="Every page title, section title and region title."
      tokens={{
        mode: 'consumed',
        note: 'The heading has no component tokens.',
        rows: [
          { name: 'text.display.*', tier: '2', use: 'Family, size, weight and line height of size "display"' },
          { name: 'text.heading.*', tier: '2', use: 'Size "heading"; also the family, weight and line height of "subheading"' },
          { name: 'font.size.md', tier: '2', use: 'The size of "subheading", which has no text style of its own' },
          { name: 'text.label.*', tier: '2', use: 'Size "label"' },
          { name: 'text.default', tier: 'role', use: 'Colour', swatch: '--ds-text-default' },
        ],
      }}
      stage={{
        render: (args) => (
          <Heading level={Number(args.level) as HeadingLevel} size={args.size as HeadingSize}>
            Delivery address
          </Heading>
        ),
        parts: [
          { n: 1, label: 'Element', note: 'h1 to h6, from level, required', target: '.ds-heading', at: 'top-start' },
          { n: 2, label: 'Look', note: 'from size; defaults by level', target: '.ds-heading', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Default sizes', value: 'h1 display · h2 heading · h3 subheading · h4 to h6 label' },
        { label: 'Margin', value: '0; spacing belongs to the parent' },
        { label: 'Wrapping', value: 'Wraps with balanced lines; never truncates' },
      ]}
      api={[
        { label: 'level', value: 'Required. 1 to 6. Sets the element and the outline.', control: { kind: 'select', options: LEVELS.map(String), value: '2' } },
        { label: 'size', value: '"display" | "heading" | "subheading" | "label". Sets the look only; defaults from the level.', control: { kind: 'select', options: SIZES, value: 'heading' } },
        { label: '…props', value: 'Every native heading attribute, such as id.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'An empty heading is a defect. The caller renders nothing instead.' },
          { id: 'loading', status: 'n/a', reason: 'A Heading has no loading form. Use a skeleton.' },
          { id: 'none', status: 'n/a', reason: noData },
          { id: 'one', status: 'n/a', reason: noData },
          {
            id: 'some',
            status: 'designed',
            label: 'Some (every size)',
            render: (
              <Stack gap={2}>
                {SIZES.map((size) => <Heading key={size} level={2} size={size}>{`Size ${size}`}</Heading>)}
              </Stack>
            ),
            trigger: 'size',
            note: 'Four looks. Every line here is an h2.',
          },
          { id: 'too-many', status: 'designed', label: 'Too many (long title)', render: <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 5)' }}><Heading level={3}>Delivery to the shipping address on file, unless you choose a pickup point</Heading></div>, trigger: 'long children', note: 'The title wraps and never truncates.' },
          { id: 'incorrect', status: 'n/a', reason: 'A Heading has no error form.' },
          { id: 'correct', status: 'n/a', reason: notInteractive },
          { id: 'done', status: 'n/a', reason: notInteractive },
          {
            id: 'default',
            status: 'designed',
            label: 'Default (every level)',
            render: (
              <Stack gap={1}>
                {LEVELS.map((level) => <Heading key={level} level={level}>{`Level ${level}`}</Heading>)}
              </Stack>
            ),
            trigger: 'level',
            note: 'Each level with its default size.',
          },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      dos={[
        { text: 'Pick the level from the outline, then the size from the design.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Go down one level at a time.', basis: 'WCAG 1.3.1 (A); 2.4.6 (AA)' },
        { text: 'Name the section that follows.', basis: 'WCAG 2.4.6 (AA)' },
      ]}
      donts={[
        { text: 'Skip from h2 to h4 to get a smaller size.', basis: 'WCAG 1.3.1 (A)', rule: 'heading.no-skipped-level' },
        { text: 'Style a div as a heading.', basis: 'WCAG 1.3.1 (A)', rule: 'heading.level-sets-element' },
        { text: 'Let the level choose the look.', basis: 'WCAG 1.3.1 (A)', rule: 'heading.size-decoupled' },
        { text: 'Put two h1 elements on one page.', basis: 'WCAG 2.4.6 (AA)', rule: 'heading.one-h1' },
        { text: 'Write a px font size at a call site.', basis: 'Project decision', rule: 'heading.size-from-text-style' },
      ]}
      guide="primitives-heading--docs"
      guideName="Heading"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Heading" layer="Primitive" rules={headingRules} guide="primitives-heading--docs" guideName="Heading" />,
};

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Heading"
      layer="Primitive"
      imports="import { Heading, Stack, Text, Box, Icon } from '@bauhaus/design-system';"
      intro={[
        'A heading is the title of a part of the page. Screen reader users jump from heading to heading to skim a page, the way sighted users skim big text.',
        'The level (1 to 6) is the place in the outline, like chapters and sub-chapters. Level 1 is the page title, level 2 is a section, level 3 is a part of a section.',
        'The level sets the HTML element (`h1` to `h6`) and nothing about the look. The size sets the look and nothing about the outline. Keep the two apart.',
        'Rules of the outline: one `h1` per page, and go down one level at a time. Do not skip from `h2` to `h4` to get smaller text. Use `size` for that (WCAG 1.3.1, A).',
        'Headings wrap and never truncate. A heading has no margin: wrap it in a `Stack` and let the gap set the space.',
      ]}
      guide="primitives-heading--docs"
      guideName="Heading"
      groups={[
        {
          title: 'Levels',
          kicker: 'Choose the level from the outline of the page. The default size follows the level.',
          examples: [
            {
              title: 'The page title (level 1)',
              when: 'The one title of the whole page.',
              explain: [
                '`level={1}` renders an `<h1>` in the `display` size, the largest.',
                'Use exactly one per page: this is a project convention. It tells screen reader users what the page is about. A descriptive heading text meets WCAG 2.4.6 (headings and labels, AA).',
                'The text names the page: "Account settings", not "Welcome".',
              ],
              render: <Heading level={1}>Account settings</Heading>,
              code: `// One per page. The default size for level 1 is "display".
<Heading level={1}>Account settings</Heading>`,
            },
            {
              title: 'A section (level 2)',
              when: 'A main part of the page.',
              explain: [
                '`level={2}` renders an `<h2>` in the `heading` size.',
                'Each section of the page gets a level 2. Their order is the outline a screen reader user hears.',
              ],
              render: <Heading level={2}>Notifications</Heading>,
              code: `<Heading level={2}>Notifications</Heading>`,
            },
            {
              title: 'A sub-section (level 3)',
              when: 'A part inside a level-2 section.',
              explain: [
                '`level={3}` renders an `<h3>` in the `subheading` size.',
                'Go down one level at a time: a level 3 always sits under a level 2.',
              ],
              render: <Heading level={3}>Email alerts</Heading>,
              code: `<Heading level={3}>Email alerts</Heading>`,
            },
            {
              title: 'Deeper levels (4 to 6)',
              when: 'Small titles deep in the outline, such as a card inside a sub-section.',
              explain: [
                'Levels 4, 5 and 6 render `<h4>` to `<h6>` in the `label` size. They look the same, but the outline keeps the depth.',
                'If you reach level 5 often, the page may be too nested. Consider splitting it.',
              ],
              render: (
                <Stack gap={2}>
                  <Heading level={4}>Level 4</Heading>
                  <Heading level={5}>Level 5</Heading>
                  <Heading level={6}>Level 6</Heading>
                </Stack>
              ),
              code: `<Stack gap={2}>
  <Heading level={4}>Level 4</Heading>
  <Heading level={5}>Level 5</Heading>
  <Heading level={6}>Level 6</Heading>
</Stack>`,
            },
            {
              title: 'A full outline',
              when: 'See how the levels fit together on one screen.',
              explain: [
                'One `h1`, then `h2` sections, with `h3` parts inside. The levels go down one step at a time and may jump back up.',
                'Screen readers list these headings. The reader sees "Billing, Plan, Payment method, Invoices" and picks where to go.',
                'Each `Stack` keeps a heading tight with its text (`gap={2}`) and the sections apart (`gap={6}`).',
              ],
              render: (
                <Stack gap={6}>
                  <Heading level={1}>Billing</Heading>
                  <Stack gap={3}>
                    <Heading level={2}>Plan</Heading>
                    <Text>You are on the Team plan.</Text>
                  </Stack>
                  <Stack gap={3}>
                    <Heading level={2}>Payment</Heading>
                    <Stack gap={2}>
                      <Heading level={3}>Payment method</Heading>
                      <Text>Visa ending in 4242.</Text>
                    </Stack>
                  </Stack>
                </Stack>
              ),
              code: `<Stack gap={6}>
  <Heading level={1}>Billing</Heading>
  <Stack gap={3}>
    <Heading level={2}>Plan</Heading>
    <Text>You are on the Team plan.</Text>
  </Stack>
  <Stack gap={3}>
    <Heading level={2}>Payment</Heading>
    {/* h3 sits under h2: no level is skipped. */}
    <Stack gap={2}>
      <Heading level={3}>Payment method</Heading>
      <Text>Visa ending in 4242.</Text>
    </Stack>
  </Stack>
</Stack>`,
            },
          ],
        },
        {
          title: 'Size',
          kicker: 'The level is the outline. The size is the look. They can differ on purpose.',
          examples: [
            {
              title: 'The four sizes',
              when: 'See what each size looks like.',
              explain: [
                '`display` is for page titles, `heading` for sections, `subheading` for sub-sections and `label` for small titles.',
                'All four read their font, size, weight and line height from text tokens. Never set a font size at the call site (project decision).',
              ],
              render: (
                <Stack gap={2}>
                  <Heading level={2} size="display">display</Heading>
                  <Heading level={2} size="heading">heading</Heading>
                  <Heading level={2} size="subheading">subheading</Heading>
                  <Heading level={2} size="label">label</Heading>
                </Stack>
              ),
              code: `// All four are level 2: same place in the outline, four looks.
<Stack gap={2}>
  <Heading level={2} size="display">display</Heading>
  <Heading level={2} size="heading">heading</Heading>
  <Heading level={2} size="subheading">subheading</Heading>
  <Heading level={2} size="label">label</Heading>
</Stack>`,
            },
            {
              title: 'A smaller look at the same level',
              when: 'A section title must be quiet, for example in a sidebar.',
              explain: [
                'Keep `level={2}` so the outline is right. Add `size="label"` to make it look small.',
                'This is the correct fix when design wants a small title. Do not change to `h4` just for the size: that skips levels and confuses screen reader users (WCAG 1.3.1, A).',
              ],
              render: <Heading level={2} size="label">Filters</Heading>,
              code: `// Outline: level 2. Look: small.
<Heading level={2} size="label">Filters</Heading>`,
            },
            {
              title: 'A larger look at a deeper level',
              when: 'A deeper title must stand out, such as a big number card.',
              explain: [
                'Keep the level that the outline needs and raise the look with `size`.',
                'Pick the level first from the outline, then the size from the design (WCAG 1.3.1, A).',
              ],
              render: <Heading level={3} size="heading">Team plan</Heading>,
              code: `// Outline: level 3. Look: the larger "heading" size.
<Heading level={3} size="heading">Team plan</Heading>`,
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'A heading names a region. Pair it with text, actions and icons.',
          examples: [
            {
              title: 'Heading with a description',
              when: 'The standard header of a section.',
              explain: [
                'A `Stack` with `gap={2}` keeps the title and its text as one group.',
                'The heading comes first in the markup, so the reading order and the visual order match.',
              ],
              render: (
                <Stack gap={2}>
                  <Heading level={2}>Team members</Heading>
                  <Text tone="muted">People who can edit this project.</Text>
                </Stack>
              ),
              code: `<Stack gap={2}>
  <Heading level={2}>Team members</Heading>
  <Text tone="muted">People who can edit this project.</Text>
</Stack>`,
            },
            {
              title: 'A heading that names a section',
              when: 'Screen reader users should be able to jump to the region.',
              explain: [
                'Give the heading an `id`. The section points at it with `aria-labelledby`.',
                'The section is then a landmark named by its heading. The text lives in one place only, so the two cannot drift apart (WCAG 1.3.1, A).',
              ],
              render: (
                <Stack as="section" gap={2} aria-labelledby="heading-ex-privacy">
                  <Heading level={2} id="heading-ex-privacy">Privacy</Heading>
                  <Text>Choose who can see your profile.</Text>
                </Stack>
              ),
              code: `<Stack as="section" gap={2} aria-labelledby="privacy-title">
  {/* The id is the link from the section to its name. */}
  <Heading level={2} id="privacy-title">Privacy</Heading>
  <Text>Choose who can see your profile.</Text>
</Stack>`,
            },
            {
              title: 'Icon beside a heading',
              when: 'A decorative icon helps the reader find the section.',
              explain: [
                'Put the `Icon` and the `Heading` in a horizontal `Stack` with `align="center"`.',
                'The icon has no `label`, so screen readers skip it and only read the heading text.',
              ],
              render: (
                <Stack direction="horizontal" gap={2} align="center">
                  <Icon glyph="bell" />
                  <Heading level={2}>Notifications</Heading>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={2} align="center">
  {/* Decorative: no label, the heading names the section. */}
  <Icon glyph="bell" />
  <Heading level={2}>Notifications</Heading>
</Stack>`,
            },
            {
              title: 'Heading inside a card',
              when: 'A card with its own title.',
              explain: [
                'Pick the level from where the card sits in the page, not from how small the card looks. A card under a level-2 section uses level 3.',
                'The `Box` supplies surface and padding. The heading has no margin of its own.',
              ],
              render: (
                <Box surface="raised" padding={4}>
                  <Stack gap={2}>
                    <Heading level={3}>Backup</Heading>
                    <Text>Last backup: yesterday at 22:00.</Text>
                  </Stack>
                </Box>
              ),
              code: `<Box surface="raised" padding={4}>
  <Stack gap={2}>
    {/* Level 3: the card sits under a level-2 section. */}
    <Heading level={3}>Backup</Heading>
    <Text>Last backup: yesterday at 22:00.</Text>
  </Stack>
</Box>`,
            },
          ],
        },
        {
          title: 'Content cases',
          kicker: 'Titles are longer in other languages and on small screens.',
          examples: [
            {
              title: 'A long heading on a narrow screen',
              when: 'The title does not fit on one line.',
              explain: [
                'Headings wrap. They never truncate, so no words are lost (WCAG 1.4.10, AA).',
                'Headings also balance their lines, which avoids one lonely word on the last line.',
              ],
              frame: 'narrow',
              render: <Heading level={2}>Manage your notification preferences</Heading>,
              code: `// No width, no ellipsis: the heading wraps and balances its lines.
<Heading level={2}>Manage your notification preferences</Heading>`,
            },
            {
              title: 'A translated heading',
              when: 'The same title in another language.',
              explain: [
                'Pass the translated string as `children`. The primitive has no translation code.',
                '`lang` on the heading makes screen readers speak it correctly when the language differs from the page (WCAG 3.1.2, AA).',
              ],
              frame: 'phone',
              render: <Heading level={2} lang="fr">Préférences de notification</Heading>,
              code: `<Heading level={2} lang="fr">Préférences de notification</Heading>`,
            },
          ],
        },
      ]}
    />
  ),
};
