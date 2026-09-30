import { LIFECYCLE } from '../doc-page/types';
import { Cell } from '../state-matrix/cell';
import type { MatrixRow } from '../state-matrix/rows';
import './lifecycle.css';

const MISSING = 'Not designed yet. This is a finding, not a decision.';

/** The label a cell carries when the row name alone does not say what it shows. */
const captionOf = (row: MatrixRow, label?: string, variant?: string): string | undefined =>
  [variant, label && label !== row.label ? label : undefined].filter(Boolean).join(' · ') || undefined;

/** Speelman's step number for a matrix state; a free state has none. */
const stepOf = (id: string): number | undefined => {
  const i = (LIFECYCLE as readonly string[]).indexOf(id);
  return i < 0 ? undefined : i + 1;
};

function Row({ row }: { row: MatrixRow }) {
  const step = stepOf(row.id);
  return (
    <li id={`state-lifecycle-${row.id}`} className={`doc-lc-row doc-lc-${row.status === 'n/a' ? 'na' : row.status}`}>
      <div className="doc-lc-head">
        <span className="doc-lc-step" aria-hidden="true">{step ?? '+'}</span>
        <span className="doc-lc-name">{row.label}</span>
        {row.status !== 'designed' && <span className={`doc-badge doc-badge-${row.status === 'n/a' ? 'na' : 'missing'}`}>{row.status}</span>}
      </div>
      {row.status === 'designed' ? (
        <div className="doc-lc-cells">
          {row.cells.map((cell, i) => (
            <Cell key={i} cell={cell} caption={captionOf(row, cell.label, cell.variant)} />
          ))}
        </div>
      ) : (
        <p className="doc-lc-reason doc-muted">{row.status === 'n/a' ? row.reason : MISSING}</p>
      )}
    </li>
  );
}

/**
 * The lifecycle half of the state matrix: one full-width row per state, in Speelman's order, so a table or a
 * dialog gets the room its *too many* state needs. An n/a or missing row is one line, in its place in the cycle.
 */
export function Lifecycle({ rows }: { rows: readonly MatrixRow[] }) {
  if (rows.length === 0) return null;
  return (
    <>
      <h3 className="doc-h3">Lifecycle</h3>
      <ol className="doc-lifecycle">
        {rows.map((row) => (
          <Row key={row.id} row={row} />
        ))}
      </ol>
    </>
  );
}
