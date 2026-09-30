---
name: classify
description: Classify artifacts, files or names into foundation, token (tier), component, pattern or not-DS, and flag misfiles. Use when the user says "which layer is this", "is this a token or a component", "classify these files", "is this a pattern", "where does this belong", "check for misfiled artifacts", or gives a list of names to sort.
---

# /bauhaus:classify — which layer does it belong to

Sorts artifacts into the four layers using the decision tree. Flags misfiles with ids from the catalogue. Optionally moves them. Lead agent: `bauhaus:design-system-architect`.

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/layers.md` — definitions and boundaries.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/decision-tree.md` — five questions.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/misfiles.md` — ids, how to spot, where it belongs.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/architecture.md` — tier rules.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/model.md` — which layer owns which state.

## Input

Any of: file paths, a folder, component names, token names, CSS class names, a pasted list, or "the working changes". Ask for input if none is given.

## Classes

| Class | Test |
|---|---|
| Foundation | A family and its scale, not one value. |
| Token, primitive token tier | A raw value on a scale. Call sites never use it. |
| Token, semantic tier | An intent that aliases a primitive token. Call sites use it. |
| Token, component tier | A semantic decision scoped to one component. |
| Component | A reusable block that does one job and consumes semantic tokens. |
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
   - Token: `<config.tokens.source>`.
   - Component: `<config.components>`, `<config.stylesheet>`.
   - Foundation: styleguide §Foundations and Storybook `Foundations/*`.
   - Pattern: styleguide §Patterns and Storybook `Patterns/*`.
7. **Flag misfiles.** Match each mismatch to an id in `misfiles.md`. When none fits, write "unlisted" and describe it. Never invent an id.
8. **Report.** One row per artifact. Then the misfile list with a smallest fix each.
9. **Offer to move.** Ask with `AskUserQuestion`: move all, move some, or report only. Default is report only.
10. **Move, when approved.**
   - Token misfiled as raw value: create the token in the source, replace the literal, run `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs build` and `check`.
   - Value found in a pattern: promote it to a semantic token, then reference it.
   - Flow found in a component: extract the flow into a pattern that composes the component.
   - Not-DS found in the DS folder: move it to the product code. Update imports.
   - Keep each move small. Show the diff summary.
11. **Verify.** Re-run the decision tree on moved artifacts. Run the token check. Grep for broken imports and dangling aliases.

## Report format

```
Classification — <scope>
| Artifact | Layer | Tier | Lives in | Fits? | Misfile id |
|---|---|---|---|---|---|
| color.blue.600 | token | primitive token | tokens/color.tokens.json | yes | — |
| .btn { color: #0a5 } | component + raw value | — | styles.css | no | <id> |

Misfiles (<n>)
1. <artifact> — filed as <x>, is <y>. Basis: <decision-tree question>. Fix: <smallest step>. Effort S/M/L.

Moved: <n> · Skipped: <n> · Open questions: <n>
```

## Rules

- Classify by what the thing is, not by its name or folder.
- Each verdict cites the decision-tree question that settled it.
- Never move files without a yes.
- Cap the report at ten misfiles, most severe first. Say how many were cut.
