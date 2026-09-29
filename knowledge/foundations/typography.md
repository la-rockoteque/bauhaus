---
id: foundations/typography
title: Typography
shelf: foundations
layer: foundation
owner: ui-designer
tags: [type-scale, line-height, measure, font-stack, tabular-numerals, clamp, rem]
sources:
  - WCAG 2.2 1.4.4 Resize Text (AA), 1.4.12 Text Spacing (AA), 1.4.8 Visual Presentation (AAA) — https://www.w3.org/TR/WCAG22/
  - CSS Fonts Level 4 (variable fonts, font-variant-numeric) — https://www.w3.org/TR/css-fonts-4/
  - CSS Values Level 4 (clamp()) — https://www.w3.org/TR/css-values-4/
---

# Typography

> Type is how a product speaks. A good type system uses few sizes, few weights and two typefaces at most. Size, weight and colour show what matters most. Numbers that people scan, like IDs and quantities, get a font that lines them up in columns. Text must grow when a person zooms or changes their settings, and nothing may break when it does.

## Rules

1. Use one sans-serif family for prose, labels, buttons and inputs. Add one monospace family only for scannable values. Do not add a third family. (A small set keeps the interface coherent and the payload light.)
2. Build the type scale from a modular ratio or from a short hand-tuned list. Common ratios are 1.2 (minor third), 1.25 (major third) and 1.333 (perfect fourth). Dense tools suit the smaller ratios. (Ratio-based scales give predictable steps.)
3. Keep the scale to 5 to 8 steps. Name steps by intent, not pixel value: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. (Intent names allow retuning without renaming. See `tokens/naming.md`.)
4. Set sizes in `rem`, not `px`. Users who change the browser's default font size then get scaled text. (WCAG 1.4.4 Resize Text, AA: text resizes up to 200% without loss of content.)
5. Never set `font-size` on `html` in `px`. Leave it at the user's default, or use a percentage. (House convention: a px root ignores the user's default text size. WCAG 1.4.4 Resize Text, AA, is met by zoom alone.)
6. Keep 16px (1rem) as the default body size for reading text. Dense data tools may go lower for tables and metadata. Do not go below what your audience can read at the intended distance. (House convention: 16px is the browser default. Material 3 body large is 16.)
7. Set unitless `line-height`. Use about 1.5 for body prose, about 1.25 for headings and counts, and about 1.4 between the two. (Unitless values scale with the element's font size.)
8. Body text must survive these user overrides with no loss of content or function: line height 1.5 times the font size, paragraph spacing 2 times the font size, letter spacing 0.12 times, word spacing 0.16 times. Do not fix the height of text containers. (WCAG 1.4.12 Text Spacing, AA)
9. Do not clip text with a fixed `height` or `overflow: hidden`. Use `min-height`. Let containers grow. (WCAG 1.4.12 Text Spacing, AA; WCAG 1.4.4 Resize Text, AA)
10. Limit line length for reading text to 45 to 75 characters. Use `max-width: 65ch` as a starting point. (Readability practice. WCAG 1.4.8 Visual Presentation, AAA, sets an upper limit of 80 characters.)
11. Do not cap the measure of tables, forms and code. The measure rule applies to prose. (WCAG 1.4.8 Visual Presentation, AAA: the 80-character limit is for blocks of text.)
12. Use weight, size and colour, in that order of restraint, to build hierarchy. Reach for colour or size before a heavier weight. Three weights are enough: regular, medium, semibold. (Fewer weights keep the hierarchy readable.)
13. Do not use uppercase with wide letter spacing as a default label style. Use size, weight and colour. (Uppercase runs are harder to scan and read more slowly.)
14. Use the monospace family for values people scan or compare: IDs, serial numbers, codes, quantities, percentages. Do not set prose in mono. (Fixed-width glyphs align characters and make differences visible.)
15. Turn on tabular numerals for numbers in columns, counters and timers: `font-variant-numeric: tabular-nums`. Right-align numeric columns. (Tabular figures share one width, so digits line up and do not jitter when values change.)
16. Give the font stack a full fallback chain that ends in a generic family. Match fallback metrics where possible to limit layout shift. (A missing web font must not break the layout.)
17. Do not use images of text. Use real text. (WCAG 1.4.5 Images of Text, AA)
18. Prefer a variable font when you need three or more weights of one family. It ships one file for the whole weight axis. Declare the supported range in `@font-face`. (CSS Fonts Level 4 `font-weight` range.)
19. Use fluid type with `clamp()` for display sizes only, such as page titles and hero text. Keep body and UI sizes fixed. (Fluid body text makes rhythm and measure unpredictable.)
20. Write every fluid size with a `rem` term in the preferred value. `clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)` scales with user settings. A pure `vw` preferred value does not, and it can break zoom. (WCAG 1.4.4 Resize Text, AA)
21. Ensure text stays readable at 200% zoom and at a 320 CSS px wide viewport. (WCAG 1.4.4 Resize Text, AA; WCAG 1.4.10 Reflow, AA)

## Example

```css
:root {
  --ds-font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --ds-font-mono: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace;

  --ds-text-sm: 0.8125rem;
  --ds-text-md: 0.875rem;
  --ds-text-lg: 1rem;
  --ds-text-xl: 1.25rem;
  --ds-text-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem); /* display only */

  --ds-lh-tight: 1.25;
  --ds-lh-snug: 1.4;
  --ds-lh-normal: 1.5;

  --ds-weight-regular: 400;
  --ds-weight-medium: 500;
  --ds-weight-semibold: 600;
}

.ds-prose { max-width: 65ch; line-height: var(--ds-lh-normal); }
.ds-value { font-family: var(--ds-font-mono); font-variant-numeric: tabular-nums; }
```

The family names above are examples. Use the families your project licenses and ships.

## Hierarchy order

Differentiate levels in this order. Stop at the first step that works.

1. Colour (a text role token such as `muted`).
2. Weight (one step up).
3. Size (one scale step up).

Do not combine all three on one level. A level that needs all three has the wrong place in the hierarchy.

## Page contract

A typography page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what type does: it sets voice, order and readability. Layer: foundation. (`taxonomy/layers.md`)
- Lead with one specimen: the scale set in the product's own text.

### 2. Tokens
- Families: `--ds-font-body`, `--ds-font-mono`.
- Scale: `--ds-text-xs` to `--ds-text-2xl`, in `rem`, with the pixel value at default zoom.
- Line heights: `--ds-lh-tight`, `--ds-lh-snug`, `--ds-lh-normal`. Weights: regular, medium, semibold.
- Optional DTCG `typography` composite tokens that bundle family, size, weight and line height into named text styles. (`tokens/architecture.md`)

### 3. Anatomy
- A text style is four parts: family, size step, line height, weight. All four are required. Letter spacing is optional.
- The scale is 5 to 8 steps from a ratio or a hand-tuned list. State the ratio or say "hand-tuned".
- Show a specimen with baseline and line-height boxes.

### 4. States
- Typography provides text styles for these states: link (default, hover, visited, focus-visible), current item (heavier weight), disabled text, placeholder, error text, changing value (tabular numerals).
- Colour for each state comes from `color.md`. Typography adds the non-colour cue: link underline, weight step, tabular figures. (WCAG 1.4.1 Use of Color, A)
- Truncated text needs its full value reachable by keyboard and pointer. (WCAG 1.4.10 Reflow, AA)

### 5. Usage
- When to use each step: name one job per step (page title, section title, body, label, metadata).
- When to use mono: IDs, codes, quantities, percentages. Otherwise use body. (Scanning practice; fixed-width glyphs align.)
- How: `rem` units, unitless line height, `max-width` in `ch` for prose, `min-height` for text containers. (WCAG 1.4.4, AA; 1.4.12, AA)
- Responsive: fluid `clamp()` for display sizes only, with a `rem` term.

### 6. Pitfalls and don'ts
- Fixed `px` font sizes ignore the user's default size. (WCAG 1.4.4 Resize Text, AA)
- A fixed `height` on a text box clips content under text spacing overrides. (WCAG 1.4.12 Text Spacing, AA)
- A `vw`-only fluid size cannot be zoomed. (WCAG 1.4.4 Resize Text, AA)
- Text baked into an image cannot be resized or restyled. (WCAG 1.4.5 Images of Text, AA)
- Uppercase with wide tracking as a default label style slows scanning. Use size, weight, colour.
- A third typeface adds payload and dilutes the system.

## Why

- WCAG 1.4.4 (AA) and 1.4.10 (AA) require text that scales and reflows. Relative units and unfixed containers are the only reliable way to meet them.
- WCAG 1.4.12 (AA) sets numeric spacing overrides that assistive tools apply. Content must survive them.
- A short scale is easier to learn and to audit than a long one. A mature production system in this domain covers most of its interface with six sizes and three weights.
- Monospace and tabular numerals serve scanning. A reader compares columns of IDs and quantities by their shape.

## Rulebook seeds

- `type.no-px-font-size` · auto · HIGH · Font sizes use `rem` or tokens, never `px` at a call site. (1.4.4, AA)
- `type.scale-token` · auto · MEDIUM · Every `font-size` is a scale token.
- `type.unitless-line-height` · auto · MEDIUM · `line-height` has no unit.
- `type.no-fixed-text-height` · auto · HIGH · Text containers use `min-height`, not `height`. (1.4.12, AA)
- `type.measure` · review · LOW · Reading prose stays within 45 to 75 characters.
- `type.mono-for-values` · review · MEDIUM · Scannable values use the mono family and tabular numerals.
- `type.weights` · auto · LOW · Only the documented weights appear.
- `type.fluid-rem` · auto · HIGH · Every `clamp()` size includes a `rem` term. (1.4.4, AA)

## Misfiles

- Heading levels (`h1` to `h6`) are document structure, not scale steps. Do not pick a heading level for its size.
- The label style of one form field is a primitive concern.
- Copy length and tone belong to `patterns/content-writing.md`.

## See also

- [Colour](./color.md)
- [Spacing and layout](./spacing-layout.md)
- [Density](./density.md)
- [Token naming](../tokens/naming.md)
- [WCAG map](../accessibility/wcag-map.md)
- [Content writing](../patterns/content-writing.md)
