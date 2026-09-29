---
name: tokens
description: Author, rename, deprecate or build design tokens (DTCG JSON), with tier and naming checks. Use when the user says "add a token", "rename this token", "deprecate a token", "build the tokens", "check the tokens", "token naming", "alias this value", "tokens are out of date", or "generate css variables from tokens".
---

# /bauhaus:tokens — author and build tokens

Tokens are named decisions in DTCG JSON. They are the only place a raw value may appear. Lead agent: `bauhaus:design-system-architect`. Value questions go to `bauhaus:ui-designer` (or `bauhaus:motion-designer` for durations and easing).

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/architecture.md` — tiers, aliasing, DTCG format.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/naming.md` — grammar and anti-patterns.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/pipelines.md` — outputs and design-tool sync.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/theming.md` — when the change touches a theme.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/<family>.md` — the family the token belongs to.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/versioning.md` — for rename and deprecation.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/page-contract.md` — the token group page.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/interaction-states.md` — state tokens (`hover`, `disabled`, `focus`).

## Modes

Ask with `AskUserQuestion` if unclear: add, rename, deprecate, build-and-check.

## Steps: add

1. **Read the config.** Get `tokens.source`, `tokens.outputs`, `prefix`. Missing: run `/bauhaus:init`.
2. **Classify.** Which tier?
   - Primitive: a raw step on a scale. Name has no intent.
   - Semantic: an intent that aliases a primitive. Call sites use it.
   - Component: one scoped decision for one primitive. Add only when a semantic token would be too broad.
3. **Check the family.** A new value inside an existing scale is a token. A new family or a new scale is a foundation change: stop, run `/bauhaus:foundation`.
4. **Name it** by the grammar in `naming.md`. Reject names that carry the value (`blue-dark`), the component (in the semantic tier), or the theme.
5. **Write it** in the right file with `$value`, `$type`, `$description`. Aliases use `{color.gray.600}`. Semantic tokens alias primitives, never literals.
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
- `check` validates types, dangling aliases, cycles and naming. It also fails (exit 1) when outputs drift from the source.
- On failure: read the message, fix the source, rebuild. Do not edit generated outputs by hand.

## State tokens

Interaction states (hover, active, disabled, selected, focus-visible) are semantic tokens, not raw values in a rule. Name them by the grammar (`color.action.primary.hover`). Every new colour token that a control uses needs its state siblings, or a written reason it has none. Each state pair passes `contrast.mjs`. The token group page lists the states it provides tokens for.

## Token group page

A token group has a page in the styleguide and in Storybook, to the page contract: 1 Introduction, 2 Tokens (defined, with values and intent), 3 Anatomy (structure of the group), 4 States (which states it provides tokens for), 5 Usage (when to use each token, when not and what to use instead), 6 Pitfalls and don'ts. Every Usage rule and Pitfall names a basis. For each line ask: "What is the basis?" and "Would this line be true of any design system?" No basis or generic: rewrite or cut. Route page writing to `/bauhaus:styleguide`.

## Tier checks (run on every change)

- No literal in the semantic tier.
- No call site references a primitive token.
- No alias chain deeper than two hops.
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
Tier:     <primitive|semantic|component> for each new token
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
