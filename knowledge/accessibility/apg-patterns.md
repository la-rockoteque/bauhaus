---
id: accessibility/apg-patterns
title: ARIA Authoring Practices patterns
shelf: accessibility
layer: component
owner: ux-designer
tags: [apg, aria, keyboard, widgets, roles]
sources:
  - WAI-ARIA Authoring Practices Guide (APG) patterns — https://www.w3.org/WAI/ARIA/apg/patterns/
  - ARIA in HTML — https://www.w3.org/TR/html-aria/
  - First rule of ARIA use — https://www.w3.org/TR/using-aria/#rule1
---

# ARIA Authoring Practices patterns

> The APG describes how well-known widgets (tabs, menus, dialogs) must respond to the keyboard and to a screen reader. If a component copies a pattern, the APG is the spec. Do not invent the keys.

## Rules

1. Use a native element first. `<button>`, `<a href>`, `<details>`, `<dialog>`, `<input type="checkbox">`, `<select>` and `<input type="date">` ship with correct keyboard and semantics. (Basis: ARIA "first rule of ARIA use".)
2. Reach for an APG pattern only when no native element does the job. (Basis: APG "No ARIA is better than bad ARIA".)
3. When a component implements a pattern, follow the APG keyboard table exactly. (Basis: WCAG 2.1.1 Keyboard (A), 4.1.2 Name, Role, Value (A).)
4. Give every widget an accessible name, a role and its state. (Basis: WCAG 4.1.2 (A).)
5. A composite widget (tabs, menu, listbox, grid, radio group, toolbar, tree) has one Tab stop. Arrow keys move inside it. (Basis: APG roving tabindex and `aria-activedescendant`.)
6. Never trap focus, except in a modal dialog. Esc closes the modal and focus returns to the trigger. (Basis: WCAG 2.1.2 No Keyboard Trap (A), 2.4.3 Focus Order (A).)
7. A tooltip opens on focus as well as on hover. Esc dismisses it. (Basis: WCAG 1.4.13 Content on Hover or Focus (AA).)
8. Test the keyboard contract by hand. Automated tools do not check it. (Basis: `accessibility/testing.md`.)

## The 30 patterns

Key names: Tab, Shift+Tab, Enter, Space, Esc, arrows, Home, End, PgUp, PgDn. "Native" means use the HTML element and add nothing.

