---
name: tokens
description: Author, rename, deprecate or build design tokens (DTCG JSON: the storage of foundation decisions, including palette, colors and theme roles), with tier and naming checks. Use when the user says "add a token", "rename this token", "deprecate a token", "build the tokens", "check the tokens", "token naming", "alias this value", "tokens are out of date", or "generate css variables from tokens".
---

# /bauhaus:tokens — author and build tokens

Tokens are the DTCG storage and delivery of foundation (and component) decisions. They are not a layer. They are the only place a raw value may appear. Lead agent: `bauhaus:design-system-architect`. Value questions go to `bauhaus:ui-designer` (or `bauhaus:motion-designer` for durations and easing).

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/architecture.md` — tiers, aliasing, DTCG format.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/naming.md` — grammar and anti-patterns.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/pipelines.md` — outputs and design-tool sync.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/theming.md` — when the change touches a theme.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/<family>.md` — the family the token belongs to.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/versioning.md` — for rename and deprecation.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/page-contract.md` — the token group page.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/interaction-states.md` — state roles (`hover`, `disabled`, `focus`).

## Modes

Ask with `AskUserQuestion` if unclear: add, rename, deprecate, build-and-check.

## Steps: add

1. **Read the config.** Get `tokens.source`, `tokens.outputs`, `prefix`. Missing: run `/bauhaus:init`.
2. **Classify.** Which tier?
   - Primitive token: a raw step on a scale. Name has no intent. Colour: `palette.<hue>.<grade>`, and the `colors.<role>.<grade>` aliases of it.
   - Semantic: an intent that aliases a primitive token. Call sites use it. Colour: a role in every theme (`text.muted`, `action.primary`).
   - Component: one scoped decision for one component. Add only when a semantic token would be too broad.
3. **Check the family.** A new value inside an existing scale is a token. A new family or a new scale is a foundation change: stop, run `/bauhaus:foundation`.
4. **Name it** by the grammar in `naming.md`. Reject names that carry the value (`blue-dark`), the component (in the semantic tier), or the theme.
5. **Write it** in the right file with `$value`, `$type`, `$description`. Aliases use `{palette.gray.600}` or `{colors.neutral.600}`. Semantic tokens alias primitive tokens, never literals. A new role goes into every theme, with the same name.
6. **Contrast.** For a colour pair, run `node ${CLAUDE_PLUGIN_ROOT}/scripts/contrast.mjs <fg> <bg>`. Report the ratio and the AA/AAA verdict against `house.contrast`.
7. Go to **Build and check**.

## Steps: rename

1. Find every use: token files, aliases, outputs, stylesheet, components, stories, styleguide, rulebook.
2. Add the new name. Keep the old name as an alias with `$deprecated` and a `$description` naming the new token and the removal version.
3. Migrate call sites in small batches. Grep for the old variable form (`--<prefix>-...`) and the JS name.
4. Remove the old token only when the use count is zero. Follow `versioning.md`.

## Steps: deprecate

1. Mark `$deprecated: true` and say what replaces it in `$description`.
2. List remaining uses. Write a migration line per batch.
3. Set a ratchet: the count of uses may not rise, and must be lowered when it drops.

## Build and check

Run in order:

```
node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs build [--config bauhaus.config.json]
node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check [--config bauhaus.config.json]
```

- `build` writes every output in `config.tokens.outputs` (css, scss, js, ts, json, tailwind), with themes.
- `check` validates types, dangling aliases, cycles and naming. It asserts theme parity (the same role names in every theme) and warns when a component reads `palette.*` or `colors.*` directly. Two typography checks: `typography.fallback-generic` (error) fails when a font stack does not end in a CSS generic family (serif, sans-serif, monospace, cursive, system-ui and the rest); naming warnings fire when a text style aliases `typeface.*` directly (alias `font.<role>`), when a `font.*` role holds a raw stack, and when a family name appears in a `font.*` or text style token name (`font.inter`; name the role). Family names are correct in `typeface.*` only. `structure.mjs check` adds `misfile.typeface-at-call-site` for a component that reads `typeface.*` or `font.<role>`. It also fails (exit 1) when outputs drift from the source.
- On failure: read the message, fix the source, rebuild. Do not edit generated outputs by hand.

## State roles

Interaction states (hover, active, disabled, selected, focus-visible) are roles, not raw values in a rule. Use the two families in `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/naming.md` § State roles: layers and shared colours (`state.hover-layer`, `state.pressed-layer`, `state.selected`, `disabled.{text,surface,border}`), and per-action colours (`action.<name>-<state>`, for example `action.primary-hover`). Focus is `focus.ring.color`, `focus.ring.width`, `focus.ring.offset`. Every new role that a control uses needs its state siblings, or a written reason it has none, and it exists in every theme. Each state pair passes `contrast.mjs`. The token group page lists the states it provides tokens for.

## Token group page

A token group has a page in the styleguide and in Storybook, to the page contract: 1 Introduction, 2 Tokens (defined, with values and intent), 3 Anatomy (structure of the group), 4 States (which states it provides tokens for), 5 Usage (when to use each token, when not and what to use instead), 6 Pitfalls and don'ts. Every Usage rule and Pitfall names a basis. For each line ask: "What is the basis?" and "Would this line be true of any design system?" No basis or generic: rewrite or cut. Route page writing to `/bauhaus:styleguide`.

## Tier checks (run on every change)

- No literal in the semantic tier.
- No call site references a primitive token. For colour: no component or pattern reads `palette.*` or `colors.*`. For type: no component reads `typeface.*` or `font.<role>`, only text styles.
- Every font stack ends in a generic family.
- Every theme defines the same role names.
- No alias chain deeper than three hops.
- Every semantic token has a `$description` that states intent.
- Names follow the grammar. No synonyms for existing tokens.

## Writes

- `<config.tokens.source>/*.tokens.json`
- Generated outputs from `tokens.mjs build`
- Styleguide token table in `<config.guide>` (resync with `/bauhaus:styleguide` when tokens change)

## Output format

```
Tokens — <mode>
Changed:  <n added · n renamed · n deprecated>
Tier:     <primitive token|semantic|component> for each new token, with its foundation
Contrast: <pair> <ratio> <AA|AAA verdict>   (colour only)
Build:    pass | fail
Check:    pass | fail (<message>)
Left over: <old-name uses remaining>
Next:     <one step>
```

## Rules

- A value appears once in the token source. Everywhere else it is a reference.
- A token that needs a new scale is a foundation change. Stop and route.
- Never hand-edit generated outputs.
