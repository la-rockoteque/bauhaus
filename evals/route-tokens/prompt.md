---
description: 'A realistic user phrasing should trigger /bauhaus:tokens.'
expected_outcome: 'A rename goes through an alias and a deprecation.'
tags: [routing, tokens, governance, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Rename the token color.blue.600 to color.brand.600 in our design tokens. How should that be handled?
