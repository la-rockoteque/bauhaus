---
description: 'A correct artifact list must produce no misfile findings.'
expected_outcome: 'No misfile ids are reported and the response says the structure is sound.'
tags: [taxonomy, precision, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Check this design-system tree for misfiled artifacts. Report only real problems.

- foundations/spacing/spacing.tokens.json, spacing.mdx, spacing.stories.tsx
- themes/light/light.tokens.json and themes/dark/dark.tokens.json, both defining the same roles (text.default, surface.default, border.default, action.primary)
- primitives/box/box.tsx (uses only var(--ds-space-inset-md))
- components/clickables/button/button.tsx, button.css, button.stories.tsx, button.mdx. Variants: primary, secondary, ghost. Disabled comes from the native disabled attribute.
- patterns/filtering/filtering.tsx: composes TextField, Select and Button, sets no styles or tokens of its own.
