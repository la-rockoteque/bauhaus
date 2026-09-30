#!/usr/bin/env node
// patterns.mjs --components <05-components.json> <dir> [--out .bauhaus/analysis]
// Mines components that appear together and counts UI signals. Writes 06-patterns.json and 06-patterns.md.
//
// How it mines: per file, the set of known components it renders. Apriori over those sets, sizes 2 to 5,
// support of 2 files or more, then drops any set that a larger set matches with the same support.
// ponytail: a level keeps its 300 best sets, so on a huge repo a rare set can drop out. Sets made only
// of ubiquitous parts (Button + Icon) are frequent but say little; read the list, do not trust the rank.
// Signals are word matches per line, not proof: `isEmpty` in a helper counts as much as an empty-state view.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { blank, cleanSource, walk } from './extract.mjs';
import { tagCounts } from './components.mjs';
import { UsageError, readJson, requireDir, run, runIfMain, table, writeArtifact } from './lib/analysis.mjs';

const USAGE_TEXT = 'Usage: patterns.mjs --components <05-components.json> <dir> [--out .bauhaus/analysis]';
const MIN_SUPPORT = 2;
const MAX_SIZE = 5;
const MAX_PER_LEVEL = 300;
const MAX_OUTPUT = 30;
const MAX_FILES_LISTED = 10;
const SOURCE_EXT = new Set(['.tsx', '.jsx', '.vue', '.svelte', '.html', '.ts', '.js']);

// ---------- apriori ----------

const intersect = (a, b) => new Set([...a].filter((x) => b.has(x)));
const keyOf = (items) => items.join('\u0000');

/** Level k+1 from level k: join sets that share their first k-1 items. Keeps those in 2+ files. */
function nextLevel(level) {
  const next = new Map();
  const sets = [...level.entries()];
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const [a, filesA] = sets[i];
      const [b, filesB] = sets[j];
      if (a.slice(0, -1).some((x, n) => x !== b[n])) continue;
      const files = intersect(filesA, filesB);
      if (files.size >= MIN_SUPPORT) next.set([...a, b.at(-1)], files);
    }
  }
  const best = [...next].sort((x, y) => y[1].size - x[1].size).slice(0, MAX_PER_LEVEL);
  return new Map(best.sort((x, y) => keyOf(x[0]).localeCompare(keyOf(y[0]))));
}

const isSubset = (small, big) => small.every((x) => big.includes(x));

/** Frequent itemsets of 2 to 5 components. `fileSets` is Map(file -> Set(component)). */
export function minePatterns(fileSets) {
  const support = new Map();
  for (const [file, items] of fileSets) for (const item of items) support.set(item, (support.get(item) ?? new Set()).add(file));
  let level = new Map([...support].filter(([, files]) => files.size >= MIN_SUPPORT).sort((a, b) => a[0].localeCompare(b[0])).map(([item, files]) => [[item], files]));
  const found = [];
  for (let size = 2; size <= MAX_SIZE && level.size > 0; size++) {
    level = nextLevel(level);
    found.push(...[...level].map(([components, files]) => ({ components, files: [...files].sort() })));
  }
  return found
    .filter((s) => !found.some((t) => t.components.length > s.components.length && t.files.length === s.files.length && isSubset(s.components, t.components)))
    .map((s) => ({ ...s, support: s.files.length }))
    .sort((a, b) => b.support * b.components.length - a.support * a.components.length || keyOf(a.components).localeCompare(keyOf(b.components)))
    .slice(0, MAX_OUTPUT)
    .map((s, i) => ({ id: `pattern.c${i + 1}`, components: s.components, files: s.files, support: s.support }));
}

// ---------- signals ----------

