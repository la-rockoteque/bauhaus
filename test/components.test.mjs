import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyseComponents, detectComponents, findGroups, main, nameStem, renderComponents } from '../scripts/components.mjs';

const FIXTURE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'analyse');
const quiet = { log() {}, error() {} };
const detect = (file, text) => detectComponents(file, text);

test('detectComponents: React function, arrow, class, and non-components', () => {
  const src = `
export function Card({ title, tone }) { return <div>{title}</div>; }
const Row = ({ a }) => <li>{a}</li>;
export const Cell = React.memo(({ z }) => { return (<td>{z}</td>); });
class Old extends React.Component { render() { return <b />; } }
export function useThing() { return 1; }
function Helper() { return 42; }
`;
  const defs = detect('ui/Card.tsx', src);
  assert.deepEqual(defs.map((d) => d.name).sort(), ['Card', 'Cell', 'Old', 'Row']);
  const card = defs.find((d) => d.name === 'Card');
  assert.equal(card.framework, 'react');
  assert.equal(card.exported, true);
  assert.equal(card.line, 2);
  assert.deepEqual(card.props, ['title', 'tone']);
  assert.equal(defs.find((d) => d.name === 'Row').exported, false);
});

test('detectComponents: TS props interface and inline type', () => {
  const defs = detect('Button.tsx', `
interface ButtonProps { variant?: 'a' | 'b'; disabled?: boolean;
  onClick?: (e: Event) => void; children: React.ReactNode }
export function Button(props: ButtonProps) { return <button />; }
`);
  assert.deepEqual(defs[0].props, ['variant', 'disabled', 'onClick', 'children']);
});

test('detectComponents: Vue, Svelte, Angular, web components', () => {
  const vue = detect('Modal.vue', '<script setup>\ndefineProps<{ open: boolean; title?: string }>()\n</script><template><div/></template>');
  assert.deepEqual([vue[0].name, vue[0].framework, vue[0].props], ['Modal', 'vue', ['open', 'title']]);
  const vueOpts = detect('x/fancy.vue', "<script>export default { name: 'FancyThing', props: { size: Number, tone: { type: String } } }</script>");
  assert.deepEqual([vueOpts[0].name, vueOpts[0].props], ['FancyThing', ['size', 'tone']]);
  const svelte = detect('Toggle.svelte', '<script>\n export let checked = false;\n export let disabled;\n</script>');
  assert.deepEqual([svelte[0].name, svelte[0].framework, svelte[0].props], ['Toggle', 'svelte', ['checked', 'disabled']]);
  const ng = detect('a.component.ts', "@Component({ selector: 'app-avatar', template: '' })\nexport class AvatarComponent { @Input() src = ''; @Input() size = 1; }");
  assert.deepEqual([ng[0].name, ng[0].framework, ng[0].props, ng[0].tag], ['AvatarComponent', 'angular', ['src', 'size'], 'app-avatar']);
  const wc = detect('l.ts', "class LegacyAlert extends HTMLElement {}\ncustomElements.define('legacy-alert', LegacyAlert);");
  assert.deepEqual([wc[0].name, wc[0].framework, wc[0].tag], ['LegacyAlert', 'web-component', 'legacy-alert']);
});

test('nameStem strips noise prefixes and canonicalises synonyms', () => {
  assert.equal(nameStem('SubmitButton'), 'button');
  assert.equal(nameStem('PrimaryBtn'), 'button');
  assert.equal(nameStem('Btn'), 'button');
  assert.equal(nameStem('MyModal'), 'modal');
  assert.equal(nameStem('Dialog'), 'modal');
  assert.equal(nameStem('TextField'), 'input');
  assert.equal(nameStem('Field'), 'input');
  assert.equal(nameStem('DataTable'), 'datatable');
});

const c = (name, props, usages = 1) => ({ name, props, usages });

test('findGroups clusters near-duplicates with reasons and similarity', () => {
  const groups = findGroups([
    c('Button', ['variant', 'disabled', 'onClick'], 30), c('Btn', ['variant', 'disabled'], 5), c('SubmitButton', [], 2),
    c('Dialog', ['open', 'title'], 4), c('Modal', ['open', 'title', 'error'], 3),
    c('Table', ['rows'], 9), c('Pager', ['page'], 9),
  ]);
  assert.equal(groups.length, 2);
  const button = groups.find((g) => g.id === 'group.button');
  assert.deepEqual(button.members, ['Button', 'Btn', 'SubmitButton']);
  assert.ok(button.reason.includes('name'));
  assert.ok(button.similarity >= 0.6 && button.similarity <= 1);
  const modal = groups.find((g) => g.id === 'group.modal');
  assert.deepEqual(modal.members, ['Dialog', 'Modal']);
  assert.deepEqual(modal.reason, ['name', 'props']);
});

test('findGroups ignores unrelated names even with the same props', () => {
  assert.deepEqual(findGroups([c('Card', ['title']), c('Table', ['title'])]), []);
});

test('analyseComponents on the fixture', () => {
  const { components, groups } = analyseComponents(FIXTURE);
  const by = (n) => components.find((x) => x.name === n);
  assert.deepEqual(Object.keys(by('Button')), ['name', 'file', 'framework', 'exported', 'props', 'usages', 'usedIn', 'location', 'states', 'classes', 'literals']);
  const button = by('Button');
  assert.equal(button.file, 'components/Button.tsx:11');
  assert.equal(button.usages, 3); // Orders, Checkout, SubmitButton
  assert.equal(button.usedIn, 3);
  assert.equal(button.location, 'shared'); // pages + features + components
  assert.deepEqual(button.states, { disabled: true, loading: true, error: false, selected: false, readonly: false, expanded: false, empty: false });
  assert.ok(button.classes.includes('btn'));
  assert.ok(button.literals >= 3, `literals ${button.literals}`); // Button.css colours + px
  assert.equal(by('SubmitButton').location, 'local');
  assert.equal(by('Modal').framework, 'vue');
  assert.equal(by('Toggle').framework, 'svelte');
  assert.equal(by('AvatarComponent').framework, 'angular');
  assert.equal(by('LegacyAlert').framework, 'web-component');
  assert.equal(by('Dialog').states.expanded, true);
  assert.equal(by('Modal').states.error, true);
  assert.equal(by('FilterBar').usages, 2);
  assert.equal(by('Spinner').usages, 1);
  assert.equal(components.find((x) => x.name === 'useThing'), undefined);
  const g = groups.find((x) => x.id === 'group.button');
  assert.deepEqual(g.members.slice().sort(), ['Btn', 'Button', 'SubmitButton']);
  assert.ok(groups.some((x) => x.members.includes('Dialog') && x.members.includes('Modal')));
  const counts = components.map((x) => x.usages);
  assert.deepEqual(counts, [...counts].sort((a, b) => b - a));
});

test('renderComponents has States and groups sections', () => {
  const md = renderComponents(analyseComponents(FIXTURE));
  for (const h of ['# Components', '## States', '## Groups', '## Layers']) assert.ok(md.includes(h), h);
  assert.match(md, /Button/);
});

test('CLI writes 05-components.json and .md', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'bauhaus-comp-'));
  assert.equal(main([FIXTURE, '--out', out], quiet), 0);
  assert.ok(JSON.parse(fs.readFileSync(path.join(out, '05-components.json'), 'utf8')).components.length > 5);
  assert.ok(fs.existsSync(path.join(out, '05-components.md')));
  assert.equal(main([], quiet), 2);
  assert.equal(main(['/no/such'], quiet), 2);
});
