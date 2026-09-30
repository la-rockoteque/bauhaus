---
id: taxonomy/layers
title: The three layers
shelf: taxonomy
layer: cross-cutting
owner: design-system-architect
tags: [foundation, component, pattern, token, dependency, classification]
sources:
  - Bauhaus architecture contract — docs/architecture.md § The three layers
  - W3C Design Tokens Community Group, Design Tokens Format Module (DTCG) — https://www.w3.org/community/design-tokens/
  - Atlassian, Design tokens — https://atlassian.design/foundations/design-tokens/ ("Design tokens are the new way to apply visual foundations")
  - Material 3, Foundations — https://m3.material.io/foundations (design tokens sit inside Foundations)
  - Vince Speelman, "The Nine States of Design", 2015 — https://medium.com/swlh/the-nine-states-of-design-5bfe9b3d6d85
---

# The three layers

> A design system has three kinds of thing. A foundation is a rule book for one kind of value, like "spacing goes up in steps of 4". Its values are written down as tokens, like "space 3 is 12 pixels"; the tokens are the written form, not a fourth kind of thing. A component is a small reusable part with one job, like a button. A pattern is a recipe that combines parts to solve a common need, like an empty state. Each kind has its own home and its own checks. Never put one kind in another kind's home.

Use this file first. Every agent classifies an artifact here before it creates, reviews or advises on it. To classify fast, use [decision-tree.md](decision-tree.md). To spot errors, use [misfiles.md](misfiles.md).

## Rules

1. Classify every artifact into exactly one layer before you touch it. (A thing in two layers has no owner and no check.)
2. Dependencies point one way: pattern → component → foundation. Inside the stored tokens: component token → semantic token → primitive token. Never point back. (Each layer must change without breaking the layers above it.)
3. A raw value (`#244b7b`, `12px`, `150ms`) appears in the token source only, at the primitive tier. (A raw value elsewhere cannot be themed, audited or renamed in one place.)
4. A foundation defines the family and the scale. Its tokens store the scale. (A token with no scale is an arbitrary number.)
5. A call site uses semantic tokens, never primitive tokens. For colour, that means roles: never `palette.*` or `colors.*`. (Primitive tokens carry no intent; a theme cannot remap them safely.)
6. A component has one job and its own API. If it has two jobs, split it. (Gate 3: [contribution](../governance/contribution.md).)
7. A pattern adds no token, no raw value and no new visual style. If it needs one, the gap is in a component or a foundation. (A pattern is composition, not decoration.)
8. Layout may be local. Look may not. A component-scoped style may place things; it may not colour, round, shade or set type.
9. Ship the four artifacts together for a foundation or a component: tokens, guide, showcase, rulebook entries. (Ubiquitous language: Four artifacts.)
10. A theme is a full set of role values. It never changes the palette or the colors. (Ubiquitous language: Theme.) (Ubiquitous language: Theme.)
11. A state is not a layer. An interaction state belongs to its component. A lifecycle state belongs to a pattern or to a data-bearing component. (A state describes a moment of one thing; it has no owner of its own.)
12. "Disabled", "selected" and "loading" are states, never variants. (A variant is a chosen look; a state is a condition the user or the data puts the block in.)
13. Tokens are not a layer. They are the DTCG storage and delivery of foundation and component decisions. (Atlassian: "Design tokens are the new way to apply visual foundations"; Material 3 lists design tokens inside Foundations. Evidence: `docs/research/tokens-vs-foundations.md`.)

## The layers in one table

| | Foundation | Component | Pattern |
|---|---|---|---|
| **Answers** | Which value families exist? On what scale? Why? | Which block does one job? | How do blocks combine for a recurring need? |
| **Is** | A family, its scale and its rules; stored as tokens | A UI building block with an API | A composition of components |
| **Unit** | "Spacing runs on a 4px grid, 12 steps" | `Button`, `Field`, `Dialog` | Filtering, empty state, wizard |
| **May contain** | Scale, ratios, rationale, usage rules, limits, a11y constraints, its tokens | Markup, semantic-token use, states, props, slots, behaviour, ARIA, optional component tokens | Components, layout, copy rules, flow, state logic |
| **May not contain** | Component names, screen names, one-off values | Raw values, business flows, page layout | New tokens, raw values, new visual style |
| **Depends on** | Nothing in the system (research, WCAG, brand intent) | Foundations, through semantic tokens (roles for colour) | Components; layout tokens |
| **Changes when** | The scale or its rules change | Job or API changes | The user need changes |
| **Lives in** | `foundations/<name>/`; styleguide §Foundations; Storybook `Foundations/*` | `primitives/` or `components/<family>/`; styleguide §Components; Storybook `Components/*` | `patterns/`; styleguide §Patterns; Storybook `Patterns/*` |
| **Checked by** | Review rules (rationale exists, scale is closed) and auto rules on its tokens (no raw value, alias resolves, name grammar) | Auto and review rules in the rulebook | Review rules; composition checks |
| **Breaking change** | Change the scale; rename or remove a token; change a value's meaning | Remove or rename a prop; change a job | Change the recipe's outcome |

