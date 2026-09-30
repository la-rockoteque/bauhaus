import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../../clickables/button/button';
import { Modal } from './modal';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';
import { stubModal } from '../../../stub-modal';

const showModal = stubModal();

afterEach(() => showModal.mockClear());

function Harness({ dismissOnScrim = false }: { dismissOnScrim?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit address</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Edit address" closeLabel="Close" dismissOnScrim={dismissOnScrim} footer={<Button>Save</Button>}>
        <input aria-label="Street" />
      </Modal>
    </>
  );
}

const dialogEl = () => document.querySelector('dialog') as HTMLDialogElement;

describe('Modal', () => {
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
    render(<Modal open onClose={() => {}} title="Saved">Nothing to press.</Modal>);
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Saved', hidden: true }));
  });

  it('focuses the data-autofocus element first', () => {
    render(<Modal open onClose={() => {}} title="Pick" footer={<><Button>One</Button><Button data-autofocus>Two</Button></>}>Body</Modal>);
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
    render(<Modal open inline onClose={() => {}} title="Shipping" busy>Loading</Modal>);
    expect(screen.getByText('Loading').getAttribute('aria-busy')).toBe('true');
  });

  it('inline renders open in the flow without calling showModal', () => {
    render(<Modal open inline onClose={() => {}} title="Preview">Body</Modal>);
    expect(showModal).not.toHaveBeenCalled();
    expect(dialogEl().hasAttribute('open')).toBe(true);
  });

  it('has no axe violations open and inline', async () => {
    const { container } = render(
      <>
        <Modal open inline onClose={() => {}} title="Edit address" closeLabel="Close" footer={<Button>Save</Button>}>
          <input aria-label="Street" />
        </Modal>
      </>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('Modal native close and non-element opener', () => {
  it('reports onClose when the browser closes an open dialog on its own', () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="Edit address">Body</Modal>);
    fireEvent(dialogEl(), new Event('close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not report onClose for a close event while the dialog is not open', () => {
    const onClose = vi.fn();
    render(<Modal open={false} onClose={onClose} title="Edit address">Body</Modal>);
    fireEvent(dialogEl(), new Event('close'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('opens and closes when focus sat on a non-HTML element such as an SVG', () => {
    const { rerender } = render(<svg tabIndex={0} aria-label="Chart" data-testid="chart" />);
    const chart = screen.getByTestId('chart');
    chart.focus();
    expect(document.activeElement).toBe(chart);
    rerender(<><svg tabIndex={0} aria-label="Chart" data-testid="chart" /><Modal open onClose={() => undefined} title="Edit address">Body</Modal></>);
    expect(dialogEl().hasAttribute('open')).toBe(true);
    rerender(<><svg tabIndex={0} aria-label="Chart" data-testid="chart" /><Modal open={false} onClose={() => undefined} title="Edit address">Body</Modal></>);
    expect(dialogEl().hasAttribute('open')).toBe(false);
  });
});
