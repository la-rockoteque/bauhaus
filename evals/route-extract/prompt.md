---
description: 'A realistic user phrasing should trigger /bauhaus:extract.'
expected_outcome: 'Reads the CSS as an inventory and treats one-off values as outliers, not tokens.'
tags: [routing, extract, tokens, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

We have lots of CSS and no tokens. Inventory our colours and spacing and tell me which values should become tokens.

```css
.a { padding: 8px 16px; background: #1a4fd6; }
.b { padding: 8px; color: #1a4fd6; margin: 16px; }
.c { padding: 16px; margin: 8px; background: #1a4fd6; }
.d { background: #0a7d5c; padding: 5px; }
```
