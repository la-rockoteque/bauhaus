#!/usr/bin/env node
// analyse.mjs init <dir> [--out .bauhaus/analysis]   detect the stack, count files, write 01-scope.{json,md}
// analyse.mjs status [--out .bauhaus/analysis]        list the nine phases, done, partial or pending, from which artifacts exist
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { walk, SKIP_DIRS } from './extract.mjs';
import { UsageError, readJson, requireDir, run, runIfMain, table, writeArtifact } from './lib/analysis.mjs';

const DEFAULT_OUT = '.bauhaus/analysis';
const USAGE_TEXT = 'Usage: analyse.mjs init <dir> [--out .bauhaus/analysis] | analyse.mjs status [--out .bauhaus/analysis]';
const FRAMEWORKS = [['react', 'react'], ['vue', 'vue'], ['svelte', 'svelte'], ['@angular/core', 'angular'], ['solid-js', 'solid'], ['lit', 'lit']];
const PARENT_LEVELS = 3;

// ---------- stack ----------

/** Nearest package.json in `dir` or up to 3 parents. Returns {deps, folder} or an empty result. */
function findPackage(dir) {
  let folder = path.resolve(dir);
  for (let i = 0; i <= PARENT_LEVELS; i++, folder = path.dirname(folder)) {
    const file = path.join(folder, 'package.json');
    if (!fs.existsSync(file)) continue;
    const pkg = readJson(file);
    return { folder, deps: { ...pkg.peerDependencies, ...pkg.devDependencies, ...pkg.dependencies } };
  }
  return { folder: path.resolve(dir), deps: {} };
}

const hasDep = (deps, re) => Object.keys(deps).some((d) => re.test(d));

function detectStyling({ folder, deps }, dir, files) {
  const tailwindConfig = [dir, folder].some((d) => ['js', 'cjs', 'mjs', 'ts'].some((e) => fs.existsSync(path.join(d, `tailwind.config.${e}`))));
  if (tailwindConfig || deps.tailwindcss) return 'tailwind';
  if (hasDep(deps, /^(styled-components|@emotion\/|@stitches\/|@vanilla-extract\/)/)) return 'css-in-js';
  if (deps.sass || deps['sass-embedded'] || files.some((f) => /\.s[ac]ss$/.test(f))) return 'sass';
  if (files.some((f) => f.endsWith('.module.css'))) return 'css-modules';
  return 'css';
}

/**
 * Framework from package.json deps (first match in a fixed order), styling from config, deps and files.
 * ponytail: a monorepo with two frameworks reports only the first; per-package scopes if that matters.
 */
export function detectStack(dir, files = walk(dir)) {
  const pkg = findPackage(dir);
  const framework = FRAMEWORKS.find(([dep]) => pkg.deps[dep])?.[1] ?? 'unknown';
  return { framework, styling: detectStyling(pkg, dir, files) };
}

// ---------- scope ----------

