import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runPairs } from '../scripts/contrast.mjs';
import { checkProject, main as tokensMain } from '../scripts/tokens.mjs';

const KIT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'kit');
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const quiet = { log() {}, error() {} };

const SEEDS = {
  'kit/library': { tokens: 'library/foundations', themes: 'library/themes', pairs: 'library/foundations/color/pairs.json' },
  'kit/tokens': { tokens: 'tokens', themes: 'tokens/themes', pairs: 'tokens/pairs.json' },
};

for (const [name, seed] of Object.entries(SEEDS)) {
  for (const theme of ['light', 'dark']) {
    test(`${name}: every colour pair passes WCAG AA in the ${theme} theme`, () => {
      const pairs = readJson(path.join(KIT, seed.pairs));
      const { results, failures } = runPairs({ tokensDir: path.join(KIT, seed.tokens), themeDir: path.join(KIT, seed.themes, theme), pairs, level: 'AA' });
      assert.ok(results.length >= 40, 'pairs cover text, surface, action, status, focus and border roles');
      assert.deepEqual(failures.map((f) => `${f.fg} on ${f.bg} ${f.error ?? f.ratio}`), []);
    });
  }
}

test('kit/library: tokens check is clean and dist/tokens.css is current', () => {
  const root = path.join(KIT, 'library');
  const config = readJson(path.join(root, 'bauhaus.config.json'));
  assert.equal(config.tokens.defaultTheme, 'light');
  assert.deepEqual(checkProject(config, root), { errors: [], drift: [], warnings: [] });
});

test('kit/bauhaus.config.example.json: builds into a temp dir and checks clean', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bauhaus-kit-'));
  fs.cpSync(path.join(KIT, 'tokens'), path.join(dir, 'tokens'), { recursive: true });
  const config = { ...readJson(path.join(KIT, 'bauhaus.config.example.json')) };
  delete config.$schema;
  assert.equal(config.tokens.defaultTheme, 'light');
  fs.writeFileSync(path.join(dir, 'bauhaus.config.json'), JSON.stringify(config));
  const file = path.join(dir, 'bauhaus.config.json');
  assert.equal(tokensMain(['build', '--config', file], quiet), 0);
  const seen = [];
  assert.equal(tokensMain(['check', '--config', file], { log: (m) => seen.push(m), error: (m) => seen.push(m) }), 0, seen.join('\n'));
  assert.deepEqual(checkProject(config, dir).warnings, []);
  const css = fs.readFileSync(path.join(dir, 'build/tokens.css'), 'utf8');
  for (const block of [':root {', '[data-theme="light"] {', '[data-theme="dark"] {']) assert.ok(css.includes(block), block);
  assert.match(css, /--ds-elevation-1: var\(--ds-shadow-dark-1\);/, 'dark re-derives its shadows');
});
