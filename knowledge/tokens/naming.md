---
id: tokens/naming
title: Token naming
shelf: tokens
layer: foundation
owner: ui-designer
tags: [naming, grammar, prefix, anti-patterns, states, palette, colors, roles]
sources:
  - Design Tokens Community Group, Design Tokens Format Module (name restrictions) — https://www.designtokens.org/
  - Carbon, Primer, Polaris, Atlassian token documentation — see references/systems.md
  - Material 3, Design tokens overview — https://m3.material.io/foundations/design-tokens/overview (`md.ref.palette.secondary90` at reference level, roles at system level)
  - Atlassian, Color — https://atlassian.design/foundations/color (roles named by meaning: neutral, brand, information, success, warning, danger)
---

# Token naming

> A name is a promise about what a token is for. (Tokens store foundation decisions; the name says which decision.) A good name says the job, not the look. "Muted text" stays true when the grey turns blue. "Light blue" stops being true the day the blue changes. Names follow one pattern, so a person can guess a token before searching for it.

## Rules

1. Name a token by intent, not by value. Write the role `text.muted`, not `palette.gray.600` at tier 2, and never `light-blue`. (A value name becomes false when the value is retuned. Carbon, Primer and Polaris name semantic tokens by role.)
2. Use one grammar for the whole system. The dot path is: `group.name`, with an optional step or state.
   - **Non-colour foundations:** `category.property.variant` (`space.inset.md`, `radius.control`, `motion.duration.fast`).
   - **Palette:** `palette.<hue>.<grade>` (`palette.scarlet.600`, `palette.dark-blue.600`). Hue names are named colours, grades run 100 to 900.
   - **Colors:** `colors.<role>.<grade>` (`colors.primary.600`, `colors.error.500`). The role is one of primary, secondary, error, success, warning, info, neutral.
   - **Roles:** `<purpose>.<name>`, top level, with no `color.` prefix. The purpose group is one of `text`, `surface`, `border`, `action`, `status`, `focus`, `disabled`, `state`. A state or part is a suffix joined by a hyphen: `action.primary-hover`, `action.primary-text`, `status.error-surface`. The focus group is the one three-segment name: `focus.ring.color`, `focus.ring.width`, `focus.ring.offset`.
   Omit segments that do not apply. Keep the order. (One order lets people predict names.)
