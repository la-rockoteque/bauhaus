import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { Button } from '../../clickables/button/button';
import { Icon } from '../../../primitives/icon/icon';
import { Text } from '../../../primitives/text/text';
import { List, ListItem } from './list';
import { listRules } from './list.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Data structures/List', component: List, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof List>;

export default meta;

/** Adds a forced-state class to the first match of `target`, so the real rule paints it. */
function Force({ cls, target, children }: { cls: string; target: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.querySelector(target)?.classList.add(cls);
  }, [cls, target]);
  return (
    <div ref={box} style={{ inlineSize: '100%' }}>
      {children}
    </div>
  );
}

const file = (name: string, note: string, size: string, extra: object = {}) => (
  <ListItem key={name} leading={<Icon glyph="external" size="md" />} title={name} description={note} trailing={size} {...extra} />
);

const FILES = [
  ['budget-2026.xlsx', 'Edited yesterday by Marie', '2.4 MB'],
  ['site-plan.pdf', 'Edited on Monday by Luc', '860 KB'],
  ['inspection-notes.md', 'Edited last week by Inès', '12 KB'],
] as const;

const cell = { inlineSize: '100%', minInlineSize: 0 } as const;
const Slot = ({ children }: { children: ReactNode }) => <Text variant="body" as="p">{children}</Text>;

