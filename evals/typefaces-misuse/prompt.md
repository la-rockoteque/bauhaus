---
description: 'Handwriting on body text and a stack with no generic fallback must be flagged with their rule ids.'
expected_outcome: 'Cites typography.handwriting-accent-only for the Caveat body text and typography.fallback-generic for the bare Inter stack.'
tags: [tokens, foundations, precision, read-only]
runs: 1
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Review this stylesheet against our design system rules. List each finding with its rule id.

```css
.ds-article__body {
  font-family: 'Caveat Variable', cursive;
  font-size: 1rem;
  line-height: 1.5;
}

.ds-nav {
  font-family: Inter;
}
```
