import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

// A slice holds its showcase (<name>.stories.tsx) and its guide (<name>.mdx) side by side,
// so the globs start at the package root. Autodocs stays off: the guide is written by hand.
const config: StorybookConfig = {
  stories: ['../**/*.stories.@(ts|tsx)', '../**/*.mdx', '!../node_modules/**', '!../dist/**'],
  addons: [
    { name: '@storybook/addon-docs', options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } } },
  ],
  framework: '@storybook/react-vite',
};

export default config;
