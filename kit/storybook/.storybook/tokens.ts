/**
 * The design-system values Storybook's own chrome needs, restated as literals.
 *
 * The manager runs in its own document — `src/index.css` never reaches it, so the
 * `--mo-*` custom properties are not readable there and this is the one place the
 * tokens have to be duplicated. They MUST stay equal to `src/styles/design-system.css`;
 * `src/styles/storybookTheme.tokens.test.ts` fails when one drifts.
 *
 * No imports on purpose: the test reads this file without dragging in Storybook.
 */
export const storybookTokens = {
  '--mo-ink': '#213547',
  '--mo-muted': '#5a6b80',
  '--mo-surface': '#ffffff',
  '--mo-surface-soft': '#f5f7fa',
  '--mo-surface-sunk': '#edf2f8',
  '--mo-line': '#cfd8e3',
  '--mo-primary': '#244b7b',
  '--mo-primary-tint': 'rgba(36, 75, 123, 0.06)',
  '--mo-radius-md': '4px',
  '--mo-font-body':
    "'IBM Plex Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  '--mo-font-mono':
    "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
} as const
