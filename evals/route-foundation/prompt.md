---
description: 'A realistic user phrasing should trigger /bauhaus:foundation.'
expected_outcome: 'A motion scale proposal with duration, easing and reduced motion.'
tags: [routing, foundations, motion, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

We need a motion scale for our product. Propose one.
