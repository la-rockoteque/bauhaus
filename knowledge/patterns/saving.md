---
id: patterns/saving
title: Saving and feedback
shelf: patterns
layer: pattern
owner: ux-designer
tags: [saving, autosave, manual-save, save-indicator, draft, unsaved-changes, beforeunload, status-message]
sources:
  - GitLab Pajamas, Saving and feedback — https://design.gitlab.com/patterns/saving-and-feedback
  - WCAG 2.2 4.1.3 Status Messages (AA), 1.4.1 Use of Color (A), 2.4.3 Focus Order (A)
  - WAI-ARIA Authoring Practices Guide, Alert pattern — https://www.w3.org/WAI/ARIA/apg/patterns/alert/
  - MDN, Window beforeunload event — https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
  - Nielsen, 10 Usability Heuristics, 1 Visibility of system status, 3 User control and freedom, 5 Error prevention, 9 Help users recover from errors — https://www.nngroup.com/articles/ten-usability-heuristics/
---

# Saving and feedback

> Saving should never be a guess. The page tells the user, in one fixed place, whether the work is safe: not yet, in progress, saved, or not saved and what to do.

This shelf picks the save model, then fixes the one indicator that reports it. For the choice of a message component, read `patterns/messaging.md`. For field validation before a save, read `patterns/forms.md`.

## Pick the save model

Ask in order. Stop at the first answer that holds.

1. **Do the fields depend on each other?** A start date and an end date, a shipping method and an address. Use a manual save: one Save button for the form.
2. **Does saving cost money, send something, or have other side effects?** Publish, invoice, send an email. Use a manual save. The user decides when it happens.
3. **Does the data have a financial, security or privacy impact?** Use a manual save. Pajamas warns against autosave here.
4. **Is it a setting, a preference or a draft?** Autosave, one field at a time.
5. **Not sure?** Use a manual save. Pajamas keeps it as the default.

## Autosave timing

| Input | When the request goes | Basis |
|---|---|---|
| Click: switch, checkbox, radio, select | At once | Pajamas |
| Typing | On blur, or 3 seconds after the last key | Pajamas |
| Blur with nothing changed | No request | Project decision |

Pajamas also gives 250 ms for search and 500 ms for validation. Those values are for search and validation, not for a save.

## The indicator

One indicator for the whole page. Place it beside the Save button, or in the page header for autosave.

| State | Icon | Words | Action |
|---|---|---|---|
| Idle | none | none | none |
| Unsaved | edit | Unsaved changes | none |
| Saving | spinner, hidden from assistive technology | Saving… | none |
| Saved | success | All changes saved, or Saved at 14:32 | none |
| Not saved | error | Not saved | Retry |

Pajamas shows the indicator beside each autosaved input. Bauhaus shows one per page, so one event has one message (`messaging.one-per-event`).

## Rules

1. Choose manual save or autosave by what the fields do. (Basis: Pajamas, Saving and feedback; the dependency and side-effect test is a project decision.)
2. Show one save indicator for the page. Do not repeat it per field. Do not raise a toast for a save. (Basis: project decision, consistent with `messaging.one-per-event`.)
3. Put the indicator in a `role="status"` region that stays in the page. Render only its content conditionally. A region mounted with its text is announced unreliably. (Basis: WCAG 4.1.3 (AA); APG Alert.)
4. Give each state an icon and words. Colour is never the only cue. (Basis: WCAG 1.4.1 (A); Nielsen 1.)
5. Hide the spinner inside the indicator with `aria-hidden`. The words already say "Saving…", and a second status region inside the first is read twice. (Basis: WCAG 4.1.3 (AA).)
6. When a save fails, keep the value and show "Not saved" with Retry. After a manual save, move focus to Retry: the user pressed Save and waits for the answer. After an autosave, leave focus where the user types. (Basis: Nielsen 3 and 9; WCAG 2.4.3 (A).)
7. The Save button uses `loading` while the request runs. It is never `disabled`. A second press does nothing. (Basis: Nielsen 1; `patterns/form-validation`: submit stays enabled.)
8. Edits made during a request make the page say "Unsaved changes" again, not "Saved". (Basis: Nielsen 1.)
9. Only the newest autosave request sets the indicator. A late reply to an older request, a success or a failure, is ignored. (Basis: Nielsen 1; the request counter is a project decision.)
10. Never send one request per keystroke. (Basis: Pajamas.)
11. A new record keeps a draft on the device. Wrap every storage access in `try/catch`. On return, a Banner "Draft restored" offers Discard. Leaving does not warn. Remove the draft after a successful create. (Basis: Nielsen 3; project decision: the sources read do not prescribe drafts.)
12. Leaving an existing record with unsaved changes opens a destructive Confirmation dialog: "Leave without saving?", confirm "Leave", cancel "Keep editing". Nothing is asked when nothing is unsaved. (Basis: Pajamas; Nielsen 5; `patterns/destructive-actions`.)
13. Add the `beforeunload` listener only while changes are unsaved, and remove it in the cleanup. The browser shows its own prompt, and its text cannot be changed. (Basis: MDN, beforeunload event.)

