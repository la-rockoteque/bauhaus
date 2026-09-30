import type { HTMLAttributes } from 'react';
import './heading.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'display' | 'heading' | 'subheading' | 'label';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** The outline level, 1 to 6. It sets the element (h1 to h6) and nothing about the look. */
  level: HeadingLevel;
  /** The look. Defaults to the size that suits the level; pass it to look smaller or larger than the outline says. */
  size?: HeadingSize;
}

const SIZE_BY_LEVEL: Record<HeadingLevel, HeadingSize> = { 1: 'display', 2: 'heading', 3: 'subheading', 4: 'label', 5: 'label', 6: 'label' };

export function Heading({ level, size = SIZE_BY_LEVEL[level], className, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  const classes = ['ds-heading', `ds-heading--${size}`, className];
  return <Tag {...rest} className={classes.filter(Boolean).join(' ')} />;
}
