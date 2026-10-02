import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../../primitives/text/text';
import { SLICE_ICONS, SliceIcon } from './slice-icon';
import type { SliceName } from './slice-icon';

// A fixture story shows the block on its own with sample props. It is not a DocPage. Every slice icon, large, then at the sidebar's size.
const meta = { title: 'Fixtures/Slice icon', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const NAMES = Object.keys(SLICE_ICONS) as SliceName[];

const Grid = ({ size }: { size: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(calc(var(--ds-space-12) * 2), 1fr))', gap: 'var(--ds-space-4)' }}>
    {NAMES.map((name) => (
      <figure key={name} style={{ margin: 0, display: 'grid', justifyItems: 'center', gap: 'var(--ds-space-2)' }}>
        <SliceIcon name={name} size={size} />
        <Text as="figcaption" variant="caption">
          {name}
        </Text>
      </figure>
    ))}
  </div>
);

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto', display: 'grid', gap: 'var(--ds-space-8)' }}>
      <Grid size="var(--ds-space-12)" />
      <Grid size="var(--ds-size-icon-md)" />
    </div>
  ),
};
