---
id: foundations/typefaces
title: Typefaces
shelf: foundations
layer: foundation
owner: ui-designer
tags: [typeface, font-family, pairing, variable-fonts, fontsource, font-loading, fallback-metrics, self-hosting]
sources:
  - WCAG 2.2 1.4.4 Resize Text (AA), 1.4.12 Text Spacing (AA) — https://www.w3.org/TR/WCAG22/
  - CSS Fonts Level 4 (font-display, unicode-range, font-optical-sizing, font-variant-numeric) — https://www.w3.org/TR/css-fonts-4/
  - MDN, font-display, size-adjust, ascent-override, unicode-range — https://developer.mozilla.org/en-US/docs/Web/CSS
  - web.dev, Best practices for fonts — https://web.dev/articles/font-best-practices
  - Chrome for Developers, Improved font fallbacks — https://developer.chrome.com/blog/font-fallbacks
  - Fontsource API and Google Fonts specimens, verified 2026-09-30 — https://api.fontsource.org/v1/fonts, https://fonts.google.com
  - SIL Open Font License 1.1 — https://openfontlicense.org
  - DTCG format (fontFamily, typography types) — https://www.designtokens.org/tr/drafts/format/
  - Wery and Diliberto 2017, Annals of Dyslexia 67; Rello and Baeza-Yates 2013, ASSETS '13; Zorzi et al. 2012, PNAS 109(28)
---

# Typefaces

> A typeface is a voice. This page says which voices a design system may use, and for what. A system uses six roles: a plain sans for the interface, a serif for long reading, a display face for big headlines, a mono face for code, a handwriting face for rare accents, and a slab for sturdy headings. Two families plus a mono face are enough for most products. Each role has a fixed token name, so you can change the family without touching a component. The 45 families in the catalog are free to use, free to host yourself, and ready as npm packages.

## The six roles

A new design system defines all six roles. A project may leave a role unused. An unused role costs nothing: it ships no font file.

| Role | Token | Job | A project uses it when |
|---|---|---|---|
| Sans-serif | `font.sans` | UI, body text, headings, forms | Always. It is the default voice. |
| Serif | `font.serif` | Editorial and long-form reading | The product has articles, docs prose, or a literary tone. |
| Display | `font.display` | Hero and page-title headlines at large sizes | The brand needs impact in a few big lines. |
| Monospace | `font.mono` | Code blocks, IDs, technical UI, dev docs | The product shows code, IDs or aligned values. |
| Handwriting | `font.handwriting` | Short accents: an annotation, a signature, a callout | The brand wants a human touch, in one or two spots. |
| Slab serif | `font.slab` | Sturdy headings and callouts between serif and display | The brand wants a solid, mechanical or editorial-heavy voice. |

Handwriting is for accents only. Never set body text, UI labels, buttons, inputs or errors in it.

## Rules

### How to choose a family

1. Pick a UI sans with a high or medium x-height. A large x-height keeps letters open at 12 to 16 px. (Legibility practice; x-height is an editorial judgement in the catalog, not a measurement.)
2. Check that similar shapes stay distinct in UI and mono faces: capital I, lowercase l and digit 1; digit 0 and capital O. (Character confusion causes errors in IDs, codes and passwords. Atkinson Hyperlegible Next was designed by the Braille Institute for this.)
3. Check apertures: the openings in c, e, a and s. Open apertures stay readable at small sizes; closed ones fill in. (Legibility practice.)
4. Require tabular figures for UI sans that show data, and for every mono face. Turn them on with `font-variant-numeric: tabular-nums`. (CSS Fonts 4. Tabular figures share one width, so columns align.) The catalog field `tabularFigures` records what the Fontsource latin file ships.
5. Prefer a variable font when you use three or more weights or a width or optical-size axis. (CSS Fonts 4 `font-weight` ranges; one file replaces several. Rule 18 of `typography.md`.)
6. Set `font-optical-sizing: auto` for families with an `opsz` axis. The browser then picks the right drawing for each size. (CSS Fonts 4.)
7. Check language coverage before you pick. French needs Latin Extended for accents and the oe ligature. Every family in the catalog ships `latin-ext`. Check other scripts in the `subsets` field. (Fontsource `subsets`, verified.)
8. Use only families under an open licence that allows self-hosting. The catalog holds SIL OFL 1.1 families, plus Roboto Slab under Apache 2.0. (OFL 1.1 permits use, embedding and redistribution with the font; the licence text travels with the files.)
9. Choose by role, not by fashion. A family joins a project for a job in the table above. (Keeps the system small.)
10. Do not use a dyslexia claim as a reason to pick a family. See Accessibility.

