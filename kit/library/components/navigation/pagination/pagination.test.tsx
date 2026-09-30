import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { forwardRef, useState, type AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination, type PaginationProps } from './pagination';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

const setup = (props: Partial<PaginationProps> = {}) => {
  const onPageChange = vi.fn();
  const utils = render(<Pagination label="Pagination" page={3} pageCount={12} onPageChange={onPageChange} {...props} />);
  return { onPageChange, ...utils };
};
const labels = () => Array.from(screen.getByRole('list').children).map((li) => li.textContent);

describe('Pagination structure', () => {
  it('is a named nav landmark holding a list', () => {
    setup();
    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(within(nav).getByRole('list')).toBeTruthy();
  });

  it('shows the total as given', () => {
    setup({ total: '51–75 of 1,342' });
    expect(screen.getByText('51–75 of 1,342')).toBeTruthy();
  });

  it('marks only the current page with aria-current="page" and gives every page a name', () => {
    setup();
    const current = document.querySelectorAll('[aria-current]');
    expect(current).toHaveLength(1);
    expect(current[0].getAttribute('aria-current')).toBe('page');
    expect(current[0].textContent).toBe('3');
    expect(screen.getByRole('button', { name: 'Page 4' })).toBeTruthy();
  });

  it('takes the text of the controls from props', () => {
    setup({ previousLabel: 'Précédent', nextLabel: 'Suivant', pageLabel: (n) => `Page ${n} sur 12`, label: 'Pagination des résultats' });
    expect(screen.getByRole('button', { name: 'Précédent' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Suivant' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Page 5 sur 12' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Pagination des résultats' })).toBeTruthy();
  });
});

describe('Pagination range', () => {
  it('lists every page when they fit', () => {
    setup({ page: 2, pageCount: 6 });
    expect(labels()).toEqual(['Previous', '1', '2', '3', '4', '5', '6', 'Next']);
  });

  it('collapses the far end behind an ellipsis near the start', () => {
    setup({ page: 1, pageCount: 54 });
    expect(labels()).toEqual(['Previous', '1', '2', '3', '4', '5', '…', '54', 'Next']);
  });

  it('collapses both ends in the middle', () => {
    setup({ page: 30, pageCount: 54 });
    expect(labels()).toEqual(['Previous', '1', '…', '29', '30', '31', '…', '54', 'Next']);
  });

  it('collapses the near end near the last page', () => {
    setup({ page: 54, pageCount: 54 });
    expect(labels()).toEqual(['Previous', '1', '…', '50', '51', '52', '53', '54', 'Next']);
  });

  it('hides the ellipsis from assistive technology', () => {
    setup({ page: 30, pageCount: 54 });
    const gaps = document.querySelectorAll('.ds-pagination__gap');
    expect(gaps).toHaveLength(2);
    gaps.forEach((gap) => expect(gap.getAttribute('aria-hidden')).toBe('true'));
  });

  it('shows more siblings when asked', () => {
    setup({ page: 30, pageCount: 54, siblings: 2 });
    expect(labels()).toEqual(['Previous', '1', '…', '28', '29', '30', '31', '32', '…', '54', 'Next']);
  });
});

describe('Pagination boundaries', () => {
  it('disables previous on page 1 and keeps it focusable', () => {
    const { onPageChange } = setup({ page: 1 });
    const previous = screen.getByRole('button', { name: 'Previous' });
    expect(previous.getAttribute('aria-disabled')).toBe('true');
    act(() => previous.focus());
    expect(document.activeElement).toBe(previous);
    fireEvent.click(previous);
    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Next' }).hasAttribute('aria-disabled')).toBe(false);
  });

  it('disables next on the last page', () => {
    const { onPageChange } = setup({ page: 12 });
    const next = screen.getByRole('button', { name: 'Next' });
    expect(next.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(next);
    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Previous' }).hasAttribute('aria-disabled')).toBe(false);
  });

  it('clamps a page outside the range', () => {
    setup({ page: 99, pageCount: 5 });
    expect(document.querySelector('[aria-current]')?.textContent).toBe('5');
    document.body.innerHTML = '';
    setup({ page: -4, pageCount: 5 });
    expect(document.querySelector('[aria-current]')?.textContent).toBe('1');
  });

  it('hides the page list for one page and keeps the total and the select', () => {
    setup({ pageCount: 1, page: 1, total: '1–12 of 12', pageSize: { label: 'Rows per page', value: 25, options: [10, 25], onChange: vi.fn() } });
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('1–12 of 12')).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Rows per page' })).toBeTruthy();
  });

  it('hides the page list for zero pages', () => {
    setup({ pageCount: 0, page: 1, total: '0 results' });
    expect(screen.queryByRole('list')).toBeNull();
  });
});

describe('Pagination behaviour', () => {
  it('calls onPageChange with the clicked page, previous and next', () => {
    const { onPageChange } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Page 5' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange.mock.calls).toEqual([[5], [2], [4]]);
  });

  it('keeps focus on the same control across a page change', () => {
    function Harness() {
      const [page, setPage] = useState(3);
      return <Pagination label="Pagination" page={page} pageCount={12} onPageChange={setPage} />;
    }
    render(<Harness />);
    const next = screen.getByRole('button', { name: 'Next' });
    act(() => next.focus());
    fireEvent.click(next);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Next' }));
    expect(document.querySelector('[aria-current]')?.textContent).toBe('4');
  });

  it('announces the page change in a polite status region', () => {
    setup({ status: 'Page 3 of 12' });
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('Page 3 of 12');
  });

  it('renders no status region without a status', () => {
    setup();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('reports a page-size choice from a native select with a visible label', () => {
    const onChange = vi.fn();
    setup({ pageSize: { label: 'Rows per page', value: 25, options: [10, 25, 50], onChange } });
    const select = screen.getByRole('combobox', { name: 'Rows per page' });
    expect(select.tagName).toBe('SELECT');
    expect((select as HTMLSelectElement).value).toBe('25');
    fireEvent.change(select, { target: { value: '50' } });
    expect(onChange).toHaveBeenCalledWith(50);
  });
});

describe('Pagination link mode', () => {
  it('renders pages as links to getHref, with previous and next', () => {
    setup({ getHref: (n) => `/orders?page=${n}` });
    expect(screen.getByRole('link', { name: 'Page 4' }).getAttribute('href')).toBe('/orders?page=4');
    expect(screen.getByRole('link', { name: 'Previous' }).getAttribute('href')).toBe('/orders?page=2');
    expect(screen.getByRole('link', { name: 'Next' }).getAttribute('href')).toBe('/orders?page=4');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('marks the current link and drops the href of a disabled end', () => {
    setup({ page: 1, getHref: (n) => `/p/${n}` });
    expect(screen.getByRole('link', { name: 'Page 1' }).getAttribute('aria-current')).toBe('page');
    expect(screen.queryByRole('link', { name: 'Previous' })).toBeNull();
  });

  it('renders the router link passed in linkAs', () => {
    const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>((props, ref) => <a ref={ref} data-router="yes" {...props} />);
    setup({ getHref: (n) => `/p/${n}`, linkAs: RouterLink });
    expect(screen.getByRole('link', { name: 'Page 2' }).getAttribute('data-router')).toBe('yes');
  });
});

describe('Pagination accessibility', () => {
  it('has no axe violations as buttons, as links, at the ends, with the select and on one page', async () => {
    const size = { label: 'Rows per page', value: 25, options: [10, 25, 50], onChange: vi.fn() };
    const { container } = render(
      <>
        <Pagination label="One" page={3} pageCount={12} total="51–75 of 1,342" pageSize={size} status="Page 3 of 12" />
        <Pagination label="Two" page={1} pageCount={54} getHref={(n) => `/p/${n}`} />
        <Pagination label="Three" page={54} pageCount={54} />
        <Pagination label="Four" page={1} pageCount={1} total="1–12 of 12" pageSize={size} />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('Pagination page class', () => {
  it('adds the class from pageClassName to that page control only', () => {
    setup({ pageClassName: (page) => (page === 2 ? 'is-forced' : undefined) });
    expect(screen.getByRole('button', { name: 'Page 2' }).classList.contains('is-forced')).toBe(true);
    expect(screen.getByRole('button', { name: 'Page 1' }).classList.contains('is-forced')).toBe(false);
  });
});
