import type { HTMLAttributes, ReactNode } from 'react';
import { VisuallyHidden } from '../../../primitives/visually-hidden/visually-hidden';
import './badge.css';

export type BadgeStatus = 'neutral' | 'info' | 'success' | 'warning' | 'error';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The meaning of the fill. A status badge also needs a word in `children`. */
  status?: BadgeStatus;
  /** A number to show. It caps at `max` and shows "99+". */
  count?: number;
  /** The largest number shown in full. Default 99. */
  max?: number;
  /** What the count counts, such as "unread messages". Read out after the full number. */
  label?: string;
  /** The status word, such as "Overdue". */
  children?: ReactNode;
  /** Hide the badge from assistive technology because the text beside it already says the same. */
  decorative?: boolean;
}

export function Badge({ status = 'neutral', count, max = 99, label, children, decorative = false, className, ...rest }: BadgeProps) {
  const capped = count !== undefined && count > max;
  const shown = capped ? `${max}+` : count;
  // The visible text is short. Assistive technology gets the full number, and what it counts.
  const full = count === undefined ? undefined : label ? `${count} ${label}` : String(count);
  const split = capped || Boolean(label);
  const classes = ['ds-badge', `ds-badge--${status}`, className];
  return (
    <span {...rest} className={classes.filter(Boolean).join(' ')} aria-hidden={decorative || undefined}>
      {children}
      {count !== undefined && <span aria-hidden={split || undefined}>{shown}</span>}
      {split && <VisuallyHidden>{full}</VisuallyHidden>}
    </span>
  );
}
