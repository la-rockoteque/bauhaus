import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Banner } from './banner';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('Banner', () => {
  it('is a polite status region by default', () => {
    render(<Banner status="success">Saved.</Banner>);
    expect(screen.getByRole('status').textContent).toContain('Saved.');
  });

  it('uses role alert only for an urgent error', () => {
    const { rerender } = render(<Banner status="error" urgent>Payment failed.</Banner>);
    expect(screen.getByRole('alert')).toBeTruthy();
    rerender(<Banner status="warning" urgent>Low disk space.</Banner>);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it.each([['info', 'Information'], ['success', 'Success'], ['warning', 'Warning'], ['error', 'Error']] as const)(
    'names the %s status with an icon, not only a colour',
    (status, word) => {
      render(<Banner status={status}>Message</Banner>);
      expect(screen.getByRole('img', { name: word })).toBeTruthy();
    },
  );

  it('renders the title, body and actions', () => {
    render(<Banner title="Update ready" actions={<button type="button">Restart</button>}>Restart to apply.</Banner>);
    expect(screen.getByText('Update ready')).toBeTruthy();
    expect(screen.getByText('Restart to apply.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Restart' })).toBeTruthy();
  });

  it('shows a labelled close button that calls onDismiss', () => {
    const onDismiss = vi.fn();
    render(<Banner onDismiss={onDismiss} dismissLabel="Dismiss message">Hello</Banner>);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss message' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('shows no close button without onDismiss', () => {
    render(<Banner>Hello</Banner>);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('has no axe violations in every status, with title, actions and close button', async () => {
    const { container } = render(
      <>
        {(['info', 'success', 'warning', 'error'] as const).map((status) => (
          <Banner key={status} status={status} title="Title" actions={<button type="button">Act</button>} onDismiss={() => {}} dismissLabel="Dismiss">Body text</Banner>
        ))}
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
