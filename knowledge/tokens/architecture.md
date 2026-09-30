---
id: tokens/architecture
title: Token architecture
shelf: tokens
layer: foundation
owner: ui-designer
tags: [tokens, dtcg, tiers, aliasing, composite, extensions, palette, colors, roles]
sources:
  - Design Tokens Community Group, Design Tokens Format Module — https://www.designtokens.org/
  - W3C Design Tokens Community Group — https://www.w3.org/community/design-tokens/
  - Atlassian, Carbon, Primer, Polaris token documentation — see references/systems.md
  - Evidence: `docs/research/tokens-vs-foundations.md` (Atlassian: "Design tokens are the new way to apply visual foundations"; Material 3 lists design tokens inside Foundations; Primer: base tokens "should never be used directly in code"; DTCG 2025.10 is stable)
---

# Token architecture

> Tokens are how a foundation is written down. They are not a fourth kind of thing next to foundations, components and patterns. A token is a named design decision with one value. "Muted text colour" is a decision. `#5a6b80` is only its current value. Tokens come in three tiers. Tier 1 holds raw values on a scale. Tier 2 gives each value a job. Tier 3 is optional and pins a job to one component. Screens and components read the job names, so a theme can swap the values without touching any screen.

## Rules

1. Store every foundation decision, and every optional component decision, as a token in DTCG JSON. Tokens are the storage and delivery format, not a layer. It is the only place a raw value may appear. (`UBIQUITOUS-LANGUAGE.md` § Token)
2. Use three tiers and no more:
   - **Primitive token (tier 1):** a raw value on a scale, such as `palette.dark-blue.600` or `duration.150`.
   - **Semantic (tier 2):** an intent that aliases a primitive token or another semantic token, such as `space.inset.md` or the role `text.muted`.
   - **Component (tier 3, optional):** a semantic token scoped to one component, such as `button.radius`.
   (Two tiers cannot express themes cleanly. A fourth tier adds indirection with no new decision.)
3. Call sites use semantic tokens only. For colour, that means roles: `palette.*` and `colors.*` are never used by a component or a pattern. (Primer: base colour tokens "should never be used directly in code or design".) A call site is any stylesheet rule, template or component that is not itself a token file. Call sites never use primitive tokens. (Themes override semantic tokens. A component at a call site cannot follow a theme. See `theming.md`.)
4. A component may use its own component tokens. A component token must alias a semantic token, not a primitive token. (The alias chain stays theme-aware.)
5. Create a component token only when a component has a decision that no semantic token expresses, or when several variants of one component need to be tuned together. Otherwise use semantic tokens directly. (Optional tier: every extra token is a maintenance cost.)
6. A semantic token aliases a primitive token or another semantic token. A primitive token holds a literal value and never aliases. (One direction of flow.)
7. Keep alias chains short. Three hops from component to primitive token is a soft limit. (Long chains hide the real value.)
8. Never create a cycle. Build tools reject them. A build that resolves aliases must fail on a cycle or on a reference that does not exist. (DTCG: aliases must resolve.)
9. Themes are sibling files that each define every role. The palette and the colors never change per theme. (`UBIQUITOUS-LANGUAGE.md` § Theme)
10. Add a token when a value appears in two or more places with the same intent. Do not add a token for a single use. (Governance: the two-occurrence rule, `governance/contribution.md`.)
11. Give every token a `$description` that states its intent in one sentence. A token with no stated intent is a value in disguise. (DTCG `$description`.)
12. Describe deprecation in the token file, not in a chat message. Keep a deprecated token as an alias to its replacement until the last caller moves. (See `governance/versioning.md`.)

## The colour chain

Colour has one step more than the other foundations: palette → colors → roles (per theme) → component. Three files hold it.

| File | Holds | Tier | Who uses it |
|---|---|---|---|
| `foundations/color/palette.tokens.json` | Named hues with grades: `palette.scarlet.100…900`, `palette.dark-blue.*`, `palette.teal.*`, `palette.gray.*`. Raw values. | primitive | `colors` only. Never a component. |
| `foundations/color/colors.tokens.json` | Role scales: `colors.primary.100…900 → {palette.dark-blue.*}`; secondary, error, success, warning, info, neutral. | primitive (aliases) | Themes; charts that need a scale. A rebrand edits this file only. |
| `themes/<name>/<name>.tokens.json` | Flat roles by purpose: `text.*`, `surface.*`, `border.*`, `action.*`, `status.*`, `focus.ring.*`, `disabled.*`, `state.*`, top level with no `color.` prefix. Each aliases `colors.*`. | semantic | Components. |

The word **colors** needs care. In Carbon, `@carbon/colors` holds the palette. Here, palette holds the hues and colors holds the role scales. Every doc in this plugin uses these two words as defined here. Scales of 100 to 900 live in palette and colors; roles are flat and named by purpose (`docs/research/tokens-vs-foundations.md` § 2).

