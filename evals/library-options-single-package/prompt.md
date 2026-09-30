---
description: 'Recommend the default single workspace package for one React app and present the alternatives.'
expected_outcome: 'Recommends one package in the app repository and lists the alternatives with cost.'
tags: [library, structure, governance, read-only]
runs: 2
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

We are one team of six with a single React app in one repository. Where should the design system live? Give me your recommendation and the other options, with what each one costs.
