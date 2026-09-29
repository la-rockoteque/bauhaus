import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { composite, main, parseColor, ratio, runPairs, verdicts } from '../scripts/contrast.mjs';

const ratioOf = (a, b) => ratio(parseColor(a), parseColor(b));

test('black on white is 21', () => {
  assert.equal(Math.round(ratioOf('#000', '#fff') * 100) / 100, 21);
});

test('#777 on white is about 4.48: fails AA normal, passes AA large', () => {
  const r = ratioOf('#777', '#fff');
  assert.ok(r > 4.47 && r < 4.49, String(r));
  const v = verdicts(r);
  assert.equal(v.aaNormal, false);
  assert.equal(v.aaLarge, true);
  assert.equal(v.nonText, true);
  assert.equal(v.aaaNormal, false);
});

test('parseColor reads hex, rgb, hsl and oklch', () => {
  assert.deepEqual(parseColor('#0f0'), { r: 0, g: 255, b: 0, a: 1 });
  assert.deepEqual(parseColor('#11223380').a.toFixed(2), '0.50');
  assert.deepEqual(parseColor('rgb(255 0 0 / 50%)'), { r: 255, g: 0, b: 0, a: 0.5 });
  const hsl = parseColor('hsl(120, 100%, 50%)');
  assert.deepEqual([hsl.r, hsl.g, hsl.b], [0, 255, 0]);
  const white = parseColor('oklch(1 0 0)');
  assert.deepEqual([white.r, white.g, white.b], [255, 255, 255]);
  const black = parseColor('oklch(0 0 0)');
  assert.deepEqual([black.r, black.g, black.b], [0, 0, 0]);
});

test('parseColor rejects garbage with a clear message', () => {
  assert.throws(() => parseColor('banana'), /Cannot parse colour "banana"/);
});

test('alpha is composited over the background', () => {
  const c = composite(parseColor('rgba(0,0,0,0.5)'), parseColor('#fff'));
  assert.deepEqual([c.r, c.g, c.b], [128, 128, 128]);
});

function tmpProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bauhaus-contrast-'));
  fs.writeFileSync(path.join(dir, 'c.tokens.json'), JSON.stringify({
    color: { $type: 'color', white: { $value: '#ffffff' }, gray: { 500: { $value: '#777777' }, 900: { $value: '#111111' } },
      text: { muted: { $value: '{color.gray.500}' }, default: { $value: '{color.gray.900}' } }, surface: { $value: '{color.white}' } },
  }));
  return dir;
}

test('runPairs reports failures per use level', () => {
  const dir = tmpProject();
  const pairs = [
    { fg: 'color.text.default', bg: 'color.surface', use: 'text' },
    { fg: 'color.text.muted', bg: 'color.surface', use: 'text' },
    { fg: 'color.text.muted', bg: 'color.surface', use: 'large-text' },
  ];
  const { results, failures } = runPairs({ tokensDir: dir, pairs, level: 'AA' });
  assert.equal(results.length, 3);
  assert.deepEqual(failures.map((f) => f.use), ['text']);
  assert.equal(failures[0].fg, 'color.text.muted');
});

test('runPairs reports unknown tokens as failures', () => {
  const { failures } = runPairs({ tokensDir: tmpProject(), pairs: [{ fg: 'color.nope', bg: 'color.surface', use: 'text' }], level: 'AA' });
  assert.match(failures[0].error, /color\.nope/);
});

test('AAA is stricter than AA', () => {
  const pairs = [{ fg: 'color.text.muted', bg: 'color.surface', use: 'large-text' }];
  assert.equal(runPairs({ tokensDir: tmpProject(), pairs, level: 'AA' }).failures.length, 0);
  assert.equal(runPairs({ tokensDir: tmpProject(), pairs, level: 'AAA' }).failures.length, 1); // 4.48 < 4.5
});

test('main exit codes: 0 ok, 1 failing pair, 2 usage', () => {
  const dir = tmpProject();
  const quiet = { log() {}, error() {} };
  assert.equal(main(['#000', '#fff'], quiet), 0);
  assert.equal(main([], quiet), 2);
  const good = path.join(dir, 'good.json');
  const bad = path.join(dir, 'bad.json');
  fs.writeFileSync(good, JSON.stringify([{ fg: 'color.text.default', bg: 'color.surface', use: 'text' }]));
  fs.writeFileSync(bad, JSON.stringify([{ fg: 'color.text.muted', bg: 'color.surface', use: 'text' }]));
  assert.equal(main(['--tokens', dir, '--pairs', good], quiet), 0);
  assert.equal(main(['--tokens', dir, '--pairs', bad], quiet), 1);
  assert.equal(main(['--tokens', dir], quiet), 2);
});
