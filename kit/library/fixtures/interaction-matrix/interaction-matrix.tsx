import { VisuallyHidden } from '../../primitives/visually-hidden/visually-hidden';
import { TableScroll } from '../doc-page/table-scroll';
import type { StateCell } from '../doc-page/types';
import { CSS_PATHS, SOURCES } from '../rulebook/sources';
import { Cell } from '../state-matrix/cell';
import { variantsOf, type MatrixRow } from '../state-matrix/rows';
import { forcedStateCss } from './forced-state-css';
import './interaction-matrix.css';

/** The forced-state stylesheet, generated from every component stylesheet, so a static cell can show hover, focus and press. */
const FORCED_STATE_CSS: string = forcedStateCss(CSS_PATHS.map((path) => SOURCES.get(path)!));

const MISSING = 'Not designed yet. This is a finding, not a decision.';

function Slot({ row, cells }: { row: MatrixRow; cells: readonly StateCell[] }) {
  if (cells.length === 0) {
    return (
      <td className="doc-im-empty">
        <span aria-hidden="true">—</span>
        <VisuallyHidden>Not shown for this variant</VisuallyHidden>
      </td>
    );
  }
  return (
    <td>
      <div className="doc-im-stack">
        {cells.map((cell, i) => (
          <Cell key={i} cell={cell} caption={cell.label && cell.label !== row.label ? cell.label : undefined} />
        ))}
      </div>
    </td>
  );
}

/**
 * The interaction half of the state matrix: states are rows, variants are columns, as in a Figma component set.
 * A variant is a choice and never a row. A slot a variant does not show is a dash, not a finding: the state
 * itself is answered by the base column. An n/a or missing state spans the row in one line.
 */
export function InteractionMatrix({ rows, base }: { rows: readonly MatrixRow[]; base: string }) {
  if (rows.length === 0) return null;
  const variants = variantsOf(rows.filter((row) => row.status === 'designed').flatMap((row) => row.cells));
  return (
    <>
      <style>{FORCED_STATE_CSS}</style>
      <h3 className="doc-h3">Interaction</h3>
      <TableScroll label="Interaction states">
        <table className="doc-table doc-imatrix">
          <thead>
            <tr>
              <th scope="col">State</th>
              {variants.map((variant) => (
                <th key={variant ?? ''} scope="col">
                  {variant ?? base}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} id={`state-interaction-${row.id}`} className={`doc-im-${row.status === 'n/a' ? 'na' : row.status}`}>
                <th scope="row">
                  <span className="doc-im-name">{row.label}</span>
                  {row.status !== 'designed' && <span className={`doc-badge doc-badge-${row.status === 'n/a' ? 'na' : 'missing'}`}>{row.status}</span>}
                </th>
                {row.status === 'designed' ? (
                  variants.map((variant) => <Slot key={variant ?? ''} row={row} cells={row.cells.filter((cell) => cell.variant === variant)} />)
                ) : (
                  <td colSpan={variants.length} className="doc-muted">
                    {row.status === 'n/a' ? row.reason : MISSING}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </>
  );
}
