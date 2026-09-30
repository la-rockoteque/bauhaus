---
id: components/catalog
title: Component catalog
shelf: components
layer: component
owner: ux-designer
tags: [catalog, button, field, dialog, table, checklist, apg]
sources:
  - WAI-ARIA Authoring Practices Guide — https://www.w3.org/WAI/ARIA/apg/patterns/
  - WCAG 2.2 — https://www.w3.org/TR/WCAG22/
  - GOV.UK Design System components — https://design-system.service.gov.uk/components/
  - Carbon Design System components — https://carbondesignsystem.com/components/overview/
---

# Component catalog

> A checklist per common component: the job it does, its parts, the states it must show, the pattern it follows and the defects seen most often. Use it to build a component, to review one, or to seed the rulebook.

## Rules

1. Check a component against its entry before you call it done. (Basis: four artifacts; `UBIQUITOUS-LANGUAGE.md`.)
2. Name required states from `states/model.md`. The matrix lives in `states/state-matrix.md`. Ids follow `<component>.state.<state>`.
3. Every interactive component needs the interaction states default, hover, focus-visible, active and disabled, unless the entry says otherwise. (Basis: WCAG 2.4.7 Focus Visible (AA).)
4. Give each rulebook seed a stable id. Never rename an id once written. (Basis: `governance/rulebook.md`.)

Each entry lists: job, anatomy (`?` = optional), required states, APG pattern, key WCAG, top 3 defects, rulebook seeds.

## Actions

### Button
- **Job:** trigger an action on the current page.
- **Anatomy:** container, label, leading icon?, badge?
- **Required states:** interaction: default, hover, focus-visible, active, disabled, loading. Lifecycle: done (confirm elsewhere).
- **APG:** Button, native `<button>`.
- **WCAG:** 4.1.2 (A), 2.5.8 (AA), 2.4.7 (AA), 1.4.3 (AA).
- **Defects:** a `div` with `onClick`; disabled with no reason; two primaries in one region.
- **Seeds:** `button.native-element`, `button.focus-ring`, `button.target-size`, `button.state.disabled`, `button.state.loading`.

### Icon button
- **Job:** a compact action shown as an icon only.
- **Anatomy:** container, icon, tooltip?
- **Required states:** interaction: default, hover, focus-visible, active, disabled, selected (toggle).
- **APG:** Button; toggle uses `aria-pressed`.
- **WCAG:** 4.1.2 (A), 2.5.8 (AA), 1.4.11 (AA).
- **Defects:** no accessible name; target under 24 px; meaning only in a hover title.
- **Seeds:** `icon-button.accessible-name`, `icon-button.target-size`, `icon-button.icon-contrast`.

### Link
- **Job:** navigate to another location.
- **Anatomy:** text, external icon?
- **Required states:** interaction: default, hover, focus-visible, active, visited.
- **APG:** Link, native `<a href>`.
- **WCAG:** 1.4.1 (A), 2.4.7 (AA), 2.5.3 (A).
- **Defects:** colour is the only cue; "click here" text; a link used as a button.
- **Seeds:** `link.not-colour-alone`, `link.descriptive-text`, `link.native-element`.

## Inputs

### Text field
- **Job:** capture one line of typed text.
- **Anatomy:** label, hint?, container, input, prefix or suffix?, message.
- **Required states:** lifecycle: nothing, incorrect, correct. Interaction: default, hover, focus-visible, disabled, error.
- **APG:** none, native `<input>` and `<label>`.
- **WCAG:** 3.3.2 (A), 3.3.1 (A), 1.3.5 (AA), 1.4.11 (AA).
- **Defects:** placeholder used as label; error shown by red border only; input under 16 px on phones.
- **Seeds:** `field.visible-label`, `field.error-bound`, `field.autocomplete`, `field.state.error`.

### Textarea
- **Job:** capture multi-line text.
- **Anatomy:** label, hint?, container, input, counter?
- **Required states:** as text field; add a counter at the limit.
- **APG:** none, native `<textarea>`.
- **WCAG:** 3.3.2 (A), 3.3.1 (A), 1.4.4 (AA).
- **Defects:** fixed height cuts text at 200% zoom; counter not announced; resize handle removed.
- **Seeds:** `textarea.visible-label`, `textarea.counter-announced`, `textarea.resizable`.

