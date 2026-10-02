---
id: tooling/ai-consumption
title: AI consumption — lookup beats loading
shelf: tooling
layer: cross-cutting
owner: design-system-architect
tags: [ai, agents, manifest, mcp, agents-md, reuse, tokens, kit]
sources:
  - Atlassian, "Atlassian's DESIGN.md is here" — https://www.atlassian.com/blog/how-we-build/atlassians-design-md-is-here-what-we-learned-testing-portable-design-context-in-practice
  - Storybook MCP overview (the docs toolset needs a components manifest) — https://storybook.js.org/docs/ai/mcp/overview
  - Custom Elements Manifest, the schema precedent for web components — https://github.com/webcomponents/custom-elements-manifest
  - AGENTS.md convention — https://agents.md
---

# AI consumption — lookup beats loading

> An agent that builds UI needs to find the right component, not read the whole system. Give it a small index and the way to look things up. Do not give it one big file.

## Rules

1. Give the library one machine-readable manifest, `bauhaus-manifest.json`. It lists each slice with its export, layer, summary, props, variants, tokens, composed slices and rule ids. (Basis: Storybook MCP docs toolset reads a components manifest; Custom Elements Manifest precedent.)
2. Build the manifest from the source. Never write it by hand. Commit it. (Basis: a hand-written index drifts; `tokens/pipelines.md` drift check.)
3. Keep the context file for agents short. It is an index that points at the manifest, not a copy of it. (Basis: Atlassian generated one login screen per arm. DESIGN.md as the sole source averaged 7.21M tokens and 45.3 turns. The ADS MCP server averaged 3.75M tokens and 35.1 turns. The ADS Skill averaged 4.43M tokens and 36 turns. DESIGN.md cost about 92% more tokens than the MCP server and varied about 2.7x more between runs. Atlassian says the results are not conclusive.)
4. Tell the agent to look up before it builds. It reads the manifest, reuses a component, and never re-implements one. (Basis: the same Atlassian test says an agent should learn to import and use an existing component, and that DESIGN.md tends to re-create ADS components. One task, so treat it as a hint.)
5. Tell the agent to use role tokens only. It never uses a palette value or a raw hex colour. State the token prefix. (Basis: `tokens/architecture.md`; a palette value in a component breaks every theme.)
6. Write the context between `<!-- bauhaus:start -->` and `<!-- bauhaus:end -->` markers. A rerun replaces that block and leaves the rest of the file. (Basis: `AGENTS.md` belongs to the repo; a tool must not own the whole file.)
7. Regenerate the manifest and the context in the same change as the slice. A slice change without them is unfinished. (Basis: four artifacts; `UBIQUITOUS-LANGUAGE.md`.)
8. Keep the build deterministic. Sort every list. Write no timestamp. Then a diff shows only real change. (Basis: reviewable drift.)

## The manifest

`node scripts/manifest.mjs build <libraryDir>` writes `bauhaus-manifest.json` next to `bauhaus.config.json`.

| Field | Holds |
|---|---|
| `version`, `name`, `prefix`, `import` | Schema version, the system name and token prefix from `bauhaus.config.json`, the npm name from `package.json`. |
| `slices[].name`, `path`, `layer`, `family` | The slice folder. Layer is `foundation`, `primitive`, `component` or `pattern`. A primitive is a kind of component. |
| `slices[].export` | The name `index.ts` exports. `null` for a pattern or a foundation. |
| `slices[].summary` | The plain line of the showcase. |
| `slices[].props` | Name, type, `optional`, `default`, `doc`, and `values` for a union of string literals. |
| `slices[].variants` | The values of the `variant` prop. |
| `slices[].tokens` | The `--<prefix>-*` tokens the stylesheet reads. |
| `slices[].composes` | The slices it imports. For a pattern, the recipe. |
| `slices[].rules` | Id, severity and verify mode of each rule. |

The script reads source with regular expressions, not a parser. It names its limits in its header. Move to the TypeScript compiler API or react-docgen when props outgrow it.

`node scripts/manifest.mjs check <libraryDir>` exits 1 when the committed file is stale. It also checks the marked block of `<libraryDir>/AGENTS.md` when that file exists, or of the file named by `--agents <file>`.

## The context file

`node scripts/manifest.mjs agents <libraryDir> --out AGENTS.md` writes the block for the consuming repo. It holds the import path, the lookup rule, the token rule, one table of components, the pattern list and where the rules live. Keep it under about 60 lines. A longer file brings back the cost it removes.

## Storybook MCP

The Storybook MCP docs toolset serves the same facts to an agent from a running Storybook. Use it when the team already runs Storybook. Use the manifest when the agent has only the repo. Both read the same source, so they agree.

## Why

A large context file costs tokens on every turn and still misses the component the agent needs. A lookup costs a few tokens and returns the exact props. The agent also stops guessing, and guessing is what produces a second Button.

## Rulebook seeds

- `ai.lookup-before-build` · review · HIGH · A new component is proposed only after the manifest shows no existing one fits.
- `ai.no-reimplement` · review · HIGH · UI code reuses a library component for each job the manifest lists. It does not rebuild one.
- `ai.manifest-current` · auto · MEDIUM · `manifest.mjs check` exits 0.

## Misfiles

- Token naming belongs in `tokens/architecture.md`.
- The page contract of a showcase belongs in `governance/page-contract.md`.
- Component API shape belongs in `components/api-design.md`.
- Drift of token outputs belongs in `tokens/pipelines.md`.

## See also

- `tooling/storybook.md`
- `governance/rulebook.md`
- `tokens/pipelines.md`
- `components/api-design.md`
