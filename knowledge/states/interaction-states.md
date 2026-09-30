---
id: states/interaction-states
title: Interaction states
shelf: states
layer: cross-cutting
owner: ui-designer
tags: [states, hover, focus, active, disabled, selected, loading, aria]
sources:
  - Figma, "Button states" resource library — https://www.figma.com/resource-library/button-states/
  - WCAG 2.2 — https://www.w3.org/TR/WCAG22/
  - WAI-ARIA 1.2 — https://www.w3.org/TR/wai-aria-1.2/
  - ARIA Authoring Practices Guide — https://www.w3.org/WAI/ARIA/apg/
  - Material Design 3, "States" — https://m3.material.io/foundations/interaction/states
---

# Interaction states

> A light switch tells you three things without a word: it is there, it is on or off, and it moved when you pressed it. An interaction state is how a control does the same on screen: "you can use me", "you are pointing at me", "I felt that", "not now, and here is why".

An interaction state is a **condition** of a component at this instant. It is never a variant (a variant is a design choice, such as primary or secondary). Every state is styled with semantic **state tokens**, never with literals. See `model.md` for the lifecycle axis.

## Rules

1. Style every state with semantic state tokens. Never write a literal colour in a state rule. (`../tokens/naming.md` § State tokens; `misfile.state-colour-literal`)
2. Draw `:focus-visible` on every focusable control, from `focus.ring.*`. Never write `outline: none` without a replacement. (WCAG 2.4.7 Focus Visible, AA)
3. Guard hover with `@media (hover: hover)`. Never put information or a control only behind hover. (WCAG 2.1.1 Keyboard, A)
4. Say why a control is disabled, and what unlocks it. (Nielsen 1, Visibility of system status; Lapomeray 2024)
5. Keep the control's size while it loads, and block a second submit. (Nielsen 1; Nielsen 5, Error prevention)
6. Show every state by more than colour. (WCAG 1.4.1 Use of Color, A)
7. Decide the precedence of stacked states once, and apply it everywhere. (Nielsen 4, Consistency and standards; § Combinations and precedence)

## The core five

Figma's resource names five essential states. Each row gives the trigger, the selector, the visual job, and the basis.

| State | Trigger | Selector / attribute | Visual job | Basis |
|---|---|---|---|---|
| **Default** (enabled) | None | base class | Looks operable with no hover needed. | Nielsen 6, Recognition rather than recall. Figma: "clearly indicate it's clickable without any additional context". |
| **Hover** | Pointer over | `:hover`, inside `@media (hover: hover)` | A subtle shift that confirms the target. | Figma: "keep changes subtle". Touch devices have no hover (see § Touch). |
| **Focus-visible** | Keyboard focus | `:focus-visible` | A ring that is always visible, never clipped or covered. | WCAG 2.4.7 Focus Visible (AA); 2.4.11 Focus Not Obscured (Minimum) (AA); 2.4.13 Focus Appearance (AAA) sets size and contrast. |
| **Active** (pressed) | Pointer or key down | `:active` | Immediate acknowledgement of the press. | Miller 1968: under 0.1 s reads as instantaneous. |
| **Disabled** | Not available now | `:disabled`, or `aria-disabled="true"` to stay focusable | Recognisably unavailable, and explained. | Nielsen 1, Visibility of system status; Lapomeray 2024: users must understand "why an action is disabled". WCAG 1.4.3 exempts inactive components from contrast, which is a floor, not a goal. |

## Functional states

States a control enters because of the work it triggers.

