import { useEffect, useId, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage, LIFECYCLE } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
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
const DELAYS = ['0', '300', '1000'] as const;
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
        render: (args) => <OrderFilters orders={ORDERS_30} initialFilters={{ ...NO_FILTERS, status: 'Shipped', region: 'Asia' }} pageSize={2} delayMs={Number(args.delayMs) || 0} />,
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
        { label: 'delayMs', value: 'The wait before results settle. Typing restarts it, which debounces the search field.', control: { kind: 'select', options: DELAYS, value: '0' } },
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

/** Step 1 demo: a search field in a search landmark, a count in a status region. */
function SearchStep() {
  const [query, setQuery] = useState('');
  const matches = CUSTOMERS.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <Stack gap={3}>
      <div role="search" aria-label="Filter customers">
        <TextField type="search" label="Search customers" description="First or last name." value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <Text role="status">{matches.length === 0 ? 'No results' : matches.length === 1 ? '1 result' : `${matches.length} results`}</Text>
      <List aria-label="Customers" divided>
        {matches.map((name) => <ListItem key={name} title={name} />)}
      </List>
    </Stack>
  );
}

/** Step 2 demo: two facets in one state object. */
function FacetStep() {
  const orders = ORDERS_11;
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters({ ...filters, [key]: value });
  const matches = applyFilters(orders, filters);
  return (
    <Stack gap={3}>
      <div role="search" aria-label="Filter orders">
        <Stack direction="horizontal" gap={4} align="end" wrap>
          <Select label="Status" emptyLabel="All statuses" options={STATUSES.map((s) => ({ value: s, label: s }))} value={filters.status} onChange={(e) => setFilter('status', e.target.value)} />
          <Checkbox label="Only orders with a return" checked={filters.returnsOnly} onChange={(e) => setFilter('returnsOnly', e.target.checked)} />
        </Stack>
      </div>
      <Text role="status">{summarize(matches.length, 1, matches.length)}</Text>
    </Stack>
  );
}

/** Step 3 demo: removable chips, a Clear all button, and a notice that says what changed. */
function ChipsStep() {
  const search = useRef<HTMLInputElement>(null);
  const start: Filters = { ...NO_FILTERS, status: 'Shipped', region: 'Asia' };
  const [filters, setFilters] = useState<Filters>(start);
  const [notice, setNotice] = useState('');
  const chips = activeChips(filters);
  const remove = (chip: Chip) => {
    setFilters({ ...filters, [chip.key]: NO_FILTERS[chip.key] });
    setNotice(`Removed filter ${chip.name}, ${chip.value}.`);
    search.current?.focus();
  };
  const clearAll = () => {
    setFilters(NO_FILTERS);
    setNotice('Filters cleared.');
    search.current?.focus();
  };
  return (
    <Stack gap={3}>
      <TextField ref={search} type="search" label="Search orders" value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} />
      {chips.length > 0 ? (
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
      ) : (
        <Button variant="tertiary" onClick={() => setFilters(start)}>Set the filters again</Button>
      )}
      <Text role="status">{notice}</Text>
    </Stack>
  );
}

/** Step 4 demo: the count sentence for many, one and no results. */
function CountStep() {
  const [total, setTotal] = useState('1342');
  const n = Number(total);
  return (
    <Stack gap={3}>
      <Select label="Pretend the search returned" options={[{ value: '1342', label: '1,342 results' }, { value: '1', label: '1 result' }, { value: '0', label: 'no results' }]} value={total} onChange={(event) => setTotal(event.target.value)} />
      <Text role="status">{summarize(n, 1, Math.min(n, 25))}</Text>
    </Stack>
  );
}

/** Step 5 demo: a pager that reports its page and keeps the count in step. */
function PagerStep() {
  const [page, setPage] = useState(1);
  const total = 42;
  const pageSize = 10;
  const pageCount = Math.ceil(total / pageSize);
  const first = (page - 1) * pageSize + 1;
  return (
    <Stack gap={3}>
      <Text role="status">{summarize(total, first, Math.min(total, first + pageSize - 1))}</Text>
      <Pagination label="Orders pages" page={page} pageCount={pageCount} onPageChange={setPage} status={`Page ${page} of ${pageCount}`} />
    </Stack>
  );
}

/** Step 6 demo: typing restarts a 400 ms wait, so the request fires once the user pauses. */
function DebounceStep() {
  const [query, setQuery] = useState('');
  const [requests, setRequests] = useState<readonly string[]>([]);
  useEffect(() => {
    if (query === '') return undefined;
    const timer = setTimeout(() => setRequests((sent) => [...sent, query]), 400);
    return () => clearTimeout(timer);
  }, [query]);
  return (
    <Stack gap={3}>
      <TextField type="search" label="Search orders" description="Type a word fast, then pause." value={query} onChange={(event) => setQuery(event.target.value)} />
      <Text role="status">{requests.length === 0 ? 'No request sent yet.' : `${requests.length} request${requests.length === 1 ? '' : 's'} sent. Last search: ${requests[requests.length - 1]}`}</Text>
    </Stack>
  );
}

