import { useCallback, useEffect, useRef, useState } from 'react';
import type { FocusEvent, HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import type { IconGlyph } from '../../../primitives/icon/icon';
import { Button } from '../../clickables/button/button';
import { IconButton } from '../../clickables/icon-button/icon-button';
import './toast.css';

export type ToastStatus = 'info' | 'success' | 'warning' | 'error';

export interface ToastData {
  id: string;
  status?: ToastStatus;
  /** Optional lead line. */
  title?: ReactNode;
  message: ReactNode;
  /** One action. A toast with an action stays until the user closes it (WCAG 2.2.1). */
  action?: { label: string; onAction: () => void };
  /** Milliseconds before the toast closes itself. `null` keeps it until the user closes it. */
  duration?: number | null;
  /** Spoken name of the icon. Defaults to the status word. */
  statusLabel?: string;
}

export interface ToastRegionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  toasts: readonly ToastData[];
  onDismiss: (id: string) => void;
  /** Accessible name of each close button. */
  dismissLabel?: string;
  /** Default time on screen, in ms. Default 5000. */
  duration?: number;
  /** Most toasts shown at once. The rest wait, and show as the first ones close. Default 3. */
  max?: number;
  /** Text for the waiting toasts, such as "+2 more". */
  moreLabel?: (count: number) => string;
  /** `fixed` sits at the corner of the viewport, `static` stays in the flow (for a specimen). */
  position?: 'fixed' | 'static';
}

const GLYPH: Record<ToastStatus, IconGlyph> = { info: 'info', success: 'success', warning: 'warning', error: 'error' };
const WORD: Record<ToastStatus, string> = { info: 'Information', success: 'Success', warning: 'Warning', error: 'Error' };

// Matches --ds-motion-duration-base, the exit animation in toast.css.
const EXIT_MS = 200;

interface ToastProps {
  toast: ToastData;
  duration: number;
  dismissLabel: string;
  onDismiss: (id: string) => void;
}

function Toast({ toast, duration, dismissLabel, onDismiss }: ToastProps) {
  const { id, status = 'info', title, message, action, statusLabel } = toast;
  const total = toast.duration === undefined ? duration : toast.duration;
  const persistent = total === null || Boolean(action);
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const remaining = useRef(total ?? 0);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  // The timer runs while the toast is neither hovered nor focused, and resumes with the time left.
  useEffect(() => {
    if (persistent || paused || leaving) return;
    const startedAt = Date.now();
    const timer = setTimeout(() => setLeaving(true), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [persistent, paused, leaving]);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => onDismissRef.current(id), EXIT_MS);
    return () => clearTimeout(timer);
  }, [leaving, id]);

  const onBlur = useCallback((event: FocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
  }, []);

  return (
    <li
      className={['ds-toast', `ds-toast--${status}`, leaving && 'ds-toast--leaving'].filter(Boolean).join(' ')}
      data-paused={paused || undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={onBlur}
    >
      <Icon glyph={GLYPH[status]} label={statusLabel ?? WORD[status]} className="ds-toast__icon" />
      <div className="ds-toast__content">
        {title && <p className="ds-toast__title">{title}</p>}
        <div className="ds-toast__message">{message}</div>
        {action && (
          <Button variant="tertiary" className="ds-toast__action" onClick={() => { action.onAction(); setLeaving(true); }}>
            {action.label}
          </Button>
        )}
      </div>
      <IconButton label={dismissLabel} icon={<Icon glyph="close" size="sm" />} onClick={() => setLeaving(true)} />
    </li>
  );
}

/**
 * The toast live region. Two regions stay in the page: a polite one for info, success and warning,
 * and an assertive one for errors. A toast never takes focus.
 */
export function ToastRegion({ toasts, onDismiss, dismissLabel = 'Dismiss notification', duration = 5000, max = 3, moreLabel = (count) => `+${count} more`, position = 'fixed', className, ...rest }: ToastRegionProps) {
  const visible = toasts.slice(0, max);
  const waiting = toasts.length - visible.length;
  const render = (list: readonly ToastData[]) =>
    list.map((toast) => <Toast key={toast.id} toast={toast} duration={duration} dismissLabel={dismissLabel} onDismiss={onDismiss} />);
  return (
    <div {...rest} className={['ds-toast-region', `ds-toast-region--${position}`, className].filter(Boolean).join(' ')}>
      <div role="status" aria-live="polite" aria-relevant="additions" className="ds-toast-region__live">
        <ol className="ds-toast-region__list">{render(visible.filter((toast) => toast.status !== 'error'))}</ol>
      </div>
      <div role="alert" aria-live="assertive" aria-relevant="additions" className="ds-toast-region__live">
        <ol className="ds-toast-region__list">{render(visible.filter((toast) => toast.status === 'error'))}</ol>
      </div>
      {waiting > 0 && <p className="ds-toast-region__more">{moreLabel(waiting)}</p>}
    </div>
  );
}
