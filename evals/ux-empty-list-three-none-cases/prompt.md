---
description: 'One "No data" message for three different empty cases.'
expected_outcome: 'Splits none into first use, filtered and cleared, each with its own message and action.'
tags: [ux, states, patterns, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Our orders list shows "No data" in every empty situation: a new user who never ordered, a search that matched nothing, and a user who just deleted their last order. Review that.
