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
//   - dot-folders (.storybook, .git) are skipped by the slice checks; only `storybook.literal` reads .storybook;
//   - `place` reads the name and props only: two components with one name get the same target.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { cleanSource } from './extract.mjs';
import { UsageError, readJson, requireDir, run, runIfMain, table, writeArtifact } from './lib/analysis.mjs';
import { FONT_GROUP, FONT_SCALES, TYPEFACE_GROUP } from './lib/typography.mjs';

const USAGE_TEXT = `Usage: structure.mjs check <package-dir> [--json]
       structure.mjs place --components <05-components.json> [--out .bauhaus/analysis/placement.json]
       structure.mjs scaffold <target-dir> --name <npm-name> [--prefix ds]`;

// Build output (`dist`, the `build-storybook` output) and installs are not source.
const SKIP_DIRS = new Set(['node_modules', 'dist', 'storybook-static']);
const LAYERS = ['foundations', 'themes', 'primitives', 'components', 'patterns'];
// `fixtures` is a root that is not a layer: Storybook-only building blocks, sliced like components, never exported.
const ROOTS = [...LAYERS, 'fixtures'];
const BY_KIND = new Set(['hooks', 'utils', 'helpers', 'lib', 'common', 'shared', 'misc', 'types', 'constants', 'styles', 'stories', 'assets', 'core']);
const MAIN_EXT = ['tsx', 'jsx', 'vue', 'svelte', 'ts'];
const STORY_EXT = ['tsx', 'ts', 'jsx', 'js'];
const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const APP_MODULES = ['i18next', 'react-i18next', 'react-intl', 'react-router', 'react-router-dom', 'next/router', 'next/navigation', '@tanstack/react-query', 'axios', 'swr', '@apollo/client'];
const APP_ALIAS = /^(?:[@~]\/|src\/)/;
const STORY_FILE = /\.stories\.[jt]sx?$/;
/** A Storybook-only view kept beside its component, such as `button.isometric.fixture.tsx`. It counts as a fixture. */
const FIXTURE_FILE = /\.fixture(?:\.[jt]sx?)?$/;
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
  // A fixture builds on the whole library, but only through its slices: the public entry stays closed to it.
  fixtures: ['foundations', 'themes', 'primitives', 'components', 'patterns', 'fixtures', 'root'],
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
  // themes/ is itself a slice: one showcase and one guide for every theme; themes/<name>/ holds only tokens.
  if (dir === 'themes') return 'theme-set';
  if (['foundations', 'themes', 'primitives', 'patterns', 'fixtures'].includes(parts[0]) && parts.length === 2) return parts[0];
  return parts[0] === 'components' && parts.length === 3 ? 'components' : null;
}

/** The slice folder a file sits in (at any depth), or null. */
function sliceOf(file) {
  const parts = file.split('/');
  const depth = parts[0] === 'components' ? 3 : 2;
  return ROOTS.includes(parts[0]) && parts.length > depth ? parts.slice(0, depth).join('/') : null;
}

// ---------- folder and slice checks ----------

