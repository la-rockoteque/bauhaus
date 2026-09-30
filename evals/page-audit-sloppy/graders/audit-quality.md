---
type: llm
---

The response passes when it:
- flags at least three of the first three Usage lines ("use sparingly", "looks good on all devices", "keep consistent") as having no basis or being generic;
- does not flag the fourth Usage line (it names Nielsen 8);
- lists the missing sections: Tokens, Anatomy and Pitfalls and don'ts;
- notes the States section holds only two states rather than a matrix.
Score 1.0 when all four hold. Score 0.5 when three hold. Score 0 otherwise.
