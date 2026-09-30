---
type: llm
---

The response passes when it recommends one library package inside the app's repository (a workspace package), and presents at least two alternatives (for example a plain folder in the app, several packages, or a separate repository with a registry, or web components) with the cost or trigger for choosing each.
Score 1.0 when the recommendation and at least two alternatives with costs are present. Score 0.5 when it gives the recommendation with fewer than two alternatives, or alternatives without costs. Score 0 when it recommends a separate repository or a multi-package monorepo for this team without justification.
