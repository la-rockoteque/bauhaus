---
description: 'A rebrand of primary edits colors.tokens.json only.'
expected_outcome: 'Answer: edit colors.tokens.json (primary aliases), leave components and themes alone.'
tags: [color-model, governance, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

We are rebranding. Primary changes from our dark blue to teal, which already exists in the palette. What exactly do we change in the design system?
