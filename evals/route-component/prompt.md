---
description: 'A realistic user phrasing should trigger /bauhaus:component.'
expected_outcome: 'Justification first, then four artifacts and a state matrix.'
tags: [routing, components, governance, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Add a new Tooltip component to our design system. What would that involve, step by step?
