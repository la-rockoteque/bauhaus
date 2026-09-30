# 10. Anatomy is a callout drawing, colour-coded by the golden angle

- Status: accepted
- Date: 2026-09-30

## Context

Pins placed by guessed x/y offsets drifted off their parts, and the number appeared twice: on the pin and in the legend.

## Decision

- The anatomy stage spans the page column, is taller than the component and centres it. Each part names a `target` selector; the stage measures the rendered part and places its marker exactly on it.
- A collapsible parts panel sits on the right. Open: a dot on each part and a dotted leader line to its row; rows are ordered so lines never cross. Closed: numbered pins on the parts, each with a Tooltip holding its label and note. Narrow screens use the pins.
- Each part has its own colour: part *n* = `oklch(L C, H0 + n × 137.508°)`. The golden angle never repeats a hue and keeps neighbours about 137° apart; fixed lightness and chroma keep the colours equally muted. Step, chroma and base hue are colour primitives; lightness is a per-theme role.
- Colour is never the only cue: numbers and labels stay.

## Consequences

- A test checks, for parts 1 to 12 in both themes, 3:1 for the number on its fill and for the fill against the page.
- Charts can reuse the series tokens.
