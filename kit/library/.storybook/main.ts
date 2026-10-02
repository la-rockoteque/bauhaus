import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';
import { mergeConfig } from 'vite';

// A slice holds its showcase (<name>.stories.tsx) and its guide (<name>.mdx) side by side,
// so the globs start at the package root. Autodocs stays off: the guide is written by hand.
// Fixtures have no stories; their tests cover them. The one utility built as a fixture comes in by name.
const config: StorybookConfig = {
  stories: [
    '../!(fixtures|node_modules|dist)/**/*.stories.@(ts|tsx)',
    '../!(fixtures|node_modules|dist)/**/*.mdx',
    '../fixtures/palette-generator/palette-generator.stories.tsx',
  ],
  addons: [
    { name: '@storybook/addon-docs', options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } } },
  ],
  framework: '@storybook/react-vite',
  // The release notice is Storybook's own chrome, not the design system's.
  core: { disableWhatsNewNotifications: true },
  // The Examples pages print each element back as JSX by its component's name, so the build keeps the names.
  viteFinal: (vite) => mergeConfig(vite, { esbuild: { keepNames: true } }),
};

export default config;
