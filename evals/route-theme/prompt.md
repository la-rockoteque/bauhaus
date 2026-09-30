---
description: 'A realistic user phrasing should trigger /bauhaus:theme.'
expected_outcome: 'Dark mode as a sibling theme with the same roles and a contrast check.'
tags: [routing, themes, color-model, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Add dark mode to our design system. Describe how you would do it.
