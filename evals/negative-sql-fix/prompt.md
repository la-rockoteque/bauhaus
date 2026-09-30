---
description: 'A SQL fix must not fire any Bauhaus skill.'
expected_outcome: 'No Bauhaus skill fires and the answer is on topic.'
tags: [negative, routing, smoke, read-only]
runs: 1
max_turns: 6
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

This Postgres query is slow on a 5-million-row table. Fix it.

```sql
SELECT * FROM orders o JOIN customers c ON c.id = o.customer_id
WHERE lower(c.email) = 'a@b.c' ORDER BY o.created_at DESC;
```
