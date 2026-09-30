---
description: 'A component that encodes one business flow does not belong in the library.'
expected_outcome: 'Flags misfile.component-encodes-business-flow and proposes a generic component plus a call-site composition.'
tags: [components, taxonomy, read-only]
runs: 2
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
append_system_prompt: 'This is a non-interactive evaluation run. Nobody can answer questions. When a decision is needed, state your assumption in one line and continue. Put every document you are asked to write in your final reply, unless the prompt asks for a file.'
---

We want to add a `CheckoutPayButton` to the design system. It reads the cart, calls the payments API and shows "Pay $X". Should it be a design-system component?
