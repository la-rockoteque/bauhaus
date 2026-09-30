---
description: 'Run analysis phases 1 to 3 on a small React app with the gates pre-approved.'
expected_outcome: 'The three phase artifacts exist, spacing base and fit are reported, and no source file is touched.'
tags: [analyse, foundations, extract, needs-scaffold, needs-bash, needs-write]
runs: 1
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Bash, Write, Edit]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply.'
---

Analyse the React app in ./src with Bauhaus. I approve the scope: it is an internal orders tool used by staff on desktop and tablet. Run phases 1 to 3 only (scope, values, foundations). At every gate accept the recommended option and snap nothing yet. Do not wait for me and do not go past phase 3. Do not edit any source file.
