import type { ReactNode } from 'react';

/** A table that scrolls inside its own box, so a long token name never widens the page (WCAG 1.4.10). */
export function TableScroll({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="doc-table-scroll" role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}
