#!/usr/bin/env node
// manifest.mjs build <libraryDir> [--out file]
//            | check <libraryDir> [--out file] [--agents file]
//            | agents <libraryDir> [--out AGENTS.md]
// Writes bauhaus-manifest.json: one lookup file for the slices of a library, so an agent reads an index
// instead of loading every source file. `check` fails when the committed file is stale; it also compares the marked block of --agents (default <libraryDir>/AGENTS.md when it exists). `agents` writes
// a short context block for the consuming repo's AGENTS.md. Why: docs/ai-consumption (knowledge/tooling).
//
// ponytail: regex over the slice files, no parser. Ceiling (known limits, none checked):
//   - props come from `export interface <Export>Props` members: an `extends` list, a mapped type or a
//     `type XProps = ...` alias loses props; upgrade path is the TypeScript compiler API or react-docgen;
//   - defaults come from the destructured first parameter of `function <Export>(`: a default set in the body is missed;
//   - the summary is the `plain="..."` line of the story: a slice without one has an empty summary;
//   - `composes` follows relative imports into other slices: an alias import is missed;
//   - the export comes from index.ts `export { ... } from './<slice path>/...'` (`X as Y` records Y): `export *` and a slice that is not exported have none;
//   - a member is split on `;` and on a line that starts `name:` at depth 0: a member whose type breaks onto a line that looks like `name:` is split wrongly;
//   - `|` and brackets inside string literals are not escaped.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { UsageError, readJson, requireDir, run, runIfMain, table, uniq } from './lib/analysis.mjs';

const USAGE_TEXT = `Usage: manifest.mjs build <libraryDir> [--out bauhaus-manifest.json]
       manifest.mjs check <libraryDir> [--out bauhaus-manifest.json] [--agents AGENTS.md]
       manifest.mjs agents <libraryDir> [--out AGENTS.md]`;
const MANIFEST = 'bauhaus-manifest.json';
const START = '<!-- bauhaus:start -->';
const END = '<!-- bauhaus:end -->';
const LAYER_OF = { foundations: 'foundation', primitives: 'primitive', components: 'component', patterns: 'pattern' };
const SOURCE = (f) => /\.tsx$/.test(f) && !/\.(stories|test|fixture|isometric\.fixture)\.tsx$/.test(f);
const SUMMARY_MAX = 110;

// ---------- small text helpers ----------

const subdirs = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules').map((e) => e.name).sort() : []);
const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '');
const pascal = (s) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const squash = (s) => s.replace(/\s+/g, ' ').trim();

/** Text between the bracket at `open` and its match. */
function balanced(text, open) {
  const start = text[open];
  const end = { '{': '}', '(': ')' }[start];
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === start) depth++;
    else if (text[i] === end && --depth === 0) return text.slice(open + 1, i);
  }
  return text.slice(open + 1);
}

/** Split on `sep` at bracket depth 0. `=>` and `<` `>` do not count as brackets. */
function splitTop(text, sep) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const c of text) {
    if ('({['.includes(c)) depth++;
    else if (')}]'.includes(c)) depth--;
    if (depth === 0 && c === sep) { out.push(cur); cur = ''; } else cur += c;
  }
  return [...out, cur].filter((s) => s.trim());
}

// ---------- props ----------

/** A union of string literals as its values, else null. */
function literals(type) {
  const parts = type.split('|').map((s) => s.trim()).filter(Boolean);
  return parts.length && parts.every((p) => /^'[^']*'$|^"[^"]*"$/.test(p)) ? parts.map((p) => p.slice(1, -1)) : null;
}

