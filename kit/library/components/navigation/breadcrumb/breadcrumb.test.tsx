import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { describe, expect, it } from 'vitest';
import { Breadcrumb, type BreadcrumbItem } from './breadcrumb';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

const THREE: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: 'Supply', href: '/supply' }, { label: 'Requisition 4821', href: '/supply/4821' }];
const SEVEN: BreadcrumbItem[] = ['Home', 'Supply', 'Warehouses', 'Montreal', 'Aisle 12', 'Shelf C', 'Pallet 4821'].map((label) => ({ label, href: `/${label}` }));

describe('Breadcrumb', () => {
  it('is a named nav landmark holding an ordered list', () => {
    render(<Breadcrumb label="Breadcrumb" items={THREE} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const list = within(nav).getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders every crumb as a link to its href', () => {
    render(<Breadcrumb label="Breadcrumb" items={THREE} />);
    expect(screen.getByRole('link', { name: 'Supply' }).getAttribute('href')).toBe('/supply');
  });

  it('marks only the last item aria-current="page"', () => {
    render(<Breadcrumb label="Breadcrumb" items={THREE} />);
    const current = document.querySelectorAll('[aria-current]');
    expect(current).toHaveLength(1);
    expect(current[0].textContent).toBe('Requisition 4821');
    expect(current[0].getAttribute('aria-current')).toBe('page');
  });

  it('renders a last item with no href as text that is still current', () => {
    render(<Breadcrumb label="Breadcrumb" items={[THREE[0], { label: 'Here' }]} />);
    expect(screen.queryByRole('link', { name: 'Here' })).toBeNull();
    expect(screen.getByText('Here').getAttribute('aria-current')).toBe('page');
  });

  it('hides the separators from assistive technology and puts none after the last item', () => {
    const { container } = render(<Breadcrumb label="Breadcrumb" items={THREE} />);
    const separators = container.querySelectorAll('.ds-breadcrumb__separator');
    expect(separators).toHaveLength(2);
    separators.forEach((separator) => expect(separator.getAttribute('aria-hidden')).toBe('true'));
    expect(screen.getAllByRole('listitem')[2].querySelector('.ds-breadcrumb__separator')).toBeNull();
  });

  it('passes `linkAs` to every link', () => {
    const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>((props, ref) => <a ref={ref} data-router="yes" {...props} />);
    render(<Breadcrumb label="Breadcrumb" items={THREE} linkAs={RouterLink} />);
    screen.getAllByRole('link').forEach((link) => expect(link.getAttribute('data-router')).toBe('yes'));
  });
});

describe('Breadcrumb collapsed', () => {
  it('shows the first crumb, a "…" button and the last two crumbs when the path is too long', () => {
    render(<Breadcrumb label="Breadcrumb" items={SEVEN} />);
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['Home', 'Shelf C', 'Pallet 4821']);
    expect(screen.queryByRole('link', { name: 'Montreal' })).toBeNull();
    const button = screen.getByRole('button', { name: 'Show all levels' });
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('does not collapse a path at maxItems', () => {
    render(<Breadcrumb label="Breadcrumb" items={SEVEN.slice(0, 4)} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  it('keeps the last item current while collapsed', () => {
    render(<Breadcrumb label="Breadcrumb" items={SEVEN} />);
    expect(document.querySelector('[aria-current="page"]')?.textContent).toBe('Pallet 4821');
  });

  it('expands to the whole path, drops the button and moves focus to the first revealed crumb', () => {
    render(<Breadcrumb label="Breadcrumb" items={SEVEN} />);
    act(() => screen.getByRole('button', { name: 'Show all levels' }).focus());
    fireEvent.click(screen.getByRole('button', { name: 'Show all levels' }));
    expect(screen.getAllByRole('link')).toHaveLength(7);
    expect(screen.queryByRole('button')).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Supply' }));
  });

  it('takes the button name and the threshold as props', () => {
    render(<Breadcrumb label="Fil d'Ariane" items={SEVEN.slice(0, 5)} maxItems={3} expandLabel="Afficher tous les niveaux" />);
    expect(screen.getByRole('button', { name: 'Afficher tous les niveaux' })).toBeTruthy();
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['Home', 'Aisle 12']);
  });
});

describe('Breadcrumb accessibility', () => {
  it('has no axe violations complete, collapsed and expanded', async () => {
    const { container } = render(
      <>
        <Breadcrumb label="Path one" items={THREE} />
        <Breadcrumb label="Path two" items={SEVEN} />
        <Breadcrumb label="Path three" items={SEVEN} maxItems={9} />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
