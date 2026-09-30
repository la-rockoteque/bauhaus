import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildOutputs } from '../scripts/tokens.mjs';

// The Storybook manager cannot read custom properties, so its theme gets resolved token values.
// This test fails when a manager colour or font stops matching the tokens it should come from.
const KIT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'kit', 'library');
const config = JSON.parse(fs.readFileSync(path.join(KIT, 'bauhaus.config.json'), 'utf8'));
const built = buildOutputs(config, KIT);
const tsOutput = built.outputs.find((o) => o.path.endsWith('.ts'));
const tokens = JSON.parse(/export const tokens = ([\s\S]*?) as const;/.exec(tsOutput.content)[1]);
const { managerValues } = await import(pathToFileURL(path.join(KIT, '.storybook', 'theme-values.js')).href);

const leaves = (node) => (node && typeof node === 'object' ? Object.values(node).flatMap(leaves) : [node]);

test('the token build emits the typed tokens file the manager theme reads', () => {
  assert.deepEqual(built.errors, []);
  assert.ok(tsOutput, 'bauhaus.config.json lists a ts output');
  assert.equal(fs.readFileSync(path.join(KIT, tsOutput.path), 'utf8'), tsOutput.content, 'dist/tokens.ts is stale: run npm run tokens');
});

test('every manager colour is a token value', () => {
  const values = managerValues(tokens);
  const known = new Set(leaves(tokens));
  const colours = Object.entries(values).filter(([, v]) => typeof v === 'string' && v.startsWith('#'));
  assert.ok(colours.length >= 15);
  for (const [key, value] of colours) assert.ok(known.has(value), `${key} = ${value} is not a token value`);
});

test('the manager fonts and radii are the typography and shape tokens', () => {
  const values = managerValues(tokens);
  assert.equal(values.fontBase, tokens.font.family.sans);
  assert.equal(values.fontCode, tokens.font.family.mono);
  assert.equal(values.appBorderRadius, Number.parseInt(tokens.radius.md, 10));
  assert.equal(values.inputBorderRadius, Number.parseInt(tokens.radius.control, 10));
});

test('the manager colours follow the roles: primary action, text and surfaces', () => {
  const values = managerValues(tokens);
  assert.equal(values.colorPrimary, tokens.action.primary);
  assert.equal(values.textColor, tokens.text.default);
  assert.equal(values.appContentBg, tokens.surface.default);
  assert.equal(values.appBorderColor, tokens.border.default);
});

test('theme.ts builds the Storybook theme from the tokens and holds no value of its own', () => {
  const source = fs.readFileSync(path.join(KIT, '.storybook', 'theme.ts'), 'utf8');
  assert.match(source, /from '\.\.\/dist\/tokens'/);
  assert.match(source, /managerValues\(tokens\)/);
  assert.match(source, /brandTitle: 'Bauhaus design system'/);
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b/i);
});
