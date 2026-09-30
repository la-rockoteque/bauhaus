---
id: analysis/workflow
title: The analyser workflow — nine phases
shelf: analysis
layer: cross-cutting
owner: design-system-architect
tags: [analysis, workflow, phases, gates, resume, scope, vorkurs]
sources:
  - Bauhaus architecture contract — docs/architecture.md
  - The analyser contract — docs/analysis.md
  - Bauhaus Vorkurs — knowledge/bauhaus/principles.md
  - Vince Speelman, "The Nine States of Design", 2015 — https://medium.com/swlh/the-nine-states-of-design-5bfe9b3d6d85
---

# The analyser workflow

> Think of a builder who inherits a house with no plans. First she measures every wall. Then she works out which measures the builder meant to use. Then she names the standard parts. Only then does she draw the plans and change anything. The analyser works the same way. It reads the code, infers the system that is already there, shows it to the team, and edits nothing until the team says yes.

`/bauhaus:analyse` takes a repo with no design system (DSM) to a full one in nine phases. Scripts count. Agents judge. The user approves at each gate. The contract for artifacts and scripts is `docs/analysis.md`. This file says why the order is fixed and how to run it well.

## Rules

1. Run the phases in order. Never start a phase before the artifacts of the phase before it exist. (Each phase reads the previous one: tokens need a scale, components need tokens, patterns need components. See § Why this order.)
2. Read and infer in phases 1 to 8. Edit source in phase 9 only. (A wrong inference costs nothing until code changes.)
3. Put one gate after every phase that makes a decision: 1, 3, 4, 5, 6, 8 and each batch of 9. Ask one focused question with 2 to 4 options and state the cost. (`knowledge/governance/contribution.md`: propose before you populate.)
4. Let scripts count and agents judge. An agent never counts by eye what a script can count. A script never decides a name or a merge. (Counts are reproducible. Judgement needs the user's product context.)
5. Derive progress from the artifacts on disk. Keep no state file. (A state file drifts from the files. The files do not.)
6. Redo a phase by deleting its artifacts and running it again. Delete the later phases' artifacts too, because they were built on the old ones. (Downstream artifacts stale silently otherwise.)
7. Weight every inference by usage. A value used 40 times outranks a value used once. (`knowledge/analysis/scale-inference.md`.)
8. Promote nothing that occurs once. One-offs are outliers. (`knowledge/governance/contribution.md`: two or more occurrences.)
9. State the delta for every merge or snap: pixels, ΔE or call sites. (A silent merge changes the product's look with no record.)
10. Every report carries a `## States` summary and uses the four layers. (`docs/analysis.md` § Rules.)
11. Write plain words first, precise words second, at every gate. (`knowledge/taxonomy/plain-language.md`.)

## The nine phases

| # | Phase | Layer it works on | Done when | Gate |
|---|---|---|---|---|
| 1 | Scope | none | `01-scope.json` and `01-scope.md` exist. The user confirmed the root folder, the stack and who uses the product. | Confirm scope and users |
| 2 | Values | foundation (raw) | `02-values/` holds the inventory, the custom properties and the draft tokens. The totals are stated. | none |
| 3 | Foundations | foundation | `03-foundations.json` and `.md` exist. Every family has an accepted scale or an explicit "hand-tuned". | One question per foundation |
| 4 | Tokens | token | `04-tokens/` builds and passes `tokens.mjs check`. Names are accepted. | Accept token set and names |
| 5 | Components | component | `05-components.json` and `.md` exist. Every group has a keeper or a "keep both" reason. | Accept component candidates and merges |
| 6 | Patterns | pattern | `06-patterns.json` and `.md` exist. Every accepted candidate names its user need. | Accept pattern candidates |
| 7 | Classification | all four | `07-classification.md` classifies every finding and lists misfiles by id. | none |
| 8 | Normalisation | all four | `08-normalisation.json` and `08-plan.md` exist. The plan has batches, each of reviewable size. | Accept the plan and its first batch |
| 9 | Build-up | all four | `09-build.md` logs each batch as applied, skipped or rolled back. | One gate per batch |

### What "done" means per phase

- **Scope.** Root, stack, file counts, ignored folders and the users are written down. The scope is small enough to finish. (See § Cutting scope.)
- **Values.** The totals are stated: files, distinct values, custom properties. Values in generated or vendored folders are out.
- **Foundations.** Each family has a base, a step list, a `fit` and its outliers. `fit` below 0.6 means the code follows no scale. Say so. Do not force one. (`scale-inference.md`.)
- **Tokens.** Tier 1 holds scale steps. Tier 2 holds intents. No name carries a raw value. The set builds.
- **Components.** Each component has a location (`shared` or `local`), a usage count and a state summary. Groups of near-duplicates are resolved or parked.
- **Patterns.** Each candidate has support of 2 or more and answers a named user need. A candidate that adds a value goes back to phase 3 or 4.
- **Classification.** Nothing is unclassified. Misfiles carry a `misfile.<slug>` id or "unlisted".
- **Normalisation.** Every value, component and pattern has one action. Every batch has a layer, a size, a risk and an effort.
- **Build-up.** Every batch has a result and a note. The ratchet counts match the repo.

## Why this order

The order is not a preference. Each layer consumes the one before it. (`knowledge/taxonomy/layers.md`.)

1. **Foundations first.** A token is one member of a scale. With no scale, a token is an arbitrary number. (`knowledge/governance/contribution.md`: a token with no scale is an arbitrary number.)
2. **Tokens second.** A component uses semantic tokens. With no tokens, a merged Button would carry raw values again. (`knowledge/tokens/architecture.md`.)
3. **Components third.** A pattern composes components. With no components, a pattern is a page. (`knowledge/taxonomy/decision-tree.md`, Q4.)
4. **Patterns fourth.** A pattern adds no value of its own. It needs the three layers below to exist. (`misfile.pattern-own-style`, `misfile.pattern-own-spacing`.)
5. **Docs last.** A page documents what exists. (`knowledge/governance/page-contract.md`.)

The same order is the Bauhaus one. Itten's Vorkurs taught material, form and colour before any student entered a workshop. The foundations are the Vorkurs. The components are the workshops. (`knowledge/bauhaus/principles.md` § The Vorkurs.)

Scripts run early. Agents judge late. Phase 2 reads no meaning: it counts. Phase 3 asks what the counts mean. Phase 5 asks what a component is for. Meaning needs the layers below it.

## Gates

A gate is one `AskUserQuestion`. It has 2 to 4 options. Each option states its cost in files, call sites or pixels.

| Element | Content |
|---|---|
| Plain line | One sentence with an everyday analogy. |
| Evidence | The count, the fit or the delta that supports the proposal. |
| Options | 2 to 4. The first is the recommended one. Each has a cost. |
| Default | The option that changes the least. |

Gate rules:

1. Ask one question at a time. (Two questions in one gate get half an answer.)
2. Never gate on a fact a script can settle. Gate on a choice. (A gate costs the user's time.)
3. Record the answer in the phase's `.md` report under `## Decisions`. (The next session reads it on resume.)
4. Treat "skip" as an answer. Record it. Do not ask again in the same run.

## How to resume

1. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/analyse.mjs status`. It lists each phase as `done`, `partial` or `missing`, from the artifacts on disk.
2. Resume at the first phase that is not `done`.
3. Read that phase's predecessors' `.md` reports, including `## Decisions`. Do not ask an answered question again.
4. If the repo changed since the artifacts were written, say so. Offer to redo from the earliest affected phase. (A stale inventory gives a stale plan.)
5. To redo phase `n`, delete the artifacts of phases `n` to 8. Keep `09-build.md`: it records what already landed. (Phase 9 edits source. Deleting its log loses history.)

## Cutting scope for a big repo

A repo with thousands of files gives an inventory too big to judge. Cut it.

1. **Pick one app or one folder first.** In a monorepo, pick the app with the most users, or the most shared code. (Most shared code gives the most reuse to find.)
2. **Run all nine phases on it.** Do not run phases 1 to 4 on the whole repo and phases 5 to 9 on a part. (Half-done layers give a plan nobody can apply.)
3. **Keep vendored and generated code out.** `analyse.mjs init` lists ignored folders. Check the list. (Code the team does not own cannot be normalised.)
4. **Widen in steps.** After phase 9 on the first scope, run `--scope <next-dir>`. Reuse the accepted foundations and tokens. Only new values and new components need new decisions. (The scale is a repo-wide decision. It should not be remade per folder.)
5. **Split a shared package out.** If the repo has a UI package, analyse it as its own scope. Its exports are the component candidates.
6. **Record the scope in `01-scope.md`.** A later reader must know what the plan does not cover.

A scope is right when phase 8 gives a plan of 3 to 8 batches. More means the scope is too wide.

## What the analyser will not do

- It does not redesign. It records the system the code already follows and proposes the smallest move to a coherent one. (Form follows function: `knowledge/bauhaus/principles.md`.)
- It does not judge visual taste. It measures fit, delta and usage.
- It does not rename business concepts. A "Card" that is a business view goes to the product, not the library. (`knowledge/analysis/component-mining.md`.)

## Why

- Foundations before tokens before components follows the dependency of the layers in `knowledge/taxonomy/layers.md`. Reversing it makes each later layer carry the earlier layer's missing decisions as raw values.
- Read-only phases make a wrong guess free. Phase 9 is where risk starts, so it is the only phase with one gate per batch.
- No state file means resume cannot lie. Progress is what exists.
- A small first scope gives a finished loop. A finished loop teaches the team the process before the whole repo depends on it.

## Rulebook seeds

- `analysis.order.no-skip` · review · HIGH · No phase starts before the artifacts of the previous phase exist.
- `analysis.source.read-only-until-9` · auto · HIGH · Phases 1 to 8 change no file outside `.bauhaus/`.
- `analysis.gate.one-question` · review · MEDIUM · Each gate asks one question with 2 to 4 options and costs stated.
- `analysis.report.states` · auto · LOW · Every phase report has a `## States` section.

## Misfiles

- A token proposal made before the foundation is accepted: belongs to phase 3. (`misfile.token-without-foundation`.)
- A pattern candidate that carries its own spacing: send back to phase 3 or 4. (`misfile.pattern-own-spacing`.)
- A plan item that edits source during analysis: belongs to phase 9.

## See also

- [scale-inference.md](scale-inference.md)
- [component-mining.md](component-mining.md)
- [pattern-mining.md](pattern-mining.md)
- [normalisation.md](normalisation.md)
- [../bauhaus/principles.md](../bauhaus/principles.md)
- [../taxonomy/layers.md](../taxonomy/layers.md)
- [../governance/maturity.md](../governance/maturity.md)
