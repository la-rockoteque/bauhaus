---
description: 'A from-scratch typography request must define all six roles through the typeface, font, text style chain.'
expected_outcome: 'Names sans, serif, display, mono, handwriting and slab. Typeface tokens are named by family, font roles by role, and every stack ends in a generic family. Families come from the catalog.'
tags: [tokens, foundations, read-only]
runs: 2
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

We are building a design system from scratch for a bookshop web app. Set up the typography tokens: pick the typefaces and write the token JSON. Use the Bauhaus catalog. Assume the recommended default for every role and write the answer in your reply.
