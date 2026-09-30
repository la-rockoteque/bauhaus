---
description: 'Disabled is a state, not a variant.'
expected_outcome: 'Refuses a disabled variant and explains state versus variant.'
tags: [states, taxonomy, read-only]
runs: 1
max_turns: 6
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Our Button has variants primary and secondary. A teammate wants to add a "disabled" variant. Good idea? Answer briefly.