const SIGNALS = [
  ['empty-state', /no results?|nothing (?:here|found|to show|yet)|no [\w ]{1,20} (?:found|yet)|\bempty\b|EmptyState|\baucun(?:e|s|es)?\b/i],
  ['loading', /Spinner|Skeleton|isLoading|aria-busy|\bLoading[A-Z]\w*/],
  ['error', /ErrorMessage|ErrorBanner|ErrorBoundary|isError|role=["']alert["']/],
  ['form', /<form\b|onSubmit=|useForm\(/],
  ['table', /<table\b|\bTable\b|DataGrid/],
  ['pagination', /\bPager\b|Pagination|\bpage=/],
  ['modal', /Modal|Dialog|<dialog\b/],
  ['filter', /\bFilter\w*|\w+Filter\w*|\bfilters\b|[Ff]acet/],
  ['toast', /Toast|\bnotify\b|snackbar/i],
  ['tabs', /<Tabs?\b|TabPanel|role=["']tab/],
  ['wizard', /Wizard|Stepper|\bStep(?:s|Indicator)?\b/],
  ['navigation', /\bNav(?:bar|igation)?\b|Sidebar|Breadcrumb|<nav\b/],
];
const IMPORT_LINES = /^[ \t]*import\b[\s\S]*?(?:from\s*)?['"][^'"\n]+['"];?/gm;

/** Count matching lines per signal. `sources` is Map(file -> text). Import lines are ignored. */
export function scanSignals(sources) {
  const result = SIGNALS.map(([kind]) => ({ kind, files: [], count: 0 }));
  for (const [file, text] of sources) {
    const ext = path.extname(file);
    const lines = blank(cleanSource(text, ext), IMPORT_LINES).split('\n');
    SIGNALS.forEach(([, re], k) => lines.forEach((line, i) => {
      if (!re.test(line)) return;
      result[k].count += 1;
      if (result[k].files.length < MAX_FILES_LISTED) result[k].files.push(`${file}:${i + 1}`);
    }));
  }
  return result;
}

// ---------- whole directory ----------

const dashed = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** Scan a folder against the components of phase 5. Returns {cooccurrence, signals}. */
export function analysePatterns(dir, { components }) {
  const sources = new Map();
  for (const file of walk(dir)) if (SOURCE_EXT.has(path.extname(file)) && !/\.(stories|d)\.[tj]sx?$/.test(file)) sources.set(file, fs.readFileSync(path.join(dir, file), 'utf8'));
  const fileSets = new Map();
  for (const [file, text] of sources) {
    const counts = tagCounts(file, cleanSource(text, path.extname(file)));
    const used = components.filter((c) => c.file.split(':')[0] !== file && [c.name, dashed(c.name)].some((t) => (t.includes('-') || t === c.name) && counts.has(t)));
    if (used.length >= 2) fileSets.set(file, new Set(used.map((c) => c.name)));
  }
  return { cooccurrence: minePatterns(fileSets), signals: scanSignals(sources) };
}

// ---------- report ----------

const count = (signals, kind) => signals.find((s) => s.kind === kind)?.count ?? 0;

export function renderPatterns({ cooccurrence, signals }) {
  const sets = cooccurrence.map((s) => [s.id, s.components.map((c) => `\`${c}\``).join(' + '), s.support, s.files.slice(0, 3).join(', ')]);
  const rows = signals.map((s) => [s.kind, s.count, s.files.slice(0, 3).join(', ')]);
  return [
    '# Patterns',
    'Layer: pattern. A pattern is a recurring composition of components. A set is a candidate when its support is 2 files or more.',
    `## Co-occurrence\n\n${cooccurrence.length ? table(['Id', 'Components', 'Support', 'First files'], sets) : 'No set of components appears together in 2 or more files.'}`,
    `## Signals\n\nLines that match a recurring UI need. Counts are heuristics. Read the first files before you trust them.\n\n${table(['Signal', 'Lines', 'First hits'], rows)}`,
    `## States\n\nState handling seen in the code: ${count(signals, 'empty-state')} empty-state lines, ${count(signals, 'loading')} loading lines, ${count(signals, 'error')} error lines. A screen that shows data with none of the three has a missing state.`,
  ].join('\n\n') + '\n';
}

// ---------- CLI ----------

export function main(argv, io = console) {
  return run('patterns', USAGE_TEXT, io, () => {
    const { values: opts, positionals } = parseArgs({ args: argv, allowPositionals: true, options: { components: { type: 'string' }, out: { type: 'string', default: '.bauhaus/analysis' } } });
    if (!opts.components || positionals.length !== 1) throw new UsageError('expected --components <file> and one folder');
    const components = readJson(opts.components);
    const result = analysePatterns(requireDir(positionals[0]), components);
    writeArtifact(opts.out, '06-patterns.json', result);
    writeArtifact(opts.out, '06-patterns.md', renderPatterns(result));
    io.log(`${result.cooccurrence.length} co-occurrence sets; wrote 06-patterns.json and .md to ${opts.out}`);
    return 0;
  });
}

runIfMain(import.meta.url, main);
