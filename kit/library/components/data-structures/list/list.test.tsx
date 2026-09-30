import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { List, ListItem } from './list';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('List', () => {
  it('is a semantic ul of li rows, or an ol when ordered', () => {
    const { rerender } = render(<List aria-label="Files"><ListItem title="One" /><ListItem title="Two" /></List>);
    expect(screen.getByRole('list').tagName).toBe('UL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    rerender(<List ordered aria-label="Steps"><ListItem title="One" /></List>);
    expect(screen.getByRole('list').tagName).toBe('OL');
  });

  it('renders leading, title, description and trailing', () => {
    render(<List><ListItem leading={<span>L</span>} title="Invoice 12" description="Due Friday" trailing={<span>$40</span>} /></List>);
    const row = screen.getByRole('listitem');
    expect(row.textContent).toContain('L');
    expect(row.textContent).toContain('Invoice 12');
    expect(row.textContent).toContain('Due Friday');
    expect(row.textContent).toContain('$40');
  });

  it('a static row holds no interactive element', () => {
    render(<List><ListItem title="Plain" /></List>);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('an href makes the row one link named by the title', () => {
    render(<List><ListItem title="Invoice 12" description="Due Friday" href="/invoices/12" /></List>);
    const link = screen.getByRole('link', { name: 'Invoice 12' });
    expect(link.getAttribute('href')).toBe('/invoices/12');
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('onPress makes the row one button and calls it', () => {
    const onPress = vi.fn();
    render(<List><ListItem title="Open settings" onPress={onPress} /></List>);
    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('never nests an interactive element in another', () => {
    const { container } = render(<List><ListItem title="A" href="/a" trailing={<span>3</span>} /><ListItem title="B" onPress={() => undefined} /></List>);
    expect(container.querySelectorAll('a a, a button, button a, button button')).toHaveLength(0);
  });

  it('marks the selected row: aria-current on a link, aria-pressed on a button', () => {
    render(<List><ListItem title="A" href="/a" selected /><ListItem title="B" onPress={() => undefined} selected /></List>);
    expect(screen.getByRole('link').getAttribute('aria-current')).toBe('true');
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
  });

  it('a disabled row is a disabled button and ignores presses', () => {
    const onPress = vi.fn();
    render(<List><ListItem title="Archive" description="Needs the owner role." onPress={onPress} disabled /></List>);
    const button = screen.getByRole('button', { name: 'Archive' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('divided adds the divider modifier', () => {
    render(<List divided><ListItem title="A" /></List>);
    expect(screen.getByRole('list').className).toContain('ds-list--divided');
  });

  it('loading shows skeleton rows with aria-busy in place of the rows', () => {
    render(<List loading skeletonRows={2}><ListItem title="Hidden" /></List>);
    expect(screen.getByRole('list').getAttribute('aria-busy')).toBe('true');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByText('Hidden')).toBeNull();
    expect(screen.getByText('Loading items')).toBeTruthy();
  });

  it('none renders the empty slot and no empty list', () => {
    render(<List empty={<p>No files yet.</p>} />);
    expect(screen.getByText('No files yet.')).toBeTruthy();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('error renders an alert in place of the rows', () => {
    render(<List error="Could not load files."><ListItem title="Hidden" /></List>);
    expect(screen.getByRole('alert').textContent).toBe('Could not load files.');
    expect(screen.queryByText('Hidden')).toBeNull();
  });

  it('partial renders a status under the rows', () => {
    render(<List partial="2 files could not be loaded."><ListItem title="A" /></List>);
    expect(screen.getByRole('status').textContent).toBe('2 files could not be loaded.');
    expect(screen.getByText('A')).toBeTruthy();
  });

  it('has no axe violations static, interactive, loading, empty and in error', async () => {
    const { container } = render(
      <>
        <List aria-label="Static" divided><ListItem title="A" description="d" leading={<span aria-hidden="true">•</span>} trailing="3" /></List>
        <List aria-label="Interactive"><ListItem title="B" href="/b" selected /><ListItem title="C" onPress={() => undefined} /><ListItem title="D" onPress={() => undefined} disabled /></List>
        <List aria-label="Loading" loading />
        <List empty={<p>Empty</p>} />
        <List error="Failed" />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
