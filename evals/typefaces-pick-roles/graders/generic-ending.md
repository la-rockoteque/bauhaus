---
type: llm
---

Every font stack in the response ends in a CSS generic family (serif, sans-serif, monospace, cursive, fantasy, system-ui, ui-serif, ui-sans-serif, ui-monospace, ui-rounded, math, emoji or fangsong). Sans, display and slab-fallback stacks end in `sans-serif` or `serif`, mono ends in `monospace`, handwriting ends in `cursive`.
Score 1.0 when every stack shown ends in a generic family. Score 0.5 when one stack does not. Score 0 when several do not, or no stack is shown.
