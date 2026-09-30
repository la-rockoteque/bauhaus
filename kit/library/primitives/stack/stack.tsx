import type { ElementType, HTMLAttributes } from 'react';
import { Box } from '../box/box';
import type { Space } from '../box/box';
import './stack.css';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** The element to render. Use "ul" or "ol" with `li` children for a list: the stack resets its markers and padding, and keeps the list role. */
  as?: ElementType;
  direction?: 'vertical' | 'horizontal';
  /** Gap between children, as a space step. */
  gap?: Space;
  /** Alignment on the cross axis. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Distribution on the main axis. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Let children flow onto a new line instead of shrinking or overflowing. */
  wrap?: boolean;
}

export function Stack({ as, direction = 'vertical', gap = 4, align = 'stretch', justify = 'start', wrap = false, className, ...rest }: StackProps) {
  // Safari drops list semantics from a list with `list-style: none`, so an explicit role keeps them.
  const list = as === 'ul' || as === 'ol';
  const classes = ['ds-stack', list && 'ds-stack--list', `ds-stack--${direction}`, `ds-stack--align-${align}`, `ds-stack--justify-${justify}`, wrap && 'ds-stack--wrap', className];
  return <Box role={list ? 'list' : undefined} {...rest} as={as} display="flex" gap={gap} className={classes.filter(Boolean).join(' ')} />;
}
