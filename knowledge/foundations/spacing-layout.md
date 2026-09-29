---
id: foundations/spacing-layout
title: Spacing and layout
shelf: foundations
layer: foundation
owner: ui-designer
tags: [spacing, grid, breakpoints, containers, reflow, inset, stack]
sources:
  - WCAG 2.2 1.4.10 Reflow (AA) — https://www.w3.org/TR/WCAG22/
  - CSS Grid, Flexbox and Container Queries (CSS Containment Level 3) — https://www.w3.org/TR/css-contain-3/
---

# Spacing and layout

> Space groups things. Things close together belong together. Things far apart do not. A spacing scale gives a small set of gaps, so every screen uses the same rhythm. A layout grid and a few breakpoints decide how the page reshapes on small screens. On a 320 px wide screen, the page must still work with no sideways scroll.

## Rules

1. Base the spacing scale on a 4px unit. Use 8px for larger components and layout. (A fixed base makes alignment checkable.)
2. Publish the scale as tokens with numeric names or t-shirt names. Keep 8 to 12 steps: 4, 8, 12, 16, 20, 24, 32, 48, then optional 64, 96. Skip 6, 10 and 14 on purpose. The gaps force alignment. (Fewer steps mean fewer near-duplicates.)
3. Store spacing in `rem` when it must follow the user's font size, such as padding around text. Use `px` only for hairline offsets. (WCAG 1.4.4 Resize Text, AA: text resize must not break the layout.)
4. Name spacing by scale step, not by use: `--ds-space-3`. Use semantic aliases (`--ds-space-inset-card`) only when several components share a decision. (See `tokens/naming.md`.)
5. Classify each gap as one of three kinds:
   - **Inset:** space between a container's edge and its content (padding).
   - **Stack:** vertical space between siblings.
   - **Inline:** horizontal space between siblings.
6. Give a stack one owner. Set gaps on the parent with `gap`, or with a stack primitive. Do not set margins on the children of a stack. (Child margins collide and leak into other contexts.)
7. Use spacing to show grouping. The gap inside a group is smaller than the gap between groups. (Gestalt proximity.)
8. Never use a raw pixel value for a gap at a call site. Use a scale token. Values inside one component's private layout may be explicit when no other component shares them.
9. Build the layout grid with CSS Grid or Flexbox. Use 12 columns for wide layouts and 4 for narrow ones. Set gutters from the spacing scale.
10. Wrap page content in a container with a maximum width and a side gutter. Reading prose stays at 45 to 75 characters. (See `typography.md`.)
11. Offer few container widths: for example `narrow` (forms, prose), `default` and `full`. (Few widths keep pages aligned.)
12. Set breakpoints from content, not from devices. Add a breakpoint where the layout breaks, not at a phone or tablet width. (Device sizes change. Content behaviour does not.)
13. Keep breakpoints few. Three or four cover most products. Name them by intent or size step: `sm`, `md`, `lg`. Publish them as tokens for JavaScript and documentation. Use the literal value in CSS media queries because custom properties do not work there.
14. Prefer container queries for components that live in different-width slots. Use media queries for page-level layout. (A component should respond to its own space.)
15. Use `min-width` media queries and design mobile first. Base styles work at 320 CSS px.
16. Content must reflow with no two-dimensional scrolling at a viewport 320 CSS px wide. This equals 400% zoom on a 1280 px window. For content that scrolls horizontally, the test size is 256 CSS px high. Data tables, maps, diagrams and toolbars that need two dimensions are exempt. (WCAG 1.4.10 Reflow, AA)
17. Do not fix widths in `px` on containers that hold text. Use `max-width`, `min-width`, `%`, `fr` and `minmax()`.
18. Do not hide content at small widths to pass reflow. Rearrange it. (WCAG 1.4.10 Reflow, AA: no loss of information or function.)
19. Never disable pinch zoom. Do not set `user-scalable=no` or a low `maximum-scale`. (WCAG 1.4.4 Resize Text, AA)

## Example

