import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useLockPageScroll } from '../../hooks/useLockPageScroll';
import './ThreadPanel.css';

/**
 * The chrome every comment thread shares: a portalled overlay, one scrolling body, and a
 * composer pinned under it.
 *
 * **This is the component TM-99 is about.** The tracker grew its own thread inside a table row
 * and inherited none of this, so the composer ended up nested inside `.tracker-table-container`
 * — which sets `overflow-x: auto`, and CSS computes the other axis to `auto` when one axis is
 * not `visible`. Three scrollers stacked under the caret. The rule this panel exists to keep is
 * narrower than "one scroller at a time": **never nest a scroll container inside another.** Two
 * side by side are fine — a portalled fixed panel does not move when the page scrolls, so
 * nothing nests.
 *
 * Which is why each of these is load-bearing rather than decoration:
 * - `createPortal` to `document.body`, so no scrolling ancestor can clip the panel or its popovers.
 * - `flex-direction: column` with the body at `flex: 1; overflow-y: auto` and the composer at
 *   `flex-shrink: 0` — exactly one element owns the scroll, and the composer never leaves view.
 * - the page behind is held while the panel is open (`useLockPageScroll`, counted), so it
 *   cannot scroll underneath and steal a wheel gesture aimed at the thread.
 *
 * What a thread renders *inside* the body is its own business: a requisition's comments carry
 * system rows, transfers and edit affordances that a tracker task deliberately has none of.
 * Sharing the chrome is what removes the bug; merging the two comment renderers would only
 * trade three copies of this for one component with a `kind` switch.
 */
interface ThreadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Named, because a panel that says only « Discussion » leaves you guessing what it belongs to. */
  title: string;
  /** Beside the close button — mute, and whatever else a given thread owns. */
  headerActions?: ReactNode;
  /** The thread itself. The body scrolls this and nothing else. */
  children: ReactNode;
  /**
   * Pinned under the thread, outside the scroller — one composer for one thread.
   *
   * Optional, because a panel that groups several threads (a shipment's requisitions) gives
   * each group its own composer inside the body instead. That is a layout difference, not a
   * different panel: the chrome, the single scroller and the scroll lock are the same either way.
   */
  composer?: ReactNode;
  /** Errors and the like, under the composer. */
  footer?: ReactNode;
  /**
   * How many items the thread holds. The body jumps to the newest when this grows — but only
   * then, so re-reading an old comment is not yanked back to the bottom on every refetch.
   */
  itemCount: number;
  /**
   * A `data-comment-id` to scroll into view and flash once, for a deep link from a
   * notification. Takes precedence over following the newest.
   */
  focusItemId?: string | number | null;
  /** Set on the focused item for the duration of the flash, so the caller can style it. */
  onFocusItem?: (id: string | number | null) => void;
}

/** Long enough to notice, short enough not to linger once you have found the comment. */
const FLASH_MS = 2200;

type BodyRef = RefObject<HTMLDivElement | null>;

/** Same set Modal.tsx traps against. The SELECTOR is identical; so is the logic below — an
 * earlier version copied only this line and left the trap leaking. */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab inside the panel.
 *
 * Three cases, and the first version of this had only the third — which made it useless in the
 * one situation it exists for. `useDialogFocus` focuses the panel CONTAINER on open, and the
 * container is neither the first focusable nor the last, so a wrap that only tests those two
 * never fired: the first Shift+Tab walked straight out to the page behind the scrim, and once
 * focus was outside, `activeElement` was never `first` or `last` again, so nothing pulled it
 * back. `Modal.tsx:66-76` has all three; only its selector string had been copied here.
 */
function wrapFocus(panel: HTMLDivElement, e: KeyboardEvent) {
  const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  const active = document.activeElement;

  // Nothing to land on — keep the key rather than hand it to the page underneath.
  if (focusable.length === 0) {
    e.preventDefault();
    panel.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  // Recovery: focus is already outside. Without this, one escape is permanent.
  if (!panel.contains(active)) {
    e.preventDefault();
    first.focus();
    return;
  }

  // The container counts as « at the front »: this is the branch that fires on the first
  // Shift+Tab after opening, when focus is still on the panel itself.
  const leavingBackwards = e.shiftKey && (active === first || active === panel);
  const leavingForwards = !e.shiftKey && active === last;
  if (!leavingBackwards && !leavingForwards) return;

  e.preventDefault();
  (leavingBackwards ? last : first).focus();
}

/**
 * Focus belongs to the panel while it is open, and goes back where it came from when it closes.
 *
 * `Modal.tsx` in the next directory does all of this; the thread panel never did, because it
 * grew as a page component rather than an overlay. Promoting it to the design system is the
 * moment to stop shipping that: without it, Tab from an open panel walks the table underneath
 * the scrim, and a screen reader is never told anything opened.
 */
function useDialogFocus(panelRef: RefObject<HTMLDivElement | null>, isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    const returnTo = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (panelRef.current) wrapFocus(panelRef.current, e);
    };

    document.addEventListener('keydown', trap);
    return () => {
      document.removeEventListener('keydown', trap);
      // Back to whatever opened the panel — the row button, not the top of the page.
      returnTo?.focus();
    };
  }, [panelRef, isOpen]);
}

