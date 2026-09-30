---
description: 'The same contrast question, answered with the plugin contrast script.'
expected_outcome: 'Runs scripts/contrast.mjs and reports a ratio of about 4.48.'
tags: [accessibility, precision, needs-bash]
runs: 1
max_turns: 12
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill, Bash]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Use the Bauhaus contrast script (contrast.mjs in the plugin's scripts folder) to check #777777 on #ffffff, and tell me whether it passes AA for body text.
