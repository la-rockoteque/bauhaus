import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkStructure, classify, main, placeComponents, scaffold } from '../scripts/structure.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = path.join(HERE, 'fixtures', 'structure');
const KIT = path.join(HERE, '..', 'kit', 'library');
const quiet = { log() {}, error() {} };
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'bauhaus-structure-'));
const capture = () => {
  const out = [];
  return { out, io: { log: (m) => out.push(m), error: (m) => out.push(m) } };
};

test('check: a good library has no findings', () => {
  assert.deepEqual(checkStructure(path.join(FIXTURE, 'good')), []);
});

test('check: the bad library yields every finding id', () => {
  const findings = checkStructure(path.join(FIXTURE, 'bad'));
  const ids = new Set(findings.map((f) => f.id));
  for (const id of [
    'misfile.folder-by-file-type', 'structure.root', 'structure.family', 'structure.slice-name',
    'slice.story', 'slice.page', 'slice.showcase', 'slice.rules', 'slice.test', 'slice.tokens',
    'misfile.story-far-from-component', 'misfile.library-imports-app', 'structure.direction', 'pattern.no-styles',
  ]) assert.ok(ids.has(id), `missing ${id}`);
  for (const f of findings) {
    assert.ok(f.path && f.message && f.fix && ['HIGH', 'MEDIUM', 'LOW'].includes(f.severity), JSON.stringify(f));
  }
});

test('check: findings are specific', () => {
  const findings = checkStructure(path.join(FIXTURE, 'bad'));
  const at = (id) => findings.filter((f) => f.id === id).map((f) => f.path);
  assert.deepEqual(at('misfile.folder-by-file-type'), ['hooks']);
  assert.deepEqual(at('structure.root').sort(), ['hooks', 'legacy']);
  assert.deepEqual(at('structure.family'), ['components/lonely']);
  assert.deepEqual(at('slice.tokens'), ['foundations/color']);
  assert.equal(at('structure.direction').length, 3);
  assert.equal(at('misfile.library-imports-app').length, 2, 'i18n library and path out of the package');
  assert.deepEqual(at('pattern.no-styles'), ['patterns/card/card.css']);
  assert.deepEqual(at('misfile.story-far-from-component'), ['components/clickables/Chip/other.stories.tsx']);
  assert.equal(findings.find((f) => f.id === 'slice.story').severity, 'HIGH');
  const showcase = at('slice.showcase');
  assert.ok(showcase.length > 0 && !showcase.includes('components/clickables/button/button.stories.tsx'), 'a story that renders DocPage is not flagged');
  assert.ok(findings.filter((f) => f.id === 'slice.showcase').every((f) => f.severity === 'MEDIUM'));
});

test('check: findings sort by severity then path', () => {
  const findings = checkStructure(path.join(FIXTURE, 'bad'));
  const rank = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  const sorted = [...findings].sort((a, b) => rank[a.severity] - rank[b.severity] || a.path.localeCompare(b.path));
  assert.deepEqual(findings, sorted);
});

test('check: skips node_modules, dist and .storybook', () => {
  const dir = tmp();
  for (const p of ['node_modules/hooks/a.ts', 'dist/utils/a.ts', '.storybook/helpers/a.ts']) {
    fs.mkdirSync(path.dirname(path.join(dir, p)), { recursive: true });
    fs.writeFileSync(path.join(dir, p), '');
  }
  assert.deepEqual(checkStructure(dir), []);
});

test('check: slice.showcase needs a DocPage import from fixtures/doc-page/doc-page and a <DocPage element', () => {
  const at = (story) => checkStructure(tmpLibrary(SLICE('primitives/box', 'box', { 'box.stories.tsx': story }))).filter((f) => f.id === 'slice.showcase').map((f) => f.path);
  assert.deepEqual(at(''), ['primitives/box/box.stories.tsx']);
  assert.deepEqual(at("import { DocPage } from './somewhere';\nexport const A = () => <DocPage />;"), ['primitives/box/box.stories.tsx'], 'wrong import path');
  assert.deepEqual(at("import { DocPage } from '../../fixtures/doc-page/doc-page';"), ['primitives/box/box.stories.tsx'], 'imported but never rendered');
  assert.deepEqual(at(DOC_STORY), []);
});

