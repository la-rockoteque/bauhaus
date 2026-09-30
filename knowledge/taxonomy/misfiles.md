---
id: taxonomy/misfiles
title: Misfiles — wrong-layer artifacts
shelf: taxonomy
layer: cross-cutting
owner: design-system-architect
tags: [audit, misclassification, grep, foundation, token, component, pattern, state, theme, palette]
sources:
  - Bauhaus architecture contract — docs/architecture.md § The three layers
  - W3C Design Tokens Community Group, Design Tokens Format Module — https://www.w3.org/community/design-tokens/
  - WCAG 2.2 1.4.1 (A), 1.4.11 (AA), 2.4.7 (AA) — https://www.w3.org/TR/WCAG22/
  - Atlassian, Design tokens — https://atlassian.design/foundations/design-tokens/ ("Design tokens are the new way to apply visual foundations"); Material 3 Foundations — https://m3.material.io/foundations (design tokens sit inside Foundations); Primer, Color usage — https://primer.style/product/getting-started/foundations/color-usage/ (base colour tokens "should never be used directly in code or design"); Carbon, Color overview — https://carbondesignsystem.com/elements/color/overview/ ("Color token names and roles are the same across themes")
  - Robert C. Martin, "Screaming Architecture", 2011
  - Jimmy Bogard, "Vertical Slice Architecture", 2018
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
| Primitive token | `--ds-palette-dark-blue-600`, `--ds-colors-primary-600`, `--ds-space-3` |
| Semantic token (colour: a role) | `--ds-text-muted`, `--ds-action-primary`, `--ds-space-inline-gap` |
| Component token | `--ds-button-radius` |

Call sites are everything outside the token source and outside the semantic tokens (components, pages, stories, styleguide examples).

## Values leaked outside the token source

### misfile.raw-value-in-component
- **Symptom:** A component stylesheet holds `#244b7b`, `12px` or `150ms`.
- **Detect:** `grep -rEn '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(' <components>` excluding the token source. Same for lengths `[0-9]+px` on colour, radius, shadow and font properties.
- **Why it hurts:** A theme cannot change it. A contrast audit cannot see it. A rename does not reach it.
- **Belongs:** The token source, as a semantic token that aliases a tier-1 value (for colour, a role).
- **Smallest fix:** Find the exact token. If none, add a semantic token first. Then replace the literal. Never add a one-off token.

### misfile.magic-z-index
- **Symptom:** `z-index: 9999` or any bare integer at a call site.
- **Detect:** `grep -rEn 'z-index:\s*[0-9]+' <components>`
- **Why it hurts:** Stacking wars. Nobody knows which layer wins. Elevation is meaning; z-index is implementation
- **Belongs:** The z-index foundation: named layers stored as tokens (`--ds-z-modal`).
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
- **Belongs:** A state role (`--ds-action-primary-hover`, `--ds-disabled-text`).
- **Smallest fix:** Add the state role to every theme, aliasing `colors.*`. Reference it in the state rule. See [../states/interaction-states.md](../states/interaction-states.md).

## Tier confusion inside the stored tokens

### misfile.primitive-token-at-call-site
- **Symptom:** A component uses `var(--ds-space-3)` where `--ds-space-inset-md` exists, or (for colour) `var(--ds-palette-dark-blue-600)`. Colour has its own id: `misfile.palette-at-call-site`.
- **Detect:** `grep -rEn 'var\(--ds-[a-z]+-[a-z]+-[0-9]{1,3}\)' <components>` (tier-1 names end in a scale step).
- **Why it hurts:** The name carries no intent. A theme cannot remap it. Changing "primary" means editing every component.
- **Belongs:** A semantic token in between (`--ds-space-inset-md`; for colour, `--ds-action-primary`).
- **Smallest fix:** Add the semantic token. Point the call site at it.

### misfile.component-token-as-semantic
- **Symptom:** `--ds-button-radius` is read by `Input` and `Card`.
- **Detect:** `grep -rEn 'var\(--ds-<component>-' <other components>` for each component token.
- **Why it hurts:** Tier 3 belongs to one component. Reuse couples two components. Changing the button changes the input.
- **Belongs:** A semantic token (`--ds-radius-control`) that both component tokens alias.
- **Smallest fix:** Promote the shared decision to tier 2. Alias each component token to it.

