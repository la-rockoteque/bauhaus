---
name: advise
description: Answer any design-system question grounded in the Bauhaus knowledge base, in plain language first and precise terms second. Use when the user asks "what is a design token", "should this be a component", "why do we need a design system", "explain elevation", "what does WCAG say about contrast", "how do I convince my boss", "is our system mature", or any conceptual design-system question from a designer, developer, PM or executive.
---

# /bauhaus:advise — answer a design-system question

Answers in two registers: plain first, precise second. Every answer names its layer and cites its basis. Lead agent: `bauhaus:design-system-architect`. It calls specialists for their halves.

## Loads

Start here, then follow the question:

- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/layers.md` — always.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/plain-language.md` — analogies and glossary. Always, for the plain register.
- The shelf of the layer in question (see the index `${CLAUDE_PLUGIN_ROOT}/knowledge/README.md`):
  - foundation: `knowledge/foundations/<family>.md`
  - token: `knowledge/tokens/*.md`
  - component: `knowledge/components/*.md`
  - pattern: `knowledge/patterns/*.md`
  - governance, adoption, cost: `knowledge/governance/*.md`
  - stack, Storybook, design tools: `knowledge/tooling/*.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/accessibility/wcag-map.md` — before you cite any WCAG criterion.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/model.md`, `lifecycle-states.md`, `interaction-states.md`, `state-matrix.md` — for any question on states, empty or loading screens, hover, focus, disabled, edge cases.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/page-contract.md` — for questions on how to document a foundation, component or pattern.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/references/systems.md` — when the user asks how other systems do it.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/bauhaus/principles.md` — when the user asks why Bauhaus thinks this way.

## Steps

1. **Read the config** if present, for project facts (prefix, stack, house standards). Absent: answer from the knowledge base and say the answer is generic.
2. **Restate the question** in one line. If it hides two questions, split them.
3. **Name the layer.** Say "This is a question about the colour foundation (stored as tokens)." Use the decision tree in `knowledge/taxonomy/decision-tree.md` when the layer is unclear. A question that spans layers gets one paragraph per layer.
4. **Detect the audience.** Read the wording:
   - Designer: talks of hierarchy, feel, brand.
   - Developer: talks of code, props, CSS, build.
   - Product manager: talks of scope, speed, consistency, cost.
   - Executive: talks of risk, return, headcount.
   Not clear: give both registers in full. Or ask with `AskUserQuestion` (2-4 options) when the answer changes materially.
5. **Load the files** for that layer. Never answer from memory when a file covers the topic.
6. **Write the plain register.** No jargon. One everyday analogy from `plain-language.md`. One idea per sentence. State the consequence for the audience: time, risk, quality.
7. **Write the precise register.** Terms from `UBIQUITOUS-LANGUAGE.md` only. Token names, values, criteria with number and level (`WCAG 1.4.3 (AA)`). Numbered rules where the knowledge file has them.
8. **Cite the basis.** End with a Basis line: criterion with level, published system, research result, or knowledge file path. No basis means an opinion. Label it "opinion" or leave it out. Never invent a citation. When you are unsure of a criterion number, omit the number.
9. **State the states.** When the question is about a component, pattern or screen, say which states matter and whether a matrix exists. Every component and pattern needs its matrix. Recommend `/bauhaus:states` when it is missing.
10. **Route.** If the answer implies work, name the skill: `/bauhaus:tokens`, `/bauhaus:audit`, and so on.
11. **Project-specific questions.** When the question is about this codebase ("is our colour system OK?"), read the actual files, or dispatch the specialist: `bauhaus:ui-designer` for measurable look, `bauhaus:ux-designer` for flow and states, `bauhaus:motion-designer` for time, `bauhaus:responsive-reviewer` for phone floor. For a full grade, hand off to `/bauhaus:audit`.

## Output format

```
Layer: <foundation | component | pattern | cross-cutting>  (tokens: note "foundation, stored as <tier> tokens")
Audience: <detected | both>

In plain words
<3-6 short sentences, one analogy>

Precisely
<terms, rules, values, criteria>

States: <matrix status, when a component or screen is in question>
Basis: <WCAG x.y.z (level) · system · research · knowledge/<path>>
Next: /bauhaus:<skill> — <why>   (only when work follows)
```

## Rules

- Plain register comes first. Always.
- Keep the whole answer under 40 lines unless the user asks for depth.
- Say which layer the question is about, every time.
- Say "the knowledge base does not cover this" when it does not. Then say what you know and mark it as outside the base.
- Do not do the work here. Advise, then route.
- Use the terms from `UBIQUITOUS-LANGUAGE.md`. Say "semantic token", not "alias token". Say "component", not "atom".
