#!/usr/bin/env node
// components.mjs <dir> [--out .bauhaus/analysis]
// Finds component definitions and their usages. Writes 05-components.json and 05-components.md.
//
// How it reads: text scan, no parser. Definitions come from per-framework patterns, usages from
// `<Tag` occurrences matched by name. Ceiling (each is a known limit, none is checked):
//   - usages match by name, not by import: two components with one name share their counts;
//   - JSX built outside a `return`/arrow body (a helper variable) hides a component;
//   - props read from `<Name>Props`, the first destructured parameter, defineProps, `export let`,
//     @Input: an intersection type or a nested default `{}` loses props;
//   - literals for a file with several components are counted per component body, css only for the
//     one named like the file.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { cleanSource, lineFinder, scanFile, walk } from './extract.mjs';
import { UsageError, requireDir, round, run, runIfMain, sum, table, uniq, writeArtifact } from './lib/analysis.mjs';

const USAGE_TEXT = 'Usage: components.mjs <dir> [--out .bauhaus/analysis]';
const MIN_SIMILARITY = 0.6;
const NAME_WEIGHT = 0.6;
const SIGNAL_FIRES = 0.5;
const MAX_CLASSES = 30;

// ---------- reading helpers ----------

const pascal = (s) => s.replace(/(^|[-_.\s]+)([a-z0-9])/gi, (_, __, c) => c.toUpperCase());
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** Text between the bracket at `open` and its match. */
function balanced(text, open) {
  const start = text[open];
  const end = { '{': '}', '[': ']', '(': ')' }[start];
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === start) depth++;
    else if (text[i] === end && --depth === 0) return text.slice(open + 1, i);
  }
  return text.slice(open + 1);
}

/** Split a member list on `,` `;` newline at bracket depth 0. */
function segments(inner) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const c of inner) {
    if ('({['.includes(c)) depth++;
    else if (')}]'.includes(c)) depth--;
    if (depth === 0 && (c === ',' || c === ';' || c === '\n')) {
      out.push(cur);
      cur = '';
    } else cur += c;
  }
  return [...out, cur].filter((s) => s.trim());
}

