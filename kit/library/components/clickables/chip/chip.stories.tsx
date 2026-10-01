import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Chip } from './chip';
import type { ChipVariant } from './chip';
import { chipRules } from './chip.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Clickables/Chip', component: Chip, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Chip>;

export default meta;

const VARIANTS = ['static', 'removable', 'selectable'] as const satisfies readonly ChipVariant[];

const LONG = 'Customer: Maria del Carmen Guadalupe de los Santos Fernandez-Villalobos';
const row = (children: ReactNode) => <Stack direction="horizontal" gap={3} align="center" wrap>{children}</Stack>;
const filter = (name: string, value: string) => <Chip variant="removable" removeLabel="Remove filter">{`${name}: ${value}`}</Chip>;
const MANY: readonly [string, string][] = [['Status', 'Shipped'], ['Region', 'Asia'], ['Customer', 'Ada Lovelace'], ['Total', 'Over $100'], ['Returns', 'Only orders with a return'], ['Carrier', 'Northwind Freight'], ['Priority', 'Express']];

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Chip"
      layer="Component"
      family="Clickables"
      plain="A chip is a small pill that holds one value the user chose, such as a filter. It can carry a button to remove that value, or it can switch on and off."
      precise="Component in the clickables family · three variants: static, removable, selectable · a removable chip is one outlined shape that holds its label and a native remove button · selectable is a native toggle button with aria-pressed."
      usedFor="Showing the active filters of a list, each with its own remove button; toggling a filter on or off in a row of choices."
      tokens={{
        mode: 'consumed',
        note: 'The chip has no component tokens.',
        rows: [
          { name: 'border.default · border.strong', tier: 'role', use: 'Outline of a static chip; outline of a pressable chip (3:1)', swatch: '--ds-border-strong' },
          { name: 'surface.sunken · surface.default', tier: 'role', use: 'Fill of a static chip; fill of a pressable chip', swatch: '--ds-surface-sunken' },
          { name: 'selection.surface · selection.text', tier: 'role', use: 'Fill and text of a selected chip', swatch: '--ds-selection-surface' },
          { name: 'state.hover-layer · state.pressed-layer', tier: 'role', use: 'Hover and pressed fill of an unselected selectable chip', swatch: '--ds-state-hover-layer' },
          { name: 'disabled.text · disabled.surface · disabled.border', tier: 'role', use: 'Disabled label, fill and outline', swatch: '--ds-disabled-surface' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator', swatch: '--ds-focus-ring-color' },
          { name: 'text.label.*', tier: '2', use: 'Label size, weight and line height' },
          { name: 'space.inline.lg · space.control.gap · space.8', tier: '2', use: 'Side padding, gap to the check icon, height of a static chip' },
          { name: 'size.control.md · size.border.thin', tier: '2', use: 'Height of a pressable chip: 32px plus its two outline widths. The target is at least size.target.min (24px)' },
          { name: 'size.overlay.sm', tier: '2', use: 'Widest label before it truncates' },
          { name: 'radius.pill · radius.full', tier: '2', use: 'Chip outline; round remove button' },
        ],
      }}
      stage={{
        render: (args) => (
          <Chip variant={args.variant as ChipVariant} removeLabel={String(args.removeLabel)} selected={args.selected === true} disabled={args.disabled === true}>
            {String(args.children)}
          </Chip>
        ),
        parts: [
          { n: 1, label: 'Container', note: 'one outlined pill, required', target: '.ds-chip', at: 'top-start' },
          { n: 2, label: 'Label', note: 'children, required; truncates with a tooltip', target: '.ds-chip__label' },
          { n: 3, label: 'Remove button', note: 'removable only; named "Remove filter …"', target: '.ds-chip__remove', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Height', value: 'static: size.control.sm (24px) · pressable: size.control.md (32px) plus the outline' },
        { label: 'Padding', value: 'space.inline.lg on each side; none after the remove button, which fills the end' },
        { label: 'Radius', property: 'radius', target: '.ds-chip', token: 'radius.pill', value: 'the remove button is radius.full' },
        { label: 'Label', value: 'text.label.*, one line, ellipsis past size.overlay.sm' },
        { label: 'Focus', value: 'ring 2px, offset 2px, on the button or the cut label' },
        { label: 'Wrap', value: 'a row of chips wraps: put them in a Stack with wrap' },
      ]}
      api={[
        { label: 'variant', value: '"static" | "removable" | "selectable", default "static".', control: { kind: 'select', options: VARIANTS, value: 'removable' } },
        { label: 'children', value: 'The visible text, a string. It stays whole in the accessible name.', control: { kind: 'text', value: 'Status: Shipped' } },
        { label: 'removeLabel', value: 'Removable. The words before the label in the button name, default "Remove"; pass "Remove filter" for "Remove filter Status: Shipped".', control: { kind: 'text', value: 'Remove filter' } },
        { label: 'onRemove', value: 'Removable. Called when the remove button is pressed.' },
        { label: 'selected', value: 'Selectable. aria-pressed follows selected.', control: { kind: 'boolean', value: false } },
        { label: 'defaultSelected · onSelectedChange', value: 'Selectable. The chip keeps its own state when selected is not set. onSelectedChange gets the new state on a press.' },
        { label: 'disabled', value: 'Native disabled on the button. Say why, near the chip.', control: { kind: 'boolean', value: false } },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'The chip exists because a value exists; with none, there is no chip.' },
          { id: 'loading', status: 'n/a', reason: 'A chip shows a value already chosen. The view shows the loading of the results.' },
          { id: 'none', status: 'n/a', reason: 'The chip holds no collection. A row of chips with none shows nothing.' },
          { id: 'one', status: 'designed', render: row(filter('Status', 'Shipped')), trigger: 'one chip', note: 'A single chip keeps the same size as in a row.' },
          { id: 'some', status: 'designed', render: row(<>{filter('Status', 'Shipped')}{filter('Region', 'Asia')}<Chip>Static value</Chip></>), trigger: 'a few chips' },
          {
            id: 'too-many',
            status: 'designed',
            label: 'Too many (wrap, long label)',
            render: (
              <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 8)' }}>
                {row(<>{MANY.map(([name, value]) => <span key={name}>{filter(name, value)}</span>)}<Chip variant="removable" removeLabel="Remove filter">{LONG}</Chip></>)}
              </div>
            ),
            trigger: 'many chips, one long label',
            note: 'Chips wrap onto new lines. A long label cuts with an ellipsis; hover or focus shows it whole.',
          },
          { id: 'incorrect', status: 'n/a', reason: 'A chip does not validate. The field that made it owns the error.' },
          { id: 'correct', status: 'n/a', reason: 'The view confirms the effect in its result count.' },
          { id: 'done', status: 'n/a', reason: 'The view announces the removal in a status message and moves focus.' },
          {
            id: 'default',
            status: 'designed',
            render: (
              <Stack gap={3} align="center">
                {row(<><Chip>Static</Chip>{filter('Status', 'Shipped')}<Chip variant="selectable">Selectable</Chip></>)}
              </Stack>
            ),
            trigger: 'variant',
            note: 'Static, removable, selectable.',
          },
          { id: 'hover', status: 'designed', render: <Chip variant="selectable" className="doc-force-hover">Selectable</Chip>, trigger: ':hover', note: 'Forced by .doc-force-hover. The remove button of a removable chip follows the icon button.' },
          { id: 'focus-visible', status: 'designed', render: <Chip variant="selectable" className="doc-force-focus">Selectable</Chip>, trigger: ':focus-visible', note: 'Forced by .doc-force-focus.' },
          { id: 'active', status: 'designed', render: <Chip variant="selectable" className="doc-force-active">Selectable</Chip>, trigger: ':active', note: 'Forced by .doc-force-active.' },
          { id: 'disabled', status: 'designed', render: row(<><Chip variant="selectable" disabled>Archived</Chip><Chip variant="removable" disabled>Status: Shipped</Chip></>), trigger: 'disabled', note: 'Say why, near the chips.' },
          { id: 'selected', status: 'designed', render: <Chip variant="selectable" defaultSelected>Only orders with a return</Chip>, trigger: 'aria-pressed="true"', note: 'Fill, text role and a check: colour is not the only cue.' },
        ],
      }}
      dos={[
        { text: 'Name a remove button with the value it removes: "Remove filter Status: Shipped".', basis: 'WCAG 4.1.2 (A); 2.4.6 (AA)' },
        { text: 'Keep the label and the remove button inside one outline.', basis: 'Gestalt common region' },
        { text: 'Let a row of chips wrap onto new lines.', basis: 'WCAG 1.4.10 (AA)' },
        { text: 'Show a check on a selected chip as well as the fill.', basis: 'WCAG 1.4.1 (A)' },
      ]}
      donts={[
        { text: 'Label a remove button "×" or "Remove".', basis: 'WCAG 4.1.2 (A)', rule: 'chip.removable-labelled' },
        { text: 'Draw the label and the remove button as two bordered controls.', basis: 'Gestalt common region', rule: 'chip.one-shape' },
        { text: 'Shrink the remove button below the 24px floor.', basis: 'WCAG 2.5.8 (AA); 24px house floor', rule: 'chip.touch-target' },
        { text: 'Show selection by colour alone.', basis: 'WCAG 1.4.1 (A)', rule: 'chip.selected-not-colour-alone' },
        { text: 'Cut a long label with no way to read it whole.', basis: 'WCAG 1.4.13 (AA)', rule: 'chip.truncate-tooltip' },
        { text: 'Write a colour literal in chip.css.', basis: 'misfile.raw-value-in-component', rule: 'chip.no-literal' },
      ]}
      guide="clickables-chip--docs"
      guideName="Chip"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Chip" layer="Component" family="Clickables" rules={chipRules} guide="clickables-chip--docs" guideName="Chip" />,
};

