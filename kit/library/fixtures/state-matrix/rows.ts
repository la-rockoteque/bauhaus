import { INTERACTION, LIFECYCLE, type StateCell, type StateId, type StatesSpec } from '../doc-page/types';

export type Group = 'lifecycle' | 'interaction';

/** One state of the matrix: every cell that shows it, one per variant, and what the row as a whole says. */
export interface MatrixRow {
  id: string;
  label: string;
  /** `n/a` only when every cell is n/a with a reason. A row with no cell, or an n/a with no reason, is `missing`. */
  status: 'designed' | 'n/a' | 'missing';
  cells: readonly StateCell[];
  reason?: string;
}

const ORDER: Record<Group, readonly string[]> = { lifecycle: LIFECYCLE, interaction: INTERACTION };

export const title = (id: string): string => id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');

export const groupOf = (cell: StateCell): Group =>
  cell.group ?? ((INTERACTION as readonly string[]).includes(cell.id) ? 'interaction' : 'lifecycle');

function rowOf(id: string, cells: readonly StateCell[], matrixId: boolean): MatrixRow {
  const label = matrixId ? title(id) : (cells[0]?.label ?? title(id));
  const allNa = cells.length > 0 && cells.every((c) => c.status === 'n/a');
  if (allNa && cells.every((c) => c.reason)) return { id, label, status: 'n/a', cells, reason: cells[0].reason };
  return { id, label, status: cells.length === 0 || allNa ? 'missing' : 'designed', cells };
}

/** The rows of a group: matrix ids in matrix order (missing ones in place, when expected), then free ids in order of first use. */
export function rowsFor(group: Group, spec: StatesSpec, expect: readonly StateId[]): MatrixRow[] {
  const order = ORDER[group];
  const mine = spec.cells.filter((cell) => groupOf(cell) === group);
  const cellsOf = (id: string) => mine.filter((cell) => cell.id === id);
  const known = order
    .filter((id) => cellsOf(id).length > 0 || (expect as readonly string[]).includes(id))
    .map((id) => rowOf(id, cellsOf(id), true));
  const free = [...new Set(mine.map((cell) => cell.id).filter((id) => !order.includes(id)))].map((id) => rowOf(id, cellsOf(id), false));
  return [...known, ...free];
}

/** The matrix columns: the base component (`undefined`) first, then each variant in order of first use. */
export function variantsOf(cells: readonly StateCell[]): (string | undefined)[] {
  return [undefined, ...new Set(cells.flatMap((cell) => (cell.variant ? [cell.variant] : [])))];
}
