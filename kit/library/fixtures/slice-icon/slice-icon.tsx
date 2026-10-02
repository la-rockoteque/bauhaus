import type { CSSProperties } from 'react';
import { GLYPHS } from '../../foundations/iconography/glyphs';
import type { IconGlyph } from '../../foundations/iconography/glyphs';
import '../../foundations/color/series.css';
import { faceAt, screen } from '../isometric/isometric';
import type { Vec } from '../isometric/isometric';
import './slice-icon.css';

/**
 * The slice icon: one isometric drawing per foundation, primitive, component and pattern, built from
 * blocks on a grid of 4 by 4. The sidebar draws it beside the slice's name. Each slice takes the next
 * series colour (the golden-angle rule), so no two slices share a hue. Every colour is a `var()`.
 */

export interface Block {
  /** The near corner, on the grid: x along the width, y along the depth, z up. */
  at: Vec;
  /** Width, depth, height, in grid units. */
  size: Vec;
  /** Series steps from the slice's own colour. A second colour in one drawing. */
  shift?: number;
  /** A grey block: the page under an overlay, a track under its fill. */
  neutral?: boolean;
  /** A block drawn as an outline only: what is hidden, missing or loading. */
  ghost?: boolean;
  /** A glyph drawn flat on the block's top face. */
  glyph?: IconGlyph;
}

type Shape = readonly Block[];

const b = (at: Vec, size: Vec, rest: Omit<Block, 'at' | 'size'> = {}): Block => ({ at, size, ...rest });
const cube = (x: number, y: number, z: number, side: number, rest?: Omit<Block, 'at' | 'size'>) => b([x, y, z], [side, side, side], rest);
const grey = { neutral: true } as const;
const ghost = { ghost: true } as const;

