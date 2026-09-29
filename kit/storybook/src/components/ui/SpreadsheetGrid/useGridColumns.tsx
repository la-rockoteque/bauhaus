import { useMemo } from 'react';
import type { Column, ColumnGroup, ColumnOrColumnGroup } from 'react-data-grid';
import { GridCellEditor } from './GridCellEditor';
import { GridGroupHeader } from './GridGroupHeader';
import { GridHeaderCell } from './GridHeaderCell';
import { STRIP_WIDTH, groupClass, isStrip } from './gridGroups';
import { floorOf } from './gridWidths';
import { cellClasses, headerClasses } from './cellClasses';
import { opensAnEditor, opensEditorOn, writesOn, type GridColumn } from './gridColumn';
import type { CellRange, CellPosition } from './gridSelection';
import type { GridSelection } from './useGridSelection';
import type { GridViewState } from './useGridView';

/** What a group heading needs to know, beyond its own name. */
interface GroupChrome {
  foldable: ReadonlySet<string>;
  folded: ReadonlySet<string>;
  peeked: string | null;
  onToggle: (group: string) => void;
  onPeek: (group: string) => void;
}

/**
 * Consecutive columns of one group, folded into the group react-data-grid draws above them.
 * Consecutive rather than gathered: the caller decides the order, and a group that appears
 * twice is two headings, which is what the column list said.
 *
 * The heading is a React element rather than a string — react-data-grid takes either — because
 * it is also the fold control.
 */
function grouped<R>(
  columns: readonly Column<R>[],
  groups: readonly (string | undefined)[],
  chrome: GroupChrome,
) {
  const out: ColumnOrColumnGroup<R>[] = [];
  const heading = (name: string) =>
    chrome.foldable.has(name) ? (
      <GridGroupHeader
        name={name}
        folded={chrome.folded.has(name)}
        peeked={chrome.peeked === name}
        onToggle={() => chrome.onToggle(name)}
        onPeek={() => chrome.onPeek(name)}
      />
    ) : (
      name
    );

  columns.forEach((column, i) => {
    const name = groups[i];
    if (name === undefined) {
      out.push(column);
      return;
    }
    const last = out.at(-1);
    if (continues(last, name)) {
      (last.children as Column<R>[]).push(column);
      return;
    }
    out.push({
      name: heading(name),
      headerCellClass: `mo-grid-group ${groupClass(name)}${
        chrome.folded.has(name) ? ' mo-grid-group--strip' : ''
      }`,
      children: [column],
    });
  });
  return out;
}


/** What the columns need from the rest of the grid, as the grid already holds it. */
export interface ColumnContext<R> {
  view: GridViewState<R>;
  /** Folded *now* — empty while the grid is expanded, where folding does not apply. */
  folded: ReadonlySet<string>;
  peeked: string | null;
  /** Which groups offer the fold at all. The rest keep a plain heading. */
  foldable: ReadonlySet<string>;
  /** Each column's width, shared out so they reach the grid's right edge. */
  widths: ReadonlyMap<string, number>;

  rows: readonly R[];
  selection: GridSelection;
  canWrite: boolean;
  editable: boolean;
  onEdit: (position: CellPosition, value: string) => void;
  onFillToEnd: () => void;
  onHeaderContextMenu: (columnKey: string, event: React.MouseEvent) => void;
}

/** The same, flattened to what one column actually reads. */
interface ColumnChrome<R> {
  widths: ReadonlyMap<string, number>;
  /** Where each visible row sits — `cellClass` is handed the row, never its index. */
  rowIndex: ReadonlyMap<R, number>;
  range: CellRange | null;
  fillPreview: CellRange | null;
  frozen: boolean;
  filtering: boolean;
  filters: Readonly<Record<string, string>>;
  editable: boolean;
  canWrite: boolean;
  onFilterChange: (key: string, value: string) => void;
  onHide: (key: string) => void;
  onEdit: (position: CellPosition, value: string) => void;
  onStartFill: () => void;
  onFillToEnd: () => void;
  onHeaderContextMenu: (columnKey: string, event: React.MouseEvent) => void;
}

