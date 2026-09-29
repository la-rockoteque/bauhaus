---
id: foundations/density
title: Density
shelf: foundations
layer: foundation
owner: ui-designer
tags: [density, compact, comfortable, target-size, row-height]
sources:
  - WCAG 2.2 2.5.8 Target Size (Minimum) (AA), 2.5.5 Target Size (Enhanced) (AAA) — https://www.w3.org/TR/WCAG22/
  - Material 3, Carbon, Fluent 2 density and size guidance — see references/systems.md
---

# Density

> Density is how much fits on a screen. A compact table shows many rows. A comfortable table gives each row more air. Some people need the compact view to work fast. Others need the comfortable view to hit small targets. Density is a setting a person can change. It changes spacing and control height, but not colour.

## Rules

1. Treat density as a theme dimension. It overrides semantic tokens, like `space.inset.control` and `size.control.height`. It does not change primitives. (See `tokens/theming.md`.)
2. Offer two modes: `comfortable` (default) and `compact`. Add a third only when a real use needs it. (Each mode multiplies the test surface.)
3. Set the default to comfortable. Let the user or the product choose compact. (Comfortable is safer for touch and for new users.)
4. Density changes vertical space, control height and inline gaps. It does not change font size below the type scale minimum, colour, or contrast. (Compact must stay readable. See `typography.md`.)
5. Publish control heights as tokens: `--ds-size-control-sm`, `--ds-size-control-md`, `--ds-size-control-lg`. Density picks which one a default control uses. (Carbon sizes controls `sm`, `md` and `lg`.)
6. Publish row heights as tokens for tables and lists. The values below are examples, not a standard: compact 32px, comfortable 40px or 48px. Pick values from your 4px grid. (See `spacing-layout.md`.)
7. Every pointer target must be at least 24 x 24 CSS px, in every density mode. (WCAG 2.5.8 Target Size (Minimum), AA)
8. The 24px minimum has exceptions. A smaller target passes when a 24px-diameter circle centred on it does not overlap another target or its circle (the spacing exception), when an equivalent control of enough size exists on the same page, when the target sits inside a sentence or is limited by line height (inline), when the size is set by the browser (user agent control), or when the size is essential. (WCAG 2.5.8 Target Size (Minimum), AA)
9. Target size 44 x 44 CSS px is a separate, stricter criterion at level AAA. Say "WCAG 2.5.5 Target Size (Enhanced), AAA". Do not say "AA requires 44". (WCAG 2.5.5 Target Size (Enhanced), AAA)
10. Adopt 44px as a house standard when the setting justifies it, such as gloved hands, touch-first kiosks or mobile field work. State it as a house standard at AAA level. (WCAG 2.5.5 Target Size (Enhanced), AAA)
11. Make the visible control smaller than the target when needed. Use padding or a pseudo-element to extend the hit area. Do not let extended areas overlap neighbouring targets. (WCAG 2.5.8 Target Size (Minimum), AA: the target is the area that responds to input.)
12. Use compact mode only for pointer-first, data-dense views such as tables, toolbars and admin lists. Do not apply compact to touch-first screens by default. (Small targets raise error rates for touch. See Fitts, 1954, in `motion.md`.)
13. Keep space between adjacent targets in compact mode. A 24px target with no gap to its neighbour fails 2.5.8 unless another exception applies. (WCAG 2.5.8 Target Size (Minimum), AA)
14. Do not shrink the focus indicator in compact mode. It keeps the size from `shape.md`. (WCAG 2.4.7 Focus Visible, AA)
15. Persist the user's density choice. Respect it across sessions and pages. Do not reset it on navigation. (Nielsen 7, Flexibility and efficiency of use.)
16. Test both modes for contrast, target size, reflow at 320 CSS px and text spacing overrides. (WCAG 1.4.10 Reflow, AA; WCAG 1.4.12 Text Spacing, AA)

## Density tokens

| Semantic token | Comfortable (example) | Compact (example) |
|---|---|---|
| `size.control.height` | 40px | 32px |
| `space.inset.control` | 12px | 8px |
| `size.row.height` | 48px | 32px |
| `space.stack.form` | 16px | 12px |

The values are examples on a 4px grid. Choose your own. The compact column must still meet rule 7 for every target in the row.

