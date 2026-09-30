---
description: 'A realistic user phrasing should trigger /bauhaus:storybook.'
expected_outcome: 'Plans the kit with the dev overlay and .mdx pages.'
tags: [routing, structure, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Set up Storybook for our design system. This is a React project. Tell me what you would install and wire up.