test('check: a story may import the page builder from fixtures', () => {
  const dir = tmpLibrary(SLICE('foundations/color', 'color', { 'color.tokens.json': '{}' }));
  assert.deepEqual(checkStructure(dir).filter((f) => f.id === 'structure.direction'), []);
});

test('check: storybook.literal flags a raw colour or size in .storybook, not comments or generated files', () => {
  const dir = tmpLibrary({
    '.storybook/doc-page/page.css': '/* 4px in a comment */\n.a { color: var(--ds-text-default); padding: 0px; }\n.b { color: #fff; margin: 12px; }',
    '.storybook/doc-page/page.tsx': "// #000 in a comment\nexport const x = { color: 'var(--ds-text-default)', width: '2rem' };",
    '.storybook/clean.ts': "export const ok = 'var(--ds-space-4)'; // 8px is fine in a comment",
    '.storybook/tokens.generated.ts': "export const t = { a: '#ffffff', b: '16px' };",
  });
  const hits = checkStructure(dir).filter((f) => f.id === 'storybook.literal');
  assert.deepEqual(hits.map((f) => f.path).sort(), ['.storybook/doc-page/page.css', '.storybook/doc-page/page.tsx']);
  assert.ok(hits.every((f) => f.severity === 'MEDIUM'));
  assert.match(hits.find((f) => f.path.endsWith('.css')).message, /#fff.*12px|12px.*#fff/);
});

test('check: CLI exit codes and json', () => {
  const good = capture();
  assert.equal(main(['check', path.join(FIXTURE, 'good')], good.io), 0);
  const bad = capture();
  assert.equal(main(['check', path.join(FIXTURE, 'bad'), '--json'], bad.io), 1);
  assert.ok(JSON.parse(bad.out.join('\n')).length > 5);
  assert.equal(main(['check'], quiet), 2);
  assert.equal(main(['check', '/no/such/dir'], quiet), 2);
  assert.equal(main(['bogus'], quiet), 2);
});

test('check: the kit library template has no findings', () => {
  assert.deepEqual(checkStructure(KIT), []);
});

test('classify: keywords, head noun first', () => {
  const fam = (name, props = []) => classify({ name, props }).family;
  assert.equal(fam('Btn'), 'clickables');
  assert.equal(fam('IconButton'), 'clickables');
  assert.equal(fam('MenuItem'), 'clickables');
  assert.equal(fam('Modal'), 'overlays');
  assert.equal(fam('ConfirmDialog'), 'overlays');
  assert.equal(fam('Box'), 'primitives');
  assert.equal(fam('SearchInput'), 'fields');
  assert.equal(fam('DataTable'), 'data-structures');
  assert.equal(fam('Toast'), 'feedback');
  assert.equal(fam('Tabs'), 'navigation');
  assert.equal(fam('Frobnicator'), null);
  assert.deepEqual(classify({ name: 'Frobnicator', props: [] }), { family: null, confidence: 0, reason: 'no keyword' });
});

test('classify: props hint when the name says nothing', () => {
  const hit = classify({ name: 'Frobnicator', props: ['options', 'value', 'onChange'] });
  assert.equal(hit.family, 'fields');
  assert.ok(hit.confidence > 0 && hit.confidence < 0.5);
});

test('place: shared components and group keepers only', () => {
  const analysis = {
    components: [
      { name: 'Btn', file: 'src/ui/Btn.tsx:3', framework: 'react', props: [], usages: 9, usedIn: 4, location: 'shared' },
      { name: 'Modal', file: 'src/ui/Modal.vue:1', framework: 'vue', props: [], usages: 5, usedIn: 3, location: 'shared' },
      { name: 'Box', file: 'src/ui/Box.tsx:1', framework: 'react', props: [], usages: 5, usedIn: 3, location: 'shared' },
      { name: 'Widget', file: 'src/ui/Widget.tsx:1', framework: 'react', props: [], usages: 2, usedIn: 2, location: 'shared' },
      { name: 'TinyChip', file: 'src/features/a/TinyChip.tsx:1', framework: 'react', props: [], usages: 1, usedIn: 1, location: 'local' },
      { name: 'KeepTag', file: 'src/features/a/KeepTag.tsx:1', framework: 'react', props: [], usages: 3, usedIn: 1, location: 'local' },
      { name: 'DropTag', file: 'src/features/b/DropTag.tsx:1', framework: 'react', props: [], usages: 1, usedIn: 1, location: 'local' },
    ],
    groups: [{ id: 'g1', members: ['KeepTag', 'DropTag'], reason: ['name'], similarity: 0.9 }],
  };
  const { placements } = placeComponents(analysis);
  const by = Object.fromEntries(placements.map((p) => [p.name, p]));
  assert.deepEqual(Object.keys(by).sort(), ['Box', 'Btn', 'KeepTag', 'Modal', 'Widget']);
  assert.equal(by.Btn.to, 'components/clickables/btn/btn.tsx');
  assert.equal(by.Btn.from, 'src/ui/Btn.tsx');
  assert.equal(by.Btn.family, 'clickables');
  assert.equal(by.Modal.to, 'components/overlays/modal/modal.vue');
  assert.equal(by.Box.to, 'primitives/box/box.tsx');
  assert.equal(by.KeepTag.family, 'feedback');
  assert.deepEqual([by.Widget.to, by.Widget.family, by.Widget.confidence, by.Widget.reason], [null, null, 0, 'no keyword']);
});

test('place: CLI writes json and prints a table grouped by family', () => {
  const dir = tmp();
  const input = path.join(dir, '05-components.json');
  fs.writeFileSync(input, JSON.stringify({ components: [{ name: 'Btn', file: 'a/Btn.tsx:1', framework: 'react', props: [], usages: 3, usedIn: 2, location: 'shared' }], groups: [] }));
  const { out, io } = capture();
  assert.equal(main(['place', '--components', input, '--out', path.join(dir, 'place.json')], io), 0);
  assert.ok(out.join('\n').includes('clickables'));
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'place.json'), 'utf8')).placements[0].to, 'components/clickables/btn/btn.tsx');
  assert.equal(main(['place'], quiet), 2);
});

