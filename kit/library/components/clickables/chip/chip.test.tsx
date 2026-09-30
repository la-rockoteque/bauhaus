import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Chip } from './chip';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('Chip', () => {
  afterEach(() => vi.restoreAllMocks());

  it('static: shows the text and holds no control', () => {
    render(<Chip>Status: Shipped</Chip>);
    expect(screen.getByText('Status: Shipped')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('removable: the remove button names what it removes, and calls onRemove', () => {
    const onRemove = vi.fn();
    render(<Chip variant="removable" removeLabel="Remove filter" onRemove={onRemove}>Status: Shipped</Chip>);
    const button = screen.getByRole('button', { name: 'Remove filter Status: Shipped' });
    fireEvent.click(button);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('removable: the remove button defaults to "Remove" plus the label', () => {
    render(<Chip variant="removable">Europe</Chip>);
    expect(screen.getByRole('button', { name: 'Remove Europe' })).toBeTruthy();
  });

  it('removable: the label and the button share one shape (one container, no second outline)', () => {
    const { container } = render(<Chip variant="removable">Europe</Chip>);
    const chip = container.querySelector('.ds-chip')!;
    expect(chip.querySelector('.ds-chip__label')).not.toBeNull();
    expect(chip.querySelector('.ds-chip__remove')).not.toBeNull();
    expect(container.querySelectorAll('.ds-chip')).toHaveLength(1);
  });

  it('removable: Enter and Space press the remove button', async () => {
    const onRemove = vi.fn();
    render(<Chip variant="removable" onRemove={onRemove}>Europe</Chip>);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Remove Europe' }));
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onRemove).toHaveBeenCalledTimes(2);
  });

  it('selectable: toggles aria-pressed on click, Enter and Space, and reports the new state', async () => {
    const onSelectedChange = vi.fn();
    render(<Chip variant="selectable" onSelectedChange={onSelectedChange}>Only returns</Chip>);
    const chip = screen.getByRole('button', { name: 'Only returns' });
    expect(chip.getAttribute('aria-pressed')).toBe('false');
    await userEvent.click(chip);
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    await userEvent.keyboard('{Enter}');
    expect(chip.getAttribute('aria-pressed')).toBe('false');
    await userEvent.keyboard(' ');
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    expect(onSelectedChange.mock.calls.map(([value]) => value)).toEqual([true, false, true]);
  });

  it('selectable: a controlled chip follows the selected prop', async () => {
    const onSelectedChange = vi.fn();
    const { rerender } = render(<Chip variant="selectable" selected={false} onSelectedChange={onSelectedChange}>Only returns</Chip>);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('false');
    rerender(<Chip variant="selectable" selected onSelectedChange={onSelectedChange}>Only returns</Chip>);
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
  });

  it('selectable: shows a check when selected, so colour is not the only cue', () => {
    const { container } = render(<Chip variant="selectable" defaultSelected>Only returns</Chip>);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('disabled: a selectable chip ignores presses; a removable chip disables its button', async () => {
    const onSelectedChange = vi.fn();
    const onRemove = vi.fn();
    render(<><Chip variant="selectable" disabled onSelectedChange={onSelectedChange}>Only returns</Chip><Chip variant="removable" disabled onRemove={onRemove}>Europe</Chip></>);
    await userEvent.click(screen.getByRole('button', { name: 'Only returns' }));
    await userEvent.click(screen.getByRole('button', { name: 'Remove Europe' }));
    expect(onSelectedChange).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('a long label keeps its whole text in the accessible name and opens a tooltip while cut short', async () => {
    const long = 'Customer: Maria del Carmen Guadalupe de los Santos Fernandez-Villalobos';
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(200);
    render(<Chip variant="removable" removeLabel="Remove filter">{long}</Chip>);
    expect(screen.getByRole('button', { name: `Remove filter ${long}` })).toBeTruthy();
    await userEvent.hover(screen.getByText(long));
    expect((await screen.findByRole('tooltip', undefined, { timeout: 2000 })).textContent).toBe(long);
  });

  it('a removable chip that is cut short keeps the remove button as its only tab stop', async () => {
    const long = 'Customer: Maria del Carmen Guadalupe de los Santos Fernandez-Villalobos';
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(200);
    render(<Chip variant="removable">{long}</Chip>);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: `Remove ${long}` }));
  });

  it('a static chip that is cut short can take focus, so a keyboard user reaches the tooltip', async () => {
    const long = 'Customer: Maria del Carmen Guadalupe de los Santos Fernandez-Villalobos';
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(200);
    render(<Chip>{long}</Chip>);
    await userEvent.tab();
    expect(document.activeElement?.className).toBe('ds-chip__label');
    expect((await screen.findByRole('tooltip', undefined, { timeout: 2000 })).textContent).toBe(long);
  });

  it('a label that fits has no tooltip and no tab stop', async () => {
    render(<Chip>Europe</Chip>);
    await userEvent.tab();
    expect(document.activeElement).toBe(document.body);
  });

  it('has no axe violations in every variant and state', async () => {
    const { container } = render(
      <ul>
        <li><Chip>Europe</Chip></li>
        <li><Chip variant="removable" removeLabel="Remove filter">Status: Shipped</Chip></li>
        <li><Chip variant="removable" disabled>Region: Asia</Chip></li>
        <li><Chip variant="selectable">Only returns</Chip></li>
        <li><Chip variant="selectable" defaultSelected>Only returns</Chip></li>
        <li><Chip variant="selectable" disabled>Archived</Chip></li>
      </ul>,
    );
    await expectNoAxeViolations(container);
  });

  it('re-measures a label when its box is resized, and stops watching on unmount', async () => {
    const long = 'Customer: Maria del Carmen Guadalupe de los Santos Fernandez-Villalobos';
    let notify: () => void = () => undefined;
    const disconnect = vi.fn();
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) { notify = callback; }
      observe() {}
      disconnect = disconnect;
    });
    const width = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(100);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(200);
    const { unmount } = render(<Chip>{long}</Chip>);
    expect(screen.getByText(long).getAttribute('role')).toBeNull();
    width.mockReturnValue(400);
    act(() => notify());
    expect(screen.getByRole('img', { name: long })).toBeTruthy();
    unmount();
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('selectable: calls the caller onClick as well as toggling', async () => {
    const onClick = vi.fn();
    render(<Chip variant="selectable" onClick={onClick}>Only returns</Chip>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
  });

  it('selectable: a label cut short opens a tooltip with the whole text', async () => {
    const long = 'Customer: Maria del Carmen Guadalupe de los Santos Fernandez-Villalobos';
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(200);
    render(<Chip variant="selectable">{long}</Chip>);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: long }));
    expect((await screen.findByRole('tooltip', undefined, { timeout: 2000 })).textContent).toBe(long);
  });
});
