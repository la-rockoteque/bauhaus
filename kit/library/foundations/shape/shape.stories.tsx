import type { Meta, StoryObj } from '@storybook/react-vite';

const STEPS = ['none', 'sm', 'md', 'lg', 'full', 'control'];

const meta = { title: 'Foundations/Shape' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The radius scale and the one semantic token controls read. */
export const Radius: Story = {
  render: () => (
    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-inline-lg)', listStyle: 'none', padding: 0 }}>
      {STEPS.map((step) => (
        <li key={step} style={{ display: 'grid', gap: 'var(--ds-space-stack-xs)' }}>
          <span style={{ display: 'block', inlineSize: 'var(--ds-space-12)', blockSize: 'var(--ds-space-12)', background: 'var(--ds-state-selected)', border: '2px solid var(--ds-action-primary)', borderRadius: `var(--ds-radius-${step})` }} />
          <code>radius.{step}</code>
        </li>
      ))}
    </ul>
  ),
};
