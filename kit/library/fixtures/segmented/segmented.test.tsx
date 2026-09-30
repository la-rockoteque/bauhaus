import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Segmented } from './segmented';

function Host() {
  const [value, setValue] = useState('a');
  return <Segmented label="Pick" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }]} value={value} onChange={setValue} />;
}

describe('Segmented', () => {
  afterEach(cleanup);

  it('is a named radio group with one tab stop, on the checked radio', () => {
    render(<Host />);
    expect(screen.getByRole('radiogroup', { name: 'Pick' })).toBeTruthy();
    const radios = screen.getAllByRole('radio');
    expect(radios.map((radio) => radio.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false']);
    expect(radios.map((radio) => radio.tabIndex)).toEqual([0, -1, -1]);
  });

  it('selects on click', () => {
    render(<Host />);
    fireEvent.click(screen.getByRole('radio', { name: 'B' }));
    expect(screen.getByRole('radio', { name: 'B' }).getAttribute('aria-checked')).toBe('true');
  });

  it('moves and selects with the arrow keys, wrapping around', () => {
    render(<Host />);
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowLeft' });
    expect(screen.getByRole('radio', { name: 'C' }).getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'C' }));
  });
});
