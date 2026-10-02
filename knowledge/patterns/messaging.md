---
id: patterns/messaging
title: Messaging
shelf: patterns
layer: pattern
owner: ux-designer
tags: [messaging, toast, banner, alert-dialog, confirmation, popover, tooltip, badge, notification, least-disruptive]
sources:
  - GitLab Pajamas, Choosing a messaging pattern — https://design.gitlab.com/patterns/choosing-a-messaging-pattern
  - GitLab Pajamas, Patterns index (Notifications, Contextual help and info, Empty states, Destructive actions) — https://design.gitlab.com/patterns/
  - WCAG 2.2 4.1.3 Status Messages (AA), 2.2.1 Timing Adjustable (A), 1.4.13 Content on Hover or Focus (AA), 2.4.3 Focus Order (A)
  - WAI-ARIA Authoring Practices Guide, Alert pattern — https://www.w3.org/WAI/ARIA/apg/patterns/alert/
  - WAI-ARIA Authoring Practices Guide, Alert and Message Dialogs pattern — https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
  - WAI-ARIA Authoring Practices Guide, Dialog (Modal) pattern — https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
---

# Messaging

> Every message competes for attention with everything else on the screen. Pick the least disruptive component that does the job. If the user must leave their task to receive a signal, the signal is usually in the wrong place.

The decision starts from the user's need, not from the component. Pajamas orders the questions from "show nothing" to "ask the user to stop". This shelf keeps that order and maps each answer to a component Bauhaus has built. For the content of an error or an empty state, read `patterns/empty-and-error.md`. For fields, read `patterns/forms.md`.

## Decision tree

Ask the questions in order. Stop at the first answer that holds.

1. **Does the user need to know at all?** If no action is open and no information is needed now, or the result is already visible, show nothing. Do not add a message to be safe. End: no component.
2. **Is it the result of an action the user took in this view?**
   - The result is already visible (a row was added, a toggle moved): show nothing. End: no component.
   - The user typed a wrong value in a field: End: the field `error` prop. After a submit with several errors, add a form summary (`patterns/form-validation`).
   - The result is not visible and needs no follow-up ("Draft saved"): End: **Toast**.
   - The action cannot be undone, or costs something: ask first. End: **Confirmation dialog** (`destructive` when it cannot be undone).
3. **Does it block progress until the user answers?** A session ended, a conflict, a failure that stops the task. End: **Alert dialog**, one action, named for what it does. If the user can keep working, go on to question 4.
4. **Is it a condition of the page or the system?** Offline, a degraded service, a deadline, a failed load of a region. End: **Banner**. Use `urgent` only for an error the user must act on now. Keep it in the page, and let the user dismiss it when it no longer applies.
5. **Is it help for one control, term or element?**
   - A short hint on text only: End: **Tooltip**.
   - Richer content, a link or an action: End: **Popover**, opened by a click.
6. **Is it a status that tags an item, or a count?** "Overdue", "3 unread". End: **Badge**. It labels. It does not announce.
7. **Is it standing in for content that is missing?** A list with no rows. End: **Empty state** (`patterns/empty-results`).
8. **Is it an event the user catches up on later?** A background job, activity from others. Bauhaus has no notification centre. Use a Badge on the entry point and put the list in a page. Log the gap (see Gaps).

## Components compared

| Component | Interrupts? | Persists? | Announced how | Dismissal | Basis |
|---|---|---|---|---|---|
| Toast | No. Never takes focus. | No. Times out, unless it has an action or `duration: null`. | Polite region (`role="status"`); errors in an assertive region (`role="alert"`) | Timer, close button, or its action | WCAG 4.1.3 (AA); 2.2.1 (A) |
| Banner | No. Sits in the page. | Yes, until removed by the app or dismissed | `role="status"`; `urgent` error uses `role="alert"` | Optional close button | WCAG 4.1.3 (AA); APG Alert |
| Field error | No. | Until the value is valid | Tied by `aria-describedby`; read on focus | Fixing the value | WCAG 3.3.1 (A) |
| Form summary | No, but moves focus to itself once | Until fixed | Banner `role="alert"`, focus moved | Fixing each item | WCAG 3.3.1 (A); `patterns/form-validation` |
| Alert dialog | Yes. Modal, focus trapped. | Until the one action | `role="alertdialog"`, described by its message | Its action, or Escape | APG Alert and Message Dialogs; WCAG 2.4.3 (A) |
| Confirmation dialog | Yes. Modal, focus trapped. | Until a choice | `role="alertdialog"`, described by its message | Confirm, Cancel or Escape | APG Alert and Message Dialogs |
| Popover | No. Non-modal. Focus enters it. | Until Escape, a second click, or focus leaves | Dialog named by `label` | Escape returns focus to the trigger | APG Dialog; WCAG 2.4.3 (A) |
| Tooltip | No. Does not take focus. | While hovered or focused | Not a live region; read as the description of its control | Escape, move away | WCAG 1.4.13 (AA) |
| Badge | No. | Yes, with the item | Text read in place; the full count in hidden text | None | WCAG 1.4.1 (A) |
| Empty state | No. It is the content. | Until content exists | `role="status"` on the wrapper when it replaces content after an action | None | WCAG 4.1.3 (AA) |

## Rules

