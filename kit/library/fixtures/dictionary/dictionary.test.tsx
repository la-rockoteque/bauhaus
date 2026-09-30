import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { prose, TokenName } from './dictionary';

describe('prose', () => {
  it('reads a token in title-case words, spelling out the abbreviations', () => {
    expect(prose('border.strong')).toBe('Border Strong');
    expect(prose('size.target.min')).toBe('Size Target Minimum');
    expect(prose('space.inset.sm')).toBe('Space Inset Small');
    expect(prose('--ds-font-size-2xl')).toBe('Font Size 2× Large');
    expect(prose('text.label.*')).toBe('Text Label All');
  });

  it('keeps the pieces of a grouped name', () => {
    expect(prose('focus.ring.color · width · offset')).toBe('Focus Ring Color · Width · Offset');
    expect(prose('action.primary · primary-hover')).toBe('Action Primary · Primary Hover');
  });
});

describe('TokenName', () => {
  afterEach(cleanup);

  it('shows the prose name and names itself with both forms', () => {
    render(<TokenName name="border.strong" />);
    const name = screen.getByRole('img', { name: 'Border Strong, border.strong' });
    expect(name.textContent).toBe('Border Strong');
    expect(name.tabIndex).toBe(0);
  });

  it('shows the true token name in a tooltip on keyboard focus', async () => {
    render(<TokenName name="border.strong" />);
    // The tooltip opens on keyboard focus, so the modality moves to the keyboard first.
    fireEvent.keyDown(document.body, { key: 'Tab' });
    act(() => screen.getByRole('img').focus());
    expect((await screen.findByRole('tooltip')).textContent).toBe('border.strong');
  });
});
