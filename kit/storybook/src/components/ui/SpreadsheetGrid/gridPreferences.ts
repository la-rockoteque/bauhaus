/**
 * What a reader chose to hide or to fold away, kept between visits.
 *
 * Hiding a column is a standing preference, not a gesture: someone who does not care about
 * « N° bordereau » does not care about it tomorrow either, and making them hide it again on
 * every visit is the kind of small tax that stops people using the control at all.
 *
 * **Per family, not per grid instance.** Two steps of the same tracker are the same table to
 * the person reading them — the columns come from the same import and mean the same things —
 * so `family` names the *kind* of grid (« tracker.step-items »), never one page's id. A key
 * that carried the step id would remember nothing, because nobody visits the same step twice
 * in a row.
 */

const PREFIX = 'moship.grid';

export const familyKey = (family: string): string => `${PREFIX}.${family}.hidden`;
export const foldedKey = (family: string): string => `${PREFIX}.${family}.folded`;

/**
 * Every access is guarded. `localStorage` is not merely empty in a private window or with site
 * data blocked — reading it *throws*, and a grid that cannot remember a preference must still
 * draw its columns.
 */
export function readHidden(family: string | undefined): ReadonlySet<string> {
  return readKeys(family, familyKey) ?? new Set();
}

export function writeHidden(family: string | undefined, hidden: ReadonlySet<string>): void {
  // Nothing hidden is the default, so an empty entry is one more thing to read and discard.
  writeKeys(family, familyKey, hidden);
}

/**
 * Which groups are folded, and which groups the reader has answered for at all — `null` when
 * they never have, which is what lets the caller's own default (« la saisie arrive repliée »)
 * apply on a first visit.
 *
 * `answered` is what keeps a group the grid gains later on its default: someone who pinned
 * « Saisie » said nothing about a « Métadonnées » that did not exist yet (TM-110).
 */
export interface FoldAnswer {
  folded: ReadonlySet<string>;
  answered: ReadonlySet<string>;
}

export function readFolded(family: string | undefined): FoldAnswer | null {
  const stored = readJson(family, foldedKey);
  // The first shape was the folded list alone; it answers for the groups it names and no more.
  if (Array.isArray(stored)) {
    const folded = strings(stored);
    return { folded, answered: folded };
  }
  if (typeof stored !== 'object' || stored === null) return null;
  const { folded, answered } = stored as Record<string, unknown>;
  if (!Array.isArray(folded) || !Array.isArray(answered)) return null;
  return { folded: strings(folded), answered: strings(answered) };
}

export function writeFolded(family: string | undefined, answer: FoldAnswer): void {
  if (!family) return;
  try {
    window.localStorage.setItem(
      foldedKey(family),
      JSON.stringify({ folded: [...answer.folded], answered: [...answer.answered] }),
    );
  } catch {
    // A preference that cannot be saved is not a reason to fail the render.
  }
}

function readKeys(
  family: string | undefined,
  key: (family: string) => string,
): ReadonlySet<string> | null {
  const stored = readJson(family, key);
  // Anything else in that slot is someone else's data or a shape we no longer write.
  return Array.isArray(stored) ? strings(stored) : null;
}

function readJson(family: string | undefined, key: (family: string) => string): unknown {
  if (!family) return null;

  try {
    const stored = window.localStorage.getItem(key(family));
    return stored === null ? null : (JSON.parse(stored) as unknown);
  } catch {
    return null;
  }
}

function strings(values: readonly unknown[]): ReadonlySet<string> {
  return new Set(values.filter((k): k is string => typeof k === 'string'));
}

function writeKeys(
  family: string | undefined,
  key: (family: string) => string,
  values: ReadonlySet<string>,
): void {
  if (!family) return;

  try {
    if (values.size === 0) window.localStorage.removeItem(key(family));
    else window.localStorage.setItem(key(family), JSON.stringify([...values]));
  } catch {
    // A preference that cannot be saved is not a reason to fail the render.
  }
}
