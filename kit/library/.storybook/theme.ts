import { create } from 'storybook/theming/create';
import { tokens } from '../dist/tokens';
import { managerValues } from './theme-values';

/** Storybook's own chrome, dressed in the design system's tokens. Restrained: the primary blue and greys. */
export const bauhausTheme = create({
  base: 'light',
  brandTitle: 'Bauhaus design system',
  brandUrl: './',
  brandTarget: '_self',
  ...managerValues(tokens),
});
