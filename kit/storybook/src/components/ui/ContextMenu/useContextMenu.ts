import { useCallback, useState } from 'react';
import type { Point } from './contextMenuPlacement';

/**
 * Where a right-click landed, or nothing.
 *
 * The state is the position: a menu is open exactly when there is a point to put it at, which
 * saves carrying an `isOpen` beside it that could disagree.
 */
export function useContextMenu<T = void>() {
  const [opened, setOpened] = useState<{ at: Point; target: T } | null>(null);

  return {
    opened,
    close: useCallback(() => setOpened(null), []),
    open: useCallback((event: { clientX: number; preventDefault: () => void; clientY: number }, target: T) => {
      // The browser's own menu is not this menu, and both at once is neither.
      event.preventDefault();
      setOpened({ at: { x: event.clientX, y: event.clientY }, target });
    }, []),
  };
}
