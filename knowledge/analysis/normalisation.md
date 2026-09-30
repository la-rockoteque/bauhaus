---
id: analysis/normalisation
title: Normalisation — from findings to a plan
shelf: analysis
layer: cross-cutting
owner: design-system-architect
tags: [analysis, normalisation, plan, batches, deprecation, codemod, ratchet, rollback, plain-language]
sources:
  - Bauhaus versioning rules — knowledge/governance/versioning.md
  - Bauhaus rulebook — knowledge/governance/rulebook.md
  - Bauhaus visual regression — knowledge/tooling/visual-regression.md
  - Bauhaus plain-language rules — knowledge/taxonomy/plain-language.md
---

# Normalisation

> Tidying a house you live in is done room by room, never all at once. You decide what to keep, what to move, what to throw out. You do one room, check that nothing broke, then start the next. Normalisation is the plan for that tidy-up. It says what happens to each value, component and pattern, in what order, in batches small enough to check.

Phase 8 of the analyser (`normalise.mjs plan`) turns the artifacts of phases 3 to 7 into `08-normalisation.json` and `08-plan.md`. Phase 9 applies it, one approved batch at a time. This file says which action fits which finding, how to rank and batch the work, and how to explain it to people who do not design.

## Rules

1. Give every value, component and pattern exactly one action from the list of nine. (§ Actions. An item with no action is a hidden decision.)
2. State the delta of every `snap`, `alias` and `merge`: pixels, ΔE or call sites. (`docs/analysis.md` § Rules.)
3. Rank by usage × severity ÷ effort. (§ Prioritisation.)
4. Batch by layer first, then by folder. Order the layers foundation, token, component, pattern, docs. (`workflow.md` § Why this order.)
5. Keep a batch reviewable: about 400 changed lines or 20 files, whichever comes first. Split larger ones. (House size. A reviewer cannot judge more in one pass. `contribution.md` rule 8: one change, one layer.)
6. Deprecate before you delete. Keep an alias for one release cycle at least. (`knowledge/governance/versioning.md`.)
7. Pair every batch with a ratchet on its debt count. (`knowledge/governance/rulebook.md` § Ratchets.)
8. Snapshot before and after every batch that can change pixels. (`knowledge/tooling/visual-regression.md`.)
9. Give every batch a rollback: a single revert that restores the state before it. (A batch that cannot be undone is not reviewable.)
10. Write each finding in two registers, plain first, precise second. (`knowledge/taxonomy/plain-language.md`.)
11. Cap findings at ten per layer, ranked by severity. State how many were cut. (`docs/architecture.md` § Reports.)

## Actions

| Action | Applies to | Use when | Delta to state |
|---|---|---|---|
| **keep** | value, component, pattern | It is on the scale, or shared and sound. Nothing to do. | none |
| **snap** | value | A literal is near a scale step. Replace it with the token. | px or ΔE |
| **alias** | value, token, component | The old name must keep working while callers move. The old points to the new. | none, or the snap delta |
| **merge** | component | Near-duplicates exist. One keeper absorbs the rest. | call sites, and visible difference |
| **promote** | value, component | An off-scale value with 2 or more uses becomes a step. A local component with a second folder of use becomes a component. | uses or folders |
| **demote** | component | A "component" is used once, or names a business object. It leaves the library. | call sites |
| **deprecate** | token, component, prop | A replacement exists and callers remain. Mark it, do not remove it. | call sites left |
| **document** | component, pattern | It is sound and reused but has no page. Write its page. | none |
| **drop** | value, component | It has no callers, or it is a one-off with no need. Delete it. | call sites (0) |

How to choose:

1. Is it unused? `drop`.
2. Is it a value on or near a step, within the snap limit? `snap`. The snap limit is 1px or ΔE 2.3. Beyond that, ask the user.
3. Is it an off-scale value used 2 or more times? `promote` to a step, or `snap` all uses. Ask the user. (`scale-inference.md` § Overriding.)
4. Is it one of a duplicate group? `merge`, keeper chosen by `component-mining.md` § Choosing the keeper.
5. Does a replacement exist and do callers remain? `deprecate`, with an `alias`.
6. Is it a business component in the library, or used once? `demote`.
7. Is it good and undocumented? `document`.
8. Otherwise `keep`.

