#!/usr/bin/env node
// foundations.mjs --inventory <02-values/inventory.json> [--out <dir>]
// Infers one scale per foundation from the value inventory. Writes 03-foundations.json and 03-foundations.md.
//
// How it infers: every rule below is a count over the inventory, no design judgement.
//   Step  = a value used 2 or more times. Outlier = the rest (or a value off the scale).
//   fit   = share of uses, weighted by count, that land on a step.
// ponytail: a finer scale always fits at least as well as a coarser one (4px covers every 8px step).
// So a base or ratio wins when it is the coarsest one within FIT_MARGIN of the best fit. Ceiling: a
// system that really uses a fine scale is reported as the coarser one; the outliers list shows what is off.
import path from 'node:path';
import { parseArgs } from 'node:util';
import { clusterColors, toPx } from './extract.mjs';
import { UsageError, readJson, round, run, runIfMain, sum, table, writeArtifact } from './lib/analysis.mjs';

const USAGE_TEXT = 'Usage: foundations.mjs --inventory <02-values/inventory.json> [--out <dir>]';
const SPACING_BASES = [8, 4, 2];
const RATIOS = [1.067, 1.125, 1.2, 1.25, 1.333, 1.414, 1.5, 1.618];
const FIT_MARGIN = 0.05;
const RATIO_TOLERANCE_PX = 1;
const MIN_USES = 2;
const FULL_RADIUS = 999;

// ---------- generic scale ----------

/** Merge entries that share a number (`0.25rem` = `4px`). Returns [{num, count, value}] sorted by num. */
function groupByNumber(entries, toNum) {
  const groups = new Map();
  for (const e of entries) {
    const num = toNum(e.value);
    if (num === null || !Number.isFinite(num) || num <= 0) continue;
    const g = groups.get(num) ?? { num, count: 0, value: e.value, top: 0 };
    g.count += e.count;
    if (e.count > g.top) Object.assign(g, { value: e.value, top: e.count });
    groups.set(num, g);
  }
  return [...groups.values()].sort((a, b) => a.num - b.num);
}

const byCount = (a, b) => b.count - a.count || a.num - b.num;
const nearestOf = (points, x) => points.reduce((best, p) => (Math.abs(p - x) < Math.abs(best - x) ? p : best), points[0]);

/** Steps = numbers used 2+ times; outliers = the others as {value, count}. */
export function inferScale(entries, toNum) {
  const groups = groupByNumber(entries, toNum);
  return {
    steps: groups.filter((g) => g.count >= MIN_USES).map((g) => g.num),
    outliers: groups.filter((g) => g.count < MIN_USES).sort(byCount).map((g) => ({ value: g.value, count: g.count })),
  };
}

const fitOf = (groups, onScale) => {
  const total = sum(groups, (g) => g.count);
  return total ? sum(groups.filter(onScale), (g) => g.count) / total : 0;
};

/** Coarsest candidate whose fit is within FIT_MARGIN of the best. `candidates` run coarse to fine. */
function pickCoarsest(candidates, fit) {
  const fits = candidates.map((c) => [c, fit(c)]);
  const best = Math.max(...fits.map(([, f]) => f));
  return fits.find(([, f]) => f >= best - FIT_MARGIN);
}

// ---------- spacing ----------

export function inferSpacing(entries) {
  const groups = groupByNumber(entries, toPx).filter((g) => g.num >= 2);
  if (groups.length === 0) return { base: 4, fit: 0, steps: [], outliers: [] };
  const onGrid = (base) => (g) => g.num % base === 0 && g.count >= MIN_USES;
  const [base, fit] = pickCoarsest(SPACING_BASES, (b) => fitOf(groups, onGrid(b)));
  const steps = groups.filter(onGrid(base)).map((g) => g.num);
  const near = (x) => (steps.length ? nearestOf(steps, x) : Math.max(base, Math.round(x / base) * base));
  const outliers = groups.filter((g) => !onGrid(base)(g)).sort(byCount)
    .map((g) => ({ value: g.value, count: g.count, nearest: near(g.num), delta: round(Math.abs(g.num - near(g.num))) }));
  return { base, fit: round(fit), steps, outliers };
}

