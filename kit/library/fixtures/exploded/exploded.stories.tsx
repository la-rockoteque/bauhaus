import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/clickables/button/button';
import { Exploded } from './exploded';

// A fixture story shows the block on its own with sample props. The exploded view: a component's layers in isometric, each with its tokens.
const meta = { title: 'Fixtures/Exploded', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <Exploded
        render={<Button variant="secondary">Save changes</Button>}
        rows={[
          { name: 'surface.default', tier: 'role', use: 'Fill', swatch: '--ds-surface-default' },
          { name: 'border.strong', tier: 'role', use: 'Outline', swatch: '--ds-border-strong' },
          { name: 'text.default', tier: 'role', use: 'Label', swatch: '--ds-text-default' },
          { name: 'focus.ring.color', tier: 'role', use: 'Focus', swatch: '--ds-focus-ring-color' },
        ]}
      />
    </div>
  ),
};
