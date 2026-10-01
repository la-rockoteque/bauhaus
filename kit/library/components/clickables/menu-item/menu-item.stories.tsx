import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Button } from '../button/button';
import { Menu, MenuSection, MenuSeparator } from '../../overlays/menu/menu';
import { MenuItem } from './menu-item';
import type { IconGlyph } from '../../../primitives/icon/icon';
import { menuItemRules } from './menu-item.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Clickables/Menu item', parameters: { layout: 'fullscreen' } } satisfies Meta;

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

const inMenu = (children: ReactNode, props: Partial<Parameters<typeof Menu>[0]> = {}) => <Menu label="Project actions" {...props}>{children}</Menu>;

const ICONS = ['check', 'close', 'search', 'settings'] as const satisfies readonly IconGlyph[];

const HOVER = ['data-focused'] as const;
const FOCUS = ['data-focused', 'data-focus-visible'] as const;
const PRESS = ['data-focused', 'data-pressed'] as const;

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Menu item"
      layer="Component"
      family="Clickables"
      plain="A menu item is one row in a menu: an action you can pick. It can carry an icon, a second line of detail and a hint of the keyboard shortcut."
      precise="Component in the clickables family · the styled React Aria MenuItem that Menu composes · one action or one choice · lives only inside a menu."
      usedFor="Rename, duplicate, delete; a layout choice; a column toggle."
      tokens={{
        mode: 'consumed',
        note: 'The menu item has no component tokens.',
        rows: [
          { name: 'state.hover-layer · state.pressed-layer', tier: 'role', use: 'Fill of the highlighted item (hover and arrows) and of a pressed item', swatch: '--ds-state-hover-layer' },
          { name: 'state.selected', tier: 'role', use: 'Fill of a chosen item, beside its check', swatch: '--ds-state-selected' },
          { name: 'status.error', tier: 'role', use: 'Text of a destructive item; 4.5:1 on the overlay surface', swatch: '--ds-status-error' },
          { name: 'text.default · text.muted', tier: 'role', use: 'Label; description and shortcut', swatch: '--ds-text-muted' },
          { name: 'disabled.text', tier: 'role', use: 'Label, description and shortcut of a disabled item', swatch: '--ds-disabled-text' },
          { name: 'focus.ring.color · width', tier: 'role', use: 'Focus ring, drawn inside the item', swatch: '--ds-focus-ring-color' },
          { name: 'text.body.* · text.caption.* · text.code.*', tier: '2', use: 'Label; description; shortcut' },
          { name: 'size.control.md · size.icon.sm', tier: '2', use: 'Minimum height; icon box' },
          { name: 'space.control.inline · space.control.gap · space.inset.xs · space.inline.md', tier: '2', use: 'Padding and gaps' },
          { name: 'radius.control', tier: '2', use: 'Corner radius of the highlight' },
        ],
      }}
      stage={{
        render: (args) =>
          inMenu(
            <MenuItem
              id="save"
              icon={args.icon as IconGlyph}
              description={String(args.description) || undefined}
              shortcut={String(args.shortcut) || undefined}
              destructive={args.destructive === true}
              isDisabled={args.isDisabled === true}
            >
              {String(args.children)}
            </MenuItem>,
          ),
        parts: [
          { n: 1, label: 'Container', note: 'role menuitem, required', target: '.ds-menu-item', at: 'top-start' },
          { n: 2, label: 'Icon', note: 'optional, hidden from assistive technology', target: '.ds-menu-item__lead', at: 'top-start' },
          { n: 3, label: 'Label', note: 'children, a string, required', target: '.ds-menu-item__label' },
          { n: 4, label: 'Description', note: 'optional', target: '.ds-menu-item__description', at: 'bottom-start' },
          { n: 5, label: 'Shortcut', note: 'optional hint', target: '.ds-menu-item__shortcut', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Minimum height', value: 'size.control.md, 32px; a description makes the item taller' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-menu-item', token: 'space.control.inline' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-menu-item', token: 'space.inset.xs' },
        { label: 'Radius', property: 'radius', target: '.ds-menu-item', token: 'radius.control' },
        { label: 'Label', value: 'text.body.*, wraps, never truncates' },
        { label: 'Description', value: 'text.caption.*, text.muted, read by assistive technology as the description' },
        { label: 'Focus', value: 'ring 2px drawn inside the item, on data-focus-visible' },
      ]}
      api={[
        { label: 'children', value: 'The label, a string. It names the item and feeds the typeahead.', control: { kind: 'text', value: 'Save' } },
        { label: 'id', value: 'The key. It comes back in onAction and in the selected keys.' },
        { label: 'icon', value: 'A glyph name, drawn before the label. In a choosing menu the check takes its place.', control: { kind: 'select', options: ICONS, value: 'check' } },
        { label: 'description', value: 'A second line of detail.', control: { kind: 'text', value: 'Write the file to disk' } },
        { label: 'shortcut', value: 'A hint of the key combination, such as "Ctrl+S". A hint only; the app binds the key.', control: { kind: 'text', value: 'Ctrl+S' } },
        { label: 'destructive', value: 'The action deletes or discards. Reads in the error colour; the label must say what it deletes.', control: { kind: 'boolean', value: false } },
        { label: 'isDisabled', value: 'Stays in the list, skipped by the arrows.', control: { kind: 'boolean', value: false } },
        { label: '…props', value: 'onAction, href, textValue and the other React Aria MenuItem props.' },
      ]}
      states={{
        note: 'Every cell is a real item inside a real menu, drawn open in the flow. Hover, focus and press set the data attributes React Aria sets, so the stylesheet rule shown is the real one.',
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'An item always has a label.' },
          { id: 'loading', status: 'n/a', reason: 'A menu closes on action. A running action is shown by the view, not by the item.' },
          { id: 'none', status: 'n/a', reason: 'An item holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'An item holds no collection.' },
          { id: 'some', status: 'designed', render: inMenu(<MenuItem id="save" icon="check" description="Write the file to disk" shortcut="Ctrl+S">Save</MenuItem>), trigger: 'icon, description, shortcut' },
          { id: 'too-many', status: 'designed', label: 'Too many (long label)', render: <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 5)' }}>{inMenu(<MenuItem id="long" description="Also removes the copies kept in the shared drive">Move every draft in this folder to the archive</MenuItem>)}</div>, trigger: 'long children', note: 'The label and the description wrap. Nothing truncates.' },
          { id: 'incorrect', status: 'n/a', reason: 'A failed action is reported by the view, not by the item.' },
          { id: 'correct', status: 'n/a', reason: 'An item confirms nothing.' },
          { id: 'done', status: 'n/a', reason: 'The menu closes on action; the view announces the result.' },
          { id: 'default', status: 'designed', render: inMenu(<MenuItem id="duplicate">Duplicate</MenuItem>), trigger: 'none' },
          { id: 'hover', status: 'designed', render: <Forced attributes={HOVER}>{inMenu(<MenuItem id="duplicate">Duplicate</MenuItem>)}</Forced>, trigger: '[data-focused]', note: 'Hover and the arrow keys move the same highlight.' },
          { id: 'focus-visible', status: 'designed', render: <Forced attributes={FOCUS}>{inMenu(<MenuItem id="duplicate">Duplicate</MenuItem>)}</Forced>, trigger: '[data-focus-visible]', note: 'Highlight and ring, drawn inside the item.' },
          { id: 'active', status: 'designed', render: <Forced attributes={PRESS}>{inMenu(<MenuItem id="duplicate">Duplicate</MenuItem>)}</Forced>, trigger: '[data-pressed]' },
          { id: 'disabled', status: 'designed', render: inMenu(<MenuItem id="archive" isDisabled description="Only owners can archive">Archive</MenuItem>), trigger: 'isDisabled', note: 'Stays in the list. The description says why.' },
          { id: 'selected', status: 'designed', render: inMenu(<MenuItem id="list">List</MenuItem>, { selectionMode: 'single', defaultSelectedKeys: ['list'] }), trigger: 'selected in a choosing menu', note: 'A check and a fill; never the fill alone.' },
          { id: 'default', variant: 'Destructive', status: 'designed', render: inMenu(<MenuItem id="delete" destructive>Delete project</MenuItem>), trigger: 'destructive', note: 'Error colour and a label that names what goes.' },
        ],
      }}
      dos={[
        { text: 'Start the label with a verb and name the object: "Delete project".', basis: 'WCAG 2.4.6 (AA)' },
        { text: 'Give a destructive item its own group at the end of the menu.', basis: 'Nielsen 5' },
        { text: 'Mark a chosen item with a check as well as a fill.', basis: 'WCAG 1.4.1 (A)' },
        { text: 'Say why an item is disabled in its description.', basis: 'Nielsen 1' },
      ]}
      donts={[
        { text: 'Rely on red alone to mark a destructive item.', basis: 'WCAG 1.4.1 (A)', rule: 'menu-item.destructive-named' },
        { text: 'Let the icon name the item.', basis: 'WCAG 1.1.1 (A)', rule: 'menu-item.icon-hidden' },
        { text: 'Bind the key from the shortcut prop.', basis: 'Project decision', rule: 'menu-item.shortcut-hint' },
        { text: 'Make an item shorter than the 24px floor.', basis: 'WCAG 2.5.8 (AA); 24px house floor', rule: 'menu-item.touch-target' },
        { text: 'Write a colour or px literal in menu-item.css.', basis: 'misfile.raw-value-in-component', rule: 'menu-item.no-literal' },
      ]}
      guide="clickables-menu-item--docs"
      guideName="Menu item"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Menu item" layer="Component" family="Clickables" rules={menuItemRules} guide="clickables-menu-item--docs" guideName="Menu item" />,
};

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Menu item"
      layer="Component"
      family="Clickables"
      imports="import { Button, Menu, MenuItem, MenuSection, MenuSeparator } from '@acme/design-system';"
      guide="clickables-menu-item--docs"
      guideName="Menu item"
      groups={[
        {
          title: 'Content',
          kicker: 'An item holds a label, and may add an icon, a description and a shortcut hint. Without a trigger, the Menu draws the list open, in the flow.',
          examples: [
            { title: 'Label only', when: 'A plain action. Start with a verb and name the object.', render: <Menu label="File actions"><MenuItem id="duplicate">Duplicate file</MenuItem></Menu> },
            { title: 'With an icon', when: 'An action with a well-known symbol. The icon is decoration; the label names the item.', render: <Menu label="File actions"><MenuItem id="edit" icon="edit">Rename file</MenuItem></Menu> },
            { title: 'With a description', when: 'Add a consequence, or the reason the item is unavailable. It is read as the item description.', render: <Menu label="File actions"><MenuItem id="share" icon="user" description="Anyone with the link can view">Share file</MenuItem></Menu> },
            { title: 'With a shortcut hint', when: 'The app binds a key for this action. The prop shows it and binds nothing.', render: <Menu label="File actions"><MenuItem id="save" icon="check" shortcut="Ctrl+S">Save file</MenuItem></Menu> },
            { title: 'All parts', when: 'A frequent action that needs an icon, a detail line and a key hint.', render: <Menu label="File actions"><MenuItem id="download" icon="download" description="Saves a copy as a PDF" shortcut="Ctrl+D">Download file</MenuItem></Menu> },
          ],
        },
        {
          title: 'States',
          kicker: 'Hover and keyboard focus share one highlight. Disabled items stay in the list.',
          examples: [
            { title: 'Disabled', when: 'The action is not available. The description says why.', render: <Menu label="Project actions"><MenuItem id="archive" icon="folder" isDisabled description="Only owners can archive">Archive project</MenuItem></Menu> },
            { title: 'Destructive', when: 'The item deletes or discards something. The label names what goes.', render: <Menu label="Project actions"><MenuItem id="delete" icon="delete" destructive>Delete project</MenuItem></Menu> },
            { title: 'Destructive and disabled', when: 'A delete the user is not allowed to run now.', render: <Menu label="Project actions"><MenuItem id="delete" icon="delete" destructive isDisabled description="Remove the members first">Delete project</MenuItem></Menu> },
          ],
        },
        {
          title: 'Selection',
          kicker: 'In a choosing menu a check takes the place of the icon.',
          examples: [
            { title: 'Single choice', when: 'One value out of a short list, such as a view mode.', render: (
              <Menu label="View" selectionMode="single" defaultSelectedKeys={['list']}>
                <MenuItem id="list">List</MenuItem>
                <MenuItem id="grid">Grid</MenuItem>
                <MenuItem id="board">Board</MenuItem>
              </Menu>
            ) },
            { title: 'Multiple choice', when: 'Several independent options, such as the columns of a table.', render: (
              <Menu label="Columns" selectionMode="multiple" defaultSelectedKeys={['name', 'owner']}>
                <MenuItem id="name">Name</MenuItem>
                <MenuItem id="owner">Owner</MenuItem>
                <MenuItem id="updated">Last updated</MenuItem>
              </Menu>
            ) },
            { title: 'Selected and disabled', when: 'A choice that is on and cannot be changed now.', render: (
              <Menu label="Columns" selectionMode="multiple" defaultSelectedKeys={['name']} disabledKeys={['name']}>
                <MenuItem id="name" description="Always shown">Name</MenuItem>
                <MenuItem id="owner">Owner</MenuItem>
              </Menu>
            ) },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Items live in a Menu. Sections and separators group them.',
          examples: [
            { title: 'Menu with a trigger', when: 'The usual case. A button opens the menu; Escape closes it and returns focus.', render: (
              <Menu label="Project actions" trigger={<Button variant="secondary">Actions</Button>}>
                <MenuItem id="rename" icon="edit">Rename project</MenuItem>
                <MenuItem id="duplicate" icon="copy">Duplicate project</MenuItem>
                <MenuItem id="delete" icon="delete" destructive>Delete project</MenuItem>
              </Menu>
            ) },
            { title: 'Named sections', when: 'Related items under a title that a screen reader announces.', render: (
              <Menu label="Document actions">
                <MenuSection title="Edit">
                  <MenuItem id="rename" icon="edit">Rename</MenuItem>
                  <MenuItem id="copy" icon="copy">Copy</MenuItem>
                </MenuSection>
                <MenuSection title="Share">
                  <MenuItem id="download" icon="download">Download</MenuItem>
                  <MenuItem id="mail" icon="mail">Send by email</MenuItem>
                </MenuSection>
              </Menu>
            ) },
            { title: 'Separator before a destructive item', when: 'Keep the item that deletes apart from the safe ones.', render: (
              <Menu label="Project actions">
                <MenuItem id="rename" icon="edit">Rename project</MenuItem>
                <MenuItem id="duplicate" icon="copy">Duplicate project</MenuItem>
                <MenuSeparator />
                <MenuItem id="delete" icon="delete" destructive>Delete project</MenuItem>
              </Menu>
            ) },
            { title: 'With a typeahead text value', when: 'The visible label is not the best text to match. Set textValue for the typeahead and the name.', render: <Menu label="Sort"><MenuItem id="newest" textValue="Newest first">Newest first (default)</MenuItem></Menu> },
          ],
        },
        {
          title: 'Content cases',
          kicker: 'The label and the description wrap. Nothing truncates.',
          examples: [
            { title: 'Long label', when: 'A long label in a narrow menu. It wraps onto a second line.', frame: 'narrow', render: <Menu label="Folder actions"><MenuItem id="move" icon="folder">Move every draft in this folder to the archive</MenuItem></Menu> },
            { title: 'Long description', when: 'A long consequence under a short label.', frame: 'narrow', render: <Menu label="Folder actions"><MenuItem id="move" icon="folder" description="Also removes the copies kept in the shared drive">Archive folder</MenuItem></Menu> },
            { title: 'Translated item', when: 'Every text arrives as a prop, so the item takes the app language.', frame: 'narrow', render: <Menu label="Actions du projet"><MenuItem id="supprimer" icon="delete" destructive description="Supprime aussi ses fichiers" shortcut="Suppr">Supprimer le projet</MenuItem></Menu> },
            { title: 'All parts at phone width', when: 'An item with icon, description and shortcut in the narrowest column.', frame: 'phone', render: <Menu label="File actions"><MenuItem id="download" icon="download" description="Saves a copy as a PDF" shortcut="Ctrl+D">Download file</MenuItem></Menu> },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The menu has a name, and each item feeds the typeahead.',
          examples: [
            { title: 'Named menu', when: 'The label names the menu for assistive technology, usually like its trigger.', render: (
              <Menu label="Project actions" trigger={<Button>Project actions</Button>}>
                <MenuItem id="rename">Rename project</MenuItem>
                <MenuItem id="duplicate">Duplicate project</MenuItem>
              </Menu>
            ) },
            { title: 'Disabled with a reason', when: 'Use the description to say why the item is off, so the reason is read with the name.', render: <Menu label="Project actions"><MenuItem id="publish" isDisabled description="Add a title to publish">Publish project</MenuItem></Menu> },
          ],
        },
      ]}
    />
  ),
};
