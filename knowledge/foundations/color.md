---
id: foundations/color
title: Colour
shelf: foundations
layer: foundation
owner: ui-designer
tags: [color, contrast, palette, oklch, status, dark-mode, cvd]
sources:
  - WCAG 2.2 1.4.1 Use of Color (A), 1.4.3 Contrast Minimum (AA), 1.4.6 Contrast Enhanced (AAA), 1.4.11 Non-text Contrast (AA) — https://www.w3.org/TR/WCAG22/
  - CSS Color Module Level 4 (oklch(), color-mix()) — https://www.w3.org/TR/css-color-4/
  - Material 3, Carbon, Fluent 2, Polaris colour systems — see references/systems.md
---

# Colour

> Colour has three jobs: make text readable, show what belongs together, and say what state something is in. Pick a few base colours. Build a ramp of lighter and darker steps for each. Then give every use a name that says its job, such as "muted text" or "danger border". A person with weak colour vision must still get the same message, so colour never works alone.

## Rules

1. Build each hue as a tonal ramp of 10 to 12 steps (for example `50` to `950`). Hold the hue fixed and vary lightness. (Consistent ramps make contrast predictable.)
2. Define ramps in OKLCH, not HSL. Equal lightness steps in OKLCH look equally spaced to the eye. In HSL they do not. (CSS Color 4 defines `oklch()` as a perceptually uniform space.)
3. Check every OKLCH value against the sRGB gamut. Clamp chroma when a colour falls outside it. Keep a hex or `rgb()` fallback if you support old browsers. (Out-of-gamut colours render differently per device.)
4. Primitive tokens hold colour ramps. Semantic tokens name roles. Call sites use roles only. (See `tokens/architecture.md`.)
5. Define these semantic groups, and no more until a use case forces one:
   - **Text:** `primary`, `muted`, `subtle` (placeholder, metadata), `disabled`, `inverse`, `link`, `on-accent`.
   - **Surface:** `canvas`, `raised`, `sunken`, `overlay`.
   - **Border:** `default`, `subtle`, `strong`, `focus`.
   - **Accent:** `default`, `hover`, `soft` (wash, focus ring), `tint` (selected row).
   - **Status:** one family per state (see rule 7).
6. Colour carries meaning, not decoration. Do not add gradients or glows to a data-dense interface. (Every decorative colour dilutes the status colours.)
7. Keep status families few. Four cover most products: success, warning, danger, neutral or info. Give each family the same four members: `solid`, `text`, `soft` (background), `line` (border). Do not add a fifth family without a written reason. (A small set stays learnable and testable.)
8. Never use colour alone to carry information. Pair each status colour with text, an icon or a shape. The status column must still read in grayscale. (WCAG 1.4.1 Use of Color, A)
9. Do not rely on colour alone to show a link inside body text. Add an underline or another non-colour cue, or a 3:1 contrast against the surrounding text plus a focus and hover cue. (WCAG 1.4.1 Use of Color, A)
10. Body text needs at least 4.5:1 against its background. Large text needs 3:1. Large means 24px or more, or 18.66px or more when bold. (WCAG 1.4.3 Contrast Minimum, AA)
11. Set a higher house target of 7:1 for body text where the audience or the setting justifies it, for example long reading or bright environments. State it as a house standard, not as an AA requirement. (WCAG 1.4.6 Contrast Enhanced, AAA, is 7:1 for normal text and 4.5:1 for large text.)
12. UI component boundaries and meaningful graphics need at least 3:1 against adjacent colours. This covers an input border, a checkbox outline, a chart mark and an icon that carries meaning. (WCAG 1.4.11 Non-text Contrast, AA)
13. Test the actual pairs, not the ramp. Compute the ratio for each text token on each surface token it can sit on. Pay most attention to `subtle` text on `sunken` surfaces and to coloured text on soft status backgrounds. (WCAG 1.4.3 Contrast Minimum, AA)
14. Disabled controls are exempt from contrast rules. Keep them discernible anyway and never use disabled styling for content people must read. (WCAG 1.4.3 Contrast Minimum, AA: inactive components are an exception.)
15. Use APCA as a design aid only. It is part of a WCAG 3 draft. It is not a conformance basis for WCAG 2.2, and a finding must not cite it as the basis. Cite the 1.4.3 or 1.4.11 ratio. (W3C: WCAG 3 is a working draft.)
16. Do not encode data with hue alone in charts. Add direct labels, shapes, patterns or position. (WCAG 1.4.1 Use of Color, A)

## Dark mode

1. Re-derive dark values. Do not invert the light theme. Pick each dark semantic token from the ramp and test it again.
2. Change semantic tokens per theme. Do not change primitive tokens. (See `tokens/theming.md`.)
3. Make raised surfaces lighter than the canvas in a dark theme. Shadows read poorly on dark surfaces. (See `elevation.md`.)
4. Lower the chroma of saturated accents and status colours on dark surfaces. Full-chroma colours vibrate against dark grounds. Re-test the ratio after the change.
5. Avoid pure black and pure white as the two extremes for surface and text. Use near-black and near-white steps from the ramp. This is a comfort practice, not a WCAG requirement.
6. Every rule in this file applies again in dark mode. The 4.5:1, 3:1 and 1.4.1 checks run per theme.