### Pairing rules

11. Pair for contrast in structure and harmony in proportion. Combine a sans with a serif, not two similar sans. Match x-height and width so sizes feel equal. (Typographic practice: similar-but-different pairs look like a mistake.)
12. Limit a project to two families plus a mono face. A third text family needs a written reason. (`typography.md` rule 1; payload and coherence.)
13. Prefer a superfamily when in doubt: Source Sans, Source Serif and Source Code; IBM Plex Sans and Plex Mono; Noto Sans and Noto Serif; Geist and Geist Mono. Its members share proportions and metrics by design.
14. Use display and handwriting faces as accents, not as a second or third body face. They count toward the family limit when they carry a heading level.
15. Give each role one job on a page. Do not set the same text level in two roles.

### Tokens

Typography mirrors the colour chain. Colour runs palette, colors, roles. Typography runs typefaces, fonts, text styles.

16. Define one token per named family in `typefaces.tokens.json`: `typeface.<family-id>`. Its value is a full stack: the web family, then a fallback stack of the same classification (serif for a serif face, whatever its role), then a generic family. The catalog gives each family its `fallback`. (A missing font must not break layout. `typography.md` rule 16.) Family names are correct here and nowhere else.
17. Define the six roles in `fonts.tokens.json` as aliases: `font.sans` is `{typeface.inter}`. Name roles after the job, never the family: `font.sans`, not `font.inter`. (A rebrand then changes one alias. `tokens/naming.md`.)
18. Define text styles in `typography.tokens.json` (`text.body`, `text.code`, `text.kicker`). Each style has a family that aliases `font.<role>`, plus size, weight and line height. Components read text styles only. A text style never aliases `typeface.*` directly.
19. End every stack in a generic family: `sans-serif`, `serif`, `monospace` or `cursive`. (CSS Fonts 4: the generic is the last resort when nothing else loads.)

```json
{
  "typeface": { "$type": "fontFamily",
    "inter": { "$value": ["Inter Variable", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"] },
    "jetbrains-mono": { "$value": ["JetBrains Mono Variable", "ui-monospace", "SF Mono", "Menlo", "Consolas", "DejaVu Sans Mono", "monospace"] }
  },
  "font": { "$type": "fontFamily",
    "sans": { "$value": "{typeface.inter}" },
    "mono": { "$value": "{typeface.jetbrains-mono}" }
  },
  "text": {
    "body": { "family": { "$type": "fontFamily", "$value": "{font.sans}" }, "size": { "$type": "dimension", "$value": "{font.size.md}" } },
    "code": { "family": { "$type": "fontFamily", "$value": "{font.mono}" }, "size": { "$type": "dimension", "$value": "{font.size.sm}" } }
  }
}
```

Each Fontsource variable package registers the family as `<Name> Variable`. Static packages register `<Name>`. Check the package CSS for the exact `font-family` name. A metric-matched `<Name> Fallback` face can sit after it in the stack. See the next section.

The same values as CSS:

```css
:root {
  --ds-typeface-inter: "Inter Variable", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --ds-font-sans: var(--ds-typeface-inter);
  --ds-text-body-family: var(--ds-font-sans);
}
```

### Loading performance

