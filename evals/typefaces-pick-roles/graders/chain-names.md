---
type: llm
---

The response defines the chain typefaces, fonts, text styles. It passes when the six roles are tokens named by role (`font.sans`, `font.serif`, `font.display`, `font.mono`, `font.handwriting`, `font.slab`) that alias named-family tokens (`typeface.inter` and the like), and no token outside `typeface.*` carries a family name (`font.inter`, `text.inter` are wrong). Text styles, if shown, alias the `font.<role>` tokens and never a `typeface.*` token.
Score 1.0 when all six roles are aliases named by role and family names appear only in `typeface.*`. Score 0.5 when the roles are named correctly but the response skips the typeface layer or has a text style that aliases a typeface. Score 0 when any font role token is named after a family.
