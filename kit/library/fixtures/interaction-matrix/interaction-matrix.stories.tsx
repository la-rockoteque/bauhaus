import type { Meta, StoryObj } from '@storybook/react-vite';
import { DEFAULT_EXPECT } from '../state-matrix/state-matrix';
import { rowsFor } from '../state-matrix/rows';
import { SAMPLE } from '../state-matrix/sample';
import { InteractionMatrix } from './interaction-matrix';

// A fixture story shows the block on its own with sample props. It is not a DocPage. Hover, focus and press are forced from the stylesheet. Selected is n/a, so it takes one line.
const meta = { title: 'Fixtures/Interaction matrix', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <InteractionMatrix rows={rowsFor('interaction', SAMPLE, DEFAULT_EXPECT)} base="Button" />
    </div>
  ),
};
