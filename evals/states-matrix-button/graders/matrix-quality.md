---
type: llm
---

The response passes when it shows a state matrix that:
1. names all nine lifecycle states (nothing, loading, none, one, some, too many, incorrect, correct, done);
2. marks each cell as designed, n/a with a stated reason, or missing (a bare "n/a" with no reason does not count);
3. also covers interaction states (default, hover, focus-visible, active, disabled, loading);
4. checks the four states that usually ship missing (none, incorrect, too many, disabled with a reason) and says which are n/a for a Button and why.
Score 1.0 when all four hold. Score 0.5 when three hold. Score 0 otherwise.