### misfile.semantic-holds-raw-value
- **Symptom:** A tier-2 token has `$value: "#5a6b80"` instead of an alias.
- **Detect:** In the tokens JSON, a token under `text.*`, `surface.*`, `action.*`, `space.inset.*` (semantic groups) whose `$value` is not `{...}`.
- **Why it hurts:** The tier-1 scale is bypassed. The value exists twice or never in the scale.
- **Belongs:** Tier 1 holds the value. Tier 2 aliases it.
- **Smallest fix:** Add the value to the scale (or reuse a step). Replace the raw value with the alias.

### misfile.primitive-token-aliases-upward
- **Symptom:** `palette.dark-blue.600` aliases `{action.primary}`.
- **Detect:** A tier-1 token whose `$value` is an alias into a semantic group.
- **Why it hurts:** A cycle in intent. A theme change can rewrite the palette.
- **Belongs:** Aliases point down: component → semantic → primitive token.
- **Smallest fix:** Give the tier-1 token its raw value. Move the intent to a semantic token.

### misfile.palette-at-call-site
- **Symptom:** A component or pattern uses `palette.*` or `colors.*` instead of a role: `var(--ds-palette-dark-blue-600)`, `var(--ds-colors-primary-600)`.
- **Detect:** `grep -rEn 'var\(--ds-(palette|colors)-' <components> <patterns>`. In tokens JSON, a component token whose `$value` starts with `{palette.` or `{colors.`.
- **Why it hurts:** The palette does not respect themes. The dark theme cannot remap it, so the component keeps its light colour. Primer: base colour tokens "should never be used directly in code or design". Material 3: component tokens "should point to a system or reference token" through roles. Contrast is checked on role pairs, so a direct reference escapes the check (WCAG 1.4.3, AA; 1.4.11, AA).
- **Belongs:** A role (`action.primary`, `text.muted`, `status.error`). Charts that need a scale may read `colors.*` in the chart foundation's own slice, not in a component.
- **Smallest fix:** Find the role with the same job. If none exists, add it to every theme, aliasing `colors.*`. Point the call site at the role.

### misfile.token-named-after-value
- **Symptom:** `--ds-blue`, `--ds-space-12px`, `--ds-red-text` at tier 2.
- **Detect:** `grep -rEn -- '--ds-(red|green|blue|amber|gray|grey|black|white)\b|--ds-[a-z-]*-[0-9]+px' <tokens>` at semantic level.
- **Why it hurts:** In a dark theme "blue" may be white. The name lies. Renaming later is a breaking change.
- **Belongs:** A semantic name that states the job (`action.primary`, `space.inline.gap`). A tier-1 name may carry a hue and grade (`dark-blue.600`), never a raw value.
- **Smallest fix:** Add the intent-named token. Keep the old name as a deprecated alias for one window (see [../governance/versioning.md](../governance/versioning.md)).

### misfile.token-named-after-business
- **Symptom:** `--ds-shipment-late-red`, `--ds-checkout-cta`.
- **Detect:** Token names holding a feature or domain noun.
- **Why it hurts:** Ties the system to one feature. Not reusable. Dies when the feature does.
- **Belongs:** A status role (`status.error`) used by the feature.
- **Smallest fix:** Rename by intent. The feature maps its domain word to the status.

### misfile.token-without-foundation
- **Symptom:** A token for a family that has no scale or page: `--ds-magic-offset-7`.
- **Detect:** A token group with no matching foundation page in the styleguide.
- **Why it hurts:** An arbitrary number with no rule. Others copy it. The scale grows holes.
- **Belongs:** A foundation, proposed first (rationale, scale, limits), then stored as tokens.
- **Smallest fix:** Write the foundation section. Or fold the value into an existing scale step and delete the token.

## Foundation confusion

### misfile.foundation-tokens-only
- **Symptom:** The "Colours" page is a swatch table with no reasoning.
- **Detect:** A foundation section that has no rationale, no usage rule and no constraint. Only a generated table.
- **Why it hurts:** People pick a swatch by look. Contrast pairs and limits go unwritten. The scale cannot be defended.
- **Belongs:** The foundation holds the scale, the reason and the rules. The table is a generated view of its tokens.
- **Smallest fix:** Add three paragraphs: why this scale, which steps mean what, which pairs must pass (WCAG 1.4.3, AA).

