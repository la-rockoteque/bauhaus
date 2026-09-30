import type { Meta, StoryObj } from '@storybook/react-vite';
import { FontsOnPaper } from './lined-paper';

// A fixture story shows the block on its own with sample props. It is not a DocPage. The font roles written on school paper.
const meta = { title: 'Fixtures/Lined paper', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <FontsOnPaper />
    </div>
  ),
};
