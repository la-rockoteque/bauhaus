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
      <Pagination label="Requisitions pages" page={page} pageCount={2} onPageChange={setPage} status={`Page ${page} of 2`} total={`${(page - 1) * 4 + 1}–${Math.min(page * 4, DATA.length)} of ${DATA.length}`} />
    </Stack>
  );
}

type TableState = 'loading' | 'empty' | 'none' | 'error' | 'partial' | 'ready';

/** Switches one table through its data states, so the reader sees each one replace the rows. */
function TableLifecycle() {
  const [state, setState] = useState<TableState>('loading');
  const states: TableState[] = ['loading', 'empty', 'none', 'error', 'partial', 'ready'];
  const rows = state === 'ready' ? FIRST_ROWS : state === 'partial' ? FIRST_ROWS.slice(0, 2) : [];
  return (
    <Stack gap={3}>
      <Stack direction="horizontal" gap={2} wrap role="group" aria-label="Table state">
        {states.map((name) => (
          <Button key={name} variant="secondary" aria-pressed={state === name} onClick={() => setState(name)}>{name}</Button>
        ))}
      </Stack>
      <Table
        caption="Requisitions"
        columns={PLAIN}
        rows={rows}
        getRowId={(row) => row.id}
        loading={state === 'loading'}
        empty={state === 'none' ? <Text>No requisition matches “copper”.</Text> : <Text>No requisitions yet. Create your first one.</Text>}
        error={
          state === 'error' && (
            <Stack gap={2} align="start">
              <Text>The requisitions did not load.</Text>
              <Button variant="secondary" onClick={() => setState('loading')}>Try again</Button>
            </Stack>
          )
        }
        partial={state === 'partial' && <Text>6 requisitions did not load.</Text>}
      />
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Table"
      layer="Component"
      family="Data structures"
      imports="import { Badge, Button, Pagination, Stack, Table, Text, VisuallyHidden } from '@bauhaus/design-system';"
      intro={[
        'A table lays out records in rows and columns, so people can scan down a column and compare. Use it for exact values: amounts, dates, statuses.',
        'It is a real HTML `table`. Screen readers announce the column header with each cell ("Total, 12,040.50"). A grid of `div`s loses that.',
        'You give the table three things: `columns` (how to show each field), `rows` (the data) and `getRowId` (a function that returns a unique id for a row).',
        'A column is an object: `key` (its unique name), `header` (the text on top), `cell` (a function that draws one cell from a row). Other options are `align`, `sortable`, `rowHeader` and `actions`.',
        'The table draws the rows it is given and reports what the user asked for. You sort, page, filter and fetch. It does not do these itself.',
        'The `caption` is required. It names the table for screen readers and labels its scroll box.',
        'Snippets use `columns` and `rows` for your own definitions. The first example shows them in full. `money` is an `Intl.NumberFormat` that formats amounts.',
      ]}
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
              explain: [
                '`columns` says what to show. `key` is a unique name, `header` is the text on top, `cell` returns what to draw for one row.',
                '`getRowId` returns a unique, stable id for each row. React and the selection feature use it to tell rows apart.',
                '`rowHeader: true` marks the first column as the row\'s name. A screen reader then says "REQ-1042" before each cell of that row (WCAG 1.3.1, A).',
                '`align: \'number\'` right-aligns figures in a mono font, so digits line up by place. Never centre data.',
                '`caption` is required. It names the table for assistive technology.',
              ],
              render: <Table caption="Requisitions" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: `// Format amounts the same way everywhere. 'en-CA' gives 12,040.50.
const money = new Intl.NumberFormat('en-CA', { minimumFractionDigits: 2 });

// One object per column.
const columns = [
  // rowHeader: this cell names the row for screen readers.
  { key: 'id', header: 'Requisition', rowHeader: true, cell: (row) => row.id },
  { key: 'supplier', header: 'Supplier', cell: (row) => row.supplier },
  { key: 'status', header: 'Status', cell: (row) => row.status },
  // 'number': right-aligned, mono, tabular digits.
  { key: 'total', header: 'Total (CAD)', align: 'number', cell: (row) => money.format(row.total) },
];

// getRowId: a unique, stable id per row.
<Table caption="Requisitions" columns={columns} rows={rows} getRowId={(row) => row.id} />`,
            },
            {
              title: 'Hidden caption',
              when: 'A heading above the table already names it.',
              explain: [
                '`hideCaption` hides the caption from the eye and keeps it for assistive technology.',
                'Do not leave the caption out. Without it, the table has no name, and the scroll box has none either (WCAG 1.3.1, A).',
              ],
              render: (
                <Stack gap={2}>
                  <Text as="h2">Requisitions</Text>
                  <Table caption="Requisitions" hideCaption columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} />
                </Stack>
              ),
              code: `<>
  <Text as="h2">Requisitions</Text>
  {/* The heading shows the name. The caption keeps it for screen readers. */}
  <Table caption="Requisitions" hideCaption columns={columns} rows={rows} getRowId={(row) => row.id} />
</>`,
            },
            {
              title: 'Figures aligned',
              when: 'A column of amounts.',
              explain: [
                '`align: \'number\'` right-aligns the cell in the mono style, with equal-width digits.',
                'When digits line up by place (units under units), the eye can compare 640.00 and 12,040.50 at a glance.',
                'The header takes the same alignment as its cells, so the two stay together.',
              ],
              render: <Table caption="Totals" columns={PLAIN.filter((column) => ['id', 'total'].includes(column.key))} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: `const columns = [
  { key: 'id', header: 'Requisition', rowHeader: true, cell: (row) => row.id },
  // Always format figures with the same number of decimals.
  { key: 'total', header: 'Total (CAD)', align: 'number', cell: (row) => money.format(row.total) },
];

<Table caption="Totals" columns={columns} rows={rows} getRowId={(row) => row.id} />`,
            },
            {
              title: 'A value pushed to the end',
              when: 'A value that is not a figure but belongs at the right edge.',
              explain: [
                '`align: \'end\'` right-aligns a value without the figure style. It is for text such as a status.',
                'Use `\'start\'` (the default) for text. In a right-to-left language the two sides swap by themselves.',
              ],
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
              code: `const columns = [
  { key: 'id', header: 'Requisition', rowHeader: true, cell: (row) => row.id },
  // end: pushed to the trailing edge, in the normal text style.
  { key: 'status', header: 'Status', align: 'end', cell: (row) => row.status },
];`,
            },
            {
              title: 'Badges in cells',
              when: 'A status the reader scans for.',
              explain: [
                '`cell` can return any content. A `Badge` carries a word and a colour, so the status is not told by colour alone (WCAG 1.4.1, A).',
                'Map each status to a badge tone with a small lookup. Keep the mapping in one place.',
              ],
              render: <Table caption="Requisitions" columns={BADGE_COLUMNS.filter((column) => column.key !== 'actions')} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: `// One lookup from status to badge tone.
const TONE = { Approved: 'success', Draft: 'neutral', Rejected: 'error', Pending: 'warning' };

const columns = [
  { key: 'id', header: 'Requisition', rowHeader: true, cell: (row) => row.id },
  { key: 'status', header: 'Status', cell: (row) => <Badge status={TONE[row.status]}>{row.status}</Badge> },
];`,
            },
            {
              title: 'Row actions',
              when: 'A visible button on each row.',
              explain: [
                '`actions: true` marks the column as holding buttons. Its header stays for screen readers and is hidden from the eye.',
                '`VisuallyHidden` adds the row id to each "Open" button\'s name. A screen reader then lists "Open REQ-1042", not four times "Open" (WCAG 2.4.4, A).',
                'Keep actions visible. Do not show them on hover only: keyboard and touch users never hover (WCAG 2.1.1, A).',
              ],
              render: <Table caption="Requisitions" columns={COLUMNS.filter((column) => ['id', 'total', 'actions'].includes(column.key)).map((column) => ({ ...column, sortable: false }))} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: `const columns = [
  { key: 'id', header: 'Requisition', rowHeader: true, cell: (row) => row.id },
  { key: 'total', header: 'Total (CAD)', align: 'number', cell: (row) => money.format(row.total) },
  {
    key: 'actions',
    header: 'Actions',   // hidden from the eye, kept for screen readers
    actions: true,
    cell: (row) => (
      <Button variant="tertiary" onClick={() => open(row.id)}>
        {/* The hidden text adds the object to the name: "Open REQ-1042". */}
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
          kicker: 'The table asks for a sort. You sort the rows and pass the sort back.',
          examples: [
            {
              title: 'Sortable columns',
              when: 'People look up exact values.',
              explain: [
                '`sortable: true` on a column turns its header into a button. Pressing it asks for ascending order; pressing again asks for descending.',
                'The table does not sort. It calls `onSortChange` with `{ key, direction }`; you sort the rows and pass `sort` back.',
                'Each change is announced ("Sorted by Total (CAD), descending"), because a screen reader user cannot see rows move (WCAG 4.1.3, AA).',
                '`aria-sort` marks the sorted header, and a chevron shows the direction to sighted users (WCAG 4.1.2, A).',
              ],
              render: <SortableRequisitions />,
              code: `function SortableRequisitions() {
  // sort: null = the order of your data.
  const [sort, setSort] = useState({ key: 'total', direction: 'descending' });
  return (
    <Table
      caption="Requisitions"
      columns={columns}
      // You sort. The table only shows the order you give it.
      rows={sortRows(rows, sort)}
      getRowId={(row) => row.id}
      sort={sort}
      onSortChange={setSort}
    />
  );
}`,
            },
            {
              title: 'Columns that do not sort',
              when: 'Some columns have no useful order, such as a status or an action.',
              explain: [
                'A column sorts only when it has `sortable: true`. With `sortable: false`, or no `sortable`, the header is plain text: no button and no `aria-sort`.',
                'Make a column sortable only when people look values up by it. Every sortable header is one more tab stop.',
                'A `sort` prop always goes with `onSortChange`. The table has no read-only sort: a sortable header is always a button.',
              ],
              render: <Live selectable={false} rows={FIRST_ROWS} columns={PLAIN.map((column) => ({ ...column, sortable: column.key === 'id' || column.key === 'total' }))} />,
              code: `const columns = [
  { key: 'id', header: 'Requisition', rowHeader: true, sortable: true, cell: (row) => row.id },
  // Not sortable: plain header text, no button.
  { key: 'supplier', header: 'Supplier', sortable: false, cell: (row) => row.supplier },
  { key: 'status', header: 'Status', sortable: false, cell: (row) => row.status },
  { key: 'total', header: 'Total (CAD)', align: 'number', sortable: true, cell: (row) => money.format(row.total) },
];`,
            },
          ],
        },
        {
          title: 'Selection',
          kicker: 'onSelectionChange adds a checkbox column. Select all changes this page only.',
          examples: [
            {
              title: 'Select rows',
              when: 'People pick some rows to act on.',
              explain: [
                'Giving `onSelectionChange` adds a column of native checkboxes. You hold the ids in state and pass them as `selectedIds`.',
                'The header box selects all rows of this page and shows a mixed state when only some are selected.',
                'A line under the table counts the selection: "1 of 4 rows on this page selected" (Nielsen heuristic 5, error prevention).',
              ],
              render: <SelectableRequisitions />,
              code: `function SelectableRequisitions() {
  const [selectedIds, setSelectedIds] = useState([]);
  return (
    <Table
      caption="Requisitions"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      selectedIds={selectedIds}            // the ids that are checked
      onSelectionChange={setSelectedIds}   // adds the checkbox column
    />
  );
}`,
            },
            {
              title: 'Some rows selected at first',
              when: 'The view restores a selection.',
              explain: [
                'Start the state with ids. The matching rows show checked, and the header box shows the mixed state.',
                'Selected rows have a fill and a checked box, so the state does not rest on colour alone (WCAG 1.4.1, A).',
              ],
              render: <SelectableRequisitions initial={['REQ-1042', 'REQ-1043']} />,
              code: `function RestoredSelection() {
  // Start with two ids already selected.
  const [selectedIds, setSelectedIds] = useState(['REQ-1042', 'REQ-1043']);
  return (
    <Table
      caption="Requisitions"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}`,
            },
            {
              title: 'Name each row by its supplier',
              when: 'The row id is a poor name for a checkbox.',
              explain: [
                'Each checkbox has an invisible name, such as "Select REQ-1042". `getRowLabel` sets that text.',
                'Pick text that tells a screen reader user which row it is: here the id and the supplier (WCAG 4.1.2, A).',
              ],
              render: <Table caption="Requisitions" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} getRowLabel={(row) => `${row.id}, ${row.supplier}`} selectedIds={[]} onSelectionChange={() => undefined} />,
              code: `<Table
  caption="Requisitions"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  // The checkbox name: "Select REQ-1042, Aciers Laurentides".
  getRowLabel={(row) => \`\${row.id}, \${row.supplier}\`}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
/>`,
            },
            {
              title: 'A bulk action',
              when: 'Selecting rows enables the action that works on them.',
              explain: [
                'The button is disabled until a row is selected, and its label counts the selection ("Approve 2").',
                'The count in the label tells the user what will happen before they press (Nielsen heuristic 1, visibility of system status).',
                'Select all keeps ids from other pages. Say so in your UI if a bulk action reaches beyond this page (Nielsen heuristic 5, error prevention).',
              ],
              render: <BulkApprove />,
              code: `function BulkApprove() {
  const [selectedIds, setSelectedIds] = useState([]);
  return (
    <Stack gap={3} align="start">
      {/* Disabled with nothing selected; the label counts what it will act on. */}
      <Button disabled={selectedIds.length === 0} onClick={() => approve(selectedIds)}>
        {selectedIds.length === 0 ? 'Approve' : \`Approve \${selectedIds.length}\`}
      </Button>
      <Table
        caption="Requisitions to review"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'The data lifecycle',
          kicker: 'Data goes through stages. The table keeps its header in each one, and each stage needs its own message so the reader never faces a blank area.',
          examples: [
            {
              title: 'Nothing: first use',
              when: 'No record exists yet. Invite the reader to create one.',
              explain: [
                '`empty` shows one spanning row in place of the rows. You write the words and the button, because only you know the next step.',
                'Say what the table is for and how to start. Do not say "no results": no search has run.',
                'Why it matters: an empty grid with only headers looks broken. A new user does not know whether to wait or act.',
              ],
              render: <Table caption="Requisitions" columns={PLAIN} rows={[]} getRowId={(row) => row.id} empty={<Stack gap={2} align="start"><Text>No requisitions yet. Create your first one.</Text><Button variant="secondary">New requisition</Button></Stack>} />,
              code: `<Table
  caption="Requisitions"
  columns={columns}
  rows={[]}   // no rows: the empty slot shows
  getRowId={(row) => row.id}
  empty={
    <Stack gap={2} align="start">
      <Text>No requisitions yet. Create your first one.</Text>
      <Button variant="secondary" onClick={createRequisition}>New requisition</Button>
    </Stack>
  }
/>`,
            },
            {
              title: 'None: no match',
              when: 'A search or filter returned nothing.',
              explain: [
                'The same `empty` slot, with different words. First use says "start here"; no match says "your filter found nothing".',
                'Repeat the term the reader typed. Offer a way back, such as "Clear the filter".',
                'Why it matters: "No requisitions yet" after a search makes the reader fear their data is gone.',
              ],
              render: <Table caption="Requisitions" columns={PLAIN} rows={[]} getRowId={(row) => row.id} empty={<Text>No requisition matches “copper”.</Text>} />,
              code: `<Table
  caption="Requisitions"
  columns={columns}
  rows={matches}   // [] after a filter found nothing
  getRowId={(row) => row.id}
  empty={<Text>No requisition matches “{query}”.</Text>}
/>`,
            },
            {
              title: 'Loading',
              when: 'The rows are on their way.',
              explain: [
                '`loading` draws grey placeholder rows in each column\'s own alignment. The page does not jump when the data arrives (Nielsen heuristic 1, visibility of system status).',
                'The table sets `aria-busy="true"` and puts a visually hidden "Loading rows" phrase in the first placeholder cell. It is plain text, not a live region: a screen reader finds it when it reads the table, and may not announce it on its own.',
                'Pass `rows={[]}` while you wait. The headers stay, so the reader sees the shape of the data.',
              ],
              render: <Table caption="Requisitions" columns={PLAIN} rows={[]} getRowId={(row) => row.id} loading />,
              code: `<Table
  caption="Requisitions"
  columns={columns}
  rows={rows ?? []}   // nothing yet while loading
  getRowId={(row) => row.id}
  loading={isLoading}
/>`,
            },
            {
              title: 'Loading, with a known count',
              when: 'You know about how many rows will arrive.',
              explain: [
                '`skeletonRows` sets the number of placeholder rows. The default is 5.',
                'A close match to the real count keeps the page still when the rows arrive.',
              ],
              render: <Table caption="Requisitions" columns={PLAIN} rows={[]} getRowId={(row) => row.id} loading skeletonRows={3} />,
              code: `<Table caption="Requisitions" columns={columns} rows={[]} getRowId={(row) => row.id} loading={isLoading} skeletonRows={3} />`,
            },
            {
              title: 'Loading with selection',
              when: 'The table has a checkbox column.',
              explain: [
                'The checkbox column draws a placeholder box per row.',
                'The selection count line is hidden while loading, because there is nothing to count yet.',
              ],
              render: <Table caption="Requisitions" columns={PLAIN} rows={[]} getRowId={(row) => row.id} loading skeletonRows={3} selectedIds={[]} onSelectionChange={() => undefined} />,
              code: `<Table
  caption="Requisitions"
  columns={columns}
  rows={[]}
  getRowId={(row) => row.id}
  loading={isLoading}
  skeletonRows={3}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
/>`,
            },
            {
              title: 'One row',
              when: 'The result holds a single record.',
              explain: [
                'It is still a table. Do not switch layout for one row: the page would change shape when a second row arrives.',
                'A screen reader still announces the header with each cell.',
              ],
              render: <Table caption="Requisitions" columns={PLAIN} rows={FIRST_ROWS.slice(0, 1)} getRowId={(row) => row.id} />,
              code: `<Table caption="Requisitions" columns={columns} rows={rows.slice(0, 1)} getRowId={(row) => row.id} />`,
            },
            {
              title: 'Some rows',
              when: 'The normal case: a handful of records.',
              explain: [
                'This is the table as designed. See "Columns and rows" for the cells and "Sorting" and "Selection" for the tools.',
                'Hover fills the row on devices that hover. Selected rows keep their fill and a checked box.',
              ],
              render: <Table caption="Requisitions" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: `<Table caption="Requisitions" columns={columns} rows={rows} getRowId={(row) => row.id} />`,
            },
            {
              title: 'Many rows: page them',
              when: 'More rows than one screen holds.',
              explain: [
                'The table draws every row it gets and does not page. You slice the rows and pass one page at a time.',
                'Add `Pagination` under the table. It shows where the reader is ("1–4 of 8") and moves between pages. Pass `status` so a screen reader hears each page change (WCAG 4.1.3, AA).',
                'Why it matters: a table of hundreds of rows is slow and hard to scan. Pages keep it light.',
              ],
              render: <PagedRequisitions />,
              code: `function PagedRequisitions() {
  const [page, setPage] = useState(1);
  // Take one page of four rows from the full data.
  const pageRows = rows.slice((page - 1) * 4, page * 4);
  return (
    <Stack gap={3}>
      <Table caption="Requisitions" columns={columns} rows={pageRows} getRowId={(row) => row.id} />
      <Pagination
        label="Requisitions pages"
        page={page}
        pageCount={Math.ceil(rows.length / 4)}
        onPageChange={setPage}
        // A hidden status line announces each page change.
        status={\`Page \${page} of \${Math.ceil(rows.length / 4)}\`}
        total={\`\${(page - 1) * 4 + 1}–\${Math.min(page * 4, rows.length)} of \${rows.length}\`}
      />
    </Stack>
  );
}`,
            },
            {
              title: 'Error with a retry',
              when: 'The rows failed to load.',
              explain: [
                '`error` replaces the rows with one spanning row. It has `role="alert"`, so a screen reader may read it at once. The alert mounts together with its message, and such a region is not always read (WCAG 4.1.3, AA).',
                'The message is text. Colour only reinforces it (WCAG 1.4.1, A).',
                'Add a retry button. Without one, the reader is stuck (Nielsen heuristic 9, help users recover from errors).',
                'Why it matters: a table that stays empty after a failure looks like it is still loading.',
              ],
              render: <Table caption="Requisitions" columns={PLAIN} rows={[]} getRowId={(row) => row.id} error={<Stack gap={2} align="start"><Text>The requisitions did not load.</Text><Button variant="secondary">Try again</Button></Stack>} />,
              code: `<Table
  caption="Requisitions"
  columns={columns}
  rows={[]}
  getRowId={(row) => row.id}
  error={
    <Stack gap={2} align="start">
      <Text>The requisitions did not load.</Text>
      {/* retry runs your request again. */}
      <Button variant="secondary" onClick={retry}>Try again</Button>
    </Stack>
  }
/>`,
            },
            {
              title: 'Partial: some rows missing',
              when: 'Some rows loaded and some did not.',
              explain: [
                'Keep the rows you have. `partial` adds a status row under them that says what is missing.',
                'It has `role="status"`, which a screen reader may read politely. It mounts with its text, so it is not always read. The reader keeps what they have and learns what they lack.',
                'Why it matters: hiding every row for one failure throws away data the reader could use.',
              ],
              render: <Table caption="Requisitions" columns={PLAIN} rows={FIRST_ROWS.slice(0, 2)} getRowId={(row) => row.id} partial={<Text>6 requisitions did not load.</Text>} />,
              code: `<Table
  caption="Requisitions"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  partial={<Text>6 requisitions did not load.</Text>}
/>`,
            },
            {
              title: 'All states in one component',
              when: 'Your real table loads data. Press each state to see what changes.',
              explain: [
                'Map your request status to the props. The table does not fetch: you do.',
                'Pass `loading`, `empty`, `error` and `partial` together. Only the one that applies shows.',
                'The `empty` words depend on the cause: first use or no match. Press "empty" and "none" to see both.',
              ],
              render: <TableLifecycle />,
              code: `function RequisitionTable({ status, rows, query, retry }) {
  // status: 'loading' | 'error' | 'partial' | 'ready', from your data hook.
  return (
    <Table
      caption="Requisitions"
      columns={columns}
      rows={rows}            // [] while loading or failed
      getRowId={(row) => row.id}
      loading={status === 'loading'}
      // Different words for first use and for no match.
      empty={query ? <Text>No requisition matches “{query}”.</Text> : <Text>No requisitions yet. Create your first one.</Text>}
      error={
        status === 'error' && (
          <Stack gap={2} align="start">
            <Text>The requisitions did not load.</Text>
            <Button variant="secondary" onClick={retry}>Try again</Button>
          </Stack>
        )
      }
      partial={status === 'partial' && <Text>6 requisitions did not load.</Text>}
    />
  );
}`,
            },
          ],
        },
        {
          title: 'Density and size',
          kicker: 'Comfortable rows are 32px high. Compact rows keep every control at 24px or more.',
          examples: [
            {
              title: 'Comfortable',
              when: 'The default: a table people read more than scan.',
              explain: [
                '`density` defaults to `"comfortable"`, so the prop can be left out.',
                'Rows are at least 32px high, which gives checkboxes and buttons room.',
              ],
              render: <Table caption="Requisitions" density="comfortable" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: `<Table caption="Requisitions" density="comfortable" columns={columns} rows={rows} getRowId={(row) => row.id} />`,
            },
            {
              title: 'Compact',
              when: 'A dense view with many rows, such as a back-office list.',
              explain: [
                '`compact` trims the vertical padding to fit more rows on screen.',
                'Controls stay at 24px or more, the minimum target size (WCAG 2.5.8, AA).',
                'Use it for expert users who scan a lot of rows. Beginners read better in comfortable.',
              ],
              render: <Table caption="Requisitions" density="compact" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: `<Table caption="Requisitions" density="compact" columns={columns} rows={rows} getRowId={(row) => row.id} />`,
            },
            {
              title: 'Wide table in a narrow space',
              when: 'More columns than the width allows.',
              explain: [
                'The table scrolls sideways inside its own box. The page itself does not stretch.',
                'The scroll box can take focus, so keyboard users can scroll it with the arrow keys.',
                'On screens 768px wide or less, the table re-lays itself as a stack of cards. Each value gets its column name beside it.',
              ],
              frame: 'narrow',
              render: <Table caption="Requisitions" columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} />,
              code: `// Nothing to set: the scroll box and the card stack are built in.
<Table caption="Requisitions" columns={columns} rows={rows} getRowId={(row) => row.id} />`,
            },
            {
              title: 'Sticky header',
              when: 'A long table where the headers should stay in view while scrolling.',
              explain: [
                '`sticky` keeps the header row at the top of the scroll box.',
                'Sticky needs a box that scrolls. Give the table a `max-block-size` in your own CSS (see next example).',
                'A focused row is never hidden under the header: the box keeps room for it (WCAG 2.4.11, AA).',
              ],
              code: `// sticky: the header stays visible while the rows scroll.
// className: lets your CSS cap the height (see the next example).
<Table
  caption="Requisitions"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  sticky
  className="requisitions-table"
/>`,
            },
            {
              title: 'Sticky header: the height cap',
              when: 'The CSS that goes with sticky.',
              explain: [
                '`max-block-size` is the maximum height. Past it, the rows scroll inside the box and the header stays.',
                'Use a design token for the size, not a pixel value: `calc(var(--ds-space-12) * 6)`.',
              ],
              lang: 'css',
              code: `/* A height cap makes the box scroll, so the sticky header has something to stick to. */
.requisitions-table {
  max-block-size: calc(var(--ds-space-12) * 6);
}`,
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Paging, filtering and fetching belong to you. The table only draws.',
          examples: [
            {
              title: 'Table in a section',
              when: 'A table under a heading, with a short note.',
              explain: [
                'A visible heading names the section. `hideCaption` keeps the caption for assistive technology and avoids saying the name twice.',
                '`Stack` spaces the parts. `gap={2}` is the `space.2` token (8px): the heading and the table read as one block.',
              ],
              render: (
                <Stack gap={2}>
                  <Text as="h2">Open requisitions</Text>
                  <Text variant="caption" tone="muted" as="p">Approved requisitions are ordered each Monday.</Text>
                  <Table caption="Open requisitions" hideCaption columns={PLAIN} rows={FIRST_ROWS} getRowId={(row) => row.id} />
                </Stack>
              ),
              code: `<Stack gap={2}>
  <Text as="h2">Open requisitions</Text>
  <Text variant="caption" tone="muted" as="p">Approved requisitions are ordered each Monday.</Text>
  <Table caption="Open requisitions" hideCaption columns={columns} rows={rows} getRowId={(row) => row.id} />
</Stack>`,
            },
          ],
        },
        {
          title: 'Content and language',
          kicker: 'The caption, headers and cells arrive as props. The table speaks a few phrases of its own.',
          examples: [
            {
              title: 'Another language',
              when: 'The app is not in English.',
              explain: [
                '`labels` replaces the phrases the table speaks or prints: the select boxes, the sort announcement, the count and the wait.',
                'Each label is a function or a string. You can pass only the ones you change; the others keep their English default.',
                'Why it matters: a French page that speaks English labels is confusing for screen reader users. Translate every label you use.',
              ],
              render: <Table caption="Réquisitions" columns={PLAIN.map((column) => ({ ...column, sortable: column.key === 'total' }))} rows={FIRST_ROWS} getRowId={(row) => row.id} selectedIds={['REQ-1042']} onSelectionChange={() => undefined} labels={FRENCH_LABELS} />,
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
              when: 'Mark the human-readable name of the row.',
              explain: [
                '`rowHeader: true` makes the cell a row header (`th scope="row"`). A screen reader says its text before each other cell of the row.',
                'Pick the column people use to name the row. Here it is the supplier name, which people say aloud; in the first example it is the requisition number, which people quote. Avoid a database id nobody reads (Nielsen heuristic 2, match between the system and the real world).',
                'Mark one column only.',
              ],
              render: <Table caption="Requisitions" columns={PLAIN.filter((column) => ['supplier', 'total'].includes(column.key)).map((column) => ({ ...column, rowHeader: column.key === 'supplier' }))} rows={FIRST_ROWS.slice(0, 3)} getRowId={(row) => row.id} />,
              code: `const columns = [
  // The supplier names the row, so it is the row header.
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
