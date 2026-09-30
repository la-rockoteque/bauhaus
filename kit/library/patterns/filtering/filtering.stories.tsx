import { useEffect, useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage, LIFECYCLE } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { Button } from '../../components/clickables/button/button';
import { Chip } from '../../components/clickables/chip/chip';
import { Checkbox } from '../../components/fields/checkbox/checkbox';
import { Select } from '../../components/fields/select/select';
import { TextField } from '../../components/fields/text-field/text-field';
import { Badge } from '../../components/feedback/badge/badge';
import type { BadgeStatus } from '../../components/feedback/badge/badge';
import { EmptyState } from '../../components/feedback/empty-state/empty-state';
import { Spinner } from '../../components/feedback/spinner/spinner';
import { List, ListItem } from '../../components/data-structures/list/list';
import { Table } from '../../components/data-structures/table/table';
import type { TableColumn } from '../../components/data-structures/table/table';
import { Pagination } from '../../components/navigation/pagination/pagination';
import { Stack } from '../../primitives/stack/stack';
import { Text } from '../../primitives/text/text';
import { filteringRules } from './filtering.rules';

// The pattern is a recipe, not a component: the showcase composes the parts it names.
// The recipe pieces are exported for the test and hidden from the Storybook sidebar.
const meta = {
  title: 'Patterns/Filtering',
  parameters: { layout: 'fullscreen' },
  excludeStories: ['OrderFilters', 'makeOrders', 'applyFilters', 'activeChips', 'toSearchParams', 'fromSearchParams', 'NO_FILTERS'],
} satisfies Meta;

export default meta;

const STATUSES = ['Pending', 'Shipped', 'Delivered', 'Cancelled'] as const;
const REGIONS = ['Europe', 'Asia', 'Americas'] as const;
const CUSTOMERS = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Edsger Dijkstra', 'Margaret Hamilton', 'Linus Torvalds', 'Barbara Liskov'];
const STATUS_BADGE: Record<string, BadgeStatus> = { Pending: 'warning', Shipped: 'info', Delivered: 'success', Cancelled: 'error' };

export interface Order { id: string; customer: string; status: string; region: string; total: number; returned: boolean }
export interface Filters { query: string; status: string; region: string; returnsOnly: boolean }
export const NO_FILTERS: Filters = { query: '', status: '', region: '', returnsOnly: false };

/** Sample data. Every status meets every region once in twelve rows, so a fixture can hold a combination that matches nothing. */
export const makeOrders = (count: number): Order[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `ORD-${1000 + i}`,
    customer: CUSTOMERS[i % CUSTOMERS.length],
    status: STATUSES[i % STATUSES.length],
    region: REGIONS[i % REGIONS.length],
    total: 20 + ((i * 37) % 480),
    returned: i % 7 === 0,
  }));

export function applyFilters(orders: readonly Order[], f: Filters): Order[] {
  const q = f.query.trim().toLowerCase();
  return orders.filter(
    (o) =>
      (!q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)) &&
      (!f.status || o.status === f.status) &&
      (!f.region || o.region === f.region) &&
      (!f.returnsOnly || o.returned),
  );
}

export interface Chip { key: keyof Filters; name: string; value: string }

/** One chip per active filter. The visible text is "name: value"; the remove button names both: "Remove filter name: value". */
export function activeChips(f: Filters): Chip[] {
  const chips: Chip[] = [];
  if (f.query.trim()) chips.push({ key: 'query', name: 'Search', value: f.query.trim() });
  if (f.status) chips.push({ key: 'status', name: 'Status', value: f.status });
  if (f.region) chips.push({ key: 'region', name: 'Region', value: f.region });
  if (f.returnsOnly) chips.push({ key: 'returnsOnly', name: 'Returns', value: 'Only orders with a return' });
  return chips;
}

/** URL recipe, write side: hand the string to your router. The pattern imports none. */
export function toSearchParams(f: Filters, page: number): URLSearchParams {
  const params = new URLSearchParams();
  if (f.query.trim()) params.set('q', f.query.trim());
  if (f.status) params.set('status', f.status);
  if (f.region) params.set('region', f.region);
  if (f.returnsOnly) params.set('returns', '1');
  if (page > 1) params.set('page', String(page));
  return params;
}

