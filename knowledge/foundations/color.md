---
id: foundations/color
title: Colour
shelf: foundations
layer: foundation
owner: ui-designer
tags: [color, contrast, palette, colors, roles, oklch, status, dark-mode, cvd]
sources:
  - WCAG 2.2 1.4.1 Use of Color (A), 1.4.3 Contrast Minimum (AA), 1.4.6 Contrast Enhanced (AAA), 1.4.11 Non-text Contrast (AA) — https://www.w3.org/TR/WCAG22/
  - CSS Color Module Level 4 (oklch(), color-mix()) — https://www.w3.org/TR/css-color-4/
  - Material 3, Carbon, Fluent 2, Polaris colour systems — see references/systems.md
  - Material 3, How the system works — https://m3.material.io/styles/color/system/how-the-system-works ("Tones from the palettes are then assigned to color roles")
  - Carbon, Color overview — https://carbondesignsystem.com/elements/color/overview/ ("Tokens are role-based, and themes specify the color values that serve those roles in the UI")
  - Primer, Color usage — https://primer.style/product/getting-started/foundations/color-usage/ ("Base color tokens don't respect color modes and should never be used directly in code or design")
  - Atlassian, Color palette — https://atlassian.design/foundations/color-new/color-palette-new/ (named hues, Blue100 to Blue1000)
---

# Colour

> Colour has three jobs: make text readable, show what belongs together, and say what state something is in. Pick a few named hues and build lighter and darker grades of each: that is the palette. Say which hue plays primary, error and so on: those are the colors. Then give every use a name that says its job, such as "muted text" or "error border": those are the roles, and each theme sets them. A person with weak colour vision must still get the same message, so colour never works alone.

## Rules

1. Build each palette hue as a tonal scale of grades `100` to `900`. Hold the hue fixed and vary lightness. (Consistent ramps make contrast predictable.)
2. Define ramps in OKLCH, not HSL. Equal lightness steps in OKLCH look equally spaced to the eye. In HSL they do not. (CSS Color 4 defines `oklch()` as a perceptually uniform space.)
3. Check every OKLCH value against the sRGB gamut. Clamp chroma when a colour falls outside it. Keep a hex or `rgb()` fallback if you support old browsers. (Out-of-gamut colours render differently per device.)
4. Colour is stored in three steps, in this order: **palette → colors → roles**. Components use roles only. (Material 3: "Tones from the palettes are then assigned to color roles". Primer: base colour tokens "should never be used directly in code or design". See `tokens/architecture.md`.)
   - **Palette** (`foundations/color/palette.tokens.json`): named hues with grades, `palette.scarlet.600`, `palette.dark-blue.600`, `palette.teal.600`, `palette.gray.600`. Primitive tier. Never used by a component or a pattern. Name hues by colour, not by job. (Atlassian names hues Lime, Red, Teal, Blue; Carbon has `blue[50]`.)
   - **Colors** (`foundations/color/colors.tokens.json`): role scales that alias the palette: `colors.primary.600 → {palette.dark-blue.600}`. The set is primary, secondary, error, success, warning, info, neutral, each 100 to 900. A rebrand edits this file only. In Carbon, "colors" names the palette. Here it names these role scales; this plugin uses the word only in this sense.
   - **Roles** (`themes/<name>/<name>.tokens.json`): flat semantic colours named by purpose, each aliasing `colors.*` and set per theme. (Carbon: "Tokens are role-based, and themes specify the color values that serve those roles in the UI".)
5. Define these role groups, and no more until a use case forces one. Roles are flat: no role has a 100 to 900 scale. (Atlassian names roles by meaning; M3 names them primary, on-primary, container.)
   - **Text:** `text.default`, `text.muted`, `text.inverse`, `text.link`.
   - **Surface:** `surface.default`, `surface.raised`, `surface.sunken`.
   - **Border:** `border.default`, `border.strong`. `border.default` is decorative (a divider); `border.strong` is the boundary of a control.
   - **Action:** `action.primary`, `action.primary-hover`, `action.primary-pressed`, `action.primary-text` (the label on the fill), and the same four for `action.secondary`.
   - **Status:** one family per state (see rule 7): `status.error` (solid) and `status.error-surface` (tint), and the same for success, warning, info.
   - **Focus, disabled, state layers:** `focus.ring.color`, `focus.ring.width`, `focus.ring.offset`, `disabled.text`, `disabled.surface`, `disabled.border`, `state.hover-layer`, `state.pressed-layer`, `state.selected`. See § State roles.
   Every theme defines every role. (Carbon: "Color token names and roles are the same across themes, only the assigned value will change".)
