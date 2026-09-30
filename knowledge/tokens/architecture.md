---
id: tokens/architecture
title: Token architecture
shelf: tokens
layer: token
owner: ui-designer
tags: [tokens, dtcg, tiers, aliasing, composite, extensions]
sources:
  - Design Tokens Community Group, Design Tokens Format Module — https://www.designtokens.org/
  - W3C Design Tokens Community Group — https://www.w3.org/community/design-tokens/
  - Atlassian, Carbon, Primer, Polaris token documentation — see references/systems.md
---

# Token architecture

> A token is a named design decision with one value. "Muted text colour" is a decision. `#5a6b80` is only its current value. Tokens come in three tiers. Tier 1 holds raw values on a scale. Tier 2 gives each value a job. Tier 3 is optional and pins a job to one component. Screens and components read the job names, so a theme can swap the values without touching any screen.

## Rules

1. Store every design decision as a token in DTCG JSON. It is the only place a raw value may appear. (`UBIQUITOUS-LANGUAGE.md` § Token)
2. Use three tiers and no more:
   - **Primitive token (tier 1):** a raw value on a scale, such as `color.blue.600` or `duration.150`.
   - **Semantic (tier 2):** an intent that aliases a primitive token or another semantic token, such as `color.text.muted`.
   - **Component (tier 3, optional):** a semantic token scoped to one component, such as `button.radius`.
   (Two tiers cannot express themes cleanly. A fourth tier adds indirection with no new decision.)
3. Call sites use semantic tokens only. A call site is any stylesheet rule, template or component that is not itself a token file. Call sites never use primitive tokens. (Themes override semantic tokens. A component at a call site cannot follow a theme. See `theming.md`.)
4. A component may use its own component tokens. A component token must alias a semantic token, not a primitive token. (The alias chain stays theme-aware.)
5. Create a component token only when a component has a decision that no semantic token expresses, or when several variants of one component need to be tuned together. Otherwise use semantic tokens directly. (Optional tier: every extra token is a maintenance cost.)
6. A semantic token aliases a primitive token or another semantic token. A primitive token holds a literal value and never aliases. (One direction of flow.)
7. Keep alias chains short. Three hops from component to primitive token is a soft limit. (Long chains hide the real value.)
8. Never create a cycle. Build tools reject them. A build that resolves aliases must fail on a cycle or on a reference that does not exist. (DTCG: aliases must resolve.)
9. Themes override semantic tokens only. Primitive tokens never change per theme. (`UBIQUITOUS-LANGUAGE.md` § Theme)
10. Add a token when a value appears in two or more places with the same intent. Do not add a token for a single use. (Governance: the two-occurrence rule, `governance/contribution.md`.)
11. Give every token a `$description` that states its intent in one sentence. A token with no stated intent is a value in disguise. (DTCG `$description`.)
12. Describe deprecation in the token file, not in a chat message. Keep a deprecated token as an alias to its replacement until the last caller moves. (See `governance/versioning.md`.)

## Tier example

```json
{
  "color": {
    "$type": "color",
    "gray": {
      "600": { "$value": "#5a6b80", "$description": "Mid gray. Primitive token." },
      "900": { "$value": "#213547" }
    },
    "blue": {
      "600": { "$value": "#244b7b" }
    },
    "text": {
      "primary": { "$value": "{color.gray.900}", "$description": "Headings and primary text." },
      "muted":   { "$value": "{color.gray.600}", "$description": "Labels and secondary text." }
    },
    "accent": {
      "default": { "$value": "{color.blue.600}", "$description": "Primary actions and active states." }
    }
  },
  "button": {
    "$type": "color",
    "background": { "$value": "{color.accent.default}", "$description": "Component token. Aliases a semantic token." }
  }
}
```

Tier 1 is `color.gray.*` and `color.blue.*`. Tier 2 is `color.text.*` and `color.accent.*`. Tier 3 is `button.background`.

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
        "color": "{color.shadow.ambient}",
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
  "color": {
    "text": {
      "muted": {
        "$value": "{color.gray.600}",
        "$extensions": { "com.example.ds": { "figmaScopes": ["TEXT_FILL"] } }
      }
    }
  }
}
```

## Page contract

A token-architecture page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what a token is, in plain words: one named decision with one value. Layer: token. (`taxonomy/layers.md`)
- Show the three tiers as one chain: `button.background` to `color.accent.default` to `color.blue.600` to `#244b7b`.