/** URL recipe, read side: feed `initialFilters` and `initialPage` from the address on load. */
export function fromSearchParams(params: URLSearchParams): { filters: Filters; page: number } {
  return {
    filters: { query: params.get('q') ?? '', status: params.get('status') ?? '', region: params.get('region') ?? '', returnsOnly: params.get('returns') === '1' },
    page: Math.max(1, Number(params.get('page')) || 1),
  };
}

const fmt = (n: number) => n.toLocaleString('en-US');
const summarize = (total: number, start: number, end: number) =>
  total === 0 ? 'No results' : total === 1 ? 'Showing 1 of 1 result' : `Showing ${fmt(start)}–${fmt(end)} of ${fmt(total)} results`;

const COLUMNS: readonly TableColumn<Order>[] = [
  { key: 'id', header: 'Order', rowHeader: true, cell: (o) => o.id },
  { key: 'customer', header: 'Customer', cell: (o) => o.customer },
  { key: 'status', header: 'Status', cell: (o) => <Badge status={STATUS_BADGE[o.status]}>{o.status}</Badge> },
  { key: 'region', header: 'Region', cell: (o) => o.region },
  { key: 'total', header: 'Total', align: 'number', cell: (o) => `$${o.total}` },
];

export interface OrderFiltersProps {
  orders: readonly Order[];
  initialFilters?: Filters;
  initialPage?: number;
  pageSize?: number;
  /** How long results take to arrive. A real app fires its request here; typing restarts the wait, which is the debounce. */
  delayMs?: number;
  /** Force the loading state, for the showcase. */
  loading?: boolean;
  /** Force the failed-request state, for the showcase. */
  failed?: boolean;
  initialNotice?: string;
  /** `table` for a wide container. `list` for a narrow one, such as a phone or a side panel. */
  results?: 'table' | 'list';
  /** Called once the results settle. Write the state to the URL here. */
  onStateChange?: (filters: Filters, page: number) => void;
}