### misfile.colors-page-lists-component-states
- **Symptom:** The "Colours" page lists "button hover", "input error border", "tab active".
- **Detect:** Foundation pages that name components.
- **Why it hurts:** The foundation now changes whenever a component does. The family loses its shape.
- **Belongs:** Component states live in the component's state matrix, styled by state roles. The colour page shows the ramp and the status set.
- **Smallest fix:** Move each row into the component's page. Leave a link.

### misfile.theme-as-foundation
- **Symptom:** "Dark mode" is a foundation page with its own scale.
- **Detect:** A foundations list containing a mode name (dark, brand, high contrast).
- **Why it hurts:** A theme has no scale. It remaps intents. Filing it as a family invites a parallel token tree.
- **Belongs:** A sibling theme that defines every role (see [../tokens/theming.md](../tokens/theming.md)).
- **Smallest fix:** Rename the section "Themes". Keep one palette and one colors file, and one roles file per theme.

### misfile.theme-overrides-primitive-tokens
- **Symptom:** The dark theme edits `Button` styles, or redefines `palette.dark-blue.600`.
- **Detect:** A theme file that holds selectors, or defines palette, colors or component tokens.
- **Why it hurts:** Themes multiply components. The same blue now means two things.
- **Belongs:** A theme holds roles only.
- **Smallest fix:** Move the override up to a role. Delete the palette or component override.

### misfile.theme-not-sibling
- **Symptom:** `themes/dark` lists only the roles that differ from light, or rewrites palette or colors values. Roles exist in one theme and not in another.
- **Detect:** Compare the role names of every `themes/*/*.tokens.json`: the sets must be equal (`scripts/tokens.mjs check`). A theme file that defines `palette.*` or `colors.*`.
- **Why it hurts:** A missing role has no colour in that theme, or inherits one nobody tested. A rewritten palette makes one hue mean two things. Carbon: "Color token names and roles are the same across themes, only the assigned value will change".
- **Belongs:** A sibling theme: a full set of role values, same names as every other theme. `light` is the default.
- **Smallest fix:** Copy the missing roles into the theme with their own values. Move palette rewrites into a role that picks a different `colors` grade.

### misfile.value-only-in-docs
- **Symptom:** A value appears in the styleguide prose (`spacing is 12px`) but not in tokens.
- **Detect:** Numbers or hex codes in styleguide Markdown that resolve to no token.
- **Why it hurts:** The doc and the code drift. The guide describes something the CSS no longer does.
- **Belongs:** The token. The guide shows a generated table and explains the reason.
- **Smallest fix:** Generate the table from tokens. Delete the hand-typed value.

## Component confusion

### misfile.component-encodes-business-flow
- **Symptom:** `ApproveShipmentButton`, or `Button` with `type="checkout"`.
- **Detect:** Component names or props holding domain nouns. Imports of feature code inside the library.
- **Why it hurts:** The library depends on the product. It cannot be reused or versioned alone.
- **Belongs:** Feature code that uses `Button`.
- **Smallest fix:** Move the component to the feature. Keep the library component generic.

### misfile.component-two-jobs
- **Symptom:** One component with five unrelated modifiers, or a `type` prop that switches the anatomy.
- **Detect:** A prop with more than four values that change structure, not look. Docs that say "and".
- **Why it hurts:** The API is hard to learn. Every change risks every case. (Gate 3: [contribution](../governance/contribution.md).)
- **Belongs:** Two or more components with one job each.
- **Smallest fix:** Split by job. Keep the old name as a thin wrapper during migration.

### misfile.pattern-promoted-to-component
- **Symptom:** A component added to the library after one use, because it "looks reusable".
- **Detect:** A library component with one call site. `grep -rc '<Name' src` returns 1.
- **Why it hurts:** The library grows by guess. Every entry costs docs, tests and rules. (Gate 1: [contribution](../governance/contribution.md).)
- **Belongs:** Page code, until it appears twice.
- **Smallest fix:** Move it back beside its caller. Add it to the candidate list.

### misfile.local-look
- **Symptom:** A component-scoped stylesheet sets colour, radius, shadow or type.
- **Detect:** Non-layout properties (`color`, `background`, `border-radius`, `box-shadow`, `font-*`) in feature stylesheets.
- **Why it hurts:** The look forks. Two screens drift apart.
- **Belongs:** Layout stays local. Look belongs to a component.
- **Smallest fix:** Use the component. If it lacks the look, extend the component, not the page.

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
- **Belongs:** A spacing token, or a layout component (`Stack`) that owns the gap.
- **Smallest fix:** Use `--ds-space-*` tokens through a `Stack` or `Grid` component.

