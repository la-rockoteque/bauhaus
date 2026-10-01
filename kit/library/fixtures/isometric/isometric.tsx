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

/**
 * A corner radius as CSS draws it. CSS shrinks a radius larger than half the shorter side to that half, so
 * radius.pill (9999px) gives round ends. An SVG rect clamps each axis on its own, which turns the ends into
 * long ellipses. Capping at half the shorter side matches CSS. space.1 is 4px, so n px is space.1 × n / 4.
 */
export const cornerOf = (radius: string, width: number, height: number): string =>
  `min(${radius}, calc(var(--ds-space-1) * ${Math.min(width, height) / 8}))`;

/**
 * The stage: a view box that holds a footprint of width × depth and a cursor above it. `rise` adds
 * headroom for what stands or floats higher, such as a dialog over its page.
 */
export function IsoStage({ width, depth, rise = 0, children }: { width: number; depth: number; rise?: number; children: ReactNode }) {
  const margin = 28;
  const x0 = -depth * COS - margin;
  const y0 = -margin - 12 - rise;
  const w = (width + depth) * COS + margin * 2;
  const h = (width + depth) * SIN + margin + 12 + 8 + rise;
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
  /** Outline: the body fades and the border stays solid, for a border role. */
  outline?: boolean;
  /** Dim: the whole slab and its face recede, as context for the part the scene is about. */
  dim?: boolean;
  /** Where the slab's back corner stands, on the stage's axes: on a page, on a card. */
  at?: Vec;
  /** Drawn on the top face, in its flat coordinates. */
  children?: ReactNode;
}

/**
 * A rounded slab. The sides are the top face repeated down each pixel and darkened, so the corners keep
 * the component's real radius at every height.
 */
export function Slab({ width, depth, height, lift = 0, radius, fill, stroke, strokeWidth, ring, pressed = false, ghost = false, outline = false, dim = false, at = [0, 0, 0], children }: SlabProps) {
  const top = lift + height;
  const corner = cornerOf(radius, width, depth);
  const face = (z: number, extra?: object, className = 'iso-face') => <rect key={z} className={className} width={width} height={depth} transform={faceAt(z)} style={{ rx: corner, ...extra }} />;
  const layers = Array.from({ length: height }, (_, i) => lift + i);
  return (
    <g
      className={[pressed && 'iso-thump', ghost && 'iso-ghost', outline && 'iso-outline', dim && 'iso-dim'].filter(Boolean).join(' ') || undefined}
      transform={`translate(${screen(at).join(' ')})`}
    >
      {pressed && (
        <g transform={faceAt(0)}>
          <rect width={width} height={depth} className="iso-ripple" style={{ rx: corner, stroke: fill }} />
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
          style={{ rx: `calc(${corner} + var(--ds-space-1))`, stroke: ring }}
        />
      )}
      <g transform={faceAt(top)}>{children}</g>
    </g>
  );
}

export interface FaceLabelProps {
  x: number;
  y: number;
  color: string;
  anchor?: 'start' | 'middle';
  /** `sm` for a label, `xs` for a meta line or a cell. */
  size?: 'sm' | 'xs';
  weight?: 'regular' | 'semibold';
  underline?: boolean;
  dim?: boolean;
  children: string;
}

/** A label lying on a face, in a text style's size and weight. */
export function FaceLabel({ x, y, color, anchor = 'middle', size = 'sm', weight = 'semibold', underline = false, dim = false, children }: FaceLabelProps) {
  return (
    <text
      x={x}
      y={y}
      className={['iso-label', dim && 'iso-dim'].filter(Boolean).join(' ')}
      style={{
        fill: color,
        textAnchor: anchor,
        fontSize: `var(--ds-font-size-${size})`,
        fontWeight: `var(--ds-font-weight-${weight})`,
        textDecoration: underline ? 'underline' : undefined,
      }}
    >
      {children}
    </text>
  );
}

export interface FaceRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  radius?: string;
  dim?: boolean;
  className?: string;
}

/** A flat shape on a face: a row, a bar, a well, a box. */
export function FaceRect({ x, y, width, height, fill = 'none', stroke, radius = '0', dim = false, className }: FaceRectProps) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      className={[className, dim && 'iso-dim'].filter(Boolean).join(' ') || undefined}
      style={{ rx: cornerOf(radius, width, height), fill, stroke: stroke ?? 'none', strokeWidth: stroke ? 'var(--ds-size-border-thin)' : undefined }}
    />
  );
}

/** A glyph of the icon set lying on a face, its box `size` wide with its top-left corner at x, y. */
export function FaceIcon({ glyph, x, y, size = 16, color, dim = false }: { glyph: keyof typeof GLYPHS; x: number; y: number; size?: number; color: string; dim?: boolean }) {
  return (
    <path
      d={GLYPHS[glyph]}
      transform={`translate(${x} ${y}) scale(${size / 24})`}
      className={['iso-icon', dim && 'iso-dim'].filter(Boolean).join(' ')}
      style={{ stroke: color }}
    />
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
