import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AlertDialog } from './alert-dialog';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';
import { stubModal } from '../../../stub-modal';

stubModal();

const props = { title: 'Session expired', description: 'You were signed out after 30 minutes without activity. Your draft is saved.', actionLabel: 'Sign in again' };

describe('AlertDialog', () => {
  it('is an alertdialog named by its title and described by its message', () => {
    render(<AlertDialog open onClose={() => {}} {...props} />);
    const dialog = screen.getByRole('alertdialog', { name: 'Session expired', hidden: true });
    expect(dialog.getAttribute('aria-describedby')).toBe(screen.getByText(props.description).id);
  });

  it('has one action, and focus starts on it', () => {
    render(<AlertDialog open onClose={() => {}} {...props} />);
    expect(screen.getAllByRole('button', { hidden: true })).toHaveLength(1);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Sign in again', hidden: true }));
  });

  it('closes from its action and on Escape', () => {
    const onClose = vi.fn();
    render(<AlertDialog open onClose={onClose} {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign in again', hidden: true }));
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('has no axe violations', async () => {
    const { container } = render(<AlertDialog open inline onClose={() => {}} {...props} />);
    await expectNoAxeViolations(container);
  });
});
