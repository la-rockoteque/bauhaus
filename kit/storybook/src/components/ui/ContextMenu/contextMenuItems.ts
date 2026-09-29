import type { ReactNode } from 'react';

/** One thing the menu can do. `onSelect` runs and the menu closes. */
export interface ContextMenuAction {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  /** A shortcut the same action already answers to, drawn right-aligned. */
  hint?: string;
  onSelect: () => void;
}

/** A rule between groups of actions. Never focusable, never the first or last thing drawn. */
export interface ContextMenuSeparator {
  key: string;
  separator: true;
}

export type ContextMenuItem = ContextMenuAction | ContextMenuSeparator;

export function isAction(item: ContextMenuItem): item is ContextMenuAction {
  return !('separator' in item);
}

/**
 * The items as the menu will draw them: no separator at either end, and never two in a row.
 *
 * Callers build their lists conditionally — « paste » only on a writable grid, « tout afficher »
 * only when something is hidden — so a group vanishing leaves its rule behind. Trimming here
 * means no caller has to think about it.
 */
export function tidy(items: readonly ContextMenuItem[]): ContextMenuItem[] {
  const out: ContextMenuItem[] = [];

  for (const item of items) {
    if (isAction(item)) {
      out.push(item);
      continue;
    }
    // A rule is only worth drawing after something and before something else.
    if (out.length > 0 && isAction(out[out.length - 1])) out.push(item);
  }

  while (out.length > 0 && !isAction(out[out.length - 1])) out.pop();
  return out;
}

/** Where the menu's keyboard can land: the actions that are not disabled. */
export function focusable(items: readonly ContextMenuItem[]): ContextMenuAction[] {
  return items.filter(isAction).filter((item) => !item.disabled);
}
