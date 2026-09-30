import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './icon-button';

const Cross = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 3l10 10M13 3L3 13" />
  </svg>
);

const meta = {
  title: 'Clickables/Icon button',
  component: IconButton,
  args: { label: 'Close dialog', icon: <Cross /> },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tertiary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const FocusVisible: Story = { parameters: { pseudo: { focusVisible: true } } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
