import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Icon } from '../../../primitives/icon/icon';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { IconButton } from '../../clickables/icon-button/icon-button';
import { MenuItem } from '../../clickables/menu-item/menu-item';
import type { Key } from 'react-aria-components';
import { Menu, MenuSection, MenuSeparator, type MenuProps } from './menu';
import { menuRules } from './menu.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Overlays/Menu', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

/** Sets the data attributes React Aria sets on hover, keyboard focus and press, so a static cell shows the real rule. */
function Forced({ attributes, children }: { attributes: readonly string[]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // The items mount after the first render, so the attributes are set as soon as one appears.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const apply = () => {
      const item = root.querySelector('[role^="menuitem"]');
      attributes.forEach((name) => item?.setAttribute(name, 'true'));
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [attributes]);
  return <div ref={ref}>{children}</div>;
}

const HOVER = ['data-focused'] as const;
const FOCUS = ['data-focused', 'data-focus-visible'] as const;
const PRESS = ['data-focused', 'data-pressed'] as const;

const twoItems = <Menu label="Project actions"><MenuItem id="rename">Rename</MenuItem><MenuItem id="duplicate">Duplicate</MenuItem></Menu>;

const Frame = ({ children, height }: { children: ReactNode; height?: string }) => <div style={{ blockSize: height, inlineSize: '100%', overflow: 'hidden' }}>{children}</div>;

const projectItems = (
  <>
    <MenuItem id="rename" icon="plus" shortcut="F2">Rename</MenuItem>
    <MenuItem id="duplicate" description="Copy the project with its files">Duplicate</MenuItem>
    <MenuItem id="archive" isDisabled>Archive</MenuItem>
    <MenuSeparator />
    <MenuItem id="delete" icon="close" destructive>Delete project</MenuItem>
  </>
);

const views = (mode: 'single' | 'multiple') => (
  <Menu label="View" selectionMode={mode} defaultSelectedKeys={mode === 'single' ? ['list'] : ['grid', 'details']}>
    <MenuSection title={mode === 'single' ? 'Layout' : 'Show'}>
      <MenuItem id="list">List</MenuItem>
      <MenuItem id="grid">Grid</MenuItem>
      <MenuItem id="details">Details</MenuItem>
    </MenuSection>
  </Menu>
);

const cities = ['Montréal', 'Québec', 'Gatineau', 'Laval', 'Sherbrooke', 'Saguenay', 'Lévis', 'Trois-Rivières', 'Terrebonne', 'Longueuil'];

type SelectionMode = NonNullable<MenuProps<object>['selectionMode']>;
const SELECTION_MODES = ['none', 'single', 'multiple'] as const satisfies readonly SelectionMode[];

