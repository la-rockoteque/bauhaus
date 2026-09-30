---
id: tokens/theming
title: Theming
shelf: tokens
layer: foundation
owner: ui-designer
tags: [theme, dark-mode, high-contrast, forced-colors, prefers-contrast, density, state-roles, sibling-themes, parity]
sources:
  - WCAG 2.2 1.4.3 Contrast Minimum (AA), 1.4.11 Non-text Contrast (AA), 1.4.1 Use of Color (A), 2.4.7 Focus Visible (AA) — https://www.w3.org/TR/WCAG22/
  - CSS Color Adjustment Module Level 1 (color-scheme, forced-color-adjust) — https://www.w3.org/TR/css-color-adjust-1/
  - Media Queries Level 5 (prefers-color-scheme, prefers-contrast, forced-colors) — https://www.w3.org/TR/mediaqueries-5/
  - Material 3 state layers — see references/systems.md
  - Carbon, Color overview — https://carbondesignsystem.com/elements/color/overview/ ("Color token names and roles are the same across themes, only the assigned value will change"; four sibling themes)
  - Atlassian, Design tokens — https://atlassian.design/foundations/design-tokens/ ("Each color design token maps to a different value for each theme")
  - Primer, Primitives — https://primer.style/product/primitives/ (sibling theme files: light, dark, dark_dimmed, light_high_contrast)
  - DTCG Resolver Module 2025.10 — https://www.designtokens.org/tr/2025.10/resolver/ ("a method to work with design tokens in multiple contexts (such as 'light mode' and 'dark mode' color themes)")
---

# Theming

> A theme is a full set of answers to the same questions. Light and dark are sibling themes. Each answers "what colour is muted text?" and "what colour is a raised surface?" with its own value. Every theme asks the same questions, so no theme has a gap. The palette never changes. Screens never change. That is why one screen can wear any theme, and why each theme must be tested on its own.

## Rules

