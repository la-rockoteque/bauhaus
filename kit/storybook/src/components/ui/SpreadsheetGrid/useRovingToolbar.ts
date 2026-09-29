import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';

/** What the bar treats as one of its own items — never a checkbox in the open column menu. */
const ITEMS = 'button, summary';

/**
 * A `role="toolbar"` owes arrow-key navigation and ONE tab stop — the ARIA practices guide's
 * roving tabindex. Without it the bar is thirteen stops a keyboard user crosses before reaching
 * the first cell, every time they tab into the grid.
 *
 * Driven off the DOM rather than a ref per control: the bar holds buttons and a `<summary>`,
 * the disabled ones move in and out of the list as the selection changes, and one query says
 * what is reachable right now.
 */
export function useRovingToolbar(bar: RefObject<HTMLElement | null>) {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = (): HTMLElement[] =>
    [...(bar.current?.querySelectorAll<HTMLElement>(ITEMS) ?? [])].filter(
      (el) => !el.matches(':disabled') && !el.closest('.mo-grid-columns-menu'),
    );

  useEffect(() => {
    const reachable = items();
    const active = Math.min(activeIndex, reachable.length - 1);
    reachable.forEach((el, i) => {
      el.tabIndex = i === active ? 0 : -1;
    });
  });

  const target = (key: string, from: number, count: number): number | null => {
    if (key === 'Home') return 0;
    if (key === 'End') return count - 1;
    if (key === 'ArrowRight') return (from + 1 + count) % count;
    if (key === 'ArrowLeft') return (from - 1 + count) % count;
    return null;
  };

  return {
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      // A checkbox in the open column menu is not a toolbar item; arrows there are the menu's.
      if (event.target instanceof HTMLInputElement) return;

      const reachable = items();
      if (reachable.length === 0) return;

      const from = reachable.indexOf(document.activeElement as HTMLElement);
      const next = target(event.key, from, reachable.length);
      if (next === null) return;

      event.preventDefault();
      setActiveIndex(next);
      reachable[next].focus();
    },
    onFocusCapture: (event: { target: EventTarget }) => {
      const at = items().indexOf(event.target as HTMLElement);
      if (at >= 0) setActiveIndex(at);
    },
  };
}

/** A ref for the bar this hook drives, so the caller does not have to name the element type. */
export function useToolbarRef() {
  return useRef<HTMLDivElement>(null);
}
