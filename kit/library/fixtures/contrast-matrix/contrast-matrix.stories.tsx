import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContrastMatrix } from './contrast-matrix';

// A fixture story shows the block on its own with sample props. It is not a DocPage. Every pair of pairs.json as a matrix, in the selected theme.
const meta = { title: 'Fixtures/Contrast matrix', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <ContrastMatrix />
    </div>
  ),
};
