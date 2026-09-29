import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The grid taking the whole browser window — a panel pinned over the page, not the platform's
 * full screen.
 *
 * The OS kind hides the browser's own chrome, which is wrong for a tool someone works in beside
 * the rest of the app: the tabs, the address bar and the app's own navigation all go away for
 * what is really « make this bigger ». It also costs a user gesture to enter, cannot be driven
 * from a test, and leaves on an Escape the page never sees. A fixed overlay has none of that
 * and looks the same to the person using it.
 *
 * What it still owes, and does: Escape closes it, the page behind does not scroll while it is
 * open, and focus goes back to whatever opened it (WCAG 2.4.3).
 */
export function useExpanded(
  onCollapse?: () => void,
  openOnMount = false,
  onChange?: (isExpanded: boolean) => void,
) {
  const [isExpanded, setIsExpanded] = useState(openOnMount);
  const opener = useRef<HTMLElement | null>(null);

  // Read through refs so the listeners below subscribe once rather than on every render of a
  // caller that passes fresh closures.
  const latest = useRef({ onCollapse, onChange });
  useEffect(() => {
    latest.current = { onCollapse, onChange };
  });

  const collapse = useCallback(() => {
    setIsExpanded(false);
    latest.current.onCollapse?.();
    latest.current.onChange?.(false);
    if (opener.current?.isConnected) opener.current.focus();
    opener.current = null;
  }, []);

  const expand = useCallback(() => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsExpanded(true);
    latest.current.onChange?.(true);
  }, []);

  useWhileExpanded(isExpanded, collapse);

  return {
    isExpanded,
    toggle: useCallback(() => (isExpanded ? collapse() : expand()), [isExpanded, collapse, expand]),
  };
}

/**
 * What holds only while the panel is over the page: Escape closes it, and the page behind does
 * not scroll — a scroll that moved it anyway would strand the reader somewhere else when they
 * close the grid.
 */
function useWhileExpanded(isExpanded: boolean, collapse: () => void): void {
  useEffect(() => {
    if (!isExpanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') collapse();
    };
    document.addEventListener('keydown', onKeyDown);

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [isExpanded, collapse]);
}
