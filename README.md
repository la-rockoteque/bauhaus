# Bauhaus

A design-system workshop for AI agents. Bauhaus helps Claude Code build, extract, audit, evolve and advise on a design system (DSM): its tokens, primitives, patterns, styleguide, Storybook and rulebook.

The name comes from the Bauhaus school (Weimar 1919, Dessau 1925, Berlin 1932–33). Its students took a preliminary course on form, colour and material first, then worked in the workshops. Bauhaus follows the same order: foundations first, then tokens, primitives and patterns. See `knowledge/bauhaus/principles.md`.

## What it gives you

- **Four layers, never mixed.** Foundation, token, primitive, pattern. Every agent classifies an artifact before it builds or reviews it, and flags anything filed in the wrong layer (`knowledge/taxonomy/`).
- **States as a core concept.** Every primitive, pattern and screen has a state matrix: Speelman's nine lifecycle states and the interaction states (`knowledge/states/`).
- **One page contract.** Every DSM page has an introduction, tokens, anatomy, states, a full usage guide, and pitfalls and don'ts. Every rule names its basis: a WCAG criterion with its level, an APG pattern, a heuristic, a published system or a research result (`knowledge/governance/page-contract.md`).
- **Tech-agnostic tokens.** DTCG JSON is the source. `scripts/tokens.mjs` builds CSS, SCSS, JS, TS, JSON and a Tailwind preset.
- **Plain words first.** Advice comes in two registers: plain for anyone, then precise for the implementer (`knowledge/taxonomy/plain-language.md`).
- **A knowledge base** the agents read and cite (`knowledge/README.md`).

## Install

```bash
claude plugin marketplace add git@git.nexapptech.com:vbernier/bauhaus.git
claude plugin install bauhaus@bauhaus
```

## Skills

| Skill | Use it to |
|---|---|
| `/bauhaus:bauhaus` | Start here. See the project's status and pick a skill. |
| `/bauhaus:init` | Opt a project in: write `bauhaus.config.json` and seed tokens. |
| `/bauhaus:build` | Build a DSM from scratch, layer by layer. |
| `/bauhaus:extract` | Extract a DSM from an existing codebase. |
| `/bauhaus:classify` | Sort artifacts into the four layers and flag misfiles. |
| `/bauhaus:advise` | Ask any design-system question. Get a plain answer, then a precise one. |
| `/bauhaus:audit` | Grade a component, a page or the working changes. |
| `/bauhaus:states` | Author or audit a state matrix. |
| `/bauhaus:tokens` | Author, rename, deprecate or build tokens. |
| `/bauhaus:foundation` | Add or evolve a foundation. |
| `/bauhaus:component` | Add or evolve a primitive. |
| `/bauhaus:pattern` | Add or evolve a pattern. |
| `/bauhaus:theme` | Add a theme: dark, brand, high contrast, density. |
| `/bauhaus:styleguide` | Write or resync the prose styleguide. |
| `/bauhaus:storybook` | Install the Storybook kit. |

## Agents

| Agent | Owns |
|---|---|
| `design-system-architect` | The layers, the state model, the page contract, building, extraction, token architecture, governance, plain-language advice. |
| `ui-designer` | The measurable look: tokens, contrast, spacing, radius, elevation, typography, interaction-state visuals. |
| `ux-designer` | Flow, lifecycle states, copy, keyboard, ARIA, data shape, filtering. |
| `motion-designer` | Time: durations, easing, transitions between states, reduced motion. |
| `responsive-reviewer` | The phone floor. Scores the working changes out of 100. |

## Scripts

Zero dependencies, Node 20 or later.

```bash
node scripts/tokens.mjs build            # DTCG → outputs in bauhaus.config.json
node scripts/tokens.mjs check            # validate, lint names, detect drift
node scripts/extract.mjs src/            # inventory literal values, draft tokens
node scripts/contrast.mjs '#6b7280' '#fff'
npm test
```

## Layout

```
agents/      the five agents
skills/      the fifteen skills
knowledge/   the knowledge base
scripts/     token, extraction and contrast tools
kit/         starter files: tokens, styleguide, Storybook (React)
reference/   the original moship agents, for comparison only
docs/        architecture.md — the contract every file follows
```

The Storybook kit and the seed styleguide are a verbatim port from moship-web. They still hold moship-specific pages, French UI copy and the `--mo-` prefix. They will be pruned step by step. See `kit/README.md`.
