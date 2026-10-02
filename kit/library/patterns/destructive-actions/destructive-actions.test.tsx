import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDelete, DeleteProject, UndoList } from './destructive-actions.stories';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';
import { stubModal } from '../../stub-modal';

stubModal();

const hidden = { hidden: true } as const;
const confirmInDialog = () => screen.getAllByRole('button', { name: 'Delete project', ...hidden }).at(-1) as HTMLButtonElement;

describe('Destructive actions pattern', () => {
  it('removes a reversible item at once, with no question, and Undo restores it', async () => {
    render(<UndoList position="static" />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete Logo draft.png' }));
    expect(screen.queryByRole('alertdialog', hidden)).toBeNull();
    expect(screen.queryByText('Logo draft.png')).toBeNull();
    expect(screen.getByText('Logo draft.png moved to trash.')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(screen.getByText('Logo draft.png')).toBeTruthy();
    expect(screen.queryByText(/moved to trash/)).toBeNull();
  });

  it('moves focus to the next row after Delete, never to the page body', async () => {
    render(<UndoList position="static" />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete Logo draft.png' }));
    expect(document.activeElement).not.toBe(document.body);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Delete Budget.xlsx' }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete Budget.xlsx' }));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Delete Q3 report.pdf' }));
  });

  it('moves focus to the empty message when the last row goes, and Undo is reached by Tab', async () => {
    render(<UndoList position="static" initiallyRemoved={[2, 3]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete Q3 report.pdf' }));
    expect(document.activeElement).toBe(screen.getByText('No files.'));
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getAllByRole('button', { name: 'Undo' })[0]);
  });

  it('returns focus to the restored row after Undo', async () => {
    render(<UndoList position="static" />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete Logo draft.png' }));
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Delete Logo draft.png' }));
  });

  it('keeps the Undo toast until the user closes it, then the delete is final', async () => {
    render(<UndoList position="static" initiallyRemoved={[1]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    await waitFor(() => expect(screen.queryByText(/moved to trash/)).toBeNull());
    expect(screen.queryByText('Q3 report.pdf')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull();
  });

  it('names the action on the confirm button, never OK', async () => {
    render(<ConfirmDelete initialOpen />);
    const dialog = screen.getByRole('alertdialog', { name: 'Delete filter?', ...hidden });
    expect(dialog.getAttribute('aria-describedby')).toBe(screen.getByText(/It cannot be recovered/).id);
    expect(screen.getAllByRole('button', { name: 'Delete filter', ...hidden }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: /^(OK|Yes|Confirm)$/, ...hidden })).toBeNull();
  });

  it('starts focus on Cancel in the destructive dialog and on the text field in the critical one', () => {
    const { unmount } = render(<ConfirmDelete initialOpen />);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel', ...hidden }));
    unmount();
    render(<DeleteProject initialOpen />);
    expect(document.activeElement).toBe(screen.getByLabelText(/Type Apollo to confirm/));
  });

  it('shows a danger confirm first and Cancel last in both destructive dialogs', () => {
    const { unmount } = render(<ConfirmDelete inline initialOpen />);
    let [first, last] = screen.getAllByRole('button').slice(-2);
    expect([first.textContent, first.className.includes('ds-button--danger'), last.textContent]).toEqual(['Delete filter', true, 'Cancel']);
    unmount();
    render(<DeleteProject inline initialOpen />);
    [first, last] = screen.getAllByRole('button').slice(-2);
    expect([first.textContent, first.className.includes('ds-button--danger'), last.textContent]).toEqual(['Delete project', true, 'Cancel']);
  });

  it('does not confirm a wrong name with Enter', async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    render(<DeleteProject initialOpen onDelete={onDelete} />);
    await userEvent.type(screen.getByLabelText(/Type Apollo to confirm/), 'Apollo2{Enter}');
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('closes the confirmation on Cancel without deleting', async () => {
    const onDelete = vi.fn();
    render(<ConfirmDelete inline initialOpen onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByText('Filter deleted')).toBeNull();
  });

  it('keeps the confirm button disabled until the typed name matches exactly', async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    render(<DeleteProject initialOpen onDelete={onDelete} />);
    const field = screen.getByLabelText(/Type Apollo to confirm/);
    expect(confirmInDialog().disabled).toBe(true);
    await userEvent.type(field, 'apollo');
    expect(confirmInDialog().disabled).toBe(true);
    await userEvent.clear(field);
    await userEvent.type(field, 'Apollo');
    expect(confirmInDialog().disabled).toBe(false);
    await userEvent.click(confirmInDialog());
    await waitFor(() => expect(screen.getByRole('status')).toBeTruthy());
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('shows loading while the request runs and ignores a second press', async () => {
    let resolve = () => undefined as void;
    const onDelete = vi.fn(() => new Promise<void>((r) => { resolve = r; }));
    render(<DeleteProject initialOpen initialTyped="Apollo" onDelete={onDelete} />);
    await userEvent.click(confirmInDialog());
    expect(confirmInDialog().getAttribute('aria-busy')).toBe('true');
    fireEvent.click(confirmInDialog());
    expect(onDelete).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Cancel', ...hidden }).hasAttribute('disabled')).toBe(true);
    resolve();
    await waitFor(() => expect(screen.getByRole('status')).toBeTruthy());
  });

  it('keeps the dialog and the typed name on failure, says nothing was deleted, and retries', async () => {
    const onDelete = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined);
    render(<DeleteProject initialOpen initialTyped="Apollo" onDelete={onDelete} />);
    await userEvent.click(confirmInDialog());
    const alert = await screen.findByRole('alert', hidden);
    expect(alert.textContent).toContain('Nothing was deleted');
    expect((screen.getByLabelText(/Type Apollo to confirm/) as HTMLInputElement).value).toBe('Apollo');
    expect(screen.getByRole('alertdialog', hidden)).toBeTruthy();
    await userEvent.click(confirmInDialog());
    await waitFor(() => expect(screen.getByRole('status')).toBeTruthy());
    expect(onDelete).toHaveBeenCalledTimes(2);
  });

  it('announces the permanent delete in a status region and moves focus to it', async () => {
    render(<DeleteProject initialOpen initialTyped="Apollo" onDelete={() => Promise.resolve()} />);
    await userEvent.click(confirmInDialog());
    const status = await screen.findByRole('status');
    expect(status.textContent).toContain('Apollo and its files were deleted');
    expect(document.activeElement).toBe(status);
  });

  it('has no axe violations: undo toast, confirmation, type-to-confirm and failure', async () => {
    const { container, rerender } = render(<UndoList position="static" initiallyRemoved={[2]} />);
    await expectNoAxeViolations(container);
    rerender(<ConfirmDelete inline initialOpen />);
    await expectNoAxeViolations(container);
    rerender(<DeleteProject inline initialOpen />);
    await expectNoAxeViolations(container);
    rerender(<DeleteProject key="failed" inline initialOpen initialTyped="Apollo" initialPhase="failed" />);
    await expectNoAxeViolations(container);
  });
});