/** Step 7 demo: the address that the filters would write. */
function UrlStep() {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [page, setPage] = useState(1);
  return (
    <Stack gap={3}>
      <Stack direction="horizontal" gap={4} align="end" wrap>
        <TextField type="search" label="Search orders" value={filters.query} onChange={(event) => { setFilters({ ...filters, query: event.target.value }); setPage(1); }} />
        <Select label="Status" emptyLabel="All statuses" options={STATUSES.map((s) => ({ value: s, label: s }))} value={filters.status} onChange={(event) => { setFilters({ ...filters, status: event.target.value }); setPage(1); }} />
        <Select label="Page" options={[1, 2, 3].map((n) => ({ value: String(n), label: String(n) }))} value={String(page)} onChange={(event) => setPage(Number(event.target.value))} />
      </Stack>
      <Text>Address: <code>{`/orders?${toSearchParams(filters, page).toString()}`}</code></Text>
    </Stack>
  );
}

const SHIPPED_ASIA_CHIPS = (
  <Stack as="ul" direction="horizontal" gap={2} align="center" wrap aria-label="Active filters">
    <li><Chip variant="removable" removeLabel="Remove filter">Customer: Maria del Carmen Guadalupe de los Santos Fernandez-Villalobos</Chip></li>
  </Stack>
);

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Filtering"
      layer="Pattern"
      imports={`import { Badge, Button, Checkbox, Chip, EmptyState, List, ListItem, Pagination, Select, Spinner, Stack, Table, Text, TextField } from '@acme/design-system';
import { useEffect, useRef, useState } from 'react';`}
      intro={[
        'Filtering narrows a long list. After each change the user must be able to answer three questions: what is set, how many results are left, and how do I undo it?',
        'The pattern has no component of its own. You write one component that holds the filters in `useState` and composes `TextField`, `Select`, `Checkbox`, `Chip`, `Table`, `Pagination` and `EmptyState`.',
        'A "facet" is one control that narrows the list by one property, such as Status or Region. The "active filters" are the facets that currently have a value.',
        'A "status region" is an element with `role="status"`. A screen reader reads its text aloud whenever the text changes, without moving focus. Without it, a blind user hears nothing after they filter.',
        'Debouncing means waiting until the user pauses typing before sending the request. Typing "shirt" then sends one request, not five.',
        'Read the first example for the whole picture. The next group builds it one part at a time, each with a working demo. Then come the lifecycle states and content cases.',
        'Names such as `orders`, `applyFilters` and `NO_FILTERS` stand for your own data and code. The steps show what `applyFilters`, `activeChips` and `summarize` do.',
      ]}
      guide="patterns-filtering--docs"
      guideName="Filtering"
      groups={[
        {
          title: 'The whole pattern',
          kicker: 'Read this first. Every later example is one piece of it.',
          examples: [
            {
              title: 'A filterable order table',
              when: 'You have a long list of orders and want search, two facets, chips, a count and pages.',
              explain: [
                'State: the `filters` object holds what the user chose. `page` holds the page. Both change at once and instantly, so the controls feel fast.',
                '`applied` holds the values that the results are based on. It trails `filters` by 300 ms. While they differ, `pending` is true and the table shows skeleton rows (grey placeholders the size of real rows). This is the debounce.',
                'Announcements: the count sits in a `role="status"` element and starts with `notice`, so the message says what the user did ("Removed filter Region, Asia.") before the new count (WCAG 4.1.3, AA).',
                'Focus: removing a chip deletes the button the user pressed. The handlers move focus to the search field, so a keyboard user keeps their place (WCAG 2.4.3, A).',
                'No dead end: when no row matches, `relax` finds the one filter whose removal brings back the most rows, and the empty state offers exactly that (WCAG 3.3.3, AA; Nielsen heuristic 9).',
                'Try it: pick Status "Shipped", remove the chip, search "zzz".',
              ],
              render: <OrderFilters orders={ORDERS_30} pageSize={5} delayMs={300} />,
              code: `function OrderFilters({ orders }) {
  const search = useRef(null);

  // What the controls show right now. Updates on every keystroke.
  const [filters, setFilters] = useState(NO_FILTERS);
  const [page, setPage] = useState(1);
  // What the results show. It trails 'filters' by 300 ms (the debounce).
  const [applied, setApplied] = useState({ filters: NO_FILTERS, page: 1 });
  // A sentence that says what the user just did. Read aloud first.
  const [notice, setNotice] = useState('');

  const pending = applied.filters !== filters || applied.page !== page;
  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(() => {
      // In your app, send the request here instead of filtering in memory.
      setApplied({ filters, page });
    }, 300);
    // Typing again cancels the timer and restarts the wait.
    return () => clearTimeout(timer);
  }, [filters, page, pending]);

  // Everything below is derived. Nothing to keep in sync.
  const matches = applyFilters(orders, applied.filters);
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
  const current = Math.min(applied.page, pageCount);
  const first = (current - 1) * pageSize + 1;
  const rows = matches.slice(first - 1, first - 1 + pageSize);
  const chips = activeChips(filters);

  // Any filter change goes back to page 1, or the user may land on a page
  // that no longer exists.
  const setFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
    setNotice('');
  };
  const remove = (chip) => {
    setFilters({ ...filters, [chip.key]: NO_FILTERS[chip.key] });
    setPage(1);
    setNotice('Removed filter ' + chip.name + ', ' + chip.value + '.');
    // The chip's button is gone. Put focus somewhere that still exists.
    search.current?.focus();
  };
  const clearAll = () => {
    setFilters(NO_FILTERS);
    setPage(1);
    setNotice('Filters cleared.');
    search.current?.focus();
  };

  // The filter whose removal brings back the most rows.
  const relax = activeChips(applied.filters)
    .map((chip) => ({ chip, count: applyFilters(orders, { ...applied.filters, [chip.key]: NO_FILTERS[chip.key] }).length }))
    .filter((option) => option.count > 0)
    .sort((a, b) => b.count - a.count)[0];

  return (
    <Stack gap={4}>
      {/* A search landmark: screen reader users can jump straight to it. */}
      <div role="search" aria-label="Filter orders">
        <Stack direction="horizontal" gap={4} align="end" wrap>
          <TextField ref={search} type="search" label="Search orders"
            value={filters.query} onChange={(e) => setFilter('query', e.target.value)} />
          <Select label="Status" emptyLabel="All statuses"
            options={STATUSES.map((s) => ({ value: s, label: s }))}
            value={filters.status} onChange={(e) => setFilter('status', e.target.value)} />
          <Checkbox label="Only orders with a return"
            checked={filters.returnsOnly} onChange={(e) => setFilter('returnsOnly', e.target.checked)} />
        </Stack>
      </div>

      {chips.length > 0 && (
        <Stack as="ul" direction="horizontal" gap={2} align="center" wrap aria-label="Active filters">
          {chips.map((chip) => (
            <li key={chip.key}>
              {/* The remove button is named 'Remove filter Status: Shipped'. */}
              <Chip variant="removable" removeLabel="Remove filter" onRemove={() => remove(chip)}>
                {chip.name + ': ' + chip.value}
              </Chip>
            </li>
          ))}
          <li><Button variant="tertiary" onClick={clearAll}>Clear all</Button></li>
        </Stack>
      )}

      <Stack direction="horizontal" gap={3} align="center">
        <Text role="status">
          {notice} {summarize(matches.length, first, first + rows.length - 1)}
        </Text>
        {pending && <Spinner size="sm" label="Updating results" showLabel aria-hidden="true" />}
      </Stack>

      <Table
        caption="Orders"
        hideCaption
        columns={columns}
        rows={rows}
        getRowId={(order) => order.id}
        loading={pending}
        skeletonRows={pageSize}
        empty={
          <EmptyState
            title="No orders match these filters"
            headingLevel={3}
            actions={relax && (
              <Button onClick={() => remove(relax.chip)}>
                Remove {relax.chip.name}: {relax.chip.value} ({relax.count} orders)
              </Button>
            )}
          >
            Try fewer filters.
          </EmptyState>
        }
      />

      {pageCount > 1 && (
        <Pagination label="Orders pages" page={current} pageCount={pageCount}
          onPageChange={setPage} status={'Page ' + current + ' of ' + pageCount} />
      )}
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Build it step by step',
          kicker: 'Seven parts, in the order you would build them. Each demo works on its own.',
          examples: [
            {
              title: '1. A search field and a result count',
              when: 'The smallest useful filter: type, and the list shrinks.',
              explain: [
                '`type="search"` gives the field a clear button and a search keyboard on phones. `label` stays visible at all times; a placeholder is not a label (WCAG 3.3.2, A).',
                'The wrapper `<div role="search" aria-label="Filter customers">` is a landmark (a named region that a screen reader can jump to). A page can have more than one search landmark, for example these filters and the site search. Name each one with `aria-label` so a screen reader user can tell them apart.',
                'The matches are computed from `query` on each render. There is no second list to keep in sync.',
                'The count sits in `role="status"`, so each change is read aloud (WCAG 4.1.3, AA). Focus stays in the field while the user types (WCAG 3.2.2, A).',
              ],
              render: <SearchStep />,
              code: `function CustomerSearch({ customers }) {
  const [query, setQuery] = useState('');
  // Derived on every render from the query. No extra state.
  const matches = customers.filter((name) =>
    name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Stack gap={3}>
      {/* The landmark names the region for screen reader users. */}
      <div role="search" aria-label="Filter customers">
        <TextField
          type="search"
          label="Search customers"
          description="First or last name."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {/* Announced after every change. Spell out the none and one cases. */}
      <Text role="status">
        {matches.length === 0
          ? 'No results'
          : matches.length === 1
            ? '1 result'
            : matches.length + ' results'}
      </Text>

      <List aria-label="Customers" divided>
        {matches.map((name) => <ListItem key={name} title={name} />)}
      </List>
    </Stack>
  );
}`,
            },
            {
              title: '2. Facets in one state object',
              when: 'You add controls that narrow by one property each: a Select, a Checkbox.',
              explain: [
                'Keep all filters in one object, `filters`. A function `setFilter(key, value)` then updates any of them the same way. Adding a facet means adding one key.',
                '`emptyLabel="All statuses"` adds the "no filter" choice. Its value is an empty string, which means "do not filter by status".',
                'Each filter narrows with "and": a row must match every active filter. `applyFilters` returns only rows that pass all of them.',
                'Wrap the facets in `Stack` with `wrap`. On a narrow screen they flow onto new lines instead of overflowing (WCAG 1.4.10, AA).',
              ],
              render: <FacetStep />,
              code: `// The shape of the state. An empty value means 'not filtering'.
const NO_FILTERS = { query: '', status: '', region: '', returnsOnly: false };

// A row stays only if it passes every active filter.
function applyFilters(orders, f) {
  const q = f.query.trim().toLowerCase();
  return orders.filter(
    (o) =>
      (!q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)) &&
      (!f.status || o.status === f.status) &&
      (!f.region || o.region === f.region) &&
      (!f.returnsOnly || o.returned),
  );
}

function Facets({ orders }) {
  const [filters, setFilters] = useState(NO_FILTERS);
  // One setter for every facet: copy the object, change one key.
  const setFilter = (key, value) => setFilters({ ...filters, [key]: value });
  const matches = applyFilters(orders, filters);

  return (
    <Stack gap={3}>
      <div role="search" aria-label="Filter orders">
        {/* wrap: the controls flow onto new lines on a narrow screen. */}
        <Stack direction="horizontal" gap={4} align="end" wrap>
          <Select
            label="Status"
            emptyLabel="All statuses"
            options={STATUSES.map((s) => ({ value: s, label: s }))}
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
          />
          <Checkbox
            label="Only orders with a return"
            checked={filters.returnsOnly}
            onChange={(e) => setFilter('returnsOnly', e.target.checked)}
          />
        </Stack>
      </div>
      <Text role="status">{summarize(matches.length, 1, matches.length)}</Text>
    </Stack>
  );
}`,
            },
            {
              title: '3. Chips for the active filters',
              when: 'The user must see what is set and undo one filter at a time.',
              explain: [
                'Users forget what they set. One removable `Chip` per active filter keeps the state visible (Nielsen heuristic 6, recognition rather than recall).',
                '`removeLabel="Remove filter"` builds the button name "Remove filter Status: Shipped". A bare "Remove" or "×" does not tell a screen reader user which filter goes (WCAG 4.1.2, A).',
                '`Stack as="ul"` with `wrap` makes a real list that flows onto new lines when there are many chips. "Clear all" is the last item.',
                'Pressing a chip button deletes that button. The handler moves focus to the search field; without it, a keyboard user would restart from the top of the page (WCAG 2.4.3, A).',
                '`notice` says what happened: "Removed filter Region, Asia." The status region reads it aloud, so a blind user knows the click worked.',
              ],
              render: <ChipsStep />,
              code: `// One chip per active filter. 'name: value' is the visible text.
function activeChips(f) {
  const chips = [];
  if (f.query.trim()) chips.push({ key: 'query', name: 'Search', value: f.query.trim() });
  if (f.status) chips.push({ key: 'status', name: 'Status', value: f.status });
  if (f.region) chips.push({ key: 'region', name: 'Region', value: f.region });
  if (f.returnsOnly) chips.push({ key: 'returnsOnly', name: 'Returns', value: 'Only orders with a return' });
  return chips;
}

function ActiveFilters() {
  const search = useRef(null);
  const [filters, setFilters] = useState({ ...NO_FILTERS, status: 'Shipped', region: 'Asia' });
  const [notice, setNotice] = useState('');
  const chips = activeChips(filters);

  const remove = (chip) => {
    // Put the removed key back to its 'not filtering' value.
    setFilters({ ...filters, [chip.key]: NO_FILTERS[chip.key] });
    setNotice('Removed filter ' + chip.name + ', ' + chip.value + '.');
    // The chip's button no longer exists. Keep the keyboard on the page.
    search.current?.focus();
  };
  const clearAll = () => {
    setFilters(NO_FILTERS);
    setNotice('Filters cleared.');
    search.current?.focus();
  };

  return (
    <Stack gap={3}>
      <TextField ref={search} type="search" label="Search orders"
        value={filters.query}
        onChange={(event) => setFilters({ ...filters, query: event.target.value })} />

      {chips.length > 0 ? (
        <Stack as="ul" direction="horizontal" gap={2} align="center" wrap aria-label="Active filters">
          {chips.map((chip) => (
            <li key={chip.key}>
              {/* Button name: 'Remove filter Status: Shipped' */}
              <Chip variant="removable" removeLabel="Remove filter" onRemove={() => remove(chip)}>
                {chip.name + ': ' + chip.value}
              </Chip>
            </li>
          ))}
          <li><Button variant="tertiary" onClick={clearAll}>Clear all</Button></li>
        </Stack>
      ) : (
        // Only here so this demo can be repeated.
        <Button variant="tertiary" onClick={() => setFilters({ ...NO_FILTERS, status: 'Shipped', region: 'Asia' })}>
          Set the filters again
        </Button>
      )}

      <Text role="status">{notice}</Text>
    </Stack>
  );
}`,
            },
            {
              title: '4. The count, read aloud',
              when: 'You write the sentence that tells the user how many results are left.',
              explain: [
                'State the range and the total: "Showing 1–25 of 1,342 results". The user sees how much is hidden by the page (Nielsen heuristic 1).',
                'Write the one-result and no-result cases as their own sentences. "Showing 1–1 of 1 results" reads wrong, and a screen reader says it aloud.',
                '`toLocaleString` adds the thousands separator for the reader\'s language. Pass the locale from your app instead of the fixed `en-US` in a translated product.',
                'Put the sentence in `role="status"` (WCAG 4.1.3, AA). Change the demo\'s select to hear the three forms.',
              ],
              render: <CountStep />,
              code: `const format = (n) => n.toLocaleString('en-US');

// first and last are the 1-based positions of the rows on this page.
function summarize(total, first, last) {
  if (total === 0) return 'No results';
  if (total === 1) return 'Showing 1 of 1 result';
  return 'Showing ' + format(first) + '–' + format(last) + ' of ' + format(total) + ' results';
}

// A status region: a screen reader reads new text here without moving focus.
<Text role="status">{summarize(total, first, last)}</Text>`,
            },
            {
              title: '5. Pages that agree with the count',
              when: 'The result set is longer than one page.',
              explain: [
                '`Pagination` takes `page` and `pageCount`, and `onPageChange` gives the new page number. You hold `page` in state.',
                '`status` is a short text that a screen reader reads when the page changes: "Page 2 of 5". The count above says "Showing 11–20 of 42 results". Both come from the same `page`, so they never disagree.',
                'Reset `page` to 1 whenever a filter changes (see `setFilter` in the whole pattern). A user on page 5 who narrows the list to 12 rows would otherwise see an empty page.',
                'Hide the pager when `pageCount` is 1. One page needs no controls.',
              ],
              render: <PagerStep />,
              code: `const [page, setPage] = useState(1);
const pageSize = 10;
const pageCount = Math.ceil(total / pageSize);
const first = (page - 1) * pageSize + 1;
const last = Math.min(total, first + pageSize - 1);

// ...in the JSX:
<Text role="status">{summarize(total, first, last)}</Text>

{pageCount > 1 && (
  <Pagination
    label="Orders pages"
    page={page}
    pageCount={pageCount}
    onPageChange={setPage}
    // Read aloud when the page changes.
    status={'Page ' + page + ' of ' + pageCount}
  />
)}

// And in every filter handler: go back to the first page.
// setPage(1);`,
            },
            {
              title: '6. Wait for the user to pause (debounce)',
              when: 'Each keystroke would send a request to a server.',
              explain: [
                'An effect starts a 400 ms timer after each change. The cleanup function `clearTimeout` cancels it when the next keystroke arrives. Only a pause lets the timer finish.',
                '250 to 400 ms is the usual range: shorter sends too many requests, longer feels slow.',
                'The field value updates at once. Only the request waits, so typing never lags.',
                'Type "shirt" fast in the demo: one request is sent, not five. A Select changes in one step, so it needs no wait of its own. In the filter demo above the facets still share the same 300 ms wait, so one request covers several quick changes.',
              ],
              render: <DebounceStep />,
              code: `const [query, setQuery] = useState('');

useEffect(() => {
  if (query === '') return;
  // Start the wait.
  const timer = setTimeout(() => {
    sendRequest(query); // your fetch
  }, 400);
  // Runs before the next change: cancel the old wait. This is the debounce.
  return () => clearTimeout(timer);
}, [query]);

<TextField
  type="search"
  label="Search orders"
  value={query}
  // The field shows each key at once; only the request waits.
  onChange={(event) => setQuery(event.target.value)}
/>`,
            },
            {
              title: '7. Keep the state in the URL',
              when: 'Back, reload and a shared link must bring the same view.',
              explain: [
                'The user opens an order, presses Back, and expects the same filters (Nielsen heuristic 3, user control and freedom). State that lives only in memory is lost.',
                '`toSearchParams` turns the filters and the page into `q=shirt&status=Shipped&page=2`. Write that string to the address with your router, for example `navigate("?" + params)`.',
                '`fromSearchParams` does the reverse on load. Pass its result as the first value of your `useState`.',
                'Leave empty filters out of the string. A clean address means "no filters".',
                'The pattern imports no router. You choose how to push the string. Change a control in the demo and watch the address.',
              ],
              render: <UrlStep />,
              lang: 'ts',
              code: `// Write side: filters and page -> '?q=shirt&status=Shipped&page=2'
function toSearchParams(f, page) {
  const params = new URLSearchParams();
  // Only set what is active, so an unfiltered view has a clean address.
  if (f.query.trim()) params.set('q', f.query.trim());
  if (f.status) params.set('status', f.status);
  if (f.region) params.set('region', f.region);
  if (f.returnsOnly) params.set('returns', '1');
  if (page > 1) params.set('page', String(page));
  return params;
}

// Read side: the address -> filters and page. Missing keys mean 'not filtering'.
function fromSearchParams(params) {
  return {
    filters: {
      query: params.get('q') ?? '',
      status: params.get('status') ?? '',
      region: params.get('region') ?? '',
      returnsOnly: params.get('returns') === '1',
    },
    // Math.max: a hand-edited '?page=-3' still gives page 1.
    page: Math.max(1, Number(params.get('page')) || 1),
  };
}

// On load: start from the address.
const start = fromSearchParams(new URLSearchParams(location.search));
const [filters, setFilters] = useState(start.filters);
const [page, setPage] = useState(start.page);

// After each change settles: write the address with your router.
// navigate('?' + toSearchParams(filters, page).toString());`,
            },
          ],
        },
        {
          title: 'Every lifecycle state',
          kicker: 'Each example shows the part of the recipe that makes the state, and the live result. The demos use the list layout and five rows a page.',
          examples: [
            {
              title: 'Nothing: no orders exist',
              when: 'The account has no orders at all.',
              explain: [
                'Filtering is not the cause, so the words are first-use copy, and there is no "Clear filters" button (it would do nothing).',
                'Check `orders.length === 0` before you check the filters. Otherwise an empty list would show the "no match" message.',
                'The count reads "No orders yet", not "0 results", so the sentence is true.',
              ],
              render: <OrderFilters orders={[]} {...CELL} />,
              code: `const summary = orders.length === 0
  ? 'No orders yet'
  : summarize(matches.length, first, last);

const empty = orders.length === 0 ? (
  <EmptyState title="No orders yet" headingLevel={3}>
    Orders appear here after checkout.
  </EmptyState>
) : (
  /* ...the 'none' version, shown next... */
  null
);`,
            },
            {
              title: 'Loading: results are updating',
              when: 'A filter changed and the new rows have not arrived.',
              explain: [
                '`loading` on `Table` (or `List`) replaces the rows with skeleton rows (grey placeholders). `skeletonRows` sets how many, so the table keeps its height and nothing jumps.',
                'The old rows would be wrong for the new filters, so they are not shown as the answer.',
                'The count stays and a `Spinner` sits beside it. `aria-hidden` hides the spinner label, because the status region already speaks for the change.',
                '`loading` is `pending` (a debounce in progress) or a real request in flight.',
              ],
              render: <OrderFilters orders={ORDERS_30} initialFilters={SHIPPED} loading {...CELL} />,
              code: `// True while the debounce waits or your request runs.
const busy = pending || requestInFlight;

<Stack direction="horizontal" gap={3} align="center">
  <Text role="status">{summary}</Text>
  {busy && <Spinner size="sm" label="Updating results" showLabel aria-hidden="true" />}
</Stack>

<Table
  caption="Orders"
  hideCaption
  columns={columns}
  rows={rows}
  getRowId={(order) => order.id}
  loading={busy}
  // Same row count as a full page, so the table keeps its height.
  skeletonRows={5}
/>`,
            },
            {
              title: 'None: the filters match nothing',
              when: 'Filters are set and zero rows pass.',
              explain: [
                '"No results" is a dead end. The empty state names the filters and offers the removal that brings back the most rows, with its number: "Remove Status: Cancelled (3 orders)" (WCAG 3.3.3, AA).',
                '`relax` tries removing each active filter in turn, counts the rows, and picks the best. Filters that would still give zero rows are skipped.',
                'A second button, "Clear all filters", shows when two or more filters are active, or when no single removal helps.',
                'The count sentence above reads "No results" in the status region, so a screen reader hears the change.',
              ],
              render: <OrderFilters orders={ORDERS_11} initialFilters={{ ...NO_FILTERS, status: 'Cancelled', region: 'Americas' }} {...CELL} />,
              code: `const active = activeChips(applied.filters);

// For each active filter: how many rows would we get without it?
const relax = active
  .map((chip) => ({
    chip,
    count: applyFilters(orders, { ...applied.filters, [chip.key]: NO_FILTERS[chip.key] }).length,
  }))
  .filter((option) => option.count > 0)       // skip removals that still give nothing
  .sort((a, b) => b.count - a.count)[0];      // the best one first

const empty = (
  <EmptyState
    title="No orders match these filters"
    headingLevel={3}
    actions={
      <>
        {relax && (
          <Button onClick={() => remove(relax.chip)}>
            Remove {relax.chip.name}: {relax.chip.value} ({relax.count} orders)
          </Button>
        )}
        {(active.length > 1 || !relax) && (
          <Button variant="secondary" onClick={clearAll}>Clear all filters</Button>
        )}
      </>
    }
  >
    {active.map((chip) => chip.name + ': ' + chip.value).join(' and ')}{' '}
    {active.length > 1 ? 'match no orders together.' : 'matches no orders.'}
  </EmptyState>
);`,
            },
            {
              title: 'One: a single result',
              when: 'Exactly one row passes.',
              explain: [
                'The count reads "Showing 1 of 1 result": the singular is right, and "1–1" is gone.',
                'There is no pager, because `pageCount` is 1. The layout still holds with one row.',
              ],
              render: <OrderFilters orders={ORDERS_11} initialFilters={{ ...NO_FILTERS, query: 'ORD-1004' }} {...CELL} />,
              code: `function summarize(total, first, last) {
  if (total === 0) return 'No results';
  // Its own sentence: not 'Showing 1–1 of 1 results'.
  if (total === 1) return 'Showing 1 of 1 result';
  return 'Showing ' + first + '–' + last + ' of ' + total + ' results';
}

// pageCount is 1, so no pager is drawn.
{pageCount > 1 && <Pagination /* ... */ />}`,
            },
            {
              title: 'Some: a filtered page',
              when: 'A few rows pass and fit on one or two pages.',
              explain: [
                'The chip, the count and the pager describe the same set. All three come from `applied.filters`, so they cannot disagree.',
                'Slice the matching rows for the current page: `matches.slice(first - 1, first - 1 + pageSize)`.',
                '`Math.min(applied.page, pageCount)` keeps the page valid if the set shrank while the user waited.',
              ],
              render: <OrderFilters orders={ORDERS_30} initialFilters={SHIPPED} {...CELL} />,
              code: `const matches = applyFilters(orders, applied.filters);
const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
// Never past the last page, even if the set just shrank.
const current = Math.min(applied.page, pageCount);
const first = (current - 1) * pageSize + 1;
const rows = matches.slice(first - 1, first - 1 + pageSize);`,
            },
            {
              title: 'Too many: a very long result',
              when: 'More than about 1,000 rows pass.',
              explain: [
                'Show the total ("1,342 results"), the pager, and a prompt: "That is a long list. Add a filter to narrow it." Nobody scrolls 1,342 rows.',
                'The prompt is plain `Text` with a muted tone, not a warning. Nothing is wrong; the user is just invited to narrow down.',
                'Number formatting with a thousands separator keeps long totals easy to read.',
              ],
              render: <OrderFilters orders={ORDERS_MANY} {...CELL} />,
              code: `{matches.length > 1000 && (
  <Text tone="muted">That is a long list. Add a filter to narrow it.</Text>
)}`,
            },
            {
              title: 'Incorrect: the request failed',
              when: 'The server did not answer.',
              explain: [
                'The table\'s `error` prop shows your message inside the table frame, with `role="alert"` so it is announced at once.',
                'Say that the filters are kept, and offer "Try again". The user did nothing wrong, so they should not have to start over (Nielsen heuristic 9).',
                'Do not show the empty state here. "No orders match" would be false: rows may exist.',
              ],
              render: <OrderFilters orders={ORDERS_30} initialFilters={SHIPPED} failed {...CELL} />,
              code: `const error = (
  <Stack gap={3} align="start">
    <Text>We could not load the orders. Your filters are kept.</Text>
    <Button variant="secondary" onClick={retry}>Try again</Button>
  </Stack>
);

<Table
  /* ...columns, rows... */
  // Shown instead of the rows. The filters above stay as they are.
  error={failed ? error : undefined}
/>`,
            },
            {
              title: 'Done: the filters were cleared',
              when: 'The user pressed "Clear all" or removed a chip.',
              explain: [
                'The status region says what changed first, then the count: "Filters cleared. Showing 1–5 of 30 results". A blind user learns the click worked and what it did.',
                'A new filter change sets `notice` back to an empty string, so a stale message never hangs on.',
                'Focus moved to the search field in the handler, so the keyboard user is not lost.',
              ],
              render: <OrderFilters orders={ORDERS_30} initialNotice="Filters cleared." {...CELL} />,
              code: `const clearAll = () => {
  setFilters(NO_FILTERS);
  setPage(1);
  // Said first, before the new count.
  setNotice('Filters cleared.');
  search.current?.focus();
};

<Text role="status">
  {notice} {summarize(matches.length, first, last)}
</Text>`,
            },
          ],
        },
        {
          title: 'Content cases',
          kicker: 'Long names, small screens and other languages.',
          examples: [
            {
              title: 'A long chip label',
              when: 'A filter value is long, such as a full name.',
              explain: [
                '`Chip` caps its width and cuts the visible text with an ellipsis. The full text stays in the accessible name, and a tooltip shows it on hover.',
                'The remove button name still holds the whole value: "Remove filter Customer: Maria del Carmen …". A screen reader user hears everything.',
                'Do not shorten the value yourself. The chip handles it.',
              ],
              frame: 'narrow',
              render: SHIPPED_ASIA_CHIPS,
              code: `<Stack as="ul" direction="horizontal" gap={2} align="center" wrap aria-label="Active filters">
  <li>
    {/* No truncation code: the Chip cuts the label and adds a tooltip. */}
    <Chip variant="removable" removeLabel="Remove filter" onRemove={removeCustomer}>
      Customer: Maria del Carmen Guadalupe de los Santos Fernandez-Villalobos
    </Chip>
  </li>
</Stack>`,
            },
            {
              title: 'A phone screen',
              when: 'The view is 320 CSS pixels wide.',
              explain: [
                'Use `List` with `ListItem` instead of a wide `Table`. Each order becomes a row with a title, a description and a status badge.',
                'The controls wrap onto new lines. Nothing scrolls sideways (WCAG 1.4.10 Reflow, AA).',
                'Choose the layout from the width of the container, not the device. A side panel on a desktop can also be narrow.',
              ],
              frame: 'phone',
              render: <OrderFilters orders={ORDERS_30} initialFilters={SHIPPED} pageSize={3} delayMs={0} results="list" />,
              code: `<List aria-label="Orders" divided loading={busy} skeletonRows={3} empty={empty} error={error}>
  {rows.map((order) => (
    <ListItem
      key={order.id}
      title={order.id}
      description={order.customer + ' · ' + order.region + ' · $' + order.total}
      trailing={<Badge status={STATUS_BADGE[order.status]}>{order.status}</Badge>}
    />
  ))}
</List>`,
            },
            {
              title: 'Another language',
              when: 'The product is translated.',
              explain: [
                'Pass every string from your translation function: the labels, the chip text, the count sentence and `removeLabel`.',
                '`removeLabel="Retirer le filtre"` builds the button name "Retirer le filtre Statut : Expédiée". Words before the label come from you; the chip adds the label.',
                'Format numbers with the page locale (`toLocaleString("fr-CA")`). French uses a space before the thousands: "1 342".',
                'Set `lang="fr"` on the wrapper (WCAG 3.1.2 Language of Parts, AA), so a screen reader uses a French voice for that part. Set `lang` on the `<html>` element too (WCAG 3.1.1, A).',
              ],
              render: (
                <Stack gap={3} lang="fr">
                  <Stack as="ul" direction="horizontal" gap={2} align="center" wrap aria-label="Filtres actifs">
                    <li><Chip variant="removable" removeLabel="Retirer le filtre">Statut : Expédiée</Chip></li>
                    <li><Button variant="tertiary">Tout effacer</Button></li>
                  </Stack>
                  <Text role="status">Affichage de 1 à 25 sur 1 342 résultats</Text>
                </Stack>
              ),
              code: `<Stack gap={3} lang="fr">
  <Stack as="ul" direction="horizontal" gap={2} align="center" wrap aria-label={t('filters.active')}>
    <li>
      {/* Button name: 'Retirer le filtre Statut : Expédiée' */}
      <Chip variant="removable" removeLabel={t('filters.remove')} onRemove={removeStatus}>
        {t('filters.status') + ' : ' + t('status.shipped')}
      </Chip>
    </li>
    <li><Button variant="tertiary" onClick={clearAll}>{t('filters.clearAll')}</Button></li>
  </Stack>

  {/* Format the numbers with the page locale. */}
  <Text role="status">
    {t('filters.count', { first: 1, last: 25, total: total.toLocaleString('fr-CA') })}
  </Text>
</Stack>`,
            },
          ],
        },
      ]}
    />
  ),
};
