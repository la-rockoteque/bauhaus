import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildFoundations, inferColor, inferFontSize, inferScale, inferSpacing, main, renderFoundations } from '../scripts/foundations.mjs';

const quiet = { log() {}, error() {} };
const e = (value, count) => ({ value, count, declared: 0, files: [] });

test('inferSpacing picks the largest base that fits nearly as well as the best', () => {
  const s = inferSpacing([e('4px', 10), e('8px', 12), e('16px', 8), e('12px', 5), e('24px', 3), e('5px', 3), e('2px', 1)]);
  assert.equal(s.base, 4);
  assert.equal(s.fit, 0.9);
  assert.deepEqual(s.steps, [4, 8, 12, 16, 24]);
  assert.deepEqual(s.outliers.find((o) => o.value === '5px'), { value: '5px', count: 3, nearest: 4, delta: 1 });
  assert.equal(s.outliers.find((o) => o.value === '2px').nearest, 4);
});

test('inferSpacing finds an 8px grid and reads rem', () => {
  const s = inferSpacing([e('8px', 10), e('1rem', 6), e('24px', 4), e('32px', 3)]);
  assert.equal(s.base, 8);
  assert.equal(s.fit, 1);
  assert.deepEqual(s.steps, [8, 16, 24, 32]);
});

test('inferSpacing on nothing returns an empty result', () => {
  assert.deepEqual(inferSpacing([]), { base: 4, fit: 0, steps: [], outliers: [] });
});

test('inferFontSize finds base 16 and a 1.25 ratio', () => {
  const f = inferFontSize([e('16px', 20), e('20px', 10), e('25px', 5), e('32px', 3), e('13px', 4)]);
  assert.equal(f.base, 16);
  assert.equal(f.ratio, 1.25);
  assert.ok(f.fit >= 0.9);
  assert.deepEqual(f.steps, [13, 16, 20, 25, 32]);
});

test('inferFontSize flags values that sit off the scale', () => {
  const f = inferFontSize([e('16px', 20), e('20px', 10), e('25px', 5), e('32px', 3), e('17.5px', 1), e('50px', 2)]);
  assert.ok(f.outliers.some((o) => o.value === '17.5px'));
  assert.ok(f.outliers.some((o) => o.value === '50px'));
});

test('inferScale keeps values used twice or more, the rest are outliers', () => {
  const r = inferScale([e('4px', 3), e('8px', 1), e('0.25rem', 2), e('12px', 2)], (v) => (v.endsWith('rem') ? parseFloat(v) * 16 : parseFloat(v)));
  assert.deepEqual(r.steps, [4, 12]);
  assert.deepEqual(r.outliers, [{ value: '8px', count: 1 }]);
});

test('inferColor builds ramps by hue, neutrals, and count-1 outliers', () => {
  const c = inferColor([
    e('#2563eb', 6), e('#1d4ed8', 4), e('#93c5fd', 3),
    e('#111111', 9), e('#ffffff', 8), e('#cccccc', 3),
    e('#ff00aa', 1),
  ]);
  assert.equal(c.ramps.length, 1);
  assert.equal(c.ramps[0].hue, 'blue');
  assert.equal(c.ramps[0].steps.length, 3);
  assert.deepEqual(c.neutrals, ['#ffffff', '#cccccc', '#111111']);
  assert.deepEqual(c.outliers, [{ value: '#ff00aa', count: 1 }]);
});

const INV = {
  color: [e('#111111', 5), e('#ffffff', 5), e('#2563eb', 4)],
  spacing: [e('4px', 5), e('8px', 4), e('5px', 1)],
  radius: [e('6px', 3), e('9999px', 2), e('3px', 1)],
  size: [], 'font-size': [e('16px', 5), e('20px', 3)], 'line-height': [],
  duration: [e('150ms', 3), e('0.2s', 2), e('900ms', 1)],
  easing: [e('ease-out', 4), e('cubic-bezier(0.2, 0, 0.38, 0.9)', 1)],
  shadow: [e('0 1px 2px rgba(0,0,0,.2)', 3), e('0 9px 9px red', 1)],
  'z-index': [e('10', 3), e('9999', 1)],
  'font-family': [e('"Inter", sans-serif', 4)],
  breakpoint: [e('640px', 2), e('40em', 2), e('999px', 1)],
};

test('buildFoundations has the contract shape', () => {
  const f = buildFoundations(INV);
  assert.deepEqual(Object.keys(f), ['spacing', 'fontSize', 'color', 'radius', 'duration', 'easing', 'shadow', 'zIndex', 'breakpoint', 'fontFamily']);
  assert.deepEqual(f.radius.steps, [6, 999]);
  assert.deepEqual(f.radius.outliers, [{ value: '3px', count: 1 }]);
  assert.deepEqual(f.duration.steps, [150, 200]);
  assert.deepEqual(f.easing.values, ['ease-out']);
  assert.deepEqual(f.easing.outliers, [{ value: 'cubic-bezier(0.2, 0, 0.38, 0.9)', count: 1 }]);
  assert.deepEqual(f.shadow, { levels: 1, values: ['0 1px 2px rgba(0,0,0,.2)'] });
  assert.deepEqual(f.zIndex.steps, [10]);
  assert.deepEqual(f.breakpoint.steps, [640]);
  assert.deepEqual(f.fontFamily.values, ['"Inter", sans-serif']);
});

test('renderFoundations explains each scale in words and numbers', () => {
  const md = renderFoundations(buildFoundations(INV));
  for (const h of ['# Foundations', '## Spacing', '## Font size', '## Colour', '## Radius', '## Motion', '## Depth', '## Breakpoints', '## Fonts', '## States']) {
    assert.ok(md.includes(h), h);
  }
  assert.match(md, /4px grid/);
  assert.match(md, /fit/i);
});

test('CLI writes 03-foundations.json and .md next to the values folder', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bauhaus-found-'));
  fs.mkdirSync(path.join(root, '02-values'));
  fs.writeFileSync(path.join(root, '02-values', 'inventory.json'), JSON.stringify(INV));
  assert.equal(main(['--inventory', path.join(root, '02-values', 'inventory.json')], quiet), 0);
  assert.ok(JSON.parse(fs.readFileSync(path.join(root, '03-foundations.json'), 'utf8')).spacing);
  assert.ok(fs.existsSync(path.join(root, '03-foundations.md')));
  assert.equal(main([], quiet), 2);
  assert.equal(main(['--inventory', '/no/such.json'], quiet), 2);
});
