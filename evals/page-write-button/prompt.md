---
description: 'Write a Button page that follows the six-section contract with a basis on every rule.'
expected_outcome: 'Six sections in order and no basis-less lines.'
tags: [page-contract, components, read-only]
runs: 2
max_turns: 12
timeout_seconds: 420
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Write the design-system documentation page for our Button component. Print the whole page in your reply as Markdown. Do not write files.
