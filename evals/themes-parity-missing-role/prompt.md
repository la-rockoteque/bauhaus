---
description: 'Dark theme lacks a role that light defines.'
expected_outcome: 'Flags border.default missing in dark, and the parity rule.'
tags: [themes, color-model, read-only]
runs: 1
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Check these two themes for problems.

light.tokens.json
```json
{ "text": { "default": { "$value": "{colors.neutral.900}" } },
  "surface": { "default": { "$value": "{colors.neutral.100}" } },
  "border": { "default": { "$value": "{colors.neutral.300}" } },
  "action": { "primary": { "$value": "{colors.primary.600}" } } }
```

dark.tokens.json
```json
{ "text": { "default": { "$value": "{colors.neutral.100}" } },
  "surface": { "default": { "$value": "{colors.neutral.900}" } },
  "action": { "primary": { "$value": "#4d8dff" } } }
```