## Lifecycle states

| State | Status | Treatment |
|---|---|---|
| Nothing | designed | No edit yet. The indicator region is in the page and empty. |
| Loading | designed | Save pressed. The button is loading. The indicator says Saving…. |
| None, one, some, too many | n/a | The indicator is one per page. The number of changed fields does not change it. |
| Incorrect | designed | The request failed. Not saved, with Retry. The values stay. |
| Correct | n/a | Valid input before a save belongs to `patterns/forms.md`. |
| Done | designed | All changes saved, or Saved at a time. It stays until the next edit. |

## Rulebook seeds

Same ids, severities and verify modes as `kit/library/patterns/saving/saving.rules.ts`.

- `saving.no-own-style` · auto · MEDIUM · The pattern has no stylesheet.
- `saving.model-by-dependency` · review · HIGH · Manual save for dependent fields or side effects; autosave for a setting. Pajamas.
- `saving.one-indicator` · review · MEDIUM · One indicator per page; no toast for a save.
- `saving.status-announced` · auto · HIGH · The indicator is a `role="status"` region that stays in the page. WCAG 4.1.3 (AA).
- `saving.states-in-words` · review · HIGH · Each state has an icon and words. WCAG 1.4.1 (A).
- `saving.failure-retry` · review · HIGH · A failure keeps the value and offers Retry. Nielsen 9.
- `saving.autosave-timing` · review · MEDIUM · Autosave on blur, after a pause, or at once for a click. Pajamas.
- `saving.latest-wins` · review · HIGH · Only the newest request sets the indicator. Nielsen 1.
- `saving.manual-guarded` · auto · MEDIUM · The Save button uses `loading`, never `disabled`.
- `saving.draft-on-create` · review · HIGH · A new record keeps a draft; no leave warning. Nielsen 3.
- `saving.warn-on-update` · review · HIGH · An existing record asks before leaving with unsaved changes. Pajamas; Nielsen 5.
- `saving.beforeunload-only-dirty` · auto · MEDIUM · The `beforeunload` listener exists only while changes are unsaved. MDN.

## Misfiles

- Which message component to use belongs in `patterns/messaging.md`.
- Field error timing and the error summary belong in `patterns/forms.md` and `patterns/form-validation`.
- A wait with no save behind it (loading a page, a region) belongs in `patterns/loading.md`.
- The friction of a delete belongs in `patterns/destructive-actions.md`.

## Gaps

- No save indicator component. Each recipe composes it from Stack, Icon, Spinner, Text and Button. Ask for a component when a third screen builds it.
- No navigation blocker. The router of the app must block in-app navigation and call the recipe's question.
- No conflict handling. Two users who save the same record need a merge or a "changed by someone else" answer. No source read for this shelf covers it.

## See also

- `patterns/messaging.md`
- `patterns/destructive-actions.md`
- `patterns/forms.md`
- `patterns/loading.md`
- `states/model.md`