6. Colour carries meaning, not decoration. Do not add gradients or glows to a data-dense interface. (Every decorative colour dilutes the status colours.)
7. Keep status families few. Four cover most products: success, warning, error, info. They map to the `error`, `success`, `warning` and `info` scales in `colors`. Give each family the same two members: the solid colour (`status.error`, for text, icon and border) and a tint (`status.error-surface`, for a background). Do not add a fifth family without a written reason. (A small set stays learnable and testable.)
8. Never use colour alone to carry information. Pair each status colour with text, an icon or a shape. The status column must still read in grayscale. (WCAG 1.4.1 Use of Color, A)
9. Do not rely on colour alone to show a link inside body text. Add an underline or another non-colour cue, or a 3:1 contrast against the surrounding text plus a focus and hover cue. (WCAG 1.4.1 Use of Color, A)
10. Body text needs at least 4.5:1 against its background. Large text needs 3:1. Large means 24px or more, or 18.66px or more when bold. (WCAG 1.4.3 Contrast Minimum, AA)
11. Set a higher house target of 7:1 for body text where the audience or the setting justifies it, for example long reading or bright environments. State it as a house standard, not as an AA requirement. (WCAG 1.4.6 Contrast Enhanced, AAA, is 7:1 for normal text and 4.5:1 for large text.)
12. UI component boundaries and meaningful graphics need at least 3:1 against adjacent colours. This covers an input border, a checkbox outline, a chart mark and an icon that carries meaning. (WCAG 1.4.11 Non-text Contrast, AA)
13. Test the actual pairs, not the scale. Compute the ratio for each text role on each surface role it can sit on, in each theme. Pay most attention to `text.muted` on `surface.sunken` and to `status.*` text on `status.*-surface` backgrounds. (WCAG 1.4.3 Contrast Minimum, AA)
14. Two roles sit outside the pair matrix: `disabled.*`, and `border.default`. Disabled controls are exempt from contrast rules, and `border.default` is a decorative divider, not the boundary of a control. Every control boundary uses `border.strong`. Keep disabled controls discernible anyway, and never use disabled styling for content people must read. (WCAG 1.4.3 Contrast Minimum, AA: inactive components are an exception; WCAG 1.4.11, AA applies to the boundaries a user needs to find a control.)
15. Use APCA as a design aid only. It is part of a WCAG 3 draft. It is not a conformance basis for WCAG 2.2, and a finding must not cite it as the basis. Cite the 1.4.3 or 1.4.11 ratio. (W3C: WCAG 3 is a working draft.)
16. Do not encode data with hue alone in charts. Add direct labels, shapes, patterns or position. (WCAG 1.4.1 Use of Color, A)

## Dark mode

1. Re-derive dark values. Do not invert the light theme. Pick each dark role from the `colors` scales and test it again.
2. `themes/dark` is a sibling of `themes/light`: it defines every role, and only role values differ. Palette and colors never change per theme. (See `tokens/theming.md`.)
3. Make raised surfaces lighter than the canvas in a dark theme. Shadows read poorly on dark surfaces. (See `elevation.md`.)
4. Lower the chroma of saturated accents and status colours on dark surfaces. Full-chroma colours vibrate against dark grounds. Re-test the ratio after the change.
5. Avoid pure black and pure white as the two extremes for surface and text. Use near-black and near-white grades from the scale. This is a comfort practice, not a WCAG requirement.
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
- Generate categorical series by the golden-angle rule, so no hue repeats and neighbours sit about 137 degrees apart: series n = `oklch(L C, H0 + n × 137.508)`, with L and C fixed so every series has the same semi-muted weight. Store `series.hue` (250), `series.step` (137.508) and `series.chroma` (0.075) as primitives and `series.lightness` as a theme role (0.55 in light, 0.72 in dark). A token file cannot compute a colour, so the CSS composes it: `oklch(var(--ds-series-lightness) var(--ds-series-chroma) calc(var(--ds-series-hue) + var(--part) * var(--ds-series-step)))`, with `--part: n` set on the element. Pick the lightness per theme so series 1 to 12 keep 3:1 on the page and 3:1 for a number drawn on the fill. Never let the colour carry the meaning alone: add a number, a label or a shape. (WCAG 1.4.1, A; 1.4.11, AA)
- Keep chart colours as their own role group (`--ds-data-1`, `--ds-data-2`), or read a `colors` scale for sequential ramps. Do not reuse status roles for categories. Red then means "danger" everywhere.
- Full chart guidance is in `patterns/dashboards-charts.md`.

## Example

