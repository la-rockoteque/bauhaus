---
id: governance/page-contract
title: The page contract
shelf: governance
layer: cross-cutting
owner: design-system-architect
tags: [documentation, page-contract, styleguide, storybook, anti-slop, basis]
sources:
  - Bauhaus architecture contract — docs/architecture.md (three layers, knowledge-base format)
  - WCAG 2.2 — https://www.w3.org/TR/WCAG22/
  - WAI-ARIA Authoring Practices Guide, Button pattern — https://www.w3.org/WAI/ARIA/apg/patterns/button/
  - Nielsen, "10 Usability Heuristics for User Interface Design" (1994; NN/g) — https://www.nngroup.com/articles/ten-usability-heuristics/
  - Wertheimer, "Untersuchungen zur Lehre von der Gestalt II", Psychologische Forschung 4, 1923 (proximity)
  - Hick, "On the rate of gain of information", Quarterly Journal of Experimental Psychology 4, 1952
  - Vince Speelman, "The Nine States of Design", 2015 — https://medium.com/swlh/the-nine-states-of-design-5bfe9b3d6d85
---

# The page contract

> Every slice in the design system answers six questions in the same order, across two pages: the showcase and the guide. What is this? Which values does it use? What are its parts? What conditions can it be in? When do I use it, and when not? What goes wrong? A reader who knows one page knows them all. A writer who cannot fill a section has found a gap in the design.

The contract applies to a foundation, a token group, a component and a pattern. The sections are fixed. The content differs by layer. A token group is a kind of page, not a layer: it documents the stored tokens of one foundation (or of one component).

## Two pages: the showcase and the guide

Each slice has two pages, and they never repeat each other's tables.

- **The showcase** is `<name>.stories.tsx`. One story renders `<DocPage …/>`. It shows what a reader can see.
- **The guide** is `<name>.mdx`. It holds the prose a picture cannot show. It declares `<Meta of={Stories}/>`, so one Storybook entry shows the guide as "Docs" and the showcase as a story.

| Section | Showcase (`DocPage` props) | Guide (`.mdx`) |
|---|---|---|
| 1 Introduction | short: `name`, `layer`, `family` (eyebrow), `plain`, `precise`, `usedFor` | full: plain words, then precise, the layer |
| 2 Tokens | `tokens`: `{ mode: 'defined' \| 'consumed', rows: [{ name, tier, use, swatch }] }` | none |
| 3 Anatomy | `anatomy` (`render`, `parts` pins, legend), `specimens` for a foundation, `specs` table, `api` table | none |
| 4 States | `states`: `{ cells, expect }`, the grid. Each cell is live, with its trigger; `n/a` with its reason; `missing` badged | the reasoning behind each state |
| 5 Usage | none | when, when not and what instead, how: variants, composition, content and wording, responsive, keyboard and ARIA, i18n. Each rule with its basis |
| 6 Pitfalls | `dos`, `donts`: compact, each `{ text, basis, rule }` | full prose with the reasons |
| Rulebook | `rules`: the `<name>.rules.ts` export, graded live | every rule with its basis |
| Accessibility | derived from the rules' `covers` (no prop) | keyboard and ARIA prose |

`DocPage` lives in `.storybook/doc-page/`, outside the published package. `extra` adds sections between States and Do and don't; `guide` and `guideName` point to the guide. The props are typed in `.storybook/doc-page/types.ts` (`DocPageProps`). `scripts/structure.mjs` reports `slice.page` when the guide is missing and `slice.showcase` when the stories file does not render `DocPage`.

## Rules

