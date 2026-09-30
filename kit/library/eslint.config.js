// UNTESTED: written from the ESLint 9 flat-config docs, never run (no install in the template).
// Run `npx eslint .` once after `npm install` and fix the config if it reports a schema error.
// `structure.mjs check` enforces the same rules from the outside; this file gives the editor an early warning.
import tsParser from '@typescript-eslint/parser';

const APP_CONCERNS = ['i18next', 'react-i18next', 'react-intl', 'react-router', 'react-router-dom', 'next/router', 'next/navigation', '@tanstack/react-query', 'axios', 'swr', '@apollo/client'];
const restrict = (patterns) => ({ 'no-restricted-imports': ['error', { patterns }] });
const layer = (dir, group, message) => ({ files: [`${dir}/**/*.{ts,tsx}`], rules: restrict([{ group, message }]) });
const appRule = { group: [...APP_CONCERNS, '@/*', '~/*'], message: 'The library never uses an app concern. Take text, links and data as props.' };

export default [
  { ignores: ['dist', 'node_modules', 'storybook-static'] },
  { files: ['**/*.{ts,tsx}'], languageOptions: { parser: tsParser }, rules: restrict([appRule]) },
  layer('foundations', ['../*'], 'A foundation imports nothing outside its own slice.'),
  layer('themes', ['../*'], 'A theme imports nothing outside its own slice.'),
  layer('primitives', ['**/components/**', '**/patterns/**'], 'A primitive imports foundations and other primitives only.'),
  layer('components', ['**/patterns/**'], 'A component never imports a pattern.'),
];