export function OrderFilters({ orders, initialFilters = NO_FILTERS, initialPage = 1, pageSize = 25, delayMs = 300, loading = false, failed = false, initialNotice = '', results = 'table', onStateChange }: OrderFiltersProps) {
  const uid = useId();
  const searchId = `${uid}-search`;
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(initialPage);
  const [applied, setApplied] = useState({ filters: initialFilters, page: initialPage });
  const [notice, setNotice] = useState(initialNotice);
  const [failing, setFailing] = useState(failed);
  const [refocus, setRefocus] = useState(0);

  const pending = applied.filters !== filters || applied.page !== page;
  useEffect(() => {
    if (!pending) return undefined;
    const timer = setTimeout(() => {
      setApplied({ filters, page });
      onStateChange?.(filters, page);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [filters, page, pending, delayMs, onStateChange]);
  useEffect(() => {
    if (refocus > 0) document.getElementById(searchId)?.focus();
  }, [refocus, searchId]);

  const busy = loading || pending;
  const matches = applyFilters(orders, applied.filters);
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
  const current = Math.min(applied.page, pageCount);
  const start = (current - 1) * pageSize + 1;
  const rows = matches.slice(start - 1, start - 1 + pageSize);
  const chips = activeChips(filters);
  const appliedChips = activeChips(applied.filters);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
    setNotice('');
  };
  const remove = (chip: Chip) => {
    setFilters({ ...filters, [chip.key]: NO_FILTERS[chip.key] });
    setPage(1);
    setNotice(`Removed filter ${chip.name}, ${chip.value}.`);
    setRefocus(refocus + 1);
  };
  const clearAll = () => {
    setFilters(NO_FILTERS);
    setPage(1);
    setNotice('Filters cleared.');
    setRefocus(refocus + 1);
  };

  // No dead end: find the one filter whose removal brings back the most results.
  const relax = appliedChips
    .map((chip) => ({ chip, count: applyFilters(orders, { ...applied.filters, [chip.key]: NO_FILTERS[chip.key] }).length }))
    .filter((option) => option.count > 0)
    .sort((a, b) => b.count - a.count)[0];

  const empty =
    orders.length === 0 ? (
      <EmptyState title="No orders yet" headingLevel={3}>Orders appear here after checkout.</EmptyState>
    ) : (
      <EmptyState
        title="No orders match these filters"
        headingLevel={3}
        actions={
          <>
            {relax && <Button onClick={() => remove(relax.chip)}>Remove {relax.chip.name}: {relax.chip.value} ({fmt(relax.count)} {relax.count === 1 ? 'order' : 'orders'})</Button>}
            {(appliedChips.length > 1 || !relax) && <Button variant="secondary" onClick={clearAll}>Clear all filters</Button>}
          </>
        }
      >
        {appliedChips.map((chip) => `${chip.name}: ${chip.value}`).join(' and ')} {appliedChips.length > 1 ? 'match no orders together.' : 'matches no orders.'}
      </EmptyState>
    );

  const error = (
    <Stack gap={3} align="start">
      <Text>We could not load the orders. Your filters are kept.</Text>
      <Button variant="secondary" onClick={() => setFailing(false)}>Try again</Button>
    </Stack>
  );

  return (
    <Stack gap={4}>
      <div role="search" aria-label="Filter orders">
        <Stack direction="horizontal" gap={4} align="end" wrap>
          <TextField id={searchId} type="search" label="Search orders" description="Order number or customer." value={filters.query} onChange={(e) => setFilter('query', e.target.value)} />
          <Select label="Status" emptyLabel="All statuses" options={STATUSES.map((s) => ({ value: s, label: s }))} value={filters.status} onChange={(e) => setFilter('status', e.target.value)} />
          <Select label="Region" emptyLabel="All regions" options={REGIONS.map((r) => ({ value: r, label: r }))} value={filters.region} onChange={(e) => setFilter('region', e.target.value)} />
          <Checkbox label="Only orders with a return" checked={filters.returnsOnly} onChange={(e) => setFilter('returnsOnly', e.target.checked)} />
        </Stack>
      </div>
      {chips.length > 0 && (
        <Stack as="ul" direction="horizontal" gap={2} align="center" wrap aria-label="Active filters">
          {chips.map((chip) => (
            <li key={chip.key}>
              <Chip variant="removable" removeLabel="Remove filter" onRemove={() => remove(chip)}>{`${chip.name}: ${chip.value}`}</Chip>
            </li>
          ))}
          <li>
            <Button variant="tertiary" onClick={clearAll}>Clear all</Button>
          </li>
        </Stack>
      )}
      <Stack direction="horizontal" gap={3} align="center">
        <Text role="status">{[notice, orders.length === 0 ? 'No orders yet' : summarize(matches.length, start, start + rows.length - 1)].filter(Boolean).join(' ')}</Text>
        {busy && <Spinner size="sm" label="Updating results" showLabel aria-hidden="true" />}
      </Stack>
      {matches.length > 1000 && <Text tone="muted">That is a long list. Add a filter to narrow it.</Text>}
      {results === 'table' ? (
        <Table<Order>
          caption="Orders"
          hideCaption
          columns={COLUMNS}
          rows={rows}
          getRowId={(o) => o.id}
          loading={busy}
          skeletonRows={Math.min(pageSize, 5)}
          empty={empty}
          error={failing ? error : undefined}
        />
      ) : (
        <List aria-label="Orders" divided loading={busy} skeletonRows={Math.min(pageSize, 5)} empty={empty} error={failing ? error : undefined}>
          {rows.map((o) => (
            <ListItem key={o.id} title={o.id} description={`${o.customer} · ${o.region} · $${o.total}`} trailing={<Badge status={STATUS_BADGE[o.status]}>{o.status}</Badge>} />
          ))}
        </List>
      )}
      {pageCount > 1 && (
        <Pagination label="Orders pages" page={current} pageCount={pageCount} onPageChange={setPage} status={`Page ${current} of ${pageCount}`} />
      )}
    </Stack>
  );
}

const ORDERS_30 = makeOrders(30);
const ORDERS_11 = makeOrders(11);
const ORDERS_MANY = makeOrders(1342);
const SHIPPED: Filters = { ...NO_FILTERS, status: 'Shipped' };
const CELL = { pageSize: 5, delayMs: 0, results: 'list' } as const;

function TryIt() {
  const [url, setUrl] = useState('');
  return (
    <Stack gap={3}>
      <Text tone="muted">Type in the search field, pick a status, then remove a chip. Search for “zzz” to reach a view with no results. The address below is what you would write to the URL.</Text>
      <OrderFilters orders={ORDERS_MANY} pageSize={10} onStateChange={(f, p) => setUrl(`?${toSearchParams(f, p).toString()}`)} />
      <Text tone="muted">URL now: {url || '(no filters)'}</Text>
    </Stack>
  );
}

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Filtering"
      layer="Pattern"
      plain="Filtering narrows a long list. It shows what is set, how many results are left, and a way to undo each choice."
      precise="Pattern · a search field and facet controls, removable chips for the active filters, a result count in a status region, a table with pagination, and an empty state that offers the filter to relax · composes TextField, Select, Checkbox, Chip, Badge, Button, Table, Pagination and EmptyState; has no style of its own."
      usedFor="A table or list too long to scan, where the user narrows it by text and a few facets."
      tokens={{ mode: 'consumed', note: 'None of its own. Layout comes from Stack. Colour, type and spacing come from the components it composes.', rows: [] }}
      stage={{
        render: <OrderFilters orders={ORDERS_30} initialFilters={{ ...NO_FILTERS, status: 'Shipped', region: 'Asia' }} pageSize={2} delayMs={0} />,
        parts: [
          { n: 1, label: 'Filter bar', note: 'search field and facets in a search landmark · a top bar for few facets', target: '[role=search]', at: 'top-start' },
          { n: 2, label: 'Chips', note: 'Chip per active filter, remove button named "Remove filter …" · one Clear all', target: '[aria-label="Active filters"]', at: 'top-start' },
          { n: 3, label: 'Result count', note: 'a status region · "Showing 1–25 of 1,342 results"', target: '[role=status]', at: 'top-start' },
          { n: 4, label: 'Results', note: 'Table (or List) · loading keeps the size', target: 'table', at: 'top-end' },
          { n: 5, label: 'Pagination', note: 'Pagination · announces the page', target: 'nav', at: 'top-start' },
        ],
      }}
      api={[
        { label: 'initialFilters · initialPage', value: 'Read the address on load with fromSearchParams and pass the result here.' },
        { label: 'onStateChange(filters, page)', value: 'Called once results settle. Write toSearchParams(filters, page) to the URL here, with your router.' },
        { label: 'delayMs', value: 'The wait before results settle. Typing restarts it, which debounces the search field.' },
      ]}
      states={{
        expect: LIFECYCLE,
        note: 'Interaction states are inherited from the components the pattern composes. Each cell uses the list layout and five rows a page, to fit the cell.',
        cells: [
          { id: 'nothing', status: 'designed', label: 'Nothing (no orders exist)', render: <OrderFilters orders={[]} {...CELL} />, trigger: 'orders empty, no filter', note: 'First-use copy. Filtering is not the cause.' },
          { id: 'loading', status: 'designed', label: 'Loading (results updating)', render: <OrderFilters orders={ORDERS_30} initialFilters={SHIPPED} loading {...CELL} />, trigger: 'a filter changed', note: 'Skeleton rows keep the table size; the count stays and a spinner sits beside it.' },
          { id: 'none', status: 'designed', label: 'None (filters match nothing)', render: <OrderFilters orders={ORDERS_11} initialFilters={{ ...NO_FILTERS, status: 'Cancelled', region: 'Americas' }} {...CELL} />, trigger: 'filters, zero rows', note: 'Names the filter to relax, with the count it brings back, in one button.' },
          { id: 'one', status: 'designed', label: 'One (a single result)', render: <OrderFilters orders={ORDERS_11} initialFilters={{ ...NO_FILTERS, query: 'ORD-1004' }} {...CELL} />, trigger: 'one row', note: '"Showing 1 of 1 result": the plural is right and no pager shows.' },
          { id: 'some', status: 'designed', label: 'Some (a filtered page)', render: <OrderFilters orders={ORDERS_30} initialFilters={SHIPPED} {...CELL} />, trigger: 'a few rows', note: 'Chip, count and pager agree.' },
          { id: 'too-many', status: 'designed', label: 'Too many (1,342 results)', render: <OrderFilters orders={ORDERS_MANY} {...CELL} />, trigger: 'no filter, a long list', note: 'The total, a pager and a prompt to narrow the list.' },
          { id: 'incorrect', status: 'designed', label: 'Incorrect (request failed)', render: <OrderFilters orders={ORDERS_30} initialFilters={SHIPPED} failed {...CELL} />, trigger: 'failed request', note: 'An in-place error with a retry. The filters are kept.' },
          { id: 'correct', status: 'designed', label: 'Correct (filters accepted)', render: <OrderFilters orders={ORDERS_30} initialFilters={{ ...NO_FILTERS, status: 'Delivered', region: 'Europe' }} {...CELL} />, trigger: 'two filters set', note: 'Each filter shows as a chip and the count confirms the effect.' },
          { id: 'done', status: 'designed', label: 'Done (filters cleared)', render: <OrderFilters orders={ORDERS_30} initialNotice="Filters cleared." {...CELL} />, trigger: 'Clear all pressed', note: 'The status region says what changed, then the new count.' },
        ],
      }}
      extra={[
        {
          title: 'Recipe',
          kicker: 'The order of the pieces. The guide holds the reasoning.',
          content: (
            <List ordered divided>
              <ListItem title="Place the filters where they are seen" description="A top bar for a few facets, a side panel for many. On a phone, open them in a full-screen sheet with Apply and Clear." />
              <ListItem title="Apply at once and show it" description="Update on each change. Keep the table size with skeleton rows and put a Spinner beside the count. Add an Apply button only for an expensive query, and say why." />
              <ListItem title="Show every active filter as a chip" description="A removable Chip in a list. The button is named “Remove filter Status: Shipped”. Add one “Clear all”." />
              <ListItem title="Show the count and the total, announced" description="“Showing 1–25 of 1,342 results” in a role=status element. Put the removed filter in the same message." />
              <ListItem title="Leave no dead end" description="When no rows match, name the filters and offer the one whose removal brings back the most results, in a single button." />
              <ListItem title="Keep the state in the URL" description="Read fromSearchParams(location.search) into initialFilters and initialPage. Write toSearchParams(filters, page) in onStateChange with your router. Back, reload and share then restore the view." />
            </List>
          ),
        },
        {
          title: 'Try it',
          kicker: 'The working pattern on 1,342 sample orders.',
          content: <TryIt />,
        },
      ]}
      dos={[
        { text: 'Show every active filter as a chip you can remove on its own.', basis: 'Nielsen 3, 6' },
        { text: 'Name each remove button with the filter it removes.', basis: 'WCAG 4.1.2 (A)' },
        { text: 'Announce the count after each change.', basis: 'WCAG 4.1.3 (AA)' },
        { text: 'Offer the filter to relax when nothing matches.', basis: 'WCAG 3.3.3 (AA)' },
        { text: 'Keep the state in the URL.', basis: 'Nielsen 3' },
      ]}
      donts={[
        { text: 'Hide the active filters behind a closed panel.', basis: 'Nielsen 6', rule: 'filtering.active-visible' },
        { text: 'Label a chip button “×” or “Remove”.', basis: 'WCAG 4.1.2 (A)', rule: 'filtering.chip-removable' },
        { text: 'Update the count without a status region.', basis: 'WCAG 4.1.3 (AA)', rule: 'filtering.count-announced' },
        { text: 'End on “No results” with no way out.', basis: 'WCAG 3.3.3 (AA)', rule: 'filtering.no-dead-end' },
        { text: 'Keep filter state only in component memory.', basis: 'Nielsen 3', rule: 'filtering.url-state' },
      ]}
      guide="patterns-filtering--docs"
      guideName="Filtering"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Filtering" layer="Pattern" rules={filteringRules} guide="patterns-filtering--docs" guideName="Filtering" />,
};
