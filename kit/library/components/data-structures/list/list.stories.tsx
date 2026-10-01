import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Badge } from '../../feedback/badge/badge';
import { Button } from '../../clickables/button/button';
import { Pagination } from '../../navigation/pagination/pagination';
import { Icon } from '../../../primitives/icon/icon';
import { Text } from '../../../primitives/text/text';
import { List, ListItem } from './list';
import { listRules } from './list.rules';

// The showcase: one page story. The state matrix replaces one story per state.
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
          { name: 'space.inset.xs · space.inline.md · space.stack.*', tier: '2', use: 'Row padding and the gap between slots' },
          { name: 'size.control.md · size.border.thin · size.border.thick · size.icon.lg', tier: '2', use: 'Row height, divider, selection bar, skeleton leading' },
          { name: 'motion.duration.deliberate', tier: '2', use: 'Skeleton shimmer period' },
        ],
      }}
      stage={{
        render: (args) => (
          <div style={{ inlineSize: 'calc(var(--ds-space-12) * 5)' }}>
            <List aria-label="Files" ordered={args['List: ordered'] === true} divided={args['List: divided'] === true}>
              {file(String(args['ListItem: title']), String(args['ListItem: description']), String(args['ListItem: trailing']), {
                href: String(args['ListItem: href']),
                selected: args['ListItem: selected'] === true,
                disabled: args['ListItem: disabled'] === true,
              })}
            </List>
          </div>
        ),
        parts: [
          { n: 1, label: 'Row', note: 'li, required', target: '.ds-list__item', at: 'top-start' },
          { n: 2, label: 'Leading', note: 'optional, not interactive', target: '.ds-list__leading' },
          { n: 3, label: 'Title', note: 'the link or button text, required', target: '.ds-list__control', at: 'top-end' },
          { n: 4, label: 'Description', note: 'optional', target: '.ds-list__description', at: 'bottom-start' },
          { n: 5, label: 'Trailing', note: 'optional, not interactive', target: '.ds-list__trailing', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Row height', value: 'at least size.control.md, 32px; the target floor is size.target.min, 24px' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-list__item', token: 'space.inline.md' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-list__item', token: 'space.inset.xs' },
        { label: 'Gap between slots', property: 'gap', target: '.ds-list__item', token: 'space.inline.md' },
        { label: 'Divider', value: 'size.border.thin in border.default, opt-in' },
        { label: 'Interactive target', value: 'the whole row, through one stretched link or button' },
        { label: 'Long text', value: 'wraps inside the row, never widens it' },
      ]}
      api={[
        { label: 'List: ordered', value: 'ol instead of ul when order matters.', control: { kind: 'boolean', value: false } },
        { label: 'List: divided', value: 'Draws a rule between rows.', control: { kind: 'boolean', value: false } },
        { label: 'List: loading · skeletonRows · loadingLabel', value: 'Skeleton rows shaped like the slots; aria-busy.' },
        { label: 'List: empty · error · partial', value: 'Slots for no rows, a failed load, and a load that returned some rows. The list imports no pattern.' },
        { label: 'ListItem: title', value: 'Required. Becomes the link or button text.', control: { kind: 'text', value: FILES[0][0] } },
        { label: 'ListItem: description', value: 'An optional second line.', control: { kind: 'text', value: FILES[0][1] } },
        { label: 'ListItem: leading', value: 'Static content only, such as an icon. The row has one control.' },
        { label: 'ListItem: trailing', value: 'Static content only. The row has one control.', control: { kind: 'text', value: FILES[0][2] } },
        { label: 'ListItem: href', value: 'Makes the row a link. Without href or onPress, the row is static.', control: { kind: 'text', value: '#anatomy' } },
        { label: 'ListItem: onPress', value: 'Makes the row a button when there is no href.' },
        { label: 'ListItem: selected', value: 'Sets aria-current on a link, aria-pressed on a button.', control: { kind: 'boolean', value: false } },
        { label: 'ListItem: disabled', value: 'Makes a native disabled button.', control: { kind: 'boolean', value: false } },
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
      guide="data-structures-list--docs"
      guideName="List"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="List" layer="Component" family="Data structures" rules={listRules} guide="data-structures-list--docs" guideName="List" />,
};

function PickOneFile() {
  const [current, setCurrent] = useState('budget');
  return (
    <List aria-label="Files" divided>
      <ListItem title="Budget 2026" description="Spreadsheet · 2 MB" selected={current === 'budget'} onPress={() => setCurrent('budget')} />
      <ListItem title="Site plan" description="PDF · 8 MB" selected={current === 'plan'} onPress={() => setCurrent('plan')} />
      <ListItem title="Permit" description="PDF · 1 MB" selected={current === 'permit'} onPress={() => setCurrent('permit')} />
    </List>
  );
}

const SAMPLE_FILES = [
  { id: 'budget', name: 'Budget 2026', detail: 'Spreadsheet · 2 MB' },
  { id: 'plan', name: 'Site plan', detail: 'PDF · 8 MB' },
  { id: 'permit', name: 'Permit', detail: 'PDF · 1 MB' },
  { id: 'photos', name: 'Site photos', detail: 'Folder · 48 files' },
  { id: 'quote', name: 'Roofing quote', detail: 'PDF · 340 KB' },
  { id: 'contract', name: 'Contract', detail: 'PDF · 2 MB' },
  { id: 'invoice', name: 'Invoice 1042', detail: 'PDF · 120 KB' },
  { id: 'notes', name: 'Meeting notes', detail: 'Text · 12 KB' },
];

type ListState = 'loading' | 'empty' | 'error' | 'partial' | 'ready';

/** Switches one list through its data states, so the reader sees each one replace the rows. */
function ListLifecycle() {
  const [state, setState] = useState<ListState>('loading');
  const states: ListState[] = ['loading', 'empty', 'error', 'partial', 'ready'];
  const rows = state === 'ready' || state === 'partial' ? SAMPLE_FILES.slice(0, 3) : [];
  return (
    <Stack gap={3}>
      <Stack direction="horizontal" gap={2} wrap role="group" aria-label="List state">
        {states.map((name) => (
          <Button key={name} variant="secondary" aria-pressed={state === name} onClick={() => setState(name)}>{name}</Button>
        ))}
      </Stack>
      <List
        aria-label="Files"
        divided
        loading={state === 'loading'}
        empty={<Text>No files yet. Upload your first file.</Text>}
        error={
          state === 'error' && (
            <Stack gap={2} align="start">
              <Text>The files did not load.</Text>
              <Button variant="secondary" onClick={() => setState('loading')}>Try again</Button>
            </Stack>
          )
        }
        partial={state === 'partial' && <Text>5 files did not load.</Text>}
      >
        {rows.map((file) => <ListItem key={file.id} title={file.name} description={file.detail} />)}
      </List>
    </Stack>
  );
}

function PagedFiles() {
  const [page, setPage] = useState(1);
  const rows = SAMPLE_FILES.slice((page - 1) * 4, page * 4);
  return (
    <Stack gap={3}>
      <List aria-label="Files" divided>
        {rows.map((file) => <ListItem key={file.id} title={file.name} description={file.detail} href={`#${file.id}`} />)}
      </List>
      <Pagination label="Files pages" page={page} pageCount={2} onPageChange={setPage} total={`${(page - 1) * 4 + 1}–${Math.min(page * 4, SAMPLE_FILES.length)} of ${SAMPLE_FILES.length}`} />
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="List"
      layer="Component"
      family="Data structures"
      imports="import { Badge, Button, Icon, List, ListItem, Pagination, Stack, Text } from '@acme/design-system';"
      intro={[
        'A list is a stack of rows. Each row stands for one thing: a file, a message, a setting.',
        '`List` is the real HTML `ul` (bullet list) or `ol` (numbered list), and each `ListItem` is an `li`. Screen readers then announce "list, 3 items" and each position.',
        'A row has four slots: `leading` (an icon), `title` (the name), `description` (a line of detail) and `trailing` (a value or a badge). Only `title` is required.',
        'A row holds at most one control. Pass `href` and the row is a link; pass `onPress` and it is a button. The title is the control, and its click area covers the whole row.',
        '`leading` and `trailing` are for display only. Never put a button or a link in them.',
        'A list has data states: nothing, loading, none, one, some, many, error and partial. You pass the words. The list renders no `ul` when it has no rows.',
        'Names such as `files` or `openFile` stand for your own data and functions.',
      ]}
      guide="data-structures-list--docs"
      guideName="List"
      groups={[
        {
          title: 'Rows',
          kicker: 'One thing per row. The title names it; the other slots help people choose.',
          examples: [
            {
              title: 'Titles only',
              when: 'A plain set of like items that people read, not open.',
              explain: [
                'Each `ListItem` needs a `title`. It is the text people scan for.',
                '`aria-label` gives the list a name that screen readers read first: "Rooms, list, 3 items" (WCAG 1.3.1, A). Without it, the reader hears only "list".',
                'A row without `href` or `onPress` is static: no hover, no focus stop.',
              ],
              render: (
                <List aria-label="Rooms">
                  <ListItem title="Kitchen" />
                  <ListItem title="Garage" />
                  <ListItem title="Attic" />
                </List>
              ),
              code: `// aria-label: the name of the list, read aloud by screen readers.
<List aria-label="Rooms">
  <ListItem title="Kitchen" />
  <ListItem title="Garage" />
  <ListItem title="Attic" />
</List>`,
            },
            {
              title: 'Title and description',
              when: 'A second line of detail helps people pick: a size, a date, an owner.',
              explain: [
                '`description` sits under the title in smaller, muted text.',
                'Put in it what helps people choose between rows. Do not repeat the title.',
                'Keep the title as the name. People scan titles; they read descriptions only when they need to.',
              ],
              render: (
                <List aria-label="Files">
                  <ListItem title="Budget 2026" description="Spreadsheet · 2 MB" />
                  <ListItem title="Site plan" description="PDF · 8 MB" />
                  <ListItem title="Permit" description="PDF · 1 MB" />
                </List>
              ),
              code: `<List aria-label="Files">
  {/* description: one short line that helps people choose. */}
  <ListItem title="Budget 2026" description="Spreadsheet · 2 MB" />
  <ListItem title="Site plan" description="PDF · 8 MB" />
  <ListItem title="Permit" description="PDF · 1 MB" />
</List>`,
            },
            {
              title: 'Leading and trailing',
              when: 'An icon before the title and a value after it.',
              explain: [
                '`leading` is for a picture: an icon, an avatar. `trailing` is for a value, a badge or a chevron.',
                'Both are static. They are not clickable, because a row has one control.',
                '`Icon` without a `label` is decoration: assistive technology skips it. The title carries the meaning.',
              ],
              render: (
                <List aria-label="Files">
                  <ListItem leading={<Icon glyph="file" />} title="Budget 2026" description="Updated Monday" trailing="2 MB" />
                  <ListItem leading={<Icon glyph="folder" />} title="Site photos" description="Updated Friday" trailing="48 files" />
                </List>
              ),
              code: `<List aria-label="Files">
  {/* leading: decoration. The title still names the row. */}
  <ListItem leading={<Icon glyph="file" />} title="Budget 2026" description="Updated Monday" trailing="2 MB" />
  <ListItem leading={<Icon glyph="folder" />} title="Site photos" description="Updated Friday" trailing="48 files" />
</List>`,
            },
            {
              title: 'Badge as trailing',
              when: 'A status the reader scans for.',
              explain: [
                'A `Badge` carries a word and a colour, so the status is not told by colour alone (WCAG 1.4.1, A).',
                'Put the status at the end of the row. Readers scan down the right edge for it.',
              ],
              render: (
                <List aria-label="Orders">
                  <ListItem title="Order 1042" description="Aciers Laurentides" trailing={<Badge status="success">Shipped</Badge>} />
                  <ListItem title="Order 1043" description="Boulons Beauce" trailing={<Badge status="warning">Late</Badge>} />
                  <ListItem title="Order 1044" description="Cuivre du Nord" trailing={<Badge status="neutral">Draft</Badge>} />
                </List>
              ),
              code: `<List aria-label="Orders">
  <ListItem title="Order 1042" description="Aciers Laurentides" trailing={<Badge status="success">Shipped</Badge>} />
  <ListItem title="Order 1043" description="Boulons Beauce" trailing={<Badge status="warning">Late</Badge>} />
  <ListItem title="Order 1044" description="Cuivre du Nord" trailing={<Badge status="neutral">Draft</Badge>} />
</List>`,
            },
            {
              title: 'Rows from your data',
              when: 'The usual case: one row per item of an array.',
              explain: [
                '`map` turns each item into a `ListItem`. React needs a `key`: a stable id for each row, so it can update the right one.',
                'Use an id from your data, not the array position. Positions change when the data is sorted or filtered.',
              ],
              render: (
                <List aria-label="Files" divided>
                  {SAMPLE_FILES.slice(0, 3).map((file) => (
                    <ListItem key={file.id} title={file.name} description={file.detail} />
                  ))}
                </List>
              ),
              code: `<List aria-label="Files" divided>
  {files.map((file) => (
    // key: a stable id from the data, not the array index.
    <ListItem key={file.id} title={file.name} description={file.detail} />
  ))}
</List>`,
            },
          ],
        },
        {
          title: 'Structure',
          kicker: 'The list is a real ul or ol. Dividers are opt-in.',
          examples: [
            {
              title: 'Divided',
              when: 'Rows with descriptions run together without a rule between them.',
              explain: [
                '`divided` draws a thin line between rows.',
                'It is off by default, because empty space alone often separates rows well enough. Turn it on when each row has two lines.',
              ],
              render: (
                <List aria-label="Files" divided>
                  <ListItem title="Budget 2026" description="Spreadsheet · 2 MB" />
                  <ListItem title="Site plan" description="PDF · 8 MB" />
                  <ListItem title="Permit" description="PDF · 1 MB" />
                </List>
              ),
              code: `<List aria-label="Files" divided>
  <ListItem title="Budget 2026" description="Spreadsheet · 2 MB" />
  <ListItem title="Site plan" description="PDF · 8 MB" />
  <ListItem title="Permit" description="PDF · 1 MB" />
</List>`,
            },
            {
              title: 'Ordered',
              when: 'The order carries meaning: steps or a ranking.',
              explain: [
                '`ordered` renders an `ol` (numbered list) instead of a `ul`. Screen readers then announce "item 2 of 3".',
                'Use it only when changing the order would change the meaning. A list of files is not ordered.',
              ],
              render: (
                <List ordered aria-label="Steps" divided>
                  <ListItem title="Pour the foundation" />
                  <ListItem title="Frame the walls" />
                  <ListItem title="Close the roof" />
                </List>
              ),
              code: `// ordered: the sequence matters, so use an ol.
<List ordered aria-label="Steps" divided>
  <ListItem title="Pour the foundation" />
  <ListItem title="Frame the walls" />
  <ListItem title="Close the roof" />
</List>`,
            },
            {
              title: 'Named by nearby text',
              when: 'A heading above the list already names it.',
              explain: [
                '`aria-labelledby` points at the `id` of the heading. The heading text becomes the list name.',
                'This avoids writing the name twice. If the heading changes, the list name changes too (WCAG 1.3.1, A).',
              ],
              render: (
                <Stack gap={2}>
                  <Text as="h3" id="rooms-heading">Rooms</Text>
                  <List aria-labelledby="rooms-heading">
                    <ListItem title="Kitchen" />
                    <ListItem title="Garage" />
                  </List>
                </Stack>
              ),
              code: `<Stack gap={2}>
  <Text as="h3" id="rooms-heading">Rooms</Text>
  {/* The list takes its name from the heading with that id. */}
  <List aria-labelledby="rooms-heading">
    <ListItem title="Kitchen" />
    <ListItem title="Garage" />
  </List>
</Stack>`,
            },
          ],
        },
        {
          title: 'Interactive rows',
          kicker: 'A row holds one control. The title is its text and its click area covers the row.',
          examples: [
            {
              title: 'Link rows',
              when: 'Each row opens a page: files, messages, search results.',
              explain: [
                '`href` makes the title a link and stretches the link over the whole row. A big target is easy to hit (WCAG 2.5.8, AA).',
                'The row has one tab stop, so keyboard users move row by row. The focus ring goes around the whole row (WCAG 2.4.7, AA).',
                'The title is the link text. A list of links reads "Welcome to the project", not "Open" (WCAG 2.4.4, A).',
              ],
              render: (
                <List aria-label="Messages" divided>
                  <ListItem title="Welcome to the project" description="Marie · 9:41" href="#welcome" />
                  <ListItem title="Permit approved" description="Jean · Yesterday" href="#permit" />
                  <ListItem title="Cabinet delivery" description="Aciers Laurentides · Monday" href="#delivery" />
                </List>
              ),
              code: `<List aria-label="Messages" divided>
  {/* href: the row is a link named by its title. */}
  <ListItem title="Welcome to the project" description="Marie · 9:41" href="/messages/welcome" />
  <ListItem title="Permit approved" description="Jean · Yesterday" href="/messages/permit" />
  <ListItem title="Cabinet delivery" description="Aciers Laurentides · Monday" href="/messages/delivery" />
</List>`,
            },
            {
              title: 'Link rows with a chevron',
              when: 'A trailing arrow hints that the row opens something.',
              explain: [
                'The chevron is decoration. It sits in `trailing`, so it is not a second control.',
                'It points toward the end of the line and flips in a right-to-left language by itself.',
              ],
              render: (
                <List aria-label="Settings" divided>
                  <ListItem title="Account" href="#account" trailing={<Icon glyph="chevron-right" />} />
                  <ListItem title="Notifications" href="#notifications" trailing={<Icon glyph="chevron-right" />} />
                </List>
              ),
              code: `<List aria-label="Settings" divided>
  <ListItem title="Account" href="/settings/account" trailing={<Icon glyph="chevron-right" />} />
  <ListItem title="Notifications" href="/settings/notifications" trailing={<Icon glyph="chevron-right" />} />
</List>`,
            },
            {
              title: 'Current page',
              when: 'The row is the page the reader is on.',
              explain: [
                '`selected` on a link row sets `aria-current="true"`. Screen readers say "current".',
                'The row also shows a fill and a bar at its start edge, so the state does not rest on colour alone (WCAG 1.4.1, A).',
                'For site navigation, use a nav landmark. A list of links is not a navigation menu.',
              ],
              render: (
                <List aria-label="Settings" divided>
                  <ListItem title="Account" href="#account" selected />
                  <ListItem title="Notifications" href="#notifications" />
                  <ListItem title="Privacy" href="#privacy" />
                </List>
              ),
              code: `<List aria-label="Settings" divided>
  {/* selected + href: marked as the current page. */}
  <ListItem title="Account" href="/settings/account" selected />
  <ListItem title="Notifications" href="/settings/notifications" />
  <ListItem title="Privacy" href="/settings/privacy" />
</List>`,
            },
            {
              title: 'Button rows',
              when: 'A row runs an action in the view, such as picking an item.',
              explain: [
                '`onPress` makes the title a button. Space and Enter run it.',
                'Use `href` to go to a page and `onPress` to do something here. If you pass both, `href` wins.',
              ],
              render: (
                <List aria-label="Templates" divided>
                  <ListItem title="Blank project" description="Start from nothing" onPress={() => undefined} />
                  <ListItem title="Renovation" description="Rooms, budget and permits" onPress={() => undefined} />
                </List>
              ),
              code: `<List aria-label="Templates" divided>
  {/* onPress: the row is a button. It runs here, no page change. */}
  <ListItem title="Blank project" description="Start from nothing" onPress={() => createProject('blank')} />
  <ListItem title="Renovation" description="Rooms, budget and permits" onPress={() => createProject('renovation')} />
</List>`,
            },
            {
              title: 'Pick one row',
              when: 'The reader picks one item from the set.',
              explain: [
                'You hold the choice in state. `selected` marks the chosen row, and `onPress` updates the state.',
                'On a button row, `selected` sets `aria-pressed="true"`, so a screen reader says "pressed".',
                'The chosen row has a fill and a bar, not only a colour (WCAG 1.4.1, A).',
              ],
              render: <PickOneFile />,
              code: `function PickOneFile() {
  const [current, setCurrent] = useState('budget');
  return (
    <List aria-label="Files" divided>
      {/* selected is true for one row at a time. */}
      <ListItem title="Budget 2026" description="Spreadsheet · 2 MB" selected={current === 'budget'} onPress={() => setCurrent('budget')} />
      <ListItem title="Site plan" description="PDF · 8 MB" selected={current === 'plan'} onPress={() => setCurrent('plan')} />
      <ListItem title="Permit" description="PDF · 1 MB" selected={current === 'permit'} onPress={() => setCurrent('permit')} />
    </List>
  );
}`,
            },
            {
              title: 'Disabled, with the reason',
              when: 'A row cannot be opened yet.',
              explain: [
                '`disabled` makes the row a native disabled button. It leaves the tab order and cannot be pressed.',
                'Put the reason in `description`, in words. A greyed row with no reason is a dead end (Nielsen heuristic 1, visibility of system status).',
                'Disabled text is exempt from the contrast rule (WCAG 1.4.3), so the reason must still be readable.',
              ],
              render: (
                <List aria-label="Reports" divided>
                  <ListItem title="Monthly report" description="Ready" href="#monthly" />
                  <ListItem title="Annual report" description="Available in January" onPress={() => undefined} disabled />
                </List>
              ),
              code: `<List aria-label="Reports" divided>
  <ListItem title="Monthly report" description="Ready" href="/reports/monthly" />
  {/* The description says why, and when it will work. */}
  <ListItem title="Annual report" description="Available in January" onPress={openAnnual} disabled />
</List>`,
            },
          ],
        },
        {
          title: 'The data lifecycle',
          kicker: 'Data goes through stages. Each stage needs its own message, or the reader sees a blank space and cannot tell why.',
          examples: [
            {
              title: 'Nothing: first use',
              when: 'No row exists yet. Invite the reader to start.',
              explain: [
                'With no rows, `List` renders no `ul`. An empty list would be announced as "list, 0 items", which helps nobody (WCAG 1.3.1, A).',
                '`empty` shows in its place. You write the words, because only you know the next step.',
                'Give a clear first step and a button. Why it matters: a blank screen looks broken, and new users do not know what to do.',
              ],
              render: <List aria-label="Files" empty={<Stack gap={2} align="start"><Text>No files yet. Upload your first file.</Text><Button variant="secondary">Upload a file</Button></Stack>} />,
              code: `// No rows: the list shows empty and draws no <ul>.
<List
  aria-label="Files"
  empty={
    <Stack gap={2} align="start">
      <Text>No files yet. Upload your first file.</Text>
      <Button variant="secondary" onClick={upload}>Upload a file</Button>
    </Stack>
  }
>
  {files.map((file) => <ListItem key={file.id} title={file.name} />)}
</List>`,
            },
            {
              title: 'None: no match',
              when: 'A search or filter returned nothing.',
              explain: [
                'The same `empty` slot, with different words. First use says "start here"; no match says "your filter found nothing".',
                'Repeat the term the reader typed, so they see what was searched. Suggest a way out: clear the filter.',
                'Why it matters: "No files yet" after a search is wrong. The reader thinks their data is gone.',
              ],
              render: <List aria-label="Files" empty={<Text>No files match “permit”.</Text>} />,
              code: `// Pick the words from the cause: first use, or no match.
<List aria-label="Files" empty={<Text>No files match “{query}”.</Text>}>
  {matches.map((file) => <ListItem key={file.id} title={file.name} />)}
</List>`,
            },
            {
              title: 'Loading',
              when: 'The rows are on their way.',
              explain: [
                '`loading` draws grey placeholder rows with the shape of the slots. The page does not jump when the data arrives (Nielsen heuristic 1, visibility of system status).',
                'The list sets `aria-busy="true"` and a hidden "Loading items" phrase for screen readers.',
                'The shimmer stops for people who ask for less motion (`prefers-reduced-motion`, WCAG 2.3.3, AAA).',
              ],
              render: <List aria-label="Files" loading />,
              code: `// loading: three placeholder rows by default.
<List aria-label="Files" loading={isLoading}>
  {files.map((file) => <ListItem key={file.id} title={file.name} />)}
</List>`,
            },
            {
              title: 'Loading, with a known count',
              when: 'You know about how many rows will arrive.',
              explain: [
                '`skeletonRows` sets how many placeholder rows to draw. The default is 3.',
                'A close match makes the page change less when the real rows arrive.',
              ],
              render: <List aria-label="Files" loading skeletonRows={5} />,
              code: `<List aria-label="Files" loading={isLoading} skeletonRows={5}>
  {files.map((file) => <ListItem key={file.id} title={file.name} />)}
</List>`,
            },
            {
              title: 'Loading, in another language',
              when: 'The app is not in English.',
              explain: [
                '`loadingLabel` is read aloud, never shown. Its default is "Loading items".',
                'Pass your own language, or a screen reader speaks English on a French page.',
              ],
              render: <List aria-label="Fichiers" loading loadingLabel="Chargement des fichiers" />,
              code: `<List aria-label="Fichiers" loading={isLoading} loadingLabel="Chargement des fichiers">
  {files.map((file) => <ListItem key={file.id} title={file.name} />)}
</List>`,
            },
            {
              title: 'One row',
              when: 'The set has a single item.',
              explain: [
                'It is still a list. Do not switch to a different layout for one item: the page would change shape when a second item arrives.',
                'Screen readers announce "list, 1 item", so the reader knows there is only one.',
              ],
              render: (
                <List aria-label="Rooms">
                  <ListItem title="Kitchen" />
                </List>
              ),
              code: `<List aria-label="Rooms">
  <ListItem title="Kitchen" />
</List>`,
            },
            {
              title: 'Some rows',
              when: 'The normal case: a handful of rows.',
              explain: [
                'This is the list as designed. People scan the titles down one column and open one.',
                'See "Rows" above for the slots and "Interactive rows" for links and buttons.',
              ],
              render: (
                <List aria-label="Files" divided>
                  {SAMPLE_FILES.slice(0, 3).map((file) => (
                    <ListItem key={file.id} title={file.name} description={file.detail} href={`#${file.id}`} />
                  ))}
                </List>
              ),
              code: `<List aria-label="Files" divided>
  {files.map((file) => (
    <ListItem key={file.id} title={file.name} description={file.detail} href={file.url} />
  ))}
</List>`,
            },
            {
              title: 'Many rows: page them',
              when: 'More rows than fit on one screen.',
              explain: [
                'The list draws every row it gets. It does not page. You slice the rows and pass one page at a time.',
                'Add `Pagination` under the list. It tells the reader where they are ("1–4 of 8") and moves between pages.',
                'Why it matters: a very long list is slow to scroll and hard to scan. Pages keep the focus on a few rows.',
              ],
              render: <PagedFiles />,
              code: `function PagedFiles() {
  const [page, setPage] = useState(1);
  // Take one page of four rows from the full data.
  const rows = files.slice((page - 1) * 4, page * 4);
  return (
    <Stack gap={3}>
      <List aria-label="Files" divided>
        {rows.map((file) => (
          <ListItem key={file.id} title={file.name} description={file.detail} href={file.url} />
        ))}
      </List>
      <Pagination
        label="Files pages"
        page={page}
        pageCount={Math.ceil(files.length / 4)}
        onPageChange={setPage}
        total={\`\${(page - 1) * 4 + 1}–\${Math.min(page * 4, files.length)} of \${files.length}\`}
      />
    </Stack>
  );
}`,
            },
            {
              title: 'Error with a retry',
              when: 'The rows failed to load.',
              explain: [
                '`error` replaces the rows. It has `role="alert"`, so a screen reader may read it at once. The alert mounts together with its message, and such a region is not always read (WCAG 4.1.3, AA).',
                'Say what failed in plain words, and add a retry button. Without one, the reader is stuck (Nielsen heuristic 9, help users recover from errors).',
                'Why it matters: a list that stays blank after a failure looks like it is still loading.',
              ],
              render: <List aria-label="Files" error={<Stack gap={2} align="start"><Text>The files did not load.</Text><Button variant="secondary">Try again</Button></Stack>} />,
              code: `<List
  aria-label="Files"
  error={
    <Stack gap={2} align="start">
      <Text>The files did not load.</Text>
      {/* retry runs your request again. */}
      <Button variant="secondary" onClick={retry}>Try again</Button>
    </Stack>
  }
/>`,
            },
            {
              title: 'Partial: some rows missing',
              when: 'Some rows loaded and some did not.',
              explain: [
                'Keep the rows you have. `partial` adds a status line under them that says what is missing.',
                'It has `role="status"`, which a screen reader may read politely. It mounts with its text, so it is not always read. The reader keeps their work and learns what they lack.',
                'Why it matters: hiding all rows for one failure throws away data the reader could use.',
              ],
              render: (
                <List aria-label="Files" divided partial={<Text>3 files did not load.</Text>}>
                  <ListItem title="Budget 2026" description="Spreadsheet · 2 MB" />
                  <ListItem title="Site plan" description="PDF · 8 MB" />
                </List>
              ),
              code: `<List aria-label="Files" divided partial={<Text>3 files did not load.</Text>}>
  <ListItem title="Budget 2026" description="Spreadsheet · 2 MB" />
  <ListItem title="Site plan" description="PDF · 8 MB" />
</List>`,
            },
            {
              title: 'All states in one component',
              when: 'Your real list loads data. Press each state to see what changes.',
              explain: [
                'Map your request status to the props. The list does not fetch: you do.',
                'Pass `loading`, `empty`, `error` and `partial` together. Only the one that applies shows.',
                'Press "error", then "Try again": the retry returns to loading, as your own retry would.',
              ],
              render: <ListLifecycle />,
              code: `function FileList({ status, files, retry }) {
  // status: 'loading' | 'error' | 'partial' | 'ready', from your data hook.
  return (
    <List
      aria-label="Files"
      divided
      loading={status === 'loading'}
      empty={<Text>No files yet. Upload your first file.</Text>}
      error={
        status === 'error' && (
          <Stack gap={2} align="start">
            <Text>The files did not load.</Text>
            <Button variant="secondary" onClick={retry}>Try again</Button>
          </Stack>
        )
      }
      partial={status === 'partial' && <Text>5 files did not load.</Text>}
    >
      {/* An empty array shows the empty slot. */}
      {files.map((file) => <ListItem key={file.id} title={file.name} description={file.detail} />)}
    </List>
  );
}`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'Titles and descriptions wrap inside the row. A long name never widens it.',
          examples: [
            {
              title: 'Long title and description',
              when: 'Long file names, unbroken references and translated text.',
              explain: [
                'Text wraps onto more lines, even a long word with no spaces. The row never gets wider than its column (WCAG 1.4.10, AA).',
                'Never truncate with "…". The end of a file name is often the part that tells two files apart.',
              ],
              frame: 'narrow',
              render: (
                <List aria-label="Files" divided>
                  <ListItem leading={<Icon glyph="file" />} title="Quarterly-inspection-report-final-revised-signed-2026-Q3-north-tower" description="INSPECTION-2026-Q3-NORTH-TOWER-LEVEL-14-SECTION-C" trailing="2 MB" href="#report" />
                </List>
              ),
              code: `// No truncation prop, by design: long text wraps.
<List aria-label="Files" divided>
  <ListItem
    leading={<Icon glyph="file" />}
    title="Quarterly-inspection-report-final-revised-signed-2026-Q3-north-tower"
    description="INSPECTION-2026-Q3-NORTH-TOWER-LEVEL-14-SECTION-C"
    trailing="2 MB"
    href="/files/report"
  />
</List>`,
            },
            {
              title: 'On a phone',
              when: 'A row at phone width.',
              explain: [
                'A row spans its container, so the whole row stays one wide target for a thumb.',
                'The slots stay in the same order. Nothing is hidden on a small screen.',
              ],
              frame: 'phone',
              render: (
                <List aria-label="Messages" divided>
                  <ListItem leading={<Icon glyph="mail" />} title="Welcome to the project" description="Marie · 9:41" trailing={<Badge status="info">New</Badge>} href="#welcome" />
                  <ListItem leading={<Icon glyph="mail" />} title="Permit approved" description="Jean · Yesterday" href="#permit" />
                </List>
              ),
              code: `<List aria-label="Messages" divided>
  <ListItem
    leading={<Icon glyph="mail" />}
    title="Welcome to the project"
    description="Marie · 9:41"
    trailing={<Badge status="info">New</Badge>}
    href="/messages/welcome"
  />
  <ListItem leading={<Icon glyph="mail" />} title="Permit approved" description="Jean · Yesterday" href="/messages/permit" />
</List>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The title is the link text. Never label a row "Open" or "Details".',
          examples: [
            {
              title: 'Name for the whole list',
              when: 'Nearby text does not name the list.',
              explain: [
                '`aria-label` names the list for screen readers: "Recent messages, list, 2 items".',
                'Give every list a name. Without one, a page with three lists reads "list, list, list".',
              ],
              render: (
                <List aria-label="Recent messages">
                  <ListItem title="Welcome to the project" href="#welcome" />
                  <ListItem title="Permit approved" href="#permit" />
                </List>
              ),
              code: `<List aria-label="Recent messages">
  {/* The title is the link text: say what it opens. */}
  <ListItem title="Welcome to the project" href="/messages/welcome" />
  <ListItem title="Permit approved" href="/messages/permit" />
</List>`,
            },
          ],
        },
      ]}
    />
  ),
};
