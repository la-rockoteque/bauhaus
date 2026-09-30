---
id: states/state-matrix
title: The state matrix
shelf: states
layer: cross-cutting
owner: design-system-architect
tags: [states, matrix, storybook, rulebook, audit]
sources:
  - Vince Speelman, "The Nine States of Design", 2015 — https://medium.com/swlh/the-nine-states-of-design-5bfe9b3d6d85
  - Figma, "Button states" (variants per state, "exploding" a screen) — https://www.figma.com/resource-library/button-states/
---

# The state matrix

> A checklist on a clipboard: for every situation the component can be in, one box. Each box is ticked (designed), crossed with a note (does not apply, because…), or empty (forgotten). Empty boxes are the bugs users find for you.

The state matrix is the artifact that makes states real. Every component, pattern and screen has one. It lives in the **States** section of the page (`../governance/page-contract.md`): the grid in the showcase, the reasoning in the guide. The rulebook holds one rule per state.

## Rules

1. Give every component, pattern and screen a state matrix before it ships. (Speelman 2015)
2. Mark each cell `designed`, `n/a` with a reason, or `missing`. A blank cell is `missing`. (Speelman: a conscious decision to ignore a state is still a decision)
3. Back each `designed` cell with a live render in the showcase state matrix, built with realistic data. (Speelman 2015 § Too many; Figma, "Button states")
4. Start from the required-rows table. Justify every `n/a`. (Speelman 2015)
5. Give each applicable state one rulebook rule. (`../governance/rulebook.md`)

## Why

- Speelman (2015): the nine states make a team think about the unhappy path, even when it decides to skip a state. The matrix records that decision.
- A cell with three values keeps a forgotten state visible. An empty box reads as "done" only when nobody looks.
- Figma's advice to "explode" a screen into every state combination is the same practice in a design file.
- The code is the truth. A state that exists in code but not on the page is a finding against the page.

## Shape

Rows are states. Columns are variants (or, for a pattern, the main configurations). Each cell holds one of three values:

| Cell | Meaning | Required |
|---|---|---|
| `designed` | A spec exists and the state matrix renders it live. | Show the live render. |
| `n/a` | This state cannot occur for this component. | A reason. "n/a" alone is `missing`. |
| `missing` | Not designed yet. | Nothing. It is a finding. |

Speelman: "Even if you make a conscious decision to ignore one of them, following this guideline will ensure that you actually think about the unhappy path." The `n/a` reason is that conscious decision, written down.

## Template

```markdown
## States

### Lifecycle
| State | Primary | Secondary | Notes |
|---|---|---|---|
| Nothing   | n/a — a button has no data | n/a | |
| Loading   | designed → Button/Loading | designed | label kept, width locked |
| None      | n/a — no collection | n/a | |
| One       | n/a | n/a | |
| Some      | designed → Button/Default | designed | |
| Too many  | designed → Button/LongLabel | designed | wraps to 2 lines, never truncates |
| Incorrect | designed → Button/Error | designed | inline message below |
| Correct   | n/a — confirmation lives on the field | n/a | |
| Done      | designed → Button/Success | missing | |

### Interaction
| State | Primary | Secondary | Role |
|---|---|---|---|
| Default        | designed | designed | action.primary* |
| Hover          | designed | designed | state.hover-layer |
| Focus-visible  | designed | designed | focus.ring.* |
| Active         | designed | designed | state.pressed-layer |
| Disabled       | designed | designed | disabled.* |
| Selected       | n/a — not a toggle | n/a | |
```

For a pattern such as filtering, the lifecycle rows matter most: *nothing* (no filter applied), *loading* (results updating), *none* (filters exclude everything), *too many* (many chips), *incorrect* (an invalid range).

## Required rows per kind

Not every state applies to every kind. Start from this table, then justify any `n/a`.

| Kind | Lifecycle rows that usually apply | Interaction rows that usually apply |
|---|---|---|
| Action (button, link, menu item) | loading, some, too many (label length), incorrect, done | all core five; selected if a toggle |
| Field (text, select, combobox, date) | nothing (empty, untouched), one, some, too many (length, options), incorrect, correct, done (saved) | all core five; read-only, invalid, required; expanded for combobox |
| Collection (list, table, grid, tree) | all nine | row hover, focus, selected, current; expanded for tree |
| Container (card, dialog, panel) | loading, none, some, too many (content overflow), incorrect | hover and focus only if the whole container is interactive |
| Feedback (toast, banner, alert) | some, too many (stacking), done (dismissed) | focus on its actions |
| Navigation (tabs, breadcrumb, nav, pager) | one, some, too many | hover, focus, active, current/selected, disabled |
| Screen or pattern | all nine | inherited from its components |

