---
id: states/model
title: The state model
shelf: states
layer: cross-cutting
owner: design-system-architect
tags: [states, lifecycle, interaction, unhappy-path, state-matrix]
sources:
  - Vince Speelman, "The Nine States of Design", The Startup (Medium), 2015-11-05 — https://medium.com/swlh/the-nine-states-of-design-5bfe9b3d6d85
  - Robin Rendle, "The Nine States of Design", CSS-Tricks, 2021-07-20 — https://css-tricks.com/the-nine-states-of-design/
  - Brandon Lapomeray, "Designing for Every State", Medium, 2024-08-08 — https://medium.com/@lapomeray/designing-for-every-state-a-comprehensive-guide-to-ui-states-in-product-design-77b72cef0034
  - Figma, "Button states" resource library — https://www.figma.com/resource-library/button-states/
  - WCAG 2.2 — https://www.w3.org/TR/WCAG22/
---

# The state model

> A screen is never in one condition. It is empty the first time, busy while it loads, full on a good day, wrong when the user slips, and finished when the job is done. A button is calm, then pointed at, then pressed, then busy. Designing only the good day is designing a tenth of the product. Bauhaus treats every state as a deliverable, not an afterthought.

## Why states are core

Speelman's argument (2015): "Modern UI teams are designing components first", and this "leaves an often glaring hole for users on 'the unhappy path'". His claim is that the nine states "apply to all designs and all components. Even if you make a conscious decision to ignore one of them, following this guideline will ensure that you actually think about the unhappy path."

Rendle (CSS-Tricks, 2021) restates the failure: teams "focus on the ideal state of a component or interface, often leaving the extremely important edge cases forgotten."

The evidence for why this matters is in the heuristics and criteria a missing state breaks:

| Missing state | What breaks | Basis |
|---|---|---|
| Loading | The user cannot tell whether the system heard them. | Nielsen 1, Visibility of system status |
| None (empty) | A barren screen gives no next step. | Nielsen 1; Nielsen 6, Recognition rather than recall |
| Incorrect | A silent red border does not identify the error or suggest a fix. | WCAG 3.3.1 Error Identification (A), 3.3.3 Error Suggestion (AA) |
| Done | The user does not know the action landed and repeats it. | Nielsen 1; WCAG 4.1.3 Status Messages (AA) |
| Disabled without reason | The user cannot learn what unlocks the action. | Nielsen 1, Visibility of system status; Lapomeray 2024 |
| Focus-visible | A keyboard user loses their place. | WCAG 2.4.7 Focus Visible (AA) |
| Too many | Content overflows, truncates without recourse, or cannot be oriented in. | WCAG 1.4.10 Reflow (AA); Nielsen 8, Aesthetic and minimalist design |

## The three axes

States come in two independent axes, plus one popular summary that mixes them. Keep the axes apart: a list can be in the *some* lifecycle state while one of its rows is *hovered* and another is *selected*.

### Axis 1 — Lifecycle states (Speelman's nine)

The condition of a component's **data and task over time**. Details: `lifecycle-states.md`.

| # | State | Speelman's definition (abridged) |
|---|---|---|
| 1 | **Nothing** | The component exists but has not started. First use, not yet activated. |
| 2 | **Loading** | Waiting for data. "In a perfect world, no one would ever see this." |
| 3 | **None** | Initialised but empty. No data, no items. |
| 4 | **One** | The first datum: the first keystroke, a list with one item (or one left). |
| 5 | **Some** | The ideal: data loaded, input given, user familiar. |
| 6 | **Too many** | "The user has overdone it": too many results, too many characters. |
| 7 | **Incorrect** | Something is not right. An error has occurred. |
| 8 | **Correct** | Good to go. The component's needs are satisfied. |
| 9 | **Done** | The correct input "has been received by the application". The user does not have to worry about it any more. |

Speelman: "These states will repeat based on the page, user interaction, updated data, and pretty much any change of your application's state." They are a cycle, not a line.

### Axis 2 — Interaction states

How a **control answers input** at this instant. Details: `interaction-states.md`.