const KEY = /^\s*(?:readonly\s+)?['"]?([A-Za-z_$][\w$-]*)['"]?\??\s*:/;
const memberKeys = (inner) => segments(inner).map((s) => KEY.exec(s)?.[1]).filter(Boolean);
const destructured = (inner) => segments(inner).map((s) => (s.trim().startsWith('...') ? null : /^\s*([A-Za-z_$][\w$]*)/.exec(s)?.[1])).filter(Boolean);
const quoted = (inner) => [...inner.matchAll(/['"]([\w-]+)['"]/g)].map((m) => m[1]);

function typeMembers(text, name) {
  const m = new RegExp(`(?:interface|type)\\s+${name}\\b[^{=]*(?:=\\s*)?\\{`).exec(text);
  return m ? memberKeys(balanced(text, m.index + m[0].length - 1)) : [];
}

/** Members of the block or array that starts at the first bracket after `from` (within `reach` chars). */
function blockAfter(text, from, reach = 400) {
  const m = /[{[]/.exec(text.slice(from, from + reach));
  return m ? { open: text[from + m.index], inner: balanced(text, from + m.index) } : null;
}

const lineOfIndex = (text, index) => lineFinder(text)(index);

// ---------- React ----------

const JSX_RETURN = /(?:return|=>)\s*\(?\s*<[A-Za-z>]/;
const REACT_DEFS = [
  /(?:^|\n)[ \t]*(export\s+(?:default\s+)?)?(?:async\s+)?function\s+([A-Z]\w*)\s*(?:<[^>(]*>)?\s*\(/g,
  /(?:^|\n)[ \t]*(export\s+)?const\s+([A-Z]\w*)\s*(?::[^=\n]+)?=\s*(?:React\.)?(?:memo\(|forwardRef(?:<[^(]*>)?\(|(?:async\s*)?\(|[A-Za-z_$][\w$]*\s*=>)/g,
  /(?:^|\n)[ \t]*(export\s+(?:default\s+)?)?class\s+([A-Z]\w*)\s+extends\s+(?:React\.)?(?:Pure)?Component\b/g,
];

const isExported = (text, name, prefix) => Boolean(prefix)
  || new RegExp(`export\\s*\\{[^}]*\\b${name}\\b|export\\s+default\\s+${name}\\b`).test(text);

function reactProps(text, body, name, isClass) {
  const typed = [`${name}Props`, 'Props'].map((n) => typeMembers(text, n)).find((m) => m.length) ?? [];
  const head = isClass ? null : /\(\s*\{/.exec(body.slice(0, 300));
  const names = head ? destructured(balanced(body, head.index + head[0].length - 1)) : [];
  return uniq([...typed, ...names]);
}

function detectReact(file, text) {
  const found = [];
  for (const re of REACT_DEFS) {
    for (const m of text.matchAll(re)) {
      const at = m.index + m[0].search(new RegExp(`\\b${m[2]}\\b`));
      found.push({ name: m[2], at, prefix: m[1], isClass: re === REACT_DEFS[2] });
    }
  }
  found.sort((a, b) => a.at - b.at);
  return found.map((d, i) => ({ ...d, body: text.slice(d.at, found[i + 1]?.at ?? text.length) }))
    .filter((d) => JSX_RETURN.test(d.body) || /\bextends\b/.test(d.body.slice(0, 120)))
    .map((d) => ({
      name: d.name, framework: 'react', exported: isExported(text, d.name, d.prefix), line: lineOfIndex(text, d.at),
      props: reactProps(text, d.body, d.name, d.isClass), body: d.body,
    }));
}

// ---------- Vue, Svelte ----------

function vueProps(text) {
  const call = /defineProps\s*(<\s*([A-Za-z_]\w*)|<\s*\{|\()/.exec(text);
  if (call?.[2]) return typeMembers(text, call[2]);
  const block = call ? blockAfter(text, call.index, 200) : (() => { const o = /\bprops\s*:/.exec(text); return o ? blockAfter(text, o.index + o[0].length, 20) : null; })();
  if (!block) return [];
  return block.open === '[' ? quoted(block.inner) : memberKeys(block.inner);
}

function detectVue(file, text) {
  const declared = /\bname\s*:\s*['"]([\w-]+)['"]/.exec(text)?.[1];
  const name = declared ?? pascal(path.basename(file, '.vue'));
  return [{ name, framework: 'vue', exported: true, line: 1, props: vueProps(text), body: text, tag: kebab(name) }];
}

function detectSvelte(file, text) {
  const name = path.basename(file, '.svelte');
  if (!/^[A-Z]/.test(name)) return [];
  const runes = /\blet\s*\{([^}]*)\}\s*=\s*\$props\(\)/.exec(text);
  const fromRunes = runes ? destructured(runes[1]) : [];
  const exported = [...text.matchAll(/export\s+let\s+([A-Za-z_$][\w$]*)/g)].map((m) => m[1]);
  return [{ name, framework: 'svelte', exported: true, line: 1, props: uniq([...exported, ...fromRunes]), body: text, tag: name }];
}

// ---------- Angular, web components ----------

const INPUTS = [/@Input\([^)]*\)\s*(?:set\s+)?([A-Za-z_$][\w$]*)/g, /([A-Za-z_$][\w$]*)\s*=\s*input(?:\.required)?\b/g];
const inputsIn = (text) => uniq(INPUTS.flatMap((re) => [...text.matchAll(re)].map((m) => m[1])));

function detectAngular(text) {
  const out = [];
  for (const m of text.matchAll(/@Component\s*\(\s*\{/g)) {
    const config = balanced(text, m.index + m[0].length - 1);
    const after = m.index + m[0].length + config.length + 1;
    const rest = text.slice(after);
    const cls = /^\s*\)\s*(export\s+)?class\s+(\w+)/.exec(rest);
    if (!cls) continue;
    const selector = /selector\s*:\s*['"]([^'"]+)['"]/.exec(config)?.[1];
    out.push({
      name: cls[2], framework: 'angular', exported: Boolean(cls[1]), line: lineOfIndex(text, after + cls[0].indexOf(cls[2])),
      props: inputsIn(rest), body: text.slice(m.index),
      tag: selector && /^[a-z][\w-]*$/.test(selector) ? selector : undefined,
    });
  }
  return out;
}

function detectWebComponents(text) {
  const decorated = [...text.matchAll(/@customElement\(\s*['"]([^'"]+)['"]\s*\)\s*(?:export\s+)?class\s+(\w+)/g)].map((m) => [m[1], m[2], m.index]);
  const defined = [...text.matchAll(/customElements\.define\(\s*['"]([^'"]+)['"]\s*,\s*(\w+)/g)].map((m) => [m[1], m[2], m.index]);
  return [...decorated, ...defined].map(([tag, name, at]) => ({
    name, framework: 'web-component', exported: /export\s+(default\s+)?class/.test(text), line: lineOfIndex(text, at), tag, body: text,
    props: uniq([...text.matchAll(/@property\([^)]*\)\s*([A-Za-z_$][\w$]*)/g)].map((m) => m[1])),
  }));
}

// ---------- dispatch ----------

const DETECTORS = {
  '.tsx': detectReact, '.jsx': detectReact, '.vue': detectVue, '.svelte': detectSvelte,
  '.ts': (file, text) => [...detectAngular(text), ...detectWebComponents(text)],
  '.js': (file, text) => [...detectAngular(text), ...detectWebComponents(text)],
};

/** Component definitions in one file: [{name, framework, exported, line, props, body, tag?}]. */
export function detectComponents(file, source) {
  const ext = path.extname(file);
  const detect = DETECTORS[ext];
  return detect ? detect(file, cleanSource(source, ext)) : [];
}

// ---------- usages ----------

const TAG = /(?<![\w$])<([A-Za-z][\w.:-]*)(?=[\s/>])/g;
const TEMPLATE_EXT = new Set(['.tsx', '.jsx', '.vue', '.svelte', '.html']);
const TEMPLATE_STRING_EXT = new Set(['.ts', '.js']);

/** Map of tag -> count for one file. `.ts`/`.js` count only inside backtick strings. */
export function tagCounts(file, text) {
  const ext = path.extname(file);
  const scanned = TEMPLATE_EXT.has(ext) ? text : TEMPLATE_STRING_EXT.has(ext) ? (text.match(/`[^`]*`/g) ?? []).join('\n') : '';
  const counts = new Map();
  for (const m of scanned.matchAll(TAG)) {
    const tag = m[1].split('.')[0];
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return counts;
}

const folderOf = (file) => (file.includes('/') ? file.split('/')[0] : '.');

function usageOf(def, file, perFile) {
  // A one-word kebab name (`button`) is a native element, so only dashed tags count.
  const dashed = [def.tag ?? kebab(def.name.replace(/Component$/, ''))].filter((t) => t.includes('-'));
  const tags = def.framework === 'react' || def.framework === 'svelte' ? [def.name] : uniq([def.name, ...dashed, ...(def.framework === 'vue' ? [kebab(def.name)].filter((t) => t.includes('-')) : [])]);
  const files = [];
  let usages = 0;
  for (const [f, counts] of perFile) {
    const n = f === file ? 0 : sum(tags, (t) => counts.get(t) ?? 0);
    if (n > 0) files.push(f);
    usages += n;
  }
  return { usages, files, location: uniq(files.map(folderOf)).length >= 2 ? 'shared' : 'local' };
}

// ---------- states, classes, literals ----------

const STATES = {
  disabled: /disabled/i, loading: /loading|busy/i, error: /error|invalid/i, selected: /selected|active|checked/i,
  readonly: /readonly/i, expanded: /expanded|open/i, empty: /empty/i,
};
const CLASS_ATTR = /(?<![:@\w])(?:className|class)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*`([^`]*)`\s*\}|\{\s*(?:clsx|cx|classNames|classnames|cn)\(([^)]*)\)\s*\})/g;

function classesOf(body) {
  const out = [];
  for (const m of body.matchAll(CLASS_ATTR)) {
    const raw = m[4] ? [...m[4].matchAll(/['"]([^'"]+)['"]/g)].map((q) => q[1]).join(' ') : (m[1] ?? m[2] ?? m[3]);
    out.push(...raw.replace(/\$\{[^}]*\}/g, ' ').split(/\s+/).filter((c) => /^[A-Za-z_][\w-]*$/.test(c) && !c.endsWith('-')));
  }
  return uniq(out).slice(0, MAX_CLASSES);
}

function statesOf(props, classes, body) {
  const aria = [...body.matchAll(/aria-([a-z]+)/g)].map((m) => m[1]);
  const words = [...props, ...classes, ...aria];
  return Object.fromEntries(Object.entries(STATES).map(([state, re]) => [state, words.some((w) => re.test(w))]));
}

const CSS_SIBLINGS = ['.css', '.module.css', '.scss', '.module.scss', '.less'];
const countLiterals = (source, ext) => scanFile(source, ext).records.filter((r) => !r.declared && (r.category === 'color' || r.value.endsWith('px'))).length;

function literalsOf(def, file, texts, ownsCss) {
  const ext = path.extname(file);
  let n = countLiterals(def.body, ext);
  const base = file.slice(0, -ext.length);
  const css = ownsCss ? CSS_SIBLINGS.map((e) => base + e).find((f) => texts.has(f)) : null;
  if (css) n += countLiterals(texts.get(css), path.extname(css));
  return n;
}

// ---------- groups ----------

const NOISE = new Set(['primary', 'secondary', 'submit', 'custom', 'my', 'base', 'app']);
const SYNONYMS = { btn: 'button', dialog: 'modal' };
const FIELD_NAMES = ['field', 'text,field', 'input,field'];
const TYPO_SIMILARITY = 0.8;

function stemTokens(name) {
  const tokens = (name.match(/[A-Z][a-z0-9]*|[a-z0-9]+/g) ?? [name]).map((t) => t.toLowerCase());
  const kept = tokens.filter((t) => !NOISE.has(t));
  const chosen = kept.length ? kept : tokens;
  return FIELD_NAMES.includes(chosen.join()) ? ['input'] : chosen.map((t) => SYNONYMS[t] ?? t);
}

/** Comparable core of a component name: noise prefixes stripped, Btn/Button, Modal/Dialog, Input/Field/TextField merged. */
export function nameStem(name) {
  return stemTokens(name).join('');
}

function levenshtein(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

function jaccard(a, b) {
  const [sa, sb] = [new Set(a), new Set(b)];
  const shared = [...sa].filter((x) => sb.has(x)).length;
  return sa.size + sb.size === 0 ? 0 : shared / (sa.size + sb.size - shared);
}

function nameSimilarity(a, b) {
  const [sa, sb] = [nameStem(a), nameStem(b)];
  if (sa === sb) return 1;
  const tokens = jaccard(stemTokens(a), stemTokens(b));
  const close = 1 - levenshtein(sa, sb) / Math.max(sa.length, sb.length); // typos and plurals only
  return Math.max(tokens, close >= TYPO_SIMILARITY ? close : 0);
}

// Props every component takes; sharing them says nothing.
const GENERIC_PROPS = new Set(['className', 'class', 'children', 'style', 'id', 'key', 'ref', 'onClick', 'testId', 'data-testid']);
const ownProps = (c) => c.props.filter((p) => !GENERIC_PROPS.has(p));

function pairScore(a, b) {
  const name = nameSimilarity(a.name, b.name);
  const props = ownProps(a).length && ownProps(b).length ? jaccard(ownProps(a), ownProps(b)) : 0;
  return { name, similarity: round(NAME_WEIGHT * name + (1 - NAME_WEIGHT) * props), reason: [name >= SIGNAL_FIRES && 'name', props >= SIGNAL_FIRES && 'props'].filter(Boolean) };
}

/** Near-duplicate groups: pairs scoring >= 0.6 (name 60%, props 40%) with a similar name, joined transitively. */
export function findGroups(components) {
  const list = [...new Map(components.map((c) => [c.name, c])).values()].sort((a, b) => b.usages - a.usages || a.name.localeCompare(b.name));
  const parent = list.map((_, i) => i);
  const root = (i) => (parent[i] === i ? i : (parent[i] = root(parent[i])));
  const edges = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const score = pairScore(list[i], list[j]);
      if (score.name >= SIGNAL_FIRES && score.similarity >= MIN_SIMILARITY) {
        edges.push({ i, ...score });
        parent[root(j)] = root(i);
      }
    }
  }
  return groupsFromEdges(list, edges, root);
}

function groupsFromEdges(list, edges, root) {
  const ids = new Set();
  const byRoot = new Map();
  list.forEach((c, i) => byRoot.set(root(i), [...(byRoot.get(root(i)) ?? []), c]));
  return [...byRoot.entries()].filter(([, members]) => members.length > 1).map(([r, members]) => {
    const mine = edges.filter((e) => root(e.i) === r);
    let id = `group.${nameStem(members[0].name)}`;
    for (let n = 2; ids.has(id); n++) id = `group.${nameStem(members[0].name)}-${n}`;
    ids.add(id);
    return {
      id, members: members.map((m) => m.name), reason: ['name', 'props'].filter((s) => mine.some((e) => e.reason.includes(s))),
      similarity: round(sum(mine, (e) => e.similarity) / mine.length),
    };
  });
}

// ---------- classification helpers (shared with normalise.mjs) ----------

const PAGE_PATH = /(^|\/)(pages?|views?|routes?|screens?)\//i;
const PAGE_NAME = /(Page|Screen|View|Route)$/;
const SHARED_PATH = /(^|\/)(components?|ui|shared|common|design-system)\//i;

/** Used from 2+ top-level folders, and not a page: worth a component review. */
export const isComponentCandidate = (c) => c.location === 'shared' && c.usedIn >= 2 && !PAGE_PATH.test(c.file) && !PAGE_NAME.test(c.name);
/** Sits in a shared folder but only one file uses it: local in practice. */
export const isPageSpecific = (c) => c.location === 'local' && c.usedIn <= 1 && SHARED_PATH.test(c.file);

// ---------- whole directory ----------

const SOURCE_EXT = new Set([...TEMPLATE_EXT, '.ts', '.js']);
const SKIP_SOURCE = /\.(stories|d)\.[tj]sx?$/;

function readTexts(dir) {
  const texts = new Map();
  for (const file of walk(dir)) if (!SKIP_SOURCE.test(file)) texts.set(file, fs.readFileSync(path.join(dir, file), 'utf8'));
  return texts;
}

/** Scan a folder. Returns {components, groups} as in 05-components.json. */
export function analyseComponents(dir) {
  const texts = readTexts(dir);
  const perFile = new Map([...texts].filter(([f]) => SOURCE_EXT.has(path.extname(f))).map(([f, t]) => [f, tagCounts(f, cleanSource(t, path.extname(f)))]));
  const components = [];
  for (const [file, text] of texts) {
    const defs = detectComponents(file, text);
    for (const def of defs) {
      const usage = usageOf(def, file, perFile);
      const classes = classesOf(def.body);
      const ownsCss = defs.length === 1 || def.name === path.basename(file, path.extname(file));
      components.push({
        name: def.name, file: `${file}:${def.line}`, framework: def.framework, exported: def.exported, props: def.props,
        usages: usage.usages, usedIn: usage.files.length, location: usage.location,
        states: statesOf(def.props, classes, def.body), classes, literals: literalsOf(def, file, texts, ownsCss),
      });
    }
  }
  components.sort((a, b) => b.usages - a.usages || a.name.localeCompare(b.name));
  return { components, groups: findGroups(components) };
}

// ---------- report ----------

const list = (items) => (items.length ? items.map((i) => `\`${i}\``).join(', ') : 'none');

function stateSummary(components) {
  const rows = Object.keys(STATES).map((s) => {
    const have = components.filter((c) => c.states[s]);
    return [s, have.length, list(have.slice(0, 5).map((c) => c.name))];
  });
  return table(['State', 'Components', 'Examples'], rows);
}

export function renderComponents({ components, groups }) {
  const byFramework = Object.entries(components.reduce((n, c) => ({ ...n, [c.framework]: (n[c.framework] ?? 0) + 1 }), {})).map(([f, n]) => `${f} ${n}`);
  const candidates = components.filter(isComponentCandidate);
  const rows = components.slice(0, 30).map((c) => [`\`${c.name}\``, c.framework, c.usages, c.usedIn, c.location, c.file]);
  return [
    '# Components',
    `${components.length} components (${byFramework.join(', ') || 'none'}). ${groups.length} near-duplicate groups.`,
    `## Layers\n\nComponent layer. ${candidates.length} components are used from 2 or more top-level folders and are not pages. They are component candidates. Judge each for structure and one job at the gate. Pattern candidates come from \`06-patterns.md\`.\n\n${candidates.slice(0, 15).map((c) => `- \`${c.name}\`: ${c.usages} usages in ${c.usedIn} files (${c.file})`).join('\n') || 'None.'}`,
    `## Groups\n\nNear-duplicates to merge. Similarity is name 60% plus props 40%.\n\n${groups.length ? table(['Group', 'Members', 'Signals', 'Similarity'], groups.map((g) => [g.id, list(g.members), g.reason.join(', '), g.similarity])) : 'None.'}`,
    `## States\n\nComponents that expose each state, by prop, class or aria attribute.\n\n${stateSummary(components)}`,
    `## Most used\n\n${table(['Name', 'Framework', 'Usages', 'Files', 'Location', 'Defined at'], rows)}`,
  ].join('\n\n') + '\n';
}

// ---------- CLI ----------

export function main(argv, io = console) {
  return run('components', USAGE_TEXT, io, () => {
    const { values: opts, positionals } = parseArgs({ args: argv, allowPositionals: true, options: { out: { type: 'string', default: '.bauhaus/analysis' } } });
    if (positionals.length !== 1) throw new UsageError('expected one folder');
    const result = analyseComponents(requireDir(positionals[0]));
    writeArtifact(opts.out, '05-components.json', result);
    writeArtifact(opts.out, '05-components.md', renderComponents(result));
    io.log(`${result.components.length} components, ${result.groups.length} groups; wrote 05-components.json and .md to ${opts.out}`);
    return 0;
  });
}

runIfMain(import.meta.url, main);
