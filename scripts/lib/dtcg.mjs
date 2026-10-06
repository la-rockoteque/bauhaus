// DTCG token loading: load, flatten, resolve aliases, validate.
// A token is any object with `$value`. Groups may carry `$type` and pass it down.
import fs from 'node:fs';
import path from 'node:path';

export const DTCG_TYPES = [
  'color', 'dimension', 'fontFamily', 'fontWeight', 'duration', 'cubicBezier', 'number',
  'strokeStyle', 'border', 'transition', 'shadow', 'gradient', 'typography',
];

const ALIAS_WHOLE = /^\{([^{}]+)\}$/;
const ALIAS_ANY = /\{([^{}]+)\}/g;
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isToken = (n) => isObj(n) && '$value' in n;

// ---------- load + merge ----------

/** Merge two token trees. Groups merge by key; a token replaces its twin but keeps the base `$type`. */
export function deepMerge(a, b) {
  if (isToken(a) && isToken(b)) return { ...a, ...b };
  if (!isObj(a) || !isObj(b) || isToken(a) || isToken(b)) return b;
  const out = { ...a };
  for (const [key, value] of Object.entries(b)) out[key] = key in a ? deepMerge(a[key], value) : value;
  return out;
}

function findTokenFiles(dir, skip, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((x, y) => x.name.localeCompare(y.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skip.includes(path.resolve(full))) findTokenFiles(full, skip, out);
    } else if (entry.name.endsWith('.tokens.json')) out.push(full);
  }
  return out;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    throw new Error(`${file}: ${err.message}`);
  }
}

/**
 * Load every *.tokens.json under `dir`, deep-merged in filename order.
 * `skip` is a list of folders to leave out (theme folders that live under the source).
 * A folder named `themes` is skipped by default.
 */
export function loadTree(dir, { skip } = {}) {
  const skipped = skip ?? [path.resolve(dir, 'themes')];
  const abs = skipped.map((s) => path.resolve(s));
  return findTokenFiles(dir, abs).reduce((tree, file) => deepMerge(tree, readJson(file)), {});
}

// ---------- flatten ----------

/** Flatten a tree to [{path, $type, $value, $description}], inheriting `$type` from groups. */
export function flatten(tree, prefix = [], inherited) {
  const out = [];
  const type = tree.$type ?? inherited;
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$') || !isObj(node)) continue;
    const here = [...prefix, key];
    if (isToken(node)) {
      out.push({ path: here.join('.'), $type: node.$type ?? type, $value: node.$value, $description: node.$description });
    } else out.push(...flatten(node, here, type));
  }
  return out;
}

// ---------- aliases ----------

export function findAliases(value) {
  if (typeof value === 'string') return [...value.matchAll(ALIAS_ANY)].map((m) => m[1]);
  if (Array.isArray(value)) return value.flatMap(findAliases);
  if (isObj(value)) return Object.values(value).flatMap(findAliases);
  return [];
}

/** Deep-copy `value`, replacing each `{a.b}` by `fn('a.b')`. A whole-string alias keeps the type `fn` returns. */
export function substituteAliases(value, fn) {
  if (typeof value === 'string') {
    const whole = value.match(ALIAS_WHOLE);
    return whole ? fn(whole[1]) : value.replace(ALIAS_ANY, (_, ref) => String(fn(ref)));
  }
  if (Array.isArray(value)) return value.map((v) => substituteAliases(v, fn));
  if (isObj(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, substituteAliases(v, fn)]));
  return value;
}

const hasUndefined = (v) => v === undefined || (v !== null && typeof v === 'object' && Object.values(v).some(hasUndefined));

/**
 * Resolve aliases. Returns {tokens, errors}. Each token gains `resolved` (all aliases replaced),
 * `aliasOf` (target path when the whole value is one alias) and an inherited `$type`.
 */
export function resolveTokens(flat) {
  const byPath = new Map(flat.map((t) => [t.path, t]));
  const errors = new Set();
  const cache = new Map();

  function resolveOne(p, stack) {
    if (cache.has(p)) return cache.get(p);
    const token = byPath.get(p);
    if (stack.includes(p)) {
      const loop = [...stack.slice(stack.indexOf(p)), p];
      errors.add(cycleMessage(loop));
      return { resolved: undefined, type: token.$type };
    }
    let type = token.$type;
    const resolved = substituteAliases(token.$value, (ref) => {
      if (!byPath.has(ref)) {
        errors.add(`dangling alias {${ref}} in ${p}`);
        return undefined;
      }
      const target = resolveOne(ref, [...stack, p]);
      type ??= target.type;
      return target.resolved;
    });
    const result = { resolved, type };
    cache.set(p, result);
    return result;
  }

  const tokens = flat.map((t) => {
    const { resolved, type } = resolveOne(t.path, []);
    const whole = typeof t.$value === 'string' ? t.$value.match(ALIAS_WHOLE) : null;
    return { ...t, $type: type, resolved, aliasOf: whole ? whole[1] : null };
  });
  return { tokens, errors: [...errors] };
}

