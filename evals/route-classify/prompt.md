---
description: 'A realistic user phrasing should trigger /bauhaus:classify.'
expected_outcome: 'Each artifact sorted into a layer.'
tags: [routing, taxonomy, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Which layer is each of these? Pager, the FilterBar + Table + Pager combination on our Orders screen, and the value space.4 = 16px.
