import { useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import { VisuallyHidden } from '../../../primitives/visually-hidden/visually-hidden';
import './table.css';

export type SortDirection = 'ascending' | 'descending';

export interface TableSort {
  key: string;
  direction: SortDirection;
}

export interface TableColumn<Row> {
  key: string;
  /** The column name. It labels the header, the sort button and the `data-label` of each value in the card stack. */
  header: string;
  /** `start` for text, `end` to push a value right, `number` for figures: right-aligned in the mono text style. */
  align?: 'start' | 'end' | 'number';
  /** The header is a button that asks for a sort. The caller sorts the rows. */
  sortable?: boolean;
  /** The cell is the row header (`th scope="row"`): the human-readable identifier of the row. */
  rowHeader?: boolean;
  /** The cell holds row actions. The header stays in the tree for assistive technology, and the card stack prints no label. */
  actions?: boolean;
  cell: (row: Row) => ReactNode;
}

/** Text the table speaks or prints. Override for another language. */
export interface TableLabels {
  selectAll: (rowCount: number) => string;
  selectRow: (rowLabel: string) => string;
  sorted: (header: string, direction: SortDirection) => string;
  selectionSummary: (selected: number, total: number) => string;
  loading: string;
}

const DEFAULT_LABELS: TableLabels = {
  selectAll: (rowCount) => `Select all ${rowCount} rows on this page`,
  selectRow: (rowLabel) => `Select ${rowLabel}`,
  sorted: (header, direction) => `Sorted by ${header}, ${direction}`,
  selectionSummary: (selected, total) => `${selected} of ${total} rows on this page selected`,
  loading: 'Loading rows',
};

export interface TableProps<Row> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The table's name. Required: it names the table and its scroll region. */
  caption: string;
  /** Keep the caption for assistive technology and hide it from the eye. */
  hideCaption?: boolean;
  columns: readonly TableColumn<Row>[];
  rows: readonly Row[];
  getRowId: (row: Row) => string;
  /** The name of a row's checkbox, such as its identifier. Defaults to the row id. */
  getRowLabel?: (row: Row) => string;
  /** The column and direction the caller has sorted by. */
  sort?: TableSort | null;
  onSortChange?: (sort: TableSort) => void;
  /** Ids of the selected rows, on any page. Giving `onSelectionChange` turns on the checkbox column. */
  selectedIds?: readonly string[];
  onSelectionChange?: (ids: string[]) => void;
  density?: 'comfortable' | 'compact';
  /** Keep the header in view. Give the root a `max-block-size` so the region scrolls. */
  sticky?: boolean;
  /** Show skeleton rows that mirror the columns. */
  loading?: boolean;
  skeletonRows?: number;
  /** Content for a row set with no rows. The caller supplies the empty state; the table imports no pattern. */
  empty?: ReactNode;
  /** The rows failed to load. Replaces the rows; announced as an alert. */
  error?: ReactNode;
  /** Some rows loaded and some did not. Shown under the rows. */
  partial?: ReactNode;
  labels?: Partial<TableLabels>;
}

const alignClass = (align: TableColumn<unknown>['align']) => (align === 'end' || align === 'number' ? `ds-table__cell--${align}` : undefined);

function HeaderCheckbox({ checked, mixed, label, onChange }: { checked: boolean; mixed: boolean; label: string; onChange: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = mixed;
  }, [mixed]);
  return <input ref={ref} type="checkbox" checked={checked} aria-label={label} onChange={onChange} />;
}

