import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/clickables/button/button';
import { Text } from '../../primitives/text/text';

// The pattern is a recipe, not a component: the stories compose the parts it names.
const meta = { title: 'Patterns/Empty results' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Recipe = ({ heading, hint, action, busy = false }: { heading: string; hint: string; action: string; busy?: boolean }) => (
  <div role="status" style={{ display: 'grid', gap: 'var(--ds-space-stack-sm)', justifyItems: 'start', maxInlineSize: '32rem' }}>
    <Text variant="heading" as="h3">{heading}</Text>
    <Text tone="muted">{hint}</Text>
    <Button variant="secondary" loading={busy}>{action}</Button>
  </div>
);

/** None: the filters match nothing. Say what was searched and offer the way out. */
export const NoMatches: Story = {
  render: () => <Recipe heading="No orders match these filters" hint="Filters: status Shipped, date last 7 days." action="Clear filters" />,
};

/** Nothing yet: no data exists, so filtering is not the cause. */
export const NothingYet: Story = {
  render: () => <Recipe heading="You have no orders yet" hint="Orders appear here after checkout." action="Browse products" />,
};

/** Loading: the same slot, action busy, so the layout does not jump when results arrive. */
export const Loading: Story = {
  render: () => <Recipe heading="Looking for orders" hint="This takes a few seconds." action="Clear filters" busy />,
};
