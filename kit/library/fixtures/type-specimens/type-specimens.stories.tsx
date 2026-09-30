import type { Meta, StoryObj } from '@storybook/react-vite';
import { FontRoles, TypeScale, TypefaceSpecimens } from './type-specimens';

// A fixture story shows the block on its own with sample props. It is not a DocPage. Typefaces, font roles and the type scale.
const meta = { title: 'Fixtures/Type specimens', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <TypefaceSpecimens />
      <FontRoles />
      <TypeScale />
    </div>
  ),
};
