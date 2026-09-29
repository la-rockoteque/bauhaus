# Bauhaus architecture — the contract

Every file in this plugin follows this contract. Terms come from `UBIQUITOUS-LANGUAGE.md`.

## Layout

```
.claude-plugin/        plugin.json, marketplace.json
agents/                specialist subagents (Markdown + frontmatter)
skills/<name>/SKILL.md user-invocable workflows: /bauhaus:<name>
knowledge/             the knowledge base, one folder per shelf
scripts/               zero-dependency Node ≥ 20 tools (ESM, .mjs)
test/                  node:test suites for scripts/ (node --test test/)
kit/                   starter files skills copy into a project
  storybook/           seed Storybook + dev overlay + rulebook, ported from moship-web (React). To be pruned.
  styleguide/          seed styleguide + responsive inventory, ported from moship.
  tokens/              seed DTCG tokens
reference/             source material kept for comparison only (the original moship agents). Never loaded by skills.
docs/                  plugin docs
bauhaus.config.schema.json
```

## The four layers — never mix them

| Layer | Question it answers | Lives in | Example |
|---|---|---|---|
| **Foundation** | Which families of values exist, and on what scale? | styleguide §Foundations, Storybook `Foundations/*` | "Spacing runs on a 4px grid, 12 steps." |
| **Token** | What is this one named decision's value? | `tokens.source` (DTCG JSON), generated outputs | `space.3 = 12px`, `color.text.muted → gray.600` |
| **Primitive** | Which reusable block does one job? | `components`, styleguide §Primitives, Storybook `Components/*` | Button, Field, Dialog |
| **Pattern** | How do primitives compose to answer a recurring need? | styleguide §Patterns, Storybook `Patterns/*` | Filtering, empty state, wizard |

A foundation is a family and its scale. A token is one member of it. A primitive consumes semantic tokens. A pattern composes primitives and never introduces its own token or its own raw value. `knowledge/taxonomy/` holds the decision tree and the catalogue of misclassifications. Every agent and skill that creates or reviews an artifact classifies it first.

## UI states — a core concept

Every primitive, pattern and screen has a **state matrix** (`knowledge/states/state-matrix.md`). Two axes:

- **Lifecycle states** — Speelman's nine: nothing, loading, none, one, some, too-many, incorrect, correct, done.
- **Interaction states** — default, hover, focus-visible, active, disabled; functional: loading, success, error, selected; plus read-only, indeterminate, expanded, current.

Each cell is `designed`, `n/a` with a reason, or `missing`. A `missing` cell is a finding. Rule ids: `<component>.state.<state>`. Reports carry a `## States` line.

## Page contract — every DSM page

A page documents one foundation, token group, primitive or pattern, in the styleguide and in Storybook. It has these sections, in this order. `knowledge/governance/page-contract.md` holds the full spec per layer.

1. **Introduction** — what it is, the job it does, and the layer it belongs to. Plain words first.
2. **Tokens** — the tokens it defines (foundation, token group) or consumes (primitive, pattern), with values and intent.
3. **Anatomy** — the named parts, and which are required or optional. For a foundation: the scale and its structure.
4. **States** — the state matrix. For a foundation or token group: the states it provides tokens for.
5. **Usage** — an exhaustive guide to when to use it, when not to, and what to use instead, and how to use it: variants, composition, content, responsive, accessibility.
6. **Pitfalls and don'ts** — the common mistakes, each with why it fails.

No generic content. Every rule in Usage and every item in Pitfalls names its **basis**: a WCAG criterion with its level, an APG pattern, a heuristic by name, a published system, or a research result. A line that has no basis, or that could fit any design system unchanged, is slop. Cut it.

## Project config

A project opts in with `bauhaus.config.json` (schema: `bauhaus.config.schema.json`). Agents read it first. When it is missing, an agent says so, infers the paths from the repo, and suggests `/bauhaus:init`. Agents never hardcode a project path; they write `<config.guide>`, `<config.stylesheet>`, etc.

Tokens are the tech-agnostic core: DTCG JSON (`$value`, `$type`, `$description`, aliases as `{color.gray.600}`). `scripts/tokens.mjs` builds them into CSS custom properties, SCSS, JS/TS, JSON and a Tailwind preset. The Storybook kit is one adapter (React). Other stacks get tokens + styleguide + rulebook without it.

## Knowledge-base file format

```markdown
---
id: foundations/color            # path without .md
title: Colour
shelf: foundations
layer: foundation                 # foundation | token | primitive | pattern | cross-cutting
owner: ui-designer                # agent that cites it most
tags: [contrast, palette, oklch]
sources:
  - WCAG 2.2 1.4.3, 1.4.11, 1.4.1 — https://www.w3.org/TR/WCAG22/
---

# Colour

> One-paragraph plain-language summary a non-designer understands. (The vulgarisation.)

## Rules
Numbered, imperative, each with its basis in parentheses.

## Why
The evidence. Cite a criterion with its level, a published system, or a research result.

## Rulebook seeds
Candidate rules: `id` · verify `auto|review` · severity · expectation.

## Misfiles
What people wrongly file under this topic, and where it belongs.

## See also
Relative links to other knowledge files.
```

Rules for knowledge files: English; STE-style short sentences; every rule has a basis; WCAG criteria always carry their number **and** level; never invent a citation — if unsure of a number, omit it; 80–300 lines each.

## Agent format

```markdown
---
name: ui-designer
description: <when to use, what it owns, what it defers — one paragraph>
tools: ["Read", "Write", "Edit", "Grep", "Glob", "Bash"]
model: sonnet
---
```

Body sections, in order: mandate · what you own · the shelves you read (knowledge files + project config paths) · the standards you cite · rubric · fix vs recommend · what you do not own (hand-offs) · verify before you claim · report format · language. Reports use `language.reports` from the project config; code prose is English.

## Skill format

`skills/<name>/SKILL.md` with frontmatter `name`, `description` (trigger phrases included). A skill is a workflow: steps, which agent(s) it dispatches, which knowledge files it loads, which script it runs, what it writes, how it verifies. Skills refer to plugin files as `${CLAUDE_PLUGIN_ROOT}/knowledge/...`.

## Advising in plain language

Every advisory answer has two registers: the **plain** one first (no jargon, an everyday analogy, one sentence per idea), then the **precise** one (terms, tokens, criteria). When the audience is unknown, give both. `knowledge/taxonomy/plain-language.md` holds the analogies and the glossary.

## Reports

Severity `HIGH | MEDIUM | LOW`, sorted descending, capped at ten. Every finding: one line, why it matters, smallest next step, rule id or "outside rulebook", basis, files, effort S/M/L.
