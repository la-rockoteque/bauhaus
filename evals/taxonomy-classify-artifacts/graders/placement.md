---
type: llm
---

The response passes when it places the artifacts as follows:
- `--ds-blue-light`: a token, misfiled because its name describes appearance not intent;
- `variant="disabled"`: a state filed as a variant;
- EmptyResults: a pattern;
- `hooks/`: a folder named for a kind of file;
- Box: a component (a primitive, which is a kind of component, not a layer);
- the spacing scale: a foundation;
- dark mode: a theme, a sibling of light with the same role names, not a foundation;
- the 13px gap: a pattern with its own raw value.
Score 1.0 when at least seven of eight are placed as above. Score 0.5 when five or six are. Score 0 otherwise. Penalise to 0.5 at most if it calls "primitive" or "token" a layer.
