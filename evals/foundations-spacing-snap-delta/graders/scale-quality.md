---
type: llm
---

The response passes when it proposes a 4px-based scale built from the well-used values (4, 8, 12, 16, 24, 32), reports the fit as about 98 percent, snaps 5px to 4px and 13px to 12px (or 16px) and 15px to 16px with the pixel delta stated, and does not promote any single-use value to a scale step.
Score 1.0 when all of these hold. Score 0.5 when the scale is right but deltas or the fit are missing. Score 0 when 5px, 13px or 15px become scale steps.
