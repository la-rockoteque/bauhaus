---
id: governance/maturity
title: Design-system maturity levels
shelf: governance
layer: cross-cutting
owner: design-system-architect
tags: [maturity, assessment, roadmap, detection, next-step]
sources:
  - Bauhaus architecture contract — docs/architecture.md
  - moship design-system guide §6, §9 (kit/styleguide/design-system.md) — the path from CSS custom properties to a ratcheted rulebook
  - W3C Design Tokens Community Group, Design Tokens Format Module — https://www.w3.org/community/design-tokens/
---

# Design-system maturity

> A design system grows in steps. First there is no system. Then there are styles that copy each other. Then named values. Then shared parts. Then written and visible documentation. Then checks that stop backsliding. Then more than one theme or platform. Knowing the step tells you the next move. Do not skip steps: a rulebook over a codebase with no tokens grades noise.

This file gives seven levels (0 to 6), the signals that show each one in a repo, and the smallest next step. Use it when you audit a project or advise on where to start. The levels are a Bauhaus convention, not an industry standard. Say so if asked.

## Rules

1. Assess the level from evidence in the repo, not from what the team says. (Claims drift; files do not.)
2. A project is at level N only if it meets all signals of levels 0 to N. (Levels build on each other.)
3. Report the level, the evidence for it and one next step. (A level with no step is a label.)
4. Recommend the next level only. Do not propose level 6 to a level-1 team. (Small steps finish; big plans stall.)
5. Do not lower a level for a known violation that is tracked and ratcheted. Lower it for an unknown one. (A tracked debt is managed; an unseen one is not.)
6. Re-assess after each major change. Record the date. (Maturity moves both ways.)

## The levels at a glance

| Level | Name | One line |
|---|---|---|
| 0 | None | No shared styles. Each screen styles itself. |
| 1 | Ad hoc styles | A global stylesheet or theme file exists. Values are repeated. |
| 2 | Tokens exist | Named values live in one source. Some call sites use them. |
| 3 | Primitives library | Shared parts with one job each. Call sites use them. |
| 4 | Documented and visible | Styleguide and Storybook cover foundations, primitives and patterns. |
| 5 | Enforced | A rulebook grades the parts. Ratchets stop debt from growing. |
| 6 | Themed and multi-platform | Themes and several platforms build from one token source. |

## Level 0 — None

**Signals**
- Styles are inline or per-page. No shared sheet, or a copy of a CSS framework unchanged.
- `grep -rEo '#[0-9a-fA-F]{6}' src | sort | uniq -c | sort -rn` shows dozens of near-duplicate colours.
- Three or more different button looks.

**Meaning:** each team member decides again each time. Changes touch many files.

**Next step:** pick one global stylesheet or theme file. Move colours, font sizes and spacing that repeat there. Do not name a system yet.

## Level 1 — Ad hoc styles

**Signals**
- One shared stylesheet or theme file holds common values.
- Custom properties or a theme object exist, but names are colour words (`--blue`, `--red2`) or the values are duplicated.
- No token source file. No documentation beyond comments.

**Meaning:** values are shared, but they carry no intent, so a rebrand or dark mode means a search and replace.

**Next step:** adopt the tier model. Write a token source in DTCG JSON with tier-1 scale values and tier-2 semantic names. Start with colour and spacing. Read [../tokens/architecture.md](../tokens/architecture.md).

## Level 2 — Tokens exist

**Signals**
- A token source exists (DTCG JSON or equivalent), often with a build step that outputs CSS custom properties.
- Semantic names exist (`color.text.muted`).
- Token coverage is partial: `grep` still finds raw hex or px in components. See [metrics.md](metrics.md).
- There is no single owner for each foundation. Scales have gaps.

**Meaning:** decisions are named. Adoption is partial. The scale is not yet closed.

**Next step:** write the foundations' scales and close them. Then build the first primitives that read only semantic tokens: Button, Field, Card. See [../taxonomy/layers.md](../taxonomy/layers.md).

## Level 3 — Primitives library

**Signals**
- A component library exists (`components` in project config). Each primitive has one job.
- Primitives read semantic tokens. Few raw values remain.
- Adoption is measurable and rising: most new screens use the library.
- Documentation is thin: comments or a README, not one page per primitive.