## In Storybook

- The showcase renders a state matrix through `DocPage` (`states` prop). Every `designed` cell is a live render, named for the state: `Loading`, `Empty`, `TooMany`, `Error`, `Done`. The cell shows its trigger: the prop, or the CSS selector. Figma's advice to "explode" a screen into every state combination is the same idea in a design file.
- Section 4 has three parts. A summary strip counts the matrix and gives one chip per state: ✓ designed, n/a, ✗ missing. Each chip links to its row.
- **Lifecycle** (`fixtures/lifecycle`): one full-width row per state, in Speelman's order. A table or a dialog gets the width its *too many* state needs.
- **Interaction** (`fixtures/interaction-matrix`): states are rows, variants are columns. A cell names its variant with `variant: 'Vertical'`; a cell with no `variant` is the base column. A variant is never a row (`misfile.state-as-variant`). A dash marks a variant that does not show that state. It is not a finding, because the base column answers the state.
- An `n/a` row is one line with its reason, in its place. A `missing` row is one line with a badge, in its place. The matrix never leaves a cell blank.
- Use realistic data. The *too many* cell uses the longest real value the product has, not a lorem string.
- Use forced-state helpers where the state cannot be reached by hand (hover, focus-visible).
- The guide (`.mdx`) explains why each state looks as it does. It does not repeat the grid.
- A visual regression snapshot of the grid catches a state that silently regresses (`../tooling/visual-regression.md`).

## In the rulebook

- One rule per applicable state: `<component>.state.<state>`, verify `review`, severity from `model.md` § Why states are core.
- Interaction-state rules that the stylesheet settles are `auto`: `<component>.state.focus-visible`, `<component>.states.tokens`, `<component>.states.hover-guarded`.
- An `n/a` cell has no rule. Its reason is in the page.

## Auditing a matrix

1. Build the matrix from the page, the stories and the code. The code is the truth: a `disabled` prop means the disabled row applies.
2. Mark each cell. A state rendered in code but absent from the page is `designed` in code and a finding against the page (`page.states`).
3. Check first the four that ship missing: *none*, *incorrect*, *too many*, disabled-with-reason.
4. For every `designed` cell, check it with its owner: content and announcements (`ux-designer`), tokens and contrast in that state (`ui-designer`), the transition into it (`motion-designer`), touch and 320 px (`responsive-reviewer`).
5. Report a `## States` line:

```
## States
Lifecycle: Nothing n/a · Loading ✓ · None ✗ · One ✓ · Some ✓ · Too many ✗ · Incorrect ✓ · Correct n/a · Done ✗
Interaction: Default ✓ · Hover ✓ · Focus-visible ✓ · Active ✓ · Disabled ✗ (no reason shown) · Selected n/a
```

Each ✗ becomes a finding with its rule id.

## Pitfalls

| Pitfall | Why it fails | Basis |
|---|---|---|
| `n/a` with no reason | Hides a forgotten state as a decision. | Speelman 2015 |
| States designed only in the design file | The code drifts and nobody sees it. | Four artifacts rule, `../governance/contribution.md` |
| One "Error" story for both user and system errors | They need different content and recovery. | `lifecycle-states.md` § Incorrect; Nielsen 9 |
| Matrix per screen but not per component | Each screen reinvents the component's states. | Nielsen 4, Consistency and standards |
| Short sample data | *Too many* never gets tested. | Speelman 2015 § Too many |

## Rulebook seeds

- `<component>.state.<state>` · review · severity from `model.md` · "The `<state>` state is designed, or marked n/a with a reason."
- `<component>.states.tokens` · auto · MEDIUM · "Every state declaration uses a state token, no literal."
- `page.states` · auto · MEDIUM · "Section 4 has a state matrix with no blank cell; `n/a` carries a reason."

## Misfiles

- A state used as a matrix column. Columns are variants. A state is a row (`misfile.state-as-variant`).
- A "States" page that lists state colours. That is the colour foundation's state-token table. States belong on each component's page.
- A matrix that lives only in the design file. It belongs on the page and in Storybook too (four artifacts, `../governance/contribution.md`).

## See also

- `model.md`, `lifecycle-states.md`, `interaction-states.md`
- `../governance/page-contract.md`, `../governance/rulebook.md`, `../tooling/storybook.md`
