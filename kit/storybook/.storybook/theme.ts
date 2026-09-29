import { create } from 'storybook/theming/create'
import { storybookTokens as t } from './tokens'

/** Storybook's own chrome — sidebar, toolbar, docs — dressed in the app's tokens. */
export const moflexTheme = create({
  base: 'light',

  brandTitle: 'MoFlex — Design system',
  brandUrl: './',
  brandTarget: '_self',
  // No brandImage: assets/moflex-logo.png is drawn for the app's navy top bar and
  // washes out on the sidebar's light surface. The title carries the brand instead.

  colorPrimary: t['--mo-primary'],
  colorSecondary: t['--mo-primary'],

  appBg: t['--mo-surface-soft'],
  appContentBg: t['--mo-surface'],
  appPreviewBg: t['--mo-surface'],
  appHoverBg: t['--mo-primary-tint'],
  appBorderColor: t['--mo-line'],
  appBorderRadius: parseInt(t['--mo-radius-md'], 10),

  fontBase: t['--mo-font-body'],
  fontCode: t['--mo-font-mono'],

  textColor: t['--mo-ink'],
  textInverseColor: t['--mo-surface'],
  textMutedColor: t['--mo-muted'],

  barBg: t['--mo-surface'],
  barTextColor: t['--mo-muted'],
  barHoverColor: t['--mo-primary'],
  barSelectedColor: t['--mo-primary'],

  buttonBg: t['--mo-surface-soft'],
  buttonBorder: t['--mo-line'],
  booleanBg: t['--mo-surface-sunk'],
  booleanSelectedBg: t['--mo-surface'],

  inputBg: t['--mo-surface'],
  inputBorder: t['--mo-line'],
  inputTextColor: t['--mo-ink'],
  inputBorderRadius: parseInt(t['--mo-radius-md'], 10),
})
