import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { Button } from '../../clickables/button/button';
import { ConfirmDialog } from './confirm-dialog';
import { Dialog } from './dialog';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

// jsdom has no HTMLDialogElement.showModal. This stand-in follows the platform: open, focus the
// first focusable element (or the dialog), close on Escape through the cancel event, fire close.
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const showModal = vi.fn();

beforeAll(() => {
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
});

afterEach(() => showModal.mockClear());

function Harness({ dismissOnScrim = false }: { dismissOnScrim?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit address</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Edit address" closeLabel="Close" dismissOnScrim={dismissOnScrim} footer={<Button>Save</Button>}>
        <input aria-label="Street" />
      </Dialog>
    </>
  );
}

const dialogEl = () => document.querySelector('dialog') as HTMLDialogElement;

describe('Dialog', () => {
  it('opens as a modal native dialog labelled by its title', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit address' }));
    expect(showModal).toHaveBeenCalledTimes(1);
    const dialog = dialogEl();
    expect(dialog.tagName).toBe('DIALOG');
    const title = screen.getByRole('heading', { name: 'Edit address' });
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
  });

  it('moves focus in on open, to the first focusable element', () => {
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Edit address' });
    opener.focus();
    fireEvent.click(opener);
    expect(dialogEl().contains(document.activeElement)).toBe(true);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close', hidden: true }));
  });

  it('falls back to the title when nothing inside is focusable', () => {
    render(<Dialog open onClose={() => {}} title="Saved">Nothing to press.</Dialog>);
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Saved', hidden: true }));
  });

  it('focuses the data-autofocus element first', () => {
    render(<Dialog open onClose={() => {}} title="Pick" footer={<><Button>One</Button><Button data-autofocus>Two</Button></>}>Body</Dialog>);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Two', hidden: true }));
  });

  it('is modal: it opens through showModal, so the platform traps focus and makes the page inert', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit address' }));
    expect(showModal).toHaveBeenCalled();
    expect(dialogEl().hasAttribute('open')).toBe(true);
  });

  it('closes on Escape and returns focus to the trigger', () => {
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Edit address' });
    opener.focus();
    fireEvent.click(opener);
    expect(dialogEl().hasAttribute('open')).toBe(true);
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(dialogEl().hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(opener);
  });

  it('closes from the close button', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit address' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close', hidden: true }));
    expect(dialogEl().hasAttribute('open')).toBe(false);
  });

  it('ignores a scrim click by default and closes on it when allowed', () => {
    const { unmount } = render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit address' }));
    fireEvent.click(dialogEl());
    expect(dialogEl().hasAttribute('open')).toBe(true);
    unmount();
    render(<Harness dismissOnScrim />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit address' }));
    fireEvent.click(dialogEl());
    expect(dialogEl().hasAttribute('open')).toBe(false);
  });

  it('does not close when the click lands inside the panel', () => {
    render(<Harness dismissOnScrim />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit address' }));
    fireEvent.click(screen.getByLabelText('Street', { selector: 'input' }));
    expect(dialogEl().hasAttribute('open')).toBe(true);
  });

  it('marks the body busy while loading', () => {
    render(<Dialog open inline onClose={() => {}} title="Shipping" busy>Loading</Dialog>);
    expect(screen.getByText('Loading').getAttribute('aria-busy')).toBe('true');
  });

  it('inline renders open in the flow without calling showModal', () => {
    render(<Dialog open inline onClose={() => {}} title="Preview">Body</Dialog>);
    expect(showModal).not.toHaveBeenCalled();
    expect(dialogEl().hasAttribute('open')).toBe(true);
  });

  it('has no axe violations open, inline and as an alert dialog', async () => {
    const { container } = render(
      <>
        <Dialog open inline onClose={() => {}} title="Edit address" closeLabel="Close" footer={<Button>Save</Button>}>
          <input aria-label="Street" />
        </Dialog>
        <ConfirmDialog open inline onClose={() => {}} onConfirm={() => {}} title="Delete project" description="This removes 3 files." confirmLabel="Delete project" cancelLabel="Cancel" destructive />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('ConfirmDialog', () => {
  it('is an alertdialog named by its title and described by its message', () => {
    render(<ConfirmDialog open onClose={() => {}} onConfirm={() => {}} title="Delete project" description="This removes 3 files." confirmLabel="Delete project" cancelLabel="Cancel" />);
    const dialog = screen.getByRole('alertdialog', { name: 'Delete project', hidden: true });
    expect(dialog.getAttribute('aria-describedby')).toBe(screen.getByText('This removes 3 files.').id);
  });

  it('starts focus on Cancel when destructive, and on the confirm action otherwise', () => {
    const { rerender } = render(<ConfirmDialog open onClose={() => {}} onConfirm={() => {}} title="Delete" description="Sure?" confirmLabel="Delete project" cancelLabel="Cancel" destructive />);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel', hidden: true }));
    rerender(<ConfirmDialog key="plain" open onClose={() => {}} onConfirm={() => {}} title="Publish" description="Sure?" confirmLabel="Publish page" cancelLabel="Cancel" />);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Publish page', hidden: true }));
  });

  it('calls onConfirm and onClose from its two actions', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(<ConfirmDialog open inline onClose={onClose} onConfirm={onConfirm} title="Delete" description="Sure?" confirmLabel="Delete project" cancelLabel="Cancel" />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});


describe('Dialog native close and non-element opener', () => {
  it('reports onClose when the browser closes an open dialog on its own', () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} title="Edit address">Body</Dialog>);
    fireEvent(dialogEl(), new Event('close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not report onClose for a close event while the dialog is not open', () => {
    const onClose = vi.fn();
    render(<Dialog open={false} onClose={onClose} title="Edit address">Body</Dialog>);
    fireEvent(dialogEl(), new Event('close'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('opens and closes when focus sat on a non-HTML element such as an SVG', () => {
    const { rerender } = render(<svg tabIndex={0} aria-label="Chart" data-testid="chart" />);
    const chart = screen.getByTestId('chart');
    chart.focus();
    expect(document.activeElement).toBe(chart);
    rerender(<><svg tabIndex={0} aria-label="Chart" data-testid="chart" /><Dialog open onClose={() => undefined} title="Edit address">Body</Dialog></>);
    expect(dialogEl().hasAttribute('open')).toBe(true);
    rerender(<><svg tabIndex={0} aria-label="Chart" data-testid="chart" /><Dialog open={false} onClose={() => undefined} title="Edit address">Body</Dialog></>);
    expect(dialogEl().hasAttribute('open')).toBe(false);
  });
});
