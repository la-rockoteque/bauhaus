---
id: governance/decisions
title: Recording decisions
shelf: governance
layer: cross-cutting
owner: design-system-architect
tags: [adr, governance, decisions]
sources:
  - Michael Nygard, "Documenting Architecture Decisions", 2011 — https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
  - MADR, Markdown Any Decision Records — https://adr.github.io/madr/
---

# Recording decisions

> A design system is a pile of choices: which grid, which hues, which font plays which job, where a component lives. Six months later nobody remembers why. A short note per choice, written when it is made, stops the next person from undoing it by accident.

## Rules

1. Record every structural design-system decision as an Architecture Decision Record (ADR): one decision per file, numbered, in the project's ADR folder (`docs/adr/` when the project has none). (Nygard 2011.)
2. An ADR holds: status, date, context, the decision, the options not chosen, and the consequences. (Nygard 2011; MADR.)
3. Write the ADR in the same change that lands the decision. A rule in a contract doc with no ADR behind it has lost its reason. (Nygard 2011: "the motivation behind previous decisions is visible for everyone".)
4. Never edit a decided ADR's decision. A changed decision is a new ADR that supersedes the old one; mark the old one superseded and keep it. (Nygard 2011.)
5. Keep rules and reasons apart: the styleguide and the contract docs state the rule; the ADR states why. Link each to the other.
6. Write the ADR in plain words first. The reader is often not a designer. (`../taxonomy/plain-language.md`.)

## What needs an ADR

- A foundation's scale: the spacing base, the type scale ratio, the palette's hues.
- A chain or tier model: palette → colors → roles; typefaces → fonts → text styles.
- Where the design system lives and how it is structured (`../architecture/library-options.md`).
- The build base for components (native, headless library).
- A theme added or removed.
- A deviation from WCAG AA or from a house standard, with its level stated.
- Anything a gate in `/bauhaus:build`, `/bauhaus:analyse` or `/bauhaus:foundation` asked the user to decide.

## What does not

- A new component that follows the existing rules. Its slice is the record.
- A token value change inside an agreed scale.

## Template

```markdown
# N. <Decision in one line>

- Status: proposed | accepted | superseded by N
- Date: YYYY-MM-DD

## Context
<What forced the choice. The evidence, with sources.>

## Decision
<What was decided, in plain words, then precisely.>

## Options not chosen
- <Option>: <why not>

## Consequences
- <What changes, what checks enforce it, where the rules live.>
```

## Rulebook seeds

- `decisions.gate-recorded` · review · MEDIUM · "Every decision taken at a gate has an ADR."
- `decisions.superseded-not-edited` · review · LOW · "A changed decision supersedes its ADR; it does not rewrite it."

## See also

- `contribution.md`, `versioning.md`, `../architecture/library-options.md`
- The plugin's own ADRs: `docs/adr/` in the Bauhaus repo.
