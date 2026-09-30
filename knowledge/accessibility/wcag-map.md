---
id: accessibility/wcag-map
title: WCAG 2.2 map for a design system
shelf: accessibility
layer: cross-cutting
owner: ui-designer
tags: [wcag, wcag-2.2, criteria, levels, ownership]
sources:
  - WCAG 2.2 (W3C Recommendation) — https://www.w3.org/TR/WCAG22/
  - Understanding WCAG 2.2 — https://www.w3.org/WAI/WCAG22/Understanding/
  - What's new in WCAG 2.2 — https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
---

# WCAG 2.2 map for a design system

> WCAG is the list of tests that decide if a product works for people with different bodies, tools and situations. Some tests belong to the colours and sizes of the system. Some belong to how a screen behaves. This file says which tests exist, at which level, and which agent checks each one.

## Rules

1. Cite a criterion with its number and its level: `WCAG 1.4.3 (AA)`. (Basis: `UBIQUITOUS-LANGUAGE.md` § Basis.)
2. Treat levels A and AA as the floor. A failure at A or AA is `HIGH`. (Basis: `UBIQUITOUS-LANGUAGE.md` § Severity.)
3. Report a AAA shortfall as `MEDIUM` or `LOW`. Never call it a AA failure. (Basis: WCAG 2.2 conformance levels.)
4. Do not report 4.1.1 Parsing. WCAG 2.2 removed it. Cite 4.1.2 Name, Role, Value (A) for broken markup that affects assistive technology. (Basis: WCAG 2.2, "4.1.1 Parsing is obsolete and removed".)
5. When a project sets a stricter house standard, name both figures. Example: 44 px is the house target, 2.5.5 Enhanced (AAA). 24 px is the floor, 2.5.8 Minimum (AA). (Basis: WCAG 2.2 2.5.5, 2.5.8.)
6. Send each finding to the owner agent in the tables below. If the owner is not the caller, hand off in one line. (Basis: `docs/architecture.md` § Agent format.)
7. A design system cannot pass a criterion alone. A component can make it easy, or hard, to pass. Write what the component guarantees and what the call site must supply. (Basis: WCAG 2.2 conformance applies to full pages.)

## Owner: ui-designer — what you see

These criteria are settled by reading the stylesheet or the tokens.

| No. | Name | Level | What it means for a design system |
|---|---|---|---|
| 1.4.1 | Use of Color | A | Colour is never the only carrier of a state. Pair it with an icon, text or a shape. Links inside text carry an underline or another cue. |
| 1.4.3 | Contrast (Minimum) | AA | Text contrast is at least 4.5:1. Large text (24 px, or 18.66 px bold) needs 3:1. Check every text token against every surface it sits on, in every theme. |
| 1.4.6 | Contrast (Enhanced) | AAA | Text contrast is 7:1, or 4.5:1 for large text. Offer it in a high-contrast theme. |
| 1.4.10 | Reflow | AA | Content works at 320 CSS px wide with no second scroll axis. Shared with `responsive-reviewer`. |
| 1.4.11 | Non-text Contrast | AA | Input borders, icons that carry meaning, focus rings and chart marks reach 3:1 against their neighbours. |
| 1.4.12 | Text Spacing | AA | Layout survives line height 1.5, paragraph spacing 2x, letter spacing 0.12 em and word spacing 0.16 em. Do not fix heights on text containers. |
| 2.4.7 | Focus Visible | AA | Every focusable element shows a focus indicator. The token for the ring exists once and every component uses it. |
| 2.4.11 | Focus Not Obscured (Minimum) | AA | A sticky header, footer or cookie bar never fully covers the focused element. Use `scroll-padding` equal to the sticky height. |
| 2.4.13 | Focus Appearance | AAA | The indicator is at least 2 px thick, has 3:1 change of contrast, and encloses the element. Use it as the default ring spec. |
| 2.5.5 | Target Size (Enhanced) | AAA | Targets are at least 44 x 44 CSS px. |
| 2.5.8 | Target Size (Minimum) | AA | Targets are at least 24 x 24 CSS px, or have 24 px of spacing to the next target. Inline links in a sentence are exempt. |

## Owner: ux-designer — what you do

These criteria need judgement about flow, wording and semantics.

| No. | Name | Level | What it means for a design system |
|---|---|---|---|
| 1.3.1 | Info and Relationships | A | Structure lives in markup: real headings, lists, `<table>` with `<th scope>`, `<label>` bound to its control, `fieldset` and `legend` for groups. A `div` grid that looks like a table fails. |
| 1.4.13 | Content on Hover or Focus | AA | A tooltip or popover that appears on hover or focus is dismissible (Esc), hoverable (the pointer can move onto it) and persistent (it stays until dismissed). |
| 2.1.1 | Keyboard | A | Every function works from the keyboard. Custom widgets follow the APG keyboard contract. |
| 2.1.2 | No Keyboard Trap | A | Focus can always leave a component. A modal dialog traps focus on purpose and Esc releases it. |
| 2.4.3 | Focus Order | A | Tab order follows meaning. Dialogs move focus in on open and restore it on close. |
| 2.5.7 | Dragging Movements | AA | Every drag has a single-pointer alternative: buttons, a menu, a text field. |
| 3.2.3 | Consistent Navigation | AA | Repeated navigation keeps the same relative order across pages. |
| 3.2.4 | Consistent Identification | AA | The same function carries the same name and icon everywhere. |
| 3.2.6 | Consistent Help | A | A help entry point sits in the same relative place on every page that has one. |
| 3.3.1 | Error Identification | A | An error is written in text, names the field and is bound to it (`aria-describedby`, `aria-invalid`). A red border alone fails. |
| 3.3.2 | Labels or Instructions | A | Each input has a visible label. A placeholder is not a label. |
| 3.3.3 | Error Suggestion | AA | When the fix is known, the error message states it. |
| 3.3.7 | Redundant Entry | A | Do not ask for the same data twice in one flow. Pre-fill or offer a "same as" choice. |
| 4.1.2 | Name, Role, Value | A | Every control exposes an accessible name, a role and its state (`aria-expanded`, `aria-checked`, `aria-selected`). Icon-only controls carry an `aria-label`. |
| 4.1.3 | Status Messages | AA | A result count, a saved confirmation or a sort change reaches a live region (`role="status"`, `role="alert"`) without moving focus. |

