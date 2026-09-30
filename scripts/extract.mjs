#!/usr/bin/env node
// extract.mjs <dir> [--out .bauhaus/extract] [--prefix ds]
// Reads a codebase and writes what it finds to inventory.json, tokens.draft.json, report.md.
//
// How it reads: text scan, no parser. Comments are blanked, `@media` conditions are read for
// breakpoints then blanked, and every `prop: value` pair is classified by the property name
// (custom properties by keywords in their name). Ceiling: a false positive in odd syntax, and
// no view of styles built at runtime.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { parseColor, luminance } from './contrast.mjs';

export const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.git', 'storybook-static', 'coverage']);
const EXTENSIONS = new Set(['.css', '.scss', '.sass', '.less', '.tsx', '.jsx', '.ts', '.js', '.vue', '.svelte', '.html']);
// Test files hold CSS in strings and fixtures; they would inflate every count.
const TEST_FILE = /\.(test|spec)\./;
const JS_LIKE = new Set(['.tsx', '.jsx', '.ts', '.js']);
const LINE_COMMENTS = new Set(['.scss', '.sass', '.less', '.tsx', '.jsx', '.ts', '.js', '.vue', '.svelte']);
export const CATEGORIES = ['color', 'spacing', 'radius', 'size', 'font-size', 'line-height', 'duration', 'easing', 'shadow', 'z-index', 'font-family', 'breakpoint'];
const MAX_FILES_PER_ENTRY = 10;

// Colour clustering: two opaque colours closer than this (RGB distance, 0-441) share a token.
export const CLUSTER_DISTANCE = 12;
// A colour whose channels differ by less than this is a grey.
const GRAY_CHROMA = 32;

// ---------- walking + cleaning ----------

export function walk(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(full, base, out);
    } else if (EXTENSIONS.has(path.extname(entry.name)) && !TEST_FILE.test(entry.name)) out.push(path.relative(base, full));
  }
  return out;
}

export const blank = (text, re) => text.replace(re, (m) => m.replace(/[^\n]/g, ' '));