/** Split one `;`-chunk on depth-0 newlines where a new `name:` member starts. Doc, multi-line types and `|` lines stay with their member. */
function splitMembers(chunk) {
  const out = [];
  let cur = '';
  let depth = 0;
  let inDoc = false;
  for (const line of chunk.split('\n')) {
    const bare = cur.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').trim();
    if (!inDoc && depth === 0 && bare && /^\s*(?:readonly\s+)?['"]?[A-Za-z_$][\w$-]*['"]?\??\s*:/.test(line)) { out.push(cur); cur = ''; }
    cur += `${line}\n`;
    for (const c of line.replace(/\/\*.*?\*\//g, '')) {
      if ('({['.includes(c)) depth++;
      else if (')}]'.includes(c)) depth--;
    }
    if (/\/\*(?!.*\*\/)/.test(line)) inDoc = true;
    else if (inDoc && line.includes('*/')) inDoc = false;
  }
  return [...out, cur];
}

function parseMember(chunk, aliases) {
  let rest = chunk.trim();
  let doc = '';
  for (let m; (m = /^\/\*\*([\s\S]*?)\*\/\s*/.exec(rest)); rest = rest.slice(m[0].length)) {
    doc = squash(m[1].split('\n').map((l) => l.replace(/^\s*\*\s?/, '')).join(' '));
  }
  rest = rest.replace(/^(\/\/.*\n\s*)+/, '');
  const m = /^(?:readonly\s+)?['"]?([A-Za-z_$][\w$-]*)['"]?(\?)?\s*:\s*([\s\S]+)$/.exec(rest);
  if (!m) return null;
  const type = squash(m[3]).replace(/^\|\s*/, '');
  const values = literals(aliases[type] ?? type);
  return { name: m[1], type, optional: Boolean(m[2]), doc, ...(values && { values }) };
}

function defaultsOf(source, name) {
  const sig = new RegExp(`function\\s+${name}\\s*(?:<[^>(]*>)?\\s*\\(`).exec(source);
  if (!sig) return {};
  const params = balanced(source, sig.index + sig[0].length - 1);
  const open = params.indexOf('{');
  if (open < 0) return {};
  const out = {};
  for (const seg of splitTop(balanced(params, open), ',')) {
    const m = /^\s*([A-Za-z_$][\w$]*)\s*=\s*([\s\S]+)$/.exec(seg);
    if (m) out[m[1]] = squash(m[2]);
  }
  return out;
}

function parseProps(source, exportName) {
  const aliases = Object.fromEntries([...source.matchAll(/type\s+(\w+)\s*=\s*([^;]+);/g)].map((m) => [m[1], squash(m[2])]));
  const head = new RegExp(`interface\\s+${exportName}Props\\b[^{]*\\{`).exec(source);
  if (!head) return [];
  const defaults = defaultsOf(source, exportName);
  // A `;` inside a JSDoc must not end a member.
  const body = balanced(source, head.index + head[0].length - 1).replace(/\/\*[\s\S]*?\*\//g, (c) => c.replaceAll(';', '\u0000'));
  return splitTop(body, ';')
    .flatMap(splitMembers)
    .map((c) => parseMember(c, aliases))
    .filter(Boolean)
    .map((p) => ({ ...p, doc: p.doc.replaceAll('\u0000', ';') }))
    .map((p) => (p.name in defaults ? { ...p, default: defaults[p.name] } : p));
}

// ---------- slice facts ----------

/** Slice folders as { dir, layer, family, name }, sorted by name. */
function discover(root) {
  const slices = [];
  for (const top of Object.keys(LAYER_OF)) {
    const base = path.join(root, top);
    if (top === 'components') {
      for (const family of subdirs(base)) for (const name of subdirs(path.join(base, family))) slices.push({ dir: `${top}/${family}/${name}`, layer: LAYER_OF[top], family, name });
    } else for (const name of subdirs(base)) slices.push({ dir: `${top}/${name}`, layer: LAYER_OF[top], family: null, name });
  }
  return slices.filter((s) => fs.readdirSync(path.join(root, s.dir)).some((f) => f.startsWith(`${s.name}.`))).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

/** { 'components/x/y': ['Name', ...] } from the `export { ... } from './...'` lines of index.ts. */
function exportsByDir(root) {
  const out = {};
  for (const m of read(path.join(root, 'index.ts')).matchAll(/^export\s*\{([^}]*)\}\s*from\s*'\.\/([^']+)'/gm)) {
    const dir = path.posix.dirname(m[2]);
    out[dir] = [...(out[dir] ?? []), ...m[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop()).filter(Boolean)];
  }
  return out;
}

function importsOf(root, slice, files, slices) {
  const found = [];
  for (const file of files) {
    for (const m of read(path.join(root, slice.dir, file)).matchAll(/from\s+'(\.[^']*)'/g)) {
      const target = path.posix.normalize(path.posix.join(slice.dir, m[1]));
      const hit = slices.find((s) => s.dir !== slice.dir && (target === s.dir || target.startsWith(`${s.dir}/`)));
      if (hit) found.push(hit.name);
    }
  }
  return uniq(found).sort();
}

function tokensOf(css, prefix) {
  const defined = new Set([...css.matchAll(new RegExp(`(--${prefix}-[\\w-]+)\\s*:`, 'g'))].map((m) => m[1]));
  return uniq([...css.matchAll(new RegExp(`var\\(\\s*(--${prefix}-[\\w-]+)`, 'g'))].map((m) => m[1]).filter((t) => !defined.has(t))).sort();
}

function rulesOf(text) {
  return text.split(/\{\s*id:/).slice(1).map((chunk) => ({
    id: /^\s*'([^']+)'/.exec(chunk)?.[1],
    severity: /severity:\s*'(\w+)'/.exec(chunk)?.[1],
    verify: /verify:\s*'(\w+)'/.exec(chunk)?.[1],
  })).filter((r) => r.id);
}

function describe(root, slice, ctx) {
  const dirAbs = path.join(root, slice.dir);
  const files = fs.readdirSync(dirAbs);
  const sources = files.filter(SOURCE);
  const exported = ctx.exports[slice.dir] ?? [];
  const exportName = exported.find((e) => e === pascal(slice.name)) ?? exported.find((e) => /^[A-Z]/.test(e) && !/Props$/.test(e)) ?? null;
  const code = sources.map((f) => read(path.join(dirAbs, f))).join('\n');
  const props = exportName ? parseProps(code, exportName) : [];
  const stories = read(path.join(dirAbs, `${slice.name}.stories.tsx`));
  const summary = /\bplain="((?:[^"\\]|\\.)*)"/.exec(stories)?.[1] ?? '';
  const composeFiles = slice.layer === 'pattern' ? [...sources, `${slice.name}.stories.tsx`] : sources;
  return {
    name: slice.name,
    export: exportName,
    layer: slice.layer,
    family: slice.family,
    path: slice.dir,
    summary: squash(summary.replace(/\\(.)/g, '$1')),
    props,
    variants: props.find((p) => p.name === 'variant')?.values ?? [],
    tokens: tokensOf(files.filter((f) => f.endsWith('.css')).map((f) => read(path.join(dirAbs, f))).join('\n'), ctx.prefix),
    composes: importsOf(root, slice, composeFiles, ctx.slices),
    rules: rulesOf(read(path.join(dirAbs, `${slice.name}.rules.ts`))),
  };
}

