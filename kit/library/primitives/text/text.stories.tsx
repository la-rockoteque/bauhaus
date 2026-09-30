import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './text';

const meta = { title: 'Primitives/Text', component: Text, args: { children: 'Your order ships on Friday.' } } satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};
export const Caption: Story = { args: { variant: 'caption', children: 'Updated 2 minutes ago' } };
export const Heading: Story = { args: { variant: 'heading', children: 'Order summary' } };
export const Muted: Story = { args: { tone: 'muted', children: 'Prices include tax.' } };

/** Structure and look are separate: an h3 that looks like a heading. */
export const HeadingLevel: Story = { args: { variant: 'heading', as: 'h3', children: 'Delivery' } };
