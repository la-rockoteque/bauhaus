import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildManifest, main, renderAgents, spliceBlock } from '../scripts/manifest.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = path.join(HERE, 'fixtures', 'manifest');
const KIT = path.join(HERE, '..', 'kit', 'library');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'bauhaus-manifest-'));
const capture = () => {
  const out = [];
  return { out, io: { log: (m) => out.push(m), error: (m) => out.push(m) } };
};
const copyFixture = () => {
  const dir = tmp();
  fs.cpSync(FIXTURE, dir, { recursive: true });
  return dir;
};

test('build: header and slices', () => {
  const m = buildManifest(FIXTURE);
  assert.equal(m.version, 1);
  assert.equal(m.name, 'Acme UI');
  assert.equal(m.prefix, 'ac');
  assert.equal(m.import, '@acme/ui');
  assert.deepEqual(m.slices.map((s) => `${s.layer}:${s.name}`), [
    'primitive:box', 'component:button', 'pattern:empty-results', 'foundation:spacing',
  ]);
});

test('build: a component slice', () => {
  const b = buildManifest(FIXTURE).slices.find((s) => s.name === 'button');
  assert.equal(b.export, 'Button');
  assert.equal(b.family, 'clickables');
  assert.equal(b.path, 'components/clickables/button');
  assert.equal(b.summary, 'A button makes something happen. If it goes to a page, use a link.');
  assert.deepEqual(b.variants, ['primary', 'secondary']);
  assert.deepEqual(b.tokens, ['--ac-color-action', '--ac-color-text']);
  assert.deepEqual(b.composes, ['box']);
  assert.deepEqual(b.rules, [
    { id: 'button.native-element', severity: 'HIGH', verify: 'auto' },
    { id: 'button.one-primary', severity: 'MEDIUM', verify: 'review' },
  ]);
  assert.deepEqual(b.props.map((p) => p.name), ['variant', 'loading', 'onClick']);
  assert.deepEqual(b.props[0], { name: 'variant', type: 'ButtonVariant', optional: true, default: "'primary'", doc: 'One primary per view region.', values: ['primary', 'secondary'] });
  assert.equal(b.props[1].doc, 'The action is running; presses are ignored.');
  assert.equal(b.props[2].type, '(event: MouseEvent) => void');
});

test('build: a union of numbers stays a type, a pattern composes by its stories', () => {
  const m = buildManifest(FIXTURE);
  const box = m.slices.find((s) => s.name === 'box');
  assert.equal(box.props[0].type, '0 | 2 | 4');
  assert.equal(box.props[0].default, '2');
  assert.deepEqual(box.variants, []);
  const p = m.slices.find((s) => s.name === 'empty-results');
  assert.equal(p.export, null);
  assert.deepEqual(p.composes, ['box', 'button']);
  assert.equal(p.family, null);
});

test('build: deterministic', () => {
  assert.equal(JSON.stringify(buildManifest(FIXTURE)), JSON.stringify(buildManifest(FIXTURE)));
});

test('build and check: a stale manifest exits 1', () => {
  const dir = copyFixture();
  const { io } = capture();
  assert.equal(main(['check', dir], io), 1, 'missing manifest is stale');
  assert.equal(main(['build', dir], io), 0);
  assert.ok(fs.existsSync(path.join(dir, 'bauhaus-manifest.json')));
  assert.equal(main(['check', dir], io), 0);
  fs.appendFileSync(path.join(dir, 'primitives/box/box.css'), '.ac-box { color: var(--ac-color-new); }\n');
  assert.equal(main(['check', dir], io), 1);
});

test('build: --out writes elsewhere', () => {
  const out = path.join(tmp(), 'm.json');
  assert.equal(main(['build', FIXTURE, '--out', out], capture().io), 0);
  assert.equal(JSON.parse(fs.readFileSync(out, 'utf8')).import, '@acme/ui');
});

test('agents: short index with the lookup rule and a table', () => {
  const text = renderAgents(buildManifest(FIXTURE));
  assert.match(text, /^<!-- bauhaus:start -->/);
  assert.match(text, /<!-- bauhaus:end -->\n$/);
  assert.match(text, /@acme\/ui/);
  assert.match(text, /bauhaus-manifest\.json/);
  assert.match(text, /never re-implement/i);
  assert.match(text, /--ac-\*/);
  assert.match(text, /\| `Button` \| component \| A button makes something happen\. \| primary, secondary \|/);
  assert.match(text, /empty-results/);
  assert.doesNotMatch(text, /SPACE_STEPS/, 'a foundation export is not a component row');
  assert.ok(text.split('\n').length < 40);
});

test('agents: replaces only the block, idempotent, keeps the rest', () => {
  const dir = copyFixture();
  const file = path.join(dir, 'AGENTS.md');
  fs.writeFileSync(file, '# Mine\n\nbefore\n');
  const { io } = capture();
  assert.equal(main(['agents', dir, '--out', file], io), 0);
  const once = fs.readFileSync(file, 'utf8');
  assert.ok(once.startsWith('# Mine\n\nbefore\n'));
  assert.equal(main(['agents', dir, '--out', file], io), 0);
  assert.equal(fs.readFileSync(file, 'utf8'), once, 'second run changes nothing');
  fs.writeFileSync(file, `${once.replace('before', 'edited before')}\nafter\n`);
  assert.equal(main(['agents', dir, '--out', file], io), 0);
  const text = fs.readFileSync(file, 'utf8');
  assert.ok(text.includes('edited before') && text.endsWith('\nafter\n'));
  assert.equal(text.split('<!-- bauhaus:start -->').length, 2);
});

