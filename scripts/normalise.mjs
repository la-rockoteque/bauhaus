#!/usr/bin/env node
// normalise.mjs tokens --foundations <03-foundations.json> [--inventory <inventory.json>] [--out <04-tokens dir>]
// normalise.mjs plan --analysis <dir>
// `tokens` turns the inferred scales into tiered DTCG (primitives, then semantic aliases) and checks it.
// `plan` maps every literal, component group and pattern to an action and orders them into batches.
//
// How it decides:
//   - semantic roles come from the CSS property a colour sits in (`color` -> text, `background` -> surface,
//     `border` -> border); without that, from lightness among the grays;
//   - a literal snaps to the nearest token: |delta| in px (ms for time), or ΔE CIE76 for colour.
// ponytail: CIE76 is the simple Lab distance and over-states blue differences next to CIEDE2000;
// the risk bands were set with it, so swap both together. The semantic set is one alias per role;
// the agent adds muted, subtle, hover and the rest at the gate.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { CATEGORIES, buildDraft, toPx } from './extract.mjs';
import { luminance } from './contrast.mjs';
import { isPageSpecific, isPrimitiveCandidate } from './components.mjs';
import { deltaE76, opaque } from './lib/color.mjs';
import { UsageError, readJson, round, run, runIfMain, sum, table, uniq, writeArtifact } from './lib/analysis.mjs';
import { flatten, loadTokens } from './lib/dtcg.mjs';

const USAGE_TEXT = 'Usage: normalise.mjs tokens --foundations <03-foundations.json> [--inventory <inventory.json>] [--out <dir>]\n       normalise.mjs plan --analysis <dir>';
const FULL_RADIUS = 999;
const SNAP_MAX_LENGTH = 8;
const SNAP_MAX_COLOR = 10;
const MIN_USES_NOTE = 2; // buildDraft wants a count; the notes it writes are stripped

// ---------- primitives ----------

// Names for n steps, small to large. Index n-1 is the ladder for n steps.
const SIZE_NAMES = [['md'], ['sm', 'md'], ['sm', 'md', 'lg'], ['xs', 'sm', 'md', 'lg'], ['xs', 'sm', 'md', 'lg', 'xl'], ['xs', 'sm', 'md', 'lg', 'xl', '2xl']];
const TIME_NAMES = [['base'], ['fast', 'slow'], ['fast', 'base', 'slow'], ['instant', 'fast', 'base', 'slow'], ['instant', 'fast', 'base', 'slow', 'slower']];
const namesFor = (ladders, n) => ladders[n - 1] ?? Array.from({ length: n }, (_, i) => String(i + 1));

const dim = (px) => `${px}px`;
const group = (type, entries) => ({ $type: type, ...Object.fromEntries(entries.map(([k, v]) => [k, { $value: v }])) });
const zip = (names, values, fmt) => names.map((n, i) => [n, fmt(values[i])]);

