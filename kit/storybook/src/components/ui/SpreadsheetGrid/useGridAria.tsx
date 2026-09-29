import { useEffect, useMemo, type Key, type RefObject } from 'react';
import { Cell } from 'react-data-grid';
import type { DataGridHandle } from 'react-data-grid';
import type { GridColumn } from './gridColumn';
import { rangeContains, type CellRange } from './gridSelection';

/**
 * What the selection owes assistive tech, which react-data-grid does not say for it.
 *
 * `aria-multiselectable` goes on the element the grid hands back, because its props allow no
 * way to set it. `aria-selected` goes on each cell through a renderer: the library marks only
 * its own active cell, and it spreads a renderer's props *after* its own attributes, which is
 * what lets the range's answer win. `aria-invalid` rides the same renderer.
 */
export function useGridAria<R>(
  handle: RefObject<DataGridHandle | null>,
  range: CellRange | null,
  columns: readonly GridColumn<R>[],
) {
  useEffect(() => {
    handle.current?.element?.setAttribute('aria-multiselectable', 'true');
  }, [handle]);

  return useMemo(() => {
    const byKey = new Map(columns.map((column) => [column.key, column]));
    return {
      renderCell: (key: Key, props: React.ComponentProps<typeof Cell<R, unknown>>) => (
        <Cell
          key={key}
          {...props}
          aria-selected={range !== null && rangeContains(range, props.rowIdx, props.column.idx)}
          aria-invalid={byKey.get(props.column.key)?.invalid?.(props.row) || undefined}
        />
      ),
    };
  }, [range, columns]);
}
