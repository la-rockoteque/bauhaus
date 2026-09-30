#!/usr/bin/env node
// structure.mjs check <package-dir> [--json]
//            | place --components <05-components.json> [--out <file>]
//            | scaffold <target-dir> --name <npm-name> [--prefix ds]
// Checks a library package against docs/library.md, proposes a slice for every analysed component,
// and copies the kit/library template.
//
// How it reads: file names and a text scan of import lines, no parser. Ceiling (known limits, none checked):
//   - imports are found by regex: an import built at runtime, or inside a template string, is missed;
//   - an app path alias is only recognised as `@/`, `~/` or `src/`;
//   - dot-folders (.storybook, .git) are skipped whole, so a stray file in .storybook is never read;
//   - `place` reads the name and props only: two components with one name get the same target.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { cleanSource } from './extract.mjs';
import { UsageError, readJson, requireDir, run, runIfMain, table, writeArtifact } from './lib/analysis.mjs';

const USAGE_TEXT = `Usage: structure.mjs check <package-dir> [--json]
       structure.mjs place --components <05-components.json> [--out .bauhaus/analysis/placement.json]
       structure.mjs scaffold <target-dir> --name <npm-name> [--prefix ds]`;

const SKIP_DIRS = new Set(['node_modules', 'dist']);
const LAYERS = ['foundations', 'themes', 'primitives', 'components', 'patterns'];
const BY_KIND = new Set(['hooks', 'utils', 'helpers', 'lib', 'common', 'shared', 'misc', 'types', 'constants', 'styles', 'stories', 'assets', 'core']);
const MAIN_EXT = ['tsx', 'jsx', 'vue', 'svelte', 'ts'];
const STORY_EXT = ['tsx', 'ts', 'jsx', 'js'];
const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const APP_MODULES = ['i18next', 'react-i18next', 'react-intl', 'react-router', 'react-router-dom', 'next/router', 'next/navigation', '@tanstack/react-query', 'axios', 'swr', '@apollo/client'];
const APP_ALIAS = /^(?:[@~]\/|src\/)/;
const SOURCE_FILE = /\.(?:[cm]?[jt]sx?|vue|svelte)$/;
const IMPORT = /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)['"]([^'"]+)['"]/g;
const LITERAL = /#[0-9a-f]{3,8}\b|\b(?:rgb|hsl|oklch|hwb|lab)a?\(|(?<![\w.])(?!0px)\d*\.?\d+px\b/i;
const RANK = { HIGH: 0, MEDIUM: 1, LOW: 2 };
// Which kinds of local file each layer may import. `root` is a file at the package root.
const MAY_IMPORT = {
  foundations: [],
  themes: [],
  primitives: ['foundations', 'primitives', 'root'],
  components: ['foundations', 'primitives', 'components', 'root'],
  patterns: ['components', 'primitives', 'root'],
};

const finding = (id, severity, p, message, fix) => ({ id, severity, path: p, message, fix });
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// ---------- reading the tree ----------

function listTree(root, rel = '', out = { dirs: [], files: [] }) {
  for (const e of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue;
    const p = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      out.dirs.push(p);
      listTree(root, p, out);
    } else out.files.push(p);
  }
  return out;
}

/** The layer when `dir` is a slice folder (foundations/x, components/family/x), else null. */
function sliceLayer(dir) {
  const parts = dir.split('/');
  if (['foundations', 'themes', 'primitives', 'patterns'].includes(parts[0]) && parts.length === 2) return parts[0];
  return parts[0] === 'components' && parts.length === 3 ? 'components' : null;
}

/** The slice folder a file sits in (at any depth), or null. */
function sliceOf(file) {
  const parts = file.split('/');
  const depth = parts[0] === 'components' ? 3 : 2;
  return LAYERS.includes(parts[0]) && parts.length > depth ? parts.slice(0, depth).join('/') : null;
}

// ---------- folder and slice checks ----------

function folderChecks({ dirs }) {
  const out = [];
  for (const d of dirs) {
    const name = path.posix.basename(d);
    if (BY_KIND.has(name)) out.push(finding('misfile.folder-by-file-type', 'MEDIUM', d, `Folder "${name}" is named for a kind of file, not for what it holds.`, 'Move each file beside the code that uses it; shared code rises to the nearest common ancestor, named for what it does.'));
    if (!d.includes('/') && !LAYERS.includes(name)) out.push(finding('structure.root', 'MEDIUM', d, `"${name}" is not a root folder of the library.`, `Move it into ${LAYERS.join(', ')}, or delete it.`));
    if (d.split('/').length === 2 && d.startsWith('components/')) {
      const members = dirs.filter((x) => x.startsWith(`${d}/`) && x.split('/').length === 3).length;
      if (members < 2) out.push(finding('structure.family', 'LOW', d, `Family "${name}" has ${members} component slice${members === 1 ? '' : 's'}; a family needs 2 or more.`, 'Move the slice into the closest family, or wait for the second member.'));
    }
  }
  return out;
}

