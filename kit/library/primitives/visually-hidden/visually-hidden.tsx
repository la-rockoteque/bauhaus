import type { ElementType, HTMLAttributes } from 'react';
import './visually-hidden.css';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  /** The element to render. Use "a" with `focusable` for a skip link. */
  as?: ElementType;
  /** Appear on keyboard focus. For a skip link and any control that must be reachable but not always seen. */
  focusable?: boolean;
  /** The target, when `as` is "a". */
  href?: string;
}

export function VisuallyHidden({ as, focusable = false, className, ...rest }: VisuallyHiddenProps) {
  const Tag = as ?? 'span';
  const classes = ['ds-visually-hidden', focusable && 'ds-visually-hidden--focusable', className];
  return <Tag {...rest} className={classes.filter(Boolean).join(' ')} />;
}