function offsetName(offset) {
  if (offset === 0) return 'md';
  const down = ['sm', 'xs', '2xs', '3xs', '4xs'];
  const up = ['lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
  return (offset < 0 ? down[-offset - 1] : up[offset - 1]) ?? `${offset > 0 ? 'plus' : 'minus'}${Math.abs(offset)}`;
}

function fontSizeGroup({ base, steps }) {
  const at = steps.reduce((best, s, i) => (Math.abs(s - base) < Math.abs(steps[best] - base) ? i : best), 0);
  return group('dimension', steps.map((s, i) => [offsetName(i - at), dim(s)]));
}

function colorGroup({ ramps, neutrals }) {
  const all = [...ramps, ...(neutrals.length ? [{ hue: 'gray', steps: neutrals }] : [])];
  const ramp = (steps) => Object.fromEntries(steps.map((v, i) => [String((i + 1) * 100), { $value: v }]));
  return { $type: 'color', ...Object.fromEntries(all.map((r) => [r.hue, ramp(r.steps)])) };
}

function radiusGroup(steps) {
  const small = steps.filter((s) => s < FULL_RADIUS);
  const entries = zip(namesFor(SIZE_NAMES, small.length), small, dim);
  return group('dimension', steps.length > small.length ? [...entries, ['full', '9999px']] : entries);
}

const stripNotes = (g) => Object.fromEntries(Object.entries(g).map(([k, t]) => (k.startsWith('$') ? [k, t] : [k, { $value: t.$value }])));

/** Primitive tokens from the inferred steps. Groups with no steps are left out. */
export function buildPrimitives(f) {
  const inventory = Object.fromEntries(CATEGORIES.map((c) => [c, []]));
  const asEntries = (values) => values.map((value) => ({ value, count: MIN_USES_NOTE }));
  // A shadow that reads a custom property is already tokenised and is not a valid DTCG colour, so it is left out.
  const draft = buildDraft({ inventory: { ...inventory, easing: asEntries(f.easing.values), shadow: asEntries(f.shadow.values.filter((v) => !v.includes('var('))), 'font-family': asEntries(f.fontFamily.values) } });
  const tree = {
    space: group('dimension', f.spacing.steps.map((s) => [String(s / f.spacing.base), dim(s)])),
    color: colorGroup(f.color),
    font: { size: fontSizeGroup(f.fontSize), family: stripNotes(draft.font.family) },
    radius: radiusGroup(f.radius.steps),
    duration: group('duration', zip(namesFor(TIME_NAMES, f.duration.steps.length), f.duration.steps, (ms) => `${ms}ms`)),
    easing: stripNotes(draft.easing),
    shadow: stripNotes(draft.shadow),
    z: group('number', f.zIndex.steps.map((z) => [String(z), z])),
    breakpoint: group('dimension', zip(namesFor(SIZE_NAMES, f.breakpoint.steps.length), f.breakpoint.steps, dim)),
  };
  return Object.fromEntries(Object.entries(tree).filter(([, g]) => hasTokens(g)));
}
const hasTokens = (g) => Object.entries(g).some(([k, v]) => !k.startsWith('$') && typeof v === 'object');

// ---------- semantic ----------

const ROLE_BY_PROPERTY = [['border', /border|outline|stroke|divider/], ['surface', /background|(^|-)bg(-|$)|surface/], ['text', /(^|-)(color|text|fill|foreground|fg)(-|$)/]];
const roleOf = (prop) => ROLE_BY_PROPERTY.find(([, re]) => re.test(prop))?.[0];

const colorPalette = (primitives) => flatten({ color: primitives.color ?? {} }).filter((t) => typeof t.$value === 'string' && opaque(t.$value)).map((t) => ({ path: t.path, value: t.$value }));

const nearestColor = (palette, value) => palette.reduce((best, p) => (deltaE76(value, p.value) < deltaE76(value, best.value) ? p : best), palette[0]);
const top = (weights) => [...weights].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0];

function roleWeights(palette, colors) {
  const roles = { text: new Map(), surface: new Map(), border: new Map() };
  const usage = new Map();
  for (const c of colors.filter((e) => opaque(e.value))) {
    const near = nearestColor(palette, c.value).path;
    usage.set(near, (usage.get(near) ?? 0) + c.count);
    for (const [prop, n] of Object.entries(c.props ?? {})) {
      const role = roleOf(prop);
      if (role) roles[role].set(near, (roles[role].get(near) ?? 0) + n);
    }
  }
  return { roles, usage };
}

// Fallback when the inventory has no property context: pick by lightness among grays, most used first.
const LIGHTNESS = { text: (l) => l < 0.4, surface: (l) => l > 0.8, border: (l) => l >= 0.4 && l <= 0.9 };

function byLightness(role, palette, usage, taken) {
  const grays = palette.filter((p) => p.path.startsWith('color.gray.') && !taken.includes(p.path));
  const fits = grays.filter((p) => LIGHTNESS[role](luminance(opaque(p.value)))).map((p) => [p.path, usage.get(p.path) ?? 0]);
  return top(fits);
}

/** One alias per role: color.text.default, color.surface.default, color.border.default. */
export function buildSemantic(primitives, inventory) {
  const palette = colorPalette(primitives);
  if (palette.length === 0) return {};
  const { roles, usage } = roleWeights(palette, inventory.color ?? []);
  const chosen = {};
  for (const role of ['text', 'surface', 'border']) {
    const target = top(roles[role]) ?? byLightness(role, palette, usage, Object.values(chosen));
    if (target) chosen[role] = target;
  }
  const entries = Object.entries(chosen).map(([role, target]) => [role, { default: { $value: `{${target}}` } }]);
  return entries.length ? { color: { $type: 'color', ...Object.fromEntries(entries) } } : {};
}

