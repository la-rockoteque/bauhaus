---
description: 'Palette vs colors vs roles, and roles per sibling theme.'
expected_outcome: 'Explains palette.tokens.json, colors.tokens.json and per-theme roles, and who may use each.'
tags: [color-model, themes, foundations, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Explain how colour is organised in our design system: what is the palette, what is "colors", and what are roles? Who is allowed to use which, and where do light and dark fit in?
