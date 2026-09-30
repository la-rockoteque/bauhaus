---
description: 'Infer a spacing scale from counts and state the delta of every snap.'
expected_outcome: 'Base 4, fit about 98 percent, the outliers snapped with a stated delta, one-offs not promoted.'
tags: [foundations, tokens, precision, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Here are the spacing values in our CSS with their use counts: 4px x40, 8px x120, 12px x35, 16px x90, 24px x30, 32px x12, 5px x3, 13px x2, 15px x1. Propose our spacing scale, say how well the code fits it, and say what to do with the odd values.