// ---------- font size ----------

const scalePoints = (base, ratio) => Array.from({ length: 17 }, (_, i) => base * ratio ** (i - 6));

function pickBase(groups) {
  const top = [...groups].sort(byCount)[0];
  const sixteen = groups.find((g) => g.num === 16);
  return sixteen && sixteen.count >= top.count / 2 ? 16 : top.num;
}

export function inferFontSize(entries) {
  const groups = groupByNumber(entries, toPx);
  if (groups.length === 0) return { base: 16, ratio: 1.25, fit: 0, steps: [], outliers: [] };
  const base = pickBase(groups);
  const onScale = (ratio) => {
    const points = scalePoints(base, ratio);
    return (g) => points.some((p) => Math.abs(p - g.num) <= RATIO_TOLERANCE_PX);
  };
  const [ratio, fit] = pickCoarsest([...RATIOS].reverse(), (r) => fitOf(groups, onScale(r)));
  const points = scalePoints(base, ratio);
  const outliers = groups.filter((g) => g.count < MIN_USES || !onScale(ratio)(g)).sort(byCount).map((g) => {
    const nearest = round(nearestOf(points, g.num), 1);
    return { value: g.value, count: g.count, nearest, delta: round(Math.abs(g.num - nearest), 1) };
  });
  return { base, ratio, fit: round(fit), steps: groups.filter((g) => g.count >= MIN_USES).map((g) => g.num), outliers };
}

// ---------- colour ----------

const NEUTRAL = 'gray';
const NOT_A_RAMP = new Set([NEUTRAL, 'other']);
const lightFirst = (a, b) => b.light - a.light;

export function inferColor(entries) {
  const clusters = clusterColors(entries);
  const kept = clusters.filter((c) => c.count >= MIN_USES);
  const ramps = [];
  for (const hue of [...new Set(kept.filter((c) => !NOT_A_RAMP.has(c.hue)).map((c) => c.hue))]) {
    ramps.push({ hue, steps: kept.filter((c) => c.hue === hue).sort(lightFirst).map((c) => c.head) });
  }
  return {
    ramps,
    neutrals: kept.filter((c) => c.hue === NEUTRAL).sort(lightFirst).map((c) => c.head),
    outliers: clusters.filter((c) => c.count < MIN_USES || c.hue === 'other').map((c) => ({ value: c.head, count: c.count })),
  };
}

// ---------- the rest ----------

const toMs = (v) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000);
const radiusPx = (v) => { const px = toPx(v); return px !== null && px >= FULL_RADIUS ? FULL_RADIUS : px; };
const used = (entries) => entries.filter((e) => e.count >= MIN_USES);

export function buildFoundations(inv) {
  const shadows = used(inv.shadow).map((e) => e.value);
  const easings = used(inv.easing);
  return {
    spacing: inferSpacing(inv.spacing),
    fontSize: inferFontSize(inv['font-size']),
    color: inferColor(inv.color),
    radius: inferScale(inv.radius, radiusPx),
    duration: inferScale(inv.duration, toMs),
    easing: { values: easings.map((e) => e.value), outliers: inv.easing.filter((e) => e.count < MIN_USES).map((e) => ({ value: e.value, count: e.count })) },
    shadow: { levels: shadows.length, values: shadows },
    zIndex: inferScale(inv['z-index'], Number),
    breakpoint: inferScale(inv.breakpoint, toPx),
    fontFamily: { values: inv['font-family'].map((e) => e.value) },
  };
}

// ---------- report ----------

const list = (items, fallback = 'none') => (items.length ? items.join(', ') : fallback);
const pct = (fit) => `${Math.round(fit * 100)}%`;
const outlierRows = (outliers) => outliers.slice(0, 10).map((o) => [`\`${o.value}\``, o.count, o.nearest ?? '', o.delta ?? '']);
const outlierTable = (outliers) => (outliers.length
  ? `${outliers.length} off-scale or one-off values. Most used first:\n\n${table(['Value', 'Uses', 'Nearest', 'Delta'], outlierRows(outliers))}` : 'No outliers.');
