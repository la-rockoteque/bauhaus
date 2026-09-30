---
type: llm
---

The response passes when it reports the silent disabled submit button as a finding (the user cannot tell why the action is unavailable), gives a basis (a heuristic such as Nielsen 1 or 9, or a cited source) and proposes a next step such as keeping the button enabled and validating on submit, or showing the reason next to it (aria-describedby).
Score 1.0 when finding, basis and next step are all present. Score 0.5 when the finding and a next step are present without a basis. Score 0 when it does not flag the button.
