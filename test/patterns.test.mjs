import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analysePatterns, main, minePatterns, renderPatterns, scanSignals } from '../scripts/patterns.mjs';
import { analyseComponents } from '../scripts/components.mjs';

const FIXTURE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'analyse');
const quiet = { log() {}, error() {} };

test('minePatterns finds frequent itemsets and drops subsets with equal support', () => {
  const files = new Map([
    ['a', new Set(['F', 'T', 'P'])], ['b', new Set(['F', 'T', 'P'])], ['c', new Set(['F', 'T'])], ['d', new Set(['X'])],
  ]);
  const sets = minePatterns(files);
  const key = (s) => s.components.join('+');
  assert.deepEqual(sets.map(key).sort(), ['F+P+T', 'F+T']);
  const big = sets.find((s) => s.components.length === 3);
  assert.equal(big.support, 2);
  assert.deepEqual(big.files, ['a', 'b']);
  assert.equal(sets.find((s) => key(s) === 'F+T').support, 3);
  assert.deepEqual(sets.map((s) => s.id), ['pattern.c1', 'pattern.c2']);
});

test('minePatterns needs support of 2 and caps at 30 sets', () => {
  assert.deepEqual(minePatterns(new Map([['a', new Set(['A', 'B'])]])), []);
  const files = new Map();
  for (let f = 0; f < 2; f++) files.set(`f${f}`, new Set(Array.from({ length: 12 }, (_, i) => `C${i}`)));
  const sets = minePatterns(files);
  assert.ok(sets.length <= 30);
  assert.ok(sets.every((s) => s.components.length <= 5));
});

test('scanSignals counts and locates each signal', () => {
  const sources = new Map([
    ['a.tsx', 'const x = isLoading;\n<Spinner />\nreturn <p>No results</p>;\n<form onSubmit={go}>'],
    ['b.tsx', 'import { Modal } from "./Modal";\n<Modal />\n<div role="alert">'],
  ]);
  const by = Object.fromEntries(scanSignals(sources).map((s) => [s.kind, s]));
  assert.deepEqual(by.loading.files, ['a.tsx:1', 'a.tsx:2']);
  assert.equal(by.loading.count, 2);
  assert.deepEqual(by['empty-state'].files, ['a.tsx:3']);
  assert.equal(by.form.count, 1);
  assert.equal(by.modal.count, 1, 'import line ignored');
  assert.equal(by.error.count, 1);
  assert.equal(by.table.count, 0);
  assert.deepEqual(Object.keys(by), ['empty-state', 'loading', 'error', 'form', 'table', 'pagination', 'modal', 'filter', 'toast', 'tabs', 'wizard', 'navigation']);
});

test('analysePatterns on the fixture finds FilterBar+Table+Pager on two pages', () => {
  const comps = analyseComponents(FIXTURE);
  const { cooccurrence, signals } = analysePatterns(FIXTURE, comps);
  const set = cooccurrence.find((s) => s.components.join() === 'FilterBar,Pager,Table');
  assert.ok(set, JSON.stringify(cooccurrence));
  assert.equal(set.support, 2);
  assert.deepEqual(set.files, ['pages/Customers.tsx', 'pages/Orders.tsx']);
  assert.equal(signals.find((s) => s.kind === 'empty-state').count, 2);
  assert.ok(signals.find((s) => s.kind === 'table').count >= 2);
  assert.equal(signals.find((s) => s.kind === 'form').count, 1);
});

test('renderPatterns has States and Layers sections', () => {
  const md = renderPatterns(analysePatterns(FIXTURE, analyseComponents(FIXTURE)));
  for (const h of ['# Patterns', '## States', '## Co-occurrence', '## Signals']) assert.ok(md.includes(h), h);
  assert.match(md, /FilterBar/);
});

test('CLI writes 06-patterns.json and .md', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'bauhaus-pat-'));
  const compFile = path.join(out, '05-components.json');
  fs.writeFileSync(compFile, JSON.stringify(analyseComponents(FIXTURE)));
  assert.equal(main(['--components', compFile, FIXTURE, '--out', out], quiet), 0);
  assert.ok(JSON.parse(fs.readFileSync(path.join(out, '06-patterns.json'), 'utf8')).cooccurrence.length >= 1);
  assert.ok(fs.existsSync(path.join(out, '06-patterns.md')));
  assert.equal(main([FIXTURE], quiet), 2);
  assert.equal(main(['--components', '/no/such.json', FIXTURE], quiet), 2);
});
