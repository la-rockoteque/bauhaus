import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTokens } from '../scripts/lib/dtcg.mjs';
import { deltaE76 } from '../scripts/lib/color.mjs';
import { buildPrimitives, buildSemantic, main, planNormalisation, renderPlan } from '../scripts/normalise.mjs';
import { main as analyseMain } from '../scripts/analyse.mjs';
import { main as extractMain } from '../scripts/extract.mjs';
import { main as foundationsMain } from '../scripts/foundations.mjs';
import { main as componentsMain } from '../scripts/components.mjs';
import { main as patternsMain } from '../scripts/patterns.mjs';

const FIXTURE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'analyse');
const quiet = { log() {}, error() {} };
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'bauhaus-norm-'));
const flatten = (tree, prefix = []) => Object.entries(tree).flatMap(([k, v]) => (k.startsWith('$') ? [] : '$value' in v ? [[[...prefix, k].join('.'), v]] : flatten(v, [...prefix, k])));
const names = (tree) => flatten(tree).map(([n]) => n);

const FOUND = {
  spacing: { base: 4, fit: 0.9, steps: [4, 8, 12, 16], outliers: [] },
  fontSize: { base: 16, ratio: 1.25, fit: 0.8, steps: [12, 16, 20], outliers: [] },
  color: { ramps: [{ hue: 'blue', steps: ['#93c5fd', '#2563eb'] }], neutrals: ['#ffffff', '#cccccc', '#111111'], outliers: [] },
  radius: { steps: [4, 8, 999], outliers: [] },
  duration: { steps: [150, 200, 300], outliers: [] },
  easing: { values: ['ease-out'], outliers: [] },
  shadow: { levels: 1, values: ['0 1px 2px rgba(0,0,0,.2)'] },
  zIndex: { steps: [10, 100], outliers: [] },
  breakpoint: { steps: [640, 1024], outliers: [] },
  fontFamily: { values: ['"Inter", sans-serif'] },
};

test('deltaE76 is 0 for equal colours and grows with distance', () => {
  assert.equal(deltaE76('#336699', '#336699'), 0);
  assert.ok(deltaE76('#000000', '#ffffff') > 99);
  assert.ok(deltaE76('#1f2937', '#1e2836') < 2);
});

test('buildPrimitives names steps', () => {
  const p = buildPrimitives(FOUND);
  const all = names(p);
  for (const n of ['space.1', 'space.2', 'space.3', 'space.4', 'color.blue.100', 'color.blue.200', 'color.gray.100', 'color.gray.300',
    'radius.sm', 'radius.md', 'radius.full', 'duration.fast', 'duration.base', 'duration.slow', 'z.10', 'breakpoint.sm']) assert.ok(all.includes(n), n);
  assert.equal(p.space['3'].$value, '12px');
  assert.equal(p.radius.full.$value, '9999px');
  assert.equal(p.color.gray['100'].$value, '#ffffff');
  assert.ok(all.some((n) => n.startsWith('font.size.')));
  assert.ok(all.some((n) => n.startsWith('shadow.')));
  assert.ok(all.some((n) => n.startsWith('easing.')));
  assert.ok(all.some((n) => n.startsWith('font.family.')));
});

test('buildSemantic falls back to lightness when no property context exists', () => {
  const inv = { color: [{ value: '#111111', count: 9 }, { value: '#ffffff', count: 8 }, { value: '#cccccc', count: 3 }, { value: '#2563eb', count: 4 }] };
  const s = buildSemantic(buildPrimitives(FOUND), inv);
  assert.equal(s.color.text.default.$value, '{color.gray.300}');
  assert.equal(s.color.surface.default.$value, '{color.gray.100}');
  assert.equal(s.color.border.default.$value, '{color.gray.200}');
});

test('buildSemantic uses property context when the inventory has it', () => {
  const inv = { color: [
    { value: '#2563eb', count: 5, props: { color: 5 } },
    { value: '#111111', count: 9, props: { background: 9 } },
    { value: '#ffffff', count: 3, props: { 'border-color': 3 } },
  ] };
  const s = buildSemantic(buildPrimitives(FOUND), inv);
  assert.equal(s.color.text.default.$value, '{color.blue.200}');
  assert.equal(s.color.surface.default.$value, '{color.gray.300}');
  assert.equal(s.color.border.default.$value, '{color.gray.100}');
});