test('scaffold: copies the template, renames package and prefix', () => {
  const dir = path.join(tmp(), 'lib');
  assert.equal(main(['scaffold', dir, '--name', '@nx/ui', '--prefix', 'nx'], quiet), 0);
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  assert.equal(pkg.name, '@nx/ui');
  const css = fs.readFileSync(path.join(dir, 'components/clickables/button/button.css'), 'utf8');
  assert.match(css, /--nx-/);
  assert.doesNotMatch(css, /--ds-/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'bauhaus.config.json'), 'utf8')).prefix, 'nx');
  assert.ok(!fs.existsSync(path.join(dir, 'node_modules')));
  assert.deepEqual(checkStructure(dir), []);
});

test('scaffold: keeps the default prefix, refuses a non-empty target, validates input', () => {
  const dir = tmp();
  const target = path.join(dir, 'lib');
  assert.equal(scaffold(target, { name: '@nx/ui' }).files > 10, true);
  assert.match(fs.readFileSync(path.join(target, 'components/clickables/button/button.css'), 'utf8'), /--ds-/);
  assert.equal(main(['scaffold', target, '--name', '@nx/ui'], quiet), 2, 'non-empty');
  const empty = path.join(dir, 'empty');
  fs.mkdirSync(empty);
  assert.equal(main(['scaffold', empty, '--name', '@nx/ui'], quiet), 0, 'an empty folder is fine');
  assert.equal(main(['scaffold', path.join(dir, 'x')], quiet), 2, 'no name');
  assert.equal(main(['scaffold', path.join(dir, 'y'), '--name', 'a', '--prefix', 'Bad!'], quiet), 2, 'bad prefix');
});

