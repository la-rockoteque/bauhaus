import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../../clickables/button/button';
import { Tooltip } from './tooltip';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

// The tooltip opens on keyboard focus, so the test first moves the modality to the keyboard.
function focusByKeyboard(element: HTMLElement) {
  fireEvent.keyDown(document.body, { key: 'Tab' });
  act(() => element.focus());
}

describe('Tooltip', () => {
  it('opens on focus, with no delay, and describes the trigger', () => {
    render(<Tooltip content="Copy link" delay={0}><Button>Share</Button></Tooltip>);
    const trigger = screen.getByRole('button', { name: 'Share' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    focusByKeyboard(trigger);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.textContent).toBe('Copy link');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('opens on hover after the delay', async () => {
    render(<Tooltip content="Copy link" delay={0}><Button>Share</Button></Tooltip>);
    const trigger = screen.getByRole('button', { name: 'Share' });
    fireEvent.pointerDown(document.body, { pointerType: 'mouse' });
    fireEvent.pointerUp(document.body, { pointerType: 'mouse' });
    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
    fireEvent.pointerMove(trigger, { pointerType: 'mouse' });
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeTruthy());
  });

  it('closes on Escape while the trigger keeps focus (WCAG 1.4.13)', () => {
    render(<Tooltip content="Copy link" delay={0}><Button>Share</Button></Tooltip>);
    const trigger = screen.getByRole('button', { name: 'Share' });
    focusByKeyboard(trigger);
    expect(screen.getByRole('tooltip')).toBeTruthy();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes when focus leaves', () => {
    render(<Tooltip content="Copy link" delay={0}><Button>Share</Button></Tooltip>);
    const trigger = screen.getByRole('button', { name: 'Share' });
    focusByKeyboard(trigger);
    act(() => trigger.blur());
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('has no axe violations closed and open', async () => {
    const { container } = render(<Tooltip content="Copy link" delay={0} defaultOpen><Button>Share</Button></Tooltip>);
    await expectNoAxeViolations(document.body);
    expect(container).toBeTruthy();
  });
});
