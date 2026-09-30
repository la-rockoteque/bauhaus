---
description: 'A plain JS bug fix must not fire any Bauhaus skill.'
expected_outcome: 'No Bauhaus skill fires and the answer is on topic.'
tags: [negative, routing, read-only]
runs: 1
max_turns: 6
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

This function should return the last page number but is off by one when total is an exact multiple of size. Fix it.

```js
function lastPage(total, size) { return Math.floor(total / size) + 1; }
```