3. Some teams use the grammar `namespace-object-base-modifier` instead. Pick one grammar and write it in the styleguide. Do not mix two in one system. (Consistency.)
4. Use lowercase letters, digits and hyphens inside a segment. Use dots between segments in the DTCG path. Do not use spaces, `{`, `}` or a leading `$`. (DTCG name restrictions.)
5. Map the dot path to the CSS custom property by joining segments with hyphens and adding the project prefix. `text.muted` becomes `--ds-text-muted`; `action.primary-hover` becomes `--ds-action-primary-hover`. Take the prefix from `prefix` in `bauhaus.config.json`. (One rule, so the mapping is mechanical and a tool can do it.)
6. Give every custom property and class the project prefix. Use the prefix `ds` in examples. (A prefix keeps the system out of the way of third-party CSS.)
7. Name primitive token scales by step, not by adjective. Use `dark-blue.600` and `space.3`, not `dark-blue.medium` or `space.regular`. Steps are ordered. Adjectives are not. (A step name can be extended without renaming.)
8. Use numeric steps for scales that may grow (`space.1` to `space.8`). Use t-shirt sizes (`sm`, `md`, `lg`) for scales that stay short (radius, text). Do not mix both on one scale. (One scale, one naming style.)
9. Name size steps by intent, not by pixel value. `text.md` survives a retune from 14px to 15px. `text.14` does not. (`foundations/typography.md`)
10. Use singular category names. A token is one member of a set: `color`, `space`, `radius`. Use plural only in prose. (House convention: the path reads as "one colour", "one radius".)
11. Use a short, closed list of state names. Recommended: `default`, `hover`, `pressed`, `focus`, `disabled`, `selected`, `error`, `success`. Omit `default` when it is the base token. Do not invent `active2`, `on`, `hot`. (`states/interaction-states.md`)
12. Do not put the theme in a token name. `text.muted`, not `text.muted-dark`. The theme changes the value, not the name. (`theming.md`)
13. Do not put the component or the platform in a semantic token name. Component tokens carry the component name: `button.radius`. (Tier rule, `architecture.md`.)
14. Avoid abbreviations. Allow a short documented list where the full word costs more than it explains: `sm`, `md`, `lg`, `xl`, `lh` for line height, `z` for stacking order. Add to the list only by a written decision. (An open list of abbreviations turns into private slang.)
15. Do not put a version, a date or a ticket number in a name. `-v2`, `-final`, `-new` and `-2024` are anti-patterns. (A name must outlive the work item that made it.)
16. Name a palette hue by its colour (`scarlet`, `dark-blue`, `teal`), never by its job. Name a `colors` entry by its role (`primary`, `error`), never by its hue. Name a role by its purpose (`action.primary`, `status.error`), never by its hue. (Material 3 uses `primary` at both reference and system level, and the same word then means two things. Carbon's `colors` package holds the palette. Bauhaus defines `colors` once as the role scales.)
17. Roles are flat. Do not give a role a 100 to 900 scale. Scales belong to the palette and to `colors`. (`docs/research/tokens-vs-foundations.md` § 2.)
18. Every theme defines the same role names. A role in one theme and not in another is a defect. (`theming.md`)
19. Rename with an alias. Keep the old name as a deprecated alias to the new one until the last caller moves. (`governance/versioning.md`)

## Anti-patterns

| Bad name | Why it fails | Better |
|---|---|---|
| `--blue-light` | Names the look. Wrong after a retune. Not prefixed. | `--ds-surface-sunken` |
| `--spacing-13px` | Bakes the value into the name. Off the grid. | `--ds-space-3` |
| `--button-primary-hover-bg-final2` | Version suffix, abbreviation, wrong order, two ideas in one name. | `--ds-button-background-hover` |
| `--ds-text-dark` | Names the look. Which surface is it for? | `--ds-text-default` |
| `--ds-gray` | No group, no grade. Unsearchable. | `--ds-palette-gray-600` |
| `--ds-text-muted-dark-mode` | Puts the theme in the name. | `--ds-text-muted` |
| `--ds-action-scarlet` | A role named after a hue. | `--ds-action-primary` |
| `--ds-palette-primary-600` | A palette entry named after a job. | `--ds-palette-dark-blue-600` |
| `--ds-heading-font-size-24` | Value in the name. Mixes two categories. | `--ds-text-xl` |
| `--ds-status-error-red` | Role and hue in one name. | `--ds-status-error` |
| `--ds-ease` (with `160ms ease` inside) | A curve name that also holds a duration. | `--ds-duration-fast` and `--ds-ease-standard` |
| `--ds-card-radius-6` | Component and value fused. | `--ds-radius-lg` or `--ds-card-radius` |

## State roles

State colours are roles like any other. They use two shapes and no other.

1. **State layers and shared state colours.** They belong to no action: `state.hover-layer`, `state.pressed-layer`, `state.selected`, `disabled.text`, `disabled.surface`, `disabled.border`.
2. **Per-action interactive colours.** The pattern is `action.<name>-<state>`, for example `action.primary-hover` and `action.primary-pressed`. The label on the fill is `action.<name>-text` (`action.primary-text`). The CSS form is `--ds-action-primary-hover`. Use the same state names for every action: a reader who knows `action.primary-hover` also knows `action.secondary-hover`.

Focus has its own group: `focus.ring.color`, `focus.ring.width`, `focus.ring.offset` (CSS: `--ds-focus-ring-color`).

State layers are opaque tints, not alpha overlays, because a DTCG alias cannot carry an alpha: `state.hover-layer → {colors.primary.100}`.

Each of these roles is defined in every theme and aliases `colors.*`. A layer applies to any base colour, so it is named once, not once per result. Lifecycle states rarely need tokens. When they do, use a state name from rule 11. (`states/interaction-states.md`, `foundations/color.md`)

## Page contract

A token-naming page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what a name does: it states the job of a token. Foundation decisions, stored as tokens. (`taxonomy/layers.md`)
- Lead with the good-versus-bad pair: `--ds-text-muted` and `--blue-light`.

### 2. Tokens
- The grammar, written out with the category list, the state list and the abbreviation list.
- The prefix from the project config and the path-to-CSS mapping rule.
- One example per category.

### 3. Anatomy
- A name: category, property, variant, state, in that order. Category is required. The others are optional.
- The CSS form: prefix, then segments joined by hyphens.
- Show the name parsed segment by segment.

### 4. States
- The state segment is the vocabulary for interaction states in tokens: default, hover, pressed, focus, disabled, selected, error, success.
- Lifecycle states such as loading or empty rarely need tokens. When they do, use the state list, not a new word. (`states/lifecycle-states.md`)
- Show a table of state names and the families that use each.

### 5. Usage
- When to name a new token: after the intent is clear and a role name is free. (Role naming, Carbon, Primer, Polaris.)
- When not to: when an existing role fits. Reuse it.
- How: write the path, check the mapping to CSS, add `$description`, run the build.
- Search: a name that follows the grammar can be found by prefix search in an editor.

### 6. Pitfalls and don'ts
- Names that hold values go stale on the first retune.
- Themes in names duplicate every token per theme. (`theming.md`)
- Version suffixes never get removed.
- Two grammars in one system make names unpredictable.
- Open-ended abbreviations become private slang that new people cannot read.

## Why

- A role name survives a value change. A value name does not. This is the reason published systems name semantic tokens by role.
- A fixed order makes names guessable. It also lets tools map a path to a CSS name, a Swift name and a Kotlin name without a lookup table.
- A closed state list keeps `hover` meaning one thing everywhere. It also lets an audit find missing states by name.
- DTCG restricts characters in names because paths use dots and aliases use braces.

## Rulebook seeds

- `token.name-grammar` · auto · MEDIUM · Every token path follows the grammar of its family (rule 2).
- `token.name-palette-by-hue` · auto · LOW · Palette entries are named by hue; `colors` entries by role; roles by purpose.
- `token.name-no-value` · auto · MEDIUM · Semantic token names contain no raw value, unit or hue word.
- `token.name-no-theme` · auto · MEDIUM · No token name contains a theme name.
- `token.name-no-version` · auto · LOW · No name ends in `-v2`, `-final`, `-new` or a date.
- `token.name-prefix` · auto · MEDIUM · Every custom property carries the project prefix.
- `token.name-state-list` · auto · LOW · State segments come from the closed list.
- `token.name-abbrev` · auto · LOW · Abbreviations come from the documented list.

## Misfiles

- A CSS class name such as `.ds-btn--primary` is a component's API, not a token name. (`components/api-design.md`)
- A Figma layer name is a tool label. Map it to a token, do not treat it as one.
- A design-system-wide glossary belongs in `UBIQUITOUS-LANGUAGE.md`.

## See also

- [Token architecture](./architecture.md)
- [Theming](./theming.md)
- [Pipelines](./pipelines.md)
- [Typography](../foundations/typography.md)
- [Interaction states](../states/interaction-states.md)
- [Versioning](../governance/versioning.md)
