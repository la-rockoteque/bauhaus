import type { ElementType, HTMLAttributes } from 'react';
import './text.css';

export type TextVariant = 'body' | 'caption' | 'heading';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  tone?: 'default' | 'muted';
  /** The element to render. Pick it for document structure; the variant only sets the look. */
  as?: ElementType;
}

const DEFAULT_TAG: Record<TextVariant, ElementType> = { body: 'p', caption: 'span', heading: 'h2' };

export function Text({ variant = 'body', tone = 'default', as, className, ...rest }: TextProps) {
  const Tag = as ?? DEFAULT_TAG[variant];
  const classes = ['ds-text', `ds-text--${variant}`, tone === 'muted' && 'ds-text--muted', className];
  return <Tag {...rest} className={classes.filter(Boolean).join(' ')} />;
}
