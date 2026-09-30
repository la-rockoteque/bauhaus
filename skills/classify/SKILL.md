---
name: classify
description: Classify artifacts, files or names into foundation, component, pattern or not-DS (a token is noted as foundation stored as a primitive or semantic token), and flag misfiles. Use when the user says "which layer is this", "is this a token or a component", "classify these files", "is this a pattern", "where does this belong", "check for misfiled artifacts", or gives a list of names to sort.
---

# /bauhaus:classify — which layer does it belong to

Sorts artifacts into the three layers using the decision tree. Flags misfiles with ids from the catalogue. Optionally moves them. Lead agent: `bauhaus:design-system-architect`.

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/layers.md` — definitions and boundaries.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/decision-tree.md` — five questions.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/misfiles.md` — ids, how to spot, where it belongs.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/architecture.md` — tier rules.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/model.md` — which layer owns which state.

## Input

Tokens are not a layer. A lone token is classified under the foundation it belongs to, with its tier as an attribute. Docs or folders that treat tokens as a layer are `misfile.token-as-layer`.

Any of: file paths, a folder, component names, token names, CSS class names, a pasted list, or "the working changes". Ask for input if none is given.

## Classes

| Class | Test |
|---|---|
| Foundation | A family and its scale. Its decisions are stored as tokens: foundation (stored as primitive tokens) is a raw value on a scale, and call sites never use it; foundation (stored as semantic tokens) is an intent that aliases a primitive token, and call sites use it. Colour: palette (primitive), colors (role scales), roles (semantic, per theme). |
| Component | A reusable block that does one job and consumes semantic tokens (roles for colour). Its optional component tokens are part of it: component (stored as component tokens). |
| Pattern | A composition of components for a recurring need. No token, no raw value. |
| Not-DS | Product feature, page, business logic, or one-off. |

## Steps

1. **Read the config** for paths. Missing: infer, and suggest `/bauhaus:init`.
2. **Collect the artifacts.** Expand folders. For "working changes", list changed files and their new names and values.
3. **Split multi-layer files.** A stylesheet may hold tokens and components. A component file may hold a pattern. Classify each part, not the file.
4. **Run the decision tree** on each artifact. Record the answer to each of the five questions in one clause.
5. **Classify states.** A state has no layer of its own. It belongs to the layer it is a state of (`${CLAUDE_PLUGIN_ROOT}/knowledge/states/model.md` § Which layer owns which state).
   - A state filed as a variant or a prop (`variant="disabled"`): `misfile.state-as-variant`.
   - A state colour written as a literal: `misfile.state-colour-literal`.
   - A component or pattern that documents only default and hover: `misfile.state-only-happy-path`.
   - A lifecycle state of a screen belongs to a pattern. An interaction state belongs to its component.
6. **Compare with where it lives.** Location rules:
   - Foundation, with its tokens: `<config.tokens.source>` (`foundations/<name>/`); themes in `themes/<name>/`.
   - Component: `<config.components>`, `<config.stylesheet>`.
   - Foundation: styleguide §Foundations and Storybook `Foundations/*`.
   - Pattern: styleguide §Patterns and Storybook `Patterns/*`.
7. **Flag misfiles.** Match each mismatch to an id in `misfiles.md`. When none fits, write "unlisted" and describe it. Never invent an id.
8. **Report.** One row per artifact. Then the misfile list with a smallest fix each.
9. **Offer to move.** Ask with `AskUserQuestion`: move all, move some, or report only. Default is report only.
10. **Move, when approved.**
   - Token misfiled as raw value: create the token in the source, replace the literal, run `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs build` and `check`.
   - Value found in a pattern: promote it to a semantic token (a role, for colour), then reference it.
   - Component reading `palette.*` or `colors.*`: `misfile.palette-at-call-site`. Point it at a role.
   - Theme with part of the roles, or palette rewrites: `misfile.theme-not-sibling`.
   - Flow found in a component: extract the flow into a pattern that composes the component.
   - Not-DS found in the DS folder: move it to the product code. Update imports.
   - Keep each move small. Show the diff summary.
11. **Verify.** Re-run the decision tree on moved artifacts. Run the token check. Grep for broken imports and dangling aliases.

## Report format

```
Classification — <scope>
| Artifact | Layer | Stored as (tier) | Lives in | Fits? | Misfile id |
|---|---|---|---|---|---|
| palette.dark-blue.600 | foundation (colour) | primitive token | foundations/color/palette.tokens.json | yes | — |
| .btn { color: #0a5 } | component + raw value | — | styles.css | no | misfile.raw-value-in-component |

Misfiles (<n>)
1. <artifact> — filed as <x>, is <y>. Basis: <decision-tree question>. Fix: <smallest step>. Effort S/M/L.

Moved: <n> · Skipped: <n> · Open questions: <n>
```

## Rules

- Classify by what the thing is, not by its name or folder.
- Each verdict cites the decision-tree question that settled it.
- Never list "token" as a layer. Write the foundation and note the tier.
- Never move files without a yes.
- Cap the report at ten misfiles, most severe first. Say how many were cut.
