---
id: taxonomy/misfiles
title: Misfiles — wrong-layer artifacts
shelf: taxonomy
layer: cross-cutting
owner: design-system-architect
tags: [audit, misclassification, grep, foundation, token, primitive, pattern, state, theme]
sources:
  - Bauhaus architecture contract — docs/architecture.md § The four layers
  - W3C Design Tokens Community Group, Design Tokens Format Module — https://www.w3.org/community/design-tokens/
  - WCAG 2.2 1.4.1 (A), 1.4.11 (AA), 2.4.7 (AA) — https://www.w3.org/TR/WCAG22/
---

# Misfiles

> A misfile is a thing put in the wrong drawer. A paint colour written straight on the wall instead of in the paint catalogue. A recipe sold as an ingredient. Each misfile below says how to spot it, why it hurts, where the thing belongs and the smallest fix. The id is a rule id: use it in reports.

Layer definitions: [layers.md](layers.md). Classification steps: [decision-tree.md](decision-tree.md).

## Rules

1. Report a misfile with its id `misfile.<slug>`. (A stable id lets a team track and ratchet it.)
2. State where the artifact belongs, not only that it is wrong. (A finding without a next step is not actionable.)
3. Propose the smallest fix first. Move one artifact, not the whole system. (Big moves stall.)
4. Grep signals find candidates, not proof. Read the hit before you report it. (Names and paths differ per project.)
5. Treat a raw value outside the token source as HIGH only when it breaks a theme, a contrast pair or a WCAG criterion. Otherwise MEDIUM. (Severity follows user impact.)

## How to read the signals

The grep patterns assume this naming. Adapt them to the project's grammar in `bauhaus.config.json`.

| Tier | Example custom property |
|---|---|
| Primitive token | `--ds-color-blue-600`, `--ds-space-3` |
| Semantic token | `--ds-color-text-muted`, `--ds-space-inline-gap` |
| Component token | `--ds-button-radius` |

Call sites are everything outside the token source and outside the semantic-token layer (components, pages, stories, styleguide examples).

## Values leaked below the token layer

### misfile.raw-value-in-component
- **Symptom:** A component stylesheet holds `#244b7b`, `12px` or `150ms`.
- **Detect:** `grep -rEn '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(' <components>` excluding the token source. Same for lengths `[0-9]+px` on colour, radius, shadow and font properties.
- **Why it hurts:** A theme cannot change it. A contrast audit cannot see it. A rename does not reach it.
- **Belongs:** The token layer, as a semantic token that aliases a tier-1 value.
- **Smallest fix:** Find the exact token. If none, add a semantic token first. Then replace the literal. Never add a one-off token.

### misfile.magic-z-index
- **Symptom:** `z-index: 9999` or any bare integer at a call site.
- **Detect:** `grep -rEn 'z-index:\s*[0-9]+' <components>`
- **Why it hurts:** Stacking wars. Nobody knows which layer wins. Elevation is meaning; z-index is implementation
- **Belongs:** The z-index foundation: named layers as tokens (`--ds-z-modal`).
- **Smallest fix:** Replace the integer with the nearest named layer. If none fits, propose a layer in the foundation.

### misfile.media-query-literal
- **Symptom:** `@media (min-width: 768px)` repeated in components with slightly different numbers.
- **Detect:** `grep -rEn '@media[^{]*[0-9]+(px|em|rem)' <components>`
- **Why it hurts:** Breakpoints drift. Layouts break between two near-equal widths. Reflow at 320px is not guaranteed (WCAG 1.4.10, AA).
- **Belongs:** The breakpoints foundation; one token per named step.
- **Smallest fix:** Replace each number with the named breakpoint. Use the build tool's custom-media or token import.

### misfile.state-colour-literal
- **Symptom:** A state rule holds a literal: `.btn:hover { background: #1a3a5c }`, `:disabled { opacity: .4 }`.
- **Detect:** `grep -rEn ':(hover|active|focus|focus-visible|disabled)[^{]*\{[^}]*(#[0-9a-fA-F]{3,8}|rgba?\()' <components>`
- **Why it hurts:** The state cannot be themed. A dark theme keeps the light colour. Focus indicators can fall below 3:1 (WCAG 1.4.11, AA) and nobody sees it.
- **Belongs:** A semantic state token (`--ds-color-action-primary-hover`, `--ds-color-state-disabled-text`).
- **Smallest fix:** Add the state token, aliasing a tier-1 value. Reference it in the state rule. See [../states/interaction-states.md](../states/interaction-states.md).

