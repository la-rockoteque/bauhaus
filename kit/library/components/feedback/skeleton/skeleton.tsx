import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { VisuallyHidden } from '../../../primitives/visually-hidden/visually-hidden';
import './skeleton.css';

export type SkeletonShape = 'text' | 'block' | 'circle';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The placeholder shape: a line of text, a rectangle, or a circle. Mirror the real layout. */
  shape?: SkeletonShape;
  /** Lines of text. Only for `shape="text"`. The last line is shorter. */
  lines?: number;
  /** CSS inline size, as a token expression such as `var(--ds-space-12)`. */
  width?: string;
  /** CSS block size, as a token expression. */
  height?: string;
}

/** One placeholder. It is hidden from assistive technology: the region around it says "busy". */
export function Skeleton({ shape = 'text', lines = 1, width, height, className, style, ...rest }: SkeletonProps) {
  const classes = ['ds-skeleton', `ds-skeleton--${shape}`, className];
  const size: CSSProperties = { inlineSize: width, blockSize: height };
  if (shape === 'text' && lines > 1) {
    return (
      <span {...rest} aria-hidden="true" className={['ds-skeleton-lines', className].filter(Boolean).join(' ')} style={{ ...style, inlineSize: width }}>
        {Array.from({ length: lines }, (_, index) => (
          <span key={index} className="ds-skeleton ds-skeleton--text" />
        ))}
      </span>
    );
  }
  return <span {...rest} aria-hidden="true" className={classes.filter(Boolean).join(' ')} style={{ ...size, ...style }} />;
}

export interface SkeletonRegionProps extends HTMLAttributes<HTMLDivElement> {
  /** Show the placeholders. When false the region renders the real content and is not busy. */
  loading: boolean;
  /** What loads, such as "Loading 3 requisitions". Announced politely once. */
  label: string;
  /** The placeholders while loading, the real content afterwards. */
  children: ReactNode;
}

/** The region around placeholders: `aria-busy`, and one polite status line for assistive technology. */
export function SkeletonRegion({ loading, label, children, ...rest }: SkeletonRegionProps) {
  return (
    <div {...rest} aria-busy={loading}>
      {loading && <VisuallyHidden role="status">{label}</VisuallyHidden>}
      {children}
    </div>
  );
}
