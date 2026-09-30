import { UPDATE_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/preview-api';
import { useSyncExternalStore } from 'react';
import { THEMES } from './tokens';

/**
 * The active theme lives on <html data-theme>. Pages read it, and the switch writes it and tells
 * the toolbar, so the toolbar and every switch on the page stay one control.
 */
const subscribe = (notify: () => void): (() => void) => {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};

const current = (): string => document.documentElement.dataset.theme ?? THEMES[0];

/** The selected theme, live. */
export const useTheme = (): string => useSyncExternalStore(subscribe, current, () => THEMES[0]);

export function setTheme(theme: string): void {
  document.documentElement.dataset.theme = theme;
  try {
    addons.getChannel().emit(UPDATE_GLOBALS, { globals: { theme } });
  } catch {
    // Outside Storybook there is no channel; the attribute alone is enough.
  }
}
