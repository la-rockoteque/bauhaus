import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/clickables/button/button';
import { DEFAULT_EXPECT, States } from './states-grid';

// A fixture story shows the block on its own with sample props. It is not a DocPage. The grid, with the forced hover, focus and press replayed from the stylesheet.
const meta = { title: 'Fixtures/States grid', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <States
        defaultExpect={DEFAULT_EXPECT}
        states={{
          expect: ['default', 'hover', 'focus-visible', 'active', 'disabled'],
          cells: [
            { id: 'default', status: 'designed', render: <Button>Save</Button>, trigger: 'rest' },
            { id: 'hover', status: 'designed', render: <Button className="doc-force-hover">Save</Button>, trigger: ':hover', note: 'Forced by .doc-force-hover, from the stylesheet rule.' },
            { id: 'focus-visible', status: 'designed', render: <Button className="doc-force-focus">Save</Button>, trigger: ':focus-visible' },
            { id: 'active', status: 'designed', render: <Button className="doc-force-active">Save</Button>, trigger: ':active' },
          ],
        }}
      />
    </div>
  ),
};