```json
// foundations/color/palette.tokens.json
{ "palette": { "$type": "color",
    "dark-blue": { "600": { "$value": "#244b7b", "$description": "Primitive. Never used by a component." } },
    "gray": { "600": { "$value": "#5a6b80" }, "900": { "$value": "#213547" } } } }

// foundations/color/colors.tokens.json
{ "colors": { "$type": "color",
    "primary": { "600": { "$value": "{palette.dark-blue.600}", "$description": "Which hue plays primary. The rebrand point." } },
    "neutral": { "600": { "$value": "{palette.gray.600}" }, "900": { "$value": "{palette.gray.900}" } } } }

// themes/light/light.tokens.json  (themes/dark/dark.tokens.json defines the same names)
{ "text":   { "$type": "color",
    "default": { "$value": "{colors.neutral.900}", "$description": "Headings and body text." },
    "muted":   { "$value": "{colors.neutral.600}", "$description": "Labels and secondary text." } },
  "action": { "$type": "color",
    "primary":       { "$value": "{colors.primary.600}", "$description": "Fill of the primary action." },
    "primary-hover": { "$value": "{colors.primary.700}", "$description": "Hover fill of the primary action." } } }

// button.tokens.json  (optional component token, aliases a role)
{ "button": { "$type": "color", "background": { "$value": "{action.primary}" } } }
```

The chain for one component: `button.background` → `action.primary` → `colors.primary.600` → `palette.dark-blue.600` → `#244b7b`. Three alias hops from component token to palette, then the raw value. That is the soft limit of rule 7. Do not add a fourth hop.

## DTCG format

DTCG is the interchange format for design tokens. Tokens live in JSON files. This plugin names them `*.tokens.json`. The values below follow the Design Tokens Format Module. Check the spec version that your tools read. Details such as the shape of `color` and `dimension` values changed between drafts and the stable release.

| Key | Meaning |
|---|---|
| `$value` | The token's value, or an alias `"{group.token}"`. Required on a token. |
| `$type` | The value type. May be set on the token or inherited from the nearest enclosing group. |
| `$description` | Plain-text intent. Optional. Write it anyway. |
| `$extensions` | Tool-specific data under a reverse-domain key. Tools that do not know the key must keep it. |
| `$deprecated` | Marks a token as deprecated, with an optional message. |

A token is an object with `$value`. A group is an object without it. Groups nest to any depth. Names must not begin with `$` and must not contain `{`, `}` or `.`.

### Types

| `$type` | Value shape (example) |
|---|---|
| `color` | A colour, such as `"#244b7b"` |
| `dimension` | A length with a unit, such as `"16px"` or `"1rem"` |
| `duration` | A time, such as `"150ms"` |
| `cubicBezier` | Four numbers, such as `[0.2, 0, 0.38, 0.9]` |
| `fontFamily` | A name or a list of names, such as `["Inter", "system-ui", "sans-serif"]` |
| `fontWeight` | A number such as `600`, or a keyword |
| `number` | A plain number, such as a line height `1.5` or a z-index `1000` |

Composite types hold several values in one token:

| `$type` | Fields |
|---|---|
| `shadow` | `color`, `offsetX`, `offsetY`, `blur`, `spread` (an array of these for layered shadows) |
| `typography` | `fontFamily`, `fontSize`, `fontWeight`, `letterSpacing`, `lineHeight` |
| `border` | `color`, `width`, `style` |
| `transition` | `duration`, `delay`, `timingFunction` |

Other composite types exist: `strokeStyle` and `gradient`. Use them only when a platform needs them.

### Composite tokens

A composite token bundles values that always travel together. A field may be an alias:

```json
{
  "shadow": {
    "1": {
      "$type": "shadow",
      "$value": {
        "color": "{palette.gray.900}",
        "offsetX": "0px",
        "offsetY": "2px",
        "blur": "6px",
        "spread": "0px"
      }
    }
  },
  "motion": {
    "duration": { "fast": { "$type": "duration", "$value": "150ms" } },
    "ease": { "enter": { "$type": "cubicBezier", "$value": [0, 0, 0.38, 0.9] } },
    "enter": {
      "$type": "transition",
      "$value": {
        "duration": "{motion.duration.fast}",
        "delay": "0ms",
        "timingFunction": "{motion.ease.enter}"
      }
    }
  }
}
```

- Use a composite when the parts are never tuned alone: a text style, a shadow, a border, a transition. (One name per decision.)
- Do not use a composite for one value with a unit. Use the base type.
- Not every platform reads composites. See `pipelines.md` for how each output handles them.

### $extensions

Use `$extensions` for data the format does not define, such as design-tool scopes or a rulebook link. Use a reverse-domain key so vendors do not collide. Never put required meaning in an extension. A token must still resolve without it.