const actionsTrigger = <Button variant="secondary">Actions</Button>;

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Menu"
      layer="Component"
      family="Overlays"
      plain="A menu is a short list of actions that opens from a button. Press the button, pick one action, and the list closes. Arrow keys move, and typing a letter jumps to a match."
      precise="Component in the overlays family · a menu button per the WAI-ARIA APG · a list of actions or choices · not site navigation, not a form control."
      usedFor="Row actions, a More button, a view switcher, a choice of sort order."
      tokens={{
        mode: 'consumed',
        note: 'The menu has no component tokens. Its items are the menu item slice.',
        rows: [
          { name: 'overlay.surface · overlay.border', tier: 'role', use: 'Fill and soft edge of the list', swatch: '--ds-overlay-surface' },
          { name: 'shadow.1', tier: 'role', use: 'Elevation rung of a menu', swatch: '--ds-overlay-border' },
          { name: 'border.default', tier: 'role', use: 'Rule of a separator', swatch: '--ds-border-default' },
          { name: 'text.default · text.muted', tier: 'role', use: 'Section titles and item text', swatch: '--ds-text-muted' },
          { name: 'text.kicker.*', tier: '2', use: 'Section title' },
          { name: 'size.overlay.sm · md', tier: '2', use: 'Minimum half of sm, maximum md, capped to the screen minus space.6' },
          { name: 'radius.overlay · size.border.thin · space.inset.xs · space.1', tier: '2', use: 'Corner radius, edge, padding, separator margin' },
          { name: 'motion.duration.fast · motion.ease.enter · motion.ease.exit', tier: '2', use: 'Fade and small travel in and out' },
        ],
      }}
      stage={{
        render: (args) => <Menu label={String(args.label)} selectionMode={args.selectionMode as SelectionMode}>{projectItems}</Menu>,
        parts: [
          { n: 1, label: 'Trigger', note: 'a button, the only tab stop, not drawn here', target: '.ds-menu__popover', at: 'top-start' },
          { n: 2, label: 'Container', note: 'role menu, required', target: '.ds-menu', at: 'top-end' },
          { n: 3, label: 'Item', note: 'the menu item slice', target: '.ds-menu-item' },
          { n: 4, label: 'Separator', note: 'optional', target: '.ds-menu__separator' },
          { n: 5, label: 'Section', note: 'optional, with a title', target: '.ds-menu-item--destructive', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Width', value: 'from half of size.overlay.sm to size.overlay.md, never wider than the screen minus space.6' },
        { label: 'Position', value: 'Below the trigger, 4px away, aligned to its start. It flips at the viewport edge' },
        { label: 'Radius', property: 'radius', target: '.ds-menu__popover', token: 'radius.overlay' },
        { label: 'Rung', value: 'shadow.1' },
        { label: 'Keys', value: 'Enter, Space or Down opens · arrows move · a letter jumps · Enter or Space acts · Escape closes and returns focus' },
        { label: 'Selection', value: 'none (actions) · single (radio items) · multiple (checkbox items); a check marks the chosen items' },
      ]}
      api={[
        { label: 'trigger', value: 'The button that opens the menu. Without it the open list is drawn in the flow.' },
        { label: 'label', value: 'Required. The accessible name of the menu.', control: { kind: 'text', value: 'Project actions' } },
        { label: 'children', value: 'MenuItem, MenuSection and MenuSeparator.' },
        { label: 'onAction', value: 'Called with the item id when an action item is pressed. The menu closes.' },
        { label: 'selectionMode', value: '"none" (default) | "single" | "multiple". A choosing menu stays open in multiple mode.', control: { kind: 'select', options: SELECTION_MODES, value: 'none' } },
        { label: 'selectedKeys · defaultSelectedKeys · onSelectionChange', value: 'The chosen ids, controlled or not.' },
        { label: 'placement', value: 'Default "bottom start". Flips at the edge.' },
        { label: 'isOpen · defaultOpen · onOpenChange', value: 'Controlled or uncontrolled open state.' },
        { label: 'portalContainer', value: 'Mount the open menu in this element instead of the body.' },
        { label: 'MenuSection · MenuSeparator', value: 'A titled group; a rule between groups.' },
      ]}
      states={{
        note: 'Each cell shows the open list in the flow, without its trigger. The live menus are under Try it. The states of one item are in the menu item showcase.',
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'A menu with no action is not offered. Hide or disable its trigger and say why.' },
          { id: 'loading', status: 'n/a', reason: 'A menu opens on items it already has. A running action is shown by the view.' },
          { id: 'none', status: 'n/a', reason: 'See nothing.' },
          { id: 'one', status: 'n/a', reason: 'A menu of one action is a button.' },
          { id: 'some', status: 'designed', render: <Menu label="Project actions">{projectItems}</Menu>, trigger: 'children', note: 'Icon, description and shortcut hint, a disabled item, a destructive item.' },
          { id: 'too-many', status: 'designed', label: 'Too many (long list)', render: <Frame height="calc(var(--ds-space-12) * 4)"><Menu label="Cities">{cities.map((city) => <MenuItem key={city} id={city}>{city}</MenuItem>)}</Menu></Frame>, trigger: 'many children', note: 'The list scrolls inside the viewport. Typeahead reaches any item.' },
          { id: 'incorrect', status: 'n/a', reason: 'A failed action is reported by the view, not by the menu.' },
          { id: 'correct', status: 'n/a', reason: 'A menu confirms nothing.' },
          { id: 'done', status: 'n/a', reason: 'The menu closes on action; the view announces the result.' },
          { id: 'default', status: 'designed', render: <Menu label="Project actions">{projectItems}</Menu>, trigger: 'selectionMode="none"' },
          { id: 'hover', status: 'designed', render: <Forced attributes={HOVER}>{twoItems}</Forced>, trigger: 'item [data-focused]', note: 'Hover and the arrow keys move the same highlight. Forced by the attribute React Aria sets.' },
          { id: 'focus-visible', status: 'designed', render: <Forced attributes={FOCUS}>{twoItems}</Forced>, trigger: 'item [data-focus-visible]', note: 'Highlight and focus ring, inside the item.' },
          { id: 'active', status: 'designed', render: <Forced attributes={PRESS}>{twoItems}</Forced>, trigger: 'item [data-pressed]' },
          { id: 'disabled', status: 'designed', render: <Menu label="Project actions"><MenuItem id="archive" isDisabled>Archive</MenuItem><MenuItem id="duplicate">Duplicate</MenuItem></Menu>, trigger: 'isDisabled', note: 'Stays in the list, skipped by the arrows. Say why near the trigger.' },
          { id: 'selected', status: 'designed', render: views('single'), trigger: 'selectionMode="single"', note: 'A check and a fill mark the chosen item.' },
          { id: 'selected', variant: 'Multiple', status: 'designed', render: views('multiple'), trigger: 'selectionMode="multiple"', note: 'Each item toggles. The menu stays open.' },
        ],
      }}
      extra={[
        {
          title: 'Try it',
          kicker: 'Real menus: Enter, Space or Down opens. Arrows move, a letter jumps, Escape returns to the button.',
          content: (
            <Stack direction="horizontal" gap={3} wrap>
              <Menu trigger={actionsTrigger} label="Project actions">{projectItems}</Menu>
              <Menu trigger={<IconButton label="More actions" icon={<Icon glyph="more" />} variant="secondary" />} label="More actions" placement="bottom end">{projectItems}</Menu>
              <Menu trigger={<Button variant="secondary">View</Button>} label="View" selectionMode="single" defaultSelectedKeys={['list']}>
                <MenuItem id="list">List</MenuItem>
                <MenuItem id="grid">Grid</MenuItem>
              </Menu>
              <Menu trigger={<Button variant="secondary">Columns</Button>} label="Columns" selectionMode="multiple" defaultSelectedKeys={['name']}>
                <MenuItem id="name">Name</MenuItem>
                <MenuItem id="owner">Owner</MenuItem>
                <MenuItem id="date">Date</MenuItem>
              </Menu>
            </Stack>
          ),
        },
      ]}
      dos={[
        { text: 'List actions or choices. Put a destructive item last, apart, and name what it deletes.', basis: 'APG Menu Button; WCAG 1.4.1 (A)' },
        { text: 'Name the menu with the label prop, the same as its button.', basis: 'WCAG 4.1.2 (A)' },
        { text: 'Keep the button as the one tab stop and let arrows move inside.', basis: 'APG Menu Button' },
        { text: 'Check the chosen items in a choosing menu, not only fill them.', basis: 'WCAG 1.4.1 (A)' },
      ]}
      donts={[
        { text: 'Use a menu for site navigation. Use a nav with links.', basis: 'APG Menu Button; WCAG 4.1.2 (A)', rule: 'menu.actions-only' },
        { text: 'Build the list from divs and a click handler.', basis: 'APG Menu Button; WCAG 2.1.1 (A)', rule: 'menu.built-on-aria' },
        { text: 'Leave the menu without a name.', basis: 'WCAG 4.1.2 (A)', rule: 'menu.labelled' },
        { text: 'Let a list run off the screen at 320px.', basis: 'WCAG 1.4.10 (AA)', rule: 'menu.fits-viewport' },
        { text: 'Write a colour or px literal in menu.css.', basis: 'misfile.raw-value-in-component', rule: 'menu.no-literal' },
      ]}
      guide="overlays-menu--docs"
      guideName="Menu"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Menu" layer="Component" family="Overlays" rules={menuRules} guide="overlays-menu--docs" guideName="Menu" />,
};

