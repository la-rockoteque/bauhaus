---
id: states/lifecycle-states
title: Lifecycle states — the nine states
shelf: states
layer: cross-cutting
owner: ux-designer
tags: [states, nine-states, empty, loading, error, validation, pagination]
sources:
  - Vince Speelman, "The Nine States of Design", 2015 — https://medium.com/swlh/the-nine-states-of-design-5bfe9b3d6d85
  - Nielsen, "10 Usability Heuristics for User Interface Design", NN/g — https://www.nngroup.com/articles/ten-usability-heuristics/
  - Miller 1968, "Response Time in Man-Computer Conversational Transactions"; Nielsen, "Response Times: The 3 Important Limits", NN/g — https://www.nngroup.com/articles/response-times-3-important-limits/
  - WCAG 2.2 — https://www.w3.org/TR/WCAG22/
---

# Lifecycle states — the nine states

> Think of a shop. Before opening: shutters down (*nothing*). Stocking shelves (*loading*). Open but empty shelves (*none*). One item left (*one*). A normal day (*some*). A queue out the door (*too many*). The card machine refuses a card (*incorrect*). The card is accepted (*correct*). The receipt is in your hand (*done*). A good shop has a plan for each one.

The nine states come from Speelman (2015). This file gives each one a definition, what it must show, the primitives and patterns where it matters most, and its evidence. Order follows Speelman's lifecycle.

## 1. Nothing

**Definition.** "The component exists but hasn't started" (Speelman): first use, not activated, no query yet.

**Must show.** What the component is for and the first action. A search page before the first query is *nothing*, not *none*. It should invite, not say "No results".

**Where it matters.** Search, filters, dashboards on first login, a scan field before the first scan, a form never touched.

**Basis.** Nielsen 10, Help and documentation, in its lightest form: the first-use screen is where help is cheapest. Nielsen 6, Recognition rather than recall: show the options, do not make users guess them.

**Pitfall.** Showing the *none* message ("Nothing found") before the user asked anything. It reports a failure that did not happen.

## 2. Loading

**Definition.** The system is fetching or processing. Speelman: "The dreaded state… There are plenty of ways to keep your loading state subtle and unobtrusive", citing a skeleton "dummy post" over a spinner.

