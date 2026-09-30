---
description: 'Advise a PM: plain register first, precise register second, no jargon up front.'
expected_outcome: 'An everyday analogy in the opening lines, no undefined jargon in the first paragraph, precise terms later.'
tags: [plain-language, smoke, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

I'm a product manager, not a designer. In a few sentences: what is a design token and why does it matter to my team?
