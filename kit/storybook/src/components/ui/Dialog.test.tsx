import { StrictMode, useState, type ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { DEFAULT_LOCALE } from '../../i18n';
import { ConfirmDialog } from './ConfirmDialog';
import { Dialog } from './Dialog';

function renderDialog(children: ReactNode = <button>Inside</button>) {
  const onClose = vi.fn();
  const user = userEvent.setup();
  render(
    <Dialog isOpen onClose={onClose} title="T">
      {children}
    </Dialog>,
  );
  return { onClose, user };
}

describe('Dialog — focus management', () => {
  it('moves focus into the dialog when opened', () => {
    render(
      <Dialog isOpen onClose={() => {}} title="T">
        <button>Inside</button>
      </Dialog>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it.each([
    { when: 'closed', conditional: false, strict: false, child: <button>Inside</button>, focused: null },
    {
      when: 'closed after a child autoFocus took focus on mount',
      conditional: true,
      strict: false,
      child: <input aria-label="Name" autoFocus />,
      focused: { role: 'textbox', name: 'Name' } as const,
    },
    {
      when: 'closed after a child autoFocus took focus as isOpen flipped',
      conditional: false,
      strict: false,
      child: <button autoFocus>Inside</button>,
      focused: { role: 'button', name: 'Inside' } as const,
    },
    {
      when: 'closed under StrictMode, keeping the autoFocus child focused while open',
      conditional: true,
      strict: true,
      child: <textarea aria-label="Reason" autoFocus />,
      focused: { role: 'textbox', name: 'Reason' } as const,
    },
  ])('restores focus to the trigger when $when', async ({ conditional, strict, child, focused }) => {
    const user = userEvent.setup();
    function Harness() {
      const [open, setOpen] = useState(false);
      const close = () => setOpen(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          {conditional ? (
            open && (
              <Dialog isOpen onClose={close} title="T">
                {child}
              </Dialog>
            )
          ) : (
            <Dialog isOpen={open} onClose={close} title="T">
              {child}
            </Dialog>
          )}
        </>
      );
    }
    render(strict ? <StrictMode><Harness /></StrictMode> : <Harness />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    if (focused) {
      expect(screen.getByRole(focused.role, { name: focused.name })).toHaveFocus();
    }
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });

  // Focusable order in the dialog: close button (« Fermer »), First, Last.
  it.each([
    { key: 'Tab', shift: false, from: 'Last', to: 'Fermer', edge: 'end (wraps to the first focusable)' },
    { key: 'Shift+Tab', shift: true, from: 'Fermer', to: 'Last', edge: 'start (wraps to the last focusable)' },
  ])('traps $key at the $edge', async ({ shift, from, to }) => {
    const { user } = renderDialog(
      <>
        <button>First</button>
        <button>Last</button>
      </>,
    );
    screen.getByRole('button', { name: from }).focus();
    await user.tab({ shift });
    expect(screen.getByRole('button', { name: to })).toHaveFocus();
  });

  it('honours a child autoFocus instead of stealing focus to the dialog container', () => {
    render(
      <Dialog isOpen onClose={() => {}} title="T">
        <input aria-label="Name" autoFocus />
      </Dialog>
    );
    // The on-open focus must not override a field the caller chose to autofocus.
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
  });

  it('recaptures focus when it has escaped the dialog and Tab is pressed', async () => {
    const user = userEvent.setup();
    render(
      <Dialog isOpen onClose={() => {}} title="T">
        <button>Inside</button>
      </Dialog>
    );
    // Force focus out of the dialog (as an external blur would).
    (document.activeElement as HTMLElement | null)?.blur();
    expect(document.body).toHaveFocus();
    await user.tab();
    // Focus is pulled back to the first focusable in the dialog (the close button).
    expect(screen.getByRole('button', { name: 'Fermer' })).toHaveFocus();
  });

  it('still closes on Escape', async () => {
    const { onClose, user } = renderDialog();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});

describe('Dialog — naming and dismissal', () => {
  it('is named by its visible title, not by an aria-label', () => {
    render(
      <Dialog isOpen onClose={() => {}} title="Transférer les lignes">
        <button>Inside</button>
      </Dialog>
    );
    const dialog = screen.getByRole('dialog', { name: 'Transférer les lignes' });
    const heading = screen.getByRole('heading', { level: 2, name: 'Transférer les lignes' });
    expect(dialog).toHaveAttribute('aria-labelledby', heading.id);
    expect(dialog).not.toHaveAttribute('aria-label');
  });

  it('names the close button from i18n', async () => {
    render(
      <Dialog isOpen onClose={() => {}} title="T">
        <button>Inside</button>
      </Dialog>
    );
    expect(screen.getByRole('button', { name: i18n.t('common:actions.close') })).toBeInTheDocument();
    await i18n.changeLanguage('en-CA');
    expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument();
    await i18n.changeLanguage(DEFAULT_LOCALE);
  });

  it('closes on a click on the backdrop', async () => {
    const { onClose, user } = renderDialog();
    await user.click(document.querySelector('.mo-dialog')!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('stays open on a click inside the surface', async () => {
    const { onClose, user } = renderDialog();
    await user.click(screen.getByRole('button', { name: 'Inside' }));
    await user.click(screen.getByRole('heading', { name: 'T' }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('stays open when a press starts in the surface and is released on the backdrop', () => {
    const { onClose } = renderDialog(<textarea aria-label="Motif" />);
    fireEvent.mouseDown(screen.getByRole('textbox', { name: 'Motif' }));
    fireEvent.click(document.querySelector('.mo-dialog')!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('ignores Escape, the backdrop and the close button while pending', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Dialog isOpen onClose={onClose} title="T" pending>
        <button>Inside</button>
      </Dialog>
    );
    await user.keyboard('{Escape}');
    await user.click(document.querySelector('.mo-dialog')!);
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeDisabled();
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('Dialog — a confirmation opened over a dialog', () => {
  function renderNested() {
    const onCloseOuter = vi.fn();
    const user = userEvent.setup();
    function Harness() {
      const [asking, setAsking] = useState(false);
      return (
        <Dialog isOpen onClose={onCloseOuter} title="Rôle">
          <button onClick={() => setAsking(true)}>Supprimer le rôle</button>
          <ConfirmDialog
            isOpen={asking}
            title="Supprimer ?"
            message="Le rôle disparaît."
            confirmLabel="Supprimer"
            onConfirm={() => {}}
            onCancel={() => setAsking(false)}
          />
        </Dialog>
      );
    }
    render(<Harness />);
    return { onCloseOuter, user };
  }

  it('closes only the confirmation on Escape', async () => {
    const { onCloseOuter, user } = renderNested();
    await user.click(screen.getByRole('button', { name: 'Supprimer le rôle' }));
    expect(screen.getByRole('dialog', { name: 'Supprimer ?' })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: 'Supprimer ?' })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Rôle' })).toBeInTheDocument();
    expect(onCloseOuter).not.toHaveBeenCalled();
  });

  it('lets Tab walk the confirmation, not the dialog under it', async () => {
    const { user } = renderNested();
    await user.click(screen.getByRole('button', { name: 'Supprimer le rôle' }));
    const confirm = within(screen.getByRole('dialog', { name: 'Supprimer ?' }));

    confirm.getByRole('button', { name: 'Fermer' }).focus();
    await user.tab();
    expect(confirm.getByRole('button', { name: 'Annuler' })).toHaveFocus();
    await user.tab();
    expect(confirm.getByRole('button', { name: 'Supprimer' })).toHaveFocus();
    await user.tab();
    expect(confirm.getByRole('button', { name: 'Fermer' })).toHaveFocus();
  });
});
