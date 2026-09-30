import { VisuallyHidden } from '../../primitives/visually-hidden/visually-hidden';
import { Section } from '../doc-page/sections';
import { INTERACTION, LIFECYCLE, type StateId, type StatesSpec } from '../doc-page/types';
import { InteractionMatrix } from '../interaction-matrix/interaction-matrix';
import { Lifecycle } from '../lifecycle/lifecycle';
import { rowsFor, type Group, type MatrixRow } from './rows';
import './state-matrix.css';

export const DEFAULT_EXPECT: readonly StateId[] = [...LIFECYCLE, ...INTERACTION];

const MARK: Record<MatrixRow['status'], string> = { designed: '✓', 'n/a': 'n/a', missing: '✗' };

function Summary({ groups }: { groups: readonly [Group, readonly MatrixRow[]][] }) {
  const all = groups.flatMap(([, rows]) => rows);
  const count = (status: MatrixRow['status']) => all.filter((row) => row.status === status).length;
  if (all.length === 0) return null;
  return (
    <nav className="doc-summary" aria-label="State matrix summary">
      <p className="doc-summary-count">
        {count('designed')} designed · {count('n/a')} n/a · <span className={count('missing') ? 'doc-summary-missing' : undefined}>{count('missing')} missing</span>
      </p>
      {groups.map(([group, rows]) =>
        rows.length === 0 ? null : (
          <div key={group} className="doc-summary-group">
            <span className="doc-summary-name">{group === 'lifecycle' ? 'Lifecycle' : 'Interaction'}</span>
            <ul className="doc-summary-chips">
              {rows.map((row) => (
                <li key={row.id}>
                  <a href={`#state-${group}-${row.id}`} className={`doc-chip doc-chip-${row.status === 'n/a' ? 'na' : row.status}`}>
                    <span aria-hidden="true">{MARK[row.status]}</span> {row.label}
                    <VisuallyHidden>, {row.status}</VisuallyHidden>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ),
      )}
    </nav>
  );
}

/** Section 4 of a page: the summary of the state matrix, then its lifecycle rows and its interaction matrix. */
export function States({ states, defaultExpect, name }: { states: StatesSpec; defaultExpect: readonly StateId[]; name: string }) {
  const expect = states.expect ?? defaultExpect;
  const lifecycle = rowsFor('lifecycle', states, expect);
  const interaction = rowsFor('interaction', states, expect);
  return (
    <Section num={4} title="States" kicker="Every cell of the state matrix: designed with a live render, n/a with its reason, or missing.">
      {states.note && <p className="doc-note">{states.note}</p>}
      <Summary groups={[['lifecycle', lifecycle], ['interaction', interaction]]} />
      <Lifecycle rows={lifecycle} />
      <InteractionMatrix rows={interaction} base={name} />
    </Section>
  );
}
