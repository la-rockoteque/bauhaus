import { useCallback, useMemo, useRef, useState } from 'react';
import type { DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import './spreadsheetGrid.css';
import { GridBody, ROW_HEIGHT } from './GridBody';
import { GridEmpty } from './GridEmpty';
import { GridPeekPanel } from './GridPeekPanel';
import { GridFootbar } from './GridFootbar';
import { GridMore } from './GridMore';
import { GridToolbar } from './GridToolbar';
import { useGridMenus, type GridMenuTarget } from './useGridMenus';
import { GridRowActions, type GridRowAction } from './GridRowActions';
import { useHoveredRow } from './useHoveredRow';
import { ContextMenu, useContextMenu } from '../ContextMenu';
import type { GridSave } from './GridToolbar';
import { useExpanded } from './useExpanded';
import { useGridBox } from './useGridBox';
import { fillWidths } from './gridWidths';
import { useGridActions } from './useGridActions';
import { useGridAria } from './useGridAria';
import { useGridClipboard } from './useGridClipboard';
import { useGridColumns } from './useGridColumns';
import { useGridEdits } from './useGridEdits';
import { useGridKeyboard } from './useGridKeyboard';
import { useGridSelection } from './useGridSelection';
import { useGridView } from './useGridView';
import { selectionAggregates } from './gridView';
import { fillDownTarget, fillEdits, rangeContains, type CellRange } from './gridSelection';
import { foldGroups, isStrip } from './gridGroups';
import { withEditable, type Editable, type GridColumn } from './gridColumn';

/** How many rows are on screen before the grid scrolls on its own, outside full screen. */
const DEFAULT_VISIBLE_ROWS = 8;

/**
 * A spreadsheet the user already knows how to drive: a rectangular selection, a block of cells
 * on and off the clipboard, a fill handle in both directions, a toolbar, and the browser's own
 * full screen.
 *
 * react-data-grid draws the cells and virtualizes them — every row is handed over, not the
 * first hundred, so a cabling sheet's 840 lines scroll rather than being truncated. Everything
 * above one active cell is this directory: v7 tracks a single position, copies a single cell
 * and fills a single column downwards.
 *
 * **Entry is per column and opt-in.** A `GridColumn` with a `write` takes typing, pasting,
 * filling and clearing; one without is read-only and refuses all four, including the writes a
 * paste would spill sideways into it. A grid whose columns all lack `write` — the two import
 * previews — is a reader with a toolbar: copy and export stay, the rest goes dark.
 */
export interface SpreadsheetGridProps<R> {
  rows: readonly R[];
  columns: readonly GridColumn<R>[];
  /**
   * Called with a whole new `rows` array after any write. Absent = the grid is read-only
   * however its columns are declared.
   */
  onRowsChange?: (rows: readonly R[]) => void;
  /** Names the grid for assistive tech — « Lignes du bordereau ». */
  label: string;
  /** Rows on screen before it scrolls. Ignored in full screen, where it fills the window. */
  visibleRows?: number;
  /**
   * Rows shown at all before the grid stops and offers « Voir la liste complète » instead of
   * scrolling — for a preview whose job is « is this the right file », not « read all 840 lines
   * here ». Absent, every row is drawn and the grid scrolls, which stays the default: a grid
   * someone works in must not hide rows behind a button.
   *
   * The cap is what the grid *is* while collapsed, not a curtain over it: the rows past it are
   * not selected, not copied, not exported. They come back whole in full screen, which is where
   * the button leads.
   */
  maxRows?: number;
  /**
   * Row height in px. The default suits a dense read-only list; a grid whose cells hold a
   * control rather than text needs the room — a radio group does not fit in 32px.
   */
  rowHeight?: number;
  /**
   * Told whenever the grid is expanded or collapsed, Escape included.
   *
   * For a caller that composes rather than embeds: show a table inline, mount the grid when
   * someone asks for it, and unmount it when this says the user left. The grid does not do that
   * for you on purpose — which surface a page wants inline is the page's decision, not a
   * primitive's.
   */
  onExpandedChange?: (isExpanded: boolean) => void;
  /**
   * Start expanded — for a caller that mounts the grid *because* someone pressed « ouvrir », so
   * they do not land on a collapsed grid and have to press again.
   */
  openExpanded?: boolean;
  /**
   * What the page wants saved, if anything. The grid draws the button and reports the press; it
   * does not know what saving means here — these rows may be a preview nobody writes back.
   */
  save?: GridSave;
  /**
   * Which columns take entry without declaring a `write` of their own — `true` for all of them,
   * or a list of keys. Needs `onCellChange`; a column's own `write` always wins.
   */
  editable?: Editable;
  /** Where a value typed into an `editable` column goes. Returns a new row, never a mutated one. */
  onCellChange?: (row: R, column: GridColumn<R>, value: string) => R;
  /**
   * Names the *kind* of grid this is — « tracker.step-items », « tracker.bid-schedule » — so a
   * reader's hidden columns come back on the next visit.
   *
   * A family, never one page's id: two steps of the same tracker are the same table to the
   * person reading them, and a key carrying the step id would remember nothing because nobody
   * visits the same step twice in a row. Without it the grid remembers nothing, which is the
   * right default for a grid that appears once.
   */
  family?: string;
  /**
   * What can be done to one row — shown as icons over its right edge while the pointer is on
   * it, and only while the grid is collapsed.
   *
   * Not columns. An action is not data: a column of buttons costs a heading nobody reads, a
   * slice of every row's width whether or not anyone clicks it, and a control competing with
   * the values beside it.
   */
  rowActions?: readonly GridRowAction<R>[];
  /**
   * Which column groups the reader may fold away. Nothing folds unless it is named here or in
   * `collapsedGroups` — a heading is a heading, and turning every one of them into a control
   * puts a chevron on groups whose columns are the point of the table.
   */
  foldableGroups?: readonly string[];
  /**
   * Which of them arrive folded — the entry columns of a step, say, on a page whose job is to
   * be read and whose entry happens in the expanded grid. Naming a group here makes it
   * foldable; `foldableGroups` is for the ones that start open.
   *
   * A first-visit default, not a setting: folding is the reader's, and once they have touched
   * it their answer is what comes back.
   */
  collapsedGroups?: readonly string[];
}

/** Folding is an inline affordance: expanded, the grid has the width it was folded for. */
const NOTHING_FOLDED: ReadonlySet<string> = new Set();


/**
 * Everything the grid is made of, assembled.
 *
 * Its own function because the component underneath is composition and markup, and a reader
 * looking for « what draws » should not have to walk past « what is wired to what » to reach
 * it. Nothing here is reusable on its own; it is one place rather than a better place.
 */
function useSpreadsheetGrid<R>({
  rows,
  columns,
  onRowsChange,
  label,
  visibleRows: visibleRowCount = DEFAULT_VISIBLE_ROWS,
  maxRows,
  rowHeight = ROW_HEIGHT,
  openExpanded = false,
  onExpandedChange,
  save,
  editable,
  onCellChange,
  family,
  rowActions = [],
  foldableGroups,
  collapsedGroups,
}: SpreadsheetGridProps<R>) {
  const container = useRef<HTMLDivElement>(null);
  const handle = useRef<DataGridHandle>(null);

  // The last thing that happened and left no visible trace of its own — an undo, a paste that
  // was partly refused. Read out once, then replaced by the next one.
  const [action, setAction] = useState<string | null>(null);

  // A blanket `editable` is folded into the columns once, so everything downstream — what a
  // paste may write, what the toolbar offers, which cells open an editor — reads one answer.
  const effective = useMemo(
    () => withEditable(columns, editable, onCellChange),
    [columns, editable, onCellChange],
  );

  // Naming a group as folded-by-default is also what makes it foldable — a caller should not
  // have to say the same group twice to mean « this one, and it starts closed ».
  const foldable = useMemo(
    () => new Set([...(foldableGroups ?? []), ...(collapsedGroups ?? [])]),
    [foldableGroups, collapsedGroups],
  );
  const view = useGridView(rows, effective, family, collapsedGroups, foldable);
  const { headerRowCount, headerHeight } = view;

  // The tools belong to the expanded grid, so what they narrowed it with is put down on the way
  // out — a search or a filter still hiding rows from behind a bar that is no longer there is a
  // grid that lies about how many lines it holds, with nothing on screen to clear it.
  const { isExpanded, toggle: toggleExpanded } = useExpanded(view.collapse, openExpanded, onExpandedChange);

  // The cap is lifted in full screen — that is what the button under the fade is for.
  const capped = !isExpanded && maxRows !== undefined && view.shown.length > maxRows;
  const shown = useMemo(
    () => (capped ? view.shown.slice(0, maxRows) : view.shown),
    [capped, view.shown, maxRows],
  );

  // What is actually drawn: the unhidden columns, with each folded group replaced by the strip
  // that stands for it. Everything downstream indexes *this* — the selection, the clipboard,
  // the context menu — so a column index always means the column the user is looking at.
  const folded = isExpanded ? NOTHING_FOLDED : view.foldedGroups;
  const visible = useMemo(() => foldGroups(view.visible, folded), [view.visible, folded]);
  const peeked = isExpanded ? null : view.peeked;
  const peekColumns = useMemo(
    () => (peeked === null ? [] : view.visible.filter((column) => column.group === peeked)),
    [view.visible, peeked],
  );

  const edits = useGridEdits({
    rows,
    visibleRows: shown,
    visibleColumns: visible,
    onRowsChange,
  });
  const { applyWrites, matrixOf, readAt, canWrite } = edits;

  // The fill handle is handed its own source and target, so it needs no range and can be built
  // before the selection that will call it.
  const fillHandle = useCallback(
    (source: CellRange, target: CellRange) => applyWrites(fillEdits(source, target, readAt)),
    [applyWrites, readAt],
  );

  const selection = useGridSelection({
    rowCount: shown.length,
    colCount: visible.length,
    headerRowCount,
    onFill: canWrite ? fillHandle : undefined,
  });
  const { range } = selection;

  const fillToEnd = useCallback(() => {
    const target = range && fillDownTarget(range, shown.length, readAt);
    if (range && target) fillHandle(range, target);
  }, [range, shown.length, readAt, fillHandle]);

  const clip = useGridClipboard({
    range,
    canWrite,
    applyWrites,
    writesForPaste: edits.writesForPaste,
    matrixOf,
    readAt,
    announce: setAction,
  });

  // One menu, two things it can be about — a cell or a heading.
  const menu = useContextMenu<GridMenuTarget>();
  const hover = useHoveredRow(headerRowCount);

  // The columns share out whatever the box is, so they reach its right edge on any screen and
  // keep reaching it when the window changes.
  //
  // Every column is handed a *number*, on the very first render as much as afterwards. Left to
  // size a track `auto`, react-data-grid measures it once, remembers the measurement and
  // prefers it over anything a column declares later — so a width computed a frame after the
  // box was measured never reached the screen. Given numbers, it never measures at all.
  const gridWidth = useGridBox(handle, shown.length > 0);
  const [pinned, setPinned] = useState<ReadonlyMap<string, number>>(new Map());
  const widths = useMemo(
    () => fillWidths(visible, gridWidth, pinned),
    [visible, gridWidth, pinned],
  );

  const gridColumns = useGridColumns(visible, {
    view,
    folded,
    peeked,
    foldable,
    widths,
    rows: shown,
    selection,
    canWrite,
    editable: onRowsChange !== undefined,
    onEdit: useCallback(
      (position, value: string) => applyWrites([{ position, value }]),
      [applyWrites],
    ),
    onFillToEnd: fillToEnd,
    onHeaderContextMenu: useCallback(
      (columnKey: string, event: React.MouseEvent) =>
        menu.open(event, { kind: 'column', columnKey }),
      [menu],
    ),
  });

  const actions = useGridActions({
    operations: clip,
    undo: edits.undo,
    redo: edits.redo,
    announce: setAction,
    exportRows: shown,
    exportColumns: useMemo(() => visible.filter((column) => !isStrip(column.key)), [visible]),
    label,
    toggleExpanded,
  });

  const onCellKeyDown = useGridKeyboard<R>({
    focus: selection.focus,
    hasRange: range !== null,
    canWrite,
    selectCell: selection.selectCell,
    collapse: selection.clear,
    shortcuts: useMemo(
      () => ({ ...actions, selectAll: selection.selectAll }),
      [actions, selection.selectAll],
    ),
  });

  const toolbar = {
    columns: effective,
    view,
    isExpanded,
    canWrite,
    canUndo: edits.canUndo,
    canRedo: edits.canRedo,
    hasSelection: range !== null,
    actions,
    save,
  };

  const menuContent = useGridMenus({
    target: menu.opened?.target ?? null,
    columns: visible,
    view,
    canWrite,
    hasSelection: range !== null,
    actions,
  });

  const renderers = useGridAria<R>(handle, range, columns);
  const summarise = (of: CellRange | null) =>
    of ? selectionAggregates(matrixOf(of).flat()) : null;

  return {
    container,
    view,
    shown,
    isExpanded,
    peek: {
      name: peeked,
      columns: peekColumns,
      rows: shown,
      rowHeight,
      headerHeight,
      handle,
      container,
      onUnfold: () => peeked !== null && view.toggleGroup(peeked),
      onClose: () => view.setPeeked(null),
    },
    hover,
    rowActions,
    menu,
    menuContent,
    clip,
    selection,
    toolbar,
    // What the cap hides is said twice: the footbar counts it (« 10 de 840 lignes ») and the
    // button offers it — the count is the import's receipt, the button the way to the rest.
    more: capped ? rows.length : null,
    // What the container says about itself, for the stylesheet to answer. Settled here rather
    // than in the markup below, which is meant to read as what the grid is made of.
    flags: {
      'data-expanded': isExpanded ? '' : undefined,
    },
    footbar: {
      shown: shown.length,
      total: rows.length,
      aggregates: summarise(range),
      settledAggregates: summarise(selection.settledRange),
      action,
    },
    body: {
      handle,
      label,
      // A column dragged to a width is fixed there and out of the sharing; the rest go on
      // filling whatever is left.
      onColumnResize: useCallback(
        (column: { key: string }, width: number) =>
          setPinned((was) => new Map(was).set(column.key, width)),
        [],
      ),
      columns: gridColumns,
      rows: shown,
      renderers,
      headerHeight,
      headerRowCount,
      // A capped grid is exactly as tall as what it shows: leaving it shorter would put a
      // scrollbar back on rows the fade already says are the last ones.
      visibleRowCount: capped ? shown.length : visibleRowCount,
      rowHeight,
      isExpanded,
      sortColumns: view.sortColumns,
      onSortColumnsChange: view.setSortColumns,
      onCellMouseDown: selection.onCellMouseDown,
      onCellKeyDown,
      onActivePositionChange: selection.followActive,
      onCellContextMenu: (
        { rowIdx, column, row }: { rowIdx: number; column: { idx: number; key: string }; row: R },
        event: { preventDefault: () => void; clientX: number; clientY: number },
      ) => {
        const position = { rowIdx, colIdx: column.idx };
        // Right-clicking outside the block moves to that cell first — acting on a selection the
        // user cannot see is how « Effacer » deletes the wrong thing.
        if (!range || !rangeContains(range, rowIdx, column.idx)) selection.selectCell(position, false);
        menu.open(event, {
          kind: 'cell',
          position,
          columnKey: column.key,
          value: visible[column.idx]?.read(row) ?? '',
        });
      },
    },
  };
}

export function SpreadsheetGrid<R>(props: SpreadsheetGridProps<R>) {
  const {
    container,
    view,
    shown,
    flags,
    isExpanded,
    clip,
    selection,
    toolbar,
    footbar,
    more,
    body,
    menu,
    menuContent,
    hover,
    rowActions,
    peek,
  } =
    useSpreadsheetGrid(props);

  return (
    <div
      ref={container}
      className="mo-grid"
      {...flags}
      onCopy={clip.onCopy}
      onCut={clip.onCut}
      onPaste={clip.onPaste}
      onMouseOver={(event) => {
        selection.onMouseOver(event);
        hover.onMouseOver(event);
      }}
    >
      <GridToolbar {...toolbar} />


      {shown.length === 0 ? (
        <GridEmpty search={view.search} filters={view.filters} onClear={view.clearNarrowing} />
      ) : (
        <GridBody {...body} />
      )}

      <GridMore total={more} onExpand={toolbar.actions.toggleExpanded} />

      <GridFootbar {...footbar} />

      {/* A folded group, opened over the grid rather than back into it. */}
      {peek.name !== null && shown.length > 0 && (
        <GridPeekPanel
          name={peek.name}
          columns={peek.columns}
          rows={peek.rows}
          rowHeight={peek.rowHeight}
          headerHeight={peek.headerHeight}
          container={peek.container}
          handle={peek.handle}
          onUnfold={peek.onUnfold}
          onClose={peek.onClose}
        />
      )}

      {/* Over the row, not in it — and never while expanded, which is the working mode. */}
      {!isExpanded && hover.hovered && shown[hover.hovered.rowIdx] !== undefined && (
        <div
          className="mo-grid-row-actions-layer"
          style={{ top: hover.hovered.top, height: hover.hovered.height }}
        >
          <GridRowActions row={shown[hover.hovered.rowIdx]} actions={rowActions} />
        </div>
      )}

      {menu.opened && (
        <ContextMenu
          at={menu.opened.at}
          items={menuContent.items}
          label={menuContent.label}
          onClose={menu.close}
        />
      )}
    </div>
  );
}
