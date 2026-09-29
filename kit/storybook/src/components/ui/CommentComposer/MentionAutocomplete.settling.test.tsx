import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../test/render';
import { MentionAutocomplete } from './MentionAutocomplete';
import type { MentionOption } from './mentionSource';

// QA plan case AC3-5 — the popover must not flash an empty list between two keystrokes.
//
// The server searches and the client debounces the term by 200 ms, so the page answers the
// PREVIOUS term while the user reads the live one. The filtered list is then empty because the
// answer did not arrive, not because no colleague matches. The two states must not look the same:
// if they do, a user who types fast reads "no match" for a name that exists.
//
// Case AC3-6 — a term that truly matches nobody still shows a real empty state.
//
// The strings are French: the product speaks French, and renderWithProviders uses the fr-CA
// bundle, as the other tests in this folder do.

const ALICE: MentionOption = {
  id: 'oid-alice',
  displayName: 'Alice Tremblay',
  email: 'alice.tremblay@moreau.ca',
};

const renderPopover = (props: Partial<Parameters<typeof MentionAutocomplete>[0]> = {}) =>
  renderWithProviders(
    <MentionAutocomplete
      query="zoe"
      pool={[]}
      selectedIndex={0}
      listId="mentions-test"
      onSelectIndex={vi.fn()}
      onPick={vi.fn()}
      {...props}
    />,
  );

describe('MentionAutocomplete — the settling state is not the empty state', () => {
  it('says it is searching while the page does not answer the live term', () => {
    renderPopover({ isSettling: true });

    expect(screen.getByText('Recherche…')).toBeInTheDocument();
    expect(screen.queryByText('Aucun collègue ne correspond à ce nom.')).not.toBeInTheDocument();
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
  });

  it('says that nobody matches once the page answers the live term', () => {
    renderPopover({ isSettling: false });

    expect(screen.getByText('Aucun collègue ne correspond à ce nom.')).toBeInTheDocument();
    expect(screen.queryByText('Recherche…')).not.toBeInTheDocument();
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'false');
  });

  it('treats a missing isSettling as settled, so the old callers keep their empty state', () => {
    renderPopover();

    expect(screen.getByText('Aucun collègue ne correspond à ce nom.')).toBeInTheDocument();
  });

  it('shows the options and no message when the page answers with a match', () => {
    renderPopover({ query: 'trem', pool: [ALICE], isSettling: true });

    expect(screen.getByRole('option', { name: /Alice Tremblay/ })).toBeInTheDocument();
    expect(screen.queryByText('Recherche…')).not.toBeInTheDocument();
    expect(screen.queryByText('Aucun collègue ne correspond à ce nom.')).not.toBeInTheDocument();
  });
});
