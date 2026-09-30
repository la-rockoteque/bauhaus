---
description: 'Run the structure check on a library with several planted violations.'
expected_outcome: 'Finds the by-kind folders, the far story, the app import and the import direction breaks.'
tags: [structure, library, taxonomy, needs-scaffold, needs-bash]
runs: 1
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Bash]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply.'
---

Check the design-system package in ./packages/design-system against the Bauhaus library contract. Run the structure check and report every finding with its id. Do not fix anything.
