import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../.storybook/doc-page/doc-page';
import { themePage } from '../.storybook/doc-page/themes-page';

// One showcase for every theme: the switch in the header (or the toolbar) picks the theme it shows.
const meta = { title: 'Themes', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => <DocPage {...themePage('themes--docs', 'Themes')} />,
};