| State | Job | Rules | Basis |
|---|---|---|---|
| **Loading** | The action is running. | Keep the label or its width (no layout shift). Block duplicate submission. Set `aria-busy` on the region, not only a spinner. | Nielsen 1; Nielsen 5, Error prevention (double submit); WCAG 4.1.3 (AA). |
| **Success** | The action landed. | Brief, in text ("Saved"), announced. Return to default when the next action is possible. | WCAG 4.1.3 (AA); WCAG 1.4.1 (A): not colour alone. |
| **Error** | The action failed. | Return the control to operable. Put the explanation inline, in text, next to the control. | Figma: "Reset button to clickable state and provide clear inline message". WCAG 3.3.1 (A). |
| **Selected** / toggled | On until turned off. | `aria-pressed` for toggle buttons, `aria-selected` in tabs, listboxes and grids, `aria-checked` for checkboxes and switches. Differs from focus and from hover. | WAI-ARIA 1.2; APG Button, Tabs, Listbox. |

## Structural states

| State | Attribute | Applies to | Note |
|---|---|---|---|
| **Read-only** | `readonly`, `aria-readonly` | Fields, grids | Focusable and copyable. Not disabled: the value is real and submitted. |
| **Invalid** | `aria-invalid="true"` | Fields | The interaction face of the *incorrect* lifecycle state. |
| **Indeterminate** | `indeterminate` property, `aria-checked="mixed"` | Checkbox, tree | "Some children selected." A third visual, not a disabled look. |
| **Expanded** | `aria-expanded` | Disclosure, accordion, combobox, menu button | The icon rotates or swaps; the state is also in the accessible name or role. |
| **Current** | `aria-current="page|step|date|true"` | Navigation, breadcrumbs, steppers, calendars | Distinct from selected. |
| **Visited** | `:visited` | Links | Only colour may change (browser privacy limits). Useful in long result lists. |
| **Dragging / drop target** | App state | Sortable lists, uploads | Needs a single-pointer alternative: WCAG 2.5.7 Dragging Movements (AA). |
| **Required** | `required`, `aria-required` | Fields | Shown in text or a symbol explained once, not only with colour. WCAG 3.3.2 (A). |

## Combinations and precedence

States stack. Decide the precedence once, in the foundation, and apply it everywhere (Nielsen 4, Consistency and standards).

Recommended order, strongest first:

1. **Disabled** suppresses hover and active. It does not suppress focus if the control uses `aria-disabled` and stays focusable.
2. **Focus-visible** is always drawn, on top of every other state, including selected and error. WCAG 2.4.7 (AA).
3. **Error / invalid** keeps its border and message while hovered or focused.
4. **Selected** stays visible while hovered: hover modifies it, it does not replace it.
5. **Hover** and **active** are the lightest layers.

Material 3 models hover, focus, pressed and dragged as a **state layer**: a translucent overlay of the content colour at a fixed opacity, on top of the container. It keeps contrast predictable across every colour role, because the state is a delta, not a new colour. Bauhaus recommends this model for themed systems (`../tokens/theming.md`).

## Tokens

State visuals come from semantic tokens in two families (grammar: `../tokens/naming.md` § State tokens). Suggested set (prefix `--ds-`):

```
color.state.hover-layer         opacity or colour delta for hover
color.state.pressed-layer
color.state.selected            container colour for selected
color.state.disabled.text       disabled text colour
color.state.disabled.surface
color.state.disabled.border
color.action.<role>.<state>     per-role colour, e.g. color.action.primary.hover
focus.ring.color  focus.ring.width  focus.ring.offset
color.status.error.*  color.status.success.*
motion.duration.fast            hover / focus colour changes
motion.duration.instant         press acknowledgement
```

The values belong to the colour, elevation and motion foundations. The component only names which token each state uses.

## Motion between states

Owned by `motion-designer` (`../foundations/motion.md`):

- Colour and opacity changes for hover run at the fast duration. Figma recommends 100–200 ms; the convergent scale in `../foundations/motion.md` puts hover at 150 ms.
- The press acknowledgement runs at the instant duration.
- The **focus ring does not transition**. A lagging indicator is a wrong indicator.
- Do not change a control's size on hover in a way that moves its centre (Fitts 1954: a moving target is harder to acquire).
- Figma suggests a slight scale-down (0.98) on press. Under `prefers-reduced-motion: reduce`, drop the scale and keep the colour change. WCAG 2.3.3 (AAA).

