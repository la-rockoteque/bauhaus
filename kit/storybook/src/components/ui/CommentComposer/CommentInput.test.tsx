import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders } from '../../../test/render';
import { RequisitionCommentComposer } from '../../../test/commentComposer';

// The composer pulls the mention pool from a query hook; stub it so the unit
// test stays focused on the permission guard.
vi.mock('../../hooks/useMentionPool', () => ({
  useMentionPool: () => ({ data: [] }),
}));

const deniedPermissions = vi.hoisted(() => new Set<string>());
vi.mock('../../../auth', () => ({
  useCan: (p: string) => !deniedPermissions.has(p),
  Permissions: {
    comments: { create: 'comments:create', deleteAny: 'comments:delete-any', editAny: 'comments:edit-any' },
  },
}));

describe('CommentInput — self-gates on comments:create (BR §2.4)', () => {
  beforeEach(() => deniedPermissions.clear());

  it('renders the composer when the user can create comments', () => {
    renderWithProviders(<RequisitionCommentComposer onSubmit={vi.fn()} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders nothing when the user lacks comments:create', () => {
    deniedPermissions.add('comments:create');

    const { container } = renderWithProviders(<RequisitionCommentComposer onSubmit={vi.fn()} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
