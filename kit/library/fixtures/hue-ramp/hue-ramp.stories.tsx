import type { Meta, StoryObj } from '@storybook/react-vite';
import { HueRamp } from './hue-ramp';

// A fixture story shows the block on its own with sample props. It is not a DocPage. One palette hue and one role scale as bands of nine grades.
const meta = { title: 'Fixtures/Hue ramp', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <HueRamp prefix="palette" name="dark-blue" />
      <HueRamp prefix="colors" name="neutral" />
    </div>
  ),
};
