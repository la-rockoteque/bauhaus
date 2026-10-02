import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CriticalConfirmationDialog } from './critical-confirmation-dialog';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';
import { stubModal } from '../../../stub-modal';

stubModal();

const props = {
  onClose: () => {},
  onConfirm: () => {},
  title: 'Delete project?',
  description: 'This permanently deletes Apollo, its 3 repositories and 128 files. It cannot be recovered.',
  confirmLabel: 'Delete project',
  cancelLabel: 'Cancel',
  confirmText: 'Apollo',
  fieldLabel: 'Type Apollo to confirm',
  fieldDescription: 'The Delete project button stays disabled until the name matches exactly.',
};
const hidden = { hidden: true } as const;
const confirmButton = () => screen.getByRole('button', { name: 'Delete project', ...hidden }) as HTMLButtonElement;

describe('CriticalConfirmationDialog', () => {
  it('is an alertdialog named by its title and described by the cost', () => {
    render(<CriticalConfirmationDialog open {...props} />);
    const dialog = screen.getByRole('alertdialog', { name: 'Delete project?', ...hidden });
    expect(dialog.getAttribute('aria-describedby')).toBe(screen.getByText(/permanently deletes Apollo/).id);
  });

  it('starts focus on the text field, because the user must type', () => {
    render(<CriticalConfirmationDialog open {...props} />);
    expect(document.activeElement).toBe(screen.getByLabelText('Type Apollo to confirm'));
  });

  it('puts the danger confirm first and Cancel last', () => {
    render(<CriticalConfirmationDialog open inline {...props} />);
    const [first, second] = screen.getAllByRole('button').slice(-2);
    expect(first.textContent).toBe('Delete project');
    expect(first.className).toContain('ds-button--danger');
    expect(second.textContent).toBe('Cancel');
  });

  it('gives the disabled confirm a reason in the field description', () => {
    render(<CriticalConfirmationDialog open {...props} />);
    const field = screen.getByLabelText('Type Apollo to confirm');
    expect(confirmButton().disabled).toBe(true);
    expect(field.getAttribute('aria-describedby')).toContain(screen.getByText(props.fieldDescription).id);
  });

  it('enables the confirm only when the typed value matches exactly', async () => {
    render(<CriticalConfirmationDialog open {...props} />);
    const field = screen.getByLabelText('Type Apollo to confirm');
    await userEvent.type(field, 'apollo');
    expect(confirmButton().disabled).toBe(true);
    await userEvent.clear(field);
    await userEvent.type(field, 'Apollo');
    expect(confirmButton().disabled).toBe(false);
    await userEvent.type(field, 'x');
    expect(confirmButton().disabled).toBe(true);
  });

  it('does not confirm on Enter while the value does not match, and confirms once it does', async () => {
    const onConfirm = vi.fn();
    render(<CriticalConfirmationDialog open {...props} onConfirm={onConfirm} />);
    const field = screen.getByLabelText('Type Apollo to confirm');
    await userEvent.type(field, 'Apoll{Enter}');
    expect(onConfirm).not.toHaveBeenCalled();
    await userEvent.type(field, 'o{Enter}');
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('does not call onConfirm from a disabled confirm button', () => {
    const onConfirm = vi.fn();
    render(<CriticalConfirmationDialog open inline {...props} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('calls onClose from Cancel and from Escape without confirming', async () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(<CriticalConfirmationDialog open {...props} defaultValue="Apollo" onClose={onClose} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel', ...hidden }));
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('while loading keeps the label, marks the confirm busy, disables Cancel and ignores a second press', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(<CriticalConfirmationDialog open {...props} defaultValue="Apollo" loading onConfirm={onConfirm} onClose={onClose} />);
    expect(confirmButton().getAttribute('aria-busy')).toBe('true');
    fireEvent.click(confirmButton());
    expect(onConfirm).not.toHaveBeenCalled();
    expect((screen.getByRole('button', { name: 'Cancel', ...hidden }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows the error as an alert and keeps the typed value', () => {
    render(<CriticalConfirmationDialog open {...props} defaultValue="Apollo" error="Nothing was deleted. Try again." />);
    expect(screen.getByRole('alert', hidden).textContent).toContain('Nothing was deleted');
    expect((screen.getByLabelText('Type Apollo to confirm') as HTMLInputElement).value).toBe('Apollo');
    expect(confirmButton().disabled).toBe(false);
  });

  it('empties the field when the dialog closes, so a reopened dialog asks again', async () => {
    const { rerender } = render(<CriticalConfirmationDialog open {...props} />);
    await userEvent.type(screen.getByLabelText('Type Apollo to confirm'), 'Apollo');
    rerender(<CriticalConfirmationDialog open={false} {...props} />);
    rerender(<CriticalConfirmationDialog open {...props} />);
    expect((screen.getByLabelText('Type Apollo to confirm') as HTMLInputElement).value).toBe('');
    expect(confirmButton().disabled).toBe(true);
  });

  it('has no axe violations idle, matched, loading and failed', async () => {
    const { container, rerender } = render(<CriticalConfirmationDialog open inline {...props} />);
    await expectNoAxeViolations(container);
    rerender(<CriticalConfirmationDialog open inline {...props} defaultValue="Apollo" />);
    await expectNoAxeViolations(container);
    rerender(<CriticalConfirmationDialog key="l" open inline {...props} defaultValue="Apollo" loading />);
    await expectNoAxeViolations(container);
    rerender(<CriticalConfirmationDialog key="f" open inline {...props} defaultValue="Apollo" error="Nothing was deleted." />);
    await expectNoAxeViolations(container);
  });
});
