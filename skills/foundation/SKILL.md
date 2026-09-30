---
name: foundation
description: Add or evolve one foundation (colour, typography, spacing-layout, shape, elevation, motion, iconography, density) - propose first, then land the four artifacts. Use when the user says "add a foundation", "change the spacing scale", "define our colour palette", "add a type scale", "we need a motion scale", "evolve the elevation scale", or "add a z-index scale".
---

# /bauhaus:foundation — one foundation, four artifacts

A foundation is a family of values and its scale. The scale is a decision, not an edit. Propose first. Populate after the answer. Lead: `bauhaus:design-system-architect`. Owners: `bauhaus:ui-designer` for colour, typography, spacing-layout, shape, elevation, iconography, density. `bauhaus:motion-designer` for motion.

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/<family>.md` — the family in question. One of: `color`, `typography`, `spacing-layout`, `shape`, `elevation`, `motion`, `iconography`, `density`.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/layers.md`, `misfiles.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/architecture.md`, `naming.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/accessibility/wcag-map.md` — for any criterion you cite.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/interaction-states.md` — for colour and elevation state roles.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/page-contract.md` — the foundation page.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/references/systems.md` — optional, to show how other systems scale it.

## Steps

1. **Read the config.** Get `tokens.source`, `prefix`, `guide`, `storybook`, `rulebook`, `house`. Missing: suggest `/bauhaus:init`.
2. **Classify.** Confirm this is a foundation: a family and its scale. One new value inside an existing scale is a token of that foundation: route to `/bauhaus:tokens`.
3. **Take stock.** Read what exists: tokens, stylesheet literals, guide. For an existing codebase, run `node ${CLAUDE_PLUGIN_ROOT}/scripts/extract.mjs <dir> --out .bauhaus/extract` and read the family's cluster. Write a reconciliation table: current values, counts, files.
4. **Derive the proposal.** Dispatch the owner agent. It returns: the scale (steps and values), the rule behind it (grid, ratio, contrast target), the semantic tokens (colour: the roles), and what it costs (files to migrate, pixels that move).
5. **Propose before you populate.** Ask with `AskUserQuestion`: one focused question, 2-4 options. Typical options:
   - Adopt the derived scale, migrate incrementally.
   - Adopt a narrower scale (fewer steps).
   - Fix the naming only, keep the values.
   State the cost in files and steps. Do not write tokens before the answer.
5b. **Typography only: the typeface step.** Run it after step 5, before the guide in step 6.
   1. Load `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/typefaces.md` and `${CLAUDE_PLUGIN_ROOT}/kit/typefaces/catalog.json`. Typography runs typefaces, fonts, text styles, like colour runs palette, colors, roles. A design system built from scratch defines all six roles: sans, serif, display, mono, handwriting, slab. A project may leave one unused; say so and skip it.
   2. For each role, propose the catalog `essentialDefault` (inter, source-serif-4, fraunces, jetbrains-mono, caveat, bitter) plus two alternatives of the same role, chosen by the tone of the project (read `bestFor`, `avoidFor`, `pairsWith`). Put the recommended option first and say why.
   3. Ask with `AskUserQuestion`: one question per role, or one call of up to 4 questions. Wait for the answers.
   4. Write `typefaces.tokens.json` (one `typeface.<family-id>` token per chosen family: the exact Fontsource `font-family` name, then the family's own `fallback` stack from the catalog, which follows its classification (a serif display face falls back to serifs), ending in a generic family), `fonts.tokens.json` (`font.<role>` aliasing `{typeface.<id>}`) and the text styles in `typography.tokens.json` (`text.<style>.family` aliasing `{font.<role>}`). Only `typeface.*` is named after a family.
   5. Add the Fontsource packages from the catalog `package` field to `package.json` dependencies, and write `fonts.css` with one `@import '<package>/wght.css'` per family. Consumers opt in by importing it; the design system does not force-load six families.
   6. Run `tokens.mjs build` and `check`. `check` fails when a stack does not end in a generic family (`typography.fallback-generic`) and warns on a text style that aliases a typeface directly.
6. **Land the four artifacts in one pass.**
   1. **Tokens.** The foundation's decisions, stored as tokens in `<config.tokens.source>`: primitive tokens for the scale, semantic tokens for intents. Colour produces three things: `foundations/color/palette.tokens.json` (named hues with grades, primitive, never used by components), `foundations/color/colors.tokens.json` (primary, secondary, error, success, warning, info, neutral, 100 to 900, aliasing the palette: the rebrand point) and the roles in every theme (`themes/light`, the default, and `themes/dark`: `text.*`, `surface.*`, `border.*`, `action.*`, `status.*`, `focus.ring.*`, `disabled.*`, `state.*`, each aliasing `colors.*`). Every theme defines the same role names. In Carbon "colors" names the palette; here it names the role scales, defined once in `knowledge/foundations/color.md`. Then `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs build` and `check`. Keep old names as deprecated aliases until the last call site moves.
   For typography the tokens are three files, see the typeface step below.
   2. **Guide.** Write `foundations/<name>/<name>.mdx` (with `<Meta of={Stories}/>`) to the page contract. The full text of these sections goes here; the showcase carries the short Introduction, the Stage, Tokens and the state matrix:
      1. Introduction: what the family is, its job, plain words first.
      2. Tokens: the tokens it defines, value and intent (colour: palette, colors, roles per theme).
      3. Anatomy: the scale and its structure (steps, ratio, grid).
      4. States: the states it provides tokens for (hover, active, disabled, selected, focus-visible for colour and elevation).
      5. Usage: when to use each step, when not and what instead, and how (variants, composition, responsive, accessibility).
      6. Pitfalls and don'ts, each with why.
      Research stays in the agent and the knowledge base.
   3. **Showcase.** `Foundations/<Family>` in `<name>.stories.tsx`: one story renders `<DocPage/>` with Tokens (swatches), Anatomy, the state matrix and a compact Do / Don't. Show a live specimen, not only a table: colour swatches with contrast ratios, a type ramp, a spacing ruler, real shadows, a motion demo. Each token appears once. One state-matrix cell per state provided.
   4. **Rulebook.** Rules for the family with ids, verify modes and severities. Seed from the "Rulebook seeds" section of the knowledge file. Example: `auto` rule "no raw colour outside the token source".
7. **Slop check.** For each Usage rule and Pitfall ask: "What is the basis?" (WCAG number and level, APG, Nielsen heuristic by name, published system, research result) and "Would this line be true of any design system?" No basis or generic: rewrite or cut.
8. **Contrast.** Colour: run `node ${CLAUDE_PLUGIN_ROOT}/scripts/contrast.mjs <fg> <bg>` for every text and control pair. Compare with `house.contrast`. Motion: check the longest duration against `house.maxDurationMs`.
9. **Migrate a first call site** so the foundation has a user. Record the rest as a ratchet: raw values may not rise, and must be lowered when they drop.
10. **Verify.**
   - `tokens.mjs check` exits 0.
   - The guide, the showcase and the rules all name the same tokens.
   - Grep shows no raw value of this family in patterns.
   - The family has no token that no page documents.
   - The two pages carry six sections in order and every Usage and Pitfall line has a basis.
   - State roles exist, in every theme, for every state the page lists.
   - Colour: `tokens.mjs check` shows theme parity and no palette-direct warning.

## Recommend, do not do

- Retiring old names before the last call site moves.
- Adding a dependency.
- Deleting a value someone asked for. Say what it depicts and let the user decide.

## Writes

- `<config.tokens.source>/*.tokens.json` and generated outputs
- `<config.guide>` §Foundations
- `<config.storybook.stories>` page `Foundations/<Family>`
- `<config.rulebook.rules>` and, for known gaps, `<config.rulebook.advisories>`

## Output format

```
Foundation — <family> (<add | evolve>)
Decision: <option chosen> (asked)
Scale:    <n steps, rule>
Tokens:   <n primitive token · n semantic> (colour: palette · colors · roles per theme) · build pass · check pass
Artifacts: tokens ✓ · styleguide ✓ · storybook ✓ · rulebook ✓ (<n rules>)
Migrated: <first call site> · Ratchet: <count> raw values remain
Next:     <one step>
```

## Rules

- Never populate before the user answers.
- A foundation is not done until all four artifacts ship together.
- A foundation holds scales, not one-off values.

## Record the decisions

Every answer given at a gate in this skill becomes an ADR in the project's ADR folder (`docs/adr/` if none), in the same change. Format: `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/decisions.md`.
