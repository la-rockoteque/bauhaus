import { useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';

export type RovingOrientation = 'horizontal' | 'vertical';

export interface RovingFocusOptions {
  count: number;
  orientation: RovingOrientation;
  /** Items to skip when arrows, Home and End look for the next stop. */
  isDisabled?: (index: number) => boolean;
  /** The item that holds the tab stop while focus is outside the group, such as the selected tab. */
  fallbackIndex: number;
  /** Called after focus moves to an item by key. */
  onMove?: (index: number) => void;
}

const NEVER = () => false;
const KEYS: Record<RovingOrientation, { prev: string; next: string }> = {
  horizontal: { prev: 'ArrowLeft', next: 'ArrowRight' },
  vertical: { prev: 'ArrowUp', next: 'ArrowDown' },
};

/**
 * APG roving tabindex: the group has one tab stop; the arrows of its orientation move focus and wrap,
 * Home and End jump to the ends, disabled items are skipped. Arrows are not mirrored in a right-to-left page.
 */
export function useRovingFocus({ count, orientation, isDisabled = NEVER, fallbackIndex, onMove }: RovingFocusOptions) {
  const items = useRef<(HTMLElement | null)[]>([]);
  const [focused, setFocused] = useState<number | null>(null);
  const stop = focused ?? fallbackIndex;

  const step = (from: number, direction: 1 | -1): number => {
    for (let k = 1; k <= count; k++) {
      const index = (((from + direction * k) % count) + count) % count;
      if (!isDisabled(index)) return index;
    }
    return from;
  };
  const edge = (direction: 1 | -1): number => (direction === 1 ? step(-1, 1) : step(count, -1));

  const focusItem = (index: number) => {
    items.current[index]?.focus();
    setFocused(index);
    onMove?.(index);
  };

  const getItemProps = (index: number) => ({
    ref: (element: HTMLElement | null) => {
      items.current[index] = element;
    },
    tabIndex: index === stop ? 0 : -1,
    onFocus: () => setFocused(index),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const { prev, next } = KEYS[orientation];
      const target = event.key === next ? step(index, 1) : event.key === prev ? step(index, -1) : event.key === 'Home' ? edge(1) : event.key === 'End' ? edge(-1) : null;
      if (target === null) return;
      event.preventDefault();
      focusItem(target);
    },
  });

  /** Spread on the group element. Once focus leaves, the tab stop goes back to the fallback item. */
  const groupProps = {
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null);
    },
  };

  return { getItemProps, groupProps };
}
