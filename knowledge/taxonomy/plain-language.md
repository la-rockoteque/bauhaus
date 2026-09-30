---
id: taxonomy/plain-language
title: Plain language — how to vulgarise
shelf: taxonomy
layer: cross-cutting
owner: ux-designer
tags: [vulgarisation, analogies, glossary, advice, STE, audience]
sources:
  - ASD-STE100 Simplified Technical English — https://www.asd-ste100.org/
  - Bauhaus architecture contract — docs/architecture.md § Advising in plain language
  - Nielsen Norman Group, "How Users Read on the Web" (1997) — people scan; short text wins
  - WCAG 2.2 3.1.5 Reading Level (AAA) — https://www.w3.org/TR/WCAG22/
---

# Plain language

> Explain first in words a friend would use. Then, if the reader wants it, explain again with the exact terms. One sentence per idea. One everyday picture per concept. The picture must be right: a wrong picture is worse than none.

A design system has its own vocabulary. Most readers are not designers. A finding that a PM cannot read gets no action. This file gives the analogies, the glossary and the templates.

## Rules

1. Use two registers. **Plain** first, **precise** second. (Architecture contract: every advisory answer.)
2. When the audience is unknown, give both registers. (A reader who needs only one can stop.)
3. One idea per sentence. Fifteen to twenty words is the target. (ASD-STE100: short sentences, one topic each.)
4. Use active voice and simple verbs. "Use" not "utilise". "Check" not "ascertain". (ASD-STE100.)
5. Use one term per concept, taken from the ubiquitous language. Do not swap synonyms for style. (ASD-STE100: consistent terms.)
6. Define a term at first use, in the same sentence or the next. (A reader cannot scroll back mid-decision.)
7. Give one analogy per concept. Say where it stops being true. (An analogy that is stretched misleads.)
8. Lead with the consequence for the reader, then the cause. (People scan; they decide from the first line.)
9. Name the smallest next step. (Advice with no action is commentary.)
10. Do not use the analogy in place of the basis. The precise register still cites its criterion. (A finding with no basis is an opinion.)

## The two-register pattern

```
Plain:   <one to three short sentences, an everyday picture, no jargon>
Precise: <the terms, the token or rule id, the criterion with its level, the files>
```

Example:

```
Plain:   The grey text on this card is too pale. Some people cannot read it, even
         on a good screen. Make it a bit darker.
Precise: `color.text.muted` on `color.surface.soft` measures 3.8:1. WCAG 1.4.3 (AA)
         needs 4.5:1 for body text. Point the token at `color.gray.700`.
```

## Analogies for the four layers

| Layer | Plain picture | Where it fits | Where it stops |
|---|---|---|---|
| **Foundation** | The grammar of a language. Or the measuring system of a city: metres, not "about this long". | It sets what is allowed and why, before any word is said. | Grammar has no single value; a foundation does have a scale. |
| **Token** | A word in the dictionary. Or a paint swatch with a name on the tin: "Harbour Blue". | One name, one meaning, used everywhere. Change the tin and every wall changes. | A word has no "value". A swatch has one. |
| **Component** | A LEGO brick. Or a kitchen utensil: a whisk whisks. | One job, a known shape, reusable, fits with others. | A brick has no states; a component has hover, focus and disabled. |
| **Pattern** | A recipe. Or a floor plan for a common room, such as a kitchen. | It says which bricks to use, and in what order, for a known need. | A recipe adds no new ingredient. That is the rule: a pattern adds no new value. |

One sentence per layer for a mixed audience:

- Foundation: "The rules of the game: which sizes, colours and steps exist, and why."
- Token: "A named choice, like 'main text colour'. Written once. Used everywhere."
- Component: "A small part that does one job, like a button."
- Pattern: "A tested way to combine parts for a common need, like a list with a search box."

## Analogies for the other terms

| Term | Plain picture | Notes |
|---|---|---|
| **Design system** | The whole kitchen: tools, recipes, the labelled shelves and the house rules. | Not only the tools. |
| **Primitive token** | The paint tin with its raw colour. | Nobody paints from an unlabelled tin. |
| **Semantic token** | The label on the wall plan: "living-room wall". | Says what it is for. The tin behind it can change. |
| **Alias** | A forwarding address. "Main text colour" forwards to "grey 700". | Change the target; every sender still arrives. |
| **Theme** | A different lamp in the same room. The furniture stays. The mood changes. | Dark mode is a theme. |
| **Scale** | The steps of a staircase. Equal, few, and no half-steps hidden behind the door. | A scale with holes is not a scale. |
| **Rulebook** | The exam paper for each part, with a fixed number per question. | Each question keeps its number. |
| **Rule** | One question on the paper: "Does the button show focus?" | Answered yes or no, or graded by a person. |
| **Verify mode: auto** | A machine marks the answer. | Facts. |
| **Verify mode: review** | A teacher marks the answer. | Judgement. |
| **Advisory** | A sticky note on the part: "this is wrong, see rule X". Peeling it off means fixing it. | Not a ticket. It sits on the part itself. |
| **Known violation** | A crack already on the list. We know. We track it. The building is still open. | Debt, not a red build. |
| **Ratchet** | A ratchet strap: it tightens, and it never loosens by accident. | The count of cracks may go down. It may never go up. |
| **Four artifacts** | A product needs four things before it ships: the recipe, the photo, the label and the exam. | Tokens, styleguide, Storybook page, rulebook. |
| **Styleguide** | The printed cookbook. | Words. |
| **Storybook** | The open kitchen: you see each part working. | Running examples. |
| **Semver** | A version number that tells you if your kitchen breaks: 2.0 means "check your recipes". | See [../governance/versioning.md](../governance/versioning.md). |
| **Deprecation** | A "closing soon" sign with a date. | Give time to move. |
| **Codemod** | A find-and-replace robot that moves a whole team to the new name. | Saves hours. |

