---
id: patterns/content-writing
title: Content writing and i18n
shelf: patterns
layer: pattern
owner: ux-designer
tags: [ux-writing, voice, tone, error-messages, i18n, icu, pluralisation, text-expansion]
sources:
  - Nielsen, 10 Usability Heuristics, 2 Match between the system and the real world, 4 Consistency and standards, 9 Help users recognise, diagnose and recover from errors
  - WCAG 2.2 3.1.1 Language of Page (A), 3.1.2 Language of Parts (AA), 3.3.2 (A), 3.3.3 (AA), 2.4.6 (AA), 3.1.5 Reading Level (AAA)
  - Mailchimp Content Style Guide, Voice and tone — https://styleguide.mailchimp.com/voice-and-tone/
  - W3C, Text size in translation — https://www.w3.org/International/articles/article-text-size
  - ICU MessageFormat and Unicode CLDR plural rules — https://unicode-org.github.io/icu/userguide/format_parse/messages/
---

# Content writing and i18n

> Words are part of the interface. Use the user's words, say one thing per sentence, and write every message so it can be translated. Do not glue strings together.

## Rules: voice and tone

1. Define one voice for the product in three or four traits, and keep it constant. Let tone shift with the moment: calm for errors, warm for success. (Basis: Mailchimp voice and tone.)
2. Use the user's vocabulary, not internal jargon or system names. (Basis: Nielsen 2.)
3. Keep one term per concept across the product. Keep a glossary. (Basis: Nielsen 4; `UBIQUITOUS-LANGUAGE.md`.)
4. Use sentence case for titles, labels and buttons. (Basis: readability; consistent with common system guides.)
5. Use active voice and short sentences: about 20 words or fewer. (Basis: STE-style clarity; WCAG 3.1.5 Reading Level (AAA) as a goal.)
6. Front-load the important word in headings, links and buttons. (Basis: scanning; WCAG 2.4.6 Headings and Labels (AA).)

## Rules: UX writing

7. Label buttons with a verb and an object: "Save requisition", not "OK" or "Submit". (Basis: Nielsen 2; WCAG 2.4.6 (AA).)
8. Use the same label in the button and in the confirmation that follows. (Basis: Nielsen 4.)
9. Make link text meaningful out of context. (Basis: WCAG 2.4.4 Link Purpose (In Context) (A).)
10. Put instructions before the control, in text, not only by shape, colour or position. (Basis: WCAG 1.3.3 Sensory Characteristics (A).)
11. Empty states: title states the fact, one sentence gives the reason, one action follows. (Basis: `patterns/empty-and-error.md`.)
12. Confirmation copy names the consequence: "Delete 3 requisitions? This cannot be undone." Button: "Delete 3 requisitions". (Basis: Nielsen 5 Error prevention.)
13. Do not use humour in errors or in flows where the user may lose data. (Basis: tone follows the user's mood.)

## Rules: error messages

14. Say what happened, why if known, and what to do. Use the field name. (Basis: Nielsen 9; WCAG 3.3.1 Error Identification (A), 3.3.3 Error Suggestion (AA).)
15. Do not blame the user: "Enter a date after today", not "You entered an invalid date". (Basis: Nielsen 9, plain language.)
16. Never show a code as the message. Add a reference id after the text if support needs it. (Basis: Nielsen 9.)
17. Keep the message under about 25 words. (Basis: STE-style limit.)

## Rules: i18n

18. Put every user-facing string in a message catalogue with a stable key. No strings in components. (Basis: translation workflow.)
19. Use ICU MessageFormat with single braces: `{name}`. Double braces belong to other template systems and render literally. (Basis: ICU MessageFormat syntax.)
20. Never build a sentence from parts. Word order differs by language. Translate whole sentences with placeholders. (Basis: ICU guidance.)
21. Use ICU plural rules, not `count === 1`. CLDR defines the categories `zero`, `one`, `two`, `few`, `many`, `other`. Languages use different subsets. (Basis: Unicode CLDR.)
22. Plan for text expansion. Translations often run about 30% longer than English, and short strings grow more. Never fix widths on labels and buttons. Let layouts wrap. (Basis: W3C text size in translation.)
23. Format dates, numbers, currency and lists with `Intl` or the platform equivalent. Never hand-format. (Basis: locale rules differ.)
24. Set `lang` on `<html>` and on each foreign passage. (Basis: WCAG 3.1.1 (A), 3.1.2 (AA).)
25. Use logical properties (`margin-inline-start`) so right-to-left languages work. (Basis: CSS logical properties.)
26. Give translators context: a description per key, the max length, and the screen. (Basis: translation quality.)
27. One language per sentence. Do not mix a foreign term into a sentence unless it is a proper name or a quotation. In docs, quote UI text of another language in quotation marks. (Basis: clarity; `UBIQUITOUS-LANGUAGE.md`.)
28. Keep icons free of text and culture-specific gestures. (Basis: `foundations/iconography.md`.)

## Examples

Plural with ICU:

```
{count, plural,
  =0 {No requisitions}
  one {# requisition}
  other {# requisitions}}
```

Placeholder, not concatenation:

```
"Shipment {id} arrives on {date, date, medium}"      // good
"Shipment " + id + " arrives on " + date             // bad
```

| Instead of | Write |
|---|---|
| "Error 4023" | "We could not save the requisition. Check your network and try again." |
| "Invalid input" | "Enter a quantity between 1 and 99" |
| "OK" | "Save requisition" |
| "Are you sure?" | "Delete 3 requisitions? This cannot be undone." |
| "You have 1 items" | `{count, plural, one {# item} other {# items}}` |

## Why

Users act on the words in front of them. Wrong words cause errors, and errors in unclear language are hard to fix. Translation adds cost when strings are built from pieces, because grammar cannot be moved. Message catalogues and ICU keep that cost low.

## Rulebook seeds

- `copy.button-verb-object` · review · MEDIUM · Buttons use a verb and an object. WCAG 2.4.6 (AA).
- `copy.one-term` · review · MEDIUM · One term per concept. Nielsen 4.
- `copy.error-actionable` · review · HIGH · Errors say what, why and next step. WCAG 3.3.3 (AA).
- `copy.no-error-codes` · review · MEDIUM · No raw codes as messages. Nielsen 9.
- `i18n.no-hardcoded-strings` · auto · HIGH · No user-facing strings in components.
- `i18n.icu-plural` · auto · HIGH · Plurals use ICU, not `count === 1`.
- `i18n.no-concatenation` · auto · HIGH · No sentence is built by concatenation.
- `i18n.text-expansion` · review · MEDIUM · Labels tolerate 30% growth.
- `i18n.lang-set` · auto · HIGH · `lang` is set on the page and on foreign parts. WCAG 3.1.1 (A), 3.1.2 (AA).
- `i18n.logical-properties` · auto · LOW · Layout uses logical CSS properties.

## Misfiles

- Error layout and scope belong in `patterns/empty-and-error.md`.
- Form validation timing belongs in `patterns/forms.md`.
- Terms of the design system itself belong in `UBIQUITOUS-LANGUAGE.md`.

## See also

- `patterns/empty-and-error.md`
- `patterns/forms.md`
- `foundations/typography.md`
- `foundations/iconography.md`
- `accessibility/wcag-map.md`