## Foundation

A foundation is a **system-wide value family**. The families are: colour, typography, spacing, radius, border, elevation, z-index, motion, iconography, density and breakpoints.

A foundation is a set of decisions about a family: its scale, its steps, its limits and its reason. The decisions are stored as tokens (see Tokens below). A list of values with no scale and no reason is not a foundation.

A foundation contains:
- The **scale**: the closed set of steps and how they grow (4px grid, 1.25 type ratio, two elevation levels).
- The **rationale**: why this scale (a11y floor, brand intent, measured research).
- The **usage rules**: which step means what, and which steps must not be mixed.
- The **constraints**: contrast pairs that must pass, minimum target sizes, reduced-motion behaviour.

A foundation does not contain:
- A component name. "Button padding" belongs to the component.
- A screen or a feature. "Checkout spacing" is page code.
- A value with no place on the scale.
- A theme. Dark mode is a sibling theme that maps the same roles to other colours, not a family.

A foundation is done when its scale is closed (one can say "no other step exists") and its reason is written.

## Tokens: how foundation decisions are stored

A token is **one named design decision**, stored as DTCG JSON. Tokens are not a layer. They are the storage and delivery format of foundation decisions (and of optional component decisions). A token is the only place a raw value may appear. A scale (which values exist, and why) is a foundation; a token is one member of it.

Three tiers live inside the format:

| Tier | Name | Holds | Used by |
|---|---|---|---|
| 1 | Primitive token | A raw value on a scale: `space.3 = 12px`, `duration.150 = 150ms`, `palette.dark-blue.600 = #244b7b` | Semantic tokens only |
| 2 | Semantic token | An intent that aliases a tier-1 token: `space.inset.md → {space.3}`; for colour, a role: `text.muted` | Components, patterns, call sites |
| 3 | Component token | A semantic token scoped to one component: `button.radius → {radius.control}` | That component only. Optional. |

Direction of aliasing: component token → semantic token → primitive token. A tier never aliases upward or sideways into a component.

A token contains: `$value` (raw or alias), `$type`, `$description`. The description says the intent in plain words.

A token does not contain:
- Behaviour, markup or selectors.
- A business word (`shipment-late-red`). Name the intent (`status.error`).
- Its own value in its name (`space.12px`) at tier 2. A tier-1 name may carry a scale step or a hue (`dark-blue.600`), not a raw value.
- A value with no foundation family to sit in. Propose the foundation first.

### Colour: palette, colors, roles

Colour adds one step to the tiers. The chain is: palette → colors → roles (per theme) → component.

| Name | File | Holds | Who uses it |
|---|---|---|---|
| **Palette** | `foundations/color/palette.tokens.json` | Named hues with grades: `palette.scarlet.600`. Primitive tier. | `colors` only. Never a component. |
| **Colors** | `foundations/color/colors.tokens.json` | Role scales (`colors.primary.600 → {palette.dark-blue.600}`; secondary, error, success, warning, info, neutral). The rebrand point. | Themes; charts that need a scale. |
| **Roles** | `themes/<name>/<name>.tokens.json` | Flat roles by purpose: `text.default`, `surface.raised`, `action.primary`, `status.error`. Semantic tier. | Components. |

In Carbon, `colors` names the palette. Here it names the role scales. This file defines the word once; see [../tokens/architecture.md](../tokens/architecture.md).

## Component

A component is **a reusable UI building block owned by the design system**. It has one job and its own API (props, slots, states).

A component contains:
- Markup and the states it needs (default, hover, focus, active, disabled, loading, error, selected — see `../components/anatomy-and-states.md`).
- References to semantic tokens (roles for colour) and optional component tokens for every visual property.
- Behaviour and accessibility: keyboard contract, roles, focus handling.
- Layout of its own parts.

A component does not contain:
- A raw value. Every colour, size, radius, shadow and duration is a token.
- A palette or colors reference. A component reads roles only.
- A business flow. `ShipmentApproveButton` is feature code that uses `Button`.
- Page layout or routing.
- Two unrelated jobs behind a `type` prop.

A new component passes three gates: it appears in **two or more** places; it is **structural**, not incidental; its API has **one job**. See [../governance/contribution.md](../governance/contribution.md).

### Primitives: base building blocks

