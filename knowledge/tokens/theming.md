---
id: tokens/theming
title: Theming
shelf: tokens
layer: token
owner: ui-designer
tags: [theme, dark-mode, high-contrast, forced-colors, prefers-contrast, density, state-tokens]
sources:
  - WCAG 2.2 1.4.3 Contrast Minimum (AA), 1.4.11 Non-text Contrast (AA), 1.4.1 Use of Color (A), 2.4.7 Focus Visible (AA) — https://www.w3.org/TR/WCAG22/
  - CSS Color Adjustment Module Level 1 (color-scheme, forced-color-adjust) — https://www.w3.org/TR/css-color-adjust-1/
  - Media Queries Level 5 (prefers-color-scheme, prefers-contrast, forced-colors) — https://www.w3.org/TR/mediaqueries-5/
  - Material 3 state layers — see references/systems.md
---

# Theming

> A theme is a set of swaps. Light, dark, brand, high contrast and density are themes. Each swaps the values behind the job names, such as "muted text" or "raised surface". The raw palette never changes. Screens never change. That is why one screen can wear any theme, and why each theme must be tested on its own.

## Rules

1. A theme overrides semantic tokens only. Primitive tokens never change per theme. Call sites never name a theme. (`architecture.md`; `UBIQUITOUS-LANGUAGE.md` § Theme)
2. Treat each theme as a separate dimension: colour scheme (light, dark), contrast (default, more), brand, and density. Combine them. Do not build one theme per combination by hand. (A dimension per concern avoids a combinatorial file set.)
3. Define the default theme in `tokens.source`. Define each other theme as a folder of overrides that lists only the semantic tokens that differ. (`bauhaus.config.schema.json` § tokens.themes)
4. A theme must define a value for every token in the semantic set it overrides. A theme with a gap silently inherits a value that may fail contrast. Add a build check for coverage. (WCAG 1.4.3, AA)
5. Re-derive dark values from the ramps. Do not invert the light theme. (`foundations/color.md`)
6. Test every theme for contrast. Run the pair matrix (each text role on each surface role, each boundary on its surface) once per theme. Fail the build below 4.5:1 for text (3:1 for large text) and below 3:1 for boundaries and meaningful graphics. (WCAG 1.4.3 Contrast Minimum, AA; WCAG 1.4.11 Non-text Contrast, AA)
7. Test every theme for colour-alone status. (WCAG 1.4.1 Use of Color, A)
8. Re-derive shadows for dark themes. Do not reuse the light values. Lighten the raised surface, and re-tune or drop the shadow. (`foundations/elevation.md`)
9. Set `color-scheme` so the browser draws scrollbars, form controls and default backgrounds to match: `color-scheme: light dark` at `:root` when both are supported. (CSS Color Adjustment Level 1)
10. Honour the system preference by default and let the user override it. Use three choices: system, light, dark. Store the choice and apply it before first paint to avoid a flash of the wrong theme. (`prefers-color-scheme`, Media Queries Level 5)
11. Offer a high-contrast path. Support `@media (prefers-contrast: more)` with stronger borders, stronger text and no translucent overlays as text backgrounds. (`prefers-contrast`, Media Queries Level 5; WCAG 1.4.6 Contrast Enhanced, AAA, as the target.)
12. Support forced-colors mode. Under `@media (forced-colors: active)` the browser replaces author colours with a system palette. Do not fight it. Use system colour keywords (`CanvasText`, `Canvas`, `LinkText`, `ButtonText`, `Highlight`, `GrayText`) where you must set colour. Keep a real border on every control, since shadows and background colours are removed. Do not use `forced-color-adjust: none` except on content that needs its own colours, such as a colour swatch. (Media Queries Level 5; WCAG 1.4.11, AA)
13. A brand theme changes accent and surface tokens. It does not change status semantics: danger stays danger. A brand theme must pass the same contrast matrix. (WCAG 1.4.3, AA; 1.4.1, A)
14. A density theme changes size and space tokens only. It does not change colour. (`foundations/density.md`)
15. Do not put theme names in token names. Do not duplicate a component's CSS per theme. (`naming.md`)
16. Keep the theme switch in one place: an attribute on `:root` or on a container. Do not scatter class names per component. (One switch point.)

