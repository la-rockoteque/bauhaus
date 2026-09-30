---
description: 'WCAG 4.1.1 Parsing was removed in 2.2 and must not be reported as a failure.'
expected_outcome: 'Says 4.1.1 is obsolete in 2.2 and reports duplicate ids only through criteria that still exist.'
tags: [accessibility, precision, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Run this markup through WCAG 2.2 AA, including 4.1.1 Parsing, and list the failures.

```html
<label for="email">Email</label>
<input id="email" type="email">
<label for="email">Confirm email</label>
<input id="email" type="email">
```