## Tier confusion inside the token layer

### misfile.primitive-token-at-call-site
- **Symptom:** A component uses `var(--ds-color-blue-600)`.
- **Detect:** `grep -rEn 'var\(--ds-[a-z]+-[a-z]+-[0-9]{1,3}\)' <components>` (tier-1 names end in a scale step).
- **Why it hurts:** The name carries no intent. A theme cannot remap it. Changing "primary" means editing every component.
- **Belongs:** A semantic token in between (`--ds-color-action-primary`).
- **Smallest fix:** Add the semantic token. Point the call site at it.

### misfile.component-token-as-semantic
- **Symptom:** `--ds-button-radius` is read by `Input` and `Card`.
- **Detect:** `grep -rEn 'var\(--ds-<component>-' <other components>` for each component token.
- **Why it hurts:** Tier 3 belongs to one primitive. Reuse couples two primitives. Changing the button changes the input.
- **Belongs:** A semantic token (`--ds-radius-control`) that both component tokens alias.
- **Smallest fix:** Promote the shared decision to tier 2. Alias each component token to it.

### misfile.semantic-holds-raw-value
- **Symptom:** A tier-2 token has `$value: "#5a6b80"` instead of an alias.
- **Detect:** In the tokens JSON, a token under `color.text.*`, `space.*` (semantic groups) whose `$value` is not `{...}`.
- **Why it hurts:** The tier-1 scale is bypassed. The value exists twice or never in the scale.
- **Belongs:** Tier 1 holds the value. Tier 2 aliases it.
- **Smallest fix:** Add the value to the scale (or reuse a step). Replace the raw value with the alias.

### misfile.primitive-token-aliases-upward
- **Symptom:** `color.blue.600` aliases `{color.action.primary}`.
- **Detect:** A tier-1 token whose `$value` is an alias into a semantic group.
- **Why it hurts:** A cycle in intent. A theme change can rewrite the palette.
- **Belongs:** Aliases point down: component → semantic → primitive token.
- **Smallest fix:** Give the tier-1 token its raw value. Move the intent to a semantic token.

### misfile.token-named-after-value
- **Symptom:** `--ds-blue`, `--ds-space-12px`, `--ds-red-text` at tier 2.
- **Detect:** `grep -rEn -- '--ds-(red|green|blue|amber|gray|grey|black|white)\b|--ds-[a-z-]*-[0-9]+px' <tokens>` at semantic level.
- **Why it hurts:** In a dark theme "blue" may be white. The name lies. Renaming later is a breaking change.
- **Belongs:** A semantic name that states the job (`color.action.primary`, `space.inline.gap`). A tier-1 name may carry a hue and step (`blue.600`), never a raw value.
- **Smallest fix:** Add the intent-named token. Keep the old name as a deprecated alias for one window (see [../governance/versioning.md](../governance/versioning.md)).

### misfile.token-named-after-business
- **Symptom:** `--ds-shipment-late-red`, `--ds-checkout-cta`.
- **Detect:** Token names holding a feature or domain noun.
- **Why it hurts:** Ties the system to one feature. Not reusable. Dies when the feature does.
- **Belongs:** A status intent (`color.status.error`) used by the feature.
- **Smallest fix:** Rename by intent. The feature maps its domain word to the status.

### misfile.token-without-foundation
- **Symptom:** A token for a family that has no scale or page: `--ds-magic-offset-7`.
- **Detect:** A token group with no matching foundation page in the styleguide.
- **Why it hurts:** An arbitrary number with no rule. Others copy it. The scale grows holes.
- **Belongs:** A foundation, proposed first (rationale, scale, limits), then populated.
- **Smallest fix:** Write the foundation section. Or fold the value into an existing scale step and delete the token.

## Foundation confusion

### misfile.foundation-tokens-only
- **Symptom:** The "Colours" page is a swatch table with no reasoning.
- **Detect:** A foundation section that has no rationale, no usage rule and no constraint. Only a generated table.
- **Why it hurts:** People pick a swatch by look. Contrast pairs and limits go unwritten. The scale cannot be defended.
- **Belongs:** The foundation holds the scale, the reason and the rules. The table is a generated view of tokens.
- **Smallest fix:** Add three paragraphs: why this scale, which steps mean what, which pairs must pass (WCAG 1.4.3, AA).

