---
description: 'A realistic user phrasing should trigger /bauhaus:build.'
expected_outcome: 'A layer-by-layer order: foundations, tokens, components, patterns.'
tags: [routing, taxonomy, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

We are starting a brand-new product with no tokens, components or styleguide. Build a design system for us from scratch. Outline the order you would build it in.
