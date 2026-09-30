---
description: 'Place components into families and primitives.'
expected_outcome: 'Btn in clickables, Modal in overlays, Box in primitives, GearIcon in foundations/iconography.'
tags: [library, structure, components, read-only]
runs: 1
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

In the design-system library, which folder should each of these live in? Btn (a button), Modal (a dialog box), Box (a layout wrapper), GearIcon (an icon).