/** The library's columns, built from ours plus whatever the selection is doing to them. */
export function useGridColumns<R>(
  columns: readonly GridColumn<R>[],
  {
    view,
    folded,
    peeked,
    foldable,
    widths,
    rows,
    selection,
    canWrite,
    editable,
    onEdit,
    onFillToEnd,
    onHeaderContextMenu,
  }: ColumnContext<R>,
): ColumnOrColumnGroup<R>[] {
  const rowIndex = useMemo(() => new Map(rows.map((row, index) => [row, index])), [rows]);

  const chrome: ColumnChrome<R> = {
    widths,
    rowIndex,
    range: selection.range,
    fillPreview: selection.fillPreview,
    frozen: view.frozen,
    filtering: view.filtering,
    filters: view.filters,
    editable,
    canWrite,
    onFilterChange: view.setFilter,
    onHide: view.hideColumn,
    onEdit,
    onStartFill: selection.startFillDrag,
    onFillToEnd,
    onHeaderContextMenu,
  };

  const groups: GroupChrome = {
    foldable,
    folded,
    peeked,
    onToggle: view.toggleGroup,
    onPeek: (group) => view.setPeeked(peeked === group ? null : group),
  };

  return useMemo(
    () =>
      grouped(
        columns.map((column, colIdx) => toGridColumn(column, colIdx, chrome)),
        columns.map((column) => column.group),
        groups,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- both are rebuilt each render
    [columns, ...Object.values(chrome), ...Object.values(groups)],
  );
}

/**
 * Whether the heading already open at the end of the list is this column's — which is how two
 * consecutive columns come to share one, now that the heading itself is an element rather than
 * its name and cannot be compared to it.
 */
function continues<R>(
  last: ColumnOrColumnGroup<R> | undefined,
  name: string,
): last is ColumnGroup<R> {
  if (last === undefined) return false;
  if (!('children' in last)) return false;
  return last.headerCellClass?.includes(groupClass(name)) ?? false;
}

function toGridColumn<R>(
  column: GridColumn<R>,
  colIdx: number,
  chrome: ColumnChrome<R>,
): Column<R> {
  // A folded group's placeholder holds nothing and offers nothing: its own heading is the
  // group's, one row up, and sorting or filtering an empty column is a control that lies.
  if (isStrip(column.key)) {
    return {
      key: column.key,
      name: '',
      width: STRIP_WIDTH,
      minWidth: STRIP_WIDTH,
      maxWidth: STRIP_WIDTH,
      resizable: false,
      sortable: false,
      cellClass: 'mo-grid-cell--strip',
      headerCellClass: 'mo-grid-head mo-grid-head--strip',
      renderHeaderCell: () => null,
      renderCell: () => null,
    };
  }

  return {
    key: column.key,
    name: column.label,
    width: widthOf(column, chrome.widths),
    minWidth: floorOf(column),
    maxWidth: column.maxWidth,
    resizable: true,
    sortable: true,
    // Per row, because one column can hold both kinds: a tier is typed into on an item measured
    // by quantity and toggled on one that is not.
    editable: (row: R) => opensEditorOn(column, row),
    frozen: chrome.frozen && colIdx === 0 ? 'start' : undefined,
    cellClass: (row: R) => {
      const rowIdx = chrome.rowIndex.get(row);
      return rowIdx === undefined
        ? undefined
        : cellClasses(
            column,
            { rowIdx, colIdx },
            { range: chrome.range, fillPreview: chrome.fillPreview },
            {
              writable: chrome.canWrite && writesOn(column, row),
              entry: chrome.canWrite,
              edited: column.edited?.(row) ?? false,
              invalid: column.invalid?.(row) ?? false,
            },
          );
    },
    renderHeaderCell: ({ sortDirection }) => (
      <GridHeaderCell
        label={column.label}
        sortDirection={sortDirection}
        filtering={chrome.filtering}
        filter={chrome.filters[column.key] ?? ''}
        onFilterChange={(value) => chrome.onFilterChange(column.key, value)}
        onHide={() => chrome.onHide(column.key)}
        onContextMenu={(event) => chrome.onHeaderContextMenu(column.key, event)}
      />
    ),
    // react-data-grid v7 hashes its own class names, so the header is reachable only through
    // the class the column hands it — there is no `.rdg-header-row` to select.
    headerCellClass: headerClasses(column),
    renderCell: ({ row, rowIdx }) => (
      <>
        {column.renderCell ? column.renderCell(row) : column.read(row) || '—'}
        {isFillCorner(column, chrome, { row, rowIdx, colIdx }) && (
          <span
            className="mo-grid-fill-handle"
            aria-hidden="true"
            onMouseDown={(event) => {
              // Not the cell's mousedown: this starts a fill, not a new selection.
              event.stopPropagation();
              event.preventDefault();
              chrome.onStartFill();
            }}
            // Not the cell's double-click either, which would open its editor.
            onDoubleClick={(event) => {
              event.stopPropagation();
              chrome.onFillToEnd();
            }}
          />
        )}
      </>
    ),
    // A column whose cell is its own control opens nothing: `renderEditCell` left undefined is
    // also what tells react-data-grid the cell is not editable, so typing into it does nothing
    // either.
    renderEditCell:
      chrome.editable && opensAnEditor(column)
        ? ({ row, rowIdx, onClose }) => {
            const commit = (value: string) => {
              chrome.onEdit({ rowIdx, colIdx }, value);
              onClose(false);
            };
            const cancel = () => onClose(false);

            return typeof column.editor === 'function' ? (
              column.editor({ row, value: column.read(row), commit, cancel })
            ) : (
              <GridCellEditor
                initialValue={column.read(row)}
                numeric={column.numeric}
                type={column.inputType}
                onCommit={commit}
                onCancel={cancel}
              />
            );
          }
        : undefined,
  };
}

/**
 * The column's width, as a number whenever one can be given — the share it was allotted, or its
 * own floor on the first render, before the box has been measured.
 *
 * Never `undefined`, because that is what makes react-data-grid size the track `auto`, measure
 * it, and then prefer that measurement to every width stated afterwards. A *string* width is
 * passed through: that is the escape hatch for a column that really must not move.
 */
function widthOf<R>(column: GridColumn<R>, widths: ReadonlyMap<string, number>): number | string {
  if (typeof column.width === 'string') return column.width;
  return widths.get(column.key) ?? floorOf(column);
}

/**
 * The one cell that carries the handle: the bottom-right of the block — and only when *that*
 * column takes entry.
 *
 * `canWrite` is a fact about the grid, not about this column. A block whose right edge lands on
 * a read-only column offered a handle that dragged and wrote nothing, which is worse than no
 * handle: it says the fill was refused only after the gesture is over.
 */
function isFillCorner<R>(
  column: GridColumn<R>,
  chrome: ColumnChrome<R>,
  { row, rowIdx, colIdx }: { row: R; rowIdx: number; colIdx: number },
): boolean {
  const { canWrite, range } = chrome;
  if (!canWrite) return false;
  if (!writesOn(column, row)) return false;
  return range !== null && rowIdx === range.bottom && colIdx === range.right;
}
