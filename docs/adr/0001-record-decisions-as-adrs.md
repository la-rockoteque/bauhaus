# 1. Record design-system decisions as ADRs

- Status: accepted
- Date: 2026-09-30

## Context

Bauhaus makes decisions that shape every agent, skill, knowledge file and kit slice. Some came from research, some from the user's preference. A rule without its reason gets reverted by the next reader.

## Decision

Every structural decision gets an Architecture Decision Record in `docs/adr/`, numbered, one decision per file: context, decision, options not chosen, consequences. The contract docs (`docs/architecture.md`, `docs/library.md`, `docs/component-contract.md`) state the rules; the ADR states why. A changed decision gets a new ADR that supersedes the old one. The old one stays, marked superseded.

## Consequences

- Agents read the ADR before they change a rule it covers.
- The index is `docs/adr/README.md`.
