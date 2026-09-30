import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = { title: 'Themes/Dark' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** A panel pinned to the dark theme, whatever the toolbar says. Compare with Foundations/Color. */
export const Panel: Story = {
  render: () => (
    <div
      data-theme="dark"
      style={{ padding: 'var(--ds-space-inset-lg)', background: 'var(--ds-color-surface-default)', color: 'var(--ds-color-text-default)', border: '1px solid var(--ds-color-border-default)' }}
    >
      <p style={{ margin: 0 }}>Default text on the default surface.</p>
      <p style={{ margin: 0, color: 'var(--ds-color-text-muted)' }}>Muted text keeps 4.5:1 on this surface.</p>
      <a href="#dark" style={{ color: 'var(--ds-color-text-link)' }}>A link</a>
    </div>
  ),
};
