---
id: taxonomy/decision-tree
title: Classification decision tree
shelf: taxonomy
layer: cross-cutting
owner: design-system-architect
tags: [classification, foundation, token, primitive, pattern, edge-cases]
sources:
  - Bauhaus architecture contract — docs/architecture.md § The four layers
  - moship design-system guide §6 "Adding a new primitive" (kit/styleguide/design-system.md)
  - W3C Design Tokens Community Group, Design Tokens Format Module — https://www.w3.org/community/design-tokens/
---

# Classification decision tree

> Ask five yes/no questions, in order. Stop at the first "yes". The answer tells you which of the four layers a thing belongs to. If the thing is really several things glued together, split it first and classify each part. This takes one minute and prevents most of the mess in a design system.

Definitions are in [layers.md](layers.md). Read them once. Then use this tree.

## Rules

1. Split a compound artifact into parts before you classify. Classify each part alone. (A focus ring is a rule, a value and a state. One label hides two of them.)
2. Ask the questions in order. Stop at the first "yes". (The order runs from smallest unit to largest, so a small unit is never mistaken for a big one.)
3. Classify by what the artifact **is**, not by where it lives or how big its file is. (A composed component in `components/` may still be a pattern.)
4. A "no" on all five questions means the artifact is not part of the design system. Say so. (Not everything needs to be in the system.)
5. When two answers seem possible, choose the lower layer only if the artifact has no parts. Otherwise choose the higher layer and list the parts. (A thing with parts is a composition.)
6. Record the classification and the reason in one line in the report. (A classification with no reason cannot be reviewed.)

## The tree

```
Q1  Is it ONE named value, or an alias to one?
      yes → TOKEN. Go to "Which tier?"
      no  ↓
Q2  Is it a family, a scale, or a rule that GOVERNS values?
      yes → FOUNDATION.
      no  ↓
Q3  Is it a reusable block with ONE job and its OWN API?
      yes → PRIMITIVE. Check the three gates.
      no  ↓
Q4  Does it COMPOSE primitives to answer a recurring user need?
      yes → PATTERN.
      no  ↓
Q5  Else → page or feature code. Not the design system.
```

### Q1. Is it one named value?

Signals: it has a name and a single value or a single alias. Two people can point at the value and agree it is the same value. Examples: `#244b7b`, `12px`, `150ms`, "the muted text colour".

Not a value: a set of values, a rule about values, a block of markup.

**Which tier?**

| Question | Yes → | Example |
|---|---|---|
| Is it a raw value on a scale, with no intent? | Tier 1, primitive token | `color.blue.600 = #244b7b` |
| Does it say what the value is **for**, across the system? | Tier 2, semantic token | `color.text.muted` |
| Does it exist for one primitive only? | Tier 3, component token | `button.radius` |

If you cannot decide between tier 1 and tier 2, ask: "Would a dark theme change this?" If yes, it is tier 2 (an intent). If no, it is tier 1.

### Q2. Is it a family, scale or rule?

Signals: it answers "which values exist and why". It has steps, ratios, limits or constraints. It would produce tokens if you wrote it down. Examples: "4px grid, 12 steps", "two elevation rungs", "text pairs reach 4.5:1".

Not a foundation: a component's spacing, a theme, a brand palette with no scale logic.

A foundation is one of: colour, typography, spacing, radius, border, elevation, z-index, motion, iconography, density, breakpoints. A twelfth family needs a proposal before any token exists (see [../governance/contribution.md](../governance/contribution.md)).

### Q3. Is it a reusable block with one job and its own API?

Signals: it renders UI. It has props or slots. It has states. It has one sentence of purpose with no "and".

**The three gates for a new primitive** (moship guide §6):
1. It appears in **two or more** places. One-off styles stay local.
2. It is **structural**, not incidental. A "callout that happens to be blue" is incidental. A quantity stepper is structural.
3. Its API has **one job**. Five modifiers for five unrelated cases means split it.

If gate 1 fails, it is page code today. Keep it local and note the candidate.

### Q4. Does it compose primitives for a recurring need?

Signals: it names a user need ("find one item among many", "tell the user nothing is here yet"). It uses two or more primitives. It defines what happens across them. It introduces no value of its own.

If it introduces a value, stop. The value belongs in a token, and the look belongs in a primitive.

### Q5. Else

Page code, feature code, or content. It may use the design system. It is not part of it. Do not add it to the library, the styleguide or Storybook `Components/*`.

## Worked examples

