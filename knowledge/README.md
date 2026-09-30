# Bauhaus knowledge base

The shelves agents read before they build, review or advise. File format: `docs/architecture.md` § Knowledge-base file format. Terms: `UBIQUITOUS-LANGUAGE.md`.

Read order for a new task: `taxonomy/layers.md` → the shelf of the layer in question → `accessibility/wcag-map.md` for any criterion you cite.

## bauhaus/ — why the plugin thinks the way it does
- `bauhaus/principles.md` — the Bauhaus school and movement, mapped to design-system principles (form follows function, the Vorkurs as the foundation layer, the workshops as components, the Gesamtkunstwerk as the system).

## taxonomy/ — the three layers, and telling them apart
- `taxonomy/layers.md` — foundation, component, pattern: definitions, boundaries, dependencies. Tokens are how foundations are stored, not a layer.
- `taxonomy/decision-tree.md` — classify any artifact in five questions.
- `taxonomy/misfiles.md` — the catalogue of wrong-layer artifacts, how to spot each, where it belongs.
- `taxonomy/plain-language.md` — analogies, glossary and templates for explaining the system to non-designers.

## states/ — a core concept: every state, designed
- `states/model.md` — the three axes (lifecycle, interaction, view) and their crosswalk; which layer owns which state.
- `states/lifecycle-states.md` — Speelman's nine: nothing, loading, none, one, some, too-many, incorrect, correct, done.
- `states/interaction-states.md` — default, hover, focus-visible, active, disabled, loading, success, error, selected, and the rest.
- `states/state-matrix.md` — the per-component matrix, how to author, test and grade it.

## foundations/ — the value families
- `foundations/color.md` — palette, colors, roles.
- `foundations/typography.md`
- `foundations/spacing-layout.md` — spacing scale, grid, layout, breakpoints.
- `foundations/shape.md` — radius, border widths, strokes.
- `foundations/elevation.md` — shadows, surfaces, z-index.
- `foundations/motion.md` — durations, easing, choreography, reduced motion, perception research.
- `foundations/iconography.md`
- `foundations/density.md` — compact / comfortable, target size.

## tokens/ — how foundation decisions are stored
- `tokens/architecture.md` — tiers (primitive token, semantic, component), aliasing, DTCG format, the colour chain.
- `tokens/naming.md` — naming grammar (palette by hue, colors by role, roles by purpose), prefixes, anti-patterns.
- `tokens/theming.md` — sibling themes (light default, dark): parity, contrast per theme, what changes per theme.
- `tokens/pipelines.md` — DTCG → platforms, Style Dictionary, Tokens Studio, Figma variables, `scripts/tokens.mjs`.

## accessibility/
- `accessibility/wcag-map.md` — WCAG 2.2 criteria that touch a design system, number + level + owner agent.
- `accessibility/apg-patterns.md` — the ARIA Authoring Practices patterns and their keyboard contracts.
- `accessibility/testing.md` — axe, keyboard walks, screen readers, reduced-motion and reflow probes.

## components/ — the reusable blocks
- `components/anatomy-and-states.md` — anatomy, the nine lifecycle states and the interaction states, variants vs props.
- `components/api-design.md` — props, composition, slots, headless vs styled, when to add a component.
- `components/catalog.md` — per-component checklist for the common set (button … dialog).

## patterns/
- `patterns/loading.md`
- `patterns/empty-and-error.md`
- `patterns/forms.md`
- `patterns/data-tables.md`
- `patterns/filtering-search.md`
- `patterns/navigation.md`
- `patterns/dashboards-charts.md`
- `patterns/responsive.md`
- `patterns/content-writing.md` — UX writing, voice, i18n.

## governance/ — keeping it coherent
- `governance/page-contract.md` — the six sections every DSM page carries, per layer, and the anti-slop test.
- `governance/maturity.md` — maturity levels, where a project stands, what to do next.
- `governance/contribution.md` — the four artifacts, the ≥ 2 occurrences rule, review flow.
- `governance/rulebook.md` — rules, verify modes, advisories, known violations, ratchets.
- `governance/versioning.md` — semver for a DS, deprecation, migration, codemods.
- `governance/metrics.md` — adoption, coverage, debt counts.

## analysis/ — recovering a system from existing code
- `analysis/workflow.md` — the nine analyser phases, why the order is fixed, gates, resume, cutting scope.
- `analysis/scale-inference.md` — infer a spacing base, a type ratio, colour ramps and other scales; outliers and overrides.
- `analysis/component-mining.md` — find components, near-duplicates and state gaps; choose the keeper.
- `analysis/pattern-mining.md` — co-occurrence, signals, from candidate to pattern.
- `analysis/normalisation.md` — the nine actions, deltas, prioritisation, batches, deprecation, ratchets, rollback, plain-word plans.

## architecture/ — where the design system lives
- `architecture/library-options.md` — the four ways to house a DS (layered packages, single package, separate repo, web-components core) and how to choose.
- `architecture/folder-structure.md` — screaming architecture and vertical slices: root folders, the slice, naming rules, families, primitives.
- `architecture/extraction.md` — moving a DS out of an app into the library, one slice at a time, with shims and a ratchet.

## tooling/
- `tooling/storybook.md` — structure, doc pages, addons, the dev overlay.
- `tooling/framework-adapters.md` — React, Vue, Svelte, Angular, web components, Tailwind, native.
- `tooling/design-tool-sync.md` — Figma variables, Tokens Studio, code connect.
- `tooling/visual-regression.md`

## references/
- `references/systems.md` — Material 3, Carbon, Fluent 2, Polaris, Atlassian, Primer, Spectrum, GOV.UK: what each is best at and what to borrow.
