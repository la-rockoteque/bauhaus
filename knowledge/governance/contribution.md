---
id: governance/contribution
title: Contribution — how something enters the system
shelf: governance
layer: cross-cutting
owner: design-system-architect
tags: [contribution, four-artifacts, review, ownership, primitive-gates, propose-before-populate]
sources:
  - moship design-system guide §6 Adding a new primitive (kit/styleguide/design-system.md)
  - moship ui-designer agent — fix vs recommend, four edits (reference/moship-agents/ui-designer.md)
  - Bauhaus architecture contract — docs/architecture.md
---

# Contribution

> Adding to a design system is like adding a book to a library. It must be needed by more than one reader, it must have one clear subject, and it must come with a catalogue card, a shelf label and a reading guide. This file says what to ship, what to check, who decides and who owns what.

## Rules

1. Ship the four artifacts together: tokens, styleguide section, Storybook page, rulebook entries. A foundation or a primitive is not done until all four exist. (Ubiquitous language: Four artifacts; moship ui-designer: "four edits or it is not done".)
2. Each of the four artifacts carries the state matrix. A missing state is a visible blank, not a silent gap. (See [../states/state-matrix.md](../states/state-matrix.md); a state omitted in one artifact drifts from the others.)
3. A new primitive needs two or more occurrences, a structural reason and one job. (Moship guide §6, gates 1 to 3.)
4. Propose a foundation before you populate it. Write the rationale, the scale and the limits. Then add tokens. (A token with no scale is an arbitrary number.)
5. Fix in place what is a defect. Recommend what is a judgement or a ripple. (Moship ui-designer §4.)
6. Migrate the first call site in the same change. (An unused primitive is a guess.)
7. Classify the artifact before the work starts. Put the one-line classification in the change description. (See [../taxonomy/decision-tree.md](../taxonomy/decision-tree.md).)
8. One change, one layer where possible. Do not mix a scale change with a new primitive. (Reviewers cannot judge two layers at once.)
9. A review cites a rule id or a basis for every requested change. (A comment with no basis is an opinion.)

## The four artifacts

| Artifact | Holds | For a foundation | For a primitive |
|---|---|---|---|
| **Tokens** | Named values in the DTCG source | The scale's tier-1 tokens and the semantic tokens that name intents | Semantic state tokens the primitive reads; optional component tokens |
| **Styleguide section** | The prose spec | Scale, rationale, usage rules, limits | Anatomy, states, usage, do and don't |
| **Storybook page** | The running spec | Visual scale and live token table | One story per state and per variant |
| **Rulebook entries** | Graded expectations | Review rules (scale closed, rationale present) | Auto and review rules, each with a stable id |

Every page in the four artifacts follows [page-contract.md](page-contract.md): introduction, tokens, anatomy, states, usage, pitfalls.

### State matrix in each artifact

- Tokens: every state has its semantic state token (hover, focus, disabled, error), or the cell says "n/a" with a reason.
- Styleguide: the state table lists each state, its visual change, its token and its ARIA attribute.
- Storybook: one story per state. A state that cannot render in a story is shown as a labelled facsimile.
- Rulebook: at least one rule per state that carries a WCAG duty (focus visible, 2.4.7 AA; not colour alone, 1.4.1 A).

## Adding a primitive

Check three gates before you write code. (Moship guide §6.)

| Gate | Question | Evidence to attach |
|---|---|---|
| 1. Two places | Does the pattern appear in two or more places? | The two call sites, as file paths. |
| 2. Structural | Is it structural, not incidental? "A callout that happens to be blue" is incidental. "A quantity stepper" is structural. | One sentence on what breaks if it is not shared. |
| 3. One job | Does the API have one job? | The job in one sentence with no "and". |

If a gate fails, keep the code local and add the candidate to the candidate list. Do not add it to the library.

Where the styles live: a family read by several components goes in the shared sheet. A family read by one component stays beside that component. Tokens are always shared. (Moship guide §6, "Where the rules go".)

Then:
1. Write the tokens it needs (semantic first; tier 1 only if the scale lacks a step).
2. Write the styleguide section and the state matrix.
3. Write the Storybook page with a story per state.
4. Write the rulebook entries. Mark each `auto` or `review`.
5. Migrate the first adopter.
6. Run the checks. Add any failing `auto` rule as a known violation with an advisory. See [rulebook.md](rulebook.md).

## Adding or changing a foundation: propose before populate

A foundation is a family and its scale. A change here ripples through every layer above. Use a proposal.

