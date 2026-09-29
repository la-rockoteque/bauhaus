import type { GridColumn } from './gridColumn';

/**
 * Folding a group of columns away, and the narrow strip left where it was.
 *
 * A step's grid carries three groups — what the item is, what is being entered against it, and
 * what the sheet merely carried — and a foreman typing into the third of them does not need the
 * first two on screen. Folding is the reader's own doing and is remembered per family.
 *
 * **Inline only.** Expanded, the grid has the width it was folded for, so every group is drawn
 * whatever the reader folded — which is why nothing here knows about the folded set: the caller
 * passes an empty one once the grid is expanded.
 */
const STRIP = '__group:';

/** Wide enough for the chevron that opens it, and no wider. */
export const STRIP_WIDTH = 28;

export const stripKey = (group: string) => `${STRIP}${group}`;

/** Whether a column is a folded group's placeholder rather than one of the caller's own. */
export const isStrip = (key: string) => key.startsWith(STRIP);

export const groupOfStrip = (key: string) => key.slice(STRIP.length);

/** The groups a column list declares, in the order they first appear. */
export function groupNames<R>(columns: readonly GridColumn<R>[]): string[] {
  const seen = new Set<string>();
  for (const column of columns) if (column.group !== undefined) seen.add(column.group);
  return [...seen];
}

/**
 * The columns as they are drawn: each folded group replaced by one strip standing for it.
 *
 * A strip rather than nothing at all, because a group folded out of existence is a group nobody
 * can unfold — and because it is a real column, every index downstream (the selection, the
 * clipboard, the context menu) keeps meaning the same thing as what is on screen.
 */
export function foldGroups<R>(
  columns: readonly GridColumn<R>[],
  folded: ReadonlySet<string>,
): readonly GridColumn<R>[] {
  if (folded.size === 0) return columns;

  const out: GridColumn<R>[] = [];
  for (const column of columns) {
    const group = column.group;
    if (group === undefined || !folded.has(group)) {
      out.push(column);
      continue;
    }
    if (out.at(-1)?.key === stripKey(group)) continue;
    // Pinned at both ends: it holds nothing, so it must not take a share of the slack the
    // columns beside it are sharing out.
    out.push({
      key: stripKey(group),
      label: group,
      group,
      width: STRIP_WIDTH,
      minWidth: STRIP_WIDTH,
      maxWidth: STRIP_WIDTH,
      read: () => '',
    });
  }
  return out;
}

/**
 * A class naming the group on the heading cell that spans it.
 *
 * Two jobs: it is how two consecutive columns are recognised as sharing one heading now that
 * the heading itself is an element rather than its name, and it is what the peek panel anchors
 * on — the heading cell sits exactly over the strip it opens from.
 */
export function groupClass(name: string): string {
  return `mo-grid-group-${name.replace(/[^\p{L}\p{N}]+/gu, '-').toLocaleLowerCase('fr-CA')}`;
}
