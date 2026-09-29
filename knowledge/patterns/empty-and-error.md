---
id: patterns/empty-and-error
title: Empty and error states
shelf: patterns
layer: pattern
owner: ux-designer
tags: [empty-state, error, recovery, none, incorrect, messages]
sources:
  - Nielsen, 10 Usability Heuristics, 9 Help users recognise, diagnose and recover from errors — https://www.nngroup.com/articles/ten-usability-heuristics/
  - WCAG 2.2 3.3.1 Error Identification (A), 3.3.3 Error Suggestion (AA), 4.1.3 Status Messages (AA)
  - GOV.UK Design System, Error message and Error summary — https://design-system.service.gov.uk/components/error-message/
---

# Empty and error states

> Two screens ship missing more than any other: the one with nothing to show and the one where something failed. Both must say what is true and what to do next. A blank area or a code is a broken screen.

## Rules

1. Design the empty state for every list, table and panel that can be empty. (Basis: Nielsen 1 Visibility of system status.)
2. Tell the two empties apart: nothing exists yet (`nothing`), and a filter found nothing (`none`). Each has its own copy and action. (Basis: `states/model.md`.)
3. An empty state has a title that states the fact, one sentence of reason, and one primary action. (Basis: Nielsen 9, 10.)
4. A `none` result caused by filters names the active filters and offers a one-click way to clear or relax them. (Basis: no dead ends; `patterns/filtering-search.md`.)
5. An error message says what failed in the user's words, why if known, and how to recover. (Basis: Nielsen 9.)
6. Never show a raw error code or a stack trace as the message. Log it, show a reference id if support needs one. (Basis: Nielsen 9; security guidance against leaking internals.)
7. Write the error in text. Name the field or the action. (Basis: WCAG 3.3.1 (A).)
8. When the fix is known, state it. (Basis: WCAG 3.3.3 (AA).)
9. Announce a new error to assistive technology: `role="alert"` for blocking errors, `role="status"` for polite ones. (Basis: WCAG 4.1.3 (AA).)
10. Keep the user's input after a failure. (Basis: Nielsen 3 User control and freedom.)
11. Offer retry for transient failures. Retry runs the same action once, and reports again. (Basis: Nielsen 9.)
12. Scope the error to what failed. A failed widget shows an error in place, and the rest of the page works. (Basis: Nielsen 5 Error prevention; graceful degradation.)
13. Do not use colour alone to mark an error. Add an icon and text. (Basis: WCAG 1.4.1 Use of Color (A).)

## Empty state kinds

| Kind | Lifecycle state | Title example | Action |
|---|---|---|---|
| First use | nothing | "No projects yet" | Create the first one |
| Filter or search found nothing | none | "No results for these filters" | Clear filters, relax one |
| Cleared by the user (inbox zero) | done | "All caught up" | None needed, or link onward |
| Permission blocks the data | incorrect | "You cannot view this list" | Request access |
| Load failed | incorrect | "We could not load projects" | Retry |

Do not reuse one component and one text for all five.

## Error scopes

| Scope | Where it shows | Role |
|---|---|---|
| Field | Under the field, bound by `aria-describedby` | Announced on focus |
| Form | Error summary at the top, links to fields | `role="alert"`, focus moves to it |
| Region (card, table) | In place of the content, with retry | `role="alert"` |
| Page (route failed) | Full content area, with navigation kept | Focus to the heading |
| Global (offline, session ended) | Banner | `role="alert"` or `status` |

## Message template

```
<What happened, in user words.> <Why, if known.> <What to do.>
"We could not save the requisition. The connection dropped. Check your network and try again."
```

Keep to about 25 words. Use the same action verb as the button.

## Why

Users read a blank or silent screen as a broken product. A message that names the problem and the next step restores control at once. Field errors in text are also a conformance point: WCAG 3.3.1 (A) is broken by a red border alone.

## Rulebook seeds

- `empty.designed-for-each-list` · review · HIGH · Every collection that can be empty has an empty state.
- `empty.says-next-step` · review · MEDIUM · The empty state gives one primary action.
- `empty.filtered-offers-clear` · review · HIGH · A filtered empty state offers to clear or relax filters.
- `error.in-text` · auto · HIGH · Errors are text, not colour alone. WCAG 3.3.1 (A).
- `error.suggests-fix` · review · MEDIUM · The message states the fix when it is known. WCAG 3.3.3 (AA).
- `error.announced` · auto · HIGH · Errors reach a live region. WCAG 4.1.3 (AA).
- `error.no-raw-codes` · review · MEDIUM · No raw code or stack trace in the UI. Nielsen 9.
- `error.keeps-input` · review · HIGH · A failed submit keeps what the user typed.

## Misfiles

- Field-level validation timing belongs in `patterns/forms.md`.
- Tone and phrasing rules belong in `patterns/content-writing.md`.
- Illustration style for empty states belongs in `foundations/iconography.md`.

## See also

- `states/model.md`
- `patterns/forms.md`
- `patterns/filtering-search.md`
- `patterns/content-writing.md`
- `components/catalog.md`