A proposal contains:
1. **Need.** The user or product problem in one sentence.
2. **Scale.** The steps, the growth rule, the limits. State that the scale is closed.
3. **Rationale.** The evidence: a WCAG criterion with its level, a published system, or a measured result.
4. **Tokens.** The tier-1 and semantic names it will create.
5. **Impact.** Which primitives and patterns change. Whether it breaks (see [versioning.md](versioning.md)).
6. **Migration.** Aliases, codemod, window.

Nothing is populated before the proposal is accepted. A token added ahead of its foundation is a misfile (`misfile.token-without-foundation`).

## Fix in place or recommend

Fix in place, with no permission. These are defects.

- A hard-coded value that has an exact token.
- `outline: none` with no replacement focus style. (WCAG 2.4.7, AA.)
- An interactive element with no hover or focus state.
- An arbitrary shadow, a scattered z-index, a fifth status colour.
- A guide that describes something the code no longer does.
- A primitive with no Storybook page.
- A state modelled as a variant (`misfile.state-as-variant`), when the fix is local.

Recommend, do not do. These are judgements or ripples.

- Rename or remove a token. Change a scale. (Breaking. See [versioning.md](versioning.md).)
- Raise a size that ripples across many primitives.
- Introduce a theme, a new family of primitives or a dependency.
- Any change that moves a ratchet by a large amount.
- A change to a foundation's rationale.

## Review flow

```
1 Classify        → one-line classification in the change description
2 Gate check      → primitive gates, or foundation proposal
3 Four artifacts  → all four present, state matrix filled
4 Auto rules      → tests pass; new failures are known violations with advisories
5 Review rules    → the owning agent grades and cites a basis
6 First adopter   → migrated in the same change
7 Version note    → changelog line; breaking flag if needed
```

A reviewer answers three questions: Is it in the right layer? Is it complete? Does every requested change have a basis?

Separate the authoring pass from the review pass. The author does not approve their own work. A second agent or person reviews.

## Who owns what

| Agent | Owns | Reads | Hands off to |
|---|---|---|---|
| **design-system-architect** | The four layers, classification, the foundations' structure, versioning, the rulebook shape, maturity, metrics | `taxonomy/*`, `governance/*`, `tokens/*` | The specialists below for the measurable and the judgemental halves |
| **ui-designer** | The measurable half: tokens, primitives, typography, spacing, radius, elevation, colour and contrast, focus appearance, iconography, density. Writes the `auto` rules | `foundations/*`, `components/*`, `accessibility/wcag-map.md` | ux-designer for flow and wording; motion-designer for motion |
| **ux-designer** | The judgement half: flows, states, wording, keyboard journeys, whether a data shape wants a table. Grades `review` rules | `patterns/*`, `accessibility/apg-patterns.md` | ui-designer for a token or a look |
| **motion-designer** | Durations, easing, choreography, reduced motion | `foundations/motion.md` | ui-designer for tokens; ux-designer for whether the motion helps |
| **responsive-reviewer** | Breakpoints, reflow, target sizes across widths, density modes | `foundations/spacing-layout.md`, `patterns/responsive.md` | ui-designer for a token or a scale change |

The split between `auto` and `review` is not administrative. It is the difference between a fact and a judgement. (Moship ui-designer §3.)

## Rulebook seeds

- `contribution.four-artifacts` · auto · MEDIUM · Every primitive has tokens, a styleguide section, a Storybook page and rulebook entries.
- `contribution.state-matrix` · review · MEDIUM · Each artifact carries the primitive's state matrix.
- `contribution.primitive-gates` · review · MEDIUM · A new primitive attaches two call sites, a structural reason and a one-sentence job.
- `contribution.foundation-proposal` · review · MEDIUM · A new or changed foundation has an accepted proposal.
- `contribution.first-adopter` · auto · LOW · A new primitive has at least one migrated call site.

## Misfiles

- A pattern promoted to a primitive after one use (`misfile.pattern-promoted-to-primitive`).
- Tokens added before their foundation (`misfile.token-without-foundation`).
- A primitive with CSS but no page or rules (`misfile.partial-four-artifacts`).

## See also

- [page-contract.md](page-contract.md) — the six sections every page carries.
- [rulebook.md](rulebook.md) — how rules, known violations and ratchets work.
- [versioning.md](versioning.md) — what counts as breaking.
- [maturity.md](maturity.md) — where contribution fits on the ladder.
- [../taxonomy/decision-tree.md](../taxonomy/decision-tree.md) — classify first.
- [../states/state-matrix.md](../states/state-matrix.md) — the matrix each artifact carries.
- [../components/api-design.md](../components/api-design.md) — when to add a primitive.