## Colour vision deficiency

- About 8% of men and a much smaller share of women have a colour vision deficiency. Red and green are the most commonly confused pair.
- Do not separate success from danger by red and green alone. Add an icon and a label.
- Check every status view in grayscale and in a deficiency simulator. Both are review aids, not conformance tests.
- Prefer lightness differences to hue differences when two colours must be told apart. Lightness survives most deficiencies.

## Data visualisation palettes

- Use three palette kinds: **categorical** (distinct hues, few of them), **sequential** (one hue, lightness runs low to high), **diverging** (two hues meeting at a neutral midpoint).
- Keep categorical sets small. Distinguishability falls as the set grows. Group or filter instead of adding hues.
- Check each mark against its background at 3:1. (WCAG 1.4.11 Non-text Contrast, AA)
- Keep chart colours as their own semantic group (`--ds-color-data-1`, `--ds-color-data-2`). Do not reuse status colours for categories. Red then means "danger" everywhere.
- Full chart guidance is in `patterns/dashboards-charts.md`.

## Example

```css
:root {
  /* Primitive token ramp, OKLCH. Tier 1: never used at a call site. */
  --ds-color-blue-600: oklch(0.45 0.10 255);
  --ds-color-blue-700: oklch(0.38 0.09 255);
  --ds-color-gray-900: oklch(0.27 0.03 250);

  /* Semantic roles. Tier 2: what call sites use. */
  --ds-color-text-primary: var(--ds-color-gray-900);
  --ds-color-accent-default: var(--ds-color-blue-600);
  --ds-color-accent-hover: var(--ds-color-blue-700);
}
```

The lightness and chroma values above show the shape of a ramp. Compute your own pairs against your own surfaces.

## State colour tokens

Colour is the main carrier of interaction and status states. Define these tokens as semantic tokens. Do not spell a state colour at a call site.

1. Define state layers as overlay opacities, not as extra colours per component. Apply the layer over the base colour with `color-mix()` or an overlay element. Suggested values from Material 3: hover 8%, focus 10%, pressed 10%, dragged 16%. (Material 3 state layers; one set of numbers replaces one colour per state per component.)
2. Recompute contrast for each state. A hover or pressed fill must still give 4.5:1 for its text and 3:1 for its boundary. (WCAG 1.4.3 Contrast Minimum, AA; WCAG 1.4.11 Non-text Contrast, AA)
3. Publish disabled tokens: `text.disabled`, `surface.disabled`, `border.disabled`. Material 3 uses 38% opacity for disabled content and 12% for the disabled container. Disabled controls are exempt from contrast rules, but they must still be told apart from enabled ones. (WCAG 1.4.3 Contrast Minimum, AA: inactive components are an exception; Material 3 disabled opacities.)
4. Do not signal disabled by colour alone. Use the native `disabled` attribute or `aria-disabled="true"`, a not-allowed cursor and, where the reason matters, visible help text. (WCAG 1.4.1 Use of Color, A)
5. Never use disabled styling for text people must read to finish a task. Disabled styling can fall below 4.5:1. (WCAG 1.4.3 Contrast Minimum, AA)
6. Publish `color.border.focus` as one token. Give the ring 3:1 against every adjacent colour, on light and dark surfaces. A two-tone ring (an inner light line and an outer dark line) works on any surface. (WCAG 1.4.11 Non-text Contrast, AA; WCAG 2.4.7 Focus Visible, AA. WCAG 2.4.13 Focus Appearance, AAA, sets a stricter size and change-of-contrast bar.)
7. Publish `selected` as a surface tint (`accent.tint` or `accent.soft`) plus a non-colour cue: a check mark, an indicator bar, or heavier weight. The tint alone is not enough. (WCAG 1.4.1 Use of Color, A)
8. Publish `error` and `success` from the status families. Error needs `text`, `line` and `soft`. Pair it with an icon and a text message that names the problem. (WCAG 1.4.1 Use of Color, A; WCAG 3.3.1 Error Identification, A)
9. Do not announce success or error by colour change alone. Add a status message that assistive technology can read. (WCAG 4.1.3 Status Messages, AA)
10. Keep state colours in the same status families as static status. An error border is the `danger` family, not a new red. (Fewer families stay learnable.)

| State | Token shape | Non-colour pair | Basis |
|---|---|---|---|
| hover | state layer 8% over base | cursor, underline on links | Material 3; 1.4.1 (A) |
| focus-visible | `color.border.focus`, 2px ring | the ring itself | 2.4.7 (AA), 1.4.11 (AA) |
| pressed | state layer 10% over base | 50 ms motion, see `motion.md` | Material 3 |
| disabled | `*.disabled` tokens | `disabled` attribute | 1.4.3 (AA) exception |
| selected | `accent.tint` | check mark or indicator | 1.4.1 (A) |
| error | `status.danger.*` | icon and message text | 1.4.1 (A), 3.3.1 (A) |
| success | `status.success.*` | icon and status message | 1.4.1 (A), 4.1.3 (AA) |

