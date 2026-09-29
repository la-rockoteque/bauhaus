import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { deepMerge, flatten, loadTree, loadTokens, resolveTokens, validateTokens } from '../scripts/lib/dtcg.mjs';

function tmpTokens(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bauhaus-dtcg-'));
  for (const [name, tree] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), JSON.stringify(tree));
  }
  return dir;
}

const resolve = (tree) => resolveTokens(flatten(tree));
const check = (tree) => {
  const { tokens, errors } = resolve(tree);
  return [...errors, ...validateTokens(tokens)];
};

test('flatten inherits $type from the group and keeps description', () => {
  const flat = flatten({ color: { $type: 'color', gray: { 600: { $value: '#4b5563', $description: 'mid' } } } });
  assert.deepEqual(flat, [{ path: 'color.gray.600', $type: 'color', $value: '#4b5563', $description: 'mid' }]);
});

test('deepMerge merges groups and keeps the base $type on overridden tokens', () => {
  const merged = deepMerge(
    { a: { $type: 'color', x: { $value: '#000' }, y: { $value: '#111' } } },
    { a: { x: { $value: '#fff' }, z: { $value: '#222' } } },
  );
  const byPath = Object.fromEntries(flatten(merged).map((t) => [t.path, t.$value]));
  assert.deepEqual(byPath, { 'a.x': '#fff', 'a.y': '#111', 'a.z': '#222' });
  assert.equal(flatten(merged)[0].$type, 'color');
});

test('loadTree merges every *.tokens.json and honours skip', () => {
  const dir = tmpTokens({
    'one.tokens.json': { a: { $type: 'number', x: { $value: 1 } } },
    'sub/two.tokens.json': { a: { y: { $value: 2 } } },
    'themes/dark/t.tokens.json': { a: { x: { $value: 9 } } },
  });
  const paths = (t) => flatten(t).map((x) => x.path).sort();
  assert.deepEqual(paths(loadTree(dir)), ['a.x', 'a.y']);
  assert.equal(flatten(loadTree(dir, { skip: [] })).find((t) => t.path === 'a.x').$value, 9, 'skip [] includes themes/');
});

test('loadTree names the file with bad JSON', () => {
  const dir = tmpTokens({});
  fs.writeFileSync(path.join(dir, 'bad.tokens.json'), '{ nope');
  assert.throws(() => loadTree(dir), /bad\.tokens\.json/);
});

test('aliases resolve through chains and inside composite values', () => {
  const { tokens, errors } = resolve({
    color: { $type: 'color', base: { $value: '#112233' }, mid: { $value: '{color.base}' }, top: { $value: '{color.mid}' } },
    shadow: {
      $type: 'shadow',
      one: { $value: { color: '{color.top}', offsetX: '0px', offsetY: '1px', blur: '2px' } },
    },
  });
  assert.deepEqual(errors, []);
  const get = (p) => tokens.find((t) => t.path === p);
  assert.equal(get('color.top').resolved, '#112233');
  assert.equal(get('color.top').aliasOf, 'color.mid');
  assert.equal(get('shadow.one').resolved.color, '#112233');
});

test('an alias without $type takes the type of its target', () => {
  const { tokens } = resolve({ a: { $type: 'dimension', x: { $value: '4px' } }, b: { y: { $value: '{a.x}' } } });
  assert.equal(tokens.find((t) => t.path === 'b.y').$type, 'dimension');
});

test('cycles are reported once', () => {
  const { errors } = resolve({ a: { $type: 'color', x: { $value: '{a.y}' }, y: { $value: '{a.x}' } } });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /cycle/);
});

test('dangling aliases are reported with the token path', () => {
  const { errors } = resolve({ a: { $type: 'color', x: { $value: '{a.nope}' } } });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /a\.x.*\{a\.nope\}|\{a\.nope\}.*a\.x/);
});

test('type validation: unknown, missing and wrong shapes', () => {
  assert.match(check({ a: { x: { $type: 'colour', $value: '#000' } } })[0], /unknown \$type "colour"/);
  assert.match(check({ a: { x: { $value: '#000' } } })[0], /missing \$type/);
  assert.match(check({ a: { $type: 'dimension', x: { $value: '12' } } })[0], /a\.x.*dimension/);
  assert.match(check({ a: { $type: 'cubicBezier', x: { $value: [0, 0, 1, 1, 1] } } })[0], /cubicBezier/);
  assert.match(check({ a: { $type: 'color', x: { $value: 'blue-ish' } } })[0], /color/);
  assert.match(check({ a: { $type: 'shadow', x: { $value: { color: '#000' } } } })[0], /shadow/);
});

test('type validation: valid values of every type pass', () => {
  const errors = check({
    color: { $type: 'color', a: { $value: '#fff' }, b: { $value: 'rgba(0,0,0,.5)' }, c: { $value: 'oklch(0.5 0.1 200)' } },
    d: { $type: 'dimension', a: { $value: '12px' }, b: { $value: { value: 1, unit: 'rem' } }, c: { $value: '0px' } },
    t: { $type: 'duration', a: { $value: '150ms' }, b: { $value: { value: 0.2, unit: 's' } } },
    f: { $type: 'fontFamily', a: { $value: ['Inter', 'sans-serif'] }, b: { $value: 'Inter' } },
    w: { $type: 'fontWeight', a: { $value: 600 }, b: { $value: 'bold' } },
    e: { $type: 'cubicBezier', a: { $value: [0.2, 0, 0.38, 0.9] } },
    n: { $type: 'number', a: { $value: 1.5 } },
    s: { $type: 'strokeStyle', a: { $value: 'dashed' } },
    b: { $type: 'border', a: { $value: { color: '#000', width: '1px', style: 'solid' } } },
    tr: { $type: 'transition', a: { $value: { duration: '150ms', delay: '0ms', timingFunction: [0, 0, 1, 1] } } },
    sh: { $type: 'shadow', a: { $value: [{ color: '#0002', offsetX: '0px', offsetY: '1px', blur: '2px', spread: '0px' }] } },
    g: { $type: 'gradient', a: { $value: [{ color: '#000', position: 0 }, { color: '#fff', position: 1 }] } },
    ty: { $type: 'typography', a: { $value: { fontFamily: 'Inter', fontSize: '16px', fontWeight: 400, lineHeight: 1.5 } } },
  });
  assert.deepEqual(errors, []);
});

test('loadTokens runs the whole pipeline on a folder', () => {
  const dir = tmpTokens({ 'a.tokens.json': { a: { $type: 'dimension', x: { $value: '4px' }, y: { $value: '{a.x}' } } } });
  const { tokens, errors } = loadTokens(dir);
  assert.deepEqual(errors, []);
  assert.equal(tokens.find((t) => t.path === 'a.y').resolved, '4px');
});