const FILTERS = ['Status: Shipped', 'Owner: Dana', 'Region: Europe'] as const;

/** A filter bar: each active filter is a removable chip, and removing one is announced in a status region. */
function FilterBar() {
  const [filters, setFilters] = useState<readonly string[]>(FILTERS);
  const [status, setStatus] = useState('');
  const remove = (filter: string) => {
    setFilters(filters.filter((item) => item !== filter));
    setStatus(`Removed filter ${filter}.`);
  };
  return (
    <Stack gap={2} align="start">
      <Stack as="ul" direction="horizontal" gap={2} wrap aria-label="Active filters">
        {filters.map((filter) => (
          <li key={filter}>
            <Chip variant="removable" removeLabel="Remove filter" onRemove={() => remove(filter)}>{filter}</Chip>
          </li>
        ))}
      </Stack>
      <Text variant="caption" tone="muted" as="p" role="status">{status || `${filters.length} filters active.`}</Text>
    </Stack>
  );
}

/** A chip row where the view owns the selection, so it can be shown, reset or saved. */
function ControlledChips() {
  const [selected, setSelected] = useState<readonly string[]>(['Open']);
  const toggle = (name: string, on: boolean) => setSelected(on ? [...selected, name] : selected.filter((item) => item !== name));
  return (
    <Stack gap={2} align="start">
      <Stack direction="horizontal" gap={2} wrap role="group" aria-label="Ticket status">
        {['Open', 'Blocked', 'Done'].map((name) => (
          <Chip key={name} variant="selectable" selected={selected.includes(name)} onSelectedChange={(on) => toggle(name, on)}>{name}</Chip>
        ))}
      </Stack>
      <Text variant="caption" tone="muted" as="p" role="status">{selected.length > 0 ? `Showing: ${selected.join(', ')}.` : 'Showing all tickets.'}</Text>
    </Stack>
  );
}

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Chip"
      layer="Component"
      family="Clickables"
      imports="import { Chip, Stack, Text } from '@acme/design-system';"
      guide="clickables-chip--docs"
      guideName="Chip"
      groups={[
        {
          title: 'Variants',
          kicker: 'The variant says what the user can do with the value.',
          examples: [
            { title: 'Static', when: 'A value that is shown and never changed, such as a tag on a record.', render: <Chip>Design system</Chip> },
            { title: 'Removable', when: 'An active filter the user can take off on its own.', render: <Chip variant="removable" removeLabel="Remove filter" onRemove={() => {}}>Status: Shipped</Chip> },
            { title: 'Selectable', when: 'A filter the user switches on and off in a short row.', render: <Chip variant="selectable">Assigned to me</Chip> },
          ],
        },
        {
          title: 'States',
          kicker: 'Only the removable and selectable variants are pressed, so only they have a pressed or disabled look.',
          examples: [
            { title: 'Selected, uncontrolled', when: 'The chip starts on and the user can switch it off.', render: <Chip variant="selectable" defaultSelected>Assigned to me</Chip> },
            { title: 'Selected, controlled', when: 'The view owns the state, so it can show or reset it.', render: <Chip variant="selectable" selected onSelectedChange={() => {}}>Assigned to me</Chip> },
            { title: 'Disabled, selectable', when: 'The filter does not apply to the current view.', render: <Chip variant="selectable" disabled>Assigned to me</Chip> },
            { title: 'Disabled, selected', when: 'A filter is locked on by something else, such as a saved view.', render: <Chip variant="selectable" disabled defaultSelected>Assigned to me</Chip> },
            { title: 'Disabled, removable', when: 'The filter stays visible but the user cannot remove it now.', render: <Chip variant="removable" disabled onRemove={() => {}}>Status: Shipped</Chip> },
          ],
        },
        {
          title: 'Content',
          kicker: 'The label is one line. A long one ends in an ellipsis and a Tooltip shows the rest.',
          examples: [
            { title: 'Long label, static', when: 'A value longer than the maximum width. Hover or focus shows the full text.', frame: 'narrow', render: <Chip>Quarterly planning workshop with the platform team</Chip> },
            { title: 'Long label, removable', when: 'A long filter value. The remove button name keeps the whole text.', frame: 'narrow', render: <Chip variant="removable" removeLabel="Remove filter" onRemove={() => {}}>Owner: Alexandria Montgomery-Fitzgerald</Chip> },
            { title: 'Long label, selectable', when: 'A long choice in a toggle row.', frame: 'narrow', render: <Chip variant="selectable">Waiting for a reply from the customer</Chip> },
            { title: 'Translated remove label', when: 'The app is not in English: pass the words before the label in the remove button name.', render: <Chip variant="removable" removeLabel="Supprimer le filtre" onRemove={() => {}}>Statut : Expédié</Chip> },
            { title: 'Long translated label on a phone', when: 'A long French label in a narrow column.', frame: 'phone', render: <Chip variant="selectable">Livraison express sous vingt-quatre heures</Chip> },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Put a row of chips in a Stack with wrap, as a list, so a screen reader counts them.',
          examples: [
            {
              title: 'Row of static chips',
              when: 'Several tags on one record. They flow onto new lines and never scroll sideways.',
              frame: 'phone',
              render: (
                <Stack as="ul" direction="horizontal" gap={2} wrap aria-label="Tags">
                  <li><Chip>Design system</Chip></li>
                  <li><Chip>Accessibility</Chip></li>
                  <li><Chip>Tokens</Chip></li>
                  <li><Chip>Documentation</Chip></li>
                </Stack>
              ),
            },
            {
              title: 'Row of selectable chips',
              when: 'A few independent toggles. They are not a choice of one; for that, use a radio group.',
              frame: 'phone',
              render: (
                <Stack direction="horizontal" gap={2} wrap role="group" aria-label="Show tickets">
                  <Chip variant="selectable" defaultSelected>Open</Chip>
                  <Chip variant="selectable">Blocked</Chip>
                  <Chip variant="selectable">Done</Chip>
                </Stack>
              ),
            },
            {
              title: 'Mixed row',
              when: 'A selectable chip and a removable chip side by side. Both are 32px high, so the row stays even.',
              render: (
                <Stack as="ul" direction="horizontal" gap={2} wrap aria-label="Filters">
                  <li><Chip variant="selectable" defaultSelected>Assigned to me</Chip></li>
                  <li><Chip variant="removable" removeLabel="Remove filter" onRemove={() => {}}>Status: Shipped</Chip></li>
                </Stack>
              ),
            },
          ],
        },
        {
          title: 'Controlled and uncontrolled',
          kicker: 'Selectable chips run on their own, or the view owns the state.',
          examples: [
            {
              title: 'Active filters with removal',
              when: 'Each active filter has its own remove button, and the view announces what it removed.',
              render: <FilterBar />,
              code: `function FilterBar() {
  const [filters, setFilters] = useState(['Status: Shipped', 'Owner: Dana', 'Region: Europe']);
  const [status, setStatus] = useState('');
  const remove = (filter) => {
    setFilters(filters.filter((item) => item !== filter));
    setStatus(\`Removed filter \${filter}.\`);
  };
  return (
    <Stack gap={2} align="start">
      <Stack as="ul" direction="horizontal" gap={2} wrap aria-label="Active filters">
        {filters.map((filter) => (
          <li key={filter}>
            <Chip variant="removable" removeLabel="Remove filter" onRemove={() => remove(filter)}>{filter}</Chip>
          </li>
        ))}
      </Stack>
      <Text variant="caption" tone="muted" as="p" role="status">{status || \`\${filters.length} filters active.\`}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Controlled selection',
              when: 'The view needs to read the chosen chips, for example to filter a list.',
              render: <ControlledChips />,
              code: `function ControlledChips() {
  const [selected, setSelected] = useState(['Open']);
  const toggle = (name, on) => setSelected(on ? [...selected, name] : selected.filter((item) => item !== name));
  return (
    <Stack gap={2} align="start">
      <Stack direction="horizontal" gap={2} wrap role="group" aria-label="Ticket status">
        {['Open', 'Blocked', 'Done'].map((name) => (
          <Chip key={name} variant="selectable" selected={selected.includes(name)} onSelectedChange={(on) => toggle(name, on)}>{name}</Chip>
        ))}
      </Stack>
      <Text variant="caption" tone="muted" as="p" role="status">{selected.length > 0 ? \`Showing: \${selected.join(', ')}.\` : 'Showing all tickets.'}</Text>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The chip passes native attributes to its root, so a label or an id wires like on any element.',
          examples: [
            { title: 'Remove button name', when: 'Name what the button removes: the chip adds the label after your words.', render: <Chip variant="removable" removeLabel="Remove filter" onRemove={() => {}}>Status: Shipped</Chip> },
            { title: 'Described by a hint', when: 'A selectable chip that needs a consequence read out with its name.', render: (
              <Stack gap={2} align="start">
                <Chip variant="selectable" aria-describedby="chip-hint">Include archived</Chip>
                <Text variant="caption" tone="muted" as="p" id="chip-hint">Archived projects count toward the total.</Text>
              </Stack>
            ) },
            { title: 'Labelled group', when: 'Name a row of toggles, so a screen reader announces what the chips filter.', render: (
              <Stack direction="horizontal" gap={2} wrap role="group" aria-label="Priority">
                <Chip variant="selectable">High</Chip>
                <Chip variant="selectable">Medium</Chip>
                <Chip variant="selectable">Low</Chip>
              </Stack>
            ) },
          ],
        },
      ]}
    />
  ),
};
