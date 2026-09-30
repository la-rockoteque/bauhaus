import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../doc-page/doc-page';
import { themePage } from './themes-page';

// A fixture story shows the block on its own with sample props. It is not a DocPage. The props of the Themes showcase.
const meta = { title: 'Fixtures/Themes page', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => <DocPage {...themePage('themes--docs', 'Themes')} />,
};
