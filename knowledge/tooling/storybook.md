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

> The styleguide is the written spec. Storybook is the spec you can click. Each foundation, component and pattern gets one page with live examples, do and don't, the rules it is graded by, and an accessibility check drawn on the component.

## Rules

1. Give every foundation, component and pattern one Storybook page. A component without a page is unfinished. (Basis: four artifacts; `UBIQUITOUS-LANGUAGE.md`.)
2. Group pages by layer, in reading order: Principles, Foundations, Components, Patterns. (Basis: `docs/architecture.md` § The four layers.)
3. File a page by what it documents, not by what it is made of. Legacy pages sit beside their modern counterpart. (Basis: one place to look.)
4. Build every doc page from one template so each page has the same sections: summary, anatomy, states, rules, do and don't. (Basis: Nielsen 4 Consistency and standards.)
5. Show all required states on the component page, in every theme. (Basis: `states/state-matrix.md`.)
6. Drive stories with `args` and `argTypes`, so controls match the real API. Do not hand-write a control for a prop the type already describes. (Basis: Storybook controls read component types.)
7. Write one interaction test per story for behaviour that a screenshot cannot show: keyboard, focus, open and close. (Basis: `accessibility/testing.md`.)
8. Run axe on each story. Zero violations at A and AA is the gate. (Basis: `accessibility/testing.md`.)
9. Publish the rulebook as a live page. Each rule shows its id, severity, verify mode and current verdict. (Basis: `governance/rulebook.md`.)
10. Keep Storybook-only styling out of the design system stylesheet. (Basis: layer separation.)
11. Store a counted debt on a page as a derived number, never as prose. Use a ratchet test. (Basis: `governance/rulebook.md`.)
12. Storybook never replaces the styleguide. Both ship in the same change. (Basis: four artifacts.)

## Structure

| Section | Holds |
|---|---|
| Principles | What the system believes. The rulebook page. The accessibility checklist. |
| Foundations | Colour, typography, spacing, radius and border, elevation, motion, iconography, density. |
| Components | One page per component, grouped by job (fields, data, navigation). |
| Patterns | Compositions: loading, empty and error, forms, filtering, data tables, dashboards. |

Titles follow `Section/Group/Name`. Example: `Components/Fields/Text field`.

## Doc page template

Each page has these blocks:

1. **Summary** — one plain sentence of the job.
2. **Anatomy** — text diagram with numbered parts.
3. **States** — a grid of every state the matrix requires.
4. **Specs** — the tokens it reads, sizes, target size.
5. **Do and don't** — paired examples, each with a reason.
6. **Rules** — the rulebook entries with live verdicts.
7. **Accessibility** — keyboard contract, ARIA, and the checklist items that apply.

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

- `storybook.page-per-component` · auto · HIGH · Every exported component has a page. Four artifacts.
- `storybook.states-shown` · review · MEDIUM · The page shows every state in the matrix.
- `storybook.axe-clean` · auto · HIGH · Each story has zero axe violations at A and AA.
- `storybook.interaction-test` · review · MEDIUM · Interactive components have a `play` test.
- `storybook.rulebook-live` · auto · MEDIUM · The rulebook page reads live verdicts.
- `storybook.docs-template` · auto · LOW · Doc pages use the shared template.

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
