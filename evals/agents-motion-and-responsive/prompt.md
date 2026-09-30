---
description: 'A change that needs the motion and the responsive specialists.'
expected_outcome: 'Dispatches motion-designer and responsive-reviewer.'
tags: [agents, motion, responsive, read-only]
runs: 1
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent, TodoWrite]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Review this CSS change with your specialists. I want the motion review and the "does it work on a phone" review, each from the right specialist.

```css
.drawer { width: 480px; transform: translateX(-100%); transition: transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1); }
.drawer.open { transform: translateX(0); }
.drawer .close { width: 20px; height: 20px; }
```
