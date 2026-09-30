---
type: llm
---

Judge only the Usage and Pitfalls and don'ts sections of the page.
The response passes when every rule in Usage and every item in Pitfalls names its basis (a WCAG criterion with its level, an APG pattern, a named heuristic, a published system or a research result) and no line is generic (true of any design system unchanged, for example "keep buttons consistent" or "use sparingly").
Score 1.0 when at most one line lacks a basis and none is generic slop. Score 0.5 when two to four lines lack a basis or are generic. Score 0 when five or more do, or when Usage or Pitfalls is missing.
