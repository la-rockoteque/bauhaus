import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from './ConfirmDialog';

function renderConfirm(props: Partial<React.ComponentProps<typeof ConfirmDialog>> = {}) {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  render(
    <ConfirmDialog
      isOpen
      title="Supprimer le rôle"
      message="Confirmer la suppression du rôle « Magasinier » ?"
      confirmLabel="Supprimer"
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...props}
    />,
  );
  return { onConfirm, onCancel, user: userEvent.setup() };
}

describe('ConfirmDialog — answering', () => {
  it('calls onConfirm once on confirm', async () => {
    const { onConfirm, onCancel, user } = renderConfirm();
    await user.click(screen.getByRole('button', { name: 'Supprimer' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it.each([
    ['Cancel', async (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: 'Annuler' }))],
    ['Escape', async (user: ReturnType<typeof userEvent.setup>) => user.keyboard('{Escape}')],
    ['a backdrop click', async (user: ReturnType<typeof userEvent.setup>) => user.click(document.querySelector('.mo-dialog')!)],
  ])('calls onCancel and never onConfirm on %s', async (_, dismiss) => {
    const { onConfirm, onCancel, user } = renderConfirm();
    await dismiss(user);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe('ConfirmDialog — initial focus', () => {
  it('puts focus on Cancel when the tone is danger', () => {
    renderConfirm({ tone: 'danger' });
    expect(screen.getByRole('button', { name: 'Annuler' })).toHaveFocus();
  });

  it('puts focus on the confirm button when the tone is default', () => {
    renderConfirm({ tone: 'default' });
    expect(screen.getByRole('button', { name: 'Supprimer' })).toHaveFocus();
  });
});

describe('ConfirmDialog — pending and error', () => {
  it('disables both buttons and ignores Escape and the backdrop while pending', async () => {
    const { onCancel, user } = renderConfirm({ pending: true });
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeDisabled();

    await user.keyboard('{Escape}');
    await user.click(document.querySelector('.mo-dialog')!);
    expect(onCancel).not.toHaveBeenCalled();
  });

  // Staying open after a failure is the caller's (isOpen is a prop), held by RolesTab.test's
  // "shows a failed delete once, inside the dialog". This component owns where the failure
  // shows and that the question can be answered again.
  it('shows the failure inside the surface and leaves both answers available', () => {
    renderConfirm({ error: 'Le rôle est encore attribué.' });
    const dialog = screen.getByRole('dialog', { name: 'Supprimer le rôle' });
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Le rôle est encore attribué.');
    expect(within(dialog).getByRole('button', { name: 'Annuler' })).toBeEnabled();
    expect(within(dialog).getByRole('button', { name: 'Supprimer' })).toBeEnabled();
  });
});
