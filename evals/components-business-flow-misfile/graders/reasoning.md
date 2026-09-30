---
type: llm
---

The response passes when it says the component is not a design-system component because it encodes a business flow and app concerns (cart, API), and recommends keeping a generic Button in the library while the app composes the payment logic.
Score 1.0 when both hold. Score 0.5 when it refuses but gives no alternative. Score 0 when it approves adding CheckoutPayButton to the library.
