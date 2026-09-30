---
description: 'Renaming a public token is breaking: alias, deprecation with a removal date, codemod.'
expected_outcome: 'Classifies as breaking, keeps an alias, deprecates with a date, mentions a codemod and a major release.'
tags: [governance, tokens, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

We shipped v2.3 of the design system. I want to rename --ds-color-text-muted to --ds-color-text-subtle in v2.4 and delete the old name. 40 call sites in 6 products use it. Is that OK?
