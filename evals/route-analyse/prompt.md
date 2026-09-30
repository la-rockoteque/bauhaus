---
description: 'A realistic user phrasing should trigger /bauhaus:analyse.'
expected_outcome: 'The analyse workflow is announced as nine phases, starting with scope.'
tags: [routing, analyse, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

We have no design system and our frontend CSS is a mess. Please analyse our repo and take us to a real design system. I have not opened the repo yet in this session, so tell me how you would run it.
