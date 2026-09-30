import type { Meta, StoryObj } from '@storybook/react-vite';

const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const ROLES = ['inline-sm', 'inline-lg', 'stack-sm', 'stack-lg', 'inset-md'];

const meta = { title: 'Foundations/Spacing' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The closed scale: 12 steps on a 4px grid. Bar width is the token itself. */
export const Scale: Story = {
  render: () => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--ds-space-stack-sm)' }}>
      {STEPS.map((n) => (
        <li key={n} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-lg)' }}>
          <code style={{ inlineSize: 'var(--ds-space-12)' }}>space.{n}</code>
          <span style={{ display: 'block', inlineSize: `var(--ds-space-${n})`, blockSize: 'var(--ds-space-3)', background: 'var(--ds-action-primary)' }} />
        </li>
      ))}
    </ul>
  ),
};

/** The semantic tokens: what a call site reads instead of a step. */
export const SemanticGaps: Story = {
  render: () => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--ds-space-stack-sm)' }}>
      {ROLES.map((role) => (
        <li key={role} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-lg)' }}>
          <code style={{ inlineSize: 'var(--ds-space-12)' }}>space.{role.replace('-', '.')}</code>
          <span style={{ display: 'block', inlineSize: `var(--ds-space-${role})`, blockSize: 'var(--ds-space-3)', background: 'var(--ds-action-primary)' }} />
        </li>
      ))}
    </ul>
  ),
};

/** Proximity: the gap inside a group is smaller than the gap between groups. */
export const Grouping: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-stack-lg)' }}>
      {['Shipping', 'Billing'].map((title) => (
        <div key={title} style={{ display: 'grid', gap: 'var(--ds-space-stack-sm)' }}>
          <strong>{title}</strong>
          <span>Street</span>
          <span>City</span>
        </div>
      ))}
    </div>
  ),
};
