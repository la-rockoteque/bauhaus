---
id: patterns/forms
title: Forms
shelf: patterns
layer: pattern
owner: ux-designer
tags: [forms, labels, validation, error-summary, autocomplete, redundant-entry]
sources:
  - WCAG 2.2 3.3.1 (A), 3.3.2 (A), 3.3.3 (AA), 3.3.4 (AA), 3.3.7 (A), 1.3.5 (AA), 4.1.3 (AA)
  - GOV.UK Design System, Error summary and Question pages — https://design-system.service.gov.uk/components/error-summary/
  - WAI Forms Tutorial — https://www.w3.org/WAI/tutorials/forms/
  - Nielsen, 10 Usability Heuristics, 5 Error prevention, 9 Help users recognise, diagnose and recover from errors
---

# Forms

> A form is a conversation. Each question needs a clear label, the answer should be checked at the right moment, and a mistake should be easy to find and fix. Keep the form short.

## Rules

1. Give every input a visible, persistent label. A placeholder is not a label. (Basis: WCAG 3.3.2 Labels or Instructions (A).)
2. Bind the label to the control with `<label for>` or by wrapping. (Basis: WCAG 1.3.1 Info and Relationships (A), 4.1.2 (A).)
3. Group related controls (radios, checkboxes, address parts) in a `fieldset` with a `legend`. (Basis: WCAG 1.3.1 (A).)
4. Put hints between label and input and bind them with `aria-describedby`. (Basis: WCAG 3.3.2 (A).)
5. Mark optional fields as "(optional)". Do not mark required fields with a bare asterisk that has no legend. (Basis: WCAG 3.3.2 (A); GOV.UK guidance.)
6. Set `autocomplete` tokens on personal fields: `name`, `email`, `tel`, `street-address`, `postal-code`. (Basis: WCAG 1.3.5 Identify Input Purpose (AA).)
7. Use the input type that matches the data: `email`, `tel`, `date`, `number` with `inputmode`. (Basis: native first; `accessibility/apg-patterns.md`.)
8. Do not ask twice for what you already have. Pre-fill, or offer "same as billing". (Basis: WCAG 3.3.7 Redundant Entry (A).)
9. Allow paste in every field, including passwords. (Basis: WCAG 3.3.8 Accessible Authentication (Minimum) (AA).)
10. Validate on blur, not on each key stroke. Once a field shows an error, re-check on input and clear the error the moment the value is valid. (Basis: early errors interrupt typing; late errors are found at once; Baymard Institute form research.)
11. Do not validate an empty field the user has not left. (Basis: Nielsen 5.)
12. On submit with errors, show an error summary at the top, move focus to it, and link each item to its field. (Basis: WCAG 3.3.1 (A); GOV.UK Error summary.)
13. Also show the message next to each field, bound by `aria-describedby`, and set `aria-invalid="true"`. (Basis: WCAG 3.3.1 (A), 4.1.2 (A).)
14. Write each message with the field name and the fix: "Enter an email address, like name@example.com". (Basis: WCAG 3.3.3 Error Suggestion (AA).)
15. Keep everything the user typed after a failed submit. (Basis: Nielsen 3 User control and freedom.)
16. For binding actions (payment, deletion, legal), allow reversal, a check step or a confirmation. (Basis: WCAG 3.3.4 Error Prevention (AA).)
17. Disable a submit button only with an explanation. Prefer an enabled button that reports what is missing. (Basis: Nielsen 1, 9.)
18. Announce a save or a result: `role="status"`. (Basis: WCAG 4.1.3 (AA).)
19. Use a single column. Put the primary action at the bottom, aligned with the fields. (Basis: reading path; common usability guidance.)
20. On phones, set input font size to 16 px or more, to stop iOS zoom on focus. (Basis: `patterns/responsive.md`.)

## Lifecycle of a form

| Moment | Lifecycle state | What the user sees |
|---|---|---|
| Opened, untouched | nothing | Labels, hints, no errors |
| Typing | nothing | No live errors before blur |
| Left a field with a bad value | incorrect | Inline message under that field |
| Value fixed | correct | Message removed, optional quiet check mark |
| Submit with errors | incorrect | Summary at top, focus on it, fields flagged |
| Submit in flight | loading | Button loading, fields kept |
| Saved | done | Status message, or navigation with a confirmation |

Names from `states/model.md`.

## Error summary and field message

```html
<div role="alert" tabindex="-1" id="error-summary">
  <h2>There is a problem</h2>
  <ul>
    <li><a href="#email">Enter an email address, like name@example.com</a></li>
  </ul>
</div>

<label for="email">Email address</label>
<p id="email-hint">We send the receipt here.</p>
<p id="email-error"><span class="visually-hidden">Error:</span> Enter an email address, like name@example.com</p>
<input id="email" type="email" autocomplete="email" aria-invalid="true"
       aria-describedby="email-hint email-error">
```

## Why

Placeholders vanish when the user types, leave low contrast and cause memory load. Late validation lets the user find all errors at once; early validation on every key press flags a value that is not finished. A summary with links gives keyboard and screen-reader users one place to start.

## Rulebook seeds

- `field.visible-label` · auto · HIGH · Every input has a visible label. WCAG 3.3.2 (A).
- `field.label-bound` · auto · HIGH · The label is bound to the control. WCAG 1.3.1 (A).
- `field.fieldset-legend` · auto · HIGH · Grouped controls use `fieldset` and `legend`. WCAG 1.3.1 (A).
- `field.error-bound` · auto · HIGH · The error is text, bound by `aria-describedby`, with `aria-invalid`. WCAG 3.3.1 (A).
- `field.autocomplete` · auto · MEDIUM · Personal fields carry `autocomplete`. WCAG 1.3.5 (AA).
- `form.error-summary` · review · HIGH · Submit errors show a linked summary with focus. WCAG 3.3.1 (A).
- `form.validate-on-blur` · review · MEDIUM · Validation runs on blur, then on input after an error.
- `form.no-redundant-entry` · review · MEDIUM · No repeated request for known data. WCAG 3.3.7 (A).
- `form.allow-paste` · auto · HIGH · Paste is not blocked. WCAG 3.3.8 (AA).
- `form.keeps-input` · review · HIGH · A failed submit keeps the input. Nielsen 3.

## Misfiles

- Copy style of messages belongs in `patterns/content-writing.md`.
- A single field's visuals belong in `components/catalog.md`.
- A multi-step wizard is a separate pattern that reuses these rules for each step.

## See also

- `states/model.md`
- `patterns/empty-and-error.md`
- `patterns/content-writing.md`
- `patterns/responsive.md`
- `components/catalog.md`
- `accessibility/wcag-map.md`
