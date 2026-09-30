---
type: llm
---

The response ties each finding to the right cause and fix. Caveat sets body text, so move the body to a sans or serif text style and keep handwriting for a short accent. `font-family: Inter` has no fallback and, in a component, names a family, so the fix is a text style (`text.body.family`) whose stack ends in a generic family such as `sans-serif`.
Score 1.0 when both fixes are given and the second points to a text style or a stack ending in a generic family. Score 0.5 when only one fix is given. Score 0 when it approves either declaration.
