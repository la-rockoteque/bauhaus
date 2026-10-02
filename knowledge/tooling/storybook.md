---
id: tooling/storybook
title: Storybook as the running spec
shelf: tooling
layer: cross-cutting
owner: ui-designer
tags: [storybook, docs, rulebook, dev-overlay, axe, controls, interaction-tests, kit]
sources:
  - Storybook docs — https://storybook.js.org/docs
  - Storybook accessibility testing (addon-a11y) — https://storybook.js.org/docs/writing-tests/accessibility-testing
  - Storybook interaction tests (play functions) — https://storybook.js.org/docs/writing-tests/interaction-testing
  - axe-core — https://github.com/dequelabs/axe-core
---

# Storybook as the running spec

> The styleguide is the written spec. Storybook is the spec you can click. Each foundation, component and pattern gets a showcase story with live examples, do and don't, the rules it is graded by and an accessibility check, and a guide with the prose.

## Rules

1. Give every foundation, component and pattern a showcase (`<name>.stories.tsx`, one story rendering `<DocPage/>`) and a guide (`<name>.mdx`). A component without both is unfinished. (Basis: four artifacts; `UBIQUITOUS-LANGUAGE.md`.)
2. Sort the sidebar: Introduction, Utilities, Foundations (Themes among them), Primitives, the component families, Patterns. (Basis: `docs/architecture.md` § The three layers.)
3. File a page by what it documents, not by what it is made of. Legacy pages sit beside their modern counterpart. (Basis: one place to look.)
4. Render every showcase through `DocPage` so each has the same sections (see Doc page template). Declare `<Meta of={Stories}/>` in the guide so both share one entry. (Basis: Nielsen 4 Consistency and standards.)
5. Show all required states in the state matrix of the showcase, live, in every theme. A state is a cell of the grid, not a story of its own. (Basis: `states/state-matrix.md`.)
6. Drive the grid cells with `args`, so controls match the real API. Do not hand-write a control for a prop the type already describes. (Basis: Storybook controls read component types.)
7. Write one interaction test per interactive cell for behaviour that a screenshot cannot show: keyboard, focus, open and close. (Basis: `accessibility/testing.md`.)
8. Run axe on each showcase. Zero violations at A and AA is the gate. (Basis: `accessibility/testing.md`.)
9. Publish the rulebook as a live page. Each rule shows its id, severity, verify mode and current verdict. (Basis: `governance/rulebook.md`.)
10. Keep Storybook-only styling out of the design system stylesheet. (Basis: layer separation.)
11. Store a counted debt on a page as a derived number, never as prose. Use a ratchet test. (Basis: `governance/rulebook.md`.)
12. Storybook never replaces the styleguide. Both ship in the same change. (Basis: four artifacts.)

## Structure

| Section | Holds |
|---|---|
| Principles | What the system believes. The rulebook page. The accessibility checklist. |
| Foundations | Colour, typography, spacing, radius and border, elevation, motion, iconography, density. |
| Themes | One entry per theme: light, dark. |
| Primitives | Box, Text, Icon, Visually hidden. |
| Component families | One entry per component, grouped by family (clickables, fields, data-structures, feedback, overlays, navigation). |
| Patterns | Compositions: loading, empty and error, forms, filtering, data tables, dashboards. |

Titles follow `Section/Name`, taken from the path. Example: `Fields/Text field`. A toolbar switches light and dark.

## The showcase and the guide

`DocPage` lives in `fixtures/doc-page/`. Fixtures are Storybook-only building blocks, one slice each, and the published package never includes them. The showcase story passes it props (`governance/page-contract.md` maps the six sections to props). It has these blocks:

1. **Header** — eyebrow (`kind`) and title.
2. **Introduction** — a short plain line and the precise line.
3. **Anatomy** — the stage with an anchor on each part (`target` selector), a collapsible parts panel with dotted leader lines (numbered pins with tooltips when the panel is closed or the screen is narrow), then the Specs table and the API table.
4. **Tokens** — the tokens it reads, with swatches.
5. **States** — a grid of every state the matrix requires: live render and trigger; `n/a` cells with their reason; `missing` cells badged.
6. **Do and don't** — two columns, each line with a basis chip.
7. **Rulebook** — the entries of `<name>.rules.ts` with live verdicts.
8. **Accessibility** — coverage: keyboard contract, ARIA, and the checklist items that apply.

The guide (`<name>.mdx`) holds the rest: the full Introduction, Usage in depth, the reasoning behind each state, Pitfalls with reasons, every rule with its basis. The two never repeat each other's tables.

## The dev overlay

A development-only layer over the running app or story.

- **axe in the page.** It scans the live DOM and lists violations in a small panel (HUD).
- **Advisories drawn over components.** A standing finding in `advisories` is painted as a marker on the element it concerns, on the route and at the width where it breaks.
- **Source stamps.** A build plugin adds `data-ds-src="<path>:<line>"` to host elements in dev builds only, so a marker can find its element.
- **Closing a finding is deleting its entry.** Comments and "resolved" flags are not used.
- The overlay never ships to production.

An advisory entry carries: `ref` (file and line), `route`, `severity`, `rule`, `message`, optional `selector` and optional `ruleId`. Leave `ruleId` out unless the rule exists.

## Addons

| Addon | Use |
|---|---|
| Docs (`@storybook/addon-docs`) | Doc pages and autodocs. In the kit. |
| Accessibility (`@storybook/addon-a11y`) | axe results per story. Add it to a project; the kit uses the dev overlay for the same job. |
| Interactions (`play` functions) | Keyboard and focus tests inside a story. |
| Test runner or Vitest integration | Runs stories as tests in CI. |
| Viewport and themes toolbar | Switch width and theme without editing code. |

## The plugin kit

`kit/storybook` is a seed for React, ported from a mature internal system. It holds: `.storybook` config and theme, `src/stories` (docs, foundations, components, patterns, a `benchmark` folder with rules and checks), `src/devOverlay`, and ratchet tests. It is to be pruned: copy only what the project needs, and drop domain-specific stories. Other stacks get tokens, styleguide and rulebook without it (`tooling/framework-adapters.md`).

## Why

A written spec drifts from the code. A running page cannot: it renders the real component. Putting rules, states and axe on the same page turns review into looking at one place.

## Rulebook seeds

- `storybook.page-per-component` · auto · HIGH · Every exported component has a showcase and a guide. Four artifacts.
- `storybook.states-shown` · review · MEDIUM · The state matrix shows every state in the matrix.
- `storybook.axe-clean` · auto · HIGH · Each showcase has zero axe violations at A and AA.
- `storybook.interaction-test` · review · MEDIUM · Interactive components have a `play` test.
- `storybook.rulebook-live` · auto · MEDIUM · The rulebook page reads live verdicts.
- `storybook.docs-template` · auto · LOW · Every showcase renders `DocPage`.

## Misfiles

- Screenshot comparison belongs in `tooling/visual-regression.md`.
- Token build scripts belong in `tokens/pipelines.md`.
- Component API rules belong in `components/api-design.md`.

## See also

- `accessibility/testing.md`
- `states/state-matrix.md`
- `governance/rulebook.md`
- `tooling/visual-regression.md`
- `tooling/framework-adapters.md`
