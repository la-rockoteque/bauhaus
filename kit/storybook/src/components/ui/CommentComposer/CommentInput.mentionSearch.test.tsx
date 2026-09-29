import { screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../test/render';

// Mock the API, not the hook: the point of this suite is that the composer fetches a
// *searched page* from the server instead of holding the whole directory (AC3).
vi.mock('../../../api/users', () => ({
  fetchMentionPool: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../../auth', () => ({
  useCan: () => true,
  Permissions: {
    comments: { create: 'comments:create', deleteAny: 'comments:delete-any', editAny: 'comments:edit-any' },
  },
}));

import { fetchMentionPool } from '../../../api/users';
import { RequisitionCommentComposer } from '../../../test/commentComposer';
import { CommentInput } from './CommentInput';
import { useRequisitionMentionSource } from '../../RequisitionDiscussion/useRequisitionMentionSource';

describe('CommentInput — the mention pool is searched on the server (AC3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not fetch the pool before the user types @', async () => {
    const { user } = renderWithProviders(<RequisitionCommentComposer onSubmit={vi.fn()} />);

    await user.type(screen.getByRole('textbox'), 'hello there');

    expect(fetchMentionPool).not.toHaveBeenCalled();
  });

  it('sends the term the user typed after the @', async () => {
    const { user } = renderWithProviders(<RequisitionCommentComposer onSubmit={vi.fn()} />);

    await user.type(screen.getByRole('textbox'), '@trem');

    await waitFor(() => {
      expect(fetchMentionPool).toHaveBeenCalledWith('trem');
    });
  });

  it('sends fewer requests than keystrokes', async () => {
    const { user } = renderWithProviders(<RequisitionCommentComposer onSubmit={vi.fn()} />);

    await user.type(screen.getByRole('textbox'), '@tremblay');

    await waitFor(() => {
      expect(fetchMentionPool).toHaveBeenCalledWith('tremblay');
    });

    // Nine keystrokes. The debounce must collapse them: the open of the popover fetches
    // the first page, then one request carries the settled term.
    expect(vi.mocked(fetchMentionPool).mock.calls.length).toBeLessThan(9);
  });
});

/**
 * The keyup/click listener that re-evaluates the `@` trigger when the caret moves without the
 * body changing is registered ONCE, so it closes over the first render's handlers. That was
 * harmless while they were all `useState` setters, whose identity never changes; it stopped
 * being harmless when the composer started reporting its live term through a prop.
 *
 * A caller passing a fresh function each render — the ordinary thing to write — would otherwise
 * leave this path calling the FIRST one forever. The parent's later state would never reach it,
 * so moving the caret would stop refreshing the pool while typing still did.
 *
 * The callbacks below are told apart by the render they were created in, because two callbacks
 * that behave identically cannot tell you which one was called.
 */
describe('CommentInput — the query listener is read live, not captured once', () => {
  it('calls the callback from the CURRENT render, not the first', async () => {
    const callers: number[] = []

    function Harness() {
      const [renderId, setRenderId] = useState(0)
      const [mentionQuery, setMentionQuery] = useState<string | null>(null)
      const mentionPool = useRequisitionMentionSource(mentionQuery ?? '', mentionQuery !== null)

      return (
        <>
          <button type="button" onClick={() => setRenderId((n) => n + 1)}>
            re-render
          </button>
          <CommentInput
            onSubmit={vi.fn()}
            isPending={false}
            canCreate
            mentionPool={mentionPool}
            /* A new identity every render, and one that records WHICH render made it. */
            onMentionQueryChange={(q) => {
              callers.push(renderId)
              setMentionQuery(q)
            }}
          />
        </>
      )
    }

    const { user } = renderWithProviders(<Harness />)

    // Move the parent past its first render, so a captured callback would be identifiable.
    await user.click(screen.getByRole('button', { name: 're-render' }))
    await user.click(screen.getByRole('button', { name: 're-render' }))

    await user.type(screen.getByRole('textbox'), '@trem')
    await waitFor(() => expect(callers.length).toBeGreaterThan(0))

    // A stale capture would report render 0 forever.
    expect(callers.at(-1)).toBe(2)
    expect(callers).not.toContain(0)
  })
})
