---
description: 'A realistic user phrasing should trigger /bauhaus:audit.'
expected_outcome: 'Findings by severity with WCAG basis: focus outline removed (2.4.7) and low contrast (1.4.3).'
tags: [routing, accessibility, governance, read-only]
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Can you audit and grade this component? Report findings by severity.

```tsx
export function SaveButton({ onSave }) {
  return (
    <button onClick={onSave} style={{ background: '#3b82f6', color: '#fff', fontSize: 13, padding: '5px 9px', border: 'none', outline: 'none' }}>
      Save
    </button>
  );
}
```
