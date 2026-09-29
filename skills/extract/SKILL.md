---
name: extract
description: Extract a design system from an existing codebase. Use when the user says "extract a design system", "reverse-engineer our design tokens", "find the tokens in this code", "we have no design system but lots of CSS", "inventory our colours and spacing", "what is our maturity", or wants a migration plan from literals to tokens.
---

# /bauhaus:extract — recover a design system from code

Scans an existing codebase, clusters what it finds, classifies findings into the four layers, proposes a token set, maps literals to tokens and plans the migration. Lead agent: `bauhaus:design-system-architect`. Supports: `bauhaus:ui-designer` (values), `bauhaus:motion-designer` (durations, easing).

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/layers.md`, `decision-tree.md`, `misfiles.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/architecture.md`, `naming.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/*.md` for each family found
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/maturity.md`, `versioning.md`, `page-contract.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/model.md`, `state-matrix.md`

## Steps

1. **Read the config.** Missing: infer the source folder, suggest `/bauhaus:init`. Extraction runs without a config.
2. **Scan.** Run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/extract.mjs <dir> --prefix <prefix> --out .bauhaus/extract
   ```
   Use `<dir>` = the source root (for example `src`). Use `config.prefix`, or ask. The script reads css, scss, less, tsx, jsx, vue, svelte and html. It writes:
   - `inventory.json` — every value with count and files.
   - `tokens.draft.json` — a DTCG draft with clustered values.
   - `report.md` — a summary.
   Read the report first. State the totals.
3. **Cluster.** For each family (colour, typography, spacing, radius, shadow, z-index, duration, easing, breakpoint):
   - List values by count. The top values are candidate scale steps.
   - Merge near-duplicates (`#333` and `#343434`, `15px` and `16px`) into one step. Say which value wins and why: highest count, or on-grid.
   - Mark one-offs (count 1) as outliers. Do not promote them.
   - Colour: run `node ${CLAUDE_PLUGIN_ROOT}/scripts/contrast.mjs <fg> <bg>` on text/background pairs actually used together.
4. **Classify.** Run the decision tree on each finding. Write a table: finding, layer, reason.
   - Value families and scales: foundation.
   - Existing custom properties: token (name the tier from what they alias).
   - Reused UI blocks (buttons, inputs, modals): primitive candidates.
   - Recurring compositions (filter bars, empty states): pattern candidates.
   - Everything else: not-DS. Flag misfiles with ids from `misfiles.md`.
5. **Propose the token set.** Draft primitive tokens from clusters and semantic tokens from usage context (text, surface, border, action). Show the draft. Ask with `AskUserQuestion` where a choice exists: which of two competing greys wins, keep or drop a 15px step. One question at a time, 2-4 options, cost stated (files to change).
6. **Write the source.** Save the accepted tokens into `<config.tokens.source>`. Do not edit call sites yet.
7. **Map literals to tokens.** Write `.bauhaus/extract/mapping.json`: each literal, its file list, its target token. Unmapped literals list the reason.
8. **Plan the migration.** Write `.bauhaus/extract/migration.md`:
   - Order: semantic-token targets first, most-used values first.
   - Batches by folder, each small enough to review.
   - A ratchet per family: the count of raw literals may not rise, and must be lowered when it drops.
   - Risks: near-duplicate merges change pixels. List them.
9. **Grade existing docs and states.** For each documented foundation, primitive and pattern:
   - Page contract: which of the six sections exist (Introduction, Tokens, Anatomy, States, Usage, Pitfalls and don'ts). A missing section is a finding, rule id `page.<section>`. A Usage or Pitfall line with no basis is a finding, `page.usage` or `page.pitfalls`.
   - State matrix: read the CSS and stories for hover, focus-visible, active, disabled, loading, error and the lifecycle states. Mark each designed, n/a with reason, or missing. Missing is a finding.
   Summarise counts. Do not fix here. The migration plan hands fixes to `/bauhaus:states` and `/bauhaus:styleguide`.
10. **Assess maturity.** Using `knowledge/governance/maturity.md`, name the level. Give evidence: token coverage percent, custom-property count, primitives with docs, rulebook presence. Give the next level and the first step.
11. **Verify.** Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs build` then `check` on the accepted source.

## Writes

- `.bauhaus/extract/` (inventory, draft, report, mapping, migration plan) — working files, may be git-ignored.
- `<config.tokens.source>/*.tokens.json` — accepted tokens only.

## Output format

```
Bauhaus extract — <dir>
Scanned:   <n files> · <n distinct values> · <n custom properties>
Clusters:  colour <a→b> · spacing <a→b> · type <a→b> · radius <a→b> · duration <a→b>
Layers:    <n foundation> · <n token> · <n primitive cand.> · <n pattern cand.> · <n not-DS>
Misfiles:  <ids>
Tokens:    <n primitive> · <n semantic> accepted
Coverage:  <percent> of literals map to a token
States:    <designed> designed · <n/a> n/a · <missing> missing (across <n> primitives)
Pages:     <n>/<total> meet the page contract · <n> basis-less lines
Maturity:  <level> — <evidence>
Plan:      .bauhaus/extract/migration.md (<n batches>)
```

## Rules

- Never rewrite call sites in this skill. The plan hands that to `/bauhaus:tokens` and `/bauhaus:component`.
- Never promote a one-off value to a token.
- Every merge states its pixel or colour delta.
