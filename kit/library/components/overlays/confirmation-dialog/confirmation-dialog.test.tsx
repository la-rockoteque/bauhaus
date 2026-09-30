import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmationDialog } from './confirmation-dialog';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';
import { stubModal } from '../../../stub-modal';

stubModal();

const props = { onClose: () => {}, onConfirm: () => {}, title: 'Delete project', description: 'This removes 3 files.', confirmLabel: 'Delete project', cancelLabel: 'Cancel' };

describe('ConfirmationDialog', () => {
  it('is an alertdialog named by its title and described by its message', () => {
    render(<ConfirmationDialog open {...props} />);
    const dialog = screen.getByRole('alertdialog', { name: 'Delete project', hidden: true });
    expect(dialog.getAttribute('aria-describedby')).toBe(screen.getByText('This removes 3 files.').id);
  });

  it('starts focus on Cancel when destructive, and on the confirm action otherwise', () => {
    const { rerender } = render(<ConfirmationDialog open {...props} destructive />);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel', hidden: true }));
    rerender(<ConfirmationDialog key="plain" open {...props} title="Publish" confirmLabel="Publish page" />);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Publish page', hidden: true }));
  });

  it('calls onConfirm and onClose from its two actions', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(<ConfirmationDialog open inline {...props} onClose={onClose} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape without confirming', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(<ConfirmationDialog open {...props} onClose={onClose} onConfirm={onConfirm} />);
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ConfirmationDialog open inline {...props} destructive />);
    await expectNoAxeViolations(container);
  });
});
