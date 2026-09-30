---
name: pattern
description: Add or evolve a pattern (filtering, empty state, wizard, data table...) that composes existing components. Use when the user says "add a pattern", "new pattern", "design a filter bar", "document this composition", "wizard pattern", "evolve the data table pattern", or "this screen part repeats".
---

# /bauhaus:pattern — add or evolve a pattern

A pattern composes existing components to answer a recurring need. It introduces no token and no raw value. If it needs one, that is a foundation or token change first. Lead: `bauhaus:design-system-architect`. Supports: `bauhaus:ux-designer` (flow, states, copy, keyboard), `bauhaus:ui-designer` (spacing between parts), `bauhaus:motion-designer` (transitions), `bauhaus:responsive-reviewer` (phone floor).

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/patterns/<topic>.md` — the matching shelf: `loading`, `empty-and-error`, `forms`, `data-tables`, `filtering-search`, `navigation`, `dashboards-charts`, `responsive`, `content-writing`.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/layers.md`, `decision-tree.md`, `misfiles.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/lifecycle-states.md`, `state-matrix.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/accessibility/apg-patterns.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/page-contract.md` — the six-section page.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/contribution.md`, `rulebook.md`

## Steps

1. **Read the config.** Get `components`, `guide`, `storybook`, `rulebook`. Missing: suggest `/bauhaus:init`.
2. **Classify.** Run the decision tree. One block that does one job is a component: route to `/bauhaus:component`. A page or feature with business logic is not-DS.
3. **Prove the need.** List two or more real screens that repeat the composition. One occurrence stays in the product.
4. **List the parts.** Name every component the pattern uses. A missing component stops the work: run `/bauhaus:component` first.
5. **Run the no-new-value check.**
   - Grep the draft for raw colours, sizes, durations, shadows. Any hit: stop.
   - Needs a new spacing step, colour or duration: that is a foundation or token change. Run `/bauhaus:foundation` or `/bauhaus:tokens`, then return.
   - Layout gaps must use spacing tokens.
6. **Design the flow.** Dispatch `bauhaus:ux-designer`: order of parts, focus order, keyboard, ARIA, live regions, copy, the data shape. Dispatch `bauhaus:responsive-reviewer` for the phone floor.
7. **State matrix.** Mandatory. Run `/bauhaus:states`. Patterns carry the lifecycle axis: nothing, loading, none, one, some, too-many, incorrect, correct, done. Mark each designed, n/a with reason, or missing. A pattern without its matrix is not done.
8. **Propose before you populate.** Show the composition to the user with `AskUserQuestion` (2-4 options). Write after the answer.
9. **Land the artifacts to the page contract.** Each has six sections in order: Introduction, Tokens (consumed), Anatomy, States, Usage, Pitfalls and don'ts.
   - **Styleguide.** `<config.guide>` §Patterns section.
   - **Storybook.** A page under `Patterns/<Name>`, one story per lifecycle state.
   - **Rulebook.** Review rules (`<pattern>.<rule>`), plus `<pattern>.state.<state>` per designed state. Most pattern rules are `review`. Make one `auto` rule: "uses only listed components and no raw value".
   - **Tokens.** None new. The Tokens section lists consumed tokens.
10. **Slop check.** For each line in Usage and each Pitfall ask: "What is the basis?" and "Would this line be true of any pattern?" No basis or generic: rewrite with a basis (WCAG number and level, APG, Nielsen heuristic by name, published system, research result) or cut it.
11. **Migrate one screen** to the pattern. Record the rest with a ratchet.
12. **Verify.**
    - The pattern's CSS holds no raw value: grep.
    - `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check` exits 0.
    - All six sections exist in the styleguide and the Storybook page.
    - Every Usage rule and Pitfall has a basis.
    - Matrix has zero unexplained `missing` cells.

## Evolve

- Swapping a component: update anatomy, stories, rules. Check the matrix.
- Removing a part: deprecate first (`knowledge/governance/versioning.md`).
- A pattern that grows its own styles is turning into a component. Run the decision tree again.

## Writes

- Pattern composition code (in the product or `<config.components>`)
- `<config.guide>` §Patterns section
- Story file `Patterns/<Name>` in `<config.storybook.stories>`
- Rules in `<config.rulebook.rules>`; advisories in `<config.rulebook.advisories>`

## Output format

```
Pattern — <name> (<add | evolve>)
Layer:    pattern · Seen on: <n screens>
Composes: <components>
New tokens/values: none  (or STOP: <what, routed to skill>)
Page:     6/6 sections · <n> usage rules · <n> pitfalls · all with basis
States:   <designed> designed · <n/a> n/a · <missing> missing
Artifacts: styleguide ✓ · storybook ✓ · rulebook ✓
Migrated: <screen> · Remaining: <n>
```

## Rules

- Refuse any new token or raw value in a pattern.
- Refuse a pattern with one occurrence.
- Refuse a Usage line or Pitfall with no basis.
