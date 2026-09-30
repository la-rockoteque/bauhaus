---
id: foundations/elevation
title: Elevation
shelf: foundations
layer: foundation
owner: ui-designer
tags: [elevation, shadow, z-index, dark-mode, focus-not-obscured, scrim]
sources:
  - WCAG 2.2 2.4.11 Focus Not Obscured (Minimum) (AA) — https://www.w3.org/TR/WCAG22/
  - CSS Positioned Layout (stacking contexts) — https://www.w3.org/TR/css-position-3/
  - Material 3, Carbon, Fluent 2 elevation guidance — see references/systems.md
---

# Elevation

> Elevation says how far a surface floats above the page. A menu floats above a card. A dialog floats above the menu. Use very few levels, so each one keeps its meaning. Elevation is an idea (how high). A shadow and a z-index number are two ways to show it. Keep the idea and the numbers apart.

## Rules

1. Define few elevation rungs. Two or three is enough. Level 0 is the flat page and its cards. Example: `1` for menus, dropdowns and tooltips; `2` for modals and drawers. (Each rung keeps a distinct meaning only when there are few.)
2. Name elevation by meaning, not by number of pixels: `--ds-shadow-raised`, `--ds-shadow-overlay`, or `--ds-shadow-1`, `--ds-shadow-2`. Never `--ds-shadow-0-4-8`. (See `tokens/naming.md`.)
3. Do not add a rung "in between". Something that needs to sit between two levels needs spacing or a surface change instead. (Material 3 fixes its elevation set at six levels, 0 to 5.)
4. Do not write a one-off `box-shadow` at a call site. Use an elevation token. (One-offs break the rung meaning.)
5. Build each shadow from two layers: a tight, darker layer for the contact edge and a wide, lighter layer for the ambient spread. Tint the shadow colour toward the surface hue and do not use pure black. (Two layers read as more natural than one.)
6. Define one scrim (the wash behind a modal). Keep it to a single value. A second scrim would give a second answer to "how far back does the page go". (Material 3 defines a single scrim colour role.)
7. Keep semantic elevation and stacking order separate. Elevation is the visual depth. `z-index` is the paint order. A surface has both, and they are set by different tokens. (House convention: elevation is meaning, z-index is implementation. See `misfile.magic-z-index` in `taxonomy/misfiles.md`.)
8. Publish z-index values as tokens of DTCG type `number`. Name them by role: `--ds-z-sidebar`, `--ds-z-header`, `--ds-z-panel`, `--ds-z-popover`, `--ds-z-modal`, `--ds-z-toast`, `--ds-z-overlay`. (One written stacking order removes magic numbers.)
9. Keep all stacking values in one file. Order the roles from lowest to highest. Each tier out-ranks the one before it. Leave gaps between tiers for future roles. (House convention: one file keeps the order auditable. Gaps let a new role slot in without renumbering.)
10. Never write a bare `z-index` number at a call site. Use a token. Flag any bare value of 100 or more. (Scattered numbers start an arms race.)
11. Use `isolation: isolate` on a component that needs its own stacking context. Do not raise the global number to fix a local overlap. (CSS Positioned Layout: `isolation: isolate` creates a stacking context without a `z-index`.)
12. In a dark theme, show elevation with lighter surfaces. A higher surface has a lighter fill than the one below it. Keep a subtle shadow only as a secondary cue, and re-derive it. (Shadows are hard to see on dark surfaces.)
13. Re-derive shadows for a dark theme. Do not reuse the light values. Increase opacity, or drop the shadow and rely on surface lightness and a border. (See `tokens/theming.md`.)
14. In `forced-colors` mode, shadows are not drawn. Add a border to floating surfaces for that mode. (The user agent removes `box-shadow` in forced-colors mode.)
15. Sticky and fixed elements must not hide the element that has keyboard focus. When a focused element scrolls under a sticky header, footer or cookie banner, it must not be fully hidden. Use `scroll-padding-top` and `scroll-padding-bottom` equal to the sticky heights. (WCAG 2.4.11 Focus Not Obscured (Minimum), AA)
16. Do not open non-modal overlays, such as toasts and chat widgets, over the focused element without a way to move them. (WCAG 2.4.11 Focus Not Obscured (Minimum), AA)
17. Trap focus inside a modal and make the rest of the page inert. Give the modal its own z-index rung. (See `accessibility/apg-patterns.md`.)

## Example

