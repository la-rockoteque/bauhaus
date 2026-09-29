import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../test/render';

// The pool is a bounded page that the server already ranked. The composer picks from that
// page and must write the offsets that the API validates against the body slice.
// vi.mock is hoisted, so the page lives inside the factory.
vi.mock('../../../api/users', () => ({
  fetchMentionPool: vi.fn().mockResolvedValue([
    { entraOid: 'oid-zoe', displayName: 'Tremblay, Zoe', email: 'zoe.tremblay@moreau.ca' },
    { entraOid: 'oid-bernard', displayName: 'Bernard Latrembleur', email: 'bernard.latrembleur@moreau.ca' },
  ]),
}));

vi.mock('../../../auth', () => ({
  useCan: () => true,
  Permissions: {
    comments: { create: 'comments:create', deleteAny: 'comments:delete-any', editAny: 'comments:edit-any' },
  },
}));

import { RequisitionCommentComposer } from '../../../test/commentComposer';

describe('CommentInput — the selection writes the mention (AC4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits the picked oid with the offsets that frame the literal', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(<RequisitionCommentComposer onSubmit={onSubmit} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Bonjour @trem');
    await screen.findByText('Tremblay, Zoe');

    // Enter picks the highlighted option, which is the first of the page the server ranked.
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(textarea).toHaveValue('Bonjour @Tremblay, Zoe');
    });

    await user.keyboard(' merci{Enter}');

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [body, mentions] = onSubmit.mock.calls[0];

    // The composer speaks its own shape; turning `id` into the requisition wire's
    // `mentionedUserEntraOid` is the panel's job — see `toRequisitionMentions`.
    expect(mentions).toEqual([
      { id: 'oid-zoe', displayName: 'Tremblay, Zoe', start: 8, end: 22 },
    ]);
    // The API rejects the mention when the slice does not equal "@" + the display name.
    expect(body.substring(8, 22)).toBe('@Tremblay, Zoe');
  });

  it('submits the option the arrow keys moved to, not the first of the page', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(<RequisitionCommentComposer onSubmit={onSubmit} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '@trem');
    await screen.findByText('Bernard Latrembleur');

    await user.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => {
      expect(textarea).toHaveValue('@Bernard Latrembleur');
    });

    await user.keyboard('{Enter}');

    const [body, mentions] = onSubmit.mock.calls[0];
    expect(mentions).toEqual([
      { id: 'oid-bernard', displayName: 'Bernard Latrembleur', start: 0, end: 20 },
    ]);
    expect(body.substring(0, 20)).toBe('@Bernard Latrembleur');
  });

  it('closes the popover on Escape and leaves the text as typed', async () => {
    const { user } = renderWithProviders(<RequisitionCommentComposer onSubmit={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Bonjour @trem');
    await screen.findByText('Tremblay, Zoe');

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Tremblay, Zoe')).not.toBeInTheDocument();
    });
    expect(textarea).toHaveValue('Bonjour @trem');
  });

  it('re-opens the popover when the user types on after Escape', async () => {
    const { user } = renderWithProviders(<RequisitionCommentComposer onSubmit={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Bonjour @trem');
    await screen.findByText('Tremblay, Zoe');
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Tremblay, Zoe')).not.toBeInTheDocument();
    });

    // The dismissal belongs to the term the user dismissed, not to the composer.
    await user.type(textarea, 'b');

    expect(await screen.findByText('Tremblay, Zoe')).toBeInTheDocument();
  });

  it('does not let Escape reach the panel that would close and discard the draft', async () => {
    // DiscussionPanel closes on a document-level Escape. The popover must consume the key
    // while it is open, or dismissing the suggestions throws the comment away.
    const onDocumentEscape = vi.fn();
    document.addEventListener('keydown', onDocumentEscape);

    try {
      const { user } = renderWithProviders(<RequisitionCommentComposer onSubmit={vi.fn()} />);
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Bonjour @trem');
      await screen.findByText('Tremblay, Zoe');

      onDocumentEscape.mockClear();
      await user.keyboard('{Escape}');

      expect(onDocumentEscape).not.toHaveBeenCalled();
      expect(textarea).toHaveValue('Bonjour @trem');

      // With the popover shut, Escape belongs to the panel again.
      onDocumentEscape.mockClear();
      await user.keyboard('{Escape}');
      expect(onDocumentEscape).toHaveBeenCalled();
    } finally {
      document.removeEventListener('keydown', onDocumentEscape);
    }
  });
});
