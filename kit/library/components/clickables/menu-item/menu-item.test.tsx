import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Button } from '../button/button';
import { Menu } from '../../overlays/menu/menu';
import { MenuItem } from './menu-item';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

// jsdom has no CSS.escape, which React Aria uses to find the focused item.
beforeAll(() => {
  if (!globalThis.CSS?.escape) Object.assign((globalThis.CSS ??= {} as typeof CSS), { escape: (value: string) => value.replace(/[^\w-]/g, (c) => `\\${c}`) });
});

const inMenu = (children: React.ReactNode, props: Partial<Parameters<typeof Menu>[0]> = {}) =>
  render(<Menu trigger={<Button>Actions</Button>} label="Actions" defaultOpen {...props}>{children}</Menu>);

describe('MenuItem', () => {
  it('is a menuitem named by its label, with the description and the shortcut apart', () => {
    inMenu(<MenuItem id="save" icon="check" description="Writes to disk" shortcut="Ctrl+S">Save</MenuItem>);
    const item = screen.getByRole('menuitem', { name: 'Save' });
    expect(item.getAttribute('aria-describedby')).toContain(screen.getByText('Writes to disk').id);
    expect(screen.getByText('Ctrl+S').tagName).toBe('KBD');
  });

  it('hides the icon from assistive technology', () => {
    inMenu(<MenuItem id="save" icon="check">Save</MenuItem>);
    expect(screen.getByRole('menuitem').querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('calls onAction when pressed', () => {
    const onAction = vi.fn();
    inMenu(<MenuItem id="save" onAction={onAction}>Save</MenuItem>);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('a disabled item does not act', () => {
    const onAction = vi.fn();
    inMenu(<MenuItem id="save" isDisabled onAction={onAction}>Save</MenuItem>);
    const item = screen.getByRole('menuitem');
    expect(item.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(item);
    expect(onAction).not.toHaveBeenCalled();
  });

  it('a destructive item carries its own class and a label that names the object', () => {
    inMenu(<MenuItem id="del" destructive>Delete project</MenuItem>);
    expect(screen.getByRole('menuitem', { name: 'Delete project' }).className).toContain('ds-menu-item--destructive');
  });

  it('shows a check for a selected item in a selecting menu', () => {
    inMenu(<MenuItem id="a">Alpha</MenuItem>, { selectionMode: 'single', defaultSelectedKeys: ['a'] });
    const item = screen.getByRole('menuitemradio', { name: 'Alpha' });
    expect(item.getAttribute('aria-checked')).toBe('true');
    expect(item.querySelector('svg')).not.toBeNull();
  });

  it('has no axe violations with every part', async () => {
    inMenu(
      <>
        <MenuItem id="save" icon="check" description="Writes to disk" shortcut="Ctrl+S">Save</MenuItem>
        <MenuItem id="off" isDisabled>Archive</MenuItem>
        <MenuItem id="del" destructive>Delete project</MenuItem>
      </>,
    );
    await expectNoAxeViolations(document.body);
  });
});