## State tokens per theme

Interaction and status states are semantic tokens. A theme overrides them like any other semantic token. (`foundations/color.md` § State colour tokens)

| State token | Changes per theme? | What changes | Basis |
|---|---|---|---|
| State layer opacity (hover, pressed) | Rarely | Opacity stays. The overlay colour follows the surface's "on" colour, so it lightens on dark and darkens on light. | Material 3 state layers |
| Focus ring colour | Yes | Re-derive so the ring reaches 3:1 against adjacent colours in each theme. A two-tone ring works on any surface. | WCAG 1.4.11 (AA); 2.4.7 (AA) |
| Disabled text, surface, border | Yes | Re-derive from the theme's own ramp. Disabled is exempt from contrast, but it must stay distinguishable from enabled. | WCAG 1.4.3 (AA) exception |
| Selected tint | Yes | Tint lightness inverts direction. Keep the non-colour cue (check mark, indicator bar). | WCAG 1.4.1 (A) |
| Error, success, warning families | Yes | Lower chroma on dark. Re-test each pair. The icon and text pairing stays. | WCAG 1.4.1 (A); 1.4.3 (AA) |
| Scrim | Yes | A darker or lighter wash. One value per theme. | `foundations/elevation.md` |
| Shadow | Yes | Re-derived or replaced by surface lightness. | `foundations/elevation.md` |
| Forced-colors mapping | Fixed | System keywords. States use `Highlight` and `GrayText` where colour must be set. | Media Queries Level 5 |

Every state row must exist in every theme. A missing cell is a finding. (`states/interaction-states.md`)

## CSS implementation

Use custom properties on `:root`. Use an attribute to force a theme. Use the media query as the default when the user has not chosen:

```css
:root {
  color-scheme: light;
  --ds-color-surface-canvas: #ffffff;
  --ds-color-text-primary: #213547;
  --ds-color-border-focus: #244b7b;
}

/* System preference, unless the user chose light. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
    --ds-color-surface-canvas: #14202e;
    --ds-color-text-primary: #e6edf5;
    --ds-color-border-focus: #9dc1f0;
  }
}

/* User choice wins. */
:root[data-theme='dark'] {
  color-scheme: dark;
  --ds-color-surface-canvas: #14202e;
  --ds-color-text-primary: #e6edf5;
  --ds-color-border-focus: #9dc1f0;
}

@media (prefers-contrast: more) {
  :root { --ds-color-border-default: var(--ds-color-border-strong); }
}

@media (forced-colors: active) {
  .ds-card, .ds-input { border: 1px solid CanvasText; }
}
```

The hex values are placeholders that show the shape. Derive yours from your ramps and run the contrast matrix.

The dark block appears twice. That duplication is the cost of "system default with user override" in plain CSS. Generate both blocks from one token folder. Do not hand-maintain them. (`pipelines.md`)

Set the attribute before first paint, from a small inline script in `<head>` that reads the stored choice. Without it the page flashes the wrong theme.

## Testing each theme

1. List the pairs: each text token on each surface token it may sit on, each boundary token on its surface, each icon and chart mark on its background.
2. Compute the ratio per theme and per state (default, hover, pressed, selected).
3. Fail below 4.5:1 for text, 3:1 for large text and 3:1 for boundaries and graphics. (WCAG 1.4.3, AA; 1.4.11, AA)
4. Run the check in CI on the built token output. (`pipelines.md`)
5. Walk the product once under `forced-colors: active` and once under `prefers-contrast: more`. Both are review checks: no build rule can judge them.
6. Check status views in grayscale in each theme. (WCAG 1.4.1, A)

## Page contract

