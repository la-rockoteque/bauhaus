---
description: 'Audit a sloppy page: basis-less lines and missing sections.'
expected_outcome: 'Reports page.basis findings and the missing sections.'
tags: [page-contract, governance, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

Audit this design-system page against our page contract. Report findings.

# Card

## Introduction
Cards group related content.

## Usage
- Use cards sparingly.
- Make sure the card looks good on all devices.
- Keep cards consistent across the product.
- Do not put a card inside a card (Nielsen 8, Aesthetic and minimalist design).

## States
Default and hover.
