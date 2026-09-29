import { useCallback, useMemo, useState } from 'react';
import type { SortColumn } from 'react-data-grid';
import { filterByColumn, filterRows, sortRows } from './gridView';
import { groupNames } from './gridGroups';
import {
  readFolded,
  readHidden,
  writeFolded,
  writeHidden,
  type FoldAnswer,
} from './gridPreferences';
import type { GridColumn } from './gridColumn';

/** A header row: the heading line alone, and the same plus the filter input under it. */
const HEADER_HEIGHT = 36;
const FILTERING_HEADER_HEIGHT = 62;

/**
 * What the toolbar and the headings do to the grid before it is drawn: search, per-column
 * filters, sort, hidden columns, a frozen first column, and whether the filter line is open.
 *
 * All of it lives here rather than in the component, because none of it is about drawing — it
 * is the question « which rows and which columns », answered once and handed down.
 */
export type GridViewState<R> = ReturnType<typeof useGridView<R>>;

export function useGridView<R>(
  rows: readonly R[],
  columns: readonly GridColumn<R>[],
  family?: string,
  foldedByDefault: readonly string[] = [],
  foldable: ReadonlySet<string> = new Set(),
) {
  const [search, setSearch] = useState('');
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  // Seeded from the reader's last visit, once, rather than synced in an effect — the stored
  // set is the initial value, and every change below writes it back.
  const [hiddenKeys, setHiddenKeys] = useState<ReadonlySet<string>>(() => readHidden(family));
  // Same rule, one level up: the reader's own answer if they have given one, the caller's
  // default only on a first visit — `null` is « never said », which an empty set is not.
  const foldableGroups = useMemo(
    () => groupNames(columns).filter((g) => foldable.has(g)),
    [columns, foldable],
  );
  const [folding, setFolding] = useState<FoldAnswer>(() =>
    seedFolded(readFolded(family), foldedByDefault, foldableGroups),
  );
  /** Which folded group is being looked at over the grid, if any. Never remembered. */
  const [peeked, setPeeked] = useState<string | null>(null);
  const [filters, setFilters] = useState<Readonly<Record<string, string>>>({});
  const [filtering, setFiltering] = useState(false);
  const [frozen, setFrozen] = useState(false);

  const visible = useMemo(
    () => columns.filter((column) => !hiddenKeys.has(column.key)),
    [columns, hiddenKeys],
  );

  const shown = useMemo(
    () =>
      sortRows(
        filterByColumn(filterRows(rows, visible, search), visible, filters),
        visible,
        sortColumns,
      ),
    [rows, visible, search, filters, sortColumns],
  );

  // Two header rows when any column names a group, one otherwise — the grid draws a row per
  // level, and both the box height and the ARIA row offset depend on how many it drew.
  // react-data-grid gives every header level the same height — `repeat(n, headerRowHeight)` —
  // so a grouped grid's group row is as tall as the one carrying the filters. The group heading
  // centres in it rather than being cropped, which is why this is left alone.
  const headerRowCount = visible.some((column) => column.group !== undefined) ? 2 : 1;
  const headerHeight = filtering ? FILTERING_HEADER_HEIGHT : HEADER_HEIGHT;

  return {
    visible,
    shown,
    headerRowCount,
    headerHeight,
    search,
    setSearch,
    sortColumns,
    setSortColumns,
    hiddenKeys,
    foldedGroups: folding.folded,
    peeked,
    setPeeked,
    toggleGroup: useCallback(
      (group: string) =>
        setFolding(({ folded, answered }) => {
          const next = new Set(folded);
          if (next.delete(group)) setPeeked(null);
          else next.add(group);
          // Folding one group answers for every group the reader could see doing it.
          const answer = { folded: next, answered: new Set([...answered, ...foldableGroups]) };
          writeFolded(family, answer);
          return answer;
        }),
      [family, foldableGroups],
    ),
    filters,
    filtering,
    frozen,
    toggleFrozen: useCallback(() => setFrozen((on) => !on), []),
    hideColumn: useCallback(
      (key: string) => setHiddenKeys((keys) => remember(family, new Set(keys).add(key))),
      [family],
    ),
    toggleColumn: useCallback(
      (key: string) =>
        setHiddenKeys((keys) => {
          const next = new Set(keys);
          if (!next.delete(key)) next.add(key);
          return remember(family, next);
        }),
      [family],
    ),
    showAllColumns: useCallback(() => setHiddenKeys(remember(family, new Set())), [family]),
    /** Opens the filter line and puts a value in one column's box — « filtrer sur ceci ». */
    filterOn: useCallback((key: string, value: string) => {
      setFiltering(true);
      setFilters({ [key]: value });
    }, []),
    /** Opens the filter line with that column's box empty, ready to be typed in. */
    focusFilter: useCallback((key: string) => {
      setFiltering(true);
      setFilters((was) => ({ ...was, [key]: was[key] ?? '' }));
    }, []),
    setFilter: useCallback(
      (key: string, value: string) => setFilters((was) => ({ ...was, [key]: value })),
      [],
    ),
    toggleFiltering: useCallback(
      () =>
        setFiltering((on) => {
          // Closing the line drops what was typed into it: a filter still narrowing the rows
          // from behind a hidden input is a grid that lies about how many lines it holds.
          if (on) setFilters({});
          return !on;
        }),
      [],
    ),
    clearNarrowing: useCallback(() => {
      setSearch('');
      setFilters({});
    }, []),
    /** Everything the full-screen tools set, put down: what narrows the rows, and the line. */
    collapse: useCallback(() => {
      setSearch('');
      setFilters({});
      setFiltering(false);
      setPeeked(null);
    }, []),
  };
}

/**
 * Which groups start folded: what this reader chose for the groups they answered for, and the
 * caller's default for every other one.
 *
 * The folded set is keyed on the heading the user reads, so the stored « Saisie » means nothing
 * to a grid whose heading now says « Entry » — after a language switch every group is one the
 * reader has not answered for, and the default applies rather than « fold nothing ».
 */
function seedFolded(
  stored: FoldAnswer | null,
  byDefault: readonly string[],
  groups: readonly string[],
): FoldAnswer {
  const answered = stored?.answered ?? new Set<string>();
  const folded = groups.filter((group) =>
    answered.has(group) ? stored?.folded.has(group) : byDefault.includes(group),
  );
  return { folded: new Set(folded), answered };
}

/** Writes the choice back on the way through, so the state and the store cannot disagree. */
function remember(family: string | undefined, hidden: ReadonlySet<string>): ReadonlySet<string> {
  writeHidden(family, hidden);
  return hidden;
}
