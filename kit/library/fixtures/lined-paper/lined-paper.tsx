import type { CSSProperties, ReactNode } from 'react';
import './lined-paper.css';

/**
 * A sheet of school paper. Each `PaperLine` child fills one rule. `head` is written in the band above
 * the first rule, and `blank` adds that many empty rules after the last line.
 */
export function LinedPaper({ head, blank = 1, children }: { head?: ReactNode; blank?: number; children: ReactNode }) {
  return (
    <div className="paper" style={{ '--paper-blank': blank } as CSSProperties}>
      <span className="paper-hole" aria-hidden="true" />
      <span className="paper-hole" aria-hidden="true" />
      <span className="paper-hole" aria-hidden="true" />
      {head && <div className="paper-head">{head}</div>}
      <div className="paper-lines">{children}</div>
    </div>
  );
}

/** One line of writing, set on its rule. It never wraps: a long line scrolls the sheet sideways. */
export function PaperLine({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return (
    <p className="paper-line" style={style}>
      <span>{children}</span>
    </p>
  );
}

/** A small muted aside on a line, such as the name of the face it is written in. */
export function PaperNote({ children }: { children: ReactNode }) {
  return <span className="paper-note">{children}</span>;
}
