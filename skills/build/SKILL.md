---
name: build
description: Build a design system from scratch, layer by layer, in strict order. Use when the user says "build a design system", "create a DSM from scratch", "start a design system", "greenfield design system", "new design system for this product", or has no tokens, components or styleguide yet.
---

# /bauhaus:build — a design system from scratch

Builds the system in six stages. The order is fixed. Each stage ends at a checkpoint. Lead agent: `bauhaus:design-system-architect`.

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/bauhaus/principles.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/layers.md`, `decision-tree.md`, `misfiles.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/<family>.md` for each foundation, when you reach it
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/architecture.md`, `naming.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/components/api-design.md`, `anatomy-and-states.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/contribution.md`, `rulebook.md`, `page-contract.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/model.md`, `state-matrix.md`
- Optional seed: `${CLAUDE_PLUGIN_ROOT}/kit/styleguide/design-system.md`. It is an upstream port pending pruning. The contract is `knowledge/governance/contribution.md` (three gates for a new component) and `knowledge/governance/page-contract.md`.

## Hard rules

1. **Order.** Principles, foundations, their tokens, components, patterns, docs. Do not start a stage before the checkpoint of the previous one.
2. **Classify first.** Before you create any artifact, run the decision tree. Name its layer.
3. **Refuse misfiles.** Do not put a raw value in a pattern. Do not put a flow in a component. Cite the id from `misfiles.md` and send the work to the right layer.
4. **Propose before you populate.** A foundation is a decision. Put it to the user with `AskUserQuestion`: one focused question, 2-4 options, cost stated. Populate only after the answer.
5. **Four artifacts.** A foundation or component is done when tokens, guide, showcase and rulebook entries ship together.
6. **State matrix.** A component or pattern is not done without its matrix (`/bauhaus:states`). Each of the four artifacts carries the states: state roles, the States grid in the showcase, the reasoning in the guide, rules `<component>.state.<state>`.
7. **Page contract.** Every slice carries six sections in order across showcase and guide: Introduction, Anatomy, Tokens, States, Usage, Pitfalls and don'ts. Every Usage rule and Pitfall names a basis (`knowledge/governance/page-contract.md`).
8. **Slop check.** For each Usage and Pitfall line ask: "What is the basis?" and "Would this line be true of any design system?" No basis or generic: rewrite or cut.

## Steps

### 0. Preflight
Read `bauhaus.config.json`. Missing: run `/bauhaus:init` first. Ask the user for the product, its users and its stack if not clear.

### a. Principles and users
1. Ask who uses the product and in what context (device, environment, expertise, assistive tech).
2. Propose 3-5 principles with `AskUserQuestion`. Each principle states a trade-off, not a slogan.
3. Land: styleguide §Philosophy in `<config.guide>`, and a Storybook `General/Principles` page when Storybook exists.
4. **Checkpoint A.** Show principles and user notes. Wait for a yes.

### b. Foundations, one by one
Order: colour, typography, spacing-layout, shape, elevation, motion, iconography, density.
For each foundation:
1. Load its knowledge file.
2. Dispatch the owner agent to draft a proposal (scale, values, cost, alternatives):
   - colour, typography, spacing-layout, shape, elevation, iconography, density: `bauhaus:ui-designer`
   - motion: `bauhaus:motion-designer`
   - Keyboard and state questions in density: `bauhaus:ux-designer`
3. Ask with `AskUserQuestion`. Populate on the answer.
4. Run `/bauhaus:foundation` steps to land the four artifacts.
5. Colour: run `node ${CLAUDE_PLUGIN_ROOT}/scripts/contrast.mjs <fg> <bg>` for each text and border pair.
6. **Checkpoint B.n** after each foundation. One line: artifacts written, checks passed.

