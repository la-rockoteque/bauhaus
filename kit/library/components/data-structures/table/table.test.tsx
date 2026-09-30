import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Table } from './table';
import type { TableColumn, TableSort } from './table';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

interface Requisition {
  id: string;
  status: string;
  total: number;
}

const ROWS: Requisition[] = [
  { id: 'REQ-1042', status: 'Approved', total: 1204 },
  { id: 'REQ-1043', status: 'Draft', total: 88.5 },
  { id: 'REQ-1044', status: 'Rejected', total: 640 },
];

const COLUMNS: TableColumn<Requisition>[] = [
  { key: 'id', header: 'Requisition', rowHeader: true, sortable: true, cell: (row) => row.id },
  { key: 'status', header: 'Status', cell: (row) => row.status },
  { key: 'total', header: 'Total', align: 'number', sortable: true, cell: (row) => row.total.toFixed(2) },
  { key: 'actions', header: 'Actions', actions: true, cell: (row) => <button type="button">Open {row.id}</button> },
];

function Harness({ selectable = false }: { selectable?: boolean }) {
  const [sort, setSort] = useState<TableSort | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <Table
      caption="Open requisitions"
      columns={COLUMNS}
      rows={ROWS}
      getRowId={(row) => row.id}
      sort={sort}
      onSortChange={setSort}
      {...(selectable ? { selectedIds: selected, onSelectionChange: setSelected } : {})}
    />
  );
}