20. Ship WOFF2 only. All current browsers read it, and it is compressed. Fontsource packages ship WOFF2. (web.dev, Best practices for fonts.)
21. Use `font-display: swap` for body and UI faces, so text shows at once in the fallback. Use `optional` for non-critical faces (display, handwriting), so a slow font never swaps in late. (MDN `font-display`.)
22. Subset with `unicode-range`. Fontsource emits one `@font-face` per subset, so the browser downloads only the ranges the page uses. Ship `latin` and `latin-ext` for French. (MDN `unicode-range`.)
23. Preload only the critical face: the body face, latin subset, one weight or the variable file. Do not preload every file. (web.dev, Best practices for fonts.)
24. Use one variable file over many static files when you need three or more weights. Import only the axes you use.
25. Add fallback metrics to cut layout shift. Declare a local `@font-face` on a system font with `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override`, so the fallback takes the same space as the web font. Compute the values per family with a tool. Do not copy them from another family. (MDN `size-adjust`; Chrome for Developers, Improved font fallbacks.)
26. Self-host the files. Do not load from a third-party font CDN at runtime. (Privacy: a remote request sends the visitor's IP address to a third party. A German court, LG München I, 20 January 2022, case 3 O 17493/20, ruled that embedding Google Fonts from Google servers without consent breached the GDPR. Legal advice: ask your counsel.) Self-hosting also removes a third-party connection from the critical path.

### Accessibility

27. Text in every role must survive user spacing overrides: line height 1.5, paragraph spacing 2, letter spacing 0.12, word spacing 0.16 (as multiples of font size). Do not use fixed-height text boxes. (WCAG 1.4.12 Text Spacing, AA)
28. Size text in `rem` so it scales to 200% with no loss. (WCAG 1.4.4 Resize Text, AA)
29. Never set long text in display or handwriting faces. Limit them to a few words at large sizes. (Legibility practice; both have irregular rhythm and low letter distinction.)
30. Do not claim a face "helps dyslexia". The evidence is mixed. Wery and Diliberto (2017) found no reading gain from OpenDyslexic over Arial and Helvetica. Rello and Baeza-Yates (2013) found that sans-serif, monospaced and roman fonts read faster for a group of dyslexic readers (48 people). Zorzi et al. (2012) found that wider letter spacing helped. Treat spacing, size and plain forms as safe choices, and let users override fonts.
31. Do not set the body text in a handwriting face for any audience. (Rule 29.)

## Why

- Roles let a team change a family in one token. A family name in a token makes a rebrand a search-and-replace.
- A small set of families keeps the payload light and the interface coherent. `typography.md` caps a system at two text families plus mono.
- Metric-matched fallbacks turn font loading into a minor shift instead of a jump. Chrome's team documents `size-adjust` and the override descriptors for this.
- Self-hosting removes a privacy exposure and a third-party dependency. The 2022 Munich ruling is one court decision, not a universal rule.
- The dyslexia evidence is small and mixed. Design for everyone with spacing, size and contrast, which WCAG 1.4.12 and 1.4.4 already require.

## The catalog

The full data lives in `kit/typefaces/catalog.json`: 45 families, all open licence, all on Fontsource. Each entry holds id, package, axes, weights, subsets, `tabularFigures`, `xHeight`, `bestFor`, `avoidFor`, `pairsWith` with reasons, and source URLs. Data checked on 2026-09-30 against the Fontsource API and Google Fonts specimens. `tabularFigures` comes from inspecting the Fontsource latin WOFF2. `xHeight` is an editorial judgement.


### Sans-serif (16)

Default: `inter`. Token: `font.sans`.

| Name | Classification | Variable | Best for | Pairs with |
|---|---|---|---|---|
| Inter (`inter`) | neo-grotesque | yes | UI, dashboards, data tables, forms | `source-serif-4`, `jetbrains-mono`, `fraunces` |
| Roboto Flex (`roboto-flex`) | neo-grotesque (multi-axis) | yes | apps that need width or optical-size control, dense UI | `roboto-slab`, `jetbrains-mono` |
| IBM Plex Sans (`ibm-plex-sans`) | grotesque with humanist details | yes | enterprise and technical products, docs | `ibm-plex-mono`, `newsreader` |
| Source Sans 3 (`source-sans-3`) | humanist sans | yes | long UI text, documentation, forms | `source-serif-4`, `source-code-pro` |
| Noto Sans (`noto-sans`) | humanist sans | yes | multilingual products, wide script coverage, fallback for missing glyphs | `noto-serif`, `jetbrains-mono` |
| Open Sans (`open-sans`) | humanist sans | yes | general body and UI text, legacy-compatible layouts | `merriweather`, `source-code-pro` |
| Work Sans (`work-sans`) | grotesque | yes | headings and UI with a wide weight range | `lora`, `jetbrains-mono` |
| DM Sans (`dm-sans`) | geometric sans | yes | friendly product UI and marketing pages | `dm-serif-display`, `geist-mono` |
| Manrope (`manrope`) | modern geometric sans | yes | SaaS UI, headings, dashboards | `literata`, `jetbrains-mono` |
| Plus Jakarta Sans (`plus-jakarta-sans`) | geometric sans | yes | fintech and marketing UI, headings | `lora`, `geist-mono` |
| Figtree (`figtree`) | friendly geometric sans | yes | approachable apps, onboarding, marketing | `newsreader`, `jetbrains-mono` |
| Public Sans (`public-sans`) | neo-grotesque | yes | public-service, forms and accessible UI | `source-serif-4`, `ibm-plex-mono` |
| Nunito Sans (`nunito-sans`) | humanist sans | yes | friendly UI, wide width and optical-size control | `merriweather`, `source-code-pro` |
| Atkinson Hyperlegible Next (`atkinson-hyperlegible-next`) | legibility-focused grotesque | yes | forms, low-vision-friendly UI, places where similar letters must not be confused | `lora`, `jetbrains-mono` |
| Hanken Grotesk (`hanken-grotesk`) | neo-grotesque | yes | clean UI and marketing pages, wide weight range | `newsreader`, `ibm-plex-mono` |
| Geist (`geist`) | Swiss-style neo-grotesque | yes | developer tools, dashboards, docs | `geist-mono`, `source-serif-4` |

### Serif (9)

Default: `source-serif-4`. Token: `font.serif`.

| Name | Classification | Variable | Best for | Pairs with |
|---|---|---|---|---|
| Source Serif 4 (`source-serif-4`) | transitional serif with optical size | yes | long-form reading, documentation, articles | `inter`, `source-sans-3` |
| Literata (`literata`) | contemporary text serif (e-reading) | yes | books, long articles, reading apps | `manrope`, `geist` |
| Newsreader (`newsreader`) | transitional editorial serif with optical size | yes | news, magazines, essays; optical sizes suit both text and headlines | `hanken-grotesk`, `ibm-plex-sans` |
| Lora (`lora`) | contemporary calligraphic serif | yes | blogs, editorial body, quotes | `work-sans`, `plus-jakarta-sans` |
| Merriweather (`merriweather`) | sturdy screen serif | yes | on-screen reading at modest sizes, dense articles | `open-sans`, `nunito-sans` |
| EB Garamond (`eb-garamond`) | old-style serif (Garamond revival) | yes | literary and cultural long-form on large screens or print | `inter`, `public-sans` |
| Crimson Pro (`crimson-pro`) | old-style serif | yes | books, essays, refined body at 18 px and up | `source-sans-3`, `figtree` |
| Libre Baskerville (`libre-baskerville`) | transitional serif (Baskerville, web-tuned) | yes | body text at screen sizes, formal tone | `hanken-grotesk`, `work-sans` |
| Noto Serif (`noto-serif`) | neutral transitional serif | yes | multilingual reading, documentation | `noto-sans`, `atkinson-hyperlegible-next` |

### Display (9)

Default: `fraunces`. Token: `font.display`.

| Name | Classification | Variable | Best for | Pairs with |
|---|---|---|---|---|
| Fraunces (`fraunces`) | soft old-style display serif (SOFT and WONK axes) | yes | hero headlines with warmth and personality | `inter`, `hanken-grotesk` |
| Playfair Display (`playfair-display`) | high-contrast transitional (Didone-leaning) serif | yes | elegant headlines, magazine and luxury tones | `source-sans-3`, `work-sans` |
| Bricolage Grotesque (`bricolage-grotesque`) | quirky grotesque with optical size and width | yes | expressive headlines, brand-forward pages | `inter`, `newsreader` |
| Unbounded (`unbounded`) | wide geometric sans | yes | tech and web3-style hero titles, short headings | `inter`, `jetbrains-mono` |
| Big Shoulders (`big-shoulders`) | condensed grotesque with optical size | yes | sports, posters, tall narrow hero titles | `public-sans`, `roboto-slab` |
| Abril Fatface (`abril-fatface`) | fat-face Didone | no | single-word headlines, posters | `lora`, `open-sans` |
| DM Serif Display (`dm-serif-display`) | high-contrast transitional display serif | no | elegant headlines, editorial hero | `dm-sans`, `inter` |
| Anton (`anton`) | condensed heavy gothic | no | impact headlines, banners, short calls | `open-sans`, `source-sans-3` |
| Space Grotesk (`space-grotesk`) | quirky geometric grotesque | yes | tech-brand headlines, short subheads | `inter`, `ibm-plex-mono` |

### Monospace (4)

Default: `jetbrains-mono`. Token: `font.mono`.

| Name | Classification | Variable | Best for | Pairs with |
|---|---|---|---|---|
| JetBrains Mono (`jetbrains-mono`) | developer monospace | yes | code blocks, terminals, technical UI | `inter`, `source-serif-4` |
| IBM Plex Mono (`ibm-plex-mono`) | industrial monospace | no | code, IDs, data values; matches IBM Plex Sans | `ibm-plex-sans`, `newsreader` |
| Source Code Pro (`source-code-pro`) | humanist monospace | yes | code blocks and docs; matches Source Sans | `source-sans-3`, `source-serif-4` |
| Geist Mono (`geist-mono`) | neo-grotesque monospace | yes | code and technical UI; matches Geist | `geist`, `public-sans` |

### Handwriting (3)

Default: `caveat`. Token: `font.handwriting`.

| Name | Classification | Variable | Best for | Pairs with |
|---|---|---|---|---|
| Caveat (`caveat`) | casual brush handwriting | yes | short accents, annotations, signatures | `inter`, `fraunces` |
| Kalam (`kalam`) | casual marker handwriting | no | callouts, notes, quotes | `open-sans`, `source-serif-4` |
| Patrick Hand (`patrick-hand`) | neat printed handwriting | no | short labels on playful surfaces, sticky-note styles | `nunito-sans`, `lora` |

### Slab serif (4)

Default: `bitter`. Token: `font.slab`.

| Name | Classification | Variable | Best for | Pairs with |
|---|---|---|---|---|
| Bitter (`bitter`) | contemporary text slab serif | yes | on-screen body text with a sturdy voice, headings | `inter`, `source-sans-3` |
| Roboto Slab (`roboto-slab`) | geometric slab serif | yes | headings, callouts, technical content | `roboto-flex`, `open-sans` |
| Zilla Slab (`zilla-slab`) | humanist slab serif (Mozilla) | no | headings and short text with warmth | `work-sans`, `figtree` |
| Aleo (`aleo`) | humanist slab serif | yes | editorial headings and body with a soft slab voice | `hanken-grotesk`, `public-sans` |

Notes on the data:

- Roboto Slab is Apache 2.0. All other families are SIL OFL 1.1.
- Static-only families (Abril Fatface, DM Serif Display, Anton, Kalam, Patrick Hand, Zilla Slab, IBM Plex Mono) use `@fontsource/<id>`. All others use `@fontsource-variable/<id>`.
- Fontsource variable packages load the `wght` axis by default. Import other axes (`opsz`, `wdth`, `slnt`, `SOFT`, `WONK`) from the package's axis files when you need them.
- Fontsource `category` differs from the role in some entries, for example Space Grotesk (sans-serif in Fontsource, display here). The catalog stores both.

## Rulebook seeds

- `typography.typeface-at-call-site` · auto · HIGH · A primitive, component or pattern reads a text style, never `typeface.*` or `font.<role>` (`misfile.typeface-at-call-site`). (Rules 17 and 18.)
- `typography.fallback-generic` · auto · HIGH · Every font stack ends in a generic family: `sans-serif`, `serif`, `monospace` or `cursive`. (Rule 19; CSS Fonts 4.)
- `typography.handwriting-accent-only` · review · MEDIUM · `font.handwriting` appears only on short accent text, never on body, UI labels, inputs or errors. (Rules 29 and 31.)
- `typography.max-families` · review · MEDIUM · A project uses at most two text families plus one mono. A further role needs a written reason. (Rule 12; `typography.md` rule 1.)
- `typography.self-hosted` · review · MEDIUM · Font files come from the project's own origin or package, not a third-party font CDN. (Rule 26.)

## Misfiles

- A family name used as a token name (`font.inter`). Name the role: `font.sans`.
- A display face used for body text. Move it to `font.display` for large headlines and use sans or serif for text.
- The size scale, line height and weights. They belong to `typography.md`.
- Icon fonts and symbol sets. They belong to `iconography.md`.
- Logo lettering and wordmarks. They are brand assets, not font tokens.
- Copy, tone and capitalisation. They belong to `patterns/content-writing.md`.

## See also

- [Typography](./typography.md)
- [Token naming](../tokens/naming.md)
- [Iconography](./iconography.md)
- [WCAG map](../accessibility/wcag-map.md)
- [Content writing](../patterns/content-writing.md)
- `kit/typefaces/catalog.json`
