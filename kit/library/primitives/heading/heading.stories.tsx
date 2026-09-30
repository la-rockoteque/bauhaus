import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { Stack } from '../stack/stack';
import { Heading } from './heading';
import type { HeadingLevel, HeadingSize } from './heading';
import { headingRules } from './heading.rules';

// The showcase: one page story. The states grid replaces one story per state.
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
          { name: 'font.size.lg', tier: '2', use: 'The size of "subheading", which has no text style of its own' },
          { name: 'text.label.*', tier: '2', use: 'Size "label"' },
          { name: 'text.default', tier: 'role', use: 'Colour', swatch: '--ds-text-default' },
        ],
      }}
      stage={{
        render: <Heading level={2}>Delivery address</Heading>,
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
        { label: 'level', value: 'Required. 1 to 6. Sets the element and the outline.' },
        { label: 'size', value: '"display" | "heading" | "subheading" | "label". Sets the look only; defaults from the level.' },
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
