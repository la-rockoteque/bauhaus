---
description: 'A full state matrix for a Button.'
expected_outcome: 'All nine lifecycle states, n/a with reasons, the four that ship missing checked.'
tags: [states, read-only]
runs: 2
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Give me the full state matrix for our Button. Props: variant (primary, secondary), disabled, loading. It has hover and focus styles in the CSS but nothing else is documented. Print the matrix in your reply.