test('place: a named glyph goes to the iconography foundation, the Icon component stays a primitive', () => {
  const comp = (name) => ({ name, file: `src/ui/${name}.tsx:1`, location: 'shared', usages: 5, usedIn: 3, props: [], framework: 'react' });
  const { placements } = placeComponents({ components: [comp('GearIcon'), comp('Icon'), comp('IconButton')], groups: [] });
  const to = Object.fromEntries(placements.map((p) => [p.name, p.to]));
  assert.equal(to.GearIcon, 'foundations/iconography/gear-icon.tsx');
  assert.equal(to.Icon, 'primitives/icon/icon.tsx');
  assert.equal(to.IconButton, 'components/clickables/icon-button/icon-button.tsx');
});

// ---------- colour foundation ----------

function tmpLibrary(files) {
  const dir = tmp();
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text);
  }
  return dir;
}
const DOC_STORY = "import { DocPage } from '../../fixtures/doc-page/doc-page';\nexport const Showcase = { render: () => <DocPage /> };\n";
const SLICE = (dir, name, extra = {}) => Object.fromEntries(Object.entries({
  [`${name}.stories.tsx`]: DOC_STORY, [`${name}.mdx`]: '', [`${name}.rules.ts`]: '', [`${name}.test.tsx`]: '', [`${name}.tsx`]: '', ...extra,
}).map(([f, t]) => [`${dir}/${f}`, t]));

test('check: a foundation slice accepts any *.tokens.json (color has palette and colors)', () => {
  const dir = tmpLibrary(SLICE('foundations/color', 'color', { 'palette.tokens.json': '{}', 'colors.tokens.json': '{}' }));
  assert.deepEqual(checkStructure(dir).filter((f) => f.id === 'slice.tokens'), []);
  const none = tmpLibrary(SLICE('foundations/color', 'color'));
  assert.deepEqual(checkStructure(none).filter((f) => f.id === 'slice.tokens').map((f) => f.path), ['foundations/color']);
});

test('check: misfile.palette-at-call-site flags palette and colors variables in components, primitives and patterns', () => {
  const dir = tmpLibrary({
    ...SLICE('primitives/box', 'box', { 'box.css': '.ds-box { color: var(--ds-palette-gray-900); }' }),
    ...SLICE('components/clickables/chip', 'chip', { 'chip.css': '.ds-chip { background: var(--ds-colors-primary-600, red); }' }),
    ...SLICE('components/clickables/pill', 'pill', { 'pill.tsx': "export const Pill = () => <i style={{ color: 'var(--ds-palette-teal-500)' }} />;" }),
    ...SLICE('components/clickables/tag', 'tag', { 'tag.css': '.ds-tag { color: var(--ds-text-default); background: var(--ds-action-primary); }' }),
    ...SLICE('foundations/color', 'color', { 'color.stories.tsx': "const a = 'var(--ds-palette-gray-100)';", 'color.tokens.json': '{}' }),
    ...SLICE('patterns/empty', 'empty', { 'empty.css': '.ds-e { color: var(--ds-palette-gray-100); }' }),
  });
  const hits = checkStructure(dir).filter((f) => f.id === 'misfile.palette-at-call-site');
  assert.deepEqual(hits.map((f) => f.path).sort(), ['components/clickables/chip/chip.css', 'components/clickables/pill/pill.tsx', 'patterns/empty/empty.css', 'primitives/box/box.css']);
  assert.ok(hits.every((f) => f.severity === 'HIGH' && f.fix.includes('role')));
});

