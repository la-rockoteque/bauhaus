import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DataTable, type DataTableColumn } from './DataTable'

interface Row {
  id: string
  name: string
  qty: number
}

const ROWS: Row[] = [
  { id: 'a', name: 'Pelle', qty: 3 },
  { id: 'b', name: 'Râteau', qty: 1 },
]

const COLUMNS: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Nom', cell: (row) => row.name, cardTitle: true, rowHeader: true },
  { key: 'qty', header: 'Quantité', numeric: true, className: 'qty-col', cell: (row) => row.qty },
  { key: 'owner', header: <span>Responsable</span>, cardLabel: 'Resp.', cell: () => 'A. Exemple' },
  { key: 'arrow', header: '', cardHidden: true, cell: () => '→' },
]

function renderTable(props: Partial<Parameters<typeof DataTable<Row>>[0]> = {}) {
  return render(
    <DataTable rows={ROWS} columns={COLUMNS} rowKey={(row) => row.id} label="Outils" {...props} />,
  )
}

const firstBodyRow = () => within(screen.getByRole('table')).getAllByRole('row')[1]

describe('DataTable', () => {
  it('labels each body cell for the phone card, from cardLabel or a string header', () => {
    renderTable()
    const cells = firstBodyRow().children
    expect(cells[1]).toHaveAttribute('data-col', 'qty')
    expect(cells[1]).toHaveAttribute('data-label', 'Quantité')
    expect(cells[2]).toHaveAttribute('data-label', 'Resp.')
  })

  it('leaves the card title unlabelled', () => {
    renderTable()
    const title = firstBodyRow().children[0]
    expect(title).not.toHaveAttribute('data-label')
    expect(title).toHaveClass('mo-table-card-title')
  })

  it('prints no card label when cardLabel is false', () => {
    render(
      <DataTable
        rows={ROWS}
        columns={[{ key: 'act', header: 'Actions', cardLabel: false, cell: () => 'x' }]}
        rowKey={(row) => row.id}
        label="Outils"
      />,
    )
    expect(firstBodyRow().children[0]).not.toHaveAttribute('data-label')
  })

  it('marks a card-hidden column', () => {
    renderTable()
    expect(firstBodyRow().children[3]).toHaveClass('mo-table-card-hidden')
  })

  it('opts into card mode only when asked', () => {
    const { rerender } = renderTable()
    expect(screen.getByRole('table')).not.toHaveClass('mo-table--cards')
    rerender(<DataTable rows={ROWS} columns={COLUMNS} rowKey={(row) => row.id} label="Outils" cards />)
    expect(screen.getByRole('table')).toHaveClass('mo-table--cards')
  })

  it('puts rowClassName on the row', () => {
    renderTable({ rowClassName: (row) => (row.id === 'a' ? 'is-locked' : undefined) })
    expect(firstBodyRow()).toHaveClass('is-locked')
  })

  it("puts a column's className on its header and every cell", () => {
    renderTable()
    expect(screen.getByRole('columnheader', { name: 'Quantité' })).toHaveClass('qty-col', 'mo-table-num')
    for (const row of within(screen.getByRole('table')).getAllByRole('row').slice(1)) {
      expect(row.children[1]).toHaveClass('qty-col')
    }
  })

  it('renders a rowHeader column as a row header', () => {
    renderTable()
    expect(screen.getByRole('rowheader', { name: 'Pelle' })).toHaveAttribute('scope', 'row')
  })

  it('opens a clickable row on Enter, but not on Enter inside a button in it', () => {
    const onRowClick = vi.fn()
    const columns: DataTableColumn<Row>[] = [
      ...COLUMNS,
      { key: 'act', header: 'Actions', cell: (row) => <button type="button">Supprimer {row.name}</button> },
    ]
    render(
      <DataTable rows={ROWS} columns={columns} rowKey={(row) => row.id} label="Outils" onRowClick={onRowClick} />,
    )
    const row = firstBodyRow()
    expect(row).toHaveAttribute('tabindex', '0')

    fireEvent.keyDown(screen.getByRole('button', { name: 'Supprimer Pelle' }), { key: 'Enter' })
    expect(onRowClick).not.toHaveBeenCalled()

    fireEvent.keyDown(row, { key: 'Enter' })
    expect(onRowClick).toHaveBeenCalledWith(ROWS[0])
  })

  it('keeps a non-clickable row out of the tab order', () => {
    renderTable()
    expect(firstBodyRow()).not.toHaveAttribute('tabindex')
  })

  it('loads in rows built from the body cells, so a placeholder row is a real row\'s height', () => {
    const columns: DataTableColumn<Row>[] = [
      { ...COLUMNS[0], skeleton: <span data-testid="two-lines" /> },
      COLUMNS[1],
    ]
    renderTable({ rows: [], columns, loading: true })
    const cells = firstBodyRow().children
    expect(cells[0].tagName).toBe('TH')
    expect(within(cells[0] as HTMLElement).getByTestId('two-lines')).toBeInTheDocument()
    expect(cells[1]).toHaveClass('qty-col')
    expect(cells[1].querySelector('.mo-skeleton--line')).not.toBeNull()
  })
})
