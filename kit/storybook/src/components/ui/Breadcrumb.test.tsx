import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { Breadcrumb } from './Breadcrumb';

/**
 * What the trail claims about where the user is — the half a screen reader hears, and the
 * half that decides whether the way back still works while the page is still loading.
 */
describe('Breadcrumb', () => {
  const trail = [
    { label: 'Trackers', to: '/tracker' },
    { label: 'Aqueduc', to: '/tracker/1' },
    { label: 'Coffrage' },
  ];

  it('links every rung that names a destination, and leaves the page itself as text', () => {
    renderWithProviders(<Breadcrumb label="Fil d'Ariane" items={trail} />);

    expect(screen.getByRole('link', { name: 'Trackers' })).toHaveAttribute('href', '/tracker');
    expect(screen.getByRole('link', { name: 'Aqueduc' })).toHaveAttribute('href', '/tracker/1');
    expect(screen.queryByRole('link', { name: 'Coffrage' })).toBeNull();
  });

  it('marks the last rung as the current page', () => {
    renderWithProviders(<Breadcrumb label="Fil d'Ariane" items={trail} />);

    expect(screen.getByText('Coffrage')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Aqueduc' })).not.toHaveAttribute('aria-current');
  });

  it('is a named nav carrying one list item per rung, and no read separator', () => {
    renderWithProviders(<Breadcrumb label="Fil d'Ariane" items={trail} />);

    const nav = screen.getByRole('navigation', { name: "Fil d'Ariane" });

    expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
    // The chevrons are drawn, not read: the accessible name is the rungs and nothing else.
    expect(nav.textContent).toBe('TrackersAqueducCoffrage');
  });

  it('renders the rungs it has while the rest is still loading', () => {
    renderWithProviders(<Breadcrumb label="Fil d'Ariane" items={[trail[0]]} />);

    // The one rung is a link, not the current page: the way back never waits on the query.
    expect(screen.getByRole('link', { name: 'Trackers' })).toBeInTheDocument();
    expect(screen.queryByText('Coffrage')).toBeNull();
  });
});
