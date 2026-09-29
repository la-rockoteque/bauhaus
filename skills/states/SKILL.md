---
name: states
description: Author, audit or complete the state matrix of a primitive, pattern or screen. Use when the user says "states", "nine states", "state matrix", "empty state", "edge cases", "unhappy path", "loading and error", "button states", "hover focus disabled", "what states does this need", or "did I forget a state".
---

# /bauhaus:states — the state matrix

UI states are a core concept. A primitive or pattern is not done without its matrix. This skill authors, audits or completes it. Lead: `bauhaus:ux-designer` (lifecycle content).

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/model.md` — three axes: lifecycle, interaction, view.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/lifecycle-states.md` — the nine lifecycle states.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/interaction-states.md` — the interaction states.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/state-matrix.md` — matrix format, story rule, rule ids.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/components/anatomy-and-states.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/patterns/loading.md`, `empty-and-error.md` — for lifecycle content.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/rulebook.md`, `page-contract.md`

## The three axes

| Axis | States | Applies to |
|---|---|---|
| Lifecycle | nothing, loading, none, one, some, too-many, incorrect, correct, done | Patterns and screens that hold data or a task. |
| Interaction | default, hover, focus-visible, active, disabled, loading, success, error, selected. Also read-only, indeterminate, expanded, current. | Primitives. |
| View | The eight view states, crosswalked in `model.md`. | Screens. |

## Modes

Ask with `AskUserQuestion` when unclear: author (new matrix), audit (grade an existing one), complete (fill the missing cells).

## Steps

1. **Read the config.** Get `guide`, `components`, `storybook`, `rulebook`. Missing: infer, suggest `/bauhaus:init`.
2. **Classify the target.** Primitive, pattern or screen. A primitive gets the interaction axis. A pattern or screen gets the lifecycle axis and the interaction states of its parts.
3. **List columns.** Columns are the variants (`primary`, `secondary`, sizes). Read them from the component source or stories.
4. **Walk the rows.** Go through every state on the relevant axes, one at a time. Mark each cell:
   - `designed` — a look, copy and behaviour exist, with a story.
   - `n/a` — with a one-line reason ("a read-only label has no active state").
   - `missing` — not designed. This is a finding.
   A bare `n/a` without a reason counts as `missing`.
5. **Dispatch in parallel** (one message, three Agent calls), only for the parts needed:
   - `bauhaus:ux-designer` — lifecycle content: what the user sees and reads in nothing, none, too-many, incorrect and done; copy; recovery paths; ARIA live regions; keyboard.
   - `bauhaus:ui-designer` — interaction visuals: hover, focus-visible, active, disabled, selected; state tokens; contrast for each state (`node ${CLAUDE_PLUGIN_ROOT}/scripts/contrast.mjs <fg> <bg>`); focus appearance.
   - `bauhaus:motion-designer` — transitions between states: durations, easing, reduced-motion behaviour.
6. **Propose before you populate.** For each `missing` cell, put the design to the user with `AskUserQuestion` (2-4 options, cost stated). Batch trivial cells. Populate only after the answer.
7. **Land the four artifacts** for the matrix:
   - **Tokens.** New state tokens (`color.action.primary.hover`) go through `/bauhaus:tokens`. No raw value in a state rule.
   - **Styleguide.** Write the matrix table into section 4 (States) of the page of the primitive or pattern in `<config.guide>`. Rows = states, columns = variants, cell = designed, n/a with reason, or missing. Keep the six-section page order: Introduction, Tokens, Anatomy, States, Usage, Pitfalls and don'ts. Add state-specific Usage rules and Pitfalls, each with a basis.
   - **Storybook.** In the States section of the page, one story per state, named after the state. Use forced-state helpers where the state cannot be reached by hand (hover, focus-visible). Follow `knowledge/tooling/storybook.md`.
   - **Rulebook.** One rule per designed state, id `<component>.state.<state>` (for example `button.state.disabled`). Verify mode `auto` when code or CSS settles it (a `:focus-visible` rule exists), `review` otherwise. Other state rules use `<component>.states.<slug>` (for example `button.states.tokens`); see `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/rulebook.md` § Rule id shapes. Ids are permanent.
8. **Audit mode.** Do steps 3-5. Do not write. Report each `missing` cell as a finding. Basis: `knowledge/states/model.md`, plus a criterion when one applies (`WCAG 2.4.7 (AA)` for focus visible, `WCAG 4.1.3 (AA)` for status messages, `WCAG 1.4.1 (A)` when state uses colour alone). Check the number in `wcag-map.md` before you cite.
9. **Slop check.** For each state-related Usage line and Pitfall ask: "What is the basis?" and "Would this line be true of any component?" No basis or generic: rewrite or cut. Example of a basis: a disabled control still needs a reason the user can read (`WCAG 3.3.1 (A)` for errors, Nielsen "Visibility of system status").
10. **Verify.**
   - Matrix has zero `missing` cells, or each is an advisory.
   - Every `designed` cell has a story and a rule id.
   - Every state token exists: `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check`.
   - Every state line in Usage and Pitfalls has a basis.
   - Stories render (run the project's Storybook build or test when present).

## Matrix example

| State | primary | secondary | Story | Rule |
|---|---|---|---|---|
| default | designed | designed | `Default` | `button.state.default` |
| hover | designed | designed | `Hover` | `button.state.hover` |
| focus-visible | designed | designed | `FocusVisible` | `button.state.focus-visible` |
| disabled | designed | designed | `Disabled` | `button.state.disabled` |
| indeterminate | n/a: a button has no mixed value | n/a | — | — |
| loading | missing | missing | — | — |

## Writes

- Styleguide matrix in `<config.guide>`.
- Stories in `<config.storybook.stories>`, one per state.
- Rules in `<config.rulebook.rules>`, ids `<component>.state.<state>`.
- Advisories in `<config.rulebook.advisories>` for open `missing` cells.

## Output format

```
States — <target> (<primitive|pattern|screen>)
Axes:    <lifecycle | interaction | view>
Matrix:  <designed> designed · <n/a> n/a (with reason) · <missing> missing
Landed:  <n stories> · <n rules> · <n tokens>
Missing: <state> × <variant> — <smallest next step>
Next:    <one step>
```

## Rules

- Never mark a state `n/a` without a reason.
- Sort findings by severity descending; cap at ten.
- A state that only shows through colour also needs a second cue (`WCAG 1.4.1 (A)`).
- Do not add states nobody can reach. Say why a candidate state is out.
