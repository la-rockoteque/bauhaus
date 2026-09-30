---
description: 'Tokens are storage, not a layer. The layers are foundation, component, pattern.'
expected_outcome: 'Says tokens are not a layer, names the three layers, and does not use four-layer wording.'
tags: [taxonomy, smoke, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Quick question for our design system docs: is our token set a layer, like components are? I want to list our layers on the wiki page.
