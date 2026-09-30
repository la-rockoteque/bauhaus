import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Exploded } from './exploded';

describe('Exploded', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} unobserve() {} });
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  const rows = [
    { name: 'surface.default', tier: 'role' as const, use: '', swatch: '--ds-surface-default' },
    { name: 'text.default', tier: 'role' as const, use: '', swatch: '--ds-text-default' },
    { name: 'space.2', tier: '2' as const, use: '' },
  ];

  it('draws one inert copy per layer that has a token, bottom to top, hidden from screen readers', () => {
    const { container } = render(<Exploded render={<button type="button">Save</button>} rows={rows} />);
    const layers = [...container.querySelectorAll<HTMLElement>('.doc-exploded-layer')];
    expect(layers.map((l) => l.dataset.layer)).toEqual(['surface', 'content']);
    expect(layers.every((l) => l.hasAttribute('inert'))).toBe(true);
    expect(container.querySelector('.doc-exploded-scene')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('labels each layer with its tokens, top layer first', () => {
    const { container } = render(<Exploded render={<span>Save</span>} rows={rows} />);
    expect([...container.querySelectorAll('.doc-exploded-label')].map((l) => l.textContent)).toEqual(['ContentText Default', 'SurfaceSurface Default']);
    expect(screen.getByRole('list', { name: 'Layers, top to bottom' })).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Text Default, text.default' })).toBeTruthy();
  });

  it('draws nothing when no token paints a layer', () => {
    const { container } = render(<Exploded render={<span>Save</span>} rows={[rows[2]]} />);
    expect(container.innerHTML).toBe('');
  });
});
