import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('Badge', () => {
  it('shows a count in full up to the cap', () => {
    const { container } = render(<Badge count={7} />);
    expect(container.textContent).toBe('7');
    expect(container.firstElementChild!.querySelector('.ds-visually-hidden')).toBeNull();
  });

  it('shows 99+ above the cap and puts the full number in the accessible name', () => {
    const { container } = render(<Badge count={142} />);
    const visible = container.querySelector('[aria-hidden="true"]')!;
    expect(visible.textContent).toBe('99+');
    expect(container.querySelector('.ds-visually-hidden')!.textContent).toBe('142');
  });

  it('caps exactly at max: 99 is shown in full, 100 is 99+', () => {
    const { container, rerender } = render(<Badge count={99} />);
    expect(container.textContent).toBe('99');
    rerender(<Badge count={100} />);
    expect(container.querySelector('[aria-hidden="true"]')!.textContent).toBe('99+');
  });

  it('honours a custom max', () => {
    const { container } = render(<Badge count={12} max={9} />);
    expect(container.querySelector('[aria-hidden="true"]')!.textContent).toBe('9+');
    expect(container.querySelector('.ds-visually-hidden')!.textContent).toBe('12');
  });

  it('reads what the count counts', () => {
    const { container } = render(<Badge count={3} label="unread messages" />);
    expect(container.querySelector('.ds-visually-hidden')!.textContent).toBe('3 unread messages');
    expect(container.querySelector('[aria-hidden="true"]')!.textContent).toBe('3');
  });

  it('shows the status word', () => {
    render(<Badge status="error">Overdue</Badge>);
    expect(screen.getByText('Overdue').className).toContain('ds-badge--error');
  });

  it('is hidden from assistive technology when decorative', () => {
    const { container } = render(<Badge decorative count={4} />);
    expect(container.firstElementChild!.getAttribute('aria-hidden')).toBe('true');
  });

  it('is not hidden by default', () => {
    const { container } = render(<Badge count={4} />);
    expect(container.firstElementChild!.hasAttribute('aria-hidden')).toBe(false);
  });

  it.each(['neutral', 'info', 'success', 'warning', 'error'] as const)('applies the %s status', (status) => {
    const { container } = render(<Badge status={status}>Word</Badge>);
    expect(container.firstElementChild!.className).toContain(`ds-badge--${status}`);
  });

  it('has no axe violations for counts, statuses and a decorative badge', async () => {
    const { container } = render(
      <>
        <p>Inbox <Badge count={142} label="unread messages" /></p>
        <Badge status="success">Paid</Badge>
        <Badge status="warning" count={3} label="warnings" />
        <p>Drafts 4 <Badge decorative count={4} /></p>
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