export function cleanSource(source, ext) {
  const noBlock = blank(source, /\/\*[\s\S]*?\*\//g);
  return LINE_COMMENTS.has(ext) ? blank(noBlock, /(?<![:'"`])\/\/.*$/gm) : noBlock;
}

export function lineFinder(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') starts.push(i + 1);
  return (index) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= index) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
}

// ---------- value helpers ----------

const collapse = (s) => s.replace(/\s+/g, ' ').trim();
const kebab = (s) => (s.startsWith('--') ? s : s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`));
const VAR_CALL = /var\([^()]*\)/g;
const LENGTH = /(?<![\w.#-])(-?\d*\.?\d+)(px|rem|em)(?![\w-])/g;
const TIME = /(?<![\w.-])(\d*\.?\d+)(ms|s)(?![\w-])/g;
const EASING_WORD = /(?<![\w-])(ease-in-out|ease-in|ease-out|ease|linear)(?![\w-])/g;
const CUBIC = /cubic-bezier\(([^()]*)\)/g;

const lengthsIn = (v) => [...v.matchAll(LENGTH)].filter((m) => parseFloat(m[1]) !== 0).map((m) => `${parseFloat(m[1])}${m[2]}`);
const timesIn = (v) => [...v.matchAll(TIME)].filter((m) => parseFloat(m[1]) !== 0).map((m) => `${parseFloat(m[1])}${m[2]}`);
const easingsIn = (v) => [
  ...[...v.matchAll(EASING_WORD)].map((m) => m[1]),
  ...[...v.matchAll(CUBIC)].map((m) => `cubic-bezier(${m[1].split(',').map((n) => parseFloat(n)).join(', ')})`),
];

/** px number for "12px" / "0.5rem" / "1em" (1rem = 1em = 16px), else null. */
export function toPx(value) {
  const m = String(value).match(/^(-?\d*\.?\d+)(px|rem|em)$/);
  return m ? parseFloat(m[1]) * (m[2] === 'px' ? 1 : 16) : null;
}

/** Nearest 4px step for a spacing value; null below 2px (hairlines are not spacing). */
export function snapSpacing(value) {
  const px = toPx(value);
  return px === null || px < 2 ? null : Math.round(px / 4) * 4;
}

// ---------- reading declarations ----------

// Family of a CSS property, or of a custom property by the words in its name.
const FAMILIES = [
  ['shadow', /shadow|elevation/],
  ['z-index', /z-index|(^|-)z(-|$)/],
  ['radius', /radius/],
  ['font-size', /font-size|text-size|fontsize/],
  ['line-height', /line-height|leading/],
  ['font-family', /font-family|font-stack|^--font-(?!size|weight|style|feature|variation)/],
  ['spacing', /margin|padding|gap|inset|(?<!(letter|word|white)-)spac(e|ing)/],
  ['size', /(^|-)(width|height|size)(-|$)/],
];
const TIME_PROP = /transition|animation|duration|delay|speed|motion|(^|-)dur(-|$)/;
const EASE_PROP = /transition|animation|ease|easing|timing|motion/;
const familyOf = (prop) => FAMILIES.find(([, re]) => re.test(prop))?.[0] ?? null;

/** End index of a declaration value. Splits on `,` only in JS-like files (object literals). */
function valueEnd(text, start, splitComma) {
  let depth = 0;
  let quote = '';
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === quote) quote = '';
    } else if (c === '"' || c === "'" || c === '`') {
      if (i === start || /[\s,(]/.test(text[i - 1])) quote = c;
      else return i;
    } else if (c === '(') depth++;
    else if (c === ')') {
      if (depth === 0) return i;
      depth--;
    } else if (depth === 0 && (c === ';' || c === '}' || c === '{' || (splitComma && c === ','))) return i;
  }
  return text.length;
}

const DECL = /(?<![\w-])(-{0,2}[A-Za-z_][\w-]*)['"]?\s*:(?!:)\s*/g;

function scanDeclarations(text, ext, lineOf) {
  const decls = [];
  const customLines = new Set();
  for (const m of text.matchAll(DECL)) {
    const start = m.index + m[0].length;
    const end = valueEnd(text, start, JS_LIKE.has(ext));
    const value = collapse(text.slice(start, end));
    if (!value) continue;
    const decl = { prop: kebab(m[1]), value, line: lineOf(m.index) };
    decls.push(decl);
    if (decl.prop.startsWith('--')) for (let l = decl.line; l <= lineOf(end); l++) customLines.add(l);
  }
  return { decls, customLines };
}

const SKIP_KEYWORD = /^(none|inherit|initial|unset|revert)$/i;

function familyValues(family, value) {
  const bare = value.replace(VAR_CALL, ' ');
  if (['spacing', 'radius', 'size', 'font-size'].includes(family)) return lengthsIn(bare);
  if (family === 'line-height') return [...lengthsIn(bare), ...(/^\d*\.?\d+$/.test(bare.trim()) && parseFloat(bare) !== 0 ? [String(parseFloat(bare))] : [])];
  if (family === 'z-index') return /^-?\d+$/.test(bare.trim()) ? [bare.trim()] : [];
  if (SKIP_KEYWORD.test(value) || /^var\([^()]*\)$/.test(value)) return [];
  return [value]; // font-family, shadow
}

function declRecords({ prop, value, line }, add) {
  const declared = prop.startsWith('--');
  const bare = value.replace(VAR_CALL, ' ');
  const family = familyOf(prop);
  if (family) for (const v of familyValues(family, value)) add(family, v, line, declared);
  if (TIME_PROP.test(prop)) for (const v of timesIn(bare)) add('duration', v, line, declared);
  if (EASE_PROP.test(prop)) for (const v of easingsIn(bare)) add('easing', v, line, declared);
}

// ---------- colours, breakpoints ----------

const HEX = /(?<![\w&#-])#([0-9a-fA-F]{3,8})(?![\w-])/g;
const COLOR_FN = /\b(?:rgba?|hsla?|oklch|oklab|hwb)\(\s*[^()]*\)/gi;

function normalizeHex(digits) {
  const d = digits.toLowerCase();
  return `#${d.length <= 4 ? [...d].map((c) => c + c).join('') : d}`;
}

const normalizeColorFn = (s) => s.toLowerCase().replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ')
  .replace(/(^|[\s(,/])\.(\d)/g, '$10.$2').replace(/\(\s+/, '(').replace(/\s+\)/, ')');

function scanColors(text, lineOf, customLines, add) {
  const push = (value, index) => add('color', value, lineOf(index), customLines.has(lineOf(index)));
  for (const m of text.matchAll(HEX)) {
    if (![3, 4, 6, 8].includes(m[1].length)) continue;
    const before = text.slice(text.lastIndexOf('\n', m.index) + 1, m.index);
    if (/[:(=['"`,]/.test(before) && !/url\(\s*['"]?$/.test(before)) push(normalizeHex(m[1]), m.index);
  }
  for (const m of text.matchAll(COLOR_FN)) push(normalizeColorFn(m[0]), m.index);
}

const MEDIA = /@(?:media|container)[^{;]*/g;
const BREAKPOINTS = [
  /\(\s*(?:min|max)-width\s*:\s*(\d*\.?\d+)(px|em|rem)\s*\)/g,
  /\bwidth\s*[<>]=?\s*(\d*\.?\d+)(px|em|rem)/g,
];

function scanBreakpoints(text, lineOf, add) {
  for (const q of text.matchAll(MEDIA)) {
    for (const re of BREAKPOINTS) {
      for (const m of q[0].matchAll(re)) add('breakpoint', `${parseFloat(m[1])}${m[2]}`, lineOf(q.index), false);
    }
  }
}

// ---------- one file ----------

const USAGE = /var\(\s*(--[\w-]+)/g;

/** Scan one file's text. Returns {records, declared, used}; lines are 1-based. */
export function scanFile(source, ext) {
  const cleaned = cleanSource(source, ext);
  const lineOf = lineFinder(cleaned);
  const records = [];
  const add = (category, value, line, declared) => records.push({ category, value, line, declared });
  scanBreakpoints(cleaned, lineOf, add);
  const text = blank(cleaned, MEDIA);
  const { decls, customLines } = scanDeclarations(text, ext, lineOf);
  for (const d of decls) declRecords(d, add);
  scanColors(text, lineOf, customLines, add);
  for (const r of records) if (r.category === 'color') r.prop = decls.findLast((d) => d.line === r.line)?.prop;
  return {
    records,
    declared: decls.filter((d) => d.prop.startsWith('--')).map((d) => ({ name: d.prop, value: d.value, line: d.line })),
    used: [...text.matchAll(USAGE)].map((m) => ({ name: m[1], line: lineOf(m.index) })),
  };
}

// ---------- whole directory ----------

const bySlot = (map, key, init) => {
  if (!map.has(key)) map.set(key, init());
  return map.get(key);
};
const byCountThenName = (a, b) => b.count - a.count || String(a.value ?? a.name).localeCompare(String(b.value ?? b.name));

function addFile(acc, file, scan) {
  const where = (line) => `${file}:${line}`;
  for (const r of scan.records) {
    const entry = bySlot(bySlot(acc.inventory, r.category, () => new Map()), r.value, () => ({ value: r.value, count: 0, declared: 0, files: [] }));
    entry.count += 1;
    entry.declared += r.declared ? 1 : 0;
    if (r.prop) entry.props = { ...entry.props, [r.prop]: (entry.props?.[r.prop] ?? 0) + 1 }; // colours only: which property they sit in
    if (entry.files.length < MAX_FILES_PER_ENTRY) entry.files.push(where(r.line));
  }
  for (const d of scan.declared) {
    const entry = bySlot(acc.declared, d.name, () => ({ name: d.name, value: d.value, files: [] }));
    if (entry.files.length < MAX_FILES_PER_ENTRY) entry.files.push(where(d.line));
  }
  for (const u of scan.used) {
    const entry = bySlot(acc.used, u.name, () => ({ name: u.name, count: 0, files: [] }));
    entry.count += 1;
    if (entry.files.length < MAX_FILES_PER_ENTRY) entry.files.push(where(u.line));
  }
}

/** Scan a folder. Returns {root, prefix, files, inventory, customProperties}. */
export function extractDir(dir, { prefix = 'ds' } = {}) {
  const acc = { inventory: new Map(), declared: new Map(), used: new Map() };
  const files = walk(dir);
  for (const file of files) addFile(acc, file, scanFile(fs.readFileSync(path.join(dir, file), 'utf8'), path.extname(file)));
  const inventory = Object.fromEntries(CATEGORIES.map((c) => [c, [...(acc.inventory.get(c)?.values() ?? [])].sort(byCountThenName)]));
  const declared = [...acc.declared.values()].sort((a, b) => a.name.localeCompare(b.name));
  const used = [...acc.used.values()].sort(byCountThenName);
  return {
    root: dir, prefix, files: files.length, inventory,
    customProperties: {
      declared, used,
      unused: declared.filter((d) => !acc.used.has(d.name)).map((d) => d.name),
      undeclared: used.filter((u) => !acc.declared.has(u.name)),
    },
  };
}

// ---------- colour clusters ----------

function hueName([r, g, b]) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < GRAY_CHROMA) return 'gray';
  let h = max === r ? (g - b) / (max - min) : max === g ? 2 + (b - r) / (max - min) : 4 + (r - g) / (max - min);
  h = (h * 60 + 360) % 360;
  const bands = [[15, 'red'], [45, 'orange'], [70, 'yellow'], [165, 'green'], [200, 'teal'], [255, 'blue'], [290, 'purple'], [345, 'pink']];
  return bands.find(([limit]) => h < limit)?.[1] ?? 'red';
}

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/**
 * Group colours: greedy, most-used first. A colour joins the first cluster whose head is within
 * CLUSTER_DISTANCE (RGB distance); otherwise it starts one. Translucent and unparseable colours
 * stay alone. Returns [{head, members, count, hue, light}].
 */
export function clusterColors(colors) {
  const clusters = [];
  for (const color of [...colors].sort((a, b) => b.count - a.count)) {
    let c;
    try { c = parseColor(color.value); } catch { c = null; }
    const rgb = c ? [c.r, c.g, c.b] : null;
    const home = c && c.a === 1 ? clusters.find((k) => k.rgb && k.opaque && distance(k.rgb, rgb) <= CLUSTER_DISTANCE) : null;
    if (home) {
      home.members.push(color);
      home.count += color.count;
    } else {
      clusters.push({
        head: color.value, rgb, opaque: c?.a === 1, members: [color], count: color.count,
        hue: !c ? 'other' : c.a < 1 ? 'alpha' : hueName(rgb), light: c ? luminance(c) : 0,
      });
    }
  }
  return clusters.map(({ rgb, opaque, ...rest }) => rest);
}

// ---------- draft tokens ----------

const list = (entries) => entries.map((e) => `${e.value} (×${e.count})`).join(', ');
const token = (value, description) => ({ $value: value, $description: description });
const numbered = (items) => Object.fromEntries(items.map(([key, t]) => [key, t]));

function colorGroup(colors) {
  const group = { $type: 'color' };
  const byHue = {};
  for (const c of clusterColors(colors)) (byHue[c.hue] ??= []).push(c);
  for (const [hue, clusters] of Object.entries(byHue)) {
    clusters.sort((a, b) => b.light - a.light);
    group[hue] = numbered(clusters.map((c, i) => [i + 1, token(c.head, `${c.count} uses. ${list(c.members)}`)]));
  }
  return group;
}

/** Group entries by a numeric key (null skips one), ascending. `valueOf(key)` builds the token value. */
function scaleGroup(type, entries, keyOf, valueOf) {
  const groups = new Map();
  for (const e of entries) {
    const key = keyOf(e.value);
    if (key !== null) bySlot(groups, key, () => []).push(e);
  }
  const sorted = [...groups.entries()].sort((a, b) => a[0] - b[0]);
  return { $type: type, ...numbered(sorted.map(([key, es]) => [key, token(valueOf(key), list(es))])) };
}

const BEZIER = {
  ease: [0.25, 0.1, 0.25, 1], 'ease-in': [0.42, 0, 1, 1], 'ease-out': [0, 0, 0.58, 1], 'ease-in-out': [0.42, 0, 0.58, 1], linear: [0, 0, 1, 1],
};

function easingGroup(entries) {
  const group = { $type: 'cubicBezier' };
  let n = 0;
  for (const e of entries) {
    const numbers = e.value.startsWith('cubic-bezier(') ? e.value.slice(13, -1).split(',').map(Number) : BEZIER[e.value];
    if (numbers?.length === 4 && numbers.every(Number.isFinite)) group[BEZIER[e.value] ? e.value : `bezier-${++n}`] = token(numbers, `${e.count} uses`);
  }
  return group;
}

const splitTop = (s, sep) => {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const c of s) {
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (depth === 0 && sep.test(c)) {
      if (cur) parts.push(cur);
      cur = '';
    } else cur += c;
  }
  return cur ? [...parts, cur] : parts;
};

const asLength = (t) => (/^-?\d*\.?\d+(px|rem|em)$/.test(t) ? t : /^-?0$/.test(t) ? '0px' : null);

/** "0 1px 2px rgba(0,0,0,.2), inset 0 0 0 1px #000" -> DTCG shadow layers, or null. */
export function parseShadow(value) {
  const layers = splitTop(value, /,/).map((layer) => {
    const parts = splitTop(layer.trim(), /\s/);
    const lengths = parts.map(asLength).filter(Boolean);
    const color = parts.find((p) => !asLength(p) && p !== 'inset');
    if (lengths.length < 2 || lengths.length > 4 || !color) return null;
    const [offsetX, offsetY, blur = '0px', spread] = lengths;
    return { color, offsetX, offsetY, blur, ...(spread ? { spread } : {}), ...(parts.includes('inset') ? { inset: true } : {}) };
  });
  return layers.length > 0 && layers.every(Boolean) ? layers : null;
}

function shadowGroup(entries) {
  const parsed = entries.map((e) => [parseShadow(e.value), e]).filter(([layers]) => layers);
  return { $type: 'shadow', ...numbered(parsed.map(([layers, e], i) => [i + 1, token(layers, `${e.count} uses. ${e.value}`)])) };
}

const familyList = (v) => splitTop(v, /,/).map((s) => s.trim().replace(/^["']|["']$/g, ''));

function fontGroup(inv) {
  const px = (key) => `${key}px`;
  return {
    size: scaleGroup('dimension', inv['font-size'], toPx, px),
    'line-height': scaleGroup('number', inv['line-height'].filter((e) => /^\d*\.?\d+$/.test(e.value)), Number, (k) => k),
    family: { $type: 'fontFamily', ...numbered(inv['font-family'].map((e, i) => [i + 1, token(familyList(e.value), `${e.count} uses`)])) },
  };
}

const toMs = (v) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000);

/** Build a draft DTCG tree from an extraction. Names are placeholders to review. */
export function buildDraft({ inventory: inv }) {
  const radius = scaleGroup('dimension', inv.radius, toPx, (k) => (k >= 999 ? '9999px' : `${k}px`));
  return {
    color: colorGroup(inv.color),
    // space.<n> = n x 4px, the same names the kit uses
    space: scaleGroup('dimension', inv.spacing, (v) => (snapSpacing(v) === null ? null : snapSpacing(v) / 4), (k) => `${k * 4}px`),
    radius,
    font: fontGroup(inv),
    duration: scaleGroup('duration', inv.duration, (v) => Math.round(toMs(v)), (k) => `${k}ms`),
    easing: easingGroup(inv.easing),
    shadow: shadowGroup(inv.shadow),
    z: scaleGroup('number', inv['z-index'], Number, (k) => k),
    breakpoint: scaleGroup('dimension', inv.breakpoint, toPx, (k) => `${k}px`),
  };
}

// ---------- report ----------

const sum = (list, f) => list.reduce((n, e) => n + f(e), 0);
const ticks = (s) => `\`${s}\``;

function summaryTable(inv) {
  const rows = CATEGORIES.map((c) => `| ${c} | ${sum(inv[c], (e) => e.count)} | ${inv[c].length} | ${sum(inv[c], (e) => e.declared)} |`);
  return ['| Category | Occurrences | Distinct | In custom properties |', '|---|---|---|---|', ...rows].join('\n');
}

function topOffenders(inv) {
  const all = CATEGORIES.flatMap((c) => inv[c].map((e) => ({ category: c, ...e, loose: e.count - e.declared })));
  return all.filter((e) => e.loose > 0).sort((a, b) => b.loose - a.loose).slice(0, 10)
    .map((e, i) => `${i + 1}. ${e.category} ${ticks(e.value)}: ${e.loose} uses outside custom properties (first: ${e.files[0]})`);
}

function distinctValues(inv) {
  return CATEGORIES.filter((c) => inv[c].length).map((c) => {
    const shown = inv[c].slice(0, 15).map((e) => `${ticks(e.value)} ×${e.count}`).join(', ');
    return `### ${c} (${inv[c].length})\n\n${shown}${inv[c].length > 15 ? ', …' : ''}`;
  });
}

function customSection(cp, prefix) {
  const own = cp.declared.filter((d) => d.name.startsWith(`--${prefix}-`)).length;
  const cap = (items, f) => (items.length ? items.slice(0, 30).map(f).join('\n') + (items.length > 30 ? `\n- … ${items.length - 30} more` : '') : '- none');
  return [
    `${cp.declared.length} declared (${own} with \`--${prefix}-\`, ${cp.declared.length - own} other), ${cp.used.length} used, ${cp.unused.length} unused, ${cp.undeclared.length} undeclared.`,
    `### Declared but never used (${cp.unused.length})\n\n${cap(cp.unused, (n) => `- ${ticks(n)}`)}`,
    `### Used but never declared (${cp.undeclared.length})\n\n${cap(cp.undeclared, (u) => `- ${ticks(u.name)} ×${u.count} (first: ${u.files[0]})`)}`,
  ];
}

const values = (group) => Object.entries(group).filter(([k]) => !k.startsWith('$')).map(([, t]) => t.$value);

function suggestedScale(draft, inv) {
  const clusters = Object.entries(draft.color).filter(([k]) => k !== '$type').map(([hue, g]) => `${hue} ${values(g).length}`);
  const colors = sum(Object.values(draft.color).filter((g) => typeof g === 'object'), (g) => values(g).length);
  return [
    `- Colour: ${inv.color.length} distinct literals cluster into ${colors} (${clusters.join(', ') || 'none'}). Distance limit ${CLUSTER_DISTANCE}.`,
    `- Spacing: ${inv.spacing.length} distinct values snap to ${values(draft.space).length} steps on a 4px grid: ${values(draft.space).join(', ') || 'none'}.`,
    `- Radius: ${values(draft.radius).join(', ') || 'none'}.`,
    `- Font size: ${values(draft.font.size).join(', ') || 'none'}.`,
    `- Duration: ${values(draft.duration).join(', ') || 'none'}.`,
    `- z-index: ${values(draft.z).join(', ') || 'none'}.`,
    `- Breakpoints: ${values(draft.breakpoint).join(', ') || 'none'}.`,
  ];
}

export function buildReport(result) {
  const { inventory: inv, customProperties: cp } = result;
  const numbered10 = topOffenders(inv);
  return [
    '# Extraction report',
    `Scanned \`${result.root}\`: ${result.files} files.`,
    `## Summary\n\n${summaryTable(inv)}`,
    `## Top offenders\n\nLiterals used outside custom-property declarations, most used first.\n\n${numbered10.join('\n') || 'None.'}`,
    `## Distinct values\n\n${distinctValues(inv).join('\n\n') || 'None.'}`,
    `## Custom properties\n\n${customSection(cp, result.prefix).join('\n\n')}`,
    `## Suggested scale\n\nDrafted in \`tokens.draft.json\`. Names are placeholders. Review each one.\n\n${suggestedScale(buildDraft(result), inv).join('\n')}`,
  ].join('\n\n') + '\n';
}

// ---------- CLI ----------

const USAGE_TEXT = 'Usage: extract.mjs <dir> [--out .bauhaus/extract] [--prefix ds]';

export function main(argv, io = console) {
  try {
    const { values: opts, positionals } = parseArgs({
      args: argv, allowPositionals: true,
      options: { out: { type: 'string', default: '.bauhaus/extract' }, prefix: { type: 'string', default: 'ds' } },
    });
    if (positionals.length !== 1) return (io.error(USAGE_TEXT), 2);
    const dir = path.resolve(positionals[0]);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return (io.error(`extract: not a folder: ${positionals[0]}`), 2);
    const result = extractDir(positionals[0], { prefix: opts.prefix });
    fs.mkdirSync(opts.out, { recursive: true });
    const write = (name, content) => fs.writeFileSync(path.join(opts.out, name), content);
    write('inventory.json', `${JSON.stringify(result.inventory, null, 2)}\n`);
    write('custom-properties.json', `${JSON.stringify(result.customProperties, null, 2)}\n`);
    write('tokens.draft.json', `${JSON.stringify(buildDraft(result), null, 2)}\n`);
    write('report.md', buildReport(result));
    io.log(`scanned ${result.files} files; wrote inventory.json, custom-properties.json, tokens.draft.json, report.md to ${opts.out}`);
    return 0;
  } catch (err) {
    io.error(`extract: ${err.message}`);
    return 2;
  }
}

const invoked = process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1]);
if (invoked) process.exitCode = main(process.argv.slice(2));
