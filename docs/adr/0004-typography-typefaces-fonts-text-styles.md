# 4. Typography is typefaces, fonts and text styles, with six roles

- Status: accepted
- Date: 2026-09-30

## Context

The user asked for the palette concept in typography, and for six typeface roles in every new system: sans, serif, display, mono, handwriting, slab.

## Decision

- `typefaces.tokens.json`: the named families the project owns, with full stacks (`typeface.inter`). Each stack falls back to fonts of its own classification and ends in a CSS generic family.
- `fonts.tokens.json`: the six roles (`font.sans` … `font.slab`), each aliasing one typeface. Swapping a family is one edit here.
- `typography.tokens.json`: text styles by purpose (`text.body`, `text.heading`, `text.code`…) aliasing a font role plus the size, weight and line-height scales. Components read text styles only.
- A new system gets all six roles. `kit/typefaces/catalog.json` holds 45 verified open-licence families (16 sans, 9 serif, 9 display, 4 mono, 3 handwriting, 4 slab). Fonts are self-hosted through Fontsource.

## Consequences

- `typography.fallback-generic` errors on a stack without a generic family. `misfile.typeface-at-call-site` flags a component reading a typeface or font role.
- Family names appear only in `typeface.*` tokens.
