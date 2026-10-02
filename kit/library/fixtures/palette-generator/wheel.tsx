import { HARMONY, lchToHex, turn } from './oklch';
import type { Lch, Order } from './oklch';

/**
 * Itten's colour star as three rings, turned so the chosen hue sits at the top. The inner ring holds
 * the three primaries, the middle ring adds the three secondaries, the outer ring all twelve hues.
 * A primary segment makes that hue the base. A secondary or a tertiary segment picks the palette's secondary
 * or tertiary. The wheel is a pointer shortcut: the controls under it hold the same choices for the keyboard.
 */

const RINGS: Record<Order, { inner: number; outer: number; span: number }> = {
  primary: { inner: 16, outer: 42, span: 120 },
  secondary: { inner: 46, outer: 68, span: 60 },
  tertiary: { inner: 72, outer: 96, span: 30 },
};

/** The orders each ring shows: a ring holds its own hues and the ones of the rings inside it. */
const SHOWN: Record<Order, readonly Order[]> = {
  primary: ['primary'],
  secondary: ['primary', 'secondary'],
  tertiary: ['primary', 'secondary', 'tertiary'],
};

const polar = (r: number, degrees: number): string => {
  const a = (degrees * Math.PI) / 180;
  return `${(r * Math.sin(a)).toFixed(2)} ${(-r * Math.cos(a)).toFixed(2)}`;
};

/** A ring segment centred on `at`, `span` degrees wide. */
function segment(inner: number, outer: number, at: number, span: number): string {
  const [from, to] = [at - span / 2, at + span / 2];
  return `M ${polar(outer, from)} A ${outer} ${outer} 0 0 1 ${polar(outer, to)} L ${polar(inner, to)} A ${inner} ${inner} 0 0 0 ${polar(inner, from)} Z`;
}

export interface WheelProps {
  base: Lch;
  /** The offsets of the chosen secondary and tertiary, in degrees from the base. */
  secondary: number;
  tertiary: number;
  /** A primary segment: that hue becomes the base. */
  onBase: (hex: string) => void;
  onPick: (order: Exclude<Order, 'primary'>, offset: number) => void;
}

export function Wheel({ base, secondary, tertiary, onBase, onPick }: WheelProps) {
  const picked = (order: Order, offset: number) =>
    offset === 0 || (order === 'secondary' && offset === secondary) || (order === 'tertiary' && offset === tertiary);
  return (
    <svg className="pg-wheel" viewBox="-100 -100 200 200" aria-hidden="true">
      {(Object.keys(RINGS) as Order[]).flatMap((ring) =>
        HARMONY.filter((hue) => SHOWN[ring].includes(hue.order)).map((hue) => {
          const hex = lchToHex({ ...base, h: turn(base.h, hue.offset) });
          const { inner, outer, span } = RINGS[ring];
          return (
            <path
              key={`${ring}-${hue.name}`}
              className={`pg-segment${picked(hue.order, hue.offset) ? ' pg-segment--picked' : ''}`}
              d={segment(inner, outer, hue.offset, span)}
              fill={hex}
              onClick={() => (hue.order === 'primary' ? onBase(hex) : onPick(hue.order, hue.offset))}
            >
              <title>{`${hue.name} · ${hex}`}</title>
            </path>
          );
        }),
      )}
    </svg>
  );
}