A primitive is a component that other components are built from: `Box`, `Text`, `Icon`, `VisuallyHidden`. It lives in `primitives/`. It follows every rule of a component. It is a kind of component, not a layer. A doc or a folder that treats "primitives" as a layer next to components is a misfile (`misfile.primitive-as-layer`). The word "primitive" also names the tier-1 token tier (primitive token). That is a different thing. A doc or folder that treats tokens as a layer is `misfile.token-as-layer`.

## Pattern

A pattern is **a composition of components that answers a recurring user need**. It is a recipe, not an ingredient.

A pattern contains:
- Which components to combine, in what order and hierarchy.
- Layout using foundation tokens (spacing, breakpoints).
- Behaviour across parts: what happens on empty, loading, error, success.
- Content rules: what the copy must say.
- The user need in one sentence.

A pattern does not contain:
- A new token or a raw value.
- A new visual style. If two components need a look that does not exist, add it to a component.
- Feature data or business rules.

A pattern may ship as documentation only, as a composed component, or both. Shipping as a composed component does not change its layer. The test is the need it serves, not the file it lives in.

## States

A state is a condition of a block at one moment. States are not a layer. They cut across the three. The full model is in [../states/model.md](../states/model.md).

| Kind | Examples | Belongs to | Styled by |
|---|---|---|---|
| **Interaction state** | default, hover, focus, active, disabled, selected, loading, error | The component that shows it | Roles (`action.primary-hover`, `disabled.text`, `state.hover-layer`), never a literal |
| **Lifecycle state** | Speelman's nine: nothing, loading, none (empty), one, some, too many, incorrect, correct, done | A pattern, or a component that holds data (`Table`, `List`) | The components the pattern composes |

Consequences:
- Each component documents its states in its state matrix ([../states/state-matrix.md](../states/state-matrix.md), [../states/interaction-states.md](../states/interaction-states.md)).
- A lifecycle state (none, too many, incorrect) is answered by a pattern. See [../states/lifecycle-states.md](../states/lifecycle-states.md).
- "Empty state" as a screen is a pattern. It composes the `EmptyState` component with a heading, a hint and an action.
- `disabled` is a prop or a state of `Button`. `Button variant="disabled"` is a misfile.
- A state role is a semantic token (tier 2). Its name says the state (`hover`, `disabled`), its value aliases `colors.*`.

## Dependency direction

```
pattern
  ↓ composes
component
  ↓ consumes (through optional component token)
foundation, stored as
  semantic token (roles for colour)
    ↓ aliases
  primitive token (colour: colors → palette)
```

The token tiers are the inside of the foundation, not rungs of their own.

Consequences:
- Rename a primitive token: only semantic tokens change.
- Rebrand: edit `colors.tokens.json`. No theme and no component is edited.
- Change a theme: only role values change. No component is edited.
- Change a component: patterns may need review. Foundations are untouched.
- Change a foundation scale: every layer above is at risk. This is a breaking change (see [../governance/versioning.md](../governance/versioning.md)).

## Where each layer lives in the library

Each thing gets one slice, a folder named after it that holds all its files. `docs/library.md` is the truth.

