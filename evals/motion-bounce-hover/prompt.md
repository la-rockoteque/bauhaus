---
description: 'A slow bouncing hover transition with no reduced-motion handling.'
expected_outcome: 'Findings cite the duration ceiling, the overshoot curve and prefers-reduced-motion (reduce, not delete).'
tags: [motion, accessibility, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Review the motion in this CSS.

```css
.btn { transition: transform 600ms cubic-bezier(0.68, -0.55, 0.27, 1.55); }
.btn:hover { transform: scale(1.15) translateY(-4px); }
```
