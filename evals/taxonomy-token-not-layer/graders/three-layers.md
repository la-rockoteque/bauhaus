---
type: llm
---

The response passes when it lists exactly three layers (foundation, component, pattern) and says tokens are the stored form of foundation and component decisions, not a layer of their own.
Score 1.0 when both hold. Score 0.5 when it says tokens are not a layer but lists the wrong layer set, or lists the three layers but treats tokens as a "sub-layer" or "layer zero". Score 0 when it names tokens as a layer next to foundations, components and patterns.
