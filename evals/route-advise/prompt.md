---
description: 'A realistic user phrasing should trigger /bauhaus:advise.'
expected_outcome: 'Plain answer first, three layers, no legacy four-layer wording.'
tags: [routing, plain-language, taxonomy, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

I have to convince my boss that our startup needs a design system. What is a design token, and why would a company our size care? Keep it short.
