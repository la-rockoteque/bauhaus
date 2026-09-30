import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../../clickables/button/button';
import { Popover } from './popover';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

const setup = (props: Partial<Parameters<typeof Popover>[0]> = {}) =>
  render(
    <>
      <Popover trigger={<Button>Filters</Button>} label="Filters" {...props}>
        {({ close }) => <Button onClick={close}>Apply filters</Button>}
      </Popover>
      <Button>Outside</Button>
    </>,
  );

describe('Popover', () => {
  it('opens from its trigger, which exposes the popup', () => {
    setup();
    const trigger = screen.getByRole('button', { name: 'Filters' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
  });

  it('dismisses on Escape and returns focus to the trigger', async () => {
    setup();
    const trigger = screen.getByRole('button', { name: 'Filters' });
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('dismisses from an action inside through close', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('modal: an outside press dismisses it', () => {
    setup({ modal: true });
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.pointerDown(document.body, { pointerType: 'mouse' });
    fireEvent.pointerUp(document.body, { pointerType: 'mouse' });
    fireEvent.click(document.body);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('non-modal: the page behind stays reachable', () => {
    setup({ defaultOpen: true });
    expect(screen.getByRole('button', { name: 'Outside' }).closest('[aria-hidden="true"]')).toBeNull();
  });

  it('has no axe violations closed and open', async () => {
    const { container } = setup();
    await expectNoAxeViolations(container);
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    await expectNoAxeViolations(document.body);
  });

  it('without a trigger, draws a named dialog in the flow with its content', () => {
    render(<Popover label="Filters"><p>Preview content</p></Popover>);
    const dialog = screen.getByRole('dialog', { name: 'Filters' });
    expect(dialog.textContent).toBe('Preview content');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('without a trigger, a function child still renders, its close doing nothing', () => {
    render(
      <Popover label="Filters">
        {({ close }) => <Button onClick={close}>Apply filters</Button>}
      </Popover>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
  });
});
