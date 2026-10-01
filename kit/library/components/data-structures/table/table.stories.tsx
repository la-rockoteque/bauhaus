import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Badge } from '../../feedback/badge/badge';
import { Pagination } from '../../navigation/pagination/pagination';
import { Button } from '../../clickables/button/button';
import { Text } from '../../../primitives/text/text';
import { VisuallyHidden } from '../../../primitives/visually-hidden/visually-hidden';
import { Table } from './table';
import type { TableColumn, TableProps, TableSort } from './table';
import { tableRules } from './table.rules';

// The showcase: one page story. The state matrix replaces one story per state.
// A generic component cannot type the story args, so the meta names no component.
const meta = { title: 'Data structures/Table', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

interface Requisition {
  id: string;
  supplier: string;
  status: string;
  total: number;
}

const DATA: Requisition[] = [
  { id: 'REQ-1042', supplier: 'Aciers Laurentides', status: 'Approved', total: 12040.5 },
  { id: 'REQ-1043', supplier: 'Boulons Beauce', status: 'Draft', total: 88.5 },
  { id: 'REQ-1044', supplier: 'Cuivre du Nord', status: 'Rejected', total: 640 },
  { id: 'REQ-1045', supplier: 'Dépôt Rive-Sud', status: 'Approved', total: 3120.75 },
  { id: 'REQ-1046', supplier: 'Électro Lévis', status: 'Pending', total: 275 },
  { id: 'REQ-1047', supplier: 'Fixations Outaouais', status: 'Draft', total: 1999.99 },
  { id: 'REQ-1048', supplier: 'Grues Saguenay', status: 'Approved', total: 45200 },
  { id: 'REQ-1049', supplier: 'Hydraulique Estrie', status: 'Pending', total: 9.9 },
];

const money = new Intl.NumberFormat('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const COLUMNS: TableColumn<Requisition>[] = [
  { key: 'id', header: 'Requisition', rowHeader: true, sortable: true, cell: (row) => row.id },
  { key: 'supplier', header: 'Supplier', sortable: true, cell: (row) => row.supplier },
  { key: 'status', header: 'Status', cell: (row) => row.status },
  { key: 'total', header: 'Total (CAD)', align: 'number', sortable: true, cell: (row) => money.format(row.total) },
  {
    key: 'actions',
    header: 'Actions',
    actions: true,
    cell: (row) => (
      <Button variant="tertiary">
        Open<VisuallyHidden> {row.id}</VisuallyHidden>
      </Button>
    ),
  },
];

/** Two columns, so a table fits a state cell. */
const SMALL: TableColumn<Requisition>[] = COLUMNS.filter((column) => ['id', 'status'].includes(column.key));

const DENSITIES = ['comfortable', 'compact'] as const satisfies readonly NonNullable<TableProps<Requisition>['density']>[];

const rowId = (row: Requisition) => row.id;

const sorted = (rows: Requisition[], sort: TableSort | null): Requisition[] => {
  if (!sort) return rows;
  const key = sort.key as keyof Requisition;
  const order = [...rows].sort((a, b) => (typeof a[key] === 'number' ? Number(a[key]) - Number(b[key]) : String(a[key]).localeCompare(String(b[key]))));
  return sort.direction === 'ascending' ? order : order.reverse();
};

/** A table that sorts and selects by itself, for the live demo. */
function Live({ rows = DATA, columns = COLUMNS, selectable = true, ...rest }: { rows?: Requisition[]; columns?: TableColumn<Requisition>[]; selectable?: boolean } & Partial<React.ComponentProps<typeof Table<Requisition>>>) {
  const [sort, setSort] = useState<TableSort | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <Table
      caption="Open requisitions"
      columns={columns}
      rows={sorted(rows, sort)}
      getRowId={rowId}
      sort={sort}
      onSortChange={setSort}
      {...(selectable ? { selectedIds: selected, onSelectionChange: setSelected } : {})}
      {...rest}
    />
  );
}

/** Adds a forced-state class to the first match of `target`, so the real rule paints it. */
function Force({ cls, target, children }: { cls: string; target: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.querySelector(target)?.classList.add(cls);
  }, [cls, target]);
  return (
    <div ref={box} style={{ inlineSize: '100%' }}>
      {children}
    </div>
  );
}

const cell = { inlineSize: '100%', minInlineSize: 0 } as const;
const Slot = ({ children }: { children: ReactNode }) => <Text variant="body" as="p">{children}</Text>;

function Toggle({ label, pressed, onPress }: { label: string; pressed: boolean; onPress: () => void }) {
  return (
    <Button variant="secondary" aria-pressed={pressed} onClick={onPress}>
      {label}
    </Button>
  );
}