export function buildScope(dir, { now = new Date() } = {}) {
  const files = walk(dir);
  const byExt = {};
  for (const f of files) {
    const ext = path.extname(f).slice(1);
    byExt[ext] = (byExt[ext] ?? 0) + 1;
  }
  return {
    root: dir, stack: detectStack(dir, files), files: files.length,
    byExt: Object.fromEntries(Object.entries(byExt).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
    ignored: [...SKIP_DIRS], generatedAt: now.toISOString(),
  };
}

export function renderScopeMd(scope) {
  const rows = Object.entries(scope.byExt).map(([ext, n]) => [`.${ext}`, n]);
  return [
    '# Scope',
    `Scanned \`${scope.root}\`: ${scope.files} source files.`,
    `- Framework: ${scope.stack.framework}\n- Styling: ${scope.stack.styling}\n- Ignored folders: ${scope.ignored.join(', ')}`,
    `## Files by extension\n\n${table(['Extension', 'Files'], rows)}`,
    '## Gate\n\nConfirm the scope and who uses the product.',
  ].join('\n\n') + '\n';
}

// ---------- status ----------

const PHASES = (dir, out) => [
  ['Scope', ['01-scope.json'], `node scripts/analyse.mjs init ${dir} --out ${out}`],
  ['Values', ['02-values/inventory.json'], `node scripts/extract.mjs ${dir} --out ${out}/02-values`],
  ['Foundations', ['03-foundations.json'], `node scripts/foundations.mjs --inventory ${out}/02-values/inventory.json --out ${out}`],
  ['Tokens', tokensState, `node scripts/normalise.mjs tokens --analysis ${out}`],
  ['Components', ['05-components.json'], `node scripts/components.mjs ${dir} --out ${out}`],
  ['Patterns', ['06-patterns.json'], `node scripts/patterns.mjs --components ${out}/05-components.json ${dir} --out ${out}`],
  ['Classification', ['07-classification.md'], `ask the architect agent to write ${out}/07-classification.md`],
  ['Normalisation', ['08-normalisation.json'], `node scripts/normalise.mjs plan --analysis ${out}`],
  ['Build-up', ['09-build.md'], `run one batch of ${out}/08-plan.md through its skill (/bauhaus:foundation, /bauhaus:tokens, ...)`],
];

const hasTokenFile = (dir) => fs.existsSync(dir) && fs.readdirSync(dir, { recursive: true }).some((f) => f.endsWith('.tokens.json'));

/** The library layout (docs/library.md): foundations/<name>/*.tokens.json and themes/<name>/*.tokens.json. The flat primitives.tokens.json is the older layout. */
function tokensState(out) {
  const dir = path.join(out, '04-tokens');
  if (fs.existsSync(path.join(dir, 'primitives.tokens.json'))) return 'done';
  const tiers = [hasTokenFile(path.join(dir, 'foundations')), hasTokenFile(path.join(dir, 'themes'))];
  return tiers.every(Boolean) ? 'done' : tiers.some(Boolean) ? 'partial' : 'pending';
}

function filesState(out, artifacts) {
  const n = artifacts.filter((a) => fs.existsSync(path.join(out, a))).length;
  return n === artifacts.length ? 'done' : n ? 'partial' : 'pending';
}

/** [{n, name, state, done, command}] for the nine phases. `state` is done, partial or pending; `done` is state === 'done'. */
export function phaseStatus(out) {
  const scope = path.join(out, '01-scope.json');
  const dir = fs.existsSync(scope) ? readJson(scope).root : '<dir>';
  return PHASES(dir, out).map(([name, artifacts, command], i) => {
    const state = typeof artifacts === 'function' ? artifacts(out) : filesState(out, artifacts);
    return { n: i + 1, name, state, done: state === 'done', command };
  });
}

function printStatus(out, io) {
  const phases = phaseStatus(out);
  for (const p of phases) io.log(`${p.n} ${p.name.padEnd(15)} ${p.state}`);
  const next = phases.find((p) => !p.done);
  io.log(next ? `Next: ${next.n} ${next.name}: ${next.command}` : 'All nine phases are done.');
}

// ---------- CLI ----------

export function main(argv, io = console) {
  return run('analyse', USAGE_TEXT, io, () => {
    const { values: opts, positionals } = parseArgs({ args: argv, allowPositionals: true, options: { out: { type: 'string', default: DEFAULT_OUT } } });
    const [command, dir, ...rest] = positionals;
    if (command === 'status' && !dir) return printStatus(opts.out, io);
    if (command !== 'init' || !dir || rest.length) throw new UsageError('expected `init <dir>` or `status`');
    const scope = buildScope(requireDir(dir));
    writeArtifact(opts.out, '01-scope.json', scope);
    writeArtifact(opts.out, '01-scope.md', renderScopeMd(scope));
    io.log(`${scope.stack.framework} + ${scope.stack.styling}, ${scope.files} files; wrote 01-scope.json and 01-scope.md to ${opts.out}`);
    return 0;
  });
}

runIfMain(import.meta.url, main);