const links = (extra: (index: number) => object = () => ({})) => (
  <List aria-label="Project files" divided>
    {FILES.map(([name, note, size], index) => file(name, note, size, { href: `#${name}`, ...extra(index) }))}
  </List>
);

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="List"
      layer="Component"
      family="Data structures"
      plain="A list is a stack of rows, one thing per row. Each row can have a picture on the left, a name, a line of detail, and a value on the right. A whole row can be one link or one button."
      precise="Component in the data-structures family · a semantic ul or ol of rows with leading, title, description and trailing slots · one control per row at most · not for comparing many attributes (use a table)."
      usedFor="Files, messages, settings, search results: sets of like things that people scan and open one at a time."
      tokens={{
        mode: 'consumed',
        note: 'The list has no component tokens.',
        rows: [
          { name: 'text.default · text.muted · text.link', tier: 'role', use: 'Row text; leading, trailing and description; the row control', swatch: '--ds-text-muted' },
          { name: 'border.default', tier: 'role', use: 'Divider between rows', swatch: '--ds-border-default' },
          { name: 'state.hover-layer · state.pressed-layer', tier: 'role', use: 'Hover and pressed fill of an interactive row', swatch: '--ds-state-hover-layer' },
          { name: 'state.selected · selection.surface', tier: 'role', use: 'Fill and bar of a selected row', swatch: '--ds-state-selected' },
          { name: 'disabled.text', tier: 'role', use: 'Label of a disabled row', swatch: '--ds-disabled-text' },
          { name: 'skeleton.base · skeleton.highlight', tier: 'role', use: 'Loading blocks', swatch: '--ds-skeleton-base' },
          { name: 'status.error · status.warning-surface · status.warning-text', tier: 'role', use: 'Error slot text; partial slot fill and text', swatch: '--ds-status-warning-surface' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Ring around the focused row', swatch: '--ds-focus-ring-color' },
          { name: 'text.body.* · text.label.* · text.caption.*', tier: '2', use: 'Row text, title and description' },
          { name: 'space.inset.sm · space.inset.md · space.inline.md · space.stack.*', tier: '2', use: 'Row padding and the gap between slots' },
          { name: 'size.target.min · size.border.thin · size.border.thick · size.icon.lg', tier: '2', use: 'Row height, divider, selection bar, skeleton leading' },
          { name: 'motion.duration.deliberate', tier: '2', use: 'Skeleton shimmer period' },
        ],
      }}
      anatomy={{
        render: <div style={{ inlineSize: 'calc(var(--ds-space-12) * 5)' }}><List aria-label="Files">{file(...FILES[0], { href: '#anatomy' })}</List></div>,
        parts: [
          { n: 1, label: 'Row', note: 'li, required', target: '.ds-list__item', at: 'top-start' },
          { n: 2, label: 'Leading', note: 'optional, not interactive', target: '.ds-list__leading' },
          { n: 3, label: 'Title', note: 'the link or button text, required', target: '.ds-list__control', at: 'top-end' },
          { n: 4, label: 'Description', note: 'optional', target: '.ds-list__description', at: 'bottom-start' },
          { n: 5, label: 'Trailing', note: 'optional, not interactive', target: '.ds-list__trailing', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Row height', value: 'at least size.target.min, 44px' },
        { label: 'Padding', value: 'space.inset.sm block · space.inset.md inline' },
        { label: 'Gap between slots', value: 'space.inline.md' },
        { label: 'Divider', value: 'size.border.thin in border.default, opt-in' },
        { label: 'Interactive target', value: 'the whole row, through one stretched link or button' },
        { label: 'Long text', value: 'wraps inside the row, never widens it' },
      ]}
      api={[
        { label: 'List: ordered · divided', value: 'ol instead of ul when order matters. divided draws a rule between rows.' },
        { label: 'List: loading · skeletonRows · loadingLabel', value: 'Skeleton rows shaped like the slots; aria-busy.' },
        { label: 'List: empty · error · partial', value: 'Slots for no rows, a failed load, and a load that returned some rows. The list imports no pattern.' },
        { label: 'ListItem: title · description', value: 'title is required and becomes the link or button text.' },
        { label: 'ListItem: leading · trailing', value: 'Static content only. The row has one control.' },
        { label: 'ListItem: href · onPress', value: 'href makes the row a link; onPress makes it a button. Neither: a static row.' },
        { label: 'ListItem: selected · disabled', value: 'selected sets aria-current on a link, aria-pressed on a button. disabled makes a native disabled button.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'designed', render: <div style={cell}><List empty={<Slot>Choose a folder to see its files.</Slot>} /></div>, trigger: 'no rows · empty', note: 'Before the first choice: the slot invites.' },
          { id: 'loading', status: 'designed', render: <div style={cell}><List loading skeletonRows={3} divided /></div>, trigger: 'loading', note: 'Blocks sit where the leading, title and description will be.' },
          { id: 'none', status: 'designed', render: <div style={cell}><List empty={<Slot>This folder has no files yet.</Slot>} /></div>, trigger: 'no rows · empty', note: 'No empty ul is rendered. The caller fills the slot.' },
          { id: 'one', status: 'designed', render: <div style={cell}><List aria-label="One file">{file(...FILES[0])}</List></div>, trigger: 'one ListItem' },
          { id: 'some', status: 'designed', render: <div style={cell}><List aria-label="Files" divided>{FILES.map(([name, note, size]) => file(name, note, size))}</List></div>, trigger: 'several ListItems', note: 'Static rows with dividers.' },
          { id: 'too-many', status: 'designed', label: 'Too many (long title)', render: <div style={cell}><List aria-label="Long"><ListItem title="Quarterly-inspection-report-final-revised-signed-2026-Q3-north-tower.pdf" description="A very long name wraps inside the row." trailing="4 MB" href="#long" /></List></div>, trigger: 'long title', note: 'The title wraps. The row keeps its width.' },
          { id: 'incorrect', status: 'designed', render: <div style={cell}><List error={<div style={{ display: 'grid', gap: 'var(--ds-space-2)', justifyItems: 'start' }}><Slot>The files did not load.</Slot><Button variant="secondary">Try again</Button></div>} /></div>, trigger: 'error', note: 'An alert with a retry.' },
          { id: 'correct', status: 'n/a', reason: 'A list takes no input. A row that saved shows it in its own slots.' },
          { id: 'done', status: 'n/a', reason: 'The view announces the result of an action on a row.' },
          { id: 'partial', status: 'designed', group: 'lifecycle', label: 'Partial', render: <div style={cell}><List partial={<Slot>2 of 5 files loaded. The rest could not be read.</Slot>}>{FILES.slice(0, 2).map(([name, note, size]) => file(name, note, size))}</List></div>, trigger: 'partial', note: 'The rows stay. A status says what is missing.' },
          { id: 'default', status: 'designed', render: <div style={cell}>{links()}</div>, trigger: 'href', note: 'Each row is one link. The target is the row.' },
          { id: 'hover', status: 'designed', render: <div style={cell}><Force cls="doc-force-hover" target=".ds-list__item--interactive">{links()}</Force></div>, trigger: ':hover', note: 'Forced on the first row.' },
          { id: 'focus-visible', status: 'designed', render: <div style={cell}><Force cls="doc-force-focus" target=".ds-list__control">{links()}</Force></div>, trigger: ':focus-visible', note: 'The ring goes around the row.' },
          { id: 'active', status: 'designed', render: <div style={cell}><Force cls="doc-force-active" target=".ds-list__item--interactive">{links()}</Force></div>, trigger: ':active', note: 'Forced on the first row.' },
          { id: 'disabled', status: 'designed', render: <div style={cell}><List aria-label="Actions"><ListItem title="Archive project" description="Only the owner can archive." onPress={() => undefined} disabled /></List></div>, trigger: 'disabled', note: 'A native disabled button. The description says why.' },
          { id: 'selected', status: 'designed', render: <div style={cell}>{links((index) => (index === 1 ? { selected: true } : {}))}</div>, trigger: 'selected', note: 'Fill and a bar. A link gets aria-current.' },
        ],
      }}
      dos={[
        { text: 'Make the whole row the target, with one link or one button.', basis: 'WCAG 2.5.8 (AA)' },
        { text: 'Use the title as the link text.', basis: 'WCAG 2.4.4 (A)' },
        { text: 'Use an ol when the order carries meaning.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Say why a row is disabled, in its description.', basis: 'Nielsen 1' },
      ]}
      donts={[
        { text: 'Put a button in the trailing slot of a linked row.', basis: 'WCAG 4.1.2 (A)', rule: 'list.one-control-per-row' },
        { text: 'Build the list from divs.', basis: 'WCAG 1.3.1 (A)', rule: 'list.semantic-list' },
        { text: 'Mark the selected row by colour alone.', basis: 'WCAG 1.4.1 (A)', rule: 'list.selected-not-colour-alone' },
        { text: 'Render an empty ul when there are no rows.', basis: 'WCAG 1.3.1 (A)', rule: 'list.state.none' },
        { text: 'Write a colour or px literal in list.css.', basis: 'misfile.raw-value-in-component', rule: 'list.no-literal' },
        { text: 'Label a link "Open" or "Details".', basis: 'WCAG 2.4.4 (A)', rule: 'list.title-names-row' },
      ]}
      rules={listRules}
      guide="data-structures-list--docs"
      guideName="List"
    />
  ),
};
