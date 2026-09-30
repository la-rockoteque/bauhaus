---
description: 'Report status from existing artifacts: phases 1 to 3 done, phase 4 next.'
expected_outcome: 'Runs the status command, reports phases 1 to 3 done and phase 4 as next, changes nothing.'
tags: [analyse, needs-scaffold, needs-bash]
runs: 1
max_turns: 15
timeout_seconds: 400
allowed_tools: [Read, Glob, Grep, Skill, Bash, Write, Edit]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply.'
---

We already started the Bauhaus analysis of this repo. Where are we, and what is the next phase? Only report status. Do not run any phase and do not edit anything.
