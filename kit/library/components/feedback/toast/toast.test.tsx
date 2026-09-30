import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastRegion } from './toast';
import type { ToastData } from './toast';
import { useToast } from './use-toast';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

const EXIT = 200;
// The exit timer starts in an effect after the state change, so each step needs its own act.
const advance = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });
const info: ToastData = { id: 'a', message: 'Draft saved.' };

function Harness({ onAction }: { onAction?: () => void }) {
  const { toasts, show, dismiss } = useToast();
  return (
    <>
      <button type="button" onClick={() => show({ message: 'Plain', status: 'success' })}>plain</button>
      <button type="button" onClick={() => show({ message: 'Broken', status: 'error' })}>error</button>
      <button type="button" onClick={() => show({ message: 'Deleted', action: { label: 'Undo', onAction: onAction ?? (() => {}) } })}>undo</button>
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </>
  );
}

describe('ToastRegion', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('keeps a polite status region and an assertive alert region in the page, even when empty', () => {
    render(<ToastRegion toasts={[]} onDismiss={() => {}} />);
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite');
    expect(screen.getByRole('alert').getAttribute('aria-live')).toBe('assertive');
  });

  it('puts an error in the assertive region and other statuses in the polite one', () => {
    render(<ToastRegion toasts={[{ id: 'e', status: 'error', message: 'Upload failed' }, { id: 's', status: 'success', message: 'Saved' }]} onDismiss={() => {}} />);
    expect(screen.getByRole('alert').textContent).toContain('Upload failed');
    expect(screen.getByRole('status').textContent).toContain('Saved');
    expect(screen.getByRole('alert').textContent).not.toContain('Saved');
  });

  it('names the status with an icon and a word', () => {
    render(<ToastRegion toasts={[{ id: 'w', status: 'warning', message: 'Almost full' }]} onDismiss={() => {}} />);
    expect(screen.getByRole('img', { name: 'Warning' })).toBeTruthy();
  });

  it('closes itself after the duration, after the exit animation', () => {
    const onDismiss = vi.fn();
    render(<ToastRegion toasts={[info]} onDismiss={onDismiss} duration={3000} />);
    act(() => { vi.advanceTimersByTime(2999); });
    expect(onDismiss).not.toHaveBeenCalled();
    advance(1);
    advance(EXIT);
    expect(onDismiss).toHaveBeenCalledWith('a');
  });

  it('honours a per-toast duration', () => {
    const onDismiss = vi.fn();
    render(<ToastRegion toasts={[{ ...info, duration: 1000 }]} onDismiss={onDismiss} duration={9000} />);
    advance(1000);
    advance(EXIT);
    expect(onDismiss).toHaveBeenCalledWith('a');
  });

  it('pauses on hover and resumes with the time left', () => {
    const onDismiss = vi.fn();
    render(<ToastRegion toasts={[info]} onDismiss={onDismiss} duration={4000} />);
    const toast = screen.getByText('Draft saved.').closest('li')!;
    act(() => { vi.advanceTimersByTime(3000); });
    fireEvent.mouseEnter(toast);
    act(() => { vi.advanceTimersByTime(60000); });
    expect(onDismiss).not.toHaveBeenCalled();
    fireEvent.mouseLeave(toast);
    act(() => { vi.advanceTimersByTime(999); });
    expect(onDismiss).not.toHaveBeenCalled();
    advance(1);
    advance(EXIT);
    expect(onDismiss).toHaveBeenCalledWith('a');
  });

  it('pauses while focus is inside and resumes when it leaves', () => {
    const onDismiss = vi.fn();
    render(<ToastRegion toasts={[info]} onDismiss={onDismiss} duration={2000} />);
    act(() => { screen.getByRole('button', { name: 'Dismiss notification' }).focus(); });
    act(() => { vi.advanceTimersByTime(60000); });
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => { screen.getByRole('button', { name: 'Dismiss notification' }).blur(); });
    advance(2000);
    advance(EXIT);
    expect(onDismiss).toHaveBeenCalledWith('a');
  });

  it('stays until closed when it holds an action or has no duration', () => {
    const onDismiss = vi.fn();
    const onAction = vi.fn();
    render(<ToastRegion toasts={[{ id: 'u', message: 'Deleted', action: { label: 'Undo', onAction } }, { id: 'n', message: 'Sticky', duration: null }]} onDismiss={onDismiss} />);
    act(() => { vi.advanceTimersByTime(600000); });
    expect(onDismiss).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    advance(EXIT);
    expect(onDismiss).toHaveBeenCalledWith('u');
  });

  it('closes from the close button', () => {
    const onDismiss = vi.fn();
    render(<ToastRegion toasts={[info]} onDismiss={onDismiss} dismissLabel="Close message" />);
    fireEvent.click(screen.getByRole('button', { name: 'Close message' }));
    advance(EXIT);
    expect(onDismiss).toHaveBeenCalledWith('a');
  });

  it('shows at most max toasts, and the next one appears when one closes', () => {
    const many: ToastData[] = [1, 2, 3, 4, 5].map((n) => ({ id: `t${n}`, message: `Message ${n}`, duration: null }));
    const { rerender } = render(<ToastRegion toasts={many} onDismiss={() => {}} max={3} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('+2 more')).toBeTruthy();
    rerender(<ToastRegion toasts={many.slice(1)} onDismiss={() => {}} max={3} />);
    expect(screen.getByText('Message 4')).toBeTruthy();
    expect(screen.getByText('+1 more')).toBeTruthy();
  });
});

describe('useToast', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('adds a toast, never moves focus, and removes it after the timeout', () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'plain' });
    act(() => { trigger.focus(); });
    fireEvent.click(trigger);
    expect(screen.getByText('Plain')).toBeTruthy();
    expect(document.activeElement).toBe(trigger);
    advance(5000);
    advance(EXIT);
    expect(screen.queryByText('Plain')).toBeNull();
  });

  it('announces an error in the alert region', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'error' }));
    expect(screen.getByRole('alert').textContent).toContain('Broken');
  });

  it('keeps an undo toast and runs its action', () => {
    const onAction = vi.fn();
    render(<Harness onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: 'undo' }));
    act(() => { vi.advanceTimersByTime(60000); });
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

describe('ToastRegion accessibility', () => {
  it('has no axe violations empty or with every status, an action and a title', async () => {
    const { container } = render(
      <ToastRegion
        onDismiss={() => {}}
        toasts={[
          { id: '1', status: 'info', title: 'Title', message: 'Info' },
          { id: '2', status: 'success', message: 'Success' },
          { id: '3', status: 'warning', message: 'Warning', action: { label: 'Undo', onAction: () => {} } },
          { id: '4', status: 'error', message: 'Error' },
        ]}
      />,
    );
    await expectNoAxeViolations(container);
  });
});