describe('Table', () => {
  it('is a native table with a caption, a thead and scoped headers', () => {
    render(<Harness />);
    const table = screen.getByRole('table', { name: 'Open requisitions' });
    expect(table.tagName).toBe('TABLE');
    expect(table.querySelector('caption')?.textContent).toBe('Open requisitions');
    expect(table.querySelector('thead')).not.toBeNull();
    const headers = [...table.querySelectorAll('thead th')];
    expect(headers).toHaveLength(COLUMNS.length);
    expect(headers.every((th) => th.getAttribute('scope') === 'col')).toBe(true);
    const rowHeaders = [...table.querySelectorAll('tbody th')];
    expect(rowHeaders).toHaveLength(ROWS.length);
    expect(rowHeaders.every((th) => th.getAttribute('scope') === 'row')).toBe(true);
  });

  it('labels the scroll region with the caption and makes it focusable', () => {
    render(<Harness />);
    const region = screen.getByRole('region', { name: 'Open requisitions' });
    expect(region.getAttribute('tabindex')).toBe('0');
  });

  it('aligns figures right in the mono style and text left', () => {
    render(<Harness />);
    const total = screen.getAllByRole('cell').find((cell) => cell.textContent === '1204.00');
    expect(total?.className).toContain('ds-table__cell--number');
    const status = screen.getAllByRole('cell').find((cell) => cell.textContent === 'Approved');
    expect(status?.className).not.toContain('ds-table__cell--number');
  });

  it('puts a sort button in each sortable header and none in the others', () => {
    render(<Harness />);
    const headers = screen.getAllByRole('columnheader');
    expect(within(headers[0]).getByRole('button', { name: 'Requisition' })).toBeTruthy();
    expect(within(headers[1]).queryByRole('button')).toBeNull();
    expect(headers[1].hasAttribute('aria-sort')).toBe(false);
  });

  it('toggles aria-sort none, ascending, descending, and moves it between columns', () => {
    render(<Harness />);
    const [id, , total] = screen.getAllByRole('columnheader');
    expect(id.getAttribute('aria-sort')).toBe('none');
    fireEvent.click(within(id).getByRole('button'));
    expect(id.getAttribute('aria-sort')).toBe('ascending');
    fireEvent.click(within(id).getByRole('button'));
    expect(id.getAttribute('aria-sort')).toBe('descending');
    fireEvent.click(within(total).getByRole('button'));
    expect(total.getAttribute('aria-sort')).toBe('ascending');
    expect(id.getAttribute('aria-sort')).toBe('none');
  });

  it('shows a direction glyph only on the sorted column', () => {
    render(<Harness />);
    const [id, , total] = screen.getAllByRole('columnheader');
    fireEvent.click(within(id).getByRole('button'));
    expect(id.querySelector('svg')).not.toBeNull();
    expect(total.querySelector('svg')).toBeNull();
  });

  it('announces each sort change in a polite live region', () => {
    render(<Harness />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('');
    fireEvent.click(screen.getByRole('button', { name: 'Total' }));
    expect(status.textContent).toBe('Sorted by Total, ascending');
    fireEvent.click(screen.getByRole('button', { name: 'Total' }));
    expect(status.textContent).toBe('Sorted by Total, descending');
  });

  it('gives select all a name that says it covers this page', () => {
    render(<Harness selectable />);
    expect(screen.getByRole('checkbox', { name: 'Select all 3 rows on this page' })).toBeTruthy();
  });

  it('select all checks every row on the page, and again unchecks them', () => {
    render(<Harness selectable />);
    const all = screen.getByRole('checkbox', { name: 'Select all 3 rows on this page' }) as HTMLInputElement;
    fireEvent.click(all);
    const rowBoxes = () => screen.getAllByRole('checkbox', { name: /^Select REQ/ }) as HTMLInputElement[];
    expect(rowBoxes().every((box) => box.checked)).toBe(true);
    expect(all.checked).toBe(true);
    expect(screen.getByText('3 of 3 rows on this page selected')).toBeTruthy();
    fireEvent.click(all);
    expect(rowBoxes().some((box) => box.checked)).toBe(false);
  });

  it('shows select all as mixed when some rows are selected', () => {
    render(<Harness selectable />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select REQ-1043' }));
    const all = screen.getByRole('checkbox', { name: /Select all/ }) as HTMLInputElement;
    expect(all.indeterminate).toBe(true);
    expect(all.checked).toBe(false);
    expect(screen.getByText('1 of 3 rows on this page selected')).toBeTruthy();
  });

  it('keeps a selection from another page when select all is toggled', () => {
    const seen: string[][] = [];
    render(
      <Table caption="Page 2" columns={COLUMNS} rows={ROWS} getRowId={(row) => row.id} selectedIds={['REQ-0001']} onSelectionChange={(ids) => seen.push(ids)} />,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: /Select all/ }));
    expect(seen[0]).toEqual(['REQ-0001', 'REQ-1042', 'REQ-1043', 'REQ-1044']);
  });

  it('marks a selected row', () => {
    const { container } = render(
      <Table caption="Rows" columns={COLUMNS} rows={ROWS} getRowId={(row) => row.id} selectedIds={['REQ-1042']} onSelectionChange={() => undefined} />,
    );
    expect(container.querySelectorAll('tr[data-selected]')).toHaveLength(1);
  });

  it('prints a data-label on every value cell and none on the actions cell', () => {
    render(<Harness />);
    const body = screen.getAllByRole('rowgroup')[1];
    const cells = [...body.querySelectorAll('td, th')];
    expect(cells).toHaveLength(ROWS.length * COLUMNS.length);
    const labelled = cells.filter((cell) => !cell.querySelector('button'));
    expect(labelled.every((cell) => Boolean(cell.getAttribute('data-label')))).toBe(true);
    const actions = cells.filter((cell) => cell.querySelector('button'));
    expect(actions.every((cell) => !cell.hasAttribute('data-label'))).toBe(true);
    expect(cells[2].getAttribute('data-label')).toBe('Total');
  });

  it('keeps the actions header in the tree for assistive technology', () => {
    render(<Harness />);
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeTruthy();
  });

  it('loading shows skeleton rows that mirror the columns, with aria-busy', () => {
    const { container } = render(<Table caption="Rows" columns={COLUMNS} rows={[]} getRowId={(row) => row.id} loading skeletonRows={3} />);
    expect(screen.getByRole('table').getAttribute('aria-busy')).toBe('true');
    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(3);
    expect(rows[0].querySelectorAll('td')).toHaveLength(COLUMNS.length);
    expect(screen.getByText('Loading rows')).toBeTruthy();
  });

  it('renders the empty slot in one spanning cell and imports no pattern', () => {
    const { container } = render(<Table caption="Rows" columns={COLUMNS} rows={[]} getRowId={(row) => row.id} empty={<p>No requisitions match.</p>} />);
    expect(screen.getByText('No requisitions match.')).toBeTruthy();
    expect(container.querySelector('td[colspan]')?.getAttribute('colspan')).toBe(String(COLUMNS.length));
  });

  it('renders one row', () => {
    render(<Table caption="Rows" columns={COLUMNS} rows={ROWS.slice(0, 1)} getRowId={(row) => row.id} />);
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('shows an error slot as an alert in place of the rows', () => {
    render(<Table caption="Rows" columns={COLUMNS} rows={ROWS} getRowId={(row) => row.id} error="The requisitions did not load." />);
    expect(screen.getByRole('alert').textContent).toBe('The requisitions did not load.');
    expect(screen.queryByText('REQ-1042')).toBeNull();
  });

  it('shows the partial slot under the rows that did load', () => {
    render(<Table caption="Rows" columns={COLUMNS} rows={ROWS} getRowId={(row) => row.id} partial="2 rows could not be loaded." />);
    expect(screen.getByText('REQ-1042')).toBeTruthy();
    expect(screen.getByText('2 rows could not be loaded.').closest('[role="status"]')).not.toBeNull();
  });

  it('sets the density and sticky modifiers', () => {
    const { container } = render(<Table caption="Rows" columns={COLUMNS} rows={ROWS} getRowId={(row) => row.id} density="compact" sticky />);
    expect(container.firstElementChild?.className).toContain('ds-table--compact');
    expect(container.firstElementChild?.className).toContain('ds-table--sticky');
  });

  it('has no axe violations sorted, selectable, loading, empty and in error', async () => {
    const { container } = render(
      <>
        <Harness selectable />
        <Table caption="Loading" columns={COLUMNS} rows={[]} getRowId={(row) => row.id} loading />
        <Table caption="Empty" columns={COLUMNS} rows={[]} getRowId={(row) => row.id} empty={<p>Nothing here.</p>} />
        <Table caption="Failed" columns={COLUMNS} rows={[]} getRowId={(row) => row.id} error="Did not load." />
      </>,
    );
    fireEvent.click(screen.getAllByRole('button', { name: 'Total' })[0]);
    await expectNoAxeViolations(container);
  });
});

describe('Table loading with selection', () => {
  it('draws a skeleton check cell per row when selectable and announces loading once', () => {
    const { container } = render(
      <Table caption="Open requisitions" columns={COLUMNS} rows={[]} getRowId={(row) => row.id} loading skeletonRows={2} selectedIds={[]} onSelectionChange={() => undefined} />,
    );
    expect(screen.getByRole('table').getAttribute('aria-busy')).toBe('true');
    expect(container.querySelectorAll('.ds-table__row--skeleton')).toHaveLength(2);
    expect(container.querySelectorAll('td.ds-table__cell--select')).toHaveLength(2);
    expect(screen.getAllByText('Loading rows')).toHaveLength(1);
    expect(container.querySelectorAll('tbody input[type="checkbox"]')).toHaveLength(0);
  });
});

describe('Table hidden caption', () => {
  it('keeps the caption as the table name but hides it visually', () => {
    render(<Table caption="Open requisitions" hideCaption columns={COLUMNS} rows={ROWS} getRowId={(row) => row.id} />);
    expect(screen.getByRole('table', { name: 'Open requisitions' })).toBeTruthy();
    expect(screen.getByText('Open requisitions').className).toContain('ds-table__caption--hidden');
  });
});
