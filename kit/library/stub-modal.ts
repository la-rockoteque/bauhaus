import { vi } from 'vitest';

// jsdom has no HTMLDialogElement.showModal. This stand-in follows the platform: open, focus the
// first focusable element (or the dialog), close on Escape through the cancel event, fire close.
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Install the stand-in once per test file. The returned mock counts the showModal calls. */
export function stubModal(): ReturnType<typeof vi.fn> {
  const showModal = vi.fn();
  HTMLDialogElement.prototype.showModal = function showModalStub(this: HTMLDialogElement) {
    showModal();
    this.setAttribute('open', '');
    (this.querySelector<HTMLElement>(FOCUSABLE) ?? this).focus();
  };
  HTMLDialogElement.prototype.close = function closeStub(this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
  document.addEventListener('keydown', (event) => {
    const dialog = document.querySelector<HTMLDialogElement>('dialog[open]');
    if (event.key !== 'Escape' || !dialog) return;
    const cancel = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancel);
    if (!cancel.defaultPrevented) dialog.close();
  });
  return showModal;
}
