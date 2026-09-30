import { useEffect, useId, useRef } from 'react';
import type { DialogHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import { Heading } from '../../../primitives/heading/heading';
import { IconButton } from '../../clickables/icon-button/icon-button';
import './modal.css';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'open' | 'onClose' | 'role'> {
  /** Whether the dialog is shown. The parent owns this state. */
  open: boolean;
  /** Called on Escape, on a scrim click (when allowed), and on the close button. Set `open` to false in response. */
  onClose: () => void;
  /** The name of the dialog. It labels the dialog and is the fallback focus target. */
  title: ReactNode;
  /** The actions row. It stays in view while the body scrolls. */
  footer?: ReactNode;
  /** Maximum inline size, from size.overlay.*. */
  size?: ModalSize;
  /** `alertdialog` for a message that needs a response. AlertDialog and ConfirmationDialog set it. */
  role?: 'dialog' | 'alertdialog';
  /** Close on a click on the scrim. Off by default, so a stray click never loses typed work. */
  dismissOnScrim?: boolean;
  /** The accessible name of the close button. Without it, no close button is drawn. */
  closeLabel?: string;
  /** Content is loading. The body is marked aria-busy. */
  busy?: boolean;
  /** Render open, in the flow, with no scrim and no focus trap. For previews and embedded panels. */
  inline?: boolean;
}

/** Native dialog. Focus enters on open (a `data-autofocus` element first, else the first focusable, else the title) and returns to the opener on close. */
export function Modal({
  open, onClose, title, footer, size = 'md', role = 'dialog', dismissOnScrim = false, closeLabel, busy = false, inline = false, className, children, ...rest
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el || inline) return;
    if (open && !el.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      el.showModal();
      const preferred = el.querySelector<HTMLElement>('[data-autofocus]');
      if (preferred) preferred.focus();
      else if (!el.contains(document.activeElement) || document.activeElement === el) el.querySelector<HTMLElement>('.ds-modal__title')?.focus();
    } else if (!open && el.open) {
      el.close();
      opener.current?.focus();
      opener.current = null;
    }
  }, [open, inline]);

  // A parent that unmounts an open dialog still gets its focus back.
  useEffect(() => () => opener.current?.focus(), []);

  const classes = ['ds-modal', `ds-modal--${size}`, inline && 'ds-modal--inline', className];
  return (
    <dialog
      {...rest}
      ref={ref}
      role={role}
      open={inline ? true : undefined}
      aria-labelledby={titleId}
      className={classes.filter(Boolean).join(' ')}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(event) => {
        if (dismissOnScrim && event.target === event.currentTarget) onClose();
      }}
    >
      <div className="ds-modal__panel">
        <div className="ds-modal__header">
          <Heading level={2} size="heading" id={titleId} tabIndex={-1} className="ds-modal__title">{title}</Heading>
          {closeLabel && <IconButton label={closeLabel} icon={<Icon glyph="close" />} onClick={onClose} />}
        </div>
        <div className="ds-modal__body" aria-busy={busy || undefined}>{children}</div>
        {footer && <div className="ds-modal__footer">{footer}</div>}
      </div>
    </dialog>
  );
}
