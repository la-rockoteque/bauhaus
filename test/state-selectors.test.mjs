import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The state selector ladder: knowledge/components/api-design.md § State selectors.
const LIBRARY = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'kit', 'library');
const ROOTS = ['components', 'primitives', 'patterns'];

// Every data-* attribute a stylesheet may select, with its ladder rung.
const ALLOWED_DATA = new Set([
  // Rung 3: boolean React Aria attributes, on parts React Aria renders.
  'data-entering', 'data-exiting', 'data-selected', 'data-pressed', 'data-focused', 'data-focus-visible', 'data-hovered', 'data-open',
  // Rung 3: boolean attribute the component sets when no ARIA attribute exists
  // (data-disabled also comes from React Aria; data-paused is the toast's own; data-forced-open is the combobox showcase).
  'data-disabled', 'data-paused', 'data-forced-open',
  // Not a state: content hook (table, content).
  'data-label',
]);

const cssFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === 'node_modules' ? [] : cssFiles(p);
  return e.name.endsWith('.css') ? [p] : [];
});
const files = ROOTS.flatMap((r) => (fs.existsSync(path.join(LIBRARY, r)) ? cssFiles(path.join(LIBRARY, r)) : []));
const rel = (f) => path.relative(LIBRARY, f);
const scan = (re) => files.flatMap((f) => [...fs.readFileSync(f, 'utf8').matchAll(re)].map((m) => `${rel(f)}: ${m[0]}`));

test('state-selectors: the scan finds the kit stylesheets', () => {
  assert.ok(files.length > 20);
});

test('state-selectors: no BEM modifier names a state (rung 4)', () => {
  const found = scan(/--(?:loading|disabled|open|selected|checked|pressed|active|expanded|current|invalid|busy|hover|focus)\b/g);
  assert.deepEqual(found, []);
});

test('state-selectors: no data-state enumeration', () => {
  assert.deepEqual(scan(/\[data-state/g), []);
});

test('state-selectors: every [data-x] is on the allowlist', () => {
  const used = scan(/\[data-[a-z-]+/g).filter((u) => !ALLOWED_DATA.has(u.split('[')[1]));
  assert.deepEqual(used, []);
});
