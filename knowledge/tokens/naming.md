---
id: tokens/naming
title: Token naming
shelf: tokens
layer: token
owner: ui-designer
tags: [naming, grammar, prefix, anti-patterns, states]
sources:
  - Design Tokens Community Group, Design Tokens Format Module (name restrictions) — https://www.designtokens.org/
  - Carbon, Primer, Polaris, Atlassian token documentation — see references/systems.md
---

# Token naming

> A name is a promise about what a token is for. A good name says the job, not the look. "Muted text" stays true when the grey turns blue. "Light blue" stops being true the day the blue changes. Names follow one pattern, so a person can guess a token before searching for it.

## Rules

1. Name a token by intent, not by value. Write `color.text.muted`, not `color.gray.600` at tier 2, and never `color.light-blue`. (A value name becomes false when the value is retuned. Carbon, Primer and Polaris name semantic tokens by role.)
2. Use one grammar for the whole system. The dot path is: `category.property.variant.state`.
   - **category:** the foundation (`color`, `space`, `radius`, `shadow`, `duration`, `ease`, `font`, `text`, `z`).
   - **property:** what is styled or what the role is (`text`, `surface`, `border`, `accent`).
   - **variant:** a named option of the property (`muted`, `subtle`, `strong`, `danger`).
   - **state:** an interaction or lifecycle state (`hover`, `pressed`, `disabled`, `selected`).
   Omit segments that do not apply. Keep the order. (One order lets people predict names.)
3. Some teams use the grammar `namespace-object-base-modifier` instead. Pick one grammar and write it in the styleguide. Do not mix two in one system. (Consistency.)
4. Use lowercase letters, digits and hyphens inside a segment. Use dots between segments in the DTCG path. Do not use spaces, `{`, `}` or a leading `$`. (DTCG name restrictions.)
5. Map the dot path to the CSS custom property by joining segments with hyphens and adding the project prefix. `color.text.muted` becomes `--ds-color-text-muted`. Take the prefix from `prefix` in `bauhaus.config.json`. (One rule, so the mapping is mechanical and a tool can do it.)
6. Give every custom property and class the project prefix. Use the prefix `ds` in examples. (A prefix keeps the system out of the way of third-party CSS.)
7. Name primitive token scales by step, not by adjective. Use `blue.600` and `space.3`, not `blue.medium` or `space.regular`. Steps are ordered. Adjectives are not. (A step name can be extended without renaming.)
8. Use numeric steps for scales that may grow (`space.1` to `space.8`). Use t-shirt sizes (`sm`, `md`, `lg`) for scales that stay short (radius, text). Do not mix both on one scale. (One scale, one naming style.)
9. Name size steps by intent, not by pixel value. `text.md` survives a retune from 14px to 15px. `text.14` does not. (`foundations/typography.md`)
10. Use singular category names. A token is one member of a set: `color`, `space`, `radius`. Use plural only in prose. (House convention: the path reads as "one colour", "one radius".)
11. Use a short, closed list of state names. Recommended: `default`, `hover`, `pressed`, `focus`, `disabled`, `selected`, `error`, `success`. Omit `default` when it is the base token. Do not invent `active2`, `on`, `hot`. (`states/interaction-states.md`)
12. Do not put the theme in a token name. `color.text.muted`, not `color.text.muted-dark`. The theme changes the value, not the name. (`theming.md`)
13. Do not put the component or the platform in a semantic token name. Component tokens carry the component name: `button.radius`. (Tier rule, `architecture.md`.)
14. Avoid abbreviations. Allow a short documented list where the full word costs more than it explains: `sm`, `md`, `lg`, `xl`, `lh` for line height, `z` for stacking order. Add to the list only by a written decision. (An open list of abbreviations turns into private slang.)
15. Do not put a version, a date or a ticket number in a name. `-v2`, `-final`, `-new` and `-2024` are anti-patterns. (A name must outlive the work item that made it.)
16. Rename with an alias. Keep the old name as a deprecated alias to the new one until the last caller moves. (`governance/versioning.md`)

## Anti-patterns

| Bad name | Why it fails | Better |
|---|---|---|
| `--blue-light` | Names the look. Wrong after a retune. Not prefixed. | `--ds-color-accent-soft` |
| `--spacing-13px` | Bakes the value into the name. Off the grid. | `--ds-space-3` |
| `--button-primary-hover-bg-final2` | Version suffix, abbreviation, wrong order, two ideas in one name. | `--ds-button-background-hover` |
| `--ds-color-text-dark` | Names the look. Which surface is it for? | `--ds-color-text-primary` |
| `--ds-gray` | No category, no step. Unsearchable. | `--ds-color-gray-600` |
| `--ds-color-text-muted-dark-mode` | Puts the theme in the name. | `--ds-color-text-muted` |
| `--ds-heading-font-size-24` | Value in the name. Mixes two categories. | `--ds-text-xl` |
| `--ds-color-error-red` | Role and hue in one name. | `--ds-color-danger-solid` |
| `--ds-ease` (with `160ms ease` inside) | A curve name that also holds a duration. | `--ds-duration-fast` and `--ds-ease-standard` |
| `--ds-card-radius-6` | Component and value fused. | `--ds-radius-lg` or `--ds-card-radius` |

## State tokens

State tokens come in two families. Use no other shape.

1. **State layers and shared state colours.** They belong to no role: `color.state.hover-layer`, `color.state.pressed-layer`, `color.state.selected`, `color.state.disabled.text`, `color.state.disabled.surface`, `color.state.disabled.border`.
2. **Per-role interactive colours.** The pattern is `color.action.<role>.<state>`, for example `color.action.primary.hover`. The CSS form is `--ds-color-action-primary-hover`. Use the same state names for every role: a reader who knows `primary.hover` also knows `danger.hover`.

Focus has its own group: `focus.ring.color`, `focus.ring.width`, `focus.ring.offset`.

A layer applies to any base colour, so it is named once, not once per result. Lifecycle states rarely need tokens. When they do, use a state name from rule 11. (`states/interaction-states.md`, `foundations/color.md`)

## Page contract

A token-naming page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what a name does: it states the job of a token. Layer: token. (`taxonomy/layers.md`)
- Lead with the good-versus-bad pair: `--ds-color-text-muted` and `--blue-light`.

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

- `token.name-grammar` · auto · MEDIUM · Every token path follows `category.property.variant.state`.
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