/** Each slice by its sidebar name. The order sets each one's series colour, so keep new slices at the end of their group. */
export const SLICE_ICONS = {
  // Foundations
  Color: [cube(0, 0, 0, 1.4), cube(1.4, 0, 0, 1.4, { shift: 1 }), cube(2.8, 0, 0, 1.4, { shift: 2 })],
  Elevation: [b([0, 0, 0], [4, 4, 0.3], grey), b([0.5, 0.5, 1.2], [3, 3, 0.3]), b([1, 1, 2.4], [2, 2, 0.3], { shift: 1 })],
  Focus: [b([0, 0, 0], [4, 0.4, 0.4]), b([0, 3.6, 0], [4, 0.4, 0.4]), b([0, 0.4, 0], [0.4, 3.2, 0.4]), b([3.6, 0.4, 0], [0.4, 3.2, 0.4]), b([1, 1, 0], [2, 2, 1.2], grey)],
  Iconography: [b([0, 0, 0], [3.4, 3.4, 1.6], { glyph: 'eye' })],
  Motion: [b([0, 0, 0], [1, 3, 0.8]), b([1, 0, 0], [1, 3, 1.6]), b([2, 0, 0], [1, 3, 2.4]), b([3, 0, 0], [1, 3, 3.2], { shift: 1 })],
  Shape: [b([0, 0, 0], [3, 3, 1]), b([0.5, 0.5, 1], [2, 2, 1], { shift: 1 }), b([1, 1, 2], [1, 1, 1], { shift: 2 })],
  Spacing: [cube(0, 0, 0, 1.4), b([1.4, 0.5, 0], [1.2, 0.4, 0.3], grey), cube(2.6, 0, 0, 1.4)],
  Typography: [b([1.2, 1.2, 0], [1, 1, 2.6]), b([0, 1.2, 2.6], [3.4, 1, 0.9])],
  Themes: [b([0, 0, 0], [1.8, 3.6, 1.4]), b([1.8, 0, 0], [1.8, 3.6, 1.4], grey)],
  // Primitives
  Box: [cube(0, 0, 0, 3)],
  Divider: [b([0, 0, 0], [1.6, 3.6, 0.6]), b([1.6, 0, 0], [0.3, 3.6, 1.6], { shift: 1 }), b([1.9, 0, 0], [1.6, 3.6, 0.6])],
  Heading: [b([0, 0, 0], [4, 3, 0.4], grey), b([0.4, 0.4, 0.4], [3.2, 0.8, 0.9]), b([0.4, 1.6, 0.4], [2.2, 0.4, 0.3], { shift: 1 }), b([0.4, 2.2, 0.4], [2.6, 0.4, 0.3], { shift: 1 })],
  Icon: [b([0, 0, 0], [2.8, 2.8, 2.8], { glyph: 'plus' })],
  Stack: [b([0, 0, 0], [3, 3, 0.6]), b([0, 0, 0.6], [3, 3, 0.6], { shift: 1 }), b([0, 0, 1.2], [3, 3, 0.6], { shift: 2 })],
  Text: [b([0, 0, 0], [4, 3, 0.4], grey), b([0.4, 0.4, 0.4], [3.2, 0.4, 0.3]), b([0.4, 1.3, 0.4], [3.2, 0.4, 0.3]), b([0.4, 2.2, 0.4], [2, 0.4, 0.3])],
  'Visually hidden': [cube(0, 0, 0, 3, ghost)],
  // Clickables
  Button: [b([0, 0, 0], [4, 2, 0.5], grey), b([0.2, 0.2, 0.5], [3.6, 1.6, 0.7], { glyph: 'press' })],
  Chip: [b([0, 0, 0], [3.4, 1.4, 0.5]), cube(0.3, 0.35, 0.5, 0.7, { shift: 1 })],
  'Icon button': [b([0, 0, 0], [2.4, 2.4, 0.8], { glyph: 'settings' })],
  Link: [cube(0, 0, 0, 1.3), b([1.3, 0.45, 0.45], [1.4, 0.4, 0.4], { shift: 1 }), cube(2.7, 0, 0, 1.3)],
  'Menu item': [b([0, 0, 0], [3.6, 3.6, 0.4], grey), b([0.3, 1.3, 0.4], [3, 1, 0.5], { glyph: 'chevron-right' })],
  // Fields
  Checkbox: [b([0, 0, 0], [2.6, 2.6, 1], { glyph: 'check' })],
  Combobox: [b([0, 0, 1.2], [3.6, 1.2, 0.5], { glyph: 'search' }), b([0, 1.4, 0], [3.6, 2.2, 0.4], grey)],
  'Radio group': [cube(0, 0, 0, 1), cube(0, 1.4, 0, 1, { shift: 1 }), cube(0, 2.8, 0, 1), b([1.4, 1.4, 0], [2.4, 1, 0.3], grey)],
  Select: [b([0, 0, 0], [3.8, 1.6, 0.6], { glyph: 'chevron-down' })],
  Switch: [b([0, 0, 0], [3.4, 1.6, 0.4], grey), cube(1.8, 0.1, 0.4, 1.4)],
  'Text field': [b([0, 0, 0], [4, 1.6, 0.4]), b([0.5, 0.6, 0.4], [0.2, 0.4, 1.2], { shift: 1 })],
  Textarea: [b([0, 0, 0], [4, 3.6, 0.4]), b([0.4, 0.5, 0.4], [3.2, 0.3, 0.2], grey), b([0.4, 1.3, 0.4], [3.2, 0.3, 0.2], grey), b([0.4, 2.1, 0.4], [2, 0.3, 0.2], grey)],
  // Data structures
  Card: [b([0, 0, 0], [3, 4, 0.4]), b([0.3, 0.3, 0.4], [2.4, 1.8, 0.6], { shift: 1 })],
  Disclosure: [b([0, 0, 0.9], [3.6, 1.2, 0.5], { glyph: 'chevron-down' }), b([0.3, 1.4, 0], [3, 2.2, 0.4], grey)],
  List: [b([0, 0, 0], [3.6, 0.9, 0.5]), b([0, 1.2, 0], [3.6, 0.9, 0.5], { shift: 1 }), b([0, 2.4, 0], [3.6, 0.9, 0.5])],
  Table: [0, 1.3, 2.6].flatMap((y) => [0, 1.3, 2.6].map((x) => b([x, y, 0], [1.1, 1.1, y === 0 ? 0.9 : 0.4], y === 0 ? {} : grey))),
  // Feedback
  Badge: [b([0, 0, 0], [3, 3, 0.6], grey), cube(2.2, 0, 0.6, 1)],
  Banner: [b([0, 0, 0], [4, 1.4, 0.6], { glyph: 'info' })],
  'Empty state': [b([0, 0, 0], [4, 0.3, 1]), b([0, 0.3, 0], [0.3, 3.7, 1]), b([0.3, 0.3, 0], [3.7, 3.7, 0.2], ghost)],
  Progress: [b([0, 0, 0], [4, 1, 0.4], grey), b([0, 0, 0.4], [2.6, 1, 0.4])],
  Skeleton: [b([0, 0, 0], [3.6, 1, 0.5], ghost), b([0, 1.4, 0], [2.6, 1, 0.5], ghost), b([0, 2.8, 0], [3.2, 1, 0.5], ghost)],
  Spinner: [cube(1.4, 0, 0, 1), cube(2.8, 1.4, 0, 1, { shift: 1 }), cube(1.4, 2.8, 0, 1, { shift: 2 }), cube(0, 1.4, 0, 1, { shift: 3 })],
  Toast: [b([0, 0, 0], [4, 4, 0.3], grey), b([1.6, 2.4, 1.4], [2.2, 1.2, 0.4], { glyph: 'success' })],
  // Overlays
  'Alert dialog': [b([0, 0, 0], [4, 4, 0.3], grey), b([0.6, 0.6, 1.6], [2.8, 2.8, 0.4], { glyph: 'warning' })],
  'Confirmation dialog': [b([0, 0, 0], [4, 4, 0.3], grey), b([0.6, 0.6, 1.6], [2.8, 2.8, 0.4], { glyph: 'help' })],
  Menu: [b([0, 0, 0], [1.6, 0.8, 0.6], grey), b([0, 1, 1], [2.6, 0.8, 0.3]), b([0, 1.8, 1], [2.6, 0.8, 0.3], { shift: 1 }), b([0, 2.6, 1], [2.6, 0.8, 0.3])],
  Modal: [b([0, 0, 0], [4, 4, 0.3], grey), b([0.6, 0.6, 1.6], [2.8, 2.8, 0.4], { glyph: 'close' })],
  Popover: [cube(0, 0, 0, 1.2, grey), b([0, 1.4, 1.2], [3, 2.4, 0.4])],
  Tooltip: [cube(1, 1, 0, 1.4, grey), b([0.6, 0.6, 2.2], [2.2, 1, 0.3])],
  'Critical confirmation dialog': [b([0, 0, 0], [4, 4, 0.3], grey), b([0.6, 0.6, 1.6], [2.8, 2.8, 0.4], { glyph: 'warning' }), b([1, 2.7, 2], [2, 0.5, 0.2], { shift: 1 })],
  // Navigation
  Breadcrumb: [cube(0, 0, 0, 1), cube(1.4, 0, 0, 1, { shift: 1 }), cube(2.8, 0, 0, 1, { shift: 2 })].map((c, i) => ({ ...c, size: [1, 1, 0.5 + i * 0.5] as Vec })),
  Pagination: [0, 1, 2, 3].map((i) => b([i, 0, 0], [0.8, 0.8, i === 1 ? 1.4 : 0.5], i === 1 ? {} : grey)),
  Tabs: [b([0, 0, 0], [4, 3, 0.4], grey), b([0, 0, 0.4], [1.2, 0.6, 0.4]), b([1.4, 0, 0.4], [1.2, 0.6, 0.2], grey), b([2.8, 0, 0.4], [1.2, 0.6, 0.2], grey)],
  // Patterns
  'Empty results': [b([0, 0, 0], [4, 3.6, 0.3], grey), b([0.8, 0.6, 0.3], [2.4, 2.4, 0.6], { glyph: 'search', ghost: true })],
  Filtering: [b([1.4, 1.4, 0], [1, 1, 0.5]), b([0.9, 0.9, 0.9], [2, 2, 0.4], { shift: 1 }), b([0.3, 0.3, 1.7], [3.2, 3.2, 0.4], { glyph: 'filter' })],
  'Form validation': [b([0, 0, 0], [3, 1, 0.5], grey), b([0, 1.4, 0], [3, 1, 0.5], grey), cube(3.2, 1.4, 0, 1, { glyph: 'check' })],
  // Three messages, quietest first: the least disruptive one that does the job.
  Messaging: [b([0, 0, 0], [4, 4, 0.3], grey), b([0.2, 2.6, 0.3], [1.4, 1, 0.3]), b([1.8, 1.4, 0.3], [2, 2.4, 0.9], { shift: 1, glyph: 'bell' })],
  // One item kept, one lifted for deletion, one already gone.
  'Destructive actions': [cube(0, 0, 0, 1.2, grey), b([1.4, 1.4, 0.8], [1.4, 1.4, 0.4], { glyph: 'delete' }), cube(2.8, 2.8, 0, 1.2, ghost)],
} as const satisfies Record<string, Shape>;

