---
description: 'Raw hex, px, z-index and media literals in a component.'
expected_outcome: 'Flags raw-value-in-component, magic-z-index and media-query-literal.'
tags: [tokens, precision, read-only]
runs: 1
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Review this component stylesheet against the design system rules.

```css
.notice { background: #fff4e5; color: #663c00; padding: 13px 20px; border-radius: 6px; z-index: 9999; }
@media (max-width: 767px) { .notice { padding: 8px; } }
```
