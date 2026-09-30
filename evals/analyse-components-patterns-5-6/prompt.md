---
description: 'Phases 1 to 6: detect the Button/Btn/SubmitButton group and the FilterBar+Table+Pager pattern.'
expected_outcome: 'Component groups and pattern co-occurrence found, Modal and Dialog noted as near-duplicates.'
tags: [analyse, components, patterns, needs-scaffold, needs-bash, needs-write]
runs: 1
max_turns: 60
timeout_seconds: 1500
allowed_tools: [Read, Glob, Grep, Skill, Bash, Write, Edit]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply.'
---

Analyse the React app in ./src with Bauhaus, phases 1 to 6. I approve the scope: internal orders tool, staff on desktop and tablet. At every gate accept the recommended option. Stop after phase 6 (patterns). Do not wait for me. Do not edit any source file.