**Must show.** Feedback matched to duration (Miller 1968; Nielsen's three limits of 0.1 s, 1 s, 10 s):

| Wait | Pattern |
|---|---|
| < 0.1 s | Nothing. Render the result. |
| 0.1 – 1 s | No loader. A looping animation for a sub-second wait is noise. |
| 1 – 10 s | Skeleton that mirrors the real layout, or an in-place spinner. Determinate if the length is known. |
| > 10 s | Percent done, or move it to the background and notify. |

**Where it matters.** Every data-bearing primitive (Table, List, Select with remote options), every button that triggers a request (interaction state *loading*, see `interaction-states.md`).

**Basis.** Nielsen 1, Visibility of system status. WCAG 2.2.2 Pause, Stop, Hide (A) for loops over five seconds. WCAG 4.1.3 Status Messages (AA): expose `aria-busy` and announce completion.

**Pitfalls.** A full-page spinner that blanks a working screen. A skeleton whose shape does not match what arrives (layout shift). A bar parked at 99 %. Details: `../patterns/loading.md`.

## 3. None

**Definition.** "Your component has initialized, but it's empty. No data. No items." Speelman names the two jobs: "get the user to act ('Do this thing!'), or to reward them ('Good job, everything is taken care of')."

**Must show.** Which of three *none* cases this is, because each needs different words:

| Case | Example | Must say |
|---|---|---|
| First-use empty | No projects yet | What will appear here and the action that creates the first one. |
| Filtered to empty | Filters exclude everything | Which filter to relax, with a one-click way to relax it. |
| Cleared / done empty | Inbox zero, no tasks left | That this is success. Speelman's "Good job". |

**Where it matters.** Lists, tables, search results, inboxes, notification panels, dashboards.

**Basis.** Nielsen 1 (status) and Nielsen 3, User control and freedom (a way out of a dead end). WCAG 4.1.3 (AA): a filter that empties a list announces the new count.

**Pitfall.** One generic "No data" message for all three cases. It turns a success into an alarm and a filter mistake into a dead end.

## 4. One

**Definition.** "You have some data. On an input, this may be after the first keystroke. In a list, it might be when you have one item (or one left)."

**Must show.** That the layout still works with a single item: a grid of cards with one card, a table with one row, a chart with one point, a plural that reads "1 item" not "1 items".

**Where it matters.** Lists, grids, charts, counters, autocomplete after one character, bulk-action bars with one row selected.

**Basis.** Content correctness in i18n: pluralisation needs ICU plural rules, and several languages have more than two plural forms (CLDR plural rules). Nielsen 4, Consistency and standards: the one-item layout should not look broken compared with the many-item one.

**Pitfall.** A layout that looks broken with one item, e.g. a single card stretched full width, or a "Select all" control shown for one row.

## 5. Some

**Definition.** "This is usually what you think of first… Your data is loaded, you have input, and the user is familiar with it."

**Must show.** The happy path, designed with **realistic** data: long names, real number ranges, mixed statuses. Lorem ipsum hides the *too many* problems that *some* already has.

**Basis.** Nielsen 8, Aesthetic and minimalist design. Nielsen 2, Match between system and the real world: design with the users' real vocabulary and data.

**Pitfall.** Designing only this state. That is the failure the whole model exists to prevent (Speelman; Rendle 2021).

## 6. Too many

**Definition.** "The user has overdone it in some way. Too many results (maybe you paginate them now), too many characters (maybe ellipses?)."

**Must show.** A deliberate strategy for each overflow axis:

| Overflow | Strategy | Basis |
|---|---|---|
| Too many rows | Pagination with total ("1–25 of 1,342") in work tools; virtualise only when orientation is not needed. | Nielsen 1 (where am I?); Nielsen 6 |
| Too many characters | Truncate with the full value reachable (tooltip on focus and hover, or expand). Never truncate IDs or amounts. | WCAG 1.4.13 Content on Hover or Focus (AA) |
| Too many columns | Hide by priority tier at narrow widths, or transform to a card stack. Not horizontal scroll as the only strategy. | WCAG 1.4.10 Reflow (AA) |
| Too many selected filters | Chips wrap, with one "Clear all". | Nielsen 3 |
| Input over a limit | Count remaining characters, announce near the limit, never silently cut pasted text. | WCAG 3.3.1 (A); 4.1.3 (AA) |
| Too many notifications | Group, collapse, rate-limit. | Nielsen 8 |

**Pitfall.** Discovering this state in production, because the mock-ups used three short rows.

## 7. Incorrect

**Definition.** "Something is not right about the component. An error has occurred."

**Must show.** Two kinds, handled differently:

- **User error** (a field is invalid): identify the field, say what is wrong in text, suggest the fix, keep the input. WCAG 3.3.1 Error Identification (A), 3.3.3 Error Suggestion (AA), 3.3.2 Labels or Instructions (A).
- **System error** (a request failed): say what failed in the user's terms, keep what can be kept, offer retry or a way out. Nielsen 9, Help users recognise, diagnose and recover from errors.

**Timing.** Validate on blur or on submit, not on every keystroke before the user finished. Remove the error as soon as it is fixed. See `../patterns/forms.md`.

**Accessibility.** `aria-invalid="true"`, the message tied with `aria-describedby`, an error summary on submit that moves focus to it. Never colour alone: WCAG 1.4.1 (A).

**Pitfall.** Speelman's own example drew a reply that an "X" icon reads as close or delete, not as invalid. The icon for an error must not collide with an established action icon (Nielsen 4, Consistency and standards).

## 8. Correct

**Definition.** "Good to go! This item has had its needs satisfied."

**Must show.** Quiet confirmation at the point of input: a password that now meets the rules, a matched confirmation field, an address that validated. It removes doubt before submit.

**Basis.** Nielsen 5, Error prevention: confirming a rule is met stops the user from guessing. Nielsen 1.

**Pitfall.** Loud success on every valid field (a green border on every input) adds noise. Show *correct* only where the rule was not obvious, or where the user just fixed an *incorrect* field.

## 9. Done

**Definition.** "The user's correct input has been received by the application. They don't have to worry about it anymore."

**Must show.** That the action landed, what changed, and what happens next. For a reversible action, an undo beats a confirmation dialog (Nielsen 3, User control and freedom). The message is announced (WCAG 4.1.3, AA). If it auto-dismisses and the user must act on it, it needs to be extendable or dismissible (WCAG 2.2.1 Timing Adjustable, A).

**Pitfall.** Motion as the only confirmation, e.g. a row that flashes green. A screen-reader user gets nothing (4.1.3) and a user who looked away misses it (Rensink et al. 1997, change blindness; see `../foundations/motion.md`).

## The cycle

Speelman: the states "repeat based on the page, user interaction, updated data". Map the transitions, not only the states:

```
nothing → loading → none ─────────────┐
                  → one → some → too many
                           ↓
               incorrect ⇄ correct → (submit) → loading → done → nothing | some
```

Every arrow is a transition the motion foundation must handle (`../foundations/motion.md`) and, when the user caused it, a status message (4.1.3).

## Rulebook seeds

- `<c>.state.nothing` · review · MEDIUM · "Before first use, the component says what it is for and offers the first action."
- `<c>.state.none-cases` · review · MEDIUM · "First-use, filtered and cleared empties have different messages."
- `<c>.state.one` · review · LOW · "The layout and the plural hold with exactly one item."
- `<c>.state.too-many` · review · MEDIUM · "Overflow has a strategy on every axis; no value is truncated without recourse."
- `<c>.state.incorrect-text` · review · HIGH · "The error is in text, names the field and suggests the fix." (3.3.1 A, 3.3.3 AA)
- `<c>.state.done-announced` · review · HIGH · "Completion reaches a live region." (4.1.3 AA)

## See also

- `model.md`, `interaction-states.md`, `state-matrix.md`
- `../patterns/loading.md`, `../patterns/empty-and-error.md`, `../patterns/forms.md`, `../patterns/data-tables.md`, `../patterns/filtering-search.md`
