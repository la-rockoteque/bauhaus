---
description: 'Fixed-width table and hover-only row actions.'
expected_outcome: 'Flags resp.reflow (1.4.10 AA) and the touch/hover problem.'
tags: [responsive, accessibility, read-only]
runs: 1
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Does this table still work on a phone? Review the CSS.

```css
.orders-table { width: 900px; }
.row-actions { opacity: 0; }
tr:hover .row-actions { opacity: 1; }
.row-actions button { width: 28px; height: 28px; }
```