function folderChecks({ dirs }) {
  const out = [];
  for (const d of dirs) {
    const name = path.posix.basename(d);
    if (BY_KIND.has(name)) out.push(finding('misfile.folder-by-file-type', 'MEDIUM', d, `Folder "${name}" is named for a kind of file, not for what it holds.`, 'Move each file beside the code that uses it; shared code rises to the nearest common ancestor, named for what it does.'));
    if (!d.includes('/') && !ROOTS.includes(name)) out.push(finding('structure.root', 'MEDIUM', d, `"${name}" is not a root folder of the library.`, `Move it into ${ROOTS.join(', ')}, or delete it.`));
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

/** The showcase contract: the story file imports DocPage from a path ending in `fixtures/doc-page/doc-page` and renders `<DocPage`. */
const rendersDocPage = (text) => /\bfrom\s*['"][^'"]*fixtures\/doc-page\/doc-page['"]/.test(text) && /<DocPage\b/.test(text);

/** The examples contract (components, primitives, foundations and patterns): the story file imports ExamplesPage from `fixtures/examples/examples` and renders `<ExamplesPage`. */
const EXAMPLE_LAYERS = ['components', 'primitives', 'foundations', 'patterns'];
const rendersExamples = (text) => /\bfrom\s*['"][^'"]*fixtures\/examples\/examples['"]/.test(text) && /<ExamplesPage\b/.test(text);

/** A fixture holds logic when its main file has a hook or an exported function that is not a component. */
const hasLogic = (text) => /\buse(?:State|Effect|LayoutEffect|Memo|Ref|SyncExternalStore)\b|export (?:async )?function [a-z]/.test(text);

function sliceChecks({ root, dirs, files }) {
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
    if (layer === 'fixtures') {
      // A fixture is a Storybook-only block: a story that shows it alone, and a test when it holds logic. No guide, no rulebook.
      need('slice.story', 'HIGH', STORY_EXT.some((e) => files.has(`${dir}/${name}.stories.${e}`)), `${name}.stories.tsx`);
      const main = MAIN_EXT.map((e) => `${dir}/${name}.${e}`).find((f) => files.has(f));
      const logic = main && hasLogic(fs.readFileSync(path.join(root, main), 'utf8'));
      need('slice.test', 'MEDIUM', !logic || STORY_EXT.some((e) => files.has(`${dir}/${name}.test.${e}`)), `${name}.test.tsx`);
      continue;
    }
    if (layer === 'themes') { need('slice.tokens', 'MEDIUM', has(dir, 'tokens.json'), `${name}.tokens.json`); continue; }
    need('slice.story', 'HIGH', STORY_EXT.some((e) => files.has(`${dir}/${name}.stories.${e}`)), `${name}.stories.tsx`);
    need('slice.page', 'MEDIUM', has(dir, 'mdx'), `${name}.mdx`);
    const story = STORY_EXT.map((e) => `${dir}/${name}.stories.${e}`).find((f) => files.has(f));
    if (story && !rendersDocPage(fs.readFileSync(path.join(root, story), 'utf8'))) {
      out.push(finding('slice.showcase', 'MEDIUM', story, `Slice "${name}": the story file does not render a DocPage.`, `Import DocPage from a path ending in fixtures/doc-page/doc-page and render <DocPage …/> in ${name}.stories.tsx.`));
    }
    if (story && EXAMPLE_LAYERS.includes(layer) && !rendersExamples(fs.readFileSync(path.join(root, story), 'utf8'))) {
      out.push(finding('slice.examples', 'MEDIUM', story, `Slice "${name}": the story file has no Examples page.`, `Import ExamplesPage from a path ending in fixtures/examples/examples and render <ExamplesPage …/> in an Examples story of ${name}.stories.tsx.`));
    }
    need('slice.rules', 'MEDIUM', layer === 'theme-set' || has(dir, 'rules.ts'), `${name}.rules.ts`);
    need('slice.test', 'MEDIUM', !component || STORY_EXT.some((e) => files.has(`${dir}/${name}.test.${e}`)), `${name}.test.tsx`);
    // A foundation may split its tokens over several files (color: palette + colors); a theme has one.
    const anyTokens = [...files].some((f) => path.posix.dirname(f) === dir && f.endsWith('.tokens.json'));
    need('slice.tokens', 'MEDIUM', layer !== 'foundations' || anyTokens, `${name}.tokens.json`);
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
    const documentsSlice = ['foundations', 'theme-set', 'patterns', 'fixtures'].includes(layer) && m[1] === path.posix.basename(dir);
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

// ---------- colour at the call site ----------

const CALL_SITE = /^(?:primitives|components|patterns)\/.*\.(?:css|tsx)$/;

/** The CSS prefix from the package's bauhaus.config.json, `ds` when absent or invalid. */
function prefixOf(root) {
  try {
    const { prefix } = JSON.parse(fs.readFileSync(path.join(root, 'bauhaus.config.json'), 'utf8'));
    return /^[a-z][a-z0-9]{0,7}$/.test(prefix) ? prefix : 'ds';
  } catch {
    return 'ds';
  }
}

/** One finding per call-site file whose text (comments stripped) matches `use`; `hit[1]` is the variable prefix found. */
function callSiteReads({ root, files }, use, id, describe, fix) {
  return [...files].filter((f) => CALL_SITE.test(f)).flatMap((f) => {
    const hit = use.exec(fs.readFileSync(path.join(root, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''));
    return hit ? [finding(id, 'HIGH', f, describe(hit[1]), fix)] : [];
  });
}

/** Components read roles only: a palette or colors variable in a component, primitive or pattern is a misfile. */
function paletteChecks(ctx) {
  const use = new RegExp(`var\\(\\s*(--${prefixOf(ctx.root)}-(?:palette|colors)-)`);
  return callSiteReads(ctx, use, 'misfile.palette-at-call-site', (v) => `Reads ${v}…, a palette or colors variable; components use roles only.`,
    'Use a role (var(--ds-text-default), var(--ds-action-primary)). If no role fits, add a role to every theme; do not read the palette.');
}

/** Components read text styles only: a typeface or font role variable is a misfile. The font scales (size, weight, line height) are not roles. */
function typefaceChecks(ctx) {
  const prefix = prefixOf(ctx.root);
  const use = new RegExp(`var\\(\\s*(--${prefix}-(?:${TYPEFACE_GROUP}-|${FONT_GROUP}-(?!(?:${FONT_SCALES.join('|')})\\b)))`);
  return callSiteReads(ctx, use, 'misfile.typeface-at-call-site', (v) => `Reads ${v}…, a typeface or font role variable; components use text styles only.`,
    `Use a text style (var(--${prefix}-text-body-family), var(--${prefix}-text-code-family)). If no style fits, add a text style; do not read the typeface or the font role.`);
}

// ---------- Storybook dogfoods the design system ----------

const STORYBOOK_FILE = /\.(?:tsx?|css)$/;
const GENERATED = /\.generated\./;
const STORYBOOK_LITERAL = /#[0-9a-f]{3,8}\b|\b(?:rgb|hsl|oklch|hwb|lab)a?\(|(?<![\w.-])(?!0px)\d*\.?\d+(?:px|rem)\b/gi;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name === 'node_modules' || e.name === 'storybook-static') return [];
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');

/** No raw colour or size in .storybook or fixtures: the pages are styled with the library's tokens only. */
export function storybookChecks({ root }) {
  return ['.storybook', 'fixtures'].map((name) => path.join(root, name)).filter((dir) => fs.existsSync(dir)).flatMap((dir) => storybookHits(root, dir));
}

function storybookHits(root, dir) {
  return walk(dir).filter((f) => STORYBOOK_FILE.test(f) && !GENERATED.test(f)).flatMap((f) => {
    const hits = [...new Set(stripComments(fs.readFileSync(f, 'utf8')).match(STORYBOOK_LITERAL) ?? [])];
    const rel = path.relative(root, f).split(path.sep).join('/');
    return hits.length ? [finding('storybook.literal', 'MEDIUM', rel, `Raw value in Storybook code: ${hits.slice(0, 4).join(', ')}.`, 'Use a token (var(--ds-...)) or, in TypeScript, read it from the generated tokens file.')] : [];
  });
}

// ---------- imports ----------

const importsOf = (text, ext) => [...cleanSource(text, ext).matchAll(IMPORT)].map((m) => m[1]);
const isApp = (spec) => APP_MODULES.some((m) => spec === m || spec.startsWith(`${m}/`)) || APP_ALIAS.test(spec);

/** What kind of local file `target` (package-relative, posix) is: a layer name, or `root`. */
const kindOf = (target) => (ROOTS.includes(target.split('/')[0]) && target.includes('/') ? target.split('/')[0] : 'root');

function relativeImport(file, spec, files) {
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
  // A story may import from .storybook, outside the package layers.
  if (STORY_FILE.test(file) && target.split('/')[0] === '.storybook') return null;
  // A fixture is Storybook-only. Stories, tests and other fixtures may use it; nothing else in the library may.
  const isFixture = (f) => f.split('/')[0] === 'fixtures' || FIXTURE_FILE.test(f);
  if (isFixture(target) && !isFixture(file) && !STORY_FILE.test(file) && !/\.test\.[jt]sx?$/.test(file)) {
    return finding('fixture.exposed', 'HIGH', file, `Imports a fixture ("${spec}"). Fixtures are Storybook-only and never ship.`, 'Only *.stories.tsx, *.test.tsx, .storybook/ and other fixtures (fixtures/, *.fixture.tsx) may import fixtures.');
  }
  if (target.split('/')[0] === 'fixtures') return null;
  if (target.startsWith('..')) return finding('misfile.library-imports-app', 'HIGH', file, `"${spec}" reaches out of the package.`, 'Take the value as a prop; the library never imports the app.');
  const own = sliceOf(file);
  if (own && (target === own || target.startsWith(`${own}/`))) return null;
  const layer = ROOTS.includes(file.split('/')[0]) ? file.split('/')[0] : null;
  const kind = kindOf(target);
  const entry = kind === 'root' && /^index(\.|$)/.test(target);
  // A story documents its slice and ships nowhere: it may show any slice of the library, but not the public entry.
  if (STORY_FILE.test(file) && kind !== 'root') return null;
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
  const all = [folderChecks, sliceChecks, storyChecks, patternStyleChecks, paletteChecks, typefaceChecks, storybookChecks, importChecks].flatMap((c) => c(ctx));
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
  fs.cpSync(KIT_LIBRARY, target, { recursive: true, filter: (src) => !['node_modules', 'storybook-static'].includes(path.basename(src)) });
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
