import type { Meta, StoryObj } from '@storybook/react-vite';
import { ElevationRungs, ScrimSample, ZStack } from './elevation-specimens';

// A fixture story shows the block on its own with sample props. It is not a DocPage. Shadow rungs, the scrim and the stacking order.
const meta = { title: 'Fixtures/Elevation specimens', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <ElevationRungs />
      <ScrimSample />
      <ZStack />
    </div>
  ),
};