Snap limits are house values. A larger delta is a design decision. Put it to the user with its cost.

## Deltas and visual risk

| Delta | Risk | Action |
|---|---|---|
| 0 px, ΔE 0 to 2.3 | None visible | Batch freely |
| 1 px, ΔE 2.3 to 5 | Low | Batch. Snapshot |
| 2 to 4 px, ΔE 5 to 10 | Medium | Own batch. Snapshot. Screenshot review |
| Above 4 px, ΔE above 10 | High | Ask the user per item. Never bundle |
| Any drop in a WCAG A or AA duty | Blocker | Refuse, or fix the target first |

(Bands are house reading aids. The 2.3 figure is the usual just-noticeable difference for ΔE CIE76. See `scale-inference.md`.)

For a text-size or spacing snap, say what shifts: "every heading below this row moves down 1px". Deltas add up. Eight snaps of 1px in one stack can shift a layout by 8px. State the stack total.

## Prioritisation

Score each item:

```
priority = usage × severity ÷ effort
```

| Term | Scale |
|---|---|
| usage | Number of call sites (or uses). Use the real count. |
| severity | HIGH 3, MEDIUM 2, LOW 1. (`UBIQUITOUS-LANGUAGE.md` § Severity.) |
| effort | S 1, M 2, L 4. |

Rules for the score:

1. A `HIGH` severity item (breaks WCAG A or AA, blocks a user) goes first, whatever its score. (Access before tidiness.)
2. Break ties by layer order: foundation before token before component before pattern.
3. Show the score in the plan next to the inputs. A score with no inputs cannot be checked.

## Batching

1. **By layer first.** One batch holds one layer. (`contribution.md` rule 8.)
2. **Then by folder.** Group the layer's items by folder so one reviewer knows the area.
3. **Then by size.** Split at the size limit. Name batches `b1`, `b2`… in apply order.
4. **Put safe work first.** In one layer, no-delta snaps go before delta snaps.
5. **Give each batch:** id, layer, title, item count, file count, risk, effort and the skill that applies it. (`docs/analysis.md` § `08-normalisation.json`.)

Suggested batch skeleton:

| Batch | Layer | Skill | Content |
|---|---|---|---|
| b1 | foundation | `/bauhaus:foundation` | Accept the scales. Publish each foundation page |
| b2 | token | `/bauhaus:tokens` | Write the token source. Alias old custom properties |
| b3 to bn | token → component | `/bauhaus:tokens`, `/bauhaus:component` | Snap literals by folder. Merge duplicates one group at a time |
| next | component | `/bauhaus:states` | Fill missing state cells |
| next | pattern | `/bauhaus:pattern` | Document and align patterns |
| last | docs | `/bauhaus:styleguide`, `/bauhaus:storybook` | Resync the prose. Add the pages |

## Deprecation with aliases

1. Add the new token or component. Ship it first. (`versioning.md`.)
2. Keep the old name as an alias that points to the new one. Callers keep working.
3. Mark the old one deprecated, with the replacement and a date or release. Use the notice template in `versioning.md`.
4. Migrate callers in batches. Count remaining callers after each one.
5. Delete the old name only when its count is 0 and one release cycle has passed.

A merge of components follows the same path: the merged member becomes a thin wrapper that renders the keeper, marked deprecated, until its call sites reach 0.

## Codemods

1. Write a codemod when a batch replaces the same pattern in 10 or more places. (`versioning.md` § Codemods. Below that, edit by hand.)
2. Make it idempotent. A second run changes nothing.
3. Run it in dry mode first. Read the diff summary.
4. Run it on one folder. Snapshot. Then widen.
5. Never run a codemod across layers in one pass.

Typical codemods: replace a literal with a `var(--token)`, rename a prop, swap an import for the keeper.