### misfile.colors-page-lists-component-states
- **Symptom:** The "Colours" page lists "button hover", "input error border", "tab active".
- **Detect:** Foundation pages that name components.
- **Why it hurts:** The foundation now changes whenever a component does. The family loses its shape.
- **Belongs:** Component states live in the primitive's state matrix, styled by semantic state tokens. The colour page shows the ramp and the status set.
- **Smallest fix:** Move each row into the primitive's page. Leave a link.

### misfile.theme-as-foundation
- **Symptom:** "Dark mode" is a foundation page with its own scale.
- **Detect:** A foundations list containing a mode name (dark, brand, high contrast).
- **Why it hurts:** A theme has no scale. It remaps intents. Filing it as a family invites a parallel token tree.
- **Belongs:** Theming, over semantic tokens (see [../tokens/theming.md](../tokens/theming.md)).
- **Smallest fix:** Rename the section "Themes". Keep one token tree with per-theme overrides.

### misfile.theme-overrides-primitives
- **Symptom:** The dark theme edits `Button` styles, or redefines `color.blue.600`.
- **Detect:** A theme file that holds selectors, or overrides tier-1 or tier-3 tokens.
- **Why it hurts:** Themes multiply components. The same blue now means two things.
- **Belongs:** A theme overrides semantic tokens only.
- **Smallest fix:** Move the override up to the semantic token. Delete the primitive-level override.

### misfile.value-only-in-docs
- **Symptom:** A value appears in the styleguide prose (`spacing is 12px`) but not in tokens.
- **Detect:** Numbers or hex codes in styleguide Markdown that resolve to no token.
- **Why it hurts:** The doc and the code drift. The guide describes something the CSS no longer does.
- **Belongs:** The token. The guide shows a generated table and explains the reason.
- **Smallest fix:** Generate the table from tokens. Delete the hand-typed value.

## Primitive confusion

### misfile.primitive-encodes-business-flow
- **Symptom:** `ApproveShipmentButton`, or `Button` with `type="checkout"`.
- **Detect:** Primitive names or props holding domain nouns. Imports of feature code inside the library.
- **Why it hurts:** The library depends on the product. It cannot be reused or versioned alone.
- **Belongs:** Feature code that uses `Button`.
- **Smallest fix:** Move the component to the feature. Keep the library primitive generic.

### misfile.primitive-two-jobs
- **Symptom:** One component with five unrelated modifiers, or a `type` prop that switches the anatomy.
- **Detect:** A prop with more than four values that change structure, not look. Docs that say "and".
- **Why it hurts:** The API is hard to learn. Every change risks every case. (Gate 3: [contribution](../governance/contribution.md).)
- **Belongs:** Two or more primitives with one job each.
- **Smallest fix:** Split by job. Keep the old name as a thin wrapper during migration.

### misfile.pattern-promoted-to-primitive
- **Symptom:** A component added to the library after one use, because it "looks reusable".
- **Detect:** A library component with one call site. `grep -rc '<Name' src` returns 1.
- **Why it hurts:** The library grows by guess. Every entry costs docs, tests and rules. (Gate 1: [contribution](../governance/contribution.md).)
- **Belongs:** Page code, until it appears twice.
- **Smallest fix:** Move it back beside its caller. Add it to the candidate list.

### misfile.local-look
- **Symptom:** A component-scoped stylesheet sets colour, radius, shadow or type.
- **Detect:** Non-layout properties (`color`, `background`, `border-radius`, `box-shadow`, `font-*`) in feature stylesheets.
- **Why it hurts:** The look forks. Two screens drift apart.
- **Belongs:** Layout stays local. Look belongs to a primitive.
- **Smallest fix:** Use the primitive. If it lacks the look, extend the primitive, not the page.

### misfile.page-component-in-library
- **Symptom:** `DashboardHeader` or `OrdersFilterBar` sits in the shared library.
- **Detect:** Library components that import routes, stores or API clients.
- **Why it hurts:** The library carries product weight. Consumers pull code they never use.
- **Belongs:** The app. A recurring shape may later become a pattern.
- **Smallest fix:** Move it to the app. Keep only what is generic.

## Pattern confusion

### misfile.pattern-own-spacing
- **Symptom:** A pattern sets `margin: 18px` between its parts.
- **Detect:** Literal lengths in pattern stylesheets or inline styles.
- **Why it hurts:** The spacing scale has a hole. The pattern ignores density modes.
- **Belongs:** A spacing token, or a layout primitive (`Stack`) that owns the gap.
- **Smallest fix:** Use `--ds-space-*` tokens through a `Stack` or `Grid` primitive.

