import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Stage } from './anatomy';
import { corner, leaders, OUTSET, type Point } from './leaders';

type Segment = [number, number, number, number];

/** The straight pieces of an `M x y H x V y H x` path. */
function segments(d: string): Segment[] {
  const out: Segment[] = [];
  let x = 0;
  let y = 0;
  for (const [, command, a, b] of d.matchAll(/([MHV])(-?[\d.]+)(?: (-?[\d.]+))?/g)) {
    if (command === 'M') [x, y] = [Number(a), Number(b)];
    else {
      const next: Segment = [x, y, command === 'H' ? Number(a) : x, command === 'V' ? Number(a) : y];
      out.push(next);
      [x, y] = [next[2], next[3]];
    }
  }
  return out;
}

const overlap = (p1: number, p2: number, q1: number, q2: number) => Math.max(Math.min(p1, p2), Math.min(q1, q2)) <= Math.min(Math.max(p1, p2), Math.max(q1, q2));

function crosses([a, b, c, d]: Segment, [e, f, g, h]: Segment): boolean {
  const vertical1 = a === c;
  const vertical2 = e === g;
  if (vertical1 && vertical2) return a === e && overlap(b, d, f, h);
  if (!vertical1 && !vertical2) return b === f && overlap(a, c, e, g);
  const [v, h2] = vertical1 ? [[a, b, c, d], [e, f, g, h]] : [[e, f, g, h], [a, b, c, d]];
  return v[0] >= Math.min(h2[0], h2[2]) && v[0] <= Math.max(h2[0], h2[2]) && h2[1] >= Math.min(v[1], v[3]) && h2[1] <= Math.max(v[1], v[3]);
}

/** A repeatable pseudo-random sequence, so a failure can be replayed. */
function sequence(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

describe('corner', () => {
  const box = { left: 10, top: 20, right: 110, bottom: 60, width: 100, height: 40 };
  it('finds the centre of a box', () => {
    expect(corner(box, 'center')).toEqual({ x: 60, y: 40 });
  });

  it('puts each corner diagonally outside the box, so it covers nothing inside', () => {
    expect(corner(box, 'top-start')).toEqual({ x: 10 - OUTSET, y: 20 - OUTSET });
    expect(corner(box, 'top-end')).toEqual({ x: 110 + OUTSET, y: 20 - OUTSET });
    expect(corner(box, 'bottom-start')).toEqual({ x: 10 - OUTSET, y: 60 + OUTSET });
    expect(corner(box, 'bottom-end')).toEqual({ x: 110 + OUTSET, y: 60 + OUTSET });
  });
});

describe('corner, start and end', () => {
  const box = { left: 10, top: 20, right: 110, bottom: 60, width: 100, height: 40 };
  it('puts the default just outside the leading edge, vertically centred', () => {
    expect(corner(box)).toEqual({ x: 10 - OUTSET, y: 40 });
    expect(corner(box, 'start')).toEqual({ x: 10 - OUTSET, y: 40 });
  });
  it('puts end just outside the trailing edge, vertically centred', () => {
    expect(corner(box, 'end')).toEqual({ x: 110 + OUTSET, y: 40 });
  });
  it('takes the gap as an argument', () => {
    expect(corner(box, 'start', 4)).toEqual({ x: 6, y: 40 });
  });
});

describe('leaders', () => {
  it('draws a straight line when the anchor and its row share a height', () => {
    expect(leaders({ 1: { x: 5, y: 30 } }, { 1: { x: 90, y: 30 } }, [1])).toEqual({ 1: 'M5 30H90' });
  });

  it('draws across, along a channel and across again, and ends at the row', () => {
    const d = leaders({ 1: { x: 5, y: 30 } }, { 1: { x: 90, y: 70 } }, [1])[1];
    const pieces = segments(d);
    expect(pieces).toHaveLength(3);
    expect(pieces[2].slice(2)).toEqual([90, 70]);
  });

  it('never lets two lines cross, whatever the anchors', () => {
    const next = sequence(7);
    for (let round = 0; round < 200; round++) {
      const count = 2 + Math.floor(next() * 7);
      const anchors: Record<number, Point> = {};
      // Anchors on distinct heights: two anchors on one row would share a line, which the stories avoid with `at`.
      const heights = Array.from({ length: count }, (_, k) => k * 6 + next() * 4).sort(() => next() - 0.5);
      for (let n = 1; n <= count; n++) anchors[n] = { x: Math.round(next() * 500), y: heights[n - 1] };
      const order = Object.keys(anchors).map(Number).sort((a, b) => anchors[a].y - anchors[b].y);
      const rows: Record<number, Point> = {};
      order.forEach((n, k) => (rows[n] = { x: 700, y: -40 + k * 44 + next() * 20 }));
      const paths = leaders(anchors, rows, order);
      const all = order.map((n) => segments(paths[n]));
      for (let i = 0; i < all.length; i++) {
        for (let j = i + 1; j < all.length; j++) {
          for (const a of all[i]) for (const b of all[j]) expect(crosses(a, b), `round ${round}: lines ${order[i]} and ${order[j]}`).toBe(false);
        }
      }
    }
  });
});

describe('Stage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} unobserve() {} });
    Object.defineProperty(document, 'fonts', { value: { ready: new Promise(() => {}) }, configurable: true });
    window.matchMedia = ((query: string) => ({ matches: true, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  const anatomy = {
    render: <button type="button" className="sample">Save</button>,
    parts: [
      { n: 1, label: 'Container', note: 'required', target: '.sample' },
      { n: 2, label: 'Label', target: '.sample', at: 'bottom-end' as const },
    ],
  };

  it('opens the parts panel by default and lists every part once', () => {
    render(<Stage anatomy={anatomy} />);
    const toggle = screen.getByRole('button', { name: 'Hide parts' });
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(toggle.getAttribute('aria-controls')!)).not.toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('shows numbered pins in number order when the panel is closed, and keeps the list for screen readers', () => {
    render(<Stage anatomy={anatomy} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hide parts' }));
    const toggle = screen.getByRole('button', { name: 'Show parts' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getAllByRole('button', { name: /^Part \d$/ }).map((pin) => pin.textContent)).toEqual(['1', '2']);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('keeps the choice in localStorage and reads it back', () => {
    const { unmount } = render(<Stage anatomy={anatomy} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hide parts' }));
    expect(window.localStorage.getItem('doc-anatomy-parts')).toBe('closed');
    unmount();
    render(<Stage anatomy={anatomy} />);
    expect(screen.getByRole('button', { name: 'Show parts' })).toBeTruthy();
  });

  it('works when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<Stage anatomy={anatomy} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hide parts' }));
    expect(screen.getByRole('button', { name: 'Show parts' })).toBeTruthy();
    vi.restoreAllMocks();
  });
});