export type SliceName = keyof typeof SLICE_ICONS;

const NAMES = Object.keys(SLICE_ICONS) as SliceName[];

export const hasSliceIcon = (name: string): name is SliceName => Object.hasOwn(SLICE_ICONS, name);

const corners = ({ at: [x, y, z], size: [w, d, h] }: Block) => ({
  top: [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]] as Vec[],
  left: [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]] as Vec[],
  right: [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]] as Vec[],
});

const points = (vs: Vec[]) => vs.map((v) => screen(v).join(',')).join(' ');

/** Painter's order: far blocks first, then lower ones. Enough for blocks that do not cross. */
const byDepth = (a: Block, c: Block) => a.at[0] + a.at[1] - (c.at[0] + c.at[1]) || a.at[2] - c.at[2];

function viewBox(shape: Shape): string {
  const xy = shape.flatMap((block) => Object.values(corners(block)).flat().map(screen));
  const pad = 0.3;
  const [minX, maxX] = [Math.min(...xy.map((p) => p[0])), Math.max(...xy.map((p) => p[0]))];
  const [minY, maxY] = [Math.min(...xy.map((p) => p[1])), Math.max(...xy.map((p) => p[1]))];
  const side = Math.max(maxX - minX, maxY - minY) + pad * 2;
  return [(minX + maxX - side) / 2, (minY + maxY - side) / 2, side, side].map((n) => n.toFixed(3)).join(' ');
}

