// CIE76 colour distance. sRGB -> linear -> XYZ (D65) -> Lab.
import { parseColor } from '../contrast.mjs';

const lin = (c) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);

export function toLab({ r, g, b }) {
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const x = f((0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / 0.95047);
  const y = f(0.2126729 * R + 0.7151522 * G + 0.072175 * B);
  const z = f((0.0193339 * R + 0.119192 * G + 0.9503041 * B) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

/** Opaque colour as {r,g,b}, or null for translucent or unparseable input. */
export function opaque(value) {
  try {
    const c = parseColor(value);
    return c.a === 1 ? c : null;
  } catch {
    return null;
  }
}

/** ΔE CIE76 between two colour strings; Infinity when either is not an opaque colour. */
export function deltaE76(a, b) {
  const [ca, cb] = [opaque(a), opaque(b)];
  if (!ca || !cb) return Infinity;
  return Math.hypot(...toLab(ca).map((v, i) => v - toLab(cb)[i]));
}
