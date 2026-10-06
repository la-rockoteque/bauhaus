---
name: analyse
description: Analyse an existing repo and take it to a full design system, in nine phases with a gate at each. Use when the user says "analyse this repo", "analyze our UI code", "we have no design system", "audit our frontend for a DSM", "extract foundations tokens components patterns", "normalisation plan", "consolidate our components", "resume analysis", or has a codebase with inconsistent values and duplicate components.
---

# /bauhaus:analyse — from an existing repo to a design system

Reads the code, infers the system that is already there, shows it to the user, and rebuilds it layer by layer. Nine phases. Scripts count. Agents judge. The user approves at each gate. Lead agent: `bauhaus:design-system-architect`. The contract for artifacts and scripts is `${CLAUDE_PLUGIN_ROOT}/docs/analysis.md`.

In plain words: a builder inherits a house with no plans. She measures every wall, works out which measures the first builder meant, names the standard parts, then draws the plans. Only then does she change anything.

## Options

| Option | Effect |
|---|---|
| `--scope <dir>` | Analyse one app or one folder. Use it for a big repo. |
| `phase <n>` | Redo phase `n`. Deletes the artifacts of phases `n` to 8 after a yes. |
| `status` | Show progress and stop. |

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/analysis/workflow.md` — the order, the gates, resume, scope. Always.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/analysis/scale-inference.md`, `component-mining.md`, `pattern-mining.md`, `normalisation.md` — when you reach the phase.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/layers.md`, `decision-tree.md`, `misfiles.md`, `plain-language.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/contribution.md`, `maturity.md`, `versioning.md`, `rulebook.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/model.md`, `state-matrix.md`

## Hard rules

1. **Order.** Phases run 1 to 9. Never start a phase before the artifacts of the one before it exist.
2. **Read-only until phase 9.** Phases 1 to 8 write only under `.bauhaus/analysis/`. Phase 9 edits source through the existing skills, one approved batch at a time.
3. **One-offs are never promoted.** A value or component with one use is an outlier or local.
4. **Every merge or snap states its delta:** pixels, ΔE or call sites.
5. **One gate per decision.** One `AskUserQuestion`, one focused question, 2 to 4 options, cost stated. Recommended option first.
6. **Two registers.** Say the plain line first, then the precise line.
7. **Classify first.** Use the three layers (foundation, component, pattern). Tokens are how a foundation is stored, not a layer. Never mix them.
8. **Every report** carries a `## Decisions` section and a `## States` summary.

## Steps

### 0. Status and resume

1. Read `bauhaus.config.json`. Missing: infer paths, suggest `/bauhaus:init` after phase 4. Analysis runs without a config.
2. Run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/analyse.mjs status
   ```
   It lists each phase as `done`, `partial` or `pending`, from the artifacts on disk. Phase 4 is `done` with a `*.tokens.json` under both `04-tokens/foundations/` and `04-tokens/themes/` (or the older flat `04-tokens/primitives.tokens.json`), and `partial` with only one of them. There is no state file.
3. `status` option: print the list and stop.
4. Otherwise resume at the first phase that is not `done`. Read the `.md` reports of the earlier phases, including `## Decisions`. Do not ask an answered question again.
5. If the repo changed since the artifacts were written, say so. Offer to redo from the earliest affected phase.
6. `phase <n>` option: confirm, delete the artifacts of phases `n` to 8 (keep `09-build.md`), then run phase `n`.

### 1. Scope

- **Goal:** know what is in the repo and who uses the product.
- **Command:** `node ${CLAUDE_PLUGIN_ROOT}/scripts/analyse.mjs init <dir>` (`<dir>` = `--scope` or the source root).
- **Agent:** `bauhaus:design-system-architect` reads `01-scope.json`: stack, file counts, ignored folders. It asks who uses the product and on what devices.
- **Knowledge:** `analysis/workflow.md` § Cutting scope for a big repo.
- **Writes:** `.bauhaus/analysis/01-scope.json`, `01-scope.md`.
- **Gate:** "Analyse `<dir>` (<n> files)?" Options: this scope; a smaller scope (name it; cost: a second run later); widen. Also confirm the users.
- **Say:** "I will read `<n>` files in `<dir>`. I will change none of them."

### 2. Values

- **Goal:** count every literal value and custom property.
- **Command:** `node ${CLAUDE_PLUGIN_ROOT}/scripts/extract.mjs <dir> --out .bauhaus/analysis/02-values`
- **Agent:** none. Read `report.md`. State the totals.
- **Writes:** `02-values/inventory.json`, `custom-properties.json`, `tokens.draft.json`, `report.md`.
- **Gate:** none.
- **Say:** "Found `<n>` distinct values in `<n>` files, `<n>` colours, `<n>` spacings, `<n>` font sizes."

### 3. Foundations

