---
type: llm
---

The response passes when it says all of these:
- the palette holds named hues with grades (for example scarlet 100 to 900) and is never used by a component;
- "colors" holds the role scales (primary, secondary, error...) that alias palette hues, and a rebrand edits it;
- roles are flat semantic names by purpose (text.default, action.primary), defined once per theme, and components use only roles;
- light and dark are sibling themes that define the same role names, and palette and colors never change per theme.
Score 1.0 when all four hold. Score 0.5 when three hold, or when it uses "palette" for the role scales. Score 0 otherwise.