### misfile.pattern-own-style
- **Symptom:** A pattern introduces a tint, a border or a shadow no component has.
- **Detect:** Pattern CSS with colour or shadow declarations.
- **Why it hurts:** A pattern is composition, not decoration. The look is now invisible to the rulebook.
- **Belongs:** A component (a new variant or state) with tokens.
- **Smallest fix:** Add the look to the component. Let the pattern compose it.

### misfile.recipe-under-components
- **Symptom:** "Empty state" guidance sits under Storybook `Components/*`, or a wizard is listed beside `Button`.
- **Detect:** Storybook titles under `Components/` whose page describes a flow or a user need.
- **Why it hurts:** Readers look for parts and find recipes. Rules for parts get applied to recipes.
- **Belongs:** `Patterns/*`. The component it composes (`EmptyState`) stays under `Components/*`.
- **Smallest fix:** Move the page. Add a link both ways.

## State confusion

### misfile.state-as-variant
- **Symptom:** `<Button variant="disabled">`, `variant="loading"`, `variant="selected"`.
- **Detect:** `grep -rEn 'variant[=:]\s*["'"'"']?(disabled|loading|selected|active|error|hover|focus)' <components>` and union types holding state names.
- **Why it hurts:** A variant is chosen by a designer. A state is imposed by the user or the data. Modelled as a variant, it skips ARIA (`aria-disabled`, `aria-busy`, `aria-selected`) and cannot combine (a disabled secondary button).
- **Belongs:** A state of the component: a prop (`disabled`, `loading`) or a pseudo-class, styled by state roles.
- **Smallest fix:** Turn the variant into a boolean prop. Map it to the attribute and the state role. Keep a deprecated alias for one window.

### misfile.state-only-happy-path
- **Symptom:** A component or pattern documents and tests only the ideal state. No empty, loading, error, too-many, disabled or focus story.
- **Detect:** A showcase whose state matrix shows only the default. A state matrix with empty cells. Data-bearing components with no empty or error branch.
- **Why it hurts:** Users meet the other states daily. Focus and error states carry WCAG duties (2.4.7 AA, 1.4.1 A).
- **Belongs:** The state matrix of each component and the lifecycle states of each pattern. See [../states/state-matrix.md](../states/state-matrix.md), [../states/lifecycle-states.md](../states/lifecycle-states.md).
- **Smallest fix:** Fill the matrix. Mark each non-applicable cell "n/a" with a reason. Add a state matrix cell per state.

## Structure confusion

### misfile.primitive-as-layer
- **Symptom:** A doc, a folder tree or a Storybook sidebar treats "primitives" as a layer next to components.
- **Detect:** `grep -rniE 'primitives? (layer|tier)|layers?:.*primitive' docs <library>` and a root `primitives/` listed beside `foundations/`, `components/` and `patterns/` as its own layer.
- **Why it hurts:** The three layers blur into four. "Is it a primitive or a component?" has no answer, and the gates apply twice.
- **Belongs:** A component kind. A base building block that other components are built from (`Box`, `Text`, `Icon`) lives in `primitives/` and is a component. "Primitive" otherwise names only the tier-1 primitive token.
- **Smallest fix:** Rewrite the doc to say three layers. Keep `primitives/` as a folder of base components. Do not add a fourth layer.

### misfile.token-as-layer
- **Symptom:** A doc, a folder tree or a Storybook sidebar lists "Tokens" as a layer next to foundations and components: `tokens/` beside `foundations/`, a layer list that reads "foundation, token, component, pattern".
- **Detect:** `grep -rniE 'token layer|layers?:.*token' docs <library>`; a root `tokens/` folder next to `foundations/`, `components/` and `patterns/`.
- **Why it hurts:** Tokens carry foundation decisions. A second home for the same decision splits colour into a "colour" page and a "colour tokens" tree that drift. Atlassian: "Design tokens are the new way to apply visual foundations". Material 3 files design tokens under Foundations. DTCG defines a token as a name/value pair, a format and not a layer.
- **Belongs:** Inside the foundation slice (`foundations/<name>/<name>.tokens.json`); component tokens inside the component slice. Tiers (primitive, semantic, component) stay as an attribute of a token.
- **Smallest fix:** Move each token file into its foundation slice. Rewrite the doc to say three layers.