```css
:root {
  /* Semantic elevation: how high. */
  --ds-shadow-1: 0 1px 2px rgb(20 35 60 / 0.06), 0 2px 6px rgb(20 35 60 / 0.05);
  --ds-shadow-2: 0 8px 24px rgb(20 35 60 / 0.12), 0 2px 6px rgb(20 35 60 / 0.06);
  --ds-scrim: rgb(20 35 60 / 0.32);

  /* Implementation: paint order. One written stacking order. */
  --ds-z-sidebar: 9;
  --ds-z-header: 10;
  --ds-z-panel: 15;
  --ds-z-popover: 20;
  --ds-z-modal: 1000;
  --ds-z-toast: 1100;
  --ds-z-overlay: 1300;
}

html { scroll-padding-top: var(--ds-header-height); }

.ds-menu  { box-shadow: var(--ds-shadow-1); z-index: var(--ds-z-popover); }
.ds-modal { box-shadow: var(--ds-shadow-2); z-index: var(--ds-z-modal); }
```

## Page contract

An elevation page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what elevation does: it shows how far a surface floats above the page. Layer: foundation. (`taxonomy/layers.md`)
- Lead with the two-rung specimen: a menu and a modal over a card.

### 2. Anatomy
- A rung: a shadow (two layers), a surface fill, and a z-index role. Show all three as separate tokens.
- The scrim: one value, sits between the page and a modal.
- The stacking order as a stack diagram with role names.

### 3. Tokens
- Shadows: `--ds-shadow-1`, `--ds-shadow-2`. Scrim: `--ds-scrim`.
- Stacking order: `--ds-z-*`, one row per role, lowest to highest, in one table.
- Dark-theme values for each shadow and surface.

### 4. States
- Elevation provides tokens for: resting (level 0 or 1), hover lift (one rung up, for interactive cards), dragged (raised to the overlay rung, Material 3 dragged state), open (menu, modal), and pressed (drops back to resting).
- Dark theme: each rung is shown through surface lightness. (Material 3 elevation guidance)
- Forced colors: each floating surface shows a border. (`forced-colors` removes `box-shadow`)
- Motion between these states: see `motion.md`.

### 5. Usage
- When to use a rung: only for surfaces that float over the page (menu, popover, modal, drawer, toast).
- When not to: cards and panels that sit in the flow. Use a border. (`shape.md`)
- How: the elevation token for the look, the z-index token for the paint order, `isolation: isolate` for local contexts.
- Accessibility: sticky and fixed elements never cover the focused element. Use `scroll-padding`. (WCAG 2.4.11 Focus Not Obscured (Minimum), AA)

### 6. Pitfalls and don'ts
- A one-off `box-shadow` or a bare `z-index: 9999` starts an arms race.
- A third rung "in between" dilutes the meaning of the two.
- Reusing light shadows in a dark theme leaves no visible elevation.
- A sticky header with no `scroll-padding` hides the focused row. (WCAG 2.4.11, AA)
- Two scrims give two answers to "how far back is the page".

## Why

- Few rungs keep each level readable. A third rung "in between" dilutes the two that already have a job.
- Separating the idea from the number lets a team change one without the other. A theme can swap shadow for surface lightness. The z-index order stays.
- WCAG 2.4.11 (AA) exists because sticky chrome hides focus for keyboard users. `scroll-padding` is the standard fix.
- Published systems (Material 3, Carbon, Fluent 2) all express dark-mode elevation through lighter surfaces, not stronger shadows.
- A mature production system in this domain uses two shadow rungs and one scrim. It keeps eight z-index tiers in one file and spells no bare number of 100 or more elsewhere.

## Rulebook seeds

- `elevation.rungs` · auto · MEDIUM · Only the documented shadow tokens appear in `box-shadow`.
- `elevation.z-token` · auto · MEDIUM · Every `z-index` is a token. No bare number of 100 or more.
- `elevation.z-single-source` · auto · LOW · Z-index tokens are declared in one file.
- `elevation.dark-derived` · review · MEDIUM · Dark elevation uses surface lightness and re-derived shadows.
- `elevation.forced-colors-border` · auto · MEDIUM · Floating surfaces have a border under `forced-colors`.
- `elevation.focus-not-obscured` · review · HIGH · Sticky elements do not fully cover the focused element. (2.4.11, AA)
- `elevation.single-scrim` · auto · LOW · One scrim token exists.

## Misfiles

- The border of a card is shape, not elevation. (`shape.md`)
- A "toast" and its queue are a component and a pattern. Only its z-index rung and shadow come from here.
- Focus ring appearance is `shape.md`. Only obscuring of focus is covered here.
- Animation of a surface entering is `motion.md`.

## See also

- [Shape](./shape.md)
- [Colour](./color.md)
- [Motion](./motion.md)
- [Theming](../tokens/theming.md)
- [Token architecture](../tokens/architecture.md)
- [APG patterns](../accessibility/apg-patterns.md)
