---
id: tooling/design-tool-sync
title: Design tool sync
shelf: tooling
layer: cross-cutting
owner: ui-designer
tags: [figma, variables, modes, dtcg, tokens-studio, code-connect, source-of-truth]
sources:
  - Figma Help, Variables and modes — https://help.figma.com/hc/en-us/articles/15339657135383
  - Figma Code Connect — https://www.figma.com/code-connect-docs/
  - Design Tokens Community Group format — https://www.designtokens.org/
  - Tokens Studio documentation — https://docs.tokens.studio/
---

# Design tool sync

> Designers work in a design tool. Engineers work in code. Both must use the same values. Pick one place where a value is decided, and copy from it in one direction only.

## Rules

1. Choose one source of truth for tokens and write it down. (Basis: two editable sources drift.)
2. Make the DTCG JSON file the source unless the team cannot edit files. Generate every other artifact from it. (Basis: `tokens/architecture.md`; a file is diffable and reviewable in a pull request.)
3. If the design tool is the source, export to DTCG JSON on a schedule or on publish. Review the export as a diff. (Basis: same.)
4. Never edit a generated file by hand. (Basis: single source of truth.)
5. Map tiers one to one: primitive tokens to a Figma primitive-token collection, semantic tokens to a semantic collection that aliases it. (Basis: `tokens/architecture.md`.)
6. Model each theme as a mode of the semantic collection. Primitive tokens have no modes. (Basis: `tokens/theming.md`; "primitive tokens never change per theme".)
7. Keep names identical in design and code. Map path segments to slashes in Figma and dots in DTCG. (Basis: Nielsen 4 Consistency and standards.)
8. Publish design components from a library file. Keep component names equal to code names. (Basis: shared vocabulary.)
9. Link design components to code with Code Connect, so Dev Mode shows the real snippet. (Basis: one component reference.)
10. Fail the build when a token exists in one side and not the other. (Basis: drift check.)
11. Do not use raw hex or pixel values in design files. Bind fills, strokes, spacing and radius to variables. (Basis: `taxonomy/layers.md`, a raw value belongs in a token.)
12. Record who may change tokens and how a change is reviewed. (Basis: `governance/contribution.md`.)

## Concept map

| Concept | DTCG | Figma | Tokens Studio |
|---|---|---|---|
| One decision | Token with `$value` and `$type` | Variable | Token |
| Group | Nested object | Variable group (slash in name) | Token group |
| Alias | `{color.gray.600}` | Variable alias | `{color.gray.600}` reference |
| Theme or mode | Separate file or `$extensions` | Mode in a collection | Token set and theme |
| Description | `$description` | Variable description | Description |
| Types | `color`, `dimension`, `duration`, `fontFamily`, `fontWeight`, `cubicBezier`, `number`, more | `COLOR`, `FLOAT`, `STRING`, `BOOLEAN` | Token type per set |
| Composite (shadow, typography) | Composite `$type` | Effect style, text style | Composite token |

Figma variables cover four types. Shadows, typography and gradients live in styles, not variables. Keep them as composite tokens in DTCG and map them to styles.

## Options

| Option | Source of truth | Direction | Fit |
|---|---|---|---|
| A. Code first | DTCG JSON in git | Code to Figma | Engineering-led teams. Import with a plugin or the Figma variables API. |
| B. Tokens Studio | JSON in git via Tokens Studio sync | Both, through the plugin | Designers edit, reviewers see diffs in git. |
| C. Figma first | Figma variables | Figma to code | Design-led teams. Export by plugin or REST API. Access to the variables REST API depends on the plan; check current terms. |

Pick A or B when you can. Option C works, but needs a strict export and review step.

## Flow for option A or B

1. Edit tokens (file, or plugin).
2. Open a pull request. Review the value diff.
3. CI runs the token build and the contrast checks.
4. Merge. The build emits CSS, native formats and the Figma import file.
5. Designers pull the update into the library file and publish.

## Code Connect

- Write one mapping per component. It maps Figma component props to code props.
- Keep the variant names the same on both sides, so mapping is trivial.
- Run the publish step in CI after a release.
- Treat a missing mapping as a gap in the four artifacts.

## Why

A brand colour changed in one place and missed in the other is the most common drift. A one-way flow and a drift check make it impossible to miss. Same names in both tools remove the translation step in conversations.

## Rulebook seeds

- `sync.single-source` · review · HIGH · The project names its one source of truth.
- `sync.no-hand-edit-generated` · auto · MEDIUM · Generated token files carry a header and are not edited.
- `sync.names-match` · auto · MEDIUM · Token and component names match across design and code.
- `sync.no-drift` · auto · HIGH · CI fails when a token exists on one side only.
- `sync.figma-bound` · review · MEDIUM · Design files bind to variables, not raw values.
- `sync.code-connect` · review · LOW · Each component has a Code Connect mapping.

## Misfiles

- Token tiers and naming belong in `tokens/architecture.md` and `tokens/naming.md`.
- Build tooling (Style Dictionary, `scripts/tokens.mjs`) belongs in `tokens/pipelines.md`.
- Theme design belongs in `tokens/theming.md`.

## See also

- `tokens/architecture.md`
- `tokens/pipelines.md`
- `tokens/theming.md`
- `governance/contribution.md`
- `tooling/framework-adapters.md`