## Owner: motion-designer — what moves

| No. | Name | Level | What it means for a design system |
|---|---|---|---|
| 2.2.1 | Timing Adjustable | A | A time limit can be turned off, adjusted or extended. A toast with an action does not vanish on a timer alone. |
| 2.2.2 | Pause, Stop, Hide | A | Motion that starts by itself, lasts more than 5 s and sits beside other content has a pause control. Same for auto-updating content. |
| 2.3.1 | Three Flashes or Below Threshold | A | Nothing flashes more than three times in one second. |
| 2.3.3 | Animation from Interactions | AAA | Motion caused by interaction can be turned off. Honour `prefers-reduced-motion: reduce` in every animated component. |

## Owner: responsive-reviewer — what fits

| No. | Name | Level | What it means for a design system |
|---|---|---|---|
| 1.3.4 | Orientation | AA | Content works in portrait and landscape. Do not lock orientation unless it is essential. |
| 1.4.4 | Resize Text | AA | Text scales to 200% with no loss of content or function. Use `rem` or `em` for type and never disable viewport zoom. |
| 1.4.10 | Reflow | AA | See the `ui-designer` table. Probe at 320 px. See `accessibility/testing.md`. |

## Neighbouring criteria — cited often, owned by the call site

| No. | Name | Level | Note |
|---|---|---|---|
| 1.1.1 | Non-text Content | A | Icons and images carry a text alternative, or are marked decorative. |
| 1.3.5 | Identify Input Purpose | AA | Personal fields carry the right `autocomplete` token. |
| 2.4.1 | Bypass Blocks | A | The shell provides a skip link. |
| 2.4.6 | Headings and Labels | AA | Headings and labels describe their topic. |
| 2.5.3 | Label in Name | A | The accessible name contains the visible label text. |
| 3.3.4 | Error Prevention (Legal, Financial, Data) | AA | Destructive or binding submits can be reversed, checked or confirmed. |
| 3.3.8 | Accessible Authentication (Minimum) | AA | Do not block paste in password fields. No cognitive test to log in. |

## Removed and renamed

- 4.1.1 Parsing was removed in WCAG 2.2. Do not cite it.
- 2.4.11 in WCAG 2.2 is Focus Not Obscured (Minimum), level AA. Focus Appearance is 2.4.13, level AAA. It was renumbered from 2.4.11 in the WCAG 2.2 drafts.
- 2.4.12 Focus Not Obscured (Enhanced) is AAA. It needs the focused element to be fully visible.

## Why

WCAG 2.2 adds nine criteria to 2.1: 2.4.11 (AA), 2.4.12 (AAA), 2.4.13 (AAA), 2.5.7 (AA), 2.5.8 (AA), 3.2.6 (A), 3.3.7 (A), 3.3.8 (AA), 3.3.9 (AAA). Of these, the AA set matters most for a design system: sticky chrome, drag alternatives and target size are properties of components. Automated tools find only part of the failures. See `accessibility/testing.md`.

## Rulebook seeds

- `a11y.contrast-text` · auto · HIGH · Every text token pair reaches 4.5:1 (3:1 large) in every theme. WCAG 1.4.3 (AA).
- `a11y.contrast-ui` · auto · HIGH · Borders of controls, meaningful icons and focus rings reach 3:1. WCAG 1.4.11 (AA).
- `a11y.focus-visible` · auto · HIGH · Every interactive component shows the shared focus ring. WCAG 2.4.7 (AA).
- `a11y.focus-not-obscured` · review · HIGH · Sticky chrome sets `scroll-padding`. WCAG 2.4.11 (AA).
- `a11y.target-min` · auto · HIGH · Targets are at least 24 x 24 px. WCAG 2.5.8 (AA).
- `a11y.target-house` · auto · MEDIUM · Targets are at least 44 x 44 px on touch. WCAG 2.5.5 (AAA), house standard.
- `a11y.not-colour-alone` · review · HIGH · State never relies on colour alone. WCAG 1.4.1 (A).
- `a11y.status-announced` · review · HIGH · Counts, saves and sorts reach a live region. WCAG 4.1.3 (AA).
- `a11y.drag-alternative` · review · HIGH · Each drag has a click or key alternative. WCAG 2.5.7 (AA).
- `a11y.reduced-motion` · auto · MEDIUM · Each animation has a `prefers-reduced-motion` branch. WCAG 2.3.3 (AAA).

## Misfiles

- Colour palette decisions belong in `foundations/color.md`. This file holds only the criteria.
- Keyboard contracts of widgets belong in `accessibility/apg-patterns.md`.
- Probe scripts belong in `accessibility/testing.md`.

## See also

- `accessibility/apg-patterns.md`
- `accessibility/testing.md`
- `foundations/color.md`
- `foundations/motion.md`
- `foundations/density.md`
- `patterns/responsive.md`
