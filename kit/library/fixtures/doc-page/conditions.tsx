import { Cell } from '../state-matrix/cell';
import { Section } from './sections';
import type { ConditionsSpec } from './types';

/**
 * Section 4 of a foundation page: the user conditions the foundation answers. A foundation has no
 * interaction states of its own; it supplies the tokens components use for theirs.
 */
export function Conditions({ conditions }: { conditions: ConditionsSpec }) {
  return (
    <Section num={4} title="Conditions" kicker="The user preferences and settings this foundation answers, each with what sets it.">
      {conditions.cells.length === 0 ? (
        <p className="doc-muted">n/a: {conditions.reason ?? 'No reason given.'}</p>
      ) : (
        <ul className="doc-conditions">
          {conditions.cells.map((condition) => (
            <li key={condition.label}>
              <Cell cell={{ id: condition.label, status: 'designed', ...condition }} caption={condition.label} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
