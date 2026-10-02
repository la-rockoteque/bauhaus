import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { contrast } from '../rulebook/tokens';
import { HARMONY, hexToLch, lchToHex, lightnesses, nearestGrade, normalizeHex, ramp, toDtcg, turn } from './oklch';
import { nearestDetent } from './dial';
import { CURATED, PaletteGenerator } from './palette-generator';

const blue = CURATED.find((option) => option.name === 'dark-blue')!.hex;
const scarlet = CURATED[0].hex;
const options = { contrast: 1, vibrancy: 1 };

describe('oklch', () => {
  it('reads 3 and 6 hex digits, with or without #, and refuses the rest', () => {
    expect(normalizeHex('ABC')).toBe(`#${'aabbcc'}`);
    expect(normalizeHex(blue.slice(1))).toBe(blue);
    expect(normalizeHex('12345')).toBeNull();
    expect(normalizeHex('zzzzzz')).toBeNull();
  });

  it('turns a colour into OKLCH and back without drift', () => {
    for (const { hex } of CURATED) expect(lchToHex(hexToLch(hex))).toBe(hex);
  });

  it('cuts the chroma of a colour outside sRGB, and keeps a valid hex', () => {
    expect(normalizeHex(lchToHex({ l: 0.6, c: 0.5, h: 150 }))).not.toBeNull();
  });

  it('makes nine grades, lightest first, each darker than the last', () => {
    const grades = ramp(hexToLch(blue).h, hexToLch(blue).c, options);
    expect(grades).toHaveLength(9);
    const ls = grades.map((hex) => hexToLch(hex).l);
    ls.slice(1).forEach((l, i) => expect(l).toBeLessThan(ls[i]));
  });

  it('spreads the grades further at high contrast than at soft', () => {
    const range = (c: number) => lightnesses(c)[0] - lightnesses(c)[8];
    expect(range(1)).toBeGreaterThan(range(0));
    const ends = (c: number) => { const g = ramp(0, 0.1, { contrast: c, vibrancy: 1 }); return contrast(g[0], g[8]) ?? 0; };
    expect(ends(1)).toBeGreaterThan(7);
    expect(ends(0)).toBeLessThan(ends(1));
  });

  it('lowers the chroma when the vibrancy goes to muted', () => {
    const middle = (vibrancy: number) => hexToLch(ramp(hexToLch(blue).h, hexToLch(blue).c, { contrast: 1, vibrancy })[4]).c;
    expect(middle(0.1)).toBeLessThan(middle(1) / 3);
  });

  it('lays twelve hues 30° apart: 3 primaries, 3 secondaries, 6 tertiaries', () => {
    expect(HARMONY.map((hue) => hue.offset).sort((a, b) => a - b)).toEqual([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]);
    expect(HARMONY.filter((hue) => hue.order === 'primary')).toHaveLength(3);
    expect(turn(350, 30)).toBe(20);
  });

  it('snaps a dial angle to the nearest detent, and holds the ends past the sweep', () => {
    expect(nearestDetent(-135, 5)).toBe(0);
    expect(nearestDetent(0, 5)).toBe(2);
    expect(nearestDetent(130, 5)).toBe(4);
    expect(nearestDetent(170, 5)).toBe(4);
    expect(nearestDetent(-170, 5)).toBe(0);
  });

  it('marks the grade nearest the chosen lightness', () => {
    expect(nearestGrade(lightnesses(1)[6], 1)).toBe(6);
  });

  it('writes the palette as DTCG JSON', () => {
    const json = JSON.parse(toDtcg([{ name: 'primary', grades: ramp(0, 0.1, options) }]));
    expect(json.palette.$type).toBe('color');
    expect(Object.keys(json.palette['primary'])).toEqual(['100', '200', '300', '400', '500', '600', '700', '800', '900']);
  });
});

describe('PaletteGenerator', () => {
  afterEach(cleanup);

  const rows = (container: HTMLElement) => container.querySelectorAll('.pg-row:not(.pg-row--head)').length;

  it('starts on a curated hue with a primary, a secondary, a tertiary and a neutral row', () => {
    const { container } = render(<PaletteGenerator />);
    expect(screen.getByRole('slider', { name: 'Curated primary' }).getAttribute('aria-valuetext')).toBe(`scarlet ${scarlet}`);
    expect(rows(container)).toBe(4);
    expect([...container.querySelectorAll('.pg-name code')].map((n) => n.textContent)).toEqual(['primary', 'secondary', 'tertiary', 'neutral']);
    expect(container.querySelectorAll('.pg-cell')).toHaveLength(36);
  });

  it('turns the secondary and the tertiary to the hue the controls pick', () => {
    render(<PaletteGenerator />);
    const middle = (name: string) => screen.getByRole('button', { name: new RegExp(`^Copy ${name} 500`) }).getAttribute('aria-label');
    const before = middle('tertiary');
    fireEvent.click(screen.getByRole('radio', { name: '270°' }));
    expect(middle('tertiary')).not.toBe(before);
    fireEvent.click(screen.getByRole('radio', { name: '60°' }));
    const base = hexToLch(scarlet).h;
    const hex = /#[0-9a-f]+/.exec(middle('secondary') ?? '')![0];
    expect(Math.abs(((hexToLch(hex).h - turn(base, 60) + 540) % 360) - 180)).toBeLessThan(3);
  });

  it('offers only the library hues with a hue to them on the dial', () => {
    expect(CURATED.map((option) => option.name)).not.toContain('gray');
    expect(CURATED.map((option) => option.name)).not.toContain('ink');
    expect(CURATED.length).toBeGreaterThan(2);
  });

  it('turns the dial with the arrow keys, and says when a typed colour is off the dial', () => {
    render(<PaletteGenerator />);
    const dial = screen.getByRole('slider', { name: 'Curated primary' });
    fireEvent.keyDown(dial, { key: 'End' });
    expect(dial.getAttribute('aria-valuetext')).toBe(`${CURATED.at(-1)!.name} ${CURATED.at(-1)!.hex}`);
    fireEvent.keyDown(dial, { key: 'ArrowLeft' });
    expect(dial.getAttribute('aria-valuenow')).toBe(String(CURATED.length - 2));
    fireEvent.change(screen.getByLabelText('Hex'), { target: { value: '123456' } });
    expect(dial.getAttribute('aria-valuetext')).toMatch(/custom/i);
  });

  it('takes a dial detent or a typed hex as the base, and flags a bad hex', () => {
    const { container } = render(<PaletteGenerator />);
    const dial = screen.getByRole('slider', { name: 'Curated primary' });
    fireEvent.keyDown(dial, { key: 'Home' });
    for (let i = 0; i < CURATED.findIndex((option) => option.hex === blue); i += 1) fireEvent.keyDown(dial, { key: 'ArrowRight' });
    expect((container.querySelector('input[type="color"]') as HTMLInputElement).value).toBe(blue);
    fireEvent.change(screen.getByLabelText('Hex'), { target: { value: 'nope' } });
    expect(screen.getByText(/Write 3 or 6 hex digits/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Hex'), { target: { value: scarlet.slice(1) } });
    expect((container.querySelector('input[type="color"]') as HTMLInputElement).value).toBe(scarlet);
  });

  it('draws the wheel: 3 primaries, 6 in the middle ring, 12 outside', () => {
    const { container } = render(<PaletteGenerator />);
    expect(container.querySelectorAll('.pg-segment')).toHaveLength(21);
  });
});
