---
description: 'A pattern must not introduce its own token or raw value.'
expected_outcome: 'Refuses a --filtering-gap token in the pattern; uses component or semantic tokens.'
tags: [patterns, tokens, taxonomy, read-only]
runs: 2
max_turns: 6
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

In our Filtering pattern I want to add a new token --ds-filtering-gap: 13px so the bar looks right. OK?
