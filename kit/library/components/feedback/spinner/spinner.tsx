import type { HTMLAttributes } from 'react';
import { VisuallyHidden } from '../../../primitives/visually-hidden/visually-hidden';
import './spinner.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The accessible name, such as "Loading orders". Say what loads. */
  label: string;
  /** The side of the ring, from size.icon.*. */
  size?: SpinnerSize;
  /** Show the label beside the ring instead of hiding it from sight. */
  showLabel?: boolean;
}

export function Spinner({ label, size = 'md', showLabel = false, className, ...rest }: SpinnerProps) {
  const classes = ['ds-spinner', `ds-spinner--${size}`, className];
  return (
    <span {...rest} role="status" className={classes.filter(Boolean).join(' ')}>
      <span className="ds-spinner__ring" aria-hidden="true" />
      {showLabel ? <span className="ds-spinner__label">{label}</span> : <VisuallyHidden>{label}</VisuallyHidden>}
    </span>
  );
}
