---
name: theme
description: Add a theme (dark, brand, high contrast, density) as semantic-token overrides, with a contrast check on every pair. Use when the user says "add dark mode", "dark theme", "add a brand theme", "high contrast theme", "compact density theme", "white-label", or "theme the design system".
---

# /bauhaus:theme — add a theme

A theme is a set of semantic-token overrides chosen at runtime. Primitives never change per theme. Lead: `bauhaus:design-system-architect`. Values: `bauhaus:ui-designer`. Motion under reduced motion: `bauhaus:motion-designer`.

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/theming.md` — what changes per theme.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/architecture.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/color.md` — contrast, palette.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/elevation.md` — shadows in dark.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/density.md` — for a density theme.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/accessibility/wcag-map.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/interaction-states.md` — every state token needs an override.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tooling/design-tool-sync.md` — if Figma variables are in use.

## Kinds

| Kind | What overrides | What stays |
|---|---|---|
| Dark | Colour semantics, shadows (re-derived), border strength | Spacing, type scale, radius, motion |
| Brand | Action and accent colours, maybe typeface | Layout, state logic, contrast targets |
| High contrast | Colour semantics, border widths, focus ring | Layout, scale |
| Density | Spacing and size semantics, target size | Colour |

## Steps

1. **Read the config.** Get `tokens.source`, `tokens.themes`, `tokens.outputs`, `house.contrast`, `house.targetSize`. Missing: suggest `/bauhaus:init`.
2. **Classify.** A theme touches semantic tokens only. A change to a primitive token or a new scale is a foundation change: route to `/bauhaus:foundation`.
3. **Inventory the semantic tier.** List every semantic token and its default value. Each must be overridden, or the default must be proven fine. Include state tokens: hover, active, disabled, focus, selected, error, success.
4. **Propose before you populate.** Dispatch `bauhaus:ui-designer` for a draft. Show it with `AskUserQuestion` (2-4 options: the palette direction, the surface ladder, the accent). Populate after the answer.
5. **Write the overrides.** Create the theme folder and register it in `config.tokens.themes` (`"dark": "design/tokens/themes/dark"`). Override by aliasing a different primitive. Add a new primitive only when the scale lacks a step. That addition is a token change: follow `/bauhaus:tokens`.
6. **Dark: rebuild shadows and surfaces.** Shadows alone do not show depth on dark surfaces. Raise the surface lightness by elevation step, and lighten or thin the shadow. State the rule in `elevation.md` terms. Avoid pure black surfaces with pure white text where glare is a concern.
7. **Contrast check every pair.** Build a `pairs.json` of foreground/background pairs (text on each surface, muted text, placeholder, borders of controls, focus ring, icons, every state). Run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/contrast.mjs --tokens <themeDir> --pairs pairs.json
   ```
   For a single pair: `node ${CLAUDE_PLUGIN_ROOT}/scripts/contrast.mjs <fg> <bg>`.
   Targets: text `WCAG 1.4.3 (AA)` 4.5:1, or 7:1 for AAA when `house.contrast` is AAA. Large text 3:1. UI components and focus indicators `WCAG 1.4.11 (AA)` 3:1. Any fail is a finding. Fix the override, not the threshold.
8. **State tokens per theme.** For every interaction state (hover, pressed, focus-visible, disabled, selected, error), check that the theme defines its tokens (`${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/naming.md` § State tokens). Re-run the state matrix contrast per theme: the same pairs, in each theme (`${CLAUDE_PLUGIN_ROOT}/knowledge/states/state-matrix.md`). A state that passes in light can fail in dark.
9. **Density theme.** Check the smallest target against `house.targetSize` (`WCAG 2.5.8 (AA)` at 24 px, `2.5.5 (AAA)` at 44 px). Do not shrink hit areas below it.
10. **Build and check.**
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs build
   node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check
   ```
11. **Wire the switch.** Say how the theme is selected in this stack: a `data-theme` attribute, a class, `prefers-color-scheme`, or the framework's provider. Respect the user's system preference as the default. Persist an explicit choice.
12. **Four artifacts.** Tokens (the overrides). Styleguide: a Themes section with the override table, the contrast table and the selection rule. Storybook: a theme switcher in the toolbar and a page showing each foundation per theme. Rulebook: rules such as `theme.<name>.contrast` (`auto`, HIGH) and `theme.<name>.no-primitive-override` (`auto`).
13. **Slop check.** Each Usage and Pitfall line in the Themes page needs a basis and must not fit any DS unchanged.
14. **Verify visually.** Walk the primitives and patterns in the theme, states included (`/bauhaus:states` matrices). Dispatch `bauhaus:ui-designer` for the walk.

## Writes

- `<config.tokens.themes[name]>/*.tokens.json`, `bauhaus.config.json` (themes map)
- Generated theme outputs
- `<config.guide>` Themes section, Storybook theme addon config and page, rulebook rules

## Output format

```
Theme — <name> (<kind>)
Overrides: <n semantic tokens> · new primitives: <n>
Contrast:  <pairs checked> · pass <a> · fail <b>  (target <AA|AAA>)
Build:     pass | fail · Check: pass | fail
Switch:    <mechanism> · default: <system pref | light>
Artifacts: tokens ✓ · styleguide ✓ · storybook ✓ · rulebook ✓
Open:      <failing pairs, states without override>
```

## Rules

- Override semantic tokens only. Never override a primitive token per theme.
- Never ship a theme with a failing pair unless it is a written advisory.
- Never hand-edit generated outputs.
