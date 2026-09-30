import type { StateCell } from '../doc-page/types';
import './state-matrix.css';

/** One live render on its grid, with what produces it underneath. Lifecycle rows and the interaction matrix share it. */
export function Cell({ cell, caption }: { cell: StateCell; caption?: string }) {
  if (cell.status === 'n/a') {
    return (
      <div className="doc-cell doc-cell-na">
        {caption && <span className="doc-cell-caption">{caption}</span>}
        <span className="doc-muted">n/a: {cell.reason ?? 'No reason given.'}</span>
      </div>
    );
  }
  return (
    <figure className="doc-cell">
      <div className="doc-cell-stage">{cell.render}</div>
      {(caption || cell.trigger || cell.note) && (
        <figcaption className="doc-cell-meta">
          {caption && <span className="doc-cell-caption">{caption}</span>}
          {cell.trigger && <code className="doc-trigger">{cell.trigger}</code>}
          {cell.note && <span className="doc-muted">{cell.note}</span>}
        </figcaption>
      )}
    </figure>
  );
}
