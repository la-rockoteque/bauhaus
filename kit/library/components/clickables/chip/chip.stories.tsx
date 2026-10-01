import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { Stack } from '../../../primitives/stack/stack';
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
          { name: 'size.target.min · size.border.thin', tier: '2', use: 'Height of a pressable chip: the target plus its two outline widths' },
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
        { label: 'Height', value: 'static: space.8 · pressable: size.target.min plus the outline, so the target is 44px' },
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
        { text: 'Shrink the remove button below 44px.', basis: 'WCAG 2.5.8 (AA); house floor 44px', rule: 'chip.touch-target' },
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