```json
{
  "text": {
    "muted": {
      "$type": "color",
      "$value": "{colors.neutral.600}",
      "$extensions": { "com.example.ds": { "figmaScopes": ["TEXT_FILL"] } }
    }
  }
}
```

## Page contract

A token-architecture page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what a token is, in plain words: the written-down form of one foundation decision, with one value. Not a layer. (`taxonomy/layers.md`)
- Show the colour chain: `button.background` to `action.primary` to `colors.primary.600` to `palette.dark-blue.600` to `#244b7b`.

### 2. Anatomy
- A token: name (path), `$value`, `$type`, `$description`, optional `$extensions` and `$deprecated`. `$value` is required. The rest are optional. (DTCG)
- A group: a name and children, with an optional inherited `$type`.
- An alias: `"{group.token}"`. It resolves to another token's value.

### 3. Tokens
- The token groups the system defines, one table per foundation: name, tier, `$type`, value, `$description`.
- The tier of each row is shown. Primitive token rows are marked "not for call sites".

### 4. States
- Tokens provide state through the name, not through a new tier. A state is a name suffix on a role or a component token: `action.primary-hover`, `button.background-disabled`. Vocabulary is in `naming.md`.
- The states a token set must cover per interactive family: default, hover, pressed, focus-visible, disabled, selected, error, success. (`states/interaction-states.md`)
- A theme changes the value of a state token. It does not add or remove states. (`theming.md`)
- Show each state row with its resolved value per theme.

### 5. Usage
- When to add a token: the value recurs with one intent. (Two-occurrence rule, `governance/contribution.md`)
- When not to: a one-off value inside one component. Keep it local and comment it.
- How: primitive token first, then the semantic alias, then a component token only if needed. Write `$description`. Run the build and the drift check. (`pipelines.md`)
- Accessibility: contrast is checked on role pairs, per theme. (WCAG 1.4.3, AA; 1.4.11, AA)

### 6. Pitfalls and don'ts
- A primitive token (`palette.*`, `colors.*`) at a call site cannot follow a theme. (`misfile.palette-at-call-site`, `theming.md`)
- A component token aliasing a primitive token skips the roles and breaks dark mode.
- A token named for its value (`--ds-blue-light`) lies after the first retune. (`naming.md`)
- A cycle or a missing alias target breaks every output. (DTCG: aliases must resolve.)
- A token with no `$description` cannot be audited for intent.
- A composite used where a base type fits hides one value inside an object.

## Why

- Tiers separate what a value is from what it is for. Themes then need to change only tier 2.
- Palette, colors and roles separate three decisions: which hues exist, which hue plays which part, and which part serves which purpose in a theme. Carbon splits palette (`@carbon/colors`) from themes (`@carbon/themes`); Primer splits base from functional tokens; Material 3 splits tonal palette from role.
- Aliasing keeps one source per value. Retuning `palette.gray.600` moves every role that points at it.
- DTCG gives one JSON format that design tools and build tools can share. That is why the plugin's core is DTCG and not a tool's private format.
- Atlassian, Carbon, Primer and Polaris all publish tiered or role-named tokens. The tier names vary. The split between raw values and roles does not.

## Rulebook seeds

- `token.no-raw-value` · auto · MEDIUM · Raw colour, size and time values appear only in token files.
- `token.call-site-semantic` · auto · MEDIUM · Call sites reference semantic or component tokens, never primitive tokens.
- `token.palette-direct` · auto · HIGH · No component or pattern reads `palette.*` or `colors.*`; roles only.
- `token.theme-parity` · auto · HIGH · Every theme defines the same role names.
- `token.component-aliases-semantic` · auto · MEDIUM · Component tokens alias semantic tokens.
- `token.alias-resolves` · auto · HIGH · Every alias resolves and none is circular.
- `token.description` · auto · LOW · Every semantic token has a `$description`.
- `token.type-declared` · auto · MEDIUM · Every token has a `$type`, its own or inherited.
- `token.chain-depth` · auto · LOW · Alias chains are three hops or fewer.
- `token.deprecated-alias` · auto · LOW · A deprecated token aliases its replacement.

## Misfiles

- A scale (which values exist) is a foundation. A token is one member of it, and tokens are not a layer. (`taxonomy/layers.md`, `misfile.token-as-layer`)
- A style rule such as `.ds-btn { ... }` is a component, not a token.
- A Figma style or a Sass mixin is an output or a tool feature, not a token.
- The value of a token, such as the exact blue, belongs to the foundation. (`foundations/color.md`)

## See also

- [Token naming](./naming.md)
- [Theming](./theming.md)
- [Pipelines](./pipelines.md)
- [Colour](../foundations/color.md)
- [Motion](../foundations/motion.md)
- [Layers](../taxonomy/layers.md)
- [Contribution](../governance/contribution.md)
- [Versioning](../governance/versioning.md)
