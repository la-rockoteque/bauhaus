import { INTERACTION, LIFECYCLE, type StateCell, type StateId, type StatesSpec } from '../doc-page/types';
import { Section } from '../doc-page/sections';
import { CSS_PATHS, SOURCES } from '../rulebook/sources';
import { forcedStateCss } from './forced-state-css';
import './states-grid.css';

/** The forced-state stylesheet, generated from every component stylesheet. */
const FORCED_STATE_CSS: string = forcedStateCss(CSS_PATHS.map((path) => SOURCES.get(path)!));

type Group = 'lifecycle' | 'interaction';
type Slot = { cell: StateCell } | { missing: string };

const groupOf = (cell: StateCell): Group =>
  cell.group ?? ((INTERACTION as readonly string[]).includes(cell.id) ? 'interaction' : 'lifecycle');

const ALL: readonly StateId[] = [...LIFECYCLE, ...INTERACTION];
const title = (id: string): string => id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');

/** The cells of a group in matrix order, then free cells, with `missing` slots for expected ids nobody answered. */
function slotsFor(group: Group, spec: StatesSpec, expect: readonly StateId[]): Slot[] {
  const order: readonly string[] = group === 'lifecycle' ? LIFECYCLE : INTERACTION;
  const mine = spec.cells.filter((cell) => groupOf(cell) === group);
  const known = order.flatMap((id) => mine.filter((cell) => cell.id === id));
  const free = mine.filter((cell) => !order.includes(cell.id));
  const missing = expect.filter((id) => order.includes(id) && !mine.some((cell) => cell.id === id));
  return [...known.map((cell) => ({ cell })), ...free.map((cell) => ({ cell })), ...missing.map((id) => ({ missing: id }))];
}

function Card({ slot }: { slot: Slot }) {
  if ('missing' in slot) {
    return (
      <div className="doc-state doc-state-missing">
        <div className="doc-state-body">
          <span className="doc-badge doc-badge-missing">missing</span>
        </div>
        <div className="doc-state-meta">
          <span className="doc-state-label">{title(slot.missing)}</span>
          <span className="doc-muted">Not designed yet. This is a finding, not a decision.</span>
        </div>
      </div>
    );
  }
  const { cell } = slot;
  const na = cell.status === 'n/a';
  return (
    <div className={`doc-state${na ? ' doc-state-na' : ''}`}>
      <div className="doc-state-body">{na ? <span className="doc-badge">n/a</span> : cell.render}</div>
      <div className="doc-state-meta">
        <span className="doc-state-label">{cell.label ?? title(cell.id)}</span>
        {cell.trigger && <code className="doc-trigger">{cell.trigger}</code>}
        {na && <span className="doc-muted">{cell.reason ?? 'No reason given.'}</span>}
        {cell.note && <span className="doc-muted">{cell.note}</span>}
      </div>
    </div>
  );
}

function Group({ name, slots }: { name: string; slots: Slot[] }) {
  if (slots.length === 0) return null;
  return (
    <>
      <h3 className="doc-h3">{name}</h3>
      <div className="doc-states">
        {slots.map((slot, i) => (
          <Card key={'cell' in slot ? slot.cell.label ?? slot.cell.id : `missing-${slot.missing}-${i}`} slot={slot} />
        ))}
      </div>
    </>
  );
}

export function States({ states, defaultExpect }: { states: StatesSpec; defaultExpect: readonly StateId[] }) {
  const expect = states.expect ?? defaultExpect;
  return (
    <Section num={4} title="States" kicker="Every cell of the state matrix: designed with a live render, n/a with its reason, or missing.">
      <style>{FORCED_STATE_CSS}</style>
      {states.note && <p className="doc-note">{states.note}</p>}
      <Group name="Lifecycle" slots={slotsFor('lifecycle', states, expect)} />
      <Group name="Interaction" slots={slotsFor('interaction', states, expect)} />
    </Section>
  );
}

export const DEFAULT_EXPECT = ALL;
