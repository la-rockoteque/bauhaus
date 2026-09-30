---
id: foundations/shape
title: Shape
shelf: foundations
layer: foundation
owner: ui-designer
tags: [radius, border, stroke, outline, cards]
sources:
  - WCAG 2.2 1.4.11 Non-text Contrast (AA), 2.4.7 Focus Visible (AA) — https://www.w3.org/TR/WCAG22/
  - Material 3 shape scale, Carbon, Fluent 2 corner radius — see references/systems.md
---

# Shape

> Shape is the outline of things: how round the corners are and how thick the lines are. Corner radius tells people what kind of thing they see. A small radius says "form field". A large radius says "card". Lines mark edges. If an edge is the only clue that a field exists, the line must be dark enough to see.

## Rules

1. Publish a radius scale of 3 to 6 steps plus one full-round value. Example: `sm` 3px, `md` 4px, `lg` 6px, `pill` 999px. Add `none` if you need it. (A short scale keeps shapes consistent.)
2. Map each radius to a kind of element. Small for tags and chips. Medium for inputs and buttons. Large for cards and panels. Pill for progress tracks and status pills. (Radius encodes element type, so users learn it.)
3. Use one radius per nesting level. A child inside a padded parent has a smaller radius than the parent: `inner radius = outer radius - padding`. (Concentric corners look aligned.)
4. Do not use a radius that turns a square control into a circle unless it is an avatar or an icon button. Name the pill value as a token, not `9999px` at call sites. (Material 3 names a `full` corner in its shape scale.)
5. Publish a border-width scale of 2 or 3 steps: `hairline` 1px, `medium` 2px, and optionally `thick` 4px. Use 1px for default edges and dividers. Use 2px for emphasis and focus rings. (Few widths keep edges consistent.)
6. Use `px` for border widths. Text-independent lines do not need to scale with the font size. (House convention: keeps the width scale in rule 5 exact at every text size.)
7. Use a border style of `solid` by default. Keep `dashed` for drop zones and placeholders. Keep `dotted` out of the system unless a use is documented. (House convention: solid reads as an edge, dashed as a target. See the dragged edge in Anatomy.)
8. Keep icon strokes on their own scale. See `iconography.md`. (Cross-reference: that file holds the stroke scale.)
9. A boundary that is the only visual cue for a control must have at least 3:1 contrast against the adjacent colour. This applies to an input's border, a checkbox outline and a radio ring. (WCAG 1.4.11 Non-text Contrast, AA)
10. A boundary is not required to meet 3:1 when another cue identifies the control, such as a filled background at 3:1, a visible label plus a text cue, or an icon. Do not use this exception to make every border faint. (WCAG 1.4.11 Non-text Contrast, AA)
11. Decorative dividers and card edges that carry no information are not covered by 1.4.11. Use a subtle border token for them. Use a strong border token for controls. (WCAG 1.4.11 Non-text Contrast, AA: only parts needed to identify a component or state.)
12. Show the focus indicator as an outline or ring of at least 2px with 3:1 contrast against adjacent colours. Do not remove `outline` without a replacement. Draw it on `:focus-visible`. (WCAG 2.4.7 Focus Visible, AA. The 3:1 contrast is WCAG 1.4.11 Non-text Contrast, AA. The 2px thickness is WCAG 2.4.13 Focus Appearance, AAA. Treat 2px as a house standard at the AAA level.)
13. Do not animate the focus ring in or out. Focus appears at once. (See `motion.md`.)
14. Choose one edge strategy per surface family and state it in the styleguide: bordered or shadowed. Do not mix both on one card. (Material 3 keeps elevated, filled and outlined cards as separate types.)
15. Prefer a border to a shadow for cards in dense, data-heavy interfaces. The border is the edge and the shadow stays free for things that float. (Two elevation rungs stay meaningful when cards do not use them. See `elevation.md`.)
16. Prefer a shadow to a border for cards in sparse, content-led interfaces where surfaces sit on a tinted canvas. Add a border in forced-colors mode because shadows disappear there. (`forced-colors` removes `box-shadow`.)
17. Store shape as three token families: `radius`, `border-width`, `border-style`. Combine them into a DTCG `border` composite only when a component always uses the same trio. (See `tokens/architecture.md`.)

## Example