test('check: the palette-at-call-site prefix comes from bauhaus.config.json', () => {
  const dir = tmpLibrary({
    'bauhaus.config.json': JSON.stringify({ prefix: 'acme' }),
    ...SLICE('primitives/box', 'box', { 'box.css': '.a { color: var(--ds-palette-gray-900); background: var(--acme-colors-primary-100); }' }),
  });
  const hits = checkStructure(dir).filter((f) => f.id === 'misfile.palette-at-call-site');
  assert.equal(hits.length, 1);
  assert.match(hits[0].message, /--acme-colors-/);
});

test('check: misfile.typeface-at-call-site flags typeface and font role variables, not the font scales', () => {
  const dir = tmpLibrary({
    ...SLICE('primitives/box', 'box', { 'box.css': '.ds-box { font-family: var(--ds-typeface-inter); }' }),
    ...SLICE('components/clickables/chip', 'chip', { 'chip.css': '.ds-chip { font-family: var( --ds-font-sans, sans-serif); }' }),
    ...SLICE('components/clickables/pill', 'pill', { 'pill.tsx': "export const Pill = () => <i style={{ fontFamily: 'var(--ds-font-mono)' }} />;" }),
    ...SLICE('components/clickables/tag', 'tag', { 'tag.css': '.ds-tag { font-family: var(--ds-text-label-family); font-size: var(--ds-font-size-sm); font-weight: var(--ds-font-weight-medium); line-height: var(--ds-font-line-height-tight); }' }),
    ...SLICE('foundations/typography', 'typography', { 'typography.stories.tsx': "const a = 'var(--ds-typeface-inter)';", 'typography.tokens.json': '{}' }),
    ...SLICE('patterns/empty', 'empty', { 'empty.css': '.ds-e { font-family: var(--ds-font-serif); }' }),
  });
  const hits = checkStructure(dir).filter((f) => f.id === 'misfile.typeface-at-call-site');
  assert.deepEqual(hits.map((f) => f.path).sort(), ['components/clickables/chip/chip.css', 'components/clickables/pill/pill.tsx', 'patterns/empty/empty.css', 'primitives/box/box.css']);
  assert.ok(hits.every((f) => f.severity === 'HIGH' && f.fix.includes('text style')));
});

test('check: the typeface-at-call-site prefix comes from bauhaus.config.json', () => {
  const dir = tmpLibrary({
    'bauhaus.config.json': JSON.stringify({ prefix: 'acme' }),
    ...SLICE('primitives/box', 'box', { 'box.css': '.a { font-family: var(--ds-typeface-inter); font: var(--acme-font-serif); }' }),
  });
  const hits = checkStructure(dir).filter((f) => f.id === 'misfile.typeface-at-call-site');
  assert.equal(hits.length, 1);
  assert.match(hits[0].message, /--acme-font-/);
});

test('check: themes are one showcase and one guide at themes/, each theme folder holds only its tokens', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bauhaus-themes-'));
  const write = (rel, text = '') => { fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); fs.writeFileSync(path.join(root, rel), text); };
  write('themes/light/light.tokens.json', '{}');
  write('themes/dark/dark.tokens.json', '{}');
  const ids = (list) => list.map((f) => `${f.id} ${f.path}`);
  const missing = ids(checkStructure(root).findings ?? checkStructure(root));
  assert.ok(missing.some((x) => x.startsWith('slice.story themes')), 'the theme set needs a showcase');
  assert.ok(missing.some((x) => x.startsWith('slice.page themes')), 'the theme set needs a guide');
  assert.ok(!missing.some((x) => /themes\/(light|dark)/.test(x)), `theme folders need only tokens: ${missing.join(' | ')}`);
  write('themes/themes.stories.tsx', "import { DocPage } from '../fixtures/doc-page/doc-page';\nexport const Showcase = { render: () => <DocPage /> };\n");
  write('themes/themes.mdx', '# Themes');
  const after = ids(checkStructure(root).findings ?? checkStructure(root)).filter((x) => x.includes('themes'));
  assert.deepEqual(after, []);
});

// ---------- fixtures: Storybook-only blocks ----------

