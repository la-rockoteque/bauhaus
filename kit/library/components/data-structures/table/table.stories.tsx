import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
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
          { name: 'space.inset.xs … md · space.inline.xs … md · space.stack.xs … sm', tier: '2', use: 'Cell padding by density; gaps in the card stack' },
          { name: 'size.target.min · size.icon.lg · size.icon.md · size.control.md', tier: '2', use: 'Row and control targets (44px; 24px in compact); checkbox size; scroll-padding under a sticky header' },
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
        { label: 'Row height', value: 'size.target.min, 44px, comfortable · about 32px, compact' },
        { label: 'Cell padding inline', property: 'padding-inline', target: 'tbody .ds-table__cell--row-header', token: 'space.inset.md' },
        { label: 'Cell padding block', property: 'padding-block', target: 'tbody .ds-table__cell--row-header', token: 'space.inset.sm' },
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
