import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContrastPairs, MotionSwatches, RadiusTiles, RoleSwatches, SpacingScale } from './specimens';

// A fixture story shows the block on its own with sample props. It is not a DocPage. Role, contrast, spacing, radius and motion specimens, read from the generated tokens.
const meta = { title: 'Fixtures/Specimens', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <RoleSwatches />
      <ContrastPairs />
      <SpacingScale />
      <RadiusTiles />
      <MotionSwatches />
    </div>
  ),
};