### misfile.folder-by-file-type
- **Symptom:** Folders named `hooks/`, `utils/`, `helpers/`, `common/`, `shared/`, `types/`, `constants/`, `styles/` or `stories/`.
- **Detect:** `find <library> -type d \( -name hooks -o -name utils -o -name helpers -o -name common -o -name shared -o -name types -o -name constants -o -name styles -o -name stories \)`
- **Why it hurts:** The folder names a kind of file, not what the code does. Related files sit far apart. The folder grows into a dumping ground.
- **Belongs:** Beside its consumer, or in the nearest common ancestor of its consumers, named for what it does (`use-press.ts` in `clickables/`).
- **Smallest fix:** Move one file at a time. Name the new home for its job. Basis: Robert C. Martin, "Screaming Architecture", 2011; Jimmy Bogard, "Vertical Slice Architecture", 2018.

### misfile.story-far-from-component
- **Symptom:** Stories live in a separate tree (`stories/`, `.storybook/stories/`) away from the component.
- **Detect:** `find <library> -name '*.stories.*'` where the story is not in the component's slice.
- **Why it hurts:** Code and story drift apart. A rename or a delete leaves a dead story.
- **Belongs:** `<name>.stories.tsx` in the component's slice.
- **Smallest fix:** Move the file into the slice. Keep the Storybook title derived from the path.

### misfile.library-imports-app
- **Symptom:** The library imports app code, an i18n runtime, the router or an API client.
- **Detect:** `grep -rEn "from '(@?app|\.\./\.\./app|react-router|i18next)|fetch\(" <library>`
- **Why it hurts:** The library cannot be built, tested or versioned alone. Consumers pull code they never use.
- **Belongs:** The app. The library takes text, callbacks and data as props.
- **Smallest fix:** Replace the import with a prop. Move the logic to the caller. Basis: the isolation rules in `docs/library.md`.

## Governance confusion

### misfile.partial-four-artifacts
- **Symptom:** A component has CSS but no guide, no showcase or no rulebook entries.
- **Detect:** Compare component names in `components` against styleguide headings, Storybook titles and rulebook component ids.
- **Why it hurts:** It is used but not specified. It is graded by nobody.
- **Belongs:** Tokens, styleguide, Storybook and rulebook, shipped together.
- **Smallest fix:** Add the missing artifact. Start with a showcase and two rulebook entries.

## Rulebook seeds

- `misfile.raw-value-in-component` · auto · HIGH · No raw colour, length or duration outside the token source.
- `misfile.magic-z-index` · auto · MEDIUM · No bare integer `z-index` at a call site.
- `misfile.media-query-literal` · auto · MEDIUM · No literal breakpoint in a media query.
- `misfile.state-colour-literal` · auto · HIGH · No literal in a state rule.
- `misfile.primitive-token-at-call-site` · auto · MEDIUM · Call sites use semantic tokens only.
- `misfile.palette-at-call-site` · auto · HIGH · No component or pattern reads `palette.*` or `colors.*`; roles only.
- `misfile.theme-not-sibling` · auto · HIGH · Every theme defines the same role names and no palette or colors value.
- `misfile.token-as-layer` · review · MEDIUM · Tokens are not filed or documented as a layer next to foundations.
- `misfile.component-token-as-semantic` · auto · MEDIUM · A component token is read by its own component only.
- `misfile.semantic-holds-raw-value` · auto · MEDIUM · Tier-2 tokens are aliases.
- `misfile.token-named-after-value` · auto · MEDIUM · Semantic names carry no colour word or raw value.
- `misfile.state-as-variant` · auto · MEDIUM · No state name in a variant type.
- `misfile.pattern-promoted-to-component` · review · MEDIUM · Every library component has two or more call sites.
- `misfile.state-only-happy-path` · review · MEDIUM · Every component has a filled state matrix.
- `misfile.folder-by-file-type` · auto · MEDIUM · No folder named for a kind of file.
- `misfile.library-imports-app` · auto · HIGH · The library imports no app, i18n, router or API code.

## See also

- [layers.md](layers.md) — the definitions each misfile violates.
- [decision-tree.md](decision-tree.md) — classify before you file.
- [plain-language.md](plain-language.md) — how to explain a misfile to a non-designer.
- [../tokens/naming.md](../tokens/naming.md) — naming grammar and anti-patterns.
- [../governance/rulebook.md](../governance/rulebook.md) — turning a misfile into a rule.
- [../states/model.md](../states/model.md) — interaction and lifecycle states.
