// Reads a glyph's path data into points and commands, for the iconography checks and tests.
// It understands only the commands a glyph may use (M L H V A Z, absolute or relative). Anything
// else shows up in `commands`, so a check can name the curve that breaks the drawing system.
export type Point = readonly [number, number];

export interface GlyphShape {
  /** The distinct commands used, upper case, in order of first use. */
  commands: string[];
  /** Every vertex, plus samples along each arc, in the 24 by 24 grid. */
  points: Point[];
  /** True when every arc has equal radii, so it is a piece of a circle. */
  circularArcs: boolean;
}

const ARITY: Record<string, number> = { M: 2, L: 2, H: 1, V: 1, A: 7, Z: 0, C: 6, S: 4, Q: 4, T: 2 };
const ARC_STEP = Math.PI / 36;

function arcSamples([x1, y1]: Point, r: number, large: number, sweep: number, [x2, y2]: Point): Point[] {
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const d = Math.hypot(dx, dy);
  if (d === 0) return [];
  const radius = Math.max(r, d);
  const coef = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, radius * radius - d * d) / (d * d));
  const cx = coef * dy + (x1 + x2) / 2;
  const cy = -coef * dx + (y1 + y2) / 2;
  const start = Math.atan2(y1 - cy, x1 - cx);
  let sweepBy = Math.atan2(y2 - cy, x2 - cx) - start;
  if (!sweep && sweepBy > 0) sweepBy -= 2 * Math.PI;
  if (sweep && sweepBy < 0) sweepBy += 2 * Math.PI;
  const steps = Math.ceil(Math.abs(sweepBy) / ARC_STEP);
  return Array.from({ length: steps + 1 }, (_, i) => [cx + radius * Math.cos(start + (sweepBy * i) / steps), cy + radius * Math.sin(start + (sweepBy * i) / steps)] as const);
}

export function parseGlyph(d: string): GlyphShape {
  const tokens = d.match(/[a-zA-Z]|-?(?:\d*\.\d+|\d+)/g) ?? [];
  const commands: string[] = [];
  const points: Point[] = [];
  let circularArcs = true;
  let at: Point = [0, 0];
  let subpath: Point = [0, 0];
  let i = 0;
  while (i < tokens.length) {
    const letter = tokens[i++];
    const command = letter.toUpperCase();
    const relative = letter !== command;
    if (!(command in ARITY)) throw new Error(`glyph path: unknown command ${letter}`);
    if (!commands.includes(command)) commands.push(command);
    if (command === 'Z') {
      at = subpath;
      continue;
    }
    let first = true;
    do {
      const args = tokens.slice(i, i + ARITY[command]).map(Number);
      if (args.length < ARITY[command] || args.some(Number.isNaN)) throw new Error(`glyph path: ${letter} needs ${ARITY[command]} numbers`);
      i += ARITY[command];
      const [ox, oy] = relative ? at : [0, 0];
      let next: Point;
      if (command === 'H') next = [ox + args[0], at[1]];
      else if (command === 'V') next = [at[0], oy + args[0]];
      else if (command === 'A') {
        next = [ox + args[5], oy + args[6]];
        if (args[0] !== args[1]) circularArcs = false;
        points.push(...arcSamples(at, args[0], args[3], args[4], next));
      } else if (ARITY[command] >= 2) next = [ox + args[ARITY[command] - 2], oy + args[ARITY[command] - 1]];
      else next = at;
      points.push(next);
      at = next;
      if (command === 'M' && first) subpath = next;
      first = false;
    } while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i]));
  }
  return { commands, points, circularArcs };
}

/** The box that holds every point: [minX, minY, maxX, maxY]. */
export function boundsOf(points: readonly Point[]): readonly [number, number, number, number] {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}