// ---------- tokens report + command ----------

function renderTokensMd(primitives, semantic, errors) {
  const rows = (tree) => flatten(tree).map((t) => [`\`${t.path}\``, `\`${JSON.stringify(t.$value)}\``]);
  const aliases = rows(semantic);
  return [
    '# Tokens',
    'Layer: token. Names come from the scale position, not from meaning. Accept or rename them at the gate.',
    `## Primitives\n\n${table(['Token', 'Value'], rows(primitives))}`,
    `## Semantic\n\nOne alias per role, chosen from the most used matching colour.\n\n${aliases.length ? table(['Token', 'Alias'], aliases) : 'No colour tokens to alias.'}`,
    `## Validation\n\n${errors.length ? errors.map((e) => `- ${e}`).join('\n') : '0 errors against the DTCG checks.'}`,
    `## States\n\nNo state tokens yet. Roles for hover, focus, disabled and error come after the component phase shows which states exist.`,
  ].join('\n\n') + '\n';
}

function tokensCommand(opts, io) {
  if (!opts.foundations) throw new UsageError('--foundations is required');
  const foundations = readJson(opts.foundations);
  const home = path.dirname(path.resolve(opts.foundations));
  const inventoryFile = opts.inventory ?? path.join(home, '02-values', 'inventory.json');
  const inventory = fs.existsSync(inventoryFile) ? readJson(inventoryFile) : { color: [] };
  const out = opts.out ?? path.join(home, '04-tokens');
  const primitives = buildPrimitives(foundations);
  const semantic = buildSemantic(primitives, inventory);
  writeArtifact(out, 'primitives.tokens.json', primitives);
  writeArtifact(out, 'semantic.tokens.json', semantic);
  const { tokens, errors } = loadTokens(out);
  writeArtifact(path.dirname(path.resolve(out)), '04-tokens.md', renderTokensMd(primitives, semantic, errors));
  for (const e of errors) io.error(`tokens: ${e}`);
  io.log(`${tokens.length} tokens (${flatten(semantic).length} semantic), ${errors.length} validation errors; wrote to ${out}`);
  return errors.length ? 1 : 0;
}

// ---------- plan: values ----------

const toMs = (v) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000);
const cappedPx = (v) => { const px = toPx(v); return px === null ? null : Math.min(px, FULL_RADIUS); };
const LENGTH_FAMILIES = [
  { family: 'spacing', category: 'spacing', prefix: 'space.', num: toPx, unit: 'px' },
  { family: 'radius', category: 'radius', prefix: 'radius.', num: cappedPx, unit: 'px' },
  { family: 'font-size', category: 'font-size', prefix: 'font.size.', num: toPx, unit: 'px' },
  { family: 'duration', category: 'duration', prefix: 'duration.', num: toMs, unit: 'ms' },
];

const actionFor = (delta, snapMax, uses) => (delta === 0 ? 'alias' : delta <= snapMax ? 'snap' : uses >= 2 ? 'keep' : 'drop');
const loose = (e) => e.count - e.declared;

function lengthRows(spec, entries, tokens) {
  const palette = tokens.filter((t) => t.path.startsWith(spec.prefix) && !t.aliasOf).map((t) => ({ path: t.path, num: spec.num(String(t.resolved)) })).filter((p) => p.num !== null);
  if (palette.length === 0) return [];
  return entries.filter((e) => loose(e) > 0 && spec.num(e.value) !== null).map((e) => {
    const n = spec.num(e.value);
    const near = palette.reduce((best, p) => (Math.abs(p.num - n) < Math.abs(best.num - n) || (Math.abs(p.num - n) === Math.abs(best.num - n) && p.num < best.num) ? p : best));
    const d = round(Math.abs(near.num - n));
    return { literal: e.value, family: spec.family, uses: loose(e), files: e.files, target: near.path, delta: `${d}${spec.unit === 'px' ? 'px' : 'ms'}`, action: actionFor(d, SNAP_MAX_LENGTH, loose(e)), d, kind: 'length' };
  });
}

