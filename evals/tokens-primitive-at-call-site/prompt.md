---
description: 'Call sites use semantic tokens, not primitives.'
expected_outcome: 'Flags misfile.primitive-token-at-call-site and names the semantic alternative.'
tags: [tokens, color-model, read-only]
runs: 1
max_turns: 6
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Our Card CSS uses `padding: var(--ds-space-3)` and `color: var(--ds-color-gray-700)`. Is that the right way to use tokens? Answer briefly.