function chain(out) {
  const values = path.join(out, '02-values');
  assert.equal(analyseMain(['init', FIXTURE, '--out', out], quiet), 0);
  assert.equal(extractMain([FIXTURE, '--out', values], quiet), 0);
  assert.equal(foundationsMain(['--inventory', path.join(values, 'inventory.json'), '--out', out], quiet), 0);
  assert.equal(main(['tokens', '--foundations', path.join(out, '03-foundations.json'), '--out', path.join(out, '04-tokens')], quiet), 0);
  assert.equal(componentsMain([FIXTURE, '--out', out], quiet), 0);
  assert.equal(patternsMain(['--components', path.join(out, '05-components.json'), FIXTURE, '--out', out], quiet), 0);
}

test('tokens writes tiered DTCG that validates with 0 errors', () => {
  const out = tmp();
  chain(out);
  for (const f of ['primitives.tokens.json', 'semantic.tokens.json']) assert.ok(fs.existsSync(path.join(out, '04-tokens', f)), f);
  assert.ok(fs.existsSync(path.join(out, '04-tokens.md')));
  const { tokens, errors } = loadTokens(path.join(out, '04-tokens'));
  assert.deepEqual(errors, []);
  assert.ok(tokens.some((t) => t.path === 'space.1'));
  assert.ok(tokens.some((t) => t.aliasOf));
});

test('plan writes 08-normalisation.json with the contract shape and ordered batches', () => {
  const out = tmp();
  chain(out);
  assert.equal(main(['plan', '--analysis', out], quiet), 0);
  const plan = JSON.parse(fs.readFileSync(path.join(out, '08-normalisation.json'), 'utf8'));
  assert.deepEqual(Object.keys(plan), ['values', 'components', 'patterns', 'batches']);
  const five = plan.values.find((v) => v.literal === '5px');
  assert.equal(five.family, 'spacing');
  assert.equal(five.target, 'space.1');
  assert.equal(five.delta, '1px');
  assert.equal(five.action, 'snap');
  const color = plan.values.find((v) => v.literal === '#1e2836');
  assert.match(color.delta, /^ΔE \d/);
  assert.ok(['snap', 'alias'].includes(color.action));
  const merge = plan.components.find((c) => c.group === 'group.button');
  assert.equal(merge.keep, 'Button');
  assert.deepEqual(merge.merge.slice().sort(), ['Btn', 'SubmitButton']);
  assert.equal(merge.action, 'merge');
  assert.ok(merge.callSites >= 1);
  assert.ok(plan.patterns.some((p) => p.id === 'pattern.c1' && p.action === 'document'));
  const order = ['foundation', 'token', 'primitive', 'pattern', 'docs'];
  const layers = plan.batches.map((b) => order.indexOf(b.layer));
  assert.ok(layers.every((l) => l >= 0));
  assert.deepEqual(layers, [...layers].sort((a, b) => a - b));
  assert.deepEqual(plan.batches.map((b) => b.id), plan.batches.map((_, i) => `b${i + 1}`));
  for (const b of plan.batches) {
    assert.deepEqual(Object.keys(b), ['id', 'layer', 'title', 'items', 'files', 'risk', 'effort', 'skill']);
    assert.ok(['low', 'medium', 'high'].includes(b.risk));
    assert.ok(['S', 'M', 'L'].includes(b.effort));
    assert.match(b.skill, /^\/bauhaus:/);
  }
  const md = fs.readFileSync(path.join(out, '08-plan.md'), 'utf8');
  for (const h of ['# Normalisation plan', '## Summary', '## Foundation', '## Token', '## Primitive', '## Pattern', '## Batches', '## States']) assert.ok(md.includes(h), h);
});

const plan = (spacing) => planNormalisation({
  inventory: { spacing, color: [], radius: [], 'font-size': [], duration: [] },
  tokens: [{ path: 'space.1', resolved: '4px' }, { path: 'space.2', resolved: '8px' }],
  components: { components: [], groups: [] },
  patterns: { cooccurrence: [] },
});
const sp = (value, count, file) => ({ value, count, declared: 0, files: [`${file}:1`] });

