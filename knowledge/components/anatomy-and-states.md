---
id: components/anatomy-and-states
title: Anatomy, variants, props and states
shelf: components
layer: primitive
owner: ux-designer
tags: [anatomy, variants, props, states, primitive]
sources:
  - Nielsen, 10 Usability Heuristics, 1 Visibility of system status — https://www.nngroup.com/articles/ten-usability-heuristics/
  - WCAG 2.2 4.1.2 Name, Role, Value (A), 1.4.1 Use of Color (A)
  - Material 3 component specs (anatomy sections) — https://m3.material.io/components
---

# Anatomy, variants, props and states

> Every primitive has parts (its anatomy), choices the caller makes (variants and props) and conditions the primitive is in (states). Mix them up and the API grows without end. Keep each apart.

## Rules

1. Draw the anatomy of every primitive before you code it. Name each part. (Basis: Material 3 and Carbon publish anatomy per component; shared names let designers and engineers speak of the same part.)
2. A **variant** is a fixed visual or semantic choice the caller makes: `tone`, `size`, `emphasis`. It is an enum. (Basis: `components/api-design.md`.)
3. A **prop** is data or behaviour the caller passes in: `label`, `disabled`, `onPress`. (Basis: same.)
4. A **state** is a condition the primitive is in. The caller supplies some (`disabled`, `invalid`), and the browser supplies others (hover, focus, active). Never expose a state as a variant. (Basis: a variant is chosen once, a state changes at run time.)
5. Every primitive names the states it supports. The full model lives in `states/model.md`. The per-component matrix lives in `states/state-matrix.md`. Do not restate them here.
6. Empty, error and disabled are the states that ship missing. Check them first. (Basis: Nielsen 1 Visibility of system status, Nielsen 9 Help users recognise, diagnose and recover from errors.)
7. A disabled control explains itself: why it is off, and what unlocks it. (Basis: Nielsen 1, Nielsen 9.)
8. Each state differs by more than colour. Add an icon, text or a shape. (Basis: WCAG 1.4.1 Use of Color (A).)
9. Each state exposes its value to assistive technology: `aria-disabled`, `aria-invalid`, `aria-busy`, `aria-selected`, `aria-expanded`. (Basis: WCAG 4.1.2 (A).)

## Anatomy in text

Use one diagram per primitive. Number the parts. Mark optional parts with `?`.

```
Button
+--------------------------------------+
| [1 leading icon?] [2 label] [3 badge?] [4 trailing icon?] |
+--------------------------------------+
  5 container (fill, border, radius)   6 focus ring (outside the container)
```

```
Text field
  1 label            (always visible)
  2 hint?            (help text, bound by aria-describedby)
+--------------------------------------+
| 3 leading icon?  4 input  5 clear?   |   6 container
+--------------------------------------+
  7 error message?   (replaces the hint, bound by aria-describedby)
```

```
Dialog
+--------------------------------------+
| 1 title                     2 close  |
|--------------------------------------|
| 3 body                               |
|--------------------------------------|
|              4 secondary  5 primary  |
+--------------------------------------+
  6 scrim (behind)
```

```
Card
+--------------------------------------+
| 1 media?                             |
| 2 header (title, subtitle?)  3 meta? |
| 4 body                               |
| 5 actions?                           |
+--------------------------------------+
  Whole card clickable: one link inside, stretched over the card.
```

Each anatomy lists: part, job, required or optional, token that styles it. Put the diagram and the part table in the styleguide section of the primitive. The Storybook page repeats the diagram.

## Variants, props and states

| Aspect | Chosen by | Changes at run time? | Example | Where it lives |
|---|---|---|---|---|
| Variant | Caller, at design time | No | `tone="danger"`, `size="sm"`, `emphasis="quiet"` | Enum prop, one class or attribute |
| Prop | Caller | Sometimes | `label`, `href`, `disabled`, `loading` | Typed prop |
| Interaction state | User or browser | Yes | hover, focus-visible, active | CSS pseudo-class, no prop |
| Data state | Caller, from data | Yes | empty, loading, error, partial | Prop or slot, owned by the pattern |

Test: if two values can hold at the same time (a danger button that is also disabled), one is a state.

**Limit the variant space.** A variant axis multiplies with every other axis and every state. Three axes of three values and eight states give 216 combinations to design and test. Cut axes before adding values. (Basis: cost of combinations; Carbon and Polaris keep button variants to a short list.)

## States: short summary

Lifecycle states describe the data: nothing, loading, none, one, some, too-many, incorrect, correct, done. Interaction states describe the control: default, hover, focus-visible, active, disabled, loading, success, error, selected. Full definitions: `states/model.md`. Which primitive needs which: `states/state-matrix.md`. Rule ids follow `<component>.state.<state>`.

Minimum bar for a primitive page: show every state the matrix requires for that primitive, in every theme.

## Why

Anatomy gives the team one vocabulary. The variant, prop and state split keeps the API small. A design that shows only the default state hides the states where users get lost: nothing to show, a failure, a blocked action.

## Rulebook seeds

- `<component>.anatomy-documented` · review · MEDIUM · The styleguide section has an anatomy diagram with named parts.
- `<component>.variants-are-enums` · auto · MEDIUM · Variant props accept a closed set of values.
- `<component>.state.disabled-explains` · review · HIGH · A disabled control states why and what unlocks it. Nielsen 1.
- `<component>.state.not-colour-alone` · review · HIGH · Each state differs by more than colour. WCAG 1.4.1 (A).
- `<component>.state.exposed` · auto · HIGH · State reaches the accessibility tree. WCAG 4.1.2 (A).

## Misfiles

- A "loading variant" is a state. File it under `states/`.
- A "dark variant" is a theme. File it under `tokens/theming.md`.
- A layout with two primitives side by side is a pattern, not a bigger primitive.

## See also

- `states/model.md`
- `states/state-matrix.md`
- `components/api-design.md`
- `components/catalog.md`
- `taxonomy/layers.md`
