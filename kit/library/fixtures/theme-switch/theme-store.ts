import { UPDATE_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/preview-api';
import { createContext, useContext, useSyncExternalStore } from 'react';
import { THEMES } from '../rulebook/tokens';

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

/** The theme a section panel forces on its content, or null when it follows the page. */
export const PanelTheme = createContext<string | null>(null);

/** The page's theme, live, ignoring any panel. */
export const usePageTheme = (): string => useSyncExternalStore(subscribe, current, () => THEMES[0]);

/** The theme in effect here: the enclosing panel's, else the page's. */
export const useTheme = (): string => {
  const page = usePageTheme();
  return useContext(PanelTheme) ?? page;
};

export function setTheme(theme: string): void {
  document.documentElement.dataset.theme = theme;
  try {
    addons.getChannel().emit(UPDATE_GLOBALS, { globals: { theme } });
  } catch {
    // Outside Storybook there is no channel; the attribute alone is enough.
  }
}
