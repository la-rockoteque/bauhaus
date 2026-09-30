import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setTheme } from './theme-store';
import { ThemeSwitch } from './theme-switch';

describe('ThemeSwitch', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme;
  });
  afterEach(cleanup);

  it('is a radio group with one radio per theme, the first checked by default', () => {
    render(<ThemeSwitch />);
    const radios = screen.getAllByRole('radio');
    expect(radios.map((radio) => radio.textContent)).toEqual(['Light', 'Dark']);
    expect(radios.map((radio) => radio.getAttribute('aria-checked'))).toEqual(['true', 'false']);
    expect(radios.map((radio) => radio.tabIndex)).toEqual([0, -1]);
  });

  it('writes the theme on <html> and follows it when another control changes it', async () => {
    render(<ThemeSwitch />);
    await act(async () => void fireEvent.click(screen.getByRole('radio', { name: 'Dark' })));
    expect(document.documentElement.dataset.theme).toBe('dark');
    await act(async () => setTheme('light'));
    expect(screen.getByRole('radio', { name: 'Light' }).getAttribute('aria-checked')).toBe('true');
  });

  it('moves and selects with the arrow keys, wrapping around', async () => {
    render(<ThemeSwitch />);
    await act(async () => void fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    await act(async () => void fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' }));
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