function nameProblem(dir, layer, files) {
  const name = path.posix.basename(dir);
  const problems = [];
  if (!KEBAB.test(name)) problems.push('the name is not kebab-case');
  if (['components', 'primitives'].includes(layer) && !MAIN_EXT.some((e) => files.has(`${dir}/${name}.${e}`))) problems.push(`the main file ${name}.tsx is missing`);
  return problems;
}

function sliceChecks({ dirs, files }) {
  const out = [];
  const has = (dir, suffix) => files.has(`${dir}/${path.posix.basename(dir)}.${suffix}`);
  for (const dir of dirs) {
    const layer = sliceLayer(dir);
    if (!layer) continue;
    const name = path.posix.basename(dir);
    const problems = nameProblem(dir, layer, files);
    if (problems.length) out.push(finding('structure.slice-name', 'MEDIUM', dir, `Slice "${name}": ${problems.join('; ')}.`, `Name the folder in kebab-case and its main file <folder>.tsx (or .vue, .svelte, .ts).`));
    const component = ['components', 'primitives'].includes(layer);
    const need = (id, severity, ok, what) => ok || out.push(finding(id, severity, dir, `Slice "${name}" has no ${what}.`, `Add ${what} to ${dir}/.`));
    need('slice.story', 'HIGH', STORY_EXT.some((e) => files.has(`${dir}/${name}.stories.${e}`)), `${name}.stories.tsx`);
    need('slice.page', 'MEDIUM', has(dir, 'mdx'), `${name}.mdx`);
    need('slice.rules', 'MEDIUM', layer === 'themes' || has(dir, 'rules.ts'), `${name}.rules.ts`);
    need('slice.test', 'MEDIUM', !component || STORY_EXT.some((e) => files.has(`${dir}/${name}.test.${e}`)), `${name}.test.tsx`);
    need('slice.tokens', 'MEDIUM', !['foundations', 'themes'].includes(layer) || has(dir, 'tokens.json'), `${name}.tokens.json`);
  }
  return out;
}

function storyChecks({ files }) {
  const out = [];
  for (const f of files) {
    const m = /^(.+)\.stories\.(?:tsx|ts|jsx|js)$/.exec(path.posix.basename(f));
    if (!m) continue;
    const dir = path.posix.dirname(f);
    const layer = sliceLayer(dir);
    const documentsSlice = ['foundations', 'themes', 'patterns'].includes(layer) && m[1] === path.posix.basename(dir);
    if (!documentsSlice && !MAIN_EXT.some((e) => files.has(`${dir}/${m[1]}.${e}`))) {
      out.push(finding('misfile.story-far-from-component', 'MEDIUM', f, `Story "${m[1]}" has no ${m[1]}.tsx beside it.`, 'Move the story into the folder of the component it shows.'));
    }
  }
  return out;
}