- **Core** (Figma's five essential): default, hover, active/pressed, focus-visible, disabled.
- **Functional**: loading, success, error, selected/toggled.
- **Structural** (from ARIA and native controls): read-only, indeterminate (`aria-checked="mixed"`), expanded (`aria-expanded`), current (`aria-current`), visited, dragging, invalid (`aria-invalid`).

Interaction states combine: focused and hovered, selected and disabled. Their precedence is a design decision; see `interaction-states.md` § Combinations.

### The summary view — Lapomeray's eight

Lapomeray (2024) lists eight states: default, empty, loading, error, disabled, success, interactive/hover, partial. It mixes both axes and is useful as a quick checklist for a card or a screen. Bauhaus does not use it as the model, because it has no *one*, *too many* or *correct*, and it folds all interaction into one cell.

## Crosswalk

| Speelman (lifecycle) | Lapomeray (view) | Interaction states it often shows |
|---|---|---|
| Nothing | Default (before use) | default, disabled |
| Loading | Loading | loading (on the trigger), `aria-busy` |
| None | Empty | — |
| One | Default | — |
| Some | Default, Interactive | hover, focus-visible, active, selected |
| Too many | — (not covered) | — |
| Incorrect | Error | error, invalid |
| Correct | — (not covered) | success (inline) |
| Done | Success | success |
| (some, arriving) | Partial | loading (per item) |
| — | Disabled | disabled |

Two gaps drive most findings: *too many* and *correct* have no cell in the eight-state view, so teams that use it never design them.

## Which layer owns which state

States are not a layer. They attach to the layer they are a state **of**. See `../taxonomy/layers.md`.

| State kind | Owned by | Styled with | Example |
|---|---|---|---|
| Interaction state of a control | The **component** | Semantic **state tokens** (`color.state.hover-layer`, `color.action.primary.hover`, `focus.ring.color`, `color.state.disabled.text`; grammar in `../tokens/naming.md` § State tokens) | Button hover, Checkbox indeterminate |
| The values state tokens take | The **foundation** (colour, elevation, motion) | Primitive tokens | "Hover darkens by one step on the ramp"; "state changes run at `duration.fast`" |
| Lifecycle state of a data-bearing component | The **component** | Semantic tokens | Field incorrect, Select none, Table loading |
| Lifecycle state of a screen or flow | The **pattern** | Composes components, no new token | Empty-results pattern using the EmptyState component |
| Transition between two states | **Motion** foundation + the component | Motion tokens | Toast enter at `motion.duration.slow` |

Classification rules:

1. A state is a **condition**, a variant is a **choice**. `disabled` is never a variant: a Button is primary *and* disabled. Misfile: `misfile.state-as-variant`.
2. A state colour is a semantic token, never a literal. Misfile: `misfile.state-colour-literal`.
3. "Empty state" names two things. The EmptyState **component** is a block (illustration slot, message, action). The empty-results **pattern** decides when it appears and what it says. See `../patterns/empty-and-error.md`.
4. A component that documents only default and hover has shipped a happy path. Misfile: `misfile.state-only-happy-path`.

## Who does what

| Agent | Owns |
|---|---|
| `design-system-architect` | The model, the matrix format, classification of states to layers. |
| `ux-designer` | Lifecycle states: content, behaviour, recovery, announcements (4.1.3). |
| `ui-designer` | Interaction-state visuals, state tokens, contrast in every state, focus-ring appearance. |
| `motion-designer` | Transitions between states; that each state change carries a visible transient. |
| `responsive-reviewer` | That no state depends on hover on touch; that *too many* reflows at 320 px. |

## Rules

1. Every component, pattern and screen has a state matrix before it ships (`state-matrix.md`). (Speelman 2015; `../governance/page-contract.md` §States)
2. Walk all nine lifecycle states and every applicable interaction state. Mark each designed, n/a with a reason, or missing. A cell left blank is missing. (Speelman: "Even if you make a conscious decision to ignore one of them…")
3. Check *none*, *incorrect*, *too many* and disabled-with-reason first: they are the ones that ship missing. (Rendle 2021; Lapomeray 2024 on disabled: users must understand "why an action is disabled")
4. Every lifecycle change the user caused is announced, not only shown. (WCAG 4.1.3 Status Messages, AA)
5. A state is never shown by colour alone. (WCAG 1.4.1 Use of Color, A)

## Rulebook seeds

- `<component>.state.<state>` · review · severity by the table above · "The `<state>` state of `<component>` is designed, or marked n/a with a reason."
- `<component>.states.disabled-explains` · review · MEDIUM · "A disabled control says why and what unlocks it."
- `<component>.states.not-colour-alone` · review · HIGH · "Every state is distinguishable without colour."

## Misfiles

- A "States" page in Storybook that lists colours: that is the colour foundation's state-token table. States belong on each component's page.
- `Button variant="disabled"`: a state filed as a variant.
- An empty-state illustration hardcoded inside a list component: the pattern leaked into the component.

## See also

- `lifecycle-states.md`, `interaction-states.md`, `state-matrix.md`
- `../taxonomy/layers.md`, `../taxonomy/misfiles.md`
- `../patterns/loading.md`, `../patterns/empty-and-error.md`, `../patterns/forms.md`
- `../governance/page-contract.md`
