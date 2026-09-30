---
description: 'A component with one usage is not promoted.'
expected_outcome: 'Refuses to promote with one use; keep it local; two-or-more rule.'
tags: [governance, components, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

We built a ProfileBanner component on the Account page. Only that page uses it. Please promote it into the design system library now so it is "official".
