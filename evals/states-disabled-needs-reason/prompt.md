---
description: 'A disabled control with no reason is a finding.'
expected_outcome: 'Flags the silent disabled Submit and asks for a reason or a different pattern.'
tags: [states, ux, accessibility, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Review this form for state problems.

```tsx
<form>
  <input name="email" type="email" />
  <input name="password" type="password" />
  <button type="submit" disabled={!email || !password}>Create account</button>
</form>
```