function colorRows(entries, tokens) {
  const palette = tokens.filter((t) => t.path.startsWith('color.') && !t.aliasOf && typeof t.resolved === 'string' && opaque(t.resolved));
  return entries.filter((e) => loose(e) > 0).map((e) => {
    const base = { literal: e.value, family: 'color', uses: loose(e), files: e.files };
    if (!opaque(e.value) || palette.length === 0) return { ...base, target: null, delta: 'n/a', action: 'keep', d: 0, kind: 'color' };
    const near = palette.reduce((best, p) => (deltaE76(e.value, p.resolved) < deltaE76(e.value, best.resolved) ? p : best));
    const d = round(deltaE76(e.value, near.resolved), 1);
    return { ...base, target: near.path, delta: `ΔE ${d}`, action: actionFor(d, SNAP_MAX_COLOR, loose(e)), d, kind: 'color' };
  });
}

function planValues(inventory, tokens) {
  const rows = [
    ...colorRows(inventory.color ?? [], tokens),
    ...LENGTH_FAMILIES.flatMap((spec) => lengthRows(spec, inventory[spec.category] ?? [], tokens)),
  ];
  return rows.sort((a, b) => a.family.localeCompare(b.family) || b.uses - a.uses || a.literal.localeCompare(b.literal));
}

// ---------- plan: components, patterns ----------

// A group earns a merge only if the DS will own it: one member is shared, or the members span 3+ files.
// Page-local near-twins stay in 05-components.md for the agent to judge.
const MERGE_MIN_FILES = 3;

function planComponents({ components, groups }) {
  const info = (name) => components.find((c) => c.name === name);
  const usageOf = (name) => info(name)?.usages ?? 0;
  const owned = (g) => g.members.some((m) => info(m)?.location === 'shared') || sum(g.members, (m) => info(m)?.usedIn ?? 0) >= MERGE_MIN_FILES;
  const merged = new Set();
  const out = groups.filter(owned).map((g) => {
    const keep = [...g.members].sort((a, b) => usageOf(b) - usageOf(a))[0];
    const merge = g.members.filter((m) => m !== keep);
    merge.forEach((m) => merged.add(m));
    return { group: g.id, keep, merge, callSites: sum(merge, usageOf), action: 'merge' };
  });
  const single = (c, action) => ({ group: null, keep: c.name, merge: [], callSites: c.usages, action });
  return [
    ...out,
    ...components.filter((c) => isPrimitiveCandidate(c) && !merged.has(c.name)).map((c) => single(c, 'promote')),
    ...components.filter((c) => isPageSpecific(c) && !merged.has(c.name)).map((c) => single(c, 'demote')),
  ];
}

// ---------- plan: batches ----------

const RISK_ORDER = ['low', 'medium', 'high'];
const effortOf = (files) => (files <= 5 ? 'S' : files <= 20 ? 'M' : 'L');
const filesOf = (rows) => uniq(rows.flatMap((r) => r.files.map((f) => f.replace(/:\d+$/, ''))));
const worst = (risks) => RISK_ORDER[Math.max(0, ...risks.map((r) => RISK_ORDER.indexOf(r)))];

function deltaRisk(row) {
  const [low, mid] = row.kind === 'color' ? [2, 5] : [1, 4];
  return row.d <= low ? 'low' : row.d <= mid ? 'medium' : 'high';
}

const callSiteRisk = (n) => (n <= 5 ? 'low' : n <= 20 ? 'medium' : 'high');
const FAMILY_LABEL = { spacing: 'spacing', radius: 'radius', 'font-size': 'type', duration: 'motion', color: 'colour' };
const batch = (layer, title, items, files, risk, skill) => ({ layer, title, items, files, risk, effort: effortOf(files), skill });

function foundationBatches(rows) {
  return Object.keys(FAMILY_LABEL).map((family) => [family, rows.filter((r) => r.family === family && r.action === 'snap')]).filter(([, r]) => r.length)
    .map(([family, r]) => batch('foundation', `Adopt ${FAMILY_LABEL[family]} scale`, sum(r, (x) => x.uses), filesOf(r).length, worst(r.map(deltaRisk)), '/bauhaus:foundation'));
}