const FX = (name, extra = {}) => Object.fromEntries(Object.entries({ [`${name}.tsx`]: 'export const A = () => null;', [`${name}.stories.tsx`]: '', ...extra }).map(([f, t]) => [`fixtures/${name}/${f}`, t]));

test('check: fixtures is a root; a fixture slice needs a story, not a guide or a rulebook', () => {
  const ids = (dir) => checkStructure(dir).map((f) => `${f.id} ${f.path}`);
  assert.deepEqual(ids(tmpLibrary(FX('anatomy'))), []);
  assert.deepEqual(ids(tmpLibrary({ 'fixtures/anatomy/anatomy.tsx': '' })), ['slice.story fixtures/anatomy']);
});

test('check: a *.fixture.tsx beside a component may import fixtures; shipped code may not import it', () => {
  const exposed = (files) => checkStructure(tmpLibrary(files)).filter((f) => f.id === 'fixture.exposed').map((f) => f.path);
  const view = { 'components/button/button.isometric.fixture.tsx': "import { IsoStage } from '../../fixtures/isometric/isometric';" };
  assert.deepEqual(exposed({ ...FX('isometric'), ...view }), []);
  const shipped = { 'components/button/button.tsx': "import { ButtonIsometric } from './button.isometric.fixture';" };
  assert.deepEqual(exposed({ ...FX('isometric'), ...view, ...shipped }), ['components/button/button.tsx']);
});

test('check: a fixture with logic needs a test', () => {
  const logic = tmpLibrary(FX('series', { 'series.tsx': 'export function seriesColor(n) { return n; }' }));
  assert.deepEqual(checkStructure(logic).map((f) => `${f.id} ${f.path}`), ['slice.test fixtures/series']);
  const hook = tmpLibrary(FX('anatomy', { 'anatomy.tsx': 'export const A = () => { useEffect(() => {}); return null; };' }));
  assert.deepEqual(checkStructure(hook).map((f) => f.id), ['slice.test']);
  const tested = tmpLibrary(FX('series', { 'series.tsx': 'export function seriesColor(n) { return n; }', 'series.test.tsx': '' }));
  assert.deepEqual(checkStructure(tested), []);
});

test('check: fixture.exposed flags the entry or a library file that imports a fixture, not stories, tests or fixtures', () => {
  const dir = tmpLibrary({
    ...FX('doc-page'),
    ...FX('anatomy', { 'anatomy.tsx': "import { DocPage } from '../doc-page/doc-page';\nimport { Button } from '../../components/clickables/button/button';" }),
    ...SLICE('components/clickables/button', 'button', { 'button.tsx': "import { DocPage } from '../../../fixtures/doc-page/doc-page';" }),
    ...SLICE('components/clickables/link', 'link', { 'link.test.tsx': "import { DocPage } from '../../../fixtures/doc-page/doc-page';" }),
    'index.ts': "export { DocPage } from './fixtures/doc-page/doc-page';",
  });
  const hits = checkStructure(dir).filter((f) => f.id === 'fixture.exposed');
  assert.deepEqual(hits.map((f) => f.path).sort(), ['components/clickables/button/button.tsx', 'index.ts']);
  assert.ok(hits.every((f) => f.severity === 'HIGH'));
});

test('check: a fixture may import the library slices but not the public entry', () => {
  const dir = tmpLibrary({
    ...FX('anatomy', { 'anatomy.tsx': "import { Button } from '../../components/clickables/button/button';\nimport { Tooltip } from '../../index';" }),
  });
  const hits = checkStructure(dir).filter((f) => f.id === 'structure.direction');
  assert.equal(hits.length, 1);
  assert.match(hits[0].message, /public entry/);
});

test('check: storybook.literal also reads fixtures', () => {
  const dir = tmpLibrary({ ...FX('anatomy', { 'anatomy.css': '.a { margin: 12px; color: var(--ds-text-default); }' }) });
  assert.deepEqual(checkStructure(dir).filter((f) => f.id === 'storybook.literal').map((f) => f.path), ['fixtures/anatomy/anatomy.css']);
});