function patternStyleChecks({ root, files }) {
  return [...files].filter((f) => f.startsWith('patterns/') && f.endsWith('.css')).flatMap((f) => {
    const text = fs.readFileSync(path.join(root, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    return LITERAL.test(text) ? [finding('pattern.no-styles', 'MEDIUM', f, 'A pattern stylesheet holds a literal colour or px value; patterns carry no values.', 'Compose components that own the style, or use a semantic token (var(--ds-...)).')] : [];
  });
}

// ---------- imports ----------

const importsOf = (text, ext) => [...cleanSource(text, ext).matchAll(IMPORT)].map((m) => m[1]);
const isApp = (spec) => APP_MODULES.some((m) => spec === m || spec.startsWith(`${m}/`)) || APP_ALIAS.test(spec);

/** What kind of local file `target` (package-relative, posix) is: a layer name, or `root`. */
const kindOf = (target) => (LAYERS.includes(target.split('/')[0]) && target.includes('/') ? target.split('/')[0] : 'root');

function relativeImport(file, spec, files) {
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
  if (target.startsWith('..')) return finding('misfile.library-imports-app', 'HIGH', file, `"${spec}" reaches out of the package.`, 'Take the value as a prop; the library never imports the app.');
  const own = sliceOf(file);
  if (own && (target === own || target.startsWith(`${own}/`))) return null;
  const layer = LAYERS.includes(file.split('/')[0]) ? file.split('/')[0] : null;
  const kind = kindOf(target);
  const entry = kind === 'root' && /^index(\.|$)/.test(target);
  if (!layer || (MAY_IMPORT[layer].includes(kind) && !entry)) return null;
  return finding('structure.direction', 'HIGH', file, `${layer} imports ${entry ? 'the public entry' : kind} ("${spec}").`, `${layer} may import ${MAY_IMPORT[layer].join(', ') || 'nothing local'}. Move the shared piece down, or take it as a prop.`);
}

function importChecks({ root, files }) {
  const out = [];
  for (const f of [...files].filter((x) => SOURCE_FILE.test(x))) {
    for (const spec of importsOf(fs.readFileSync(path.join(root, f), 'utf8'), path.extname(f))) {
      if (isApp(spec)) out.push(finding('misfile.library-imports-app', 'HIGH', f, `Imports "${spec}", an app concern.`, 'Take text, links and data as props; keep i18n, routing and fetching in the app.'));
      else if (spec.startsWith('.')) out.push(relativeImport(f, spec, files));
    }
  }
  return out.filter(Boolean);
}

// ---------- check ----------

/** All findings for a package folder, worst first. */
export function checkStructure(dir) {
  const tree = listTree(dir);
  const ctx = { root: dir, dirs: tree.dirs, files: new Set(tree.files) };
  const all = [folderChecks, sliceChecks, storyChecks, patternStyleChecks, importChecks].flatMap((c) => c(ctx));
  return all.sort((a, b) => RANK[a.severity] - RANK[b.severity] || a.path.localeCompare(b.path) || a.id.localeCompare(b.id));
}

function renderFindings(findings) {
  if (!findings.length) return 'structure ok: 0 findings';
  const lines = findings.map((f) => `[${f.severity}] ${f.id} ${f.path}\n    ${f.message}\n    fix: ${f.fix}`);
  const count = (s) => findings.filter((f) => f.severity === s).length;
  return `${lines.join('\n')}\n${findings.length} findings (HIGH ${count('HIGH')}, MEDIUM ${count('MEDIUM')}, LOW ${count('LOW')})`;
}

// ---------- place ----------

const FAMILY_WORDS = {
  clickables: 'button link toggle action cta anchor',
  fields: 'input field select combobox checkbox radio switch slider textarea date picker upload dropzone qty quantity autocomplete typeahead dropdown zone control',
  'data-structures': 'table grid list tree datagrid spreadsheet row cell column',
  feedback: 'toast banner alert spinner skeleton progress empty badge tag status error notice counter loader snackbar chip message',
  overlays: 'dialog modal popover tooltip menu drawer sheet panel popup overlay lightbox',
  navigation: 'tabs tab breadcrumb breadcrumbs pager pagination nav navbar sidebar stepper wizard navigation',
  primitives: 'box text icon stack heading divider portal slot typography thumbnail avatar image',
};
const ALIASES = { btn: 'button', dlg: 'dialog', txt: 'text' };
const PHRASES = [['menu-item', 'clickables'], ['link-list', 'navigation'], ['visually-hidden', 'primitives'], ['focus-trap', 'primitives']];
const FAMILY_OF = new Map(Object.entries(FAMILY_WORDS).flatMap(([fam, words]) => words.split(' ').map((w) => [w, fam])));
const PAGE_FILE = /(^|\/)(pages?|views?|routes?|screens?)\//i;
const PAGE_NAME = /(Page|Screen)$/;

const lookup = (word) => FAMILY_OF.get(ALIASES[word] ?? word) ?? FAMILY_OF.get(word.replace(/s$/, ''));

function propHint(props) {
  const has = (...names) => names.some((n) => props.includes(n));
  if (has('options', 'checked', 'placeholder') || (has('value') && has('onChange'))) return 'fields';
  if (has('columns', 'rows')) return 'data-structures';
  return has('open', 'isOpen') && has('onClose', 'onDismiss') ? 'overlays' : null;
}

/** Family of a component by the words of its name (last word first), then by its props. */
export function classify({ name, props = [] }) {
  const words = (name.match(/[A-Z][a-z0-9]*|[a-z0-9]+/g) ?? [name]).map((w) => w.toLowerCase());
  const phrase = PHRASES.find(([p]) => words.join('-').endsWith(p));
  if (phrase) return { family: phrase[1], confidence: 0.9, reason: `name phrase "${phrase[0]}"` };
  for (let i = words.length - 1; i >= 0; i--) {
    const family = lookup(words[i]);
    if (family) return { family, confidence: i === words.length - 1 ? 0.9 : 0.6, reason: `name word "${words[i]}"` };
  }
  const hint = propHint(props);
  if (hint) return { family: hint, confidence: 0.4, reason: `props: ${props.slice(0, 4).join(', ')}` };
  return { family: null, confidence: 0, reason: 'no keyword' };
}

const GLYPH = /^[A-Z][A-Za-z0-9]*[a-z0-9]Icon$/;
const EXT_OF = { vue: 'vue', svelte: 'svelte', angular: 'ts', 'web-component': 'ts' };

function keeperNames(components, groups) {
  const usages = (n) => components.find((c) => c.name === n)?.usages ?? 0;
  return new Set((groups ?? []).map((g) => [...g.members].sort((a, b) => usages(b) - usages(a))[0]));
}

/** Propose a slice for each shared component and each group keeper. Pages and other local components are skipped. */
export function placeComponents({ components, groups }) {
  const keepers = keeperNames(components, groups);
  const chosen = components.filter((c) => (c.location === 'shared' || keepers.has(c.name)) && !PAGE_FILE.test(c.file) && !PAGE_NAME.test(c.name));
  const placements = chosen.map((c) => {
    const { family, confidence, reason } = classify(c);
    const slug = kebab(c.name);
    const ext = EXT_OF[c.framework] ?? 'tsx';
    // A named glyph (GearIcon) is an asset of the iconography foundation; only Icon itself is a primitive.
    if (GLYPH.test(c.name)) return { name: c.name, from: c.file.replace(/:\d+$/, ''), to: `foundations/iconography/${slug}.${ext}`, family: 'iconography', confidence: 0.9, reason: 'named glyph' };
    const dir = family === 'primitives' ? `primitives/${slug}` : `components/${family}/${slug}`;
    return { name: c.name, from: c.file.replace(/:\d+$/, ''), to: family ? `${dir}/${slug}.${ext}` : null, family, confidence, reason };
  });
  return { placements };
}

function renderPlacements({ placements }) {
  const groups = Map.groupBy(placements, (p) => p.family ?? 'unplaced');
  const sections = [...groups].map(([family, list]) => `### ${family} (${list.length})\n\n${table(['Component', 'From', 'To', 'Confidence', 'Reason'], list.map((p) => [p.name, p.from, p.to ?? '-', p.confidence, p.reason]))}`);
  return `${placements.length} placements\n\n${sections.join('\n\n')}`;
}

// ---------- scaffold ----------

const KIT_LIBRARY = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'kit', 'library');
const TEXT_FILE = /\.(?:json|[cm]?[jt]sx?|css|mdx?|html)$/;

/** Copy kit/library into `target` and rename the package and the prefix. Returns {files}. */
export function scaffold(target, { name, prefix = 'ds' }) {
  if (!name) throw new UsageError('--name is required');
  if (!/^[a-z][a-z0-9]{0,7}$/.test(prefix)) throw new UsageError(`bad prefix "${prefix}": 1 to 8 lowercase letters and digits, starting with a letter`);
  if (fs.existsSync(target) && fs.readdirSync(target).length) throw new UsageError(`target is not empty: ${target}`);
  fs.cpSync(KIT_LIBRARY, target, { recursive: true, filter: (src) => path.basename(src) !== 'node_modules' });
  const files = fs.readdirSync(target, { recursive: true }).map((r) => path.join(target, r)).filter((f) => fs.statSync(f).isFile());
  for (const f of files.filter((x) => TEXT_FILE.test(x))) {
    let text = fs.readFileSync(f, 'utf8').split('@acme/design-system').join(name);
    if (prefix !== 'ds') text = text.replace(/\bds-/g, `${prefix}-`).replace(/("prefix":\s*)"ds"/, `$1"${prefix}"`);
    fs.writeFileSync(f, text);
  }
  return { files: files.length };
}

// ---------- CLI ----------

const OPTIONS = {
  json: { type: 'boolean', default: false },
  components: { type: 'string' },
  out: { type: 'string', default: '.bauhaus/analysis/placement.json' },
  name: { type: 'string' },
  prefix: { type: 'string', default: 'ds' },
};

function runCheck(dir, opts, io) {
  const findings = checkStructure(requireDir(dir));
  io.log(opts.json ? JSON.stringify(findings, null, 2) : renderFindings(findings));
  return findings.some((f) => f.severity !== 'LOW') ? 1 : 0;
}

function runPlace(opts, io) {
  if (!opts.components) throw new UsageError('--components is required');
  const result = placeComponents(readJson(opts.components));
  writeArtifact(path.dirname(opts.out), path.basename(opts.out), result);
  io.log(renderPlacements(result));
  io.log(`wrote ${opts.out}`);
  return 0;
}

export function main(argv, io = console) {
  return run('structure', USAGE_TEXT, io, () => {
    const { values: opts, positionals } = parseArgs({ args: argv, allowPositionals: true, options: OPTIONS });
    const [command, arg] = positionals;
    if (command === 'check' && positionals.length === 2) return runCheck(arg, opts, io);
    if (command === 'place' && positionals.length === 1) return runPlace(opts, io);
    if (command === 'scaffold' && positionals.length === 2) {
      const { files } = scaffold(arg, opts);
      io.log(`scaffolded ${files} files into ${arg}`);
      return 0;
    }
    throw new UsageError('expected check <dir>, place, or scaffold <dir>');
  });
}

runIfMain(import.meta.url, main);
