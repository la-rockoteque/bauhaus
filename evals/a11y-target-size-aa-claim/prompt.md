---
description: 'The user wrongly says 44px is the AA target size.'
expected_outcome: 'Corrects: 2.5.8 (AA) is 24x24 CSS px, 2.5.5 (AAA) is 44x44. 32x32 passes AA.'
tags: [accessibility, precision, smoke, read-only]
runs: 2
max_turns: 6
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Our team rule is "touch targets must be 44x44 because WCAG AA requires it". Our icon buttons are 32x32. Are they failing WCAG AA? Answer with the criterion numbers.
