import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import palette from '../../foundations/color/palette.tokens.json';
import { resolve } from '../rulebook/tokens';
import { Segmented } from '../segmented/segmented';
import { Dial } from './dial';
import type { DialOption } from './dial';
import { hexToLch, lchToHex } from './oklch';
import { segment } from './wheel';

/**
 * The curated primaries, in two modes. Library: the library's own hues at 500, read from the tokens, on a
 * dial. A hue with no 500 (an alpha scale such as ink) or no hue to speak of (gray) cannot seed a wheel,
 * so it is left off. 256: 32 hues by 8 grades, set by rule in OKLCH (hues 11.25° apart, each grade at one
 * lightness in every hue), all drawn in one radial: the angle is the hue, the ring is the grade.
 */

const MIN_CHROMA = 0.03;
export const LIBRARY: readonly DialOption[] = Object.entries(palette.palette)
  .filter(([key, value]) => !key.startsWith('$') && typeof value === 'object' && '500' in value)
  .map(([hue]) => ({ name: hue, hex: resolve('light', `--ds-palette-${hue}-500`) ?? '' }))
  .filter((option) => hexToLch(option.hex).c >= MIN_CHROMA);

/** 32 OKLCH hue angles, evenly spaced from red (27°). Each hue is named by its angle. */
const HUE_COUNT = 32;
const FIRST_HUE = 27;
export const CURATED_GRADES = [100, 200, 300, 400, 500, 600, 700, 800] as const;
const LIGHTNESS = [0.93, 0.85, 0.76, 0.67, 0.58, 0.49, 0.4, 0.31];
const CHROMA = 0.19;

export interface CuratedHue {
  name: string;
  grades: readonly DialOption[];
}

export const CURATED_HUES: readonly CuratedHue[] = Array.from({ length: HUE_COUNT }, (_, i) => {
  const h = Math.round((FIRST_HUE + (360 * i) / HUE_COUNT) % 360);
  return {
    name: `hue-${h}`,
    grades: LIGHTNESS.map((l, at) => {
      // Less chroma at the ends, so the palest and the darkest grades stay in sRGB without a hue shift.
      const fromMiddle = (at - 3.5) / 3.5;
      return { name: `hue-${h}.${CURATED_GRADES[at]}`, hex: lchToHex({ l, c: CHROMA * (1 - 0.55 * fromMiddle ** 2), h }) };
    }),
  };
});

export interface Spot {
  hue: number;
  grade: number;
}

/** Where a hex sits in the 256, or null. */
export function findCurated(hex: string): Spot | null {
  for (const [hue, { grades }] of CURATED_HUES.entries()) {
    const grade = grades.findIndex((option) => option.hex === hex);
    if (grade >= 0) return { hue, grade };
  }
  return null;
}

// The radial: ring 0 (grade 100) inside, ring 7 (grade 800) outside.
const HOLE = 14;
const BAND = 5.6;
const SPAN = 360 / HUE_COUNT;

/** The cell under a point, from the centre: the angle gives the hue, the distance gives the grade. */
export function spotAt(x: number, y: number): Spot | null {
  const r = Math.hypot(x, y);
  const grade = Math.floor((r - HOLE) / BAND);
  if (grade < 0 || grade >= CURATED_GRADES.length) return null;
  const degrees = ((Math.atan2(x, -y) * 180) / Math.PI + 360 + SPAN / 2) % 360;
  return { hue: Math.floor(degrees / SPAN) % HUE_COUNT, grade };
}

/**
 * Every curated colour at once. One tab stop: Left and Right turn the hue (it wraps), Up goes darker (out),
 * Down goes lighter (in). React Aria's ColorArea uses the same slider roles for a two-way picker.
 */
function Radial({ value, onChange }: { value: Spot | null; onChange: (spot: Spot) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const current = value && CURATED_HUES[value.hue].grades[value.grade];

  const pointAt = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box) return;
    const scale = 120 / box.width;
    const spot = spotAt((event.clientX - box.left - box.width / 2) * scale, (event.clientY - box.top - box.height / 2) * scale);
    if (spot && (spot.hue !== value?.hue || spot.grade !== value?.grade)) onChange(spot);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const from = value ?? { hue: 0, grade: 4 };
    const move: Record<string, Spot> = {
      ArrowRight: { ...from, hue: (from.hue + 1) % HUE_COUNT },
      ArrowLeft: { ...from, hue: (from.hue - 1 + HUE_COUNT) % HUE_COUNT },
      ArrowUp: { ...from, grade: Math.min(CURATED_GRADES.length - 1, from.grade + 1) },
      ArrowDown: { ...from, grade: Math.max(0, from.grade - 1) },
    };
    if (!move[event.key]) return;
    event.preventDefault();
    onChange(move[event.key]);
  };

  return (
    <div
      className="pg-radial"
      role="slider"
      tabIndex={0}
      aria-roledescription="colour wheel"
      aria-label="Curated primary, 32 hues by 8 grades"
      aria-valuemin={0}
      aria-valuemax={HUE_COUNT * CURATED_GRADES.length - 1}
      aria-valuenow={value ? value.hue * CURATED_GRADES.length + value.grade : 0}
      aria-valuetext={current ? `${current.name} ${current.hex}` : 'A custom colour, not on the wheel'}
      onKeyDown={onKeyDown}
    >
      <svg
        ref={svg}
        viewBox="-60 -60 120 120"
        aria-hidden="true"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          pointAt(event);
        }}
        onPointerMove={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && pointAt(event)}
      >
        {CURATED_HUES.flatMap((hue, i) =>
          hue.grades.map((option, at) => (
            <path key={option.name} className="pg-cell-arc" d={segment(HOLE + at * BAND, HOLE + (at + 1) * BAND, i * SPAN, SPAN)} fill={option.hex} />
          )),
        )}
        {value && (
          <path className="pg-cell-arc pg-cell-arc--on" d={segment(HOLE + value.grade * BAND, HOLE + (value.grade + 1) * BAND, value.hue * SPAN, SPAN)} fill={current?.hex} />
        )}
      </svg>
      <span className="pg-dial-value">{current ? <><code>{current.name}</code> {current.hex}</> : 'Custom'}</span>
    </div>
  );
}

type Mode = 'radial' | 'library';
const MODES = [
  { value: 'radial' as const, label: '256 colours' },
  { value: 'library' as const, label: 'Library' },
];

export const DEFAULT_PRIMARY = CURATED_HUES[0].grades[4].hex;

export function CuratedPicker({ hex, onPick }: { hex: string; onPick: (hex: string) => void }) {
  const [mode, setMode] = useState<Mode>('radial');
  return (
    <div className="pg-curated">
      <Segmented label="Curated set" options={MODES} value={mode} onChange={setMode} />
      {mode === 'radial' ? (
        <Radial value={findCurated(hex)} onChange={({ hue, grade }) => onPick(CURATED_HUES[hue].grades[grade].hex)} />
      ) : (
        <Dial label="Curated primary" options={LIBRARY} value={LIBRARY.findIndex((option) => option.hex === hex)} onChange={(i) => onPick(LIBRARY[i].hex)} />
      )}
    </div>
  );
}
