---
type: llm
---

The response passes when it: flags the 600ms duration against a ceiling (about 400ms at most, far less for a hover); flags the overshoot curve and the target moving under the pointer; asks for a prefers-reduced-motion rule; and says to reduce the motion (keep a transient such as a colour change, remove the displacement) rather than delete the animation.
Score 1.0 when all four hold. Score 0.5 when three hold. Score 0 otherwise.