## Analogies for states

| Idea | Plain picture |
|---|---|
| **Interaction state** | A traffic light. The same light, three moods: red, amber, green. A button too: resting, pressed, unavailable. |
| **Lifecycle state** | The signs on a shop door: open, closed, sold out, queue too long, wrong shop. The shop is the same. The situation is different. |
| **Empty** | An empty shelf with a note: "Nothing here yet. Add the first thing." |
| **Loading** | The kettle is on. You see the light. You know something is happening. |
| **Disabled** | A door that exists but is locked, with a sign saying why. |
| **Error** | A red pen mark by the wrong answer, with the fix beside it. |
| **State, not variant** | A variant is the colour of a car you choose in the shop. A state is whether the engine is running. You do not choose "engine off" at the dealer. |
| **State matrix** | A checklist for a hotel room: clean, occupied, closed for repair. Every room has all the rows filled. |

See [../states/model.md](../states/model.md) for the full state model.

## Glossary: jargon to plain

| Term | Plain words |
|---|---|
| Design system (DSM) | The shared set of parts, rules and guides that keeps a product looking and acting the same. |
| Foundation | A family of values with a scale and a reason: colour, spacing, type. |
| Token | A named choice, stored once. |
| Primitive token | A raw value on a scale, like "blue 600". |
| Semantic token | A token that says what the value is for, like "main text colour". |
| Component token | A token used by one part only. |
| Alias | A token that points to another token. |
| Theme | A swap of some semantic tokens, for example dark mode. |
| Component | A small reusable part with one job. |
| Pattern | A recipe that combines parts for a common need. |
| Variant | A look you choose for a part, like "primary" or "secondary". |
| State | The condition a part is in right now: hovered, disabled, loading. |
| Interaction state | A state caused by what the user does. |
| Lifecycle state | A state caused by the data: empty, loading, too many, wrong. |
| State matrix | A table of every state for every part. |
| Anatomy | The named pieces of a part: label, icon, container. |
| Slot | A place inside a part where you can put your own content. |
| Prop | A setting you pass to a part. |
| Scale | A fixed set of steps for one kind of value. |
| Ramp | A scale of one colour from light to dark. |
| Contrast ratio | How different the text is from its background. Higher is easier to read. |
| Focus ring | The outline that shows where the keyboard is. |
| Target size | How big the clickable area is. |
| Reflow | The page rearranging itself when the screen is narrow. |
| Breakpoint | A screen width where the layout changes. |
| Density | How tightly things are packed. |
| Elevation | How high a surface appears to sit above the page. |
| Z-index | The order in which overlapping things are stacked. |
| Reduced motion | A user setting that asks for less animation. |
| DTCG | The shared file format for tokens. |
| Styleguide | The written spec of the system. |
| Storybook | The running spec: one page per part, with every state shown. |
| Rulebook | The full list of checks a part must pass. |
| Rule | One check with a permanent number. |
| Rubric | The question a rule asks. |
| Severity | How bad a finding is: HIGH, MEDIUM or LOW. |
| Verify mode | Who marks the rule: a machine (`auto`) or a person (`review`). |
| Advisory | A note pinned to a part that shows an open problem. |
| Known violation | A failing check we already track. |
| Ratchet | A test that lets a debt count fall but never rise. |
| Four artifacts | The four things shipped together: tokens, guide, Storybook page, rulebook entries. |
| Misfile | A thing kept in the wrong layer. |
| Adoption | How much of the product uses the shared parts. |
| Token coverage | How many values are tokens rather than typed-in numbers. |
| Breaking change | A change that makes existing code stop working. |
| Deprecation | A notice that something will be removed. |
| Codemod | A script that rewrites code to the new form. |
| Semver | A version scheme: major.minor.patch. |
| Basis | The standard or study a finding stands on. |
| Finding | One reported problem. |
| Kit | Starter files copied into a project. |

## Templates

