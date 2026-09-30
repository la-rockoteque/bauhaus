---
description: 'A realistic user phrasing should trigger /bauhaus:init.'
expected_outcome: 'Names bauhaus.config.json as the file it sets up.'
tags: [routing, structure, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Set up Bauhaus for this project. Create the design system config and bootstrap the tokens folder. I am not answering questions now, pick sensible defaults and tell me what you would write.
