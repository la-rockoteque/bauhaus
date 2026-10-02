import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DecisionSet, DeleteProject, FieldHelp, InboxBadge, ProjectsEmpty, SaveToast, SessionExpired, UploadFailure } from './messaging.stories';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';
import { stubModal } from '../../stub-modal';

stubModal();

describe('Messaging pattern', () => {
  describe('toast: a result the user cannot see', () => {
    beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
    afterEach(() => vi.useRealTimers());

    it('announces the result in the polite status region and leaves focus on the button', () => {
      render(<SaveToast />);
      const button = screen.getByRole('button', { name: 'Save draft' });
      act(() => button.focus());
      fireEvent.click(button);
      expect(screen.getByRole('status').textContent).toContain('Draft saved.');
      expect(screen.getByRole('alert').textContent).not.toContain('Draft saved.');
      expect(document.activeElement).toBe(button);
    });
  });

  describe('banner: a failure the user must act on', () => {
    it('shows nothing until the failure, then an alert with the action in the page', async () => {
      render(<UploadFailure />);
      expect(screen.queryByRole('alert')).toBeNull();
      await userEvent.click(screen.getByRole('button', { name: 'Upload report' }));
      const alert = screen.getByRole('alert');
      expect(alert.textContent).toContain('We could not upload the report');
      expect(alert.querySelector('button')?.textContent).toBe('Try again');
    });

    it('moves focus to the alert, so the retry button is next', async () => {
      render(<UploadFailure />);
      await userEvent.click(screen.getByRole('button', { name: 'Upload report' }));
      expect(document.activeElement).toBe(screen.getByRole('alert'));
      await userEvent.tab();
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Try again' }));
    });

    it('does not use a toast region for the error', async () => {
      render(<UploadFailure />);
      await userEvent.click(screen.getByRole('button', { name: 'Upload report' }));
      expect(document.querySelector('.ds-toast')).toBeNull();
    });
  });

  describe('confirmation dialog: a costly action', () => {
    it('opens as an alertdialog with focus on Cancel and returns focus to its opener', async () => {
      render(<DeleteProject />);
      const opener = screen.getByRole('button', { name: 'Delete project' });
      await userEvent.click(opener);
      const dialog = screen.getByRole('alertdialog', { name: 'Delete project Apollo?', hidden: true });
      expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel', hidden: true }));
      fireEvent.click(screen.getByRole('button', { name: 'Cancel', hidden: true }));
      expect(document.activeElement).toBe(opener);
    });

    it('says the result in a status region that exists before the text', async () => {
      render(<DeleteProject />);
      expect(screen.getByRole('status').textContent).toBe('');
      await userEvent.click(screen.getByRole('button', { name: 'Delete project' }));
      const dialog = screen.getByRole('alertdialog', { hidden: true });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Delete project', hidden: true }));
      expect(screen.getByRole('status').textContent).toBe('Project deleted.');
    });
  });

  describe('empty state: missing content', () => {
    it('keeps the status region in the page and renders the Empty state inside it', () => {
      const { rerender } = render(<ProjectsEmpty projects={['Apollo']} />);
      const region = screen.getByRole('status');
      expect(region.textContent).toBe('');
      rerender(<ProjectsEmpty projects={[]} />);
      expect(screen.getByRole('status')).toBe(region);
      expect(region.textContent).toContain('You have no projects yet');
    });
  });

  describe('alert dialog: a message that blocks', () => {
    it('has one action, takes focus on it, and closes on it', async () => {
      render(<SessionExpired />);
      await userEvent.click(screen.getByRole('button', { name: 'Simulate a timeout' }));
      const dialog = screen.getByRole('alertdialog', { name: 'Session expired', hidden: true });
      const action = screen.getByRole('button', { name: 'Sign in again', hidden: true });
      expect(dialog.querySelectorAll('button')).toHaveLength(1);
      expect(document.activeElement).toBe(action);
      fireEvent.click(action);
      expect(dialog.hasAttribute('open')).toBe(false);
    });
  });

  describe('tooltip and popover: help for one control', () => {
    it('shows the tooltip on keyboard focus as a hint, with no link or button inside', async () => {
      render(<FieldHelp />);
      await userEvent.tab();
      const tip = await screen.findByRole('tooltip');
      expect(tip.textContent).toBe('Exports the visible rows as CSV');
      expect(tip.querySelector('a, button')).toBeNull();
      expect(screen.getByRole('button', { name: 'Export' }).getAttribute('aria-describedby')).toBe(tip.id);
    });

    it('opens the popover on click only, as a named dialog with its link', async () => {
      render(<FieldHelp />);
      const trigger = screen.getByRole('button', { name: 'What is a role?' });
      await userEvent.hover(trigger);
      expect(screen.queryByRole('dialog')).toBeNull();
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('dialog', { name: 'About roles' });
      expect(dialog.querySelector('a')?.textContent).toBe('Read the roles guide');
    });
  });

  describe('badge: a count on an item', () => {
    it('gives assistive technology the full count and what it counts', () => {
      render(<InboxBadge unread={120} />);
      expect(screen.getByRole('button').textContent).toContain('120 unread messages');
      expect(screen.getByText('99+')).toBeTruthy();
    });
  });

  it('has no axe violations in the decision set, the failure banner and the open dialogs', async () => {
    const { container, rerender } = render(<DecisionSet />);
    await expectNoAxeViolations(container);
    rerender(<UploadFailure />);
    await userEvent.click(screen.getByRole('button', { name: 'Upload report' }));
    await expectNoAxeViolations(container);
    rerender(<FieldHelp />);
    await expectNoAxeViolations(container);
  });
});
