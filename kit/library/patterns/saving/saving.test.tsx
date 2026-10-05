import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AutosaveSettings, EditRecord, ManualSave, NewRecord, SaveIndicator } from './saving.stories';
import type { SaveStatus } from './saving.stories';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';
import { stubModal } from '../../stub-modal';

stubModal();

const hidden = { hidden: true } as const;
// Each TextField keeps its own success region, so the page indicator is the status region outside the fields.
const status = () => screen.getAllByRole('status').filter((region) => !region.closest('.ds-field'))[0];
const type = (label: string | RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
/** A promise the test settles by hand, so a request stays in flight. */
function deferred() {
  let resolve = () => undefined as void;
  let reject = (_error: Error) => undefined as void;
  const promise = new Promise<void>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

describe('Saving pattern', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    window.localStorage.clear();
  });
  afterEach(() => vi.useRealTimers());

  describe('the indicator', () => {
    it('keeps its status region in the page before any text appears', () => {
      render(<ManualSave />);
      const region = status();
      expect(region.textContent).toBe('');
      type('Project name', 'Apollo 2');
      expect(status()).toBe(region);
      expect(region.textContent).toContain('Unsaved changes');
    });

    it.each<[SaveStatus, string]>([
      ['unsaved', 'Unsaved changes'],
      ['saving', 'Saving…'],
      ['saved', 'All changes saved'],
      ['failed', 'Not saved'],
    ])('says %s in words, so colour is never the only cue', (state, text) => {
      render(<SaveIndicator status={state} />);
      expect(status().textContent).toContain(text);
      expect(status().querySelector('svg, .ds-spinner')).not.toBeNull();
    });

    it('shows nothing for idle and the time for a saved change', () => {
      const { rerender } = render(<SaveIndicator status="idle" />);
      expect(status().textContent).toBe('');
      rerender(<SaveIndicator status="saved" savedAt="14:32" />);
      expect(status().textContent).toContain('Saved at 14:32');
    });

    it('offers Retry only when the save failed', () => {
      const { rerender } = render(<SaveIndicator status="saved" />);
      expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
      rerender(<SaveIndicator status="failed" onRetry={() => undefined} />);
      expect(status().querySelector('button')?.textContent).toBe('Retry');
    });
  });

  describe('manual save', () => {
    it('shows loading on the Save button, ignores a second press, then reports the save', async () => {
      const request = deferred();
      const onSave = vi.fn(() => request.promise);
      render(<ManualSave onSave={onSave} />);
      type('Project name', 'Apollo 2');
      const save = screen.getByRole('button', { name: 'Save changes' });
      fireEvent.click(save);
      expect(save.getAttribute('aria-busy')).toBe('true');
      expect(save.hasAttribute('disabled')).toBe(false);
      expect(status().textContent).toContain('Saving…');
      fireEvent.click(save);
      fireEvent.submit(save.closest('form') as HTMLFormElement);
      expect(onSave).toHaveBeenCalledOnce();
      await act(async () => request.resolve());
      expect(save.getAttribute('aria-busy')).toBeNull();
      expect(status().textContent).toMatch(/Saved at/);
    });

    it('keeps the input and moves focus to Retry when the save fails, and Retry saves again', async () => {
      const onSave = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined);
      render(<ManualSave onSave={onSave} />);
      type('Project name', 'Apollo 2');
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
      await waitFor(() => expect(status().textContent).toContain('Not saved'));
      expect((screen.getByLabelText('Project name') as HTMLInputElement).value).toBe('Apollo 2');
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Retry' }));
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      await waitFor(() => expect(status().textContent).toMatch(/Saved at/));
      expect(onSave).toHaveBeenCalledTimes(2);
      expect(onSave).toHaveBeenLastCalledWith({ name: 'Apollo 2', email: 'team@example.com' });
    });

    it('says Unsaved changes again when the user edits while the save runs', async () => {
      const request = deferred();
      render(<ManualSave onSave={() => request.promise} />);
      type('Project name', 'A');
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
      type('Project name', 'AB');
      await act(async () => request.resolve());
      expect(status().textContent).toContain('Unsaved changes');
    });
  });

  describe('autosave', () => {
    it('coalesces typing into one request, sent after the idle time', async () => {
      // A frozen clock: real time must not count toward the 3 seconds.
      vi.useRealTimers();
      vi.useFakeTimers({ shouldAdvanceTime: false });
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<AutosaveSettings onSave={onSave} />);
      for (const value of ['A', 'Ap', 'Apo', 'Apol', 'Apoll', 'Apollo']) type('Display name', value);
      expect(status().textContent).toContain('Unsaved changes');
      await act(async () => { vi.advanceTimersByTime(2999); });
      expect(onSave).not.toHaveBeenCalled();
      await act(async () => { vi.advanceTimersByTime(1); });
      expect(onSave).toHaveBeenCalledOnce();
      expect(onSave).toHaveBeenCalledWith({ name: 'Apollo', notify: true });
      expect(status().textContent).toMatch(/Saved at/);
    });

    it('saves at once on blur, and not at all when nothing changed', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<AutosaveSettings onSave={onSave} />);
      const field = screen.getByLabelText('Display name');
      fireEvent.blur(field);
      expect(onSave).not.toHaveBeenCalled();
      type('Display name', 'Apollo');
      fireEvent.blur(field);
      expect(onSave).toHaveBeenCalledOnce();
      await act(async () => { vi.advanceTimersByTime(10000); });
      expect(onSave).toHaveBeenCalledOnce();
    });

    it('saves a switch at once', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<AutosaveSettings onSave={onSave} />);
      fireEvent.click(screen.getByRole('switch', { name: 'Email me about replies' }));
      await waitFor(() => expect(onSave).toHaveBeenCalledWith({ name: 'Ada', notify: false }));
    });

    it('ignores a stale response: the newest request decides the indicator', async () => {
      const first = deferred();
      const second = deferred();
      const onSave = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
      render(<AutosaveSettings onSave={onSave} />);
      type('Display name', 'One');
      fireEvent.blur(screen.getByLabelText('Display name'));
      type('Display name', 'Two');
      fireEvent.blur(screen.getByLabelText('Display name'));
      expect(onSave).toHaveBeenCalledTimes(2);
      await act(async () => first.reject(new Error('late failure')));
      expect(status().textContent).toContain('Saving…');
      expect(status().textContent).not.toContain('Not saved');
      await act(async () => second.resolve());
      expect(status().textContent).toMatch(/Saved at/);
    });

    it('keeps the value on failure, leaves focus in the field, and Retry sends the latest value', async () => {
      const onSave = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined);
      render(<AutosaveSettings onSave={onSave} />);
      const field = screen.getByLabelText('Display name') as HTMLInputElement;
      act(() => field.focus());
      type('Display name', 'Apollo');
      await act(async () => { vi.advanceTimersByTime(3000); });
      await waitFor(() => expect(status().textContent).toContain('Not saved'));
      expect(field.value).toBe('Apollo');
      expect(document.activeElement).toBe(field);
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      await waitFor(() => expect(status().textContent).toMatch(/Saved at/));
      expect(onSave).toHaveBeenLastCalledWith({ name: 'Apollo', notify: true });
    });
  });

  describe('creation: keep a draft', () => {
    it('saves the draft on this device and restores it with a Banner and a Discard action', () => {
      const first = render(<NewRecord />);
      expect(screen.queryByText('Draft restored')).toBeNull();
      type('Project name', 'Apollo');
      expect(JSON.parse(window.localStorage.getItem('bauhaus-saving-draft') as string)).toEqual({ name: 'Apollo', notes: '' });
      first.unmount();
      render(<NewRecord />);
      expect(screen.getByText('Draft restored')).toBeTruthy();
      expect((screen.getByLabelText('Project name') as HTMLInputElement).value).toBe('Apollo');
    });

    it('Discard clears the draft, the fields and the Banner, and focuses the first field', () => {
      window.localStorage.setItem('bauhaus-saving-draft', JSON.stringify({ name: 'Apollo', notes: 'Kick-off' }));
      render(<NewRecord />);
      fireEvent.click(screen.getByRole('button', { name: 'Discard' }));
      expect(window.localStorage.getItem('bauhaus-saving-draft')).toBeNull();
      expect(screen.queryByText('Draft restored')).toBeNull();
      expect((screen.getByLabelText('Project name') as HTMLInputElement).value).toBe('');
      expect(document.activeElement).toBe(screen.getByLabelText('Project name'));
    });

    it('drops the draft once the record is created', async () => {
      render(<NewRecord onCreate={() => Promise.resolve()} />);
      type('Project name', 'Apollo');
      fireEvent.click(screen.getByRole('button', { name: 'Create project' }));
      await waitFor(() => expect(status().textContent).toMatch(/Saved at/));
      expect(window.localStorage.getItem('bauhaus-saving-draft')).toBeNull();
    });

    it('does not warn on leave and still works when storage throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
      const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
      render(<NewRecord />);
      type('Project name', 'Apollo');
      expect((screen.getByLabelText('Project name') as HTMLInputElement).value).toBe('Apollo');
      const event = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
      spy.mockRestore();
      set.mockRestore();
    });
  });

  describe('update: warn before leaving', () => {
    it('leaves at once when nothing is unsaved', () => {
      const onLeave = vi.fn();
      render(<EditRecord onLeave={onLeave} />);
      fireEvent.click(screen.getByRole('button', { name: 'Back to projects' }));
      expect(screen.queryByRole('alertdialog', hidden)).toBeNull();
      expect(onLeave).toHaveBeenCalledOnce();
    });

    it('opens a destructive confirmation when changes are unsaved, and Keep editing stays', () => {
      const onLeave = vi.fn();
      render(<EditRecord onLeave={onLeave} />);
      type('Project name', 'Apollo 2');
      fireEvent.click(screen.getByRole('button', { name: 'Back to projects' }));
      const dialog = screen.getByRole('alertdialog', { name: 'Leave without saving?', ...hidden });
      expect(dialog).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Leave', ...hidden }).className).toContain('ds-button--danger');
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Keep editing', ...hidden }));
      fireEvent.click(screen.getByRole('button', { name: 'Keep editing', ...hidden }));
      expect(onLeave).not.toHaveBeenCalled();
      expect((screen.getByLabelText('Project name') as HTMLInputElement).value).toBe('Apollo 2');
    });

    it('leaves when the user confirms Leave', () => {
      const onLeave = vi.fn();
      render(<EditRecord onLeave={onLeave} />);
      type('Project name', 'Apollo 2');
      fireEvent.click(screen.getByRole('button', { name: 'Back to projects' }));
      fireEvent.click(screen.getByRole('button', { name: 'Leave', ...hidden }));
      expect(onLeave).toHaveBeenCalledOnce();
    });

    it('holds the browser prompt only while changes are unsaved', async () => {
      render(<EditRecord onSave={() => Promise.resolve()} />);
      const fire = () => {
        const event = new Event('beforeunload', { cancelable: true });
        window.dispatchEvent(event);
        return event.defaultPrevented;
      };
      expect(fire()).toBe(false);
      type('Project name', 'Apollo 2');
      expect(fire()).toBe(true);
      await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Save changes' })));
      expect(status().textContent).toMatch(/Saved at/);
      expect(fire()).toBe(false);
    });

    it('removes the browser prompt when the page unmounts', () => {
      const { unmount } = render(<EditRecord initialStatus="unsaved" />);
      unmount();
      const event = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  it('has no axe violations: each indicator state, a draft Banner and the leave dialog', async () => {
    const { container, rerender } = render(<SaveIndicator status="idle" />);
    for (const state of ['unsaved', 'saving', 'saved', 'failed'] as const) {
      rerender(<SaveIndicator status={state} onRetry={() => undefined} />);
      await expectNoAxeViolations(container);
    }
    window.localStorage.setItem('bauhaus-saving-draft', JSON.stringify({ name: 'Apollo', notes: '' }));
    rerender(<NewRecord />);
    await expectNoAxeViolations(container);
    rerender(<EditRecord inline initialStatus="unsaved" initialAsking />);
    await expectNoAxeViolations(container);
  });
});
