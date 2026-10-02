import { create } from 'storybook/theming/create';
import { themes, tokens } from '../dist/tokens';
import { managerValues, withTheme } from './theme-values';

const brand = { brandTitle: 'Bauhaus design system', brandUrl: './', brandTarget: '_self' } as const;

/** Storybook's own chrome, dressed in the design system's tokens. Restrained: the primary blue and greys. */
export const bauhausTheme = create({ base: 'light', ...brand, ...managerValues(tokens) });

/** The same chrome in each theme, so the sidebar and toolbar follow the toolbar's theme switch. */
export const bauhausThemes = {
  light: bauhausTheme,
  dark: create({ base: 'dark', ...brand, ...managerValues(withTheme(tokens, themes.dark)) }),
} as const;
