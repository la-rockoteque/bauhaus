import type { ElementType, HTMLAttributes } from 'react';
import { Box } from '../box/box';
import type { Space } from '../box/box';
import './stack.css';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** The element to render. Use "ul" or "ol" with `li` children for a list. */
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

export function Stack({ direction = 'vertical', gap = 4, align = 'stretch', justify = 'start', wrap = false, className, ...rest }: StackProps) {
  const classes = ['ds-stack', `ds-stack--${direction}`, `ds-stack--align-${align}`, `ds-stack--justify-${justify}`, wrap && 'ds-stack--wrap', className];
  return <Box {...rest} display="flex" gap={gap} className={classes.filter(Boolean).join(' ')} />;
}