const plainOutliers = (outliers) => (outliers.length
  ? `One-offs: ${outliers.slice(0, 10).map((o) => `\`${o.value}\` ×${o.count}`).join(', ')}${outliers.length > 10 ? ', …' : ''}.` : 'No one-offs.');

function spacingSection(s) {
  return [
    '## Spacing',
    `Spacing runs on a ${s.base}px grid. Fit: ${pct(s.fit)} of uses land on a step. Steps (each used at least twice): ${list(s.steps.map((n) => `${n}px`))}.`,
    outlierTable(s.outliers),
  ].join('\n\n');
}

function fontSection(f) {
  return [
    '## Font size',
    `The base size is ${f.base}px. The best-fitting ratio is ${f.ratio}. Fit: ${pct(f.fit)} of uses sit within 1px of ${f.base}px × ${f.ratio}^n. Sizes used twice or more: ${list(f.steps.map((n) => `${n}px`))}.`,
    outlierTable(f.outliers),
  ].join('\n\n');
}

function colourSection(c) {
  const ramps = c.ramps.map((r) => `- ${r.hue}: ${list(r.steps)}`).join('\n');
  return [
    '## Colour',
    `${c.ramps.length} hue ramps, ${c.neutrals.length} neutrals, ${c.outliers.length} one-off colours. Colours closer than the cluster limit count as one.`,
    `Ramps, lightest first:\n\n${ramps || '- none'}`,
    `Neutrals: ${list(c.neutrals)}.`,
    plainOutliers(c.outliers),
  ].join('\n\n');
}

const stepSection = (title, text, steps, unit, outliers) => [
  `## ${title}`, `${text} Steps (used twice or more): ${list(steps.map((n) => `${n}${unit}`))}.`, plainOutliers(outliers),
].join('\n\n');

export function renderFoundations(f) {
  return [
    '# Foundations',
    'Layer: foundation. Each scale below is inferred from counts in `02-values/inventory.json`. Accept or change each one at the gate.',
    spacingSection(f.spacing),
    fontSection(f.fontSize),
    colourSection(f.color),
    stepSection('Radius', 'Corner radii.', f.radius.steps, 'px', f.radius.outliers),
    `${stepSection('Motion', 'Durations.', f.duration.steps, 'ms', f.duration.outliers)}\n\nEasing values: ${list(f.easing.values)}. ${plainOutliers(f.easing.outliers)}`,
    `${stepSection('Depth', 'Stacking order (z-index).', f.zIndex.steps, '', f.zIndex.outliers)}\n\nShadow levels: ${f.shadow.levels}. ${list(f.shadow.values.map((v) => `\`${v}\``), 'No shadow is used twice.')}`,
    stepSection('Breakpoints', 'Viewport widths in media queries.', f.breakpoint.steps, 'px', f.breakpoint.outliers),
    `## Fonts\n\nFont families by use: ${list(f.fontFamily.values.map((v) => `\`${v}\``))}.`,
    `## States\n\nFoundations carry no component state. State changes lean on motion and depth: ${f.duration.steps.length} duration steps, ${f.easing.values.length} easings, ${f.shadow.levels} shadow levels.`,
  ].join('\n\n') + '\n';
}

// ---------- CLI ----------

export function main(argv, io = console) {
  return run('foundations', USAGE_TEXT, io, () => {
    const { values: opts, positionals } = parseArgs({ args: argv, allowPositionals: true, options: { inventory: { type: 'string' }, out: { type: 'string' } } });
    if (!opts.inventory || positionals.length) throw new UsageError('--inventory is required');
    const inventory = readJson(opts.inventory);
    const out = opts.out ?? path.dirname(path.dirname(path.resolve(opts.inventory)));
    const foundations = buildFoundations(inventory);
    writeArtifact(out, '03-foundations.json', foundations);
    writeArtifact(out, '03-foundations.md', renderFoundations(foundations));
    io.log(`spacing base ${foundations.spacing.base}px (fit ${foundations.spacing.fit}), font ratio ${foundations.fontSize.ratio} (fit ${foundations.fontSize.fit}); wrote 03-foundations.json and .md to ${out}`);
    return 0;
  });
}

runIfMain(import.meta.url, main);
