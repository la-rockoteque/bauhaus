import type { Meta, StoryObj } from '@storybook/react-vite';

const STEPS = ['fast', 'base', 'deliberate'];

const meta = { title: 'Foundations/Motion' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover a bar to see how long each duration token takes. */
export const Durations: Story = {
  render: () => (
    <ul style={{ display: 'grid', gap: 'var(--ds-space-stack-sm)', listStyle: 'none', padding: 0 }}>
      {STEPS.map((step) => (
        <li key={step}>
          <code>motion.duration.{step}</code>
          <div
            style={{ blockSize: 'var(--ds-space-3)', background: 'var(--ds-color-accent-default)', inlineSize: 'var(--ds-space-8)', transition: `inline-size var(--ds-motion-duration-${step}) linear` }}
            onMouseEnter={(e) => { e.currentTarget.style.inlineSize = '100%'; }}
            onMouseLeave={(e) => { e.currentTarget.style.inlineSize = ''; }}
          />
        </li>
      ))}
    </ul>
  ),
};
