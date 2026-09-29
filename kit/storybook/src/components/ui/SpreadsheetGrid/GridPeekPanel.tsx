import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { DataGrid, type Column, type DataGridHandle } from 'react-data-grid';
import { GridPeekHeader } from './GridGroupHeader';
import { headerClasses } from './cellClasses';
import { groupClass } from './gridGroups';
import type { GridColumn } from './gridColumn';

/**
 * A folded group, looked at without unfolding it — its columns drawn on top of the grid,
 * anchored on the strip that stands for them.
 *
 * Over rather than back in place, because putting them back moves every column to their right:
 * someone who folded « L'élément » to reach the entry columns and then wants to check a
 * description would have the cell they were typing in slide out from under the cursor. The
 * panel opens, is read, and closes, and nothing underneath has moved.
 *
 * It is its own `DataGrid` rather than a hand-rolled list so the cells are the same cells —
 * same widths, same alignment, same two header rows — and the only thing to keep in step is how
 * far down the two are scrolled. It reads and does not write: the block, the fill and the
 * clipboard belong to the grid underneath, which still holds the selection.
 */
export function GridPeekPanel<R>({
  name,
  columns,
  rows,
  rowHeight,
  headerHeight,
  container,
  handle,
  onUnfold,
  onClose,
}: {
  name: string;
  columns: readonly GridColumn<R>[];
  rows: readonly R[];
  rowHeight: number;
  headerHeight: number;
  /** The grid's outer box, which the panel is positioned inside. */
  container: RefObject<HTMLDivElement | null>;
  /** The grid itself — its `element` is the scroller the panel anchors on and follows. */
  handle: RefObject<DataGridHandle | null>;
  onUnfold: () => void;
  onClose: () => void;
}) {
  const panel = useRef<DataGridHandle>(null);
  // Read on the render that mounts the panel, which is one commit after the grid's own: the
  // refs are filled by then, and a state copy of them would only be a frame behind.
  const body = handle.current?.element ?? null;
  const outer = container.current;
  const anchor = body?.querySelector<HTMLElement>(`.${groupClass(name)}`) ?? null;
  const box = useAnchoredBox(anchor, body, outer, naturalWidth(columns));
  useSyncedScroll(body, () => panel.current?.element ?? null, box !== null);
  useCloseOn(onClose, outer);

  const grouped = useMemo(
    () => [
      {
        name: <GridPeekHeader name={name} onUnfold={onUnfold} />,
        headerCellClass: 'mo-grid-group',
        children: columns.map(toReadOnlyColumn),
      },
    ],
    [columns, name, onUnfold],
  );

  if (!box) return null;

  return (
    <div className="mo-grid-peek" style={box}>
      <DataGrid
        ref={panel}
        aria-label={name}
        className="mo-grid-rdg mo-grid-peek-grid"
        columns={grouped}
        rows={rows as R[]}
        rowHeight={rowHeight}
        headerRowHeight={headerHeight}
        style={{ blockSize: box.height }}
      />
    </div>
  );
}

/** The same cell, minus everything that writes: the panel is a look, not a second grid. */
function toReadOnlyColumn<R>(column: GridColumn<R>): Column<R> {
  return {
    key: column.key,
    name: column.label,
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
    headerCellClass: headerClasses(column),
    cellClass: [column.numeric ? 'mo-grid-cell--numeric' : '', column.muted ? 'mo-grid-cell--muted' : '']
      .filter(Boolean)
      .join(' '),
    renderCell: ({ row }) => (column.renderCell ? column.renderCell(row) : column.read(row) || '—'),
  };
}

/** What the group's columns add up to, which is how wide the panel wants to be. */
function naturalWidth<R>(columns: readonly GridColumn<R>[]): number {
  return columns.reduce(
    (total, column) => total + (typeof column.width === 'number' ? column.width : DEFAULT_WIDTH),
    2,
  );
}

/** What react-data-grid gives a column that states nothing, near enough for a measurement. */
const DEFAULT_WIDTH = 120;

/**
 * Where the panel sits: on the strip's left edge, over the rows, as tall as they are — and
 * pushed back inside the grid when opening there would hang it off the right edge, the way a
 * menu flips rather than being clipped. Re-measured on every scroll and resize, because the
 * strip moves with them.
 */
function useAnchoredBox(
  anchor: HTMLElement | null,
  body: HTMLElement | null,
  container: HTMLElement | null,
  wants: number,
) {
  const [box, setBox] = useState<
    { left: number; top: number; height: number; width: number } | null
  >(null);

  useLayoutEffect(() => {
    if (anchor === null) return;
    if (body === null) return;
    if (container === null) return;

    const measure = () => {
      const strip = anchor.getBoundingClientRect();
      const grid = body.getBoundingClientRect();
      const origin = container.getBoundingClientRect();
      const width = Math.min(wants, grid.width);
      // Never left of the grid either: a strip scrolled under the frozen column would
      // otherwise drag the panel out past the edge of the box it lives in.
      const left = Math.min(Math.max(strip.left, grid.left), grid.right - width);
      setBox({
        left: left - origin.left,
        top: grid.top - origin.top,
        height: grid.height,
        width,
      });
    };

    measure();
    body.addEventListener('scroll', measure);
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    window.addEventListener('resize', measure);
    return () => {
      body.removeEventListener('scroll', measure);
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [anchor, body, container, wants]);

  return box;
}

/**
 * The two scrollers kept level, both ways — a wheel over the panel has to move the rows under
 * it too, or the panel and the grid disagree about which line is which. Guarded on equality,
 * because assigning the value a scroller already has is what makes a pair of them loop.
 */
function useSyncedScroll(
  body: HTMLElement | null,
  getPanel: () => HTMLElement | null,
  ready: boolean,
) {
  useEffect(() => {
    if (!ready) return;
    const mine = getPanel();
    if (mine === null) return;
    if (body === null) return;
    mine.scrollTop = body.scrollTop;

    const follow = (from: HTMLElement, to: HTMLElement) => () => {
      if (to.scrollTop !== from.scrollTop) to.scrollTop = from.scrollTop;
    };
    const onBody = follow(body, mine);
    const onMine = follow(mine, body);
    body.addEventListener('scroll', onBody);
    mine.addEventListener('scroll', onMine);
    return () => {
      body.removeEventListener('scroll', onBody);
      mine.removeEventListener('scroll', onMine);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `getPanel` reads a ref
  }, [body, ready]);
}

/** Escape, or a press anywhere outside the grid — a peek is a look, not a mode. */
function useCloseOn(onClose: () => void, container: HTMLElement | null) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const onPointerDown = (event: MouseEvent) => {
      if (container && !container.contains(event.target as Node)) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [onClose, container]);
}
