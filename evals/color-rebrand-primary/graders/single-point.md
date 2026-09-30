---
type: llm
---

The response passes when it says the change is made in one place: the primary scale in colors.tokens.json is re-pointed from the dark-blue hue to the teal hue (palette.teal.*), and components and themes need no edit because they read roles that alias the colors scale. It should also mention re-checking contrast of the affected role pairs.
Score 1.0 when the single edit point and no-component-edit are both stated. Score 0.5 when it names colors.tokens.json but also tells the user to edit theme files or components. Score 0 when it tells the user to edit palette values or many components.