1. A theme is a full set of role values, one file per theme, siblings under `themes/` (`themes/light`, `themes/dark`). Every theme defines the same role names. Only the values change. The palette and the colors never change per theme. Call sites never name a theme. (Carbon: "Color token names and roles are the same across themes, only the assigned value will change". `architecture.md`; `UBIQUITOUS-LANGUAGE.md` § Theme) (`architecture.md`; `UBIQUITOUS-LANGUAGE.md` § Theme)
2. Keep `light` as the default theme. It also renders as `:root`. Add `dark` beside it, not as an override of it. A third theme (high contrast, brand) is a third sibling that defines every role. Density is not a colour theme: its values live in `foundations/density.md`. (Carbon, Atlassian and Primer ship siblings; Material 3 uses a context override, which Bauhaus does not follow.)
3. Do not write a theme as a partial override of another theme. A theme that lists only the roles that differ, or that rewrites palette values, is `misfile.theme-not-sibling`. (Primer's "overrides" mode exists; Bauhaus does not use it, because it hides gaps.)
4. A theme must define every role. A theme with a gap has an undefined colour or a value that may fail contrast. `scripts/tokens.mjs check` asserts theme parity: the same role names in every theme. (WCAG 1.4.3, AA)
5. Re-derive dark roles from the `colors` scales. Do not invert the light theme. Pick other grades (`colors.neutral.100` where light used `colors.neutral.900`); never edit palette values. (Primer inverts a neutral scale to share functional tokens; Bauhaus keeps the scale fixed and swaps the grade.) (`foundations/color.md`)
6. Test every theme for contrast. Run the pair matrix (each text role on each surface role, each control boundary on its surface) once per theme. `disabled.*` and `border.default` (a decorative divider) are outside the matrix. Fail the build below 4.5:1 for text (3:1 for large text) and below 3:1 for boundaries and meaningful graphics. (WCAG 1.4.3 Contrast Minimum, AA; WCAG 1.4.11 Non-text Contrast, AA)
7. Test every theme for colour-alone status. (WCAG 1.4.1 Use of Color, A)
8. In dark themes, show elevation by tone: a raised surface is lighter than the canvas. Re-derive shadows. Do not reuse the light values. (`foundations/elevation.md`)
9. Set `color-scheme` so the browser draws scrollbars, form controls and default backgrounds to match: `color-scheme: light dark` at `:root` when both are supported. (CSS Color Adjustment Level 1)
10. Honour the system preference by default and let the user override it. Use three choices: system, light, dark. Store the choice and apply it before first paint to avoid a flash of the wrong theme. (`prefers-color-scheme`, Media Queries Level 5)
11. Offer a high-contrast path. Support `@media (prefers-contrast: more)` with stronger borders, stronger text and no translucent overlays as text backgrounds. (`prefers-contrast`, Media Queries Level 5; WCAG 1.4.6 Contrast Enhanced, AAA, as the target.)
12. Support forced-colors mode. Under `@media (forced-colors: active)` the browser replaces author colours with a system palette. Do not fight it. Use system colour keywords (`CanvasText`, `Canvas`, `LinkText`, `ButtonText`, `Highlight`, `GrayText`) where you must set colour. Keep a real border on every control, since shadows and background colours are removed. Do not use `forced-color-adjust: none` except on content that needs its own colours, such as a colour swatch. (Media Queries Level 5; WCAG 1.4.11, AA)
13. A brand change edits `colors.tokens.json`: which hue plays primary. A brand theme, if you ship one, is a sibling that defines every role. Neither changes status semantics: danger stays danger. A brand theme must pass the same contrast matrix. (WCAG 1.4.3, AA; 1.4.1, A)
14. A density mode changes size and space tokens only. It does not change colour. (`foundations/density.md`)
15. Do not put theme names in token names. Do not duplicate a component's CSS per theme. (`naming.md`)
16. Keep the theme switch in one place: an attribute on `:root` or on a container. Do not scatter class names per component. (One switch point.)

## State roles per theme

Interaction and status states are roles. Each theme defines them like any other role. (`foundations/color.md` § State roles)

| State role | Changes per theme? | What changes | Basis |
|---|---|---|---|
| State layers (`state.hover-layer`, `state.pressed-layer`, `state.selected`) | Yes | Opaque tints (a DTCG alias cannot carry an alpha). Each theme picks its own `colors` grade, so the tint lightens on dark and darkens on light. | Material 3 state layers |
| Focus ring (`focus.ring.color`) | Yes | Re-derive so the ring reaches 3:1 against adjacent colours in each theme. A two-tone ring works on any surface. | WCAG 1.4.11 (AA); 2.4.7 (AA) |
| Disabled text, surface, border (`disabled.*`) | Yes | Re-derive from the theme's own `colors` grades. Disabled is exempt from contrast pairs (WCAG exempts inactive components), but it must stay distinguishable from enabled. | WCAG 1.4.3 (AA) exception |
| Selected tint | Yes | Tint lightness inverts direction. Keep the non-colour cue (check mark, indicator bar). | WCAG 1.4.1 (A) |
| Error, success, warning families | Yes | Lower chroma on dark. Re-test each pair. The icon and text pairing stays. | WCAG 1.4.1 (A); 1.4.3 (AA) |
| Scrim | Yes | A darker or lighter wash. One value per theme. | `foundations/elevation.md` |
| Shadow | Yes | Re-derived or replaced by surface lightness. | `foundations/elevation.md` |
| Forced-colors mapping | Fixed | System keywords. States use `Highlight` and `GrayText` where colour must be set. | Media Queries Level 5 |

Every state row must exist in every theme (parity). A missing cell is a finding. (`states/interaction-states.md`)

## CSS implementation

Use custom properties on `:root`. Use an attribute to force a theme. Use the media query as the default when the user has not chosen:

```css
:root {
  color-scheme: light;
  --ds-surface-default: #ffffff;
  --ds-text-default: #213547;
  --ds-focus-ring-color: #244b7b;
}

/* System preference, unless the user chose light. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
    --ds-surface-default: #14202e;
    --ds-text-default: #e6edf5;
    --ds-focus-ring-color: #9dc1f0;
  }
}

/* User choice wins. */
:root[data-theme='dark'] {
  color-scheme: dark;
  --ds-surface-default: #14202e;
  --ds-text-default: #e6edf5;
  --ds-focus-ring-color: #9dc1f0;
}

@media (prefers-contrast: more) {
  :root { --ds-border-default: var(--ds-border-strong); }
}

@media (forced-colors: active) {
  .ds-card, .ds-input { border: 1px solid CanvasText; }
}
```

The hex values are placeholders that show the shape. Derive yours from your `colors` scales and run the contrast matrix.

The dark block appears twice. That duplication is the cost of "system default with user override" in plain CSS. Generate both blocks from `themes/light` and `themes/dark`. The build emits `:root` from the default theme and one `[data-theme="<name>"]` block per theme. Do not hand-maintain them. (`pipelines.md`)

Set the attribute before first paint, from a small inline script in `<head>` that reads the stored choice. Without it the page flashes the wrong theme.

## Testing each theme

1. List the pairs: each text role on each surface role it may sit on, each boundary role on its surface, each icon and chart mark on its background.
2. Compute the ratio per theme and per state (default, hover, pressed, selected).
3. Fail below 4.5:1 for text, 3:1 for large text and 3:1 for boundaries and graphics. (WCAG 1.4.3, AA; 1.4.11, AA)
4. Run the check in CI on the built token output. (`pipelines.md`)
5. Walk the product once under `forced-colors: active` and once under `prefers-contrast: more`. Both are review checks: no build rule can judge them.
6. Check status views in grayscale in each theme. (WCAG 1.4.1, A)

## Page contract

A theming page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what a theme is: a full set of role values chosen at runtime, sibling to the other themes. Not a layer and not a foundation. (`taxonomy/layers.md`)
- Lead with one screen shown in light, dark and high contrast.

### 2. Anatomy
- A theme: a name, a selector, a folder (`themes/<name>/`) with one tokens file. Only roles appear in it, all of them.
- The selector chain: system preference, user attribute, forced-colors, contrast preference.
- The parity matrix: rows are role names, columns are themes. Every cell is filled.

### 3. Tokens
- The list of themes and their dimensions: scheme, contrast, brand, density.
- For each theme, every role and its value, side by side.
- State roles per theme (see table above).

### 4. States
- Show the state matrix (default, hover, pressed, focus-visible, disabled, selected, error, success) once per theme. Mark each cell `designed`, `n/a` with a reason, or `missing`. (`states/interaction-states.md`)
- Show the focus ring on every surface of every theme. (WCAG 2.4.7, AA; 1.4.11, AA)

### 5. Usage
- When to add a theme: a real audience need (dark preference, brand, contrast, density). Not for one screen.
- When not to: to fix a one-off screen. Fix the role or the screen. (`architecture.md`)
- How: copy the role list from `light`, derive values from the `colors` scales, run the contrast matrix, run `tokens.mjs check` for parity, walk forced-colors.
- Accessibility: contrast per theme, colour-alone per theme, forced-colors borders. (WCAG 1.4.3, AA; 1.4.11, AA; 1.4.1, A)

### 6. Pitfalls and don'ts
- Inverting light values gives ratios that nobody checked. (WCAG 1.4.3, AA)
- Reusing light shadows on dark leaves no visible elevation. (`foundations/elevation.md`)
- Rewriting a palette value per theme breaks every other theme that shares it. (`misfile.theme-not-sibling`)
- Removing borders because "the background shows the edge" fails in forced-colors. (WCAG 1.4.11, AA)
- `forced-color-adjust: none` on a whole page throws away the user's setting.
- A theme with missing roles has no colour there, or one that may fail contrast.
- No pre-paint script gives a flash of the wrong theme.

## Why

- WCAG applies to every theme a user can select. Contrast is a property of a pair in one theme, so it must be tested per theme.
- Sibling themes with the same role names keep the cost of a new theme to one folder, and let a check prove parity.
- Carbon, Atlassian and Primer ship light and dark as siblings. Nothing they publish shows a theme changing palette values.
- DTCG 2025.10 has a Resolver module for multiple contexts (light and dark colour themes). Use it where a tool supports it; the sibling files stay the source. Do not encode tier meaning in DTCG groups, since the format says tools should not infer purpose from groups.
- `prefers-color-scheme`, `prefers-contrast` and `forced-colors` are user settings. Honouring them respects the person's choice.
- Material 3 documents state layers as overlays at a fixed opacity. Bauhaus keeps one state role per state and stores it as an opaque tint per theme, so it stays consistent across themes.

## Rulebook seeds

- `theme.semantic-only` · auto · HIGH · A theme file contains only roles, and no palette or colors value.
- `theme.coverage` · auto · HIGH · Every theme defines the same role names (parity).
- `theme.contrast-matrix` · auto · HIGH · Each text and boundary pair meets its ratio in every theme. (1.4.3, AA; 1.4.11, AA)
- `theme.state-matrix` · review · MEDIUM · Every state role exists in every theme.
- `theme.color-scheme` · auto · MEDIUM · `color-scheme` is set for each scheme.
- `theme.forced-colors` · review · HIGH · Controls keep a visible border under `forced-colors: active`. (1.4.11, AA)
- `theme.prefers-contrast` · review · LOW · A `prefers-contrast: more` path exists.
- `theme.no-flash` · review · LOW · The stored theme is applied before first paint.
- `theme.no-theme-in-name` · auto · MEDIUM · No token name carries a theme name.

## Misfiles

- A per-component dark stylesheet is a failed theme. Move it to roles in `themes/dark`.
- A dark file that lists only some roles, or rewrites palette values: `misfile.theme-not-sibling`.
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
