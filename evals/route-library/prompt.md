---
description: 'A realistic user phrasing should trigger /bauhaus:library.'
expected_outcome: 'Talks in slices and screaming architecture.'
tags: [routing, library, structure, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Where should the design system live in our repo? I want it isolated from the app, with a folder structure that tells you what is in it. Vertical slices, screaming architecture, that kind of thing.