| Pattern | Native first? | Keyboard contract in brief |
|---|---|---|
| Accordion | `<details>` for simple cases | Enter or Space toggles a header. Tab moves between headers. Optional: arrows, Home, End move between headers. |
| Alert | `role="alert"` on a live region | No keys. Never moves focus. The text is announced at once. |
| Alert and Message Dialogs | `<dialog>` | Focus moves to the least destructive action or the message. Enter activates. Esc closes. Tab stays inside. |
| Breadcrumb | `<nav aria-label>` with an ordered list | Tab moves through links. The last item has `aria-current="page"`. |
| Button | `<button>` | Enter and Space activate. Toggle button uses `aria-pressed`. |
| Carousel | none | Rotation control first in Tab order. Auto-rotation stops on focus or hover and has a pause button. |
| Checkbox | `<input type="checkbox">` | Space toggles. Mixed state uses `aria-checked="mixed"`. |
| Combobox | `<datalist>` or `<select>` for simple cases | Down opens the list. Up and Down move the active option. Enter accepts. Esc closes, then clears. Focus stays in the input. |
| Dialog (Modal) | `<dialog>` with `showModal()` | Focus moves in on open. Tab and Shift+Tab cycle inside. Esc closes. Focus returns to the trigger. |
| Disclosure | `<details>` | Enter or Space toggles. `aria-expanded` on the button. |
| Feed | none | PgDn and PgUp move between articles. Ctrl+End and Ctrl+Home leave the feed. |
| Grid | none | Arrows move by cell. Home, End move in a row. Ctrl+Home, Ctrl+End move to the first and last cell. One Tab stop. |
| Landmarks | `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>` | Not interactive. Label a landmark when its role appears twice. |
| Link | `<a href>` | Enter activates. Never use `<a>` without `href` as a button. |
| Listbox | `<select>` | Up and Down move. Home and End jump. Typeahead selects. Multi-select uses Shift+arrows and Space. |
| Menu and Menubar | none | Arrows move. Enter or Space activates. Esc closes. Left and Right move across a menubar and open submenus. |
| Menu Button | none | Enter, Space or Down opens. Up opens on the last item. Focus enters the menu. Esc returns focus to the button. |
| Meter | `<meter>` | Not interactive. Provide name and value. |
| Radio Group | `<input type="radio">` in a `fieldset` | Tab enters the group at the checked radio. Arrows move and check. Space checks the focused one. |
| Slider | `<input type="range">` | Left and Right, or Up and Down, change by one step. Home and End set min and max. PgUp and PgDn change by a large step. |
| Slider (Multi-Thumb) | two `<input type="range">` | Same keys per thumb. Each thumb has its own name. Thumbs do not cross. |
| Spinbutton | `<input type="number">` | Up and Down change by one step. Home and End set min and max. |
| Switch | `<input type="checkbox" role="switch">` | Space toggles. Enter may also toggle. |
| Table | `<table>` | Not interactive. Use `<th scope>` and a `<caption>`. |
| Tabs | none | Tab enters the tab list at the selected tab, then to the panel. Left and Right move. Home and End jump. Automatic or manual activation. |
| Toolbar | none | One Tab stop. Left and Right move between controls. Home and End jump. |
| Tooltip | `title` is not enough | Opens on focus and hover. Esc dismisses. Not for essential content. |
| Tree View | none | Up and Down move. Right opens or enters a node. Left closes or goes to the parent. Home and End jump. `*` opens siblings. |
| Treegrid | none | Grid keys plus Right and Left to expand and collapse a row. |
| Window Splitter | none | Arrows resize by a step. Enter toggles collapse. Home and End set min and max. |

## Common defects by pattern

| Pattern | Frequent defect |
|---|---|
| Tabs | Tab key moves between tabs, instead of arrows. The panel is not reachable by Tab. |
| Dialog | No focus move on open. No restore on close. Background stays reachable. |
| Combobox | Focus moves into the popup list, so typing stops. |
| Menu Button | A plain list of links wrapped in `role="menu"`. Use a disclosure for navigation. |
| Tooltip | Opens on hover only. Holds a link or a button. |
| Accordion | Header is a `div` with a click handler. |
| Grid | Used for a plain data table, which then loses simple table navigation. |

## Why

Widgets built from `div` elements have no keyboard behaviour and no semantics until someone adds them. The APG records the behaviour that assistive-technology users already expect. A different behaviour costs them time or blocks them. ARIA changes only what is announced, not what the element does. Adding `role="button"` to a `div` adds no key handling.

## Rulebook seeds

- `apg.native-first` · review · MEDIUM · A custom widget exists only where no native element fits.
- `apg.keyboard-contract` · review · HIGH · The widget follows its APG key table. WCAG 2.1.1 (A).
- `apg.single-tab-stop` · auto · MEDIUM · A composite widget exposes one tab stop (roving `tabindex`).
- `apg.dialog-focus` · auto · HIGH · A dialog moves focus in and restores it. WCAG 2.4.3 (A).
- `apg.tooltip-focus` · auto · HIGH · A tooltip opens on focus. WCAG 1.4.13 (AA).
- `apg.name-role-state` · auto · HIGH · Each widget has a name, role and state. WCAG 4.1.2 (A).

## Misfiles

- A pure-CSS state (hover style) is a token or component matter, not a pattern here.
- A screen-level flow (wizard, filtering) belongs in `patterns/`.
- `role="menu"` for site navigation is a misuse. Use `<nav>` with a list and a disclosure.

## See also

- `accessibility/wcag-map.md`
- `accessibility/testing.md`
- `components/catalog.md`
- `components/api-design.md`
