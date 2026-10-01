import type { ElementType, HTMLAttributes } from 'react';
import './box.css';

/** A step of the space scale: `space.0` to `space.12`. The only values a Box accepts. */
export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** A Box that must be pressed is a button or a link, so it takes no click or key handler. */
export interface BoxProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick' | 'onKeyDown' | 'onKeyUp'> {
  /** The element to render. Pick it for document structure; a Box adds no role. */
  as?: ElementType;
  /** Padding on all sides, as a space step. */
  padding?: Space;
  /** Padding on the inline axis. Wins over `padding`. */
  paddingInline?: Space;
  /** Padding on the block axis. Wins over `padding`. */
  paddingBlock?: Space;
  /** Gap between children, as a space step. It has an effect only when `display` is "flex" or "grid". */
  gap?: Space;
  display?: 'block' | 'flex' | 'grid';
  /** Background, from the surface roles. */
  surface?: 'default' | 'raised' | 'sunken';
}

export function Box({ as, padding, paddingInline, paddingBlock, gap, display = 'block', surface, className, ...rest }: BoxProps) {
  const Tag = as ?? 'div';
  const classes = [
    'ds-box',
    `ds-box--${display}`,
    padding !== undefined && `ds-box--p-${padding}`,
    paddingInline !== undefined && `ds-box--pi-${paddingInline}`,
    paddingBlock !== undefined && `ds-box--pb-${paddingBlock}`,
    gap !== undefined && `ds-box--gap-${gap}`,
    surface && `ds-box--surface-${surface}`,
    className,
  ];
  return <Tag {...rest} className={classes.filter(Boolean).join(' ')} />;
}