| # | Artifact | Layer | Reason |
|---|---|---|---|
| 1 | `#244b7b` written in a component | Not a layer: a misfile | A raw value outside the token source. Make it a token (see [misfiles.md](misfiles.md)). |
| 2 | `color.blue.600` | Token, tier 1 | One raw value on the blue ramp. No intent. |
| 3 | `color.text.muted` | Token, tier 2 | An intent. Aliases a tier-1 token. A dark theme remaps it. |
| 4 | `button.radius` | Token, tier 3 | Scoped to one primitive. |
| 5 | "Spacing is a 4px grid, 12 steps" | Foundation | A scale with a rule. |
| 6 | `space.3 = 12px` | Token, tier 1 | One value on the spacing scale. |
| 7 | **Focus ring** | Split into three | Foundation rule (a visible indicator, 3:1 against neighbours, WCAG 2.4.7 AA). Tokens (`color.focus.ring`, `border.width.focus`, `space.focus.offset`). Primitive state (each primitive's `:focus-visible` state uses them). No single layer owns it. |
| 8 | **Brand colour** | Token, tier 1 plus tier 2 | `color.blue.600` is the raw value. `color.action.primary → {color.blue.600}` is the intent. The brand ramp itself belongs to the colour foundation. |
| 9 | Colour palette page | Foundation (doc) plus token table | The page explains the ramp logic (foundation) and lists tokens (generated table). Do not let the table replace the reasoning. |
| 10 | **Dark mode** | Theme, not a foundation | A set of semantic-token overrides. It has no scale of its own. Primitive tokens and primitives do not change. |
| 11 | **Breakpoints** | Foundation | A family with named steps and a reflow rule. Each `breakpoint.md` is a token. |
| 12 | A media query `@media (min-width: 768px)` in a component | Misfile | A raw breakpoint value. Use the token or the named breakpoint. |
| 13 | **Icon set** (all glyphs, grid, stroke) | Foundation (iconography) | A family with a grid and rules. |
| 14 | `Icon` component | Primitive | One job: render one glyph at a token size, with a label or as decorative. |
| 15 | A single glyph "trash" | Asset in the icon set | Not a token, not a primitive. It is a member of the iconography family. |
| 16 | **Z-index scale** | Foundation | A family with named layers. `z.modal` is a tier-1 token. |
| 17 | `z-index: 9999` in a component | Misfile | A raw value that bypasses the scale. |
| 18 | `Card` | Primitive | One job: group related content on a surface. Own API. |
| 19 | `ListCard` used once, on the orders page | Page code | Fails gate 1. It may become a variant of `Card` or a pattern later. |
| 20 | `ListCard` used in four places, same anatomy as `Card` plus a slot | Variant of `Card` (primitive) | A slot on the existing API. Not a new primitive unless it has a different job. |
| 21 | `EmptyState` block with a slot for an illustration, a title, a hint and one action, used on many screens | Primitive | One job: fill the space where data would be, with a slot API. It takes semantic tokens. |
| 22 | "Empty state" as a screen: when to use it, what to write, how to recover, which primitives to combine | Pattern | The recipe. It composes the `EmptyState` primitive with `Heading`, `Text` and `Button`. |
| 23 | A blank `<div class="empty">` with its own colours and padding | Misfile | A pattern with its own look. Move the look to primitives and tokens. |
| 24 | **Form layout** (label above input, 16px between fields, error under field) | Pattern | Composes `Field`, `Input`, `Label`, `ErrorText`. Spacing comes from tokens. |
| 25 | `Field` (label + control + hint + error wired with `aria-describedby`) | Primitive | One job: pair a control with its label and messages. |
| 26 | **Toast** | Primitive | One job: a transient, non-blocking message. Own API (`tone`, `duration`, `action`). |
| 27 | **Notification pattern** (when to toast, when to banner, when to block with a dialog) | Pattern | A decision recipe over `Toast`, `Banner` and `Dialog`. |
| 28 | **Page header** (title, breadcrumb, actions) used on every page | Pattern | Composes `Heading`, `Breadcrumb`, `Button`. A recurring need. |
| 29 | Page header for the admin dashboard only | Page code | One place. Fails gate 1. |
| 30 | `--ds-blue` | Misfile | A semantic-looking name that carries a colour. Rename by intent (`color.action.primary`). |
| 31 | "Loading" | Pattern | A recurring need with rules: skeleton, spinner, progress. It composes `Skeleton`, `Spinner`, `ProgressBar`. |
| 32 | `Spinner` | Primitive | One job: show indeterminate activity. |
| 33 | "Density: compact / comfortable" | Foundation (density) plus theme | The two modes and the target-size floor are the foundation. Switching mode at runtime is a theme over semantic tokens. |
| 34 | `--ds-space-inline-gap` | Token, tier 2 | A spatial intent aliasing `space.2`. |
| 35 | An animation "the modal slides up" | Split | Foundation: motion durations and easings. Token: `motion.duration.base`. Primitive behaviour: `Dialog` uses it. |
| 36 | "Text on brand background must pass 4.5:1" | Foundation rule (a constraint) | A rule that governs colour values. It is checked on semantic-token pairs. |
| 37 | Data table with sorting, paging and empty state | Pattern | Composes `Table`, `Pagination`, `EmptyState`. |
| 38 | `Table` (semantic markup, row and header states) | Primitive | One job: tabular data with headers. |
| 39 | Checkout screen | Page code | A feature. Uses the system. |
| 40 | Hover colour of the primary button | Token, tier 2 | `color.action.primary.hover`. A state token. The state itself belongs to `Button`. |
| 41 | `disabled` look of an input | State of `Input` | An interaction state. It reads `color.text.disabled` and `color.surface.disabled`. Not a variant. |
| 42 | "Selected" row in a table | State of `Table` row | An interaction state. Styled by `color.surface.selected`. Not a new primitive. |
| 43 | "Too many results" message with a refine hint | Lifecycle state, handled by a pattern | Part of the Filtering pattern. The `Table` primitive shows the rows. |
| 44 | "Incorrect" (validation error) on a field | Interaction state of `Field`, plus a pattern for the summary | The field shows the error state. The form pattern tells how to summarise errors. |
| 45 | Company logo file | Brand asset, outside the four layers | Not a value, rule, block or recipe. Store it as an asset. |

## Edge cases and how to settle them

**A thing is used once but looks reusable.** Keep it as page code. Add a line to the candidate list. Promote at the second use. (Moship guide §6, gate 1.)

**A thing is used twice but has two jobs.** Do not promote it as one primitive. Split it into two, or leave both as local code. (Gate 3.)

**A primitive and a pattern share a name.** `EmptyState` the block is a primitive with slots. "Empty state" the screen recipe is a pattern that composes it. Name the layer in the docs page ("Primitive: EmptyState", "Pattern: Empty state"). Do not put the recipe under `Components/*`.

**A state looks like a variant.** Ask: "Does the user or the data put it in this condition, or does a designer choose it?" User or data: a state (disabled, selected, loading, error). Designer: a variant (primary, secondary, danger). A variant is chosen at design time. A state changes at run time. See [../states/model.md](../states/model.md).

**A state needs a colour.** Add or reuse a semantic state token. Do not write a literal in the primitive's state rule.

**A token has no foundation.** The family does not exist yet. Stop. Propose the foundation first (rationale, scale, limits). Then add the token. This is "propose before populate".

**A theme wants a new token.** Add the semantic token in the base set. Then override it in the theme. A theme file never introduces a name that the base does not have.

**A brand asks for a value off the scale.** Add a step to the scale with a reason, or refuse. Do not add a one-off token. A scale with holes is not a scale.

## Reporting a classification

Use one line:

```
classified: <artifact> → <layer> (<tier if token>) — <reason in ≤ 15 words>
```

Example:

```
classified: focus ring → split: foundation rule + 3 tokens + primitive states — one look, three homes
```

## Rulebook seeds

- `taxonomy.classified` · review · LOW · Every new artifact in a PR carries a one-line classification.
- `taxonomy.compound-split` · review · MEDIUM · A compound artifact is split before it is filed.
- `taxonomy.primitive-gates` · review · MEDIUM · A new primitive states its two call sites, its structural reason and its one job.

## Misfiles

- Filing by folder. "It is in `components/` so it is a primitive." Classify by nature. See [misfiles.md](misfiles.md), `misfile.pattern-promoted-to-primitive`.
- Modelling a state as a variant (`variant="disabled"`). See `misfile.state-as-variant`.
- Treating a theme as a foundation. See `misfile.theme-as-foundation`.
- Treating "brand" as a layer. Brand is an intent expressed as tokens plus a colour ramp.

## See also

- [layers.md](layers.md) — the definitions behind each answer.
- [misfiles.md](misfiles.md) — what goes wrong and how to fix it.
- [plain-language.md](plain-language.md) — explaining a classification to a non-designer.
- [../tokens/architecture.md](../tokens/architecture.md) — tiers and aliasing.
- [../states/model.md](../states/model.md) — interaction and lifecycle states.
- [../tokens/theming.md](../tokens/theming.md) — what a theme may change.
- [../governance/contribution.md](../governance/contribution.md) — the gates in the contribution flow.