```css
:root {
  /* Palette, OKLCH. Primitive: used by colors only. */
  --ds-palette-dark-blue-600: oklch(0.45 0.10 255);
  --ds-palette-dark-blue-700: oklch(0.38 0.09 255);
  --ds-palette-gray-900: oklch(0.27 0.03 250);

  /* Colors: which hue plays which part. The rebrand point. */
  --ds-colors-primary-600: var(--ds-palette-dark-blue-600);
  --ds-colors-primary-700: var(--ds-palette-dark-blue-700);
  --ds-colors-neutral-900: var(--ds-palette-gray-900);

  /* Roles, from themes/light. What components use. */
  --ds-text-default: var(--ds-colors-neutral-900);
  --ds-action-primary: var(--ds-colors-primary-600);
  --ds-action-primary-hover: var(--ds-colors-primary-700);
}
```

The lightness and chroma values above show the shape of a scale. Compute your own pairs against your own surfaces.

## State roles

Colour is the main carrier of interaction and status states. Define these as roles in every theme. Do not spell a state colour at a call site.

1. Define state layers as roles: `state.hover-layer`, `state.pressed-layer`, `state.selected`. Each is an opaque tint that aliases a `colors` grade (light: `colors.primary.100` for hover, `colors.primary.200` for pressed and selected). They are opaque because a DTCG alias cannot carry an alpha. Material 3 models a state layer as an overlay at a fixed opacity (hover 8%, focus 10%, pressed 10%, dragged 16%); Bauhaus keeps the idea, one role per state instead of one colour per component, and stores the result as a tint. (Material 3 state layers.)
2. Recompute contrast for each state. A hover or pressed fill must still give 4.5:1 for its text and 3:1 for its boundary. (WCAG 1.4.3 Contrast Minimum, AA; WCAG 1.4.11 Non-text Contrast, AA)
3. Publish disabled roles: `disabled.text`, `disabled.surface`, `disabled.border`. Material 3 uses 38% opacity for disabled content and 12% for the disabled container; Bauhaus stores the resulting colours as opaque `colors` grades. Disabled controls are exempt from contrast rules, and the pair matrix skips `disabled.*`, but they must still be told apart from enabled ones. (WCAG 1.4.3 Contrast Minimum, AA: inactive components are an exception; Material 3 disabled opacities.)
4. Do not signal disabled by colour alone. Use the native `disabled` attribute or `aria-disabled="true"`, a not-allowed cursor and, where the reason matters, visible help text. (WCAG 1.4.1 Use of Color, A)
5. Never use disabled styling for text people must read to finish a task. Disabled styling can fall below 4.5:1. (WCAG 1.4.3 Contrast Minimum, AA)
6. Publish `focus.ring.color`, `focus.ring.width` and `focus.ring.offset`. Give the ring 3:1 against every adjacent colour, on light and dark surfaces. A two-tone ring (an inner light line and an outer dark line) works on any surface. (WCAG 1.4.11 Non-text Contrast, AA; WCAG 2.4.7 Focus Visible, AA. WCAG 2.4.13 Focus Appearance, AAA, sets a stricter size and change-of-contrast bar.)
7. Publish `state.selected` as a surface tint plus a non-colour cue: a check mark, an indicator bar, or heavier weight. The tint alone is not enough. (WCAG 1.4.1 Use of Color, A)
8. Publish `error` and `success` from the status families. Error needs `status.error` (text, icon, border) and `status.error-surface` (background). Pair it with an icon and a text message that names the problem. (WCAG 1.4.1 Use of Color, A; WCAG 3.3.1 Error Identification, A)
9. Do not announce success or error by colour change alone. Add a status message that assistive technology can read. (WCAG 4.1.3 Status Messages, AA)
10. Keep state colours in the same status families as static status. An error border is the `error` family, not a new red. (Fewer families stay learnable.)

| State | Role shape | Non-colour pair | Basis |
|---|---|---|---|
| hover | `state.hover-layer` tint | cursor, underline on links | Material 3; 1.4.1 (A) |
| focus-visible | `focus.ring.color`, 2px ring | the ring itself | 2.4.7 (AA), 1.4.11 (AA) |
| pressed | `state.pressed-layer` tint | 50 ms motion, see `motion.md` | Material 3 |
| disabled | `disabled.*` roles | `disabled` attribute | 1.4.3 (AA) exception |
| selected | `state.selected` | check mark or indicator | 1.4.1 (A) |
| error | `status.error`, `status.error-surface` | icon and message text | 1.4.1 (A), 3.3.1 (A) |
| success | `status.success`, `status.success-surface` | icon and status message | 1.4.1 (A), 4.1.3 (AA) |