function BlockShape({ block, part }: { block: Block; part: number }) {
  const faces = corners(block);
  const [x, y, z] = block.at;
  const [w, d, h] = block.size;
  const side = Math.min(w, d) * 0.7;
  const classes = ['slice-block ds-series ds-series--vivid', block.neutral && 'slice-block--neutral', block.ghost && 'slice-block--ghost'];
  return (
    <g className={classes.filter(Boolean).join(' ')} style={{ '--part': part + (block.shift ?? 0) } as CSSProperties}>
      <polygon className="slice-face slice-face--left" points={points(faces.left)} />
      <polygon className="slice-face slice-face--right" points={points(faces.right)} />
      <polygon className="slice-face slice-face--top" points={points(faces.top)} />
      {block.glyph && (
        <path
          className="slice-glyph"
          d={GLYPHS[block.glyph]}
          transform={`${faceAt(z + h)} translate(${x + (w - side) / 2} ${y + (d - side) / 2}) scale(${side / 24})`}
        />
      )}
    </g>
  );
}

export interface SliceIconProps {
  name: SliceName;
  /** The side of the drawing, as a CSS length. Default: size.icon.md. */
  size?: string;
}

/** The isometric icon of one slice. Decorative: the slice's name always stands beside it. */
export function SliceIcon({ name, size }: SliceIconProps) {
  const shape: Shape = SLICE_ICONS[name];
  const part = NAMES.indexOf(name);
  const style = size ? ({ '--slice-icon-size': size } as CSSProperties) : undefined;
  return (
    <svg className="slice-icon" viewBox={viewBox(shape)} style={style} data-part={part} aria-hidden="true" focusable="false">
      {[...shape].sort(byDepth).map((block, i) => (
        <BlockShape key={i} block={block} part={part} />
      ))}
    </svg>
  );
}
