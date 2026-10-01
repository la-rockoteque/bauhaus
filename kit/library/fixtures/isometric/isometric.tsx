import type { ReactNode } from 'react';
import { GLYPHS } from '../../foundations/iconography/glyphs';
import './isometric.css';

/**
 * Isometric drawing for Storybook: a component drawn as a slab you can press. A component keeps its own
 * drawing beside it (`button.isometric.fixture.tsx`) and builds it from these pieces. Units are CSS px on
 * the component's own axes: x along its width, y along its depth, z up. Every colour is a `var()`.
 */

export type Vec = readonly [number, number, number];

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;
const CURSOR_SCALE = 1.5;
/** Fingertip of each cursor glyph on its 24 grid: the raised finger's top, the pressing finger's bottom. */
const HOTSPOT = { pointer: [10, 3], press: [10, 22] } as const;

export const screen = ([x, y, z]: Vec): [number, number] => [(x - y) * COS, (x + y) * SIN - z];
/** Maps the component's flat face at height z onto the screen, so a rect or a text drawn flat lies on it. */
export const faceAt = (z: number): string => `matrix(${COS} ${SIN} ${-COS} ${SIN} 0 ${-z})`;

/** The stage: a view box that holds a slab of width × depth, its lift and a cursor above it. */
export function IsoStage({ width, depth, children }: { width: number; depth: number; children: ReactNode }) {
  const margin = 28;
  const x0 = -depth * COS - margin;
  const y0 = -margin - 12;
  const w = (width + depth) * COS + margin * 2;
  const h = (width + depth) * SIN + margin + 12 + 8;
  return (
    <svg className="iso" viewBox={`${x0} ${y0} ${w} ${h}`} aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

export interface SlabProps {
  width: number;
  depth: number;
  /** The slab's thickness. A pressed control is thinner. */
  height: number;
  /** How far the slab floats over its shadow. A hovered control lifts. */
  lift?: number;
  /** The corner radius, as the component's own token: `var(--ds-radius-control)`. */
  radius: string;
  fill: string;
  stroke?: string;
  strokeWidth?: string;
  /** A focus ring around the top face, in the ring colour. */
  ring?: string;
  /** Pressed: the slab gives under the press and a ripple spreads on the ground. */
  pressed?: boolean;
  /** Ghost: the slab fades to a dotted outline so what lies on its face, such as the label, stands out. */
  ghost?: boolean;
  /** Drawn on the top face, in its flat coordinates. */
  children?: ReactNode;
}

/**
 * A rounded slab. The sides are the top face repeated down each pixel and darkened, so the corners keep
 * the component's real radius at every height.
 */
export function Slab({ width, depth, height, lift = 0, radius, fill, stroke, strokeWidth, ring, pressed = false, ghost = false, children }: SlabProps) {
  const top = lift + height;
  const face = (z: number, extra?: object, className = 'iso-face') => <rect key={z} className={className} width={width} height={depth} transform={faceAt(z)} style={{ rx: radius, ...extra }} />;
  const layers = Array.from({ length: height }, (_, i) => lift + i);
  return (
    <g className={[pressed && 'iso-thump', ghost && 'iso-ghost'].filter(Boolean).join(' ') || undefined}>
      {pressed && (
        <g transform={faceAt(0)}>
          <rect width={width} height={depth} className="iso-ripple" style={{ rx: radius, stroke: fill }} />
        </g>
      )}
      {lift > 0 && <g className="iso-shadow">{face(0)}</g>}
      <g className="iso-side" style={{ fill }}>
        {layers.map((z) => face(z))}
      </g>
      {face(top, { fill, stroke: stroke ?? (ghost ? fill : 'none'), strokeWidth }, 'iso-face iso-top')}
      {ring && (
        <rect
          x={-4}
          y={-4}
          width={width + 8}
          height={depth + 8}
          transform={faceAt(top)}
          className="iso-ring"
          style={{ rx: `calc(${radius} + var(--ds-space-1))`, stroke: ring }}
        />
      )}
      <g transform={faceAt(top)}>{children}</g>
    </g>
  );
}

/** A label lying on a face, in a text style's size and weight. */
export function FaceLabel({ x, y, color, anchor = 'middle', children }: { x: number; y: number; color: string; anchor?: 'start' | 'middle'; children: string }) {
  return (
    <text x={x} y={y} className="iso-label" style={{ fill: color, textAnchor: anchor }}>
      {children}
    </text>
  );
}

/** The pointer leans like a system cursor; the pressing hand comes straight down. */
const TILT = { pointer: -32, press: 0 } as const;

/**
 * A system cursor: a light hand outlined in dark ink, its fingertip on `at`. The pointer circles slowly
 * over its target; the pressing hand falls onto it, lands, and lifts. Both stand still under reduced motion.
 */
export function IsoCursor({ glyph, at }: { glyph: keyof typeof HOTSPOT; at: Vec }) {
  const [x, y] = screen(at);
  const [hx, hy] = HOTSPOT[glyph];
  return (
    <g className={glyph === 'pointer' ? 'iso-orbit' : 'iso-press-hand'}>
      <path
        d={GLYPHS[glyph]}
        transform={`translate(${x} ${y}) rotate(${TILT[glyph]}) scale(${CURSOR_SCALE}) translate(${-hx} ${-hy})`}
        className="iso-cursor"
      />
    </g>
  );
}