/** The manifest object. Sorted and without timestamps, so two builds of one tree match byte for byte. */
export function buildManifest(libraryDir) {
  const root = requireDir(libraryDir);
  const config = readJson(path.join(root, 'bauhaus.config.json'));
  const pkg = readJson(path.join(root, 'package.json'));
  if (!config.name) throw new UsageError(`${path.join(root, 'bauhaus.config.json')} has no "name"`);
  const slices = discover(root);
  const ctx = { slices, prefix: config.prefix ?? 'ds', exports: exportsByDir(root) };
  return { version: 1, name: config.name, prefix: ctx.prefix, import: pkg.name, slices: slices.map((s) => describe(root, s, ctx)) };
}

const serialise = (manifest) => `${JSON.stringify(manifest, null, 2)}\n`;

// ---------- agents block ----------

const oneLine = (text) => {
  const first = text.split(/(?<=\.)\s/)[0];
  return first.length > SUMMARY_MAX ? `${first.slice(0, SUMMARY_MAX - 1).trimEnd()}…` : first;
};

export function renderAgents(manifest) {
  const { prefix, slices } = manifest;
  const parts = slices.filter((s) => s.export && (s.layer === 'component' || s.layer === 'primitive'));
  const patterns = slices.filter((s) => s.layer === 'pattern');
  const rows = parts.map((s) => [`\`${s.export}\``, s.layer, oneLine(s.summary), s.variants.join(', ') || '-']);
  return [
    START,
    `## ${manifest.name}`,
    '',
    `Import from \`${manifest.import}\`. Never import from a slice folder.`,
    '',
    '**Look up before you build.** Read `bauhaus-manifest.json` first. It lists every component with its props, variants, tokens and rules. Reuse an existing component. Never re-implement one.',
    '',
    `**Tokens.** Use role tokens (\`--${prefix}-*\`) only. Never use a palette value or a raw hex colour.`,
    '',
    table(['Component', 'Layer', 'What it is', 'Variants'], rows),
    '',
    `**Patterns** (a recipe of components, see the manifest \`composes\` field): ${patterns.map((s) => `\`${s.name}\``).join(', ') || 'none'}.`,
    '',
    'Rules live in each slice as `<name>.rules.ts`. The manifest lists their ids.',
    END,
    '',
  ].join('\n');
}

/** Put `block` into `existing`: replace the marked block, else append. */
export function spliceBlock(existing, block, file = 'AGENTS.md') {
  const a = existing.indexOf(START);
  const b = existing.indexOf(END);
  if ((a >= 0) !== (b >= 0) || (a >= 0 && b < a)) throw new UsageError(`${file} has a broken ${START} ... ${END} block: fix or remove the markers`);
  if (a >= 0) return existing.slice(0, a) + block + existing.slice(b + END.length).replace(/^\n/, '');
  if (!existing) return block;
  return `${existing}${existing.endsWith('\n') ? '' : '\n'}\n${block}`;
}

// ---------- CLI ----------

const OPTIONS = { out: { type: 'string' }, agents: { type: 'string' } };

function runCommand(command, dir, { out, agents }, io) {
  const manifest = buildManifest(dir);
  if (command === 'agents') {
    const file = out ?? path.join(dir, 'AGENTS.md');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, spliceBlock(read(file), renderAgents(manifest), file));
    io.log(`wrote ${file}`);
    return 0;
  }
  const file = out ?? path.join(dir, MANIFEST);
  if (command === 'build') {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, serialise(manifest));
    io.log(`wrote ${file}: ${manifest.slices.length} slices`);
    return 0;
  }
  let code = 0;
  if (read(file) !== serialise(manifest)) {
    io.error(`${file} is stale. Run: manifest.mjs build ${dir}`);
    code = 1;
  }
  const agentsFile = agents ?? (fs.existsSync(path.join(dir, 'AGENTS.md')) ? path.join(dir, 'AGENTS.md') : null);
  if (agentsFile) {
    const existing = read(agentsFile);
    if (spliceBlock(existing, renderAgents(manifest), agentsFile) !== existing) {
      io.error(`${agentsFile} is stale. Run: manifest.mjs agents ${dir}${agents ? ` --out ${agents}` : ''}`);
      code = 1;
    }
  }
  return code;
}

export function main(argv, io = console) {
  return run('manifest', USAGE_TEXT, io, () => {
    const { values: opts, positionals } = parseArgs({ args: argv, allowPositionals: true, options: OPTIONS });
    const [command, dir] = positionals;
    if (!['build', 'check', 'agents'].includes(command) || positionals.length !== 2) throw new UsageError('expected build, check or agents, then <libraryDir>');
    return runCommand(command, dir, opts, io);
  });
}

runIfMain(import.meta.url, main);