export function Table<Row>({
  caption,
  hideCaption = false,
  columns,
  rows,
  getRowId,
  getRowLabel = getRowId,
  sort = null,
  onSortChange,
  selectedIds = [],
  onSelectionChange,
  density = 'comfortable',
  sticky = false,
  loading = false,
  skeletonRows = 5,
  empty,
  error,
  partial,
  labels,
  className,
  ...rest
}: TableProps<Row>) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const captionId = useId();
  const [announcement, setAnnouncement] = useState('');
  const selectable = onSelectionChange !== undefined;
  const columnCount = columns.length + (selectable ? 1 : 0);
  const pageIds = rows.map(getRowId);
  const selected = new Set(selectedIds);
  const pageSelected = pageIds.filter((id) => selected.has(id)).length;
  const allSelected = pageIds.length > 0 && pageSelected === pageIds.length;

  const toggleAll = () => {
    onSelectionChange?.(allSelected ? selectedIds.filter((id) => !pageIds.includes(id)) : [...new Set([...selectedIds, ...pageIds])]);
  };
  const toggleRow = (id: string) => {
    onSelectionChange?.(selected.has(id) ? selectedIds.filter((other) => other !== id) : [...selectedIds, id]);
  };
  const requestSort = (column: TableColumn<Row>) => {
    const direction: SortDirection = sort?.key === column.key && sort.direction === 'ascending' ? 'descending' : 'ascending';
    onSortChange?.({ key: column.key, direction });
    setAnnouncement(text.sorted(column.header, direction));
  };

  const classes = ['ds-table', `ds-table--${density}`, sticky && 'ds-table--sticky', className];
  const slotRow = (content: ReactNode, kind: string) => (
    <tr className="ds-table__row ds-table__row--slot" role="row">
      <td className={`ds-table__cell ds-table__cell--slot ds-table__cell--${kind}`} colSpan={columnCount} role="cell">
        {content}
      </td>
    </tr>
  );

  return (
    <div {...rest} className={classes.filter(Boolean).join(' ')}>
      <div className="ds-table__scroll" role="region" aria-labelledby={captionId} tabIndex={0}>
        <table className="ds-table__table" role="table" aria-busy={loading || undefined}>
          <caption id={captionId} className={hideCaption ? 'ds-table__caption ds-table__caption--hidden' : 'ds-table__caption'}>
            {caption}
          </caption>
          <thead role="rowgroup">
            <tr className="ds-table__row" role="row">
              {selectable && (
                <th scope="col" className="ds-table__cell ds-table__cell--select ds-table__head" role="columnheader">
                  <label className="ds-table__check">
                    <HeaderCheckbox
                      checked={allSelected}
                      mixed={pageSelected > 0 && !allSelected}
                      label={text.selectAll(pageIds.length)}
                      onChange={toggleAll}
                    />
                  </label>
                </th>
              )}
              {columns.map((column) => {
                const direction = sort?.key === column.key ? sort.direction : undefined;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    role="columnheader"
                    aria-sort={column.sortable ? (direction ?? 'none') : undefined}
                    className={['ds-table__cell', 'ds-table__head', alignClass(column.align), column.sortable && 'ds-table__head--sortable'].filter(Boolean).join(' ')}
                  >
                    {column.sortable ? (
                      <button type="button" className="ds-table__sort" onClick={() => requestSort(column)}>
                        <span>{column.header}</span>
                        <span className="ds-table__direction">{direction && <Icon glyph={direction === 'ascending' ? 'chevron-up' : 'chevron-down'} size="sm" />}</span>
                      </button>
                    ) : column.actions ? (
                      <VisuallyHidden>{column.header}</VisuallyHidden>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody role="rowgroup">
            {loading
              ? Array.from({ length: skeletonRows }, (_, index) => (
                  <tr key={index} className="ds-table__row ds-table__row--skeleton" role="row">
                    {selectable && (
                      <td className="ds-table__cell ds-table__cell--select" role="cell">
                        <span className="ds-table__skeleton ds-table__skeleton--check" />
                      </td>
                    )}
                    {columns.map((column, at) => (
                      <td key={column.key} data-label={column.actions ? undefined : column.header} className={['ds-table__cell', alignClass(column.align)].filter(Boolean).join(' ')} role="cell">
                        {index === 0 && at === 0 && <VisuallyHidden>{text.loading}</VisuallyHidden>}
                        <span className="ds-table__skeleton" />
                      </td>
                    ))}
                  </tr>
                ))
              : error
                ? slotRow(<div role="alert">{error}</div>, 'error')
                : rows.length === 0
                  ? empty && slotRow(empty, 'empty')
                  : rows.map((row) => {
                      const id = getRowId(row);
                      const isSelected = selected.has(id);
                      return (
                        <tr key={id} className="ds-table__row ds-table__row--data" data-selected={isSelected || undefined} role="row">
                          {selectable && (
                            <td className="ds-table__cell ds-table__cell--select" role="cell">
                              <label className="ds-table__check">
                                <input type="checkbox" checked={isSelected} aria-label={text.selectRow(getRowLabel(row))} onChange={() => toggleRow(id)} />
                              </label>
                            </td>
                          )}
                          {columns.map((column) => {
                            const Cell = column.rowHeader ? 'th' : 'td';
                            return (
                              <Cell
                                key={column.key}
                                {...(column.rowHeader ? { scope: 'row' } : {})}
                                role={column.rowHeader ? 'rowheader' : 'cell'}
                                data-label={column.actions ? undefined : column.header}
                                className={['ds-table__cell', alignClass(column.align), column.rowHeader && 'ds-table__cell--row-header'].filter(Boolean).join(' ')}
                              >
                                {column.cell(row)}
                              </Cell>
                            );
                          })}
                        </tr>
                      );
                    })}
            {!loading && !error && rows.length > 0 && partial && slotRow(<div role="status">{partial}</div>, 'partial')}
          </tbody>
        </table>
      </div>
      {selectable && !loading && (
        <p className="ds-table__summary">{text.selectionSummary(pageSelected, pageIds.length)}</p>
      )}
      <VisuallyHidden role="status">{announcement}</VisuallyHidden>
    </div>
  );
}
