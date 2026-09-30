# 3. Colour is palette, colors and sibling themes of roles

- Status: accepted
- Date: 2026-09-30
- Evidence: `docs/research/tokens-vs-foundations.md`

## Context

Components need colours by purpose. Brands change hues. Themes change values. Carbon splits `@carbon/colors` from `@carbon/themes`; Primer splits base from functional tokens and says base tokens "should never be used directly in code".

## Decision

- `foundations/color/palette.tokens.json`: named hues with grades (scarlet, dark-blue, teal…). Primitive. Read only by `colors`.
- `foundations/color/colors.tokens.json`: role scales (primary, secondary, error, success, warning, info, neutral) aliasing the palette. The rebrand point.
- `themes/light` and `themes/dark`: sibling files of flat roles by purpose (`text.default`, `action.primary`, `surface.raised`…) aliasing `colors.*`. Every theme defines the same roles. Light is the default and renders as `:root`.
- Components read roles only.

## Options not chosen

- Components reading role scales (`primary.600`) directly: a dark theme would have to re-point every call site.
- Dark as a partial override: parity cannot be checked.

## Consequences

- `tokens.mjs check` errors on theme parity and warns when a role aliases the palette. `structure.mjs` flags `misfile.palette-at-call-site`.
- Every text and non-text pair is checked at AA in both themes.