```css
:root {
  --ds-space-1: 0.25rem; /* 4px */
  --ds-space-2: 0.5rem;  /* 8px */
  --ds-space-3: 0.75rem; /* 12px */
  --ds-space-4: 1rem;    /* 16px */
  --ds-space-6: 1.5rem;  /* 24px */
  --ds-space-8: 3rem;    /* 48px */
}

.ds-stack { display: flex; flex-direction: column; gap: var(--ds-space-4); }

.ds-container {
  width: 100%;
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: var(--ds-space-4);
}

/* Content-driven breakpoint: added where the two columns fit. */
@media (min-width: 48rem) {
  .ds-two-col { display: grid; grid-template-columns: 2fr 1fr; gap: var(--ds-space-6); }
}
```

## Page contract

A spacing and layout page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what spacing does: it groups and separates. Layer: foundation. (`taxonomy/layers.md`)
- Lead with one before-and-after: the same screen with and without the scale.

### 2. Tokens
- Spacing: `--ds-space-1` to `--ds-space-8`, with the value in `rem` and in `px`.
- Breakpoints: `sm`, `md`, `lg` with the literal values, published for documentation and JavaScript.
- Container widths and gutters.

### 3. Anatomy
- The scale: a 4px unit, 8 to 12 steps, skipped steps by design.
- Three gap kinds: inset, stack, inline. Show each with a diagram.
- The layout grid: columns, gutters, margins, container.

### 4. States
- Spacing has no interaction states. It provides tokens for the states of layout: breakpoint ranges (`sm`, `md`, `lg`), container widths, and the reflow state at 320 CSS px and 400% zoom. (WCAG 1.4.10 Reflow, AA)
- Density modes change inset and row tokens. (`density.md`)
- Show the same layout in each breakpoint range.

### 5. Usage
- When to use a token: every gap in a shared primitive or pattern. Private one-off layout inside one component may use an explicit value. (Tier rule, `tokens/architecture.md`)
- When not to use one: sub-pixel optical corrections. Use a local value and comment it.
- How: gap on the parent, mobile first, container queries for components, media queries for the page. (Proximity grouping; WCAG 1.4.10, AA)
- Accessibility: no horizontal page scroll at 320 CSS px. Never block zoom. (WCAG 1.4.10, AA; 1.4.4, AA)

### 6. Pitfalls and don'ts
- Device-named breakpoints go stale. Set them from content.
- Child margins in a stack collide and leak into other contexts. Use `gap`.
- A fixed `px` width on a text container fails reflow. (WCAG 1.4.10 Reflow, AA)
- `user-scalable=no` blocks zoom. (WCAG 1.4.4 Resize Text, AA)
- Hiding content at narrow widths to pass reflow loses information. (WCAG 1.4.10 Reflow, AA)
- Near-duplicate steps such as 13px and 14px defeat the scale.

## Why

- A 4px base divides evenly into common line heights and target sizes, and it is the base most published systems use.
- Proximity is the strongest grouping cue. Spacing does the grouping work, so borders and background colours do not have to.
- WCAG 1.4.10 (AA) protects users who zoom to read. Reflow at 320 CSS px is the test for that.
- Content-driven breakpoints last. Device breakpoints age with each new device.

## Rulebook seeds

- `space.token-only` · auto · MEDIUM · Gaps and padding use scale tokens, not raw values, in shared primitives.
- `space.scale-steps` · auto · LOW · Token values sit on the 4px base.
- `space.stack-owner` · review · LOW · Stack gaps come from the parent, not child margins.
- `layout.reflow-320` · auto · HIGH · No horizontal page scroll at 320 CSS px. (1.4.10, AA)
- `layout.no-fixed-text-width` · auto · MEDIUM · Text containers do not use a fixed `width` in `px`.
- `layout.breakpoint-count` · review · LOW · Breakpoints are few and content-driven.
- `layout.zoom-allowed` · auto · HIGH · The viewport meta tag does not block zoom. (1.4.4, AA)

## Misfiles

- The internal padding of a button is a component token that aliases the scale. It is not a new scale. (`tokens/architecture.md`)
- A "filter bar" layout is a pattern, not a foundation. (`taxonomy/layers.md`)
- Touch and click target size is `density.md`.
- Responsive rules for a whole route belong to `patterns/responsive.md`.

## See also

- [Typography](./typography.md)
- [Density](./density.md)
- [Shape](./shape.md)
- [Token naming](../tokens/naming.md)
- [Responsive pattern](../patterns/responsive.md)