## Touch

- There is no hover on touch. Any information or control that appears only on hover is unreachable. Guard hover styles with `@media (hover: hover)`; use `@media (pointer: coarse)` for the touch branch.
- Active and loading states carry the feedback on touch (Figma).
- Target size: WCAG 2.5.8 Target Size (Minimum) is 24 × 24 CSS px at **AA**. 2.5.5 Target Size (Enhanced) is 44 × 44 at **AAA**. A house standard of 44 is AAA, and must be stated as such.

## Pitfalls and don'ts

| Don't | Why it fails | Basis |
|---|---|---|
| `outline: none` without a replacement | Keyboard users lose their place. | WCAG 2.4.7 (AA) |
| Style `:focus` instead of `:focus-visible` | The ring appears on mouse click and teams then remove it. | Selectors Level 4 intent of `:focus-visible` |
| A disabled button with no explanation | The user cannot learn what unlocks it. | Nielsen 1; Lapomeray 2024 |
| Disabled as the only form validation | The user must guess which field blocks submit. Prefer an enabled submit plus an error summary. | WCAG 3.3.1 (A) |
| Selected shown by colour only | Colour-blind users cannot see it. | WCAG 1.4.1 (A) |
| Hover-only row actions | Unreachable on touch and invisible to keyboard users. | WCAG 2.1.1 Keyboard (A) |
| A new literal colour per state | Themes break and contrast drifts. | `misfile.state-colour-literal` |
| `variant="disabled"` | A condition filed as a choice. | `misfile.state-as-variant` |
| Dramatic hover colour swaps | They draw attention away from the task. | Figma: "avoid dramatic color swaps that distract" |
| Loading spinner that replaces the label and shrinks the button | Layout shift, and the user loses what they pressed. | Nielsen 1; CLS |

## Why

- A control that gives no sign of its condition breaks Nielsen 1, Visibility of system status. Each state answers one question: can I act, did it hear me, is it busy.
- Figma's resource names five essential states. Missing hover, focus or disabled is the usual failure.
- Keyboard users depend on the focus ring: WCAG 2.4.7 (AA) requires it, and 2.4.11 (AA) requires that it is not hidden.
- Material 3 models hover, focus, pressed and dragged as state layers. A layer is a delta on any colour, so contrast stays predictable in every theme.
- Under 0.1 s a response reads as instant (Miller 1968). The press state must answer inside that limit.

## Rulebook seeds

- `<c>.state.focus-visible` · auto · HIGH · "`:focus-visible` declares the house ring from `focus.ring.*`; no `outline: none` without it." (2.4.7 AA)
- `<c>.states.hover-guarded` · auto · LOW · "Hover styles sit inside `@media (hover: hover)`."
- `<c>.states.tokens` · auto · MEDIUM · "Every state declaration uses a `color.state.*`, `color.action.*` or status token, no literal."
- `<c>.states.disabled-explains` · review · MEDIUM · "A disabled control says why and what unlocks it."
- `<c>.states.not-colour-alone` · review · HIGH · "Every state differs by more than colour." (1.4.1 A)
- `<c>.states.loading-no-shift` · review · MEDIUM · "Loading keeps the control's size and blocks re-submission."

## Misfiles

- `Button variant="disabled"`: a condition filed as a choice. It is `misfile.state-as-variant`. Use a `disabled` prop.
- A hover colour written as `#1a3a5c` in a state rule: a semantic state token belongs there (`misfile.state-colour-literal`).
- A "States" page that lists hover colours: that is the colour foundation's token table. Each component's page holds its own state matrix.
- Hover-only row actions: an action, not a state. Give it a visible, keyboard-reachable control.

## See also

- `model.md`, `lifecycle-states.md`, `state-matrix.md`
- `../foundations/color.md`, `../foundations/motion.md`, `../foundations/elevation.md`, `../tokens/theming.md`
- `../accessibility/apg-patterns.md`, `../components/catalog.md`
