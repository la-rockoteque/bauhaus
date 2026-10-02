import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { contrast } from '../rulebook/tokens';
import { HARMONY, hexToLch, lchToHex, lightnesses, nearestGrade, normalizeHex, ramp, toDtcg, turn } from './oklch';
import { nearestDetent } from './dial';
import { CURATED_GRADES, CURATED_HUES, LIBRARY, findCurated, spotAt } from './curated';
import { PaletteGenerator } from './palette-generator';

const blue = LIBRARY.find((option) => option.name === 'dark-blue')!.hex;
const scarlet = LIBRARY[0].hex;
const red = CURATED_HUES[0].grades[4].hex;
const radial = () => screen.getByRole('slider', { name: /^Curated primary, 32 hues/ });
const library = () => fireEvent.click(screen.getByRole('radio', { name: 'Library' }));
const options = { contrast: 1, vibrancy: 1 };

describe('oklch', () => {
  it('reads 3 and 6 hex digits, with or without #, and refuses the rest', () => {
    expect(normalizeHex('ABC')).toBe(`#${'aabbcc'}`);
    expect(normalizeHex(blue.slice(1))).toBe(blue);
    expect(normalizeHex('12345')).toBeNull();
    expect(normalizeHex('zzzzzz')).toBeNull();
  });

  it('turns a colour into OKLCH and back without drift', () => {
    for (const { hex } of LIBRARY) expect(lchToHex(hexToLch(hex))).toBe(hex);
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

describe('the 256 curated colours', () => {
  it('holds 32 hues by 8 grades, all different', () => {
    const all = CURATED_HUES.flatMap((hue) => hue.grades.map((option) => option.hex));
    expect(CURATED_HUES).toHaveLength(32);
    expect(all).toHaveLength(256);
    expect(new Set(all).size).toBe(256);
    expect(CURATED_HUES[0].grades.map((option) => option.name)).toEqual(CURATED_GRADES.map((at) => `hue-27.${at}`));
  });

  it('gives each grade one lightness across the hues, lightest first', () => {
    for (const { grades } of CURATED_HUES) {
      const ls = grades.map((option) => hexToLch(option.hex).l);
      ls.slice(1).forEach((l, i) => expect(l).toBeLessThan(ls[i]));
    }
    const fifth = CURATED_HUES.map((hue) => hexToLch(hue.grades[4].hex).l);
    expect(Math.max(...fifth) - Math.min(...fifth)).toBeLessThan(0.02);
  });

  it('finds where a hex sits in the 256', () => {
    expect(findCurated(CURATED_HUES[13].grades[6].hex)).toEqual({ hue: 13, grade: 6 });
    expect(findCurated(scarlet)).toBeNull();
  });

  it('reads the cell under a point: the angle is the hue, the distance is the grade', () => {
    expect(spotAt(0, -15)).toEqual({ hue: 0, grade: 0 });
    expect(spotAt(0, -58)).toEqual({ hue: 0, grade: 7 });
    expect(spotAt(40, 0)).toEqual({ hue: 8, grade: 4 });
    expect(spotAt(0, 0)).toBeNull();
    expect(spotAt(0, -70)).toBeNull();
  });
});

describe('PaletteGenerator', () => {
  afterEach(cleanup);

  const rows = (container: HTMLElement) => container.querySelectorAll('.pg-row:not(.pg-row--head)').length;

  it('starts on a curated hue with a primary, a secondary, a tertiary and a neutral row', () => {
    const { container } = render(<PaletteGenerator />);
    expect(radial().getAttribute('aria-valuetext')).toBe(`hue-27.500 ${red}`);
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
    const base = hexToLch(red).h;
    const hex = /#[0-9a-f]+/.exec(middle('secondary') ?? '')![0];
    expect(Math.abs(((hexToLch(hex).h - turn(base, 60) + 540) % 360) - 180)).toBeLessThan(3);
  });

  it('offers only the library hues with a hue to them on the dial', () => {
    expect(LIBRARY.map((option) => option.name)).not.toContain('gray');
    expect(LIBRARY.map((option) => option.name)).not.toContain('ink');
    expect(LIBRARY.length).toBeGreaterThan(2);
  });

  it('turns the dial with the arrow keys, and says when a typed colour is off the dial', () => {
    render(<PaletteGenerator />);
    library();
    const dial = screen.getByRole('slider', { name: 'Curated primary' });
    fireEvent.keyDown(dial, { key: 'End' });
    expect(dial.getAttribute('aria-valuetext')).toBe(`${LIBRARY.at(-1)!.name} ${LIBRARY.at(-1)!.hex}`);
    fireEvent.keyDown(dial, { key: 'ArrowLeft' });
    expect(dial.getAttribute('aria-valuenow')).toBe(String(LIBRARY.length - 2));
    fireEvent.change(screen.getByLabelText('Hex'), { target: { value: '123456' } });
    expect(dial.getAttribute('aria-valuetext')).toMatch(/custom/i);
  });

  it('takes a dial detent or a typed hex as the base, and flags a bad hex', () => {
    const { container } = render(<PaletteGenerator />);
    library();
    const dial = screen.getByRole('slider', { name: 'Curated primary' });
    fireEvent.keyDown(dial, { key: 'Home' });
    for (let i = 0; i < LIBRARY.findIndex((option) => option.hex === blue); i += 1) fireEvent.keyDown(dial, { key: 'ArrowRight' });
    expect((container.querySelector('input[type="color"]') as HTMLInputElement).value).toBe(blue);
    fireEvent.change(screen.getByLabelText('Hex'), { target: { value: 'nope' } });
    expect(screen.getByText(/Write 3 or 6 hex digits/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Hex'), { target: { value: scarlet.slice(1) } });
    expect((container.querySelector('input[type="color"]') as HTMLInputElement).value).toBe(scarlet);
  });

  it('moves on the radial with the arrow keys: hue round, grade in and out', () => {
    const { container } = render(<PaletteGenerator />);
    const colour = () => (container.querySelector('input[type="color"]') as HTMLInputElement).value;
    fireEvent.keyDown(radial(), { key: 'ArrowLeft' });
    expect(colour()).toBe(CURATED_HUES[31].grades[4].hex);
    fireEvent.keyDown(radial(), { key: 'ArrowUp' });
    expect(colour()).toBe(CURATED_HUES[31].grades[5].hex);
    fireEvent.keyDown(radial(), { key: 'ArrowRight' });
    fireEvent.keyDown(radial(), { key: 'ArrowRight' });
    expect(colour()).toBe(CURATED_HUES[1].grades[5].hex);
  });

  it('draws the wheel: 3 primaries, 6 in the middle ring, 12 outside', () => {
    const { container } = render(<PaletteGenerator />);
    expect(container.querySelectorAll('.pg-segment')).toHaveLength(21);
  });
});
