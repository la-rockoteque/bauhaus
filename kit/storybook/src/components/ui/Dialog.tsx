import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useLockPageScroll } from '../../hooks/useLockPageScroll';
import { IconButton } from './IconButton';
import './Dialog.forms.css';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'default' | 'narrow' | 'wide' | 'xl';
  className?: string;
  /** Actions, pinned under the scrolling body. */
  footer?: ReactNode;
  /** A request is in flight: Escape, the backdrop and the close button stop closing. */
  pending?: boolean;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// An autoFocus child already holds focus: leave it where it landed.
function useFocusContentOnOpen(isOpen: boolean, contentRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const content = contentRef.current;
    if (content && !content.contains(document.activeElement)) {
      content.focus();
    }
  }, [isOpen, contentRef]);
}

function useReturnFocus(isOpen: boolean, contentRef: RefObject<HTMLDivElement | null>) {
  // The trigger is read while rendering the open, because a child's `autoFocus` moves focus
  // during commit, before any effect could see where it was.
  const [wasOpen, setWasOpen] = useState(false);
  const [returnFocusTo, setReturnFocusTo] = useState<HTMLElement | null>(null);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    setReturnFocusTo(isOpen ? (document.activeElement as HTMLElement | null) : null);
  }

  useFocusContentOnOpen(isOpen, contentRef);

  // Not keyed on onClose, so a fresh onClose identity each render never re-steals focus.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const content = contentRef.current;
    return () => {
      // A real close has already removed the surface; StrictMode's rehearsal unmount has not, and
      // handing focus back then would pull it off an autoFocus child for good.
      if (!content?.isConnected && returnFocusTo?.isConnected) {
        returnFocusTo.focus();
      }
    };
  }, [isOpen, returnFocusTo, contentRef]);
}

// The open dialogs, oldest first: only the last one answers Escape and Tab.
const openDialogs: RefObject<HTMLDivElement | null>[] = [];

function useDialogKeys(
  isOpen: boolean,
  close: (() => void) | undefined,
  contentRef: RefObject<HTMLDivElement | null>,
) {
  // Keyed on isOpen alone: a parent re-render that renews `close` must not lift it back on top.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    openDialogs.push(contentRef);
    return () => {
      openDialogs.splice(openDialogs.lastIndexOf(contentRef), 1);
    };
  }, [isOpen, contentRef]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (openDialogs[openDialogs.length - 1] !== contentRef) {
        return;
      }
      // A child that consumed the Escape (an open autocomplete list) prevented it first.
      if (e.key === 'Escape' && !e.defaultPrevented) {
        close?.();
      } else if (e.key === 'Tab' && contentRef.current) {
        trapTab(e, contentRef.current);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close, contentRef]);
}

function trapTab(e: KeyboardEvent, content: HTMLElement) {
  const target = tabTarget(e.shiftKey, content);
  if (target) {
    e.preventDefault();
    target.focus();
  }
}

// Where Tab must land instead of the browser's default, or null to let it through.
function tabTarget(backwards: boolean, content: HTMLElement): HTMLElement | null {
  const focusable = Array.from(content.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (!first) return content;
  // Focus that escaped to the body is pulled back rather than let walk the background.
  if (!content.contains(active)) return first;
  if (backwards) return active === first || active === content ? last : null;
  return active === last ? first : null;
}

/** The `.mo-dialog` primitive: a portalled modal that traps Tab, closes on Escape and hands focus back. */
export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  size = 'default',
  className,
  footer,
  pending = false,
}: DialogProps) {
  const { t } = useTranslation('common');
  const titleId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  // A press that starts in the surface and ends on the backdrop is a text selection, not a dismissal.
  const pressedBackdrop = useRef(false);
  const close = pending ? undefined : onClose;

  useReturnFocus(isOpen, contentRef);

  useDialogKeys(isOpen, close, contentRef);

  // Counted, so a dialog opened over a panel does not hand the page its scroll back while the panel stays.
  useLockPageScroll(isOpen);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="mo-dialog"
      onMouseDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={() => {
        if (pressedBackdrop.current) close?.();
      }}
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={['mo-dialog-surface', size !== 'default' && `mo-dialog-surface--${size}`, className]
          .filter(Boolean)
          .join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mo-dialog-head">
          <h2 id={titleId} className="mo-dialog-title">
            {title}
          </h2>
          <IconButton
            className="mo-dialog-close"
            icon="×"
            label={t('actions.close')}
            onClick={close}
            disabled={pending}
          />
        </div>
        <div className="mo-dialog-body">{children}</div>
        {footer && <div className="mo-dialog-foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
