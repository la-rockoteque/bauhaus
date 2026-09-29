#!/usr/bin/env node
// WCAG contrast: `contrast.mjs <fg> <bg>` or `contrast.mjs --tokens <dir> --pairs <file.json>`.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { deepMerge, flatten, loadTree, resolveTokens } from './lib/dtcg.mjs';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const byte = (v) => Math.round(clamp(v, 0, 255));

// ---------- colour parsing ----------

function parseHex(s) {
  let h = s.slice(1);
  if (h.length <= 4) h = [...h].map((c) => c + c).join('');
  const n = (i) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
}

/** "50%" -> 0.5 ; "0.5" -> 0.5 ; "120deg" -> 120. `scale` is what 100% means. */
function num(token, scale = 1) {
  const t = String(token).trim();
  if (t.endsWith('%')) return (parseFloat(t) / 100) * scale;
  return parseFloat(t);
}

function hslToRgb(h, s, l) {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

const toSrgb = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

function oklchToRgb(L, C, hDeg) {
  const a = C * Math.cos((hDeg * Math.PI) / 180);
  const b = C * Math.sin((hDeg * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return lin.map((v) => toSrgb(clamp(v, 0, 1)) * 255);
}

const FN = /^(rgba?|hsla?|oklch)\(\s*(.+?)\s*\)$/i;

/** Parse hex, rgb[a](), hsl[a]() or oklch() into {r,g,b,a}; r,g,b are integers 0-255, a is 0-1. */
export function parseColor(input) {
  const s = String(input).trim();
  if (/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(s)) return parseHex(s);
  const m = s.match(FN);
  if (!m) throw new Error(`Cannot parse colour "${input}" (supported: hex, rgb[a](), hsl[a](), oklch())`);
  const parts = m[2].split(/[\s,/]+/).filter(Boolean);
  const alpha = parts[3] === undefined ? 1 : clamp(num(parts[3]), 0, 1);
  const fn = m[1].toLowerCase();
  let rgb;
  if (fn.startsWith('rgb')) rgb = parts.slice(0, 3).map((p) => (String(p).endsWith('%') ? num(p, 255) : parseFloat(p)));
  else if (fn.startsWith('hsl')) rgb = hslToRgb(parseFloat(parts[0]), num(parts[1]), num(parts[2]));
  else rgb = oklchToRgb(num(parts[0]), num(parts[1], 0.4), parseFloat(parts[2]) || 0);
  if (rgb.some(Number.isNaN)) throw new Error(`Cannot parse colour "${input}"`);
  return { r: byte(rgb[0]), g: byte(rgb[1]), b: byte(rgb[2]), a: alpha };
}

/** Composite `fg` (with alpha) over an opaque `bg`. */
export function composite(fg, bg) {
  const mix = (f, b) => byte(f * fg.a + b * (1 - fg.a));
  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a: 1 };
}

// ---------- ratio + verdicts ----------

const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
export const luminance = ({ r, g, b }) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

export function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function verdicts(r) {
  return { aaNormal: r >= 4.5, aaLarge: r >= 3, aaaNormal: r >= 7, aaaLarge: r >= 4.5, nonText: r >= 3 };
}

const REQUIRED = { AA: { text: 4.5, 'large-text': 3, 'non-text': 3 }, AAA: { text: 7, 'large-text': 4.5, 'non-text': 3 } };

/** Ratio of `fg` over `bg`; fg alpha composites over bg, bg alpha over white. */
export function contrastOf(fgColor, bgColor) {
  const bg = composite(bgColor, { r: 255, g: 255, b: 255, a: 1 });
  return ratio(composite(fgColor, bg), bg);
}

// ---------- token pairs ----------

function tokenColor(token) {
  const v = token.resolved;
  if (token.$type !== 'color') throw new Error(`${token.path} is a ${token.$type ?? 'untyped'} token, not a color`);
  if (typeof v === 'string') return parseColor(v);
  if (v.hex) return parseColor(v.hex);
  const [r, g, b] = v.components.map((c) => c * 255);
  return { r: byte(r), g: byte(g), b: byte(b), a: v.alpha ?? 1 };
}

function checkPair(pair, byPath, level) {
  const use = pair.use ?? 'text';
  const base = { fg: pair.fg, bg: pair.bg, use };
  try {
    if (!REQUIRED[level][use]) throw new Error(`unknown use "${use}" (text | large-text | non-text)`);
    for (const p of [pair.fg, pair.bg]) if (!byPath.has(p)) throw new Error(`unknown token ${p}`);
    const r = contrastOf(tokenColor(byPath.get(pair.fg)), tokenColor(byPath.get(pair.bg)));
    const required = REQUIRED[level][use];
    return { ...base, ratio: r, required, pass: r >= required };
  } catch (err) {
    return { ...base, pass: false, error: err.message };
  }
}

/** Check every pair against `level`. `themeDir` overlays a theme's overrides on the tokens. */
export function runPairs({ tokensDir, themeDir, pairs, level = 'AA' }) {
  let tree = loadTree(tokensDir);
  if (themeDir) tree = deepMerge(tree, loadTree(themeDir));
  const byPath = new Map(resolveTokens(flatten(tree)).tokens.map((t) => [t.path, t]));
  const results = pairs.map((p) => checkPair(p, byPath, level));
  return { results, failures: results.filter((r) => !r.pass) };
}

// ---------- CLI ----------

const mark = (ok) => (ok ? 'PASS' : 'FAIL');
const floor2 = (r) => (Math.floor(r * 100) / 100).toFixed(2);

function printOne(fg, bg, io) {
  const r = contrastOf(parseColor(fg), parseColor(bg));
  const v = verdicts(r);
  io.log(`Contrast ${floor2(r)}:1  (${fg} on ${bg})`);
  io.log(`  Text 1.4.3 (AA)       normal ${mark(v.aaNormal)}   large ${mark(v.aaLarge)}`);
  io.log(`  Text 1.4.6 (AAA)      normal ${mark(v.aaaNormal)}   large ${mark(v.aaaLarge)}`);
  io.log(`  Non-text 1.4.11 (AA)  ${mark(v.nonText)}`);
}

function configLevel(configPath) {
  const file = path.resolve(configPath ?? 'bauhaus.config.json');
  if (!fs.existsSync(file)) return undefined;
  return JSON.parse(fs.readFileSync(file, 'utf8')).house?.contrast;
}

function printPairs({ results, failures }, level, io) {
  for (const r of results) {
    const detail = r.error ? r.error : `${floor2(r.ratio)}:1 (needs ${r.required})`;
    io.log(`${mark(r.pass)}  ${r.fg} on ${r.bg}  [${r.use}]  ${detail}`);
  }
  io.log(`${results.length - failures.length}/${results.length} pairs pass at ${level}.`);
}

const USAGE = 'Usage: contrast.mjs <fg> <bg>\n       contrast.mjs --tokens <dir> --pairs <file.json> [--theme <dir>] [--level AA|AAA] [--config <file>]';

export function main(argv, io = console) {
  try {
    const { values, positionals } = parseArgs({
      args: argv,
      allowPositionals: true,
      options: { tokens: { type: 'string' }, pairs: { type: 'string' }, theme: { type: 'string' }, level: { type: 'string' }, config: { type: 'string' } },
    });
    if (values.tokens && values.pairs) {
      const level = values.level ?? configLevel(values.config) ?? 'AA';
      if (!REQUIRED[level]) throw new Error(`--level must be AA or AAA, got ${level}`);
      const pairs = JSON.parse(fs.readFileSync(values.pairs, 'utf8'));
      const report = runPairs({ tokensDir: values.tokens, themeDir: values.theme, pairs, level });
      printPairs(report, level, io);
      return report.failures.length ? 1 : 0;
    }
    if (positionals.length === 2 && !values.tokens && !values.pairs) return (printOne(positionals[0], positionals[1], io), 0);
    io.error(USAGE);
    return 2;
  } catch (err) {
    io.error(`contrast: ${err.message}`);
    return 2;
  }
}

const invoked = process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1]);
if (invoked) process.exitCode = main(process.argv.slice(2));