// One message per cycle, whatever token the walk entered from.
function cycleMessage(loop) {
  const members = [...new Set(loop)].sort();
  return `alias cycle: ${members.join(' <-> ')}`;
}

/** Foundation tokens that alias a theme role. Themes read foundations, never the reverse. */
export function tierErrors(foundationTree, themeTree) {
  const foundations = flatten(foundationTree);
  const own = new Set(foundations.map((t) => t.path));
  const roles = new Set(flatten(themeTree).map((t) => t.path));
  return foundations.flatMap((t) => findAliases(t.$value).filter((ref) => !own.has(ref) && roles.has(ref)).map((ref) =>
    `tier error: foundation token ${t.path} aliases the theme role {${ref}}; a foundation never reads a theme. Alias a palette or colors token, or move ${t.path} into the theme`));
}

// ---------- validation ----------

const HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const COLOR_FN = /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(.+\)$/i;
const NUM = '(?:\\d+\\.?\\d*|\\.\\d+)';
const DIM = new RegExp(`^-?${NUM}(?:px|rem|em)$`);
const DUR = new RegExp(`^${NUM}(?:ms|s)$`);
const STROKES = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'outset', 'inset'];
const WEIGHTS = ['thin', 'extra-light', 'light', 'normal', 'regular', 'medium', 'semi-bold', 'bold', 'extra-bold', 'black'];
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/** Object with typed fields: spec = {key: [type, required]}. */
const fields = (spec) => (v) =>
  isObj(v) && Object.entries(spec).every(([key, [type, required]]) => (key in v ? valid(type, v[key]) : !required));

const CHECKS = {
  color: (v) => (typeof v === 'string' ? HEX.test(v) || COLOR_FN.test(v) || v === 'transparent'
    : isObj(v) && typeof v.colorSpace === 'string' && Array.isArray(v.components)),
  dimension: (v) => (typeof v === 'string' ? DIM.test(v) || v === '0' : isObj(v) && isNum(v.value) && ['px', 'rem'].includes(v.unit)),
  duration: (v) => (typeof v === 'string' ? DUR.test(v) : isObj(v) && isNum(v.value) && ['ms', 's'].includes(v.unit)),
  fontFamily: (v) => (typeof v === 'string' ? v !== '' : Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === 'string')),
  fontWeight: (v) => (isNum(v) ? v >= 1 && v <= 1000 : WEIGHTS.includes(v)),
  cubicBezier: (v) => Array.isArray(v) && v.length === 4 && v.every(isNum) && v[0] >= 0 && v[0] <= 1 && v[2] >= 0 && v[2] <= 1,
  number: isNum,
  strokeStyle: (v) => STROKES.includes(v) || (isObj(v) && Array.isArray(v.dashArray) && typeof v.lineCap === 'string'),
  border: fields({ color: ['color', true], width: ['dimension', true], style: ['strokeStyle', true] }),
  transition: fields({ duration: ['duration', true], delay: ['duration', false], timingFunction: ['cubicBezier', true] }),
  shadow: (v) => (Array.isArray(v) ? v : [v]).every(fields({
    color: ['color', true], offsetX: ['dimension', true], offsetY: ['dimension', true], blur: ['dimension', true], spread: ['dimension', false],
  })),
  gradient: (v) => Array.isArray(v) && v.length >= 2 && v.every((s) => isObj(s) && valid('color', s.color) && isNum(s.position)),
  typography: fields({
    fontFamily: ['fontFamily', true], fontSize: ['dimension', true], fontWeight: ['fontWeight', false],
    lineHeight: ['number', false], letterSpacing: ['dimension', false],
  }),
};

const valid = (type, v) => CHECKS[type](v);

/** Validate resolved tokens. Tokens that already failed to resolve are skipped (their error is reported). */
export function validateTokens(tokens) {
  const errors = [];
  for (const t of tokens) {
    if (!t.$type) errors.push(`${t.path}: missing $type (set it on the token or a parent group)`);
    else if (!DTCG_TYPES.includes(t.$type)) errors.push(`${t.path}: unknown $type "${t.$type}"`);
    else if (!hasUndefined(t.resolved) && !valid(t.$type, t.resolved)) {
      errors.push(`${t.path}: value ${JSON.stringify(t.resolved)} is not a valid ${t.$type}`);
    }
  }
  return errors;
}

/** Load a folder and run the whole pipeline. */
export function loadTokens(dir, opts) {
  const { tokens, errors } = resolveTokens(flatten(loadTree(dir, opts)));
  return { tokens, errors: [...errors, ...validateTokens(tokens)] };
}

// ---------- value helpers shared by the generators ----------

/** "12px" or {value:12, unit:"px"} -> "12px". */
export function dimensionString(v) {
  return typeof v === 'string' ? v : `${v.value}${v.unit}`;
}
export const durationString = dimensionString;
