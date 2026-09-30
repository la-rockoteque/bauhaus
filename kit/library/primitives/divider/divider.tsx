import type { HTMLAttributes } from 'react';
import './divider.css';

export interface DividerProps extends Omit<HTMLAttributes<HTMLHRElement>, 'children'> {
  orientation?: 'horizontal' | 'vertical';
  /** The line is only decoration. It is then hidden from assistive technology. Default false: the line marks a change of topic. */
  decorative?: boolean;
}

export function Divider({ orientation = 'horizontal', decorative = false, className, ...rest }: DividerProps) {
  const classes = ['ds-divider', `ds-divider--${orientation}`, className];
  const a11y = decorative ? { role: 'none' } : { 'aria-orientation': orientation };
  return <hr {...rest} {...a11y} className={classes.filter(Boolean).join(' ')} />;
}
