import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDraft, buildReport, clusterColors, extractDir, main, snapSpacing } from '../scripts/extract.mjs';

const FIXTURE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'extract');
const find = (list, value) => list.find((e) => e.value === value);

test('extractDir collects literals per category and skips node_modules', () => {
  const { inventory } = extractDir(FIXTURE);
  const gray = find(inventory.color, '#1f2937');
  assert.equal(gray.count, 2);
  assert.equal(gray.declared, 1);
  assert.equal(gray.files.length, 2);
  assert.match(gray.files[0], /^styles\.css:\d+$/);
  assert.ok(find(inventory.color, '#ffffff'), '#fff normalised to 6 digits');
  assert.ok(find(inventory.color, 'rgba(0, 0, 0, 0.5)'));
  assert.equal(find(inventory.color, '#abcdef'), undefined);
  assert.equal(find(inventory.color, '#header'), undefined);
});

test('extractDir reads lengths by property family', () => {
  const { inventory } = extractDir(FIXTURE);
  const twelve = find(inventory.spacing, '12px');
  assert.equal(twelve.count, 3); // padding css, padding tsx, --ds-space-3
  assert.equal(twelve.declared, 1);
  assert.ok(find(inventory.spacing, '16px'));
  assert.ok(find(inventory.radius, '6px'));
  assert.ok(find(inventory.size, '100%') === undefined);
  assert.equal(find(inventory.spacing, '640px'), undefined, 'media query is not spacing');
});

test('extractDir reads durations, easings, shadows, z-index, fonts, breakpoints', () => {
  const { inventory } = extractDir(FIXTURE);
  assert.ok(find(inventory.duration, '150ms'));
  assert.ok(find(inventory.duration, '0.2s'));
  assert.ok(find(inventory.easing, 'ease-out'));
  assert.ok(find(inventory.easing, 'cubic-bezier(0.2, 0, 0.38, 0.9)'));
  assert.ok(find(inventory.shadow, '0 1px 2px rgba(0,0,0,.2)'));
  assert.ok(find(inventory['z-index'], '10'));
  assert.ok(find(inventory['font-family'], '"Inter", system-ui, sans-serif'));
  assert.ok(find(inventory.breakpoint, '640px'));
});

test('inventory entries are sorted by count descending', () => {
  const { inventory } = extractDir(FIXTURE);
  const counts = inventory.spacing.map((e) => e.count);
  assert.deepEqual(counts, [...counts].sort((a, b) => b - a));
});

test('custom properties: declared, unused, undeclared', () => {
  const { customProperties } = extractDir(FIXTURE);
  assert.ok(customProperties.declared.some((d) => d.name === '--ds-color-text' && d.value === '#1f2937'));
  assert.ok(customProperties.unused.includes('--legacy-gap'));
  assert.ok(customProperties.unused.includes('--ds-color-text'));
  assert.ok(!customProperties.unused.includes('--ds-space-3'));
  assert.deepEqual(customProperties.undeclared.map((u) => u.name), ['--missing-token']);
});

test('clusterColors merges near-identical colours and names greys', () => {
  const clusters = clusterColors([
    { value: '#1f2937', count: 10 },
    { value: '#1e2836', count: 2 },
    { value: '#ffffff', count: 5 },
    { value: '#2563eb', count: 3 },
  ]);
  assert.equal(clusters.length, 3);
  const dark = clusters.find((c) => c.head === '#1f2937');
  assert.equal(dark.members.length, 2);
  assert.equal(dark.hue, 'gray');
  assert.equal(clusters.find((c) => c.head === '#ffffff').hue, 'gray');
  assert.equal(clusters.find((c) => c.head === '#2563eb').hue, 'blue');
});

test('snapSpacing maps px/rem onto the nearest 4px step', () => {
  assert.equal(snapSpacing('13px'), 12);
  assert.equal(snapSpacing('0.5rem'), 8);
  assert.equal(snapSpacing('15px'), 16);
  assert.equal(snapSpacing('1px'), null);
});

test('buildDraft returns valid-looking DTCG groups', () => {
  const result = extractDir(FIXTURE);
  const draft = buildDraft(result);
  assert.equal(draft.space.$type, 'dimension');
  assert.equal(draft.space['3'].$value, '12px');
  assert.equal(draft.duration['150'].$value, '150ms');
  assert.equal(draft.z['10'].$value, 10);
  assert.deepEqual(draft.font.family['1'].$value, ['Inter', 'system-ui', 'sans-serif']);
  assert.ok(draft.color.gray || draft.color.red || draft.color.blue);
  assert.ok(draft.shadow['1'].$value[0].blur);
});

test('buildReport has the promised sections', () => {
  const md = buildReport(extractDir(FIXTURE));
  for (const h of ['# Extraction report', '## Summary', '## Top offenders', '## Distinct values', '## Custom properties', '## Suggested scale']) {
    assert.ok(md.includes(h), h);
  }
  assert.ok(md.includes('--missing-token'));
});

test('CLI writes inventory.json, tokens.draft.json, report.md', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'bauhaus-extract-'));
  const quiet = { log() {}, error() {} };
  assert.equal(main([FIXTURE, '--out', out, '--prefix', 'ds'], quiet), 0);
  for (const f of ['inventory.json', 'tokens.draft.json', 'report.md']) assert.ok(fs.existsSync(path.join(out, f)), f);
  assert.ok(JSON.parse(fs.readFileSync(path.join(out, 'inventory.json'), 'utf8')).color.length > 0);
  assert.equal(main([], quiet), 2);
  assert.equal(main(['/no/such/dir'], quiet), 2);
});