### Select
- **Job:** pick one option from a short fixed list.
- **Anatomy:** label, hint?, control, options, message.
- **Required states:** lifecycle: nothing, one, incorrect. Interaction: default, focus-visible, disabled, error.
- **APG:** Listbox; native `<select>` first.
- **WCAG:** 3.3.2 (A), 4.1.2 (A), 2.1.1 (A).
- **Defects:** custom select with no keyboard; no empty choice explained; long list with no search.
- **Seeds:** `select.native-first`, `select.visible-label`, `select.keyboard`.

### Combobox
- **Job:** pick from a long or searchable list, or type free text with suggestions.
- **Anatomy:** label, input, toggle?, popup list, option, status message.
- **Required states:** lifecycle: nothing, loading, none, some, too-many, incorrect. Interaction: default, focus-visible, disabled, selected.
- **APG:** Combobox.
- **WCAG:** 4.1.2 (A), 2.1.1 (A), 4.1.3 (AA).
- **Defects:** focus moves into the list; result count not announced; no "no results" message.
- **Seeds:** `combobox.focus-stays-in-input`, `combobox.count-announced`, `combobox.state.none`.

### Checkbox
- **Job:** toggle one independent option, or select rows.
- **Anatomy:** box, check mark, label, hint?
- **Required states:** interaction: default, hover, focus-visible, disabled, selected, mixed.
- **APG:** Checkbox, native `<input type="checkbox">`.
- **WCAG:** 4.1.2 (A), 1.4.11 (AA), 2.5.8 (AA).
- **Defects:** target is the box only, not the label; mixed state not exposed; box border under 3:1.
- **Seeds:** `checkbox.label-clickable`, `checkbox.mixed-exposed`, `checkbox.box-contrast`.

### Radio group
- **Job:** pick exactly one option from a small set, all visible.
- **Anatomy:** legend, radio, label, hint?, message.
- **Required states:** interaction: default, focus-visible, disabled, selected; lifecycle: incorrect.
- **APG:** Radio Group, native `<input type="radio">` in a `<fieldset>`.
- **WCAG:** 1.3.1 (A), 2.1.1 (A), 3.3.1 (A).
- **Defects:** no `fieldset` and `legend`; each radio is a Tab stop; nothing preselected without reason.
- **Seeds:** `radio.fieldset-legend`, `radio.arrow-keys`, `radio.error-bound`.

### Switch
- **Job:** turn a setting on or off with immediate effect.
- **Anatomy:** track, thumb, label, state text?
- **Required states:** interaction: default, hover, focus-visible, disabled, selected (on).
- **APG:** Switch.
- **WCAG:** 4.1.2 (A), 1.4.1 (A), 1.4.11 (AA).
- **Defects:** used for a form field that needs Save; on and off differ by colour only; label changes with state.
- **Seeds:** `switch.role`, `switch.immediate-effect`, `switch.not-colour-alone`.

## Navigation and disclosure

### Tabs
- **Job:** switch between peer views of one context.
- **Anatomy:** tab list, tab, panel, indicator.
- **Required states:** interaction: default, hover, focus-visible, disabled, selected.
- **APG:** Tabs.
- **WCAG:** 2.1.1 (A), 4.1.2 (A), 2.4.3 (A).
- **Defects:** Tab key moves between tabs; disabled tab has no reason; panel not linked by `aria-controls`.
- **Seeds:** `tabs.arrow-keys`, `tabs.panel-linked`, `tabs.state.disabled`.

### Breadcrumb
- **Job:** show the current location in a hierarchy.
- **Anatomy:** nav, list, link, separator, current item.
- **Required states:** interaction: default, hover, focus-visible; current.
- **APG:** Breadcrumb.
- **WCAG:** 2.4.8 (AAA) Location, 1.3.1 (A), 2.4.7 (AA).
- **Defects:** no `aria-current="page"`; separators read aloud; collapses with no way to expand.
- **Seeds:** `breadcrumb.nav-label`, `breadcrumb.current-marked`, `breadcrumb.separator-hidden`.

### Pagination
- **Job:** move through a long list in pages.
- **Anatomy:** nav, previous, page links, next, current page, range text.
- **Required states:** interaction: default, focus-visible, disabled (first, last), selected (current); lifecycle: none, some, too-many.
- **APG:** none; use `<nav>` with a list.
- **WCAG:** 4.1.2 (A), 2.5.8 (AA), 4.1.3 (AA).
- **Defects:** no total shown; current page by colour only; page change not announced.
- **Seeds:** `pagination.total-shown`, `pagination.current-marked`, `pagination.change-announced`.

