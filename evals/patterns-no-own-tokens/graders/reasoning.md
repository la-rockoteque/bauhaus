---
type: llm
---

The response passes when it says a pattern has no tokens, styles or raw values of its own (13px is also off the spacing scale), and tells the user to use the existing spacing tokens or change the components or the foundation.
Score 1.0 when both parts hold. Score 0.5 when it refuses the token but does not say what to use. Score 0 when it approves the new token.
