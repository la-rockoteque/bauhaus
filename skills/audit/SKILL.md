---
name: audit
description: Grade a component, a page or the working changes against the rulebook and the Bauhaus knowledge base. Use when the user says "audit this component", "review my UI", "grade this page", "check my working changes against the design system", "is this accessible", "design review", "check the rulebook", or wants findings by severity.
---

# /bauhaus:audit — grade against the rulebook

Dispatches the UI, UX, motion and responsive agents in parallel, each on its own half. Merges their reports into one. Writes advisories. Lead: `bauhaus:design-system-architect` (merge and classify).

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/rulebook.md` — rules, verify modes, advisories, known violations, ratchets.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/model.md`, `state-matrix.md` — lifecycle and interaction states.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/page-contract.md` — the six-section page.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/components/anatomy-and-states.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/accessibility/wcag-map.md` — every criterion carries number and level.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/layers.md`, `misfiles.md`.
- Agents load the rest of the shelves themselves.

## Scope

Ask with `AskUserQuestion` if unclear. Options: a named component, a page or route, the working changes (`git diff` and untracked files).

## Steps

1. **Read the config.** Find `<config.rulebook.rules>`, `<config.rulebook.advisories>`, `<config.guide>`, `<config.responsiveInventory>`, and `house` values. Missing rulebook: audit against the knowledge base only, and say so.
2. **Resolve the target.** List files. For a page, list the components and patterns it uses. For working changes, list changed files.
3. **Classify first.** For each artifact, name its layer. Flag misfiles (ids from `misfiles.md`).
4. **Grade the state matrix.** For each component and pattern in scope, read its matrix. Rows are states, columns are variants. Each cell is designed, n/a with reason, or missing. A `missing` cell is a finding. Rule id `<component>.state.<state>` (other state rules: `<component>.states.<slug>`). A bare `n/a` counts as missing. No matrix at all is one MEDIUM finding, plus HIGH for any state that blocks a user (no focus-visible: `WCAG 2.4.7 (AA)`).
5. **Grade the pages against the page contract.** For each slice (the showcase and the guide together), check six sections in order: Introduction, Anatomy, Tokens, States, Usage, Pitfalls and don'ts. A missing or misordered section is a finding, rule id `page.intro`, `page.tokens`, `page.anatomy`, `page.states`, `page.usage` or `page.pitfalls`. A Usage rule or Pitfall with no basis is `page.basis`, as is a line that fits any design system unchanged.
6. **Run the auto rules.** Where the project has an `auto` test runner, run it. Otherwise read the code and stylesheet for each `auto` rule. Record pass or fail with the file and line.
7. **Dispatch in parallel** with one message and four Agent calls. Each gets: target file list, config paths, house values, and "report per `docs/architecture.md` § Reports".
   - `bauhaus:ui-designer` — tokens used, contrast per state, spacing, radius, elevation, typography, focus appearance.
   - `bauhaus:ux-designer` — lifecycle states, copy, keyboard, ARIA, data shape, filtering, flow.
   - `bauhaus:motion-designer` — durations, easing, reduced motion. Skip when the target has no motion.
   - `bauhaus:responsive-reviewer` — phone floor at the config viewports. Scores working changes out of 100.
8. **Merge.** Deduplicate findings that two agents raised. Keep the higher severity. List both agents as sources. Resolve conflicts: the agent that owns the half wins. Say so.
9. **Rank.** Severity `HIGH`, `MEDIUM`, `LOW`. Sort descending. Cap at ten. State the count cut.
10. **Write advisories.** For each finding the user accepts, append an advisory to `<config.rulebook.advisories>`. For each failing `auto` rule, record a known violation with its advisory. Do not write advisories without a yes. Ask with `AskUserQuestion`: all, HIGH only, none.
11. **Hand off.** For each finding, name the skill that fixes it (`/bauhaus:component`, `/bauhaus:states`, `/bauhaus:styleguide`, `/bauhaus:tokens`, `/bauhaus:theme`...).
12. **Verify.** Every finding has a basis. A finding with no basis is an opinion: drop it or mark "outside rulebook, opinion".

## Finding format

Each finding, one block:

```
[HIGH|MEDIUM|LOW] <one line>
Why: <what it costs the user or the system>
Next: <smallest step> · Effort: S|M|L
Rule: <rule id | outside rulebook> · Basis: <WCAG 1.4.3 (AA) | Nielsen 1 | APG Tabs | ...>
Files: <path:line>
```

## Report format

```
Audit — <target> · <date>
Layer(s): <...>

Rulebook: <n> rules · pass <a> · fail <b> · review <c>  (auto <x> / review <y>)
Responsive score: <n>/100 (working changes only)

## States
<designed> designed · <n/a> n/a (with reason) · <missing> missing
  <state> × <variant>: designed | n/a: <reason> | missing

Page contract: <n>/<total> pages with 6/6 sections · <n> basis-less lines

Findings (<shown> of <total>)
1. ...

Known violations: <n new> · <n closed>
Hand-offs: <finding #> → /bauhaus:<skill>
Advisories written: <n> in <path>
```

Write the report in `language.reports` from the config.

## Rules

- Audit reads. It fixes nothing. Fixing belongs to the hand-off skills.
- Severity follows `UBIQUITOUS-LANGUAGE.md`: HIGH breaks WCAG A/AA or blocks a user.
- Never dispatch agents sequentially when they are independent.
- Closing an advisory means deleting it.