```css
:root {
  --ds-radius-sm: 3px;
  --ds-radius-md: 4px;
  --ds-radius-lg: 6px;
  --ds-radius-pill: 999px;

  --ds-border-width-hairline: 1px;
  --ds-border-width-medium: 2px;
}

.ds-input {
  border: var(--ds-border-width-hairline) solid var(--ds-border-strong);
  border-radius: var(--ds-radius-md);
}

.ds-card {
  border: var(--ds-border-width-hairline) solid var(--ds-border-default);
  border-radius: var(--ds-radius-lg);
}

.ds-input:focus-visible {
  outline: var(--ds-border-width-medium) solid var(--ds-focus-ring-color);
  outline-offset: 2px;
}
```

## Page contract

A shape page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what shape does: corner radius names the kind of element and lines mark edges. Layer: foundation. (`taxonomy/layers.md`)
- Lead with one row of specimens: tag, input, button, card, pill.

### 2. Tokens
- Radius: `--ds-radius-sm`, `-md`, `-lg`, `-pill`, with values and the element each fits.
- Border width: `--ds-border-width-hairline`, `-medium`.
- Border style values in use. Focus ring width and offset.

### 3. Anatomy
- A radius scale: 3 to 6 steps plus one full-round value, each mapped to an element kind.
- A border: width, style, colour. Colour comes from the `border.*` roles. Width and style come from here.
- A focus ring: outline width, offset, colour. Show it on a light and a dark surface.

### 4. States
- Shape provides tokens for: default edge, hover edge (stronger border token), focus-visible ring, selected edge (2px, `accent`), error edge (`danger` line), disabled edge (`border.disabled`), dragged (dashed drop target).
- The edge must change by more than colour when colour carries the state. Add width or an icon. (WCAG 1.4.1 Use of Color, A)
- The focus ring appears at once. It has no transition. (WCAG 2.4.7 Focus Visible, AA; see `motion.md`)

### 5. Usage
- When to use a border: control boundaries and cards in dense interfaces. (WCAG 1.4.11, AA; edge-strategy rule above)
- When to use a shadow instead: floating surfaces only. (`elevation.md`)
- How: choose the token from the element kind. Nest radii with `inner = outer - padding`. Strong border token for controls, subtle for dividers.
- Accessibility: control boundaries reach 3:1. Focus ring at least 2px with 3:1. Add a border under `forced-colors`. (WCAG 1.4.11, AA; 2.4.7, AA)

### 6. Pitfalls and don'ts
- `outline: none` with no replacement removes the focus indicator. (WCAG 2.4.7 Focus Visible, AA)
- A faint input border fails when it is the only cue. (WCAG 1.4.11 Non-text Contrast, AA)
- Raw `9999px` at call sites hides intent. Use the pill token.
- Card border plus card shadow doubles the edge and spends an elevation rung.
- Shadow-only cards vanish in `forced-colors`. Add a border.

## Why

- WCAG 1.4.11 (AA) covers only the boundaries a person needs to find a control. A faint hairline on an input can fail it. A faint card divider cannot.
- WCAG 2.4.7 (AA) requires a visible focus indicator. Removing the outline without a replacement fails it.
- A radius scale tied to element type gives users a consistent visual vocabulary. Published systems (Material 3, Carbon, Fluent 2) all define a short corner scale.
- A mature production system in this domain uses bordered cards and gives shadow only to floating surfaces. The border is the edge.

## Rulebook seeds

- `shape.radius-token` · auto · MEDIUM · `border-radius` uses a radius token.
- `shape.border-width-token` · auto · LOW · Border widths come from the scale.
- `shape.control-boundary-contrast` · auto · HIGH · Input, checkbox and radio boundaries reach 3:1 against their surface. (1.4.11, AA)
- `shape.focus-outline` · auto · HIGH · Every interactive element has a visible focus style on `:focus-visible`, at least 2px (house standard at 2.4.13, AAA). (2.4.7, AA)
- `shape.edge-strategy` · review · LOW · A card uses a border or a shadow, not both.
- `shape.nested-radius` · review · LOW · A nested child has a smaller radius than its parent.

## Misfiles

- A drop shadow is elevation, not shape. (`elevation.md`)
- Icon stroke width is `iconography.md`.
- The colour of a border is a role (`border.*`). (`color.md`)
- A "card" with its own padding, radius and border is a component. (`taxonomy/layers.md`)

## See also

- [Colour](./color.md)
- [Elevation](./elevation.md)
- [Iconography](./iconography.md)
- [Motion](./motion.md)
- [Token architecture](../tokens/architecture.md)
- [WCAG map](../accessibility/wcag-map.md)