Each template has three lines: what is true, what it costs, what to do. Fill it with facts from the report.

### For a product manager

```
What:    <the problem in one sentence, no jargon>
Impact:  <who is affected, how many screens, what users see>
Next:    <smallest step> — about <S/M/L> effort. <Rule id or "outside rulebook">.
```

Example:

```
What:    Error messages on three forms use red only. Colour-blind users cannot tell an error from normal text.
Impact:  About 1 in 12 men. Sign-up, billing and profile forms.
Next:    Add an icon and the word "Error" to the shared error line. Small effort. field.error-not-colour-alone.
```

### For a developer

```
Finding:  <rule id> — <one line, terms allowed>
Where:    <files or components>
Fix:      <smallest change, with the token or prop name>
Basis:    <criterion with level, or published source>
```

Example:

```
Finding:  misfile.raw-value-in-component — `#244b7b` in Card.css line 14
Where:    src/components/Card/Card.css
Fix:      replace with var(--ds-color-action-primary); token exists
Basis:    tokens are the only place a raw value may appear (layers.md rule 3)
```

### For an executive

```
Position:  <one sentence: where the system stands>
Risk:      <what could go wrong if nothing changes, in cost or reputation>
Ask:       <one decision or one resource>
```

Example:

```
Position:  The design system covers about 60% of the product. The rest is custom code.
Risk:      Every redesign costs more, and accessibility fixes must be made in many places.
Ask:       Approve two sprints to move the five most used screens onto shared parts.
```

## Bad and good explanations

**Bad** — jargon first, no action:

> The semantic tier is bypassed because component-level consumers dereference primitive tokens directly, violating the aliasing contract.

**Good:**

> Plain: The button uses a raw paint colour instead of the labelled one. If we change the brand colour, this button will not follow.
> Precise: `Button.css` reads `--ds-color-blue-600` (tier 1). Use `--ds-color-action-primary` (tier 2). Rule: `misfile.primitive-token-at-call-site`.

**Bad** — analogy replaces the basis:

> Think of colours like a wardrobe. This one is out of fashion.

**Good:**

> Plain: The pale grey label is hard to read. Think of small print on a grey background.
> Precise: 3.8:1 against `color.surface.soft`. WCAG 1.4.3 (AA) needs 4.5:1.

**Bad** — vague:

> The spacing is inconsistent and should be improved.

**Good:**

> Plain: The gap under the title is 18px here and 16px on the next page. The eye notices.
> Precise: `.order-title` sets `margin-bottom: 18px`. Use `--ds-space-4` (16px). Rule: `misfile.pattern-own-spacing`.

**Bad** — wrong analogy: "A token is a variable." A variable is one output of a token; the token is the decision.
**Good:** "A token is a named choice. The variable in CSS is one copy of it."

**Bad** — state as variant, in plain words: "Make a grey button for when it is off."
**Good:** "The button is the same button. It is switched off. Show why, and keep it readable."

## STE rules for advice

Short version of ASD-STE100 for a finding or an answer.

1. Write one instruction per sentence.
2. Keep instructions to twenty words or fewer. Keep other sentences to twenty-five.
3. Use the active voice. "Replace the value." Not "The value should be replaced."
4. Use one word for one meaning. Do not write "token" and "variable" for the same thing.
5. Use simple verbs: use, make, check, add, remove, move.
6. Use a noun or a number, not a pronoun that points two sentences back.
7. Put a warning before the step it applies to.
8. Do not use idioms, jokes or figures of speech in the precise register. Keep the analogy in the plain register.
9. Write the number, the unit and the level: `4.5:1`, `24px`, `WCAG 2.5.8 (AA)`.
10. Do not stack modifiers. Not "semantic action primary hover state token colour". Write "the hover colour of the primary action".

## Rulebook seeds

- `plain.two-registers` · review · MEDIUM · Each finding has a plain line and a precise line.
- `plain.basis-kept` · review · MEDIUM · The precise line cites a basis with its level.
- `plain.one-term` · review · LOW · One term per concept, taken from the ubiquitous language.
- `plain.next-step` · review · MEDIUM · Each finding names the smallest next step.

## Misfiles

- Vulgarisation used as a substitute for a basis. See rule 10.
- Analogies that name a layer wrongly. "A token is a component" mixes layers; see [layers.md](layers.md).
- Glossary entries that use a banned synonym ("atom", "skin", "checklist"). Use the ubiquitous-language term.

## See also

- [layers.md](layers.md) — the precise definitions behind each analogy.
- [decision-tree.md](decision-tree.md) — classify a thing before you explain it.
- [misfiles.md](misfiles.md) — findings that need a plain explanation.
- [../states/model.md](../states/model.md) — states in detail.
- [../governance/rulebook.md](../governance/rulebook.md) — what a rule, an advisory and a ratchet are.
- [../bauhaus/principles.md](../bauhaus/principles.md) — why the plugin explains before it audits.
