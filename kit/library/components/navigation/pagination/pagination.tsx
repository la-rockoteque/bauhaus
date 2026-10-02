import { useId, type ElementType, type ReactNode } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import { VisuallyHidden } from '../../../primitives/visually-hidden/visually-hidden';
import './pagination.css';

export interface PageSizeControl {
  /** The visible label of the select, such as "Rows per page". */
  label: string;
  value: number;
  options: readonly number[];
  onChange: (size: number) => void;
}

export interface PaginationProps {
  /** The accessible name of the landmark, such as "Pagination". */
  label: string;
  /** The current page, from 1. */
  page: number;
  pageCount: number;
  /** Called with the new page. In link mode it runs on click too, for a client-side route change. */
  onPageChange?: (page: number) => void;
  /** Link mode: each page is a link to this URL, so back, reload and sharing work. Without it, each page is a button. */
  getHref?: (page: number) => string;
  /** A router link component for link mode, rendered instead of `a`. */
  linkAs?: ElementType;
  /** The range and count as text, already formatted: "1–25 of 1,342". */
  total?: string;
  /** The page-size select. */
  pageSize?: PageSizeControl;
  previousLabel?: string;
  nextLabel?: string;
  /** The accessible name of a page item. Default: "Page n". */
  pageLabel?: (page: number) => string;
  /** Announced when the page changes, such as "Page 3 of 60". Renders a polite live region. */
  status?: string;
  /** How many pages show on each side of the current one. Default 1. */
  siblings?: number;
  /** An extra class on one page control, for a forced state in a showcase. */
  pageClassName?: (page: number) => string | undefined;
  className?: string;
}

type Slot = number | 'gap-start' | 'gap-end';

/** The page numbers to show: first, last, the current page and its siblings, with a gap where pages are left out. */
function slots(page: number, count: number, siblings: number): Slot[] {
  const seq = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, n) => from + n);
  if (count <= siblings * 2 + 5) return seq(1, count);
  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, count);
  const gapStart = left > 2;
  const gapEnd = right < count - 1;
  const edge = 2 + siblings * 2;
  if (!gapStart) return [...seq(1, edge + 1), 'gap-end', count];
  if (!gapEnd) return [1, 'gap-start', ...seq(count - edge, count)];
  return [1, 'gap-start', ...seq(left, right), 'gap-end', count];
}

interface ItemProps {
  target: number;
  current?: boolean;
  disabled?: boolean;
  name?: string;
  extra?: string;
  children: ReactNode;
}

export function Pagination({
  label, page: rawPage, pageCount, onPageChange, getHref, linkAs, total, pageSize, previousLabel = 'Previous', nextLabel = 'Next',
  pageLabel = (n) => `Page ${n}`, status, siblings = 1, pageClassName, className,
}: PaginationProps) {
  const selectId = useId();
  const count = Math.max(1, Math.floor(pageCount));
  const page = Math.min(Math.max(1, Math.floor(rawPage)), count);
  const LinkTag = linkAs ?? 'a';

  // A plain function, not a component: a component defined here would remount on every render and drop focus.
  const item = ({ target, current = false, disabled = false, name, extra, children }: ItemProps) => {
    const classes = ['ds-pagination__item', extra].filter(Boolean).join(' ');
    if (disabled) {
      // aria-disabled keeps a button focusable, so a keyboard user who pages to the end does not lose their place.
      return getHref
        ? <span className={classes} aria-disabled="true">{children}</span>
        : <button type="button" className={classes} aria-disabled="true">{children}</button>;
    }
    const common = { className: classes, 'aria-label': name, 'aria-current': current ? ('page' as const) : undefined };
    return getHref
      ? <LinkTag {...common} href={getHref(target)} onClick={() => onPageChange?.(target)}>{children}</LinkTag>
      : <button type="button" {...common} onClick={() => onPageChange?.(target)}>{children}</button>;
  };

  return (
    <nav aria-label={label} className={['ds-pagination', className].filter(Boolean).join(' ')}>
      <div className="ds-pagination__summary">
        {total && <span className="ds-pagination__total">{total}</span>}
        {pageSize && (
          <span className="ds-pagination__size">
            <label htmlFor={selectId} className="ds-pagination__size-label">{pageSize.label}</label>
            <select id={selectId} className="ds-pagination__select" value={pageSize.value} onChange={(event) => pageSize.onChange(Number(event.target.value))}>
              {pageSize.options.map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </span>
        )}
      </div>
      {count > 1 && (
        <ul className="ds-pagination__list">
          <li>{item({ target: page - 1, disabled: page === 1, children: <><Icon glyph="chevron-left" size="sm" />{previousLabel}</> })}</li>
          {slots(page, count, siblings).map((slot) =>
            typeof slot === 'number' ? (
              <li key={slot}>{item({ target: slot, current: slot === page, name: pageLabel(slot), extra: pageClassName?.(slot), children: slot })}</li>
            ) : (
              <li key={slot} className="ds-pagination__gap" aria-hidden="true">…</li>
            ),
          )}
          <li>{item({ target: page + 1, disabled: page === count, children: <>{nextLabel}<Icon glyph="chevron-right" size="sm" /></> })}</li>
        </ul>
      )}
      {status && <VisuallyHidden role="status">{status}</VisuallyHidden>}
    </nav>
  );
}
