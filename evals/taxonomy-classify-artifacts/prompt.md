---
description: 'Classify eight artifacts and name the misfile ids.'
expected_outcome: 'Each artifact placed in the right layer, with misfile ids for the wrong ones.'
tags: [taxonomy, states, structure, read-only]
runs: 2
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Classify each of these design-system artifacts by layer, and flag any that are misfiled. Use the misfile ids if you have them.

1. A CSS custom property named `--ds-blue-light` used in button.css
2. `<Button variant="disabled">` (variant type is 'primary' | 'secondary' | 'disabled')
3. An `EmptyResults` screen block made of an illustration, a heading, a message and a Button
4. A folder `hooks/` at the root of the design-system package
5. A `Box` layout component used by many other components
6. The spacing scale (4, 8, 12, 16, 24, 32)
7. Dark mode
8. A filtering pattern's CSS that says `gap: 13px`
