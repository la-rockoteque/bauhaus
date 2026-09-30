---
id: references/systems
title: Reference design systems
shelf: references
layer: cross-cutting
owner: ui-designer
tags: [material-3, carbon, fluent-2, polaris, atlassian, primer, spectrum, govuk]
sources:
  - Material Design 3 — https://m3.material.io
  - IBM Carbon Design System — https://carbondesignsystem.com
  - Microsoft Fluent 2 — https://fluent2.microsoft.design
  - Shopify Polaris — https://polaris.shopify.com
  - Atlassian Design System — https://atlassian.design
  - GitHub Primer — https://primer.style
  - Adobe Spectrum — https://spectrum.adobe.com
  - GOV.UK Design System — https://design-system.service.gov.uk
---

# Reference design systems

> Eight public systems that a team can study before it builds its own. Each is best at something. Borrow the idea, not the look. Check the current site before you cite a detail, because these systems change.

## Rules

1. Study at least two systems before you design a new component or pattern. (Basis: `governance/contribution.md`, research before build.)
2. Borrow the reasoning: anatomy, states, keyboard contract, wording. Do not copy the visual style. (Basis: `bauhaus/principles.md`, form follows function.)
3. Cite the system and the page when a rule comes from it: "Carbon, Filtering pattern". (Basis: `UBIQUITOUS-LANGUAGE.md` § Basis.)
4. Read the current page, not memory. Systems rename and reorganise. (Basis: never invent a citation.)
5. Check any borrowed accessibility claim against WCAG and the APG. A system can be wrong. (Basis: `accessibility/wcag-map.md`.)
6. Note the licence of any asset or code you reuse. (Basis: legal hygiene.)

## The systems

| System | Owner | URL | Strength | What to borrow |
|---|---|---|---|---|
| Material 3 | Google | https://m3.material.io | Complete, well-specified components with anatomy, states and motion. Strong theming from a source colour. | Anatomy diagrams, state layers, three-tier token model (reference, system, component), motion guidance, adaptive layout. |
| Carbon | IBM | https://carbondesignsystem.com | Dense enterprise UI, data-heavy work, published patterns and per-component accessibility notes. | Data table, filtering, empty state and loading patterns, data visualisation guidance, accessibility sections. |
| Fluent 2 | Microsoft | https://fluent2.microsoft.design | Cross-platform: web, Windows, iOS, Android, macOS. | Global and alias token approach, platform mapping, density and focus guidance. |
| Polaris | Shopify | https://polaris.shopify.com | Content and UX writing for merchants, patterns for common tasks. | Content guidelines, voice and tone, error and empty-state copy, task patterns. |
| Atlassian Design System | Atlassian | https://atlassian.design | Token naming by role, elevation and spacing tokens, content guidelines, accessibility. | Semantic token names (for example `color.text.subtle`, their own grammar), elevation model, writing guidance. |
| Primer | GitHub | https://primer.style | Accessibility depth, information-dense developer UI, design tokens (`@primer/primitives`). | ARIA and keyboard guidance, accessibility audits per component, token structure. |
| Spectrum | Adobe | https://spectrum.adobe.com | Rigour on accessibility and internationalisation. Home of React Aria and React Spectrum. | Behaviour specs, i18n handling, headless behaviour layer (React Aria), interaction states. |
| GOV.UK Design System | UK Government Digital Service | https://design-system.service.gov.uk | Research-backed patterns, tested with assistive technology, plain language, progressive enhancement. | Error summary, question pages, form patterns, content style, "start with a native element". |

## Choosing what to read

| Need | Read first |
|---|---|
| A new form field or a validation flow | GOV.UK, then Carbon |
| A data-dense table or dashboard | Carbon, then Primer |
| Tokens and theming structure | Material 3, Atlassian, Fluent 2 |
| Keyboard behaviour and ARIA | Spectrum (React Aria), Primer, then the APG |
| UX writing and error copy | Polaris, GOV.UK, Atlassian |
| Cross-platform mapping | Fluent 2, Material 3 |
| Anatomy and state diagrams | Material 3, Carbon |

## Limits of each source

- Material 3 and Fluent 2 tie some guidance to their own platforms. Test it on yours.
- Carbon and Primer assume dense, expert users. Check fit for casual audiences.
- Polaris and GOV.UK copy fits their own audiences and domains. Adapt the voice, keep the method.
- Spectrum and Primer publish behaviour that may go beyond the APG. Confirm against the APG.

## Why

A mature system carries years of user research and review. Reading it costs an hour. Rebuilding its findings costs months. Studying more than one shows where systems agree, and agreement marks a settled rule.

## Rulebook seeds

- `ref.two-systems-checked` · review · LOW · A new component cites at least two reference systems.
- `ref.cites-page` · review · LOW · A borrowed rule names the system and page.
- `ref.a11y-cross-checked` · review · MEDIUM · A borrowed accessibility claim is checked against WCAG or the APG.

## Misfiles

- Principles and history of the Bauhaus school belong in `bauhaus/principles.md`.
- Your own system's rules belong in `governance/rulebook.md`.
- Test tools belong in `tooling/`.

## See also

- `bauhaus/principles.md`
- `governance/contribution.md`
- `accessibility/apg-patterns.md`
- `components/catalog.md`
- `tokens/architecture.md`
