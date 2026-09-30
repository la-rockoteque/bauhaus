import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';

// One story per designed cell of the state matrix; button.mdx lists the cells marked n/a.
const meta = {
  title: 'Clickables/Button',
  component: Button,
  args: { children: 'Save changes' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Tertiary: Story = { args: { variant: 'tertiary' } };

export const Hover: Story = { args: { variant: 'primary' }, parameters: { pseudo: { hover: true } } };
export const FocusVisible: Story = { args: { variant: 'primary' }, parameters: { pseudo: { focusVisible: true } } };
export const Active: Story = { args: { variant: 'primary' }, parameters: { pseudo: { active: true } } };
export const Disabled: Story = { args: { variant: 'primary', disabled: true } };
export const Loading: Story = { args: { variant: 'primary', loading: true } };

/** Too many: a long label wraps inside the button and never truncates (WCAG 1.4.10). */
export const LongLabel: Story = {
  args: { children: 'Save changes to the shipping address and the billing address of this customer' },
  decorators: [(Story) => <div style={{ maxInlineSize: 'var(--ds-space-12)' }}>{Story()}</div>],
};
