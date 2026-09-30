import { useEffect, useRef, useState, type ElementType } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import { IconButton } from '../../clickables/icon-button/icon-button';
import { Link } from '../../clickables/link/link';
import './breadcrumb.css';

export interface BreadcrumbItem {
  label: string;
  /** The destination. Leave it off on the last item when the current page needs no link. */
  href?: string;
  /** An extra class on the crumb's link, for a forced state in a showcase. */
  className?: string;
}

export interface BreadcrumbProps {
  /** The accessible name of the landmark, such as "Breadcrumb". */
  label: string;
  /** The path from the root to the current page. The last item is the current page. */
  items: readonly BreadcrumbItem[];
  /** A router link component, passed to every Link as `as`. */
  linkAs?: ElementType;
  /** More items than this collapse into a "…" button that expands the path. */
  maxItems?: number;
  /** The accessible name of the "…" button. Pass it in the app's language. */
  expandLabel?: string;
  className?: string;
}

export function Breadcrumb({ label, items, linkAs, maxItems = 4, expandLabel = 'Show all levels', className }: BreadcrumbProps) {
  const [expanded, setExpanded] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  const focusRevealed = useRef(false);
  const collapsed = !expanded && items.length > maxItems;
  const tail = Math.max(1, maxItems - 2);

  useEffect(() => {
    if (expanded && focusRevealed.current) list.current?.querySelectorAll('a')[1]?.focus();
    focusRevealed.current = false;
  }, [expanded]);

  const expand = () => {
    focusRevealed.current = true;
    setExpanded(true);
  };

  const shown = collapsed ? [...items.slice(0, 1), null, ...items.slice(-tail)] : items;
  const last = items.length - 1;
  const separator = <span className="ds-breadcrumb__separator" aria-hidden="true"><Icon glyph="chevron-right" size="sm" /></span>;

  return (
    <nav aria-label={label} className={['ds-breadcrumb', className].filter(Boolean).join(' ')}>
      <ol ref={list} className="ds-breadcrumb__list">
        {shown.map((item, position) => {
          if (item === null) {
            return (
              <li key="collapsed" className="ds-breadcrumb__item">
                <IconButton label={expandLabel} icon={<Icon glyph="more" />} aria-expanded={false} onClick={expand} />
                {separator}
              </li>
            );
          }
          const isLast = items.indexOf(item) === last;
          return (
            <li key={`${item.label}-${position}`} className="ds-breadcrumb__item">
              {item.href ? (
                <Link href={item.href} as={linkAs} className={item.className} standalone current={isLast ? 'page' : false}>{item.label}</Link>
              ) : (
                <span className="ds-breadcrumb__current" aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
              {!isLast && separator}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
