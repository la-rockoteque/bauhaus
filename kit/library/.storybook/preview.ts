import type { Preview } from '@storybook/react-vite';
import '../dist/tokens.css';

const preview: Preview = {
  globalTypes: {
    theme: { description: 'Theme', toolbar: { icon: 'circlehollow', items: ['light', 'dark'], dynamicTitle: true } },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme;
      return Story();
    },
  ],
};

export default preview;
