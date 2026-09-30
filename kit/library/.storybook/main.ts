import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

// Pages sit beside their component, so the globs start at the package root.
const config: StorybookConfig = {
  stories: ['../**/*.mdx', '../**/*.stories.@(ts|tsx)', '!../node_modules/**', '!../dist/**'],
  addons: [
    { name: '@storybook/addon-docs', options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } } },
    'storybook-addon-pseudo-states',
  ],
  framework: '@storybook/react-vite',
};

export default config;
