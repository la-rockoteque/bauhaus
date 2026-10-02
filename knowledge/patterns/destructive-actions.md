---
id: patterns/destructive-actions
title: Destructive actions
shelf: patterns
layer: pattern
owner: ux-designer
tags: [destructive, delete, confirmation, undo, type-to-confirm, error-prevention, danger]
sources:
  - GitLab Pajamas, Destructive actions — https://design.gitlab.com/patterns/destructive-actions
  - Nielsen, Confirmation Dialogs Can Prevent User Errors — If Not Overused (NN/g, 2018) — https://www.nngroup.com/articles/confirmation-dialog/
  - WAI-ARIA Authoring Practices Guide, Alert and Message Dialogs — https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
  - WCAG 2.2 3.3.4 Error Prevention (Legal, Financial, Data) (AA) — https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html
  - Nielsen, 10 Usability Heuristics, 3 User control and freedom, 5 Error prevention — https://www.nngroup.com/articles/ten-usability-heuristics/
---

# Destructive actions

> Friction scaled to the cost of the action. A reversible action needs no question: do it and offer Undo. A permanent one needs a question that names what is lost. A permanent one that takes other things with it needs the user to type the name. Every extra step that protects nothing teaches users to click through the steps that do.

## The decision table

Ask one question first: can the action be reversed, by the user, for a useful time?

| Cost of the action | Friction | Component | Example |
|---|---|---|---|
| Reversible (soft delete, archive, remove from a list) | None before. Undo after. | Act at once, then a Toast with an Undo action | Move a file to trash |
| Irreversible, one item, little data lost | One question | Confirmation dialog, `destructive` | Delete a saved filter |
| Irreversible, removes other resources with it (cascade) | One question and the user types the name | Modal with a text field; the confirm button stays disabled until the name matches | Delete a project and its files |
| Bulk (many items at once) | One question that states the count | Confirmation dialog, confirm label carries the count; add type-to-confirm if the set is large or cascades | "Delete 12 files" |

GitLab Pajamas sorts the same ground by severity: high (a modal, plus type-to-confirm when the deletion removes additional resources), medium (an intermediate step, such as an action placed in a dropdown, two clicks minimum), low (an action that "can easily be undone and no actual data is lost" needs no friction). Bauhaus maps medium onto the table by keeping the trigger away from the main actions (Menu, not a toolbar button) and then applying the row above that fits.

## Rules

1. Prefer undo over confirmation when the action can be reversed. Do the action, then show a Toast with an Undo action. (Basis: Nielsen, NN/g: "do try your best to offer undo"; Nielsen 3 User control and freedom; WCAG 3.3.4 (AA) lists reversible first among its three ways. Project decision: the catalog counts "a confirmation where undo would do" as a defect.)
2. Reserve the confirmation dialog for actions with serious consequences. Overuse trains users to dismiss it unread. (Basis: NN/g, dialog fatigue.)
3. Name the action on the confirm button, with its object: "Delete project", never "OK", "Yes" or "Confirm". Name the safe choice too: "Cancel". (Basis: NN/g, action-specific labels such as "Delete file" and "Keep file"; Pajamas, "Yes, delete project" and "Cancel, keep project".)
4. State the cost in the dialog: what will be deleted, how much, and whether it can come back. "Are you sure?" says nothing. (Basis: NN/g, be specific, identify what will be deleted; Nielsen 5.)
5. Start focus on Cancel in a destructive confirmation. A stray Enter then keeps the data. (Basis: project decision, `components/catalog.md` Confirmation dialog; the APG Alert and Message Dialogs page does not set initial focus and defers to the modal dialog pattern. Contested: some systems focus the confirm button for speed. Bauhaus chooses the safe default.)
6. Use `role="alertdialog"`, labelled by its title and described by its message. (Basis: APG Alert and Message Dialogs.)
7. Ask for the typed name only when the deletion removes additional resources. Match exactly, and say what to type. (Basis: Pajamas type-to-confirm. Matching rules, case and trimming, are a project choice.)
8. Keep the confirm button visible while typing: disabled until the name matches, with the field's description saying why. (Basis: Nielsen 9. Contested: the form-validation pattern forbids a disabled submit to signal invalid data; here the disabled state is the guard itself, and the reason sits beside it.)
9. Show progress while the deletion runs: the confirm button is `loading`. Do not close the dialog until the server answers. (Basis: Nielsen 1 Visibility of system status.)
10. On failure, keep the dialog open, say nothing was deleted, and offer retry. The message is `role="alert"`. (Basis: Nielsen 9; WCAG 4.1.3 (AA).)
11. After any delete, say it is done in a status region and move focus to a place that exists, because the trigger is gone. After an Undo-style delete, focus goes to the next row's control, or to the list or its empty message when no row remains. After Undo, focus goes to the restored row. (Basis: WCAG 4.1.3 (AA), 2.4.3 Focus Order (A).)
12. Keep the Undo toast until the user closes it. A toast with an action does not time out. (Basis: WCAG 2.2.1 Timing Adjustable (A); `components/feedback/toast`.) Commit the delete when the toast closes, or soft-delete on the server and purge later.
13. Do not rely on colour alone to mark danger. The words carry the risk. (Basis: WCAG 1.4.1 (A).)
14. Keep a destructive trigger away from the primary action, for example in a Menu. (Basis: Pajamas medium severity, an intermediate step.)