**Meaning:** reuse works. The system is not yet visible or checkable.

**Next step:** ship the four artifacts for each primitive, starting with the most used. Write the styleguide section and the Storybook page with every state. See [contribution.md](contribution.md).

## Level 4 — Documented and visible

**Signals**
- A styleguide with sections for foundations, primitives and patterns.
- Storybook (or equivalent) with one page per foundation, primitive and pattern. States are shown, not only the default.
- Each page follows the page contract ([page-contract.md](page-contract.md)).
- No rulebook. Quality depends on review.

**Meaning:** people can learn and see the system. Regressions still slip in, because nothing fails.

**Next step:** write the rulebook for the three most used primitives. Make the `auto` rules run in tests. List today's failures as known violations. Add one ratchet on the biggest debt count. See [rulebook.md](rulebook.md).

## Level 5 — Enforced

**Signals**
- A rulebook with stable ids, severities and verify modes.
- Tests run the `auto` rules in CI. `review` rules have an owner.
- Known violations are listed, each with an advisory.
- At least one ratchet fails on a rise and on an unlowered drop.
- Metrics are read regularly (adoption, token coverage, rulebook coverage). See [metrics.md](metrics.md).

**Meaning:** the system defends itself. Debt can only go down.

**Next step:** add coverage for the primitives not yet graded (the "not graded" list). Then, if the product needs it, add a second theme through semantic-token overrides.

## Level 6 — Themed and multi-platform

**Signals**
- At least two themes (for example light and dark, or two brands) built from one token source by overriding semantic tokens only.
- More than one output platform (web CSS plus native or another stack) generated from the same tokens.
- Versioning and deprecation policy in use. A changelog exists. See [versioning.md](versioning.md).
- Themes are checked against the contrast rules (WCAG 1.4.3 and 1.4.11, AA) in each mode.

**Meaning:** the system is a product. It has consumers, releases and a support duty.

**Next step:** measure consumer adoption and deprecation progress. Publish. Keep the set small (see [../bauhaus/principles.md](../bauhaus/principles.md), principle 9).

## Detecting the level

Run these checks in order. Stop at the first "no". The level is the last "yes".

| # | Check | How |
|---|---|---|
| 1 | Is there a shared stylesheet or theme? | Look for a global CSS, SCSS or theme file. |
| 2 | Is there a token source with semantic names? | Look for `tokens.source` in `bauhaus.config.json`, or `tokens/*.json`, or `$value` keys. |
| 3 | Is there a components library with several call sites per part? | Count imports of each library component across `src`. |
| 4 | Are there styleguide sections and Storybook pages per part, with states? | Compare primitive names against headings and story titles. |
| 5 | Is there a rulebook with tests and a ratchet? | Look for rule ids, `KNOWN_VIOLATIONS` or equivalent, and a test that fails on a count change. |
| 6 | Are there two themes or two platform outputs from one token source? | Look for theme override files and multiple build targets. |

## Partial levels

Real repos straddle levels. Report the lowest complete level and name the part that is ahead.

Example: "Level 2. Tokens exist and coverage is 71%. A Storybook already covers four primitives (level 4 signal), but the library has no shared owner (level 3 gap)."

## Rulebook seeds

- `maturity.level-reported` · review · LOW · An audit states the level, its evidence and one next step.
- `maturity.no-skip` · review · LOW · A roadmap does not propose a level more than one above the current one.

## Misfiles

- Equating maturity with size. A small system with a ratchet outranks a large one with no checks.
- Counting a Figma library as level 3. The signal is code that consumers import.
- Treating themes as level 6 when primitives are overridden per theme. That is a misfile (`misfile.theme-overrides-primitives`).

## See also

- [contribution.md](contribution.md) — how to move from level 3 to level 4.
- [rulebook.md](rulebook.md) — level 5.
- [versioning.md](versioning.md) — level 6.
- [metrics.md](metrics.md) — numbers behind each level.
- [page-contract.md](page-contract.md) — what a level-4 page contains.
- [../taxonomy/misfiles.md](../taxonomy/misfiles.md) — common errors that hold a level down.