function primitiveBatches(components, list) {
  const info = (name) => list.find((c) => c.name === name);
  const filesOfMerge = (c) => sum(c.merge, (m) => (info(m)?.usedIn ?? 0) + 1);
  const all = components.filter((c) => c.action === 'merge');
  // High-risk merges are reviewed one by one; low and medium ones are bundled per risk to keep the plan short.
  const single = all.filter((c) => callSiteRisk(c.callSites) === 'high').map((c) => batch(
    'primitive', `Merge ${c.merge.join(', ')} into ${c.keep}`, c.callSites, filesOfMerge(c), 'high', '/bauhaus:component'));
  const bundles = ['low', 'medium'].map((risk) => [risk, all.filter((c) => callSiteRisk(c.callSites) === risk)]).filter(([, g]) => g.length)
    .map(([risk, g]) => batch('primitive', `Merge ${g.length} ${risk}-risk duplicate groups`, sum(g, (c) => c.callSites), sum(g, filesOfMerge), risk, '/bauhaus:component'));
  const merges = [...bundles, ...single];
  const byAction = (action, title) => {
    const n = components.filter((c) => c.action === action).length;
    return n ? [batch('primitive', `${title} ${n} components`, n, n, 'low', '/bauhaus:component')] : [];
  };
  return [...merges, ...byAction('promote', 'Promote'), ...byAction('demote', 'Demote')];
}

function planBatches({ rows, tokens, components, patterns, list }) {
  const alias = rows.filter((r) => r.action === 'alias');
  const promote = components.filter((c) => c.action === 'promote').length;
  const patternFiles = uniq(patterns.cooccurrence.flatMap((p) => p.files)).length;
  const docsItems = tokens.length + promote + patterns.cooccurrence.length;
  const all = [
    ...foundationBatches(rows),
    ...(tokens.length ? [batch('token', 'Publish token set and alias exact matches', tokens.length + sum(alias, (r) => r.uses), filesOf(alias).length, 'low', '/bauhaus:tokens')] : []),
    ...primitiveBatches(components, list),
    ...(patterns.cooccurrence.length ? [batch('pattern', `Document ${patterns.cooccurrence.length} patterns`, patterns.cooccurrence.length, patternFiles, 'low', '/bauhaus:pattern')] : []),
    ...(docsItems ? [batch('docs', 'Publish styleguide and Storybook', docsItems, 0, 'low', '/bauhaus:styleguide')] : []),
  ];
  return all.map((b, i) => ({ id: `b${i + 1}`, layer: b.layer, title: b.title, items: b.items, files: b.files, risk: b.risk, effort: b.effort, skill: b.skill }));
}

/** Build 08-normalisation.json from the artifacts of phases 2 to 6. `tokens` are resolved DTCG tokens. */
export function planNormalisation({ inventory, tokens, components, patterns }) {
  const rows = planValues(inventory, tokens);
  const planned = planComponents(components);
  return {
    values: rows.map(({ d, kind, ...v }) => v),
    components: planned,
    patterns: patterns.cooccurrence.map((p) => ({ id: p.id, action: 'document' })),
    batches: planBatches({ rows, tokens, components: planned, patterns, list: components.components }),
  };
}

// ---------- plan: report ----------

const countBy = (items, key) => items.reduce((n, i) => ({ ...n, [i[key]]: (n[i[key]] ?? 0) + 1 }), {});
const summarise = (counts) => Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(', ') || 'none';

function valueTable(values) {
  const rows = values.slice(0, 25).map((v) => [`\`${v.literal}\``, v.family, v.uses, v.target ? `\`${v.target}\`` : '', v.delta, v.action]);
  return rows.length ? `${table(['Literal', 'Family', 'Uses', 'Target', 'Delta', 'Action'], rows)}${values.length > 25 ? `\n\n${values.length - 25} more in \`08-normalisation.json\`.` : ''}` : 'None.';
}

const componentRows = (list, action) => list.filter((c) => c.action === action)
  .map((c) => [c.group ?? '', `\`${c.keep}\``, c.merge.map((m) => `\`${m}\``).join(', '), c.callSites]);