/** `CSS.escape` where it exists; the same escaping by hand where it does not (happy-dom). */
const cssEscape = (value: string): string =>
  typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
    ? CSS.escape(value)
    : value.replace(/["\\]/g, '\\$&');

/** Escape closes the panel. A child that consumes Escape — a suggestion list — stops it first. */
function useDismissOnEscape(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);
}

/**
 * The body follows the newest item — but only when the count actually grew, so re-reading an
 * old comment is not yanked to the bottom by a refetch that changed nothing.
 */
function useFollowNewest(bodyRef: BodyRef, isOpen: boolean, itemCount: number, paused: boolean) {
  const prevCountRef = useRef(0);

  useEffect(() => {
    // Forget the count on close. The panels render unconditionally and pass `isOpen`
    // (`RequisitionSidePanels.tsx:24`), so this ref outlives the body that the count described
    // — while the body itself is unmounted and comes back scrolled to the top. Without the
    // reset, reopening a thread nobody has posted to since finds the count unchanged, declines
    // to scroll, and drops you at the top of a twelve-comment thread instead of at its newest.
    if (!isOpen) {
      prevCountRef.current = 0;
      return;
    }
    if (paused || itemCount === prevCountRef.current) return;
    prevCountRef.current = itemCount;
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [bodyRef, isOpen, itemCount, paused]);
}

/**
 * A deep link from a notification: bring the named item into view and flash it once. Takes
 * precedence over following the newest, which is why that one pauses while this is set.
 */
function useFocusItem({
  bodyRef,
  isOpen,
  itemCount,
  focusItemId,
  onFocusItem,
}: {
  bodyRef: BodyRef;
  isOpen: boolean;
  itemCount: number;
  focusItemId: string | number | null | undefined;
  onFocusItem?: (id: string | number | null) => void;
}) {
  useEffect(() => {
    // `itemCount` is a dependency because the panel opens BEFORE its thread arrives. Without it
    // the effect runs once against « Chargement… », finds nothing, and never runs again — so
    // the deep link from a notification lands at the top of the thread and the comment it
    // named is never scrolled to. It only appeared to work when the thread was already cached,
    // which is never the path the feature exists for.
    const hasThread = isOpen && itemCount > 0;
    if (!hasThread || focusItemId == null) return;

    // Wait for paint: the item has to exist before it can be scrolled to.
    const handle = requestAnimationFrame(() => {
      // Escaped as a contract, not against a live caller: every `data-comment-id` written today
      // is a requisition comment's numeric id, and nothing crafted reaches this. The prop is
      // `string | number` because the panel is a primitive now, and an unescaped string in an
      // attribute selector is a malformed-selector throw waiting for the first id with a quote.
      const node = bodyRef.current?.querySelector(
        `[data-comment-id="${cssEscape(String(focusItemId))}"]`,
      );
      if (!(node instanceof HTMLElement)) return;
      node.scrollIntoView({ block: 'center', behavior: 'smooth' });
      onFocusItem?.(focusItemId);
      setTimeout(() => onFocusItem?.(null), FLASH_MS);
    });
    return () => cancelAnimationFrame(handle);
  }, [bodyRef, isOpen, itemCount, focusItemId, onFocusItem]);
}

export function ThreadPanel({
  isOpen,
  onClose,
  title,
  headerActions,
  children,
  composer,
  footer,
  itemCount,
  focusItemId,
  onFocusItem,
}: ThreadPanelProps) {
  const { t } = useTranslation('common');
  const bodyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const targeted = focusItemId != null;
  useDismissOnEscape(isOpen, onClose);
  useDialogFocus(panelRef, isOpen);
  useLockPageScroll(isOpen);
  useFollowNewest(bodyRef, isOpen, itemCount, targeted);
  useFocusItem({ bodyRef, isOpen, itemCount, focusItemId, onFocusItem });

  if (!isOpen) return null;

  return createPortal(
    <div className="mo-panel-scrim" onClick={onClose}>
      <div
        ref={panelRef}
        className="mo-panel"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mo-panel-head">
          <h3 className="mo-panel-title">{title}</h3>
          <div className="mo-panel-head-actions">
            {headerActions}
            <button
              className="mo-panel-close"
              onClick={onClose}
              aria-label={t('discussion.panelClose')}
            >
              ×
            </button>
          </div>
        </div>

        <div className="mo-panel-body" ref={bodyRef}>
          {children}
        </div>

        {(composer || footer) && (
          <div className="mo-panel-foot">
            {composer}
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
