---
description: 'A component reading a palette token must be flagged.'
expected_outcome: 'Flags misfile.palette-at-call-site and points to a role.'
tags: [color-model, tokens, smoke, read-only]
runs: 1
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Review this component CSS against our design system rules.

```css
.ds-alert--error {
  color: var(--ds-palette-scarlet-600);
  border: 1px solid var(--ds-palette-scarlet-300);
  padding: var(--ds-space-inset-md);
}
```