test('spliceBlock: creates, appends, replaces', () => {
  const block = '<!-- bauhaus:start -->\nx\n<!-- bauhaus:end -->\n';
  assert.equal(spliceBlock('', block), block);
  assert.equal(spliceBlock('a\n', block), `a\n\n${block}`);
  assert.equal(spliceBlock(`a\n${block}b\n`, block.replace('x', 'y')), `a\n${block.replace('x', 'y')}b\n`);
});

test('usage errors exit 2', () => {
  const { io } = capture();
  assert.equal(main([], io), 2);
  assert.equal(main(['build', '/no/such/dir'], io), 2);
});

test('kit/library: the committed manifest is current', () => {
  assert.equal(main(['check', KIT], capture().io), 0, 'run: node scripts/manifest.mjs build kit/library');
});

test('kit/library: every exported component is in the manifest', () => {
  const slices = buildManifest(KIT).slices.filter((s) => s.export);
  assert.ok(slices.length > 0);
  const index = fs.readFileSync(path.join(KIT, 'index.ts'), 'utf8');
  for (const s of slices) assert.ok(index.includes(`export { ${s.export}`) || new RegExp(`export \\{[^}]*\\b${s.export}\\b`).test(index), s.export);
});

// ---------- review fixes ----------

const withSlice = (source, exported = 'Tag') => {
  const dir = copyFixture();
  const slice = path.join(dir, 'primitives/tag');
  fs.mkdirSync(slice, { recursive: true });
  fs.writeFileSync(path.join(slice, 'tag.tsx'), source);
  fs.writeFileSync(path.join(slice, 'tag.rules.ts'), '');
  fs.appendFileSync(path.join(dir, 'index.ts'), `\nexport { ${exported} } from './primitives/tag/tag';\n`);
  return buildManifest(dir).slices.find((s) => s.name === 'tag');
};

test('props: multi-line unions keep values and a clean type', () => {
  const tag = withSlice(`type Tone =
  | 'a'
  | 'b';
export interface TagProps {
  size?:
    | 'sm'
    | 'lg';
  tone?: Tone;
  variant?:
    | 'x'
    | 'y';
}
export function Tag(props: TagProps) { return null; }
`);
  const by = Object.fromEntries(tag.props.map((p) => [p.name, p]));
  assert.deepEqual(by.size.values, ['sm', 'lg']);
  assert.equal(by.size.type, "'sm' | 'lg'");
  assert.deepEqual(by.tone.values, ['a', 'b']);
  assert.deepEqual(tag.variants, ['x', 'y']);
});

test('props: members without a trailing semicolon split on newlines', () => {
  const tag = withSlice(`export interface TagProps {
  /** Go; now. */
  onGo?: (a: string, b: number) => void
  label: string
  mode:
    | 'on'
    | 'off'
  render: (x: {
    a: string
    b: number
  }) => void
}
export function Tag(props: TagProps) { return null; }
`);
  assert.deepEqual(tag.props.map((p) => p.name), ['onGo', 'label', 'mode', 'render']);
  assert.equal(tag.props[0].type, '(a: string, b: number) => void');
  assert.equal(tag.props[0].doc, 'Go; now.');
  assert.deepEqual(tag.props[2].values, ['on', 'off']);
  assert.equal(tag.props[3].type, '(x: { a: string b: number }) => void');
});

test('exports: `X as Y` records Y', () => {
  const tag = withSlice('export interface ChipProps { label: string }\nexport function Chip(p: ChipProps) { return null; }\n', 'Tag as Chip');
  assert.equal(tag.export, 'Chip');
  assert.deepEqual(tag.props.map((p) => p.name), ['label']);
});

test('config without a name is a usage error', () => {
  const dir = copyFixture();
  fs.writeFileSync(path.join(dir, 'bauhaus.config.json'), '{"prefix":"ac"}');
  assert.equal(main(['build', dir], capture().io), 2);
});

test('spliceBlock: a broken marker pair throws naming the file', () => {
  const block = '<!-- bauhaus:start -->\nx\n<!-- bauhaus:end -->\n';
  assert.throws(() => spliceBlock('a\n<!-- bauhaus:start -->\n', block, 'F.md'), /F\.md/);
  assert.throws(() => spliceBlock('a\n<!-- bauhaus:end -->\n', block, 'F.md'), /F\.md/);
  assert.throws(() => spliceBlock('<!-- bauhaus:end -->\n<!-- bauhaus:start -->\n', block, 'F.md'), /F\.md/);
  const dir = copyFixture();
  const file = path.join(dir, 'AGENTS.md');
  fs.writeFileSync(file, '<!-- bauhaus:start -->\n');
  assert.equal(main(['agents', dir, '--out', file], capture().io), 2);
});

test('agents: --out into a missing directory creates it', () => {
  const file = path.join(tmp(), 'deep/er/AGENTS.md');
  assert.equal(main(['agents', FIXTURE, '--out', file], capture().io), 0);
  assert.ok(fs.existsSync(file));
});

test('check: also compares the AGENTS.md block', () => {
  const dir = copyFixture();
  const { io } = capture();
  main(['build', dir], io);
  assert.equal(main(['check', dir], io), 0, 'no AGENTS.md: manifest only');
  const file = path.join(dir, 'AGENTS.md');
  assert.equal(main(['check', dir, '--agents', file], io), 1, 'explicit missing file is stale');
  main(['agents', dir], io);
  assert.equal(main(['check', dir], io), 0);
  assert.equal(main(['check', dir, '--agents', file], io), 0);
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('Reuse an existing', 'Maybe reuse an existing'));
  assert.equal(main(['check', dir], io), 1, 'default AGENTS.md is checked');
});
