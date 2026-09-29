import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './contextMenu.css';
import { focusable, isAction, tidy, type ContextMenuItem } from './contextMenuItems';
import { placeMenu, type Point } from './contextMenuPlacement';

/**
 * The menu a right-click opens: a list of actions, placed at the pointer.
 *
 * Its own component rather than part of any one surface, because a context menu is the same
 * thing everywhere — a list, a position, and the manners a menu owes. What goes *in* it is the
 * caller's; none of it knows what a grid or a cell is.
 *
 * Through a portal, and `position: fixed`: a menu that inherited its parent's `overflow` would
 * be clipped by the very scroller it was opened inside, which is where most right-clicks happen.
 *
 * The manners, which is most of the work:
 *  - opens with focus on the menu, so the keyboard is already in it
 *  - arrows move, Home and End jump, Enter and Space choose, Escape closes
 *  - closes on an outside press, on scroll, and on resize — a menu pinned to a point is wrong
 *    the moment the thing it was about moves
 *  - returns focus to whatever had it, because the click that opened this took it away
 */
export function ContextMenu({
  at,
  items,
  label,
  onClose,
}: {
  /** Viewport coordinates — where the pointer was. */
  at: Point;
  items: readonly ContextMenuItem[];
  /** Names the menu for assistive tech — « Actions de la cellule ». */
  label: string;
  onClose: () => void;
}) {
  const menu = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [placed, setPlaced] = useState<Point | null>(null);
  const [active, setActive] = useState(0);

  const drawn = tidy(items);
  const reachable = focusable(drawn);

  // Measured, then placed: where it fits cannot be known until it has a size, and a menu that
  // rendered at the raw point first would jump.
  useLayoutEffect(() => {
    const element = menu.current;
    if (!element) return;
    const box = element.getBoundingClientRect();
    setPlaced(
      placeMenu(at, { width: box.width, height: box.height }, {
        width: window.innerWidth,
        height: window.innerHeight,
      }),
    );
  }, [at]);

  useEffect(() => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    menu.current?.focus();

    return () => {
      if (opener.current?.isConnected) opener.current.focus();
    };
  }, []);

  useEffect(() => {
    // Containment, not `stopPropagation`: these listen in the CAPTURE phase — so the press
    // closes the menu before whatever is under it reacts — and capture runs before any React
    // handler on the menu could stop anything.
    const outside = (event: Event) => !menu.current?.contains(event.target as Node);
    const close = (event: Event) => {
      if (outside(event)) onClose();
    };

    document.addEventListener('pointerdown', close, true);
    // A menu taller than the viewport scrolls itself, and closing on that would be absurd.
    window.addEventListener('scroll', close, true);
    const onResize = () => onClose();
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('pointerdown', close, true);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', onResize);
    };
  }, [onClose]);

  const choose = (index: number) => {
    const item = reachable[index];
    if (!item) return;
    onClose();
    item.onSelect();
  };

  // The document listener is subscribed once; these keep it looking at the current list.
  const reachableRef = useRef(reachable);
  const chooseRef = useRef(() => choose(active));
  useEffect(() => {
    reachableRef.current = reachable;
    chooseRef.current = () => choose(active);
  });

  // On the document, not on the menu: the surface underneath often takes focus back after the
  // right-click that opened this — react-data-grid moves its cell cursor onto the cell — and a
  // handler that only fired while the menu held focus would never see the Escape.
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const last = reachableRef.current.length - 1;
      const moves: Record<string, (index: number) => number> = {
        ArrowDown: (index: number) => (index >= last ? 0 : index + 1),
        ArrowUp: (index: number) => (index <= 0 ? last : index - 1),
        Home: () => 0,
        End: () => last,
      };

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        chooseRef.current();
        return;
      }
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      event.stopPropagation();
      setActive((index) => move(index));
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  return createPortal(
    <div
      ref={menu}
      className="mo-context-menu"
      role="menu"
      aria-label={label}
      tabIndex={-1}
      // Hidden until measured, rather than drawn at the wrong place for a frame.
      style={
        placed
          ? { insetInlineStart: placed.x, insetBlockStart: placed.y }
          : { insetInlineStart: at.x, insetBlockStart: at.y, visibility: 'hidden' }
      }
      onContextMenu={(event) => event.preventDefault()}
    >
      {drawn.map((item) =>
        isAction(item) ? (
          <button
            key={item.key}
            type="button"
            role="menuitem"
            className="mo-context-menu-item"
            disabled={item.disabled}
            data-active={reachable[active]?.key === item.key ? '' : undefined}
            onMouseEnter={() => {
              const index = reachable.findIndex((r) => r.key === item.key);
              if (index >= 0) setActive(index);
            }}
            onClick={() => {
              onClose();
              item.onSelect();
            }}
          >
            {item.icon && (
              <span className="mo-context-menu-icon" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span className="mo-context-menu-label">{item.label}</span>
            {item.hint && <kbd className="mo-context-menu-hint">{item.hint}</kbd>}
          </button>
        ) : (
          <hr key={item.key} className="mo-context-menu-rule" />
        ),
      )}
    </div>,
    document.body,
  );
}
