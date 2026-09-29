import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { GridCellEditor } from './GridCellEditor';

/**
 * The editor is tested on its own rather than through the grid: opening one goes through
 * react-data-grid's roving-tabindex query, which uses an `&` selector happy-dom cannot parse.
 * What is worth testing is here anyway — which way out of the editor keeps the value.
 */
function setup(initialValue = '10') {
  const onCommit = vi.fn();
  const onCancel = vi.fn();
  render(<GridCellEditor initialValue={initialValue} onCommit={onCommit} onCancel={onCancel} />);
  const editor = screen.getByRole('textbox');
  fireEvent.change(editor, { target: { value: '99' } });
  return { editor, onCommit, onCancel };
}

describe('GridCellEditor', () => {
  it('opens on the cell’s current value', () => {
    render(<GridCellEditor initialValue="42" onCommit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('42');
  });

  it.each(['Enter', 'Tab'])('commits what was typed on %s', (key) => {
    const { editor, onCommit } = setup();
    // React fires no blur on an element it unmounts, so the closing key has to commit itself.
    fireEvent.keyDown(editor, { key });
    expect(onCommit).toHaveBeenCalledWith('99');
  });

  it('commits on blur, for the click that lands outside', () => {
    const { editor, onCommit } = setup();
    fireEvent.blur(editor);
    expect(onCommit).toHaveBeenCalledWith('99');
  });

  it('throws the edit away on Escape, and the blur behind it changes nothing', () => {
    const { editor, onCommit, onCancel } = setup();
    fireEvent.keyDown(editor, { key: 'Escape' });
    fireEvent.blur(editor);

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('commits once, however many ways out follow — one edit is one undo step', () => {
    const { editor, onCommit } = setup();
    fireEvent.keyDown(editor, { key: 'Enter' });
    fireEvent.blur(editor);

    expect(onCommit).toHaveBeenCalledOnce();
  });
});
