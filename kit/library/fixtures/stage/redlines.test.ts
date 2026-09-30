import { describe, expect, it } from 'vitest';
import { resolve } from '../rulebook/tokens';
import { cssName, LANE, mark, matches, OFFSET, px, sideOf, TAG_GAP, TICK, wireframe, type Probe } from './redlines';

const probe = (over: Partial<Probe> = {}): Probe => ({
  box: { x: 100, y: 50, w: 120, h: 44 },
  padding: { top: 8, right: 16, bottom: 8, left: 16 },
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  border: { top: 1, right: 1, bottom: 1, left: 1 },
  gap: { row: 0, column: 8 },
  radius: 8,
  axis: 'row',
  children: [],
  ...over,
});

describe('mark', () => {
  const box = { left: 100, top: 50, right: 220, bottom: 94 };
  /** True when no bar, link end or value sits inside the component's box. */
  const outside = (m: ReturnType<typeof mark>) =>
    [...m.lines.flatMap((l) => [l.a, l.b]), ...m.links.map((l) => l.b), ...m.tags].every((p) => p.x < box.left || p.x > box.right || p.y < box.top || p.y > box.bottom);

  it('draws every spec outside the component', () => {
    const children = [{ x: 117, y: 60, w: 20, h: 20 }, { x: 145, y: 60, w: 50, h: 20 }];
    for (const property of ['height', 'width', 'padding-inline', 'padding-block', 'gap', 'radius'] as const) {
      expect(outside(mark(property, probe({ children })))).toBe(true);
    }
  });

  it('draws the height left of the box, clear of the anatomy anchors, with its value along it', () => {
    const m = mark('height', probe());
    expect(m.lines[0]).toEqual({ a: { x: 100 - OFFSET, y: 50 }, b: { x: 100 - OFFSET, y: 94 } });
    expect(m.links).toEqual([{ a: { x: 100, y: 50 }, b: { x: 100 - OFFSET - TICK, y: 50 } }, { a: { x: 100, y: 94 }, b: { x: 100 - OFFSET - TICK, y: 94 } }]);
    expect(m.tags).toEqual([{ x: 100 - OFFSET - TAG_GAP, y: 72, vertical: true, text: '44', out: -1 }]);
    expect(mark('height', probe(), 1).lines[0].a.x).toBe(100 - OFFSET - LANE);
  });

  it('draws the width below the box, its value upright', () => {
    const m = mark('width', probe());
    expect(m.lines[0]).toEqual({ a: { x: 100, y: 94 + OFFSET }, b: { x: 220, y: 94 + OFFSET } });
    expect(m.tags[0]).toMatchObject({ vertical: false, text: '120' });
  });

  it('measures the inline padding on a bar below each side, inside the border', () => {
    const m = mark('padding-inline', probe());
    expect(m.bands).toEqual([{ x: 101, y: 51, w: 16, h: 42 }, { x: 203, y: 51, w: 16, h: 42 }]);
    expect(m.lines[0]).toEqual({ a: { x: 101, y: 94 + OFFSET }, b: { x: 117, y: 94 + OFFSET } });
    expect(m.tags.map((t) => t.text)).toEqual(['16', '16']);
    expect(m.values).toEqual([16]);
  });

  it('writes each side of the block padding on its own bar, right of the box', () => {
    const m = mark('padding-block', probe({ padding: { top: 8, right: 0, bottom: 12, left: 0 } }));
    expect(m.values).toEqual([8, 12]);
    expect(m.tags.map((t) => [t.x, t.text])).toEqual([[220 + OFFSET + TAG_GAP, '8'], [220 + OFFSET + TAG_GAP, '12']]);
  });

  it('measures the gap between side-by-side children on a bar below', () => {
    const children = [{ x: 117, y: 60, w: 20, h: 20 }, { x: 145, y: 60, w: 50, h: 20 }];
    const m = mark('gap', probe({ children }));
    expect(m.bands).toEqual([{ x: 137, y: 51, w: 8, h: 42 }]);
    expect(m.lines[0]).toEqual({ a: { x: 137, y: 94 + OFFSET }, b: { x: 145, y: 94 + OFFSET } });
    expect(m.values).toEqual([8]);
  });

  it('links the radius left from the end of the curve to its value beside the box', () => {
    const m = mark('radius', probe());
    expect(m.links[0]).toEqual({ a: { x: 100, y: 58 }, b: { x: 100 - OFFSET, y: 58 } });
    expect(m.tags[0]).toMatchObject({ vertical: true, text: '8' });
  });

  it('puts the bars outside the whole component, not only outside the measured part', () => {
    const frame = { x: 60, y: 10, w: 200, h: 120 };
    expect(mark('height', probe(), 0, frame).lines[0].a.x).toBe(60 - OFFSET);
    expect(mark('width', probe(), 0, frame).lines[0].a.y).toBe(130 + OFFSET);
    expect(mark('padding-block', probe(), 0, frame).tags[0].x).toBe(260 + OFFSET + TAG_GAP);
    expect(mark('height', probe(), 0, frame).links[0]).toEqual({ a: { x: 100, y: 50 }, b: { x: 60 - OFFSET - TICK, y: 50 } });
  });

  it('gives a percentage radius no value, so nothing is compared', () => {
    const m = mark('radius', probe({ radius: NaN }));
    expect(m.values).toEqual([]);
    expect(matches(m.values, 8)).toBeUndefined();
  });
});

describe('sideOf', () => {
  it('puts each spec on its own side, the gap by its axis', () => {
    expect(['height', 'width', 'padding-inline', 'padding-block', 'radius'].map((p) => sideOf(p as never, 'row'))).toEqual(['left', 'bottom', 'bottom', 'right', 'left']);
    expect([sideOf('gap', 'row'), sideOf('gap', 'column')]).toEqual(['bottom', 'right']);
  });
});

describe('wireframe', () => {
  it('rings the padding inside the border and the margin outside the box, around the content box', () => {
    const w = wireframe(probe({ margin: { top: 4, right: 0, bottom: 4, left: 0 } }));
    expect(w.content).toEqual({ x: 117, y: 59, w: 86, h: 26 });
    expect(w.padding).toHaveLength(4);
    expect(w.padding[0]).toEqual({ x: 101, y: 51, w: 118, h: 8 });
    expect(w.margin).toEqual([{ x: 100, y: 46, w: 120, h: 4 }, { x: 100, y: 94, w: 120, h: 4 }]);
  });
});

describe('tokens', () => {
  it('reads a resolved token in px, and nothing else', () => {
    expect(px(resolve('', cssName('size.target.min')))).toBe(44);
    expect(px('var(--ds-space-2)')).toBeUndefined();
    expect(px('auto')).toBeUndefined();
    expect(px(resolve('', cssName('size.overlay.md')), 16)).toBe(480);
  });

  it('flags drift, and has nothing to say without a token', () => {
    expect(matches([16], 16)).toBe(true);
    expect(matches([16, 12], 16)).toBe(false);
    expect(matches([16], undefined)).toBeUndefined();
  });

  it('spells the custom property of a dotted token', () => {
    expect(cssName('size.target.min')).toBe('--ds-size-target-min');
  });
});
