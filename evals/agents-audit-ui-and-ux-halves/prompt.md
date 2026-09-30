---
description: 'An audit that needs both the visual and the interaction specialist.'
expected_outcome: 'Dispatches ui-designer and ux-designer and merges their halves.'
tags: [agents, components, ux, read-only]
runs: 1
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent, TodoWrite]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Audit this component with your design specialists. I want the visual half (tokens, contrast, spacing) and the interaction half (states, keyboard, ARIA) both covered, merged into one report.

```tsx
export function Tag({ label, onRemove }) {
  return (
    <span style={{ background: '#ffe08a', color: '#b58900', padding: '3px 7px', fontSize: 11 }}>
      {label}
      <span onClick={onRemove} style={{ marginLeft: 4, cursor: 'pointer' }}>x</span>
    </span>
  );
}
```
