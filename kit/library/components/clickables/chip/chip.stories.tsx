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
      imports="import { Chip, Stack, Text } from '@bauhaus/design-system';"
      intro={[
        'A chip is a small pill that holds one value, such as a filter the user chose. Depending on `variant`, it only shows the value, lets the user remove it, or lets the user switch it on and off.',
        'The `variant` decides what the user can do. `static` shows a value. `removable` adds a remove button. `selectable` is a toggle (a button with two states, on and off).',
        'Glossary. A screen reader is software that reads the page aloud to people who cannot see it. An accessible name is the text a screen reader says for a control. A tooltip is a small box with the full text that appears on hover or focus.',
        'Glossary. Controlled means your code owns the state and passes it in (`selected`). Uncontrolled means the chip keeps its own state (`defaultSelected`). Start uncontrolled; switch to controlled when your code must read the state.',
        'The `children` of a chip must be a plain string, because the chip puts the whole text into the accessible name. Put chips in a `Stack` with `wrap`, so they flow onto new lines instead of scrolling sideways.',
      ]}
      guide="clickables-chip--docs"
      guideName="Chip"
      groups={[
        {
          title: 'Variants',
          kicker: 'The variant says what the user can do with the value. Start with the one that matches the job.',
          examples: [
            {
              title: 'Removable',
              when: 'An active filter the user can take off on its own. This is the most common use.',
              explain: [
                '`variant="removable"` adds a remove button inside the chip. Press it and the chip calls `onRemove`.',
                'The chip does not delete itself. Your code removes the value from its list, and the chip disappears because it is no longer drawn.',
                '`removeLabel` is the words before the label in the button name. A screen reader says "Remove filter Status: Shipped". Without the label, the button would be named only "Remove", and a list of five would be impossible to tell apart (WCAG 4.1.2, level A).',
              ],
              render: <Chip variant="removable" removeLabel="Remove filter" onRemove={() => {}}>Status: Shipped</Chip>,
              code: `// children is a plain string: the chip needs the whole text for its accessible name.
// removeLabel + the label become the button name: "Remove filter Status: Shipped".
// "removeFilter" stands for your own function.
<Chip variant="removable" removeLabel="Remove filter" onRemove={removeFilter}>
  Status: Shipped
</Chip>`,
            },
            {
              title: 'Selectable',
              when: 'A filter the user switches on and off in a short row.',
              explain: [
                '`variant="selectable"` draws a native `<button>` that keeps an on or off state.',
                'When it is on, a check mark appears and the fill changes. Colour alone would hide the state from people who cannot tell colours apart (WCAG 1.4.1, A).',
                'Screen readers hear "pressed" or "not pressed" because the chip sets `aria-pressed` for you (APG toggle button pattern).',
              ],
              render: <Chip variant="selectable">Assigned to me</Chip>,
              code: `// Uncontrolled: the chip keeps its own on/off state, starting off.
<Chip variant="selectable">Assigned to me</Chip>`,
            },
            {
              title: 'Static',
              when: 'A value that is shown and never changed, such as a tag on a record.',
              explain: [
                '`static` is the default, so `variant` can be left out. Nothing happens on a press, because there is nothing to press.',
                'It is shorter than the other two (24px, not 32px), because nothing needs a big target. A static chip is not a status. For a status or a count, use `Badge`.',
              ],
              render: <Chip>Design system</Chip>,
              code: `// No variant prop: the default is "static". It only shows a value.
<Chip>Design system</Chip>`,
            },
          ],
        },
        {
          title: 'Selectable state',
          kicker: 'A selectable chip is on or off. It can run on its own, or your code can own the state.',
          examples: [
            {
              title: 'Starts selected',
              when: 'The chip starts on, and the user can switch it off.',
              explain: [
                '`defaultSelected` sets only the first state. After that, the chip keeps its own state when the user presses it.',
                'Use it when your code does not need to read the state, or when you only listen with `onSelectedChange`.',
              ],
              render: <Chip variant="selectable" defaultSelected>Assigned to me</Chip>,
              code: `// Only the first state. After that the chip owns it.
<Chip variant="selectable" defaultSelected>Assigned to me</Chip>`,
            },
            {
              title: 'Listen for changes',
              when: 'Your code must react when the user toggles the chip, but the chip can still own the state.',
              explain: [
                '`onSelectedChange` receives the new state: `true` when the chip is now on, `false` when it is now off.',
                'You do not need to pass `selected` back. The chip updates itself and tells you.',
              ],
              render: <Chip variant="selectable" onSelectedChange={() => {}}>Assigned to me</Chip>,
              code: `// "applyFilter" stands for your own function. It receives true or false.
<Chip variant="selectable" onSelectedChange={applyFilter}>
  Assigned to me
</Chip>`,
            },
            {
              title: 'Controlled by the view',
              when: 'The view owns the state, so it can show it elsewhere, reset it or save it.',
              explain: [
                '`selected` makes the chip controlled: it shows exactly what you pass in.',
                'Pass `onSelectedChange` too and update your state. Without it, the chip would stay stuck, because you never change `selected`.',
              ],
              render: <Chip variant="selectable" selected onSelectedChange={() => {}}>Assigned to me</Chip>,
              code: `// "mine" and "setMine" come from your own useState(true).
<Chip variant="selectable" selected={mine} onSelectedChange={setMine}>
  Assigned to me
</Chip>`,
            },
            {
              title: 'Disabled',
              when: 'The filter does not apply to the current view.',
              explain: [
                '`disabled` is the native attribute. The chip leaves the tab order and ignores presses.',
                'Say why next to the row, in normal text. Disabled text may fail contrast rules (WCAG 1.4.3 exception), so some users cannot read it.',
              ],
              render: <Chip variant="selectable" disabled>Assigned to me</Chip>,
              code: `// "canFilterByOwner" is a boolean from your own code.
<Chip variant="selectable" disabled={!canFilterByOwner}>Assigned to me</Chip>`,
            },
            {
              title: 'Disabled and selected',
              when: 'Something else locks the filter on, such as a saved view.',
              explain: [
                'The chip shows the check mark and the disabled look together. Users see that the filter is on and that they cannot change it.',
              ],
              render: <Chip variant="selectable" disabled defaultSelected>Assigned to me</Chip>,
              code: `<Chip variant="selectable" disabled defaultSelected>Assigned to me</Chip>`,
            },
          ],
        },
        {
          title: 'Removable state',
          kicker: 'The remove button is the part users press. It is the one stop for the keyboard.',
          examples: [
            {
              title: 'Disabled removable',
              when: 'The filter stays visible, but the user cannot remove it now.',
              explain: [
                '`disabled` turns off the remove button. The label stays readable.',
                'Use it while a request runs, or when a rule forces the filter.',
              ],
              render: <Chip variant="removable" disabled onRemove={() => {}}>Status: Shipped</Chip>,
              code: `// "locked" is a boolean from your own code.
<Chip variant="removable" disabled={locked} onRemove={removeFilter}>
  Status: Shipped
</Chip>`,
            },
            {
              title: 'Translated remove label',
              when: 'The app is not in English: pass the words before the label in your language.',
              explain: [
                'The chip does not translate for you. `removeLabel` is your text, so the remove button name matches the language of the page.',
                'The screen reader says "Supprimer le filtre Statut : Expédié". The page language and the name agree (WCAG 3.1.1, level A).',
              ],
              render: <Chip variant="removable" removeLabel="Supprimer le filtre" onRemove={() => {}}>Statut : Expédié</Chip>,
              code: `// "t" stands for your own translation function.
<Chip variant="removable" removeLabel={t('filters.remove')} onRemove={removeFilter}>
  Statut : Expédié
</Chip>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The label is one line. A long label ends in an ellipsis (…), and a tooltip shows the rest.',
          examples: [
            {
              title: 'Long static label',
              when: 'A value longer than the maximum width.',
              explain: [
                'The chip cuts the label with an ellipsis, but the full text stays in the page. A screen reader still reads all of it.',
                'The tooltip with the full text appears on hover and on focus, and only while the label is cut (WCAG 1.4.13, AA).',
              ],
              frame: 'narrow',
              render: <Chip>Quarterly planning workshop with the platform team</Chip>,
              code: `// No truncation prop: the chip measures itself and adds the tooltip only when needed.
<Chip>Quarterly planning workshop with the platform team</Chip>`,
            },
            {
              title: 'Long removable label',
              when: 'A long filter value.',
              explain: [
                'The remove button name keeps the whole text, so the cut label loses nothing for screen reader users.',
                'On a removable chip the remove button is the tab stop. The tooltip on the label shows on hover.',
              ],
              frame: 'narrow',
              render: <Chip variant="removable" removeLabel="Remove filter" onRemove={() => {}}>Owner: Alexandria Montgomery-Fitzgerald</Chip>,
              code: `<Chip variant="removable" removeLabel="Remove filter" onRemove={removeOwner}>
  Owner: Alexandria Montgomery-Fitzgerald
</Chip>`,
            },
            {
              title: 'Long selectable label',
              when: 'A long choice in a toggle row.',
              explain: [
                'The whole chip is the button, so the tooltip shows on hover and on keyboard focus.',
              ],
              frame: 'narrow',
              render: <Chip variant="selectable">Waiting for a reply from the customer</Chip>,
              code: `<Chip variant="selectable">Waiting for a reply from the customer</Chip>`,
            },
            {
              title: 'Long translated label on a phone',
              when: 'A long French label in a narrow column.',
              explain: [
                'French and German labels often run 30% longer than English. Test your longest label at phone width.',
                'The chip never overflows the screen, so the page does not scroll sideways (WCAG 1.4.10, reflow, AA).',
              ],
              frame: 'phone',
              render: <Chip variant="selectable">Livraison express sous vingt-quatre heures</Chip>,
              code: `<Chip variant="selectable">Livraison express sous vingt-quatre heures</Chip>`,
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Put a row of chips in a Stack with wrap. The row flows onto new lines instead of scrolling sideways.',
          examples: [
            {
              title: 'Row of static chips',
              when: 'Several tags on one record.',
              explain: [
                '`as="ul"` makes the `Stack` a real list, and each chip sits in an `<li>`. A screen reader says "list, 4 items", so users know how many tags there are.',
                '`wrap` lets chips flow onto a new line. Without it, a long row would push the page wider than the screen (WCAG 1.4.10, AA).',
                '`gap={2}` is a small, even space between chips.',
              ],
              frame: 'phone',
              render: (
                <Stack as="ul" direction="horizontal" gap={2} wrap aria-label="Tags">
                  <li><Chip>Design system</Chip></li>
                  <li><Chip>Accessibility</Chip></li>
                  <li><Chip>Tokens</Chip></li>
                  <li><Chip>Documentation</Chip></li>
                </Stack>
              ),
              code: `// aria-label names the list for screen readers.
<Stack as="ul" direction="horizontal" gap={2} wrap aria-label="Tags">
  <li><Chip>Design system</Chip></li>
  <li><Chip>Accessibility</Chip></li>
  <li><Chip>Tokens</Chip></li>
  <li><Chip>Documentation</Chip></li>
</Stack>`,
            },
            {
              title: 'Row of selectable chips',
              when: 'A few independent toggles.',
              explain: [
                'Each chip is on or off by itself. They are not "pick one". For one choice out of many, use a radio group.',
                '`role="group"` and `aria-label` give the row a name, so a screen reader says "Show tickets, group" before the first chip.',
              ],
              frame: 'phone',
              render: (
                <Stack direction="horizontal" gap={2} wrap role="group" aria-label="Show tickets">
                  <Chip variant="selectable" defaultSelected>Open</Chip>
                  <Chip variant="selectable">Blocked</Chip>
                  <Chip variant="selectable">Done</Chip>
                </Stack>
              ),
              code: `// A group, not a list: the chips are controls, and the row needs one name.
<Stack direction="horizontal" gap={2} wrap role="group" aria-label="Show tickets">
  <Chip variant="selectable" defaultSelected>Open</Chip>
  <Chip variant="selectable">Blocked</Chip>
  <Chip variant="selectable">Done</Chip>
</Stack>`,
            },
            {
              title: 'Mixed row',
              when: 'A selectable chip and a removable chip side by side.',
              explain: [
                'Both are 32px high, so the row stays even. Only the static chip is shorter.',
              ],
              render: (
                <Stack as="ul" direction="horizontal" gap={2} wrap aria-label="Filters">
                  <li><Chip variant="selectable" defaultSelected>Assigned to me</Chip></li>
                  <li><Chip variant="removable" removeLabel="Remove filter" onRemove={() => {}}>Status: Shipped</Chip></li>
                </Stack>
              ),
              code: `<Stack as="ul" direction="horizontal" gap={2} wrap aria-label="Filters">
  <li><Chip variant="selectable" defaultSelected>Assigned to me</Chip></li>
  <li>
    <Chip variant="removable" removeLabel="Remove filter" onRemove={removeStatus}>
      Status: Shipped
    </Chip>
  </li>
</Stack>`,
            },
          ],
        },
        {
          title: 'Full recipes',
          kicker: 'Two complete, working components. Copy the one that matches your screen.',
          examples: [
            {
              title: 'Active filters with removal',
              when: 'Each active filter has its own remove button, and the view says what it removed.',
              explain: [
                'The list of filters lives in your state. Removing a chip means removing its value from that list.',
                'After removal, the chip that had focus is gone, so the keyboard user would lose their place. Announce the change in a status message, and move focus to a stable place in your view.',
                '`role="status"` makes a screen reader read the message aloud without moving focus (WCAG 4.1.3, AA).',
                '`key={filter}` helps React match each chip to its value, so the right chip disappears.',
              ],
              render: <FilterBar />,
              code: `function FilterBar() {
  // The active filters. Each one is a plain string.
  const [filters, setFilters] = useState(['Status: Shipped', 'Owner: Dana', 'Region: Europe']);
  // The message that screen readers read after a removal.
  const [status, setStatus] = useState('');

  const remove = (filter) => {
    // Keep every filter except the removed one.
    setFilters(filters.filter((item) => item !== filter));
    setStatus(\`Removed filter \${filter}.\`);
  };

  return (
    <Stack gap={2} align="start">
      <Stack as="ul" direction="horizontal" gap={2} wrap aria-label="Active filters">
        {filters.map((filter) => (
          // key lets React tell the chips apart.
          <li key={filter}>
            <Chip variant="removable" removeLabel="Remove filter" onRemove={() => remove(filter)}>
              {filter}
            </Chip>
          </li>
        ))}
      </Stack>
      {/* Read aloud politely, without moving focus. */}
      <Text variant="caption" tone="muted" as="p" role="status">
        {status || \`\${filters.length} filters active.\`}
      </Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Controlled selection',
              when: 'The view needs to read the chosen chips, for example to filter a list.',
              explain: [
                '`selected` and `onSelectedChange` together make each chip controlled. The array `selected` is the single source of truth.',
                'The toggle function adds the name when the chip turns on, and removes it when the chip turns off.',
                'The status line repeats the result in words, for people who use a screen reader (WCAG 4.1.3, AA).',
              ],
              render: <ControlledChips />,
              code: `function ControlledChips() {
  // The names of the chips that are on.
  const [selected, setSelected] = useState(['Open']);

  // "on" is the new state the chip reports.
  const toggle = (name, on) =>
    setSelected(on ? [...selected, name] : selected.filter((item) => item !== name));

  return (
    <Stack gap={2} align="start">
      <Stack direction="horizontal" gap={2} wrap role="group" aria-label="Ticket status">
        {['Open', 'Blocked', 'Done'].map((name) => (
          <Chip
            key={name}
            variant="selectable"
            selected={selected.includes(name)}
            onSelectedChange={(on) => toggle(name, on)}
          >
            {name}
          </Chip>
        ))}
      </Stack>
      <Text variant="caption" tone="muted" as="p" role="status">
        {selected.length > 0 ? \`Showing: \${selected.join(', ')}.\` : 'Showing all tickets.'}
      </Text>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The chip passes native attributes to its root element, so an id or a label works as on any element.',
          examples: [
            {
              title: 'Described by a hint',
              when: 'A selectable chip whose effect needs a sentence of explanation.',
              explain: [
                '`aria-describedby` points at the hint by its `id`. A screen reader reads the hint after the chip name.',
                'The hint is also visible, so everyone gets the same information (Nielsen heuristic 10, help and documentation).',
              ],
              render: (
                <Stack gap={2} align="start">
                  <Chip variant="selectable" aria-describedby="chip-hint">Include archived</Chip>
                  <Text variant="caption" tone="muted" as="p" id="chip-hint">Archived projects count toward the total.</Text>
                </Stack>
              ),
              code: `<Stack gap={2} align="start">
  {/* The id in aria-describedby must match the id of the text below. */}
  <Chip variant="selectable" aria-describedby="chip-hint">Include archived</Chip>
  <Text variant="caption" tone="muted" as="p" id="chip-hint">
    Archived projects count toward the total.
  </Text>
</Stack>`,
            },
            {
              title: 'Labelled group of toggles',
              when: 'Name a row of toggles, so users know what the chips filter.',
              explain: [
                'Without a group name, a screen reader user hears "High, not pressed" and has to guess what High means.',
                '`role="group"` with `aria-label` adds the missing context ("Priority") once, for the whole row.',
              ],
              render: (
                <Stack direction="horizontal" gap={2} wrap role="group" aria-label="Priority">
                  <Chip variant="selectable">High</Chip>
                  <Chip variant="selectable">Medium</Chip>
                  <Chip variant="selectable">Low</Chip>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={2} wrap role="group" aria-label="Priority">
  <Chip variant="selectable">High</Chip>
  <Chip variant="selectable">Medium</Chip>
  <Chip variant="selectable">Low</Chip>
</Stack>`,
            },
          ],
        },
      ]}
    />
  ),
};
