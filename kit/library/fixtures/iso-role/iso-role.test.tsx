import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { isometricOf } from './iso-role';

const draw = (role: string) => render(<>{isometricOf(role)}</>).container;

describe('isometricOf', () => {
  afterEach(cleanup);

  it('draws a button at rest with no cursor, and hides the drawing from assistive technology', () => {
    const svg = draw('--ds-action-primary').querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.querySelector('.iso-cursor')).toBeNull();
  });

  it('circles a pointer over a hovered button and drops a hand on a pressed one', () => {
    expect(draw('--ds-action-primary-hover').querySelector('.iso-orbit .iso-cursor')).not.toBeNull();
    cleanup();
    const pressed = draw('--ds-action-secondary-pressed');
    expect(pressed.querySelector('.iso-press-hand .iso-cursor')).not.toBeNull();
    expect(pressed.querySelector('.iso-thump .iso-ripple')).not.toBeNull();
  });

  it('ghosts the slab for a text role so the label reads, with no cursor', () => {
    const text = draw('--ds-action-primary-text');
    expect(text.querySelector('.iso-ghost')).not.toBeNull();
    expect(text.querySelector('.iso-cursor')).toBeNull();
    expect(text.textContent).toBe('Save');
  });

  it('puts the pointer on a hovered field border and rings a focused field', () => {
    expect(draw('--ds-field-border-hover').querySelector('.iso-orbit')).not.toBeNull();
    cleanup();
    expect(draw('--ds-field-border-focus').querySelector('.iso-ring')).not.toBeNull();
  });

  it('rings a button for the focus ring colour', () => {
    expect(draw('--ds-focus-ring-color').querySelector('.iso-ring')).not.toBeNull();
  });

  it('has no drawing for a role with no object', () => {
    expect(isometricOf('--ds-text-default')).toBeNull();
  });
});
