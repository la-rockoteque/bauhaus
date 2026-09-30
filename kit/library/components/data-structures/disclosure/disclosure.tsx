import type { DetailsHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import { VisuallyHidden } from '../../../primitives/visually-hidden/visually-hidden';
import './disclosure.css';

export interface DisclosureProps extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, 'title'> {
  /** The summary text. It stays visible open or closed. */
  title: ReactNode;
  /** The content is on its way. The panel shows placeholder lines and sets `aria-busy`. */
  loading?: boolean;
  /** Text for assistive technology while loading. */
  loadingLabel?: string;
  /** The panel. */
  children?: ReactNode;
}

/** One disclosure, on the native `details` and `summary`: keyboard, state and find-in-page come from the browser. */
export function Disclosure({ title, loading = false, loadingLabel = 'Loading', children, className, ...rest }: DisclosureProps) {
  const classes = ['ds-disclosure', className];
  return (
    <details {...rest} className={classes.filter(Boolean).join(' ')}>
      <summary className="ds-disclosure__trigger">
        <span className="ds-disclosure__title">{title}</span>
        <Icon glyph="chevron-down" size="md" className="ds-disclosure__icon" />
      </summary>
      <div className="ds-disclosure__panel" aria-busy={loading || undefined}>
        {loading ? <DisclosureSkeleton label={loadingLabel} /> : children}
      </div>
    </details>
  );
}

export function DisclosureSkeleton({ label }: { label: string }) {
  return (
    <>
      <VisuallyHidden>{label}</VisuallyHidden>
      <span className="ds-disclosure__skeleton ds-disclosure__skeleton--long" />
      <span className="ds-disclosure__skeleton" />
    </>
  );
}