/** Shows what the app learns from a choice: the key of the item the user picked. */
function RowActions() {
  const [status, setStatus] = useState('');
  return (
    <Stack gap={2} align="start">
      <Menu trigger={<IconButton label="More actions" icon={<Icon glyph="more" />} variant="secondary" />} label="More actions" placement="bottom end" onAction={(key) => setStatus(`You chose ${String(key)}.`)}>
        <MenuItem id="rename">Rename</MenuItem>
        <MenuItem id="duplicate">Duplicate</MenuItem>
        <MenuSeparator />
        <MenuItem id="delete" destructive>Delete project</MenuItem>
      </Menu>
      <Text as="p" role="status">{status}</Text>
    </Stack>
  );
}

/** An action on one item, instead of one handler for the whole menu. */
function ItemAction() {
  const [status, setStatus] = useState('');
  return (
    <Stack gap={2} align="start">
      <Menu trigger={<Button variant="secondary">Share</Button>} label="Share">
        <MenuItem id="copy" onAction={() => setStatus('Link copied.')}>Copy link</MenuItem>
        <MenuItem id="invite" onAction={() => setStatus('Invitation sent.')}>Invite people</MenuItem>
      </Menu>
      <Text as="p" role="status">{status}</Text>
    </Stack>
  );
}

function SortOrder() {
  const [sort, setSort] = useState<Set<Key>>(new Set(['recent']));
  const names: Record<string, string> = { recent: 'Most recent', name: 'Name', size: 'Size' };
  return (
    <Stack gap={2} align="start">
      <Menu trigger={<Button variant="secondary">Sort</Button>} label="Sort" selectionMode="single" selectedKeys={sort} onSelectionChange={(keys) => setSort(new Set(keys))}>
        <MenuItem id="recent">Most recent</MenuItem>
        <MenuItem id="name">Name</MenuItem>
        <MenuItem id="size">Size</MenuItem>
      </Menu>
      <Text as="p" role="status">{`Sorted by ${names[String([...sort][0])] ?? ''}.`}</Text>
    </Stack>
  );
}

function ColumnPicker() {
  const [columns, setColumns] = useState<Set<Key>>(new Set(['name', 'date']));
  return (
    <Stack gap={2} align="start">
      <Menu trigger={<Button variant="secondary">Columns</Button>} label="Columns" selectionMode="multiple" selectedKeys={columns} onSelectionChange={(keys) => setColumns(new Set(keys))}>
        <MenuItem id="name">Name</MenuItem>
        <MenuItem id="owner">Owner</MenuItem>
        <MenuItem id="date">Date</MenuItem>
      </Menu>
      <Text as="p" role="status">{`${columns.size} of 3 columns shown.`}</Text>
    </Stack>
  );
}

function OpenFromElsewhere() {
  const [open, setOpen] = useState(false);
  return (
    <Stack direction="horizontal" gap={3} wrap>
      <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions" isOpen={open} onOpenChange={setOpen}>
        <MenuItem id="rename">Rename</MenuItem>
        <MenuItem id="duplicate">Duplicate</MenuItem>
      </Menu>
      <Text as="p">{open ? 'The menu is open.' : 'The menu is closed.'}</Text>
    </Stack>
  );
}

