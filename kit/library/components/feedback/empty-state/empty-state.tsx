import type { HTMLAttributes, ReactNode } from 'react';
import { Heading } from '../../../primitives/heading/heading';
import type { HeadingLevel } from '../../../primitives/heading/heading';
import './empty-state.css';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The fact, in a few words: "No projects yet". */
  title: ReactNode;
  /** One or two sentences: why, and what to do. */
  children?: ReactNode;
  /** An illustration or an Icon. Hidden from assistive technology: the title says it in words. */
  media?: ReactNode;
  /** The next step: one primary button, and at most one more. */
  actions?: ReactNode;
  /** Outline level of the title. Pick it for the page outline; the look does not change. Default 2. */
  headingLevel?: HeadingLevel;
}

export function EmptyState({ title, children, media, actions, headingLevel = 2, className, ...rest }: EmptyStateProps) {
  return (
    <div {...rest} className={['ds-empty-state', className].filter(Boolean).join(' ')}>
      {media && <div className="ds-empty-state__media" aria-hidden="true">{media}</div>}
      <Heading level={headingLevel} size="subheading" className="ds-empty-state__title">{title}</Heading>
      {children && <div className="ds-empty-state__body">{children}</div>}
      {actions && <div className="ds-empty-state__actions">{actions}</div>}
    </div>
  );
}