```css
:root {
  --ds-state-hover: 8%;
  --ds-state-pressed: 10%;
}
.ds-btn:hover {
  background: color-mix(in oklch, var(--ds-color-accent-default), var(--ds-color-text-on-accent) var(--ds-state-hover));
}
```

## Page contract

A colour page in the styleguide and in Storybook carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what colour does in three jobs: read, group, report state. Layer: foundation. (`taxonomy/layers.md`)
- Show the palette as ramps and as roles side by side.

### 2. Tokens
- Primitive token ramps: `--ds-color-<hue>-<step>`. Show the OKLCH value and the hex.
- Semantic groups: text, surface, border, accent, status, data. One row per token: value, intent, allowed surfaces.
- State tokens: state layers, `*.disabled`, `border.focus`.
- Show the measured contrast ratio beside each text and surface pair, and the level it meets. (WCAG 1.4.3, AA; 1.4.6, AAA)

### 3. Anatomy
- A ramp: 10 to 12 steps, one hue, lightness runs light to dark.
- A role group: required members (text, surface, border, accent, four status families), optional members (data).
- A status family: `solid`, `text`, `soft`, `line`. All four are required. (Consistent members make status testable.)

### 4. States
- Show every colour state in a matrix: default, hover, focus-visible, pressed, disabled, selected, error, success, warning. Mark each cell `designed`, `n/a` with a reason, or `missing`. (`states/interaction-states.md`)
- Show each state in light and in dark.

### 5. Usage
- When to use: any colour in a product. It must be a semantic token. (Tier rule, `tokens/architecture.md`)
- When not to use: a one-off illustration or brand artwork. Those are assets, not tokens. Chart colours use the `data` group. (`patterns/dashboards-charts.md`)
- How: pick the role first, then read the ratio table for the surface it sits on. Pair status with an icon and text. Test every theme. (WCAG 1.4.1, A; 1.4.3, AA)

### 6. Pitfalls and don'ts
- Status by colour alone fails users with colour vision deficiency. (WCAG 1.4.1, A)
- A faint 1px border on an input fails boundary contrast. (WCAG 1.4.11, AA)
- Inverting light values for dark breaks ratios and status meaning. Re-derive. (WCAG 1.4.3, AA)
- Citing APCA as the basis for a finding is invalid. It is a WCAG 3 draft. (W3C)
- A fifth status hue dilutes the four that already have a job.
- Disabled styling on required reading text can fall under 4.5:1. (WCAG 1.4.3, AA)

## Why

- Contrast criteria set a measurable floor. 1.4.3 (AA) and 1.4.11 (AA) apply to text and to component boundaries. 1.4.6 (AAA) is the enhanced level.
- 1.4.1 (A) exists because colour vision varies. A message in colour alone is lost to some users.
- Perceptual uniformity makes ramps predictable. Equal steps in OKLCH lightness give even visual steps, so contrast can be planned from the step distance.
- A small status set keeps the meaning stable. A mature production system in this domain holds four state families and no fifth, and colours carry status only.

## Rulebook seeds

- `color.no-literal` · auto · MEDIUM · No hex, `rgb()` or `oklch()` literal outside the token source.
- `color.text-contrast` · auto · HIGH · Each text token meets 4.5:1 (3:1 for large text) on every surface it is allowed on. (1.4.3, AA)
- `color.boundary-contrast` · auto · HIGH · Input, checkbox and radio borders meet 3:1 against their surface. (1.4.11, AA)
- `color.status-not-alone` · review · HIGH · Every status colour has a text, icon or shape pair. (1.4.1, A)
- `color.status-set` · auto · MEDIUM · Status families are limited to the documented set.
- `color.dark-derived` · review · MEDIUM · Dark values are re-derived and re-tested, not inverted.
- `color.chart-not-hue-only` · review · MEDIUM · Chart series differ by more than hue.

## Misfiles

- A button's background colour is a component token that aliases a semantic token. It is not a foundation. (`tokens/architecture.md`)
- "Success banner" styling belongs to a component. (`taxonomy/layers.md`)
- The focus ring colour is a semantic border token. Its thickness and offset belong to `shape.md`.
- Chart series colours used in one dashboard are a pattern concern. (`patterns/dashboards-charts.md`)

## See also

- [Typography](./typography.md)
- [Elevation](./elevation.md)
- [Shape](./shape.md)
- [Token architecture](../tokens/architecture.md)
- [Theming](../tokens/theming.md)
- [WCAG map](../accessibility/wcag-map.md)
- [Dashboards and charts](../patterns/dashboards-charts.md)
- [Reference systems](../references/systems.md)
