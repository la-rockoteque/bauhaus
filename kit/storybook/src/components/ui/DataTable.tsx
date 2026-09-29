import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Skeleton } from './Skeleton'
import './DataTable.css'

export type SortDirection = 'asc' | 'desc'

export interface DataTableColumn<T, K extends string = string> {
  key: K
  header: ReactNode
  cell: (row: T) => ReactNode
  /** Right-aligns and applies tabular figures — for quantities and money. */
  numeric?: boolean
  /** Opts the header into the sort button. The caller does the sorting. */
  sortable?: boolean
  width?: string
  /** Set on the column's `th` and every one of its `td`s. */
  className?: string
  /** Renders the body cell as `<th scope="row">` — the cell that names the row. */
  rowHeader?: boolean
  /** The label a phone card prints before the value. Defaults to the header when it is a string; `false` prints none. */
  cardLabel?: string | false
  /** On a phone card, this cell is the card's title: full width, no label. */
  cardTitle?: boolean
  /** Not shown on a phone card — a desktop-only affordance such as a row arrow. */
  cardHidden?: boolean
  /** The cell while loading, for a column whose cells are taller than one line of text. */
  skeleton?: ReactNode
}

interface DataTableProps<T, K extends string = string> {
  rows: readonly T[]
  columns: readonly DataTableColumn<T, K>[]
  /** Stable identity per row. Never the array index — rows reorder on sort. */
  rowKey: (row: T) => string
  /** Names the table for assistive tech — « Réquisitions soumises ». */
  label: string
  /** Shown in place of the body when there are no rows. */
  empty?: ReactNode
  sort?: { key: K; direction: SortDirection }
  onSortChange?: (key: K) => void
  /** Marks the row the detail pane is showing. */
  selectedKey?: string
  onRowClick?: (row: T) => void
  /**
   * Nesting level of a row, 0 for a top-level one. A nested row is indented and
   * marked with a turn-down arrow, and keeps its own cells so the columns still
   * line up — a sub-table would break that alignment.
   */
  rowDepth?: (row: T) => number
  /** Extra class on a row, for a state the row carries (in review, inactive…). */
  rowClassName?: (row: T) => string | undefined
  /** Below 768px, each row becomes a card of labelled values. */
  cards?: boolean
  /** Row background on hover — only worth it when rows are clickable. */
  hoverable?: boolean
  /**
   * First load: the real header stays, the body is three skeleton rows in the columns'
   * own alignment, and sorting is off until the rows arrive.
   */
  loading?: boolean
  /** A totals row, per column key; a column it does not name gets an empty cell. Pass it once the rows are in. */
  footer?: Partial<Record<K, ReactNode>>
  className?: string
}

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const

const classes = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ') || undefined

const cellClass = (column: Pick<DataTableColumn<unknown>, 'numeric' | 'className'>) =>
  classes(column.numeric && 'mo-table-num', column.className)

const headerText = (header: ReactNode) => (typeof header === 'string' ? header : undefined)

const cardLabel = (column: Pick<DataTableColumn<unknown>, 'cardLabel' | 'cardTitle' | 'header'>) => {
  if (column.cardTitle || column.cardLabel === false) return undefined
  return column.cardLabel ?? headerText(column.header)
}

// Varied, so the placeholder reads as rows of text rather than a grid.
const SKELETON_WIDTHS = ['70%', '55%', '85%'] as const

function SkeletonRows<T, K extends string>({ columns }: { columns: readonly DataTableColumn<T, K>[] }) {
  return SKELETON_WIDTHS.map((width) => (
    <tr key={width}>
      {/* The body's own cell — tag and class — or the row would not be a real row's height. */}
      {columns.map((column) => {
        const Cell = column.rowHeader ? 'th' : 'td'
        return (
          <Cell key={column.key} className={bodyCellClass(column)} data-col={column.key}>
            {column.skeleton ?? <Skeleton variant="line" width={column.numeric ? '6ch' : width} />}
          </Cell>
        )
      })}
    </tr>
  ))
}

function SortArrow({ direction }: { direction?: SortDirection }) {
  const Icon = direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ArrowUpDown
  return <Icon className="mo-table-sort-arrow" size={12} aria-hidden="true" />
}

function HeaderCell<T, K extends string>({
  column,
  direction,
  onSortChange,
  disabled,
}: {
  column: DataTableColumn<T, K>
  direction?: SortDirection
  onSortChange?: (key: K) => void
  disabled?: boolean
}) {
  const sortable = column.sortable && onSortChange !== undefined
  return (
    <th
      scope="col"
      style={{ width: column.width }}
      className={cellClass(column)}
      data-col={column.key}
      aria-sort={direction ? ARIA_SORT[direction] : undefined}
    >
      {sortable ? (
        <button
          type="button"
          className="mo-table-sort"
          disabled={disabled}
          onClick={() => onSortChange(column.key)}
        >
          {column.header}
          <SortArrow direction={direction} />
        </button>
      ) : (
        column.header
      )}
    </th>
  )
}

const bodyCellClass = (column: Pick<DataTableColumn<unknown>, 'numeric' | 'className' | 'cardTitle' | 'cardHidden'>) =>
  classes(cellClass(column), column.cardTitle && 'mo-table-card-title', column.cardHidden && 'mo-table-card-hidden')