A theming page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what a theme is: a set of semantic swaps chosen at runtime. Layer: token. (`taxonomy/layers.md`)
- Lead with one screen shown in light, dark and high contrast.

### 2. Tokens
- The list of themes and their dimensions: scheme, contrast, brand, density.
- For each theme, the semantic tokens it overrides and the values, side by side with the default.
- State tokens per theme (see table above).

### 3. Anatomy
- A theme: a name, a selector, a folder of overrides. Only semantic tokens appear in it.
- The selector chain: system preference, user attribute, forced-colors, contrast preference.
- The coverage matrix: rows are semantic tokens, columns are themes.

### 4. States
- Show the state matrix (default, hover, pressed, focus-visible, disabled, selected, error, success) once per theme. Mark each cell `designed`, `n/a` with a reason, or `missing`. (`states/interaction-states.md`)
- Show the focus ring on every surface of every theme. (WCAG 2.4.7, AA; 1.4.11, AA)

### 5. Usage
- When to add a theme: a real audience need (dark preference, brand, contrast, density). Not for one screen.
- When not to: to fix a one-off screen. Fix the token or the screen. (Tier rule, `architecture.md`)
- How: copy the semantic list, derive values from the ramps, run the contrast matrix, run the coverage check, walk forced-colors.
- Accessibility: contrast per theme, colour-alone per theme, forced-colors borders. (WCAG 1.4.3, AA; 1.4.11, AA; 1.4.1, A)

### 6. Pitfalls and don'ts
- Inverting light values gives ratios that nobody checked. (WCAG 1.4.3, AA)
- Reusing light shadows on dark leaves no visible elevation. (`foundations/elevation.md`)
- Overriding a primitive token per theme breaks every other theme that shares it.
- Removing borders because "the background shows the edge" fails in forced-colors. (WCAG 1.4.11, AA)
- `forced-color-adjust: none` on a whole page throws away the user's setting.
- A theme with missing tokens inherits values that may fail contrast.
- No pre-paint script gives a flash of the wrong theme.

## Why

- WCAG applies to every theme a user can select. Contrast is a property of a pair in one theme, so it must be tested per theme.
- Restricting overrides to semantic tokens keeps the cost of a new theme to one folder of overrides.
- `prefers-color-scheme`, `prefers-contrast` and `forced-colors` are user settings. Honouring them respects the person's choice.
- Material 3 documents state layers as opacity overlays. Treating a state as an overlay keeps it consistent across themes.

## Rulebook seeds

- `theme.semantic-only` · auto · HIGH · A theme file contains only semantic tokens.
- `theme.coverage` · auto · HIGH · Every theme defines every semantic token it is meant to override.
- `theme.contrast-matrix` · auto · HIGH · Each text and boundary pair meets its ratio in every theme. (1.4.3, AA; 1.4.11, AA)
- `theme.state-matrix` · review · MEDIUM · Every state token exists in every theme.
- `theme.color-scheme` · auto · MEDIUM · `color-scheme` is set for each scheme.
- `theme.forced-colors` · review · HIGH · Controls keep a visible border under `forced-colors: active`. (1.4.11, AA)
- `theme.prefers-contrast` · review · LOW · A `prefers-contrast: more` path exists.
- `theme.no-flash` · review · LOW · The stored theme is applied before first paint.
- `theme.no-theme-in-name` · auto · MEDIUM · No token name carries a theme name.

## Misfiles

- A per-component dark stylesheet is a failed theme. Move it to semantic overrides.
- A brand's logo swap is an asset, not a token.
- A density mode is a theme dimension, but its values are defined in `foundations/density.md`.
- Locale and text direction are not themes.

## See also

- [Token architecture](./architecture.md)
- [Token naming](./naming.md)
- [Pipelines](./pipelines.md)
- [Colour](../foundations/color.md)
- [Elevation](../foundations/elevation.md)
- [Density](../foundations/density.md)
- [Interaction states](../states/interaction-states.md)
- [WCAG map](../accessibility/wcag-map.md)
