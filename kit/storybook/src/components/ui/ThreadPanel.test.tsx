import { act, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { ThreadPanel } from './ThreadPanel';

/**
 * The panel opens BEFORE its thread arrives — the fetch is enabled by the opening — so anything
 * that looks for an item has to survive being asked once while the body still says
 * « Chargement… ». That is the hole the deep link from a notification falls into, and it had no
 * coverage at all before this file.
 */
describe('ThreadPanel — the targeted item', () => {
  function Harness({ focusItemId }: { focusItemId: number }) {
    // Nothing, then three comments — the shape of a panel opening onto a cold query.
    const [items, setItems] = useState<number[]>([]);

    return (
      <>
        <button type="button" onClick={() => setItems([1, 2, 3])}>
          land the thread
        </button>
        <ThreadPanel
          isOpen
          onClose={vi.fn()}
          title="REQ-42"
          itemCount={items.length}
          focusItemId={focusItemId}
        >
          {items.map((id) => (
            <p key={id} data-comment-id={id}>
              comment {id}
            </p>
          ))}
        </ThreadPanel>
      </>
    );
  }

  it('scrolls to the item when the thread lands after the panel opened', async () => {
    const scrollIntoView = vi.fn();
    // happy-dom has no layout, so the method does not exist until we give it one.
    Element.prototype.scrollIntoView = scrollIntoView;

    const { user } = renderWithProviders(<Harness focusItemId={2} />);

    // Let the mount's requestAnimationFrame actually fire against the empty body. Without this
    // the callback is still pending when the thread lands, finds the comments by accident, and
    // the test passes with the bug present — which is what the first version of it did.
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    });
    expect(scrollIntoView).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'land the thread' }));

    // It must run AGAIN now the comments exist. Without `itemCount` in the dependencies it
    // never does, and the comment the notification named is never reached.
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());
  });
});

describe('ThreadPanel — dialog semantics', () => {
  it('names itself as a modal dialog', () => {
    renderWithProviders(
      <ThreadPanel isOpen onClose={vi.fn()} title="P-1042" itemCount={0}>
        <p>thread</p>
      </ThreadPanel>,
    );

    const dialog = screen.getByRole('dialog', { name: 'P-1042' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('takes focus on open so Tab does not walk the page behind the scrim', () => {
    renderWithProviders(
      <ThreadPanel isOpen onClose={vi.fn()} title="P-1042" itemCount={0}>
        <p>thread</p>
      </ThreadPanel>,
    );

    expect(screen.getByRole('dialog', { name: 'P-1042' })).toHaveFocus();
  });

  it('gives focus back to whatever opened it', async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Commentaires
          </button>
          {open && (
            <ThreadPanel isOpen onClose={() => setOpen(false)} title="P-1042" itemCount={0}>
              <p>thread</p>
            </ThreadPanel>
          )}
        </>
      );
    }

    const { user } = renderWithProviders(<Harness />);
    const opener = screen.getByRole('button', { name: 'Commentaires' });

    await user.click(opener);
    expect(screen.getByRole('dialog', { name: 'P-1042' })).toHaveFocus();

    await user.keyboard('{Escape}');

    // The row button, not the top of the page.
    await waitFor(() => expect(opener).toHaveFocus());
  });
});

/**
 * The panels render unconditionally and pass `isOpen` (`RequisitionSidePanels.tsx:24`), so the
 * panel's hooks outlive every close while the body they describe is unmounted and comes back
 * scrolled to the top. Anything remembered across that gap has to be forgotten on the way out.
 */
describe('ThreadPanel — reopening a thread', () => {
  function Harness() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button type="button" onClick={() => setOpen((o) => !o)}>
          toggle
        </button>
        <ThreadPanel isOpen={open} onClose={() => setOpen(false)} title="REQ-42" itemCount={12}>
          <p>thread</p>
        </ThreadPanel>
      </>
    );
  }

  it('goes back to the newest when reopened, even with nothing posted since', async () => {
    const scrollTo = vi.fn();
    Element.prototype.scrollTo = scrollTo;

    const { user } = renderWithProviders(<Harness />);
    await waitFor(() => expect(scrollTo).toHaveBeenCalled());

    scrollTo.mockClear();
    await user.click(screen.getByRole('button', { name: 'toggle' })); // close
    await user.click(screen.getByRole('button', { name: 'toggle' })); // reopen

    // The count has not moved — but the body has, so it must scroll again.
    await waitFor(() => expect(scrollTo).toHaveBeenCalled());
  });
})

/**
 * The trap's whole job, and the case the first version of it missed: the panel focuses its own
 * container on open, so the very first Shift+Tab happens while `activeElement` is the container
 * — neither the first focusable nor the last. A wrap that only tests those two never fires, and
 * focus walks out to the page behind the scrim and never comes back.
 *
 * These press Tab, which the earlier dialog tests never did — which is why they stayed green
 * while the trap leaked.
 */
describe('ThreadPanel — focus stays inside', () => {
  function Harness() {
    return (
      <>
        <button type="button">page control behind the scrim</button>
        <ThreadPanel isOpen onClose={vi.fn()} title="P-1042" itemCount={0}>
          <button type="button">in thread</button>
        </ThreadPanel>
      </>
    );
  }

  it('does not let the first Shift+Tab escape to the page behind', async () => {
    const { user } = renderWithProviders(<Harness />);
    const panel = screen.getByRole('dialog', { name: 'P-1042' });
    expect(panel).toHaveFocus();

    await user.tab({ shift: true });

    expect(panel.contains(document.activeElement)).toBe(true);
    expect(screen.getByRole('button', { name: 'page control behind the scrim' })).not.toHaveFocus();
  });

  it('pulls focus back when it has already escaped', async () => {
    const { user } = renderWithProviders(<Harness />);
    const outside = screen.getByRole('button', { name: 'page control behind the scrim' });
    const panel = screen.getByRole('dialog', { name: 'P-1042' });

    // However it got there — a stray click, a programmatic focus — Tab must recover.
    outside.focus();
    await user.tab();

    expect(panel.contains(document.activeElement)).toBe(true);
  });
})
