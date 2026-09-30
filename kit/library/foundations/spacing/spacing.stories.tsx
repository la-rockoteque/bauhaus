import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../.storybook/doc-page/doc-page';
import { SpacingScale } from '../../.storybook/doc-page/specimens';
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
          { name: 'size.target.min', tier: '2', use: '44px; the smallest pointer target. Spacing must not shrink it.' },
          { name: 'size.control.sm · md · lg', tier: '2', use: 'Heights of buttons and fields: 44, 48, 56 px. Never below the target floor' },
          { name: 'size.icon.sm · md · lg', tier: '2', use: 'Side of an icon box: 16, 20, 24 px' },
          { name: 'size.border.thin · thick', tier: '2', use: 'Border widths: 1px hairline, and the focus ring width for emphasis' },
          { name: 'size.overlay.sm · md · lg', tier: '2', use: 'Maximum inline size of a floating surface: 20, 30, 40 rem' },
        ],
      }}
      specimens={<SpacingScale />}
      specs={[
        { label: 'Base unit', value: '4px; every step is a multiple of it' },
        { label: 'Steps', value: 'space.0 to space.12; closed, no step between space.4 and space.5' },
        { label: 'Tier 2', value: 'Names the job: inset, stack, inline. A component reads tier 2.' },
      ]}
      states={{
        cells: [
          { id: 'density', status: 'n/a', reason: 'A compact theme would remap tier 2 tokens one step down; controls keep size.target.min.' },
          { id: 'text-spacing', status: 'designed', label: 'Text spacing raised by the user', render: <Groups />, trigger: 'gaps in tokens', note: 'No container around text has a fixed height, so nothing clips.' },
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
        { text: 'Shrink a target below size.target.min to save room.', basis: 'WCAG 2.5.8 (AA); house floor 44px', rule: 'spacing.target-min' },
      ]}
      rules={spacingRules}
      guide="foundations-spacing--docs"
      guideName="Spacing"
    />
  ),
};
