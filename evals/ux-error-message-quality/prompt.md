---
description: 'A vague error toast with a colour-only field error.'
expected_outcome: 'Cites 3.3.1 and 3.3.3, asks to name the field and suggest the fix.'
tags: [ux, accessibility, states, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Review this signup error handling. On submit with a bad email, we show a red toast "Invalid input", turn the email border red, and clear the field.
