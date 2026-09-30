import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/clickables/button/button';
import { Stage } from './stage';

// A fixture story shows the block on its own with sample props. It is not a DocPage. The stage with its two layers, one at a time: the anatomy (anchors, leader lines, pins, parts panel) and the specs (redlines and the specs table).
const meta = { title: 'Fixtures/Stage', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <Stage
        stage={{
          render: <Button variant="primary" loading>Save changes</Button>,
          parts: [
            { n: 1, label: 'Container', note: 'native button, required', target: '.ds-button', at: 'top-start' },
            { n: 2, label: 'Label', note: 'children, required', target: '.ds-button__label', at: 'bottom-start' },
            { n: 3, label: 'Spinner', note: 'shown only while loading', target: '.ds-button__spinner', at: 'center' },
          ],
        }}
        specs={[
          { label: 'Height', property: 'height', target: '.ds-button', token: 'size.target.min' },
          { label: 'Padding inline', property: 'padding-inline', target: '.ds-button', token: 'space.inline.lg' },
          { label: 'Radius', property: 'radius', target: '.ds-button', token: 'radius.control' },
          { label: 'Label', value: 'text.label.*' },
        ]}
      />
    </div>
  ),
};
