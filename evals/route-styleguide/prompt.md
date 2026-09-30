---
description: 'A realistic user phrasing should trigger /bauhaus:styleguide.'
expected_outcome: 'Talks about drift or prose rot between guide and code.'
tags: [routing, governance, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

The design system docs are out of date. Sync the styleguide with the code and tell me how you detect what drifted.
