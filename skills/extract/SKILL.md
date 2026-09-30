---
name: extract
description: Extract design tokens from an existing codebase. Use when the user says "extract design tokens", "reverse-engineer our design tokens", "find the tokens in this code", "inventory our colours and spacing", "we have lots of CSS and no tokens", or wants the values-to-tokens half only. For components, patterns and the full plan use /bauhaus:analyse.
---

# /bauhaus:extract — recover foundations and tokens from code

This is phases 2 to 4 of `/bauhaus:analyse` run on their own: values, then foundations, then tokens. It stops at accepted tokens. For components, patterns, classification, the normalisation plan and the build-up, run `/bauhaus:analyse`. Its artifacts and gates are the same, so a later `/bauhaus:analyse` resumes where this stopped.

Lead agent: `bauhaus:design-system-architect`. Supports: `bauhaus:ui-designer` (values), `bauhaus:motion-designer` (durations, easing).

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/analysis/scale-inference.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/layers.md`, `decision-tree.md`, `misfiles.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/architecture.md`, `naming.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/*.md` for each family found

## Steps

1. **Read the config.** Missing: infer the source folder, suggest `/bauhaus:init`. Extraction runs without a config.
2. **Scan (phase 2).** Run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/extract.mjs <dir> --out .bauhaus/analysis/02-values
   ```
   Use `<dir>` = the source root (for example `src`). The script reads css, scss, less, tsx, jsx, vue, svelte and html. It writes `inventory.json`, `custom-properties.json`, `tokens.draft.json` and `report.md`. Read the report first. State the totals.
3. **Find the scales (phase 3).** Run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/foundations.mjs --inventory .bauhaus/analysis/02-values/inventory.json --out .bauhaus/analysis
   ```
   Dispatch `bauhaus:ui-designer` and `bauhaus:motion-designer` to judge `03-foundations.json` by `knowledge/analysis/scale-inference.md`. Merge near-duplicates (`#333` and `#343434`, `15px` and `16px`) into one step and say which wins: highest count, or on-grid. Mark one-offs as outliers. Never promote them. On colour, run `node ${CLAUDE_PLUGIN_ROOT}/scripts/contrast.mjs <fg> <bg>` on pairs used together.
   Ask one `AskUserQuestion` per foundation: 2-4 options, cost stated in uses to snap.
4. **Name the tokens (phase 4).** Run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/normalise.mjs tokens --foundations .bauhaus/analysis/03-foundations.json --out .bauhaus/analysis/04-tokens
   ```
   Show the primitive and semantic tiers. Ask once: accept the set and names, rename first, or drop a family.
5. **Write the source.** Save the accepted tokens into `<config.tokens.source>`. Do not edit call sites.
6. **Verify.** Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs build` then `check`.
7. **Route.** Say what this run did not do: components, patterns, the plan. Offer `/bauhaus:analyse` to continue.

## Writes

- `.bauhaus/analysis/02-values/`, `03-foundations.json`, `03-foundations.md`, `04-tokens/`, `04-tokens.md` — working files, may be git-ignored.
- `<config.tokens.source>/*.tokens.json` — accepted tokens only.

## Output format

```
Bauhaus extract — <dir>
Scanned:     <n files> · <n distinct values> · <n custom properties>
Foundations: spacing <base> (fit <x>) · type <ratio> (fit <x>) · colour <n ramps> · radius <n> · duration <n>
Tokens:      <n primitive> · <n semantic> accepted
Outliers:    <n> values with one use, not promoted
Next:        /bauhaus:analyse — components, patterns and the plan
```

## Rules

- Never rewrite call sites in this skill. Phase 9 of `/bauhaus:analyse` does that.
- Never promote a one-off value to a token.
- Every merge states its pixel or colour delta.