#### Typography: the typeface step
When the foundation is typography, add this step to the steps above.
1. Load `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/typefaces.md` and `${CLAUDE_PLUGIN_ROOT}/kit/typefaces/catalog.json`. Typography runs typefaces, fonts, text styles, like colour runs palette, colors, roles. A design system built from scratch defines all six roles: sans, serif, display, mono, handwriting, slab. A project may leave one unused; say so and skip it.
2. For each role, propose the catalog `essentialDefault` (inter, source-serif-4, fraunces, jetbrains-mono, caveat, bitter) plus two alternatives of the same role, chosen by the tone of the project (read `bestFor`, `avoidFor`, `pairsWith`). Put the recommended option first and say why.
3. Ask with `AskUserQuestion`: one question per role, or one call of up to 4 questions. Wait for the answers.
4. Write `typefaces.tokens.json` (one `typeface.<family-id>` token per chosen family: the exact Fontsource `font-family` name, then the family's own `fallback` stack from the catalog, which follows its classification (a serif display face falls back to serifs), ending in a generic family), `fonts.tokens.json` (`font.<role>` aliasing `{typeface.<id>}`) and the text styles in `typography.tokens.json` (`text.<style>.family` aliasing `{font.<role>}`). Only `typeface.*` is named after a family.
5. Add the Fontsource packages from the catalog `package` field to `package.json` dependencies, and write `fonts.css` with one `@import '<package>/wght.css'` per family. Consumers opt in by importing it; the design system does not force-load six families.
6. Run `tokens.mjs build` and `check`. `check` fails when a stack does not end in a generic family (`typography.fallback-generic`) and warns on a text style that aliases a typeface directly.

### c. Tokens, tiered
Tokens are the storage of the accepted foundations, not a layer. This stage writes them down.
1. Primitive token tier: raw scales from the accepted foundations. No intent in the name. Colour: `palette.tokens.json` (named hues, grades 100 to 900) and `colors.tokens.json` (primary, secondary, error, success, warning, info, neutral, aliasing the palette). Typography: `typefaces.tokens.json` (`typeface.<family>`, full stacks) and `fonts.tokens.json` (`font.<role>` aliasing a typeface).
2. Semantic tier: intents that alias primitive tokens (`space.inset.md`). Colour: the roles in `themes/light` (default) and `themes/dark` (`text.muted`, `surface.raised`, `action.primary`). Call sites use only this tier. Both themes define the same roles. Typography: the text styles in `typography.tokens.json` (`text.body.family` aliasing `{font.sans}`, plus size, weight, line height).
3. Component tier: only when a component needs one scoped decision. Optional.
4. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs build` and `... check`. Both must pass.
5. **Checkpoint C.** Show the tier counts, the theme parity result and any alias chain deeper than three.

### d. Components — the smallest viable set
1. Ask what screens exist. List candidate components from `knowledge/components/catalog.md`.
2. Keep only those that pass the justification test (see `/bauhaus:component`): at least two places, structural, one job. On a new system the "two places" test applies to planned screens.
3. Typical start: Button, Field (label, input, hint, error), Link, and one container. Add more only on demand.
4. Build each with `/bauhaus:component`. Each consumes semantic tokens only (colour: roles, never `palette.*` or `colors.*`).
5. Dispatch `bauhaus:ux-designer` per component for keyboard and ARIA. Run `/bauhaus:states` per component for the interaction matrix.
6. **Checkpoint D.** List components, matrix status per component (designed, n/a, missing), open advisories.

### e. Patterns
1. Add a pattern only when a real screen needs it and existing components compose it.
2. Build with `/bauhaus:pattern`. A pattern that needs a new token or raw value stops. Go back to stage b or c.
3. Each pattern carries its lifecycle matrix (`/bauhaus:states`): nothing, loading, none, one, some, too-many, incorrect, correct, done.
3. **Checkpoint E.**

### f. Styleguide, Storybook, rulebook
1. `/bauhaus:styleguide` — resync the prose against tokens and components.
2. `/bauhaus:storybook` — install or adapt the kit. Every foundation, component and pattern gets a page.
3. Every page passes the page contract and the slop check.
4. Rulebook — every component has rules with ids, verify modes and severities. Seed from `knowledge/governance/rulebook.md`. Write `auto` rules as tests where the stack allows.
5. Dispatch `bauhaus:responsive-reviewer` on the built pages.
6. Run `/bauhaus:audit` on the whole system.
7. **Final checkpoint.**

## Verify

- `tokens.mjs check` exits 0.
- No raw colour, size or duration outside the token source.
- Every foundation and component has all four artifacts.
- Every pattern lists the components it composes and adds no token.
- Every component and pattern has a state matrix with no unexplained `missing` cell.
- Every slice carries six sections in order and every Usage and Pitfall line has a basis.

## Output format

```
Bauhaus build — <name>
Stage:     a b c d e f (done: <list>)
Layers:    <n foundations> · <n components> · <n patterns>   (tokens stored: <n> p/s/c · themes: <n> · parity: pass|fail)
Artifacts: <n of 4> complete per foundation and component
States:    <designed> designed · <n/a> n/a · <missing> missing
Pages:     <n>/<total> meet the page contract
Refused:   <n> misfiles (ids)
Open:      <advisories, decisions pending>
Next:      <one step>
```

## Record the decisions

Every answer given at a gate in this skill becomes an ADR in the project's ADR folder (`docs/adr/` if none), in the same change. Format: `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/decisions.md`.