### Disclosure and accordion
- **Job:** show or hide a block of content on demand.
- **Anatomy:** header button, icon, panel.
- **Required states:** interaction: default, hover, focus-visible, disabled, selected (open).
- **APG:** Disclosure and Accordion; native `<details>`.
- **WCAG:** 4.1.2 (A), 2.1.1 (A), 1.3.1 (A).
- **Defects:** header is a `div`; no `aria-expanded`; hides content users need to compare.
- **Seeds:** `disclosure.native-first`, `disclosure.expanded-exposed`, `accordion.header-is-button`.

## Overlays

### Dialog
- **Job:** ask for a decision or input that blocks the page.
- **Anatomy:** scrim, container, title, close, body, actions.
- **Required states:** lifecycle: nothing, loading, incorrect, done. Interaction: focus-visible, disabled (action).
- **APG:** Dialog (Modal); native `<dialog>`.
- **WCAG:** 2.4.3 (A), 2.1.2 (A), 4.1.2 (A), 2.4.11 (AA).
- **Defects:** focus not moved in or restored; no Esc; background still reachable.
- **Seeds:** `dialog.focus-in-and-restore`, `dialog.esc-closes`, `dialog.labelled`, `dialog.full-screen-narrow`.

### Tooltip
- **Job:** add a short hint to a control that already has a name.
- **Anatomy:** trigger, bubble, arrow?
- **Required states:** interaction: hidden, visible; dismissed.
- **APG:** Tooltip.
- **WCAG:** 1.4.13 (AA), 4.1.2 (A).
- **Defects:** opens on hover only; holds essential text; cannot be dismissed by Esc.
- **Seeds:** `tooltip.opens-on-focus`, `tooltip.dismissible`, `tooltip.no-essential-content`.

### Popover
- **Job:** show rich, interactive content next to its trigger.
- **Anatomy:** trigger, container, content, close?
- **Required states:** lifecycle: nothing, loading, incorrect. Interaction: focus-visible.
- **APG:** Disclosure or Dialog (non-modal), depending on content.
- **WCAG:** 1.4.13 (AA), 2.1.2 (A), 2.4.3 (A).
- **Defects:** clipped by the viewport on phones; Esc does nothing; focus not returned.
- **Seeds:** `popover.esc-closes`, `popover.fits-viewport`, `popover.focus-return`.

### Menu
- **Job:** offer a list of actions from a button.
- **Anatomy:** menu button, menu, item, separator, submenu?
- **Required states:** interaction: default, hover, focus-visible, disabled, selected.
- **APG:** Menu Button and Menu.
- **WCAG:** 2.1.1 (A), 4.1.2 (A), 2.4.3 (A).
- **Defects:** used for site navigation; arrows do nothing; focus not returned to the button.
- **Seeds:** `menu.actions-only`, `menu.arrow-keys`, `menu.focus-return`.

## Feedback

### Toast
- **Job:** confirm a low-stakes result without blocking.
- **Anatomy:** container, icon, message, action?, close.
- **Required states:** lifecycle: done, incorrect. Interaction: focus-visible.
- **APG:** Alert (`role="status"` for polite).
- **WCAG:** 4.1.3 (AA), 2.2.1 (A), 1.4.13 (AA).
- **Defects:** vanishes before it is read; holds the only copy of an error; steals focus.
- **Seeds:** `toast.announced`, `toast.no-timer-with-action`, `toast.not-sole-error`.

### Banner
- **Job:** show a persistent message about the page or system.
- **Anatomy:** container, icon, title?, message, action?, dismiss?
- **Required states:** lifecycle: incorrect, correct, done; tones: info, warning, error, success.
- **APG:** Alert for urgent; region with `role="status"` otherwise.
- **WCAG:** 1.4.1 (A), 4.1.3 (AA), 1.4.3 (AA).
- **Defects:** tone by colour only; alert role on static content; blocks content on phones.
- **Seeds:** `banner.tone-not-colour-alone`, `banner.role-matches-urgency`, `banner.dismiss-labelled`.

### Skeleton
- **Job:** hold the layout while content of 1 to 2 s loads.
- **Anatomy:** shape blocks that mirror the real layout.
- **Required states:** lifecycle: loading.
- **APG:** none; container has `aria-busy="true"`.
- **WCAG:** 2.2.2 (A), 2.3.3 (AAA), 4.1.3 (AA).
- **Defects:** shape differs from real content; shimmer ignores reduced motion; no busy state exposed.
- **Seeds:** `skeleton.mirrors-layout`, `skeleton.reduced-motion`, `skeleton.aria-busy`.

