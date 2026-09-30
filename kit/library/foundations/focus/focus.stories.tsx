import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = { title: 'Foundations/Focus' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The ring drawn from its three tokens. Tab through the page to see the same ring on real controls. */
export const Ring: Story = {
  render: () => (
    <button
      type="button"
      style={{
        padding: 'var(--ds-space-inset-md)',
        outline: 'var(--ds-focus-ring-width) solid var(--ds-color-focus-ring)',
        outlineOffset: 'var(--ds-focus-ring-offset)',
      }}
    >
      Ring drawn permanently
    </button>
  ),
};