### 2. Tokens
- The token groups the system defines, one table per foundation: name, tier, `$type`, value, `$description`.
- The tier of each row is shown. Primitive token rows are marked "not for call sites".

### 3. Anatomy
- A token: name (path), `$value`, `$type`, `$description`, optional `$extensions` and `$deprecated`. `$value` is required. The rest are optional. (DTCG)
- A group: a name and children, with an optional inherited `$type`.
- An alias: `"{group.token}"`. It resolves to another token's value.

### 4. States
- Tokens provide state through the name, not through a new tier. A state is a name segment on a semantic or component token: `color.accent.hover`, `button.background.disabled`. Vocabulary is in `naming.md`.
- The states a token set must cover per interactive family: default, hover, pressed, focus-visible, disabled, selected, error, success. (`states/interaction-states.md`)
- A theme changes the value of a state token. It does not add or remove states. (`theming.md`)
- Show each state row with its resolved value per theme.

### 5. Usage
- When to add a token: the value recurs with one intent. (Two-occurrence rule, `governance/contribution.md`)
- When not to: a one-off value inside one component. Keep it local and comment it.
- How: primitive token first, then the semantic alias, then a component token only if needed. Write `$description`. Run the build and the drift check. (`pipelines.md`)
- Accessibility: contrast is checked on semantic pairs, per theme. (WCAG 1.4.3, AA; 1.4.11, AA)

### 6. Pitfalls and don'ts
- A primitive token at a call site cannot follow a theme. (Tier rule, `theming.md`)
- A component token aliasing a primitive token skips the semantic layer and breaks dark mode.
- A token named for its value (`--ds-blue-light`) lies after the first retune. (`naming.md`)
- A cycle or a missing alias target breaks every output. (DTCG: aliases must resolve.)
- A token with no `$description` cannot be audited for intent.
- A composite used where a base type fits hides one value inside an object.

## Why

- Tiers separate what a value is from what it is for. Themes then need to change only tier 2.
- Aliasing keeps one source per value. Retuning `gray.600` moves every text role that points at it.
- DTCG gives one JSON format that design tools and build tools can share. That is why the plugin's core is DTCG and not a tool's private format.
- Atlassian, Carbon, Primer and Polaris all publish tiered or role-named tokens. The tier names vary. The split between raw values and roles does not.

## Rulebook seeds

- `token.no-raw-value` · auto · MEDIUM · Raw colour, size and time values appear only in token files.
- `token.call-site-semantic` · auto · MEDIUM · Call sites reference semantic or component tokens, never primitive tokens.
- `token.component-aliases-semantic` · auto · MEDIUM · Component tokens alias semantic tokens.
- `token.alias-resolves` · auto · HIGH · Every alias resolves and none is circular.
- `token.description` · auto · LOW · Every semantic token has a `$description`.
- `token.type-declared` · auto · MEDIUM · Every token has a `$type`, its own or inherited.
- `token.chain-depth` · auto · LOW · Alias chains are three hops or fewer.
- `token.deprecated-alias` · auto · LOW · A deprecated token aliases its replacement.

## Misfiles

- A scale (which values exist) is a foundation. A token is one member of it. (`taxonomy/layers.md`)
- A style rule such as `.ds-btn { ... }` is a component, not a token.
- A Figma style or a Sass mixin is an output or a tool feature, not a token.
- The value of a token, such as the exact blue, belongs to the foundation file. (`foundations/color.md`)

## See also

- [Token naming](./naming.md)
- [Theming](./theming.md)
- [Pipelines](./pipelines.md)
- [Colour](../foundations/color.md)
- [Motion](../foundations/motion.md)
- [Layers](../taxonomy/layers.md)
- [Contribution](../governance/contribution.md)
- [Versioning](../governance/versioning.md)
