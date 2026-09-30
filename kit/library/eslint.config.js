// `structure.mjs check` enforces the same rules from the outside; this file gives the editor an early warning.
// Flat config replaces a rule per matching block, so every block repeats the app-concern ban.
import tsParser from '@typescript-eslint/parser';

const APP_CONCERNS = ['i18next', 'react-i18next', 'react-intl', 'react-router', 'react-router-dom', 'next/router', 'next/navigation', '@tanstack/react-query', 'axios', 'swr', '@apollo/client'];
const restrict = (patterns) => ({ 'no-restricted-imports': ['error', { patterns }] });
const appRule = { group: [...APP_CONCERNS, '@/*', '~/*'], message: 'The library never uses an app concern. Take text, links and data as props.' };
const layer = (dir, group, message) => ({ files: [`${dir}/**/*.{ts,tsx}`], ignores: ['**/*.stories.tsx'], rules: restrict([appRule, { group, message }]) });

export default [
  { ignores: ['dist', 'node_modules', 'storybook-static'] },
  { files: ['**/*.{ts,tsx}'], languageOptions: { parser: tsParser }, rules: restrict([appRule]) },
  layer('foundations', ['../*'], 'A foundation imports nothing outside its own slice.'),
  layer('themes', ['../*'], 'A theme imports nothing outside its own slice.'),
  layer('primitives', ['**/components/**', '**/patterns/**'], 'A primitive imports foundations and other primitives only.'),
  layer('components', ['**/patterns/**'], 'A component never imports a pattern.'),
  // A showcase is documentation: it may import the page builder in .storybook/doc-page, never an app concern.
  { files: ['**/*.stories.tsx'], rules: restrict([appRule]) },
];