| Layer | Slice | Its tokens |
|---|---|---|
| Foundation | `foundations/<name>/` | `<name>.tokens.json`: primitive and semantic tiers. Colour: `palette.tokens.json` and `colors.tokens.json`. |
| Theme (part of the colour foundation's delivery) | `themes/light/`, `themes/dark/` | Roles, aliasing `colors.*`. |
| Component | `primitives/<name>/` or `components/<family>/<name>/` | Optional component tokens, aliasing roles. |
| Pattern | `patterns/<name>/` | None. No styles either. |

## Worked examples per foundation family

Each row follows one family through the three layers.

| Family | Foundation (rule and scale) | Stored as tokens | Component that uses it | Pattern that uses it |
|---|---|---|---|---|
| **Colour** | Palette of named hues, role scales over it, roles per theme. Text pairs must reach 4.5:1 in each theme (WCAG 1.4.3, AA). Colour never carries meaning alone (1.4.1, A). | `palette.gray.600 = #5a6b80` (tier 1); `colors.neutral.600 → {palette.gray.600}`; `text.muted → {colors.neutral.600}` (role, per theme) | `Tag` reads `status.error` and shows an icon and a word | Form error summary: uses `Banner` and `Field`; adds no colour |
| **Typography** | One sans family, one mono family. Scale of six sizes. Mono is for scannable data (IDs, quantities). | `font.family.body`, `font.size.md = 14px`, `font.lineHeight.normal = 1.55` | `Heading` uses `font.size.xl`; `Code` uses `font.family.mono` | Data table: numeric columns use the mono role |
| **Spacing** | 4px grid, 12 steps. Gaps between related items are smaller than gaps between groups. | `space.1 = 4px`, `space.3 = 12px`; `space.inline.gap → {space.2}` | `Field` uses `space.stack.label` between label and input | Filtering bar: uses `space.inline.gap` between controls |
| **Radius** | Three radii: control, container, pill. A radius says what kind of thing an element is. | `radius.control = 6px`, `radius.container = 10px` | `Button` and `Input` use `radius.control`; `Card` uses `radius.container` | Empty state: inherits both from its components |
| **Border** | Two widths, two line colours (default, soft). Non-text boundaries reach 3:1 (1.4.11, AA). | `border.width.default = 1px`, `border.default` | `Input` draws `border.width.default` in `border.default` | Data table: row dividers use `border.soft` |
| **Elevation** | Two rungs above the flat card: floating menu, modal. No third rung. Level 0 is a bordered card. | `shadow.1`, `shadow.2`; `elevation.overlay → {shadow.2}` | `Dialog` uses `elevation.overlay` | Wizard in a dialog: inherits it from `Dialog` |
| **Z-index** | Named layers, not numbers: base, sticky, overlay, modal, toast. Elevation is meaning; z-index is stacking. | `z.sticky = 100`, `z.modal = 300` | `Dialog` uses `z.modal`; `Toast` uses `z.toast` | Page shell with sticky header: uses `z.sticky` through `Header` |
| **Motion** | Three durations (fast, base, slow) and two easings. Motion has a job: feedback, orientation, continuity. Honour `prefers-reduced-motion`. | `motion.duration.fast = 120ms`, `motion.easing.standard` | `Tooltip` fades in with `motion.duration.fast` | Step transition in a wizard: uses `motion.duration.base` |
| **Iconography** | One icon set, one grid (24px), stroke weight fixed, two sizes. Icons never carry meaning alone. | `icon.size.sm = 16px`, `icon.size.md = 24px` | `Icon` (a base component in `primitives/`) wraps the set and sizes it | Status row: `Icon` plus label from `Tag` |
| **Density** | Two modes: comfortable and compact. Target size floor of 24px (WCAG 2.5.8, AA). | `density.control.height` (differs per mode) | `Button` height reads `density.control.height` | Data table in compact mode: rows shrink; controls stay above the floor |
| **Breakpoints** | Four named widths. Mobile first. Content reflows at 320px (WCAG 1.4.10, AA). | `breakpoint.md = 768px` | `Grid` component switches columns at `breakpoint.md` | Two-column workspace: stacks below `breakpoint.md` |

Note the pattern column. No pattern introduces a value. It reuses values through components.

## Rulebook seeds

- `layers.token.no-raw-outside` · auto · HIGH · No raw colour, length or duration outside the token source.
- `layers.token.call-site-semantic` · auto · MEDIUM · Call sites reference semantic tokens (roles for colour), not primitive tokens, `palette.*` or `colors.*`.
- `layers.component.tokens-only-look` · auto · MEDIUM · A component sets look through tokens only.
- `layers.pattern.no-own-style` · review · MEDIUM · A pattern adds no token and no new visual style.
- `layers.foundation.rationale-present` · review · LOW · Each foundation page states its scale and its reason.
- `layers.four-artifacts` · auto · MEDIUM · Each component has tokens, a guide, a showcase and rulebook entries.
- `layers.state-not-variant` · review · MEDIUM · Disabled, selected and loading are states, not variants.

## Misfiles

What people wrongly file here, and where it belongs. The full catalogue is in [misfiles.md](misfiles.md).

- A list of every colour in use, filed as "the colour foundation". It is a palette table. The foundation is the palette, the colors, the roles and the rules that link them.
- A `tokens/` folder or a "Tokens" section filed as a fourth layer next to foundations (`misfile.token-as-layer`). Tokens are how a foundation is stored.
- A component's hover colour filed as a foundation. It is a role (`action.primary-hover`) or a component token, used by a component state.
- A reusable "card with title and action" filed as a pattern because it has three parts. If it has one job and one API, it is a component.
- A page header filed as a component after one use. It is page code until it appears twice.

## See also

- [decision-tree.md](decision-tree.md) — classify in five questions.
- [misfiles.md](misfiles.md) — catalogue of wrong-layer artifacts.
- [plain-language.md](plain-language.md) — how to explain the layers to non-designers.
- [../tokens/architecture.md](../tokens/architecture.md) — tiers, aliasing, DTCG format.
- [../components/api-design.md](../components/api-design.md) — when to add a component.
- [../states/model.md](../states/model.md) — the state model: interaction and lifecycle states.
- [../governance/contribution.md](../governance/contribution.md) — the four artifacts and the review flow.
