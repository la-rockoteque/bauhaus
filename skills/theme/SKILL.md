---
name: theme
description: Add a sibling theme (dark, brand, high contrast) as a full set of role values, with a contrast check on every pair and a parity check. Use when the user says "add dark mode", "dark theme", "add a brand theme", "high contrast theme", "compact density theme", "white-label", or "theme the design system".
---

# /bauhaus:theme — add a theme

A theme is a full set of role values, chosen at runtime. Themes are siblings (`themes/light`, the default, and `themes/dark`): every theme defines the same role names and only the values change. The palette and the colors never change per theme. Lead: `bauhaus:design-system-architect`. Values: `bauhaus:ui-designer`. Motion under reduced motion: `bauhaus:motion-designer`.

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/theming.md` — what changes per theme.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/architecture.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/color.md` — palette, colors, roles, contrast.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/elevation.md` — shadows in dark.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/density.md` — for a density theme.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/accessibility/wcag-map.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/interaction-states.md` — every state role must exist in every theme.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tooling/design-tool-sync.md` — if Figma variables are in use.

## Kinds

| Kind | What its values change | What stays |
|---|---|---|
| Dark | Every role, with other `colors` grades; shadows (re-derived); border strength | Role names, palette, colors, spacing, type scale, radius, motion |
| Brand | A rebrand edits `colors.tokens.json`. A brand theme, if wanted, is a sibling that re-picks grades for every role | Role names, palette, layout, state logic, contrast targets |
| High contrast | Every role, stronger borders and focus ring | Role names, layout, scale |
| Density | Not a colour theme. Spacing and size values live in `foundations/density.md` | Colour |

## Steps

1. **Read the config.** Get `tokens.source`, `tokens.themes`, `tokens.defaultTheme`, `tokens.outputs`, `house.contrast`, `house.targetSize`. Missing: suggest `/bauhaus:init`.
2. **Classify.** A theme holds roles only. A change to a palette value, to `colors` or a new scale is a foundation change: route to `/bauhaus:foundation`. A partial theme, or one that rewrites palette values, is `misfile.theme-not-sibling`.
3. **Inventory the roles.** List every role of `themes/light` (`text.*`, `surface.*`, `border.*`, `action.*`, `status.*`, `focus.ring.*`, `disabled.*`, `state.*`) and its value. The new theme defines all of them: no role is inherited. Include state roles: hover, active, disabled, focus, selected, error, success.
4. **Propose before you populate.** Dispatch `bauhaus:ui-designer` for a draft. Show it with `AskUserQuestion` (2-4 options: the surface ladder, which `colors` grades carry text, the accent grade). Populate after the answer.
5. **Write the theme.** Create the theme folder (`themes/<name>/<name>.tokens.json`) and register it in `config.tokens.themes`. Set `config.tokens.defaultTheme` to `light` so themes are siblings. Define every role by aliasing a `colors.*` grade. Add a new grade only when the scale lacks a step. That addition is a foundation change: follow `/bauhaus:tokens`.
6. **Dark: rebuild shadows and surfaces.** Shadows alone do not show depth on dark surfaces. Raise the surface lightness by elevation step, and lighten or thin the shadow. State the rule in `elevation.md` terms. Avoid pure black surfaces with pure white text where glare is a concern.
7. **Contrast check every pair.** Build a `pairs.json` of foreground/background pairs (text on each surface, muted text, placeholder, borders of controls, focus ring, icons, every state). Run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/contrast.mjs --tokens <themeDir> --pairs pairs.json
   ```
   For a single pair: `node ${CLAUDE_PLUGIN_ROOT}/scripts/contrast.mjs <fg> <bg>`.
   Targets: text `WCAG 1.4.3 (AA)` 4.5:1, or 7:1 for AAA when `house.contrast` is AAA. Large text 3:1. UI components and focus indicators `WCAG 1.4.11 (AA)` 3:1. Any fail is a finding. Fix the override, not the threshold.
8. **State roles per theme.** For every interaction state (hover, pressed, focus-visible, disabled, selected, error), check that the theme defines its roles (`${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/naming.md` § State roles). Re-run the state matrix contrast per theme: the same pairs, in each theme (`${CLAUDE_PLUGIN_ROOT}/knowledge/states/state-matrix.md`). A state that passes in light can fail in dark.
9. **Density mode.** Check the smallest target against `house.targetSize` (`WCAG 2.5.8 (AA)` at 24 px, `2.5.5 (AAA)` at 44 px). Do not shrink hit areas below it.
10. **Build and check.**
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs build
   node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check
   ```
   `check` asserts theme parity (the same role names in every theme) and warns when a component reads `palette.*` or `colors.*` directly. A parity failure is a defect: add the missing role to the theme.
11. **Wire the switch.** Say how the theme is selected in this stack: a `data-theme` attribute, a class, `prefers-color-scheme`, or the framework's provider. Respect the user's system preference as the default. Persist an explicit choice.
12. **Four artifacts.** Tokens (the roles of the theme). Styleguide: a Themes section with the role table per theme, the contrast table and the selection rule. Storybook: a theme switcher in the toolbar and a page showing each foundation per theme. Rulebook: rules such as `theme.<name>.contrast` (`auto`, HIGH) and `theme.<name>.parity` (`auto`, HIGH).
13. **Slop check.** Each Usage and Pitfall line in the Themes page needs a basis and must not fit any DS unchanged.
14. **Verify visually.** Walk the components and patterns in the theme, states included (`/bauhaus:states` matrices). Dispatch `bauhaus:ui-designer` for the walk.

## Writes

- `<config.tokens.themes[name]>/*.tokens.json`, `bauhaus.config.json` (themes map)
- Generated theme outputs
- `<config.guide>` Themes section, Storybook theme addon config and page, rulebook rules

## Output format

```
Theme — <name> (<kind>)
Roles: <n defined> of <n in light> · parity: pass | fail
Contrast:  <pairs checked> · pass <a> · fail <b>  (target <AA|AAA>)
Build:     pass | fail · Check: pass | fail
Switch:    <mechanism> · default: <system pref | light>
Artifacts: tokens ✓ · styleguide ✓ · storybook ✓ · rulebook ✓
Open:      <failing pairs, states without override>
```

## Rules

- A theme defines every role. Never leave a role to inherit, and never rewrite a palette or colors value per theme.
- Never ship a theme with a failing pair unless it is a written advisory.
- Never hand-edit generated outputs.

## Record the decisions

Every answer given at a gate in this skill becomes an ADR in the project's ADR folder (`docs/adr/` if none), in the same change. Format: `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/decisions.md`.
