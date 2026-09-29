---
name: styleguide
description: Write or resync the prose styleguide against tokens, CSS, components and Storybook, and detect prose rot. Use when the user says "write the styleguide", "update the design system docs", "the guide is out of date", "sync the styleguide", "document our tokens", "prose rot", or "styleguide drift".
---

# /bauhaus:styleguide — the prose spec

The styleguide is the prose spec: philosophy, token tables, per-primitive anatomy, Do/Don't, composition. One Markdown file or folder at `<config.guide>`. This skill writes it or resyncs it, and detects prose rot. Lead: `bauhaus:design-system-architect`.

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/page-contract.md` — the six sections, per layer.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/contribution.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/layers.md`, `plain-language.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/state-matrix.md`
- Optional seed: `${CLAUDE_PLUGIN_ROOT}/kit/styleguide/design-system.md`. It is an upstream port pending pruning. Take the structure only, and drop its project names. The contract is `knowledge/governance/contribution.md` and `knowledge/governance/page-contract.md`.
- The shelf for each page you write (foundations, tokens, components, patterns).

## Structure

```
1 Philosophy (principles, users)
2 Foundations   one page each
3 Tokens        token groups, tables generated from source
4 Primitives    one page each
5 Patterns      one page each
6 Contributing  the four artifacts, the >= 2 rule, rulebook, review flow
```

## Page contract

Every page has these sections, in this order:

1. **Introduction** — what it is, its job, its layer. Plain words first.
2. **Tokens** — defined (foundation, token group) or consumed (primitive, pattern), with values and intent.
3. **Anatomy** — named parts, required or optional. For a foundation: the scale.
4. **States** — the state matrix. A foundation or token group lists the states it provides tokens for.
5. **Usage** — when to use, when not and the alternative, and how: variants, composition, content, responsive, accessibility.
6. **Pitfalls and don'ts** — each mistake with why it fails.

Every Usage rule and Pitfall names its basis. A line with no basis, or one that fits any design system unchanged, is slop.

## Steps: write

1. **Read the config.** Get `guide`, `tokens`, `stylesheet`, `components`, `storybook`, `rulebook`. Missing `guide`: ask where to put it (`docs/design-system.md` or `docs/design-system/`). Write it into the config.
2. **Inventory.** List foundations (from token families), token groups, primitives (from `<config.components>` and the stylesheet), patterns (from Storybook and code).
3. **Draft from sources, not memory.** Token tables come from the DTCG source. Anatomy and variants come from component code. States come from the state matrix. Never type a value that exists in a token file. Render it from the source, or cite the token name.
4. **Write each page** to the contract. Plain words first in the Introduction. Ask the specialists for content they own:
   - `bauhaus:ui-designer` — token tables, look rules, contrast.
   - `bauhaus:ux-designer` — states, keyboard, ARIA, content, flow.
   - `bauhaus:motion-designer` — motion pages.
   - `bauhaus:responsive-reviewer` — responsive notes.
5. **Slop check.** For each Usage line and each Pitfall ask: "What is the basis?" and "Would this line be true of any component?" No basis or generic: rewrite with a basis or cut.
6. **Link.** Each page names its Storybook page and its rule ids.

## Steps: resync

1. **Diff prose against sources.** Check each of these and list every mismatch:
   - Token names and values in tables against `<config.tokens.source>`. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check` first.
   - Class names, props and variants against `<config.stylesheet>` and `<config.components>`.
   - Primitives with no section. Sections with no primitive.
   - Storybook pages with no section, and sections with no page.
   - Rule ids cited in prose against `<config.rulebook.rules>`.
   - Counts written in prose ("12 steps") against reality.
2. **Classify each mismatch.** Stale value, missing section, dead section, wrong layer (a raw value written into a pattern page), missing contract section, basis-less line.
3. **Propose.** Show the change list. Ask with `AskUserQuestion`: fix all, fix by page, report only.
4. **Fix.** Prose follows the code and tokens, unless the code is wrong. When the code is wrong, write an advisory and keep the intended value in prose.
5. **Report prose rot.** A rot score: mismatches per page. Name the three worst pages.

## Verify

- Every token in the tables exists in the source. No token in source is missing from the tables.
- Every primitive and pattern has a page with all six sections.
- No basis-less Usage or Pitfall line.
- Links to Storybook pages and rule ids resolve.

## Writes

- `<config.guide>` only. Write advisories to `<config.rulebook.advisories>` for code that is wrong.

## Output format

```
Styleguide — <write | resync> · <config.guide>
Pages:    <n> foundations · <n> tokens · <n> primitives · <n> patterns
Contract: <n>/<total> pages have 6/6 sections
Rot:      <n> stale values · <n> missing · <n> dead · <n> basis-less lines
Worst:    <page> (<n>), <page> (<n>), <page> (<n>)
Fixed:    <n> · Advisories: <n>
```

## Rules

- Write in `language.ui` only for UI copy examples. Prose follows `language.code`, English by default.
- Never state a value by hand where a token can be rendered.
- Never write a page without all six sections.