### Spinner
- **Job:** show short indeterminate work inside a component.
- **Anatomy:** ring, label (hidden text).
- **Required states:** lifecycle: loading.
- **APG:** none; `role="status"` with text.
- **WCAG:** 4.1.3 (AA), 2.2.2 (A), 2.3.3 (AAA).
- **Defects:** full-page spinner that blanks a working screen; no text; shown for under 1 s.
- **Seeds:** `spinner.has-text`, `spinner.scoped`, `spinner.min-delay`.

### Progress
- **Job:** show determinate progress of work of 2 s or more.
- **Anatomy:** track, fill, label, value text?
- **Required states:** lifecycle: loading, partial, done, incorrect.
- **APG:** Meter for a measure; `role="progressbar"` for work.
- **WCAG:** 1.4.11 (AA), 4.1.2 (A), 4.1.3 (AA).
- **Defects:** parked at 99%; value not exposed; bar contrast under 3:1.
- **Seeds:** `progress.value-exposed`, `progress.contrast`, `progress.completion-announced`.

## Display

### Card
- **Job:** group related content about one entity.
- **Anatomy:** container, media?, header, body, actions?
- **Required states:** lifecycle: loading, incorrect, none; interaction: hover, focus-visible, selected (if selectable).
- **APG:** none; one stretched link when clickable.
- **WCAG:** 1.3.1 (A), 2.4.7 (AA), 2.5.8 (AA).
- **Defects:** several nested links and buttons; whole card clickable with no name; heading level skipped.
- **Seeds:** `card.single-primary-action`, `card.heading-level`, `card.focus-ring`.

### Badge, chip and tag
- **Job:** badge marks a count or status; chip filters or inputs; tag labels a category.
- **Anatomy:** container, label, icon?, remove button? (chip).
- **Required states:** interaction: default, hover, focus-visible, disabled, selected (chip).
- **APG:** none for badge and tag; Button or Listbox for chip.
- **WCAG:** 1.4.1 (A), 1.4.3 (AA), 2.5.8 (AA).
- **Defects:** status by colour only; removable chip has no dismiss button; count not in accessible name.
- **Seeds:** `badge.not-colour-alone`, `chip.removable-labelled`, `tag.contrast`.

### Table
- **Job:** compare rows of data along shared columns.
- **Anatomy:** caption, header row, header cell, body row, cell, sort control?, actions cell?
- **Required states:** lifecycle: nothing, loading, none, some, too-many, partial, incorrect. Interaction: hover, focus-visible, selected.
- **APG:** Table (Grid only for editable cells).
- **WCAG:** 1.3.1 (A), 4.1.3 (AA), 1.4.10 (AA), 2.4.11 (AA).
- **Defects:** `div` grid instead of `<table>`; no `scope` or `aria-sort`; horizontal scroll on phones.
- **Seeds:** `table.native-markup`, `table.sort-announced`, `table.card-stack-narrow`.

### Empty state
- **Job:** say what is true when there is nothing to show, and what to do next.
- **Anatomy:** icon or art?, title, description, primary action?
- **Required states:** lifecycle: nothing, none, incorrect (as its error variant).
- **APG:** none.
- **WCAG:** 3.3.3 (AA), 1.3.1 (A), 4.1.3 (AA).
- **Defects:** blank area; says "No data" with no next step; filtered-empty offers no way to clear.
- **Seeds:** `empty.says-next-step`, `empty.filtered-offers-clear`, `empty.heading-level`.

## Why

Reviews of design systems find the same defects again and again: missing names, missing states, colour-only cues, focus mistakes. A short entry per component turns those into a checklist a person or an agent can run.

## Rulebook seeds

Each entry ends with its own **Seeds** line. Those ids are the candidate rules. Add them to the rulebook in the format of `governance/rulebook.md`.

## Misfiles

- A filter bar, a wizard or a form section is a pattern. See `patterns/`.
- A colour, radius or spacing value is a token. See `tokens/`.

## See also

- `components/anatomy-and-states.md`, `components/api-design.md`
- `states/model.md`, `states/state-matrix.md`
- `accessibility/apg-patterns.md`, `accessibility/wcag-map.md`, `governance/rulebook.md`
