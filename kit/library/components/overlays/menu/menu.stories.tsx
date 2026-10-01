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
      guide="overlays-menu--docs"
      guideName="Menu"
      groups={[
        {
          title: 'Triggers',
          kicker: 'The trigger is the one tab stop. Enter, Space or Down opens the menu. Each example starts closed.',
          examples: [
            {
              title: 'Text button',
              when: 'The menu holds the secondary actions of a view, and the trigger has room for a word.',
              render: (
                <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions">
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="duplicate">Duplicate</MenuItem>
                  <MenuItem id="archive">Archive</MenuItem>
                </Menu>
              ),
            },
            {
              title: 'Row actions',
              when: 'A table row or a card holds rare actions. An icon button opens the menu and names it. The menu aligns to the end.',
              render: <RowActions />,
              code: `function Example() {
  const [status, setStatus] = useState('');
  return (
    <Stack gap={2} align="start">
      <Menu
        trigger={<IconButton label="More actions" icon={<Icon glyph="more" />} variant="secondary" />}
        label="More actions"
        placement="bottom end"
        onAction={(key) => setStatus(\`You chose \${String(key)}.\`)}
      >
        <MenuItem id="rename">Rename</MenuItem>
        <MenuItem id="duplicate">Duplicate</MenuItem>
        <MenuSeparator />
        <MenuItem id="delete" destructive>Delete project</MenuItem>
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
          kicker: 'An item takes an icon, a description, a shortcut hint, a disabled state and a destructive look.',
          examples: [
            {
              title: 'Icons and shortcuts',
              when: 'The actions are known by an icon or a key combination. The shortcut is a hint; the app binds the key.',
              render: (
                <Menu trigger={<Button variant="secondary">File</Button>} label="File">
                  <MenuItem id="new" icon="plus" shortcut="Ctrl+N">New file</MenuItem>
                  <MenuItem id="edit" icon="edit" shortcut="F2">Rename</MenuItem>
                  <MenuItem id="copy" icon="copy" shortcut="Ctrl+D">Duplicate</MenuItem>
                  <MenuItem id="download" icon="download">Download</MenuItem>
                </Menu>
              ),
            },
            {
              title: 'Descriptions',
              when: 'Two actions sound alike, and a second line says what each does.',
              render: (
                <Menu trigger={<Button variant="secondary">Export</Button>} label="Export">
                  <MenuItem id="current" description="The rows on this page">Export page</MenuItem>
                  <MenuItem id="all" description="Every row, with the active filters">Export everything</MenuItem>
                </Menu>
              ),
            },
            {
              title: 'Disabled item',
              when: 'An action exists but does not apply now. The item stays in place so the menu does not shift.',
              render: (
                <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions" disabledKeys={['archive']}>
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="archive">Archive</MenuItem>
                  <MenuItem id="share">Share</MenuItem>
                </Menu>
              ),
            },
            {
              title: 'Destructive item',
              when: 'An action deletes something. It goes last, in its own group, and its label names what it deletes.',
              render: (
                <Menu trigger={<Button variant="secondary">Project</Button>} label="Project">
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="duplicate">Duplicate</MenuItem>
                  <MenuSeparator />
                  <MenuItem id="delete" icon="close" destructive>Delete project</MenuItem>
                </Menu>
              ),
            },
            {
              title: 'Items from data',
              when: 'The items come from a list, such as the formats a server supports.',
              render: (
                <Menu trigger={<Button variant="secondary">Download as</Button>} label="Download as" items={fileTypes}>
                  {(type) => <MenuItem id={type.id}>{type.name}</MenuItem>}
                </Menu>
              ),
              code: `const fileTypes = [
  { id: 'pdf', name: 'PDF document' },
  { id: 'csv', name: 'CSV file' },
  { id: 'png', name: 'PNG image' },
];

<Menu trigger={<Button variant="secondary">Download as</Button>} label="Download as" items={fileTypes}>
  {(type) => <MenuItem id={type.id}>{type.name}</MenuItem>}
</Menu>`,
            },
          ],
        },
        {
          title: 'Groups',
          examples: [
            {
              title: 'Named sections',
              when: 'Many actions fall into groups, and the group name helps people scan. The title also names the group for assistive technology.',
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
            },
            {
              title: 'Separator',
              when: 'Two groups need a rule between them and no names.',
              render: (
                <Menu trigger={<Button variant="secondary">Document</Button>} label="Document">
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="duplicate">Duplicate</MenuItem>
                  <MenuSeparator />
                  <MenuItem id="print">Print</MenuItem>
                </Menu>
              ),
            },
          ],
        },
        {
          title: 'Choosing',
          kicker: 'A chosen item shows a check and a fill, never the fill alone.',
          examples: [
            {
              title: 'Single choice',
              when: 'The user picks one view. Choosing an item closes the menu.',
              render: (
                <Menu trigger={<Button variant="secondary">View</Button>} label="View" selectionMode="single" defaultSelectedKeys={['list']}>
                  <MenuItem id="list">List</MenuItem>
                  <MenuItem id="grid">Grid</MenuItem>
                  <MenuItem id="details">Details</MenuItem>
                </Menu>
              ),
            },
            {
              title: 'Multiple choice',
              when: 'The user toggles several options. The menu stays open between choices.',
              render: (
                <Menu trigger={<Button variant="secondary">Columns</Button>} label="Columns" selectionMode="multiple" defaultSelectedKeys={['name', 'date']}>
                  <MenuItem id="name">Name</MenuItem>
                  <MenuItem id="owner">Owner</MenuItem>
                  <MenuItem id="date">Date</MenuItem>
                </Menu>
              ),
            },
            {
              title: 'Controlled choice',
              when: 'The app reads the choice, such as a sort order that drives a list.',
              render: <SortOrder />,
              code: `function Example() {
  const [sort, setSort] = useState(new Set(['recent']));
  const names = { recent: 'Most recent', name: 'Name', size: 'Size' };
  return (
    <Stack gap={2} align="start">
      <Menu
        trigger={<Button variant="secondary">Sort</Button>}
        label="Sort"
        selectionMode="single"
        selectedKeys={sort}
        onSelectionChange={(keys) => setSort(new Set(keys))}
      >
        <MenuItem id="recent">Most recent</MenuItem>
        <MenuItem id="name">Name</MenuItem>
        <MenuItem id="size">Size</MenuItem>
      </Menu>
      <Text as="p" role="status">{\`Sorted by \${names[[...sort][0]]}.\`}</Text>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Placement and open state',
          examples: [
            {
              title: 'Opens above',
              when: 'The trigger sits at the bottom of the screen. The menu still flips when it does not fit.',
              render: (
                <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions" placement="top start">
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="duplicate">Duplicate</MenuItem>
                </Menu>
              ),
            },
            {
              title: 'Opens to the side',
              when: 'The trigger sits in a narrow column, such as a sidebar. The menu opens beside it.',
              render: (
                <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions" placement="end top">
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="duplicate">Duplicate</MenuItem>
                </Menu>
              ),
            },
            {
              title: 'Controlled open state',
              when: 'The app needs to know whether the menu is open.',
              render: <OpenFromElsewhere />,
              code: `function Example() {
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
}`,
            },
          ],
        },
        {
          title: 'Content',
          examples: [
            {
              title: 'Long list',
              when: 'The menu holds many items. It scrolls inside the viewport, and typeahead reaches any item.',
              render: (
                <Menu trigger={<Button variant="secondary">City</Button>} label="City" selectionMode="single">
                  {cities.map((city) => <MenuItem key={city} id={city}>{city}</MenuItem>)}
                </Menu>
              ),
              code: `<Menu trigger={<Button variant="secondary">City</Button>} label="City" selectionMode="single">
  {cities.map((city) => <MenuItem key={city} id={city}>{city}</MenuItem>)}
</Menu>`,
            },
            {
              title: 'Long labels in a narrow column',
              when: 'Translated labels run long. The menu caps its width to the screen.',
              frame: 'narrow',
              render: (
                <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions">
                  <MenuItem id="rename" description="Donnez un nouveau nom à ce projet">Renommer le projet</MenuItem>
                  <MenuItem id="archive" shortcut="Ctrl+Maj+A">Archiver ce projet et ses fichiers</MenuItem>
                </Menu>
              ),
            },
            {
              title: 'On a phone',
              when: 'The trigger sits in a 320px view. The menu stays inside the screen.',
              frame: 'phone',
              render: (
                <Menu trigger={<IconButton label="More actions" icon={<Icon glyph="more" />} variant="secondary" />} label="More actions" placement="bottom end">
                  <MenuItem id="rename" icon="edit">Rename</MenuItem>
                  <MenuItem id="duplicate" icon="copy">Duplicate</MenuItem>
                </Menu>
              ),
            },
          ],
        },
        {
          title: 'In the flow',
          examples: [
            {
              title: 'Without a trigger',
              when: 'A preview or an embedded panel draws the open list in the flow, with no popover and no focus move.',
              render: (
                <Menu label="Project actions">
                  <MenuItem id="rename">Rename</MenuItem>
                  <MenuItem id="duplicate">Duplicate</MenuItem>
                </Menu>
              ),
            },
          ],
        },
      ]}
    />
  ),
};