1. Choose the least disruptive component that does the job. Start from the user's need, not from the component. (Basis: Pajamas, Choosing a messaging pattern.)
2. Show nothing when no action or information is needed, or when the result is already visible. (Basis: Pajamas, Choosing a messaging pattern, question 0.)
3. One message per event, in one place. Do not show a toast and a banner for the same thing. (Basis: Pajamas, competing for attention.)
4. Every message reaches assistive technology without moving focus, unless it is a dialog or a summary that must take focus. Use a live region: `role="status"` (polite) or `role="alert"` (assertive). Keep a status region in the page all the time and render only its content conditionally. A region mounted together with its text is announced unreliably. For an urgent alert that must appear with its text, move focus to it. (Basis: WCAG 4.1.3 (AA); APG Alert.)
5. Use `role="alert"` only for important, time-sensitive information, such as an error the user must act on now. Polite `role="status"` is the default. An alert never moves focus on its own; a message that must interrupt is an Alert dialog. (Basis: APG Alert and Alert Dialog patterns.)
6. Do not put an error that needs action in a toast. A toast times out, and Pajamas states it cannot hold actions accessibly. Use a Banner or an inline error with the action. (Basis: Pajamas; WCAG 2.2.1 (A).)
7. An automatic close is a time limit set by the content. Never make a toast the only place for information the user needs later. A toast with an action stays until the user closes it, and a timed toast pauses on hover and focus (component behaviour). Do not cite a fixed duration in copy or review. (Basis: WCAG 2.2.1 (A); APG Alert: avoid alerts that disappear automatically.)
8. Use a dialog only when the user must answer before going on. Name the dialog and tie its message with `aria-describedby`. Move focus inside on open and return it to the opener on close. (Basis: APG Alert and Message Dialogs; APG Dialog (Modal); WCAG 2.4.3 (A).)
9. In a destructive confirmation, focus starts on the safe choice (Cancel). The confirm label names the action and its object. (Basis: Pajamas, Destructive actions: appropriate friction; Bauhaus component behaviour.)
10. Put essential information in the page, not in a tooltip or a popover. A tooltip is a hint; the control must work without it. (Basis: Pajamas, tooltip for plain short text and popover for richer content.)
11. A tooltip holds text only. Its content can be dismissed without moving the pointer or focus, and stays visible when the pointer moves onto it. It stays until hover or focus is removed, the user dismisses it, or the information is no longer valid. (Basis: WCAG 1.4.13 (AA): dismissible, hoverable, persistent.)
12. Open a popover with a click, never on hover, on focus or on page load. Keyboard and screen reader users must reach what is inside. (Basis: Pajamas; WCAG 2.4.3 (A): a non-modal dialog joins the focus order after its trigger.)
13. Do not mark status by colour alone. A status message has an icon and a word. A Badge has text. (Basis: WCAG 1.4.1 (A).)
14. A banner is for a condition of the page or system. It is not a promotion or a feature announcement, and it never replaces help placed at the control. (Basis: Pajamas, banner as last resort for awareness.)

## Rulebook seeds

Same ids, severities and verify modes as `kit/library/patterns/messaging/messaging.rules.ts`.

- `messaging.no-own-style` · auto · MEDIUM · The pattern has no stylesheet.
- `messaging.least-disruptive` · review · HIGH · The message uses the least disruptive component that does the job. Pajamas.
- `messaging.one-per-event` · review · MEDIUM · One event produces one message in one place.
- `messaging.announced` · auto · HIGH · Every status message sits in a live region, kept in the page while only its content comes and goes. WCAG 4.1.3 (AA).
- `messaging.assertive-only-when-urgent` · review · MEDIUM · `role="alert"` marks only an error the user must act on now. APG Alert.
- `messaging.toast-not-for-errors-needing-action` · review · HIGH · A failure that needs the user's action is a Banner or an inline error, not a toast. Pajamas; WCAG 2.2.1 (A).
- `messaging.toast-action-persists` · auto · HIGH · A toast with an action stays until the user closes it. WCAG 2.2.1 (A).
- `messaging.not-only-in-toast` · review · HIGH · A toast is never the only place for information the user needs later. WCAG 2.2.1 (A); APG Alert.
- `messaging.dialog-takes-focus` · auto · HIGH · A dialog has a name and a described message, moves focus in on open and back to the opener on close. APG Dialog; WCAG 2.4.3 (A).
- `messaging.no-essential-in-tooltip` · review · HIGH · No essential information, link or action lives in a tooltip. WCAG 1.4.13 (AA).
- `messaging.popover-on-click` · review · MEDIUM · A popover opens on click only. Pajamas.

Rule 13 (colour alone) has no rulebook entry yet. The slice has no check or example that carries it.

## Misfiles

- The wording of an error or an empty state belongs in `patterns/empty-and-error.md`.
- Field error timing and the error summary belong in `patterns/forms.md` and `patterns/form-validation`.
- Spinners, skeletons and progress for a wait belong in `patterns/loading.md`.
- Tone and phrasing belong in `patterns/content-writing.md`.
- The motion of a toast belongs in `foundations/motion.md`.

## Gaps

- No notification centre, no feature-discovery component and no drawer exist. Pajamas routes async events, feature discovery and long help there. Bauhaus answers with a Badge and a page until a component exists.
- No inline-alert component exists. A Banner inside the content area plays that role.

## See also

- `patterns/empty-and-error.md`
- `patterns/forms.md`
- `patterns/loading.md`
- `patterns/content-writing.md`
- `states/model.md`
- `components/catalog.md`
