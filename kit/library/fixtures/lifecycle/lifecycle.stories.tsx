import type { Meta, StoryObj } from '@storybook/react-vite';
import { DEFAULT_EXPECT } from '../state-matrix/state-matrix';
import { rowsFor } from '../state-matrix/rows';
import { SAMPLE } from '../state-matrix/sample';
import { Lifecycle } from './lifecycle';

// A fixture story shows the block on its own with sample props. It is not a DocPage. Incorrect is left out of the sample, so its row shows as missing.
const meta = { title: 'Fixtures/Lifecycle', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <Lifecycle rows={rowsFor('lifecycle', SAMPLE, DEFAULT_EXPECT)} />
    </div>
  ),
};
