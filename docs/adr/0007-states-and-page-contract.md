# 7. Every state is designed, and every page follows one contract

- Status: accepted
- Date: 2026-09-30

## Context

Design systems ship the happy path. Speelman (2015) names nine lifecycle states; Figma's button guide names the interaction states. Documentation drifts into generic advice with no basis.

## Decision

- Every component, pattern and screen has a state matrix: the nine lifecycle states (nothing, loading, none, one, some, too many, incorrect, correct, done) and the interaction states. Each cell is designed, n/a with a reason, or missing. Missing is a finding.
- Every page has six sections: introduction, anatomy, tokens, states, usage, pitfalls and don'ts. Anatomy comes second, right after the introduction. Every usage rule and pitfall names its basis; a line with none is slop and is cut.
- Advice comes in two registers: plain words first, then the precise terms.

## Consequences

- Rule ids `<component>.state.<state>` for matrix cells and `page.<section>` for pages.
- `knowledge/states/`, `knowledge/governance/page-contract.md`, `knowledge/taxonomy/plain-language.md`.