```css
.ds-btn:hover { background: var(--ds-state-hover-layer); }
.ds-btn--primary:hover { background: var(--ds-action-primary-hover); }
```

Dark themes show elevation by tone: a raised surface is lighter than the canvas. See `elevation.md`.

## Page contract

A colour page in the styleguide and in Storybook carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what colour does in three jobs: read, group, report state. A foundation, stored as tokens. (`taxonomy/layers.md`)
- Show the palette as scales, the colors that alias it, and the roles of each theme side by side.

### 2. Anatomy
- A palette hue: grades 100 to 900, one hue, lightness runs light to dark.
- A role group: required members (text, surface, border, action, four status families), optional members (data).
- A status family: `solid`, `text`, `soft`, `line`. All four are required. (Consistent members make status testable.)

### 3. Tokens
- Palette: `--ds-palette-<hue>-<grade>`. Show the OKLCH value and the hex.
- Colors: `--ds-colors-<role>-<grade>` and the palette entry each aliases.
- Roles: text, surface, border, action, status, data. One row per role: value in each theme, intent, allowed surfaces.
- State roles: state layers, `disabled.*`, `focus.ring.*`.
- Show the measured contrast ratio beside each text and surface pair, and the level it meets. (WCAG 1.4.3, AA; 1.4.6, AAA)

### 4. States
- Show every colour state in a matrix: default, hover, focus-visible, pressed, disabled, selected, error, success, warning. Mark each cell `designed`, `n/a` with a reason, or `missing`. (`states/interaction-states.md`)
- Show each state in light and in dark.

### 5. Usage
- When to use: any colour in a product. It must be a role. (`tokens/architecture.md`)
- When not to use: a one-off illustration or brand artwork. Those are assets, not tokens. Chart colours use the `data` roles or a `colors` scale. (`patterns/dashboards-charts.md`)
- How: pick the role first, then read the ratio table for the surface it sits on. Pair status with an icon and text. Test every theme. (WCAG 1.4.1, A; 1.4.3, AA)

### 6. Pitfalls and don'ts
- Status by colour alone fails users with colour vision deficiency. (WCAG 1.4.1, A)
- A faint 1px border on an input fails boundary contrast. (WCAG 1.4.11, AA)
- Inverting light values for dark breaks ratios and status meaning. Re-derive. (WCAG 1.4.3, AA)
- Citing APCA as the basis for a finding is invalid. It is a WCAG 3 draft. (W3C)
- A component that reads `palette.*` or `colors.*` cannot follow a theme. (`misfile.palette-at-call-site`)
- A fifth status hue dilutes the four that already have a job.
- Disabled styling on required reading text can fall under 4.5:1. (WCAG 1.4.3, AA)

## Why

- Contrast criteria set a measurable floor. 1.4.3 (AA) and 1.4.11 (AA) apply to text and to component boundaries. 1.4.6 (AAA) is the enhanced level.
- 1.4.1 (A) exists because colour vision varies. A message in colour alone is lost to some users.
- Perceptual uniformity makes ramps predictable. Equal steps in OKLCH lightness give even visual steps, so contrast can be planned from the step distance.
- A small status set keeps the meaning stable. A mature production system in this domain holds four state families and no fifth, and colours carry status only.

## Rulebook seeds

- `color.no-literal` · auto · MEDIUM · No hex, `rgb()` or `oklch()` literal outside the token source.
- `color.text-contrast` · auto · HIGH · Each text role meets 4.5:1 (3:1 for large text) on every surface it is allowed on, in every theme. (1.4.3, AA)
- `color.boundary-contrast` · auto · HIGH · Input, checkbox and radio borders meet 3:1 against their surface. (1.4.11, AA)
- `color.status-not-alone` · review · HIGH · Every status colour has a text, icon or shape pair. (1.4.1, A)
- `color.status-set` · auto · MEDIUM · Status families are limited to the documented set.
- `color.roles-only` · auto · HIGH · Components and patterns read roles, never `palette.*` or `colors.*`.
- `color.dark-derived` · review · MEDIUM · Dark values are re-derived and re-tested, not inverted.
- `color.chart-not-hue-only` · review · MEDIUM · Chart series differ by more than hue.

## Misfiles

- A button's background colour is a component token that aliases a role. It is not a foundation. (`tokens/architecture.md`)
- "Success banner" styling belongs to a component. (`taxonomy/layers.md`)
- The focus ring colour is the `focus.ring.color` role. Its thickness and offset belong to `shape.md`.
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
