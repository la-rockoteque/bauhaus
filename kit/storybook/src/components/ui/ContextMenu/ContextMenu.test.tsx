import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ContextMenu } from './ContextMenu';
import type { ContextMenuItem } from './contextMenuItems';

const copy = vi.fn();
const paste = vi.fn();

const items = (): ContextMenuItem[] => [
  { key: 'copy', label: 'Copier', hint: 'Ctrl+C', onSelect: copy },
  { key: 'r', separator: true },
  { key: 'paste', label: 'Coller', disabled: true, onSelect: paste },
  { key: 'clear', label: 'Effacer', onSelect: vi.fn() },
];

function open(onClose = vi.fn()) {
  const result = render(
    <ContextMenu at={{ x: 10, y: 10 }} items={items()} label="Actions" onClose={onClose} />,
  );
  return { ...result, onClose };
}

describe('ContextMenu', () => {
  it('is a menu, named, with its actions as menu items', () => {
    open();
    const menu = screen.getByRole('menu', { name: 'Actions' });
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    expect(menu).toHaveFocus();
  });

  it('runs an action and closes, in that order', () => {
    const { onClose } = open();
    fireEvent.click(screen.getByRole('menuitem', { name: /Copier/ }));

    expect(copy).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('will not run a disabled action', () => {
    open();
    expect(screen.getByRole('menuitem', { name: 'Coller' })).toBeDisabled();
  });

  it('moves with the arrows, skipping what is disabled', () => {
    const { onClose } = open();
    const menu = screen.getByRole('menu');

    fireEvent.keyDown(menu, { key: 'ArrowDown' }); // Copier → Effacer, over the disabled Coller
    fireEvent.keyDown(menu, { key: 'Enter' });

    expect(onClose).toHaveBeenCalledOnce();
    expect(paste).not.toHaveBeenCalled();
  });

  it('wraps at the ends, and Home goes back to the first', () => {
    const { onClose } = open();
    const menu = screen.getByRole('menu');

    fireEvent.keyDown(menu, { key: 'ArrowUp' }); // wraps to the last
    fireEvent.keyDown(menu, { key: 'Home' });
    fireEvent.keyDown(menu, { key: 'Enter' });

    expect(copy).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes on Escape', () => {
    const { onClose } = open();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes on a press outside it, before whatever is under that press reacts', () => {
    const { onClose } = open();
    fireEvent.pointerDown(document.body);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('stays open for a press on itself', () => {
    const { onClose } = open();
    fireEvent.pointerDown(screen.getByRole('menu'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when the page scrolls under it — a menu pinned to a point that moved is wrong', () => {
    const { onClose } = open();
    fireEvent.scroll(window);
    expect(onClose).toHaveBeenCalled();
  });

  it('gives focus back to whatever the right-click took it from', () => {
    const before = document.createElement('button');
    document.body.append(before);
    before.focus();

    const { unmount } = open();
    expect(screen.getByRole('menu')).toHaveFocus();

    unmount();
    expect(before).toHaveFocus();
    before.remove();
  });

  it('draws the shortcut an action already answers to', () => {
    open();
    expect(screen.getByRole('menuitem', { name: /Copier/ })).toHaveTextContent('Ctrl+C');
  });
});
