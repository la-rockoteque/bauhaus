---
description: 'Extract tokens from the fixture and never promote a one-off value.'
expected_outcome: 'inventory and draft written, one-off #0a7d5c reported as an outlier and absent from the draft.'
tags: [extract, tokens, foundations, precision, needs-scaffold, needs-bash, needs-write]
runs: 1
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Bash, Write, Edit]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply.'
---

Extract design tokens from the React app in ./src. I accept the inferred scales as recommended and the draft token names as proposed. Do not wait for me. Do not touch any source file. Tell me which values you did not turn into tokens and why.
