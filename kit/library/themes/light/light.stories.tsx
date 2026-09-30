import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = { title: 'Themes/Light' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** A panel pinned to the light theme, whatever the toolbar says. Compare with Themes/Dark. */
export const Panel: Story = {
  render: () => (
    <div
      data-theme="light"
      style={{ padding: 'var(--ds-space-inset-lg)', background: 'var(--ds-surface-default)', color: 'var(--ds-text-default)', border: '1px solid var(--ds-border-default)' }}
    >
      <p style={{ margin: 0 }}>Default text on the default surface.</p>
      <p style={{ margin: 0, color: 'var(--ds-text-muted)' }}>Muted text keeps 4.5:1 on this surface.</p>
      <a href="#light" style={{ color: 'var(--ds-text-link)' }}>A link</a>
    </div>
  ),
};
