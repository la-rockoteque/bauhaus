import type { HTMLAttributes, ReactNode } from 'react';
import { VisuallyHidden } from '../../../primitives/visually-hidden/visually-hidden';
import './list.css';

export interface ListProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** An `ol` when order carries meaning (a ranking, steps); a `ul` otherwise. */
  ordered?: boolean;
  /** A rule between rows. */
  divided?: boolean;
  /** Show skeleton rows that mirror the leading, title and description slots. */
  loading?: boolean;
  skeletonRows?: number;
  /** Text for assistive technology while loading. */
  loadingLabel?: string;
  /** Content when there are no rows. The caller supplies the empty state; the list imports no pattern. */
  empty?: ReactNode;
  /** The rows failed to load. Replaces the rows; announced as an alert. */
  error?: ReactNode;
  /** Some rows loaded and some did not. Shown under the rows. */
  partial?: ReactNode;
  /** `ListItem` elements. */
  children?: ReactNode;
}

export function List({ ordered = false, divided = false, loading = false, skeletonRows = 3, loadingLabel = 'Loading items', empty, error, partial, children, className, ...rest }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul';
  const hasRows = Array.isArray(children) ? children.length > 0 : Boolean(children);
  const showRows = !loading && !error && hasRows;
  const classes = ['ds-list', divided && 'ds-list--divided', className];
  return (
    <div className="ds-list__root">
      {(loading || showRows) && (
        <Tag {...rest} className={classes.filter(Boolean).join(' ')} aria-busy={loading || undefined}>
          {loading
            ? Array.from({ length: skeletonRows }, (_, index) => (
                <li key={index} className="ds-list__item ds-list__item--skeleton">
                  <span className="ds-list__skeleton ds-list__skeleton--leading" />
                  <span className="ds-list__body">
                    {index === 0 && <VisuallyHidden>{loadingLabel}</VisuallyHidden>}
                    <span className="ds-list__skeleton ds-list__skeleton--title" />
                    <span className="ds-list__skeleton ds-list__skeleton--description" />
                  </span>
                </li>
              ))
            : children}
        </Tag>
      )}
      {!loading && error && <div className="ds-list__slot ds-list__slot--error" role="alert">{error}</div>}
      {!loading && !error && !hasRows && empty && <div className="ds-list__slot">{empty}</div>}
      {showRows && partial && <div className="ds-list__slot ds-list__slot--partial" role="status">{partial}</div>}
    </div>
  );
}

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title' | 'onClick'> {
  /** The row's name. It becomes the link or button text when the row is interactive. */
  title: ReactNode;
  description?: ReactNode;
  /** An icon, avatar or figure before the title. Not interactive. */
  leading?: ReactNode;
  /** A value, badge or chevron after the title. Not interactive: the row has one control. */
  trailing?: ReactNode;
  /** Makes the row a link. The link's target covers the whole row. */
  href?: string;
  /** Makes the row a button (when `href` is not set). The button's target covers the whole row. */
  onPress?: () => void;
  /** The row is the current one (link) or the pressed one (button). */
  selected?: boolean;
  /** The row's action is off. Use with a reason in `description`. */
  disabled?: boolean;
}

export function ListItem({ title, description, leading, trailing, href, onPress, selected = false, disabled = false, className, ...rest }: ListItemProps) {
  const interactive = href !== undefined || onPress !== undefined;
  const classes = ['ds-list__item', interactive && 'ds-list__item--interactive', selected && 'ds-list__item--selected', disabled && 'ds-list__item--disabled', className];
  const name = href !== undefined && !disabled ? (
    <a className="ds-list__control" href={href} aria-current={selected ? 'true' : undefined}>{title}</a>
  ) : onPress !== undefined || (href !== undefined && disabled) ? (
    <button type="button" className="ds-list__control" disabled={disabled} aria-pressed={selected || undefined} onClick={onPress}>{title}</button>
  ) : (
    <span className="ds-list__title">{title}</span>
  );
  return (
    <li {...rest} className={classes.filter(Boolean).join(' ')}>
      {leading && <span className="ds-list__leading">{leading}</span>}
      <span className="ds-list__body">
        {name}
        {description && <span className="ds-list__description">{description}</span>}
      </span>
      {trailing && <span className="ds-list__trailing">{trailing}</span>}
    </li>
  );
}
