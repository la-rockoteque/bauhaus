# 2. Three layers; tokens are storage, not a layer

- Status: accepted
- Date: 2026-09-30
- Evidence: `docs/research/tokens-vs-foundations.md`

## Context

The first model had four layers: foundation, token, component, pattern. The user said colour and typography are foundations. Research across Material 3, Carbon, Atlassian, Primer, Salesforce Lightning and the DTCG format 2025.10 shows tokens carry foundation and component decisions: Atlassian, "Design tokens are the new way to apply visual foundations"; Material 3 files design tokens under Foundations.

## Decision

The layers are **foundation · component · pattern**. A token is the stored form of one decision, in DTCG JSON. Token tiers (primitive, semantic, component) live inside the format. "Primitive" is not a layer: it names the primitive-token tier and the `primitives/` folder of base building-block components (ADR 5).

## Options not chosen

- Four peer layers with token as one: contradicts every system studied.

## Consequences

- Classification reports list three layers, with the token tier as an attribute.
- Misfiles `misfile.token-as-layer` and `misfile.primitive-as-layer`.
