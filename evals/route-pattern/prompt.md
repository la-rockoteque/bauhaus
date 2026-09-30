---
description: 'A realistic user phrasing should trigger /bauhaus:pattern.'
expected_outcome: 'A pattern that composes components and has no tokens or styles of its own.'
tags: [routing, patterns, taxonomy, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Design a filter bar pattern for our data tables. Which components does it compose, and what does the pattern itself own?
