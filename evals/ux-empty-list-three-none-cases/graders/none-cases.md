---
type: llm
---

The response passes when it says "No data" is one message for three different cases and asks for one message per case with a next action: first use (invite the first action), filtered or searched (say nothing matched and offer to clear filters), and cleared or done (confirm and offer the next step). It names a basis such as Nielsen 1 or 3, or WCAG 4.1.3 for announcing the change.
Score 1.0 when all three cases are separated, each with a message or action, and a basis is named. Score 0.5 when it separates only two cases or names no basis. Score 0 otherwise.
