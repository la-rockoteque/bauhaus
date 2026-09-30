import type { HTMLAttributes, ReactNode } from 'react';
import { Heading } from '../../../primitives/heading/heading';
import type { HeadingLevel } from '../../../primitives/heading/heading';
import { VisuallyHidden } from '../../../primitives/visually-hidden/visually-hidden';
import './card.css';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The card's name. It is the heading, and the link text when the card has an `href`. */
  title: string;
  /** The outline level of the title. Pick it for the page's outline, not for the look. */
  headingLevel?: HeadingLevel;
  /** A short, non-interactive line beside the title: a status word, a date. */
  meta?: ReactNode;
  /** The body. */
  children?: ReactNode;
  /** The footer. With `href` it holds text only: the card is already one link. */
  footer?: ReactNode;
  /** Makes the whole card one link named by the title. The link's target covers the card. */
  href?: string;
  /** Show placeholder lines in the body. The card keeps its size. */
  loading?: boolean;
  /** Text for assistive technology while loading. */
  loadingLabel?: string;
  /** Body content when there are no children. The caller supplies the empty state. */
  empty?: ReactNode;
  /** The content failed to load. Replaces the body; announced as an alert. */
  error?: ReactNode;
}

export function Card({ title, headingLevel = 3, meta, children, footer, href, loading = false, loadingLabel = 'Loading', empty, error, className, ...rest }: CardProps) {
  const classes = ['ds-card', href !== undefined && 'ds-card--link', className];
  const name = href !== undefined ? <a className="ds-card__link" href={href}>{title}</a> : title;
  return (
    <article {...rest} className={classes.filter(Boolean).join(' ')} aria-busy={loading || undefined}>
      <header className="ds-card__header">
        <Heading level={headingLevel} size="label" className="ds-card__title">{name}</Heading>
        {meta && <span className="ds-card__meta">{meta}</span>}
      </header>
      <div className="ds-card__body">
        {loading ? (
          <>
            <VisuallyHidden>{loadingLabel}</VisuallyHidden>
            <span className="ds-card__skeleton ds-card__skeleton--long" />
            <span className="ds-card__skeleton" />
          </>
        ) : error ? (
          <div className="ds-card__error" role="alert">{error}</div>
        ) : children ? (
          children
        ) : (
          empty
        )}
      </div>
      {footer && <footer className="ds-card__footer">{footer}</footer>}
    </article>
  );
}
