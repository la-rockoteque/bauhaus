---
description: 'A realistic user phrasing should trigger /bauhaus:bauhaus.'
expected_outcome: 'The router skill fires and names the concrete Bauhaus skills to start with.'
tags: [routing, smoke, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

I keep hearing we need a "design system" for our product but I have no idea where to start. What can you help me with here?