- **Goal:** find the scale each value family already follows.
- **Command:** `node ${CLAUDE_PLUGIN_ROOT}/scripts/foundations.mjs --inventory .bauhaus/analysis/02-values/inventory.json --out .bauhaus/analysis`
- **Agents, in parallel:** `bauhaus:ui-designer` judges colour, type, spacing, radius, shadow, z-index and breakpoints. `bauhaus:motion-designer` judges duration and easing. Each reads `03-foundations.json` and proposes a scale, or says "no scale found". They judge fit, outliers and overrides (a heavy off-scale value is a decision).
- **Knowledge:** `analysis/scale-inference.md`, `foundations/<family>.md` for each family.
- **Writes:** `03-foundations.json`, `03-foundations.md`.
- **Gate, one per foundation:** "Spacing runs on a 4px grid, 91% fit. Adopt it?" Options: adopt as inferred; adopt with a change (name it); keep the code's hand-tuned values. State the cost in uses to snap.
- **Say:** "Your spacing mostly follows a 4px grid. I found 3 values that do not fit."

### 4. Tokens

- **Goal:** write the accepted foundation decisions as DTCG tokens: scale steps and intents. Colour is emitted as three parts: `palette.tokens.json` (named hues with grades, primitive), `colors.tokens.json` (primary, secondary, error, success, warning, info, neutral, aliasing the palette) and the roles of `themes/light` (the default). `themes/dark` follows in phase 9 as a sibling, with the same role names.
- **Command:** `node ${CLAUDE_PLUGIN_ROOT}/scripts/normalise.mjs tokens --foundations .bauhaus/analysis/03-foundations.json --out .bauhaus/analysis/04-tokens`
- **Agents:** `bauhaus:design-system-architect` checks tiers and names. `bauhaus:ui-designer` checks values and contrast pairs.
- **Knowledge:** `tokens/architecture.md`, `tokens/naming.md`, `analysis/scale-inference.md` § Colour.
- **Writes:** `04-tokens/` (tiered DTCG: `foundations/color/palette.tokens.json`, `colors.tokens.json`, `themes/light/light.tokens.json`, and the other foundations' files), `04-tokens.md`. Validate the draft with `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check`.
- **Gate:** "Accept these `<p>` primitive token and `<s>` semantic tokens (colour: `<h>` hues, `<r>` roles) and their names?" Options: accept; rename first; drop a family. State the count.
- **Say:** "Each accepted value gets one name. Screens will use the name, not the number."

### 5. Components

- **Goal:** find component candidates and near-duplicates.
- **Command:** `node ${CLAUDE_PLUGIN_ROOT}/scripts/components.mjs <dir> --out .bauhaus/analysis`
- **Agents, in parallel:** `bauhaus:design-system-architect` runs the three gates (two places, structural, one job), separates shared components, page-local components and feature components, and picks the keeper of each group. `bauhaus:ux-designer` reads state coverage and keyboard and ARIA of each keeper.
- **Knowledge:** `analysis/component-mining.md`, `governance/contribution.md`, `taxonomy/decision-tree.md`, `states/state-matrix.md`.
- **Writes:** `05-components.json`, `05-components.md` with a `## States` summary.
- **Gate:** one per group: "Merge `Btn`, `SubmitButton` into `Button`? 17 call sites change." Options: merge; keep both (name the reason); merge later. Also one question to accept the component list.
- **Say:** "You have 5 buttons that do one job. I suggest keeping the one everybody already uses."

### 6. Patterns

- **Goal:** find recurring compositions and missing patterns.
- **Command:** `node ${CLAUDE_PLUGIN_ROOT}/scripts/patterns.mjs --components .bauhaus/analysis/05-components.json <dir> --out .bauhaus/analysis`
- **Agents, in parallel:** `bauhaus:ux-designer` names the user need of each candidate, maps it to `knowledge/patterns/*.md` and lists the lifecycle states it must cover. `bauhaus:design-system-architect` rejects any candidate that adds a value.
- **Knowledge:** `analysis/pattern-mining.md`, `patterns/*.md` (the mapped one), `states/lifecycle-states.md`.
- **Writes:** `06-patterns.json`, `06-patterns.md` with a `## States` summary.
- **Gate:** "Accept these `<n>` pattern candidates?" Options: accept all; accept some (name them); none yet. State that accepting costs a page each later.
- **Say:** "The same list-with-filters screen appears in 6 places. I will name it and document it."

### 7. Classification

- **Goal:** put every finding in one layer and flag misfiles.
- **Command:** none. Use the logic of `/bauhaus:classify` (decision tree, five questions, `misfiles.md` ids) across the three layers on the outputs of phases 2 to 6.
- **Agent:** `bauhaus:design-system-architect`.
- **Knowledge:** `taxonomy/decision-tree.md`, `taxonomy/misfiles.md`, `states/model.md`.
- **Writes:** `07-classification.md`: one row per finding (layer, stored-as tier if any, where it lives, fits, misfile id). "Unlisted" when no id fits. Never invent an id.
- **Gate:** none.
- **Say:** "`<n>` items are filed in the wrong place. Most are colours written straight into components."

### 8. Normalisation

- **Goal:** one action per finding, ranked, in reviewable batches.
- **Commands:**
  ```
  node ${CLAUDE_PLUGIN_ROOT}/scripts/normalise.mjs plan --analysis .bauhaus/analysis
  node ${CLAUDE_PLUGIN_ROOT}/scripts/structure.mjs place --components .bauhaus/analysis/05-components.json
  ```
  `place` proposes a slice path in the library for each shared component and each merge keeper (`docs/library.md`).
- **Agents:** `bauhaus:design-system-architect` writes the plan. `bauhaus:ui-designer`, `bauhaus:ux-designer`, `bauhaus:motion-designer` and `bauhaus:responsive-reviewer` each review their half. Launch them in parallel.
- **Knowledge:** `analysis/normalisation.md`, `governance/maturity.md`, `governance/versioning.md`, `governance/rulebook.md`, `governance/page-contract.md`.
- **Writes:** `08-normalisation.json` and `08-plan.md`. The plan holds:
  1. **Findings** by severity, capped at ten per layer. Say how many were cut.
  2. **Normalisation advice** per layer, in two registers: plain, then precise.
  3. **Batch plan:** id, layer, title, items, files, risk, effort, skill. Ordered foundation (its tokens first), component, pattern, docs.
  4. **Maturity before and after:** name the level with evidence, and the level the plan reaches.
  5. **States summary:** designed, n/a, missing.
  6. **Page-contract gaps:** which of the six sections each existing page lacks.
  7. **Library placement:** the target slice of each component, grouped by family, and the unplaced ones with a question for each.
- **Gate:** "Accept the plan and start with batch b1 (`<title>`, `<n>` files, risk `<r>`)?" Options: accept the plan and b1; accept the plan, hold b1; change the plan (say what).
- **Say:** "Here is the whole tidy-up in `<n>` steps. Nothing changes until you approve step 1."

### 9. Build-up

- **Goal:** apply the plan, one batch at a time.
- **First, the library.** Run `/bauhaus:library options` if the project has not chosen where the DS lives, then `/bauhaus:library init`. Every later batch writes into the library, never into the app (`docs/library.md`).
- **Hand each batch, in order, to the existing skill:** `/bauhaus:init` (config, first), `/bauhaus:foundation`, `/bauhaus:tokens`, `/bauhaus:component` with `/bauhaus:library move` for each component, `/bauhaus:states`, `/bauhaus:pattern`, `/bauhaus:styleguide`, `/bauhaus:storybook`. The order never changes: foundations, their tokens, components, patterns, docs.
- **Before each batch:** snapshot the affected screens (`knowledge/tooling/visual-regression.md`) and set the ratchet number. Use a codemod when 10 or more places change.
- **After each batch:** run the checks (`tokens.mjs check`, `structure.mjs check <library>`, the tests, the snapshot compare). Compare the visual diff with the stated delta.
- **Writes:** `09-build.md`: batch id, skill, result (`applied`, `skipped`, `reverted`), delta as measured, ratchet number, revert reference.
- **Gate, one per batch:** "Batch `<id>` is ready: `<n>` files, delta `<d>`, checks `<pass/fail>`. Apply?" Options: apply; apply after edits (name them); skip; stop here. Never merge two batches into one gate. Never skip ahead of the order.
- **On a failed check:** revert the batch. Do not patch forward. Re-plan the item.
- **Say:** "Batch `<id>` is done. `<n>` files changed. The screens look the same, except `<named delta>`."

## Output format

```
Bauhaus analyse — <dir> (scope: <dir>)
Phase:      <n> of 9 (done: <list>)
Scanned:    <n files> · <n distinct values> · <n custom properties>
Foundations: spacing <base> (fit <x>) · type <ratio> (fit <x>) · colour <n hues> · other <n>
Tokens:     <n primitive token> · <n semantic> accepted (colour: palette · colors · roles per theme)
Components: <n> found · <n component cand.> · <n groups> · <n merges accepted>
Patterns:   <n> candidates · <n> accepted · <n> missing patterns
Layers:     <n foundation> · <n component> · <n pattern> · <n not-DS>   (foundations stored as <n> primitive · <n> semantic tokens)
Misfiles:   <ids>
States:     <designed> designed · <n/a> n/a · <missing> missing
Maturity:   <level> → <level after plan> — <evidence>
Plan:       .bauhaus/analysis/08-plan.md (<n batches>)
Build:      <n applied> · <n skipped> · <n reverted> of <n batches>
Next:       <one step>
```

## Writes

- `.bauhaus/analysis/` — every artifact above. Working files, may be git-ignored.
- Phase 9 only: source files, tokens and docs, through the skills named there.

## Rules

- No source edits before phase 9.
- One-offs are never promoted to a step, a token, a component or a pattern.
- Every merge or snap states its delta.
- A pattern never introduces a value. Send it back to phase 3 or 4.
- Never skip the order of phase 9: foundations, their tokens, components, patterns, docs.
- Sort findings by severity descending. Cap at ten per layer.
- Never invent a misfile id or a citation.

## Record the decisions

Every answer given at a gate in this skill becomes an ADR in the project's ADR folder (`docs/adr/` if none), in the same change. Format: `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/decisions.md`.