## Example

```css
:root, [data-density='comfortable'] {
  --ds-size-control-height: 2.5rem;
  --ds-space-inset-control: var(--ds-space-3);
  --ds-size-row-height: 3rem;
}

[data-density='compact'] {
  --ds-size-control-height: 2rem;
  --ds-space-inset-control: var(--ds-space-2);
  --ds-size-row-height: 2rem;
}

.ds-btn {
  min-height: var(--ds-size-control-height);
  min-width: 1.5rem; /* 24px floor: WCAG 2.5.8 (AA) */
  padding-inline: var(--ds-space-inset-control);
}
```

## Page contract

A density page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what density does: it sets how much fits on a screen, and lets people choose. Layer: foundation. (`taxonomy/layers.md`)
- Lead with one table shown in both modes.

### 2. Tokens
- Control heights: `--ds-size-control-sm`, `-md`, `-lg`. Row heights. Inset and stack tokens per mode.
- The `[data-density]` attribute values: `comfortable`, `compact`.
- The measured target size of each control in each mode.

### 3. Anatomy
- A mode: a set of semantic-token overrides for size and space. Nothing else changes.
- A target: visible control plus padded hit area. Show both outlines.
- The 24 x 24 CSS px floor and the 44 x 44 house standard, labelled with their levels.

### 4. States
- The states of this foundation are its modes: comfortable and compact. Show each with default, hover, focus-visible, disabled and selected controls.
- Every state in every mode keeps the target floor and the focus ring size. (WCAG 2.5.8 Target Size (Minimum), AA; 2.4.7 Focus Visible, AA)

### 5. Usage
- When to use compact: pointer-first, data-dense views such as tables and admin toolbars.
- When not to: touch-first screens and the first-time flow. Use comfortable, or the 44px house standard. (WCAG 2.5.5 Target Size (Enhanced), AAA, as a house standard)
- How: set the attribute on a container, let tokens do the rest, persist the choice.
- Accessibility: test contrast, target size, reflow and text spacing in each mode. (WCAG 1.4.10, AA; 1.4.12, AA; 2.5.8, AA)

### 6. Pitfalls and don'ts
- Saying "AA requires 44 px" is wrong. 44 px is 2.5.5 at AAA. 24 px is 2.5.8 at AA.
- Compact controls with no gap between them fail 2.5.8 unless an exception applies. (WCAG 2.5.8, AA)
- Shrinking text below the scale minimum to gain space hurts reading. (WCAG 1.4.4, AA)
- Hard-coded heights at call sites bypass the density tokens.
- Resetting the density choice on navigation ignores the user.

## Why

- Density serves different jobs. A clerk scanning two hundred rows and a person on a touch screen have opposite needs. One setting serves both.
- WCAG 2.5.8 (AA) sets the floor at 24 x 24 CSS px with named exceptions. WCAG 2.5.5 (AAA) sets 44 x 44 for the enhanced level. Confusing the two produces wrong findings.
- Density is spacing and size only. Colour and contrast do not change, so the accessibility checks stay comparable across modes.
- Published systems (Material, Carbon, Fluent) ship named density or size variants that change control height and padding.

## Rulebook seeds

- `density.target-min-24` · auto · HIGH · Every interactive control is at least 24 x 24 CSS px, or meets an exception, in every density mode. (2.5.8, AA)
- `density.target-44-house` · auto · LOW · Touch-first views use targets of 44 x 44 CSS px. House standard, AAA. (2.5.5, AAA)
- `density.token-driven` · auto · MEDIUM · Control height and row height come from density tokens.
- `density.default-comfortable` · review · LOW · The default mode is comfortable.
- `density.both-modes-tested` · review · MEDIUM · Contrast, target size and reflow are tested in each mode.

## Misfiles

- Spacing between sections of a page is `spacing-layout.md`. Density affects control and row spacing only.
- A "dense table" is a pattern that uses density tokens. (`patterns/data-tables.md`)
- Font size changes are typography, not density.

## See also

- [Spacing and layout](./spacing-layout.md)
- [Typography](./typography.md)
- [Shape](./shape.md)
- [Theming](../tokens/theming.md)
- [Data tables](../patterns/data-tables.md)
- [WCAG map](../accessibility/wcag-map.md)
