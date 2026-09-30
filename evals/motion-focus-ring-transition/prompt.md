---
description: 'A transition on the focus indicator is a HIGH finding.'
expected_outcome: 'Flags motion.focus-no-transition with WCAG 2.4.7.'
tags: [motion, accessibility, read-only]
runs: 1
max_turns: 6
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Review this focus style.

```css
.field:focus-visible {
  outline: 2px solid var(--ds-action-primary);
  outline-offset: 4px;
  transition: outline-offset 300ms ease, outline-color 300ms ease;
}
```