## Ratchets

1. Add one ratchet per debt family: raw colour literals, raw spacing literals, deprecated components in use, components with no page. (`rulebook.md` § Ratchets.)
2. Set the number to today's count at the start of phase 9.
3. Lower it in the same change that fixes debt. A drop with no lowered number fails, and so does a rise.
4. List today's failures as known violations, one advisory each. Do not fail the build on day one. (`rulebook.md` § Known violations.)

## Visual regression per batch

1. Take snapshots before the batch, on the states the batch touches. (`visual-regression.md` § What to snapshot.)
2. Apply the batch.
3. Compare. A diff on a `snap` with delta 0 is a bug. A diff on a `snap` with a stated delta must match it.
4. Attach the diff summary to the gate question. The user approves with the evidence in view.
5. Where no snapshot tool exists, list the screens to check by hand. Say the limit.

## Rollback

1. Each batch is one commit or one reviewable change set. (Rule 9.)
2. The log in `09-build.md` records the batch id and its revert reference.
3. On a failed check, revert the batch. Do not patch forward. Then re-plan the item.
4. A reverted batch keeps its ratchet number as before.

## Presenting the plan in plain words

Follow `knowledge/taxonomy/plain-language.md`. Say the plain line, then the precise line.

Template for one finding:

```
Plain:   We use 14 shades of grey where 6 would do. Picking 6 makes the product look calmer
         and makes future changes cheaper. People will not see a difference at a glance.
Precise: 14 grey literals cluster into 6 (ΔE ≤ 2.3). Snap to color.gray.100 to .900.
         212 uses, 41 files, 3 batches. Effort M. Risk low. Basis: none needed for the merge;
         contrast pairs stay at or above WCAG 1.4.3 (AA).
```

Rules for plain wording:

1. One idea per sentence. Give one everyday analogy per layer. (`plain-language.md` § Analogies.)
2. Say what the user sees before what the code does.
3. State cost as files, hours-of-review size (S, M, L) and risk, not as jargon.
4. Say what stays the same. People fear change more than cost.
5. Avoid "token", "ratchet", "alias" without a first-use gloss. Use the glossary in `plain-language.md`.

## Why

- Layer-first batching follows the dependency of the layers. A component merged before its tokens exist carries raw values again.
- Small batches make review and rollback cheap. Large batches get skimmed.
- Aliases keep the product working while callers move. Deleting first breaks builds. (`versioning.md`.)
- A ratchet turns progress into a number that cannot slip back. (`rulebook.md`.)
- Stating a delta lets the user weigh a visible change against its benefit. A silent merge removes that choice.

## Rulebook seeds

- `analysis.plan.one-action` · auto · MEDIUM · Every planned item has exactly one of the nine actions.
- `analysis.plan.delta-stated` · auto · HIGH · Every snap, alias and merge states its delta.
- `analysis.plan.batch-size` · auto · MEDIUM · No batch exceeds the size limit.
- `analysis.plan.ratchet-per-batch` · review · MEDIUM · Every batch names its ratchet.
- `analysis.plan.rollback` · review · MEDIUM · Every batch names its revert.
- `analysis.plan.two-registers` · review · LOW · Every finding has a plain line and a precise line.

## Misfiles

- A token added in a pattern batch: `misfile.pattern-own-style`. Move it to the token batch.
- A delete with no alias period: breaks callers. Use `deprecate`.
- A batch that mixes a scale change and a component merge: split by layer. (`contribution.md` rule 8.)

## See also

- [workflow.md](workflow.md)
- [scale-inference.md](scale-inference.md)
- [component-mining.md](component-mining.md)
- [pattern-mining.md](pattern-mining.md)
- [../governance/versioning.md](../governance/versioning.md)
- [../governance/rulebook.md](../governance/rulebook.md)
- [../governance/contribution.md](../governance/contribution.md)
- [../tooling/visual-regression.md](../tooling/visual-regression.md)
- [../taxonomy/plain-language.md](../taxonomy/plain-language.md)