/** Skeleton the agent enriches: summary, one section per layer, the batch list. */
export function renderPlan(plan, components, patterns, foundations = null) {
  const scale = foundations ? `Spacing base ${foundations.spacing.base}px (fit ${foundations.spacing.fit}). Type ratio ${foundations.fontSize.ratio} (fit ${foundations.fontSize.fit}).` : '';
  const lengths = plan.values.filter((v) => v.family !== 'color');
  const merges = componentRows(plan.components, 'merge');
  const signal = (kind) => patterns.signals?.find((s) => s.kind === kind)?.count ?? 0;
  return [
    '# Normalisation plan',
    `## Summary\n\n${plan.values.length} values (${summarise(countBy(plan.values, 'action'))}). ${plan.components.length} component actions (${summarise(countBy(plan.components, 'action'))}). ${plan.patterns.length} patterns to document. ${plan.batches.length} batches. ${scale}\n\nActions: \`alias\` swaps an exact match, \`snap\` moves to the nearest token, \`keep\` has no close token, \`drop\` is a one-off far from any token. The agent enriches this file before the gate.`,
    `## Foundation\n\nLengths and durations. Delta is in px or ms.\n\n${valueTable(lengths)}`,
    `## Token\n\nColours. Delta is ΔE CIE76.\n\n${valueTable(plan.values.filter((v) => v.family === 'color'))}`,
    `## Primitive\n\n### Merges\n\n${merges.length ? table(['Group', 'Keep', 'Merge', 'Call sites'], merges) : 'None.'}\n\n### Promote\n\n${componentRows(plan.components, 'promote').slice(0, 25).map((r) => `- ${r[1]} (${r[3]} usages)`).join('\n') || 'None.'}\n\n### Demote\n\n${componentRows(plan.components, 'demote').slice(0, 25).map((r) => `- ${r[1]}`).join('\n') || 'None.'}`,
    `## Pattern\n\n${plan.patterns.map((p) => `- \`${p.id}\`: ${p.action}`).join('\n') || 'None.'}`,
    `## Batches\n\nOrder never changes: foundation, token, primitive, pattern, docs. Risk comes from the largest delta, or from call sites for merges. Effort comes from files.\n\n${plan.batches.length ? table(['Id', 'Layer', 'Title', 'Items', 'Files', 'Risk', 'Effort', 'Skill'], plan.batches.map((b) => [b.id, b.layer, b.title, b.items, b.files, b.risk, b.effort, `\`${b.skill}\``])) : 'None.'}`,
    `## States\n\n${components.components?.filter((c) => Object.values(c.states).some(Boolean)).length ?? 0} components expose at least one state. Signals: ${signal('empty-state')} empty-state, ${signal('loading')} loading, ${signal('error')} error lines. Cover every state in each primitive before its batch closes.`,
  ].join('\n\n') + '\n';
}

function planCommand(opts, io) {
  if (!opts.analysis) throw new UsageError('--analysis is required');
  const dir = opts.analysis;
  const inventory = readJson(path.join(dir, '02-values', 'inventory.json'));
  const foundations = readJson(path.join(dir, '03-foundations.json'));
  const tokenDir = path.join(dir, '04-tokens');
  if (!fs.existsSync(tokenDir)) throw new UsageError(`no such folder: ${tokenDir}`);
  const { tokens, errors } = loadTokens(tokenDir);
  if (errors.length) throw new Error(`${tokenDir} has ${errors.length} validation errors; run \`normalise.mjs tokens\` again`);
  const components = readJson(path.join(dir, '05-components.json'));
  const patterns = readJson(path.join(dir, '06-patterns.json'));
  const plan = planNormalisation({ inventory, tokens, components, patterns });
  writeArtifact(dir, '08-normalisation.json', plan);
  writeArtifact(dir, '08-plan.md', renderPlan(plan, components, patterns, foundations));
  io.log(`${plan.values.length} values, ${plan.components.length} component actions, ${plan.batches.length} batches; wrote 08-normalisation.json and 08-plan.md to ${dir}`);
  return 0;
}

// ---------- CLI ----------

export function main(argv, io = console) {
  return run('normalise', USAGE_TEXT, io, () => {
    const { values: opts, positionals } = parseArgs({
      args: argv, allowPositionals: true,
      options: { foundations: { type: 'string' }, inventory: { type: 'string' }, out: { type: 'string' }, analysis: { type: 'string' } },
    });
    if (positionals.length !== 1) throw new UsageError('expected `tokens` or `plan`');
    if (positionals[0] === 'tokens') return tokensCommand(opts, io);
    if (positionals[0] === 'plan') return planCommand(opts, io);
    throw new UsageError(`unknown command: ${positionals[0]}`);
  });
}

runIfMain(import.meta.url, main);
