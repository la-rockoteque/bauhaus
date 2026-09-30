---
description: 'Detect components in the fixture app and propose a library slice for each.'
expected_outcome: 'Runs the analyser components step and structure place, proposes kebab-case slice paths in families.'
tags: [library, structure, components, needs-scaffold, needs-bash, needs-write]
runs: 1
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Bash, Write, Edit]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply.'
---

Detect the components in the React app in ./src with the Bauhaus analyser, then use the Bauhaus placement tool to propose a target slice in a new design-system library for every component. Accept merges as recommended. Do not wait for me. Do not edit any source file.