function BodyCell<T, K extends string>({
  column,
  row,
  marked,
}: {
  column: DataTableColumn<T, K>
  row: T
  /** First cell of a nested row: it carries the turn-down arrow. */
  marked: boolean
}) {
  const Cell = column.rowHeader ? 'th' : 'td'
  return (
    <Cell
      scope={column.rowHeader ? 'row' : undefined}
      className={bodyCellClass(column)}
      data-col={column.key}
      data-label={cardLabel(column)}
    >
      {marked && (
        <span className="mo-table-child-mark" aria-hidden="true">
          {'\u21b3'}
        </span>
      )}
      {column.cell(row)}
    </Cell>
  )
}

// Enter only when the row itself has focus — Enter on a button inside the row is the button's.
const clickableRow = (open: () => void) => ({
  tabIndex: 0,
  onClick: open,
  onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === 'Enter' && event.target === event.currentTarget) open()
  },
})

function BodyRow<T, K extends string>({
  row,
  columns,
  depth,
  selected,
  onRowClick,
  className,
}: {
  row: T
  columns: readonly DataTableColumn<T, K>[]
  depth: number
  selected?: boolean
  onRowClick?: (row: T) => void
  className?: string
}) {
  return (
    <tr
      className={classes(depth > 0 && 'mo-table-child', selected && 'is-selected', className)}
      style={depth > 0 ? ({ '--mo-depth': depth } as CSSProperties) : undefined}
      // aria-current, not aria-selected: the table keeps its implicit
      // role="table", where aria-selected on a row has no defined mapping and
      // assistive tech ignores it. Promoting the whole table to role="grid" to
      // legalise it would promise cell-level arrow navigation we do not have.
      aria-current={selected ? 'true' : undefined}
      {...(onRowClick && clickableRow(() => onRowClick(row)))}
    >
      {columns.map((column, index) => (
        <BodyCell key={column.key} column={column} row={row} marked={index === 0 && depth > 0} />
      ))}
    </tr>
  )
}

function TableBody<T, K extends string>({
  rows,
  columns,
  rowKey,
  empty,
  selectedKey,
  onRowClick,
  rowDepth,
  rowClassName,
  loading,
}: Pick<
  DataTableProps<T, K>,
  'rows' | 'columns' | 'rowKey' | 'empty' | 'selectedKey' | 'onRowClick' | 'rowDepth' | 'rowClassName' | 'loading'
>) {
  if (loading) return <SkeletonRows columns={columns} />

  if (rows.length === 0 && empty !== undefined) {
    return (
      <tr>
        <td className="mo-table-empty" colSpan={columns.length}>
          {empty}
        </td>
      </tr>
    )
  }

  return rows.map((row) => {
    const key = rowKey(row)
    return (
      <BodyRow
        key={key}
        row={row}
        columns={columns}
        depth={rowDepth?.(row) ?? 0}
        selected={selectedKey === undefined ? undefined : key === selectedKey}
        onRowClick={onRowClick}
        className={rowClassName?.(row)}
      />
    )
  })
}

function FooterRow<T, K extends string>({
  columns,
  footer,
}: {
  columns: readonly DataTableColumn<T, K>[]
  footer: Partial<Record<K, ReactNode>>
}) {
  const [first, ...rest] = columns
  return (
    <tfoot>
      <tr>
        <th scope="row" className={cellClass(first)}>
          {footer[first.key]}
        </th>
        {rest.map((column) => (
          <td key={column.key} className={cellClass(column)}>
            {footer[column.key]}
          </td>
        ))}
      </tr>
    </tfoot>
  )
}

/**
 * The `.mo-table` primitive.
 *
 * Sorting is *declared* here and *done* by the caller: which comparator a column
 * needs depends on the data (a date, a French-collated string, a status rank),
 * and a table that guessed would sort dates as text. This renders the affordance
 * and `aria-sort`, and calls back.
 *
 * No paging either — `Pager` and `usePagedFilteredTable` own that, so a server-
 * paged table and a client-paged one look the same here.
 */
export function DataTable<T, K extends string = string>({
  rows,
  columns,
  rowKey,
  label,
  empty,
  sort,
  onSortChange,
  selectedKey,
  onRowClick,
  rowDepth,
  rowClassName,
  cards = false,
  hoverable = false,
  loading = false,
  footer,
  className,
}: DataTableProps<T, K>) {
  return (
    <table
      className={classes('mo-table', hoverable && 'mo-table--hover', cards && 'mo-table--cards', className)}
      aria-label={label}
      aria-busy={loading || undefined}
    >
      <thead>
        <tr>
          {columns.map((column) => (
            <HeaderCell
              key={column.key}
              column={column}
              direction={sort?.key === column.key ? sort.direction : undefined}
              onSortChange={onSortChange}
              disabled={loading}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        <TableBody
          rows={rows}
          columns={columns}
          rowKey={rowKey}
          empty={empty}
          selectedKey={selectedKey}
          onRowClick={onRowClick}
          rowDepth={rowDepth}
          rowClassName={rowClassName}
          loading={loading}
        />
      </tbody>
      {footer && <FooterRow columns={columns} footer={footer} />}
    </table>
  )
}
