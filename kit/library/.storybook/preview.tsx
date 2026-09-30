import type { Preview } from '@storybook/react-vite';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/preview-api';
import '../dist/tokens.css';
import '../foundations/typography/fonts.css';
import '../foundations/motion/motion.css';
import '../foundations/color/series.css';
import { GuideContainer } from '../fixtures/guide/guide';

/**
 * The toolbar sets data-theme on <html>. A guide renders no story, so no decorator runs there:
 * the theme is applied from the channel instead, which covers stories and guides alike.
 */
const applyTheme = (theme?: string) => {
  if (theme) document.documentElement.dataset.theme = theme;
};
const channel = addons.getChannel();
channel.on(SET_GLOBALS, ({ globals }) => applyTheme(globals?.theme));
channel.on(GLOBALS_UPDATED, ({ globals }) => applyTheme(globals?.theme));

const preview: Preview = {
  globalTypes: {
    theme: { description: 'Theme', toolbar: { title: 'Theme', icon: 'circlehollow', items: ['light', 'dark'], dynamicTitle: true } },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      applyTheme(context.globals.theme);
      return Story();
    },
  ],
  parameters: {
    layout: 'fullscreen',
    docs: { container: GuideContainer },
    options: {
      storySort: {
        order: ['Principles', 'Foundations', 'Themes', 'Primitives', 'Clickables', 'Fields', 'Data structures', 'Feedback', 'Overlays', 'Navigation', 'Patterns', 'Fixtures'],
      },
    },
  },
};

export default preview;
