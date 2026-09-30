import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NO_FILTERS, OrderFilters, activeChips, fromSearchParams, makeOrders, toSearchParams } from './filtering.stories';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';

const many = makeOrders(1342);
const small = makeOrders(11);
const status = () => screen.getAllByRole('status').find((el) => /Showing|No results|Removed|cleared/.test(el.textContent ?? ''))!;
const chipList = () => screen.queryByRole('list', { name: 'Active filters' });


describe('Filtering pattern', () => {
  it('announces the range and total in a status region', () => {
    render(<OrderFilters orders={many} delayMs={0} />);
    expect(status().textContent).toBe('Showing 1–25 of 1,342 results');
    expect(screen.getByText('That is a long list. Add a filter to narrow it.')).toBeTruthy();
  });

  it('applies a filter, shows a chip with a named remove button, and updates the count', async () => {
    render(<OrderFilters orders={many} delayMs={0} />);
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'Shipped');
    await waitFor(() => expect(status().textContent).toBe('Showing 1–25 of 336 results'));
    const chips = within(chipList()!);
    expect(chips.getByRole('button', { name: 'Remove filter: Status, Shipped' })).toBeTruthy();
    expect(chips.getByRole('button', { name: 'Clear all' })).toBeTruthy();
  });

  it('removes a chip, updates the count and says what changed', async () => {
    render(<OrderFilters orders={many} delayMs={0} initialFilters={{ ...NO_FILTERS, status: 'Shipped', region: 'Asia' }} />);
    const before = status().textContent;
    await userEvent.click(screen.getByRole('button', { name: 'Remove filter: Region, Asia' }));
    await waitFor(() => expect(status().textContent).not.toBe(before));
    expect(status().textContent).toBe('Removed filter Region, Asia. Showing 1–25 of 336 results');
    expect(screen.queryByRole('button', { name: 'Remove filter: Region, Asia' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove filter: Status, Shipped' })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByLabelText(/Search orders/));
  });

  it('clears all filters in one press', async () => {
    render(<OrderFilters orders={many} delayMs={0} initialFilters={{ ...NO_FILTERS, status: 'Shipped', region: 'Asia' }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    await waitFor(() => expect(status().textContent).toBe('Filters cleared. Showing 1–25 of 1,342 results'));
    expect(chipList()).toBeNull();
  });

  it('says one result in the singular and hides the pager', () => {
    render(<OrderFilters orders={small} delayMs={0} initialFilters={{ ...NO_FILTERS, query: 'ORD-1004' }} />);
    expect(status().textContent).toBe('Showing 1 of 1 result');
    expect(screen.queryByRole('navigation', { name: 'Orders pages' })).toBeNull();
  });

  it('never dead-ends: names the filter to relax and removes it in one click', async () => {
    render(<OrderFilters orders={small} delayMs={0} initialFilters={{ ...NO_FILTERS, status: 'Cancelled', region: 'Americas' }} />);
    expect(status().textContent).toBe('No results');
    expect(screen.getByRole('heading', { name: 'No orders match these filters' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Remove Status: Cancelled (3 orders)' }));
    await waitFor(() => expect(status().textContent).toBe('Removed filter Status, Cancelled. Showing 1–3 of 3 results'));
    expect(screen.queryByRole('heading', { name: 'No orders match these filters' })).toBeNull();
  });

  it('reaches no results by typing, and keeps the search text', async () => {
    render(<OrderFilters orders={many} delayMs={0} />);
    await userEvent.type(screen.getByLabelText(/Search orders/), 'zzz');
    await waitFor(() => expect(status().textContent).toBe('No results'));
    expect(screen.getByRole('button', { name: 'Remove Search: zzz (1,342 orders)' })).toBeTruthy();
    expect((screen.getByLabelText(/Search orders/) as HTMLInputElement).value).toBe('zzz');
  });

  it('shows the first-use empty state when no orders exist', () => {
    render(<OrderFilters orders={[]} delayMs={0} />);
    expect(screen.getByRole('heading', { name: 'No orders yet' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Clear all filters' })).toBeNull();
  });

  it('shows a busy cue while results update, then settles', async () => {
    render(<OrderFilters orders={many} delayMs={30} />);
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'Shipped');
    expect(screen.getByText('Updating results')).toBeTruthy();
    await waitFor(() => expect(screen.queryByText('Updating results')).toBeNull());
  });

  it('reports the settled state through onStateChange, and the URL helpers round-trip it', async () => {
    const onStateChange = vi.fn();
    render(<OrderFilters orders={many} delayMs={0} onStateChange={onStateChange} />);
    await userEvent.selectOptions(screen.getByLabelText('Region'), 'Asia');
    await waitFor(() => expect(onStateChange).toHaveBeenCalled());
    const [filters, page] = onStateChange.mock.calls.at(-1)!;
    const params = toSearchParams(filters, 2);
    expect(params.toString()).toBe('region=Asia&page=2');
    expect(fromSearchParams(params)).toEqual({ filters, page: 2 });
    expect(activeChips(filters)).toHaveLength(1);
  });

  it('shows a retry when the request failed, and keeps the filters', async () => {
    render(<OrderFilters orders={many} delayMs={0} initialFilters={{ ...NO_FILTERS, status: 'Shipped' }} failed />);
    expect(screen.getByRole('alert').textContent).toContain('Your filters are kept');
    expect(screen.getByRole('button', { name: 'Remove filter: Status, Shipped' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders the list layout for a narrow container', () => {
    render(<OrderFilters orders={small} delayMs={0} results="list" pageSize={5} />);
    expect(screen.getByRole('list', { name: 'Orders' })).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('has no axe violations: with results, with no results, failed', async () => {
    const { container, rerender } = render(<OrderFilters orders={small} delayMs={0} initialFilters={{ ...NO_FILTERS, status: 'Shipped' }} />);
    await expectNoAxeViolations(container);
    rerender(<OrderFilters orders={small} delayMs={0} initialFilters={{ ...NO_FILTERS, query: 'zzz' }} />);
    await expectNoAxeViolations(container);
    rerender(<OrderFilters orders={small} delayMs={0} failed />);
    await expectNoAxeViolations(container);
  });
});