test('planNormalisation grades risk from the largest delta', () => {
  assert.equal(plan([sp('5px', 2, 'a.css')]).batches[0].risk, 'low'); // 1px
  assert.equal(plan([sp('5px', 2, 'a.css'), sp('6px', 2, 'b.css')]).batches[0].risk, 'medium'); // 2px
  assert.equal(plan([sp('14px', 2, 'a.css')]).batches[0].risk, 'high'); // 6px
});

test('planNormalisation grades effort from the file count', () => {
  const few = plan([sp('5px', 2, 'a.css')]).batches[0];
  assert.equal(few.effort, 'S');
  assert.equal(few.files, 1);
  const many = plan(Array.from({ length: 6 }, (_, i) => sp('5px', 2, `f${i}.css`)).map((e, i) => ({ ...e, value: `${5 + i * 0.01}px` }))).batches[0];
  assert.equal(many.effort, 'M');
  const lots = plan(Array.from({ length: 21 }, (_, i) => ({ ...sp('5px', 2, `f${i}.css`), value: `${5 + i * 0.01}px` }))).batches[0];
  assert.equal(lots.effort, 'L');
});

test('CLI usage errors exit 2', () => {
  assert.equal(main([], quiet), 2);
  assert.equal(main(['tokens'], quiet), 2);
  assert.equal(main(['plan'], quiet), 2);
  assert.equal(main(['plan', '--analysis', '/no/such'], quiet), 2);
  assert.equal(main(['tokens', '--foundations', '/no/such.json'], quiet), 2);
});

test('renderPlan is a skeleton with the promised headings', () => {
  const md = renderPlan({ values: [], components: [], patterns: [], batches: [] }, { components: [], groups: [] }, { signals: [] });
  assert.ok(md.includes('## Batches'));
});

const comp = (name, usages, usedIn, location) => ({ name, usages, usedIn, location, props: [], states: {}, classes: [], literals: 0, file: `${name}.tsx:1` });
const NO_PATTERNS = { cooccurrence: [], signals: [] };

test('plan skips near-duplicate groups that are page-local and barely used', () => {
  const components = {
    components: [comp('CloseLineModal', 1, 1, 'local'), comp('CloseShortModal', 0, 0, 'local'), comp('Button', 40, 20, 'shared'), comp('Btn', 3, 2, 'local')],
    groups: [{ id: 'group.close', members: ['CloseLineModal', 'CloseShortModal'], reason: ['name'], similarity: 0.7 },
      { id: 'group.button', members: ['Button', 'Btn'], reason: ['name'], similarity: 0.9 }],
  };
  const plan = planNormalisation({ inventory: {}, tokens: [], components, patterns: NO_PATTERNS });
  const merges = plan.components.filter((c) => c.action === 'merge');
  assert.deepEqual(merges.map((m) => m.group), ['group.button']);
});

test('plan bundles low and medium merges into one batch per risk, high merges stay single', () => {
  const list = [comp('A', 50, 10, 'shared'), comp('A2', 2, 2, 'local'), comp('B', 50, 10, 'shared'), comp('B2', 3, 2, 'local'),
    comp('C', 50, 10, 'shared'), comp('C2', 30, 12, 'shared')];
  const groups = [['A', 'A2'], ['B', 'B2'], ['C', 'C2']].map(([k, m], i) => ({ id: `group.${i}`, members: [k, m], reason: ['name'], similarity: 0.8 }));
  const plan = planNormalisation({ inventory: {}, tokens: [], components: { components: list, groups }, patterns: NO_PATTERNS });
  const mergeBatches = plan.batches.filter((b) => b.layer === 'primitive' && b.title.startsWith('Merge'));
  assert.equal(mergeBatches.length, 2);
  assert.ok(mergeBatches.some((b) => b.risk === 'low' && b.title.includes('2 ')));
  assert.ok(mergeBatches.some((b) => b.risk === 'high' && b.title.includes('C2')));
});