1. Every slice has six sections, in this order, split across the showcase and the guide: Introduction, Tokens, Anatomy, States, Usage, Pitfalls and don'ts. (One order means one place to look.)
2. Start the Introduction with plain words, then the precise statement. (Architecture contract: two registers.)
3. Name the layer in the Introduction. (Readers must not guess; see [../taxonomy/layers.md](../taxonomy/layers.md).)
4. Fill the States section from the state matrix. A blank cell is a finding. (See [../states/state-matrix.md](../states/state-matrix.md).)
5. Every Usage rule and every pitfall names its basis. (A rule with no basis is an opinion.)
6. Every pitfall says why it fails, in one sentence. (A don't with no reason is a taste.)
7. Write Usage exhaustively: when to use, when not and what to use instead, and how. (A "when not" without an alternative sends the reader back to guessing.)
8. Never write a line that would be true of any component unchanged. (The anti-slop test, below.)
9. A section that does not apply says "n/a" with a reason. It is not deleted. (A missing section and a decided-n/a look the same otherwise.)

## What each section holds, per layer

| Section | Foundation | Token group | Component | Pattern |
|---|---|---|---|---|
| **1 Introduction** | What family, the job it does for users, the layer, plain words first | What decisions the group names, its tiers, plain words first | What the part is, its one job, the layer, plain words first | The user need, the recipe in one line, the layer, plain words first |
| **2 Tokens** | **Defined**: the scale's tier-1 tokens and the semantic tokens that name intents (colour: palette, colors, roles per theme) | **Defined**: every token with tier, value or alias, and description | **Consumed**: semantic tokens read, optional component tokens | **Consumed**: layout and spacing tokens, through the components it composes; no token of its own |
| **3 Anatomy** | The scale and its structure: steps, growth rule, limits, closed set | The tiers and the alias chains | Named parts, each marked required or optional, with slots | The components it composes and how they are arranged |
| **4 States** | The states it supplies tokens for (hover layer, focus ring, disabled) | Same, per token | The full state matrix: lifecycle and interaction | The lifecycle states of the recipe (nothing, loading, none, too many, incorrect, done) |
| **5 Usage** | When to use each step; when not, and what instead; how to combine, contrast and a11y constraints | Which token for which job; when not, and what instead | When to use; when not and what instead; how: variants, composition, content, responsive, accessibility | When to use; when not and what instead; how: content, order, responsive, accessibility |
| **6 Pitfalls** | Off-scale values, mixing steps, skipping the rationale | Naming, tier and alias mistakes | Wrong element, missing states, local look | Own style, own spacing, missing lifecycle states |

## Template

The template below is the guide's outline. The showcase fills the same headings from `DocPage` props (table above).

```markdown
# <Name>

## 1. Introduction
**In plain words:** <one to three short sentences, an everyday picture>.
**Precisely:** <layer> · <one-sentence job> · <what it is and is not>.

## 2. Tokens
<defined | consumed>: table of token · tier · value or alias · use.

## 3. Anatomy
<parts, required or optional; scale and steps; tiers and aliases; composed components>.

## 4. States
<the reasoning per state; the grid itself sits in the showcase: designed | n/a — reason | missing>.

## 5. Usage
### When to use
### When not to use — and what to use instead
### How
Variants · Composition · Content · Responsive · Accessibility
Each rule ends with its basis in parentheses.

## 6. Pitfalls and don'ts
| Don't | Why it fails | Basis | Rule id |
```

## Worked example: a component (Button)

````markdown
# Button

## 1. Introduction
**In plain words:** A button is the thing you press to make something happen.
Save, send, delete. If pressing it takes you somewhere else, it is a link, not a button.
**Precisely:** Component · triggers one action in the current view · not for navigation.

## 2. Tokens (consumed)
| Token | Tier | Use |
|---|---|---|
| `action.primary` | 2 | Fill of the primary variant |
| `action.primary-text` | 2 | Label on the fill; pair must reach 4.5:1 |
| `state.hover-layer` | 2 | Hover overlay (state layer) |
| `action.primary-hover` | 2 | Hover colour of the primary fill (state role) |
| `focus.ring.*` | 2 | Focus indicator |
| `radius.control` | 2 | Corner radius |
| `size.target.min` | 2 | Minimum height and width |

## 3. Anatomy
Container (required) · Label (required, unless icon-only) · Leading icon (optional) ·
Trailing icon (optional) · Spinner (shown only while loading).

## 4. States
Interaction: default, hover, focus-visible, active, disabled, loading. Lifecycle: nothing
(never used), too many (long label wraps), done (success text). See the state matrix.

## 5. Usage
### When to use
- To trigger an action in place: submit, save, open a dialog (APG Button pattern: a button performs an action).
### When not to use — and what instead
- To go to another page or URL: use a link `<a href>` (WCAG 4.1.2 Name, Role, Value, A: the role must match the behaviour).
- To toggle a setting: use a switch or checkbox (APG Switch and Checkbox patterns).
### How
- Variants: one primary per view region; others secondary or tertiary (Hick 1952: choice time grows with the number of options; Nielsen 8: extra items compete with the important ones).
- Content: start with a verb and name the object, "Save changes" (WCAG 2.4.6 Headings and Labels, AA: labels describe purpose).
- Icon-only: give an accessible name (WCAG 1.1.1 Non-text Content, A; 4.1.2, A).
- Keyboard: Space and Enter activate it (APG Button pattern). Use the native element so this is free.
- Target size: at least 24 by 24 CSS px (WCAG 2.5.8, AA). House floor 44px (WCAG 2.5.5, AAA figure; project decision).
- Responsive: let the label wrap; never truncate it (WCAG 1.4.10 Reflow, AA).
- Loading: keep the label and width, block repeat presses, announce the result (Nielsen 1; WCAG 4.1.3 Status Messages, AA).
- Disabled: exempt from text contrast (WCAG 1.4.3 exception for inactive components), but say why nearby (Bauhaus rule, see `../states/model.md`).

## 6. Pitfalls and don'ts
| Don't | Why it fails | Basis | Rule id |
|---|---|---|---|
| `outline: none` with no replacement | Keyboard users lose their place | WCAG 2.4.7 (AA) | `button.focus-ring` |
| A `<div>` with a click handler | No focus, no Space or Enter, no role | APG Button; WCAG 4.1.2 (A) | `button.native-element` |
| Red fill as the only sign of "danger" | Colour-blind users miss it | WCAG 1.4.1 (A) | `button.states.not-colour-alone` |
| `variant="disabled"` | A state modelled as a choice; cannot combine with primary or secondary | Bauhaus `misfile.state-as-variant` | `button.states.not-variant` |
| Two primary buttons side by side | Users cannot tell which action leads | Hick 1952; Nielsen 8 | `button.one-primary` |
````

## Worked example: a foundation (Spacing)

````markdown
# Spacing

## 1. Introduction
**In plain words:** Spacing is the air between things. Close things read as one group.
Far things read as separate. One fixed set of gaps keeps every screen in the same rhythm.
**Precisely:** Foundation · a closed scale on a 4px grid, 12 steps · governs margin, padding and gap.

## 2. Tokens (defined)
| Token | Tier | Value |
|---|---|---|
| `space.1` … `space.12` | 1 | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px, in `rem` |
| `space.inline.gap` | 2 | `{space.2}` — between controls in a row |
| `space.stack.group` | 2 | `{space.6}` — between unrelated groups |
| `space.stack.related` | 2 | `{space.2}` — between a label and its control |

## 3. Anatomy
Base unit 4px. Steps 1 to 6 grow by 4px. Steps 7 to 12 grow by larger jumps so large gaps stay distinct.
The scale is closed: no step exists between `space.4` and `space.5`.

## 4. States
Spacing has no interaction state. It supplies tokens for density: `comfortable` uses the
values above; `compact` remaps semantic tokens one step down, and controls keep at least 24px targets (WCAG 2.5.8, AA).

## 5. Usage
### When to use
- Between and inside every block, through a semantic token (project decision: tokens are the only source of a value).
### When not to use — and what instead
- To size a control's hit area: use `size.target.min`, which spacing must not shrink.
- To stack layers: spacing does not stack; use the z-index foundation.
### How
- Gaps inside a group are smaller than gaps between groups (Wertheimer 1923, proximity).
- Space small controls so a 24px circle on each does not touch another (WCAG 2.5.8 spacing exception, AA).
- Set spacing around text in `rem`; do not clip text when the user changes spacing (WCAG 1.4.12 Text Spacing, AA).
- Reflow to one column at 320 CSS px without a second scroll axis (WCAG 1.4.10, AA).

## 6. Pitfalls and don'ts
| Don't | Why it fails | Basis | Rule id |
|---|---|---|---|
| `margin: 18px` at a call site | Off the scale; gaps drift between screens | Closed scale (this page); `misfile.raw-value-in-component` | `spacing.no-literal` |
| Equal gaps everywhere | Groups stop reading as groups | Wertheimer 1923 | `spacing.groups-distinct` |
| Fixed-height containers around text | Text clips when the user raises text spacing | WCAG 1.4.12 (AA) | `spacing.text-spacing-safe` |
| A step added "just this once" | The scale gains a hole; every later step is arguable | `misfile.token-without-foundation` | `spacing.scale-closed` |
````

## The anti-slop test

A page line is slop when it has no basis or would stay true if you swapped in another component's name.

Apply two checks to every Usage rule and every pitfall.

1. **Basis check.** Does the line name a basis? A WCAG criterion with its number and level, an APG pattern, a Nielsen heuristic by name, a published system, or research with author and year. If not, it fails.
2. **Swap check.** Replace the component name with another. Is the line still true? If yes, it says nothing about this component. It fails.

Fix a failing line by adding a fact about this component and its basis. If no basis exists, delete the line or mark it "project decision" and say who decided.

### Ten slop lines and their rewrites

| # | Slop | Why it fails | Evidence-based rewrite |
|---|---|---|---|
| 1 | "Buttons should be clear and easy to use." | True of any control. No basis. | "Start the label with a verb and name the object: 'Save changes' (WCAG 2.4.6, AA: labels describe purpose)." |
| 2 | "Make sure it is accessible." | No criterion. Nobody can check it. | "Give an icon-only button an accessible name (WCAG 1.1.1 and 4.1.2, both A)." |
| 3 | "Use spacing consistently." | Says nothing about steps. | "Use `space.stack.related` (8px) between a label and its control and `space.stack.group` (24px) between groups (Wertheimer 1923, proximity)." |
| 4 | "Avoid using too many colours." | No number. No reason. | "Use four status hues and never a fifth; a fifth needs a scale proposal (this system's colour foundation)." |
| 5 | "Don't make the text too small." | Vague. | "Body text stays at or above `font.size.md` (14px here). Raising text to 200% must not clip (WCAG 1.4.4 Resize Text, AA)." |
| 6 | "Keep it simple." | A platitude. | "Show one primary action per view region (Hick 1952; Nielsen 8, aesthetic and minimalist design)." |
| 7 | "Ensure good contrast." | No ratio. | "Label on fill reaches 4.5:1 (WCAG 1.4.3, AA); the focus ring reaches 3:1 against its neighbours (WCAG 1.4.11, AA)." |
| 8 | "Don't overuse modals." | No alternative. | "Do not block the page for a reversible choice; use an inline banner or a toast (Nielsen 3, user control and freedom)." |
| 9 | "Follow best practices for forms." | Which practices? | "Put the label above the input and link the error with `aria-describedby` (WCAG 3.3.1 Error Identification, A; 1.3.1 Info and Relationships, A)." |
| 10 | "Make it responsive." | No behaviour. | "At 320 CSS px the toolbar wraps to two rows; no horizontal scroll (WCAG 1.4.10 Reflow, AA)." |

Use the test in review too. A reviewer who flags a line names the check it failed: `page.basis` (no basis) or the swap check.

## Rulebook seeds

- `page.intro` · review · MEDIUM · Section 1 has a plain line, a precise line and names the layer.
- `page.tokens` · auto · MEDIUM · Section 2 lists tokens; each token named exists in the token source.
- `page.anatomy` · review · MEDIUM · Section 3 names every part and marks it required or optional (or gives the scale, or the tiers).
- `page.states` · auto · MEDIUM · Section 4 has a state matrix with no blank cell; `n/a` carries a reason.
- `page.usage` · review · MEDIUM · Section 5 has when, when not with an alternative, and how.
- `page.pitfalls` · review · MEDIUM · Section 6 lists pitfalls, each with a reason.
- `page.basis` · review · HIGH · Every Usage rule and pitfall names a basis, and passes the swap check.

## Misfiles

- A showcase that renders only the default state, or a States grid with blank cells. See `misfile.state-only-happy-path`.
- Usage written as marketing ("delightful, powerful buttons"). It has no rule and no basis.
- A foundation page that is only a token table. See `misfile.foundation-tokens-only`.
- Pitfalls copied from another system without checking they apply here.

## See also

- [contribution.md](contribution.md) — the four artifacts each slice belongs to.
- [rulebook.md](rulebook.md) — how `page.*` rules and rule ids work.
- [maturity.md](maturity.md) — level 4 needs this contract.
- [../taxonomy/layers.md](../taxonomy/layers.md) — the layer named in section 1.
- [../taxonomy/plain-language.md](../taxonomy/plain-language.md) — the plain register.
- [../states/state-matrix.md](../states/state-matrix.md) — the matrix for section 4.
- [../states/model.md](../states/model.md) — lifecycle and interaction states.
