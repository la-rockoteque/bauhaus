import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../test/render';
import type { MentionPoolUser } from '../../../data/types';

// The page is asynchronous now, so the list can change WITHOUT a keystroke: the debounced
// request lands and replaces it. These cases drive CommentInput itself and control when each
// page resolves, because the defects they guard live in the composer, not in the popover.
//
// The strings are French: the product speaks French, and renderWithProviders uses the fr-CA
// bundle, as the other tests in this folder do.

vi.mock('../../../api/users', () => ({
  fetchMentionPool: vi.fn(),
}));

vi.mock('../../../auth', () => ({
  useCan: () => true,
  Permissions: {
    comments: { create: 'comments:create', deleteAny: 'comments:delete-any', editAny: 'comments:edit-any' },
  },
}));

import { fetchMentionPool } from '../../../api/users';
import { RequisitionCommentComposer } from '../../../test/commentComposer';

const user = (oid: string, displayName: string): MentionPoolUser => ({
  entraOid: oid,
  displayName,
  email: `${displayName.toLowerCase().replace(/[^a-z]/g, '')}@moreau.ca`,
});

const ZOE = user('oid-zoe', 'Tremblay Zoe');
const BERNARD = user('oid-bernard', 'Bernard Latrembleur');
const MARC = user('oid-marc', 'Marc Tremper');

/** A promise the test resolves by hand, so the settling window stays open as long as it needs. */
const deferred = <T,>() => {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('CommentInput — the page is asynchronous', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not send the comment when Enter falls inside the settling window', async () => {
    // The defect: Enter was consumed only when the filtered list had rows. While the page was
    // still on its way the list was empty, so Enter fell through and posted the comment with
    // the "@trem" text and no mention at all — and cleared the draft the user needed.
    const pending = deferred<MentionPoolUser[]>();
    vi.mocked(fetchMentionPool).mockReturnValue(pending.promise);
    const onSubmit = vi.fn();
    const { user: ui } = renderWithProviders(
      <RequisitionCommentComposer onSubmit={onSubmit} />,
    );

    const textarea = screen.getByRole('textbox');
    await ui.type(textarea, 'Bonjour @trem');
    await screen.findByText('Recherche…');

    await ui.keyboard('{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('Bonjour @trem');

    // Once the page answers, the same key picks the colleague.
    pending.resolve([ZOE]);
    await screen.findByText('Tremblay Zoe');
    await ui.keyboard('{Enter}');
    await waitFor(() => {
      expect(textarea).toHaveValue('Bonjour @Tremblay Zoe');
    });
  });

  it('keeps the highlight on the colleague when a later page reorders the list', async () => {
    // The defect: the highlight was a bare index. The trigger key does not change when the
    // debounced page lands, so index 1 silently moved from one person to another and Enter
    // notified the wrong colleague.
    const first = deferred<MentionPoolUser[]>();
    const second = deferred<MentionPoolUser[]>();
    vi.mocked(fetchMentionPool)
      .mockReturnValueOnce(first.promise)
      .mockReturnValue(second.promise);

    const onSubmit = vi.fn();
    const { user: ui } = renderWithProviders(
      <RequisitionCommentComposer onSubmit={onSubmit} />,
    );

    const textarea = screen.getByRole('textbox');
    await ui.type(textarea, '@trem');

    first.resolve([ZOE, BERNARD]);
    await screen.findByText('Bernard Latrembleur');

    // The user highlights the second option.
    await ui.keyboard('{ArrowDown}');

    // A later page for the same trigger inserts a row ABOVE the highlighted colleague.
    second.resolve([ZOE, MARC, BERNARD]);
    await screen.findByText('Marc Tremper');

    await ui.keyboard('{Enter}');

    await waitFor(() => {
      expect(textarea).toHaveValue('@Bernard Latrembleur');
    });
  });

  it('does not claim that nobody matches when the search fails', async () => {
    // The defect: a rejected query coerced to an empty page, so the popover told the user that
    // no colleague carries that name. The colleague exists; the search is down.
    vi.mocked(fetchMentionPool).mockRejectedValue(new Error('500'));
    const { user: ui } = renderWithProviders(
      <RequisitionCommentComposer onSubmit={vi.fn()} />,
    );

    await ui.type(screen.getByRole('textbox'), '@trem');

    await screen.findByText('La recherche est indisponible. Réessayez.');
    expect(screen.queryByText('Aucun collègue ne correspond à ce nom.')).not.toBeInTheDocument();
  });

  it('reopens the popover when the user returns to a term dismissed with Escape', async () => {
    // The defect: the dismissal was keyed by the term text and never cleared, so backspacing
    // back to a term the user once dismissed shut the popover again, with nothing on screen
    // to explain it.
    vi.mocked(fetchMentionPool).mockResolvedValue([BERNARD]);
    const { user: ui } = renderWithProviders(
      <RequisitionCommentComposer onSubmit={vi.fn()} />,
    );

    const textarea = screen.getByRole('textbox');
    await ui.type(textarea, '@trem');
    await screen.findByText('Bernard Latrembleur');

    await ui.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    // Type on, then come back to the dismissed term.
    await ui.type(textarea, 'b');
    await screen.findByRole('listbox');
    await ui.keyboard('{Backspace}');

    expect(textarea).toHaveValue('@trem');
    await screen.findByRole('listbox');
  });
});

