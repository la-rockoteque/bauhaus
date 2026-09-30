---
description: 'Grey #777 on white is about 4.48:1 and fails AA for normal text.'
expected_outcome: 'States a ratio of about 4.4 to 4.5, says it fails 1.4.3 for normal text.'
tags: [accessibility, precision, read-only]
runs: 1
max_turns: 6
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Does #777777 text on a #ffffff background pass WCAG AA for 16px body text? Give the ratio and the criterion. Work it out yourself.
