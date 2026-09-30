import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/clickables/button/button';
import { Stage } from './anatomy';

// A fixture story shows the block on its own with sample props. It is not a DocPage. The stage, the anchors, the leader lines, the pins and the parts panel.
const meta = { title: 'Fixtures/Anatomy', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <Stage
        anatomy={{
          render: <Button variant="primary" loading>Save changes</Button>,
          parts: [
            { n: 1, label: 'Container', note: 'native button, required', target: '.ds-button', at: 'top-start' },
            { n: 2, label: 'Label', note: 'children, required', target: '.ds-button__label', at: 'bottom-start' },
            { n: 3, label: 'Spinner', note: 'shown only while loading', target: '.ds-button__spinner', at: 'center' },
          ],
        }}
      />
    </div>
  ),
};