function LiveDemo() {
  const [compact, setCompact] = useState(false);
  const [sticky, setSticky] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)', minInlineSize: 0 }}>
      <div style={{ display: 'flex', gap: 'var(--ds-space-3)', flexWrap: 'wrap' }}>
        <Toggle label={compact ? 'Density: compact' : 'Density: comfortable'} pressed={compact} onPress={() => setCompact(!compact)} />
        <Toggle label={sticky ? 'Sticky header: on' : 'Sticky header: off'} pressed={sticky} onPress={() => setSticky(!sticky)} />
      </div>
      <Live density={compact ? 'compact' : 'comfortable'} sticky={sticky} style={sticky ? { maxBlockSize: 'calc(var(--ds-space-12) * 6)' } : undefined} />
    </div>
  );
}

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Table"
      layer="Component"
      family="Data structures"
      plain="A table lays rows of facts along shared columns, so you can scan down a column and compare. Use it when people look up exact values, sort them and pick some. When each row holds one thing, use a list."
      precise="Component in the data-structures family · a native table with a caption, scoped headers, sortable columns, checkbox selection and lifecycle slots · not a layout grid, not a spreadsheet."
      usedFor="Requisitions, orders, users, invoices: any set of records with three or more attributes to compare."
      tokens={{
        mode: 'consumed',
        note: 'The table has no component tokens of its own; table.* are roles.',
        rows: [
          { name: 'table.header-surface', tier: 'role', use: 'Header row fill', swatch: '--ds-table-header-surface' },
          { name: 'table.row-hover', tier: 'role', use: 'Row fill under the pointer', swatch: '--ds-table-row-hover' },
          { name: 'table.row-selected', tier: 'role', use: 'Fill of a selected row', swatch: '--ds-table-row-selected' },
          { name: 'table.border', tier: 'role', use: 'Row and cell rules, and the outline of the scroll region', swatch: '--ds-table-border' },
          { name: 'text.default · text.muted', tier: 'role', use: 'Cell text; the label in the card stack and the selection summary', swatch: '--ds-text-muted' },
          { name: 'surface.raised', tier: 'role', use: 'Fill of a card in the card stack', swatch: '--ds-surface-raised' },
          { name: 'selection.surface', tier: 'role', use: 'Accent of the native checkbox', swatch: '--ds-selection-surface' },
          { name: 'state.hover-layer · state.pressed-layer', tier: 'role', use: 'Hover and pressed fill of the sort button', swatch: '--ds-state-hover-layer' },
          { name: 'border.strong', tier: 'role', use: 'Outline of a sort button in the card stack', swatch: '--ds-border-strong' },
          { name: 'skeleton.base · skeleton.highlight', tier: 'role', use: 'Loading blocks and their moving highlight', swatch: '--ds-skeleton-base' },
          { name: 'status.error · status.warning-surface · status.warning-text', tier: 'role', use: 'Error row text; partial row fill and text', swatch: '--ds-status-warning-surface' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator on sort, checkbox and scroll region', swatch: '--ds-focus-ring-color' },
          { name: 'text.body.* · text.label.* · text.caption.* · text.code.*', tier: '2', use: 'Cell, header, meta and figure text. Figures use text.code (mono)' },
          { name: 'space.inset.xs · space.inline.xs … md · space.stack.xs … sm', tier: '2', use: 'Cell padding by density; gaps in the card stack' },
          { name: 'size.target.min · size.control.sm · size.icon.md · size.control.md', tier: '2', use: 'Row and control height (32px; 24px in compact; 24px checkbox cell width); checkbox size; scroll-padding under a sticky header' },
          { name: 'size.border.thin · radius.md · radius.sm', tier: '2', use: 'Rules, region corner, skeleton corner' },
          { name: 'z.sticky', tier: '2', use: 'Sticky header layer' },
          { name: 'motion.duration.fast · deliberate · ease.standard', tier: '2', use: 'Row hover fade; skeleton shimmer period' },
        ],
      }}
      stage={{
        render: (args) => (
          <div style={{ inlineSize: 'calc(var(--ds-space-12) * 5)' }}>
            <Live rows={DATA.slice(0, 2)} columns={SMALL} caption={String(args.caption)} density={args.density as TableProps<Requisition>['density']} sticky={args.sticky === true} />
          </div>
        ),
        parts: [
          { n: 1, label: 'Caption', note: 'names the table, required', target: '.ds-table__caption' },
          { n: 2, label: 'Column header', note: 'th scope="col", required', target: 'thead .ds-table__head--sortable', at: 'bottom-start' },
          { n: 3, label: 'Sort button', note: 'optional, with aria-sort and a direction glyph', target: '.ds-table__sort .ds-table__direction', at: 'end' },
          { n: 4, label: 'Row header', note: 'th scope="row", the identifier', target: 'tbody .ds-table__cell--row-header', at: 'top-start' },
          { n: 5, label: 'Value cell', note: 'td with data-label', target: 'tbody td:last-child', at: 'bottom-end' },
          { n: 6, label: 'Selection cell', note: 'optional native checkbox', target: 'tbody .ds-table__check', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Row height', value: 'size.control.md, 32px, comfortable · size.control.sm, 24px, compact' },
        { label: 'Cell padding inline', property: 'padding-inline', target: 'tbody .ds-table__cell--row-header', token: 'space.inline.md' },
        { label: 'Cell padding block', property: 'padding-block', target: 'tbody .ds-table__cell--row-header', token: 'space.inset.xs' },
        { label: 'Alignment', value: 'text left · figures right, mono, tabular' },
        { label: 'Header', value: 'table.header-surface, text.label.*, sticky on z.sticky' },
        { label: 'Card stack', value: '768px and below · thead becomes a sort bar · each value prints its data-label' },
        { label: 'Overflow', value: 'the region scrolls sideways, min-inline-size 0, focusable' },
      ]}
      api={[
        { label: 'caption', value: 'string, required. Names the table and its scroll region. hideCaption keeps it for assistive technology only.', control: { kind: 'text', value: 'Open requisitions' } },
        { label: 'columns', value: 'key, header, align ("start" | "end" | "number"), sortable, rowHeader, actions, cell(row).' },
        { label: 'rows · getRowId', value: 'The page of rows and a stable id per row. The caller sorts and pages.' },
        { label: 'sort · onSortChange', value: '{ key, direction }. The table asks for the next direction; the caller sorts. The change is announced.' },
        { label: 'selectedIds · onSelectionChange', value: 'Ids of selected rows. Giving the handler adds the checkbox column. Select all covers this page only.' },
        { label: 'density', value: '"comfortable" | "compact".', control: { kind: 'select', options: DENSITIES, value: 'comfortable' } },
        { label: 'sticky', value: 'Keeps the header in view. Give the root a max-block-size.', control: { kind: 'boolean', value: false } },
        { label: 'loading · skeletonRows', value: 'Skeleton rows that mirror the columns; aria-busy on the table.' },
        { label: 'empty · error · partial', value: 'Slots for no rows, a failed load, and a load that returned some rows. The table imports no pattern.' },
        { label: 'labels', value: 'The text the table speaks: select all, select row, sort message, selection summary, loading.' },
      ]}
      states={{
        note: 'The tables here use two columns, except Too many. The live demo below shows the full table and the card stack.',
        cells: [
          { id: 'nothing', status: 'designed', render: <div style={cell}><Table caption="Requisitions" columns={SMALL} rows={[]} getRowId={rowId} empty={<Slot>Search for a requisition to see results.</Slot>} /></div>, trigger: 'rows=[] · empty', note: 'Before the first query: the slot invites. It does not say "no results".' },
          { id: 'loading', status: 'designed', render: <div style={cell}><Table caption="Requisitions" columns={SMALL} rows={[]} getRowId={rowId} loading skeletonRows={3} /></div>, trigger: 'loading', note: 'Skeleton rows keep the columns and the alignment. aria-busy is set.' },
          { id: 'none', status: 'designed', render: <div style={cell}><Table caption="Requisitions" columns={SMALL} rows={[]} getRowId={rowId} empty={<Slot>No requisition matches these filters.</Slot>} /></div>, trigger: 'rows=[] · empty', note: 'The caller fills the slot with an empty-state pattern. The table imports none.' },
          { id: 'one', status: 'designed', render: <div style={cell}><Live rows={DATA.slice(0, 1)} columns={SMALL} selectable={false} /></div>, trigger: 'rows.length = 1' },
          { id: 'some', status: 'designed', render: <div style={cell}><Live rows={DATA.slice(0, 4)} columns={SMALL} selectable={false} /></div>, trigger: 'rows.length > 1' },
          { id: 'too-many', status: 'designed', label: 'Too many (columns)', render: <div style={cell}><Live rows={DATA.slice(0, 3)} columns={COLUMNS} selectable={false} /></div>, trigger: 'wider than its container', note: 'The region scrolls sideways and takes focus. The page does not scroll.' },
          { id: 'incorrect', status: 'designed', render: <div style={cell}><Table caption="Requisitions" columns={SMALL} rows={[]} getRowId={rowId} error={<div style={{ display: 'grid', gap: 'var(--ds-space-2)', justifyItems: 'start' }}><Slot>The requisitions did not load.</Slot><Button variant="secondary">Try again</Button></div>} /></div>, trigger: 'error', note: 'An alert row with a retry. Text, not colour alone.' },
          { id: 'correct', status: 'n/a', reason: 'A table shows records and takes no input. A row that saved shows it in its own cells.' },
          { id: 'done', status: 'n/a', reason: 'The view announces the result of a bulk action. The table announces only sorts.' },
          { id: 'partial', status: 'designed', group: 'lifecycle', label: 'Partial', render: <div style={cell}><Table caption="Requisitions" columns={SMALL} rows={DATA.slice(0, 2)} getRowId={rowId} partial={<Slot>2 of 4 requisitions loaded. The other 2 could not be read.</Slot>} /></div>, trigger: 'partial', note: 'The rows stay. A status row says what is missing.' },
          { id: 'default', status: 'designed', render: <div style={cell}><Live rows={DATA.slice(0, 3)} columns={SMALL} selectable={false} /></div>, trigger: 'none' },
          { id: 'hover', status: 'designed', render: <div style={cell}><Force cls="doc-force-hover" target=".ds-table__row--data"><Live rows={DATA.slice(0, 3)} columns={SMALL} selectable={false} /></Force></div>, trigger: ':hover', note: 'Forced on the first row. The rule sits in @media (hover: hover).' },
          { id: 'focus-visible', status: 'designed', render: <div style={cell}><Force cls="doc-force-focus" target=".ds-table__sort"><Live rows={DATA.slice(0, 3)} columns={SMALL} selectable={false} /></Force></div>, trigger: ':focus-visible', note: 'Forced on the first sort button.' },
          { id: 'active', status: 'designed', render: <div style={cell}><Force cls="doc-force-active" target=".ds-table__sort"><Live rows={DATA.slice(0, 3)} columns={SMALL} selectable={false} /></Force></div>, trigger: ':active', note: 'Forced on the first sort button.' },
          { id: 'disabled', status: 'n/a', reason: 'Rows are data, not controls. A control inside a cell disables itself and says why.' },
          { id: 'selected', status: 'designed', render: <div style={cell}><Table caption="Requisitions" columns={SMALL} rows={DATA.slice(0, 3)} getRowId={rowId} selectedIds={['REQ-1043']} onSelectionChange={() => undefined} /></div>, trigger: 'selectedIds', note: 'Fill plus a checked box. The summary line counts this page.' },
          { id: 'default', variant: 'Compact', status: 'designed', render: <div style={cell}><Live rows={DATA.slice(0, 3)} columns={SMALL} selectable={false} density="compact" /></div>, trigger: 'density="compact"', note: 'Less padding. Controls stay at 24px or more.' },
          { id: 'sorted', status: 'designed', group: 'interaction', label: 'Sorted', render: <div style={cell}><Table caption="Requisitions" columns={SMALL} rows={[...DATA.slice(0, 3)].reverse()} getRowId={rowId} sort={{ key: 'id', direction: 'descending' }} onSortChange={() => undefined} /></div>, trigger: 'sort', note: 'aria-sort on the th and a direction glyph.' },
        ],
      }}
      extra={[
        { title: 'Live table', kicker: 'Sort, select, change density, pin the header. Narrow the window to 768px or less to see the card stack.', content: <LiveDemo /> },
      ]}
      dos={[
        { text: 'Give every table a caption and every header a scope.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Right-align figures, in the mono style, and left-align text.', basis: 'knowledge/patterns/data-tables.md rule 5' },
        { text: 'Say "this page" in select all, and count what is selected.', basis: 'Nielsen 5' },
        { text: 'Announce a sort change in a polite live region.', basis: 'WCAG 4.1.3 (AA)' },
        { text: 'Become a card stack at 768px and below, with a label on every value.', basis: 'WCAG 1.4.10 (AA)' },
      ]}
      donts={[
        { text: 'Build a data table from divs.', basis: 'WCAG 1.3.1 (A)', rule: 'table.native-markup' },
        { text: 'Leave a header without scope, or a sort button without aria-sort.', basis: 'WCAG 1.3.1 (A); 4.1.2 (A)', rule: 'table.header-scope' },
        { text: 'Sort with no announcement.', basis: 'WCAG 4.1.3 (AA)', rule: 'table.sort-announced' },
        { text: 'Let select all reach rows on other pages without saying so.', basis: 'Nielsen 5', rule: 'table.select-all-scope' },
        { text: 'Scroll the page sideways on a phone.', basis: 'WCAG 1.4.10 (AA)', rule: 'table.card-stack-narrow' },
        { text: 'Show row actions on hover only.', basis: 'WCAG 2.1.1 (A)', rule: 'table.row-actions-visible' },
        { text: 'Write a colour or px literal in table.css.', basis: 'misfile.raw-value-in-component', rule: 'table.no-literal' },
      ]}
      guide="data-structures-table--docs"
      guideName="Table"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Table" layer="Component" family="Data structures" rules={tableRules} guide="data-structures-table--docs" guideName="Table" />,
};

const STATUS_TONE = { Approved: 'success', Draft: 'neutral', Rejected: 'error', Pending: 'warning' } as const;

const BADGE_COLUMNS: TableColumn<Requisition>[] = COLUMNS.map((column) =>
  column.key === 'status' ? { ...column, cell: (row: Requisition) => <Badge status={STATUS_TONE[row.status as keyof typeof STATUS_TONE]}>{row.status}</Badge> } : column,
);

const PLAIN: TableColumn<Requisition>[] = COLUMNS.filter((column) => column.key !== 'actions').map((column) => ({ ...column, sortable: false }));
const FIRST_ROWS = DATA.slice(0, 4);
const FRENCH_LABELS: NonNullable<TableProps<Requisition>['labels']> = {
  selectAll: (count) => `Sélectionner les ${count} lignes de cette page`,
  selectRow: (label) => `Sélectionner ${label}`,
  sorted: (header, direction) => `Trié par ${header}, ${direction === 'ascending' ? 'croissant' : 'décroissant'}`,
  selectionSummary: (selected, total) => `${selected} lignes sur ${total} sélectionnées sur cette page`,
  loading: 'Chargement des lignes',
};

function SortableRequisitions() {
  const [sort, setSort] = useState<TableSort | null>({ key: 'total', direction: 'descending' });
  return <Table caption="Requisitions" columns={PLAIN.map((column) => ({ ...column, sortable: column.key !== 'status' }))} rows={sorted(DATA, sort)} getRowId={(row) => row.id} sort={sort} onSortChange={setSort} />;
}

function SelectableRequisitions({ initial = [] }: { initial?: string[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initial);
  return <Table caption="Requisitions" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} selectedIds={selectedIds} onSelectionChange={setSelectedIds} />;
}

function BulkApprove() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  return (
    <Stack gap={3} align="start">
      <Button disabled={selectedIds.length === 0}>{selectedIds.length === 0 ? 'Approve' : `Approve ${selectedIds.length}`}</Button>
      <Table caption="Requisitions to review" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
    </Stack>
  );
}

function PagedRequisitions() {
  const [page, setPage] = useState(1);
  const rows = DATA.slice((page - 1) * 4, page * 4);
  return (
    <Stack gap={3}>
      <Table caption="Requisitions" columns={PLAIN} rows={rows} getRowId={(row) => row.id} />
      <Pagination label="Requisitions pages" page={page} pageCount={2} onPageChange={setPage} total={`${(page - 1) * 4 + 1}–${Math.min(page * 4, DATA.length)} of ${DATA.length}`} />
    </Stack>
  );
}

const COLUMNS_CODE = `const columns: TableColumn<Requisition>[] = [
  { key: 'id', header: 'Requisition', rowHeader: true, cell: (row) => row.id },
  { key: 'supplier', header: 'Supplier', cell: (row) => row.supplier },
  { key: 'status', header: 'Status', cell: (row) => row.status },
  { key: 'total', header: 'Total (CAD)', align: 'number', cell: (row) => money.format(row.total) },
];`;

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Table"
      layer="Component"
      family="Data structures"
      imports="import { Badge, Button, Pagination, Stack, Table, VisuallyHidden } from '@acme/design-system';"
      guide="data-structures-table--docs"
      guideName="Table"
      groups={[
        {
          title: 'Columns and rows',
          kicker: 'The caller defines the columns, sorts and pages the rows. The table draws what it is given.',
          examples: [
            {
              title: 'Basic table',
              when: 'Records with three or more attributes that people compare down a column.',
              render: <Table caption="Requisitions" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: `${COLUMNS_CODE}

<Table caption="Requisitions" columns={columns} rows={rows} getRowId={(row) => row.id} />`,
            },
            {
              title: 'Hidden caption',
              when: 'A heading above the table already names it. Keep the caption for assistive technology only.',
              render: <Table caption="Requisitions" hideCaption columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: '<Table caption="Requisitions" hideCaption columns={columns} rows={rows} getRowId={(row) => row.id} />',
            },
            {
              title: 'Figures aligned',
              when: 'A column of amounts: align: \'number\' right-aligns them in the mono style so digits line up.',
              render: <Table caption="Totals" columns={PLAIN.filter((column) => ['id', 'total'].includes(column.key))} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: `const columns: TableColumn<Requisition>[] = [
  { key: 'id', header: 'Requisition', rowHeader: true, cell: (row) => row.id },
  { key: 'total', header: 'Total (CAD)', align: 'number', cell: (row) => money.format(row.total) },
];

<Table caption="Totals" columns={columns} rows={rows} getRowId={(row) => row.id} />`,
            },
            {
              title: 'A value pushed to the end',
              when: 'A value that is not a figure and belongs at the right edge, such as a status.',
              render: (
                <Table
                  caption="Statuses"
                  columns={[
                    { key: 'id', header: 'Requisition', rowHeader: true, cell: (row: Requisition) => row.id },
                    { key: 'status', header: 'Status', align: 'end', cell: (row: Requisition) => row.status },
                  ]}
                  rows={FIRST_ROWS}
                  getRowId={(row) => row.id}
                />
              ),
              code: `const columns: TableColumn<Requisition>[] = [
  { key: 'id', header: 'Requisition', rowHeader: true, cell: (row) => row.id },
  { key: 'status', header: 'Status', align: 'end', cell: (row) => row.status },
];

<Table caption="Statuses" columns={columns} rows={rows} getRowId={(row) => row.id} />`,
            },
            {
              title: 'Badges in cells',
              when: 'A status the reader scans for: a badge carries a word and a colour.',
              render: <Table caption="Requisitions" columns={BADGE_COLUMNS.filter((column) => column.key !== 'actions')} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: `const columns: TableColumn<Requisition>[] = [
  { key: 'id', header: 'Requisition', rowHeader: true, cell: (row) => row.id },
  { key: 'status', header: 'Status', cell: (row) => <Badge status={toneOf(row.status)}>{row.status}</Badge> },
];

<Table caption="Requisitions" columns={columns} rows={rows} getRowId={(row) => row.id} />`,
            },
            {
              title: 'Row actions',
              when: 'A visible button per row, in an actions column. The header stays for assistive technology.',
              render: <Table caption="Requisitions" columns={COLUMNS.filter((column) => ['id', 'total', 'actions'].includes(column.key)).map((column) => ({ ...column, sortable: false }))} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: `const columns: TableColumn<Requisition>[] = [
  { key: 'id', header: 'Requisition', rowHeader: true, cell: (row) => row.id },
  { key: 'total', header: 'Total (CAD)', align: 'number', cell: (row) => money.format(row.total) },
  {
    key: 'actions',
    header: 'Actions',
    actions: true,
    cell: (row) => (
      <Button variant="tertiary">
        Open<VisuallyHidden> {row.id}</VisuallyHidden>
      </Button>
    ),
  },
];`,
            },
          ],
        },
        {
          title: 'Sorting',
          kicker: 'The table asks for a sort. The caller sorts the rows and passes the sort back.',
          examples: [
            {
              title: 'Sortable columns',
              when: 'People look up exact values. Press a header to sort; press again to reverse. Each change is announced.',
              render: <SortableRequisitions />,
              code: `function SortableRequisitions() {
  const [sort, setSort] = useState<TableSort | null>({ key: 'total', direction: 'descending' });
  return (
    <Table
      caption="Requisitions"
      columns={columns}
      rows={sortRows(rows, sort)}
      getRowId={(row) => row.id}
      sort={sort}
      onSortChange={setSort}
    />
  );
}`,
            },
            {
              title: 'Sort set by the caller',
              when: 'The view opens already sorted, for example by a saved preference. Pass sort without a handler to only show it.',
              render: <Table caption="Requisitions" columns={PLAIN.map((column) => ({ ...column, sortable: column.key === 'total' }))} rows={sorted(FIRST_ROWS, { key: 'total', direction: 'descending' })} getRowId={(row) => row.id} sort={{ key: 'total', direction: 'descending' }} />,
              code: '<Table caption="Requisitions" columns={columns} rows={rows} getRowId={(row) => row.id} sort={{ key: \'total\', direction: \'descending\' }} />',
            },
          ],
        },
        {
          title: 'Selection',
          kicker: 'onSelectionChange adds a checkbox column. Select all changes this page only.',
          examples: [
            {
              title: 'Select rows',
              when: 'People pick some rows to act on. A line under the table counts the selection.',
              render: <SelectableRequisitions />,
              code: `function SelectableRequisitions() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  return <Table caption="Requisitions" columns={columns} rows={rows} getRowId={(row) => row.id} selectedIds={selectedIds} onSelectionChange={setSelectedIds} />;
}`,
            },
            {
              title: 'Some rows selected at first',
              when: 'The view restores a selection. The header box shows the mixed state.',
              render: <SelectableRequisitions initial={['REQ-1042', 'REQ-1043']} />,
              code: `function RestoredSelection() {
  const [selectedIds, setSelectedIds] = useState(['REQ-1042', 'REQ-1043']);
  return <Table caption="Requisitions" columns={columns} rows={rows} getRowId={(row) => row.id} selectedIds={selectedIds} onSelectionChange={setSelectedIds} />;
}`,
            },
            {
              title: 'Name each row by its supplier',
              when: 'The row id is a poor name for a checkbox. getRowLabel gives a clearer one.',
              render: <Table caption="Requisitions" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} getRowLabel={(row) => `${row.id}, ${row.supplier}`} selectedIds={[]} onSelectionChange={() => {}} />,
              code: `<Table
  caption="Requisitions"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  getRowLabel={(row) => \`\${row.id}, \${row.supplier}\`}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
/>`,
            },
            {
              title: 'A bulk action',
              when: 'Selecting rows enables the action that works on them. The button says how many.',
              render: <BulkApprove />,
              code: `function BulkApprove() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  return (
    <Stack gap={3} align="start">
      <Button disabled={selectedIds.length === 0}>{selectedIds.length === 0 ? 'Approve' : \`Approve \${selectedIds.length}\`}</Button>
      <Table caption="Requisitions to review" columns={columns} rows={rows} getRowId={(row) => row.id} selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Density and size',
          kicker: 'Comfortable rows are 32px. Compact rows keep every control at 24px or more.',
          examples: [
            {
              title: 'Compact',
              when: 'A dense view with many rows, such as a back-office list.',
              render: <Table caption="Requisitions" density="compact" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: '<Table caption="Requisitions" density="compact" columns={columns} rows={rows} getRowId={(row) => row.id} />',
            },
            {
              title: 'Comfortable',
              when: 'The default: a table people read more than scan.',
              render: <Table caption="Requisitions" density="comfortable" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: '<Table caption="Requisitions" density="comfortable" columns={columns} rows={rows} getRowId={(row) => row.id} />',
            },
            {
              title: 'Wide table in a narrow space',
              when: 'More columns than the width: the region scrolls sideways inside its own box, and keyboard users can scroll it.',
              frame: 'narrow',
              render: <Table caption="Requisitions" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: '<Table caption="Requisitions" columns={columns} rows={rows} getRowId={(row) => row.id} />',
            },
          ],
        },
        {
          title: 'States',
          kicker: 'The caller owns the words. The table keeps its header in every state.',
          examples: [
            { title: 'Loading', when: 'Rows are on their way. Skeleton rows keep the columns\' alignment.', render: <Table caption="Requisitions" columns={PLAIN} rows={[]} getRowId={(row) => row.id} loading />, code: '<Table caption="Requisitions" columns={columns} rows={[]} getRowId={(row) => row.id} loading />' },
            { title: 'Loading, three rows', when: 'You know about how many rows will arrive: match skeletonRows.', render: <Table caption="Requisitions" columns={PLAIN} rows={[]} getRowId={(row) => row.id} loading skeletonRows={3} />, code: '<Table caption="Requisitions" columns={columns} rows={[]} getRowId={(row) => row.id} loading skeletonRows={3} />' },
            {
              title: 'Loading with selection',
              when: 'The selection column draws a skeleton box per row. The selection count is hidden while loading.',
              render: <Table caption="Requisitions" columns={PLAIN} rows={[]} getRowId={(row) => row.id} loading skeletonRows={3} selectedIds={[]} onSelectionChange={() => {}} />,
              code: '<Table caption="Requisitions" columns={columns} rows={[]} getRowId={(row) => row.id} loading skeletonRows={3} selectedIds={[]} onSelectionChange={setSelectedIds} />',
            },
            {
              title: 'Empty, first use',
              when: 'No record exists yet. Invite the reader to create one.',
              render: <Table caption="Requisitions" columns={PLAIN} rows={[]} getRowId={(row) => row.id} empty={<Stack gap={2} align="start"><Text>No requisitions yet. Create your first one.</Text><Button variant="secondary">New requisition</Button></Stack>} />,
              code: `<Table
  caption="Requisitions"
  columns={columns}
  rows={[]}
  getRowId={(row) => row.id}
  empty={
    <Stack gap={2} align="start">
      <Text>No requisitions yet. Create your first one.</Text>
      <Button variant="secondary">New requisition</Button>
    </Stack>
  }
/>`,
            },
            { title: 'Empty, no match', when: 'A filter returned nothing. Say what happened.', render: <Table caption="Requisitions" columns={PLAIN} rows={[]} getRowId={(row) => row.id} empty={<Text>No requisition matches “copper”.</Text>} />, code: '<Table caption="Requisitions" columns={columns} rows={[]} getRowId={(row) => row.id} empty={<Text>No requisition matches “copper”.</Text>} />' },
            {
              title: 'Error with a retry',
              when: 'The rows failed to load. One spanning row holds the alert and a retry.',
              render: <Table caption="Requisitions" columns={PLAIN} rows={[]} getRowId={(row) => row.id} error={<Stack gap={2} align="start"><Text>The requisitions did not load.</Text><Button variant="secondary">Try again</Button></Stack>} />,
              code: `<Table
  caption="Requisitions"
  columns={columns}
  rows={[]}
  getRowId={(row) => row.id}
  error={
    <Stack gap={2} align="start">
      <Text>The requisitions did not load.</Text>
      <Button variant="secondary">Try again</Button>
    </Stack>
  }
/>`,
            },
            {
              title: 'Partial',
              when: 'Some rows loaded and some did not. Keep the rows and say what is missing.',
              render: <Table caption="Requisitions" columns={PLAIN} rows={FIRST_ROWS.slice(0, 2)} getRowId={(row) => row.id} partial={<Text>6 requisitions did not load.</Text>} />,
              code: '<Table caption="Requisitions" columns={columns} rows={rows} getRowId={(row) => row.id} partial={<Text>6 requisitions did not load.</Text>} />',
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Paging, filtering and fetching belong to the caller.',
          examples: [
            {
              title: 'With pagination',
              when: 'More rows than one page. The caller slices the rows; the pagination component moves between pages.',
              render: <PagedRequisitions />,
              code: `function PagedRequisitions() {
  const [page, setPage] = useState(1);
  const rows = allRows.slice((page - 1) * 4, page * 4);
  return (
    <Stack gap={3}>
      <Table caption="Requisitions" columns={columns} rows={rows} getRowId={(row) => row.id} />
      <Pagination label="Requisitions pages" page={page} pageCount={2} onPageChange={setPage} total={\`\${(page - 1) * 4 + 1}–\${Math.min(page * 4, allRows.length)} of \${allRows.length}\`} />
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Content and language',
          kicker: 'The caption, headers and cells arrive as props. The table speaks a few phrases of its own.',
          examples: [
            {
              title: 'Another language',
              when: 'The app is not in English: pass labels for the select boxes, the sort announcement, the count and the wait.',
              render: <Table caption="Réquisitions" columns={PLAIN.map((column) => ({ ...column, sortable: column.key === 'total' }))} rows={FIRST_ROWS} getRowId={(row) => row.id} selectedIds={['REQ-1042']} onSelectionChange={() => {}} labels={FRENCH_LABELS} />,
              code: `<Table
  caption="Réquisitions"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
  labels={{
    selectAll: (count) => \`Sélectionner les \${count} lignes de cette page\`,
    selectRow: (label) => \`Sélectionner \${label}\`,
    sorted: (header, direction) => \`Trié par \${header}, \${direction === 'ascending' ? 'croissant' : 'décroissant'}\`,
    selectionSummary: (selected, total) => \`\${selected} lignes sur \${total} sélectionnées sur cette page\`,
    loading: 'Chargement des lignes',
  }}
/>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'Real table markup: caption, scoped headers, aria-sort, native checkboxes.',
          examples: [
            {
              title: 'Row header',
              when: 'Mark the human-readable identifier column with rowHeader, so a screen reader announces it with each cell.',
              render: <Table caption="Requisitions" columns={PLAIN.filter((column) => column.key !== 'status')} rows={FIRST_ROWS.slice(0, 3)} getRowId={(row) => row.id} />,
              code: `const columns: TableColumn<Requisition>[] = [
  { key: 'supplier', header: 'Supplier', rowHeader: true, cell: (row) => row.supplier },
  { key: 'total', header: 'Total (CAD)', align: 'number', cell: (row) => money.format(row.total) },
];`,
            },
          ],
        },
      ]}
    />
  ),
};
