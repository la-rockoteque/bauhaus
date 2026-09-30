import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { Icon } from '../../../primitives/icon/icon';
import { Stack } from '../../../primitives/stack/stack';
import { Button } from '../../clickables/button/button';
import { IconButton } from '../../clickables/icon-button/icon-button';
import { MenuItem } from '../../clickables/menu-item/menu-item';
import { Menu, MenuSection, MenuSeparator } from './menu';
import { menuRules } from './menu.rules';

// The showcase: one page story. The states grid replaces one story per state.
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
      anatomy={{
        render: <Menu label="Project actions">{projectItems}</Menu>,
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
        { label: 'Radius and rung', value: 'radius.overlay · shadow.1' },
        { label: 'Keys', value: 'Enter, Space or Down opens · arrows move · a letter jumps · Enter or Space acts · Escape closes and returns focus' },
        { label: 'Selection', value: 'none (actions) · single (radio items) · multiple (checkbox items); a check marks the chosen items' },
      ]}
      api={[
        { label: 'trigger', value: 'The button that opens the menu. Without it the open list is drawn in the flow.' },
        { label: 'label', value: 'Required. The accessible name of the menu.' },
        { label: 'children', value: 'MenuItem, MenuSection and MenuSeparator.' },
        { label: 'onAction', value: 'Called with the item id when an action item is pressed. The menu closes.' },
        { label: 'selectionMode · selectedKeys · defaultSelectedKeys · onSelectionChange', value: '"none" (default) | "single" | "multiple". A choosing menu stays open in multiple mode.' },
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
          { id: 'multiple', status: 'designed', group: 'interaction', label: 'Selected (multiple)', render: views('multiple'), trigger: 'selectionMode="multiple"', note: 'Each item toggles. The menu stays open.' },
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
      rules={menuRules}
      guide="overlays-menu--docs"
      guideName="Menu"
    />
  ),
};
