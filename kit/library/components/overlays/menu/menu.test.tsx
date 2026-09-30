import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Button } from '../../clickables/button/button';
import { MenuItem } from '../../clickables/menu-item/menu-item';
import { Menu, MenuSection, MenuSeparator } from './menu';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

// jsdom has no CSS.escape, which React Aria uses to find the focused item.
beforeAll(() => {
  if (!globalThis.CSS?.escape) Object.assign((globalThis.CSS ??= {} as typeof CSS), { escape: (value: string) => value.replace(/[^\w-]/g, (c) => `\\${c}`) });
});

const setup = (props: Partial<Parameters<typeof Menu>[0]> = {}) =>
  render(
    <Menu trigger={<Button>Actions</Button>} label="Actions" {...props}>
      <MenuItem id="rename" shortcut="F2">Rename</MenuItem>
      <MenuItem id="duplicate">Duplicate</MenuItem>
      <MenuItem id="archive" isDisabled>Archive</MenuItem>
      <MenuSeparator />
      <MenuItem id="delete" destructive>Delete project</MenuItem>
    </Menu>,
  );

const open = () => {
  const trigger = screen.getByRole('button', { name: 'Actions' });
  act(() => trigger.focus());
  fireEvent.keyDown(trigger, { key: 'Enter' });
  fireEvent.keyUp(trigger, { key: 'Enter' });
  return trigger;
};

const items = () => screen.getAllByRole('menuitem');

describe('Menu', () => {
  it('opens on Enter, names the menu, and focuses the menu', () => {
    setup();
    const trigger = open();
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(screen.getByRole('menu', { name: 'Actions' })).toBeTruthy();
    expect(items().map((item) => item.textContent)).toEqual(['RenameF2', 'Duplicate', 'Archive', 'Delete project']);
  });

  it('opens on ArrowDown and focuses the first item', () => {
    setup({ autoFocus: 'first' });
    const trigger = screen.getByRole('button', { name: 'Actions' });
    act(() => trigger.focus());
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyUp(trigger, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items()[0]);
  });

  it('moves with the arrow keys and skips the disabled item', () => {
    setup({ autoFocus: 'first' });
    open();
    const menu = screen.getByRole('menu');
    expect(document.activeElement).toBe(items()[0]);
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items()[1]);
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items()[3]);
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(items()[1]);
  });

  it('jumps to an item by typeahead', () => {
    setup({ autoFocus: 'first' });
    open();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'd' });
    expect(document.activeElement).toBe(items()[1]);
    fireEvent.keyDown(document.activeElement as Element, { key: 'e' });
    expect(document.activeElement).toBe(items()[3]);
  });

  it('activates an item on Enter and closes', () => {
    const onAction = vi.fn();
    setup({ autoFocus: 'first', onAction });
    open();
    fireEvent.keyDown(document.activeElement as Element, { key: 'Enter' });
    fireEvent.keyUp(document.activeElement as Element, { key: 'Enter' });
    expect(onAction.mock.calls[0][0]).toBe('rename');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    setup({ autoFocus: 'first' });
    const trigger = open();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('exposes the disabled item as disabled', () => {
    setup();
    open();
    expect(screen.getByRole('menuitem', { name: 'Archive' }).getAttribute('aria-disabled')).toBe('true');
  });

  it('single selection: menuitemradio, one checked', () => {
    setup({ selectionMode: 'single', defaultSelectedKeys: ['duplicate'] });
    open();
    const radios = screen.getAllByRole('menuitemradio');
    expect(radios.map((radio) => radio.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false', 'false']);
  });

  it('multiple selection: menuitemcheckbox toggles without closing', () => {
    const onSelectionChange = vi.fn();
    setup({ selectionMode: 'multiple', defaultSelectedKeys: ['rename'], onSelectionChange });
    open();
    const boxes = screen.getAllByRole('menuitemcheckbox');
    expect(boxes[0].getAttribute('aria-checked')).toBe('true');
    fireEvent.click(boxes[1]);
    expect(onSelectionChange).toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(screen.getAllByRole('menuitemcheckbox')[1].getAttribute('aria-checked')).toBe('true');
  });

  it('names a section for assistive technology', () => {
    render(
      <Menu trigger={<Button>Actions</Button>} label="Actions" defaultOpen>
        <MenuSection title="File"><MenuItem id="open">Open</MenuItem></MenuSection>
      </Menu>,
    );
    expect(within(screen.getByRole('menu')).getByRole('group', { name: 'File' })).toBeTruthy();
  });

  it('has no axe violations closed and open', async () => {
    const { container } = setup();
    await expectNoAxeViolations(container);
    open();
    await expectNoAxeViolations(document.body);
  });
});

describe('Menu without a trigger', () => {
  it('draws the open menu in the flow, named by its label, with no popover', () => {
    render(
      <Menu label="Actions">
        <MenuItem id="rename">Rename</MenuItem>
        <MenuItem id="duplicate">Duplicate</MenuItem>
      </Menu>,
    );
    expect(screen.getByRole('menu', { name: 'Actions' })).toBeTruthy();
    expect(items().map((item) => item.textContent)).toEqual(['Rename', 'Duplicate']);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