## Reaching Undo by keyboard

The toast region sits at the end of the page order. A keyboard user reaches Undo with Tab, after the other controls. The Toast component has no shortcut key and no jump key, and the pattern adds none.

Known limit: a region shows `max` toasts (3 by default) and counts the rest as "+N more". The Undo of a waiting toast cannot be reached until another toast closes. Keep deletes few at a time, or raise `max` for the screen.

## Known limitation

The Button has no danger variant (`primary`, `secondary`, `tertiary`, `subtle`). ConfirmationDialog renders its confirm action as `primary`. The pattern composes what exists and adds no style. The words ("Delete project") carry the risk, as rule 13 requires. If three apps need a red confirm, add `danger` to Button as a component change with its tokens, then use it here.

## Lifecycle states

| State | Design |
|---|---|
| nothing | The item and its delete trigger, no dialog |
| loading | Confirm button `loading`, the dialog stays open |
| none, one, some, too-many | n/a: the pattern acts on an item that already exists; bulk is a count in the label |
| incorrect | Delete failed: error in the dialog, nothing lost, retry |
| correct | n/a: no partial success to confirm; a name match is shown by the enabled button |
| done | Deleted: Undo toast when reversible, a status message when not |

## Rulebook seeds

Same ids, severities and verify modes as `kit/library/patterns/destructive-actions/destructive-actions.rules.ts`.

- `destructive-actions.no-own-style` · auto · MEDIUM · The pattern has no stylesheet.
- `destructive.undo-over-confirm` · review · MEDIUM · A reversible action runs at once and offers Undo. It has no confirmation.
- `destructive.names-the-action` · review · HIGH · The confirm button names the action and its object. It is never "OK", "Yes" or "Confirm".
- `destructive.focus-on-cancel` · review · HIGH · A destructive confirmation starts focus on Cancel.
- `destructive.type-to-confirm-cascade` · review · MEDIUM · A deletion that removes other resources asks for the name, and the confirm button waits for an exact match.
- `destructive.states-the-cost` · review · HIGH · The dialog says what is deleted and whether it can be recovered.
- `destructive.failure-keeps-dialog` · review · HIGH · On failure the dialog stays open, an alert says nothing was deleted, and the user can retry. Nielsen 9; WCAG 4.1.3 (AA).
- `destructive.done-announced` · review · HIGH · After a delete, a status region announces the result and focus lands on an element that exists. WCAG 4.1.3 (AA), 2.4.3 (A).

## Misfiles

- A message with one answer and no choice belongs to the Alert dialog, not here.
- Toast timing and placement belong to `components/catalog.md` (Toast).
- Field validation and error text belong to `patterns/forms.md`.
- Permission checks ("you cannot delete this") are not-DS business logic; show the reason in place of the action.

## See also

- `patterns/messaging.md`
- `patterns/empty-and-error.md`
- `patterns/forms.md`
- `components/catalog.md` (Confirmation dialog, Alert dialog, Toast, Modal)
