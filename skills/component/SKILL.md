---
name: component
description: Add or evolve a primitive (Button, Field, Card, Dialog...) - justify it, then land the four artifacts, the state matrix, and migrate the first call site. Use when the user says "add a component", "new primitive", "create a button", "should this be a component", "evolve the dialog", "add a variant", or "extract this into the design system".
---

# /bauhaus:component — add or evolve a primitive

A primitive is a reusable block that does one job and consumes semantic tokens. It is not done until the four artifacts and its state matrix ship together. Lead: `bauhaus:design-system-architect`. Supports: `bauhaus:ui-designer` (look), `bauhaus:ux-designer` (states, keyboard, ARIA), `bauhaus:motion-designer` (transitions).

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/components/api-design.md` — props, composition, slots, when to add.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/components/anatomy-and-states.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/components/catalog.md` — checklist for the common set.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/interaction-states.md`, `state-matrix.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/accessibility/apg-patterns.md` — keyboard contract, if the primitive is interactive.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/decision-tree.md`, `misfiles.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/contribution.md`, `rulebook.md`, `page-contract.md`

## Steps

1. **Read the config.** Get `components`, `stylesheet`, `guide`, `storybook`, `rulebook`, `tokens`, `prefix`.
2. **Classify.** Run the decision tree. A composition of primitives is a pattern: route to `/bauhaus:pattern`. A flow inside the block is a misfile.
3. **Justify.** For a new primitive, all three must hold. If one fails, stop and say which.
   1. **At least two places.** The pattern appears in two or more call sites. List them. One-off styles stay component-local.
   2. **Structural, not incidental.** A "quantity stepper" is structural. A "callout that happens to be blue" is incidental.
   3. **One job.** If five modifiers cover five unrelated cases, split it into several primitives.
   For an evolution: state what changes and which call sites it touches.
4. **Decide where the CSS lives.**
   - Two or more callers: `<config.stylesheet>`, documented in the styleguide.
   - One caller: a stylesheet beside the component, imported by it.
   - Tokens are always shared, whichever way it goes.
5. **Design the API.** Dispatch `bauhaus:ux-designer`: anatomy, props, variants, keyboard, ARIA, accessible name. Follow `api-design.md`. Prefer a variant prop over a new primitive.
6. **Design the look.** Dispatch `bauhaus:ui-designer`: which semantic tokens it uses. Missing a token? Stop. Run `/bauhaus:tokens` first. Never write a raw value in the primitive. Check contrast of every state with `node ${CLAUDE_PLUGIN_ROOT}/scripts/contrast.mjs <fg> <bg>`.
7. **Propose before you populate.** Show anatomy, variants and states to the user with `AskUserQuestion` (2-4 options). Populate after the answer.
8. **Land the four artifacts in one pass.**
   1. **Styles and tokens.** The stylesheet or component CSS, using `--<prefix>-*` semantic tokens only. Component tokens only if a semantic token is too broad.
   2. **Styleguide section.** In `<config.guide>` §Primitives, to the page contract, six sections in order: 1 Introduction (what, job, layer, plain words first), 2 Tokens (consumed, with intent), 3 Anatomy (parts, required or optional), 4 States (the matrix), 5 Usage (when, when not and the alternative, how: variants, composition, content, responsive, accessibility), 6 Pitfalls and don'ts (each with why).
   3. **Storybook page.** `Components/<Name>` with the same six sections, and one story per state.
   4. **Rulebook entries.** Rules with permanent ids (`<component>.<rule>`), verify mode `auto` or `review`, severity, expectation. Add the stylesheet to the graded list if the project has one.
9. **State matrix.** Mandatory. Run `/bauhaus:states` for the primitive: rows = interaction states, columns = variants, each cell designed, n/a with reason, or missing. One story per state, one rule `<component>.state.<state>` per designed state. No matrix, no primitive.
10. **Slop check.** For each Usage rule and Pitfall ask: "What is the basis?" (WCAG number and level, APG pattern, Nielsen heuristic by name, published system, research result) and "Would this line be true of any component?" No basis or generic: rewrite with a basis or cut.
11. **Migrate the first call site.** Replace the ad-hoc version with the primitive. Record the remaining call sites and set a ratchet on them.
12. **Verify.**
    - `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check` exits 0.
    - No raw colour, size or duration in the primitive's CSS.
    - All four artifacts exist and name the same variants and tokens.
    - Matrix has zero unexplained `missing` cells.
    - The page has six sections in order. Every Usage and Pitfall line has a basis.
    - Keyboard walk and accessible name confirmed by `bauhaus:ux-designer`.
    - Project build and tests pass.
13. **Audit.** Optionally run `/bauhaus:audit` on the new primitive.

## Evolve (variant, prop, deprecation)

- Adding a variant: update all four artifacts and the matrix column. Add stories for each state.
- Removing or renaming: follow `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/versioning.md`. Deprecate first, migrate, then remove.
- Rule ids never change once written. Retire a rule, do not reuse its id.

## Writes

- Primitive code and CSS in `<config.components>` and `<config.stylesheet>`
- `<config.guide>` §Primitives section
- Story files in `<config.storybook.stories>`
- Rule file in `<config.rulebook.rules>`, advisories in `<config.rulebook.advisories>`
- One migrated call site

## Output format

```
Component — <name> (<add | evolve>)
Layer:    primitive · Justification: <n call sites> · structural · one job
Tokens:   <semantic tokens used> · new tokens: <none | list>
Page:     6/6 sections · <n> usage rules · <n> pitfalls · all with basis
Artifacts: styles ✓ · styleguide ✓ · storybook ✓ · rulebook ✓ (<n rules>)
States:   <designed> designed · <n/a> n/a · <missing> missing
Migrated: <call site> · Remaining: <n> (ratchet)
Next:     <one step>
```

## Rules

- Refuse a primitive that fails the three-part justification.
- Refuse a raw value in a primitive.
- Refuse a flow inside a primitive. Make it a pattern.
