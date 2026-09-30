import type { Meta, StoryObj } from '@storybook/react-vite';

const ROLES = ['heading', 'body', 'caption', 'label'];

const meta = { title: 'Foundations/Typography' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The four text roles. Each reads size, weight and line height from its own tokens. */
export const Roles: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-stack-md)', fontFamily: 'var(--ds-font-family-sans)' }}>
      {ROLES.map((role) => (
        <p
          key={role}
          style={{
            margin: 0,
            fontSize: `var(--ds-text-${role}-size)`,
            fontWeight: `var(--ds-text-${role}-weight)`,
            lineHeight: `var(--ds-text-${role}-line-height)`,
          }}
        >
          text.{role}: Your order ships on Friday.
        </p>
      ))}
    </div>
  ),
};
