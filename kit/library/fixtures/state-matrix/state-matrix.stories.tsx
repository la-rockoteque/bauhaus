import type { Meta, StoryObj } from '@storybook/react-vite';
import { DEFAULT_EXPECT, States } from './state-matrix';
import { SAMPLE } from './sample';

// A fixture story shows the block on its own with sample props. It is not a DocPage. Section 4 whole: the summary, the lifecycle rows and the interaction matrix.
const meta = { title: 'Fixtures/State matrix', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <States name="Button" defaultExpect={DEFAULT_EXPECT} states={SAMPLE} />
    </div>
  ),
};
