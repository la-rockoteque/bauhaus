---
name: bauhaus
description: Entry point and router for Bauhaus, the design-system plugin. Use when the user says "bauhaus", "design system", "DSM", "where do I start", "what can you do", "help me with my design system", "status of my design system", or asks a design-system question and it is unclear which skill fits. Shows project status and sends the user to the right skill.
---

# /bauhaus:bauhaus — start here

Bauhaus helps agents build, extract, audit, evolve and advise on a design system (DSM). It works with any stack. Tokens are the tech-agnostic core. Storybook is one adapter (React).

## What Bauhaus is, in plain words

A design system is a shared kitchen. Foundations are the pantry: which ingredients exist, each written on a labelled jar with one name and one amount (those labels are the tokens). Components are the tools: knife, pan, whisk. Patterns are the recipes: they combine tools and jars, and they add no new ingredient.

## The three layers

Never mix them. Terms come from `${CLAUDE_PLUGIN_ROOT}/UBIQUITOUS-LANGUAGE.md`.

| Layer | Question it answers | Example |
|---|---|---|
| Foundation | Which families of values exist, and on what scale? | Spacing runs on a 4px grid. Colour: palette, colors, roles. |
| Component | Which reusable block does one job? | Button, Field, Dialog |
| Pattern | How do components compose to answer a recurring need? | Filtering, empty state |

Tokens are not a layer. They are the DTCG storage and delivery of foundation (and component) decisions: `space.3 = 12px`.

Plus the four artifacts that make a foundation or a component real: tokens, guide, showcase, rulebook entries.

## Core concepts

- **UI states.** Every component, pattern and screen has a state matrix. Two axes: lifecycle (nothing, loading, none, one, some, too-many, incorrect, correct, done) and interaction (default, hover, focus-visible, active, disabled, loading, success, error, selected, and more). Each cell is designed, n/a with a reason, or missing. A component or pattern without its matrix is not done. See `${CLAUDE_PLUGIN_ROOT}/knowledge/states/model.md`.
- **Page contract.** Every slice has a showcase (the `DocPage` story) and a guide (`.mdx`) that together have six sections in order: Introduction, Anatomy, Tokens, States, Usage, Pitfalls and don'ts. Every Usage rule and Pitfall names a basis. Generic lines are cut. See `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/page-contract.md`.

## Steps

1. **Read the project config.** Look for `bauhaus.config.json` at the project root.
   - Present: validate it against `${CLAUDE_PLUGIN_ROOT}/bauhaus.config.schema.json`. Report errors.
   - Missing: say so. Infer paths from the repo. Suggest `/bauhaus:init`.
2. **Detect status.** Run read-only checks. Report each as present or missing:
   - Token source folder (`config.tokens.source`), and whether `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check` exits 0.
   - Styleguide (`config.guide`), stylesheet (`config.stylesheet`), components (`config.components`).
   - Storybook config and stories (`config.storybook`).
   - State matrices: how many components and patterns have one, and how many cells are `missing`.
   - Rulebook rules and advisories (`config.rulebook`).
3. **Guess maturity.** Load `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/maturity.md` and name one level with two lines of evidence. Label it a guess.
4. **Route the intent.** Match the user's words to the table below. Ask one `AskUserQuestion` (2-4 options) when two rows fit.
5. **Hand off.** Name the skill and run it, or tell the user the command.

## Intent to skill

| The user wants to... | Skill |
|---|---|
| Opt a project in, write the config | `/bauhaus:init` |
| Build a design system from nothing (from scratch) | `/bauhaus:build` |
| Take an existing repo without a DSM to a full one: foundations, tokens, components, patterns, normalisation plan | `/bauhaus:analyse` |
| Recover only the tokens from existing code | `/bauhaus:extract` |
| Know which layer an artifact belongs to | `/bauhaus:classify` |
| Ask a design-system question, get an explanation | `/bauhaus:advise` |
| Grade a component, a page or the working changes | `/bauhaus:audit` |
| Add, rename, deprecate or build tokens | `/bauhaus:tokens` |
| Add or evolve a foundation (colour, motion...) | `/bauhaus:foundation` |
| Add or evolve a component | `/bauhaus:component` |
| Add or evolve a pattern | `/bauhaus:pattern` |
| Author or complete the states of a component, pattern or screen (empty, loading, hover, disabled, edge cases) | `/bauhaus:states` |
| Add a sibling theme (dark, high contrast, brand) | `/bauhaus:theme` |
| Write or resync the prose styleguide | `/bauhaus:styleguide` |
| Install or adapt Storybook | `/bauhaus:storybook` |

## Agents behind the skills

| Agent | Owns |
|---|---|
| `bauhaus:design-system-architect` | Taxonomy, build, extract, tokens, governance, advising. Lead. |
| `bauhaus:ui-designer` | Measurable look: tokens, contrast, spacing, radius, elevation, typography, focus appearance. |
| `bauhaus:ux-designer` | Flow, the nine lifecycle states and the interaction states, copy, keyboard, ARIA, data shape, filtering. |
| `bauhaus:motion-designer` | Time: durations, easing, reduced motion. |
| `bauhaus:responsive-reviewer` | Phone floor. Scores working changes out of 100. |

## Output format

```
Bauhaus status — <config.name or "no config">
Config:    present | missing (suggest /bauhaus:init)
Tokens:    <n files> · check: pass | fail | not run
Guide:     present | missing
Components: <n> · Storybook: yes | no · Rulebook: <n rules> | none
States:    <n of m components/patterns with a complete matrix>
Maturity (guess): <level> — <evidence 1>; <evidence 2>
Next step: /bauhaus:<skill> — <one-line reason>
```

## Rules

- Keep the status report under 15 lines.
- Change nothing. This skill only reads and routes.
- Never hardcode a project path. Write `<config.guide>`, `<config.stylesheet>`, and so on.
- When a question is about design-system concepts and not about the project, route to `/bauhaus:advise`.
