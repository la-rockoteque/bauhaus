import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildScope, detectStack, main, phaseStatus, renderScopeMd } from '../scripts/analyse.mjs';

const FIXTURE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'analyse');
const quiet = { log() {}, error() {} };
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'bauhaus-analyse-'));

function project(files) {
  const dir = tmp();
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}

test('detectStack reads framework from package.json deps', () => {
  const cases = [
    ['react', 'react'], ['vue', 'vue'], ['svelte', 'svelte'], ['@angular/core', 'angular'], ['solid-js', 'solid'], ['lit', 'lit'],
  ];
  for (const [dep, expected] of cases) {
    const dir = project({ 'package.json': JSON.stringify({ dependencies: { [dep]: '1' } }) });
    assert.equal(detectStack(dir).framework, expected, dep);
  }
  assert.equal(detectStack(project({ 'package.json': '{}' })).framework, 'unknown');
});

test('detectStack finds the styling approach', () => {
  const styling = (files) => detectStack(project(files)).styling;
  assert.equal(styling({ 'package.json': '{}', 'tailwind.config.js': '' }), 'tailwind');
  assert.equal(styling({ 'package.json': '{"dependencies":{"styled-components":"5"}}' }), 'css-in-js');
  assert.equal(styling({ 'package.json': '{"dependencies":{"@emotion/react":"11"}}' }), 'css-in-js');
  assert.equal(styling({ 'package.json': '{"devDependencies":{"sass":"1"}}' }), 'sass');
  assert.equal(styling({ 'package.json': '{}', 'a/Card.module.css': '' }), 'css-modules');
  assert.equal(styling({ 'package.json': '{}', 'a.css': '' }), 'css');
});

test('detectStack looks in parent folders for package.json', () => {
  const dir = project({ 'package.json': '{"dependencies":{"vue":"3"}}', 'src/a.vue': '' });
  assert.equal(detectStack(path.join(dir, 'src')).framework, 'vue');
});

test('buildScope has the contract shape', () => {
  const scope = buildScope(FIXTURE, { now: new Date('2026-01-02T03:04:05Z') });
  assert.deepEqual(Object.keys(scope), ['root', 'stack', 'files', 'byExt', 'ignored', 'generatedAt']);
  assert.equal(scope.stack.framework, 'react');
  assert.equal(scope.stack.styling, 'css');
  assert.equal(scope.byExt.tsx, 11);
  assert.equal(scope.byExt.vue, 1);
  assert.equal(scope.byExt.svelte, 1);
  assert.equal(scope.files, Object.values(scope.byExt).reduce((a, b) => a + b, 0));
  assert.ok(scope.ignored.includes('node_modules'));
  assert.equal(scope.generatedAt, '2026-01-02T03:04:05.000Z');
  assert.match(renderScopeMd(scope), /react/);
});

test('init writes 01-scope.json and .md; status derives progress from files', () => {
  const out = path.join(tmp(), 'analysis');
  assert.equal(main(['init', FIXTURE, '--out', out], quiet), 0);
  assert.ok(fs.existsSync(path.join(out, '01-scope.json')));
  assert.ok(fs.existsSync(path.join(out, '01-scope.md')));
  const phases = phaseStatus(out);
  assert.equal(phases.length, 9);
  assert.deepEqual(phases.map((p) => p.done), [true, false, false, false, false, false, false, false, false]);
  const lines = [];
  assert.equal(main(['status', '--out', out], { log: (l) => lines.push(l), error() {} }), 0);
  const text = lines.join('\n');
  assert.match(text, /1 .*Scope.*done/);
  assert.match(text, /Next: 2 Values/);
  assert.match(text, /extract\.mjs/);
});

test('status marks phases done from their artifacts', () => {
  const out = tmp();
  for (const f of ['01-scope.json', '02-values/inventory.json', '03-foundations.json', '04-tokens/primitives.tokens.json']) {
    fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true });
    fs.writeFileSync(path.join(out, f), '{}');
  }
  assert.deepEqual(phaseStatus(out).map((p) => p.done), [true, true, true, true, false, false, false, false, false]);
});

test('usage errors exit 2', () => {
  assert.equal(main([], quiet), 2);
  assert.equal(main(['init'], quiet), 2);
  assert.equal(main(['init', '/no/such/dir'], quiet), 2);
  assert.equal(main(['bogus'], quiet), 2);
});