### misfile.pattern-own-style
- **Symptom:** A pattern introduces a tint, a border or a shadow no primitive has.
- **Detect:** Pattern CSS with colour or shadow declarations.
- **Why it hurts:** A pattern is composition, not decoration. The look is now invisible to the rulebook.
- **Belongs:** A primitive (a new variant or state) with tokens.
- **Smallest fix:** Add the look to the primitive. Let the pattern compose it.

### misfile.recipe-under-components
- **Symptom:** "Empty state" guidance sits under Storybook `Components/*`, or a wizard is listed beside `Button`.
- **Detect:** Storybook titles under `Components/` whose page describes a flow or a user need.
- **Why it hurts:** Readers look for parts and find recipes. Rules for parts get applied to recipes.
- **Belongs:** `Patterns/*`. The primitive it composes (`EmptyState`) stays under `Components/*`.
- **Smallest fix:** Move the page. Add a link both ways.

## State confusion

### misfile.state-as-variant
- **Symptom:** `<Button variant="disabled">`, `variant="loading"`, `variant="selected"`.
- **Detect:** `grep -rEn 'variant[=:]\s*["'"'"']?(disabled|loading|selected|active|error|hover|focus)' <components>` and union types holding state names.
- **Why it hurts:** A variant is chosen by a designer. A state is imposed by the user or the data. Modelled as a variant, it skips ARIA (`aria-disabled`, `aria-busy`, `aria-selected`) and cannot combine (a disabled secondary button).
- **Belongs:** A state of the primitive: a prop (`disabled`, `loading`) or a pseudo-class, styled by state tokens.
- **Smallest fix:** Turn the variant into a boolean prop. Map it to the attribute and the state token. Keep a deprecated alias for one window.

### misfile.state-only-happy-path
- **Symptom:** A primitive or pattern documents and tests only the ideal state. No empty, loading, error, too-many, disabled or focus story.
- **Detect:** A Storybook page with a single story. A state matrix with empty cells. Data-bearing components with no empty or error branch.
- **Why it hurts:** Users meet the other states daily. Focus and error states carry WCAG duties (2.4.7 AA, 1.4.1 A).
- **Belongs:** The state matrix of each primitive and the lifecycle states of each pattern. See [../states/state-matrix.md](../states/state-matrix.md), [../states/lifecycle-states.md](../states/lifecycle-states.md).
- **Smallest fix:** Fill the matrix. Mark each non-applicable cell "n/a" with a reason. Add one story per state.

## Governance confusion

### misfile.partial-four-artifacts
- **Symptom:** A primitive has CSS but no styleguide section, no Storybook page or no rulebook entries.
- **Detect:** Compare primitive names in `components` against styleguide headings, Storybook titles and rulebook component ids.
- **Why it hurts:** It is used but not specified. It is graded by nobody.
- **Belongs:** Tokens, styleguide, Storybook and rulebook, shipped together.
- **Smallest fix:** Add the missing artifact. Start with a Storybook page and two rulebook entries.

## Rulebook seeds

- `misfile.raw-value-in-component` · auto · HIGH · No raw colour, length or duration outside the token source.
- `misfile.magic-z-index` · auto · MEDIUM · No bare integer `z-index` at a call site.
- `misfile.media-query-literal` · auto · MEDIUM · No literal breakpoint in a media query.
- `misfile.state-colour-literal` · auto · HIGH · No literal in a state rule.
- `misfile.primitive-token-at-call-site` · auto · MEDIUM · Call sites use semantic tokens only.
- `misfile.component-token-as-semantic` · auto · MEDIUM · A component token is read by its own primitive only.
- `misfile.semantic-holds-raw-value` · auto · MEDIUM · Tier-2 tokens are aliases.
- `misfile.token-named-after-value` · auto · MEDIUM · Semantic names carry no colour word or raw value.
- `misfile.state-as-variant` · auto · MEDIUM · No state name in a variant type.
- `misfile.pattern-promoted-to-primitive` · review · MEDIUM · Every library primitive has two or more call sites.
- `misfile.state-only-happy-path` · review · MEDIUM · Every primitive has a filled state matrix.

## See also

- [layers.md](layers.md) — the definitions each misfile violates.
- [decision-tree.md](decision-tree.md) — classify before you file.
- [plain-language.md](plain-language.md) — how to explain a misfile to a non-designer.
- [../tokens/naming.md](../tokens/naming.md) — naming grammar and anti-patterns.
- [../governance/rulebook.md](../governance/rulebook.md) — turning a misfile into a rule.
- [../states/model.md](../states/model.md) — interaction and lifecycle states.