const fileTypes = [{ id: 'pdf', name: 'PDF document' }, { id: 'csv', name: 'CSV file' }, { id: 'png', name: 'PNG image' }];

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Menu"
      layer="Component"
      family="Overlays"
      imports="import { useState } from 'react'; import { Button, Icon, IconButton, Menu, MenuItem, MenuSection, MenuSeparator, Stack, Text } from '@acme/design-system';"
      intro={[
        'A menu is a short list of actions that opens from a button. The user presses the button, picks one action, and the list closes. A menu is for doing things, not for reading.',
        'Three overlays look alike and do different jobs. A menu lists actions to pick from. A popover is a small panel with richer content, such as a form. A tooltip is a few words of hint on a control that already has a name.',
        '`trigger` is the button that opens the menu. It is the only tab stop: the user opens the menu with Enter, Space or the Down arrow, then moves with the arrow keys. (A tab stop is a place the Tab key can land.)',
        '`label` names the list for screen readers (software that reads the screen aloud). Use the same words as the trigger. Every `MenuItem` needs an `id`: the key your code receives when the user picks it.',
        'Items are built from a `MenuItem`, a `MenuSection` (a named group) and a `MenuSeparator` (a rule between groups). A menu never holds links to pages: use a `nav` list for that.',
        'The menu stays closed until the user opens it, so every example below shows the trigger. Press it to see the list.',
      ]}
      guide="overlays-menu--docs"
      guideName="Menu"
      groups={[
        {
          title: 'Start here',
          kicker: 'The two common shapes: a word button for a view, an icon button for a row. Both are closed until pressed.',
          examples: [
            {
              title: 'A menu from a text button',
              when: 'The secondary actions of a view, when the trigger has room for a word.',
              explain: [
                '`trigger` takes the button that opens the list. The menu adds `aria-haspopup` and `aria-expanded` to it, so a screen reader says "menu, collapsed" (WCAG 4.1.2, A).',
                '`label` names the list. Match the trigger text, so the user hears the same name for the button and for the list.',
                'Each `MenuItem` needs a unique `id`. Without it, your code cannot tell which item the user picked.',
                'The trigger is `variant="secondary"` so the menu does not compete with the one primary action of the page.',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions">
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="duplicate">Duplicate</MenuItem>
                  <MenuItem id="archive">Archive</MenuItem>
                </Menu>
              ),
              code: `<Menu
  // The button the user presses. It is the only tab stop.
  trigger={<Button variant="secondary">Actions</Button>}
  // Names the list for screen readers. Same words as the trigger.
  label="Actions"
>
  {/* id = the key your code receives when this item is picked. */}
  <MenuItem id="rename">Rename</MenuItem>
  <MenuItem id="duplicate">Duplicate</MenuItem>
  <MenuItem id="archive">Archive</MenuItem>
</Menu>`,
            },
            {
              title: 'Row actions from an icon button',
              when: 'A table row or a card holds rare actions. An icon button opens the menu.',
              explain: [
                '`IconButton` has no visible text, so its own `label` is its name. Without it, a screen reader says only "button".',
                '`onAction` on the `Menu` runs when the user picks any item. It receives the `id` of that item. Branch on the `id` to run the right code.',
                '`placement="bottom end"` aligns the list to the end edge of the trigger. A trigger at the end of a row would otherwise push the list off screen.',
                'Delete goes last, after a `MenuSeparator`, and `destructive` colours it. Users reach it only on purpose (Nielsen heuristic 5: prevent errors).',
                'The status text uses `role="status"`, so screen readers announce the result without moving focus (WCAG 4.1.3, AA).',
              ],
              render: <RowActions />,
              code: `function RowActions() {
  const [status, setStatus] = useState('');

  return (
    <Stack gap={2} align="start">
      <Menu
        // The icon button needs its own label: it shows no text.
        trigger={<IconButton label="More actions" icon={<Icon glyph="more" />} variant="secondary" />}
        label="More actions"
        // Align to the end edge, so the list stays on screen at the end of a row.
        placement="bottom end"
        // key = the id of the picked item.
        onAction={(key) => setStatus('You chose ' + key + '.')}
      >
        <MenuItem id="rename">Rename</MenuItem>
        <MenuItem id="duplicate">Duplicate</MenuItem>
        {/* A rule between the safe actions and the risky one. */}
        <MenuSeparator />
        {/* Last, in its own group, and the label names what it deletes. */}
        <MenuItem id="delete" destructive>Delete project</MenuItem>
      </Menu>
      {/* Announced by screen readers without moving focus. */}
      <Text as="p" role="status">{status}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Run code on one item',
              when: 'Each item has its own handler, and a shared `onAction` would need a long switch.',
              explain: [
                '`MenuItem` takes its own `onAction`. It runs when that item is picked, with no key to check.',
                'Use one style per menu. A shared `onAction` suits many similar items; a per-item `onAction` suits few, different ones.',
                'The menu closes after the pick in both styles, and focus returns to the trigger (APG Menu Button).',
              ],
              render: <ItemAction />,
              code: `function ItemAction() {
  const [status, setStatus] = useState('');

  return (
    <Stack gap={2} align="start">
      <Menu trigger={<Button variant="secondary">Share</Button>} label="Share">
        {/* Each item brings its own handler. */}
        <MenuItem id="copy" onAction={() => setStatus('Link copied.')}>Copy link</MenuItem>
        <MenuItem id="invite" onAction={() => setStatus('Invitation sent.')}>Invite people</MenuItem>
      </Menu>
      <Text as="p" role="status">{status}</Text>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Items',
          kicker: 'An item takes an icon, a description, a shortcut hint, a disabled state and a destructive look. Add only what helps the user choose.',
          examples: [
            {
              title: 'Icons and shortcuts',
              when: 'Users know the actions by an icon or a key combination.',
              explain: [
                '`icon` draws a glyph (a small drawn symbol) before the label. Screen readers skip it: the label already names the item, so the icon adds nothing to hear.',
                '`shortcut` prints a hint such as `Ctrl+N`. It is only a hint. Your app must bind the key, or the hint lies.',
                'Use icons on all items or on none. A menu with icons on some items looks ragged.',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">File</Button>} label="File">
                  <MenuItem id="new" icon="plus" shortcut="Ctrl+N">New file</MenuItem>
                  <MenuItem id="edit" icon="edit" shortcut="F2">Rename</MenuItem>
                  <MenuItem id="copy" icon="copy" shortcut="Ctrl+D">Duplicate</MenuItem>
                  <MenuItem id="download" icon="download">Download</MenuItem>
                </Menu>
              ),
              code: `<Menu trigger={<Button variant="secondary">File</Button>} label="File">
  {/* shortcut is a hint only: bind the key in your app too. */}
  <MenuItem id="new" icon="plus" shortcut="Ctrl+N">New file</MenuItem>
  <MenuItem id="edit" icon="edit" shortcut="F2">Rename</MenuItem>
  <MenuItem id="copy" icon="copy" shortcut="Ctrl+D">Duplicate</MenuItem>
  {/* No shortcut? Leave the prop out. */}
  <MenuItem id="download" icon="download">Download</MenuItem>
</Menu>`,
            },
            {
              title: 'Descriptions',
              when: 'Two actions sound alike, and a second line says what each does.',
              explain: [
                '`description` adds a second line under the label. Screen readers read it as the description of the item.',
                'Keep the label short and put the detail in the description. The label is what typeahead (jump to an item by typing its first letters) matches.',
                'Do not use a description to fix a poor label. Rename the label first.',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">Export</Button>} label="Export">
                  <MenuItem id="current" description="The rows on this page">Export page</MenuItem>
                  <MenuItem id="all" description="Every row, with the active filters">Export everything</MenuItem>
                </Menu>
              ),
              code: `<Menu trigger={<Button variant="secondary">Export</Button>} label="Export">
  {/* Short label, longer detail below it. */}
  <MenuItem id="current" description="The rows on this page">Export page</MenuItem>
  <MenuItem id="all" description="Every row, with the active filters">Export everything</MenuItem>
</Menu>`,
            },
            {
              title: 'Disabled item',
              when: 'An action exists but does not apply now.',
              explain: [
                '`disabledKeys` on the `Menu` lists the `id` values to disable. The item stays in place, so the menu does not change shape.',
                'A disabled item cannot be picked, and the arrow keys skip it. It still shows in the list, so users learn the action exists.',
                '`description` says why the item is off. Screen readers read it as the item\'s description. Without a reason, users guess (Nielsen heuristic 1: visibility of system status).',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions" disabledKeys={['archive']}>
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="archive" description="Open projects cannot be archived">Archive</MenuItem>
                  <MenuItem id="share">Share</MenuItem>
                </Menu>
              ),
              code: `<Menu
  trigger={<Button variant="secondary">Actions</Button>}
  label="Actions"
  // The ids of the items that cannot be picked now.
  // Compute it from your data, for example: isLocked ? ['archive'] : []
  disabledKeys={['archive']}
>
  <MenuItem id="rename">Rename</MenuItem>
  {/* The description says why it is off. */}
  <MenuItem id="archive" description="Open projects cannot be archived">Archive</MenuItem>
  <MenuItem id="share">Share</MenuItem>
</Menu>`,
            },
            {
              title: 'Destructive item',
              when: 'An action deletes something.',
              explain: [
                '`destructive` draws the item in the error colour, with a text label that still says "Delete". Colour never carries the meaning alone (WCAG 1.4.1, A).',
                'Put it last, after a `MenuSeparator`. A separate group keeps users from picking it by accident while they aim for a safe action.',
                'Name what it deletes: "Delete project", not "Delete". If the loss is permanent, open a `ConfirmationDialog` from the handler.',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">Project</Button>} label="Project">
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="duplicate">Duplicate</MenuItem>
                  <MenuSeparator />
                  <MenuItem id="delete" icon="close" destructive>Delete project</MenuItem>
                </Menu>
              ),
              code: `<Menu trigger={<Button variant="secondary">Project</Button>} label="Project">
  <MenuItem id="rename">Rename</MenuItem>
  <MenuItem id="duplicate">Duplicate</MenuItem>
  {/* The rule sets the risky action apart. */}
  <MenuSeparator />
  {/* destructive = error colour. The label says what is lost. */}
  <MenuItem id="delete" icon="close" destructive>Delete project</MenuItem>
</Menu>`,
            },
            {
              title: 'Items from data',
              when: 'The items come from a list, such as the formats a server supports.',
              explain: [
                '`items` takes an array. The function child draws one `MenuItem` per entry, so you do not write a `map` yourself.',
                'Each entry needs an `id`. The `MenuItem` uses it as its key, and `onAction` receives it.',
                'Use this form when the list can change. A fixed list reads better as written items.',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">Download as</Button>} label="Download as" items={fileTypes}>
                  {(type) => <MenuItem id={type.id}>{type.name}</MenuItem>}
                </Menu>
              ),
              code: `// Your data. Every entry needs a unique id.
const fileTypes = [
  { id: 'pdf', name: 'PDF document' },
  { id: 'csv', name: 'CSV file' },
  { id: 'png', name: 'PNG image' },
];

<Menu trigger={<Button variant="secondary">Download as</Button>} label="Download as" items={fileTypes}>
  {/* Called once per entry. */}
  {(type) => <MenuItem id={type.id}>{type.name}</MenuItem>}
</Menu>`,
            },
          ],
        },
        {
          title: 'Groups',
          kicker: 'Groups help people scan a long list. Use them from about seven items.',
          examples: [
            {
              title: 'Separator',
              when: 'Two groups need a rule between them and no names.',
              explain: [
                '`MenuSeparator` draws a thin rule. It is not an item: arrow keys skip it.',
                'Screen readers announce it as a separator, so users hear where one group ends.',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">Document</Button>} label="Document">
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="duplicate">Duplicate</MenuItem>
                  <MenuSeparator />
                  <MenuItem id="print">Print</MenuItem>
                </Menu>
              ),
              code: `<Menu trigger={<Button variant="secondary">Document</Button>} label="Document">
  <MenuItem id="rename">Rename</MenuItem>
  <MenuItem id="duplicate">Duplicate</MenuItem>
  {/* Skipped by the arrow keys. */}
  <MenuSeparator />
  <MenuItem id="print">Print</MenuItem>
</Menu>`,
            },
            {
              title: 'Named sections',
              when: 'Many actions fall into groups, and the group name helps people scan.',
              explain: [
                '`MenuSection` with a `title` shows the name above the group and names the group for screen readers (WCAG 1.3.1, A).',
                'The title is not an item: users cannot pick it.',
                'Omit `title` for an unnamed group. It still groups the items for assistive technology.',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">Document</Button>} label="Document">
                  <MenuSection title="Edit">
                    <MenuItem id="rename">Rename</MenuItem>
                    <MenuItem id="duplicate">Duplicate</MenuItem>
                  </MenuSection>
                  <MenuSection title="Share">
                    <MenuItem id="link">Copy link</MenuItem>
                    <MenuItem id="invite">Invite people</MenuItem>
                  </MenuSection>
                </Menu>
              ),
              code: `<Menu trigger={<Button variant="secondary">Document</Button>} label="Document">
  {/* title = the visible name, also read aloud as the group name. */}
  <MenuSection title="Edit">
    <MenuItem id="rename">Rename</MenuItem>
    <MenuItem id="duplicate">Duplicate</MenuItem>
  </MenuSection>
  <MenuSection title="Share">
    <MenuItem id="link">Copy link</MenuItem>
    <MenuItem id="invite">Invite people</MenuItem>
  </MenuSection>
</Menu>`,
            },
          ],
        },
        {
          title: 'Choosing',
          kicker: 'Set `selectionMode` to let a menu hold a choice, not only run an action. A chosen item shows a check and a fill, never the fill alone (WCAG 1.4.1, A).',
          examples: [
            {
              title: 'Single choice',
              when: 'The user picks one view or mode.',
              explain: [
                '`selectionMode="single"` makes the items radio items: exactly one is chosen. Screen readers say "radio menu item, checked".',
                '`defaultSelectedKeys` sets the first choice. The menu then keeps the choice itself (uncontrolled).',
                'Picking an item closes the menu: the user made one decision.',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">View</Button>} label="View" selectionMode="single" defaultSelectedKeys={['list']}>
                  <MenuItem id="list">List</MenuItem>
                  <MenuItem id="grid">Grid</MenuItem>
                  <MenuItem id="details">Details</MenuItem>
                </Menu>
              ),
              code: `<Menu
  trigger={<Button variant="secondary">View</Button>}
  label="View"
  // One item chosen at a time.
  selectionMode="single"
  // The starting choice. The menu remembers later picks by itself.
  defaultSelectedKeys={['list']}
>
  <MenuItem id="list">List</MenuItem>
  <MenuItem id="grid">Grid</MenuItem>
  <MenuItem id="details">Details</MenuItem>
</Menu>`,
            },
            {
              title: 'Multiple choice',
              when: 'The user toggles several options, such as which columns to show.',
              explain: [
                '`selectionMode="multiple"` makes checkbox items. Screen readers say "checkbox menu item, checked".',
                'The menu stays open after each pick, so the user can toggle several without reopening it.',
                'Close with Escape or by pressing outside. Focus returns to the trigger.',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">Columns</Button>} label="Columns" selectionMode="multiple" defaultSelectedKeys={['name', 'date']}>
                  <MenuItem id="name">Name</MenuItem>
                  <MenuItem id="owner">Owner</MenuItem>
                  <MenuItem id="date">Date</MenuItem>
                </Menu>
              ),
              code: `<Menu
  trigger={<Button variant="secondary">Columns</Button>}
  label="Columns"
  // Any number of items chosen. The menu stays open between picks.
  selectionMode="multiple"
  defaultSelectedKeys={['name', 'date']}
>
  <MenuItem id="name">Name</MenuItem>
  <MenuItem id="owner">Owner</MenuItem>
  <MenuItem id="date">Date</MenuItem>
</Menu>`,
            },
            {
              title: 'Controlled single choice',
              when: 'The app reads the choice, such as a sort order that drives a list.',
              explain: [
                '`selectedKeys` holds the choice in your state, and `onSelectionChange` reports a new one. Your state is then the single source of truth.',
                'The value is a `Set` of keys, even for a single choice. Copy it into a new `Set` before storing it.',
                'The status line shows the choice outside the menu, because the list is closed most of the time (Nielsen heuristic 1, visibility of system status).',
              ],
              render: <SortOrder />,
              code: `function SortOrder() {
  // A Set of ids. One id, because selectionMode is "single".
  const [sort, setSort] = useState(new Set(['recent']));
  const names = { recent: 'Most recent', name: 'Name', size: 'Size' };

  return (
    <Stack gap={2} align="start">
      <Menu
        trigger={<Button variant="secondary">Sort</Button>}
        label="Sort"
        selectionMode="single"
        // Your state decides what is checked.
        selectedKeys={sort}
        onSelectionChange={(keys) => setSort(new Set(keys))}
      >
        <MenuItem id="recent">Most recent</MenuItem>
        <MenuItem id="name">Name</MenuItem>
        <MenuItem id="size">Size</MenuItem>
      </Menu>
      {/* Show the choice outside the closed menu. */}
      <Text as="p" role="status">{'Sorted by ' + names[[...sort][0]] + '.'}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Controlled multiple choice',
              when: 'The app reacts to a set of toggles, such as the columns of a table.',
              explain: [
                'Same props as the single choice, with `selectionMode="multiple"`. The `Set` can hold zero, one or many keys.',
                'The count in the status line tells users what the closed menu holds.',
              ],
              render: <ColumnPicker />,
              code: `function ColumnPicker() {
  const [columns, setColumns] = useState(new Set(['name', 'date']));

  return (
    <Stack gap={2} align="start">
      <Menu
        trigger={<Button variant="secondary">Columns</Button>}
        label="Columns"
        selectionMode="multiple"
        selectedKeys={columns}
        onSelectionChange={(keys) => setColumns(new Set(keys))}
      >
        <MenuItem id="name">Name</MenuItem>
        <MenuItem id="owner">Owner</MenuItem>
        <MenuItem id="date">Date</MenuItem>
      </Menu>
      <Text as="p" role="status">{columns.size + ' of 3 columns shown.'}</Text>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Placement and open state',
          kicker: 'The menu opens 4px from the trigger and flips to the other side when it does not fit. `placement` sets the side you prefer.',
          examples: [
            {
              title: 'Opens above',
              when: 'The trigger sits near the bottom of the screen.',
              explain: [
                '`placement="top start"` opens the list above the trigger, aligned to its start edge.',
                'It is a preference. If there is no room above, the list flips below by itself.',
                'The default is `"bottom start"`. Leave it out unless you have a reason.',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions" placement="top start">
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="duplicate">Duplicate</MenuItem>
                </Menu>
              ),
              code: `<Menu
  trigger={<Button variant="secondary">Actions</Button>}
  label="Actions"
  // side + alignment. Flips by itself when there is no room.
  placement="top start"
>
  <MenuItem id="rename">Rename</MenuItem>
  <MenuItem id="duplicate">Duplicate</MenuItem>
</Menu>`,
            },
            {
              title: 'Opens to the side',
              when: 'The trigger sits in a narrow column, such as a sidebar.',
              explain: [
                '`start` and `end` mean the reading direction, not left and right. In a right-to-left language such as Arabic, `end` is the left side and the layout mirrors with no extra code.',
                '`"end top"` opens beside the trigger and aligns the top edges.',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions" placement="end top">
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="duplicate">Duplicate</MenuItem>
                </Menu>
              ),
              code: `<Menu
  trigger={<Button variant="secondary">Actions</Button>}
  label="Actions"
  // "end" = the side where reading ends. It mirrors in right-to-left languages.
  placement="end top"
>
  <MenuItem id="rename">Rename</MenuItem>
  <MenuItem id="duplicate">Duplicate</MenuItem>
</Menu>`,
            },
            {
              title: 'Controlled open state',
              when: 'The app needs to know whether the menu is open, or must open it itself.',
              explain: [
                '`isOpen` holds the open state in your code. `onOpenChange` reports every change: a press, Escape, an outside click.',
                'If you pass `isOpen` but no `onOpenChange`, the menu can never close. Always pass both.',
                'Use `defaultOpen` instead when you only need the first state and want the menu to keep the rest.',
              ],
              render: <OpenFromElsewhere />,
              code: `function OpenFromElsewhere() {
  const [open, setOpen] = useState(false);

  return (
    <Stack direction="horizontal" gap={3} wrap>
      <Menu
        trigger={<Button variant="secondary">Actions</Button>}
        label="Actions"
        // Both props together, or the menu cannot close.
        isOpen={open}
        onOpenChange={setOpen}
      >
        <MenuItem id="rename">Rename</MenuItem>
        <MenuItem id="duplicate">Duplicate</MenuItem>
      </Menu>
      <Text as="p">{open ? 'The menu is open.' : 'The menu is closed.'}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Open inside a container',
              when: 'The menu lives in a preview, a dialog or a scrolling panel, and must stay inside it.',
              explain: [
                'By default the open list mounts at the end of the page body, so it can float above everything.',
                '`portalContainer` mounts it in the element you give instead. Pass a DOM element, usually from a `ref` or state.',
                'Most pages never need this. It is for previews, tests and embedded panels.',
              ],
              code: `function ContainedMenu() {
  // A DOM element held in state; null until it mounts.
  const [container, setContainer] = useState(null);

  return (
    <div ref={setContainer}>
      <Menu
        trigger={<Button variant="secondary">Actions</Button>}
        label="Actions"
        // Wait for the element, then mount the open list in it.
        portalContainer={container}
      >
        <MenuItem id="rename">Rename</MenuItem>
      </Menu>
    </div>
  );
}`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'Labels get translated and lists grow. The menu keeps working in both cases.',
          examples: [
            {
              title: 'Long list',
              when: 'The menu holds many items.',
              explain: [
                'The list scrolls inside the viewport (the visible part of the page). It never grows past the screen (WCAG 1.4.10, AA).',
                'Typeahead reaches any item: the user types the first letters and focus jumps to the match (APG Menu Button).',
                'If the list is longer than about twenty items, think again. A search field or a select may serve better.',
              ],
              render: (
                <Menu trigger={<Button variant="secondary">City</Button>} label="City" selectionMode="single">
                  {cities.map((city) => <MenuItem key={city} id={city}>{city}</MenuItem>)}
                </Menu>
              ),
              code: `const cities = ['Montréal', 'Québec', 'Gatineau', 'Laval', 'Sherbrooke' /* ... */];

<Menu trigger={<Button variant="secondary">City</Button>} label="City" selectionMode="single">
  {/* key is React's list key; id is the menu's key. Use the same value. */}
  {cities.map((city) => <MenuItem key={city} id={city}>{city}</MenuItem>)}
</Menu>`,
            },
            {
              title: 'Translated labels in a narrow column',
              when: 'French or German labels run longer than English ones.',
              explain: [
                'Labels, descriptions and shortcuts all arrive as props, so you translate them like any other text.',
                'The list caps its width to the screen and wraps long labels. Text is never cut off (WCAG 1.4.10, AA).',
                'Test the longest language you ship, not only English.',
              ],
              frame: 'narrow',
              render: (
                <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions">
                  <MenuItem id="rename" description="Donnez un nouveau nom à ce projet">Renommer le projet</MenuItem>
                  <MenuItem id="archive" shortcut="Ctrl+Maj+A">Archiver ce projet et ses fichiers</MenuItem>
                </Menu>
              ),
              code: `<Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions">
  {/* Text comes from your translation function, for example t('rename'). */}
  <MenuItem id="rename" description="Donnez un nouveau nom à ce projet">Renommer le projet</MenuItem>
  <MenuItem id="archive" shortcut="Ctrl+Maj+A">Archiver ce projet et ses fichiers</MenuItem>
</Menu>`,
            },
            {
              title: 'On a phone',
              when: 'The trigger sits in a 320px wide view.',
              explain: [
                'The list stays inside the screen and flips or shifts as needed. Nothing needs a media query from you.',
                'Items are at least 32px tall, above the 24px minimum for a touch target (WCAG 2.5.8, AA).',
                '`placement="bottom end"` suits a trigger at the end of a row, where the list would otherwise run off the edge.',
              ],
              frame: 'phone',
              render: (
                <Menu trigger={<IconButton label="More actions" icon={<Icon glyph="more" />} variant="secondary" />} label="More actions" placement="bottom end">
                  <MenuItem id="rename" icon="edit">Rename</MenuItem>
                  <MenuItem id="duplicate" icon="copy">Duplicate</MenuItem>
                </Menu>
              ),
              code: `<Menu
  trigger={<IconButton label="More actions" icon={<Icon glyph="more" />} variant="secondary" />}
  label="More actions"
  // No size props or media queries: the list fits the screen by itself.
  placement="bottom end"
>
  <MenuItem id="rename" icon="edit">Rename</MenuItem>
  <MenuItem id="duplicate" icon="copy">Duplicate</MenuItem>
</Menu>`,
            },
          ],
        },
        {
          title: 'Accessibility and the flow',
          examples: [
            {
              title: 'Disabled trigger, with the reason',
              when: 'The whole menu does not apply now, for example while a list loads.',
              explain: [
                'A disabled `Button` takes no focus and cannot open the menu. The native `disabled` attribute does this for you.',
                'Say why beside it. `aria-describedby` links the text to the button, so a screen reader that reaches it reads the reason (Nielsen heuristic 1, visibility of system status).',
              ],
              render: (
                <Stack gap={2} align="start">
                  <Menu trigger={<Button variant="secondary" disabled aria-describedby="menu-why">Actions</Button>} label="Actions">
                    <MenuItem id="rename">Rename</MenuItem>
                  </Menu>
                  <Text variant="caption" tone="muted" as="p" id="menu-why">Actions turn on when you select a row.</Text>
                </Stack>
              ),
              code: `<Stack gap={2} align="start">
  <Menu
    // disabled = not now. aria-describedby links the reason below.
    trigger={<Button variant="secondary" disabled aria-describedby="menu-why">Actions</Button>}
    label="Actions"
  >
    <MenuItem id="rename">Rename</MenuItem>
  </Menu>
  <Text variant="caption" tone="muted" as="p" id="menu-why">
    Actions turn on when you select a row.
  </Text>
</Stack>`,
            },
            {
              title: 'Without a trigger',
              when: 'A preview or an embedded panel draws the open list in the page.',
              explain: [
                'Leave out `trigger` and the menu draws open, in the normal flow. There is no popover and no focus move.',
                '`label` is still required: it names the list for screen readers (WCAG 4.1.2, A).',
                'This shape is for previews and docs. In an app, give the menu a trigger so keyboard users have a place to start.',
              ],
              render: (
                <Menu label="Project actions">
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="duplicate">Duplicate</MenuItem>
                </Menu>
              ),
              code: `// No trigger: the list is drawn open, in the page.
<Menu label="Project actions">
  <MenuItem id="rename">Rename</MenuItem>
  <MenuItem id="duplicate">Duplicate</MenuItem>
</Menu>`,
            },
          ],
        },
      ]}
    />
  ),
};
