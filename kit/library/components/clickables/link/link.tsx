import type { AnchorHTMLAttributes, ElementType } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import { VisuallyHidden } from '../../../primitives/visually-hidden/visually-hidden';
import './link.css';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The element to render, such as an app router's link component. It receives every prop, `href` included. Default: a native `a`. */
  as?: ElementType;
  /** The link leaves the app and opens in a new tab. Adds the icon and the spoken warning. */
  external?: boolean;
  /** The warning read out for an external link. Pass it in the app's language. */
  externalLabel?: string;
  /** The link points at the place the user is in. Sets `aria-current`; `true` means "page". */
  current?: boolean | 'page' | 'step' | 'location';
  /** The link stands alone (a nav item, a crumb, a footer link), so it draws at 32px (size.control.md). Leave it off inside a sentence. */
  standalone?: boolean;
}

export function Link({ as, external = false, externalLabel = 'opens in a new tab', current = false, standalone = false, className, children, ...rest }: LinkProps) {
  const Tag = as ?? 'a';
  const classes = ['ds-link', standalone && 'ds-link--standalone', className];
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <Tag {...externalProps} {...rest} className={classes.filter(Boolean).join(' ')} aria-current={current === true ? 'page' : current || undefined}>
      {children}
      {external && (
        <>
          {' '}
          <VisuallyHidden>{externalLabel}</VisuallyHidden>
          <Icon glyph="external" size="sm" />
        </>
      )}
    </Tag>
  );
}
